'use client'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useRef, useState } from 'react';
import { AssistantStream } from 'openai/lib/AssistantStream.mjs';
import Markdown from 'react-markdown';

export default function Home() {
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const threadCreated = useRef(false);

  // On page load create a new thread
  useEffect(() => {

    const createThread = async () => {
      const res = await fetch("/api/threads", {
         method: "POST"
      });
      const data = await res.json();
      setThreadId(data.threadId);

      // Send a hidden message to the assistant to encourage the user to ask questions
      sendMessage(data.threadId, "Stelle dich kurz vor und ermutige das Stellen von Fragen.")
    }

    // Only create a thread once
    if (!threadCreated.current) {
      threadCreated.current = true;
      createThread();
    }

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (threadId, text) => {
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

  // Handle the incoming stream of the assistants response
  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("event" , (event) => {
      if (event.event === "thread.run.completed") handleRunCompleted()
    });
  };

  // Append a new message to the chat
  const appendMessage = (role, message) => {
    setMessages(prevMessages => {
      const newMessages = [
        ...prevMessages,
        {
          message: message,
          direction: role === "user" ? "outgoing" : "incoming",
          position: "single",
          type: role === "user" ? "text" : "custom"
        },
      ];
      return newMessages;
    });
  };

  // Append text to the last message in the chat
  const appendToLastMessage = (text) => {
    const cleanedText = removeAnnotations(text);
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1]; //maybe if check
      const updatedMessages = prevMessages.slice(0, -1);
      updatedMessages.push({
        ...lastMessage,
        message: lastMessage.message + cleanedText,
      });
      return updatedMessages;
    });
  };

  const removeAnnotations = (text) => {
    //remove annotations from the text e.g. 【6:0†source】
    return text.replace(/【\d+:\d+†source】/g, "");
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

  const handleSend = (_innerHtml, textContent, _innerText, _nodes) => {
    setInputDisabled(true);
    appendMessage("user", textContent);
    sendMessage(threadId, textContent);
  }


  return (
    <div style={{ position:"relative", height: "100dvh" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content userName="KI-Tutor" />
          </ConversationHeader>
          <MessageList typingIndicator={
            inputDisabled ? <TypingIndicator content="KI-Tutor schreibt..." /> : null
          }>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={msg}
              >
                {msg.type === "custom" && (
                  <Message.CustomContent>
                    <Markdown>{msg.message}</Markdown>
                  </Message.CustomContent>
                )}
              </Message>
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
