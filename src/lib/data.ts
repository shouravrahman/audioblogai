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
  { label: 'Roadmap', href: '#' },
  { label: 'Blog', href: '#' },
];

export const testimonials = [
  {
    name: 'Kent C. Dodds',
    title: 'Software Engineer and Educator',
    quote: "It's my favorite way to quickly go from disorganized thoughts into an organized post.",
    avatar: getImage('kent-c-dodds-avatar'),
  },
  {
    name: 'Santosh Yadav',
    title: 'Software Engineer',
    quote: "I was able to create a blog post in 10 minutes. This is a game changer.",
    avatar: getImage('santosh-yadav-avatar'),
  },
  {
    name: 'Scott Spence',
    title: 'Application Team Lead',
    quote: 'Just tried Blog Recorder and was really impressed! Just paid the annual subscription so I can start dictating my blog posts!',
    avatar: getImage('scott-spence-avatar'),
  },
  {
    name: 'Anne Bovelett',
    title: 'Agency Guide for WordPress & Accessibility',
    quote: 'This is so great! Speak your mind, don\'t think about form. Just like you would tell something to a friend. Or explain it to a customer. It works.',
    avatar: getImage('anne-bovelett-avatar'),
  },
  {
    name: 'Marc Backes',
    title: 'Team Lead',
    quote: "I'm blown away. Initially I was skeptical \"I don't want an AI to write my thoughts\" but the thing is that it's still my thoughts. It writes it out AND prepares lists, etc. where necessary.",
    avatar: getImage('marc-backes-avatar'),
  },
  {
    name: 'Dominick J. Monaco',
    title: 'Software Engineer',
    quote: 'Blog Recorder took my talking and made it into a succinct blog!',
    avatar: getImage('dominick-j-monaco-avatar'),
  },
  {
    name: 'Nicolas Beaussart',
    title: 'Staff Software Engineer',
    quote: 'The new personal AI model is amazing! I want to use it even more. Great job!',
    avatar: getImage('nicolas-beaussart-avatar'),
  },
  {
    name: 'Keith Newton, MD',
    title: 'Doctor',
    quote: "During a long drive, I used blog recorder to generate drafts for a series of newsletter articles I'm working on. In addition to being very useful, it's therapeutic to talk about your idea, then have it outlined into something cohesive.",
    avatar: getImage('keith-newton-md-avatar'),
  },
  {
    name: 'Tessa Kriesel',
    title: 'CEO, Developer Relations Expert',
    quote: "If you're in Developer Relations you NEED this tool. How awesome is it that you can just speak, be random and rambly, and let Blog Recorder make it amazing?",
    avatar: getImage('tessa-kriesel-avatar'),
  },
  {
    name: 'Tim Benniks',
    title: 'Developer Advocate',
    quote: 'Blog Recorder added a feature to create a personalized AI for writing the way "you" like to write. This is a killer feature. When I create new post ideas the writing is literally in my voice!',
    avatar: getImage('tim-benniks-avatar'),
  },
  {
    name: 'Ellie Zubrowski',
    title: 'Developer Advocate',
    quote: "Blog recorder is so good! I feel like it's the cure for writers block.",
    avatar: getImage('ellie-zubrowski-avatar'),
  },
  {
    name: 'Jason Torres',
    title: 'Developer Advocate',
    quote: "It was a fantastic experience. I didn't have a specific outline going in and Blog Recorder brought it all together, and it makes actual sense! 10/10",
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
      title: "Never stare at a blank page again",
      subtitle: "Talk about your topic",
      description: "Get to your first draft faster than ever by talking about your topic. Let AI turn your thoughts into the first version of your article.",
      action: "Start talking"
    },
    {
      step: 2,
      title: "Choose how it sounds",
      subtitle: "Pick a style",
      description: "Choose which style your article will be written in by choosing one of the available AI models. You can even train your own AI models.",
      action: "Start personalizing"
    },
    {
      step: 3,
      title: "Add a finishing touch",
      subtitle: "Edit with ease",
      description: "Make changes where necessary to make your article sound just right.",
      action: "Start writing"
    },
    {
      step: 4,
      title: "Post anywhere",
      subtitle: "Publish on your favorite blogging platform",
      description: "Multiple export options allow you to easily copy and paste to every platform. Direct connections are coming later.",
      action: "Start publishing"
    }
  ];
  
export const exampleArticles = [
    {
        title: "AI is taking your job",
        author: "Kent C. Dodds",
        publication: "Kent C. Dodds's Blog",
        authorAvatar: getImage('kent-c-dodds-avatar'),
        thumbnail: getImage('article-ai-job'),
    },
    {
        title: "Building a Stripe App: A Step-by-Step Guide to QR Code Generation",
        author: "Danny Thompson",
        publication: "This Dot",
        authorAvatar: getImage('danny-thompson-avatar'),
        publicationAvatar: getImage('this-dot-avatar'),
        thumbnail: getImage('article-stripe-app'),
    },
    {
        title: "My Journey to Building Authority in QA",
        author: "Steven Boutcher",
        publication: "Steven Boutcher's Blog",
        authorAvatar: getImage('steven-boutcher-avatar'),
        thumbnail: getImage('article-qa-authority'),
    },
    {
        title: "Embracing Slow Networks: Improving User Experience",
        author: "Kent C. Dodds",
        publication: "Epic Web",
        authorAvatar: getImage('kent-c-dodds-avatar'),
        publicationAvatar: getImage('epic-web-avatar'),
        thumbnail: getImage('article-slow-networks'),
    },
    {
        title: "Generative AI vs LLMs: Key differences explained",
        author: "Ellie Zubrowski",
        publication: "Pieces",
        authorAvatar: getImage('ellie-zubrowski-avatar'),
        publicationAvatar: getImage('pieces-avatar'),
        thumbnail: getImage('article-gen-ai-vs-llm'),
    },
    {
        title: "Quitting caffeine",
        author: "Keith Newton",
        publication: "Keith Newton's Blog",
        authorAvatar: getImage('keith-newton-md-avatar'),
        thumbnail: getImage('article-quitting-caffeine'),
    },
    {
        title: "Three Sectors Leading SPY Back to Offense",
        author: "Julius de Kempenaer",
        publication: "StockCharts.com",
        authorAvatar: getImage('julius-de-kempenaer-avatar'),
        publicationAvatar: getImage('stockcharts-com-avatar'),
        thumbnail: getImage('article-spy-sectors'),
    },
    {
        title: "Different Approaches to Visual Editing in Headless CMS",
        author: "Tim Benniks",
        publication: "Tim Benniks's Blog",
        authorAvatar: getImage('tim-benniks-avatar'),
        thumbnail: getImage('article-visual-editing'),
    },
];

