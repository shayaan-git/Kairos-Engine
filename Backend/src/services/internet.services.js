import {tavily as Tavily} from "@tavily/core";

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export const searchInternet = async ({query}) => {
    const result = await tavily.search(query, {
        maxResults: 5,
        searchDepth: "advanced",
    })
    return JSON.stringify(result)
}

/**
 * if just (query), then your function accepts query as a bare string, but the tool() wrapper passes the full parsed schema object { query: "..." } to it. So tavily.search() is receiving { query: "..." } instead of "...".
 That's the only change needed. The tool() wrapper calls your function with the full Zod-parsed object, so { query } destructuring pulls out the string that Tavily expects.
 */