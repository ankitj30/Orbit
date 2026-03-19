import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Share2 } from 'lucide-react';
import Message from './Message';
import React from 'react';

const ChatArea = () => {
  const { currentThread, messages, sendMessage, isLoading, shareThread } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const handleShare = async () => {
    if (!currentThread) return;
    const url = await shareThread(currentThread.threadId);
    if (url) {
      navigator.clipboard.writeText(url);
      // Simple toast logic could go here, for now alert is fine as per requirements (or minimal UX)
      alert("Link copied: " + url);
    }
  };

  if (!currentThread) {
    return <div className="chat-area empty">
      <h1>Welcome to Orbit</h1>
      <p>Start a new conversation to begin.</p>
    </div>;
  }

  return (
    <main className="chat-area">
      <header className="chat-header">
        <div className="header-info">
          <h2>{currentThread.title}</h2>
          <span className="model-badge">Gemini Flash</span>
        </div>
        <button className="share-btn" onClick={handleShare} title="Share Chat">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </header>

      <div className="messages-list">
        {messages.map((msg, index) => (
          <Message key={msg._id || index} message={msg} />
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChatArea;
