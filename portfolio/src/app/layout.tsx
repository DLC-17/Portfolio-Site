import Header from "@/components/sections/footer/Header";
import Link from "next/link";
import "../app/globals.css"; // Ensure global styles are applied
import FooterSection from "@/components/ui/Footer/Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata = {
  title: "My Portfolio",
  description: "A showcase of my technical projects and photography",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider 
            attribute="class"
            storageKey="theme"
            enableSystem
            disableTransitionOnChange>
        <Header /> {/* Header is included on every page */}
        <main className="max-h-100% pt-15">{children}
          {/* Render the current page */}
        </main> {/* Add padding-top to account for the fixed header */}
        <FooterSection/>
        </ThemeProvider>
      </body>
    </html>
  );
}