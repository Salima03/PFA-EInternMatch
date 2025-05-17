
/*import React, { useState } from 'react';
import './OfferCard.css';
import axios from 'axios';
import Modal from 'react-modal';
import api from '../api1';

const OfferCard = ({ offer, onAddFavorite }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!offer || !offer.company) {
    return <div>Loading...</div>;
  }

  const handleSeeMoreClick = () => {
    setShowDetails(!showDetails);
  };

  const handleAddToFavorites = () => {
    api.post(`/student/favorites/${offer.id}`)
    .then(response => {
      setIsFavorite(true);
      alert("Offre ajoutée aux favoris");
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout aux favoris:", error);
    });

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
    const token = localStorage.getItem('accessToken');
    const studentId = localStorage.getItem('studentProfileId');
    try {
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
      console.error('Erreur lors de la postulation :', err);
      alert("Erreur lors de la postulation.");
    }
  };

  //const imageUrl = `/images/${offer.company.picture}`;
  const imageUrl = `http://localhost:1217/images/${offer.company.picture}`;

  return (
    <div className="offer-card">

 
      <div className="offer-image">
        <img src={imageUrl} alt={offer.company.name} className="company-logo" />
      </div>
      <div className="offer-info">
        <p><strong>Title:</strong> {offer.title}</p>
        <p><strong>Type:</strong> {offer.stageType}</p>
        <p><strong>Duration:</strong> {offer.duration}</p>
        <p><strong>Sector:</strong> {offer.company.sector}</p>
   


        {showDetails && (
          <div className="offer-details">
            <p><strong>Description:</strong> {offer.description}</p>
            <p><strong>Location:</strong> {offer.location}</p>
          </div>
        )}
      </div>

      <button className="see-more" onClick={handleSeeMoreClick}>
        {showDetails ? "Show less" : "See more"}
</button>

  {showDetails && !isFavorite && (
        <button className="favorite-btn" onClick={handleAddToFavorites}>
          Add to favorites
        </button>
      )}
     
      {showDetails && isFavorite && (
        <span className="favorite-tag">Favorited</span>
      )}

      {showDetails && (
        <button className="apply-btn" onClick={handleApplyClick}>
          Postuler
        </button>
      )}

      
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="CV Preview">
        <h2>Votre CV personnalisé</h2>
        {loading ? (
          <p>Chargement du CV...</p>
        ) : (
          <>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '10px', color: '#007bff' }}>
              Ouvrir dans un nouvel onglet
            </a>
            <iframe src={cvUrl} title="CV PDF" width="100%" height="500px" />
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

/*  return (
    <div className="offer-card">
      <div className="card-header">
        <img src={imageUrl} alt="Company logo" className="company-logo" />
        <div className="header-text">
          <p><strong>Title:</strong> {offer.title}</p>
          <p><strong>Sector:</strong> {offer.company.sector}</p>
        </div>
        <FavoriteIcon isFavorite={isFavorite} onClick={handleAddToFavorites} />
      </div>

      <div className="card-body">
        <p className={`description ${showDetails ? "expanded" : "truncated"}`}>
          {offer.description}
        </p>
        <button className="see-more-btn" onClick={handleSeeMoreClick}>
          {showDetails ? "Show less" : "See more"}
        </button>

        {showDetails && (
          <div className="extra-info">
            <div className="info-field"><strong>Duration:</strong> {offer.duration}</div>
            <div className="info-field"><strong>InternType:</strong> {offer.stageType}</div>
            <div className="info-field"><strong>Location:</strong> {offer.location}</div>

            <button className="apply-btn" onClick={handleApplyClick}>Apply now</button>
          </div>
        )}
      </div>

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