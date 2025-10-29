import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

function getImage(id: string): ImagePlaceholder {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
}

export const navLinks = [
  { label: 'How it Works', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Examples', href: '#examples' },
];

export const features = [
    {
      step: 1,
      title: "Just Start Talking",
      subtitle: "Defeat the Blank Page",
      description: "Get your first draft done in record time by simply speaking your thoughts. Let our AI convert your ideas into a structured article.",
      action: "Start Recording"
    },
    {
      step: 2,
      title: "Select a Style",
      subtitle: "Define Your Voice",
      description: "Choose the tone for your article from various AI models. You can even train a model to write just like you.",
      action: "Personalize Now"
    },
    {
      step: 3,
      title: "Effortless Editing",
      subtitle: "Refine and Polish",
      description: "Quickly make adjustments to ensure the article perfectly captures your message and voice.",
      action: "Start Editing"
    },
    {
      step: 4,
      title: "Publish Everywhere",
      subtitle: "Share with the World",
      description: "With multiple export formats, you can easily copy and paste your content to any platform. More integrations are on the way.",
      action: "Start Publishing"
    }
  ];
  
export const exampleArticles = [
    {
        title: "The Future of Work is AI-Powered",
        author: "Alex Johnson",
        publication: "TechForward",
        authorAvatar: getImage('kent-c-dodds-avatar'),
        thumbnail: getImage('article-ai-job'),
    },
    {
        title: "How to Build a QR Code Generator with Stripe",
        author: "Samantha Lee",
        publication: "CodeStream",
        authorAvatar: getImage('danny-thompson-avatar'),
        publicationAvatar: getImage('this-dot-avatar'),
        thumbnail: getImage('article-stripe-app'),
    },
    {
        title: "A Guide to Mastering Quality Assurance",
        author: "Ben Carter",
        publication: "The QA Hub",
        authorAvatar: getImage('steven-boutcher-avatar'),
        thumbnail: getImage('article-qa-authority'),
    },
    {
        title: "Optimizing for Slow Connections: A User-First Approach",
        author: "Alex Johnson",
        publication: "Web Weekly",
        authorAvatar: getImage('kent-c-dodds-avatar'),
        publicationAvatar: getImage('epic-web-avatar'),
        thumbnail: getImage('article-slow-networks'),
    },
    {
        title: "GenAI vs. LLMs: What's the Difference?",
        author: "Isabella Rodriguez",
        publication: "AI Insights",
        authorAvatar: getImage('ellie-zubrowski-avatar'),
        publicationAvatar: getImage('pieces-avatar'),
        thumbnail: getImage('article-gen-ai-vs-llm'),
    },
    {
        title: "My Experience Giving Up Caffeine",
        author: "Dr. Emily White",
        publication: "Wellness Journey",
        authorAvatar: getImage('keith-newton-md-avatar'),
        thumbnail: getImage('article-quitting-caffeine'),
    },
    {
        title: "Market Trends: Three Sectors to Watch",
        author: "Robert Green",
        publication: "Finance Today",
        authorAvatar: getImage('julius-de-kempenaer-avatar'),
        publicationAvatar: getImage('stockcharts-com-avatar'),
        thumbnail: getImage('article-spy-sectors'),
    },
    {
        title: "Visual Editing in Headless CMS: A Comparison",
        author: "Daniel Anderson",
        publication: "DevCraft",
        authorAvatar: getImage('tim-benniks-avatar'),
        thumbnail: getImage('article-visual-editing'),
    },
];

export const comparisonFeatures = {
    with: [
        "Eliminate writer's block",
        "Simply talk about your topic, and let AI structure your thoughts into a polished draft.",
        "Your ideas, AI's speed",
        "The content is 100% yours. The AI only organizes and refines what you say.",
        "Authentic, original content",
        "Unlike generic tools, AudioScribe AI crafts articles based solely on your voice recordings.",
        "Develop your unique AI voice",
        "Train the AI on your past articles to make it adopt your personal writing style.",
        "One-click export",
        "Export your articles to various formats and publish them on any platform.",
    ],
    without: {
        traditional: ["Time-consuming", "Prone to writer's block", "Expensive to outsource", "Requires intense focus"],
        chatGPT: ["Generic, robotic-sounding content", "Lacks personal voice and authenticity", "Not designed as a dedicated writing tool", "Difficult to edit and format"],
    },
};

export const pricingPlans = [
    {
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        cta: 'Start for free',
        features: [
            '3 articles per month',
            '5-minute recordings',
            'Unlimited edits',
            'Standard AI model',
            'Export as plain text',
        ],
        variantIdMonthly: '',
        variantIdYearly: '',
    },
    {
        name: 'Pro',
        recommended: true,
        priceMonthly: 9,
        priceYearly: 7,
        cta: 'Get Started with Pro',
        features: [
            '15 articles per month',
            '15-minute recordings',
            'Unlimited edits',
            'Advanced AI models',
            '1 personalized AI model',
            'Export as Rich text, HTML, Markdown',
        ],
        variantIdMonthly: '468987',
        variantIdYearly: '468988',
    },
    {
        name: 'Ultra',
        priceMonthly: 25,
        priceYearly: 20,
        cta: 'Go Ultra',
        features: [
            '50 articles per month',
            '45-minute recordings',
            'Unlimited edits',
            'Advanced AI models',
            '5 personalized AI models',
            'Export as Rich text, HTML, Markdown',
            'Priority support'
        ],
        variantIdMonthly: '468989',
        variantIdYearly: '468990',
    }
];

export const footerLinks = {
    product: [
        { label: 'Pricing', href: '#pricing' },
        { label: 'How it Works', href: '#features' },
        { label: 'Examples', href: '#examples' },
    ],
    company: [
        { label: 'Blog', href: '#' },
        { label: 'About Us', href: '#' },
    ],
    legal: [
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ],
};

export const faqItems = [
    {
        question: "How does the AI transcription work?",
        answer: "We use a state-of-the-art AI model to convert your audio into text. It's designed to handle various accents and background noise, ensuring high accuracy."
    },
    {
        question: "Can I train the AI to write in my own style?",
        answer: "Absolutely! With our Pro and Ultra plans, you can provide samples of your writing (like blog posts or articles), and the AI will learn to mimic your unique voice, tone, and style."
    },
    {
        question: "What formats can I export my articles in?",
        answer: "You can export your finished articles as plain text, HTML, or Markdown, making it easy to publish on any platform like WordPress, Medium, or your personal website."
    },
    {
        question: "Is there a limit on the length of audio I can record or upload?",
        answer: "Yes, the limits depend on your plan. The Free plan allows up to 5-minute recordings, Pro allows 15 minutes, and Ultra allows up to 45 minutes per article."
    },
    {
        question: "How is my data and privacy handled?",
        answer: "We take your privacy seriously. Your audio files and generated content are yours alone. We do not use your data for any purpose other than providing the service to you. All data is securely stored and protected."
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time through the billing management portal. You will retain access to your plan's features until the end of the current billing cycle."
    }
];
