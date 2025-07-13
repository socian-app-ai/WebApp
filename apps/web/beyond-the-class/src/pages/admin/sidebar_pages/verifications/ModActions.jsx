import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import useUniversityData from '../../hooks/useUniversityData';

export default function ModActions() {
  const { UniversitySelector, CampusSelector, currentUniversity, currentCampus } = useUniversityData();

  const [modActivities, setModActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    universityId: '',
    campusId: '',
    userId: '',
    method: '',
    startDate: '',
    endDate: ''
  });

  const [viewType, setViewType] = useState('all'); // 'all', 'university', 'campus'
  
  // Undo confirmation modal state
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [undoActivityId, setUndoActivityId] = useState(null);
  const [undoReason, setUndoReason] = useState('');
  const [undoLoading, setUndoLoading] = useState(false);

  const fetchModActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (viewType === 'all') {
        // Get all mod activities with filters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        params.append('page', pagination.page);
        params.append('limit', pagination.limit);
        
        response = await axiosInstance.get(`/api/super/mod/get-filtered-mod-activity?${params.toString()}`);
        setModActivities(response.data.data);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      } else if (viewType === 'university' && currentUniversity?._id) {
        response = await axiosInstance.get(`/api/super/mod/get-all-university-mod-activity/${currentUniversity._id}`);
        setModActivities(response.data);
      } else if (viewType === 'campus' && currentCampus?._id) {
        response = await axiosInstance.get(`/api/super/mod/get-all-campus-mod-activity/${currentCampus._id}`);
        setModActivities(response.data);
      } else {
        response = await axiosInstance.get('/api/super/mod/get-all-mod-activity');
        setModActivities(response.data);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch mod activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this mod activity?')) return;
    
    try {
      await axiosInstance.delete(`/api/super/mod/delete-mod-activity/${activityId}`);
      fetchModActivities(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete mod activity');
    }
  };

  const handleUndoActivity = (activityId) => {
    setUndoActivityId(activityId);
    setShowUndoModal(true);
    setUndoReason('');
  };

  const confirmUndoActivity = async () => {
    if (!undoReason.trim()) {
      setError('Please provide a reason for undoing this activity');
      return;
    }
    
    setUndoLoading(true);
    try {
      const response = await axiosInstance.post(`/api/super/mod/undo-mod-activity/${undoActivityId}`, {
        reason: undoReason.trim()
      });
      
      // Show success message
      alert(`Activity undone successfully: ${response.data.undoDetails}`);
      setShowUndoModal(false);
      setUndoActivityId(null);
      setUndoReason('');
      fetchModActivities(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to undo mod activity');
    } finally {
      setUndoLoading(false);
    }
  };

  const cancelUndoActivity = () => {
    setShowUndoModal(false);
    setUndoActivityId(null);
    setUndoReason('');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      universityId: '',
      campusId: '',
      userId: '',
      method: '',
      startDate: '',
      endDate: ''
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchModActivities();
  }, [viewType, currentUniversity, currentCampus, pagination.page, pagination.limit]);

  useEffect(() => {
    // Apply filters after a delay to avoid too many API calls
    const timer = setTimeout(() => {
      if (viewType === 'all') {
        fetchModActivities();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'bg-green-100 text-green-800',
      'POST': 'bg-blue-100 text-blue-800',
      'PUT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'PATCH': 'bg-purple-100 text-purple-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Moderator Activity Management</h1>
        
        {/* View Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">View Options</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setViewType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewType === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => setViewType('university')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewType === 'university' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By University
            </button>
            <button
              onClick={() => setViewType('campus')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewType === 'campus' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Campus
            </button>
          </div>
          
          {/* University/Campus Selectors */}
          {(viewType === 'university' || viewType === 'campus') && (
            <div className="flex flex-wrap gap-4">
              {UniversitySelector}
              {viewType === 'campus' && CampusSelector}
            </div>
          )}
        </div>

        {/* Filters */}
        {viewType === 'all' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HTTP Method
                </label>
                <select
                  value={filters.method}
                  onChange={(e) => handleFilterChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activities Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Moderator Activities
              {viewType === 'all' && pagination.totalCount > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({pagination.totalCount} total)
                </span>
              )}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading activities...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchModActivities}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : modActivities.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No mod activities found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modActivities.map((activity) => (
                    <tr key={activity._id} className={`hover:bg-gray-50 ${activity.isUndone ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {activity.userId?.profile?.picture ? (
                              <img
                                src={activity.userId.profile.picture}
                                alt={activity.userId.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {activity.userId?.name?.charAt(0) || '?'}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {activity.userId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {activity.userId?.username || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getMethodColor(activity.method)}`}>
                          {activity.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {activity.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.universityId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.campusId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(activity.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activity.isUndone ? (
                          <div className="flex flex-col">
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Undone
                            </span>
                            {activity.undoneAt && (
                              <span className="text-xs text-gray-500 mt-1">
                                {formatDate(activity.undoneAt)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {activity.canBeUndone && !activity.isUndone && (
                            <button
                              onClick={() => handleUndoActivity(activity._id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              Undo
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {viewType === 'all' && pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        pagination.page === pageNum
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Undo Confirmation Modal */}
        {showUndoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Undo Action
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to undo this moderator action? This will reverse the effects of the original action.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for undoing this action <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={undoReason}
                  onChange={(e) => setUndoReason(e.target.value)}
                  placeholder="Please provide a reason for undoing this activity..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelUndoActivity}
                  disabled={undoLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUndoActivity}
                  disabled={undoLoading || !undoReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  {undoLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Undoing...
                    </>
                  ) : (
                    'Confirm Undo'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
