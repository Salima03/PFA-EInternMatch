/*
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
      label: 'Accueil',
      icon: <FaHome />
    },
    
    {
      path: role === 'MANAGER' ? '/company-profile' : '/profile/view',
      label: 'Profile',
      icon: <FaUser />
    },

    
          ...(role === 'STUDENT' ? [{ path: '/my-applications', label: 'Candidature', icon: <FaFileAlt /> }] : []),
      { path: '/ChatPage', label: 'Messagerie', icon: <FaComments /> },
    // 👉 ajout conditionnel de MyOffers
    ...(role === 'MANAGER' ? [{ path: '/offers', label: 'MyOffers', icon: <FaBriefcase /> }] : []),
    { path: '/about', label: 'A propos', icon: <FaInfoCircle /> },
    { path: '/settings', label: 'Parametres', icon: <FaCog /> }
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
*/
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaComments,
  FaInfoCircle,
  FaCog,
  FaBriefcase
} from 'react-icons/fa';
import './Layout.css';
import Footer from './Footer';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const hasProfile = localStorage.getItem('hasProfile'); // Vous devez stocker cette info lors de la création du profil

  const handleProfileClick = () => {
    if (role === 'MANAGER') {
      navigate('/company-profile');
    } else {
      // Pour les étudiants, vérifier si le profil existe
      if (hasProfile === 'true') {
        navigate('/profile/view');
      } else {
        navigate('/profile/create');
      }
    }
  };

  const navItems = [
    {
      path: role === 'MANAGER' ? '/homecompany' : '/home',
      label: 'Accueil',
      icon: <FaHome />
    },
    
    {
      label: 'Profile',
      icon: <FaUser />,
      onClick: handleProfileClick
    },

    ...(role === 'STUDENT' ? [{ path: '/my-applications', label: 'Candidature', icon: <FaFileAlt /> }] : []),
    { path: '/ChatPage', label: 'Messagerie', icon: <FaComments /> },
    ...(role === 'MANAGER' ? [{ path: '/offers', label: 'Mes Offres', icon: <FaBriefcase /> }] : []),
    { path: '/about', label: 'A propos', icon: <FaInfoCircle /> },
    { path: '/settings', label: 'Parametres', icon: <FaCog /> }
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
            onClick={item.onClick || (() => navigate(item.path))}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}

        <hr className="separator" />

        {navItems.slice(5).map((item, idx) => (
          <div
            key={idx + 100}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={item.onClick || (() => navigate(item.path))}
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