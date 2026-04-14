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

    const statsEl = document.getElementById("dream-stats");
    if (statsEl) {
      const fmt = (n) => Math.round(n).toLocaleString("sv-SE");
      let selfFunded = 0;
      let expMin = 0;
      let expMax = 0;

      buckets.forEach((b) => {
        (b.budgetItems || []).forEach((i) => {
          if (i.type === "INCOME") selfFunded += i.min || 0;
          if (i.type === "EXPENSE") {
            expMin += i.min || 0;
            expMax += i.max || i.min || 0;
          }
        });
      });

      const totalMin = selfFunded + expMin;
      const totalMax = selfFunded + expMax;

      statsEl.innerHTML = [
        `Total budget: ${fmt(totalMin)}&ndash;${fmt(totalMax)} kr`,
        `Self-funded: ${fmt(selfFunded)} kr`,
        `Requested: ${fmt(expMin)}&ndash;${fmt(expMax)} kr`,
      ].join(" &middot; ");
    }
  } catch (error) {
    console.error("Error loading dreams:", error);
    setLoadingMessage("Failed to load dreams.");
  } finally {
    setLoading(false);
  }
}
