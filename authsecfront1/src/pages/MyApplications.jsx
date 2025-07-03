
import React, { useEffect, useState } from 'react';
import api from '../components/api1';
import Sidebar from '../layout/Sidebar';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const res = await api.get(`/applications/students/${userId}/applications`);
        setApplications(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des candidatures:", err);
      }
    };
    fetchApplications();
  }, []);

  const styles = {
    page: {
      backgroundColor: '#f8f9fa',
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
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#2d3748',
      borderBottom: '1px solid #e0f2f1',
      borderRight: '1px solid #e0f2f1',
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

  return (
    <div className="layout"> 
      <Sidebar />
      <main className="page-content" style={styles.page}>
        <h2 style={styles.title}>Suivi de candidature</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Offre</th>
              <th style={styles.th}>Entreprise</th>
              <th style={styles.th}>Statut</th>
              <th style={{...styles.th, borderRight: 'none'}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td style={styles.td}>{app.offer?.title}</td>
                <td style={styles.td}>{app.offer?.company?.name}</td>
                <td style={styles.td}>
                  {app.status === "PENDING" && (
                    <span style={{...styles.statusBadge, ...styles.statusPending}}>
                      ⏳ En attente
                    </span>
                  )}
                  {app.status === "ACCEPTED" && (
                    <span style={{...styles.statusBadge, ...styles.statusAccepted}}>
                      ✅ Acceptée
                    </span>
                  )}
                  {app.status === "REJECTED" && (
                    <span style={{...styles.statusBadge, ...styles.statusRejected}}>
                      ❌ Refusée
                    </span>
                  )}
                </td>
                <td style={{...styles.td, borderRight: 'none'}}>
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default MyApplications;