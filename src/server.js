const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { z } = require("zod");
require("dotenv").config();

const { scoreResume } = require("./services/atsScorer");
const { rewriteBullets, generateCoverLetter } = require("./services/openaiService");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const scoreSchema = z.object({
  resume_text: z.string().min(80),
  job_description: z.string().min(80)
});

const rewriteSchema = z.object({
  resume_text: z.string().min(80),
  target_role: z.string().min(2)
});

const coverLetterSchema = z.object({
  resume_text: z.string().min(80),
  job_description: z.string().min(80),
  tone: z.enum(["formal", "confident", "friendly"]).optional()
});

app.get("/", (_req, res) => {
  res.json({
    name: "Resume ATS API",
    version: "1.0.0",
    endpoints: ["POST /api/score", "POST /api/rewrite-bullets", "POST /api/cover-letter"]
  });
});

app.post("/api/score", (req, res) => {
  const parsed = scoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }

  const result = scoreResume(parsed.data.resume_text, parsed.data.job_description);
  return res.json(result);
});

app.post("/api/rewrite-bullets", async (req, res) => {
  const parsed = rewriteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }

  try {
    const result = await rewriteBullets(parsed.data.resume_text, parsed.data.target_role);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to rewrite bullets" });
  }
});

app.post("/api/cover-letter", async (req, res) => {
  const parsed = coverLetterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }

  try {
    const result = await generateCoverLetter(
      parsed.data.resume_text,
      parsed.data.job_description,
      parsed.data.tone || "confident"
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to generate cover letter" });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Resume ATS API running on port ${port}`);
});
