// Indian states & UTs with coverage data for heat map and dropdowns
export type StateInfo = {
  code: string;
  name: string;
  nameHi: string;
  type: "state" | "ut";
  capital: string;
  applications: number; // demo metric (forms analyzed)
  schemes: number;
  intensity: number; // 0-100 heat intensity
};

export const STATES: StateInfo[] = [
  { code: "AP", name: "Andhra Pradesh", nameHi: "आंध्र प्रदेश", type: "state", capital: "Amaravati", applications: 8420, schemes: 142, intensity: 72 },
  { code: "AR", name: "Arunachal Pradesh", nameHi: "अरुणाचल प्रदेश", type: "state", capital: "Itanagar", applications: 1240, schemes: 84, intensity: 28 },
  { code: "AS", name: "Assam", nameHi: "असम", type: "state", capital: "Dispur", applications: 6780, schemes: 118, intensity: 64 },
  { code: "BR", name: "Bihar", nameHi: "बिहार", type: "state", capital: "Patna", applications: 14250, schemes: 168, intensity: 92 },
  { code: "CT", name: "Chhattisgarh", nameHi: "छत्तीसगढ़", type: "state", capital: "Raipur", applications: 5320, schemes: 124, intensity: 58 },
  { code: "GA", name: "Goa", nameHi: "गोवा", type: "state", capital: "Panaji", applications: 1820, schemes: 92, intensity: 40 },
  { code: "GJ", name: "Gujarat", nameHi: "गुजरात", type: "state", capital: "Gandhinagar", applications: 11240, schemes: 156, intensity: 85 },
  { code: "HR", name: "Haryana", nameHi: "हरियाणा", type: "state", capital: "Chandigarh", applications: 7820, schemes: 138, intensity: 72 },
  { code: "HP", name: "Himachal Pradesh", nameHi: "हिमाचल प्रदेश", type: "state", capital: "Shimla", applications: 3240, schemes: 108, intensity: 48 },
  { code: "JH", name: "Jharkhand", nameHi: "झारखंड", type: "state", capital: "Ranchi", applications: 5820, schemes: 122, intensity: 60 },
  { code: "KA", name: "Karnataka", nameHi: "कर्नाटक", type: "state", capital: "Bengaluru", applications: 12450, schemes: 162, intensity: 88 },
  { code: "KL", name: "Kerala", nameHi: "केरल", type: "state", capital: "Thiruvananthapuram", applications: 8920, schemes: 146, intensity: 76 },
  { code: "MP", name: "Madhya Pradesh", nameHi: "मध्य प्रदेश", type: "state", capital: "Bhopal", applications: 10180, schemes: 154, intensity: 80 },
  { code: "MH", name: "Maharashtra", nameHi: "महाराष्ट्र", type: "state", capital: "Mumbai", applications: 15820, schemes: 178, intensity: 98 },
  { code: "MN", name: "Manipur", nameHi: "मणिपुर", type: "state", capital: "Imphal", applications: 1420, schemes: 86, intensity: 30 },
  { code: "ML", name: "Meghalaya", nameHi: "मेघालय", type: "state", capital: "Shillong", applications: 1180, schemes: 82, intensity: 26 },
  { code: "MZ", name: "Mizoram", nameHi: "मिज़ोरम", type: "state", capital: "Aizawl", applications: 920, schemes: 78, intensity: 22 },
  { code: "NL", name: "Nagaland", nameHi: "नागालैंड", type: "state", capital: "Kohima", applications: 1080, schemes: 80, intensity: 24 },
  { code: "OR", name: "Odisha", nameHi: "ओडिशा", type: "state", capital: "Bhubaneswar", applications: 7240, schemes: 132, intensity: 68 },
  { code: "PB", name: "Punjab", nameHi: "पंजाब", type: "state", capital: "Chandigarh", applications: 6820, schemes: 128, intensity: 65 },
  { code: "RJ", name: "Rajasthan", nameHi: "राजस्थान", type: "state", capital: "Jaipur", applications: 9420, schemes: 148, intensity: 78 },
  { code: "SK", name: "Sikkim", nameHi: "सिक्किम", type: "state", capital: "Gangtok", applications: 820, schemes: 76, intensity: 20 },
  { code: "TN", name: "Tamil Nadu", nameHi: "तमिल नाडु", type: "state", capital: "Chennai", applications: 13820, schemes: 168, intensity: 94 },
  { code: "TG", name: "Telangana", nameHi: "तेलंगाना", type: "state", capital: "Hyderabad", applications: 9820, schemes: 152, intensity: 80 },
  { code: "TR", name: "Tripura", nameHi: "त्रिपुरा", type: "state", capital: "Agartala", applications: 1620, schemes: 88, intensity: 34 },
  { code: "UP", name: "Uttar Pradesh", nameHi: "उत्तर प्रदेश", type: "state", capital: "Lucknow", applications: 18420, schemes: 184, intensity: 100 },
  { code: "UK", name: "Uttarakhand", nameHi: "उत्तराखंड", type: "state", capital: "Dehradun", applications: 3820, schemes: 112, intensity: 50 },
  { code: "WB", name: "West Bengal", nameHi: "पश्चिम बंगाल", type: "state", capital: "Kolkata", applications: 11820, schemes: 160, intensity: 86 },
  // Union Territories
  { code: "AN", name: "Andaman & Nicobar Islands", nameHi: "अंडमान निकोबार", type: "ut", capital: "Port Blair", applications: 420, schemes: 64, intensity: 14 },
  { code: "CH", name: "Chandigarh", nameHi: "चंडीगढ़", type: "ut", capital: "Chandigarh", applications: 1820, schemes: 92, intensity: 38 },
  { code: "DN", name: "Dadra & Nagar Haveli & Daman & Diu", nameHi: "दादरा नगर हवेली", type: "ut", capital: "Daman", applications: 620, schemes: 68, intensity: 18 },
  { code: "DL", name: "Delhi", nameHi: "दिल्ली", type: "ut", capital: "New Delhi", applications: 16420, schemes: 172, intensity: 96 },
  { code: "JK", name: "Jammu & Kashmir", nameHi: "जम्मू कश्मीर", type: "ut", capital: "Srinagar / Jammu", applications: 4820, schemes: 118, intensity: 56 },
  { code: "LA", name: "Ladakh", nameHi: "लद्दाख", type: "ut", capital: "Leh", applications: 720, schemes: 72, intensity: 18 },
  { code: "LD", name: "Lakshadweep", nameHi: "लक्षद्वीप", type: "ut", capital: "Kavaratti", applications: 220, schemes: 58, intensity: 8 },
  { code: "PY", name: "Puducherry", nameHi: "पुडुचेरी", type: "ut", capital: "Puducherry", applications: 1120, schemes: 84, intensity: 28 },
];

