import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

// Palette de couleurs pour les graphiques
const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'];

const EmptyDataPlaceholder = ({ message }) => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div className="text-center text-muted p-4">
      <i className="bi bi-bar-chart fs-1"></i>
      <p className="mt-2 mb-0">{message}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // Nouveau filtre
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Pagination - 8 lignes par page

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [dashboardResponse, usersByDateResponse] = await Promise.all([
        axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/dashboard/users-creation-by-date', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const normalizedData = {
        userStats: {
          ...dashboardResponse.data.userStats || {},
          usersByDate: usersByDateResponse.data
        },
        companyStats: dashboardResponse.data.companyStats || {},
        offerStats: dashboardResponse.data.offerStats || {},
        studentStats: dashboardResponse.data.studentStats || {},
        recentActivity: dashboardResponse.data.recentActivity || {},
        applicationStats: dashboardResponse.data.applicationStats || {},
        documentStats: dashboardResponse.data.documentStats || {}
      };

      setStats(normalizedData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/admin/dashboard/users-with-managers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.');
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  const formatDateData = (dateMap) => {
    if (!dateMap || typeof dateMap !== 'object') return [];

    return Object.entries(dateMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      }),
      count
    }));
  };

  const prepareChartData = (data) => {
    if (!data || Object.keys(data).length === 0) return [];
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer le profil de ${user.firstname} ${user.lastname} ?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      let url = '';

      if (user.role === 'STUDENT') {
        url = `/api/v1/profiles/${user.id}`;
      } else if (user.role === 'MANAGER') {
        url = `/api/v1/companies/profile/delete/${user.id}`;
      } else {
        alert("Suppression non autorisée pour ce type d'utilisateur.");
        return;
      }

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Profil supprimé avec succès.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du profil.");
    }
  };

  const handleLockUser = async (userId) => {
    try {
      const durationInput = prompt("Durée du blocage ?", "2");
      const unitInput = prompt("Unité de durée ? (SECONDS, MINUTES, HOURS, DAYS)", "HOURS");

      const lockDuration = parseInt(durationInput);
      const lockDurationUnit = unitInput.toUpperCase();

      const validUnits = ['MINUTES', 'HOURS', 'DAYS'];

      if (isNaN(lockDuration) || lockDuration <= 0 || !validUnits.includes(lockDurationUnit)) {
        alert("Valeurs invalides.");
        return;
      }

      const token = localStorage.getItem('accessToken');

      await axios.post(
        `/api/admin/users/${userId}/lock`,
        null,
        {
          params: { lockDuration, lockDurationUnit },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(`Utilisateur bloqué pendant ${lockDuration} ${lockDurationUnit.toLowerCase()}.`);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors du blocage de l'utilisateur.");
      console.error(error);
    }
  };

  const handleUnlockUser = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `/api/admin/users/${userId}/unlock`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Utilisateur débloqué avec succès.");
      fetchUsers();
    } catch (error) {
      alert("Erreur lors du déblocage de l'utilisateur.");
      console.error(error);
    }
  };

  // Filtrage combiné par rôle et état
  const filteredUsers = users.filter(user => {
    const roleMatch = roleFilter === 'ALL' || user.role === roleFilter;
    const statusMatch = statusFilter === 'ALL' || 
                      (statusFilter === 'ACTIVE' ? !user.lockedByAdmin : user.lockedByAdmin);
    return roleMatch && statusMatch;
  });

  // Tri par date
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.profileCreatedAt);
    const dateB = new Date(b.profileCreatedAt);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-80 flex-column">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h6 className="text-muted">Chargement des données...</h6>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <h6>Erreur :</h6>
        <p>{error}</p>
      </div>
    );
  }

  const charts = [
    {
      title: "Création d'utilisateurs par date",
      description: "Évolution du nombre de nouveaux utilisateurs",
      chart: stats.userStats.usersByDate ? (
        <LineChart
          data={formatDateData(stats.userStats.usersByDate)}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4e79a7"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      ) : <EmptyDataPlaceholder message="Aucune donnée disponible" />
    },
    {
      title: "Utilisateurs par rôle",
      description: "Répartition des rôles",
      chart: stats.userStats.usersByRole ? (
        <PieChart>
          <Pie
            data={prepareChartData(stats.userStats.usersByRole)}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {prepareChartData(stats.userStats.usersByRole).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : <EmptyDataPlaceholder message="Pas de données utilisateur" />
    }
  ];

  return (
    <div className="container-fluid p-4">
      <h2>Liste des utilisateurs</h2>
      
      {/* Filtres */}
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <label className="form-label">Filtrer par rôle :</label>
          <select
            className="form-select"
            value={roleFilter}
            onChange={e => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">Tous</option>
            <option value="STUDENT">Étudiant</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        
        <div className="col-md-4">
          <label className="form-label">Filtrer par état :</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">Tous</option>
            <option value="ACTIVE">Actif</option>
            <option value="LOCKED">Bloqué</option>
          </select>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Status</th>
            <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>Date {sortAsc ? '↑' : '↓'}</th>
            <th>Rôle</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>
  {user.deactivatedByUser ? (
    <span className="badge bg-secondary">A supprimer</span>
  ) : (
    <span className="badge bg-primary">non</span>
  )}
</td>
                <td>{new Date(user.profileCreatedAt).toLocaleDateString('fr-FR')}</td>
                <td><span className="badge bg-secondary">{user.role}</span></td>
                <td>
                  {user.lockedByAdmin ? (
                    <span className="badge bg-danger">Bloqué</span>
                  ) : (
                    <span className="badge bg-success">Actif</span>
                  )}
                </td>
                <td>
                  {(user.role === 'STUDENT' || user.role === 'MANAGER') && (
                    <>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(user)}>Supprimer</button>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleLockUser(user.id)}>Bloquer</button>
                      <button className="btn btn-sm btn-success" onClick={() => handleUnlockUser(user.id)}>Débloquer</button>
                    </>
                  )}
                  {user.role === 'ADMIN' && <span className="text-muted">Actions non disponibles</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                Aucun utilisateur trouvé avec ces critères
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {sortedUsers.length > usersPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(currentPage - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => paginate(currentPage + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <div className="row g-3 mt-4">
        {charts.map((item, index) => (
          <div key={index} className="col-12 col-lg-6 mb-3">
            <div className="card shadow-sm h-100 rounded-3 border-0">
              <div className="card-body p-3">
                <h5 className="fw-bold mb-2" style={{ color: '#4e79a7' }}>{item.title}</h5>
                <p className="text-muted small mb-3">{item.description}</p>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {item.chart}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;