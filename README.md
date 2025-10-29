# AudioScribe

This is a Next.js application built with Firebase and Genkit. It allows users to record audio, transcribe it to text, and then transform the text into a structured, AI-enhanced blog post complete with a cover image.

## Features

- **Audio-to-Article:** Record or upload audio and have AI generate a well-structured blog post.
- **Multi-Language Support:** Transcribe and generate content in multiple languages.
- **Personalized AI Models:** Train a custom AI on your writing style for authentic content.
- **AI Research Assistant:** Enrich articles with factual data and sources.
- **SEO Analysis:** Get AI-powered suggestions for titles, meta descriptions, and keywords.
- **Automatic Cover Images:** AI generates a relevant cover image for each article.
- **Subscription Management:** Built-in pricing tiers and payment processing with Lemon Squeezy.

## Deployment Guide (Frontend on Cloudflare)

This guide explains how to deploy the Next.js frontend of this application to a third-party hosting service like Cloudflare Pages, Vercel, or Netlify, while keeping the backend services (Firebase Auth, Firestore, Inngest) running as they are.

### Prerequisites

1.  **Firebase Project**: Your Firebase project is already set up and contains your Authentication, Firestore, and Inngest function configurations.
2.  **Cloudflare Account**: You have an account with Cloudflare (or another hosting provider).
3.  **Local Code**: You have downloaded the source code of this application.

### Step 1: Build the Next.js Application Locally

Before deploying, you need to create a production-ready build of your Next.js application.

Run the following command in your project's root directory:

```bash
npm install
npm run build
```

This command transpiles the TypeScript code, bundles your assets, and outputs a static, optimized version of your application into the `.next` directory. This is the directory you will deploy.

### Step 2: Configure Environment Variables

Your hosting provider needs to know your Firebase project's configuration to connect to it from the client-side. These keys are safe to expose publicly, as your app's security is enforced by Firestore Security Rules.

In your hosting provider's dashboard (e.g., Cloudflare Pages), find the section for "Environment Variables" and add the following keys. You can copy these values directly from your `src/firebase/config.ts` file or your Firebase project settings.

| Variable Name              | Value                                         | Description                                    |
| -------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_PROJECT_ID`   | `your-firebase-project-id`                    | Your Firebase Project ID.                      |
| `NEXT_PUBLIC_APP_ID`       | `your-firebase-app-id`                        | Your Firebase Web App ID.                      |
| `NEXT_PUBLIC_API_KEY`      | `your-firebase-api-key`                       | Your Firebase Web API Key.                     |
| `NEXT_PUBLIC_AUTH_DOMAIN`  | `your-project-id.firebaseapp.com`             | Your Firebase project's authentication domain. |

**Important**: Make sure to prefix all variables with `NEXT_PUBLIC_` so that Next.js makes them available in the browser.

### Step 3: Update Firebase Configuration in the Code

Your application is currently set up to get its Firebase config automatically from the environment. To make it work on a third-party host, you need to tell it to read from the public environment variables you just set.

Modify `src/firebase/config.ts` to use these environment variables:

```typescript
// src/firebase/config.ts

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  // Add other necessary keys like messagingSenderId if you use them
};
```

This change makes your app's frontend portable. As long as the environment variables are set correctly on the hosting platform, it will connect to the correct Firebase backend.

### Step 4: Deploy to Cloudflare Pages

1.  **Log in to Cloudflare**: Go to your Cloudflare dashboard.
2.  **Navigate to Workers & Pages**: Select "Workers & Pages" from the sidebar.
3.  **Create an Application**: Go to the "Pages" tab and click "Create application".
4.  **Connect Your Git Repository**: Connect the Git repository where your code is stored.
5.  **Set Up Build & Deployments**:
    *   **Production Branch**: Select the branch you want to deploy (e.g., `main`).
    *   **Framework Preset**: Choose **Next.js**.
    *   **Build Command**: `npm run build`
    *   **Build Output Directory**: `.next`
6.  **Add Environment Variables**: In the "Environment variables" section, add the `NEXT_PUBLIC_` variables you configured in Step 2.
7.  **Save and Deploy**: Click "Save and Deploy". Cloudflare will now build and deploy your application.

### Step 5: Configure Authorized Domains in Firebase

For security, Firebase Authentication only allows sign-ins from authorized domains.

1.  **Go to Firebase Console**: Open your Firebase project.
2.  **Navigate to Authentication**: Go to the "Authentication" section and click the "Settings" tab.
3.  **Authorized Domains**: Under "Authorized domains", click "Add domain".
4.  **Add Your Cloudflare Domain**: Add the URL provided by Cloudflare for your deployed site (e.g., `your-app.pages.dev`).

Your application is now successfully deployed! The frontend is hosted on Cloudflare, and it communicates securely with your existing Firebase backend for authentication, database operations, and background jobs.
