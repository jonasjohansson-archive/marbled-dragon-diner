import { fetchDreams } from "./fetchDreams.js";
import { handleSearch } from "./handleSearch.js";
import { initRatingFilter } from "./rating.js";
import { sortBuckets } from "./sortBuckets.js";
import { initTagFilter } from "./tagFilter.js";
import { initDetailPanel } from "./detailPanel.js";

document.getElementById("search-bar").addEventListener("input", handleSearch);
document.getElementById("sort-buckets").addEventListener("change", sortBuckets);
initRatingFilter();
fetchDreams().then(() => {
  initTagFilter();
  initDetailPanel();
});
