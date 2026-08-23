/**
 * AI Matching Service
 * ---------------------------------------------------------------------------
 * This module is the single seam between Findora and whatever matching
 * intelligence powers it. Every caller in the codebase (matchController,
 * background jobs, etc.) imports `computeMatch` from HERE and never touches
 * an image-similarity or NLP model directly.
 *
 * Today, `computeMatch` runs a deterministic MOCK engine so the product is
 * fully demo-able without any paid AI API or trained model. To go live with
 * a real model:
 *
 *   1. Implement `callRealMatchingApi(lostItem, foundItem)` below using
 *      process.env.AI_MATCHING_API_URL / AI_MATCHING_API_KEY.
 *   2. Flip `USE_REAL_ENGINE` to true once that endpoint is reachable.
 *
 * No other file in the app needs to change.
 */

const USE_REAL_ENGINE = Boolean(process.env.AI_MATCHING_API_URL);

/**
 * @typedef {Object} MatchScores
 * @property {number} imageSimilarity        0-100
 * @property {number} descriptionSimilarity  0-100
 * @property {number} locationProximity      0-100
 * @property {number} overall                0-100 weighted composite
 */

/**
 * @param {import("../models/Item.js").default} lostItem
 * @param {import("../models/Item.js").default} foundItem
 * @returns {Promise<MatchScores>}
 */
export async function computeMatch(lostItem, foundItem) {
  if (USE_REAL_ENGINE) {
    return callRealMatchingApi(lostItem, foundItem);
  }
  return mockMatch(lostItem, foundItem);
}

// ---------------------------------------------------------------------------
// Mock engine — realistic, explainable, and fully deterministic (same pair
// of items always produces the same score), which makes demos reproducible.
// ---------------------------------------------------------------------------
function mockMatch(lostItem, foundItem) {
  const imageSimilarity = scoreImages(lostItem, foundItem);
  const descriptionSimilarity = scoreText(lostItem.description, foundItem.description) *
    (lostItem.category === foundItem.category ? 1 : 0.6);
  const locationProximity = scoreLocation(lostItem.location, foundItem.location);

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

// Word-overlap heuristic standing in for a real embedding-similarity model.
function scoreText(a = "", b = "") {
  const tokenize = (s) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) || []);
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 || setB.size === 0) return 40;
  let overlap = 0;
  for (const word of setA) if (setB.has(word)) overlap += 1;
  const jaccard = overlap / (setA.size + setB.size - overlap);
  return 45 + jaccard * 55; // keeps a realistic floor, avoids 0% scores
}

// Haversine distance converted to a 0-100 proximity score. Stands in for a
// real geo-clustering step.
function scoreLocation(locA, locB) {
  if (!locA || !locB) return 50;
  const distanceKm = haversineKm(locA.lat, locA.lng, locB.lat, locB.lng);
  if (distanceKm <= 0.3) return 98;
  if (distanceKm >= 15) return 20;
  return Math.round(98 - (distanceKm / 15) * 78);
}

// Placeholder for real perceptual-hash / CNN embedding comparison. Uses a
// stable hash of the image URLs plus category match so results stay
// deterministic across runs without any actual computer vision.
function scoreImages(lostItem, foundItem) {
  const hasImages = lostItem.images?.length && foundItem.images?.length;
  const base = hasImages ? 70 : 55;
  const categoryBoost = lostItem.category === foundItem.category ? 22 : 0;
  const noise = pseudoRandom(`${lostItem._id}${foundItem._id}`) * 8;
  return base + categoryBoost + noise;
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

// ---------------------------------------------------------------------------
// Real engine stub — wire up a hosted model or the Anthropic/OpenAI vision +
// text APIs here. Left intentionally unimplemented so nothing calls out to
// the network unless AI_MATCHING_API_URL is actually configured.
// ---------------------------------------------------------------------------
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
