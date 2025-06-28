import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Badge, Button, Card, Table,
    Form, Modal, Alert, Spinner, Pagination
} from 'react-bootstrap';
import {
    FiAlertTriangle, FiCheck, FiX, FiMessageSquare,
    FiUser, FiRefreshCw
} from 'react-icons/fi';

const SignalementsAdmin = () => {
    // États
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        handled: 'all',
        search: ''
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 10;

    const token = localStorage.getItem('accessToken');

    // Récupérer les signalements
    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReports(response.data);
            setFilteredReports(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    // Marquer comme traité
    const handleMarkAsHandled = async (reportId) => {
        try {
            setActionLoading(true);
            await axios.post(
                `/api/reports/${reportId}/handle`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReports();
            setSuccessMessage('Signalement traité avec succès');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur lors du traitement');
        } finally {
            setActionLoading(false);
        }
    };

    // Fonctions utilitaires
    const getReportTypeBadge = (type) => {
        return type === 'USER' ? (
            <Badge bg="danger" className="d-flex align-items-center">
                <FiUser className="me-1" /> Utilisateur
            </Badge>
        ) : (
            <Badge bg="warning" className="d-flex align-items-center">
                <FiMessageSquare className="me-1" /> Message
            </Badge>
        );
    };

    const getStatusBadge = (handled) => {
        return handled ? (
            <Badge bg="success" className="d-flex align-items-center">
                <FiCheck className="me-1" /> Traité
            </Badge>
        ) : (
            <Badge bg="danger" className="d-flex align-items-center">
                <FiX className="me-1" /> Non traité
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Effets
    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        let result = [...reports];

        // Filtrage par type
        if (filters.type !== 'all') {
            result = result.filter(r => r.type === filters.type.toUpperCase());
        }

        // Filtrage par statut
        if (filters.handled !== 'all') {
            result = result.filter(r => r.handled === (filters.handled === 'handled'));
        }

        // Filtrage par recherche
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(r =>
                r.reason.toLowerCase().includes(searchTerm) ||
                (r.reportedUserEmail?.toLowerCase().includes(searchTerm)) ||
                (r.reporterEmail?.toLowerCase().includes(searchTerm))
            );
        }

        setFilteredReports(result);
        setCurrentPage(1);
    }, [filters, reports]);

    // Pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Messages d'alerte */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <div className="fw-bold">Erreur</div>
                    <div>{error}</div>
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}

            {/* Carte principale */}
            <Card className="shadow-sm mb-4 border-0">
                <Card.Body className="p-4">
                    {/* En-tête */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">
                                <FiAlertTriangle className="me-2" style={{ color: '#dc3545' }} />
                                Gestion des signalements
                            </h4>
                            <p className="text-muted mb-0">
                                {filteredReports.length} signalement(s) trouvé(s)
                            </p>
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={fetchReports}
                            disabled={loading}
                        >
                            <FiRefreshCw className="me-1" />
                            Actualiser
                        </Button>
                    </div>

                    {/* Filtres */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    value={filters.type}
                                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="user">Utilisateurs</option>
                                    <option value="message">Messages</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>Statut</Form.Label>
                                <Form.Select
                                    value={filters.handled}
                                    onChange={(e) => setFilters({...filters, handled: e.target.value})}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="handled">Traités</option>
                                    <option value="unhandled">Non traités</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Recherche</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Rechercher par raison, email..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* Tableau des signalements */}
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Type</th>
                                <th>Raison</th>
                                <th>Signalé par</th>
                                <th>Signalé</th>
                                <th>Signalé le</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentReports.length > 0 ? (
                                currentReports.map((report) => (
                                    <tr key={report.id} className={report.handled ? 'table-light' : ''}>
                                        <td>{getReportTypeBadge(report.type)}</td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={report.reason}>
                                                {report.reason}
                                            </div>
                                        </td>
                                        <td>{report.reporterEmail || 'Anonyme'}</td>
                                        <td>
                                            {report.type === 'USER'
                                                ? report.reportedUserEmail
                                                : report.messageAuthorEmail || 'Message'}
                                        </td>
                                        <td>{formatDate(report.createdAt)}</td>
                                        <td>{getStatusBadge(report.handled)}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Détails
                                            </Button>
                                            {!report.handled && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleMarkAsHandled(report.id)}
                                                    disabled={actionLoading}
                                                >
                                                    {actionLoading ? 'Traitement...' : 'Marquer comme traité'}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Aucun signalement trouvé
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredReports.length > reportsPerPage && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                />
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de détails */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FiAlertTriangle className="me-2" style={{ color: '#dc3545' }} />
                        Détails du signalement
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport && (
                        <div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <h6 className="text-muted">Type</h6>
                                    <p>{getReportTypeBadge(selectedReport.type)}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">Statut</h6>
                                    <p>{getStatusBadge(selectedReport.handled)}</p>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <h6 className="text-muted">Signalé par</h6>
                                    <p>{selectedReport.reporterEmail || 'Anonyme'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">Signalé</h6>
                                    <p>
                                        {selectedReport.type === 'USER'
                                            ? selectedReport.reportedUserEmail
                                            : selectedReport.messageAuthorEmail || 'Message'}
                                    </p>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <h6 className="text-muted">Signalé le</h6>
                                    <p>{formatDate(selectedReport.createdAt)}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-muted">Raison</h6>
                                <div className="p-3 bg-light rounded">
                                    {selectedReport.reason}
                                </div>
                            </div>

                            {selectedReport.type === 'MESSAGE' && (
                                <div className="mb-3">
                                    <h6 className="text-muted">Contenu du message</h6>
                                    <div className="p-3 bg-light rounded">
                                        {selectedReport.messageContent || 'Non disponible'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </Button>
                    {selectedReport && !selectedReport.handled && (
                        <Button
                            variant="success"
                            onClick={() => handleMarkAsHandled(selectedReport.id)}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Traitement...' : 'Marquer comme traité'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SignalementsAdmin;