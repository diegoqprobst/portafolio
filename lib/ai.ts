/**
 * Unified AI provider abstraction for CV generation.
 * Supports both Anthropic (Claude) and OpenAI.
 *
 * Provider choice is made per-request:
 *   - "claude"  → claude-sonnet-4-6  (better reasoning, prompt caching)
 *   - "openai"  → gpt-4o-mini        (cheaper, fast)
 *   - "auto"    → prefers openai if OPENAI_API_KEY is set, else claude
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type AiProvider = "claude" | "openai" | "auto";

export type CvJson = {
  name: string;
  contact: { email: string; phone: string; location: string; linkedin: string };
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  skills: { category: string; items: string[] }[];
  education: { institution: string; degree: string; year: string }[];
  certifications: string[];
  highlights: { title: string; impact: string }[];
};

const CV_TOOL_SCHEMA = {
  type: "object" as const,
  required: [
    "name",
    "contact",
    "summary",
    "experience",
    "skills",
    "education",
    "certifications",
    "highlights",
  ],
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    contact: {
      type: "object",
      additionalProperties: false,
      required: ["email", "phone", "location", "linkedin"],
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
      },
    },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["company", "role", "period", "bullets"],
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          period: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
      },
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "items"],
        properties: {
          category: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["institution", "degree", "year"],
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          year: { type: "string" },
        },
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    highlights: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "impact"],
        properties: {
          title: { type: "string" },
          impact: { type: "string" },
        },
      },
    },
  },
};

const SYSTEM_PROMPT = `You are a professional CV editor. Given a master CV (JSON) and a job description, return a tailored CV JSON.
Rules:
- NEVER invent companies, dates, or credentials not in the master CV
- Reorder and rewrite bullets to match the job's keywords and priorities
- Select the most relevant experience entries (max 4)
- Put the most relevant skills first in each category
- Keep the summary to 2-3 impactful sentences, keyword-rich for ATS
- Highlights should be 2-3 concrete impact metrics from real experience`;

// ─── Claude ──────────────────────────────────────────────────────────────────

async function generateWithClaude(cvBase: string, jobDescription: string): Promise<CvJson> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }, // prompt caching on base CV
      },
    ],
    messages: [
      {
        role: "user",
        content: `MASTER CV:\n${cvBase}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
    tools: [
      {
        name: "output_cv",
        description: "Output the tailored CV as structured JSON",
        input_schema: CV_TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "output_cv" },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("Claude: no tool_use in response");
  return toolUse.input as CvJson;
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────

async function generateWithOpenAI(cvBase: string, jobDescription: string): Promise<CvJson> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `MASTER CV:\n${cvBase}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "output_cv",
          description: "Output the tailored CV as structured JSON",
          parameters: CV_TOOL_SCHEMA,
          strict: true,
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "output_cv" } },
  });

  const call = response.choices[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("OpenAI: no tool_call in response");
  const fnCall = call as { function: { arguments: string } };
  return JSON.parse(fnCall.function.arguments) as CvJson;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateCv(
  cvBase: string,
  jobDescription: string,
  provider: AiProvider = "auto"
): Promise<{ cvJson: CvJson; providerUsed: string }> {
  const resolved =
    provider === "auto"
      ? process.env.OPENAI_API_KEY
        ? "openai"
        : "claude"
      : provider;

  const cvJson =
    resolved === "openai"
      ? await generateWithOpenAI(cvBase, jobDescription)
      : await generateWithClaude(cvBase, jobDescription);

  return { cvJson, providerUsed: resolved };
}
