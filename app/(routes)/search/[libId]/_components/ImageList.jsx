import Image from "next/image";
import React from "react";

function ImageList({ chat }) {
  return (
    <div className="flex gap-5 flex-wrap mt-6">
      {chat.searchResult.map((item, index) => {
        const isFavicon =
          typeof item.img === "string" &&
          (item.img.includes("favicon") ||
            item.img.includes("s2/favicons") ||
            (item.img.includes("logo") && !item.img.includes("background")));

        if (isFavicon) return null;

        return (
          typeof item.img === "string" &&
          item.img.trim() !== "" && (
            <a
              href={item.url || item.img}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="block group relative overflow-hidden rounded-xl bg-accent shadow-sm hover:shadow-2xl transition-all duration-500 w-full sm:w-[calc(50%-1.25rem)] md:w-[calc(33.33%-1.25rem)] lg:w-[calc(25%-1.25rem)] xl:w-[220px]"
            >
              <Image
                src={item.img}
                alt={item.title || "Search result image"}
                width={400}
                height={400}
                priority={index < 4}
                quality={100}
                unoptimized={true}
                className="w-full h-full object-cover aspect-square transition-all duration-500 ease-out group-hover:scale-115 group-active:scale-95 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-3">
                <p className="text-white text-[10px] line-clamp-2 font-medium leading-tight">
                  {item.title}
                </p>
              </div>
            </a>
          )
        );
      })}
    </div>
  );
}

export default ImageList;
