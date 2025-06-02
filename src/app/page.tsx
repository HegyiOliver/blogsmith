import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="container  m-auto flex flex-col items-center justify-center gap-8 py-16 md:py-24 text-center">
      <div className="flex max-w-3xl flex-col items-center gap-6">
           <Image
         src="/logo-no-bg.png"
                alt="BlogSmith Logo"
          width={200} // Larger size for homepage
          height={60}
          className="h-auto mb-4 relative top-10" // Added margin bottom
                    priority
                  />
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to <span className="bg-gradient-to-r from-yellow-100 to-orange-100 bg-clip-text text-transparent">BlogSmith</span>
        </h1>
        <p className="max-w-[700px] text-lg sm:text-xl"> {/* text-slate-300 removed, global style will apply */}
          AI-powered blog generation. Upload your documents and let the magic happen. Instantly transform your ideas into engaging content.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button asChild size="lg" className="bg-orange-200 text-brand-white hover:bg-orange-300 transition-all duration-300 ease-in-out hover:scale-105">
          <Link href="/upload">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-yellow-200 text-yellow-200 hover:bg-yellow-200 hover:text-sense-net-blue transition-all duration-300 ease-in-out hover:scale-105">
          <Link href="/posts">View Blog Posts</Link>
        </Button>
      </div>
    </section>
  );
}
