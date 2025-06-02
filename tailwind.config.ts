import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'sense-net-blue': 'oklch(0.6215 0.2043 255.15)',
        'teal-100': 'oklch(0.5871 0.0612 198.99)',
        'teal-200': 'oklch(0.8074 0.0845 188.56)',
        'yellow-100': 'oklch(0.9707 0.066 99.98)',
        'yellow-200': 'oklch(0.8772 0.1768 95.01)',
        'orange-100': 'oklch(0.8119 0.124 69.96)',
        'orange-200': 'oklch(0.7588 0.144 58.99)',
        'orange-300': 'oklch(0.6822 0.1768 43.99)',
        'blue-100': 'oklch(0.8321 0.0821 232.65)',
        'blue-500': 'oklch(0.6028 0.0963 262.04)',
        'lime-100': 'oklch(0.8995 0.1323 128.92)',
        'brand-white': 'oklch(1 0 0)', // Renamed to avoid conflict with default 'white'
        'logo-bg-slate': 'oklch(0.39 0.018 260)', // Approx #4A5568
        'navbar-gradient-from': 'oklch(35.7% 4.4% 264.1)',
        'navbar-gradient-to': 'oklch(30.5% 3.4% 263.6)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config
