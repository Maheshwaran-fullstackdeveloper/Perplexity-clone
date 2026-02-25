import React, { useEffect, useState, useRef } from "react";
import {
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
} from "lucide-react";
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import supabase from "@/services/supabase";
import { useParams } from "next/navigation";
import ImageList from "./ImageList";
import SourceListTab from "./SourceListTab";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Sources", icon: LucideList, badge: 10 },
];

function DisplayResult({ searchInputrecord }) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [searchResult, setSearchResult] = useState(null);
  const { libId } = useParams();
  const isSearchStarted = useRef(false);

  const GetSearchApiResult = async () => {
    try {
      const resp = await axios.post("/api/serp-api", {
        searchInput: searchInputrecord?.searchInput,
      });
      const searchResp = resp.data;
      const kg = searchResp?.knowledge_graph;
      const formattedRSearchResp = [
        // 1. Entity (Knowledge Graph Main)
        kg && {
          title: kg?.title,
          description: kg?.description,
          long_name: kg?.type,
          url: kg?.profiles?.[0]?.link,
          img: kg?.header_images?.[0]?.image,
        },
        // 2. Web Results
        ...(searchResp?.web_results?.map((item) => ({
          title: item?.title,
          description: item?.snippet,
          long_name: "Web Result",
          url: item?.link,
          img: item?.thumbnail,
        })) || []),
        // 3. Knowledge Graph Sources
        ...(kg?.sources?.map((item) => {
          let hostname = "";
          try {
            hostname = item?.link ? new URL(item.link).hostname : "";
          } catch (e) {
            console.error("Error parsing URL:", item?.link);
          }
          return {
            type: "source",
            title: item?.name,
            description: item?.snippet,
            long_name: item?.displayed_link || "Source",
            url: item?.link,
            img: hostname
              ? `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`
              : null,
          };
        }) || []),
        // 4. Organic Results from searchResp
        ...(searchResp?.organic_results?.map((item) => ({
          title: item?.title,
          description: item?.snippet,
          long_name: item?.source || item?.displayed_link,
          url: item?.link,
          img: item?.favicon,
        })) || []),
        // 5. Inline Videos
        ...(searchResp?.inline_videos?.map((item) => ({
          type: "video",
          title: item.title,
          url: item.link,
          thumbnail: item.thumbnail,
          channel: item.channel,
          platform: item.platform,
        })) || []),
      ]
        .filter((item) => item?.title && item?.url)
        .slice(0, 15);

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libId: libId,
            searchResult: formattedRSearchResp,
            userSearchInput: searchInputrecord?.searchInput,
          },
        ])
        .select();

      if (data?.[0]) {
        await GetSearchrecords();
        await GenerateAIResp(formattedRSearchResp, data[0].id);
      }
    } catch (error) {
      console.error("Error in GetSearchApiResult:", error);
    }
  };

  const GenerateAIResp = async (formattedRSearchResp, recordId) => {
    try {
      await axios.post("/api/llm-model", {
        searchInput: searchInputrecord?.searchInput,
        searchResult: formattedRSearchResp,
        recordId: recordId,
      });

      // Poll Supabase directly for the aiResp update
      // This is more reliable than polling Inngest status
      const pollDb = async () => {
        try {
          const { data, error } = await supabase
            .from("Chats")
            .select("aiResp")
            .eq("id", recordId)
            .single();

          if (data?.aiResp) {
            await GetSearchrecords();
          } else {
            setTimeout(pollDb, 2000);
          }
        } catch (err) {
          console.error("Error polling database:", err);
        }
      };

      pollDb();
    } catch (error) {
      console.error("Error in GenerateAIResp:", error);
    }
  };

  const GetSearchrecords = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libid", libId);

    if (Library?.[0]) {
      setSearchResult(Library[0]);
    }
  };

  useEffect(() => {
    if (!searchInputrecord) return;

    if (searchInputrecord?.Chats?.length === 0) {
      if (!isSearchStarted.current) {
        isSearchStarted.current = true;
        GetSearchApiResult();
      }
    } else {
      setSearchResult(searchInputrecord);
    }
  }, [searchInputrecord]);

  return (
    <div className="w-full overflow-hidden">
      {searchResult?.Chats?.map((chat, index) => (
        <div
          key={index}
          className="w-full mb-16 border-b border-gray-50 pb-16 last:border-0 last:pb-0"
        >
          <h1 className="text-3xl font-bold text-gray-600">
            {chat?.userSearchInput}
          </h1>
          <div className="flex items-center flex-wrap gap-4 border-b border-gray-100 pb-3 mt-8">
            <div className="flex items-center flex-wrap gap-6">
              {tabs.map(({ label, icon: Icon, badge }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`flex items-center gap-1.5 cursor-pointer relative text-sm font-medium transition-all duration-200 py-1 ${
                    activeTab === label
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">
                      {chat?.searchResult?.length || badge}
                    </span>
                  )}
                  {activeTab === label && (
                    <span className="absolute -bottom-3.25 left-0 w-full h-0.5 bg-black rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-widest hidden sm:flex items-center gap-2">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
              Search Completed
            </div>
          </div>
          <div className="w-full">
            {activeTab === tabs[0].label ? (
              <AnswerDisplay chat={chat} />
            ) : activeTab === tabs[1].label ? (
              <ImageList chat={chat} />
            ) : activeTab === tabs[2].label ? (
              <SourceListTab chat={chat} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayResult;
