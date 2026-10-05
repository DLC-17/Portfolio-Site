import { sanityClient } from "@/sanity/sanity-utils";
import { groq } from "next-sanity";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiKofi } from "react-icons/si";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { urlFor } from "@/sanity/sanity-utils";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-96 my-8 rounded-xl overflow-hidden border border-border">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog image"}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    code: ({ value }: any) => {
      return (
        <div className="my-8 rounded-xl overflow-hidden text-sm">
          {value.filename && (
            <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-border">
              {value.filename}
            </div>
          )}
          <SyntaxHighlighter
            language={value.language || "typescript"}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: "1.5rem" }}
          >
            {value.code}
          </SyntaxHighlighter>
        </div>
      );
    },
  },
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  const post = await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      body
    }`,
    { slug }
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center pt-28 px-6 md:pt-32 pb-20">
      <div className="w-full max-w-3xl space-y-8">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-foreground mt-8">
          {post.body ? <PortableText value={post.body} components={ptComponents} /> : null}
        </div>

        {/* Support on Ko-fi Callout */}
        <section aria-label="Support author" className="mt-14 rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-xs shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                <span>Enjoyed this post?</span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                If you found this article helpful, consider supporting my writing and open-source projects on Ko-fi. Every coffee is greatly appreciated!
              </p>
            </div>
            <a
              href="https://ko-fi.com/dlc17"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-lg bg-[#FF5E5B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#e04f4c] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <SiKofi size={18} className="shrink-0" />
              <span>Support on Ko-fi</span>
            </a>
          </div>
        </section>

        {/* Post Footer Navigation */}
        <div className="pt-6 border-t border-border/70 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <a
            href="https://ko-fi.com/dlc17"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#FF5E5B] transition-colors"
          >
            <SiKofi size={14} className="text-[#FF5E5B]" />
            <span>ko-fi.com/dlc17</span>
          </a>
        </div>
      </div>
    </main>
  );
}
