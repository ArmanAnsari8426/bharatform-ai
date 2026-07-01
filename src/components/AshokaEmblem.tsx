// Ashoka Lion Capital — Official State Emblem of India
// Uses AI-generated asset stored in /public/ashoka-emblem.png

export default function AshokaEmblem({
  className = "h-12 w-auto",
  showMotto = false,
}: {
  className?: string;
  showMotto?: boolean;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <img
        src="/ashoka-emblem.png"
        alt="State Emblem of India · Ashoka Stambh"
        className="h-full w-full object-contain drop-shadow-md"
        loading="lazy"
      />
      {showMotto && (
        <span className="sr-only">सत्यमेव जयते · Truth alone triumphs</span>
      )}
    </span>
  );
}
