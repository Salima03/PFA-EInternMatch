import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './StudentProfileForm.css';
import Sidebar from '../layout/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const DEFAULT_COVER_PHOTO = "https://via.placeholder.com/1200x300?text=Cover+Photo";

const StudentProfileEdit = () => {
  const [profile, setProfile] = useState({
    id: null,
    headline: '',
    email: '',
    summary: '',
    location: '',
    phone: '',
    certifications: [{ name: '', issuingOrganization: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' }],
    educations: [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }],
    experiences: [{ title: '', company: '', location: '', startDate: '', endDate: '', description: '' }],
    skills: [{ name: '' }],
  });

  const [cvFile, setCvFile] = useState(null);
  const [letterFile, setLetterFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(DEFAULT_PROFILE_PICTURE);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(DEFAULT_COVER_PHOTO);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [profileExists, setProfileExists] = useState(false);


  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState({
  certifications: [],
  educations: [],
  experiences: []
});
// Fonction pour ajouter une notification
 const addNotification = (message, type = 'success', duration = 5000) => {
  return new Promise((resolve) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
      resolve();
    }, duration);
  });
};

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  // Fonction de validation des dates
const validateDate = (dateString) => {
  if (!dateString) return true; // Permettre les champs vides si nécessaire
  
  // Expression régulière pour le format aaaa-mm-jj
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  // Vérification supplémentaire de la validité de la date
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  // Vérifie si la date est valide
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return true;
};

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setProfile(response.data);
        setProfileExists(true);

        try {
          const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(pictureResponse.data);
          setProfilePicture(imageUrl);
        } catch (pictureError) {
          if (pictureError.response?.status === 404) {
            setProfilePicture(DEFAULT_PROFILE_PICTURE);
          } else {
            console.error("Erreur chargement photo de profil:", pictureError);
          }
        }

        try {
          const coverResponse = await axios.get(`${API_BASE_URL}/cover-photo`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          });
          const coverUrl = URL.createObjectURL(coverResponse.data);
          setCoverPhoto(coverUrl);
        } catch (coverError) {
          if (coverError.response?.status === 404) {
            setCoverPhoto(DEFAULT_COVER_PHOTO);
          } else {
            console.error("Erreur chargement cover photo:", coverError);
          }
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError('Erreur lors du chargement du profil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeProfileField = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (section, index, e) => {
    const { name, value } = e.target;
    setProfile(prev => {
      const updatedArray = [...prev[section]];
      updatedArray[index][name] = value;
      return { ...prev, [section]: updatedArray };
    });
  };

  const addArrayItem = (section, newItem) => {
    setProfile(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setProfile(prev => {
      const updatedArray = prev[section].filter((_, idx) => idx !== index);
      return { ...prev, [section]: updatedArray };
    });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setProfilePictureFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Valider toutes les dates avant soumission
  const certErrors = profile.certifications.map(cert => ({
    issueDate: !validateDate(cert.issueDate) && cert.issueDate,
    expirationDate: !validateDate(cert.expirationDate) && cert.expirationDate
  }));

  const eduErrors = profile.educations.map(edu => ({
    startDate: !validateDate(edu.startDate) && edu.startDate,
    endDate: !validateDate(edu.endDate) && edu.endDate
  }));

  const expErrors = profile.experiences.map(exp => ({
    startDate: !validateDate(exp.startDate) && exp.startDate,
    endDate: !validateDate(exp.endDate) && exp.endDate
  }));

  setValidationErrors({
    certifications: certErrors,
    educations: eduErrors,
    experiences: expErrors
  });

  // Vérifier s'il y a des erreurs
  const hasErrors = certErrors.some(err => err.issueDate || err.expirationDate) ||
                   eduErrors.some(err => err.startDate || err.endDate) ||
                   expErrors.some(err => err.startDate || err.endDate);


    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));

    if (cvFile) formData.append('cv', cvFile);
    if (letterFile) formData.append('letter', letterFile);
    if (profilePictureFile) formData.append('profilePicture', profilePictureFile);
    if (coverFile) formData.append('coverPhoto', coverFile);

    setLoading(true);

  
  
   try {
    if (profileExists && profile.id) {
      await axios.put(`${API_BASE_URL}/${profile.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      await addNotification('Profil mis à jour avec succès !');
      navigate('/profile/view');
    } else {
      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setProfile(response.data);
      setProfileExists(true);
      await addNotification('Profil créé avec succès !');
      navigate('/profile/view');
    }
  } catch (err) {
      let errorMessage = "Erreur inconnue.";
      if (err.response?.status === 403) {
        errorMessage = "Accès refusé. Vérifiez votre connexion.";
      } else if (err.response?.status === 500) {
        errorMessage = "Erreur serveur. Vérifiez vos données.";
      }
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!profile.id) {
      setError("Impossible de supprimer : ID introuvable.");
      return;
    }

    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre profil ?");
    if (!confirmed) return;

      try {
    await axios.delete(`${API_BASE_URL}/${profile.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await addNotification('Profil supprimé avec succès.');
    localStorage.removeItem('accessToken');
    navigate('/login');
  } catch (err) {
      let errorMessage = "Erreur lors de la suppression du profil.";
      if (err.response?.status === 403) {
        errorMessage = "Accès refusé. Vous n'avez pas les droits pour supprimer ce profil.";
      }
      addNotification(errorMessage, 'error');
    }
  };
  

 //assia
  return (
    <div className="layout"> 
    <Sidebar />
 {/* Ajoutez ce conteneur de notifications en haut de votre page */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
            <span 
              className="close-notification" 
              onClick={() => removeNotification(notification.id)}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
    
      <main className="page-content">
    <div className="form-wrapper">
      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSubmit}>
  
          <div className="cover-photo-container">
            <div className="cover-photo-wrapper">
              {coverPhoto ? (
                <img src={coverPhoto} alt="Cover" className="cover-photo" />
              ) : (
                <div className="cover-photo-placeholder" />
              )}
              <label className="edit-cover-button">
                



              <svg xmlns="http://www.w3.org/2000/svg" class="camera-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>




                Modifier 
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCoverChange}
                />
              </label>
            </div>
  
            <div className="profile-picture-wrapper">
              <div className="profile-picture-container">
                <img src={profilePicture} alt="Profile" />
              </div>
              <label className="edit-profile-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="camera-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
                Modifier 
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>
  
          {error && <p className="error-message">{error}</p>}
  
          <label>Title
          <input
    type="text"
    name="headline"
    value={profile.headline}
    onChange={handleChangeProfileField}
    placeholder="Ex: Étudiant en développement web cherchant un stage"
    style={{
      padding: '1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: '#fafafa',
      transition: 'all 0.3s ease'
    }}
  />
          </label>
  
          <label>Résumé
            <textarea name="summary" value={profile.summary} onChange={handleChangeProfileField} />
          </label>
       
          <h3>Certificats</h3>
          {profile.certifications.map((cert, index) => (
            <div key={index}>
              <div className="certification-grid">
              <input name="name" placeholder="Nom" value={cert.name} onChange={(e) => handleArrayChange('certifications', index, e)} />
              <input name="issuingOrganization" placeholder="Organisme" value={cert.issuingOrganization} onChange={(e) => handleArrayChange('certifications', index, e)} />
                 <input 
      name="issueDate" 
      placeholder="Date d'obtention (aaaa-mm-jj)" 
      value={cert.issueDate} 
      onChange={(e) => handleArrayChange('certifications', index, e)} 
    />
    {validationErrors.certifications[index]?.issueDate && (
      <span className="error-text">Format invalide (aaaa-mm-jj requis)</span>
    )}
    
    <input 
      name="expirationDate" 
      placeholder="Date d'expiration (aaaa-mm-jj)" 
      value={cert.expirationDate} 
      onChange={(e) => handleArrayChange('certifications', index, e)} 
    />
    {validationErrors.certifications[index]?.expirationDate && (
      <span className="error-text">Format invalide (aaaa-mm-jj requis)</span>
    )}

            
              <input name="credentialUrl" placeholder="URL" value={cert.credentialUrl} onChange={(e) => handleArrayChange('certifications', index, e)} />
              
              </div>
              <p></p>
              <button type="button" onClick={() => removeArrayItem('certifications', index)}>Supprimer</button>
            
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuingOrganization: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' })}>Ajouter Certification</button>
  
          <h3>Formations</h3>
          {profile.educations.map((edu, index) => (
            <div key={index}>
              <div className="certification-grid">
              <input name="school" placeholder="École" value={edu.school} onChange={(e) => handleArrayChange('educations', index, e)} />
              <input name="degree" placeholder="Diplôme" value={edu.degree} onChange={(e) => handleArrayChange('educations', index, e)} />
              <input name="fieldOfStudy" placeholder="Domaine" value={edu.fieldOfStudy} onChange={(e) => handleArrayChange('educations', index, e)} />
              <div className="input-group">
  <input
    name="startDate"
    className={`input-date ${validationErrors.educations[index]?.startDate ? 'invalid' : ''}`}
    placeholder="Début (aaaa-mm-jj)"
    value={edu.startDate}
    onChange={(e) => handleArrayChange('educations', index, e)}
  />
  {validationErrors.educations[index]?.startDate && (
    <div className="error-message visible">
      <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Format invalide (aaaa-mm-jj requis)
    </div>
  )}
</div>

<div className="input-group">
  <input
    name="endDate"
    className={`input-date ${validationErrors.educations[index]?.endDate ? 'invalid' : ''}`}
    placeholder="Fin (aaaa-mm-jj)"
    value={edu.endDate}
    onChange={(e) => handleArrayChange('educations', index, e)}
  />
  {validationErrors.educations[index]?.endDate && (
    <div className="error-message visible">
      <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Format invalide (aaaa-mm-jj requis)
    </div>
  )}
</div>
              </div>
              <p></p>
              <textarea name="description" placeholder="Description" value={edu.description} onChange={(e) => handleArrayChange('educations', index, e)} />
              <button type="button" onClick={() => removeArrayItem('educations', index)}>Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('educations', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })}>Ajouter Formation</button>
  
          <h3>Expériences</h3>
          {profile.experiences.map((exp, index) => (
            <div key={index}>
              <div className="certification-grid">
              <input name="title" placeholder="Poste" value={exp.title} onChange={(e) => handleArrayChange('experiences', index, e)} />
              <input name="company" placeholder="Entreprise" value={exp.company} onChange={(e) => handleArrayChange('experiences', index, e)} />
              <input name="location" placeholder="Lieu" value={exp.location} onChange={(e) => handleArrayChange('experiences', index, e)} />
              <input name="startDate" placeholder="Début" value={exp.startDate} onChange={(e) => handleArrayChange('experiences', index, e)} />
              <input name="endDate" placeholder="Fin" value={exp.endDate} onChange={(e) => handleArrayChange('experiences', index, e)} />
              </div>
              <p></p>
              <textarea name="description" placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange('experiences', index, e)} />
              <button type="button" onClick={() => removeArrayItem('experiences', index)}>Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('experiences', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>Ajouter Expérience</button>
  
          <h3>Compétences</h3>
          {profile.skills.map((skill, index) => (
            <div key={index}>
              <div className="certification-grid">
              <input name="name" placeholder="Compétence" value={skill.name} onChange={(e) => handleArrayChange('skills', index, e)} />
              </div>
              <p></p>
              <button type="button" onClick={() => removeArrayItem('skills', index)}>Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('skills', { name: '' })}>Ajouter Compétence</button>
  
        {/* <label>CV (PDF)
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setCvFile)} />
          </label>
  
          <label>Lettre de motivation (PDF)
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setLetterFile)} />
          </label>
*/}
<div className="file-upload-section">
  <div className="file-upload-card">
    <label htmlFor="cvUpload">
      <strong>CV (PDF)</strong>
      <div className="upload-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#24055a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
  <path d="M12 5v14M5 12l7 7 7-7" />
</svg>

        <p>Choisir un fichier</p>
        <span>PDF uniquement</span>
      </div>
    </label>
    <input
      id="cvUpload"
      type="file"
      accept=".pdf"
      style={{ display: 'none' }}
      onChange={(e) => handleFileChange(e, setCvFile)}
    />
  </div>

  <div className="file-upload-card">
    <label htmlFor="motivationUpload">
      <strong>Lettre de motivation (PDF)</strong>
      <div className="upload-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#24055a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
  <path d="M12 5v14M5 12l7 7 7-7" />
</svg>

        <p>Choisir un fichier</p>
        <span>PDF uniquement</span>
      </div>
    </label>
    <input
      id="motivationUpload"
      type="file"
      accept=".pdf"
      style={{ display: 'none' }}
      onChange={(e) => handleFileChange(e, setLetterFile)}
    />
  </div>
</div>
               {/*buttons update & delete profil*/ }
                <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button
                    type="submit"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "#5c9ead";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#5c9ead";
                      e.target.style.color = "white";
                    }}
                    style={{
                      padding: "10px 30px",
                      backgroundColor: "#5c9ead",
                      color: "white",
                      border: "2px solid #5c9ead",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {profileExists ? 'Update profil' : 'Create profil'}
                  </button>

                  {profileExists && (
                    <button
                      type="button"
                      onClick={handleDeleteProfile}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#5c9ead";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#5c9ead";
                        e.target.style.color = "white";
                      }}
                      style={{
                        padding: "10px 30px",
                        backgroundColor: "#5c9ead",
                        color: "white",
                        border: "2px solid #5c9ead",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Delete Profil
                    </button>
                  )}
                </div>

        </form>
      )}
    </div>
    </main>
    </div>
  );
  
};

export default StudentProfileEdit;
