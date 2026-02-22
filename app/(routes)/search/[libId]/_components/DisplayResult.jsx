import React, { useEffect, useState, useRef } from "react";
import {
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
} from "lucide-react";
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import { SEARCH_RESULT } from "@/services/Shared";
import supabase from "@/services/supabase";
import { useParams } from "next/navigation";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Videos", icon: LucideVideo },
  { label: "Sources", icon: LucideList, badge: 10 },
];

function DisplayResult({ searchInputrecord }) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [searchResult, setSearchResult] = useState(SEARCH_RESULT);
  const { libId } = useParams();

  const GetSearchApiResult = async () => {
    const searchResp = SEARCH_RESULT;
    // const formattedRSearchResp = searchResp?.knowledge_graph
    //   ? [searchResp.knowledge_graph].map((item) => ({
    //       title: item?.title,
    //       description: item?.description,
    //       long_name: item?.type,
    //       img: item?.header_images?.[0]?.image,
    //       url: item?.profiles[0]?.link,
    //       thumbnail: item?.profiles[0]?.image,
    //     }))
    //   : [];
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
    ]
      .filter((item) => item?.title && item?.url)
      .slice(0, 8);

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
      await GenerateAIResp(formattedRSearchResp, data[0].id);
    }
  };

  const GenerateAIResp = async (formattedRSearchResp, recordId) => {
    const result = await axios.post("/api/llm-model", {
      searchInput: searchInputrecord?.searchInput,
      searchResult: formattedRSearchResp,
      recordId: recordId,
    });
    const runId = result.data;
    const interval = setInterval(async () => {
      const runResp = await axios.post("/api/get-inngest-status", {
        runId: runId,
      });
      if (runResp?.data?.data?.[0]?.status === "completed") {
        clearInterval(interval);
      }
    }, 1000);

    return result;
  };

  useEffect(() => {
    searchInputrecord?.Chats?.length === 0 && GetSearchApiResult();
    setSearchResult(searchInputrecord);
    console.log(searchInputrecord);
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
                      {badge}
                    </span>
                  )}
                  {activeTab === label && (
                    <span className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-black rounded-full"></span>
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
            ) : activeTab === tabs[3].label ? (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <SourceList webResult={chat?.searchResult} />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayResult;
