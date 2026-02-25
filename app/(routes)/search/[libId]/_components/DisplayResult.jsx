import React, { useEffect, useState, useRef } from "react";
import {
  Loader2,
  LucideImage,
  LucideList,
  LucideSparkles,
  Send,
} from "lucide-react";
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import supabase from "@/services/supabase";
import { useParams } from "next/navigation";
import ImageList from "./ImageList";
import SourceListTab from "./SourceListTab";
import { Button } from "@/components/ui/button";

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
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userInput, setUserInput] = useState("");

  const GetSearchApiResult = async () => {
    try {
      const actualSearchInput = userInput || searchInputrecord?.searchInput;
      setLoadingSearch(true);
      const resp = await axios.post("/api/serp-api", {
        searchInput: actualSearchInput,
      });
      const searchResp = resp.data;
      const kg = searchResp?.knowledge_graph;
      const formattedRSearchResp = [
        // 1. Entity Main Image (Knowledge Graph)
        ...(kg?.header_images?.map((img) => ({
          type: "knowledge_image",
          title: kg?.title,
          description: kg?.description,
          long_name: kg?.type || "Image",
          url: kg?.knowledge_graph_search_link || kg?.profiles?.[0]?.link,
          img: img?.image,
        })) || []),

        // 2. Entity Overview Images
        ...(kg?.overview?.map((item) => ({
          type: "knowledge_image",
          title: item.name,
          url: item.link,
          img: item.image,
          long_name: "Overview",
        })) || []),

        // 3. Profiles
        ...(kg?.profiles?.map((item) => ({
          type: "profile_image",
          title: item.name,
          url: item.link,
          img: item.image,
          long_name: "Profile",
        })) || []),

        // 4. Web Results (often have thumbnails)
        ...(searchResp?.web_results?.map((item) => ({
          type: "web_result",
          title: item?.title,
          description: item?.snippet,
          long_name: item?.source || "Web Result",
          url: item?.link,
          img: item?.thumbnail,
        })) || []),

        // 5. Knowledge Graph Sources (Favicons/Logos)
        ...(kg?.sources?.map((item) => {
          let hostname = "";
          try {
            hostname = item?.link ? new URL(item.link).hostname : "";
          } catch (e) {}
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

        // 6. Organic Results (Favicons/Logos)
        ...(searchResp?.organic_results?.map((item) => ({
          type: "source",
          title: item?.title,
          description: item?.snippet,
          long_name: item?.source || item?.displayed_link,
          url: item?.link,
          img: item?.favicon,
        })) || []),

        // 7. Inline Images (Pure Image Results)
        ...(searchResp?.inline_images?.map((item) => ({
          type: "image",
          title: item.title,
          url: item.link,
          img: item.thumbnail || item.link,
          source: item.source,
        })) || []),

        // 8. Inline Videos
        ...(searchResp?.inline_videos?.map((item) => ({
          type: "video",
          title: item.title,
          url: item.link,
          thumbnail: item.thumbnail,
          channel: item.channel,
          platform: item.platform,
          img: item.thumbnail, // Alias for unified filtering
        })) || []),
      ]
        .filter((item) => item?.title && item?.url)
        .slice(0, 25);

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libId: libId,
            searchResult: formattedRSearchResp,
            userSearchInput: actualSearchInput,
          },
        ])
        .select();

      if (data?.[0]) {
        await GetSearchrecords();
        setLoadingSearch(false);
        setUserInput(""); // Clear the input after search
        await GenerateAIResp(
          formattedRSearchResp,
          data[0].id,
          actualSearchInput,
        );
      }
    } catch (error) {
      console.error("Error in GetSearchApiResult:", error);
      setLoadingSearch(false);
    }
  };

  const pollTimeoutRef = useRef(null);

  const GenerateAIResp = async (
    formattedRSearchResp,
    recordId,
    actualSearchInput,
  ) => {
    try {
      await axios.post("/api/llm-model", {
        searchInput: actualSearchInput,
        searchResult: formattedRSearchResp,
        recordId: recordId,
      });

      // Clear any existing poll before starting a new one
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }

      // Poll Supabase directly for the aiResp update
      const pollDb = async () => {
        try {
          const { data, error } = await supabase
            .from("Chats")
            .select("aiResp")
            .eq("id", recordId)
            .single();

          if (data?.aiResp) {
            await GetSearchrecords();
            pollTimeoutRef.current = null;
          } else {
            pollTimeoutRef.current = setTimeout(pollDb, 2000);
          }
        } catch (err) {
          console.error("Error polling database:", err);
          pollTimeoutRef.current = setTimeout(pollDb, 5000); // Retry later on error
        }
      };

      pollDb();
    } catch (error) {
      console.error("Error in GenerateAIResp:", error);
    }
  };

  // Cleanup effect to prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

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

    // Always set searchResult to show the query and UI structure
    setSearchResult(searchInputrecord);

    if (searchInputrecord?.Chats?.length === 0) {
      if (!isSearchStarted.current) {
        isSearchStarted.current = true;
        GetSearchApiResult();
      }
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
                      {chat?.searchResult?.length || 0}
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
              <AnswerDisplay chat={chat} loadingSearch={loadingSearch} />
            ) : activeTab === tabs[1].label ? (
              <ImageList chat={chat} />
            ) : activeTab === tabs[2].label ? (
              <SourceListTab chat={chat} loadingSearch={loadingSearch} />
            ) : null}
          </div>
        </div>
      ))}

      {/* Show Skeleton state while searching */}
      {loadingSearch && (
        <div className="w-full mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-600">
            {userInput || searchResult?.searchInput}
          </h1>
          <div className="flex items-center flex-wrap gap-4 border-b border-gray-100 pb-3 mt-8">
            <div className="flex items-center flex-wrap gap-6">
              {tabs.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 text-sm font-medium py-1 ${
                    activeTab === label
                      ? "text-black border-b-2 border-black"
                      : "text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="ml-auto text-[11px] font-medium text-gray-400 uppercase tracking-widest hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              Searching...
            </div>
          </div>
          <div className="w-full">
            {activeTab === tabs[0].label ? (
              <AnswerDisplay chat={null} loadingSearch={true} />
            ) : activeTab === tabs[2].label ? (
              <SourceListTab chat={null} loadingSearch={true} />
            ) : (
              <div className="flex gap-5 flex-wrap mt-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-48 h-48 bg-gray-100 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="bg-white w-full border rounded-lg shadow-md p-3 px-5 flex justify-between fixed bottom-6 xl:max-w-4xl max-w-md lg:max-w-xl">
        <input
          value={userInput}
          placeholder="Search anything..."
          className="outline-none w-full"
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loadingSearch && userInput) {
              GetSearchApiResult();
            }
          }}
        />
        <Button
          onClick={() => userInput && GetSearchApiResult()}
          disabled={loadingSearch || !userInput}
        >
          {loadingSearch ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}

export default DisplayResult;
