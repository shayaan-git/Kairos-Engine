import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/use.chat";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { RiArrowUpLongLine } from "@remixicon/react";
import remarkGfm from "remark-gfm";
import { Icon } from "@iconify/react";

const Dashboard = () => {
  const chat = useChat();
  const [ChatInput, setChatInput] = useState("");

  const isLoading = useSelector((state) => state.chat.isLoading);

  const chats = useSelector((state) => state.chat.chats);

  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = ChatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(115, 115, 115, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(115, 115, 115, 0.8);
        }
      `}</style>
      <main className="h-screen w-full flex bg-neutral-900 text-neutral-400">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 shadow-lg flex flex-col">
          {/* Logo */}
          <div className="p-6 border-transparent border-neutral-800">
            <h1 className="text-2xl font-bold text-neutral-300">Kairos</h1>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={chat.handleNewChat}
              className="w-full bg-neutral-900 hover:bg-neutral-950 text-neutral-300 rounded-lg px-2 p-1 font-semibold flex items-center gap-2 transition text-left"
            >
              <span className="text-xl">+</span> New Chat
            </button>
          </div>

          {/* Recent History */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <h3 className="text-xs uppercase text-neutral-500 font-semibold mb-4 mt-4">
              Recent History
            </h3>
            <div className="space-y-2">
              {Object.values(chats || {}).map(
                (
                  chatItem, //object.values to convert chats object into an array for mapping
                ) => (
                  <button
                    onClick={() => {
                      openChat(chatItem.id);
                    }}
                    key={chatItem.id}
                    type="button"
                    className="w-full px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition flex justify-start items-center gap-2 text-sm text-left"
                  >
                    <span className="truncate flex-1 min-w-0">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {chatItem.title}
                      </ReactMarkdown>
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Settings and Help */}
          <div className="border-t border-neutral-800 p-4 space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 transition flex items-center gap-3 text-sm">
              <span><Icon icon="et:profile-male" width="20" height="20" color="#00D5FF" /></span> User
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 transition flex items-center gap-3 text-sm">
              <span><Icon icon="si:sign-out-line" width="20" height="20" color="#00D5FF" /></span> Log out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-neutral-900">
          {/* Top Bar */}
          <div className="border-transparent border-neutral-200 p-4 flex justify-between items-center shadow-[0_4px_12px_2px_rgba(24,24,27,0.8),0_1px_8px_0_rgba(39,39,42,0.06)]"></div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="w-full max-w-3xl mx-auto px-6">
              {!currentChatId ? (
                <div className="flex flex-col items-center justify-center h-full text-center mt-32">
                  <h2 className="text-4xl font-semibold text-neutral-300 mb-2">
                    What's on your mind?
                  </h2>
                  <p className="text-neutral-500 text-sm">
                    Ask Kairos to begin a new chat
                  </p>
                </div>
              ) : (
                chats && chats[currentChatId]?.messages?.map?.((msg, index) => (
                  <div key={index} className="mb-8">
                    {msg.role === "user" ? (
                      // User Message
                      <div className="bg-neutral-800 w-fit rounded-lg p-4 max-w-2xl ml-auto mb-6 border border-none">
                        <p className="text-stone-100">{msg.content}</p>
                      </div>
                    ) : (
                      // AI Response with Markdown
                      <div className="max-w-4xl">
                        {/* AI Message Header */}
                        {/* <div className="flex items-center gap-2 mb-4">
                        <span className="text-red-500 text-xl">🤖</span>
                        <h2 className="text-2xl font-semibold">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {chats[currentChatId]?.title || ""}
                          </ReactMarkdown>
                        </h2>
                      </div> */}

                        {/* Main Content */}
                        <div className="text-stone-100 mb-6 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-3xl font-bold mt-6 mb-4 text-white"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-2xl font-semibold mt-5 mb-3 text-white"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-xl font-semibold mt-4 mb-2 text-gray-100"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  className="text-stone-100 mb-4 leading-relaxed"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc list-inside mb-4 text-stone-100 space-y-2"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal list-inside mb-4 text-stone-100 space-y-2"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="text-stone-100" {...props} />
                              ),
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                  <code
                                    className="bg-neutral-700 rounded px-2 py-1 text-orange-300 font-mono text-sm"
                                    {...props}
                                  />
                                ) : (
                                  <code
                                    className="block bg-neutral-800 rounded-lg p-4 text-orange-300 font-mono text-sm mb-4 overflow-x-auto"
                                    {...props}
                                  />
                                ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-orange-500 pl-4 italic text-neutral-300 my-4"
                                  {...props}
                                />
                              ),
                              table: ({ node, ...props }) => (
                                <table
                                  className="border-collapse w-full my-4"
                                  {...props}
                                />
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  className="border border-neutral-600 bg-neutral-800 px-4 py-2 text-white text-left"
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  className="border border-neutral-600 px-4 py-2 text-stone-100"
                                  {...props}
                                />
                              ),
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-orange-500 hover:text-orange-400 underline"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Sections if available */}
                        {msg.sections && msg.sections.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {msg.sections.map((section, idx) => (
                              <div
                                key={idx}
                                className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
                              >
                                <ReactMarkdown>
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  <h3 className="font-semibold text-white mb-2">
                                    {section.title}
                                  </h3>
                                </ReactMarkdown>
                                <div className="text-white text-sm prose prose-invert max-w-none">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                  >
                                    {section.content}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Additional Info if available */}
                        {msg.additionalInfo && (
                          <div className="text-neutral-300 text-sm leading-relaxed mb-6 prose prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {msg.additionalInfo}
                            </ReactMarkdown>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {/* <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-800 transition text-neutral-300 hover:text-neutral-400">
                          <span>📋</span> Copy
                        </button>
                      </div> */}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/*Spinner*/}
              {isLoading && (
                <div className="mb-8 max-w-4xl">
                  <Icon
                    icon="svg-spinners:pulse-rings-2"
                    width="28"
                    color="#00D5FF"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-transparent border-neutral-800 p-6 bg-neutral-900">
            <div className="max-w-3xl mx-auto px-6">
              {/* Input Field */}
              <div className="relative mb-4">
                <style>{`
                   textarea::-webkit-scrollbar {
                     width: 6px;
                   }
                   textarea::-webkit-scrollbar-track {
                     background: transparent;
                   }
                   textarea::-webkit-scrollbar-thumb {
                     background: rgba(255, 255, 255, 0.1);
                     border-radius: 999px;
                     cursor: default;
                   }
                   textarea::-webkit-scrollbar-thumb:hover {
                     background: rgba(255, 255, 255, 0.3);
                   }
                   textarea::-webkit-scrollbar-thumb:active {
                     background: rgba(255, 255, 255, 0.5);
                   }
                `}</style>

                <textarea
                  value={ChatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSubmitMessage(e)
                  }
                  placeholder="Write a message..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-4 text-white placeholder-neutral-500 focus:outline-none text-left focus:border-neutral-600 transition resize-none overflow-y-auto"
                  style={{ minHeight: "130px", maxHeight: "55vh" }}
                />
                <button
                  onClick={handleSubmitMessage}
                  className="absolute p-3 right-3 bottom-5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  <RiArrowUpLongLine size={20} />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Kairos may provide inaccurate information about markets or
                  financial trends. Please verify critical data.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
