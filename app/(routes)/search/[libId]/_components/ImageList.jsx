import Image from "next/image";
import React from "react";

function ImageList({ chat }) {
  // Filter for high-quality images, prioritizing actual photos over favicons/logos
  const result = chat?.searchResult?.filter((item) => {
    if (!item.img) return false;

    // Explicitly allow only visual content types
    const validImageTypes = ["image", "video", "knowledge_image", "web_result"];
    if (!validImageTypes.includes(item.type)) return false;

    // Strict exclusion of favicons and logos
    const lowercaseImg = item.img.toLowerCase();
    if (
      lowercaseImg.includes("favicon") ||
      lowercaseImg.includes("logo") ||
      lowercaseImg.includes("google.com/s2/favicons")
    )
      return false;

    return true;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8 pb-10">
      {result?.length > 0 ? (
        result.map((item, index) => (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="aspect-square relative cursor-pointer group overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50"
          >
            <img
              src={item.img}
              alt={item.title || "Search Image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight">
                {item.title}
              </p>
              {(item.source || item.long_name) && (
                <p className="text-gray-300 text-[9px] mt-1 truncate">
                  {item.source || item.long_name}
                </p>
              )}
            </div>
          </a>
        ))
      ) : (
        <div className="col-span-full py-20 text-center text-gray-400">
          No relevant images found for this search.
        </div>
      )}
    </div>
  );
}

export default ImageList;
