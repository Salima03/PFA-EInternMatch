/*
import React, { useState } from 'react';
import './OfferCard.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Modal from 'react-modal';
import api from '../api1';
import FavoriteIcon from './FavoriteIcon';
import { FaPaperPlane } from 'react-icons/fa';

const OfferCard = ({ offer }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!offer || !offer.company) return null;

  const imageUrl = `http://localhost:1217/images/${offer.company.picture}`;

  const handleSeeMoreClick = () => setShowDetails(!showDetails);

  const handleAddToFavorites = () => {
    api.post(`/student/favorites/${offer.id}`)
      .then(() => setIsFavorite(true))
      .catch(err => console.error("Erreur favoris :", err));
  };
  const handleApplyClick = async () => {
    setLoading(true);
    const studentId = localStorage.getItem("studentProfileId");
    try {
      const res = await api.get(`/pdf/generate-and-store/${studentId}/${offer.id}`);
      console.log("Lien PDF retourné :", res.data);
      const directPdfUrl = res.data; // le lien complet est déjà retourné
      setCvUrl(directPdfUrl);
      setModalIsOpen(true);
    } catch (err) {
      console.error('Erreur de génération du CV :', err);
      alert("Erreur lors de la génération du CV.");
    } finally {
      setLoading(false);
    }
  };
  const confirmApply = async () => {
    try {
      const studentId = localStorage.getItem("studentProfileId");
      const token = localStorage.getItem('accessToken');
      const filename = `${offer.title}_${studentId}.pdf`;
      await api.post('/applications/apply', {
        studentId,
        offerId: offer.id,
        cvFilename: filename
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Candidature envoyée !");
      setModalIsOpen(false);
    } catch (err) {
      alert("Erreur postulation.");
    }
  };

  return (
    <div className="offer-card">
      <div className="card-header">
        <img src={imageUrl} alt="Company logo" className="company-logo" />
        <div className="header-content">
          <div className="header-text">
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-sector">{offer.company.sector}</p>
            <p className={`offer-description ${!showDetails ? "truncated" : ""}`}>
              {offer.description}
            </p>
          </div>
        </div>
         <FavoriteIcon isFavorite={isFavorite} onClick={handleAddToFavorites} />
      </div>

      
      {!showDetails && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMoreClick}>
            See more
          </button>
        </div>
      )}

      {showDetails && (
        <div className="card-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{offer.duration}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Intern Type:</span>
              <span className="detail-value">{offer.stageType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{offer.location}</span>
            </div>
          </div>
          
          <div className="details-actions">
            <button className="apply-btn" onClick={handleApplyClick}>
              Apply now <FaPaperPlane className="apply-icon" />
            </button>
            <button className="see-less-btn" onClick={handleSeeMoreClick}>
              Show less
            </button>
          </div>
        </div>
      )}
      
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Votre CV personnalisé</h2>
        {loading ? <p>Chargement...</p> : (
          <>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer">Ouvrir dans un nouvel onglet</a>
            <iframe src={cvUrl} width="100%" height="500px" title="CV" />
            <button onClick={confirmApply}>Confirmer</button>
            <button onClick={() => setModalIsOpen(false)}>Annuler</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OfferCard;
*/
import React, { useState } from 'react';
import './OfferCard.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Modal from 'react-modal';
import api from '../api1';
import FavoriteIcon from './FavoriteIcon';
import { FaPaperPlane } from 'react-icons/fa';

