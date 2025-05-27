import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "./api1";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/40?text=NA";

const SearchProfiles = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [images, setImages] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        axios
          .get(`http://localhost:1217/api/search?keyword=${keyword}`)
          .then((res) => {
            setResults(res.data);
            fetchProfilePictures(res.data);
          })
          .catch((err) => console.error(err));
      } else {
        setResults([]);
        setImages({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchProfilePictures = async (users) => {
    const newImages = {};
    await Promise.all(
      users.map(async (user) => {
        try {
          const res = await axios.get(
            `http://localhost:1217/api/search/image?userId=${user.userId}&role=${user.role}`,
            { responseType: "blob" }
          );
          newImages[user.userId] = URL.createObjectURL(res.data);
        } catch (err) {
          newImages[user.userId] = DEFAULT_PROFILE_PICTURE;
        }
      })
    );
    setImages(newImages);
  };

  const handleProfileClick = (userId, role) => {
    if (role === "MANAGER") {
      navigate(`/profilecompany/${userId}?role=${role}`);
    } else {
      navigate(`/profilestudent/${userId}?role=${role}`);
    }
  };

  // Styles modernisés
  const styles = {
    container: {
      width: "100%",
      maxWidth: "600px",
      margin: "32px auto",
      position: "relative",
    },
    searchInput: {
      width: "100%",
      padding: "16px 24px",
      border: "none",
      borderRadius: "30px",
      fontSize: "1rem",
      outline: "none",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      boxShadow: `
        0 4px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `,
      color: "#333",
      transition: "all 0.3s ease",
      ...(isFocused && {
        boxShadow: `
          0 6px 12px rgba(0, 0, 0, 0.15),
          inset 0 1px 2px rgba(255, 255, 255, 0.3)
        `,
        background: "rgba(255, 255, 255, 0.3)",
      }),
    },
    resultsList: {
      position: "absolute",
      width: "100%",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      marginTop: "8px",
      padding: "8px 0",
      maxHeight: "400px",
      overflowY: "auto",
      zIndex: 100,
      opacity: 0,
      transform: "translateY(-10px)",
      animation: "fadeIn 0.3s ease-out forwards",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      ...(results.length > 0 && {
        opacity: 1,
        transform: "translateY(0)",
      }),
    },
    resultItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 24px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      ":hover": {
        background: "rgba(0, 0, 0, 0.03)",
        transform: "translateX(5px)",
      },
      ":active": {
        transform: "scale(0.98)",
      },
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
    userName: {
      fontWeight: 600,
      color: "#222",
      fontSize: "0.95rem",
    },
    userRole: {
      color: "rgba(0, 0, 0, 0.5)",
      fontSize: "0.8rem",
      marginTop: "4px",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginLeft: "16px",
      border: "2px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        style={styles.searchInput}
        placeholder="🔍 Rechercher un profil..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {results.length > 0 && (
        <ul style={styles.resultsList}>
          {results.map((user) => (
            <li
              key={user.userId}
              style={styles.resultItem}
              onClick={() => handleProfileClick(user.userId, user.role)}
            >
              <div style={styles.userInfo}>
                <span style={styles.userName}>
                  {user.firstname} {user.lastname}
                </span>
                <span style={styles.userRole}>{user.role}</span>
              </div>
              <img
                src={images[user.userId] || DEFAULT_PROFILE_PICTURE}
                alt="Profile"
                style={styles.userAvatar}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchProfiles;