import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

// Basic Card component (can be moved to its own file later if it grows)
interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    subtitle: string | null;
    coverImageUrl: string | null;
    createdAt: Date;
  };
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <div className="flex flex-col h-full overflow-hidden rounded-lg border border-border shadow-md transition-all hover:shadow-xl">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={`Cover image for ${post.title}`}
            width={500} // Aspect ratio 5:3 for example
            height={300}
            className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-48 bg-secondary">
            <span className="text-muted-foreground !text-blue-50">No Image</span>
          </div>
        )}
        <div className="p-4 sm:p-6 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold leading-tight tracking-tight mb-1 group-hover:text-primary !text-blue-50">
            {post.title}
          </h2>
          {post.subtitle && (
            <p className="text-sm text-muted-foreground mb-3 flex-grow !text-blue-50">
              {post.subtitle}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-auto pt-2 !text-blue-50">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPostsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      coverImageUrl: true,
      createdAt: true,
    }
  });

  return (
    <section className="container m-auto py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 mb-8 m-auto">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter m-auto text-center md:text-4xl !text-blue-50">
          All Blog Posts
        </h1>
        {posts.length === 0 && (
          <p className="text-lg text-muted-foreground text-center m-auto !text-blue-50">
            No blog posts found. Try uploading a document to generate one!
          </p>
        )}
      </div>

      {posts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          {posts.map((post: any) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
