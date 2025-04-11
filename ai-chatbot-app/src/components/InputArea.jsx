import React, { useState, useEffect } from 'react';
import { useChatContext } from './ChatContext';
import axios from 'axios';
import './InputArea.css';

function InputArea() {
  const [input, setInput] = useState('');
  const { messages, setMessages, setIsTyping } = useChatContext();
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      setRecognition(recog);
    }
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
        const res = await axios.post('https://ai-chatbot-backend-e9ss.onrender.com/api/chat', {

        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...newMessages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
        ],
      });
      const reply = res.data.reply;
      setMessages([...newMessages, { sender: 'bot', text: reply }]);
      speak(reply);
    } catch (err) {
      console.error('Error during message fetch:', err);
      setMessages([...newMessages, { sender: 'bot', text: 'Error: Unable to fetch response.' }]);
    }
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const startListening = () => {
    if (recognition) recognition.start();
  };

  return (
    <div className="input-area dark">
      <input
        className="chat-input dark"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <button className="send-button dark" onClick={sendMessage}>Send</button>
      <button className="mic-button dark" onClick={startListening} title="Speak">🎤</button>
    </div>
  );
}


export default InputArea;