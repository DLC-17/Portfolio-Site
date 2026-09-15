import { sanityClient } from "@/sanity/sanity-utils";
import { groq } from "next-sanity";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      </div>
    </main>
  );
}
