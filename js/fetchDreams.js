import { renderBuckets } from "./renderBuckets.js";
import { getIsLoading, setLoading, setAllLoaded, allBuckets } from "./state.js";
import { setLoadingMessage, hideLoading, shuffleArray } from "./domHelpers.js";

export async function fetchDreams() {
  if (getIsLoading()) return;
  setLoading(true);

  try {
    const response = await fetch("js/bucketsData.json");
    const bucketsData = await response.json();

    const buckets = shuffleArray([...bucketsData.buckets]);
    allBuckets.push(...buckets);

    if (!buckets.length) {
      setLoadingMessage("No dreams found.");
      setAllLoaded(true);
      return;
    }

    renderBuckets(buckets);
    setAllLoaded(true);
    hideLoading();

    const countEl = document.getElementById("dream-count");
    if (countEl) {
      const updated = new Date(bucketsData.updatedAt);
      countEl.textContent = `${buckets.length} dreams (updated ${updated.toLocaleDateString()})`;
    }
  } catch (error) {
    console.error("Error loading dreams:", error);
    setLoadingMessage("Failed to load dreams.");
  } finally {
    setLoading(false);
  }
}
