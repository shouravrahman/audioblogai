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

## Deployment Guide (Cloudflare Pages with OpenNext)

This guide explains how to deploy this Next.js application to Cloudflare Pages. We use **OpenNext**, a community-driven adapter that ensures full compatibility with Next.js features on Cloudflare.

### Step 1: Connect Your Repository to Cloudflare Pages

1.  **Log in to Cloudflare**: Go to your Cloudflare dashboard.
2.  **Navigate to Pages**: Select **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  **Select Your Git Repository**: Choose the repository for this project and click "Begin setup".

### Step 2: Configure the Build Settings

In the "Build settings" section, you need to tell Cloudflare how to build and deploy your application.

1.  **Framework Preset**: Select **Next.js** from the dropdown menu. This will pre-fill most of the correct settings.
2.  **Build command**: Ensure this is set to `npx opennext build`.
3.  **Build output directory**: Set this to `open-next`.

Your configuration should look like this:
- **Framework preset**: `Next.js`
- **Build command**: `npx opennext build`
- **Build output directory**: `open-next`

### Step 3: Configure Environment Variables

This is the most critical step. In the build settings, go to the **Environment Variables (advanced)** section. Add the following variables.

**Important**:
- Variables starting with `NEXT_PUBLIC_` are for the frontend.
- Variables without the prefix are for the backend (server-side functions).
- For secrets like API keys, always click the "Encrypt" button.

#### Firebase Keys
Find these in your Firebase project settings under **Project settings > General**.

| Variable Name                  | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| `NEXT_PUBLIC_PROJECT_ID`       | Your Firebase Project ID.                        |
| `NEXT_PUBLIC_APP_ID`           | Your Firebase Web App ID.                        |
| `NEXT_PUBLIC_API_KEY`          | Your Firebase Web API Key. **(Encrypt)**         |
| `NEXT_PUBLIC_AUTH_DOMAIN`      | Your Firebase project's authentication domain.   |
| `NEXT_PUBLIC_MESSAGING_SENDER_ID`| Your Firebase Messaging Sender ID.             |
| `NEXT_PUBLIC_BASE_URL`         | The full URL of your deployed site (e.g., `https://your-app.pages.dev`). |

#### Inngest Keys
Find these in your Inngest project dashboard under **Manage**.

| Variable Name           | Description                     |
| ----------------------- | ------------------------------- |
| `INNGEST_EVENT_KEY`     | Your Inngest event key.         |
| `INNGEST_SIGNING_KEY`   | Your Inngest signing key. **(Encrypt)** |

#### Lemon Squeezy Keys
Find these in your Lemon Squeezy dashboard under **Settings > API** and **Settings > Stores**.

| Variable Name                                    | Description                                |
| ------------------------------------------------ | ------------------------------------------ |
| `LEMONSQUEEZY_API_KEY`                           | Your Lemon Squeezy API key. **(Encrypt)**    |
| `LEMONSQUEEZY_STORE_ID`                          | Your Lemon Squeezy store ID.               |
| `LEMONSQUEEZY_WEBHOOK_SECRET`                    | Your secret for verifying webhooks. **(Encrypt)** |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID`  | The variant ID for the Pro Monthly plan.     |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID`   | The variant ID for the Pro Yearly plan.      |
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_MONTHLY_VARIANT_ID`| The variant ID for the Ultra Monthly plan.   |
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_YEARLY_VARIANT_ID` | The variant ID for the Ultra Yearly plan.    |

### Step 4: Deploy

Click **Save and Deploy**. Cloudflare will now build and deploy your application.

### Step 5: Post-Deployment Configuration

1.  **Authorize Domain in Firebase**:
    - Go to your Firebase Console > **Authentication** > **Settings** > **Authorized domains**.
    - Click **Add domain** and enter your new Cloudflare Pages domain (e.g., `your-app.pages.dev`).

2.  **Configure Lemon Squeezy Webhook**:
    - In your Lemon Squeezy dashboard, go to **Settings > Webhooks**.
    - Create a new webhook.
    - For the **Callback URL**, enter `https://<your-app-domain>/api/lemonsqueezy`.
    - Use the same **Webhook Secret** you configured in your environment variables.
    - Select the events `subscription_created` and `subscription_updated`.

Your application is now successfully deployed!
