/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../layout/Sidebar';
import { FiEdit, FiTrash2, FiLogOut, FiUser, FiLock, FiMail, FiPhone } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:1217/api/v1';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    id: '',
    email: '',
    phone: '',
    role: '',
    deactivatedByUser: false,
    isLoading: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/profiles/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setProfile({
          id: response.data.id || userId,
          email: response.data.email || 'Non disponible',
          phone: response.data.phone || 'Non renseigné',
          role: role || response.data.role || 'student',
          deactivatedByUser: response.data.deactivatedByUser || false,
          isLoading: false
        });
      } catch (err) {
        console.error('Erreur API:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
        setProfile(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditProfile = () => {
    if (!profile.id) {
      setError('ID du profil non disponible');
      return;
    }
    navigate(`/profile/edit/${profile.id}`);
  };

  const handleDeleteProfile = async () => {
    if (!profile.id) {
      setError('ID du profil introuvable');
      return;
    }

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_BASE_URL}/profiles/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.clear();
      alert('Votre compte a été supprimé avec succès');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleDeactivateProfile = async () => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment désactiver votre compte ? Vous ne pourrez plus vous connecter.'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`${API_BASE_URL}/profiles/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Votre compte a été désactivé.');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la désactivation :', err);
      setError(err.response?.data?.message || 'Erreur lors de la désactivation du compte');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (profile.isLoading) {
    return <div style={styles.container}>Chargement...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="page-content">
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>Paramètres du compte</h2>

            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>Erreur : {error}</p>
              </div>
            )}

            {profile.deactivatedByUser && (
              <div style={styles.warningBox}>
                <p style={styles.warningText}>
                  Ce compte est désactivé. Certaines fonctionnalités peuvent être limitées.
                </p>
              </div>
            )}

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <FiUser style={styles.icon} />
                <h3 style={styles.sectionTitle}>Informations personnelles</h3>
              </div>
              <div style={styles.infoItem}>
                <FiMail style={styles.infoIcon} />
                <span>{profile.email}</span>
              </div>
              <div style={styles.infoItem}>
                <FiPhone style={styles.infoIcon} />
                <span>{profile.phone}</span>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <FiLock style={styles.icon} />
                <h3 style={styles.sectionTitle}>Actions</h3>
              </div>

              <button onClick={handleEditProfile} style={styles.button}>
                <FiEdit style={styles.buttonIcon} />
                Modifier le profil
              </button>

              <button
                onClick={handleDeactivateProfile}
                style={{ ...styles.button, backgroundColor: '#fffaf0', color: '#dd6b20' }}
                disabled={profile.deactivatedByUser}
              >
                <FiLock style={styles.buttonIcon} />
                Désactiver le compte
              </button>

              <button
                onClick={handleLogout}
                style={{ ...styles.button, ...styles.logoutButton }}
              >
                <FiLogOut style={styles.buttonIcon} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'transparent',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '600px',
    padding: '40px',
    boxSizing: 'border-box'
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#e53e3e'
  },
  errorText: {
    margin: 0
  },
  warningBox: {
    backgroundColor: '#fefcbf',
    border: '1px solid #faf089',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#975a16'
  },
  warningText: {
    margin: 0
  },
  title: {
    color: '#2d3748',
    fontSize: '28px',
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: '600'
  },
  section: {
    marginBottom: '30px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #edf2f7',
    paddingBottom: '10px'
  },
  sectionTitle: {
    color: '#4a5568',
    fontSize: '18px',
    margin: '0 0 0 10px',
    fontWeight: '500'
  },
  icon: {
    color: '#667eea',
    fontSize: '20px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    color: '#4a5568',
    fontSize: '16px'
  },
  infoIcon: {
    marginRight: '10px',
    color: '#a0aec0'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '14px',
    marginBottom: '15px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#edf2f7',
    color: '#2d3748'
  },
  buttonIcon: {
    marginRight: '10px',
    fontSize: '18px'
  },
  logoutButton: {
    backgroundColor: '#ebf8ff',
    color: '#3182ce'
  }
};

