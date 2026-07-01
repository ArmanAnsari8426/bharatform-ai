# BharatForm AI — Admin Console Guide

## 🔐 Admin Access

**URL:** `/#admin` (e.g., `https://bharatform.ai/#admin`)

The admin console uses **email + password** authentication with two role levels.

---

## 👤 Default Admin Accounts

These accounts are seeded automatically on first visit to `/#admin`:

### 🛡️ Super Admin (Full Access)

| Field | Value |
|-------|-------|
| Email | `superadmin@bharatform.ai` |
| Password | `Bharat@1947` |
| Role | `super-admin` |
| Permissions | All tabs + Admin management + Clear data |

### 👨‍💼 Admin (Limited Access)

| Field | Value |
|-------|-------|
| Email | `admin@bharatform.ai` |
| Password | `Admin@2026` |
| Role | `admin` |
| Permissions | Overview, AI, Users, Feedback, Transactions, States, Security (read-only) |

> ⚠️ **Change these passwords immediately in production!**

---

## 📊 Admin Dashboard Features

### Overview
- Live stats: Users, Feedback count, Total Revenue (₹), AI Status
- Current user session info
- System health monitoring
- Recent feedback (last 3)
- Export full data as JSON
- Clear demo data (super-admin only)

### Gemini AI
- View masked API key
- AI module status (Vision, Chat, Structured output)
- Multi-language support (7 Indian languages)
- Project ID: `projects/564317797256`

### Users
Table of all signed-up users (Name, Email, Phone, Created date)

### Launch Feedback
Detailed table with **State**, **Role**, **Priority**, **Rating (⭐)**, and full feedback text

### Transactions
- All Razorpay-style payments
- Plan, Amount, Method (UPI/Card/Netbanking/Wallet), Status, Date

### State Heatmap
- All 28 states + 8 UTs
- Application counts, scheme counts, heat intensity
- Sorted by activity

### Admins (Super Admin only)
- Create new admin accounts (admin or super-admin)
- Reset passwords
- Delete admin accounts (root super_001 protected)
- View last-login timestamps

### Security Center
- Security controls overview
- Audit log
- Danger zone: Clear demo data

---

## 🔑 Gemini API Key Setup

The app uses your Gemini API key:

```


### How it's loaded

1. **Build-time** (preferred): Set in `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Runtime UI**: Users can connect their own key via the navbar "Connect AI" button — stored in `localStorage`.

3. **Fallback chain**: localStorage key → `.env.local` VITE_GEMINI_API_KEY → none (prompt user).

---

## 💳 Payment System

Powered by **Razorpay-style** UI in the **Pricing** section.

### Supported Methods
- **UPI**: GPay, PhonePe, Paytm, BHIM
- **Cards**: Visa, Mastercard, RuPay (with live card preview)
- **Net Banking**: HDFC, SBI, ICICI, Axis, Kotak, Yes Bank, PNB, Bank of Baroda
- **Wallets**: Paytm, Amazon Pay, MobiKwik, PhonePe

### Flow
1. User clicks plan CTA
2. If not signed in → opens Sign In modal
3. Free plan → instant activation
4. Paid plan → opens Razorpay-style PaymentModal
5. Method selection → details → processing (2.4s) → success
6. Transaction saved to admin dashboard
7. GST (18%) auto-calculated

---

## 🗺️ India Heat Map

Live state-by-state application heat map showing:
- **28 States** with intensity heat circles
- **8 Union Territories**
- Hover tooltips with applications/schemes/heat %
- Searchable & filterable state list (All / States / UTs)
- Pulsing circles for top-activity states
- Color gradient: light yellow → orange → red

Section appears between AnalyzeCTA and ReadinessChecker.

---

## 🇮🇳 Visual Identity

### Ashoka Lion Capital Emblem
- Used in: Hero (top center), Launch background (watermark), Admin login
- File: `/public/ashoka-emblem.png`
- Always paired with **सत्यमेव जयते** motto

### Indian National Flag
- Tiranga SVG component: `/src/components/IndiaFlag.tsx`
- Used throughout: Navbar utility bar, Hero badges, Footer, Pulse ticker
- Animated waving variant in Launch & Hero sections

### Launch Section Background
- Scrolling state names (28 states + Hindi names) as background
- Ashoka emblem watermark (left + right corners)
- Floating saffron particles
- Tricolor top border

---

## 📝 Launch Supporter Form

The launch page now collects:
- **Name** (required)
- **State** (required, auto-detected via locale/timezone, with all 36 states/UTs dropdown)
- **Role** (Student, Parent, Teacher/NGO, CSC/Cyber cafe, Government aspirant, Farmer, Senior citizen, Other)
- **Top priority to improve** (8 specific options)
- **Rating** (1-5 ⭐)
- **Detailed feedback** (required)

All submissions saved to `localStorage` key: `bf-launch-supporters` and shown in admin dashboard.

---

## 🔔 Government Pulse

Click "View all" on the top ticker to open the full **Pulse Modal**:
- 16+ live updates (NEW, DEADLINE, UPDATE)
- Search by keyword
- Filter by type (All / New / Deadlines / Updates)
- Filter by 12 categories (Education, Healthcare, Identity, etc.)
- Sorted by days-left
- Direct links to official portals
- Authority badges (UIDAI, MoE, MoRTH, etc.)

---

## 🚀 Production Migration Checklist

Before going live:

- [ ] **Move Gemini API key to backend** — don't expose in browser bundle
- [ ] **Replace localStorage auth with NextAuth/Supabase/Auth0**
- [ ] **SMS gateway** for real OTP (currently demo-mode shows OTP in toast)
- [ ] **Email gateway** for email OTP
- [ ] **PostgreSQL** for users, feedback, transactions
- [ ] **Razorpay live integration** (replace simulated payment flow)
- [ ] **Change default admin passwords**
- [ ] **Role-based API permissions** on backend
- [ ] **Rate limiting** on auth endpoints
- [ ] **File upload virus scanning**
- [ ] **CSRF protection**
- [ ] **HTTPS-only cookies for sessions**

---

## 🆘 Support

- Admin email: `superadmin@bharatform.ai`
- Helpline: `14400` (shown on top utility bar)
- WhatsApp Support: Footer link

---

## 📂 Key Files

| Path | Purpose |
|------|---------|
| `src/lib/adminAuth.ts` | Admin email/password auth (SHA-256) |
| `src/lib/auth.ts` | User auth (email/password + OTP) |
| `src/lib/gemini.ts` | Gemini API client (Vision + Chat) |
| `src/lib/states.ts` | All 36 Indian states + UTs data |
| `src/components/AdminDashboard.tsx` | Full admin console |
| `src/components/AshokaEmblem.tsx` | State Emblem component |
| `src/components/IndiaFlag.tsx` | Tricolor SVG components |
| `src/components/IndiaHeatMap.tsx` | Live state heat map |
| `src/components/IndiaMap.tsx` | Decorative India map |
| `src/components/PaymentModal.tsx` | Razorpay-style payment |
| `src/components/PulseModal.tsx` | Government Pulse full view |
| `src/components/Launch.tsx` | Launch + supporter form |
| `public/ashoka-emblem.png` | Lion Capital image |
| `.env.local` | Gemini API key (gitignored) |

---

🇮🇳 **Made for India, by भारतीयों.**
