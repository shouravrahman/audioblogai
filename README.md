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

## Environment Variables

To run this project locally and deploy it, you will need to set the following environment variables. You can create a `.env.local` file in the root of your project for local development.

#### Firebase Keys
Find these in your Firebase project settings under **Project settings > General**.

| Variable Name                  | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| `NEXT_PUBLIC_PROJECT_ID`       | Your Firebase Project ID.                        |
| `NEXT_PUBLIC_APP_ID`           | Your Firebase Web App ID.                        |
| `NEXT_PUBLIC_API_KEY`          | Your Firebase Web API Key.                       |
| `NEXT_PUBLIC_AUTH_DOMAIN`      | Your Firebase project's authentication domain.   |
| `NEXT_PUBLIC_MESSAGING_SENDER_ID`| Your Firebase Messaging Sender ID.             |
| `NEXT_PUBLIC_BASE_URL`         | The full URL of your deployed site (e.g., `https://your-app.com`). |

#### Genkit/Google AI Keys
Find these in your Google Cloud Console.

| Variable Name           | Description                     |
| ----------------------- | ------------------------------- |
| `GEMINI_API_KEY`     | Your Google AI API key for Genkit.         |


#### Inngest Keys
Find these in your Inngest project dashboard under **Manage**.

| Variable Name           | Description                     |
| ----------------------- | ------------------------------- |
| `INNGEST_EVENT_KEY`     | Your Inngest event key.         |
| `INNGEST_SIGNING_KEY`   | Your Inngest signing key.       |

#### Lemon Squeezy Keys
Find these in your Lemon Squeezy dashboard under **Settings > API** and **Settings > Stores**.

| Variable Name                                    | Description                                |
| ------------------------------------------------ | ------------------------------------------ |
| `LEMONSQUEEZY_API_KEY`                           | Your Lemon Squeezy API key.                |
| `LEMONSQUEEZY_STORE_ID`                          | Your Lemon Squeezy store ID.               |
| `LEMONSQUEEZY_WEBHOOK_SECRET`                    | Your secret for verifying webhooks.        |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID`  | The variant ID for the Pro Monthly plan.     |
| `NEXT_PUBLIC_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID`   | The variant ID for the Pro Yearly plan.      |
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_MONTHLY_VARIANT_ID`| The variant ID for the Ultra Monthly plan.   |
| `NEXT_PUBLIC_LEMONSQUEEZY_ULTRA_YEARLY_VARIANT_ID` | The variant ID for the Ultra Yearly plan.    |

## Deployment

This project is configured to produce a standalone Node.js server output. It can be deployed to any hosting provider that supports Node.js applications.

The build command (`npm run build`) will create a `.next/standalone` directory. You will need to deploy this directory to your hosting provider. The server can be started by running `node .next/standalone/server.js`.

Please consult your hosting provider's documentation for instructions on deploying a standalone Next.js application.
