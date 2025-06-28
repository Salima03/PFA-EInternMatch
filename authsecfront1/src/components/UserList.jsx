import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  Badge, Button, Table, Pagination,
  Form, InputGroup, Spinner, Card, Collapse
} from 'react-bootstrap';
import {
  Search, Filter, Person, PersonCheck, PersonX,
  SortDown, SortUp, Lock, Unlock, Trash, Calendar,
  CheckCircle, XCircle, ArrowCounterclockwise, ChevronDown, ChevronUp
} from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [filters, setFilters] = useState({
    role: 'ALL',
    status: 'ALL',
    search: '',
    sort: 'desc'
  });
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sort: prev.sort === 'desc' ? 'asc' : 'desc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: 'ALL',
      status: 'ALL',
      search: '',
      sort: 'desc'
    });
    setCurrentPage(1);
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
      const unitInput = prompt("Unité de durée ? (MINUTES, HOURS, DAYS)", "HOURS");

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

  // Filtrage et tri des utilisateurs
  const filteredUsers = users.filter(user => {
    const roleMatch = filters.role === 'ALL' || user.role === filters.role;
    const statusMatch = filters.status === 'ALL' ||
        (filters.status === 'ACTIVE' ? !user.lockedByAdmin : user.lockedByAdmin);
    const searchMatch = filters.search === '' ||
        user.firstname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

    return roleMatch && statusMatch && searchMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.profileCreatedAt);
    const dateB = new Date(b.profileCreatedAt);
    return filters.sort === 'asc' ? dateA - dateB : dateB - dateA;
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
          <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
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

  // Vérifie si des filtres sont actifs
  const hasActiveFilters = filters.role !== 'ALL' || filters.status !== 'ALL' || filters.search !== '';

  return (
      <div className="container-fluid p-4">
        <h2 className="mb-4 d-flex align-items-center">
          <PersonCheck className="me-2" />
          Gestion des utilisateurs
        </h2>

        {/* Carte des filtres avec fonctionnalité de masquage */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <Filter className="me-2" />
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
                  disabled={!hasActiveFilters}
              >
                <ArrowCounterclockwise className="me-1" />
                Réinitialiser
              </Button>
            </div>
          </Card.Header>

          <Collapse in={showFilters}>
            <Card.Body>
              <div className="row g-3">
                {/* Barre de recherche */}
                <div className="col-md-5">
                  <label className="form-label">Rechercher :</label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Nom, prénom ou email..."
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                  </InputGroup>
                </div>

                {/* Filtre par rôle */}
                <div className="col-md-3">
                  <label className="form-label">Rôle :</label>
                  <Form.Select
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                  >
                    <option value="ALL">Tous les rôles</option>
                    <option value="STUDENT">Étudiant</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </div>

                {/* Filtre par état */}
                <div className="col-md-2">
                  <label className="form-label">État :</label>
                  <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                  >
                    <option value="ALL">Tous</option>
                    <option value="ACTIVE">Actif</option>
                    <option value="LOCKED">Bloqué</option>
                  </Form.Select>
                </div>

                {/* Tri par date */}
                <div className="col-md-2">
                  <label className="form-label">Tri :</label>
                  <Button
                      variant={filters.sort === 'desc' ? 'outline-primary' : 'outline-secondary'}
                      onClick={toggleSortOrder}
                      className="w-100 d-flex align-items-center justify-content-center"
                  >
                    {filters.sort === 'desc' ? (
                        <>
                          <SortDown className="me-1" />
                          Récent
                        </>
                    ) : (
                        <>
                          <SortUp className="me-1" />
                          Ancien
                        </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Affichage des filtres actifs */}
              {hasActiveFilters && (
                  <div className="mt-3">
                    <small className="text-muted">Filtres actifs :</small>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {filters.role !== 'ALL' && (
                          <Badge bg="light" text="dark" className="d-flex align-items-center">
                            <Person className="me-1" />
                            {filters.role === 'STUDENT' ? 'Étudiant' :
                                filters.role === 'MANAGER' ? 'Manager' : 'Admin'}
                            <XCircle
                                className="ms-1 cursor-pointer"
                                onClick={() => setFilters({...filters, role: 'ALL'})}
                                style={{ cursor: 'pointer' }}
                            />
                          </Badge>
                      )}
                      {filters.status !== 'ALL' && (
                          <Badge bg="light" text="dark" className="d-flex align-items-center">
                            {filters.status === 'ACTIVE' ? (
                                <>
                                  <CheckCircle className="me-1 text-success" />
                                  Actif
                                </>
                            ) : (
                                <>
                                  <Lock className="me-1 text-danger" />
                                  Bloqué
                                </>
                            )}
                            <XCircle
                                className="ms-1 cursor-pointer"
                                onClick={() => setFilters({...filters, status: 'ALL'})}
                                style={{ cursor: 'pointer' }}
                            />
                          </Badge>
                      )}
                      {filters.search && (
                          <Badge bg="light" text="dark" className="d-flex align-items-center">
                            <Search className="me-1" />
                            "{filters.search}"
                            <XCircle
                                className="ms-1 cursor-pointer"
                                onClick={() => setFilters({...filters, search: ''})}
                                style={{ cursor: 'pointer' }}
                            />
                          </Badge>
                      )}
                    </div>
                  </div>
              )}
            </Card.Body>
          </Collapse>
        </Card>

        {/* Tableau des utilisateurs */}
        <div className="card shadow-sm mb-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-light">
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Création</th>
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
                            <small className="text-muted">
                              {new Date(user.profileCreatedAt).toLocaleDateString('fr-FR')}
                            </small>
                          </td>
                          <td>
                            <Badge
                                bg={
                                  user.role === 'STUDENT' ? 'primary' :
                                      user.role === 'MANAGER' ? 'warning' : 'danger'
                                }
                                className="d-flex align-items-center"
                            >
                              {user.role === 'STUDENT' ? (
                                  <Person className="me-1" />
                              ) : user.role === 'MANAGER' ? (
                                  <PersonCheck className="me-1" />
                              ) : (
                                  <PersonX className="me-1" />
                              )}
                              {user.role === 'STUDENT' ? 'Étudiant' :
                                  user.role === 'MANAGER' ? 'Manager' : 'Admin'}
                            </Badge>
                          </td>
                          <td>
                            {user.lockedByAdmin ? (
                                <Badge bg="danger" className="d-flex align-items-center">
                                  <Lock className="me-1" />
                                  Bloqué
                                </Badge>
                            ) : (
                                <Badge bg="success" className="d-flex align-items-center">
                                  <Unlock className="me-1" />
                                  Actif
                                </Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {(user.role === 'STUDENT' || user.role === 'MANAGER') && (
                                  <>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(user)}
                                        title="Supprimer"
                                    >
                                      <Trash size={16} />
                                    </Button>
                                    {user.lockedByAdmin ? (
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => handleUnlockUser(user.id)}
                                            title="Débloquer"
                                        >
                                          <Unlock size={16} />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => handleLockUser(user.id)}
                                            title="Bloquer"
                                        >
                                          <Lock size={16} />
                                        </Button>
                                    )}
                                  </>
                              )}
                              {user.role === 'ADMIN' && (
                                  <span className="text-muted small">Aucune action</span>
                              )}
                            </div>
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
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
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

        {/* Graphiques */}
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