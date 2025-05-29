import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/offers';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stageType: 'PFE',
    location: '',
    startDate: '',
    duration: '',
    skillsRequired: '',
    responsibilities: '',
    benefits: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOffers(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des offres');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOffers();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (offer) => {
    setCurrentOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      stageType: offer.stageType,
      location: offer.location,
      startDate: offer.startDate.split('T')[0],
      duration: offer.duration,
      skillsRequired: offer.skillsRequired,
      responsibilities: offer.responsibilities,
      benefits: offer.benefits || '',
      isActive: offer.isActive
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        startDate: formData.startDate || null
      };

      const response = await axios({
        method: currentOffer ? 'PUT' : 'POST',
        url: `${API_BASE_URL}/${currentOffer ? `update/${currentOffer.id}` : 'create'}`,
        data: data,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCurrentOffer(null);
      setIsEditing(false);
      fetchOffers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchOffers();
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      stageType: 'PFE',
      location: '',
      startDate: '',
      duration: '',
      skillsRequired: '',
      responsibilities: '',
      benefits: '',
      isActive: true
    });
    setCurrentOffer(null);
    setIsEditing(false);
  };

  const OfferDetailsModal = ({ offer, onClose }) => {
    if (!offer) return null;

    return (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{offer.title}</h2>
              <button onClick={onClose} style={styles.modalCloseButton}>×</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Type de stage:</span>
                <span style={styles.detailValue}>{offer.stageType}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Localisation:</span>
                <span style={styles.detailValue}>{offer.location}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Date de début:</span>
                <span style={styles.detailValue}>{new Date(offer.startDate).toLocaleDateString()}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Durée:</span>
                <span style={styles.detailValue}>{offer.duration}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Statut:</span>
                <span style={offer.isActive ? styles.statusActive : styles.statusInactive}>
                {offer.isActive ? 'Active' : 'Inactive'}
              </span>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.sectionText}>{offer.description}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Compétences requises</h3>
                <p style={styles.sectionText}>{offer.skillsRequired}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Responsabilités</h3>
                <p style={styles.sectionText}>{offer.responsibilities}</p>
              </div>

              {offer.benefits && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Avantages</h3>
                    <p style={styles.sectionText}>{offer.benefits}</p>
                  </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button onClick={onClose} style={styles.primaryButton}>
                Fermer
              </button>
            </div>
          </div>
        </div>
    );
  };

  const renderOfferCard = (offer) => (
      <div key={offer.id} style={styles.offerCard}>
        <div style={styles.cardHeader}>
          <div style={styles.headerContent}>
            <h3 style={styles.offerTitle}>{offer.title}</h3>
            <div style={styles.offerMeta}>
              <span style={styles.offerType}>{offer.stageType}</span>
              <span style={offer.isActive ? styles.statusActive : styles.statusInactive}>
              {offer.isActive ? 'Active' : 'Inactive'}
            </span>
            </div>
          </div>
        </div>

        <p style={{...styles.offerDescription, ...styles.truncated}}>
          {offer.description}
        </p>

        <div style={styles.seeMoreContainer}>
          <button
              onClick={() => handleViewDetails(offer)}
              style={styles.seeMoreBtn}
          >
            Voir plus
          </button>
        </div>

        <div style={styles.cardDetails}>
          <div style={styles.detailsRow}>
            <div style={styles.locationDateContainer}>
            <span style={styles.detailText}>
              <i className="fas fa-map-marker-alt" style={styles.detailIcon}></i>
              {offer.location}
            </span>
              <span style={styles.detailText}>
              <i className="fas fa-calendar-alt" style={styles.detailIcon}></i>
                {new Date(offer.startDate).toLocaleDateString()}
            </span>
            </div>
            <span style={styles.durationBadge}>
            {offer.duration}
          </span>
          </div>

          <div style={styles.detailsFooter}>
            <Link to={`/applications/${offer.id}`} style={styles.applicationLink}>
              <i className="fas fa-users" style={styles.detailIcon}></i>
              Candidatures ({offer.applicationCount || 0})
            </Link>
            <div style={styles.detailsActions}>
              <button
                  onClick={() => handleEdit(offer)}
                  style={styles.editButton}
              >
                <i className="fas fa-edit" style={styles.detailIcon}></i>
                Modifier
              </button>
              <button
                  onClick={() => handleDelete(offer.id)}
                  style={styles.deleteButton}
              >
                <i className="fas fa-trash-alt" style={styles.detailIcon}></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  if (loading) {
    return (
        <div style={styles.loadingContainer}>
          <div>Chargement en cours...</div>
        </div>
    );
  }

  return (
      <div className="layout">
        <Sidebar />
        <main className="page-content">
          <div style={styles.container}>
            {error && (
                <div style={styles.errorAlert}>
                  {error}
                  <button onClick={() => setError('')} style={styles.closeButton}>×</button>
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formHeader}>
                    <h2 style={styles.formTitle}>
                      {currentOffer ? 'Modifier une offre' : 'Créer une nouvelle offre'}
                    </h2>
                    <p style={styles.formSubtitle}>
                      {currentOffer ? 'Mettez à jour les détails de votre offre' : 'Remplissez les détails de votre nouvelle offre'}
                    </p>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>
                      <i className="fas fa-info-circle" style={styles.icon}></i>
                      Informations de base
                    </h3>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Titre <span style={styles.requiredField}>*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Type de stage <span style={styles.requiredField}>*</span>
                        </label>
                        <select
                            name="stageType"
                            value={formData.stageType}
                            onChange={handleInputChange}
                            required
                            style={styles.select}
                        >
                          <option value="PFE">PFE</option>
                          <option value="Stage d'été">Stage d'été</option>
                          <option value="Stage professionnel">Stage professionnel</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Localisation <span style={styles.requiredField}>*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Date de début <span style={styles.requiredField}>*</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Durée <span style={styles.requiredField}>*</span>
                        </label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                            placeholder="Ex: 6 mois"
                        />
                      </div>

                      <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            style={styles.checkbox}
                            id="isActive"
                        />
                        <label htmlFor="isActive" style={styles.checkboxLabel}>
                          Offre active
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>
                      <i className="fas fa-align-left" style={styles.icon}></i>
                      Description <span style={styles.requiredField}>*</span>
                    </h3>
                    <div style={styles.formGroup}>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      style={styles.textarea}
                      rows={5}
                      placeholder="Décrivez en détail l'offre de stage..."
                  />
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>
                      <i className="fas fa-tasks" style={styles.icon}></i>
                      Compétences requises <span style={styles.requiredField}>*</span>
                    </h3>
                    <div style={styles.formGroup}>
                  <textarea
                      name="skillsRequired"
                      value={formData.skillsRequired}
                      onChange={handleInputChange}
                      required
                      style={styles.textarea}
                      rows={5}
                      placeholder="Listez les compétences et qualifications nécessaires..."
                  />
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>
                      <i className="fas fa-briefcase" style={styles.icon}></i>
                      Responsabilités <span style={styles.requiredField}>*</span>
                    </h3>
                    <div style={styles.formGroup}>
                  <textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      required
                      style={styles.textarea}
                      rows={5}
                      placeholder="Décrivez les missions et responsabilités du stagiaire..."
                  />
                    </div>
                  </div>

                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>
                      <i className="fas fa-gift" style={styles.icon}></i>
                      Avantages
                    </h3>
                    <div style={styles.formGroup}>
                  <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      rows={5}
                      placeholder="Listez les avantages offerts (salaire, tickets restaurant, etc.)..."
                  />
                    </div>
                  </div>

                  <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.primaryButton}>
                      <i className="fas fa-save"></i>
                      {currentOffer ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        style={styles.secondaryButton}
                    >
                      <i className="fas fa-times"></i>
                      Annuler
                    </button>
                  </div>

                  <div style={styles.formFooter}>
                    <p>Les champs marqués d'un <span style={styles.requiredField}>*</span> sont obligatoires</p>
                  </div>
                </form>
            ) : (
                <div>
                  <div style={styles.headerActions}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={styles.primaryButton}
                    >
                      <i className="fas fa-plus"></i>
                      Créer une nouvelle offre
                    </button>
                  </div>

                  {offers.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p>Aucune offre disponible</p>
                      </div>
                  ) : (
                      <div style={styles.offersGrid}>
                        {offers.map(renderOfferCard)}
                      </div>
                  )}
                </div>
            )}

            {showDetailsModal && (
                <OfferDetailsModal
                    offer={selectedOffer}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
          </div>
        </main>
      </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  errorAlert: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#c62828',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0'
  },

  // Offer Card Styles
  // Offer Card Styles
  offerCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  },
  cardHeader: {
    marginBottom: '15px'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  offerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
    color: '#007b8f'
  },
  offerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    margin: '8px 0' // Espacement en haut et en bas
  },
  offerType: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  offerDescription: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    margin: '0 0 15px 0'
  },
  truncated: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  seeMoreContainer: {
    textAlign: 'right',
    marginBottom: '15px'
  },
  seeMoreBtn: {
    background: 'none',
    border: 'none',
    color: '#007b8f',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    textDecoration: 'underline',
    ':hover': {
      color: '#006a7a'
    }
  },
  cardDetails: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px',
    marginTop: '15px'
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  locationDateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  detailText: {
    fontSize: '14px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailIcon: {
    color: '#007b8f',
    fontSize: '14px'
  },
  durationBadge: {
    backgroundColor: '#e0f2f1',
    color: '#007b8f',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500'
  },
  detailsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  },
  applicationLink: {
    color: '#007b8f',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  detailsActions: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    backgroundColor: 'rgba(0, 123, 143, 0.1)',
    color: '#007b8f',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(0, 123, 143, 0.2)'
    }
  },
  deleteButton: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    color: '#d32f2f',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.2)'
    }
  },
  statusActive: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    margin: 0,
    marginLeft: 'auto' // 👈 Pour aligner à droite
  },
  statusInactive: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    margin: 0,
    marginLeft: 'auto' // 👈 Pour aligner à droite
  },


  // Form Styles
  form: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    margin: '20px auto',
    maxWidth: '900px'
  },
  formHeader: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#007b8f',
    marginBottom: '8px'
  },
  formSubtitle: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '0'
  },
  formSection: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e0f2f1'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#007b8f',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #c0e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9f9f9',
    ':focus': {
      borderColor: '#007b8f',
      outline: 'none',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(0, 123, 143, 0.2)'
    }
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #c0e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9f9f9',
    ':focus': {
      borderColor: '#007b8f',
      outline: 'none',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(0, 123, 143, 0.2)'
    }
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #c0e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9f9f9',
    ':focus': {
      borderColor: '#007b8f',
      outline: 'none',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(0, 123, 143, 0.2)'
    }
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    gap: '8px'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#007b8f',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer'
  },
  requiredField: {
    color: '#d32f2f',
    marginLeft: '4px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px'
  },
  primaryButton: {
    backgroundColor: '#007b8f',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#006a7a',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#007b8f',
    border: '1px solid #007b8f',
    padding: '12px 25px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#e0f2f1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  },
  formFooter: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px'
  },

  // List view styles
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px'
  },
  emptyState: {
    backgroundColor: '#f5f5f5',
    padding: '40px',
    textAlign: 'center',
    borderRadius: '8px',
    color: '#666',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  offersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(48%, 1fr))',
    gap: '20px'
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#007b8f'
  },
  modalCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0 0 0 20px'
  },
  modalBody: {
    padding: '20px'
  },
  detailRow: {
    display: 'flex',
    marginBottom: '15px'
  },
  detailLabel: {
    fontWeight: '600',
    width: '150px',
    color: '#555',
    flexShrink: 0
  },
  detailValue: {
    flex: 1,
    color: '#333'
  },
  section: {
    marginTop: '25px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#007b8f'
  },
  sectionText: {
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-line'
  },
  modalFooter: {
    padding: '15px 20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white'
  }
};

export default OffersManagement;