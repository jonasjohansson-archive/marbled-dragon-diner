import { removeEmojis, escapeHtml } from "./domHelpers.js";
import { Rating } from "./rating.js";

export function renderBuckets(bucketsToRender) {
  const list = document.getElementById("buckets-list");
  const fragment = document.createDocumentFragment();
  const rating = new Rating();

  bucketsToRender.forEach((bucket) => {
    const { id: bucketId, title, noOfComments, minGoal, maxGoal } = bucket;
    const tags = (bucket.tags || []).map((t) => t.value);
    const ratingValue = rating.get(bucketId);
    const cleanTitle = escapeHtml(removeEmojis(title || ""));

    const div = document.createElement("div");
    div.className = "bucket";
    div.dataset.rating = ratingValue;
    div.dataset.bucketId = bucketId;
    div.dataset.tags = tags.join(",");

    div.innerHTML = `
      <div class="bucket-row">
        <h2>${cleanTitle}</h2>
        <span class="bucket-meta">${minGoal}–${maxGoal}</span>
        <span class="bucket-meta">💬${noOfComments}</span>
        <sl-rating class="rating" label="Rating" max="3" value="${ratingValue}"></sl-rating>
      </div>
    `;

    div.querySelector(".rating").addEventListener("sl-change", (e) => {
      const newRating = e.target.value;
      rating.set(newRating, bucketId);
      div.dataset.rating = newRating;
    });

    fragment.appendChild(div);
  });

  list.appendChild(fragment);
}
