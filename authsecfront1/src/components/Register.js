import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [message, setMessage] = useState('');
  const [isSliding, setIsSliding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/register', {
        email,
        password,
        firstname: firstName,
        lastname: lastName,
        role,
      });
      console.log("Réponse du serveur :", response.data);
      setMessage('Registration successful!');
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSignInClick = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          {/* Colonne droite (formulaire) - en dessous */}
          <div style={styles.rightColumn}>
            <div style={styles.loginContainer}>
              <div style={styles.welcomeSection}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join us to discover amazing opportunities</p>
              </div>
              <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.inputGroup}>
                  <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={styles.input}
                      required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={styles.input}
                      required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                      required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <div style={styles.passwordWrapper}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                        minLength="6"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.togglePassword}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <select
                      style={styles.input}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button type="submit" style={styles.loginButton}>
                  Register
                </button>
              </form>
              {message && (
                  <div style={message.includes('successful') ? styles.successMessage : styles.errorMessage}>
                    {message}
                  </div>
              )}
            </div>
          </div>

          {/* Colonne gauche (bleue) - au-dessus avec z-index */}
          <div style={{
            ...styles.leftColumn,
            background: 'linear-gradient(135deg, #00acc1, #0097a7)',
            transform: isSliding ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 0.5s ease-in-out',
            zIndex: 2
          }}>
            <div style={styles.signupSection}>
              <h2 style={styles.welcomeTitle}>Already Registered?</h2>
              <p style={styles.welcomeText}>Sign in to access your account and continue your journey with us!</p>
              <button
                  onClick={handleSignInClick}
                  style={styles.signupButton}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
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
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'white',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loginContainer: {
    width: '100%',
    maxWidth: '350px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
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
  signupSection: {
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    color: 'white',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  welcomeText: {
    fontSize: '16px',
    marginBottom: '30px',
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '30px',
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
  successMessage: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#fff2f0',
    color: '#ff4d4f',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default Register;