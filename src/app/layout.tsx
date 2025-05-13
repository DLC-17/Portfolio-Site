import "../app/globals.css"; // Ensure global styles are applied
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar} from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "My Portfolio",
  description: "A showcase of my technical projects and photography",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
              <main className="flex-grow">{children}</main>
                            </SidebarProvider>
            </ThemeProvider>
      </body>
    </html>
  );
}
