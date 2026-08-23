// Realistic mock data scoped to Chandigarh, standing in for the MongoDB
// collections until the Express API is connected. Import shapes mirror the
// backend Mongoose models exactly so swapping in `api.get(...)` later is a
// drop-in change.
import { computeMatch } from "./aiMatchingService.js";

export const CATEGORIES = [
  "Electronics",
  "Bags",
  "Documents",
  "Jewelry",
  "Keys",
  "Wallets",
  "Apparel",
  "Other",
];

export const AREAS = [
  "Sector 17",
  "Sector 22",
  "Sector 35",
  "Sector 43 (ISBT)",
  "Elante Mall",
  "PU Campus",
  "Sukhna Lake",
  "Sector 8",
];

export const lostItems = [
  {
    id: "l1",
    type: "lost",
    name: "AirPods Pro Case",
    category: "Electronics",
    description: "White AirPods Pro charging case, small scratch on the lid, no earbuds inside.",
    images: ["airpods"],
    location: { address: "Near Neelam Cinema, Sector 17", area: "Sector 17", lat: 30.7410, lng: 76.7822 },
    occurredAt: "2026-08-09",
    status: "match_found",
    ownerName: "Ritika M.",
  },
  {
    id: "l2",
    type: "lost",
    name: "Black Leather Wallet",
    category: "Wallets",
    description: "Black leather wallet with multiple card slots and a metro card inside.",
    images: ["wallet"],
    location: { address: "Bus Stand, Sector 43 ISBT", area: "Sector 43 (ISBT)", lat: 30.7046, lng: 76.8016 },
    occurredAt: "2026-08-10",
    status: "match_found",
    ownerName: "Arjun S.",
  },
  {
    id: "l3",
    type: "lost",
    name: "College ID Card",
    category: "Documents",
    description: "Panjab University ID card, laminated, with a blue lanyard attached.",
    images: ["idcard"],
    location: { address: "Student Centre, PU Campus", area: "PU Campus", lat: 30.7599, lng: 76.7654 },
    occurredAt: "2026-08-08",
    status: "searching",
    ownerName: "Simran K.",
  },
  {
    id: "l4",
    type: "lost",
    name: "House Keys (3 on ring)",
    category: "Keys",
    description: "Three keys on a red carabiner keyring, one is a Godrej lock key.",
    images: ["keys"],
    location: { address: "Sector 35 Market", area: "Sector 35", lat: 30.7333, lng: 76.7794 },
    occurredAt: "2026-08-07",
    status: "searching",
    ownerName: "Naveen T.",
  },
  {
    id: "l5",
    type: "lost",
    name: "Grey Backpack",
    category: "Bags",
    description: "Grey Wildcraft backpack with a laptop sleeve and a small keychain on the zip.",
    images: ["backpack"],
    location: { address: "Elante Mall, Gate 2", area: "Elante Mall", lat: 30.7050, lng: 76.8018 },
    occurredAt: "2026-08-11",
    status: "searching",
    ownerName: "Pooja R.",
  },
];

export const foundItems = [
  {
    id: "f1",
    type: "found",
    name: "AirPods Case (White)",
    category: "Electronics",
    description: "Found a white earbuds case near the cinema entrance, minor scuff mark on top.",
    images: ["airpods"],
    location: { address: "Neelam Cinema Road, Sector 17", area: "Sector 17", lat: 30.7412, lng: 76.7825 },
    occurredAt: "2026-08-10",
    status: "match_found",
    finderName: "Karan V.",
  },
  {
    id: "f2",
    type: "found",
    name: "Black Wallet",
    category: "Wallets",
    description: "Black wallet, several cards inside, found near the ISBT bus bay.",
    images: ["wallet"],
    location: { address: "ISBT Sector 43, Bay 6", area: "Sector 43 (ISBT)", lat: 30.7048, lng: 76.8020 },
    occurredAt: "2026-08-10",
    status: "match_found",
    finderName: "Deepak N.",
  },
  {
    id: "f3",
    type: "found",
    name: "Silver Ring",
    category: "Jewelry",
    description: "Small silver ring with a blue stone, found near the lake promenade.",
    images: ["ring"],
    location: { address: "Sukhna Lake Promenade", area: "Sukhna Lake", lat: 30.7420, lng: 76.8188 },
    occurredAt: "2026-08-09",
    status: "searching",
    finderName: "Anita B.",
  },
  {
    id: "f4",
    type: "found",
    name: "Denim Jacket",
    category: "Apparel",
    description: "Blue denim jacket, size M, left on a bench near Sector 8 market.",
    images: ["jacket"],
    location: { address: "Sector 8 Market", area: "Sector 8", lat: 30.7386, lng: 76.7783 },
    occurredAt: "2026-08-06",
    status: "searching",
    finderName: "Rohit G.",
  },
];

// Precompute matches between lost/found pairs of the same category so the
// Explore page and map can display realistic percentages without recomputing
// on every render.
export const matches = [];
for (const lost of lostItems) {
  for (const found of foundItems) {
    if (lost.category !== found.category) continue;
    const scores = computeMatch(lost, found);
    if (scores.overall >= 60) {
      matches.push({ id: `m-${lost.id}-${found.id}`, lostItem: lost, foundItem: found, scores });
    }
  }
}

export const notifications = [
  {
    id: "n1",
    type: "match_found",
    title: "Potential Match Found",
    message: "Your lost AirPods case may match a found item near Sector 17.",
    read: false,
    createdAt: "2026-08-11T09:12:00Z",
  },
  {
    id: "n2",
    type: "claim_submitted",
    title: "Claim Submitted",
    message: "Someone has submitted a claim for the wallet you found.",
    read: false,
    createdAt: "2026-08-10T18:40:00Z",
  },
  {
    id: "n3",
    type: "claim_verified",
    title: "Claim Verified",
    message: "The ownership claim for the AirPods case has been verified.",
    read: true,
    createdAt: "2026-08-09T14:02:00Z",
  },
];

export const adminOverview = {
  totalUsers: 4218,
  lostItems: 1032,
  foundItems: 894,
  recoveries: 612,
  pendingClaims: 28,
  disputedCases: 6,
};

export const lostVsFoundByMonth = [
  { month: "Mar", lost: 120, found: 96 },
  { month: "Apr", lost: 148, found: 110 },
  { month: "May", lost: 165, found: 140 },
  { month: "Jun", lost: 190, found: 158 },
  { month: "Jul", lost: 210, found: 182 },
  { month: "Aug", lost: 199, found: 208 },
];

export const itemsByCategory = [
  { name: "Electronics", value: 412 },
  { name: "Wallets", value: 268 },
  { name: "Documents", value: 231 },
  { name: "Bags", value: 190 },
  { name: "Keys", value: 176 },
  { name: "Jewelry", value: 98 },
  { name: "Apparel", value: 88 },
  { name: "Other", value: 63 },
];

export const claimsQueue = [
  { id: "c1", item: "Black Leather Wallet", claimant: "Arjun S.", match: 91, status: "pending" },
  { id: "c2", item: "AirPods Pro Case", claimant: "Ritika M.", match: 94, status: "pending" },
  { id: "c3", item: "Grey Backpack", claimant: "Pooja R.", match: 77, status: "escalated" },
  { id: "c4", item: "Silver Ring", claimant: "Meher J.", match: 62, status: "verified" },
];
