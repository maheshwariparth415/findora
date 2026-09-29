/**
 * AI Matching Service
 * ---------------------------------------------------------------------------
 * This module is the single seam between Findora and whatever matching
 * intelligence powers it. Every caller in the codebase (matchController,
 * background jobs, etc.) imports `computeMatch` from HERE.
 */

const USE_REAL_ENGINE = Boolean(process.env.AI_MATCHING_API_URL);

/**
 * @typedef {Object} MatchScores
 * @property {number} imageSimilarity        0-100
 * @property {number} descriptionSimilarity  0-100
 * @property {number} locationProximity      0-100
 * @property {number} overall                0-100 weighted composite
 */

export async function computeMatch(lostItem, foundItem) {
  if (USE_REAL_ENGINE) {
    return callRealMatchingApi(lostItem, foundItem);
  }
  return mockMatch(lostItem, foundItem);
}

function mockMatch(lostItem, foundItem) {
  const imageSimilarity = scoreImages(lostItem, foundItem);
  const descriptionSimilarity =
    scoreText(lostItem.description, foundItem.description) *
    (lostItem.category === foundItem.category ? 1 : 0.6);
  const locationProximity = scoreLocation(lostItem, foundItem);

  const overall = Math.round(
    imageSimilarity * 0.45 + descriptionSimilarity * 0.35 + locationProximity * 0.2
  );

  return {
    imageSimilarity: clamp(Math.round(imageSimilarity)),
    descriptionSimilarity: clamp(Math.round(descriptionSimilarity)),
    locationProximity: clamp(Math.round(locationProximity)),
    overall: clamp(overall),
  };
}

function scoreText(a = "", b = "") {
  const tokenize = (s) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) || []);
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 || setB.size === 0) return 40;
  let overlap = 0;
  for (const word of setA) if (setB.has(word)) overlap += 1;
  const jaccard = overlap / (setA.size + setB.size - overlap);
  return 45 + jaccard * 55;
}

function scoreLocation(lostItem, foundItem) {
  const locA = lostItem.location;
  const locB = foundItem.location;

  const sameState =
    lostItem.state &&
    foundItem.state &&
    lostItem.state.trim().toLowerCase() === foundItem.state.trim().toLowerCase();

  const sameCity =
    lostItem.city &&
    foundItem.city &&
    lostItem.city.trim().toLowerCase() === foundItem.city.trim().toLowerCase();

  if (lostItem.state && foundItem.state && !sameState) {
    return 15;
  }

  if (locA?.lat != null && locA?.lng != null && locB?.lat != null && locB?.lng != null) {
    const distanceKm = haversineKm(locA.lat, locA.lng, locB.lat, locB.lng);
    let baseScore =
      distanceKm <= 0.3
        ? 98
        : distanceKm >= 15
        ? 20
        : Math.round(98 - (distanceKm / 15) * 78);
    if (sameCity) baseScore = Math.min(100, baseScore + 10);
    return baseScore;
  }

  if (sameCity) return 90;
  if (sameState) return 60;
  return 40;
}

function scoreImages(lostItem, foundItem) {
  const hasImages = lostItem.images?.length && foundItem.images?.length;
  const base = hasImages ? 70 : 55;
  const categoryBoost = lostItem.category === foundItem.category ? 22 : 0;
  const noise = pseudoRandom(`${lostItem._id || ""}${foundItem._id || ""}`) * 8;
  return base + categoryBoost + noise;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pseudoRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 100) / 100;
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

async function callRealMatchingApi(lostItem, foundItem) {
  const res = await fetch(process.env.AI_MATCHING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_MATCHING_API_KEY}`,
    },
    body: JSON.stringify({ lostItem, foundItem }),
  });
  if (!res.ok) throw new Error(`AI matching API responded with ${res.status}`);
  return res.json();
}