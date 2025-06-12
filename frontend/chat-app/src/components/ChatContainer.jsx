import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // 🛑 Stop rendering until authUser is ready
  if (!authUser) {
    return <div className="flex-1 flex items-center justify-center">Loading user...</div>;
  }

  // ✅ Load messages and subscribe on user change
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // ✅ Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {messages.map((message, index) => {
          const isMyMessage = String(message?.senderId) === String(authUser?._id);

        
          return (
            <div
              key={message._id || index}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border">
                  <img
                    src={
                      isMyMessage
                        ? authUser?.profilePicture || "/avatar.png"
                        : selectedUser?.profilePicture || "/avatar.png"
                    }
                    alt="User"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 text-sm opacity-70">
                <time className="text-xs ml-1">
                  {message.createdAt ? formatMessageTime(message.createdAt) : "--"}
                </time>
              </div>

              <div className="chat-bubble bg-base-200 text-base-content max-w-xs break-words">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="rounded-md mb-2 max-w-[200px]"
                  />
                )}
                {message.text ? <span>{message.text}</span> : <span className="italic text-gray-400">No message</span>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
