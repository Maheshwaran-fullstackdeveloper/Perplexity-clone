import Image from "next/image";
import React from "react";

function SourceListTab({ chat, loadingSearch }) {
  return (
    <div className="mt-4 gap-2 items-center">
      {loadingSearch &&
        (!chat?.searchResult || chat.searchResult.length === 0) && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="p-2 border-b animate-pulse flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-4 bg-gray-100 rounded"></div>
                  <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
                  <div className="w-24 h-3 bg-gray-100 rounded"></div>
                </div>
                <div className="ml-7 flex flex-col gap-2">
                  <div className="w-3/4 h-5 bg-gray-100 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      {chat?.searchResult
        ?.filter((item) => item.type !== "image" && item.type !== "video")
        .map((item, index) => (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            key={index}
            className="block p-2 border-b"
          >
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-5 text-center">{index + 1}.</div>
              {typeof item.img === "string" && item.img.trim() !== "" && (
                <Image
                  src={item.img}
                  alt={item.title || "Source favicon"}
                  width={20}
                  height={20}
                  className="rounded-full w-5 h-5 border"
                />
              )}
              <div className="text-xs truncate">{item.long_name}</div>
            </div>
            <div className="ml-7">
              <h2 className="mt-1 line-clamp-1 font-bold text-lg text-gray-600">
                {item.title}
              </h2>
              <h2 className="mt-1 text-xs text-gray-500">{item.description}</h2>
            </div>
          </a>
        ))}
    </div>
  );
}

export default SourceListTab;
