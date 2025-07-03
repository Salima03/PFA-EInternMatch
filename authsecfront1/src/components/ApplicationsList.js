/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from './api1';//
import Sidebar from '../layout/Sidebar';

const ApplicationsList = () => {
  const { offerId } = useParams();
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("accessToken");
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, "_");


  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/applications/${offerId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Erreur récupération candidatures :", err);
    }
  };


  const handleViewCv = async (filename) => {
    try {
      const response = await api.get(`/pdf/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Erreur lors de l'ouverture du CV :", error);
    }
  };

  

  const handleDecision = async (appId, decision) => {
    try {
      await api.post(`/applications/applications/${appId}/${decision}`);
      fetchApplications();
    } catch (err) {
      console.error(`Erreur lors de l'action ${decision}`, err);
    }
  };
  

  useEffect(() => {
    fetchApplications();
  }, [offerId]);


 return (
    <div className="layout">
      <Sidebar />
      <main className="page-content" style={styles.page}>
        <h2 style={styles.title}>Candidatures pour l'offre {offerId}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>CV</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>
                  {app.offer && app.student?.user && (
                    <button
                      onClick={() =>
                        handleViewCv(
                          `${sanitize(app.offer.title)}_${sanitize(app.student.user.lastname)}_${sanitize(app.student.user.firstname)}.pdf`
                        )
                      }
                      style={styles.cvButton}
                    >
                      📄 View CV
                    </button>
                  )}
                  </td>
                       <td style={styles.td}>
  {app.status === "PENDING" && (
    <span style={{...styles.statusBadge, ...styles.statusPending}}>
      En attente
    </span>
  )}
  {app.status === "ACCEPTED" && (
    <span style={{...styles.statusBadge, ...styles.statusAccepted}}>
      Acceptée
    </span>
  )}
  {app.status === "REJECTED" && (
    <span style={{...styles.statusBadge, ...styles.statusRejected}}>
      Refusée
    </span>
  )}
</td>

                <td style={styles.td}>
                  <button onClick={() => handleDecision(app.id, 'accept')} style={styles.acceptBtn}> Accepter</button>
                  <button onClick={() => handleDecision(app.id, 'reject')} style={styles.rejectBtn}> Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ApplicationsList;


const styles = {
  page: {
    backgroundColor: '#ffff',
    padding: '40px 30px',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#007b8f',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#e0f2f1',
    color: '#007b8f',
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '2px solid #d0f0f3',
    borderRight: '1px solid #d0f0f3',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#2d3748',
    borderBottom: '1px solid #e0f2f1',
    borderRight: '1px solid #e0f2f1',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  cvButton: {
    background: 'transparent',
    color: '#007b8f',
    border: '1px solid #007b8f',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#007b8f',
      color: '#fff',
    },
  },
  acceptBtn: {
    background: 'transparent',
    color: '#10b981',
    border: '1px solid #10b981',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#10b981',
      color: '#fff',
    },
  },
  rejectBtn: {
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ef4444',
      color: '#fff',
    },
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
    background: 'transparent',
  },
  statusPending: {
    color: '#d97706',
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  statusAccepted: {
    color: '#059669',
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    color: '#dc2626',
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
};*/
 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from './api1';
import Sidebar from '../layout/Sidebar';

const ApplicationsList = () => {
  const { offerId } = useParams();
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 1;
  const [filter, setFilter] = useState('PENDING');
  const token = localStorage.getItem("accessToken");

  const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, "_");

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/applications/${offerId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Erreur récupération candidatures :", err);
    }
  };

  const handleViewCv = async (filename) => {
    try {
      const response = await api.get(`/pdf/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Erreur lors de l'ouverture du CV :", error);
    }
  };

  const handleDecision = async (appId, decision) => {
    try {
      await api.post(`/applications/applications/${appId}/${decision}`);
      fetchApplications();
    } catch (err) {
      console.error(`Erreur lors de l'action ${decision}`, err);
    }
  };

  const handleDelete = async (appId) => {
    try {
      await api.delete(`/applications/applications/${appId}`);
      fetchApplications();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [offerId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredApplications = applications.filter(app => app.status === filter);

  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApp, indexOfLastApp);

  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  return (
    <div className="layout">
      <Sidebar />
      <main className="page-content" style={styles.page}>
        <h2 style={styles.title}>Candidatures </h2>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setFilter('PENDING')}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === 'PENDING' ? '#007b8f' : styles.filterBtn.backgroundColor,
              color: filter === 'PENDING' ? 'white' : styles.filterBtn.color,
              borderColor: filter === 'PENDING' ? '#007b8f' : styles.filterBtn.borderColor,
            }}
          >
            En attente
          </button>

          <button
            onClick={() => setFilter('ACCEPTED')}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === 'ACCEPTED' ? '#10b981' : styles.filterBtn.backgroundColor,
              color: filter === 'ACCEPTED' ? 'white' : styles.filterBtn.color,
              borderColor: filter === 'ACCEPTED' ? '#10b981' : styles.filterBtn.borderColor,
            }}
          >
            Acceptées
          </button>

          <button
            onClick={() => setFilter('REJECTED')}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === 'REJECTED' ? '#ef4444' : styles.filterBtn.backgroundColor,
              color: filter === 'REJECTED' ? 'white' : styles.filterBtn.color,
              borderColor: filter === 'REJECTED' ? '#ef4444' : styles.filterBtn.borderColor,
            }}
          >
            Refusées
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>CV</th>
              <th style={styles.th}>Statut</th>
              {filter !== 'ACCEPTED' && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentApplications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>
                  {app.offer && app.student?.user && (
                    <button
                      onClick={() =>
                        handleViewCv(
                          `${sanitize(app.offer.title)}_${sanitize(app.student.user.lastname)}_${sanitize(app.student.user.firstname)}.pdf`
                        )
                      }
                      style={styles.cvButton}
                    >
                      📄 View CV
                    </button>
                  )}
                </td>
                <td style={styles.td}>
                  {app.status === "PENDING" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusPending }}>En attente</span>
                  )}
                  {app.status === "ACCEPTED" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusAccepted }}>Acceptée</span>
                  )}
                  {app.status === "REJECTED" && (
                    <span style={{ ...styles.statusBadge, ...styles.statusRejected }}>Refusée</span>
                  )}
                </td>
                {filter !== 'ACCEPTED' && (
                  <td style={styles.td}>
                    {app.status === "PENDING" && (
                      <>
                        <button onClick={() => handleDecision(app.id, 'accept')} style={styles.acceptBtn}>Accepter</button>
                        <button onClick={() => handleDecision(app.id, 'reject')} style={styles.rejectBtn}>Refuser</button>
                      </>
                    )}
                    {app.status === "REJECTED" && (
                      <button onClick={() => handleDelete(app.id)} style={styles.deleteBtn}>Supprimer</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  margin: '0 5px',
                  padding: '8px 12px',
                  border: '1px solid #007b8f',
                  borderRadius: '6px',
                  backgroundColor: currentPage === index + 1 ? '#007b8f' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#007b8f',
                  cursor: 'pointer'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default ApplicationsList;




















const styles = {
  page: {
    backgroundColor: '#ffff',
    padding: '40px 30px',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#007b8f',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#e0f2f1',
    color: '#007b8f',
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '2px solid #d0f0f3',
    borderRight: '1px solid #d0f0f3',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#2d3748',
    borderBottom: '1px solid #e0f2f1',
    borderRight: '1px solid #e0f2f1',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  cvButton: {
    background: 'transparent',
    color: '#007b8f',
    border: '1px solid #007b8f',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#007b8f',
      color: '#fff',
    },
  },
  acceptBtn: {
    background: 'transparent',
    color: '#10b981',
    border: '1px solid #10b981',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#10b981',
      color: '#fff',
    },
  },
  rejectBtn: {
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ef4444',
      color: '#fff',
    },
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
    background: 'transparent',
  },
  statusPending: {
    color: '#d97706',
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  statusAccepted: {
    color: '#059669',
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    color: '#dc2626',
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },

  filterBtn: {
    padding: '10px 20px',
    margin: '0 8px',
    backgroundColor: '#f1f5f9',         // Gris clair
    border: '1px solid #cbd5e1',        // Gris border
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0f172a',                   // Bleu foncé
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },

  

};