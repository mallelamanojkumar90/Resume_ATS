const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreResume } = require("../src/services/atsScorer");

test("scoreResume returns expected structure", () => {
  const resume = `
Summary
Backend engineer with Node.js and AWS experience.
Experience
- Built APIs for payment systems that processed $2M monthly.
Skills
Node.js AWS SQL Docker
Education
B.Tech Computer Science
Projects
- Developed analytics dashboard and increased reporting speed by 30%.
  `;

  const jd = "Need Node.js, AWS, SQL, REST API design, Docker, and analytics experience.";

  const result = scoreResume(resume, jd);

  assert.equal(typeof result.overall_score, "number");
  assert.equal(typeof result.keyword_match_percent, "number");
  assert.ok(Array.isArray(result.missing_keywords));
  assert.ok(Array.isArray(result.suggestions));
});
