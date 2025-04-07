import Header from "@/components/sections/footer/Header";
import "../app/globals.css"; // Ensure global styles are applied
import FooterSection from "@/components/ui/Footer/Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata = {
  title: "My Portfolio",
  description: "A showcase of my technical projects and photography",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body>
          <div className="flex flex-col min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <Header /> {/* Header is included on every page */}
              <main className="flex-grow pt-15">{children}</main>
              <FooterSection />
            </ThemeProvider>
          </div>
      </body>
    </html>
  );
}