export default SettingsPage;
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../layout/Sidebar';
import { FiEdit, FiTrash2, FiLogOut, FiUser, FiLock, FiMail, FiPhone } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:1217/api/v1';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    website: '',
    photoUrl: '',
    role: '',
    deactivatedByUser: false,
    isLoading: true
  });

 useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!token || !userId || !role) {
      navigate('/login');
      return;
    }

    try {
      let response;
      if (role === 'STUDENT') {
        response = await axios.get(`${API_BASE_URL}/profiles/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile({
          id: response.data.id || userId,
          email: localStorage.getItem('email') || response.data.email || 'Non disponible',
          phone: response.data.phone || 'Non renseigné',
          role: 'STUDENT',
          deactivatedByUser: response.data.deactivatedByUser || false,
          isLoading: false
        });
      } else if (role === 'MANAGER') {
        response = await axios.get(`${API_BASE_URL}/companies/profile/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile({
          id: response.data.id || userId,
          email: localStorage.getItem('email') || response.data.email || 'Non disponible',
          website: response.data.website || 'Non renseigné',
          role: 'MANAGER',
          deactivatedByUser: false, // à adapter si applicable
          isLoading: false
        });
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      setProfile(prev => ({ ...prev, isLoading: false }));
    }
  };

  fetchProfile();
}, [navigate]);


  const handleEditProfile = () => {
    const role = localStorage.getItem('role');

    if (role === 'MANAGER') {
      navigate('/companies/profile/update');
    } else if (role === 'STUDENT') {
      if (!profile.id) {
        setError('ID du profil non disponible');
        return;
      }
      navigate(`/profile/edit/${profile.id}`);
    } else {
      setError("Rôle inconnu. Redirection impossible.");
    }
  };

  const handleDeactivateProfile = async () => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment désactiver votre compte ? Vous ne pourrez plus vous connecter.'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`${API_BASE_URL}/profiles/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Votre compte a été désactivé.');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la désactivation :', err);
      setError(err.response?.data?.message || 'Erreur lors de la désactivation du compte');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (profile.isLoading) {
    return <div style={styles.loadingContainer}>Chargement...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="page-content">
        <div style={styles.container}>
          <div style={styles.card}>
            {profile.deactivatedByUser && (
              <div style={styles.warningBox}>
                <p style={styles.warningText}>
                  Ce compte est désactivé. Certaines fonctionnalités peuvent être limitées.
                </p>
              </div>
            )}

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Informations du compte</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <FiMail style={styles.infoIcon} />
                  <div>
                    <p style={styles.infoLabel}>Email</p>
                    <p style={styles.infoValue}>{profile.email}</p>
                  </div>
                </div>

                {profile.role === 'STUDENT' ? (
  <div style={styles.infoItem}>
    <FiPhone style={styles.infoIcon} />
    <div>
      <p style={styles.infoLabel}>Téléphone</p>
      <p style={styles.infoValue}>{profile.phone}</p>
    </div>
  </div>
) : (
  <div style={styles.infoItem}>
    <FiUser style={styles.infoIcon} />
    <div>
      <p style={styles.infoLabel}>Site web</p>
      <p style={styles.infoValue}>
        <a href={profile.website} target="_blank" rel="noopener noreferrer">
          {profile.website}
        </a>
      </p>
    </div>
  </div>
)}


              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Actions</h3>
              <button onClick={handleEditProfile} style={styles.primaryButton}>
                <FiEdit style={styles.buttonIcon} />
                Modifier le profil
              </button>

              <button
                onClick={handleDeactivateProfile}
                style={styles.warningButton}
                disabled={profile.deactivatedByUser}
              >
                <FiLock style={styles.buttonIcon} />
                Désactiver le compte
              </button>

              <button onClick={handleLogout} style={styles.logoutButton}>
                <FiLogOut style={styles.buttonIcon} />
                Déconnexion
              </button>
            </div>

            <div style={styles.footer}>
              <p style={styles.versionText}>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};




const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'transparent',
    padding: '2rem'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#64748b'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '640px',
    padding: '2.5rem',
    boxSizing: 'border-box',
    position: 'relative'
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  avatarWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
    marginBottom: '1rem'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #e2e8f0'
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: '#3b82f6',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#2563eb',
      transform: 'scale(1.1)'
    }
  },
  avatarEditIcon: {
    fontSize: '18px'
  },
  fullName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0.5rem 0'
  },
  roleBadge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1.5rem',
    color: '#dc2626'
  },
  errorText: {
    margin: 0,
    fontSize: '0.875rem'
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1.5rem',
    color: '#b45309'
  },
  warningText: {
    margin: 0,
    fontSize: '0.875rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    color: '#334155',
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f1f5f9'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.25rem'
  },
  infoItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  infoIcon: {
    color: '#64748b',
    fontSize: '1.25rem',
    marginTop: '0.25rem'
  },
  infoLabel: {
    color: '#64748b',
    fontSize: '0.875rem',
    margin: '0 0 0.25rem 0'
  },
  infoValue: {
    color: '#1e293b',
    fontSize: '1rem',
    fontWeight: '500',
    margin: 0
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.875rem',
    marginBottom: '1rem',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#3b82f6',
    color: 'white',
    ':hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)'
    }
  },
  warningButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.875rem',
    marginBottom: '1rem',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fef3c7',
    color: '#b45309',
    ':hover': {
      backgroundColor: '#fde68a',
      transform: 'translateY(-1px)'
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    }
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.875rem',
    marginBottom: '0',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    color: '#3b82f6',
    ':hover': {
      backgroundColor: '#f8fafc',
      transform: 'translateY(-1px)'
    }
  },
  buttonIcon: {
    marginRight: '0.75rem',
    fontSize: '1.125rem'
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '1.5rem'
  },
  versionText: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0
  }
};

export default SettingsPage;