import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="container flex flex-col items-center justify-center gap-8 py-12 md:py-20 text-center bg-primary">
      <div className="flex max-w-3xl flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">BlogSmith</span>
        </h1>
        <p className="max-w-[700px] text-lg text-slate-300 sm:text-xl">
          AI-powered blog generation. Upload your documents and let the magic happen. Instantly transform your ideas into engaging content.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 ease-in-out hover:scale-105">
          <Link href="/upload">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900 transition-all duration-300 ease-in-out hover:scale-105">
          <Link href="/posts">View Blog Posts</Link>
        </Button>
      </div>
    </section>
  );
}
