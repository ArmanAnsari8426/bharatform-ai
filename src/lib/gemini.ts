// BharatForm AI — Gemini REST client (compatible with your Google AI Studio API key)
// Uses the simpler v1beta REST shape that works with browser API keys.

// Use the exact model family that works with your Google AI Studio key.
// Your tested curl uses: gemini-flash-latest
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_PRO_MODEL = "gemini-flash-latest";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const FALLBACK_MODELS = [
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
];

const WORKING_MODEL_KEY = "bf-gemini-working-model";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPromptText(messages: GeminiMessage[]) {
  return messages
    .flatMap((m) => m.parts)
    .filter((p): p is { text: string } => "text" in p)
    .map((p) => p.text)
    .join("\n");
}

function localChatFallback(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("emergency") || lower.includes("helpline") || lower.includes("help") || lower.includes("आपात")) {
    return "भारत में जरूरी हेल्पलाइन:\n\n- 112: National Emergency\n- 100: Police\n- 1091 / 181: Women Helpline\n- 1098: Child Helpline\n- 102: Ambulance\n- 101: Fire\n- 1930: Cyber Crime\n\nEmergency ho to turant 112 call karein.";
  }
  if (lower.includes("passport") || lower.includes("पासपोर्ट")) {
    return "Passport ke liye common documents:\n\n- Aadhaar Card\n- Birth certificate / 10th marksheet\n- Address proof\n- Passport photo\n- Signature\n\nCommon mistake: Aadhaar aur form me naam/surname mismatch. Official portal: passportindia.gov.in";
  }
  if (lower.includes("scholarship") || lower.includes("छात्र")) {
    return "Scholarship ke liye usually chahiye:\n\n- Aadhaar\n- Income certificate\n- Caste/category certificate (if applicable)\n- Previous marksheet\n- Bank account\n\nAap state, category, income aur education level batao, main matching scholarship suggest kar dunga.";
  }
  if (lower.includes("scheme") || lower.includes("योजना") || lower.includes("pm kisan")) {
    return "Popular government schemes:\n\n- PM Kisan: farmers ke liye ₹6,000/year\n- Ayushman Bharat: ₹5 lakh health cover\n- PM Awas: housing support\n- MUDRA: small business loan\n- Sukanya Samriddhi: girl child savings\n\nEligibility ke liye age, income, occupation, state aur category check hota hai.";
  }
  return "Bharat AI temporary fallback mode me answer de raha hai. Google Gemini abhi busy ho sakta hai, lekin main madad kar sakta hoon. Aap form, scheme, scholarship, Aadhaar, PAN, passport ya helpline ke baare me sawal pooch sakte hain.";
}

function localFormFallback(): string {
  return JSON.stringify({
    form_name: "Government Application Form",
    form_number: "Unknown / AI fallback",
    authority: "Government of India / State Department",
    description: "Gemini model high demand ke kaaran detailed OCR unavailable tha. Yeh safe fallback checklist hai jo common Indian government forms par apply hoti hai.",
    total_fields: 8,
    fields: [
      { field_number: 1, field_name: "Applicant Name", field_name_hindi: "आवेदक का नाम", required: true, field_type: "text", explanation: "Aadhaar ke hisaab se poora legal name likhein.", common_mistake: "Nickname ya spelling mismatch.", what_to_write: "Aadhaar/PAN par jo naam hai wahi." },
      { field_number: 2, field_name: "Date of Birth", field_name_hindi: "जन्म तिथि", required: true, field_type: "date", explanation: "DOB official record se match honi chahiye.", common_mistake: "DD/MM/YYYY format galat bharna.", what_to_write: "Birth certificate/marksheet ke hisaab se DOB." },
      { field_number: 3, field_name: "Address", field_name_hindi: "पता", required: true, field_type: "text", explanation: "Permanent/current address proof se match karein.", common_mistake: "Incomplete pincode/address.", what_to_write: "House no, area, city, state, pincode." },
      { field_number: 4, field_name: "Mobile Number", field_name_hindi: "मोबाइल नंबर", required: true, field_type: "number", explanation: "Active mobile number use karein.", common_mistake: "Wrong OTP mobile.", what_to_write: "+91 active mobile number." },
      { field_number: 5, field_name: "Aadhaar Number", field_name_hindi: "आधार नंबर", required: true, field_type: "number", explanation: "12 digit Aadhaar number.", common_mistake: "Digits missing/wrong.", what_to_write: "XXXX XXXX XXXX format accepted." }
    ],
    required_documents: [
      { name: "Aadhaar Card", required: true, note: "Identity proof" },
      { name: "Address Proof", required: true, note: "Utility bill/bank statement/ration card" },
      { name: "Passport-size Photo", required: true, note: "Recent clear photo" },
      { name: "Signature", required: true, note: "Blue/black ink" }
    ],
    step_by_step: [
      { step: "Check eligibility", description: "Official portal par eligibility criteria verify karein." },
      { step: "Collect documents", description: "Aadhaar, address proof, photo, signature ready rakhein." },
      { step: "Fill form carefully", description: "Name, DOB, address exactly documents ke hisaab se bharein." },
      { step: "Review before submit", description: "Spelling, numbers, dates aur documents cross-check karein." }
    ],
    common_mistakes: ["Name mismatch", "DOB format error", "Missing document", "Blurred photo", "Wrong mobile number"],
    estimated_time: "10-30 minutes",
    fee: "Varies by service"
  });
}

