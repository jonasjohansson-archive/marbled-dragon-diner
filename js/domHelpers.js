export function setLoadingMessage(msg) {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.textContent = msg;
}

export function hideLoading() {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.classList.add("hidden");
}

// Simple Fisher-Yates shuffle
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function removeEmojis(str = "") {
  return str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uFE0F|\u200D)+/g,
    ""
  );
}

export function cleanCustomFieldValue(value) {
  // Escape HTML first to prevent XSS from user-submitted content
  value = escapeHtml(value);

  // Strip bold wrapping if the entire value is wrapped in **...**
  value = value.replace(/^\*\*([\s\S]*)\*\*$/gm, '$1');

  // Process headings before replacing linebreaks (^ needs real newlines)
  value = value
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
    .replace(/\r\n|\r|\n/gim, '<br>') // linebreaks (after headings)
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>') // bold text
    .replace(/__(.*?)__/gim, '<strong>$1</strong>') // bold text (underscores)
    .replace(/\*(.*?)\*/gim, '<i>$1</i>') // italic text (asterisks)
    .replace(/\b_(.*?)_\b/gim, '<i>$1</i>') // italic text (underscores)
    .replace(/\[([^\[]+)\]\(((https?:\/\/)[^)]*)\)/gim, (_, text, url) =>
      `<a href="${url.replace(/&amp;/g, '&')}" target="_blank">${text}</a>`) // anchor tags (only http/https)
    .replace(/\[Image #\d+\]/gi, ''); // remove image placeholders

  return value;
}

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
