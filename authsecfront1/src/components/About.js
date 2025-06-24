import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import { FaBullseye, FaChartLine, FaHandshake, FaUsers, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdDiversity3 } from 'react-icons/md';
import { IoMdRocket } from 'react-icons/io';

// Importez vos images locales
import assia from '../assets/assia.jpg';
import salma from '../assets/salma.PNG';
import salima from '../assets/salima.jpg';
import hamouda from '../assets/hamouda.jpg';

const About = () => {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const teamMembers = [
      {
      name: 'Assia DERFOUFI',
      role: 'Fullstack Developer/UX Designer',
      photo: assia,
      linkedin: 'https://www.linkedin.com/in/assia-derfoufi/',
      github: 'https://github.com/assia-der',
      email: 'derfoufi.assia@gmail.com'
    },
    {
      name: 'Mohammed Admi',
      role: 'Fullstack Developer/ Database & System Design',
      photo: hamouda,
      linkedin: 'https://www.linkedin.com/in/mohammed-admi/',
      github: 'https://github.com/AdmiMohamme',
      email: 'Mohammed.admi23@ump.ac.ma'
    },
    {
      name: 'Salma Chtioui',
      role: 'Fullstack Developer/ Problem Solving',
      photo: salma,
      linkedin: 'https://www.linkedin.com/in/salma-chtioui',
      github: 'https://github.com/salmachtioui12',
      email: 'chtiouisalma790@gmail.com'
    },
    {
      name: 'Salima Elqartit',
      role: 'Fullstack Developer/AI Integration & Plateform Config',
      photo: salima,
      linkedin: 'https://linkedin.com/in/salima-elqartit',
      github: 'https://github.com/Salima03',
      email: 'salma.elqartit23@ump.ac.ma'
    },
  ];

  return (
    <div className="about-page">
      <Sidebar />
      
      <main className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-container">
            <h1>Notre Plateforme <span>E-InternMatch</span></h1>
            <p>La solution innovante pour connecter talents et entreprises</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="about-sections">
          {/* Présentation */}
          <section className="about-section">
            <div className="section-header">
              <IoMdRocket className="section-icon" />
              <h2>Qu'est-ce que E-InternMatch ?</h2>
            </div>
            <p>
              E-InternMatch révolutionne la recherche de stages en créant des connexions intelligentes entre étudiants 
              ambitieux et entreprises innovantes. Notre plateforme utilise des algorithmes avancés pour matcher 
              les compétences, aspirations et cultures d'entreprise.
            </p>
          </section>

          {/* Avantages */}
          <section className="about-section">
            <div className="section-header">
              <FaChartLine className="section-icon" />
              <h2>Nos Avantages Clés</h2>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <MdDiversity3 />
                </div>
                <h3>Diversité</h3>
                <p>
                  Accès à un réseau diversifié d'entreprises et de talents à travers différents secteurs
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaHandshake />
                </div>
                <h3>Efficacité</h3>
                <p>
                  Processus de recrutement simplifié avec des outils dédiés pour chaque partie
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaBullseye />
                </div>
                <h3>Précision</h3>
                <p>
                  Matching algorithmique pour des propositions pertinentes des deux côtés
                </p>
              </div>
            </div>
          </section>

          {/* Objectifs */}
          <section className="about-section">
            <div className="section-header">
              <FaBullseye className="section-icon" />
              <h2>Nos Objectifs</h2>
            </div>
            <ul className="goals-list">
              <li>
                <span>Réduire le fossé</span> entre le monde académique et professionnel
              </li>
              <li>
                <span>Faciliter l'accès</span> à des opportunités de stage qualitatives
              </li>
              <li>
                <span>Optimiser le temps</span> de recrutement pour les entreprises
              </li>
              <li>
                <span>Créer des relations</span> durables entre talents et employeurs
              </li>
            </ul>
          </section>

          {/* Équipe */}
          <section className="about-section">
            <div className="section-header">
              <FaUsers className="section-icon" />
              <h2>Notre Équipe</h2>
            </div>
            <p>
              Une équipe passionnée réunissant expertise technique et connaissance du marché du travail
            </p>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <img src={member.photo} alt={member.name} className="team-photo" />
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <div className="social-links">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub />
                    </a>
                    <div 
                      className="email-tooltip" 
                      onClick={() => copyToClipboard(member.email)}
                    >
                      <FaEnvelope />
                      <span className="tooltip">
                        {copiedEmail === member.email ? 'Copié!' : member.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* CSS */}
      <style jsx>{`
        /* Variables CSS */
        :root {
          --primary: #007b8f;
          --primary-light: #c0e7eb;
          --secondary: #e0f2f1;
          --accent: #ffd166;
          --dark: #1e1e1e;
          --light: #ffffff;
          --gray: #6c757d;
          --light-gray: #f8f9fa;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Base Styles */
        .about-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: var(--dark);
          background-color: var(--light-gray);
        }

        .about-content {
          flex: 1;
          padding: 1rem;
          margin-left: 0;
          transition: var(--transition);
        }

        /* Hero Section */
        .about-hero {
          background: linear-gradient(135deg, var(--primary), #0099ad);
          color: white;
          padding: 2rem 1rem;
          border-radius: 0 0 20px 20px;
          margin-bottom: 2rem;
          text-align: center;
          box-shadow: var(--shadow);
        }

        .about-hero h1 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .about-hero h1 span {
          color: var(--accent);
        }

        .about-hero p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Sections */
        .about-sections {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .about-section {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .about-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .section-icon {
          font-size: 1.8rem;
          margin-right: 1rem;
        }

        .about-section h2 {
          font-size: 1.5rem;
          margin: 0;
          color: var(--primary);
        }

        .about-section p {
          color: var(--gray);
          margin-bottom: 1rem;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .feature-card {
          padding: 1.5rem;
          border-radius: 8px;
          background: var(--light-gray);
          transition: var(--transition);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: white;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        /* Goals List */
        .goals-list {
          list-style: none;
          padding: 0;
        }

        .goals-list li {
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--primary-light);
          position: relative;
          padding-left: 2rem;
        }

        .goals-list li:before {
          content: '•';
          color: var(--primary);
          font-size: 1.5rem;
          position: absolute;
          left: 0;
          top: 0.5rem;
        }

        .goals-list span {
          font-weight: 600;
          color: var(--primary);
        }

        /* Team Grid */
        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .team-card {
          text-align: center;
          padding: 1.5rem;
          background: var(--light-gray);
          border-radius: 10px;
          transition: var(--transition);
        }

        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .team-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--primary-light);
          margin-bottom: 1rem;
          transition: var(--transition);
        }

        .team-card:hover .team-photo {
          border-color: var(--primary);
          transform: scale(1.05);
        }

        .team-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .role {
          color: var(--gray);
          margin-bottom: 1rem;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .social-links a, .email-tooltip {
          color: var(--gray);
          font-size: 1.3rem;
          transition: var(--transition);
          cursor: pointer;
        }

        .social-links a:hover, .email-tooltip:hover {
          color: var(--primary);
          transform: translateY(-3px);
        }

        .email-tooltip {
          position: relative;
        }

        .tooltip {
          visibility: hidden;
          width: 120px;
          background: var(--primary);
          color: white;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.8rem;
        }

        .email-tooltip:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }

        /* Media Queries */
        @media (min-width: 576px) {
          .about-content {
            padding: 1.5rem;
          }
          
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 768px) {
          .about-content {
            margin-left: 250px;
            padding: 2rem;
          }
          
          .about-hero {
            padding: 3rem 2rem;
            border-radius: 0 0 30px 30px;
          }
          
          .about-hero h1 {
            font-size: 2.2rem;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 992px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .about-section {
            padding: 2rem;
          }
          
          .about-hero h1 {
            font-size: 2.5rem;
          }
        }

        @media (min-width: 1200px) {
          .about-content {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;