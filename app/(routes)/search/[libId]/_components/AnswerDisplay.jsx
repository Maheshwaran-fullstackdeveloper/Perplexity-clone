import { LucideList, LucideSparkles } from "lucide-react";
import React from "react";
import SourceList from "./SourceList";
import DisplaySummary from "./DisplaySummary";

function AnswerDisplay({ chat }) {
  return (
    <div className="mt-10 flex flex-col gap-6 font-sans">
      {/* Sources Section */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LucideList className="w-4 h-4 text-gray-700" />
          <h2 className="font-bold text-base">Sources</h2>
        </div>
        <SourceList webResult={chat?.searchResult} />
      </div>

      {/* Answer Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LucideSparkles className="w-4 h-4 text-[#24b2ad]" />
          <h2 className="font-bold text-base">Answer</h2>
        </div>
        <div className="prose max-w-none">
          {chat?.aiResp ? (
            <DisplaySummary aiResp={chat?.aiResp} />
          ) : (
            <div className="flex flex-col gap-3 animate-pulse py-4">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-11/12"></div>
              <div className="h-4 bg-gray-100 rounded w-4/5"></div>
              <div className="h-3 bg-gray-50 rounded w-1/2 mt-2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnswerDisplay;
