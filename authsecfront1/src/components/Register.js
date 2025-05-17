import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [message, setMessage] = useState('');
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />
        
        <select 
          style={styles.select}
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ADMIN">Admin</option>
          <option value="STUDENT">Student</option>
          <option value="MANAGER">Manager</option>
        </select>

        <button type="submit" style={styles.button}>Register</button>
        
        {/* Bouton pour revenir au login */}
        <button 
          type="button" 
          style={styles.loginButton}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </form>
      {message && (
        <p style={message.includes('successful') ? styles.successMessage : styles.errorMessage}>
          {message}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '420px',
    margin: '3rem auto',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  title: {
    textAlign: 'center',
    color: '#1a1d23',
    marginBottom: '1rem',
    fontSize: '1.9rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    padding: '13px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
    backgroundColor: '#fff',
    outline: 'none',
  },
  select: {
    padding: '13px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,...")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
    width: '100%',
  },
  buttonHover: {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
  },
  buttonActive: {
    transform: 'translateY(0)',
  },
  secondaryButton: {
    padding: '14px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '1rem',
  },
  message: {
    padding: '14px',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  successMessage: {
    color: '#047857',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
  },
  errorMessage: {
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '2rem',
    fontSize: '0.85rem',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
  },
};


export default Register;