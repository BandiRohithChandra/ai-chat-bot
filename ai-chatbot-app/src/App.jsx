import React from 'react';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import { ChatProvider } from './components/ChatContext';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <div className="app-container">
        <h1>AI Chatbot 🤖</h1>
        <button className="clear-btn" onClick={() => window.dispatchEvent(new Event('clear-chat'))}>Clear Chat</button>
        <ChatBox />
        <InputArea />
      </div>
    </ChatProvider>
  );
}

export default App;