import React, { useState, useEffect } from 'react';
import './styles/WishList.css';

const WishList = () => {
  const [wishList, setWishList] = useState([]);
  const [newWish, setNewWish] = useState({ title: '', author: '' });

  useEffect(() => {
    // Load wishlist from localStorage when component mounts
    const savedWishList = localStorage.getItem('wishList');
    if (savedWishList) {
      setWishList(JSON.parse(savedWishList));
    }
  }, []);

  // Update localStorage whenever wishList changes
  useEffect(() => {
    localStorage.setItem('wishList', JSON.stringify(wishList));
  }, [wishList]);

  const addToWishList = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWish),
      });
      if (response.ok) {
        setWishList([...wishList, newWish]);
        setNewWish({ title: '', author: '' });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishList = async (index) => {
    try {
      const updatedList = wishList.filter((_, i) => i !== index);
      setWishList(updatedList);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>My Wish List</h2>
      <form onSubmit={addToWishList} className="wishlist-form">
        <input
          type="text"
          placeholder="Book Title"
          value={newWish.title}
          onChange={(e) => setNewWish({ ...newWish, title: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Author"
          value={newWish.author}
          onChange={(e) => setNewWish({ ...newWish, author: e.target.value })}
          required
          className="input-field"
        />
        <button type="submit" className="btn btn-primary">Add to Wish List</button>
      </form>
      
      <div className="wishlist-items">
        {wishList.map((item, index) => (
          <div key={index} className="wishlist-item">
            <h3>{item.title}</h3>
            <p>By {item.author}</p>
            <button 
              onClick={() => removeFromWishList(index)}
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;