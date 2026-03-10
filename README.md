# Resume ATS API + MCP Tool

ATS resume scoring, bullet rewriting, and cover letter generation with:
- HTTP API (Express)
- MCP server over stdio
- Swagger docs

## Features
- `POST /api/score` (rule-based, no LLM key required)
- `POST /api/rewrite-bullets` (LLM required)
- `POST /api/cover-letter` (LLM required)
- MCP tools: `ats_score_resume`, `ats_rewrite_bullets`, `ats_generate_cover_letter`

## Requirements
- Node.js `>=18`

## Setup
```bash
npm install
copy .env.example .env
```

Configure `.env` for Groq (recommended):
```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
GROQ_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile
```

Or configure `.env` for OpenAI:
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Run
API server:
```bash
npm run dev
```
Base URL: `http://localhost:3000`

MCP server:
```bash
npm run mcp:start
```

Swagger:
- `http://localhost:3000/docs`

## API Test Data (Examples)
Use these JSON bodies to test quickly.

`POST /api/score`
```json
{
  "resume_text": "Summary: Backend engineer with 4 years of experience building Node.js microservices. Experience: Built payment APIs handling $2M monthly, reduced latency by 35%, and implemented CI/CD pipelines with GitHub Actions. Skills: Node.js, Express, AWS, Docker, SQL, REST, Redis. Education: B.Tech in Computer Science.",
  "job_description": "We are hiring a Backend Developer with experience in Node.js, REST APIs, AWS, Docker, SQL, CI/CD, and performance optimization. Candidate should design scalable services, improve reliability, and collaborate with cross-functional teams to deliver customer-facing features."
}
```

`POST /api/rewrite-bullets`
```json
{
  "resume_text": "Experience:\n- Worked on backend APIs for internal tools.\n- Responsible for deployment and monitoring.\n- Collaborated with team to improve product.",
  "target_role": "Senior Backend Engineer"
}
```

`POST /api/cover-letter`
```json
{
  "resume_text": "Backend engineer with 4 years of experience in Node.js, AWS, SQL, and Docker. Built APIs for high-volume systems, reduced response latency by 35%, and improved deployment reliability through CI/CD automation.",
  "job_description": "Looking for a Backend Engineer to build scalable APIs, improve system reliability, and work closely with product and frontend teams. Must have Node.js, AWS, SQL, and Docker experience.",
  "tone": "confident"
}
```

Validation notes:
- `resume_text` minimum length: `80`
- `job_description` minimum length: `80` (where required)
- `tone` options: `formal | confident | friendly`

## PowerShell cURL Examples
`/api/score`
```powershell
curl.exe -X POST "http://localhost:3000/api/score" `
  -H "Content-Type: application/json" `
  -d "{\"resume_text\":\"Summary: Backend engineer with 4 years of experience building Node.js microservices. Experience: Built payment APIs handling $2M monthly, reduced latency by 35%, and implemented CI/CD pipelines with GitHub Actions. Skills: Node.js, Express, AWS, Docker, SQL, REST, Redis. Education: B.Tech in Computer Science.\",\"job_description\":\"We are hiring a Backend Developer with experience in Node.js, REST APIs, AWS, Docker, SQL, CI/CD, and performance optimization. Candidate should design scalable services, improve reliability, and collaborate with cross-functional teams to deliver customer-facing features.\"}"
```

## Testing
```bash
npm test
```

## Deploy + Monetize on RapidAPI
1. Deploy using `npm start` (Render/Railway/Fly).
2. Set deployed URL as RapidAPI base URL.
3. Publish endpoints:
   - `POST /api/score`
   - `POST /api/rewrite-bullets`
   - `POST /api/cover-letter`
