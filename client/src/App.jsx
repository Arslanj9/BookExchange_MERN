import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/Auth/PrivateRoute';  // Add this import

// Lazy load components
const HomePage = React.lazy(() => import('./components/Home/HomePage'));
const BookList = React.lazy(() => import('./components/Books/BookList'));
const Login = React.lazy(() => import('./components/Auth/Login'));
const SignUp = React.lazy(() => import('./components/Auth/SignUp'));
const ForgotPassword = React.lazy(() => import('./components/Auth/ForgotPassword'));
const BookDetail = React.lazy(() => import('./components/Books/BookDetail'));
const BookUpload = React.lazy(() => import('./components/Books/BookUpload'));
const BookRequests = React.lazy(() => import('./components/Books/BookRequests'));
const Messages = React.lazy(() => import('./components/Messages/Messages'));
const Notifications = React.lazy(() => import('./components/Notifications/Notifications'));
const WishList = React.lazy(() => import('./components/Books/WishList'));

function App() {
  return (
    <AuthProvider>
      <Header />
      <main className="main-content">
        <div className="container">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BookList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} /> {/* Ensure this matches */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/books/:id" element={<BookDetail />} />

              {/* Protected Routes */}
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <BookUpload />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/requests" 
                element={
                  <PrivateRoute>
                    <BookRequests />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <PrivateRoute>
                    <WishList />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;