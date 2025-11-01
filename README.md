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

1.  **Firebase Project**: Your Firebase project is already set up and contains your Authentication and Firestore configurations.
2.  **Inngest Account**: You have a free account with [Inngest](https://www.inngest.com/) to manage background jobs.
3.  **Lemon Squeezy Account**: You have an account with [Lemon Squeezy](https://www.lemonsqueezy.com/) for payment processing.
4.  **Cloudflare Account**: You have an account with Cloudflare (or another hosting provider).
5.  **Local Code**: You have downloaded the source code of this application.

### Step 1: Build the Next.js Application Locally

Before deploying, you need to create a production-ready build of your Next.js application.

Run the following command in your project's root directory:

```bash
npm install
npm run build
```

This command transpiles the TypeScript code, bundles your assets, and outputs a static, optimized version of your application into the `.next` directory. This is the directory you will deploy.

### Step 2: Configure Environment Variables

Your hosting provider needs a complete set of secrets and keys to connect to Firebase, Inngest, and Lemon Squeezy.

In your hosting provider's dashboard (e.g., Cloudflare Pages), find the section for "Environment Variables" and add the following keys. 

#### Firebase Keys
You can copy these values directly from your `src/firebase/config.ts` file or your Firebase project settings.

| Variable Name              | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_PROJECT_ID`   | Your Firebase Project ID.                      |
| `NEXT_PUBLIC_APP_ID`       | Your Firebase Web App ID.                      |
| `NEXT_PUBLIC_API_KEY`      | Your Firebase Web API Key.                     |
| `NEXT_PUBLIC_AUTH_DOMAIN`  | Your Firebase project's authentication domain. |

**Important**: Make sure to prefix Firebase variables with `NEXT_PUBLIC_` so that Next.js makes them available in the browser.

#### Inngest Keys
Sign in to your Inngest account and find your **Signing Key** under the "Manage" section of your project.

| Variable Name           | Description           |
| ----------------------- | --------------------- |
| `INNGEST_SIGNING_KEY`   | Your Inngest signing key. |

#### Lemon Squeezy Keys
Sign in to your Lemon Squeezy account. You can find your **Store ID** in the "Settings > Stores" page, and you can create an **API Key** and **Webhook Secret** in "Settings > API". The **Variant IDs** can be found on each product variant's page.

| Variable Name                                    | Description                             |
| ------------------------------------------------ | --------------------------------------- |
| `LEMONSQUEEZY_API_KEY`                           | Your Lemon Squeezy API key.             |
| `LEMONSQUEEZY_STORE_ID`                          | Your Lemon Squeezy store ID.            |
| `LEMONSQUEEZY_WEBHOOK_SECRET`                    | Your secret for verifying webhooks.     |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID`  | The variant ID for the Pro Monthly plan.  |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID`   | The variant ID for the Pro Yearly plan.   |
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_MONTHLY_VARIANT_ID`| The variant ID for the Ultra Monthly plan.|
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_YEARLY_VARIANT_ID` | The variant ID for the Ultra Yearly plan. |


### Step 3: Deploy to Cloudflare Pages

1.  **Log in to Cloudflare**: Go to your Cloudflare dashboard.
2.  **Navigate to Workers & Pages**: Select "Workers & Pages" from the sidebar.
3.  **Create an Application**: Go to the "Pages" tab and click "Create application".
4.  **Connect Your Git Repository**: Connect the Git repository where your code is stored.
5.  **Set Up Build & Deployments**:
    *   **Production Branch**: Select the branch you want to deploy (e.g., `main`).
    *   **Framework Preset**: Choose **Next.js**.
    *   **Build Command**: `npm run build`
    *   **Build Output Directory**: `.next`
6.  **Add Environment Variables**: In the "Environment variables" section, add all the variables you configured in Step 2.
7.  **Save and Deploy**: Click "Save and Deploy". Cloudflare will now build and deploy your application.

### Step 4: Configure Authorized Domains in Firebase

For security, Firebase Authentication only allows sign-ins from authorized domains.

1.  **Go to Firebase Console**: Open your Firebase project.
2.  **Navigate to Authentication**: Go to the "Authentication" section and click the "Settings" tab.
3.  **Authorized Domains**: Under "Authorized domains", click "Add domain".
4.  **Add Your Cloudflare Domain**: Add the URL provided by Cloudflare for your deployed site (e.g., `your-app.pages.dev`).

Your application is now successfully deployed! The frontend is hosted on Cloudflare, and it communicates securely with your existing Firebase backend for authentication, database operations, and background jobs.
