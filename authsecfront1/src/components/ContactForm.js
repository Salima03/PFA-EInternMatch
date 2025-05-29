import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
const ContactForm = ({onClose}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Le nom complet est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Veuillez entrer un email valide';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Solution finale: Utilisation d'une instance Axios complètement indépendante
            const contactAxios = axios.create({
                baseURL: 'http://localhost:1217',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Suppression explicite de tout header d'autorisation
            delete contactAxios.defaults.headers.common['Authorization'];

            const response = await contactAxios.post('/api/contact', formData);

            setAlertMessage('Votre message a été envoyé avec succès !');
            setAlertType('success');
            setFormData({
                fullName: '',
                email: '',
                subject: '',
                message: ''
            });

            setTimeout(() => navigate('/'), 3000);

        } catch (error) {
            console.error('Erreur complète:', error);
            setAlertMessage(error.response?.data?.message ||
                "Erreur lors de l'envoi du message. Veuillez réessayer.");
            setAlertType('danger');
        } finally {
            setIsSubmitting(false);
            setShowAlert(true);
        }
    };

    return (
        <motion.div
            className="contact-form-modern"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="form-title">Contactez notre équipe</h3>
            <p className="form-subtitle">Nous répondrons dans les plus brefs délais</p>

            {showAlert && (
                <div className={`alert ${alertType}`}>
                    {alertMessage}
                    <button onClick={() => setShowAlert(false)}>×</button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">
                        <FiUser className="input-icon" />
                        Nom complet
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <FiMail className="input-icon" />
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="subject">
                        <FiMessageSquare className="input-icon" />
                        Sujet
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Objet de votre message"
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="message">Votre message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre demande en détail..."
                    ></textarea>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                >
                    <FiSend className="btn-icon" />
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </motion.button>
            </form>

            <style jsx>{`
                .contact-form-modern {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 123, 143, 0.1);
                }
                
                .form-title {
                    font-size: 1.8rem;
                    color: var(--primary-color);
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
                
                .form-subtitle {
                    color: #666;
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-group label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--text-color);
                }
                
                .input-icon {
                    margin-right: 0.5rem;
                    color: var(--primary-color);
                }
                
                input, textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                
                textarea {
                    min-height: 150px;
                    resize: vertical;
                }
                
                input:focus, textarea:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(0, 123, 143, 0.2);
                }
                
                .error-message {
                    color: #e53e3e;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                
                .submit-btn {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .submit-btn:hover {
                    background: var(--secondary-color);
                }
                
                .submit-btn:disabled {
                    background: #cccccc;
                    cursor: not-allowed;
                }
                
                .btn-icon {
                    margin-right: 0.5rem;
                }
                
                .alert {
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .alert.success {
                    background: #f0fff4;
                    color: #2f855a;
                    border: 1px solid #c6f6d5;
                }
                
                .alert.danger {
                    background: #fff5f5;
                    color: #c53030;
                    border: 1px solid #fed7d7;
                }
                
                .alert button {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
            `}</style>
        </motion.div>
    );
};

export default ContactForm;

