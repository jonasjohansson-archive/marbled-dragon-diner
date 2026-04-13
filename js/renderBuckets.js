import { removeEmojis, escapeHtml } from "./domHelpers.js";
import { Rating } from "./rating.js";
import { DREAMS_URL } from "./config.js";

function thumbUrl(url) {
  if (!url) return "";
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,c_fill/");
}

function starHTML(ratingValue, max = 3) {
  let html = '<span class="star-rating">';
  for (let i = 1; i <= max; i++) {
    html += `<button data-value="${i}" class="${i <= ratingValue ? "filled" : ""}">&#9733;</button>`;
  }
  html += "</span>";
  return html;
}

let renderedCount = 0;

export function renderBuckets(bucketsToRender) {
  const list = document.getElementById("buckets-list");
  const fragment = document.createDocumentFragment();
  const rating = new Rating();

  bucketsToRender.forEach((bucket) => {
    const { id: bucketId, title, noOfComments, minGoal, maxGoal, images } = bucket;
    const tags = (bucket.tags || []).map((t) => t.value);
    const ratingValue = rating.get(bucketId);
    const cleanTitle = escapeHtml(removeEmojis(title || ""));
    const coverImage = thumbUrl(images?.[0]?.small || "");
    const loading = renderedCount < 20 ? "eager" : "lazy";
    renderedCount++;

    const div = document.createElement("div");
    div.className = "bucket";
    div.dataset.rating = ratingValue;
    div.dataset.bucketId = bucketId;
    div.dataset.tags = tags.join(",");

    div.innerHTML = `
      ${coverImage ? `<img class="bucket-cover" src="${coverImage}" alt="${cleanTitle}" loading="${loading}" width="400" height="100" />` : ""}
      <div class="bucket-row">
        <div class="bucket-row-top">
          <h2>${cleanTitle}</h2>
          ${starHTML(ratingValue)}
        </div>
        <div class="bucket-meta-row">
          <span>${minGoal}&ndash;${maxGoal}</span>
          ${noOfComments ? `<a href="${DREAMS_URL}/${bucketId}?tab=comments" target="_blank" class="comment-link">&#x1F4AC;${noOfComments}</a>` : ""}
        </div>
      </div>
    `;

    div.querySelector(".star-rating").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      e.stopPropagation();
      let newRating = parseInt(btn.dataset.value);
      const currentRating = parseInt(div.dataset.rating) || 0;
      if (newRating === currentRating) newRating = 0;
      rating.set(newRating, bucketId);
      div.dataset.rating = newRating;
      div.querySelectorAll(".star-rating button").forEach((b, i) => {
        b.classList.toggle("filled", i < newRating);
      });
    });

    fragment.appendChild(div);
  });

  list.appendChild(fragment);
}
