import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, MessageSquare, Trash2, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { threads, loadThread, currentThread, createNewThread, deleteThread } = useChat();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">Orbit</div>
        <button onClick={createNewThread} className="new-chat-btn">
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="recent-chats">
        <h3 className="section-title">Recent Chats</h3>
        <div className="chat-list">
          {threads.length === 0 ? (
            <div className="empty-state">No history yet</div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.threadId}
                className={`chat-item ${currentThread?.threadId === thread.threadId ? 'active' : ''}`}
                onClick={() => loadThread(thread.threadId)}
              >
                <div className="chat-item-content">
                  <MessageSquare size={16} />
                  <span className="chat-title">{thread.title || 'New Chat'}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this chat?')) deleteThread(thread.threadId);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        {user && (
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-plan">Free User</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
