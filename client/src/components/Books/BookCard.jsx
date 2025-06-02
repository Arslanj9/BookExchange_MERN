import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/BookCard.css";

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false); // true if book is in wishlist

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = user?._id === book.owner._id;

    useEffect(() => {
        const fetchWishlistStatus = async () => {
            if (!user?._id || !book?._id) return;

            try {
                const res = await fetch(`http://localhost:3000/api/books/user/${user._id}/wishlist`);
                const data = await res.json();

                if (Array.isArray(data.wishlist)) {
                    const isInWishlist = data.wishlist.includes(book._id);
                    setIsWishlisted(isInWishlist);
                } else {
                    console.warn("Unexpected wishlist format:", data);
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        };

        fetchWishlistStatus();
    }, [user?._id, book?._id]);

    const handleWishlistToggle = async (e) => {
        e.stopPropagation();

        console.log("hello G");
        try {
            const res = await fetch(
                `http://localhost:3000/api/books/toggleWishlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        bookId: book._id,
                    }),
                }
            );

            if (res.ok) {
                setIsWishlisted((prev) => !prev); // Toggle local state
            } else {
                console.error("Failed to toggle wishlist");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
        setIsImageZoomed(true);
    };

    const handleCloseZoom = (e) => {
        e.stopPropagation();
        setIsImageZoomed(false);
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        if (book.images && book.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
        }
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (book.images && book.images.length > 1) {
            setCurrentImageIndex(
                (prev) => (prev - 1 + book.images.length) % book.images.length
            );
        }
    };

    const getConditionColor = (condition) => {
        switch (condition?.toLowerCase()) {
            case "excellent":
                return {
                    bg: "#10B981",
                    shadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                };
            case "good":
                return {
                    bg: "#3B82F6",
                    shadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                };
            case "fair":
                return {
                    bg: "#F59E0B",
                    shadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                };
            case "poor":
                return {
                    bg: "#EF4444",
                    shadow: "0 0 20px rgba(239, 68, 68, 0.4)",
                };
            default:
                return {
                    bg: "#6B7280",
                    shadow: "0 0 20px rgba(107, 114, 128, 0.4)",
                };
        }
    };

    const getConditionIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case "excellent":
                return "✨";
            case "good":
                return "👍";
            case "fair":
                return "📖";
            case "poor":
                return "📚";
            default:
                return "📄";
        }
    };

    const getNewBookUrl = () => {
        if (book.newBookUrls) {
            if (book.newBookUrls.amazon)
                return { name: "Amazon", url: book.newBookUrls.amazon };
            if (book.newBookUrls.daraz)
                return { name: "Daraz", url: book.newBookUrls.daraz };
            if (book.newBookUrls.other)
                return { name: "Buy New", url: book.newBookUrls.other };
        }
        return null;
    };

    const currentImage =
        book.images && book.images.length > 0
            ? book.images[currentImageIndex]
            : book.imageUrl || "/placeholder-book.jpg";

    const newBookLink = getNewBookUrl();
    const conditionStyle = getConditionColor(book.condition);

    return (
        <>
            <div
                className={`book-card ${isHovered ? "hovered" : ""}`}
                // onClick={() => navigate(`/books/${book.id}`)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated Background Gradient */}
                <div className="card-background-gradient"></div>

                {/* Floating Particles */}
                <div className="floating-particles">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                </div>

                <div className="book-image-container">
                    <div className="book-image-wrapper">
                        <div className="image-glow"></div>
                        <img
                            src={currentImage}
                            alt={book.title}
                            className="book-cover"
                            onClick={handleImageClick}
                        />

                        {/* Enhanced Overlay */}
                        <div className="image-overlay">
                            <div className="overlay-content">
                                <div
                                    className="zoom-icon"
                                    onClick={handleImageClick}
                                >
                                    <span className="zoom-icon-bg"></span>
                                    <span className="zoom-icon-text">🔍</span>
                                </div>

                                <button
                                    className="quick-action-btn favorite"
                                    onClick={handleWishlistToggle}
                                >
                                    <span>{isWishlisted ? "💖" : "🤍"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Image Indicators */}
                        {book.images && book.images.length > 1 && (
                            <div className="image-indicators">
                                {book.images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`indicator ${
                                            index === currentImageIndex
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Badges */}
                    <div className="book-badges">
                        <div className="badge-container">
                            <span className="book-status pulse">
                                <span className="status-icon">⚡</span>
                                {book.status || "Available"}
                            </span>
                            <span
                                className="book-condition glow"
                                style={{
                                    backgroundColor: conditionStyle.bg,
                                    boxShadow: conditionStyle.shadow,
                                }}
                            >
                                <span className="condition-icon">
                                    {getConditionIcon(book.condition)}
                                </span>
                                {book.condition || "Good"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="book-info">
                    <div className="book-header">
                        <h3 className="book-title">
                            <span className="title-text">{book.title}</span>
                            <div className="title-underline"></div>
                        </h3>
                        <p className="book-author">
                            <span className="author-icon">✍️</span>
                            by {book.author}
                        </p>
                    </div>

                    <div className="book-details">
                        <div className="book-meta-row">
                            <span className="book-genre">
                                <span className="genre-icon">📚</span>
                                {book.genre}
                            </span>
                            <span className="book-location">
                                <span className="location-icon">📍</span>
                                {book.location}
                            </span>
                        </div>

                        {book.description && (
                            <div className="book-description-container">
                                <p className="book-description">
                                    {book.description.length > 80
                                        ? `${book.description.substring(
                                              0,
                                              80
                                          )}...`
                                        : book.description}
                                </p>
                                <div className="description-fade"></div>
                            </div>
                        )}

                        <div className="book-footer">
                            <div className="book-owner">
                                <div className="owner-avatar-container">
                                    <div className="owner-avatar">
                                        {book.owner?.avatar || "👤"}
                                    </div>
                                    <div className="owner-status-dot"></div>
                                </div>
                                <div className="owner-info">
                                    <span className="owner-name">
                                        {book.owner?.name || "Anonymous"}
                                    </span>
                                    <span className="owner-status">Active</span>
                                </div>
                            </div>

                            {newBookLink && (
                                <a
                                    href={newBookLink.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="new-book-link"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className="link-icon">🛒</span>
                                    <span className="link-text">
                                        {newBookLink.name}
                                    </span>
                                    <span className="link-arrow">→</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="book-actions">
                    <button
                        className={`action-btn ${!isOwner ? "secondary" : ""}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Request book:", book.id);
                        }}
                        disabled={
                            JSON.parse(localStorage.getItem("user"))?._id ===
                            book.owner._id
                        }
                    >
                        <span className="btn-icon">📬</span>
                        <span className="btn-text">Request</span>
                        <div className="btn-ripple"></div>
                    </button>
                </div>

                {/* Magic Corner */}
                <div className="magic-corner">
                    <div className="corner-sparkle"></div>
                </div>
            </div>

            {/* Enhanced Image Zoom Modal */}
            {isImageZoomed && (
                <div className="image-zoom-overlay" onClick={handleCloseZoom}>
                    <div className="zoom-background-blur"></div>
                    <div className="image-zoom-container">
                        <button
                            className="zoom-close"
                            onClick={handleCloseZoom}
                        >
                            <span className="close-icon">✕</span>
                        </button>

                        {book.images && book.images.length > 1 && (
                            <>
                                <button
                                    className="zoom-nav prev"
                                    onClick={handlePrevImage}
                                >
                                    <span>‹</span>
                                </button>
                                <button
                                    className="zoom-nav next"
                                    onClick={handleNextImage}
                                >
                                    <span>›</span>
                                </button>
                            </>
                        )}

                        <div className="zoomed-image-container">
                            <img
                                src={currentImage}
                                alt={book.title}
                                className="zoomed-image"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="image-reflection"></div>
                        </div>

                        <div className="zoom-info">
                            <h3 className="zoom-title">{book.title}</h3>
                            <p className="zoom-author">by {book.author}</p>
                            {book.images && book.images.length > 1 && (
                                <span className="image-counter">
                                    <span className="counter-current">
                                        {currentImageIndex + 1}
                                    </span>
                                    <span className="counter-separator">
                                        of
                                    </span>
                                    <span className="counter-total">
                                        {book.images.length}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookCard;
