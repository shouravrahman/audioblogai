import Link from 'next/link';

// This is a placeholder for fetching blog post data.
// In a real app, you'd fetch this from a CMS or a local file.
async function getPostData(slug: string) {
    if (slug === 'hello-world') {
        return {
            title: 'Hello, World!',
            date: '2024-07-25',
            content: `<p>This is the first blog post for AudioScribe AI! This is where you can share product updates, tutorials, and insights with your audience.</p>
                     <p>You can create more posts by adding new files in your codebase or integrating with a headless CMS.</p>`
        };
    }
    return null;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostData(params.slug);

    if (!post) {
        return (
            <div className="container mx-auto py-12 px-4 max-w-4xl text-center">
                <h1 className="text-3xl font-bold">Post not found</h1>
                <p className="text-muted-foreground mt-4">Sorry, we couldn't find the blog post you were looking for.</p>
                <Link href="/blog" className="mt-6 inline-block text-primary underline">
                    &larr; Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <article className="prose dark:prose-invert">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                    <p className="text-muted-foreground">
                        Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
            <div className="mt-12">
                <Link href="/blog" className="text-primary underline">
                    &larr; Back to all posts
                </Link>
            </div>
        </div>
    );
}
