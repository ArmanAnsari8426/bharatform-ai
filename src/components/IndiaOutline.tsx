// REAL India map - uses the AI-generated accurate geographic outline as image
// Plus state markers positioned over it

// Real-world approximate lat/lng mapped to a 1000x1000 viewBox
// Based on geographic centroids of each state
export const STATE_REGIONS: Record<string, { x: number; y: number; r: number }> = {
  JK: { x: 320, y: 100, r: 32 },     // Jammu & Kashmir (top)
  LA: { x: 410, y: 110, r: 28 },     // Ladakh
  HP: { x: 380, y: 180, r: 20 },     // Himachal
  PB: { x: 340, y: 220, r: 18 },     // Punjab
  CH: { x: 360, y: 235, r: 8 },      // Chandigarh
  UK: { x: 430, y: 215, r: 20 },     // Uttarakhand
  HR: { x: 365, y: 260, r: 18 },     // Haryana
  DL: { x: 380, y: 275, r: 11 },     // Delhi
  RJ: { x: 285, y: 320, r: 38 },     // Rajasthan
  UP: { x: 460, y: 305, r: 38 },     // UP
  BR: { x: 570, y: 335, r: 26 },     // Bihar
  SK: { x: 600, y: 320, r: 11 },     // Sikkim
  AR: { x: 740, y: 305, r: 22 },     // Arunachal Pradesh
  AS: { x: 690, y: 345, r: 24 },     // Assam
  NL: { x: 745, y: 355, r: 14 },     // Nagaland
  ML: { x: 695, y: 390, r: 14 },     // Meghalaya
  MN: { x: 750, y: 395, r: 13 },     // Manipur
  MZ: { x: 730, y: 430, r: 13 },     // Mizoram
  TR: { x: 685, y: 425, r: 13 },     // Tripura
  WB: { x: 605, y: 400, r: 24 },     // West Bengal
  JH: { x: 555, y: 395, r: 22 },     // Jharkhand
  CT: { x: 485, y: 430, r: 26 },     // Chhattisgarh
  MP: { x: 385, y: 395, r: 36 },     // Madhya Pradesh
  GJ: { x: 215, y: 400, r: 32 },     // Gujarat
  DN: { x: 235, y: 460, r: 9 },      // Dadra
  MH: { x: 320, y: 490, r: 38 },     // Maharashtra
  TG: { x: 420, y: 535, r: 24 },     // Telangana
  AP: { x: 445, y: 605, r: 28 },     // AP
  OR: { x: 540, y: 470, r: 28 },     // Odisha
  KA: { x: 355, y: 625, r: 28 },     // Karnataka
  GA: { x: 305, y: 595, r: 11 },     // Goa
  TN: { x: 410, y: 700, r: 26 },     // Tamil Nadu
  KL: { x: 360, y: 705, r: 20 },     // Kerala
  PY: { x: 440, y: 675, r: 9 },      // Puducherry
  AN: { x: 720, y: 660, r: 18 },     // Andaman
  LD: { x: 235, y: 700, r: 13 },     // Lakshadweep
};

export const INDIA_VIEWBOX = "0 0 1000 1000";

/**
 * Real India map component using AI-generated accurate map image.
 * Children are positioned in the 1000x1000 SVG coordinate space and
 * overlay the map (heat circles, state markers, pins).
 */
export default function IndiaOutline({
  className = "",
  withMap = true,
  children,
}: {
  className?: string;
  withMap?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {withMap && (
        <img
          src="/india-map.png"
          alt="Map of India"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      )}
      <svg
        viewBox={INDIA_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </div>
  );
}
