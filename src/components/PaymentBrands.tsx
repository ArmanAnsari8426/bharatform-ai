// Real-style payment brand SVG icons (inline, no external deps)

export function VisaLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#1A1F71" />
      <text x="32" y="17" fontFamily="Arial Black, sans-serif" fontSize="13" fontWeight="900"
        fill="white" textAnchor="middle" fontStyle="italic" letterSpacing="1">VISA</text>
    </svg>
  );
}

export function MastercardLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#16161D" />
      <circle cx="27" cy="12" r="7" fill="#EB001B" />
      <circle cx="37" cy="12" r="7" fill="#F79E1B" />
      <path d="M32 7 a7 7 0 0 1 0 10 a7 7 0 0 1 0 -10z" fill="#FF5F00" />
    </svg>
  );
}

export function RupayLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.5" />
      <text x="6" y="17" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#097DC6">Ru</text>
      <text x="22" y="17" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#138808">Pay</text>
      <rect x="44" y="6" width="3" height="12" fill="#FF9933" />
      <rect x="48" y="6" width="3" height="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.3" />
      <rect x="52" y="6" width="3" height="12" fill="#138808" />
    </svg>
  );
}

export function UpiLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="white" stroke="#0F172A" strokeWidth="0.5" />
      <text x="6" y="17" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#FF9933">U</text>
      <text x="14" y="17" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.3">P</text>
      <text x="22" y="17" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#138808">I</text>
      <text x="30" y="17" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="600" fill="#0F172A">»</text>
      <text x="36" y="14" fontFamily="Arial Black, sans-serif" fontSize="6" fontWeight="900" fill="#0F172A">UNIFIED</text>
      <text x="36" y="20" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="600" fill="#0F172A">PAYMENTS</text>
    </svg>
  );
}

export function GPayLogo({ className = "h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="white" stroke="#dadce0" strokeWidth="0.5" />
      <path fill="#4285F4" d="M16 12.27v3.91H14V6.55h3.42c.87 0 1.61.29 2.22.87.62.58.93 1.29.93 2.13s-.31 1.55-.93 2.13c-.6.58-1.34.86-2.22.86H16zM16 8.46v1.88h1.46c.41 0 .76-.14 1.04-.42.28-.27.42-.6.42-.96 0-.36-.14-.69-.42-.96-.28-.27-.63-.4-1.04-.4H16z" />
      <path fill="#EA4335" d="M22.5 16.18c-.62 0-1.13-.21-1.54-.62-.41-.41-.62-.92-.62-1.54s.21-1.13.62-1.54c.41-.41.92-.62 1.54-.62s1.13.21 1.54.62c.41.41.62.92.62 1.54s-.21 1.13-.62 1.54c-.41.41-.92.62-1.54.62z" />
      <path fill="#FBBC04" d="M30 11h-2.5v3.5c0 .55-.45 1-1 1s-1-.45-1-1V11H23v-1h2.5V7.5c0-.55.45-1 1-1s1 .45 1 1V10H30v1z" />
      <path fill="#34A853" d="M34 16.5c-.55 0-1-.45-1-1V7.5c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1z" />
      <text x="37" y="15" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="600" fill="#5F6368">Pay</text>
    </svg>
  );
}

export function PhonePeLogo({ className = "h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#5F259F" />
      <text x="32" y="16" fontFamily="Arial Black, sans-serif" fontSize="10" fontWeight="900"
        fill="white" textAnchor="middle">PhonePe</text>
    </svg>
  );
}

export function PaytmLogo({ className = "h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#00BAF2" />
      <text x="32" y="16" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900"
        fill="white" textAnchor="middle">Paytm</text>
    </svg>
  );
}

export function BhimLogo({ className = "h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="24" rx="4" fill="#F58220" />
      <text x="32" y="16" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900"
        fill="white" textAnchor="middle">BHIM</text>
    </svg>
  );
}

export function RazorpayLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2 L10 2 L7 9 L13 9 L7 18 L9 11 L3 11 Z" fill="#3395FF" />
      <text x="17" y="14" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#0D2666">Razorpay</text>
    </svg>
  );
}