export const comparisonFeatures = {
    with: [
        "Never stare at a blank page",
        "Skip the writing block - just talk naturally about your topic and watch as AI transforms your spoken thoughts into a structured article.",
        "Your creativity with the speed of AI",
        "Your voice recordings power the content - nothing gets added that you didn't say.",
        "Content that's uniquely yours",
        "Unlike ChatGPT, Blog Recorder doesn't pull from a general dataset. It structures and formats only what you've recorded.",
        "Make it sound just like you",
        "Train Blog Recorder on your existing articles to make it write just like you.",
        "Publish anywhere",
        "Export your articles in multiple formats and publish on any blogging platform.",
    ],
    without: {
        traditional: ["Writer's block", "Slow", "Expensive", "Or paying someone to write for you (even more expensive)"],
        chatGPT: ["Anyone can do this", "Every article is created from a general dataset. Other people's articles will be exactly the same.", "Does not sound human", "No export to multiple formats", "It's not a writing tool, editing will be annoying"],
    },
};

export const pricingPlans = [
    {
        name: 'Starter',
        priceMonthly: 12,
        priceYearly: 140 / 12,
        yearlyBilling: 140,
        yearlyDiscount: 28,
        cta: 'Start with 3 free articles →',
        features: [
            '5 articles per month',
            '15 minute long recordings',
            'Unlimited edits',
            'Export as Rich text, HTML, Markdown, or plain text',
            '1 personalized AI model',
            'Access to Discord community'
        ]
    },
    {
        name: 'Blogger',
        recommended: true,
        priceMonthly: 23,
        priceYearly: 270 / 12,
        yearlyBilling: 270,
        yearlyDiscount: 54,
        cta: 'Start with 3 free articles →',
        features: [
            '15 articles per month',
            '30 minute long recordings',
            'Unlimited edits',
            'Export as Rich text, HTML, Markdown, or plain text',
            '4 personalized AI models',
            'Access to Discord community'
        ]
    },
    {
        name: 'Professional',
        priceMonthly: 80,
        priceYearly: 960 / 12,
        yearlyBilling: 960,
        yearlyDiscount: 160,
        cta: 'Start with 3 free articles →',
        features: [
            '50 articles per month',
            '60 minute long recordings',
            'Unlimited edits',
            'Export as Rich text, HTML, Markdown, or plain text',
            '10 personalized AI models',
            'Access to Discord community',
            'Priority support'
        ]
    }
];

export const faqItems = [
    {
        question: "What is Blog Recorder?",
        answer: "Blog Recorder is a tool that helps you create blog articles by talking with the help of AI while still having a human touch. This is because all the content is based on your thoughts. After you have recorded an article, you can then edit the first draft created from your voice recording. This is AI-assisted blog authoring that puts you in the driver's seat."
    },
    {
        question: "What are the differences between ChatGPT and Blog Recorder?",
        answer: "ChatGPT is a general purpose chat application, not a writing tool. Blog Recorder is a writing tool that offers a great rich text editor with Rich Text, HTML, and Markdown exports, and many other features you need to create your content. With Blog Recorder, you do not need to give text instructions for common actions for every article you write."
    },
    {
        question: "Who owns my articles?",
        answer: "You do! All articles are yours to keep for personal and commercial use."
    },
    {
        question: "Does Blog Recorder offer a free trial?",
        answer: "Yes, Blog Recorder offers a free trial. You can create 3 articles for free so you can try Blog Recorder before subscribing."
    },
    {
        question: "How long does it take to create an article?",
        answer: "It can take between 10 seconds to a minute to generate a blog post depending on how long your audio recording was."
    },
    {
        question: "What does Blog Recorder cost?",
        answer: "After your free 3 articles, you can continue using Blog Recorder for $14 (and get 2 months free if you pay annually)."
    },
    {
        question: "Is there a roadmap?",
        answer: "You can find our roadmap here."
    },
    {
        question: "What formats can I export my articles in?",
        answer: "Blog Recorder can export your articles in many formats including plain text, plain HTML, rich text, and Markdown."
    }
];

export const footerLinks = {
    product: [
        { label: 'Pricing', href: '#pricing' },
        { label: 'Roadmap', href: '#' },
    ],
    company: [
        { label: 'Blog', href: '#' },
        { label: 'Twitter/X', href: '#' },
    ],
    legal: [
        { label: 'Terms', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Data Processing Agreement', href: '#' },
    ],
}
