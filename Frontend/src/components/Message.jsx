import Markdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

const Message = ({ message }) => {
    const isAI = message.role === 'assistant';

    return (
        <div className={`message-container ${isAI ? 'ai' : 'user'}`}>
            <div className="avatar">
                {isAI ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
                {isAI ? (
                    <Markdown>{message.content}</Markdown>
                ) : (
                    <p>{message.content}</p>
                )}
            </div>

            <style>{`
        .message-container {
          display: flex;
          gap: 16px;
          padding: 24px 16px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .message-container.user {
          background-color: var(--msg-user-bg);
          border-radius: 12px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isAI ? 'var(--accent-gradient)' : '#3f4148'};
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .message-content p {
          margin-bottom: 12px;
        }

        .message-content p:last-child {
          margin-bottom: 0;
        }

        .message-content code {
          background: #2b2d31;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
        }

        .message-content pre {
          background: #1e1f24;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
        }

        .message-content pre code {
          background: transparent;
          padding: 0;
        }

        .message-content h1, .message-content h2, .message-content h3 {
           margin-top: 16px;
           margin-bottom: 8px;
           font-weight: 600;
        }
      `}</style>
        </div>
    );
};

export default Message;
