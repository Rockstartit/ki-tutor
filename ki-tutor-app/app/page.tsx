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
import { Suspense, useEffect, useRef, useState } from 'react';
import { AssistantStream } from 'openai/lib/AssistantStream.mjs';
import Markdown from 'react-markdown';
import { useSearchParams } from 'next/navigation';

const ROLE_USER = "user"
const ROLE_ASSISTANT = "assistant"
const MSG_TYPE_TEXT = "text"
const MSG_TYPE_CUSTOM = "custom"

function ChatComponent() {
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const threadCreated = useRef(false);
  const searchParams = useSearchParams()
  const assistantId = searchParams.get("assistant");

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

    let url = `/api/threads/${threadId}`;

    // Add the assistantId to the url if it is provided
    if (assistantId) {
      url += `?assistantId=${assistantId}`;
    }

    const response = await fetch(url,
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
      const isUser = role === ROLE_USER;
      const newMessages = [
        ...prevMessages,
        {
          message: message,
          direction: isUser ? "outgoing" : "incoming",
          position: "single",
          type: isUser ? MSG_TYPE_TEXT : MSG_TYPE_CUSTOM // Assistant responses can be in markdown so we need to use the custom type
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
    // Add a new empty message to the chat
    appendMessage(ROLE_ASSISTANT, "");
  };

  const handleTextDelta = (delta) => {
    // Append the message part to the last message in the chat
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
  }

  // Enable the input field after the assistant has finished his response
  const handleRunCompleted = () => {
    setInputDisabled(false);
  }

  // On send disable the input field and append the user message to the chat
  // Then send the message to the backend for the assistant to process
  const handleSend = (_innerHtml, textContent, _innerText, _nodes) => {
    setInputDisabled(true);
    appendMessage(ROLE_USER, textContent);
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
                {msg.type === MSG_TYPE_CUSTOM && (
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

// Wrap the ChatComponent with Suspense for handling the asynchronous nature of useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
}