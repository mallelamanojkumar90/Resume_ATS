const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "from", "have", "this", "your", "you", "are", "was", "were", "has", "had",
  "will", "would", "could", "should", "their", "about", "into", "over", "under", "across", "within", "years", "year"
]);

function normalizeWords(text) {
  const words = (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

function extractKeywords(jobDescription) {
  const words = Array.from(normalizeWords(jobDescription));
  const highValue = words.filter((w) => /^(sql|aws|azure|react|node|python|java|docker|kubernetes|ci|cd|agile|api|rest|microservices|leadership|analytics)$/.test(w));
  const top = words.slice(0, 120);
  return Array.from(new Set([...highValue, ...top])).slice(0, 60);
}

function scoreSections(resumeText) {
  const lower = (resumeText || "").toLowerCase();
  const expected = {
    summary: ["summary", "profile"],
    experience: ["experience", "employment"],
    skills: ["skills", "technical skills"],
    education: ["education", "academic"],
    projects: ["projects", "project"]
  };

  const presentSections = [];
  const missingSections = [];

  for (const [section, aliases] of Object.entries(expected)) {
    if (aliases.some((a) => lower.includes(a))) {
      presentSections.push(section);
    } else {
      missingSections.push(section);
    }
  }

  const score = Math.round((presentSections.length / Object.keys(expected).length) * 100);
  return { score, present_sections: presentSections, missingSections };
}

function detectWeakBullets(resumeText) {
  const lines = (resumeText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const actionVerbs = /^(led|built|developed|designed|implemented|improved|optimized|launched|managed|created|automated|delivered|reduced|increased)\b/i;

  const issues = [];

  lines.forEach((line, index) => {
    const looksLikeBullet = /^[-*•]/.test(line) || /^\d+\./.test(line);
    if (!looksLikeBullet) {
      return;
    }

    const plain = line.replace(/^[-*•]\s*/, "").trim();
    if (plain.split(/\s+/).length < 7) {
      issues.push({ line: index + 1, issue: "Bullet is too short and likely low-impact." });
      return;
    }

    if (!actionVerbs.test(plain)) {
      issues.push({ line: index + 1, issue: "Bullet does not start with a strong action verb." });
    }

    if (!/\d|%|\$/.test(plain)) {
      issues.push({ line: index + 1, issue: "Bullet has no measurable outcome (number, %, or $)." });
    }
  });

  return issues.slice(0, 20);
}

module.exports = { extractKeywords, normalizeWords, scoreSections, detectWeakBullets };
