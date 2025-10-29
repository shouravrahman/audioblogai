import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

function getImage(id: string): ImagePlaceholder {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default/fallback image placeholder to avoid crashing
    const fallbackImage = PlaceHolderImages.find((img) => img.id === 'demo-video-thumbnail');
    if (fallbackImage) return fallbackImage;
    // If even the fallback is not found, throw an error or handle it gracefully
    throw new Error(`Image with id "${id}" not found, and fallback is also missing.`);
  }
  return image;
}

export const navLinks = [
  { label: 'How it Works', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
];

export const features = [
    {
      step: 1,
      title: "Defeat the Blank Page",
      subtitle: "Just Start Talking",
      description: "Get your first draft done in record time by simply speaking your thoughts. Let our AI convert your ideas into a structured article in multiple languages.",
      action: "Start Recording"
    },
    {
      step: 2,
      title: "From Speech to Structure",
      subtitle: "AI-Powered Transcription",
      description: "Choose the tone for your article from various AI models. You can even train a model to write just like you.",
      action: "Personalize Now"
    },
    {
      step: 3,
      title: "Add Depth and Credibility",
      subtitle: "Enrich & Optimize",
      description: "Use our AI Research Assistant to add supporting data and sources. Then, analyze your article's SEO to improve its ranking potential.",
      action: "Start Editing"
    },
    {
      step: 4,
      title: "Share with the World",
      subtitle: "Publish Everywhere",
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
        "Research & SEO Tools",
        "Enrich articles with factual data and optimize them for search engines with AI analysis.",
    ],
    without: {
        traditional: ["Time-consuming", "Prone to writer's block", "Expensive to outsource", "Requires intense focus"],
        chatGPT: ["Generic, robotic-sounding content", "Lacks personal voice and authenticity", "No integrated research or SEO tools", "Difficult to edit and format"],
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
            'Multi-language support',
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
            'Multi-language support',
            '1 personalized AI model',
            'AI Research Assistant',
            'SEO Analysis Tools',
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
            'Multi-language support',
            '5 personalized AI models',
            'AI Research Assistant',
            'SEO Analysis Tools',
            'Export as Rich text, HTML, Markdown',
            'Priority support'
        ],
        variantIdMonthly: '468989',
        variantIdYearly: '468990',
    }
];

export const footerLinks = {
    product: [
        { label: 'Pricing', href: '/#pricing' },
        { label: 'How it Works', href: '/#features' },
        { label: 'Blog', href: '/blog' },
    ],
    company: [
        { label: 'About Us', href: '#' },
    ],
    legal: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
    ],
};

export const languages = [
  { name: 'English (US)', code: 'en-US' },
  { name: 'Spanish (Spain)', code: 'es-ES' },
  { name: 'French (France)', code: 'fr-FR' },
  { name: 'German (Germany)', code: 'de-DE' },
  { name: 'Italian (Italy)', code: 'it-IT' },
  { name: 'Portuguese (Brazil)', code: 'pt-BR' },
  { name: 'Russian (Russia)', code: 'ru-RU' },
  { name: 'Japanese (Japan)', code: 'ja-JP' },
  { name: 'Chinese (Mandarin, Simplified)', code: 'zh-CN' },
  { name: 'Korean (South Korea)', code: 'ko-KR' },
];

export const faqItems = [
    {
        question: "What is AudioScribe AI?",
        answer: "AudioScribe AI is a platform that transforms your spoken audio into well-structured, SEO-optimized, and researched articles. It's designed for content creators, experts, and marketers to turn ideas into polished content with minimal friction."
    },
    {
        question: "Who is this for?",
        answer: "It's for anyone who wants to create written content more efficiently. This includes bloggers, podcasters, YouTubers, founders, consultants, developers, and marketing teams who want to produce authentic content at scale."
    },
    {
        question: "How does the AI work?",
        answer: "When you upload an audio file, our AI, powered by Google's Gemini models, first transcribes the audio to text. Then, another AI flow structures this text into a blog post, adding a title, headings, and lists. You can also use our research and SEO tools to enrich the content further."
    },
    {
        question: "Can the AI write in my personal style?",
        answer: "Yes! With a paid plan, you can train a personalized AI model. By providing 3 or more of your past writing samples, the AI learns your unique tone, vocabulary, and sentence structure to generate content that sounds just like you."
    },
    {
        question: "Which languages are supported?",
        answer: "AudioScribe AI supports transcription and content generation in multiple languages, including English, Spanish, French, German, and more. You can select your preferred language when you create a new article."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, your data security is a top priority. All of your data, including audio files and generated articles, is stored securely and is only accessible by you. We use Firebase's robust security rules to ensure data privacy."
    }
];

export const testimonials = [
  {
      name: 'Sarah K.',
      title: 'Content Creator',
      quote:
        "AudioScribe AI has been a game-changer for my workflow. I can now produce a week's worth of blog content from a single podcast episode. The personalized AI model is pure magic – it actually sounds like me!",
      avatar: getImage('anne-bovelett-avatar'),
    },
    {
      name: 'Alex J.',
      title: 'Founder & CEO',
      quote:
        "As a founder, I have a lot of ideas but very little time to write. This tool allows me to capture my thoughts on the go and turn them into coherent articles for our company blog. It's like having a ghostwriter that's also a mind-reader.",
      avatar: getImage('kent-c-dodds-avatar'),
    },
    {
      name: 'Maria G.',
      title: 'Marketing Manager',
      quote:
        "We've been able to scale our content production by 3x without sacrificing quality. The ability to train the AI on our brand's voice guide ensures every article is consistent, no matter which team member records the audio.",
      avatar: getImage('tessa-kriesel-avatar'),
    },
    {
        name: 'Dr. Ben C.',
        title: 'Subject Matter Expert',
        quote: "I'm an expert in my field, not a writer. AudioScribe AI bridges that gap perfectly. I can speak naturally about complex topics, and the AI handles the difficult task of structuring it into a readable format. The research assistant is a huge bonus.",
        avatar: getImage('keith-newton-md-avatar'),
    },
    {
        name: 'Danny T.',
        title: 'Developer Advocate',
        quote: "I used to spend hours converting my conference talks into blog posts. Now, I just upload the audio, and I get a first draft that's 80% of the way there. The time savings are enormous, and the SEO tools help my content get seen.",
        avatar: getImage('danny-thompson-avatar'),
    },
    {
        name: 'Isabella R.',
        title: 'Podcaster',
        quote: "The biggest friction in my process was turning an hour-long interview into show notes and a blog post. AudioScribe AI automates this entire process. I can't imagine going back to doing it manually.",
        avatar: getImage('ellie-zubrowski-avatar'),
    },
];
