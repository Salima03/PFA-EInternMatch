import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';

const ArticlesList = () => {
    // Les 3 meilleurs articles sélectionnés pour E-InternMatch
    const articles = [
        {
            title: "How AI is Transforming Student-Employer Matching",
            description: "Découvrez comment les algorithmes d'IA modernes optimisent la mise en relation étudiants-entreprises, avec des cas concrets similaires à E-InternMatch.",
            url: "https://hbr.org/2023/05/how-ai-is-transforming-internship-matching",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        },
        {
            title: "The Future of Skill-Based Recruitment Platforms",
            description: "Une analyse des plateformes innovantes qui utilisent le matching par compétences, comme votre solution E-InternMatch.",
            url: "https://www.forbes.com/sites/forbestechcouncil/2023/04/12/the-future-of-recruitment-ai-and-skill-matching/",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        },
        {
            title: "Building GDPR-Compliant Recruitment Tools",
            description: "Guide essentiel pour sécuriser les données des utilisateurs sur les plateformes de matching comme la vôtre.",
            url: "https://gdpr.eu/recruitment-platforms-compliance/",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        },
        {
            title: "How AI is Revolutionizing Internship Matching",
            description: "Discusses AI advancements in optimizing student-company matching processes.",
            url: "https://hbr.org/",
            image: "https://img.freepik.com/free-photo/ai-technology-microchip-background-digital-transformation-concept_53876-124669.jpg"
        },
        {
            title: "The Future of Internship Recruitment: AI and Automation",
            description: "Explores how automated platforms are transforming internship recruitment.",
            url: "https://www.forbes.com/",
            image: "https://imageio.forbes.com/specials-images/imageserve/6827a09a14b4c34b2d7cc428/hired-hand-billionaires-header/0x0.jpg"
        },
        {
            title: "The Rise of Skill-Based Hiring in Internships",
            description: "Emphasizes the importance of skills in modern recruitment.",
            url: "https://www.linkedin.com/business/talent/blog",
            image: "https://img.freepik.com/free-photo/business-people-shaking-hands-together_53876-30568.jpg"
        }
    ];

    const handleReadArticle = (url) => {
        window.open(url, '_blank');
    };

    return (
        <section className="articles-section">
            <div className="section-header">
                <h2>Ressources utiles</h2>
                <p className="section-subtitle">Découvrez nos articles sélectionnés pour vous</p>
            </div>

            <div className="articles-grid">
                {articles.map((article, index) => (
                    <motion.div
                        key={index}
                        className="article-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="article-image-container">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="article-image"
                            />
                        </div>
                        <div className="article-content">
                            <h3>{article.title}</h3>
                            <p className="article-description">{article.description}</p>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="article-link"
                            >
                                <FiExternalLink className="link-icon" />
                                Lire l'article
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
                .articles-section {
                    padding: 5rem 2rem;
                    background: #ffffff;
                }
                
                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .section-header h2 {
                    font-size: 2.2rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                
                .section-subtitle {
                    color: #666;
                    font-size: 1.1rem;
                }
                
                .articles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .article-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }
                
                .article-image-container {
                    height: 200px;
                    overflow: hidden;
                }
                
                .article-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                .article-card:hover .article-image {
                    transform: scale(1.05);
                }
                
                .article-content {
                    padding: 1.5rem;
                }
                
                .article-content h3 {
                    font-size: 1.2rem;
                    margin-bottom: 0.75rem;
                    color: var(--text-color);
                }
                
                .article-description {
                    color: #666;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .article-link {
                    display: inline-flex;
                    align-items: center;
                    color: var(--primary-color);
                    font-weight: 500;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .article-link:hover {
                    color: var(--secondary-color);
                    text-decoration: underline;
                }
                
                .link-icon {
                    margin-right: 0.5rem;
                }
                
                @media (max-width: 768px) {
                    .articles-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .section-header h2 {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default ArticlesList;