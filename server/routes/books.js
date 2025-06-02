import express from 'express';
// import { authenticateToken } from '../middleware/auth.js';
import { 
    getAllBooks, 
    getBookById, 
    createBook, 
    updateBook, 
    deleteBook,
    toggleWishlist,
    getUserWishlist
} from '../controllers/bookController.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes
// router.use(authenticateToken);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.post("/toggleWishlist", toggleWishlist);

router.get("/user/:userId/wishlist", getUserWishlist);

export default router;