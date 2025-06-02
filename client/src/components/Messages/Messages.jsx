import React, { useState, useEffect, useRef } from 'react';
import './styles/Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const chatBoxRef = useRef(null);

  // Sample data - replace with API calls
  useEffect(() => {
    setConversations([
      {
        id: 1,
        user: {
          id: 2,
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg'
        },
        book: {
          id: 1,
          title: 'The Great Gatsby',
          cover: '/placeholder-book.jpg'
        },
        messages: [
          {
            id: 1,
            senderId: 2,
            text: 'Hi, I\'m interested in exchanging this book.',
            timestamp: '2024-05-20T10:30:00'
          }
        ],
        unread: true
      }
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: 1, // Current user ID
      text: message,
      timestamp: new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeChat
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    setMessage('');
    // TODO: Send message to backend
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [activeChat, conversations]);

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h2>Messages</h2>
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`conversation-item ${activeChat === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
            onClick={() => setActiveChat(conv.id)}
          >
            <img src={conv.user.avatar} alt={conv.user.name} className="user-avatar" />
            <div className="conversation-info">
              <h3>{conv.user.name}</h3>
              <p className="book-title">Re: {conv.book.title}</p>
              <p className="last-message">
                {conv.messages[conv.messages.length - 1]?.text.substring(0, 30)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-container">
        {activeChat ? (
          <>
            <div className="chat-header">
              <img
                src={conversations.find(c => c.id === activeChat)?.user.avatar}
                alt="User avatar"
                className="user-avatar"
              />
              <div>
                <h3>{conversations.find(c => c.id === activeChat)?.user.name}</h3>
                <p>{conversations.find(c => c.id === activeChat)?.book.title}</p>
              </div>
            </div>

            <div className="chat-messages" ref={chatBoxRef}>
              {conversations
                .find(c => c.id === activeChat)
                ?.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === 1 ? 'sent' : 'received'}`}
                  >
                    <p>{msg.text}</p>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="message-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;