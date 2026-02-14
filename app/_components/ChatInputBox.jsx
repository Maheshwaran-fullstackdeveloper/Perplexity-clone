import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Atom,
  AudioLines,
  Cpu,
  Globe,
  Mic,
  Paperclip,
  SearchCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIModelsOptions } from "@/services/Shared";

function ChatInputBox() {
  return (
    <div className="flex flex-col h-screen items-center justify-center w-full">
      <Image
        src="/logo.png"
        alt="Logo"
        width={260}
        height={250}
        priority
        className="h-auto w-auto mix-blend-multiply"
      />
      <div className="p-2 w-full max-w-2xl border rounded-2xl mt-10">
        <div className="flex justify-between items-end">
          <Tabs defaultValue="search" className="w-100">
            <TabsContent value="search">
              <input
                type="text"
                placeholder="Ask anything..."
                className="w-full p-4 outline-none"
              />
            </TabsContent>
            <TabsContent value="research">
              <input
                type="text"
                placeholder="Research anything..."
                className="w-full p-4 outline-none"
              />
            </TabsContent>
            <TabsList>
              <TabsTrigger
                value="search"
                className={"text-primary hover:cursor-pointer"}
              >
                <SearchCheck /> Search
              </TabsTrigger>
              <TabsTrigger
                value="research"
                className={"text-primary hover:cursor-pointer"}
              >
                <Atom /> Research
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-1 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={"cursor-pointer"}>
                  <Cpu className="text-gray-500 h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  {AIModelsOptions.map((model) => (
                    <DropdownMenuItem key={model.id}>
                      <div className="mb-1">
                        <h2 className="text-sm">{model.name}</h2>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className={"cursor-pointer"}>
              <Globe className="text-gray-500 h-5 w-5" />
            </Button>
            <Button variant="ghost" className={"cursor-pointer"}>
              <Paperclip className="text-gray-500 h-5 w-5" />
            </Button>
            <Button variant="ghost" className={"cursor-pointer"}>
              <Mic className="text-gray-500 h-5 w-5" />
            </Button>
            <Button className={"cursor-pointer"}>
              <AudioLines className="text-white h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
