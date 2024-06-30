import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'; // Import social media icons
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {/* Add more links as needed */}
        </div>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Bharat Tech. All rights reserved.</p>
        {/* Add additional information like contact details here */}
      </div>
    </footer>
  );
};

export default Footer;
