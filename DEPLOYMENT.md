# ABC Luxury Tiles - Production & Cloud Deployment Guide

This guide describes how to deploy the application to production, both locally in the background using PM2 and on the cloud.

---

## Part 1: Local Background Execution (Using PM2)

If you want the website to run continuously in the background on your Mac/server without keeping a terminal open, use **PM2 (Process Manager 2)**.

### Step 1: Install PM2 Globally
Ensure you have PM2 installed on your system. Run this command:
```bash
npm install -g pm2
```

### Step 2: Build the Next.js Frontend
Next.js must be built for production before running:
```bash
npm run build --prefix frontend
```

### Step 3: Run the Application with PM2
We have configured `ecosystem.config.js` in the root folder. Launch both the backend and frontend using:
```bash
pm2 start ecosystem.config.js
```

### Step 4: Manage the Running Application
* **Check Status**: `pm2 status`
* **View Logs**: `pm2 logs`
* **Restart Services**: `pm2 restart all`
* **Stop Services**: `pm2 stop all`
* **Set to Startup** (to auto-restart if your computer reboots):
  ```bash
  pm2 startup
  pm2 save
  ```

---

## Part 2: Cloud Deployment (Live on the Internet)

To host your website publicly so anyone can access it, you will need a cloud database, an API host, and a frontend host.

### 1. Database Setup: MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and select the **FREE (M0)** cluster tier.
3. In **Database Access**, create a user (save the username and password).
4. In **Network Access**, add IP `0.0.0.0/0` to allow access from anywhere (required for serverless platforms like Vercel and Render).
5. In your cluster dashboard, click **Connect** -> **Drivers** and copy your **connection string** (it looks like `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`).

---

### 2. Backend Deployment: Render (Free Tier)
1. Go to [Render](https://render.com/) and connect your GitHub repository.
2. Create a new **Web Service**.
3. Select the repository containing your code.
4. Configure the settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add the following **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB Atlas connection string from step 1)
   - `JWT_SECRET`: (A secure random string of your choice)
   - `PORT`: `10000` (Render's default)
6. Click deploy. Render will give you a public URL (e.g. `https://abc-tiles-backend.onrender.com`).

---

### 3. Frontend Deployment: Vercel or Netlify (Free Tier)

You can choose either Vercel or Netlify to host the Next.js frontend.

#### Option A: Deploying on Vercel
1. Go to [Vercel](https://vercel.com/) and sign up.
2. Click **Add New** -> **Project** and import your GitHub repository.
3. In the project setup configuration:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Select `Next.js`
4. Expand **Environment Variables** and add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-name.onrender.com` (use the exact URL provided by Render in Step 2, without a trailing slash)
5. Click **Deploy**. Vercel will build and give you a public production URL (e.g. `https://abc-luxury-tiles.vercel.app`).

---

#### Option B: Deploying on Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign up.
2. Click **Add new site** -> **Import an existing project**.
3. Connect your Git provider and select your repository.
4. Netlify will automatically detect the settings from the `netlify.toml` file at the root:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Under **Environment variables**, click **Add Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-name.onrender.com` (use the exact URL provided by Render/Railway for your backend, without a trailing slash)
6. Click **Deploy site**. Netlify will automatically build the Next.js app and assign a subdomain (e.g., `https://abctiles.netlify.app`).

> [!WARNING]
> Without setting up the root `netlify.toml`, Netlify may host raw repository files directly, which exposes your codebase publically and returns 404s. Ensure `netlify.toml` is committed to the root of the repository before deploying.


