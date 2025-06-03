import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import exchangeRoutes from './routes/exchanges.js';
import requestRoutes from './routes/requests.js';

// Load environment variables
dotenv.config();

// Verify required environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increase payload limit for images
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use("/api/requests", requestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});