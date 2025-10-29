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
  { label: 'Examples', href: '#examples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Features', href: '#features' },
  { label: 'Blog', href: '#' },
];

export const testimonials = [
  {
    name: 'Alex Johnson',
    title: 'Content Strategist',
    quote: "This is my go-to for turning scattered thoughts into structured content. It's incredibly fast and intuitive.",
    avatar: getImage('kent-c-dodds-avatar'),
  },
  {
    name: 'Maria Garcia',
    title: 'Freelance Writer',
    quote: "I created a full article in under 15 minutes. This has completely changed my workflow.",
    avatar: getImage('santosh-yadav-avatar'),
  },
  {
    name: 'David Chen',
    title: 'Lead Developer',
    quote: 'Just tried AudioScribe AI and was blown away! Subscribed for the year to dictate all my future posts.',
    avatar: getImage('scott-spence-avatar'),
  },
  {
    name: 'Sophia Williams',
    title: 'Digital Marketer & Accessibility Advocate',
    quote: "It's fantastic. Just speak your mind naturally, like you're talking to a friend. The AI handles the rest.",
    avatar: getImage('anne-bovelett-avatar'),
  },
  {
    name: 'James Brown',
    title: 'Engineering Manager',
    quote: "I was skeptical at first, but it's still my voice. The AI just structures my thoughts into lists and sections where they fit.",
    avatar: getImage('marc-backes-avatar'),
  },
  {
    name: 'Michael Miller',
    title: 'Software Engineer',
    quote: 'AudioScribe AI turned my rambling into a coherent blog post!',
    avatar: getImage('dominick-j-monaco-avatar'),
  },
  {
    name: 'Olivia Martinez',
    title: 'Senior Software Engineer',
    quote: 'The personalized AI model is a game-changer. I need to use this more often. Amazing work!',
    avatar: getImage('nicolas-beaussart-avatar'),
  },
  {
    name: 'Dr. Emily White',
    title: 'Physician',
    quote: "On a long commute, I drafted a whole series of newsletter articles. It's not only useful but also therapeutic to articulate my ideas and see them organized.",
    avatar: getImage('keith-newton-md-avatar'),
  },
  {
    name: 'Chloe Taylor',
    title: 'CEO, DevRel Consultant',
    quote: "If you work in Developer Relations, you need this. It's amazing to just talk freely and let the AI polish it.",
    avatar: getImage('tessa-kriesel-avatar'),
  },
  {
    name: 'Daniel Anderson',
    title: 'Developer Advocate',
    quote: 'The personalized AI feature is killer. When I generate new content, it truly sounds like me!',
    avatar: getImage('tim-benniks-avatar'),
  },
  {
    name: 'Isabella Rodriguez',
    title: 'Developer Advocate',
    quote: "This tool is so effective. It feels like the ultimate cure for writer's block.",
    avatar: getImage('ellie-zubrowski-avatar'),
  },
  {
    name: 'Ethan Wilson',
    title: 'Developer Advocate',
    quote: "A fantastic experience. I didn't have an outline, but AudioScribe AI pulled it all together logically. 10/10.",
    avatar: getImage('jason-torres-avatar'),
  },
];

export const happyUsers = [
  getImage('kent-c-dodds-avatar'),
  getImage('santosh-yadav-avatar'),
  getImage('scott-spence-avatar'),
  getImage('anne-bovelett-avatar'),
  getImage('marc-backes-avatar'),
  getImage('dominick-j-monaco-avatar'),
];


export const features = [
    {
      step: 1,
      title: "Defeat the Blank Page",
      subtitle: "Just Start Talking",
      description: "Get your first draft done in record time by simply speaking your thoughts. Let our AI convert your ideas into a structured article.",
      action: "Start Recording"
    },
    {
      step: 2,
      title: "Define Your Voice",
      subtitle: "Select a Style",
      description: "Choose the tone for your article from various AI models. You can even train a model to write just like you.",
      action: "Personalize Now"
    },
    {
      step: 3,
      title: "Refine and Polish",
      subtitle: "Effortless Editing",
      description: "Quickly make adjustments to ensure the article perfectly captures your message and voice.",
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
        { label: 'Features', href: '#features' },
    ],
    company: [
        { label: 'Blog', href: '#' },
        { label: 'About Us', href: '#' },
    ],
    legal: [
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ],
}
