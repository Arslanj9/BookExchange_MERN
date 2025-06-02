import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container" onClick={() => navigate('/')}>
          <h1 className="logo">BookExchange</h1>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li><div onClick={() => navigate('/browse')} className="nav-link">Browse</div></li>
            {user ? (
              <>
                <li><div onClick={() => navigate('/upload')} className="nav-link">Upload Book</div></li>
                <li><div onClick={() => navigate('/requests')} className="nav-link">Requests</div></li>
                <li><div onClick={() => navigate('/wishlist')} className="nav-link">Wish List</div></li>
                <li><div onClick={() => navigate('/chat')} className="nav-link">Messages</div></li>
                <li><div onClick={() => navigate('/notifications')} className="nav-link">Notifications</div></li>
              </>
            ) : null}
          </ul>
        </nav>
        
        <div className="auth-links">
          {user ? (
            <div onClick={logout} className="btn btn-logout">Logout</div>
          ) : (
            <>
              <div onClick={() => navigate('/login')} className="btn btn-login">Login</div>
              <div onClick={() => navigate('/signup')} className="btn btn-signup">Sign Up</div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

