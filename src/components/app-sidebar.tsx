import { Calendar, Camera, Contact, Home, Inbox, } from "lucide-react"
import { MdEmail } from "react-icons/md";
import { ModeToggle } from "./ui/mode-toggle"
import { FaLinkedin, } from "react-icons/fa";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "DC",
    url: "/",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Inbox,
  },
  {
    title: "Photography",
    url: "/photography",
    icon: Camera,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
             <div className="flex items-center">
  <ModeToggle />
  <a
    href="https://linkedin.com/in/your-profile"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    <FaLinkedin className="size-5" />
  </a>
  <a
    href="mailto:dlc17@stmarys-ca.edu"
    className="inline-flex items-center justify-center rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    <MdEmail className="size-7" />
  </a>
</div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
