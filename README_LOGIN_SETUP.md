# 🔐 Google + Email OTP Login — Setup Guide

Your app now has **fully functional, real-time** Google and Email OTP login.
It works in two ways:

| Without setup (right now) | With setup (5 min) |
|---------------------------|--------------------|
| Email OTP shows on screen + auto-fills (instant testing) | **Real OTP emailed** to the user |
| Google = instant demo login | **Real Google account** login |

Everything already works for testing. To make it send **real emails** and use **real Google**, follow below.

---

## ✅ Option A — Real Email OTP (EmailJS, no backend, free)

This sends a **real email with the OTP code** directly from the browser.

1. Create a free account → **https://www.emailjs.com**
2. **Email Services** → Add Gmail/Outlook → copy the **Service ID**
3. **Email Templates** → Create template with these variables in the body:
   ```
   Your BharatForm AI verification code is: {{passcode}}
   Sent to: {{to_email}} at {{time}}
   ```
   → copy the **Template ID**
4. **Account → General** → copy your **Public Key**
5. Paste into `.env.local`:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
   ```
6. Rebuild. Now Email OTP sends a **real email**. 🎉

> If keys are missing, the OTP is shown on screen + auto-filled so testing still works.

---

## ✅ Option B — Real Google Login + Email OTP (Supabase, recommended)

Supabase gives real Google OAuth **and** managed email/SMS OTP **and** a database.

1. Create a project → **https://supabase.com** (pick Mumbai/Singapore region)
2. **Settings → API** → copy **Project URL** + **anon key** into `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. **SQL Editor** → run the file `supabase/schema.sql` (creates tables)
4. **Authentication → Providers**:
   - **Email** → toggle ON (email OTP works immediately)
   - **Google** → toggle ON → paste Google **Client ID + Secret**
     - Get them at https://console.cloud.google.com → APIs & Services → Credentials → OAuth Client (Web)
     - Add this **Authorized redirect URI**:
       `https://xxxxx.supabase.co/auth/v1/callback`
5. **Authentication → URL Configuration** → set **Site URL** to your deployed URL
6. Rebuild. Google + Email OTP are now fully live. 🎉

---

## 🔁 How the app decides which to use

```
Email OTP:
  Supabase configured?  → real Supabase email OTP
  else EmailJS configured? → real EmailJS email
  else → demo OTP (shown + auto-filled)

Google login:
  Supabase configured? → real Google OAuth redirect
  else → demo Google user (instant)
```

No code changes needed — just add the keys.

---

## 🧪 Test it now (no setup)
1. Open the site → **Sign In**
2. Tap **Email OTP** → enter your email → **Send OTP**
   - The 6-digit code appears and auto-fills → **Verify** → you're in ✅
3. Tap **Continue with Google** → instant demo login ✅

## 🧪 Test with real keys
1. Add EmailJS or Supabase keys to `.env.local` → rebuild
2. Email OTP now arrives in your inbox
3. Google opens the real Google consent screen

---

🇮🇳 BharatForm AI · Built & founded by **Arman Ansari**
