import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ErrorPage.css';

const ErrorPage = ({ statusCode = 404, title = "Page Not Found", message = "The page you're looking for doesn't exist or has been moved." }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    // Auto-redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  const handleActionRedirect = (path) => {
    navigate(path);
  };

  // Random glitch elements for gaming aesthetic
  const renderGlitchElements = () => {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const width = Math.random() * 50 + 10;
      elements.push(
        <div 
          key={i} 
          className="glitch-element"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${width}px`,
          }}
        />
      );
    }
    return elements;
  };

  return (
    <div className="error-container">
      {renderGlitchElements()}
      
      <div className="error-card">
        <div className="error-content">
          <div className="error-icon">
            {statusCode === 404 && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="error-svg"/>
              </svg>
            )}
            {statusCode === 401 && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="error-svg"/>
              </svg>
            )}
            {statusCode === 500 && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="error-svg"/>
              </svg>
            )}
          </div>
          
          <h1 className="error-status">{statusCode}</h1>
          <h2 className="error-title">{title}</h2>
          <p className="error-message">{message}</p>
          
          <div className="error-countdown">
            Redirecting to home in {countdown} seconds
          </div>
          
          <div className="error-actions">
            <button 
              onClick={() => handleActionRedirect('/login')} 
              className="action-button store-button">
              <span className="button-icon"></span>
              Login
            </button>
            <button 
              onClick={() => handleActionRedirect('/')} 
              className="action-button home-button">
              <span className="button-icon"></span>
              Home Page
            </button>
            {statusCode === 401 && (
              <button 
                onClick={() => handleActionRedirect('/login')} 
                className="action-button login-button">
                <span className="button-icon">🔑</span>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="pixel-grid"></div>
    </div>
  );
};

export default ErrorPage;