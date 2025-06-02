import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const router = express.Router();

// Protected routes
router.use(authenticateToken);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;