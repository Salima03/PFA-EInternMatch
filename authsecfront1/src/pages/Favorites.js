/*
import React, { useState, useEffect } from 'react';
import OfferCard from '../components/Offre/OfferCard';
import api from '../components/api1'; 
import { FaHeart } from 'react-icons/fa';


const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get('/student/favorites')
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des favoris:", error);
      });
  }, []);


   const removeFavorite = (offerId) => {
    api.delete(`/student/favorites/remove/${offerId}`)
      .then(() => {
        setFavorites(prev => prev.filter(offer => offer.id !== offerId));
      })
      .catch(error => {
        console.error("Erreur lors de la suppression du favori:", error);
      });
  };


  return (
    <div className="favorites-container">
      <h2>Your Favorites</h2>
      {favorites.length === 0 && <p>You have no favorite offers yet.</p>}

      {favorites.map((offer, index) => (
        <div key={index} style={{ position: "relative", marginBottom: "20px" }}>
          <OfferCard
            offer={offer}
            title={offer.title}
            sector={offer.sector}
            type={offer.stage_type}
            duration={offer.duration}
            details={offer}
          />
          
          <FaHeart
  onClick={() => removeFavorite(offer.id)}
  style={{
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'red',
    cursor: 'pointer',
    fontSize: '1.5rem'
  }}
  title="Retirer des favoris"
/>

    
        </div>
      ))}
    </div>
  );
};

export default Favorites;

*/
import React, { useState, useEffect } from 'react';
import api from '../components/api1'; 
import FavoriteIcon from '../components/Offre/FavoriteIcon';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get('/student/favorites')
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des favoris:", error);
      });
  }, []);

  const removeFavorite = (offerId) => {
    api.delete(`/student/favorites/remove/${offerId}`)
      .then(() => {
        setFavorites(prev => prev.filter(offer => offer.id !== offerId));
      })
      .catch(error => {
        console.error("Erreur lors de la suppression des favoris:", error);
      });
  };
/*
  return (
    <div className="favorites-page">
      {favorites.map((offer) => (
        <div key={offer.id} className="offer-card">
          <div className="card-header">
            <img src={`http://localhost:1217/images/${offer.company.picture}`} alt="Company" className="company-logo" />
            <div className="header-text">
              <p><strong>Title:</strong> {offer.title}</p>
              <p><strong>Sector:</strong> {offer.company.sector}</p>
            </div>
            <FavoriteIcon isFavorite={true} onClick={() => removeFavorite(offer.id)} />
          </div>

          <div className="card-body">
            <p className="description">{offer.description}</p>
            <div className="info-field"><strong>Duration:</strong> {offer.duration}</div>
            <div className="info-field"><strong>InternType:</strong> {offer.stageType}</div>
            <div className="info-field"><strong>Location:</strong> {offer.location}</div>
          </div>
        </div>
      ))}
    </div>
  );
  */

  return (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    padding: '20px',
    backgroundColor: '#e0f2f1',
    background: 'linear-gradient(180deg, #e0f2f1, #ffffff)'
  }}>
    {favorites.map((offer) => (
      <div key={offer.id} style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
        }
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <img 
            src={`http://localhost:1217/images/${offer.company.picture}`} 
            alt="Company" 
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '10px',
              objectFit: 'cover',
              marginRight: '15px'
            }} 
          />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>{offer.title}</h3>
              <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#718096' }}>{offer.company.sector}</p>
            </div>
            <div 
              style={{ marginLeft: '15px', cursor: 'pointer' }}
              onClick={() => removeFavorite(offer.id)}
            >
              {/* Remplacez par votre icône de favori */}
              <span style={{ color: '#ff4757', fontSize: '24px' }}>♥</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          <p style={{
            color: '#4a5568',
            lineHeight: '1.5',
            marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {offer.description}
          </p>
          
          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Duration:</span>
              <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{offer.duration}</span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Intern Type:</span>
              <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{offer.stageType}</span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Location:</span>
              <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{offer.location}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
};

export default Favorites;
