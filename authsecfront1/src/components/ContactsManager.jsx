import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Badge, Button, Card, Table,
  Form, Modal, Alert, Spinner, Pagination
} from 'react-bootstrap';
import { FiMail, FiTrash2, FiRefreshCw, FiFilter, FiXCircle, FiCheckCircle } from 'react-icons/fi';

const ContactsManager = () => {
  // États
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const contactsPerPage = 10;

  // Filtres
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortDate: 'desc'
  });

  const token = localStorage.getItem('accessToken');

  // Charger tous les contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contact/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...contacts];

    // Filtre par terme de recherche
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(contact =>
          contact.fullName.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.message.toLowerCase().includes(term)
      );
    }

    // Tri par date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return filters.sortDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredContacts(result);
    setCurrentPage(1);
  }, [contacts, filters]);

  // Gestion des changements de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      sortDate: 'desc'
    });
  };

  // Pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Supprimer un contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce contact ?')) return;
    try {
      await axios.delete(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Contact supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchContacts();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // Répondre au contact
  const handleReply = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <h4 className="fw-bold mb-0">Gestion des contacts</h4>
                <p className="text-muted mb-0">
                  {filteredContacts.length} contact(s) trouvé(s)
                </p>
              </div>
              <Button
                  variant="outline-primary"
                  onClick={fetchContacts}
                  disabled={loading}
              >
                <FiRefreshCw className="me-1" />
                Actualiser
              </Button>
            </div>

            {/* Barre de filtres */}
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
                        disabled={!filters.searchTerm && filters.sortDate === 'desc'}
                    >
                      <FiXCircle className="me-1" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>

                {showFilters && (
                    <div className="row g-2">
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Rechercher</Form.Label>
                          <Form.Control
                              type="text"
                              placeholder="Rechercher par nom, email ou message..."
                              name="searchTerm"
                              value={filters.searchTerm}
                              onChange={handleFilterChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
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
                    </div>
                )}

                {/* Affichage des filtres actifs */}
                {(filters.searchTerm || filters.sortDate !== 'desc') && (
                    <div className="mt-3">
                      <small className="text-muted">Filtres actifs :</small>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {filters.searchTerm && (
                            <Badge bg="primary" className="d-flex align-items-center">
                              Recherche: {filters.searchTerm}
                              <FiXCircle
                                  className="ms-1 cursor-pointer"
                                  onClick={() => setFilters({...filters, searchTerm: ''})}
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

            {/* Tableau des contacts */}
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentContacts.length > 0 ? (
                    currentContacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>{contact.fullName}</td>
                          <td>{contact.email}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {contact.message.substring(0, 50)}
                              {contact.message.length > 50 && '...'}
                            </div>
                          </td>
                          <td>{formatDate(contact.createdAt)}</td>
                          <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setShowModal(true);
                                }}
                            >
                              Détails
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleReply(contact.email)}
                            >
                              <FiMail className="me-1" />
                              Répondre
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteContact(contact.id)}
                            >
                              <FiTrash2 className="me-1" />
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Aucun contact trouvé
                        {filters.searchTerm && (
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
            {filteredContacts.length > contactsPerPage && (
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
            <Modal.Title>Détails du contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedContact && (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6 className="text-muted">Nom complet</h6>
                      <p>{selectedContact.fullName}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Email</h6>
                      <p>{selectedContact.email}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6 className="text-muted">Date</h6>
                      <p>{formatDate(selectedContact.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-muted">Message complet</h6>
                    <div className="p-3 bg-light rounded">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Fermer
            </Button>
            <Button
                variant="primary"
                onClick={() => {
                  handleReply(selectedContact?.email);
                  setShowModal(false);
                }}
            >
              <FiMail className="me-1" />
              Répondre
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default ContactsManager;