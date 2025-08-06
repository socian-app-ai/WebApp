import React, { useState, useEffect } from 'react';
import useUniversityData from "../../admin/hooks/useUniversityData";
import SEO from "../../../components/seo/SEO";

import axiosInstance from "../../../config/users/axios.instance";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function SuperDashboard() {
  const { UniversitySelector, CampusSelector, currentUniversity, currentCampus } = useUniversityData();
  
  // State for analytics data
  const [dashboardData, setDashboardData] = useState(null);
  const [routeAnalytics, setRouteAnalytics] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    route: '',
    userId: '',
    deviceId: ''
  });
  const [availableFilters, setAvailableFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ...(currentUniversity?._id && { universityId: currentUniversity._id }),
        ...(currentCampus?._id && { campusId: currentCampus._id })
      };

      const response = await axiosInstance.get('/api/super/dashboard', { params });
      
      // Ensure the response has the expected structure
      const data = response.data || {};
      const dashboardInfo = {
        stats: {
          totalUsers: data.stats?.totalUsers || 0,
          totalUniversities: data.stats?.totalUniversities || 0,
          totalCampuses: data.stats?.totalCampuses || 0,
          totalSocieties: data.stats?.totalSocieties || 0,
          recentActivity: {
            totalRequests: data.stats?.recentActivity?.totalRequests || 0,
            uniqueUsers: data.stats?.recentActivity?.uniqueUsers || 0,
            uniqueDevices: data.stats?.recentActivity?.uniqueDevices || 0,
            dateRange: data.stats?.recentActivity?.dateRange || '7 days'
          }
        },
        topRoutes: data.topRoutes || {},
        activityByDay: data.activityByDay || []
      };
      
      setDashboardData(dashboardInfo);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set default data structure to prevent undefined errors
      setDashboardData({
        stats: {
          totalUsers: 0,
          totalUniversities: 0,
          totalCampuses: 0,
          totalSocieties: 0,
          recentActivity: {
            totalRequests: 0,
            uniqueUsers: 0,
            uniqueDevices: 0,
            dateRange: '7 days'
          }
        },
        topRoutes: {},
        activityByDay: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch route analytics
  const fetchRouteAnalytics = async () => {
    try {
      const params = {
        ...filters,
        ...(currentUniversity?._id && { universityId: currentUniversity._id }),
        ...(currentCampus?._id && { campusId: currentCampus._id }),
        limit: 10
      };

      const response = await axiosInstance.get('/api/super/analytics/routes', { params });
      setRouteAnalytics(response.data || []);
    } catch (error) {
      console.error('Error fetching route analytics:', error);
      setRouteAnalytics([]);
      setError('Failed to load route analytics.');
    }
  };

  // Fetch user analytics
  const fetchUserAnalytics = async () => {
    try {
      const params = {
        ...filters,
        ...(currentUniversity?._id && { universityId: currentUniversity._id }),
        ...(currentCampus?._id && { campusId: currentCampus._id }),
        limit: 10
      };

      const response = await axiosInstance.get('/api/super/analytics/users', { params });
      setUserAnalytics(response.data || []);
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setUserAnalytics([]);
      setError('Failed to load user analytics.');
    }
  };

  // Fetch timeline data
  const fetchTimelineData = async () => {
    try {
      const params = {
        ...filters,
        ...(currentUniversity?._id && { universityId: currentUniversity._id }),
        ...(currentCampus?._id && { campusId: currentCampus._id }),
        groupBy: 'day'
      };

      const response = await axiosInstance.get('/api/super/analytics/timeline', { params });
      setTimelineData(response.data || []);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      setTimelineData([]);
      setError('Failed to load timeline data.');
    }
  };

  // Fetch available filters
  const fetchAvailableFilters = async () => {
    try {
      const response = await axiosInstance.get('/api/super/analytics/filters');
      setAvailableFilters(response.data || {});
    } catch (error) {
      console.error('Error fetching filters:', error);
      setAvailableFilters({});
      // Don't set error for filters as it's not critical
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchDashboardData();
    fetchAvailableFilters();
  }, [currentUniversity, currentCampus]);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchRouteAnalytics();
      fetchUserAnalytics();
      fetchTimelineData();
    }
  }, [filters, currentUniversity, currentCampus, activeTab]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      route: '',
      userId: '',
      deviceId: ''
    });
  };

  // Format top routes data for pie chart
  const formatTopRoutesForPie = () => {
    if (!dashboardData?.topRoutes) return [];
    
    const routes = Object.entries(dashboardData.topRoutes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([route, count]) => ({
        name: route.replace('/api/', ''),
        value: count,
        fullRoute: route
      }));
    
    return routes;
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen w-full px-2 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading analytics dashboard...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen w-full px-2 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              fetchDashboardData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full px-2 pt-8'>
      <SEO
        title="Admin Dashboard"
        description="Administrative dashboard for Socian platform management. Monitor analytics, manage users, and oversee platform operations."
        keywords="admin dashboard, platform management, analytics, user management, system administration"
        pageType="admin"
      />
      {/* Header with selectors */}
      <div className='flex flex-wrap gap-4 mb-6'>
        {UniversitySelector}
        {CampusSelector}
      </div>

      {/* Error Banner */}
      {error && dashboardData && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex justify-between items-center'>
            <div className='text-red-700'>{error}</div>
            <button 
              onClick={() => setError(null)}
              className='text-red-500 hover:text-red-700'
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'routes', 'users', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && dashboardData.stats && (
        <div>
          {/* Basic Stats Cards */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-blue-600'>{dashboardData.stats.totalUsers.toLocaleString()}</div>
              <div className='text-sm text-gray-600'>Total Users</div>
            </div>
            
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-green-600'>{dashboardData.stats.totalUniversities}</div>
              <div className='text-sm text-gray-600'>Universities</div>
            </div>
            
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-purple-600'>{dashboardData.stats.totalCampuses}</div>
              <div className='text-sm text-gray-600'>Campuses</div>
            </div>
            
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-orange-600'>{dashboardData.stats.totalSocieties.toLocaleString()}</div>
              <div className='text-sm text-gray-600'>Societies</div>
            </div>

            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-red-600'>{dashboardData.stats.recentActivity.totalRequests.toLocaleString()}</div>
              <div className='text-sm text-gray-600'>Requests (7 days)</div>
            </div>

            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-indigo-600'>{dashboardData.stats.recentActivity.uniqueUsers}</div>
              <div className='text-sm text-gray-600'>Active Users (7 days)</div>
            </div>

            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='text-2xl font-bold text-pink-600'>{dashboardData.stats.recentActivity.uniqueDevices}</div>
              <div className='text-sm text-gray-600'>Unique Devices (7 days)</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            {/* Activity Timeline */}
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <h3 className='text-lg font-semibold mb-4'>Daily Activity (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.activityByDay || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Routes Pie Chart */}
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <h3 className='text-lg font-semibold mb-4'>Top API Routes (7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formatTopRoutesForPie()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {formatTopRoutesForPie().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filters for other tabs */}
      {activeTab !== 'overview' && (
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>Filters</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Route</label>
              <select
                value={filters.route}
                onChange={(e) => handleFilterChange('route', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              >
                <option value="">All Routes</option>
                {availableFilters.routes?.map((route, index) => (
                  <option key={index} value={route}>{route}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>User ID</label>
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                placeholder="Filter by user ID"
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
              />
            </div>

            <div className='flex items-end'>
              <button
                onClick={clearFilters}
                className='w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className='space-y-6'>
          <div className='border rounded-lg p-4 bg-white shadow-sm'>
            <h3 className='text-lg font-semibold mb-4'>Route Usage Analytics</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={routeAnalytics || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="route" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Requests" />
                <Bar dataKey="uniqueUsers" fill="#82ca9d" name="Unique Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='border rounded-lg p-4 bg-white shadow-sm overflow-x-auto'>
            <h3 className='text-lg font-semibold mb-4'>Detailed Route Statistics</h3>
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-4 py-2 text-left'>Route</th>
                  <th className='px-4 py-2 text-left'>Total Requests</th>
                  <th className='px-4 py-2 text-left'>Unique Users</th>
                  <th className='px-4 py-2 text-left'>Unique Devices</th>
                  <th className='px-4 py-2 text-left'>Universities</th>
                  <th className='px-4 py-2 text-left'>Campuses</th>
                </tr>
              </thead>
              <tbody>
                {(routeAnalytics || []).map((route, index) => (
                  <tr key={index} className='border-t'>
                    <td className='px-4 py-2 font-mono text-sm'>{route?.route || 'N/A'}</td>
                    <td className='px-4 py-2'>{(route?.count || 0).toLocaleString()}</td>
                    <td className='px-4 py-2'>{route?.uniqueUsers || 0}</td>
                    <td className='px-4 py-2'>{route?.uniqueDevices || 0}</td>
                    <td className='px-4 py-2'>{route?.universities || 0}</td>
                    <td className='px-4 py-2'>{route?.campuses || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className='space-y-6'>
          <div className='border rounded-lg p-4 bg-white shadow-sm'>
            <h3 className='text-lg font-semibold mb-4'>User Activity Analytics</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={userAnalytics || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="email" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requestCount" fill="#8884d8" name="Total Requests" />
                <Bar dataKey="uniqueRoutes" fill="#82ca9d" name="Unique Routes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='border rounded-lg p-4 bg-white shadow-sm overflow-x-auto'>
            <h3 className='text-lg font-semibold mb-4'>Top Active Users</h3>
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-4 py-2 text-left'>Email</th>
                  <th className='px-4 py-2 text-left'>User ID</th>
                  <th className='px-4 py-2 text-left'>Requests</th>
                  <th className='px-4 py-2 text-left'>Unique Routes</th>
                  <th className='px-4 py-2 text-left'>Devices</th>
                  <th className='px-4 py-2 text-left'>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {(userAnalytics || []).map((user, index) => (
                  <tr key={index} className='border-t'>
                    <td className='px-4 py-2'>{user?.email || 'N/A'}</td>
                    <td className='px-4 py-2 font-mono text-sm'>{user?.userId || 'N/A'}</td>
                    <td className='px-4 py-2'>{(user?.requestCount || 0).toLocaleString()}</td>
                    <td className='px-4 py-2'>{user?.uniqueRoutes || 0}</td>
                    <td className='px-4 py-2'>{user?.uniqueDevices || 0}</td>
                    <td className='px-4 py-2'>{user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className='space-y-6'>
          <div className='border rounded-lg p-4 bg-white shadow-sm'>
            <h3 className='text-lg font-semibold mb-4'>Activity Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Total Requests" />
                <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" name="Unique Users" />
                <Line type="monotone" dataKey="uniqueDevices" stroke="#ffc658" name="Unique Devices" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <h3 className='text-lg font-semibold mb-4'>Requests Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className='border rounded-lg p-4 bg-white shadow-sm'>
              <h3 className='text-lg font-semibold mb-4'>User Activity Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
