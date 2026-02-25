"use client";
import axios from "axios";
import {
  Cpu,
  Flame,
  Gamepad2,
  Globe,
  Rocket,
  Newspaper,
  Volleyball,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const options = [
  {
    title: "Trending",
    icon: Flame,
  },
  {
    title: "News",
    icon: Newspaper,
  },
  {
    title: "Sports",
    icon: Volleyball,
  },
  {
    title: "Technology",
    icon: Cpu,
  },
  {
    title: "Science",
    icon: Rocket,
  },
  {
    title: "Entertainment",
    icon: Gamepad2,
  },
];

function Discover() {
  const [selectedOption, setSelectedOption] = useState("Trending");
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetSearchresult = async () => {
    try {
      setLatestNews([]); // Clear old results immediately
      setLoading(true);
      const result = await axios.post("/api/serp-api", {
        searchInput: selectedOption,
        type: "news",
      });
      setLatestNews(
        result.data?.news_results || result.data?.organic_results || [],
      );
    } catch (error) {
      console.error("Error fetching discover results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (index) => {
    const fallbacks = [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c", // News
      "https://images.unsplash.com/photo-1495020689067-958852a7765e", // Newspaper
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", // Business
      "https://images.unsplash.com/photo-1504173010664-32509bc96290", // Blue tech
    ];
    return `${fallbacks[index % fallbacks.length]}?q=80&w=800&auto=format&fit=crop`;
  };

  useEffect(() => {
    selectedOption && GetSearchresult();
  }, [selectedOption]);

  return (
    <div className="mt-20 px-10 md:px-20 lg:px-36 xl:px-56">
      <h2 className="font-bold text-3xl text-gray-600 flex gap-2 items-center">
        <Globe className="text-[#31818d]" />
        Discover
      </h2>
      <div className="flex flex-wrap gap-3 mt-8">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option.title)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-600 hover:bg-[#31818d]/5 cursor-pointer transition-all duration-200 hover:border-[#31818d]/30 hover:text-[#31818d] ${
              selectedOption === option.title
                ? "border-[#31818d]/30 bg-[#31818d]/5 text-[#31818d]"
                : "border-gray-200"
            }`}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-20">
        <h2 className="font-bold text-xl text-gray-700 mb-6 capitalize">
          {selectedOption} Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="p-4 border rounded-2xl flex flex-col gap-3"
                >
                  <div className="w-full h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-6 bg-gray-100 rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-50 rounded-md w-full animate-pulse"></div>
                  </div>
                </div>
              ))
            : latestNews.map((item, index) => (
                <a
                  href={item.link}
                  target="_blank"
                  key={index}
                  className="p-4 border rounded-2xl hover:bg-gray-50 cursor-pointer transition-all flex flex-col gap-3 group border-gray-100 hover:border-[#31818d]/20"
                >
                  <div className="w-full h-48 overflow-hidden rounded-xl bg-gray-100 relative">
                    <img
                      src={item.thumbnail || getFallbackImage(index)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-[#31818d] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {item.snippet || item.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    {item.source?.icon ? (
                      <img
                        src={item.source.icon}
                        alt="source"
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    )}
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {item.source?.name || item.source || "News Source"}
                    </span>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
