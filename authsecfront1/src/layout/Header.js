// Header.js

import React, { useState, useEffect } from 'react';
import './Layout.css';
import api from '../components/api1';
import { FiSearch, FiBell } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import SearchProfiles from '../components/SearchProfiles';
import NotificationDropdown from '../components/NotificationDropdown';


import { useNavigate } from 'react-router-dom'; // <-- Import de useNavigate
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const Header = ({ onSearchChange, favoritesCount }) => {
  const navigate = useNavigate(); // <-- Hook pour navigation
  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem('accessToken');
  const [fullName, setFullName] = useState("Utilisateur");
    const [offers, setOffers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
    const [loadingProfile, setLoadingProfile] = useState(true);
     

  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleFavoritesClick = () => {
    navigate('/favorites'); // <-- Redirection vers la page des favoris
  };

   // Récupération du profil et photo de profil
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const profileResponse = await api.get("/profiles/my-profile");
    const userProfile = profileResponse.data;
    setProfile(userProfile);

    if (userProfile.user) {
        setFullName(`${userProfile.user.firstname} ${userProfile.user.lastname}`);
      }

    try {
      const pictureResponse = await api.get("/profiles/profile-picture", {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(pictureResponse.data);
      setProfilePictureUrl(imageUrl);
    } catch (error) {
      console.warn("Aucune photo trouvée, utilisation image par défaut.");
      setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
    }

  } catch (error) {
    console.error("Erreur de chargement du profil:", error);
    setProfile(null);
  } finally {
    setLoadingProfile(false);
  }
};


    fetchProfile();
  }, [navigate]);

  const handleImageClick = () => {
    if (profile) {
      navigate("/profile/view");
    } else {
      navigate("/profile/create");
    }
  };

  return (
    <header className="custom-header">
     <SearchProfiles />

         <div className="custom-header-right">
  
        {/*<FiBell className="header-icon notif-icon" title="Notifications" />*/}
  
        <div className="favorite-section" onClick={handleFavoritesClick}>
          <FaHeart className="header-icon heart-icon" />
          <span className="fav-count">{favoritesCount}</span>
        </div>
         {userId && <NotificationDropdown userId={userId} />}
  
        <div className="profile-info" onClick={handleImageClick}>
          <img src={profilePictureUrl} alt="avatar" className="profile-pic" />
          <span className="profile-name">{fullName}</span>
        </div>
      </div>
      </header>
  );
};

export default Header;

