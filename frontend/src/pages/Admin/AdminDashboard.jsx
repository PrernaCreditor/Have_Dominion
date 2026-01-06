import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import UserManagement from '../../components/Admin/UserManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    userGrowth: '+0%',
    sessionGrowth: '+0%',
    revenue: 0,
    revenueGrowth: '+0%',
    supportTickets: 0,
    ticketGrowth: '+0%',
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getStatistics();
      setStats(response.data || {});
    } catch (err) {
      console.error('Statistics fetch error:', err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={fetchStatistics}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's what's happening today.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600">{stats.userGrowth}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-sm text-gray-500">{stats.inactiveUsers} inactive</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Admins</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
              <p className="text-sm text-green-600">{stats.sessionGrowth}</p>
            </div>
          </div>

          {/* System Health and Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Response</span>
                  <span className="text-sm text-green-600">120ms</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>New user registration</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>System backup completed</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Settings updated</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
