/*import React from 'react';
import './Layout.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chatPage'); // Assurez-vous que cette route est bien définie
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">E<span>InternMatch</span></h2>
      <nav className="nav">
        <p>🏠 HOME</p>
        <p>👤 Profil</p>
        <p>📄 Candidature</p>
        <p>🔔 Notifications</p>
        <p>ℹ️ About</p>
        <p onClick={handleChatClick} style={{ cursor: 'pointer' }}>💬 Messagerie</p>
      </nav>
    </aside>
  );
};

export default Sidebar;
*/
//assia
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaComments,
  FaInfoCircle,
  FaCog,
  FaBriefcase // pour MyOffers
} from 'react-icons/fa';
import './Layout.css';
import Footer from './Footer';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');

  const navItems = [
    {
      path: role === 'MANAGER' ? '/homecompany' : '/home',
      label: 'Home',
      icon: <FaHome />
    },
    {
      path: role === 'MANAGER' ? '/company-profile' : '/profile/view',
      label: 'Profil',
      icon: <FaUser />
    },
    /*{ path: role === 'MANAGER' ? '/applications/:offerId' : '/my-applications',
      label: 'Candidature', icon: <FaFileAlt /> },*/
      /*{ path: '/my-applications',label: 'Candidature', icon: <FaFileAlt /> },*/
          ...(role === 'STUDENT' ? [{ path: '/my-applications', label: 'Candidature', icon: <FaFileAlt /> }] : []),
      { path: '/ChatPage', label: 'Messenger', icon: <FaComments /> },
    // 👉 ajout conditionnel de MyOffers
    ...(role === 'MANAGER' ? [{ path: '/offers', label: 'MyOffers', icon: <FaBriefcase /> }] : []),
    { path: '/about', label: 'About', icon: <FaInfoCircle /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> }
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">
        E-<span>InternMatch</span>
      </h2>
      <nav className="nav">
        {navItems.slice(0, 5).map((item, idx) => (
          <div
            key={idx}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}

        <hr className="separator" />

        {navItems.slice(5).map((item, idx) => (
          <div
            key={idx + 100}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>

      <Footer />
    </aside>
  );
};

export default Sidebar;
