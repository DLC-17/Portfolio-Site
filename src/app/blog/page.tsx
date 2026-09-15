import { fetchPosts } from "@/sanity/sanity-utils";
import { ScrambleHeader } from "@/components/ui/scramble-header";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Blog",
  description: "Technical writing and thoughts.",
};

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <main className="flex min-h-screen w-full flex-col items-center pt-28 px-6 md:pt-32">
      <div className="w-full max-w-3xl space-y-8">
        <ScrambleHeader text="Developer Blog" className="text-3xl md:text-5xl" />
        <p className="text-muted-foreground pb-8 border-b border-border">
          Thoughts on software engineering, UI/UX, and building products.
        </p>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            posts.map((post: any) => (
              <Card key={post._id} className="transition-all hover:bg-muted/50">
                <Link href={`/blog/${post.slug.current}`}>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{post.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-sm text-foreground">{post.excerpt}</p>
                    </CardContent>
                  )}
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
