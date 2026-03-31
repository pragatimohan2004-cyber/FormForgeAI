import type { GeneratedForm, FormField, FieldType } from "@/types/form";

// Mock AI form generation — will be replaced with real LLM calls when Cloud is enabled
const FIELD_PATTERNS: Record<string, { type: FieldType; placeholder?: string }> = {
  name: { type: "text", placeholder: "Enter your full name" },
  "full name": { type: "text", placeholder: "Enter your full name" },
  email: { type: "email", placeholder: "you@example.com" },
  phone: { type: "phone", placeholder: "+1 (555) 000-0000" },
  address: { type: "textarea", placeholder: "Enter your address" },
  message: { type: "textarea", placeholder: "Type your message here..." },
  comments: { type: "textarea", placeholder: "Share your thoughts..." },
  description: { type: "textarea", placeholder: "Provide a description..." },
  date: { type: "date" },
  birthday: { type: "date" },
  website: { type: "url", placeholder: "https://example.com" },
  url: { type: "url", placeholder: "https://example.com" },
  age: { type: "number", placeholder: "Enter your age" },
  quantity: { type: "number", placeholder: "0" },
  rating: { type: "select" },
  category: { type: "select" },
  type: { type: "select" },
  level: { type: "select" },
  severity: { type: "select" },
  agree: { type: "checkbox" },
  terms: { type: "checkbox" },
  subscribe: { type: "checkbox" },
  gender: { type: "radio" },
  preference: { type: "radio" },
};

function generateId() {
  return `field_${Math.random().toString(36).slice(2, 9)}`;
}

function inferFieldFromKeyword(keyword: string): Partial<FormField> {
  const lower = keyword.toLowerCase();
  for (const [pattern, config] of Object.entries(FIELD_PATTERNS)) {
    if (lower.includes(pattern)) {
      return { type: config.type, placeholder: config.placeholder };
    }
  }
  return { type: "text", placeholder: `Enter ${keyword}` };
}

function generateSelectOptions(fieldName: string): { label: string; value: string }[] {
  const optionSets: Record<string, string[]> = {
    rating: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"],
    severity: ["Low", "Medium", "High", "Critical"],
    category: ["General", "Technical", "Billing", "Feature Request", "Other"],
    priority: ["Low", "Medium", "High", "Urgent"],
    experience: ["Beginner", "Intermediate", "Advanced", "Expert"],
    level: ["Entry", "Junior", "Mid", "Senior", "Lead"],
    type: ["Type A", "Type B", "Type C"],
    department: ["Engineering", "Design", "Marketing", "Sales", "HR"],
    dietary: ["No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher"],
    size: ["Small", "Medium", "Large", "Extra Large"],
    product: ["Product A", "Product B", "Product C"],
  };

  const lower = fieldName.toLowerCase();
  for (const [key, options] of Object.entries(optionSets)) {
    if (lower.includes(key)) {
      return options.map((o) => ({ label: o, value: o.toLowerCase().replace(/\s+/g, "_") }));
    }
  }
  return ["Option 1", "Option 2", "Option 3"].map((o) => ({
    label: o,
    value: o.toLowerCase().replace(/\s+/g, "_"),
  }));
}

function generateRadioOptions(fieldName: string): { label: string; value: string }[] {
  const lower = fieldName.toLowerCase();
  if (lower.includes("gender")) {
    return ["Male", "Female", "Non-binary", "Prefer not to say"].map((o) => ({
      label: o, value: o.toLowerCase().replace(/\s+/g, "_"),
    }));
  }
  if (lower.includes("yes") || lower.includes("no")) {
    return ["Yes", "No"].map((o) => ({ label: o, value: o.toLowerCase() }));
  }
  return ["Option A", "Option B", "Option C"].map((o) => ({
    label: o, value: o.toLowerCase().replace(/\s+/g, "_"),
  }));
}

export function parsePromptToForm(prompt: string): GeneratedForm {
  // Extract meaningful keywords from the prompt
  const words = prompt.toLowerCase();

  // Common field names to detect
  const detectedFields: FormField[] = [];
  const fieldKeywords = [
    "name", "full name", "email", "phone", "address", "message", "comments",
    "description", "date", "birthday", "website", "url", "age", "quantity",
    "rating", "category", "type", "severity", "level", "priority",
    "experience", "department", "gender", "dietary", "size", "product",
    "agree", "terms", "subscribe", "subject", "title", "company",
    "password", "budget", "feedback", "steps to reproduce", "screenshot",
    "resume", "cover letter", "salary", "availability",
  ];

  const matched = new Set<string>();
  for (const kw of fieldKeywords) {
    if (words.includes(kw) && !matched.has(kw)) {
      // Avoid duplicates like "name" when "full name" is matched
      if (kw === "name" && matched.has("full name")) continue;
      matched.add(kw);

      const inferred = inferFieldFromKeyword(kw);
      const field: FormField = {
        id: generateId(),
        type: inferred.type || "text",
        label: kw.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        placeholder: inferred.placeholder,
        required: ["name", "full name", "email"].some((r) => kw.includes(r)),
      };

      if (field.type === "select") {
        field.options = generateSelectOptions(kw);
      }
      if (field.type === "radio") {
        field.options = generateRadioOptions(kw);
      }

      detectedFields.push(field);
    }
  }

  // If we didn't detect much, add some defaults
  if (detectedFields.length < 2) {
    detectedFields.unshift(
      { id: generateId(), type: "text", label: "Name", placeholder: "Enter your name", required: true },
      { id: generateId(), type: "email", label: "Email", placeholder: "you@example.com", required: true },
    );
    if (detectedFields.length < 4) {
      detectedFields.push(
        { id: generateId(), type: "textarea", label: "Message", placeholder: "Type your message...", required: false },
      );
    }
  }

  // Generate a title from the prompt
  const titleMatch = prompt.match(/(?:a|an|the)?\s*(.+?)(?:\s+form|\s+survey|\s+questionnaire)/i);
  const title = titleMatch
    ? titleMatch[1].trim().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Form"
    : "Generated Form";

  return {
    title,
    description: `AI-generated form based on: "${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}"`,
    fields: detectedFields,
  };
}
