# Findora — AI-Powered Smart Lost & Found Platform

Findora is a full-stack web application designed to streamline the lost-and-found process across campus and organizational environments using automated heuristic matching, secure ownership verification, and real-time status management.

---

## 📌 Phase 1: Requirement Analysis

### Problem Statement
Traditional lost-and-found systems rely on fragmented social media posts or physical notice boards, leading to low recovery rates, delayed communication, and false claims.

### Core Objectives & Features
* **Authentication & RBAC:** Role-based access control (\user\ and \dmin\) using JWT and bcrypt password hashing.
* **Item Management:** Create, browse, filter, and resolve Lost and Found listings.
* **Smart Matching:** Heuristic similarity scoring based on category, item title, and location keywords.
* **Ownership Verification & Claims:** Step-by-step claim lifecycle preventing fraudulent retrievals.
* **Admin Review Dashboard:** Centralized moderation interface to approve or reject pending ownership claims.
* **Notification System:** In-app notification stream alerting users of match updates and claim decisions.

---

## 🏗️ Phase 2: System Design & Architecture

### System Architecture
\\\
[ React + Tailwind CSS (Vite) ]
            │  (REST API / JSON)
            ▼
[ Node.js + Express.js API Gateway ]
   ├── Authentication & RBAC Middleware
   ├── Item Controller & Match Heuristic Engine
   ├── Claim & Ownership Controller
   └── Notification Controller
            │
            ▼
[ MongoDB Atlas (Mongoose ODM) ]
   ├── Users Collection
   ├── Items Collection
   ├── Claims Collection
   └── Notifications Collection
\\\

### Data Models & Schema Overview
* **User:** \
ame\, \email\, \password\ (hashed), \ole\ (\user\ | \dmin\), \createdAt\
* **Item:** \	itle\, \category\, \	ype\ (\lost\ | \ound\), \location\, \description\, \eporter\ (ref User), \status\ (\ctive\ | \claimed\ | \esolved\), \imageUrl\
* **Claim:** \item\ (ref Item), \claimant\ (ref User), \proofDescription\, \status\ (\pending\ | \pproved\ | \ejected\), \eviewedBy\ (ref User)
* **Notification:** \ecipient\ (ref User), \	ype\, \	itle\, \message\, \isRead\, \elatedItem\ (ref Item)

---

## 🚀 Phase 3: Tech Stack & Implementation

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS, Lucide Icons
* **Routing & State:** React Router DOM, Axios, Context API

### Backend
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB Atlas with Mongoose ODM
* **Security & Auth:** JSON Web Tokens (JWT), bcryptjs, CORS

---

## ⚙️ Installation & Local Setup

### 1. Backend Setup
\\\ash
cd backend
npm install
npm run dev
\\\

### 2. Frontend Setup
\\\ash
cd frontend
npm install
npm run dev
\\\

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | \/api/auth/register\ | Register new user | Public |
| POST | \/api/auth/login\ | Authenticate & issue JWT | Public |
| GET | \/api/items\ | Fetch all lost/found items | Public |
| POST | \/api/items\ | Create a lost/found listing | Authenticated |
| GET | \/api/items/:id/matches\ | Heuristic AI match suggestions | Authenticated |
| POST | \/api/claims\ | Submit ownership claim | Authenticated |
| GET | \/api/admin/claims\ | Fetch pending claims | Admin Only |
| PATCH | \/api/admin/claims/:id\ | Approve / Reject claim | Admin Only |
| GET | \/api/notifications\ | Get user notifications | Authenticated |
