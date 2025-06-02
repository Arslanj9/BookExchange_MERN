import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import './styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         book.author.toLowerCase().includes(filters.search.toLowerCase());
    const matchesGenre = !filters.genre || book.genre === filters.genre;
    const matchesLocation = !filters.location || 
                           book.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesGenre && matchesLocation;
  });

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="book-list">
      <h1>Available Books</h1>
      <div className="search-filters">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by title or author..."
          className="search-input"
        />
        
        <select
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Genres</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="mystery">Mystery</option>
          <option value="sci-fi">Science Fiction</option>
          <option value="romance">Romance</option>
          <option value="thriller">Thriller</option>
          <option value="self-help">Self-Help</option>
        </select>

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Filter by location..."
          className="location-input"
        />

        
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))
        ) : (
          <p>No books found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;