const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

const client = apiKey ? new OpenAI({ apiKey }) : null;

async function rewriteBullets(resumeText, targetRole) {
  if (!client) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your environment before using this endpoint.");
  }

  const prompt = [
    "Rewrite resume experience bullets to be ATS-friendly and impact-focused.",
    `Target role: ${targetRole}`,
    "Return strict JSON with shape:",
    '{"rewritten_bullets":[{"original":"","improved":"","why":""}]}'
  ].join("\n");

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are an expert resume writer and ATS optimization assistant." },
      { role: "user", content: `${prompt}\n\nResume:\n${resumeText}` }
    ]
  });

  const raw = response.choices[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

async function generateCoverLetter(resumeText, jobDescription, tone) {
  if (!client) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your environment before using this endpoint.");
  }

  const prompt = [
    "Write a concise, tailored cover letter under 250 words.",
    `Tone: ${tone}`,
    "Return strict JSON with shape:",
    '{"cover_letter":"..."}'
  ].join("\n");

  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are an expert career coach and professional writer." },
      {
        role: "user",
        content: `${prompt}\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
      }
    ]
  });

  const raw = response.choices[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

module.exports = { rewriteBullets, generateCoverLetter };
