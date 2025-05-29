import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiUser, FiLogIn, FiSearch, FiMessageSquare, FiBell } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CourseraCourses from './CourseraCourses';
import ArticlesList from './ArticlesList';
import ContactForm from './ContactForm';
// URLs d'images temporaires
const dashboardImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
const matchingImg = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
const messagingImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [guideRef, guideInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });


  useEffect(() => {
    if (heroInView) controls.start('visible');
  }, [controls, heroInView]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
      <div className="landing-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-text">E-InternMatch</span>
          </div>
          <div className="navbar-actions">
            <button className="btn login-btn" onClick={() => navigate('/login')}>
              <FiLogIn className="btn-icon" />
              Connexion
            </button>
            <button className="btn register-btn" onClick={() => navigate('/register')}>
              <FiUser className="btn-icon" />
              Inscription
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.section
            ref={heroRef}
            className="hero-section"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={containerVariants}
        >
          <motion.div className="hero-content" variants={itemVariants}>
            <h1>Votre plateforme de <span className="highlight">matching</span> de stages</h1>
            <p className="hero-description">
              Connectez-vous avec les meilleures opportunités de stage ou trouvez
              le talent idéal pour votre entreprise grâce à notre algorithme intelligent.
            </p>
            <motion.button
                className="btn primary-btn"
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Commencer maintenant <FiArrowRight className="btn-icon" />
            </motion.button>
          </motion.div>
          <motion.div
              className="hero-image"
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8 }
                }
              }}
          >
            <img src={dashboardImg} alt="Tableau de bord E-InternMatch" />
          </motion.div>
        </motion.section>

        {/* Guide Section */}
        <motion.section
            ref={guideRef}
            className="guide-section white-bg"
            initial="hidden"
            animate={guideInView ? "visible" : "hidden"}
            variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="section-title">Comment ça marche</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle">
            Trois étapes simples pour trouver votre match parfait
          </motion.p>

          <div className="guide-slider-container">
            <div className="guide-slider">
              {[
                {
                  title: "Créez votre profil",
                  description: "Complétez votre profil étudiant ou entreprise",
                  image: dashboardImg
                },
                {
                  title: "Trouvez des matches",
                  description: "Notre algorithme vous propose les meilleures correspondances",
                  image: matchingImg
                },
                {
                  title: "Connectez-vous",
                  description: "Échangez via notre messagerie sécurisée",
                  image: messagingImg
                }
              ].map((step, index) => (
                  <motion.div
                      key={index}
                      className="step-card"
                      initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-image-container">
                      <img src={step.image} alt={step.title} className="step-image" />
                    </div>
                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
            ref={featuresRef}
            className="features-section"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>Nos fonctionnalités clés</motion.h2>

          <div className="features-grid">
            {[
              { icon: <FiSearch size={24} />, text: "Recherche intelligente de stages/étudiants" },
              { icon: <FiCheck size={24} />, text: "Matching algorithmique précis" },
              { icon: <FiMessageSquare size={24} />, text: "Messagerie intégrée sécurisée" },
              { icon: <FiBell size={24} />, text: "Notifications en temps réel" },
              { icon: <FiUser size={24} />, text: "Profils vérifiés" },
              { icon: <FiCheck size={24} />, text: "Tableau de bord complet" }
            ].map((feature, index) => (
                <motion.div
                    key={index}
                    className="feature-card"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <p>{feature.text}</p>
                </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Articles Section */}
        <motion.section
            className="articles-section white-bg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <ArticlesList />
        </motion.section>

        {/* Courses section */}
        <motion.section
            className="courses-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <CourseraCourses />
        </motion.section>

          {/* Contact Section */}
          <motion.section
              className="contact-section white-bg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
          >
              <div className="contact-container">
                  <ContactForm />
              </div>
          </motion.section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 E-InternMatch. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="/terms">Conditions</a>
              <a href="/privacy">Confidentialité</a>
            </div>
          </div>
        </footer>

        {/* Styles */}
        <style jsx>{`
          :root {
            --primary-color: #007b8f;
            --secondary-color: #00b4d8;
            --light-bg: #e0f2f1;
            --text-color: #2b2d42;
            --light-text: #f8f9fa;
          }

          .landing-page {
            min-height: 100vh;
            font-family: 'Segoe UI', sans-serif;
            color: var(--text-color);
          }

          /* Navbar */
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            background: white;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .navbar-logo {
            cursor: pointer;
          }

          .logo-text {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-color);
          }

          .navbar-actions {
            display: flex;
            gap: 1rem;
          }

          /* Buttons */
          .btn {
            display: flex;
            align-items: center;
            padding: 0.7rem 1.3rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
          }

          .btn-icon {
            margin-left: 0.5rem;
            transition: transform 0.3s ease;
          }

          .btn:hover .btn-icon {
            transform: translateX(3px);
          }

          .login-btn {
            background: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }

          .login-btn:hover {
            background: rgba(0, 123, 143, 0.1);
          }

          .register-btn, .primary-btn {
            background: var(--primary-color);
            color: white;
          }

          .register-btn:hover, .primary-btn:hover {
            background: var(--secondary-color);
          }

          .large-btn {
            padding: 1rem 2rem;
            font-size: 1.1rem;
          }

          /* Hero Section */
          .hero-section {
            display: flex;
            align-items: center;
            padding: 5rem 5%;
            background: var(--light-bg);
          }

          .hero-content {
            flex: 1;
            padding-right: 3rem;
          }

          .hero-content h1 {
            font-size: 2.8rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }

          .highlight {
            color: var(--primary-color);
          }

          .hero-description {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            max-width: 600px;
            opacity: 0.9;
          }

          .hero-image {
            flex: 1;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            transform: perspective(1000px) rotateY(-10deg);
          }

          .hero-image img {
            width: 100%;
            height: auto;
            display: block;
          }

          /* Guide Section Styles */
          .guide-slider-container {
            max-width: 1200px;
            margin: 0 auto;
            overflow: hidden;
          }

          .guide-slider {
            display: flex;
            gap: 2rem;
            padding: 2rem 0;
          }

          .step-card {
            flex: 1;
            min-width: 300px;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
          }

          .step-number {
            width: 40px;
            height: 40px;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-weight: bold;
          }

          .step-image-container {
            width: 200px;
            height: 150px;
            margin: 0 auto 1.5rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }

          .step-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .step-card:hover .step-image {
            transform: scale(1.05);
          }

          .step-content h3 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
          }

          /* Features Section */
          .features-section {
            padding: 6rem 5%;
            background: var(--light-bg);
          }

          .features-section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 4rem;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }

          .feature-icon {
            width: 50px;
            height: 50px;
            background: rgba(0, 123, 143, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
          }

          /* Articles Section */
          .articles-section {
            padding: 6rem 5%;
          }

          .articles-section h2 {
            color: var(--primary-color);
            margin-bottom: 3rem;
            text-align: center;
            font-size: 2.5rem;
          }

          /* Courses Section */
          .courses-section {
            padding: 4rem 5%;
            background: var(--light-bg);
          }

          /* Contact Section */
          .contact-section {
            padding: 6rem 5%;
          }

          .contact-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

        /*  .contact-container.centered {
            display: flex;
            justify-content: center;
          }*/

          /* Background classes */
          .white-bg {
            background: white;
          }

          /* Footer */
          .footer {
            padding: 2rem 5%;
            background: #2b2d42;
            color: white;
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
          }

          .footer-links {
            display: flex;
            gap: 2rem;
          }

          .footer-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }

          .footer-links a:hover {
            opacity: 0.8;
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .hero-section {
              flex-direction: column;
              text-align: center;
            }

            .hero-content {
              padding-right: 0;
              margin-bottom: 3rem;
            }

            .hero-image {
              max-width: 600px;
              margin: 0 auto;
            }
          }

          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 2.2rem;
            }

            .guide-slider {
              flex-direction: column;
            }

            .step-card {
              min-width: auto;
            }

            .footer-content {
              flex-direction: column;
              gap: 1rem;
            }
          }

          /* Adaptation pour intégrer Bootstrap avec Emotion */
          :global(.card) {
            border: none !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          :global(.card:hover) {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          }

          :global(.btn-primary) {
            background-color: var(--primary-color) !important;
            border-color: var(--primary-color) !important;
          }

          :global(.btn-primary:hover) {
            background-color: var(--secondary-color) !important;
            border-color: var(--secondary-color) !important;
          }
        `}</style>
      </div>
  );
};

export default LandingPage;