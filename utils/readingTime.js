function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ');
}

function estimateMinutes(html, wordsPerMinute = 200) {
  const text = stripHtml(html).trim();
  if (!text) return 0;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

module.exports = { estimateMinutes };
