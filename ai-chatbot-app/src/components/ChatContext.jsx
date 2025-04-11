import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    const savedChats = localStorage.getItem('chatHistory');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleClearChat = () => {
      setMessages([]);
      localStorage.removeItem('chatHistory');
    };
    window.addEventListener('clear-chat', handleClearChat);
    return () => window.removeEventListener('clear-chat', handleClearChat);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isTyping, setIsTyping }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);