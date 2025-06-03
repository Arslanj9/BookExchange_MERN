import Book from '../models/Book.js';
import User from '../models/User.js';

// Example usage
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      message: 'Error fetching books', 
      error: error.message 
    });
  }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('owner', 'username email');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBook = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        detail: 'User ID not found in request' 
      });
    }

    const bookData = {
      ...req.body,
      owner: req.user._id
    };

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      message: 'Book created successfully',
      book: await book.populate('owner', 'username email')
    });
  } catch (error) {
    console.error('Book creation error:', error);
    res.status(error.name === 'ValidationError' ? 400 : 500).json({ 
      message: 'Error creating book', 
      detail: error.message 
    });
  }
};

export const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Check if user is the owner
        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this book' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user is the owner
        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this book' });
        }

        await book.remove();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const toggleWishlist = async (req, res) => {
  const { bookId, userId } = req.body;


  if (!bookId || !userId) {
    return res.status(400).json({ message: "Missing userId or bookId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(bookId);
    let updatedWishlist;

    if (index > -1) {
      updatedWishlist = user.wishlist.filter(id => id.toString() !== bookId);
    } else {
      updatedWishlist = [...user.wishlist, bookId];
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { wishlist: updatedWishlist },
      { new: true }
    );

    res.status(200).json({ wishlist: updatedUser.wishlist });
  } catch (err) {
    console.error("Wishlist Error:", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};



export const getUserWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("wishlist", "_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist.map(book => book._id.toString()) });
  } catch (err) {
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};