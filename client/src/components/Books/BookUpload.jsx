import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles/BookUpload.css';

const BookUpload = () => {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    condition: 'new',
    location: '',
    description: '',
    externalUrls: [''],
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (!bookData.title.trim()) return 'Title is required';
    if (!bookData.author.trim()) return 'Author is required';
    if (!bookData.genre) return 'Genre is required';
    if (!bookData.condition) return 'Condition is required';
    if (!bookData.location.trim()) return 'Location is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to upload a book');
      return;
    }

    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const formattedData = {
      ...bookData,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      location: bookData.location.trim(),
      description: bookData.description.trim(),
      externalUrls: bookData.externalUrls.filter(url => url.trim()),
      images: bookData.images,
      owner: user._id
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload book');
      }

      navigate('/browse');
    } catch (error) {
      setError(error.message);
      console.error('Error uploading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...bookData.externalUrls];
    newUrls[index] = value;
    setBookData(prev => ({
      ...prev,
      externalUrls: newUrls
    }));
  };

  const addUrlField = () => {
    setBookData(prev => ({
      ...prev,
      externalUrls: [...prev.externalUrls, '']
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setBookData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  return (
    <div className="book-upload-container">
      <h2>Upload a Book for Exchange</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Book Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author" className="form-label">Author*</label>
          <input
            type="text"
            id="author"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre" className="form-label">Genre*</label>
          <select
            id="genre"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Select Genre</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="mystery">Mystery</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
            <option value="self-help">Self-Help</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="condition" className="form-label">Condition*</label>
          <select
            id="condition"
            name="condition"
            value={bookData.condition}
            onChange={handleChange}
            required
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={bookData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <p className="form-label">External URLs (Amazon, Daraz etc.)</p>
          {bookData.externalUrls.map((url, index) => (
            <div key={index} className="url-input-group">
              <label htmlFor={`external-url-${index}`}>URL #{index + 1}</label>
              <input
                type="url"
                id={`external-url-${index}`}
                name={`external-url-${index}`}
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="https://"
                autoComplete="url"
              />
            </div>
          ))}
          <button type="button" onClick={addUrlField} className="add-url-btn">
            Add Another URL
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="book-images" className="form-label">Book Images</label>
          <input
            type="file"
            id="book-images"
            name="book-images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="file-input"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  );
};

export default BookUpload;