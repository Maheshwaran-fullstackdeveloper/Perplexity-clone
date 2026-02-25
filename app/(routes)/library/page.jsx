"use client";
import supabase from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import { SquareArrowOutUpRight } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Library() {
  const { user } = useUser();
  const [libraryHistory, setLibraryHistory] = useState([]);
  const router = useRouter();

  const GetLibraryHistory = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*")
      .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
      .order("id", { ascending: false });
    setLibraryHistory(Library);
  };

  React.useEffect(() => {
    user && GetLibraryHistory();
  }, [user]);

  return (
    <div className="mt-20 px-10 md:px-20 lg:px-36 xl:px-56">
      <h2 className="font-bold text-2xl text-gray-650">Library</h2>
      <div className="mt-7">
        {libraryHistory.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(`/search/${item.libid}`)}
            className="cursor-pointer"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-gray-700">{item.searchInput}</h2>
                <p className="text-xs text-gray-500">
                  {moment(item.created_at).fromNow()}
                </p>
              </div>
              <SquareArrowOutUpRight className="h-4 w-4" />
            </div>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
