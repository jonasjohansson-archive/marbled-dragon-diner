import { allBuckets } from "./state.js";
import { cleanCustomFieldValue, escapeHtml, removeEmojis } from "./domHelpers.js";
import { DREAMS_URL } from "./config.js";
import { Rating } from "./rating.js";

const rating = new Rating();

export function initDetailPanel() {
  document.getElementById("buckets-list").addEventListener("click", (e) => {
    const bucketEl = e.target.closest(".bucket");
    if (!bucketEl) return;

    // Don't intercept rating clicks
    if (e.target.closest("sl-rating")) return;

    const bucketId = bucketEl.dataset.bucketId;
    const bucket = allBuckets.find((b) => b.id === bucketId);
    if (!bucket) return;

    // Highlight selected
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
    ? `<div class="detail-tags">${tags.map((t) => `<sl-badge variant="primary" pill>${escapeHtml(t)}</sl-badge>`).join(" ")}</div>`
    : "";

  panel.innerHTML = `
    <h2>${cleanTitle}</h2>
    <div class="detail-meta">
      <span><strong>Goal:</strong> ${bucket.minGoal}–${bucket.maxGoal} SEK</span>
      <sl-badge variant="neutral">${(bucket.status || "").replace(/_/g, " ").toLowerCase()}</sl-badge>
      <span>💬 ${bucket.noOfComments}</span>
      <sl-rating class="detail-rating" label="Rating" max="3" value="${ratingValue}"></sl-rating>
    </div>
    ${tagsHTML}
    <p>${cleanSummary}</p>
    ${imagesHTML ? `<div class="detail-images">${imagesHTML}</div>` : ""}
    ${fieldsHTML}
    <a class="detail-link" href="${DREAMS_URL}/${bucket.id}" target="_blank">View on Dreams platform &rarr;</a>
  `;

  // Wire up rating in detail panel
  const detailRating = panel.querySelector(".detail-rating");
  if (detailRating) {
    detailRating.addEventListener("sl-change", (e) => {
      const newRating = e.target.value;
      rating.set(newRating, bucket.id);
      // Sync the list item rating too
      const listItem = document.querySelector(`.bucket[data-bucket-id="${bucket.id}"]`);
      if (listItem) {
        listItem.dataset.rating = newRating;
        const listRating = listItem.querySelector("sl-rating");
        if (listRating) listRating.value = newRating;
      }
    });
  }
}
