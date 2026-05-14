# SMBC Website — Deployment Guide

No backend server required. The site is a pure Vite React app.
All data flows through Supabase directly from the browser.

---

## Architecture

```
Browser → Supabase (lead capture + admin reads)
Browser → /admin    (password-gated dashboard)
```

No Express server. No database connection from the app server.
The only infrastructure you need is a **Supabase project**.

---

## 1. Supabase Setup (do this once)

### a) Create a Supabase project
Go to https://supabase.com → New project

### b) Create the leads table
Run this in the Supabase **SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS prospective_students_2026 (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  contact_info TEXT NOT NULL,
  status       TEXT DEFAULT 'priority_waitlist',
  source_page  TEXT DEFAULT 'secure_your_future_overlay',
  guide_sent   BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### c) Set up Row Level Security
Still in the SQL Editor, run:

```sql
-- Enable RLS
ALTER TABLE prospective_students_2026 ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (the public form)
CREATE POLICY "allow_insert" ON prospective_students_2026
  FOR INSERT TO anon WITH CHECK (true);

-- Anyone with the anon key can SELECT (needed for the admin dashboard)
-- The VITE_ADMIN_PASSWORD env var gates the admin UI.
CREATE POLICY "allow_select" ON prospective_students_2026
  FOR SELECT TO anon USING (true);
```

### d) Get your API keys
Supabase Dashboard → Settings → API:
- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon / public key** → `VITE_SUPABASE_ANON_KEY`

---

## 2. Local Development

```bash
# 1. Install pnpm (if needed)
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_PASSWORD

# 4. Start the dev server
BASE_PATH=/ PORT=5173 pnpm --filter @workspace/smbc-web run dev
```

Open **http://localhost:5173** — the site is fully functional.
Admin panel: **http://localhost:5173/admin**

---

## 3. Deploy to Vercel

### a) Push to GitHub
```bash
git init
git add .
git commit -m "SMBC website"
git remote add origin https://github.com/your-username/smbc-website.git
git push -u origin main
```

### b) Import to Vercel
1. Go to https://vercel.com → **Add New → Project**
2. Click **Import** next to your GitHub repo
3. Vercel detects `vercel.json` automatically — no extra config needed

### c) Add environment variables
In the Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_ADMIN_PASSWORD` | A strong password for /admin |

### d) Click Deploy
Build takes ~2 minutes. Your site is live at `https://your-project.vercel.app`

---

## 4. Project Structure

```
artifacts/
  smbc-web/           ← The entire website (Vite + React)
    src/
      lib/supabase.ts ← All Supabase operations (insertLead, fetchLeads)
      lib/security.ts ← Sanitization, rate limiting, admin lockout
      sections/       ← Page sections (Hero, AcademicHub, etc.)
      pages/Admin.tsx ← Admin dashboard (Supabase-powered)
    public/           ← Static assets (PDF guide)
vercel.json           ← Vercel build config
.env.example          ← Environment variable template
```

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Data | Supabase (PostgreSQL + JS client) |
| Auth (admin) | VITE_ADMIN_PASSWORD env var + localStorage lockout |
| Routing | Wouter (client-side) |
| Hosting | Vercel (static + CDN) |
