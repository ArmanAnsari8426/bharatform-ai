# 🔐 BharatForm AI — Backend & Full Auth Setup

This project now has a **real backend** powered by **Supabase** (PostgreSQL database + production auth).
It works in two modes automatically:

| Mode | When | What you get |
|------|------|--------------|
| **Live backend** | Supabase keys are set in `.env.local` | Real signups, real DB, email/SMS OTP, Google OAuth, sessions |
| **Local fallback** | No keys set | Browser-based demo auth (localStorage) so dev keeps working |

No code changes are needed to switch — just add your keys.

---

## ⚡ Why Supabase (not a Node/Express server)?

This app builds to a **static frontend** (`dist/index.html`). A static host can't run a Node server.
Supabase gives you a **real hosted backend** (Postgres + Auth + APIs) that a frontend talks to directly and securely — the industry standard for this setup. It's free to start.

---

## 🚀 Setup in 5 minutes

### 1. Create a Supabase project
- Go to **https://supabase.com** → Sign in → **New Project**
- Pick a name, password, and region (choose **Mumbai / Singapore** for India)

### 2. Get your API keys
- In the project: **Settings → API**
- Copy:
  - **Project URL** → `https://xxxxx.supabase.co`
  - **anon public key** → `eyJhbGc...`

### 3. Add keys to `.env.local`
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
```

### 4. Create the database tables
- In Supabase: **SQL Editor → New Query**
- Paste the contents of **`supabase/schema.sql`** and click **Run**
- This creates: `profiles`, `feedback`, `transactions`, `content` + security rules + auto-profile trigger

### 5. Enable auth providers
In Supabase → **Authentication → Providers**:
- ✅ **Email** — enable (password + email OTP work out of the box)
- ✅ **Phone** — enable + connect an SMS provider (Twilio / MSG91) for real OTP
- ✅ **Google** — enable + paste your Google OAuth Client ID & Secret
  - In **Authentication → URL Configuration**, set **Site URL** to your deployed URL

### 6. Restart the dev server / rebuild
The app auto-detects the keys and switches to the live backend. 🎉

---

## ✅ What now works with the real backend

| Feature | Local mode | Live (Supabase) mode |
|---------|-----------|----------------------|
| Sign up (email + password) | Browser only | ✅ Real account in Postgres |
| Sign in (email + password) | Browser only | ✅ Real session + JWT |
| Email OTP | Demo OTP shown on screen | ✅ Real OTP emailed |
| Phone OTP | Demo OTP shown on screen | ✅ Real SMS OTP (via Twilio/MSG91) |
| Google sign-in | Demo user | ✅ Real Google OAuth |
| Sessions | localStorage | ✅ Auto-refreshing JWT, 30-day |
| Sign out | Clears local | ✅ Revokes server session |

The **UI and flows are identical** — only the backend changes.

---

## 📂 Files added

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client + config detection |
| `src/lib/supabaseAuth.ts` | Real auth (signup, signin, OTP, OAuth, session sync) |
| `src/lib/auth.ts` | Hybrid layer — uses Supabase when live, else local fallback |
| `supabase/schema.sql` | Database tables, RLS policies, triggers |
| `.env.local` | Your keys (gitignored) |

---

## 🛡️ Security notes (production)
- The **anon key is safe** to expose in the frontend — Row Level Security (RLS) protects data.
- Never put the **service_role key** in frontend code.
- For admin writes, set a user's `profiles.role = 'admin'` in the Supabase table editor.
- Move the **Gemini API key** to a Supabase **Edge Function** for full security (optional, advanced).

---

## 🔎 How to verify it's live
- Open the site → Sign up with a real email.
- Check Supabase → **Authentication → Users** — your user appears.
- Check **Table Editor → profiles** — a profile row was auto-created.

---

🇮🇳 Built & founded by **Arman Ansari** · BharatForm AI
