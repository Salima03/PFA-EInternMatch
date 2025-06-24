import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from '../layout/Sidebar';
//pour les icones de poubelles pour supprimer
import { Trash2 } from "lucide-react";
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const DEFAULT_COVER_PHOTO = "https://via.placeholder.com/1200x300.png?text=Cover+Photo";

const StudentProfileView = () => {
  

  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(DEFAULT_COVER_PHOTO);
  const [cvUrl, setCvUrl] = useState(null);
  const [motivationLetterUrl, setMotivationLetterUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const navigate = useNavigate();

  const reloadProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = { Authorization: `Bearer ${token}` };
    const accessToken = localStorage.getItem("accessToken");

if (accessToken) {
  const base64Url = accessToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(window.atob(base64));
  const emailFromToken = decoded.sub; 
  console.log("Email récupéré depuis le token:", emailFromToken);
}


    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/my-profile`, { headers });
      const userProfile = profileResponse.data;
      setProfile(userProfile);

      try {
        const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, { headers, responseType: 'blob' });
        setProfilePictureUrl(URL.createObjectURL(pictureResponse.data));
      } catch {
        setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
      }

      try {
        const coverResponse = await axios.get(`${API_BASE_URL}/cover-photo`, { headers, responseType: 'blob' });
        setCoverPhotoUrl(URL.createObjectURL(coverResponse.data));
      } catch {
        setCoverPhotoUrl(DEFAULT_COVER_PHOTO);
      }

      try {
        const cvResponse = await axios.get(`${API_BASE_URL}/cv`, { headers, responseType: 'blob' });
        setCvUrl(URL.createObjectURL(cvResponse.data));
      } catch {
        setCvUrl(null);
      }

      try {
        const motivationResponse = await axios.get(`${API_BASE_URL}/letter`, { headers, responseType: 'blob' });
        setMotivationLetterUrl(URL.createObjectURL(motivationResponse.data));
      } catch {
        setMotivationLetterUrl(null);
      }

    } catch (profileError) {
      console.error('Erreur de rechargement du profil:', profileError);
      setError("Impossible de charger votre profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
if (storedEmail) {
  setEmail(storedEmail);
}
    reloadProfile();
  }, [navigate]);

  const handleDeleteFile = async (fileType) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vous devez être connecté.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/file/${fileType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      switch (fileType) {
        case "cover-photo":
          setCoverPhotoUrl(DEFAULT_COVER_PHOTO);
          alert("Photo de couverture supprimée !");
          break;
        case "profile-picture":
          setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
          alert("Photo de profil supprimée !");
          break;
        case "cv":
          setCvUrl(null);
          alert("CV supprimé !");
          break;
        case "letter":
          setMotivationLetterUrl(null);
          alert("Lettre de motivation supprimée !");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du fichier.");
    }
  };

  const handleDeleteCover = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre photo de couverture ?")) {
      handleDeleteFile("cover-photo");
    }
  };

  const handleDeleteProfilePicture = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre photo de profil ?")) {
      handleDeleteFile("profile-picture");
    }
  };

  const handleDeleteCv = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre CV ?")) {
      handleDeleteFile("cv");
    }
  };

  const handleDeleteLetter = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre lettre de motivation ?")) {
      handleDeleteFile("letter");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Aucun profil trouvé.</p>;


  // assia
  const ReadOnlyField = ({ label, value }) => (
    <div style={{ marginBottom: "20px", flex: 1, marginRight: "20px" }}>
      <label style={{ display: "block", fontSize: "14px", marginBottom: "10px", color: "#888" }}>{label}</label>
      <input
        type="text"
        disabled
        defaultValue={value}
        style={{
          width: "90%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #eee",
          backgroundColor: "#f5f5f5",
          color: "#333",
          fontWeight: "500"
        }}
      />
    </div>
  );

  return (
    <div className="layout"> 
    <Sidebar />

    
      <main className="page-content">
  
      <div style={{ backgroundColor: "linear-gradient(180deg, #e0f2f1, #ffffff)", minHeight: "100vh", padding: "30px 0" }}>
        <div style={{
          backgroundColor: "#ffffff",
          width: "90%",
          maxWidth: "1000px",
          margin: "auto",
          borderRadius: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}>
         
          <div style={{ position: "relative", height: "250px", backgroundColor: "#ccc" }}>
            <img
              src={coverPhotoUrl}
              alt="Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
                <button
                    onClick={handleDeleteCover}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "transparent", // ✅ pas de fond
                      color: "#000",                  // ✅ noir
                      border: "none",                // ✅ pas de bordure
                      fontSize: "30px",              // ✅ légèrement plus grand
                      fontWeight: "bold",
                      cursor: "pointer",
                      lineHeight: "1"
                    }}
                  >
                    ×
                  </button>

            <img
              src={profilePictureUrl}
              alt="Profile"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "5px solid white",
                position: "absolute",
                bottom: "-70px",
                left: "40px",
                backgroundColor: "#fff"
              }}
            />
          </div>
  
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "80px" ,marginLeft:"30px" }}>
 
  <ReadOnlyField label="Email" value={email} />
  <ReadOnlyField label="Phone Number" value={profile.phone} />
  <ReadOnlyField label="Location" value={profile.location} />
</div>

  
          
          <div style={{ padding: "20px 40px" }}>
            <h3>About me</h3>
            <p style={{ marginTop: "10px", color: "#555" }}>{profile.summary}</p>
          </div>
        

          
              <div style={{ padding: "20px 40px" }}>
                <h3>Experiences</h3>
                {profile.experiences?.map((exp, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fafafa",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <strong>{exp.title}</strong>
                      <span style={{ color: "#888", fontSize: "0.9em" }}>
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 5px 0" }}>{exp.location}</p>
                    <p style={{ color: "#666", margin: 0 }}>{exp.description}</p>
                  </div>
                ))}
              </div>

  
                        
              <div style={{ padding: "20px 40px" }}>
                <h3>Formations</h3>
                {profile.educations?.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fafafa",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <strong>{edu.degree}</strong>
                      <span style={{ color: "#888", fontSize: "0.9em" }}>
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 5px 0" }}>
                      {edu.fieldOfStudy} – {edu.school}
                    </p>
                    <p style={{ color: "#666", margin: 0 }}>{edu.description}</p>
                  </div>
                ))}
              </div>

  
          
          <div style={{ padding: "20px 40px" }}>
            <h3>Skills</h3>
            <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
              {profile.skills?.map((skill, index) => (
                <li key={index} style={{ marginBottom: "5px", color: "#555" }}>{skill.name}</li>
              ))}
            </ul>
          </div>
  
          
          <div style={{ padding: "20px 40px" }}>
            <h3>Certifications</h3>
            {profile.certifications?.map((cert, index) => (
              <div key={index} style={{
                backgroundColor: "#fafafa",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
                border: "1px solid #eee"
              }}>
                <p><strong>{cert.name}</strong> | {cert.issueDate}</p>
                <p>{cert.issuedBy}</p>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ color: "#5c9ead" }}>
                    Voir certification
                  </a>
                )}
              </div>
            ))}
          </div>
  
          

<div style={{ padding: "20px 40px" }}>
  <h3>Files</h3>
  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "15px" }}>
    {cvUrl && (
      <div style={{
        flex: "1 1 250px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007b8f", fontWeight: "bold", textDecoration: "none" }}>
          📄 CV
        </a>
        <button
          onClick={handleDeleteCv}
          title="Supprimer le CV"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#007b8f"
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>
    )}

    {motivationLetterUrl && (
      <div style={{
        flex: "1 1 250px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <a href={motivationLetterUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007b8f", fontWeight: "bold", textDecoration: "none" }}>
          ✉️ Lettre de motivation
        </a>
        <button
          onClick={handleDeleteLetter}
          title="Supprimer la lettre"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#007b8f"
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>
    )}
  </div>
</div>

         
          <div style={{ padding: "30px 40px", textAlign: "right" }}>
            <button
              onClick={() => navigate(`/profile/edit/${profile.id}`)}
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
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#5c9ead";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#5c9ead";
                e.target.style.color = "white";
              }}
            >
              Edit
            </button>


          </div>
        </div>
      </div>
    </main>
    </div>
  );
};

export default StudentProfileView;

/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from '../layout/Sidebar';
import { Trash2, Edit, Mail, Phone, MapPin } from "lucide-react";
import styled from 'styled-components';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1/profiles';
const DEFAULT_PROFILE_PICTURE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const DEFAULT_COVER_PHOTO = "https://via.placeholder.com/1200x300.png?text=Cover+Photo";

// Styled Components
const Container = styled.div`
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
  font-family: 'Inter', sans-serif;
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  margin-bottom: 2.5rem;
`;

const CoverPhoto = styled.div`
  height: 15.625rem;
  width: 100%;
  background-color: #e0f2f1;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfilePicture = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 0.3125rem solid white;
  position: absolute;
  bottom: -5rem;
  left: 2.5rem;
  object-fit: cover;
  background-color: white;
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.15);
  z-index: 2;
`;

const ProfileHeader = styled.div`
  padding: 6.25rem 2.5rem 1.875rem;
  background-color: white;
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.3125rem 0;
  color: #333;
`;

const ProfileTitle = styled.p`
  font-size: 1.125rem;
  color: #007b8f;
  margin: 0 0 1.25rem 0;
  font-weight: 500;
`;

const ProfileContent = styled.div`
  padding: 0 2.5rem 1.875rem;
`;

const Section = styled.div`
  margin-bottom: 1.875rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.875rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #555;
  background-color: #f9f9f9;
  padding: 0.625rem 0.9375rem;
  border-radius: 0.5rem;
`;

const AboutText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  white-space: pre-line;
`;

const ExperienceItem = styled.div`
  background-color: #fafafa;
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 0.9375rem;
  border: 1px solid #eee;
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
`;

const ExperienceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ExperienceDate = styled.span`
  color: #888;
  font-size: 0.875rem;
`;

const ExperienceLocation = styled.p`
  color: #666;
  margin: 0 0 0.625rem 0;
  font-size: 0.9375rem;
`;

const ExperienceDescription = styled.p`
  color: #555;
  font-size: 0.9375rem;
  line-height: 1.5;
`;

const SkillList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding: 0;
  list-style: none;
`;

const SkillItem = styled.li`
  background-color: #e0f2f1;
  color: #007b8f;
  padding: 0.5rem 0.9375rem;
  border-radius: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const FileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 0.9375rem;
  border-radius: 0.625rem;
  margin-bottom: 0.9375rem;
  border: 1px solid #eee;
`;

const FileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: #007b8f;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.9375rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ff6b6b;
  display: flex;
  align-items: center;
`;

const EditButton = styled.button`
  background-color: #007b8f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  
  &:hover {
    background-color: #006a7a;
    transform: translateY(-2px);
  }
`;

const DeleteCoverButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background-color: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.3125rem rgba(0,0,0,0.1);
  color: #ff6b6b;
  z-index: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StudentProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(DEFAULT_PROFILE_PICTURE);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(DEFAULT_COVER_PHOTO);
  const [cvUrl, setCvUrl] = useState(null);
  const [motivationLetterUrl, setMotivationLetterUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const reloadProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/my-profile`, { headers });
      const userProfile = profileResponse.data;
      setProfile(userProfile);

      try {
        const pictureResponse = await axios.get(`${API_BASE_URL}/profile-picture`, { headers, responseType: 'blob' });
        setProfilePictureUrl(URL.createObjectURL(pictureResponse.data));
      } catch {
        setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
      }

      try {
        const coverResponse = await axios.get(`${API_BASE_URL}/cover-photo`, { headers, responseType: 'blob' });
        setCoverPhotoUrl(URL.createObjectURL(coverResponse.data));
      } catch {
        setCoverPhotoUrl(DEFAULT_COVER_PHOTO);
      }

      try {
        const cvResponse = await axios.get(`${API_BASE_URL}/cv`, { headers, responseType: 'blob' });
        setCvUrl(URL.createObjectURL(cvResponse.data));
      } catch {
        setCvUrl(null);
      }

      try {
        const motivationResponse = await axios.get(`${API_BASE_URL}/letter`, { headers, responseType: 'blob' });
        setMotivationLetterUrl(URL.createObjectURL(motivationResponse.data));
      } catch {
        setMotivationLetterUrl(null);
      }

    } catch (profileError) {
      console.error('Erreur de rechargement du profil:', profileError);
      setError("Impossible de charger votre profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    reloadProfile();
  }, [navigate]);

  const handleDeleteFile = async (fileType) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vous devez être connecté.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/file/${fileType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      switch (fileType) {
        case "cover-photo":
          setCoverPhotoUrl(DEFAULT_COVER_PHOTO);
          break;
        case "profile-picture":
          setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
          break;
        case "cv":
          setCvUrl(null);
          break;
        case "letter":
          setMotivationLetterUrl(null);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <main className="page-content">
        <LoadingContainer>Chargement en cours...</LoadingContainer>
      </main>
    </div>
  );

  if (error) return (
    <div className="layout">
      <Sidebar />
      <main className="page-content">
        <LoadingContainer>{error}</LoadingContainer>
      </main>
    </div>
  );

  if (!profile) return (
    <div className="layout">
      <Sidebar />
      <main className="page-content">
        <LoadingContainer>Aucun profil trouvé.</LoadingContainer>
      </main>
    </div>
  );

  return (
    <div className="layout"> 
      <Sidebar />
      <main className="page-content">
        <Container>
          <ProfileCard>
            
            <CoverPhoto>
              <img src={coverPhotoUrl} alt="Cover" />
              <DeleteCoverButton
                onClick={() => window.confirm("Supprimer la photo de couverture ?") && handleDeleteFile("cover-photo")}
                title="Supprimer la photo de couverture"
              >
                <Trash2 size={18} />
              </DeleteCoverButton>
            </CoverPhoto>

           
            <ProfilePicture
              src={profilePictureUrl}
              alt="Profile"
            />

            
            <ProfileHeader>
              <ProfileName>{profile.firstName} {profile.lastName}</ProfileName>
              <ProfileTitle>{profile.headline}</ProfileTitle>
              
              <ContactInfo>
                {email && (
                  <ContactItem>
                    <Mail size={16} />
                    <span>{email}</span>
                  </ContactItem>
                )}
                {profile.phone && (
                  <ContactItem>
                    <Phone size={16} />
                    <span>{profile.phone}</span>
                  </ContactItem>
                )}
                {profile.location && (
                  <ContactItem>
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </ContactItem>
                )}
              </ContactInfo>
            </ProfileHeader>

           
            <ProfileContent>
             
              {profile.summary && (
                <Section>
                  <SectionTitle>À propos</SectionTitle>
                  <AboutText>{profile.summary}</AboutText>
                </Section>
              )}

              
              {profile.experiences?.length > 0 && (
                <Section>
                  <SectionTitle>Expériences</SectionTitle>
                  {profile.experiences.map((exp, index) => (
                    <ExperienceItem key={index}>
                      <ExperienceHeader>
                        <ExperienceTitle>{exp.title}</ExperienceTitle>
                        <ExperienceDate>
                          {exp.startDate} – {exp.endDate || 'Présent'}
                        </ExperienceDate>
                      </ExperienceHeader>
                      <ExperienceLocation>{exp.company} • {exp.location}</ExperienceLocation>
                      {exp.description && (
                        <ExperienceDescription>{exp.description}</ExperienceDescription>
                      )}
                    </ExperienceItem>
                  ))}
                </Section>
              )}

             
              {profile.educations?.length > 0 && (
                <Section>
                  <SectionTitle>Formations</SectionTitle>
                  {profile.educations.map((edu, index) => (
                    <ExperienceItem key={index}>
                      <ExperienceHeader>
                        <ExperienceTitle>{edu.degree}</ExperienceTitle>
                        <ExperienceDate>
                          {edu.startDate} – {edu.endDate || 'Présent'}
                        </ExperienceDate>
                      </ExperienceHeader>
                      <ExperienceLocation>{edu.school} • {edu.fieldOfStudy}</ExperienceLocation>
                      {edu.description && (
                        <ExperienceDescription>{edu.description}</ExperienceDescription>
                      )}
                    </ExperienceItem>
                  ))}
                </Section>
              )}

              
              {profile.skills?.length > 0 && (
                <Section>
                  <SectionTitle>Compétences</SectionTitle>
                  <SkillList>
                    {profile.skills.map((skill, index) => (
                      <SkillItem key={index}>
                        {skill.name}
                      </SkillItem>
                    ))}
                  </SkillList>
                </Section>
              )}

              
              {profile.certifications?.length > 0 && (
                <Section>
                  <SectionTitle>Certifications</SectionTitle>
                  {profile.certifications.map((cert, index) => (
                    <ExperienceItem key={index}>
                      <ExperienceHeader>
                        <ExperienceTitle>{cert.name}</ExperienceTitle>
                        <ExperienceDate>
                          {cert.issueDate}
                        </ExperienceDate>
                      </ExperienceHeader>
                      <ExperienceLocation>{cert.issuingOrganization}</ExperienceLocation>
                      {cert.credentialUrl && (
                        <FileLink 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Voir la certification
                        </FileLink>
                      )}
                    </ExperienceItem>
                  ))}
                </Section>
              )}

            
              {(cvUrl || motivationLetterUrl) && (
                <Section>
                  <SectionTitle>Documents</SectionTitle>
                  {cvUrl && (
                    <FileCard>
                      <FileLink 
                        href={cvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span>📄 CV</span>
                      </FileLink>
                      <DeleteButton 
                        onClick={() => window.confirm("Supprimer le CV ?") && handleDeleteFile("cv")}
                        title="Supprimer le CV"
                      >
                        <Trash2 size={18} />
                      </DeleteButton>
                    </FileCard>
                  )}
                  {motivationLetterUrl && (
                    <FileCard>
                      <FileLink 
                        href={motivationLetterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span>✉️ Lettre de motivation</span>
                      </FileLink>
                      <DeleteButton 
                        onClick={() => window.confirm("Supprimer la lettre de motivation ?") && handleDeleteFile("letter")}
                        title="Supprimer la lettre"
                      >
                        <Trash2 size={18} />
                      </DeleteButton>
                    </FileCard>
                  )}
                </Section>
              )}

              
              <div style={{ textAlign: 'right', padding: '1.25rem 0' }}>
                <EditButton
                  onClick={() => navigate(`/profile/edit/${profile.id}`)}
                >
                  <Edit size={18} />
                  Modifier le profil
                </EditButton>
              </div>
            </ProfileContent>
          </ProfileCard>
        </Container>
      </main>
    </div>
  );
};

export default StudentProfileView;
*/