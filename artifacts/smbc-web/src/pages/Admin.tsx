import React, { useState, useEffect } from "react";
import logoImg from "@assets/1000028986-removebg-preview_1778702553456.png";
import { fetchLeads, type Lead } from "@/lib/supabase";
import {
  getAdminLockoutState,
  recordFailedAdminAttempt,
  clearAdminLockout,
} from "@/lib/security";

function formatMs(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
}

// Admin password comes from a Vite env variable — set in Vercel dashboard or .env
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockoutMs, setLockoutMs] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // Live lockout countdown
  useEffect(() => {
    const { locked, remainingMs, attempts } = getAdminLockoutState();
    if (locked) {
      setLockoutMs(remainingMs);
      setAttemptsLeft(0);
    } else {
      setAttemptsLeft(5 - attempts);
    }
    if (!locked) return;

    const interval = setInterval(() => {
      const state = getAdminLockoutState();
      if (!state.locked) {
        setLockoutMs(0);
        setAttemptsLeft(5);
        clearInterval(interval);
      } else {
        setLockoutMs(state.remainingMs);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockState = getAdminLockoutState();
    if (lockState.locked) {
      setError(`Too many failed attempts. Try again in ${formatMs(lockState.remainingMs)}.`);
      return;
    }

    setIsLoading(true);
    setError("");

    // Validate password client-side against VITE_ADMIN_PASSWORD
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      const { locked, attemptsLeft: left } = recordFailedAdminAttempt();
      if (locked) {
        setLockoutMs(15 * 60 * 1000);
        setAttemptsLeft(0);
        setError("Access locked for 15 minutes due to too many failed attempts.");
      } else {
        setAttemptsLeft(left);
        setError(`Access denied. ${left} attempt${left === 1 ? "" : "s"} remaining.`);
      }
      setIsLoading(false);
      return;
    }

    // Password correct — fetch leads from Supabase directly
    try {
      const data = await fetchLeads();
      clearAdminLockout();
      setLeads(data);
      setIsAuthenticated(true);
    } catch {
      setError("Unable to load data. Check your Supabase configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setPassword("");
    setIsAuthenticated(false);
    setLeads([]);
    setError("");
  };

  const exportCSV = () => {
    const header = "Contact,Status,Source,Date Joined";
    const rows = leads.map((l) => {
      const date = new Date(l.created_at).toLocaleString("en-US");
      const safe = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
      return [safe(l.contact_info), safe(l.status), safe(l.source_page), safe(date)].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smbc-leads-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLocked = lockoutMs > 0;

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full shadow-xl p-8 md:p-12 text-center rounded-sm">
          <img src={logoImg} alt="SMBC Logo" className="w-24 h-auto mx-auto mb-6 object-contain" />
          <h1 className="font-serif text-[#1E3A8A] text-2xl font-bold mb-1">Admin Access</h1>
          <p className="font-sans text-gray-500 text-sm mb-8">Sitti Medical and Business College</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                autoComplete="current-password"
                className="w-full border-2 border-gray-100 p-3 font-sans focus:outline-none focus:border-[#D4AF37] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs font-sans mt-2 text-left">{error}</p>
              )}
              {isLocked && (
                <p className="text-amber-600 text-xs font-sans mt-2 text-left">
                  Locked — try again in {formatMs(lockoutMs)}
                </p>
              )}
              {!isLocked && attemptsLeft < 5 && attemptsLeft > 0 && (
                <p className="text-gray-400 text-xs font-sans mt-2 text-left">
                  {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} remaining before lockout.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || isLocked}
              className="w-full bg-[#1E3A8A] text-white py-3 font-sans text-sm tracking-wider uppercase font-medium hover:bg-[#152a66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const todayCount = leads.filter((l) => {
    const today = new Date().toISOString().split("T")[0];
    return l.created_at.startsWith(today);
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoImg} alt="SMBC Logo" className="w-12 h-auto" />
          <h1 className="font-serif text-[#1E3A8A] text-xl font-bold">Admissions Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-[#1E3A8A] font-sans text-sm transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Leads</p>
              <p className="text-3xl font-serif font-bold text-[#1E3A8A]">{leads.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Today</p>
              <p className="text-3xl font-serif font-bold text-[#D4AF37]">{todayCount}</p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="bg-[#D4AF37] text-white px-6 py-2 text-sm uppercase tracking-wider font-medium hover:bg-[#c3a033] transition-colors disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 font-sans">
                No leads yet. Share the admissions page to start collecting interest.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">#</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Contact Info</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead, i) => {
                    const formattedDate = new Intl.DateTimeFormat("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "numeric", minute: "numeric",
                    }).format(new Date(lead.created_at));

                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{lead.contact_info}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            lead.status === "priority_waitlist"
                              ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {lead.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{formattedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
