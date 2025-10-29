import Link from 'next/link';

// Placeholder for your blog posts
const posts = [
    {
        slug: 'hello-world',
        title: 'Hello, World!',
        excerpt: 'This is the first blog post for AudioScribe AI! Learn more about what\'s to come.',
        date: '2024-07-25',
    },
    // Add more posts here
];

export default function BlogPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">The AudioScribe AI Blog</h1>
                <p className="text-muted-foreground mt-2">Updates, tutorials, and insights from the team.</p>
            </div>

            <div className="space-y-8">
                {posts.map(post => (
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
