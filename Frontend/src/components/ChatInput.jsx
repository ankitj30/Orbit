import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatInput = () => {
    const [input, setInput] = useState('');
    const { sendMessage, loading } = useChat();
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        sendMessage(input);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <div className="chat-input-container">
            <form className="input-box" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        rows={1}
                        disabled={loading}
                    />
                    <button type="submit" disabled={!input.trim() || loading} className={loading ? 'loading' : ''}>
                        {loading ? <Sparkles className="spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </form>

            <div className="disclaimer">
                TalksyBot may display inaccurate info, including about people, so double-check its responses.
            </div>

            <style>{`
        .chat-input-container {
          padding: 24px 16px;
          background-color: var(--bg-primary);
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .input-box {
          position: relative;
        }

        .input-wrapper {
          background-color: var(--bg-secondary);
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          border: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: #4b9fff;
        }

        textarea {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 16px;
          resize: none;
          max-height: 200px;
          padding: 8px 0;
          outline: none;
        }

        button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        button:hover:not(:disabled) {
          background-color: #36373d;
          color: var(--text-primary);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .disclaimer {
          text-align: center;
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 12px;
        }
      `}</style>
        </div>
    );
};

export default ChatInput;
