"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Package,
  ShoppingCart,
  // Users,
  // Settings,
  Tag,
  Briefcase,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: Briefcase,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  // {
  //   title: "Users",
  //   href: "/admin/users",
  //   icon: Users,
  // },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar>
      <SidebarHeader className="border-b p-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sparkle Zone Admin Panel
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 px-3">
          <nav className="flex flex-col gap-2 py-4">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={index}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-gray-200/80"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className="text-sm text-gray-500">© 2025 Sparkle Zone</p>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
