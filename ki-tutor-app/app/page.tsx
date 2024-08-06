'use client'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader } from '@chatscope/chat-ui-kit-react';
import { useEffect, useState } from 'react';
import { AssistantStream } from 'openai/lib/AssistantStream.mjs';

export default function Home() {
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  // On page load create a new thread
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch("/api/threads", {
         method: "POST"
      });
      const data = await res.json();
      setThreadId(data.threadId);
    }
    if (!threadId) {
      createThread();
    }
  }, [threadId]);

  const sendMessage = async (text) => {
    const response = await fetch(
        `/api/threads/${threadId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: text,
          }),
        }
      );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("event" , (event) => {
      if (event.event === "thread.run.completed") handleRunCompleted()
    });
  };


  const appendMessage = (role, message) => {
    setMessages(prevMessages => {
      const newMessages = [
        ...prevMessages,
        {
          message: message,
          sentTime: "just now",
          sender: "Joe",
          direction: role === "user" ? "outgoing" : "incoming",
          position: "single"
        },
      ];
      return newMessages;
    });
  };

  const appendToLastMessage = (text) => {
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedMessages = prevMessages.slice(0, -1);
      updatedMessages.push({
        ...lastMessage,
        message: lastMessage.message + text,
      });
      return updatedMessages;
    });
  };

  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
  }

  const handleRunCompleted = () => {
    setInputDisabled(false);
  }

  const handleSend = (text) => {
    setInputDisabled(true);
    appendMessage("user", text);
    sendMessage(text);
  }


  return (
    <div style={{ position:"relative", height: "100dvh" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content userName="KI-Tutor" />
          </ConversationHeader>
          <MessageList>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={msg}
              />
            ))}
            </MessageList>
          <MessageInput
            placeholder="Stelle deine Frage..."
            disabled={inputDisabled}
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
