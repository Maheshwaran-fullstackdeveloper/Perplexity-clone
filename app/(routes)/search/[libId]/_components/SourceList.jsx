import Image from "next/image";
import React from "react";

function SourceList({ webResult, loadingSearch }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
      {loadingSearch &&
        (!webResult || webResult.length === 0) &&
        [1, 2, 3, 4].map((item, index) => (
          <div
            key={index}
            className="w-full h-24 p-3 rounded-lg bg-gray-50 animate-pulse border border-gray-100 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <div className="w-12 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="w-full h-3 rounded bg-gray-200"></div>
            <div className="w-3/4 h-3 rounded bg-gray-200"></div>
          </div>
        ))}
      {webResult?.map((item, index) => (
        <a
          href={item?.url}
          target="_blank"
          key={index}
          className="flex flex-col p-3 bg-accent rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200 group h-full justify-between"
        >
          <div className="flex items-center gap-2 mb-2 shrink-0">
            {typeof item?.img === "string" && item.img.trim() !== "" ? (
              <Image
                src={item?.img}
                alt="Logo"
                width={16}
                height={16}
                className="rounded-full h-4 w-4 object-contain shadow-xs"
              />
            ) : (
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
            )}
            <span className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-tight">
              {item?.long_name}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-start">
            <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {item?.title}
            </h2>
            {item?.description && (
              <p className="line-clamp-2 text-[11px] text-gray-500 mt-1 leading-snug">
                {item.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

export default SourceList;
