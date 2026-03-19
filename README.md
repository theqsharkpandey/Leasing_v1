# The Leasing World

A comprehensive, full-stack commercial real estate leasing platform designed to connect property owners, agents, and businesses. Built with Next.js, Express, and MongoDB, this platform streamlines property listings, automates lead generation, and provides a robust admin moderation workflow to ensure high-quality listings and seamless user experiences.

## 🚀 Live Demo

- **Frontend Application**: [Live Demo Link (Placeholder)](#)
- **Backend API URL**: [Live API Link (Placeholder)](#)

## 📸 Screenshots

| Homepage | Property Details | Admin Dashboard |
|:---:|:---:|:---:|
| ![Homepage Placeholder](https://via.placeholder.com/400x250?text=Homepage) | ![Property Details Placeholder](https://via.placeholder.com/400x250?text=Property+Details) | ![Admin Dashboard Placeholder](https://via.placeholder.com/400x250?text=Admin+Dashboard) |

## ✨ Key Features

- **Role-Based Access Control (RBAC)**: Secure access management for `super_admin`, `admin`, `agent`, `owner`, `builder`, and `user` roles.
- **Property Moderation Workflow**: Built-in approval mechanisms where submitted properties are reviewed by admins before appearing to the public.
- **Media Uploads (Cloudinary)**: Scalable and optimized handling of images (up to 15MB), PDFs (up to 10MB), and videos (up to 100MB).
- **Lead Management**: Tools for admins and agents to track, update, and respond to incoming property inquiries efficiently.
- **Saved Searches and Shortlists**: Personalized user dashboards to track favorite properties and monitor custom search criteria.
- **Visit Scheduling**: Integrated calendar scheduling for users to easily book property tours.
- **Authentication System**: Secure, JWT-based user authentication including password reset functionality.

## 🏗️ System Architecture

```text
         [ Client (Next.js 14) ]
                   │
           REST API (JSON)
                   ▼
[ Backend (Node.js/Express 5) ] ──▶ [ Cloudinary (Media Storage) ]
                   │
                Mongoose
                   ▼
          [ Database (MongoDB) ]
```

## 🛠️ Repository Structure

- `client/` — Next.js (App Router) frontend with Tailwind CSS and Framer Motion.
- `server/` — Express 5 API with MongoDB (Mongoose), JWT authentication, rate limiting, and file uploads.
- `scripts/` — Helper scripts for running prefix-specific npm commands and a combined development mode.
- `render.yaml` — Render service definition for deploying the backend API.

## ⚙️ Requirements

- **Node.js**: v18+ and npm
- **Database**: Active MongoDB instance
- **Media**: Cloudinary account for asset uploads
- **Email**: SMTP credentials for transactional emails

## 🚦 Quick Start (Local Setup)

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```
2. **Copy environment files**:
   ```bash
   cp server/.env.example server/.env   # fill in required values
   # optional client env:
   # echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > client/.env.local
   ```
3. **Start both applications** (server on `:5000`, client on `:3000`):
   ```bash
   npm run dev
   ```
   *Alternatively, run them individually:*
   ```bash
   npm run server   # api only
   npm run client   # frontend only
   ```
4. **Verify**: Open `http://localhost:3000` and check API health at `http://localhost:5000/health`.

## 🔐 Environment Variables

### Server (`server/.env`)

| Key | Description |
| --- | --- |
| `PORT` | API port (defaults to `5000`). |
| `MONGO_URI` | MongoDB connection string. |
| `CLIENT_URL` | Comma-separated origins allowed by CORS (e.g., `http://localhost:3000`). |
| `JWT_SECRET` | Secret used to sign JWTs. |
| `CLOUDINARY_CLOUD_NAME` <br> `CLOUDINARY_API_KEY` <br> `CLOUDINARY_API_SECRET` | Cloudinary credentials for media uploads. |
| `SMTP_HOST` <br> `SMTP_PORT` <br> `SMTP_USER` <br> `SMTP_PASS` <br> `EMAIL_FROM` | SMTP settings for transactional emails. |

### Client (`client/.env.local`)

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for API requests (defaults to `http://localhost:5000/api`). |

## 📡 API Documentation (High Level)

> **Note**: All authenticated routes expect an `Authorization: Bearer <token>` header. 
> **Rate Limits**: `/api/*` (120 req/min) | `/api/auth/*` (20 req/15min).

- **Auth** (`/api/auth`): register, login, forgot/reset password, profile (GET/PUT), avatar upload (<=2 MB images).
- **Properties** (`/api/properties`): list/filter, batch fetch by IDs, suggestions, similar properties, my submissions (auth), create/update/delete (roles: admin, super_admin, agent, owner, user, builder, public_user), admin moderation and admin-all listing.
- **Leads** (`/api/leads`): create lead (public), list/update/delete (admin/agent), view my inquiries or inquiries on my properties.
- **Uploads** (`/api/upload`): images (max 10 files, 15 MB each), documents (PDF only, max 5 files, 10 MB each), videos (max 3 files, 100 MB each), fetch video upload params.
- **Shortlist** (`/api/shortlist`): add/remove/list/check saved properties (auth).
- **Saved Searches** (`/api/saved-searches`): create/list/update/delete (auth).
- **Visits** (`/api/visits`): book visits (public), list my visits or agent visits, update visit (auth).
- **Reviews** (`/api/reviews`): list (public), create/delete (auth).
- **Admin Users** (`/api/admin/users`): list/get users (admin/super_admin), change role (super_admin), change status (admin/super_admin).
- **Stats** (`/api/stats`): Retrieve admin/agent performance statistics.
- **Health**: `GET /health` returns `{ status: "ok" }`.

## 📜 Scripts

- `npm run install:all` — Install dependencies for both `server` and `client`.
- `npm run dev` — Run server and client together with prefixed console output.
- `npm run server` / `npm run client` — Run backend or frontend isolated in development mode.

### Frontend Scripts (`client/`)
- `npm run build` / `npm run start` — Next.js build and production server start.
- `npm run lint` — Lint React/Next.js frontend code.

### Backend Scripts (`server/`)
- `npm start` — Start the Express API in production.
- `npm run dev` — Start the Express API with `nodemon` for auto-reloading.

## 🚀 Deployment

- **API (Render)**: The `render.yaml` file is preconfigured for the `server` directory (runs `node index.js`, checks `/health`). Set environment variables in Render and add your frontend origin to `CLIENT_URL`.
- **Frontend (Vercel/Netlify)**: Deploy the `client/` folder. Ensure `NEXT_PUBLIC_API_URL` points to your Render backend API URL and that CORS is configured correctly to allow the frontend origin.

## 🤝 Community & Contributing

- Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started with development.
- Respect our [Code of Conduct](CODE_OF_CONDUCT.md) when interacting with the community.

## 🔮 Future Enhancements

- **AI-Based Property Recommendation**: Personalized property suggestions based on user behavior and preferences.
- **Lead Scoring System**: Automated prioritization and scoring of leads to help agents focus on high-intent clients.
- **WhatsApp/Email Automation**: Automated notifications for visit reminders, status updates, and new matching listings.
- **Analytics Dashboard**: Comprehensive data visualization for owners and admins regarding listing performance.

## 👤 Author

**Kushagra Pandey**  
*B.Tech CSE (AI)*
