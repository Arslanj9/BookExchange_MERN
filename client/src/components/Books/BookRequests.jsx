import React, { useState } from 'react';
import './styles/BookRequests.css';

const BookRequests = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [requests, setRequests] = useState([
    {
      id: 1,
      bookTitle: 'Book Title',
      requesterName: 'John Doe',
      requestDate: '2 days ago',
      message: 'I would love to exchange this book. I can meet anywhere in downtown.',
      status: 'pending',
      bookCover: '/placeholder-book.jpg'
    }
    // Add more sample requests as needed
  ]);

  const handleRequestAction = (requestId, action) => {
    setRequests(prevRequests => 
      prevRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: action === 'accept' ? 'accepted' : 'rejected'
          };
        }
        return request;
      })
    );

    // TODO: Make API call to update request status
    console.log(`Request ${requestId} ${action}ed`);
  };

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h1>Book Exchange Requests</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            Incoming Requests
          </button>
          <button
            className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('outgoing')}
          >
            Outgoing Requests
          </button>
        </div>
      </div>

      <div className="requests-list">
        {activeTab === 'incoming' ? (
          <IncomingRequests requests={requests} onAction={handleRequestAction} />
        ) : (
          <OutgoingRequests requests={requests} />
        )}
      </div>
    </div>
  );
};

const IncomingRequests = ({ requests, onAction }) => {
  return (
    <div className="requests-grid">
      {requests.map(request => (
        <div key={request.id} className="request-card">
          <div className="request-book-info">
            <img src={request.bookCover} alt="Book cover" />
            <div>
              <h3>{request.bookTitle}</h3>
              <p>Requested by: {request.requesterName}</p>
              <p className="request-date">{request.requestDate}</p>
            </div>
          </div>
          <p className="request-message">"{request.message}"</p>
          
          {request.status === 'pending' ? (
            <div className="request-actions">
              <button
                className="accept-button"
                onClick={() => onAction(request.id, 'accept')}
              >
                Accept
              </button>
              <button
                className="reject-button"
                onClick={() => onAction(request.id, 'reject')}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className={`request-status ${request.status}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const OutgoingRequests = ({ requests }) => {
  return (
    <div className="requests-grid">
      {requests.filter(request => request.status !== 'pending').map(request => (
        <div key={request.id} className="request-card">
          <div className="request-book-info">
            <img src={request.bookCover} alt="Book cover" />
            <div>
              <h3>{request.bookTitle}</h3>
              <p>Owner: {request.requesterName}</p>
              <p className="request-date">{request.requestDate}</p>
            </div>
          </div>
          <p className="request-message">"{request.message}"</p>
          <div className={`request-status ${request.status}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookRequests;