import Link from 'next/link';

// Placeholder for your blog posts
const posts = [
    {
        slug: 'end-of-writers-block',
        title: "The End of Writer's Block is a Conversation Away",
        excerpt: "Discover how to bypass the dreaded blank page by simply speaking your thoughts and letting AI do the heavy lifting.",
        date: '2024-08-01',
    },
    {
        slug: 'authentic-ai-content',
        title: "Why Your AI Content Sounds Robotic (And How to Fix It)",
        excerpt: "Generic AI tools create soulless content. Learn how to generate truly authentic articles by using your own voice as the source.",
        date: '2024-08-05',
    },
     {
        slug: 'content-repurposing-flywheel',
        title: "The Content Repurposing Flywheel: Turn One Podcast into Ten Assets",
        excerpt: "A strategic guide for marketers and creators on how to use AudioScribe to maximize content output and reach a wider audience.",
        date: '2024-08-10',
    },
    {
        slug: 'hello-world',
        title: 'Hello, World!',
        excerpt: 'This is the first blog post for AudioScribe! Learn more about what\'s to come.',
        date: '2024-07-25',
    },
];

export default function BlogPage() {
    // Sort posts by date, descending
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">The AudioScribe Blog</h1>
                <p className="text-muted-foreground mt-2">Updates, tutorials, and insights from the team.</p>
            </div>

            <div className="space-y-8">
                {sortedPosts.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                        <article>
                            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{post.title}</h2>
                            <p className="text-muted-foreground mt-2">{post.excerpt}</p>
                            <time dateTime={post.date} className="text-sm text-muted-foreground mt-2 block">
                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </time>
                        </article>
                    </Link>
                ))}
            </div>

             {posts.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No posts yet!</h2>
                    <p className="text-muted-foreground mt-2">Check back soon for updates.</p>
                </div>
            )}
        </div>
    );
}
