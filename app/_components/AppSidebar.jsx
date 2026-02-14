"use client";
import React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Compass,
  GalleryHorizontalEnd,
  LogIn,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const MenuOptions = [
  {
    title: "Home",
    icon: Search,
    path: "/",
  },
  {
    title: "Discover",
    icon: Compass,
    path: "/discover",
  },
  {
    title: "Library",
    icon: GalleryHorizontalEnd,
    path: "/library",
  },
];

export function AppSidebar() {
  const path = usePathname();
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center py-5">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={32}
          priority
          className="h-auto w-auto mix-blend-multiply"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarContent>
          <SidebarMenu>
            {MenuOptions.map((menu, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  className={`p-5 py-6 hover:bg-transparent hover:pl-6 transition-all duration-200 ease-in-out ${
                    path === menu.path && "bg-[#44C8F8]/10"
                  }`}
                >
                  <a href={menu.path} className="">
                    <menu.icon className="h-8 w-8" />
                    <span className="text-lg">{menu.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {!user ? (
            <SignUpButton mode="modal">
              <Button className="rounded-full mx-4 mt-4 hover:cursor-pointer">
                Sign Up
              </Button>
            </SignUpButton>
          ) : (
            <SignOutButton>
              <Button className="rounded-full mx-4 mt-4 hover:cursor-pointer">
                Log Out
              </Button>
            </SignOutButton>
          )}
        </SidebarContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className={"bg-accent"}>
        <div className="p-3 flex flex-col">
          <h2 className="text-gray-500">Try Pro</h2>
          <p className="text-gray-400 text-sm">
            Upgrade to Pro for Image Upload, Smarter AI and more...
          </p>
          <Button variant="secondary" className={"text-gray-500 mb-3"}>
            <SquareArrowOutUpRight />
            Learn More
          </Button>
          {user && <UserButton />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
