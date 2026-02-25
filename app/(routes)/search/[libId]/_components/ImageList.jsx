import Image from "next/image";
import React from "react";

function ImageList({ chat }) {
  return (
    <div className="flex gap-5 flex-wrap mt-6">
      {chat.searchResult.map(
        (item, index) =>
          typeof item.img === "string" &&
          item.img.trim() !== "" && (
            <Image
              src={item.img}
              alt={item.title || "Search result image"}
              width={200}
              height={200}
              key={index}
              className="rounded-xl bg-accent"
            />
          ),
      )}
    </div>
  );
}

export default ImageList;
