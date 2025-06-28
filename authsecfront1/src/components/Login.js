import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1217/api/v1';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
              .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const storeTokens = (token, refreshToken) => {
    setToken(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const redirectUser = (decoded, name = '') => {
    const role = decoded?.role;
    if (role === 'MANAGER') {
      setMessage(`Bienvenue ${name || 'Manager'} ! Redirection...`);
      setTimeout(() => navigate('/homecompany'), 1500);
    } else if (role === 'ADMIN') {
      setMessage(`Bienvenue Admin ${name} ! Redirection...`);
      setTimeout(() => navigate('/admin'), 1500);
    }
    else {
      setMessage(`Welcome ${name || 'User'}! Redirecting...`);
      setTimeout(() => navigate('/home'), 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/authenticate`, formData);
      const { access_token, refresh_token, studentProfileId } = response.data;

      if (access_token && refresh_token) {
        storeTokens(access_token, refresh_token);
        const decoded = parseJwt(access_token);
        localStorage.setItem('userId', decoded?.userId);

        if (decoded?.sub) {
          localStorage.setItem('email', decoded.sub);
        }
        if (decoded?.role) {
          localStorage.setItem('role', decoded.role);
        }
        if (studentProfileId) {
          localStorage.setItem("studentProfileId", studentProfileId);
        }

        redirectUser(decoded, decoded?.name || decoded?.sub || '');
      } else {
        console.error("Tokens not found in Google login response", response.data);
        setMessage("Erreur: tokens manquants dans la réponse Google.");
      }
    } catch (error) {
      const err = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      setMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate('/register');
    }, 500);
  };

  return (
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          <div style={styles.leftColumn}>
            <div style={styles.loginContainer}>
              <h2 style={styles.title}>Connectez-vous à votre compte</h2>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ ...styles.input, ...(errors.email && styles.inputError) }}
                      required
                  />
                  {errors.email && <span style={styles.error}>{errors.email}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <div style={styles.passwordWrapper}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ ...styles.input, ...(errors.password && styles.inputError) }}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.togglePassword}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && <span style={styles.error}>{errors.password}</span>}
                </div>

                <button type="submit" disabled={isLoading} style={styles.loginButton}>
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div style={styles.socialSection}>
                <p style={styles.socialText}>Se connecter avec Google</p>
                <div style={styles.googleButton}>
                  <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        console.log("Réponse des identifiants Google:", credentialResponse);
                        const idToken = credentialResponse.credential;

                        try {
                          const response = await axios.post(`${API_BASE_URL}/auth/google`, { idToken });
                          console.log("Réponse du backend:", response.data);
                          const { access_token, refresh_token, studentProfileId } = response.data;
                          console.log("studentProfileId du backend:", studentProfileId);

                          storeTokens(access_token, refresh_token);
                          const decoded = parseJwt(access_token);
                          localStorage.setItem('userId', decoded.userId);
                          if (studentProfileId) {
                            localStorage.setItem("studentProfileId", studentProfileId);
                          }
                          redirectUser(decoded, decoded.name || decoded.sub || '');
                        } catch (error) {
                          setMessage('Erreur lors de la connexion Google');
                          console.error(error);
                        }
                      }}
                      onError={() => {
                        setMessage('Échec de la connexion Google');
                      }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{
            ...styles.rightColumn,
            transform: isSliding ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.5s ease-in-out'
          }}>
            <div style={styles.signupSection}>
              <p style={styles.signupTitle}>Nouveau ici ?</p>
              <p style={styles.signupText}>Inscrivez-vous et découvrez de nombreuses opportunités !</p>
              <button
                  onClick={handleSignUpClick}
                  style={styles.signupButton}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {message && (
            <div style={message.toLowerCase().includes('fail') || message.toLowerCase().includes('invalid') ? styles.errorMessage : styles.successMessage}>
              {message}
            </div>
        )}
      </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  contentContainer: {
    display: 'flex',
    width: '900px',
    height: '700px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  leftColumn: {
    flex: 1,
    backgroundColor: 'white',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #00acc1, #0097a7)',
    padding: '40px',
    position: 'relative',
  },
  loginContainer: {
    width: '100%',
    maxWidth: '350px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '30px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  passwordWrapper: {
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
  loginButton: {
    backgroundColor: '#00acc1',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#0097a7',
    }
  },
  socialSection: {
    marginTop: '30px',
    textAlign: 'center',
  },
  socialText: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px',
  },
  googleButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  signupSection: {
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    color: 'white',
  },
  signupTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  signupText: {
    fontSize: '16px',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  signupButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '12px 30px',
    border: '2px solid white',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  },
  error: {
    color: '#ff4d4f',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block',
  },
  errorMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff2f0',
    color: '#ff4d4f',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
    maxWidth: '80%',
  },
  successMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
    maxWidth: '80%',
  },
};

export default Login;