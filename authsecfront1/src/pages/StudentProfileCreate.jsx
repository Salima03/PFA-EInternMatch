import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../components/api1";
import './StudentProfileForm.css'; // <-- Ton CSS importé ici
import Sidebar from '../layout/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';

const StudentProfileCreate = () => {
  const [profile, setProfile] = useState({
    headline: '',
    summary: '',
    location: '',
    phone: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [letterFile, setLetterFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Nettoyer les URLs créées pour éviter fuite mémoire
  useEffect(() => {
    return () => {
      if (coverPhoto) URL.revokeObjectURL(coverPhoto);
      if (profilePicture) URL.revokeObjectURL(profilePicture);
    };
  }, [coverPhoto, profilePicture]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "cv") setCvFile(files[0]);
    if (name === "letter") setLetterFile(files[0]);
    if (name === "profilePicture") setProfilePicture(files[0]);
    if (name === "coverPhoto") setCoverPhoto(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("profile", JSON.stringify(profile));
    if (cvFile) formData.append("cv", cvFile);
    if (letterFile) formData.append("letter", letterFile);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);

    try {
      const response=await axios.post(`${API_BASE_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const createdProfile=response.data;
      const studentProfileId=createdProfile.id;
      //localStorage.setItem("studentProfileId",studentProfileId);


      alert("Profil créé avec succès !");
      navigate("/profile/view");
    } catch (error) {
      console.error("Erreur création profil:", error);
      setError("Erreur lors de la création du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="layout"> 
    <Sidebar />

    
      <main className="page-content">
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="cover-photo-container">
          {/* Cover Photo */}
          <div className="cover-photo-wrapper">
            {coverPhoto ? (
              <img src={URL.createObjectURL(coverPhoto)} alt="Cover" className="cover-photo" />
            ) : (
              <div className="cover-photo-placeholder" />
            )}
            <label className="edit-cover-button">
              Modifier cover
              <input
                type="file"
                name="coverPhoto"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Profile Picture */}
          <div className="profile-picture-wrapper">
            <div className="profile-picture-container">
              {profilePicture ? (
                <img src={URL.createObjectURL(profilePicture)} alt="Profile" />
              ) : (
                <div className="profile-picture-placeholder" />
              )}
            </div>
            <label className="edit-profile-button">
              modifier profile
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && <p className="error-message">{error}</p>}

        {/* Inputs */}
        <input
          type="text"
          name="headline"
          value={profile.headline}
          onChange={handleChange}
          placeholder="Titre"
          required
        />
        <textarea
          name="summary"
          value={profile.summary}
          onChange={handleChange}
          placeholder="Résumé"
          required
        />
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          placeholder="Localisation"
        />
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Téléphone"
        />

      
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
        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le profil"}
        </button>
      </form>
    </div>
    </main>
    </div>
    
  );
};

export default StudentProfileCreate;
