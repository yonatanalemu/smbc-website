import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isValidUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn(
    "[SMBC] Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

// Single shared client — null when env vars are absent (dev without .env)
export const supabase =
  isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Lead capture ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  contact_info: string;
  status: string;
  source_page: string;
  guide_sent: boolean;
  created_at: string;
}

/** Insert a single prospective-student lead. Throws on error. */
export async function insertLead(contactInfo: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("prospective_students_2026")
    .insert({ contact_info: contactInfo });
  if (error) throw error;
}

/**
 * Fetch all leads for the admin dashboard.
 * Requires an RLS SELECT policy on prospective_students_2026 (see DEPLOY.md).
 */
export async function fetchLeads(): Promise<Lead[]> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("prospective_students_2026")
    .select("id, contact_info, status, source_page, guide_sent, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Lead[];
}
