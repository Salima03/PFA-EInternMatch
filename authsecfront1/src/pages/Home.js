

import React, { useEffect, useState } from 'react';
import OfferCard from '../components/Offre/OfferCard';
import './styles/Home.css';
import axios from 'axios';
import api from '../components/api1'; //

import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../components/NotificationDropdown';
import { Sidebar } from 'lucide-react';


const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Home = ({ onAddFavorite }) => {
  const [offers, setOffers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
  const [loadingProfile, setLoadingProfile] = useState(true);

   // 👉 filtres
  const [searchLocation, setSearchLocation] = useState('');
  const [searchStageType, setSearchStageType] = useState('');

  const navigate = useNavigate();

  // Vérifie l'authentification
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      setIsReady(true);
    }
  }, [navigate]);

  // Récupère les offres
  /*
  const fetchOffers = (location = '', stageType = '') => {
    const token = localStorage.getItem('accessToken');
  let endpoint = '/student/offers';

  const params = new URLSearchParams();
  if (location || stageType) {
    const keyword = location || stageType;
    params.append('keyword', keyword);
  }

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  api.get(endpoint)
    .then(response => setOffers(response.data))
    .catch(error => console.error('Erreur lors de la récupération des offres:', error));
};*/
    const fetchOffers = (location = '', stageType = '') => {
  const token = localStorage.getItem('accessToken');
  let endpoint = '/student/offers';

  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (stageType) params.append('stageType', stageType);
  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  api.get(endpoint)
    .then(response => setOffers(response.data))
    .catch(error => console.error('Erreur lors de la récupération des offres:', error));
};



  // Chargement initial des offres
  useEffect(() => {
    if (isReady) {
      fetchOffers();
    }
  }, [isReady]);

  // Rafraîchit les offres en fonction des filtres
  /*useEffect(() => {
    if (isReady) {
      fetchOffers(searchLocation, searchStageType);
     
    }
  }, [searchLocation, searchStageType, isReady]);*/
  useEffect(() => {
  if (isReady) {
    console.log("🔍 Recherche avec location:", searchLocation); // ← ajoute ceci
    console.log("🔍 Recherche avec stageType:", searchStageType);
    fetchOffers(searchLocation, searchStageType);
  }
}, [searchLocation, searchStageType, isReady]);


  // Récupération du profil et photo de profil
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const profileResponse = await api.get("/profiles/my-profile");
    const userProfile = profileResponse.data;
    setProfile(userProfile);

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
   
    <div className="home-container">
     
   
      <div className="filters-container">
        <input
          type="text"
          placeholder="Lieu"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="filter-input"
        />

        <select
          value={searchStageType}
          onChange={(e) => setSearchStageType(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous</option>
          <option value="PFE">PFE</option>
          <option value="Stage d'été">Stage d'été</option>
          <option value="Stage d'été">Stage professionnel</option>
          
        </select>
     </div>


      <p className="offers-header">{` ${offers.length} Offers`}</p>
     

      {offers.map((offer, index) => (
        <OfferCard
          key={index}
          offer={offer}
          onAddFavorite={onAddFavorite}
        />
      ))}

    
    </div>
    
  );
};

export default Home;
