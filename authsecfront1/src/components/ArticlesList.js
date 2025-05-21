import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <Container className="my-5">
            <h2 className="text-center mb-4">Ressources stratégiques pour E-InternMatch</h2>
            <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
                {articles.map((article, index) => (
                    <Col key={index} className="d-flex">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Img
                                variant="top"
                                src={article.image}
                                alt={article.title}
                                style={{
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderTopLeftRadius: '0.375rem',
                                    borderTopRightRadius: '0.375rem'
                                }}
                            />
                            <Card.Body className="d-flex flex-column p-4">
                                <Card.Title className="fs-5 mb-3">{article.title}</Card.Title>
                                <Card.Text className="text-muted mb-4">{article.description}</Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => handleReadArticle(article.url)}
                                    className="mt-auto align-self-start px-4 py-2"
                                    style={{ borderRadius: '20px' }}
                                >
                                    <FaExternalLinkAlt className="me-2" />
                                    Consulter
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ArticlesList;