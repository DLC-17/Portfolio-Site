import "../app/globals.css"; // Ensure global styles are applied
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/sections/Header/Header";
export const metadata = {
  title: "David Coleman - Portfolio",
  description: "A showcase of my technical projects and photography",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
