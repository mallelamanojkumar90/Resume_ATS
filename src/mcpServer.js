require("dotenv").config();

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const { z } = require("zod");

const { scoreResume } = require("./services/atsScorer");
const { rewriteBullets, generateCoverLetter } = require("./services/openaiService");

const server = new Server(
  {
    name: "resume-ats-mcp",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

const scoreInputSchema = z.object({
  resume_text: z.string().min(80),
  job_description: z.string().min(80)
});

const rewriteInputSchema = z.object({
  resume_text: z.string().min(80),
  target_role: z.string().min(2)
});

const coverLetterInputSchema = z.object({
  resume_text: z.string().min(80),
  job_description: z.string().min(80),
  tone: z.enum(["formal", "confident", "friendly"]).optional()
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "ats_score_resume",
      description: "Score a resume against a job description and return ATS analysis.",
      inputSchema: {
        type: "object",
        properties: {
          resume_text: { type: "string", description: "Full resume text" },
          job_description: { type: "string", description: "Target job description text" }
        },
        required: ["resume_text", "job_description"]
      }
    },
    {
      name: "ats_rewrite_bullets",
      description: "Rewrite resume bullets for ATS optimization and impact.",
      inputSchema: {
        type: "object",
        properties: {
          resume_text: { type: "string", description: "Resume text containing experience bullets" },
          target_role: { type: "string", description: "Role to optimize for" }
        },
        required: ["resume_text", "target_role"]
      }
    },
    {
      name: "ats_generate_cover_letter",
      description: "Generate a tailored cover letter based on resume and JD.",
      inputSchema: {
        type: "object",
        properties: {
          resume_text: { type: "string" },
          job_description: { type: "string" },
          tone: { type: "string", enum: ["formal", "confident", "friendly"] }
        },
        required: ["resume_text", "job_description"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "ats_score_resume") {
    const parsed = scoreInputSchema.safeParse(args);
    if (!parsed.success) {
      return formatError(parsed.error.message);
    }

    const result = scoreResume(parsed.data.resume_text, parsed.data.job_description);
    return formatJson(result);
  }

  if (name === "ats_rewrite_bullets") {
    const parsed = rewriteInputSchema.safeParse(args);
    if (!parsed.success) {
      return formatError(parsed.error.message);
    }

    try {
      const result = await rewriteBullets(parsed.data.resume_text, parsed.data.target_role);
      return formatJson(result);
    } catch (error) {
      return formatError(error.message || "Failed to rewrite bullets");
    }
  }

  if (name === "ats_generate_cover_letter") {
    const parsed = coverLetterInputSchema.safeParse(args);
    if (!parsed.success) {
      return formatError(parsed.error.message);
    }

    try {
      const result = await generateCoverLetter(
        parsed.data.resume_text,
        parsed.data.job_description,
        parsed.data.tone || "confident"
      );
      return formatJson(result);
    } catch (error) {
      return formatError(error.message || "Failed to generate cover letter");
    }
  }

  return formatError(`Unknown tool: ${name}`);
});

function formatJson(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}

function formatError(message) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: message }, null, 2)
      }
    ],
    isError: true
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP server failed to start", error);
  process.exit(1);
});
