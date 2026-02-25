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
