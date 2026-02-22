// import { NextResponse } from "next/server";
// import axios from "axios";
// const { getJson } = require("serpapi");
// getJson(
//   {
//     engine: "google",
//     q: "Coffee",
//     location: "Austin, Texas, United States",
//     google_domain: "google.com",
//     hl: "en",
//     gl: "us",
//     api_key: "2cb08d4da3adb88d2ae296b891bf76fe9e42566e4812b02fa84de397e025687b",
//   },
//   (json) => {
//     console.log(json);
//   },
// );
// export async function POST(req) {
//   const { searchInput, searchType } = await req.json();
//   const result = await axios.get(
//     `https://serpapi.com/search.json?engine=google&q=${searchInput}&api_key=${process.env.NEXT_PUBLIC_SERP_API_KEY}&google_domain=google.com&hl=en&gl=us`,
//   );
//   return NextResponse.json(result.data);
// }

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { searchInput } = await req.json();

    if (!searchInput) {
      return NextResponse.json(
        { error: "Search input is required" },
        { status: 400 },
      );
    }

    const result = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google",
        q: searchInput,
        api_key: process.env.SERP_API_KEY,
        google_domain: "google.com",
        hl: "en",
        gl: "us",
        num: 10,
      },
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error); // Important for debugging
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 },
    );
  }
}
