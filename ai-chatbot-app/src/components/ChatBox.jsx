import React, { useEffect, useRef } from 'react';
import { useChatContext } from './ChatContext';
import './ChatBox.css';

function ChatBox() {
  const { messages, isTyping } = useChatContext();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box dark">
      {messages.map((msg, idx) => (
        <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'} dark`}>
          {msg.text}
        </div>
      ))}
      {isTyping && <div className="typing dark">Bot is typing...</div>}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;
