import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken'); // si nécessaire
      const response = await axios.get('/api/contact/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Supprimer un contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce contact ?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Contact supprimé');
      fetchContacts(); // rafraîchir la liste
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  // Répondre au contact
  const handleReply = (email) => {
    window.location.href = `mailto:${email}`;
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Liste des contacts</h2>
      {contacts.length === 0 ? (
        <p>Aucun contact trouvé.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleReply(contact.email)}
                  >
                    Répondre
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactsManager;