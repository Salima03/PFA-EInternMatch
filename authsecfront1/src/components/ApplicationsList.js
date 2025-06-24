import React, { useEffect, useState } from 'react';
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

 /* return (
       <div className="layout">
    <Sidebar />
    <main className="page-content">
    <div>
      <h2>Candidatures pour l'offre {offerId}</h2>
      {applications.map(app => (
        <div key={app.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          {app.offer && app.student && app.student.user && (
  <button
    onClick={() =>
      handleViewCv(
        `${sanitize(app.offer.title)}_${sanitize(app.student.user.lastname)}_${sanitize(app.student.user.firstname)}.pdf`
      )
    }
  >
    📄 Voir le CV
  </button>
)}

          <p><strong>Status :</strong> {app.status}</p>
          <button onClick={() => handleDecision(app.id, 'accept')}>✅ Accepter</button>
          <button onClick={() => handleDecision(app.id, 'reject')}>❌ Refuser</button>
        </div>
      ))}
    </div>
    </main>
    </div>
  );
};

export default ApplicationsList;*/
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

/*
const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    padding: '40px 30px',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '40px',
    color: '#2d3748',
    textAlign: 'center',
    background: 'linear-gradient(90deg, #007b8f, #00acc1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 15px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#007b8f',
    color: '#ffffff',
    textAlign: 'left',
    padding: '18px 24px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    border: 'none',
  },
  td: {
    backgroundColor: '#ffffff',
    padding: '20px 24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontSize: '15px',
    color: '#2d3748',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.03)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
    },
  },
  cvButton: {
    background: 'linear-gradient(45deg, #007b8f, #00acc1)',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 10px rgba(0, 123, 143, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(0, 123, 143, 0.4)',
    },
  },
  acceptBtn: {
    background: 'linear-gradient(45deg, #10b981, #34d399)',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '12px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
    },
  },
  rejectBtn: {
    background: 'linear-gradient(45deg, #ef4444, #f97316)',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
    },
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    border: '2px solid',
    background: 'transparent',
    transition: 'all 0.2s ease',
  },
  statusPending: {
    color: '#f59e0b',
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  statusAccepted: {
    color: '#10b981',
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    color: '#ef4444',
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
};
*/
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
};