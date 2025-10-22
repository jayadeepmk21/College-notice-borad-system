import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  BookOpen,
  Clock,
  Building,
  Users,
  Eye,
  X
} from 'lucide-react';
import './App.css';

// Mock API functions for demo
const mockAPI = {
  login: async (credentials) => {
    if (credentials.email === 'admin@college.edu' && credentials.password === 'password') {
      return { data: { token: 'mock-token', admin: { name: 'Admin', email: 'admin@college.edu' } } };
    }
    throw new Error('Invalid credentials');
  },
  getNotices: async (params = {}) => {
    const notices = [
      {
        id: 1,
        title: 'Mid-Semester Examination Schedule',
        content: 'The mid-semester examinations will be conducted from October 15th to October 25th, 2024. Students are advised to check their respective department notice boards for detailed timetables.',
        department: 'Computer Science',
        date: '2024-10-10',
        admin_name: 'Dr. Smith',
        created_at: '2024-10-10T10:00:00Z'
      },
      {
        id: 2,
        title: 'Annual Tech Fest Registration Open',
        content: 'Registration for the annual tech fest "TechnoVision 2024" is now open. Students can register online through the college portal. Last date for registration: November 5th, 2024.',
        department: 'All',
        date: '2024-10-12',
        admin_name: 'Prof. Johnson',
        created_at: '2024-10-12T14:30:00Z'
      },
      {
        id: 3,
        title: 'Library Extension Hours',
        content: 'Due to upcoming examinations, the central library will remain open till 10 PM from October 20th onwards. Students are requested to carry their ID cards for entry after 6 PM.',
        department: 'All',
        date: '2024-10-08',
        admin_name: 'Librarian',
        created_at: '2024-10-08T09:15:00Z'
      }
    ];
    
    let filtered = notices;
    if (params.department && params.department !== 'all') {
      filtered = filtered.filter(n => n.department === params.department);
    }
    if (params.date) {
      filtered = filtered.filter(n => n.date === params.date);
    }
    return { data: filtered };
  },
  createNotice: async (notice) => {
    return { data: { ...notice, id: Date.now() } };
  },
  deleteNotice: async (id) => {
    return { data: { message: 'Notice deleted' } };
  }
};

// Header Component
const Header = ({ isAdmin, onLogout, onToggleView }) => (
  <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">College Notice Board</h1>
            <p className="text-blue-100 text-sm">Stay updated with latest announcements</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button
              onClick={onToggleView}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Student View</span>
            </button>
          )}
          {isAdmin && (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
);

// Login Component
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await mockAPI.login(credentials);
      onLogin(response.data);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-gray-600">Sign in to manage notices</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="admin@college.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials: admin@college.edu / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notice Card Component
const NoticeCard = ({ notice, isAdmin, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Computer Science': 'bg-blue-100 text-blue-800 border-blue-200',
      'Electronics': 'bg-green-100 text-green-800 border-green-200',
      'Mechanical': 'bg-purple-100 text-purple-800 border-purple-200',
      'Civil': 'bg-orange-100 text-orange-800 border-orange-200',
      'All': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[dept] || colors['All'];
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {notice.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(notice.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{notice.admin_name}</span>
              </div>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(notice.department)}`}>
              {notice.department}
            </span>
          </div>
          
          {isAdmin && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(notice)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(notice.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          {notice.content}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Posted {formatDate(notice.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bell className="w-3 h-3" />
            <span>Notice #{notice.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notice Form Modal
const NoticeForm = ({ isOpen, onClose, onSave, notice }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: 'All',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (notice) {
      setFormData(notice);
    } else {
      setFormData({
        title: '',
        content: '',
        department: 'All',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [notice, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {notice ? 'Edit Notice' : 'Create New Notice'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notice title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter notice content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                {notice ? 'Update Notice' : 'Create Notice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Student Notice Board View
const StudentNoticeBoard = ({ notices, onFilterChange, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notices.filter(n => {
                    const noticeDate = new Date(n.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return noticeDate >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(notices.map(n => n.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={filters.department || 'all'}
                onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
              
              <input
                type="date"
                value={filters.date || ''}
                onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        <div className="space-y-6">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} isAdmin={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = ({ notices, onCreateNotice, onEditNotice, onDeleteNotice }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleSave = (noticeData) => {
    if (editingNotice) {
      onEditNotice(editingNotice.id, noticeData);
    } else {
      onCreateNotice(noticeData);
    }
    setEditingNotice(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingNotice(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage college notices and announcements</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Notice</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notices.filter(n => {
                    const noticeDate = new Date(n.date);
                    const thisMonth = new Date();
                    return noticeDate.getMonth() === thisMonth.getMonth();
                  }).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(notices.map(n => n.department)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notices.filter(n => new Date(n.date) >= new Date()).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notices</h2>
          </div>
          <div className="p-6 space-y-6">
            {notices.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notices yet</h3>
                <p className="text-gray-600 mb-4">Create your first notice to get started.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Notice
                </button>
              </div>
            ) : (
              notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={onDeleteNotice}
                />
              ))
            )}
          </div>
        </div>

        {/* Notice Form Modal */}
        <NoticeForm
          isOpen={showForm}
          onClose={handleClose}
          onSave={handleSave}
          notice={editingNotice}
        />
      </div>
    </div>
  );
};

// Main App Component
const CollegeNoticeBoard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showStudentView, setShowStudentView] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [filters]);

  const fetchNotices = async () => {
    try {
      const response = await mockAPI.getNotices(filters);
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setAdmin(userData.admin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdmin(null);
    setShowStudentView(false);
  };

  const handleCreateNotice = async (noticeData) => {
    try {
      const response = await mockAPI.createNotice(noticeData);
      setNotices([response.data, ...notices]);
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const handleEditNotice = async (id, noticeData) => {
    try {
      setNotices(notices.map(n => n.id === id ? { ...n, ...noticeData } : n));
    } catch (error) {
      console.error('Error editing notice:', error);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await mockAPI.deleteNotice(id);
        setNotices(notices.filter(n => n.id !== id));
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && !showStudentView) {
    return (
      <div>
        <Header isAdmin={false} />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to College Notice Board
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Stay updated with the latest announcements and notices from your college
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowStudentView(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>View as Student</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header 
        isAdmin={isLoggedIn} 
        onLogout={handleLogout} 
        onToggleView={() => setShowStudentView(!showStudentView)}
      />
      
      {showStudentView || !isLoggedIn ? (
        <StudentNoticeBoard
          notices={notices}
          onFilterChange={setFilters}
          filters={filters}
        />
      ) : (
        <AdminDashboard
          notices={notices}
          onCreateNotice={handleCreateNotice}
          onEditNotice={handleEditNotice}
          onDeleteNotice={handleDeleteNotice}
        />
      )}
    </div>
  );
};

export default CollegeNoticeBoard;