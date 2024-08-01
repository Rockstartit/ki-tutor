'use client'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import { useState } from 'react';
import { MessageDirection } from '@chatscope/chat-ui-kit-react/src/types/unions';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      message: "Hello my friend",
      sentTime: "just now",
      sender: "Joe",
      direction: "incoming" as MessageDirection, // Assign a valid MessageDirection value
      position: "single" as const
    },
    {
      message: "Hello how are you?",
      sentTime: "just now",
      sender: "Joe",
      direction: "outgoing" as MessageDirection, // Assign a valid MessageDirection value
      position: "single" as const
    },
    // Add more messages here if needed
  ]);

  return (
    <div style={{ position:"relative", height: "100vh" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={msg}
              />
            ))}
            </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