export const STATES_BY_CODE = Object.fromEntries(STATES.map((s) => [s.code, s])) as Record<string, StateInfo>;

// SVG positions on a 600x700 canvas — rough geographic placement for heat map
export const STATE_POSITIONS: Record<string, { x: number; y: number; r?: number }> = {
  JK: { x: 245, y: 75, r: 22 },
  LA: { x: 305, y: 90, r: 20 },
  HP: { x: 270, y: 145, r: 16 },
  PB: { x: 245, y: 175, r: 16 },
  CH: { x: 260, y: 195, r: 8 },
  UK: { x: 305, y: 175, r: 16 },
  HR: { x: 260, y: 210, r: 16 },
  DL: { x: 275, y: 220, r: 10 },
  RJ: { x: 215, y: 245, r: 28 },
  UP: { x: 320, y: 235, r: 30 },
  BR: { x: 395, y: 260, r: 22 },
  SK: { x: 420, y: 245, r: 10 },
  AR: { x: 510, y: 230, r: 18 },
  NL: { x: 510, y: 270, r: 12 },
  ML: { x: 480, y: 290, r: 12 },
  AS: { x: 470, y: 260, r: 18 },
  MN: { x: 515, y: 295, r: 10 },
  MZ: { x: 500, y: 320, r: 10 },
  TR: { x: 475, y: 320, r: 10 },
  WB: { x: 415, y: 295, r: 20 },
  JH: { x: 385, y: 290, r: 18 },
  CT: { x: 340, y: 320, r: 20 },
  MP: { x: 275, y: 295, r: 26 },
  GJ: { x: 165, y: 305, r: 24 },
  DN: { x: 175, y: 345, r: 8 },
  MH: { x: 230, y: 365, r: 28 },
  TG: { x: 290, y: 395, r: 18 },
  AP: { x: 305, y: 445, r: 22 },
  OR: { x: 375, y: 345, r: 22 },
  KA: { x: 245, y: 460, r: 22 },
  GA: { x: 215, y: 440, r: 10 },
  TN: { x: 285, y: 530, r: 22 },
  KL: { x: 245, y: 535, r: 16 },
  PY: { x: 305, y: 520, r: 8 },
  AN: { x: 470, y: 545, r: 14 },
  LD: { x: 165, y: 525, r: 10 },
};

export function intensityColor(intensity: number): string {
  // Lerp from light saffron -> deep saffron -> red
  if (intensity > 80) return "#B91C1C";
  if (intensity > 65) return "#DC2626";
  if (intensity > 50) return "#F97316";
  if (intensity > 35) return "#FB923C";
  if (intensity > 20) return "#FCD34D";
  return "#FEF3C7";
}

export function intensityOpacity(intensity: number): number {
  return 0.35 + (intensity / 100) * 0.65;
}
