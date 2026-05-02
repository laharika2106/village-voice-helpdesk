# Village Voice Helpdesk

A real full-stack web application for village residents to submit spoken complaints, translate them into English, store them in MongoDB, and let Panchayat staff manage resolution.

## Stack

- Frontend: React, Vite, React Router, Axios, Web Speech API
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT auth, bcrypt password hashing, Helmet, rate limiting, input validation
- Uploads: Multer image uploads
- Translation: Google Translate API through the backend only

## Project Structure

```text
client/
  src/
    components/
    context/
    pages/
    services/
    styles/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    services/
  uploads/
```

## Database Collections

`users`

- `name`
- `phone`
- `role`: `villager`, `panchayat_member`, `admin`
- `village`
- `password` hashed with bcrypt

`complaints`

- `complaintId`
- `villagerName`
- `phone`
- `village`
- `ward`
- `category`
- `originalText`
- `translatedEnglishText`
- `address`
- `image`
- `status`
- `assignedTo`
- `adminResponse`
- `updates`
- `createdAt`
- `updatedAt`

## Local Setup

1. Install MongoDB locally or create a MongoDB Atlas database.

2. Configure backend environment:

```bash
cd server
cp .env.example .env
```

Set real values in `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/village_voice_helpdesk
JWT_SECRET=use_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_TRANSLATE_API_KEY=your_real_google_translate_key
```

You can also use `GOOGLE_APPLICATION_CREDENTIALS` instead of `GOOGLE_TRANSLATE_API_KEY`.

3. Install and run the backend:

```bash
cd server
npm install
npm run dev
```

4. Create the first real admin user:

```bash
cd server
ADMIN_NAME="Village President" ADMIN_PHONE="+919999999999" ADMIN_PASSWORD="StrongPassword123" ADMIN_VILLAGE="Your Village" npm run create-admin
```

On Windows PowerShell:

```powershell
$env:ADMIN_NAME="Village President"
$env:ADMIN_PHONE="+919999999999"
$env:ADMIN_PASSWORD="StrongPassword123"
$env:ADMIN_VILLAGE="Your Village"
npm run create-admin
```

Create real Panchayat member accounts for assignment:

```powershell
$env:STAFF_NAME="Ward Member"
$env:STAFF_PHONE="+918888888888"
$env:STAFF_PASSWORD="StrongPassword123"
$env:STAFF_VILLAGE="Your Village"
$env:STAFF_ROLE="panchayat_member"
npm run create-staff
```

5. Configure frontend environment:

```bash
cd client
cp .env.example .env
```

6. Install and run the frontend:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Real Voice and Translation

Voice recognition uses the browser Web Speech API, which performs real speech-to-text in supported browsers such as Chrome. Translation is handled by `POST /api/complaints/translate` on the backend using real Google Translate credentials. API keys are never placed in the React frontend.

If translation credentials are missing, complaint translation endpoints return an error instead of using fake data.

## REST API

Public:

- `GET /api/health`
- `POST /api/complaints/translate`
- `POST /api/complaints`
- `GET /api/complaints/track/:complaintId`
- `POST /api/auth/login`

Protected staff routes:

- `GET /api/auth/me`
- `GET /api/complaints`
- `GET /api/complaints/staff`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id`

## Deployment

Backend:

1. Deploy `server/` to Render, Railway, Fly.io, Azure App Service, or another Node host.
2. Add production environment variables:
   - `NODE_ENV=production`
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_ORIGIN`
   - `GOOGLE_TRANSLATE_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS`
3. Use `npm install` and `npm start`.
4. Use persistent object storage for uploads in production if your host has an ephemeral filesystem. The current local implementation stores uploads under `server/uploads`.

Frontend:

1. Deploy `client/` to Vercel, Netlify, Azure Static Web Apps, or any static host.
2. Set:
   - `VITE_API_URL=https://your-api-domain.com/api`
   - `VITE_UPLOAD_BASE_URL=https://your-api-domain.com`
3. Build with `npm run build`.
4. Serve the generated `client/dist` folder.

## Security Notes

- Passwords are hashed before storage.
- Admin routes require JWT authentication.
- User input is validated before writes.
- Mongo operator injection is sanitized.
- API keys stay in backend environment variables.
- Uploaded files are restricted to images and limited to 5 MB.
- Use HTTPS in production for microphone permissions, auth tokens, and uploads.
