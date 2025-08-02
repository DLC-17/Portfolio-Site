import "../app/globals.css"; // Ensure global styles are applied
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/sections/Header/Header";
//import MyThree from "@/components/ui/Three";

export const metadata = {
  title: "My Portfolio",
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
          {/*<div className="-z-100 fixed opacity-65"><MyThree /></div>*/}
          <Header />
          <main className="flex-grow">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
