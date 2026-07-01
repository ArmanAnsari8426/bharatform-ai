// Indian National Flag — inline SVG (since the india.gov.in URL CORS-blocks external embeds)
// Faithfully recreated tiranga with 24-spoke Ashoka Chakra

export default function IndiaFlag({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 90 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Flag of India"
    >
      {/* Saffron stripe */}
      <rect x="0" y="0" width="90" height="20" fill="#FF9933" />
      {/* White stripe */}
      <rect x="0" y="20" width="90" height="20" fill="#FFFFFF" />
      {/* India Green stripe */}
      <rect x="0" y="40" width="90" height="20" fill="#138808" />

      {/* Ashoka Chakra */}
      <g transform="translate(45 30)">
        {animated && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="20s"
            repeatCount="indefinite"
            additive="sum"
          />
        )}
        <circle r="8" fill="none" stroke="#0A4D04" strokeWidth="0.7" />
        <circle r="1.2" fill="#0A4D04" />
        {/* 24 spokes */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x = Math.cos(angle) * 7.5;
          const y = Math.sin(angle) * 7.5;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke="#0A4D04"
              strokeWidth="0.45"
              strokeLinecap="round"
            />
          );
        })}
        {/* Spoke dot caps */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x = Math.cos(angle) * 7.5;
          const y = Math.sin(angle) * 7.5;
          return <circle key={`d-${i}`} cx={x} cy={y} r="0.35" fill="#0A4D04" />;
        })}
      </g>
    </svg>
  );
}

// Waving flag effect variant for hero
export function IndiaFlagWaving({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <defs>
          <pattern id="wave" x="0" y="0" width="90" height="60" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="90" height="20" fill="#FF9933" />
            <rect x="0" y="20" width="90" height="20" fill="#FFFFFF" />
            <rect x="0" y="40" width="90" height="20" fill="#138808" />
          </pattern>
        </defs>
        <rect width="90" height="60" fill="url(#wave)">
          <animate attributeName="x" from="0" to="-2" dur="2s" repeatCount="indefinite" />
        </rect>
        <g transform="translate(45 30)">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="40s" repeatCount="indefinite" additive="sum" />
          <circle r="8" fill="none" stroke="#0A4D04" strokeWidth="0.7" />
          <circle r="1.2" fill="#0A4D04" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x = Math.cos(angle) * 7.5;
            const y = Math.sin(angle) * 7.5;
            return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#0A4D04" strokeWidth="0.45" strokeLinecap="round" />;
          })}
        </g>
      </svg>
    </div>
  );
}
