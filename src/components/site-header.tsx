"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Simple SVG icons for Menu and X
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b pr-2 border-teal-100/50 bg-blue-500/80 backdrop-blur supports-[backdrop-filter]:bg-blue-500/50">
      <div className="container flex m-auto h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center top-2 relative" onClick={handleLinkClick}>
          <Image
            src="/logo-no-bg.png"
            alt="BlogSmith Logo"
            width={150} // Adjust width as needed, height will scale
            height={40} // Adjust height as needed
            className="h-[65px] w-auto" // Example sizing, adjust as needed
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/upload"
            className={cn(
              "transition-colors text-brand-white hover:text-lime-100 font-medium !text-blue-50"
            )}
          >
            Upload
          </Link>
          <Link
            href="/posts"
            className={cn(
              "transition-colors text-brand-white hover:text-lime-100 font-medium !text-blue-50"
            )}
          >
            Blog Posts
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-brand-white hover:bg-teal-200/30 hover:text-lime-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lime-100"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (collapsible) */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <nav className="container space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/upload"
              onClick={handleLinkClick}
              className={cn(
                "block rounded-md px-3 py-2 text-base font-medium text-brand-white hover:bg-teal-200/30 hover:text-lime-100"
              )}
            >
              Upload
            </Link>
            <Link
              href="/posts"
              onClick={handleLinkClick}
              className={cn(
                "block rounded-md px-3 py-2 text-base font-medium text-brand-white hover:bg-teal-200/30 hover:text-lime-100"
              )}
            >
              Blog Posts
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
