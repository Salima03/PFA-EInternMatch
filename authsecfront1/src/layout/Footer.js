import React from 'react';
import './Layout.css';

const Footer = () => (
  <div className="sidebar-footer">
    <hr className="separator" />
    <p className="footer-text">© E-InternMatch {new Date().getFullYear()}</p>
    <p className="footer-text">Version 1.0</p>
  </div>
);

export default Footer;



