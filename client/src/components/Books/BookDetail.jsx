import React, { useState, useEffect, startTransition } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';
import './styles/BookDetail.css';

const BookDetail = ({ books = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find book by ID from the books array or fetch from API
    const foundBook = books.find(b => b.id === parseInt(id));
    if (foundBook) {
      setBook(foundBook);
      setLoading(false);
    } else {
      // TODO: Fetch book from API if not found in props
      // For now, use sample data
      const sampleBook = {
        id: parseInt(id),
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic Fiction",
        condition: "excellent",
        location: "New York",
        status: "Available",
        description: "A classic American novel about the Jazz Age, exploring themes of wealth, love, and the American Dream. Set in the summer of 1922, it follows the mysterious Jay Gatsby and his obsession with Daisy Buchanan.",
        images: [
          "/book1-front.jpg",
          "/book1-back.jpg",
          "/book1-inside.jpg"
        ],
        owner: {
          name: "John Doe",
          avatar: "👨‍💼"
        },
        newBookUrls: {
          amazon: "https://amazon.com/great-gatsby",
          daraz: "https://daraz.com/great-gatsby"
        }
      };
      setBook(sampleBook);
      setLoading(false);
    }
  }, [id, books]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit request
    console.log('Request submitted:', {
      bookId: book.id,
      message: requestMessage,
      ownerName: book.owner.name
    });
    setShowRequestForm(false);
    setRequestMessage('');
  };

  const nextImage = () => {
    if (book?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
    }
  };

  const prevImage = () => {
    if (book?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'available';
      case 'exchanged':
        return 'exchanged';
      case 'pending':
        return 'pending';
      default:
        return 'available';
    }
  };

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-container">
        <div className="error">Book not found</div>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-grid">
        {/* Left Column */}
        <div className="book-image-column">
          <div className="book-image-wrapper">
            {book.images && book.images.length > 0 ? (
              <>
                <img 
                  src={book.images[currentImageIndex]} 
                  alt={`${book.title} - Image ${currentImageIndex + 1}`}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-book.jpg";
                  }}
                />
                {book.images.length > 1 && (
                  <div className="image-navigation">
                    <button className="nav-btn prev" onClick={prevImage}>‹</button>
                    <span className="image-counter">
                      {currentImageIndex + 1} / {book.images.length}
                    </span>
                    <button className="nav-btn next" onClick={nextImage}>›</button>
                  </div>
                )}
                <div className="image-dots">
                  {book.images.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <img src="/placeholder-book.jpg" alt="Book cover" className="book-cover" />
            )}
            
            <span className={`status-badge ${getStatusColor(book.status)}`}>
              {book.status}
            </span>
          </div>
          
          <div className="owner-profile">
            <div className="owner-header">
              <div className="owner-avatar-wrapper">
                {book.owner.avatar.startsWith('http') ? (
                  <img src={book.owner.avatar} alt={book.owner.name} className="owner-avatar" />
                ) : (
                  <div className="owner-avatar emoji-avatar">{book.owner.avatar}</div>
                )}
              </div>
              <div className="owner-info">
                <h3>{book.owner.name}</h3>
                <div className="location">{book.location}</div>
              </div>
            </div>
            <button className="message-owner-btn">Message Owner</button>
          </div>

          {/* New Book Purchase Links */}
          {book.newBookUrls && (
            <div className="purchase-links">
              <h4>Buy New Copy</h4>
              <div className="purchase-buttons">
                {book.newBookUrls.amazon && (
                  <a 
                    href={book.newBookUrls.amazon} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="purchase-link amazon"
                  >
                    Amazon
                  </a>
                )}
                {book.newBookUrls.daraz && (
                  <a 
                    href={book.newBookUrls.daraz} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="purchase-link daraz"
                  >
                    Daraz
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="book-info-column">
          <div className="book-header">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by {book.author}</p>
          </div>

          <div className="book-meta">
            <div className="meta-item">
              <span className="label">Genre</span>
              <span className="value">{book.genre}</span>
            </div>
            <div className="meta-item">
              <span className="label">Condition</span>
              <span className="value">
                {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
              </span>
            </div>
            <div className="meta-item">
              <span className="label">Location</span>
              <span className="value">{book.location}</span>
            </div>
            <div className="meta-item">
              <span className="label">Status</span>
              <span className={`value status ${getStatusColor(book.status)}`}>
                {book.status}
              </span>
            </div>
          </div>

          <div className="book-description">
            <h2>About this book</h2>
            <p>{book.description}</p>
          </div>

          <div className="exchange-actions">
            {book.status.toLowerCase() === 'available' ? (
              <button 
                className="request-exchange-btn"
                onClick={() => setShowRequestForm(true)}
              >
                Request Exchange
              </button>
            ) : (
              <button className="request-exchange-btn disabled" disabled>
                {book.status === 'exchanged' ? 'Already Exchanged' : 'Not Available'}
              </button>
            )}
            <button className="add-wishlist-btn">Add to Wishlist</button>
          </div>
        </div>
      </div>

      {/* Exchange Request Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="request-modal">
            <div className="modal-header">
              <h2>Request Book Exchange</h2>
              <button className="close-btn" onClick={() => setShowRequestForm(false)}>×</button>
            </div>
            <div className="request-book-info">
              <strong>{book.title}</strong> by {book.author}
              <br />
              <small>Owner: {book.owner.name}</small>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <textarea
                placeholder={`Write a message to ${book.owner.name}...`}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                required
                rows={4}
              />
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Send Request</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Update your router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    // Your routes here, make sure to use absolute paths
    <Route path="/" element={<Layout />}>
      <Route path="/books" element={<Books />} />
      {/* Use absolute paths instead of relative ones */}
    </Route>
  ),
  {
    future: {
      // Opt-in to the new behavior
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

// In your main component
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default BookDetail;