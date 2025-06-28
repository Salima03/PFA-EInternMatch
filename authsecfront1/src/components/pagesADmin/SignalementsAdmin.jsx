import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Badge, Button, Card, Table,
    Form, Modal, Alert, Spinner, Pagination
} from 'react-bootstrap';
import {
    FiAlertTriangle, FiCheck, FiX, FiMessageSquare,
    FiUser, FiRefreshCw, FiFilter, FiXCircle, FiCopy
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
        search: '',
        sortDate: 'desc'
    });
    const [showFilters, setShowFilters] = useState(false);
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

    // Copier l'email
    const copyEmail = (email) => {
        if (!email) return;
        navigator.clipboard.writeText(email);
        setSuccessMessage('Email copié dans le presse-papier');
        setTimeout(() => setSuccessMessage(''), 2000);
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

    // Gestion des filtres
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            type: 'all',
            handled: 'all',
            search: '',
            sortDate: 'desc'
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

        // Tri par date
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return filters.sortDate === 'asc' ? dateA - dateB : dateB - dateA;
        });

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

                    {/* Section de filtres améliorée */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <FiFilter className="me-2" />
                                    Filtres
                                </h5>
                                <div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        {showFilters ? 'Masquer' : 'Afficher'} les filtres
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={resetFilters}
                                        disabled={
                                            filters.type === 'all' &&
                                            filters.handled === 'all' &&
                                            !filters.search &&
                                            filters.sortDate === 'desc'
                                        }
                                    >
                                        <FiXCircle className="me-1" />
                                        Réinitialiser
                                    </Button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="row g-2">
                                    <div className="col-md-3">
                                        <Form.Group>
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select
                                                name="type"
                                                value={filters.type}
                                                onChange={handleFilterChange}
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
                                                name="handled"
                                                value={filters.handled}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="all">Tous les statuts</option>
                                                <option value="handled">Traités</option>
                                                <option value="unhandled">Non traités</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-2">
                                        <Form.Group>
                                            <Form.Label>Trier par date</Form.Label>
                                            <Form.Select
                                                name="sortDate"
                                                value={filters.sortDate}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="desc">Plus récents</option>
                                                <option value="asc">Plus anciens</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Group>
                                            <Form.Label>Recherche</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="search"
                                                placeholder="Rechercher par raison, email..."
                                                value={filters.search}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </div>


                                </div>
                            )}

                            {/* Affichage des filtres actifs */}
                            {(filters.type !== 'all' || filters.handled !== 'all' || filters.search || filters.sortDate !== 'desc') && (
                                <div className="mt-3">
                                    <small className="text-muted">Filtres actifs :</small>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        {filters.type !== 'all' && (
                                            <Badge bg="primary" className="d-flex align-items-center">
                                                Type: {filters.type === 'user' ? 'Utilisateurs' : 'Messages'}
                                                <FiXCircle
                                                    className="ms-1 cursor-pointer"
                                                    onClick={() => setFilters({...filters, type: 'all'})}
                                                />
                                            </Badge>
                                        )}
                                        {filters.handled !== 'all' && (
                                            <Badge bg="primary" className="d-flex align-items-center">
                                                Statut: {filters.handled === 'handled' ? 'Traités' : 'Non traités'}
                                                <FiXCircle
                                                    className="ms-1 cursor-pointer"
                                                    onClick={() => setFilters({...filters, handled: 'all'})}
                                                />
                                            </Badge>
                                        )}
                                        {filters.search && (
                                            <Badge bg="primary" className="d-flex align-items-center">
                                                Recherche: {filters.search}
                                                <FiXCircle
                                                    className="ms-1 cursor-pointer"
                                                    onClick={() => setFilters({...filters, search: ''})}
                                                />
                                            </Badge>
                                        )}
                                        {filters.sortDate !== 'desc' && (
                                            <Badge bg="primary" className="d-flex align-items-center">
                                                Tri: {filters.sortDate === 'asc' ? 'Anciens' : 'Récents'}
                                                <FiXCircle
                                                    className="ms-1 cursor-pointer"
                                                    onClick={() => setFilters({...filters, sortDate: 'desc'})}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
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
                                        <td>
                                            {report.reporterEmail ? (
                                                <div className="d-flex align-items-center">
                                                    {report.reporterEmail}
                                                    <FiCopy
                                                        className="ms-2 cursor-pointer"
                                                        onClick={() => copyEmail(report.reporterEmail)}
                                                        size={14}
                                                    />
                                                </div>
                                            ) : 'Anonyme'}
                                        </td>
                                        <td>
                                            {report.type === 'USER' ? (
                                                report.reportedUserEmail ? (
                                                    <div className="d-flex align-items-center">
                                                        {report.reportedUserEmail}
                                                        <FiCopy
                                                            className="ms-2 cursor-pointer"
                                                            onClick={() => copyEmail(report.reportedUserEmail)}
                                                            size={14}
                                                        />
                                                    </div>
                                                ) : 'Utilisateur'
                                            ) : report.messageAuthorEmail ? (
                                                <div className="d-flex align-items-center">
                                                    {report.messageAuthorEmail}
                                                    <FiCopy
                                                        className="ms-2 cursor-pointer"
                                                        onClick={() => copyEmail(report.messageAuthorEmail)}
                                                        size={14}
                                                    />
                                                </div>
                                            ) : 'Message'}
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
                                        {(filters.type !== 'all' || filters.handled !== 'all' || filters.search) && (
                                            <div className="mt-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={resetFilters}
                                                >
                                                    Réinitialiser les filtres
                                                </Button>
                                            </div>
                                        )}
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
                                    <p>
                                        {selectedReport.reporterEmail ? (
                                            <div className="d-flex align-items-center">
                                                {selectedReport.reporterEmail}
                                                <FiCopy
                                                    className="ms-2 cursor-pointer"
                                                    onClick={() => copyEmail(selectedReport.reporterEmail)}
                                                    size={14}
                                                />
                                            </div>
                                        ) : 'Anonyme'}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">Signalé</h6>
                                    <p>
                                        {selectedReport.type === 'USER' ? (
                                            selectedReport.reportedUserEmail ? (
                                                <div className="d-flex align-items-center">
                                                    {selectedReport.reportedUserEmail}
                                                    <FiCopy
                                                        className="ms-2 cursor-pointer"
                                                        onClick={() => copyEmail(selectedReport.reportedUserEmail)}
                                                        size={14}
                                                    />
                                                </div>
                                            ) : 'Utilisateur'
                                        ) : selectedReport.messageAuthorEmail ? (
                                            <div className="d-flex align-items-center">
                                                {selectedReport.messageAuthorEmail}
                                                <FiCopy
                                                    className="ms-2 cursor-pointer"
                                                    onClick={() => copyEmail(selectedReport.messageAuthorEmail)}
                                                    size={14}
                                                />
                                            </div>
                                        ) : 'Message'}
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