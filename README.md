# The Leasing World

A full-stack commercial real estate leasing platform.

## Features
- **Public Website**: Hero search, featured properties, testimonials.
- **Property Listings**: Advanced filters (city, type, price).
- **Property Details**: Image gallery, amenities, lead inquiry form.
- **Admin Dashboard**: Manage properties (add/edit/delete) and leads.
- **Authentication**: JWT-based login for admins and agents.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Tools**: Lucide React (Icons), React Hook Form.

## Setup Instructions

### Backend
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example and add your MongoDB URI.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
See `deployment_guide.md` in the artifacts folder for detailed deployment instructions on Vercel and Render.
