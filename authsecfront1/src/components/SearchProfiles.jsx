import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/40?text=NA";

const SearchProfiles = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [images, setImages] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setIsFocused(false);
    if (role === "MANAGER") {
      navigate(`/profilecompany/${userId}?role=${role}`);
    } else {
      navigate(`/profilestudent/${userId}?role=${role}`);
    }
  };

  // Styles avec positionnement absolu contrôlé
  const styles = {
    outerContainer: {
      position: "relative",
      width: "100%",
      maxWidth: "600px",
      margin: "20px auto",
      zIndex: 1000, // Assure la priorité sur le hidebar
    },
    innerContainer: {
      position: "relative",
      padding: "0 15px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 20px",
      border: "none",
      borderRadius: "30px",
      fontSize: "0.95rem",
      outline: "none",
      background: "rgba(255, 255, 255, 0.9)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      color: "#333",
      transition: "all 0.3s ease",
    },
    resultsList: {
      position: "absolute",
      top: "calc(100% + 5px)",
      left: "15px",
      right: "15px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      maxHeight: "60vh",
      overflowY: "auto",
      zIndex: 1001, // Au-dessus de l'input
      opacity: 0,
      visibility: "hidden",
      transform: "translateY(-10px)",
      transition: "all 0.2s ease",
      ...(isFocused && results.length > 0 && {
        opacity: 1,
        visibility: "visible",
        transform: "translateY(0)",
      }),
    },
    resultItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 20px",
      cursor: "pointer",
      borderBottom: "1px solid #f0f0f0",
      "&:hover": {
        background: "#f8f8f8",
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    userInfo: {
      flex: 1,
      marginRight: "12px",
    },
    userName: {
      fontWeight: "600",
      color: "#222",
    },
    userRole: {
      fontSize: "0.8rem",
      color: "#666",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    },
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer} ref={searchRef}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="🔍 Rechercher un profil..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        <div style={styles.resultsList}>
          {results.map((user) => (
            <div
              key={user.userId}
              style={styles.resultItem}
              onClick={() => handleProfileClick(user.userId, user.role)}
            >
              <div style={styles.userInfo}>
                <div style={styles.userName}>
                  {user.firstname} {user.lastname}
                </div>
                <div style={styles.userRole}>{user.role}</div>
              </div>
              <img
                src={images[user.userId] || DEFAULT_PROFILE_PICTURE}
                alt="Profile"
                style={styles.userAvatar}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProfiles;