# BharatForm AI

BharatForm AI is a React application that helps Indian citizens understand government forms, required documents, schemes, and common application mistakes. It includes a multilingual Bharat AI chat assistant and optional Gemini-powered form analysis.

## Features

- AI-assisted chat for forms, documents, schemes, scholarships, and public-service questions
- Form analysis for PDF and image uploads
- English, Hindi, Bengali, Tamil, Telugu, Marathi, and Urdu interfaces
- Email/password, email OTP, phone OTP, and Google sign-in flows
- Local browser authentication fallback when Supabase is not configured
- Optional Gemini and EmailJS integrations
- Admin dashboard and downloadable local data export

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- Framer Motion and Lucide icons
- Google Gemini REST API
- Supabase (optional)

## Run locally

### Prerequisites

- Node.js 20 or later
- npm

### Install and start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Environment variables

Create `.env.local` in the project root. Do not commit this file.

```env
# Optional: enables Gemini-powered chat and form analysis
VITE_GEMINI_API_KEY=your_google_ai_studio_key

# Optional: enables Supabase authentication and session syncing
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

# Optional: enables EmailJS email OTP delivery
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

If Supabase is not configured, accounts are stored in the browser for local/demo use. This is not a replacement for a production authentication backend.

## Gemini setup

1. Create an API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. Add it as `VITE_GEMINI_API_KEY` in `.env.local`, or connect it through the in-app API key modal.
3. Restart the development server after changing `.env.local`.

The app calls Gemini's `generateContent` endpoint with the `X-goog-api-key` header. Restrict keys in Google Cloud/AI Studio and never commit or paste a production key into source code.

> `VITE_` variables are bundled into client-side applications. For a production application, route Gemini calls through a server-side proxy and keep the secret there.

## Supabase setup

1. Create or select an active Supabase project.
2. Copy its project URL and publishable/anon key into `.env.local`.
3. Configure allowed redirect URLs and email/OAuth providers in the Supabase dashboard.
4. Create the `profiles` table if you want profile data to be persisted; the application treats it as best-effort.

See [README_BACKEND.md](README_BACKEND.md) and [README_LOGIN_SETUP.md](README_LOGIN_SETUP.md) for additional backend and login notes.

## Build

```bash
npm run build
npm run preview
```

The build output is written to `dist/`.

## Security notes

- Never commit `.env.local` or API keys.
- Rotate any key that has been shared publicly.
- Use a real backend, database policies, and a server-side AI proxy before handling production user data.
- Verify government-service advice against official sources before acting on it.

## License

This project is private unless a license is added by its owner.
