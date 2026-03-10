const { extractKeywords, normalizeWords, scoreSections, detectWeakBullets } = require("../utils/textUtils");

function scoreResume(resumeText, jobDescription) {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeWords = normalizeWords(resumeText);

  const matchedKeywords = jdKeywords.filter((k) => resumeWords.has(k));
  const missingKeywords = jdKeywords.filter((k) => !resumeWords.has(k));

  const keywordMatchPercent = jdKeywords.length
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 0;

  const sectionScore = scoreSections(resumeText);
  const weakBullets = detectWeakBullets(resumeText);

  const overall = Math.round(
    keywordMatchPercent * 0.6 + sectionScore.score * 0.25 + Math.max(0, 100 - weakBullets.length * 8) * 0.15
  );

  return {
    overall_score: Math.min(100, Math.max(0, overall)),
    keyword_match_percent: keywordMatchPercent,
    matched_keywords: matchedKeywords.slice(0, 40),
    missing_keywords: missingKeywords.slice(0, 40),
    section_analysis: sectionScore,
    formatting_flags: weakBullets,
    suggestions: buildSuggestions(keywordMatchPercent, sectionScore.missingSections, weakBullets)
  };
}

function buildSuggestions(keywordMatchPercent, missingSections, weakBullets) {
  const suggestions = [];

  if (keywordMatchPercent < 65) {
    suggestions.push("Increase exact-match keywords from job description across summary and experience bullets.");
  }

  if (missingSections.length) {
    suggestions.push(`Add missing sections: ${missingSections.join(", ")}.`);
  }

  if (weakBullets.length > 0) {
    suggestions.push("Start bullets with action verbs and include measurable outcomes (%, $, time saved, scale).");
  }

  if (!suggestions.length) {
    suggestions.push("Strong ATS baseline. Fine-tune wording for each application and keep role-specific keywords near top.");
  }

  return suggestions;
}

module.exports = { scoreResume };