const OfferCard = ({ offer }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!offer || !offer.company) return null;

  const imageUrl = `http://localhost:1217/images/${offer.company.picture}`;

  const handleSeeMoreClick = () => setShowDetails(!showDetails);

  const handleAddToFavorites = () => {
    api.post(`/student/favorites/${offer.id}`)
      .then(() => setIsFavorite(true))
      .catch(err => console.error("Erreur favoris :", err));
  };
  const handleApplyClick = async () => {
    setLoading(true);
    const studentId = localStorage.getItem("studentProfileId");
    try {
      const res = await api.get(`/pdf/generate-and-store/${studentId}/${offer.id}`);
      console.log("Lien PDF retourné :", res.data);
      const directPdfUrl = res.data; // le lien complet est déjà retourné
      setCvUrl(directPdfUrl);
      setModalIsOpen(true);
    } catch (err) {
      console.error('Erreur de génération du CV :', err);
      alert("Erreur lors de la génération du CV.");
    } finally {
      setLoading(false);
    }
  };
  const confirmApply = async () => {
    try {
      const studentId = localStorage.getItem("studentProfileId");
      const token = localStorage.getItem('accessToken');
      const filename = `${offer.title}_${studentId}.pdf`;
      await api.post('/applications/apply', {
        studentId,
        offerId: offer.id,
        cvFilename: filename
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Candidature envoyée !");
      setModalIsOpen(false);
    } catch (err) {
      alert("Erreur postulation.");
    }
  };

  return (
    <div className="offer-card">
      <div className="card-header">
        <img src={imageUrl} alt="Company logo" className="company-logo" />
        <div className="header-content">
          <div className="header-text">
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-sector">{offer.company.sector}</p>
            <p className={`offer-description ${!showDetails ? "truncated" : ""}`}>
              {offer.description}
            </p>
          </div>
        </div>
         <FavoriteIcon isFavorite={isFavorite} onClick={handleAddToFavorites} />
      </div>

      {/* Bouton See More - toujours visible mais positionné différemment */}
      {!showDetails && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMoreClick}>
            See more
          </button>
        </div>
      )}

      {showDetails && (
        <div className="card-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{offer.duration}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Intern Type:</span>
              <span className="detail-value">{offer.stageType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{offer.location}</span>
            </div>
          </div>
          
                        {/* Ajout des benefits et skillsRequired */}
                    {offer.benefits && typeof offer.benefits === 'string' && (
                <div className="additional-details">
                  <h4>Benefits:</h4>
                  <p className="benefits-text">{offer.benefits}</p>
                </div>
              )}

              {offer.benefits && Array.isArray(offer.benefits) && offer.benefits.length > 0 && (
                <div className="additional-details">
                  <h4>Benefits:</h4>
                  <ul className="benefits-list">
                    {offer.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {offer.skillsRequired && typeof offer.skillsRequired === 'string' && (
                <div className="additional-details">
                  <h4>Skills Required:</h4>
                  <p className="skills-text">{offer.skillsRequired}</p>
                </div>
              )}

              {offer.skillsRequired && Array.isArray(offer.skillsRequired) && offer.skillsRequired.length > 0 && (
                <div className="additional-details">
                  <h4>Skills Required:</h4>
                  <ul className="skills-list">
                    {offer.skillsRequired.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
               {/* Nouvelle Section Responsibilities */}
          {offer.responsibilities && (
            <div className="additional-details">
              <h4>Responsibilities:</h4>
              <p className="details-text">{offer.responsibilities}</p>
            </div>
          )}

     
          
          <div className="details-actions">
            <button className="apply-btn" onClick={handleApplyClick}>
              Apply now <FaPaperPlane className="apply-icon" />
            </button>
            <button className="see-less-btn" onClick={handleSeeMoreClick}>
              Show less
            </button>
          </div>
        </div>
      )}
      
      {/*<Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Votre CV personnalisé</h2>
        {loading ? <p>Chargement...</p> : (
          <>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer">Ouvrir dans un nouvel onglet</a>
            <iframe src={cvUrl} width="100%" height="500px" title="CV" />
            <button onClick={confirmApply}>Confirmer</button>
            <button onClick={() => setModalIsOpen(false)}>Annuler</button>
          </>
        )}
      </Modal>*/}
      <Modal 
  isOpen={modalIsOpen} 
  onRequestClose={() => setModalIsOpen(false)}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000
    },
    content: {
      zIndex: 1001,
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)'
    }
  }}
  ariaHideApp={false}
>
  <h2>Votre CV personnalisé</h2>
  {loading ? <p>Chargement...</p> : (
    <>
      <a href={cvUrl} target="_blank" rel="noopener noreferrer">Ouvrir dans un nouvel onglet</a>
      <iframe src={cvUrl} width="100%" height="500px" title="CV" />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={confirmApply}
          style={{
            padding: '0.5rem 1rem',
            background: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Confirmer
        </button>
        <button 
          onClick={() => setModalIsOpen(false)}
          style={{
            padding: '0.5rem 1rem',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Annuler
        </button>
      </div>
    </>
  )}
</Modal>
    </div>
  );
};

export default OfferCard;