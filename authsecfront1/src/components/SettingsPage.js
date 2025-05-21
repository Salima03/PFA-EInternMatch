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