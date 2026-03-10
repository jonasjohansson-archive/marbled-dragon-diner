export let isLoading = false;
export let allLoaded = false;
export const allBuckets = [];

export function getIsLoading() {
  return isLoading;
}

export function setLoading(value) {
  isLoading = value;
}

export function setAllLoaded(value) {
  allLoaded = value;
}

export function getAllLoaded() {
  return allLoaded;
}
