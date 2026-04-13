import { bucketsData } from "./bucketsData.js";
import { renderBuckets } from "./renderBuckets.js";
import { getIsLoading, setLoading, setAllLoaded, allBuckets } from "./state.js";
import { setLoadingMessage, hideLoading, shuffleArray } from "./domHelpers.js";

export async function fetchDreams(chunkSize = 27, delay = 500) {
  if (getIsLoading()) return;
  setLoading(true);

  try {
    // 🌀 Shuffle buckets before rendering
    const buckets = shuffleArray([...bucketsData.buckets]);
    allBuckets.push(...buckets);

    if (!buckets.length) {
      setLoadingMessage("No dreams found.");
      setAllLoaded(true);
      return;
    }

    // Staggered rendering
    for (let i = 0; i < buckets.length; i += chunkSize) {
      const chunk = buckets.slice(i, i + chunkSize);
      renderBuckets(chunk);

      // Wait a bit before rendering the next chunk
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

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
