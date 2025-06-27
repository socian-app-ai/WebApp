import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  School,
  MapPin,
  ChevronDown,
  ChevronRight,
  Download,
  MessageSquare,
  Flag
} from 'lucide-react';

const SocietyVerifications = () => {
  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  
  // Filter and search states
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  // Modal states
  const [actionType, setActionType] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // API base URL - adjust according to your setup
  const API_BASE = '/api/super/societies';

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      under_review: 'bg-blue-100 text-blue-800 border-blue-200',
      moderator_approved: 'bg-purple-100 text-purple-800 border-purple-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  // Fetch verification requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        priority: filters.priority,
        type: filters.type,
        search: filters.search
      });

      const response = await axios.get(`${API_BASE}/verification-requests?${queryParams}`);
      const { requests, pagination, stats } = response.data;
      
      setRequests(requests);
      setPagination(pagination);
      setStats(stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch verification requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single request details
  const fetchRequestDetails = async (requestId) => {
    try {
      const response = await axios.get(`${API_BASE}/verification-requests/${requestId}`);
      setSelectedRequest(response.data.request);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch request details');
      console.error('Error fetching request details:', err);
    }
  };

  // Handle request approval
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessing(true);
      await axios.put(`${API_BASE}/verification-requests/${selectedRequest._id}/approve`, {
        reviewNotes
      });
      
      setShowModal(false);
      setReviewNotes('');
      fetchRequests(); // Refresh the list
      
      // Show success message
      alert('Verification request approved successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  // Handle request rejection
  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      setProcessing(true);
      await axios.put(`${API_BASE}/verification-requests/${selectedRequest._id}/reject`, {
        rejectionReason,
        reviewNotes
      });
      
      setShowModal(false);
      setRejectionReason('');
      setReviewNotes('');
      fetchRequests(); // Refresh the list
      
      // Show success message
      alert('Verification request rejected');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  // Handle marking as under review
  const handleMarkUnderReview = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessing(true);
      await axios.put(`${API_BASE}/verification-requests/${selectedRequest._id}/review`, {
        reviewNotes
      });
      
      setShowModal(false);
      setReviewNotes('');
      fetchRequests(); // Refresh the list
      
      alert('Request marked as under review');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update request');
    } finally {
      setProcessing(false);
    }
  };

  // Handle priority update
  const handlePriorityUpdate = async (requestId, newPriority) => {
    try {
      await axios.put(`${API_BASE}/verification-requests/${requestId}/priority`, {
        priority: newPriority
      });
      fetchRequests(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update priority');
    }
  };

  // Open action modal
  const openActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
    setReviewNotes('');
    setRejectionReason('');
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate processing time
  const getProcessingTime = (request) => {
    const submittedDate = new Date(request.submittedAt);
    const now = new Date();
    const diffTime = Math.abs(now - submittedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, [filters]);

  // Loading state
  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading verification requests...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Society Verification Requests</h1>
        <p className="text-gray-600">Review and manage society verification requests</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Eye className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{stats.underReview || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="text-red-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="moderator_approved">Moderator Approved</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="society">Society</option>
            <option value="alumni">Alumni</option>
          </select>

          {/* Items per page */}
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No verification requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Society
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {request.society?.icon ? (
                          <img
                            src={request.society.icon}
                            alt={request.society.name}
                            className="h-10 w-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <School size={20} className="text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.society?.name || 'Unknown Society'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {request.society?.references?.campusOrigin?.name || 'Unknown Campus'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.requestedBy?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.requestedBy?.universityEmail || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={request.priority}
                        onChange={(e) => handlePriorityUpdate(request._id, e.target.value)}
                        className={`text-sm font-medium border-none bg-transparent ${getPriorityColor(request.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(request.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getProcessingTime(request)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            fetchRequestDetails(request._id);
                            setShowModal(true);
                            setActionType('view');
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {request.status !== 'approved' && (
                          <button
                            onClick={() => openActionModal(request, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        
                        {request.status !== 'rejected' && (
                          <button
                            onClick={() => openActionModal(request, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        
                        {request.status === 'pending' && (
                          <button
                            onClick={() => openActionModal(request, 'review')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Mark Under Review"
                          >
                            <Clock size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {actionType === 'view' && 'Verification Request Details'}
                  {actionType === 'approve' && 'Approve Verification Request'}
                  {actionType === 'reject' && 'Reject Verification Request'}
                  {actionType === 'review' && 'Mark as Under Review'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Modal Content */}
              {selectedRequest && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Society Info */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">Society Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedRequest.society?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="font-medium">{selectedRequest.society?.totalMembers || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Campus</p>
                        <p className="font-medium">
                          {selectedRequest.society?.references?.campusOrigin?.name || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">University</p>
                        <p className="font-medium">
                          {selectedRequest.society?.references?.universityOrigin?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    {selectedRequest.society?.description && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-sm">{selectedRequest.society.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Request Details */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="font-medium">{formatDate(selectedRequest.submittedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Processing Time</p>
                        <p className="font-medium">{getProcessingTime(selectedRequest)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <p className={`font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                          {selectedRequest.priority.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Community Voting</p>
                        <p className="font-medium">
                          {selectedRequest.communityVoting ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    
                    {selectedRequest.comments && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Comments</p>
                        <p className="text-sm bg-gray-100 p-2 rounded">{selectedRequest.comments}</p>
                      </div>
                    )}
                  </div>

                  {/* Verification Requirements */}
                  {selectedRequest.requirements && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Verification Requirements</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedRequest.requirements).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            {value ? (
                              <CheckCircle size={16} className="text-green-500 mr-2" />
                            ) : (
                              <XCircle size={16} className="text-red-500 mr-2" />
                            )}
                            <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Documents */}
                  {selectedRequest.societyDocuments && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">Submitted Documents</h4>
                      <div className="space-y-3">
                        {/* Registration Certificate */}
                        {selectedRequest.societyDocuments.registrationCertificate && (
                          <DocumentViewer
                            title="Registration Certificate"
                            document={selectedRequest.societyDocuments.registrationCertificate}
                            icon="📜"
                          />
                        )}

                        {/* Event Picture */}
                        {selectedRequest.societyDocuments.eventPicture && (
                          <DocumentViewer
                            title="Event Picture"
                            document={selectedRequest.societyDocuments.eventPicture}
                            icon="📸"
                          />
                        )}

                        {/* Advisor Email Screenshot */}
                        {selectedRequest.societyDocuments.advisorEmailScreenshot && (
                          <DocumentViewer
                            title="Advisor Email Screenshot"
                            document={selectedRequest.societyDocuments.advisorEmailScreenshot}
                            icon="📧"
                          />
                        )}

                        {/* Custom Documents */}
                        {selectedRequest.societyDocuments.customDocuments?.map((doc, index) => (
                          <DocumentViewer
                            key={index}
                            title={doc.name}
                            document={doc}
                            icon="📄"
                          />
                        ))}

                        {/* No documents message */}
                        {!selectedRequest.societyDocuments.registrationCertificate &&
                         !selectedRequest.societyDocuments.eventPicture &&
                         !selectedRequest.societyDocuments.advisorEmailScreenshot &&
                         (!selectedRequest.societyDocuments.customDocuments || selectedRequest.societyDocuments.customDocuments.length === 0) && (
                          <p className="text-gray-500 text-sm italic">No documents uploaded</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Forms */}
                  {actionType !== 'view' && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {actionType === 'approve' && 'Approval Notes'}
                        {actionType === 'reject' && 'Rejection Details'}
                        {actionType === 'review' && 'Review Notes'}
                      </h4>
                      
                      {actionType === 'reject' && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason *
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Provide a clear reason for rejection..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows="3"
                            required
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add any additional notes or feedback..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
                >
                  {actionType === 'view' ? 'Close' : 'Cancel'}
                </button>
                
                {actionType === 'approve' && (
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {processing ? 'Approving...' : 'Approve Request'}
                  </button>
                )}
                
                {actionType === 'reject' && (
                  <button
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {processing ? 'Rejecting...' : 'Reject Request'}
                  </button>
                )}
                
                {actionType === 'review' && (
                  <button
                    onClick={handleMarkUnderReview}
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {processing ? 'Updating...' : 'Mark Under Review'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Document Viewer Component
const DocumentViewer = ({ title, document, icon }) => {
  const handleView = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };

  const handleDownload = () => {
    if (document.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileExtension = (fileName) => {
    return fileName ? fileName.split('.').pop().toUpperCase() : 'FILE';
  };

  const isImage = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
    return imageExtensions.includes(extension);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        <span className="text-lg">{icon}</span>
        <div>
          <h6 className="font-medium text-gray-900 text-sm">{title}</h6>
          <p className="text-xs text-gray-500">{document.fileName}</p>
          <p className="text-xs text-gray-400">
            Uploaded: {formatDate(document.uploadedAt)}
          </p>
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {getFileExtension(document.fileName)}
          </span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleView}
          className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center space-x-1"
          title="View document"
        >
          <Eye size={14} />
          <span>View</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-1"
          title="Download document"
        >
          <Download size={14} />
          <span>Download</span>
        </button>
        
        <button
          onClick={() => navigator.clipboard.writeText(document.url)}
          className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
          title="Copy URL"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
};

export default SocietyVerifications;
