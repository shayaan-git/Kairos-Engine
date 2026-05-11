import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { searchInternet } from "./internet.services.js";
import { createAgent } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "search_internet",
  description:
    "Use this tool to search the internet for up-to-date information. Input should be a search query string.",
  schema: z.object({
    query: z
      .string()
      .describe(
        "The search query string to find relevant information on the internet.",
      ),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

export async function generateChatResponse(messages) {
  const response = await agent.invoke(
    {
      messages: messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    }),
    }
  );
  return response.messages[response.messages.length - 1].text;
}

/*
 why HumanMessage? By wrapping the user's message in a HumanMessage, we can ensure that the AI model receives the input correctly and can generate an appropriate response based on that input.
*/
export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates creative titles for chat conversations. User will provide you with the first message of the conversation, and you will generate a concise and relevant title based on that message. The title should capture the essence of the conversation in a 2-4 words.`,
    ),
    new HumanMessage(
      `Generate a title for a conversation based on the following first message: ${message}`,
    ),
  ]);
  return response.text;
}
