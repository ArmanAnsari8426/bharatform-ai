export type CustomService = {
  id: string;
  name: string;
  emoji: string;
  authority: string;
  fee: string;
  time: string;
  docs: number;
  mistakes: string;
  createdAt: number;
};

export type CustomScholarship = {
  id: string;
  name: string;
  nameHi: string;
  provider: string;
  amount: string;
  deadline: string;
  daysLeft: number;
  match: number;
  docs: string[];
  tags: string[];
  featured: boolean;
  eligibleStates: string[];
  eligibleCategories: string[];
  maxIncome?: number;
  educationLevels: string[];
  createdAt: number;
};

export type CustomScheme = {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  benefit: string;
  color: "saffron" | "india" | "navy";
  official: string;
  status: string;
  popularity: number;
  trending: boolean;
  central: boolean;
  states: string[];
  occupations: string[];
  categories: string[];
  genders: string[];
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  needsRural?: boolean;
  needsGirlChild?: boolean;
  needsFarmer?: boolean;
  description: string;
  documents: string[];
  createdAt: number;
};

const SERVICE_KEY = "bf-admin-services";
const SCHOLARSHIP_KEY = "bf-admin-scholarships";
const SCHEME_KEY = "bf-admin-schemes";

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("bf-content-updated"));
}

export function getCustomServices(): CustomService[] {
  return read<CustomService[]>(SERVICE_KEY, []);
}

export function getCustomScholarships(): CustomScholarship[] {
  return read<CustomScholarship[]>(SCHOLARSHIP_KEY, []);
}

export function getCustomSchemes(): CustomScheme[] {
  return read<CustomScheme[]>(SCHEME_KEY, []);
}

export function getContentCounts() {
  return {
    services: getCustomServices().length,
    scholarships: getCustomScholarships().length,
    schemes: getCustomSchemes().length,
  };
}

export function addCustomService(item: Omit<CustomService, "id" | "createdAt">) {
  const items = getCustomServices();
  const record: CustomService = { ...item, id: `svc_${Date.now()}`, createdAt: Date.now() };
  write(SERVICE_KEY, [record, ...items]);
  return record;
}

export function addCustomScholarship(item: Omit<CustomScholarship, "id" | "createdAt">) {
  const items = getCustomScholarships();
  const record: CustomScholarship = { ...item, id: `sch_${Date.now()}`, createdAt: Date.now() };
  write(SCHOLARSHIP_KEY, [record, ...items]);
  return record;
}

export function addCustomScheme(item: Omit<CustomScheme, "id" | "createdAt">) {
  const items = getCustomSchemes();
  const record: CustomScheme = { ...item, id: `scheme_${Date.now()}`, createdAt: Date.now() };
  write(SCHEME_KEY, [record, ...items]);
  return record;
}

export function deleteContent(kind: "service" | "scholarship" | "scheme", id: string) {
  if (kind === "service") write(SERVICE_KEY, getCustomServices().filter((x) => x.id !== id));
  if (kind === "scholarship") write(SCHOLARSHIP_KEY, getCustomScholarships().filter((x) => x.id !== id));
  if (kind === "scheme") write(SCHEME_KEY, getCustomSchemes().filter((x) => x.id !== id));
}

export function clearCustomContent() {
  write(SERVICE_KEY, []);
  write(SCHOLARSHIP_KEY, []);
  write(SCHEME_KEY, []);
}
