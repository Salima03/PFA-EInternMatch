/*
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

       
        <motion.section
            className="articles-section white-bg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <ArticlesList />
        </motion.section>

        
        <motion.section
            className="courses-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <CourseraCourses />
        </motion.section>

          
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

        
        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 E-InternMatch. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="/terms">Conditions</a>
              <a href="/privacy">Confidentialité</a>
            </div>
          </div>
        </footer>

       
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

       
          .articles-section {
            padding: 6rem 5%;
          }

          .articles-section h2 {
            color: var(--primary-color);
            margin-bottom: 3rem;
            text-align: center;
            font-size: 2.5rem;
          }

        
          .courses-section {
            padding: 4rem 5%;
            background: var(--light-bg);
          }

       
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

     

          .white-bg {
            background: white;
          }

       
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
*/
/*import React, { useEffect } from 'react';
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


<motion.section 
  ref={guideRef}
  className="guide-section"
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
          
        <motion.section 
        className="articles-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        >
        <ArticlesList />
        </motion.section>
       
       <motion.section 
        className="courses-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        >
        <CourseraCourses />
        </motion.section>
   
<motion.section 
  className="combined-section"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="cta-container">
    <h2>Prêt à transformer votre expérience de stage ?</h2>
    <p className="cta-description">
      Rejoignez notre plateforme dès aujourd'hui et découvrez des opportunités personnalisées
    </p>
    <motion.button
      className="btn primary-btn large-btn"
      onClick={() => navigate('/register')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      S'inscrire gratuitement <FiArrowRight className="btn-icon" />
    </motion.button>
  </div>
  
 
    <ContactForm />

</motion.section>

      
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 E-InternMatch. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="/terms">Conditions</a>
            <a href="/privacy">Confidentialité</a>
          
          </div>
        </div>
      </footer>

      
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
        
       
        .hero-section {
          display: flex;
          align-items: center;
          padding: 5rem 5%;
          background: linear-gradient(to right, var(--light-bg) 50%, white 50%);
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
      
.combined-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 3rem 5%;
  background: linear-gradient(to right, var(--primary-color) 50%, white 50%);
}

.cta-container {
  color: white;
  padding-right: 2rem;
}

.cta-container h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.cta-description {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.contact-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}


@media (max-width: 1024px) {
  .combined-section {
    grid-template-columns: 1fr;
    background: var(--primary-color);
  }
  
  .cta-container {
    padding-right: 0;
    text-align: center;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .guide-slider {
    flex-direction: column;
  }
  
  .step-card {
    min-width: auto;
  }
}

.contact-form-modern {
  max-width: 100%;
}

.contact-form-modern .form-group {
  margin-bottom: 1.5rem;
}

.contact-form-modern label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.contact-form-modern input,
.contact-form-modern textarea,
.contact-form-modern select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.contact-form-modern input:focus,
.contact-form-modern textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 143, 0.2);
}

.contact-form-modern button[type="submit"] {
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
}

.contact-form-modern button[type="submit"]:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}
        
       
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
        
        
        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            background: var(--light-bg);
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
          
          .step {
            flex-direction: column;
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .step-number {
            margin-right: 0;
            margin-bottom: 1.5rem;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 1rem;
          }
        }
          .courses-section {
  padding: 4rem 5%;
  background: white;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0;
  list-style: none;
}

.course-card {
  background: var(--light-bg);
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-card a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: block;
}

.course-card a:hover {
  text-decoration: underline;
}
  
.articles-section {
  padding: 6rem 5%;
  background: white;
}

.articles-section h2 {
  color: var(--primary-color);
  margin-bottom: 3rem;
  text-align: center;
  font-size: 2.5rem;
}


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
*/
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
  
  // Animation pour les éléments flottants
  useEffect(() => {
    const floatElements = document.querySelectorAll('.float-animation');
    floatElements.forEach(el => {
      el.style.animation = `float 6s ease-in-out infinite`;
      el.style.animationDelay = `${Math.random() * 2}s`;
    });
  }, []);

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="landing-page">
      {/* Floating background elements */}
      <div className="floating-elements">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="float-animation" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            opacity: 0.1 + Math.random() * 0.3,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* Navbar moderne avec effet glassmorphism */}
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-text">E-InternMatch</span>
        </div>
        <div className="navbar-actions">
          <motion.button 
            className="btn login-btn" 
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogIn className="btn-icon" />
            Connexion
          </motion.button>
          <motion.button 
            className="btn register-btn" 
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUser className="btn-icon" />
            Inscription
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section avec animation parallax */}
      <motion.section 
        ref={heroRef}
        className="hero-section"
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <h1>
            <motion.span 
              className="highlight-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Votre plateforme de <span className="highlight">matching</span> de stages
            </motion.span>
          </h1>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Connectez-vous avec les meilleures opportunités de stage ou trouvez 
            le talent idéal pour votre entreprise grâce à notre algorithme intelligent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button 
              className="btn primary-btn"
              onClick={() => navigate('/register')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 180, 216, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer maintenant <FiArrowRight className="btn-icon" />
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="hero-image-wrapper">
            <img 
              src={dashboardImg} 
              alt="Tableau de bord E-InternMatch" 
              className="hero-image"
            />
            <div className="image-overlay"></div>
          </div>
          <div className="hero-image-decoration"></div>
        </motion.div>
      </motion.section>

      {/* Guide Section avec slider moderne */}
      <motion.section 
        ref={guideRef}
        className="guide-section"
        initial="hidden"
        animate={guideInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2 className="section-title">Comment ça marche</h2>
          <p className="section-subtitle">
            Trois étapes simples pour trouver votre match parfait
          </p>
        </motion.div>
        
        <div className="guide-cards-container">
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
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-image-container">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="step-image" 
                />
                <div className="image-overlay"></div>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="step-decoration"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section avec grille animée */}
      <motion.section 
        ref={featuresRef}
        className="features-section"
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2 className="section-title">Nos fonctionnalités clés</h2>
          <p className="section-subtitle">
            Tout ce dont vous avez besoin pour une expérience optimale
          </p>
        </motion.div>
        
        <div className="features-grid">
          {[
            { icon: <FiSearch size={28} />, text: "Recherche intelligente de stages/étudiants" },
            { icon: <FiCheck size={28} />, text: "Matching algorithmique précis" },
            { icon: <FiMessageSquare size={28} />, text: "Messagerie intégrée sécurisée" },
            { icon: <FiBell size={28} />, text: "Notifications en temps réel" },
            { icon: <FiUser size={28} />, text: "Profils vérifiés" },
            { icon: <FiCheck size={28} />, text: "Tableau de bord complet" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 123, 143, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon-container">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <p>{feature.text}</p>
              <div className="feature-decoration"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Articles Section */}
      <motion.section 
        className="articles-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <ArticlesList />
      </motion.section>

      {/* Courses Section */}
      <motion.section 
        className="courses-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <CourseraCourses />
      </motion.section>

      

      {/* Contact Section moderne */}
      <motion.section 
        className="contact-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <div className="contact-container">
        <ContactForm />
        </div>
      </motion.section>

      {/* Footer moderne */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-text">E-InternMatch</span>
            <p>La plateforme intelligente pour stages et talents</p>
          </div>
     
        <div className="footer-bottom">
          <p>© 2025 E-InternMatch. Tous droits réservés.</p>
          <div className="social-links">
            {/* Icônes de réseaux sociaux */}
          </div>
        </div>
        </div>
      </motion.footer>

      {/* Styles modernisés */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes gradientBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .landing-page {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text-color);
          overflow-x: hidden;
          position: relative;
        }

        /* Variables CSS modernisées */
        :root {
          --primary-color: #007b8f;
          --primary-light: rgba(0, 123, 143, 0.1);
          --secondary-color: #00b4d8;
          --secondary-light: rgba(0, 180, 216, 0.1);
          --light-bg: #f0f9fa;
          --text-color: #2b2d42;
          --text-light: #6c757d;
          --light-text: #f8f9fa;
          --white: #ffffff;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.15);
          --rounded-sm: 8px;
          --rounded-md: 12px;
          --rounded-lg: 16px;
          --rounded-full: 9999px;
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* Floating background elements */
        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .float-animation {
          position: absolute;
          background: var(--primary-color);
          border-radius: var(--rounded-full);
          filter: blur(2px);
          animation: float 6s ease-in-out infinite;
        }

        /* Navbar modernisée avec effet glassmorphism */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .navbar-logo {
          cursor: pointer;
          transition: var(--transition);
        }

        .navbar-logo:hover {
          opacity: 0.9;
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-color);
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-actions {
          display: flex;
          gap: 1rem;
        }

        /* Bouttons modernisés */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: var(--rounded-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          border: none;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
        }

        .btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
          opacity: 0;
          transition: var(--transition);
        }

        .btn:hover::after {
          opacity: 1;
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
          border: 2px solid var(--primary-color);
        }

        .login-btn:hover {
          background: var(--primary-light);
        }

        .register-btn, .primary-btn {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: var(--white);
          box-shadow: var(--shadow-md);
        }

        .register-btn:hover, .primary-btn:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .large-btn {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
        }

        /* Hero Section modernisée */
        .hero-section {
          display: flex;
          align-items: center;
          padding: 8rem 5% 6rem;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          flex: 1;
          padding-right: 3rem;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: 3.2rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          font-weight: 800;
        }

        .highlight {
          position: relative;
          display: inline-block;
        }

        .highlight::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 12px;
          background: rgba(0, 180, 216, 0.3);
          z-index: -1;
          border-radius: 4px;
        }

        .hero-description {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          max-width: 600px;
          color: var(--text-light);
          line-height: 1.6;
        }

        .hero-image-container {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .hero-image-wrapper {
          position: relative;
          border-radius: var(--rounded-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          transform: perspective(1000px) rotateY(-10deg);
        }

        .hero-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.8s ease;
        }

        .hero-image-wrapper:hover .hero-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0, 123, 143, 0.2), transparent);
        }

        .hero-image-decoration {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: var(--secondary-light);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          z-index: -1;
          filter: blur(40px);
          opacity: 0.6;
        }

        /* Guide Section modernisée */
        .guide-section {
          padding: 6rem 5%;
          background: var(--white);
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 800;
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .guide-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .step-card {
          background: var(--white);
          border-radius: var(--rounded-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          position: relative;
          padding-bottom: 2rem;
        }

        .step-card:hover {
          box-shadow: var(--shadow-lg);
        }

        .step-number {
          position: absolute;
          top: -20px;
          left: 20px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: var(--white);
          border-radius: var(--rounded-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: var(--shadow-md);
          z-index: 2;
        }

        .step-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .step-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .step-card:hover .step-image {
          transform: scale(1.1);
        }

        .step-content {
          padding: 1.5rem;
          text-align: center;
        }

        .step-content h3 {
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
          color: var(--primary-color);
        }

        .step-content p {
          color: var(--text-light);
          line-height: 1.6;
        }

        .step-decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
        }

        /* Features Section modernisée */
        .features-section {
          padding: 6rem 5%;
          background: var(--light-bg);
          position: relative;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: var(--white);
          padding: 2.5rem 2rem;
          border-radius: var(--rounded-lg);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon-container {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .feature-icon {
          color: var(--primary-color);
          z-index: 2;
        }

        .feature-icon-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--primary-light);
          border-radius: var(--rounded-full);
          transform: scale(0.8);
          transition: var(--transition);
        }

        .feature-card:hover .feature-icon-container::before {
          transform: scale(1);
        }

        .feature-card p {
          font-size: 1.1rem;
          color: var(--text-color);
          font-weight: 500;
        }

        .feature-decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s ease;
        }

        .feature-card:hover .feature-decoration {
          transform: scaleX(1);
        }

        /* CTA Section modernisée */
        .cta-section {
          padding: 6rem 5%;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          z-index: -1;
          opacity: 0.9;
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          color: var(--white);
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .cta-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        /* Contact Section */
        .contact-section {
          padding: 6rem 5%;
          background: var(--white);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height:100vh;
        }
          .contact-container {
          width:100%;
          padding: 2rem;
          background: var(--white);
          max-width:100vh;
        }

        /* Footer modernisé */
        .footer {
          padding: 4rem 5% 2rem;
          background: var(--text-color);
          color: var(--white);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto 3rem;
        }

        .footer-brand .logo-text {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          display: block;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .link-group {
          margin-bottom: 1.5rem;
        }

        .link-group h4 {
          font-size: 1.2rem;
          margin-bottom: 1.2rem;
          color: var(--white);
          font-weight: 600;
        }

        .link-group a {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.8rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .link-group a:hover {
          color: var(--white);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        /* Articles et Courses Sections */
        .articles-section, .courses-section {
          padding: 6rem 5%;
          background: var(--white);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            padding: 6rem 5% 4rem;
          }

          .hero-content {
            padding-right: 0;
            margin-bottom: 3rem;
          }

          .hero-image-wrapper {
            max-width: 600px;
            margin: 0 auto;
            transform: none;
          }

          .hero-content h1 {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.4rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .navbar-actions {
            gap: 0.5rem;
          }

          .btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .navbar {
            padding: 1rem 5%;
          }

          .logo-text {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;