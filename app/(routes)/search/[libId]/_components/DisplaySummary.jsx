import React from "react";
import ReactMarkdown from "react-markdown";

function DisplaySummary({ aiResp }) {
  return (
    <div className="w-full">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold text-gray-900 mb-4 leading-snug"
              {...props}
            />
          ),

          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-semibold text-gray-900 mb-3 leading-snug"
              {...props}
            />
          ),

          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold text-gray-800 mt-4 mb-2 leading-tight"
              {...props}
            />
          ),

          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),

          a: ({ node, ...props }) => (
            <a
              className="text-[#24b2ad] hover:underline font-medium"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),

          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside space-y-2 leading-relaxed"
              {...props}
            />
          ),

          li: ({ node, ...props }) => <li className="mb-1" {...props} />,

          blockquote: ({ node, ...props }) => (
            <blockquote
              className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6"
              {...props}
            />
          ),

          // Table Styling

          table: ({ node, ...props }) => (
            <table
              className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300"
              {...props}
            />
          ),

          th: ({ node, ...props }) => (
            <th
              className="border border-gray-300 px-4 py-2 bg-gray-100 text-left"
              {...props}
            />
          ),

          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),

          // Code Block Styling with Syntax Highlighter

          code: ({ node, inline, className, children, ...props }) => {
            return !inline ? (
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-100 my-4 shadow-sm">
                <code className="text-sm text-gray-800 font-mono" {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
}

export default DisplaySummary;
