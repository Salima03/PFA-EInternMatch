import React from 'react';
import Sidebar from '../layout/Sidebar';
import { FaBullseye, FaChartLine, FaHandshake, FaUsers, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdDiversity3 } from 'react-icons/md';
import { IoMdRocket } from 'react-icons/io';

const About = () => {
  // Données de l'équipe
  const teamMembers = [
    {
      name: 'Mohammed Admi',
      role: 'Fullstack Developer',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Assia Derfoufi',
      role: 'Fullstack Developer',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Salma Chtioui',
      role: 'fullstack Developper',
      photo: 'https://randomuser.me/api/portraits/men/75.jpg',
      linkedin: '#',
      github: '#'
    },
      {
      name: 'Salima Elqartit',
      role: 'fullstack Developper',
      photo: 'https://randomuser.me/api/portraits/men/75.jpg',
      linkedin: '#',
      github: '#'
    },
  ];

  return (
    <div style={styles.appContainer}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Notre Plateforme <span style={styles.highlight}>E-InternMatch</span></h1>
          <p style={styles.heroSubtitle}>La solution innovante pour connecter talents et entreprises</p>
        </div>

        <div style={styles.contentContainer}>
          {/* Section Présentation */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <IoMdRocket style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Qu'est-ce que E-InternMatch ?</h2>
            </div>
            <p style={styles.sectionText}>
              E-InternMatch révolutionne la recherche de stages en créant des connexions intelligentes entre étudiants 
              ambitieux et entreprises innovantes. Notre plateforme utilise des algorithmes avancés pour matcher 
              les compétences, aspirations et cultures d'entreprise.
            </p>
          </section>

          {/* Section Avantages */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <FaChartLine style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Nos Avantages Clés</h2>
            </div>
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIconBox}>
                  <MdDiversity3 style={styles.featureIcon} />
                </div>
                <h3 style={styles.featureTitle}>Diversité</h3>
                <p style={styles.featureText}>
                  Accès à un réseau diversifié d'entreprises et de talents à travers différents secteurs
                </p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIconBox}>
                  <FaHandshake style={styles.featureIcon} />
                </div>
                <h3 style={styles.featureTitle}>Efficacité</h3>
                <p style={styles.featureText}>
                  Processus de recrutement simplifié avec des outils dédiés pour chaque partie
                </p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIconBox}>
                  <FaBullseye style={styles.featureIcon} />
                </div>
                <h3 style={styles.featureTitle}>Précision</h3>
                <p style={styles.featureText}>
                  Matching algorithmique pour des propositions pertinentes des deux côtés
                </p>
              </div>
            </div>
          </section>

          {/* Section Objectifs */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <FaBullseye style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Nos Objectifs</h2>
            </div>
            <ul style={styles.goalsList}>
              <li style={styles.goalItem}>
                <span style={styles.goalHighlight}>Réduire le fossé</span> entre le monde académique et professionnel
              </li>
              <li style={styles.goalItem}>
                <span style={styles.goalHighlight}>Faciliter l'accès</span> à des opportunités de stage qualitatives
              </li>
              <li style={styles.goalItem}>
                <span style={styles.goalHighlight}>Optimiser le temps</span> de recrutement pour les entreprises
              </li>
              <li style={styles.goalItem}>
                <span style={styles.goalHighlight}>Créer des relations</span> durables entre talents et employeurs
              </li>
            </ul>
          </section>

          {/* Section Équipe */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <FaUsers style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Notre Équipe</h2>
            </div>
            <p style={styles.sectionText}>
              Une équipe passionnée réunissant expertise technique et connaissance du marché du travail
            </p>
            
            <div style={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <div key={index} style={styles.teamCard}>
                  <img src={member.photo} alt={member.name} style={styles.teamPhoto} />
                  <h3 style={styles.teamName}>{member.name}</h3>
                  <p style={styles.teamRole}>{member.role}</p>
                  <div style={styles.socialLinks}>
                    <a href={member.linkedin} style={styles.socialLink}>
                      <FaLinkedin />
                    </a>
                    <a href={member.github} style={styles.socialLink}>
                      <FaGithub />
                    </a>
                    <a href={`mailto:${member.email}`} style={styles.socialLink}>
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Styles modernes avec CSS-in-JS
const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    marginLeft: '240px', // Correspond à la largeur de votre sidebar
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, #007b8f 0%, #00b4d8 100%)',
    borderRadius: '12px',
    color: 'white',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  highlight: {
    color: '#ffd700',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    opacity: '0.9',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    color: '#007b8f',
  },
  sectionIcon: {
    fontSize: '1.5rem',
    marginRight: '0.75rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
  },
  sectionText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#4a5568',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  featureCard: {
    padding: '1.5rem',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
  },
  featureIconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007b8f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: 'white',
  },
  featureIcon: {
    fontSize: '1.25rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#2d3748',
  },
  featureText: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#4a5568',
  },
  goalsList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  goalItem: {
    fontSize: '1.1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    ':before': {
      content: '"•"',
      color: '#007b8f',
      fontWeight: 'bold',
      display: 'inline-block',
      width: '1em',
      marginLeft: '-1em',
    },
  },
  goalHighlight: {
    fontWeight: '600',
    color: '#007b8f',
    marginRight: '0.5rem',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  teamCard: {
    textAlign: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  teamPhoto: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem',
    border: '4px solid #007b8f',
  },
  teamName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    color: '#2d3748',
  },
  teamRole: {
    fontSize: '1rem',
    color: '#4a5568',
    marginBottom: '1rem',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  socialLink: {
    color: '#007b8f',
    fontSize: '1.25rem',
    transition: 'color 0.3s ease',
    ':hover': {
      color: '#00b4d8',
    },
  },
};

export default About;