function localFallback(messages: GeminiMessage[]) {
  const prompt = getPromptText(messages);
  if (prompt.includes("Return ONLY valid JSON") || messages.some((m) => m.parts.some((p) => "inlineData" in p))) {
    return localFormFallback();
  }
  return localChatFallback(prompt);
}

export type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export type GeminiMessage = {
  role: "user" | "model";
  parts: GeminiPart[];
};

export function getApiKey(): string | null {
  const localKey = localStorage.getItem("bf-gemini-key");
  if (localKey) return localKey;
  const envKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  return envKey || null;
}

export function setApiKey(key: string) {
  localStorage.setItem("bf-gemini-key", key);
}

export function clearApiKey() {
  localStorage.removeItem("bf-gemini-key");
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

/**
 * Super-compatible generateContent for browser REST keys.
 * IMPORTANT: no responseMimeType, no responseSchema, no systemInstruction field.
 */
export async function generateContent(
  messages: GeminiMessage[],
  options: {
    model?: "flash" | "pro";
    instructionText?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return localFallback(messages);
  }

  const preferredModel = options.model === "pro" ? GEMINI_PRO_MODEL : GEMINI_MODEL;
  const cachedModel = localStorage.getItem(WORKING_MODEL_KEY);
  const modelsToTry = Array.from(new Set([cachedModel, preferredModel, ...FALLBACK_MODELS].filter(Boolean) as string[]));

  const contents = messages.map((m) => {
    const parts = m.parts.map((p) => {
      if ("inlineData" in p) {
        return {
          inline_data: {
            mime_type: p.inlineData.mimeType,
            data: p.inlineData.data,
          },
        };
      }
      return { text: p.text };
    });
    return { role: m.role, parts };
  });

  if (options.instructionText && contents.length > 0) {
    contents[0].parts.unshift({
      text: `SYSTEM:
${options.instructionText}

Follow the above instructions strictly.
`,
    });
  }

  const body = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: options.maxTokens ?? 4096,
    },
  };

  let lastError = "Unknown Gemini error";

  for (const model of modelsToTry) {
    // Keep the key out of URLs: URLs may be retained in browser history, proxies,
    // analytics, or error logs. The API accepts the same key via this header.
    const url = `${GEMINI_API_BASE}/${model}:generateContent`;

    // Keep it smooth: one retry per model, then fallback quickly.
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ||
          "";

        if (!text) throw new Error("Empty response from Gemini API");
        localStorage.setItem(WORKING_MODEL_KEY, model);
        return text;
      }

      const errText = await response.text();
      let errMsg = errText;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson?.error?.message || errText;
      } catch {}

      lastError = `Gemini API Error (${response.status}) on ${model}: ${errMsg}`;
      console.warn("Gemini retry/fallback:", lastError);

      // 503 / 429 are temporary capacity or quota spikes: retry with backoff.
      if (response.status === 503 || response.status === 429) {
        await sleep(450 * (attempt + 1));
        continue;
      }

      // 404 means model unavailable for this key/version: immediately try next model.
      if (response.status === 404) break;

      // Other 400-class errors are usually payload/key errors. Use fallback result.
      return localFallback(messages);
    }
  }

  console.warn("Gemini unavailable, using local fallback:", lastError);
  return localFallback(messages);
}

export function fileToBase64(file: File): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve({ mimeType: file.type, data: base64 });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export type FormFieldAnalysis = {
  field_number: number;
  field_name: string;
  field_name_hindi: string;
  required: boolean;
  field_type: "text" | "number" | "date" | "photo" | "signature" | "checkbox" | "other";
  explanation: string;
  common_mistake: string;
  what_to_write: string;
};

export type FormDocument = {
  name: string;
  required: boolean;
  note?: string;
};

