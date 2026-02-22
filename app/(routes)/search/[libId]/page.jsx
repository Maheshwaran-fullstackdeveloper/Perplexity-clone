"use client";
import supabase from "@/services/supabase";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import DisplayResult from "./_components/DisplayResult";

function SearchQueryResult() {
  const { libId } = useParams();
  const [searchInputrecord, setSearchInputRecord] = useState();

  useEffect(() => {
    GetSearchQueryRecord();
  }, []);

  const GetSearchQueryRecord = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libId);
    setSearchInputRecord(Library?.[0]);
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header searchInputrecord={searchInputrecord} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8 mt-5">
        <DisplayResult searchInputrecord={searchInputrecord} />
      </main>
    </div>
  );
}

export default SearchQueryResult;
