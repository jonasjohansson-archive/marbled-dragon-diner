import { allBuckets } from "./state.js";
import { cleanCustomFieldValue, escapeHtml, removeEmojis } from "./domHelpers.js";
import { DREAMS_URL } from "./config.js";
import { Rating } from "./rating.js";

const rating = new Rating();

function starHTML(value, max = 3) {
  let html = '<span class="star-rating">';
  for (let i = 1; i <= max; i++) {
    html += `<button data-value="${i}" class="${i <= value ? "filled" : ""}">&#9733;</button>`;
  }
  html += "</span>";
  return html;
}

export function initDetailPanel() {
  document.getElementById("buckets-list").addEventListener("click", (e) => {
    if (e.target.closest(".star-rating")) return;
    const bucketEl = e.target.closest(".bucket");
    if (!bucketEl) return;

    const bucketId = bucketEl.dataset.bucketId;
    const bucket = allBuckets.find((b) => b.id === bucketId);
    if (!bucket) return;

    document.querySelectorAll(".bucket.selected").forEach((el) => el.classList.remove("selected"));
    bucketEl.classList.add("selected");
    renderDetail(bucket);
  });
}

function renderDetail(bucket) {
  const panel = document.getElementById("detail-panel");
  const tags = (bucket.tags || []).map((t) => t.value);
  const cleanTitle = escapeHtml(removeEmojis(bucket.title || ""));
  const cleanSummary = escapeHtml(removeEmojis(bucket.summary || ""));
  const ratingValue = rating.get(bucket.id);

  const imagesHTML = (bucket.images || [])
    .map((img) => `<img src="${img.small}" alt="${cleanTitle}" loading="lazy" />`)
    .join("");

  const fieldsHTML = bucket.customFields
    .filter(({ value }) => value && value.trim())
    .map(
      ({ customField, value }) => `
      <div class="detail-field">
        <div class="detail-field-name">${escapeHtml(customField?.name || "Field")}</div>
        <div class="detail-field-value">${cleanCustomFieldValue(value)}</div>
      </div>
    `
    )
    .join("");

  const tagsHTML = tags.length
    ? `<div class="detail-tags">${tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>`
    : "";

  const statusLabel = (bucket.status || "").replace(/_/g, " ").toLowerCase();

  panel.innerHTML = `
    <h2>${cleanTitle}</h2>
    <div class="detail-meta">
      <span><strong>Goal:</strong> ${bucket.minGoal}&ndash;${bucket.maxGoal} SEK</span>
      <span>${statusLabel}</span>
      <span>&#x1F4AC; ${bucket.noOfComments}</span>
      ${starHTML(ratingValue)}
    </div>
    ${tagsHTML}
    <p>${cleanSummary}</p>
    ${imagesHTML ? `<div class="detail-images">${imagesHTML}</div>` : ""}
    ${fieldsHTML}
    <a class="detail-link" href="${DREAMS_URL}/${bucket.id}" target="_blank">View on Dreams &rarr;</a>
  `;

  panel.querySelector(".star-rating").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    let newRating = parseInt(btn.dataset.value);
    if (newRating === ratingValue) newRating = 0;
    rating.set(newRating, bucket.id);

    panel.querySelectorAll(".star-rating button").forEach((b, i) => {
      b.classList.toggle("filled", i < newRating);
    });

    const listItem = document.querySelector(`.bucket[data-bucket-id="${bucket.id}"]`);
    if (listItem) {
      listItem.dataset.rating = newRating;
      listItem.querySelectorAll(".star-rating button").forEach((b, i) => {
        b.classList.toggle("filled", i < newRating);
      });
    }
  });
}