export type FormAnalysisResult = {
  form_name: string;
  form_number?: string;
  authority: string;
  description: string;
  total_fields: number;
  fields: FormFieldAnalysis[];
  required_documents: FormDocument[];
  step_by_step: { step: string; description: string }[];
  common_mistakes: string[];
  estimated_time: string;
  fee?: string;
};

export async function analyzeForm(
  file: File,
  language: "english" | "hindi" = "english"
): Promise<FormAnalysisResult> {
  const { mimeType, data } = await fileToBase64(file);

  const supportedMimes = [
    "image/png", "image/jpeg", "image/jpg", "image/webp", "image/heic", "image/heif", "application/pdf",
  ];
  if (!supportedMimes.includes(mimeType.toLowerCase())) {
    throw new Error(`Unsupported file type: ${mimeType}. Use PDF, JPG, PNG, or WEBP.`);
  }

  const langInstruction = language === "hindi"
    ? "Provide all explanations in Hindi (Devanagari script). Keep field_name in English but field_name_hindi in Hindi."
    : "Provide all explanations in clear, simple English. Include Hindi translation for field_name_hindi.";

  const instructionText = `You are Bharat AI, the most advanced expert assistant for Indian government forms.
${langInstruction}
Your job is to act as a highly skilled legal and government advisor. Look closely at every detail in the uploaded document.
Identify EVERY visible field, required documents, step-by-step submission, and common rejection mistakes.
Ensure you accurately extract the text from the image, and use your vast knowledge to provide context specific to India (e.g. Aadhaar, PAN, RTO, Passport Seva, EPFO, Income Tax, etc.).`;

  const prompt = `Carefully analyze the attached Indian government form or document image. 

Return ONLY valid JSON with this exact structure:
{
  "form_name": "string",
  "form_number": "string",
  "authority": "string",
  "description": "string",
  "total_fields": 0,
  "fields": [
    {
      "field_number": 1,
      "field_name": "string",
      "field_name_hindi": "string",
      "required": true,
      "field_type": "text|number|date|photo|signature|checkbox|other",
      "explanation": "string",
      "common_mistake": "string",
      "what_to_write": "string"
    }
  ],
  "required_documents": [{ "name": "string", "required": true, "note": "string" }],
  "step_by_step": [{ "step": "string", "description": "string" }],
  "common_mistakes": ["string"],
  "estimated_time": "string",
  "fee": "string"
}
No markdown. No extra text outside JSON.`;

  const messages: GeminiMessage[] = [
    {
      role: "user",
      parts: [{ inlineData: { mimeType, data } }, { text: prompt }],
    },
  ];

  const responseText = await generateContent(messages, {
    model: "flash",
    instructionText,
    temperature: 0.2,
    maxTokens: 8192,
  });

  try {
    // Clean up potential markdown formatting from Gemini
    const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const result = JSON.parse(cleanedText) as FormAnalysisResult;
    if (!result.total_fields) result.total_fields = result.fields?.length || 0;
    return result;
  } catch (e) {
    console.error("Parse Error:", e, responseText);
    throw new Error("Failed to parse Gemini response. Ensure the image is a clear government form.");
  }
}

export async function chatWithBharatAI(
  history: { role: "user" | "ai"; content: string }[],
  newMessage: string,
  language: string = "en"
): Promise<string> {
  const langMap: Record<string, string> = {
    en: "English",
    hi: "Hindi (Devanagari script)",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
    ur: "Urdu",
  };
  const langName = langMap[language] || "English";

  const instructionText = `You are Bharat AI — India's most advanced, friendly, and deeply knowledgeable AI Assistant.
Your primary role is to help Indian citizens with government forms, schemes, scholarships, and documents. However, you are a highly capable AI and can answer ANY question the user asks, whether it's general knowledge, technology, everyday advice, or complex explanations.
Answer fluently in ${langName}.
When answering government-related queries:
- Be highly practical, accurate, and detailed.
- Use Indian context heavily: Aadhaar, PAN, UPI, Indian rupees, Indian states, etc.
- ALWAYS mention official portals or department names when relevant.
- Remind users to verify critical info from official sources.
- Emergency helplines: 112 (General), 100 (Police), 1091 (Women), 1098 (Child), 101 (Fire), 102 (Ambulance), 1930 (Cyber Crime).
For non-government questions, just provide the best, most helpful answer possible as a general-purpose AI.`;

  const contents: GeminiMessage[] = history.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  contents.push({ role: "user", parts: [{ text: newMessage }] });

  return generateContent(contents, {
    model: "flash",
    instructionText,
    temperature: 0.7,
    maxTokens: 1024,
  });
}
