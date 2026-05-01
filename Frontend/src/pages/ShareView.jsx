import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './ShareView.css';

const ShareView = () => {
    const { threadId } = useParams();
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedThread = async () => {
            try {
                const API = import.meta.env.VITE_API_URL || "https://orbit-i5ur.onrender.com";
                const res = await fetch(`${API}/share/${threadId}`);
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Failed to load chat");
                }
                const data = await res.json();
                setMessages(data.messages);
                setTitle(data.title);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSharedThread();
    }, [threadId]);

    if (loading) return <div className="share-loading">Loading shared chat...</div>;
    if (error) return <div className="share-error">Check this link. {error}</div>;

    return (
        <div className="share-container">
            <div className="share-header">
                <h1>{title}</h1>
                <span className="share-badge">Shared Chat</span>
            </div>
            <div className="share-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className={`message ${msg.role}`}>
                        <div className="message-content">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShareView;
