import React, { useState, useEffect } from "react";
import "./styles/WishList.css";
import BookCard from "./BookCard";

const WishList = () => {
    const [wishList, setWishList] = useState([]);
    const [newWish, setNewWish] = useState({ title: "", author: "" });
    const [wishlistBooks, setWishlistBooks] = useState([]);

    useEffect(() => {
        const fetchWishlistBooks = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(
                `http://localhost:3000/api/books/user/${user._id}/wishlist`
            );
            const data = await res.json();

            const wishlistIds = data.wishlist;

            // Fetch full book data for each book
            const bookDetails = await Promise.all(
                wishlistIds.map((id) =>
                    fetch(`http://localhost:3000/api/books/${id}`).then((res) =>
                        res.json()
                    )
                )
            );

            setWishlistBooks(bookDetails); // Use this in your component
        };

        fetchWishlistBooks();
    }, []);

    // Update localStorage whenever wishList changes
    useEffect(() => {
        localStorage.setItem("wishList", JSON.stringify(wishList));
    }, [wishList]);

    const addToWishList = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newWish),
            });
            if (response.ok) {
                setWishList([...wishList, newWish]);
                setNewWish({ title: "", author: "" });
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishList = async (index) => {
        try {
            const updatedList = wishList.filter((_, i) => i !== index);
            setWishList(updatedList);
        } catch (error) {
            console.error("Error removing from wishlist:", error);
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
                    onChange={(e) =>
                        setNewWish({ ...newWish, title: e.target.value })
                    }
                    required
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newWish.author}
                    onChange={(e) =>
                        setNewWish({ ...newWish, author: e.target.value })
                    }
                    required
                    className="input-field"
                />
                <button type="submit" className="btn btn-primary">
                    Add to Wish List
                </button>
            </form>

            <div className="books-grid">
                {wishlistBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </div>

            {/* <div className="wishlist-items">
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
            </div> */}
        </div>
    );
};

export default WishList;
