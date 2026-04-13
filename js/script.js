import { fetchDreams } from "./fetchDreams.js";
import { handleSearch } from "./handleSearch.js";
import { initRatingFilter } from "./rating.js";
import { sortBuckets } from "./sortBuckets.js";
import { initTagFilter } from "./tagFilter.js";
import { initDetailPanel } from "./detailPanel.js";

document.getElementById("search-bar").addEventListener("input", handleSearch);
document.getElementById("sort-buckets").addEventListener("change", sortBuckets);

document.querySelector("h1 a").addEventListener("click", (e) => {
  e.preventDefault();
  history.replaceState(null, "", location.pathname);
  document.querySelectorAll(".bucket.selected").forEach((el) => el.classList.remove("selected"));
  document.getElementById("detail-panel").innerHTML =
    '<p class="detail-placeholder">Select a dream to read more</p>';
});
initRatingFilter();
fetchDreams().then(() => {
  initTagFilter();
  initDetailPanel();
});
