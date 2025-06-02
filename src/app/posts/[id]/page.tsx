import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: { title: true, subtitle: true }
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.subtitle || "A BlogSmith generated post.",
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container m-auto max-w-3xl py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl mb-3 !text-blue-100">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-lg md:text-xl  !text-blue-100">
            {post.subtitle}
          </p>
        )}
        <p className="text-sm !text-blue-50 mt-2">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </header>

      {post.coverImageUrl && (
        <div className="mb-8 rounded-md overflow-hidden shadow-lg">
          <Image
            src={post.coverImageUrl}
            alt={`Cover image for ${post.title}`}
            width={1200}
            height={675} // Assuming a 16:9 aspect ratio
            className="w-full h-auto object-cover"
            priority // Prioritize loading cover image for LCP
          />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none 
                      prose-headings:font-semibold prose-headings:tracking-tight 
                      prose-a:text-primary hover:prose-a:text-primary/80
                      prose-img:rounded-md prose-img:shadow-sm !text-blue-50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body}
        </ReactMarkdown>
      </div>
    </article>
  );
}

// Optional: Generate static paths if you have a small number of posts
// export async function generateStaticParams() {
//   const posts = await prisma.blogPost.findMany({ select: { id: true } });
//   return posts.map((post) => ({
//     id: post.id,
//   }));
// }
