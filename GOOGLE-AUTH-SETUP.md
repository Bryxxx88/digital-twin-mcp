# Google OAuth Setup Guide

Your Digital Twin chat now requires Google authentication. Follow these steps to set it up:

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in App name: "Digital Twin Portfolio"
   - Add your email as support email
   - Save and continue through the scopes and test users
6. Back in Credentials, create **OAuth client ID**:
   - Application type: **Web application**
   - Name: "Digital Twin"
   - **Authorized redirect URIs**: Add these:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
7. Click **Create** and copy your:
   - Client ID
   - Client Secret

## 2. Configure Environment Variables

1. Create a `.env.local` file in your project root (it's already in .gitignore)
2. Generate an AUTH_SECRET by running:
   ```bash
   openssl rand -base64 32
   ```
3. Add these variables to `.env.local`:
   ```env
   AUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## 3. Test Locally

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Visit `http://localhost:3000`
3. Click the Digital Twin chat icon
4. You should be redirected to `/signin`
5. Click "Sign in with Google"
6. You'll be redirected to Google's login page
7. After authenticating, you'll be redirected back to your portfolio
8. Now the Digital Twin chat should work!

## 4. Deploy to Production

When deploying to Vercel:

1. Go to your project settings on Vercel
2. Add the same environment variables:
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (use your production URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. Redeploy your app
4. Make sure your Google OAuth redirect URI includes your production URL

## How It Works

- When users click the Digital Twin icon, they're redirected to sign in if not authenticated
- Google OAuth handles the entire login flow securely
- After successful login, users can access the Digital Twin chat
- Session persists across page reloads
- No need to store passwords - Google handles all authentication

## Files Created

- `auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth API endpoints
- `app/signin/page.tsx` - Custom sign-in page
- `app/providers.tsx` - Session provider wrapper
- `.env.example` - Environment variables template
