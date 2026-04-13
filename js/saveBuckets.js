import fs from "fs";
import path from "path";
import { fetchBuckets } from "./fetchBuckets.js";

function enhanceBucket(bucket) {
  const income = bucket.income / 100;
  const minGoal = bucket.minGoal / 100;
  const maxGoal = bucket.maxGoal / 100;

  const funded = income;
  const percentageFundedTrue = minGoal > 0 ? ((income / minGoal) * 100).toFixed(2) : "0.00";

  return {
    ...bucket,
    minGoal,
    maxGoal,
    income,
    funded,
    percentageFundedTrue: parseFloat(percentageFundedTrue),
  };
}

async function preloadAllBuckets() {
  const allBuckets = [];
  let offset = 0;
  const limit = 100;
  let moreExist = true;

  while (moreExist) {
    const { buckets, moreExist: hasMore } = await fetchBuckets(offset, "", limit);
    allBuckets.push(...buckets.map(enhanceBucket));
    offset += limit;
    moreExist = hasMore;
  }

  const outPath = path.resolve("./bucketsData.json");

  // Compare with existing data (ignoring updatedAt)
  let changed = true;
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      changed = JSON.stringify(existing.buckets) !== JSON.stringify(allBuckets);
    } catch {}
  }

  if (!changed) {
    console.log(`✅ No changes (${allBuckets.length} dreams)`);
    return;
  }

  const data = { updatedAt: Date.now(), buckets: allBuckets };
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`✅ Updated bucketsData.json (${allBuckets.length} dreams)`);
}

preloadAllBuckets();
