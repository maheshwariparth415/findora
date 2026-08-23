/**
 * Frontend mirror of backend/services/aiMatchingService.js — used so the
 * Explore page and the AI Matching demo can compute realistic-looking
 * scores client-side while there's no live backend to hit. Structured
 * identically so it can be deleted in favor of `api.get('/matches/...')`
 * once the real API is running.
 */
function tokenize(str = "") {
  return new Set(str.toLowerCase().match(/[a-z0-9]+/g) || []);
}

function textSimilarity(a, b) {
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (!setA.size || !setB.size) return 40;
  let overlap = 0;
  for (const w of setA) if (setB.has(w)) overlap++;
  const jaccard = overlap / (setA.size + setB.size - overlap);
  return Math.round(45 + jaccard * 55);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function locationScore(a, b) {
  const km = haversineKm(a.lat, a.lng, b.lat, b.lng);
  if (km <= 0.3) return 98;
  if (km >= 15) return 20;
  return Math.round(98 - (km / 15) * 78);
}

export function computeMatch(lostItem, foundItem) {
  const imageSimilarity = lostItem.category === foundItem.category ? 90 : 68;
  const descriptionSimilarity = Math.round(
    textSimilarity(lostItem.description, foundItem.description) *
      (lostItem.category === foundItem.category ? 1 : 0.7)
  );
  const locationProximity = locationScore(lostItem.location, foundItem.location);
  const overall = Math.round(
    imageSimilarity * 0.45 + descriptionSimilarity * 0.35 + locationProximity * 0.2
  );
  return { imageSimilarity, descriptionSimilarity, locationProximity, overall };
}
