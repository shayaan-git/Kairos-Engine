import { initializeSocketConnection } from "../service/chat.socket.js";

import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api.js";

import {
  setChats,
  setCurrentChatId,
  setError,
  setChatLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice.js";

import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  /**
   * This function handles sending a message. It manages the loading state, updates the chat list if a new chat is created, and adds both the user's message and the AI's response to the chat history. It also sets the current chat ID to ensure the UI reflects the active converstation.
   */
  async function handleSendMessage({ message, chatId }) {
    dispatch(setChatLoading(true));
    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      if (!chatId)
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: message,
          role: "user",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chatId || chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setChatLoading(false)); // ✅ always resets loading
    }
  }

  /**
   * This function simply fetches the list of chats and updates the state. It doesn't need to handle messages or chat creation logic since it's only responsible for retrieving existing chats.
   */
  async function handleGetChats() {
    dispatch(setChatLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setChatLoading(false));
  }

  /**
   * This function fetches the messages for a specific chat (chatId) and updates the state (addMessages) with those messages. It also sets the current chat ID to ensure the UI reflects the active conversation. The messages are formatted to match the expected structure in the state. This function is crucial for loading the chat history when a user opens an existing chat.
   */
  async function handleOpenChat(chatId, chats) {
    /*
     * Before fetching messages, we check if the messages for the opened chat are already loaded in the state (chats[chatId]?.messages.length === 0). If they are not loaded (length is 0), we proceed to fetch the messages from the API. This optimization prevents unnecessary API calls and ensures that we only fetch messages when needed, improving performance and user experience.
     */

    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages({ chatId });
      const { messages } = data;

      /**
       * remember in the state (messages) we only store content and role for messages, so we need to format the messages accordingly before dispatching into the addMessages action. The API response may contain additional fields (like _id, timestamp, etc.) that we don't need to store in the state for rendering the chat history. By mapping over the messages and extracting only the content and role, we ensure that our state remains clean and focused on what's necessary for the UI.
       */
      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      /**
       * now we can dispatch the formatted messages to the addMessages action, which will update the state (chats[chatId].messages) with the messages for the opened chat. We also set the current chat ID to ensure the UI reflects the active converstation.
       */
      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }
    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
