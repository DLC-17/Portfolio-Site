import "../app/globals.css"; // Ensure global styles are applied
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/sections/Header/Header";
import Footer from "@/components/sections/Footer/Footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dc-dev.space"),
  title: {
    default: "David Coleman | Forward Deployed Engineer & AI Systems",
    template: "%s | David Coleman",
  },
  description:
    "Forward Deployed Engineer building production AI systems—from voice agents to LLM orchestration, full-stack architectures, and MCP tooling.",
  keywords: [
    "David Coleman",
    "Forward Deployed Engineer",
    "AI Systems",
    "Voice AI",
    "LLM Orchestration",
    "MCP",
    "Next.js",
    "Python",
    "Full Stack Engineer",
  ],
  authors: [{ name: "David Coleman", url: "https://www.dc-dev.space" }],
  creator: "David Coleman",
  openGraph: {
    title: "David Coleman | Forward Deployed Engineer & AI Systems",
    description:
      "Forward Deployed Engineer building production AI systems—from voice agents to LLM orchestration, full-stack architectures, and MCP tooling.",
    url: "https://www.dc-dev.space",
    siteName: "David Coleman Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Coleman | Forward Deployed Engineer & AI Systems",
    description:
      "Forward Deployed Engineer building production AI systems—from voice agents to LLM orchestration, full-stack architectures, and MCP tooling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} flex min-h-svh flex-col font-sans antialiased`}>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
