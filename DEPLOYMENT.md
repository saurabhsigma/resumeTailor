# Deployment Checklist for ResumeTailor

## Critical Environment Variables Required

Your deployment **MUST** have these environment variables set:

### Required
- `MONGODB_URI` - MongoDB connection string (cannot be localhost/127.0.0.1)
- `NEXTAUTH_SECRET` - Random secret for NextAuth sessions
- `NEXTAUTH_URL` - Full URL of your deployed app (e.g., https://yourapp.vercel.app)

### Optional but Recommended
- `GROQ_API_KEY` - For ATS analysis (falls back to Gemini if missing)
- `GOOGLE_API_KEY` - For AI features fallback
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - For image uploads
- `CLOUDINARY_API_SECRET` - For image uploads

## Common Production Issues

### 1. Internal Server Error on Homepage
**Cause**: Missing environment variables or database connection failure

**Fix**:
1. Check your deployment platform's environment variables section
2. Add all required variables from `.env.local`
3. **IMPORTANT**: Change `MONGODB_URI` from localhost to a cloud MongoDB (MongoDB Atlas recommended)
4. Set `NEXTAUTH_URL` to your actual deployment URL

### 2. MongoDB Connection Error
**Cause**: Using localhost MongoDB URL in production

**Fix**:
- Get a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
- Replace `MONGODB_URI=mongodb://127.0.0.1:27017/freelancer-saas` 
- With: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 3. NextAuth Session Errors
**Cause**: Missing or incorrect `NEXTAUTH_SECRET` or `NEXTAUTH_URL`

**Fix**:
```bash
# Generate a secure secret
openssl rand -base64 32

# Set in deployment
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-actual-domain.com
```

### 4. PDF Upload/ATS Errors
**Cause**: pdfjs-dist worker issues in serverless environment

**Status**: Already configured to use Node runtime with workers disabled
- If ATS still fails, users can paste resume text instead of uploading PDF

## Deployment Platform Guides

### Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Update `MONGODB_URI` to cloud MongoDB
4. Update `NEXTAUTH_URL` to `https://your-project.vercel.app`
5. Redeploy

### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add all variables
3. Update MongoDB and NextAuth URLs
4. Clear cache and redeploy

### Railway/Render
1. Go to Variables/Environment section
2. Add all required variables
3. Update URLs accordingly
4. Restart deployment

## Quick Debug Steps

1. Check deployment logs for:
   - ❌ Missing critical environment variables
   - ⚠️ Warning: Using localhost MongoDB
   - Error connecting to database

2. Visit `/api/auth/session` to test auth setup
   - Should return JSON (even if empty `{}`)
   - If 500 error, check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

3. Test database connection:
   - Try logging in or signing up
   - Check deployment logs for MongoDB connection errors

## Environment Variable Template for Production

```bash
# Database (REQUIRED - use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumetailor?retryWrites=true&w=majority

# Auth (REQUIRED)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-actual-domain.com

# AI Features (Optional but recommended)
GROQ_API_KEY=gsk_your_key_here
GOOGLE_API_KEY=AIza_your_key_here

# Image Uploads (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Still Getting Errors?

Check the browser console and network tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Try to navigate the site
4. Look for failed requests (red)
5. Click on failed request to see error details
6. Share the error message for further debugging
