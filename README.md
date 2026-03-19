# The Leasing World

Full-stack commercial real estate leasing platform (Next.js + Express + MongoDB).

## Overview
- **Public website**: Hero search, featured properties, testimonials.
- **Property listings**: Advanced filters (city, type, price) and property details with media, amenities, and inquiry forms.
- **Admin / agent tools**: Lead management, moderation, user administration, saved searches, shortlists, review management, and visit scheduling.
- **Authentication**: JWT-based auth with role-based access control.

## Repository layout
- `client/` — Next.js (App Router) frontend with Tailwind CSS and Framer Motion.
- `server/` — Express 5 API with MongoDB (Mongoose), JWT auth, rate limiting, and file uploads.
- `scripts/` — Helper scripts for running prefix-specific npm commands and combined dev mode.
- `render.yaml` — Render service definition for deploying the API.

## Requirements
- Node.js 18+ and npm.
- MongoDB instance.
- Cloudinary account for asset uploads.
- SMTP credentials for transactional email.

## Quick start (local)
1. Install dependencies:
   ```bash
   npm run install:all
   ```
2. Copy environment files:
   ```bash
   cp server/.env.example server/.env   # fill in values
   # optional client env:
   # echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > client/.env.local
   ```
3. Start both apps together (server on :5000, client on :3000):
   ```bash
   npm run dev
   ```
   Or run individually:
   ```bash
   npm run server   # api only
   npm run client   # frontend only
   ```
4. Open http://localhost:3000 and verify API health at http://localhost:5000/health.

## Environment variables
### Server (`server/.env`)
| Key | Description |
| --- | --- |
| `PORT` | API port (defaults to `5000`). |
| `MONGO_URI` | MongoDB connection string. |
| `CLIENT_URL` | Comma-separated origins allowed by CORS (e.g., `http://localhost:3000`). |
| `JWT_SECRET` | Secret used to sign JWTs. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for media uploads. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | SMTP settings for transactional emails. |

### Client (`client/.env.local`)
| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for API requests (defaults to `http://localhost:5000/api`). |

## API surface (high level)
> All authenticated routes expect `Authorization: Bearer <token>`. Rate limits: `/api/*` 120 req/min; `/api/auth/*` 20 req/15min.

- **Auth** (`/api/auth`): register, login, forgot/reset password, profile (GET/PUT), avatar upload (<=2 MB images).
- **Properties** (`/api/properties`): list/filter, batch fetch by IDs, suggestions, similar properties, my submissions (auth), create/update/delete (roles: admin, super_admin, agent, owner, user, builder, public_user), admin moderation and admin-all listing.
- **Leads** (`/api/leads`): create lead (public), list/update/delete (admin/agent), view my inquiries or inquiries on my properties.
- **Uploads** (`/api/upload`): images (max 10 files, 15 MB each), documents (PDF only, max 5 files, 10 MB each), videos (max 3 files, 100 MB each), fetch video upload params.
- **Shortlist** (`/api/shortlist`): add/remove/list/check saved properties (auth).
- **Saved searches** (`/api/saved-searches`): create/list/update/delete (auth).
- **Visits** (`/api/visits`): book visits (public), list my visits or agent visits, update visit (auth).
- **Reviews** (`/api/reviews`): list (public), create/delete (auth).
- **Admin users** (`/api/admin/users`): list/get users (admin/super_admin), change role (super_admin), change status (admin/super_admin).
- **Stats** (`/api/stats`): admin/agent stats.
- **Health**: `GET /health` returns `{ status: "ok" }`.

## Scripts
- `npm run install:all` — install dependencies for `server` and `client`.
- `npm run dev` — run server and client together with prefixed output.
- `npm run server` / `npm run client` — run each side in dev mode.

### Frontend scripts
- `npm run build` / `npm run start` — Next.js build and production start.
- `npm run lint` — lint frontend code.

### Backend scripts
- `npm start` — start the API.
- `npm run dev` — API with nodemon reloads.

## Deployment
- **API (Render)**: `render.yaml` is preconfigured for the `server` folder (`node index.js`, `/health` check). Set environment variables in Render and allow your frontend origin via `CLIENT_URL`.
- **Frontend (Vercel or similar)**: deploy `client/`, set `NEXT_PUBLIC_API_URL` to the deployed API URL, and ensure CORS allows that origin.

## Community & Contributing
- Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started with development.
- Respect our [Code of Conduct](CODE_OF_CONDUCT.md) when interacting with the community.
