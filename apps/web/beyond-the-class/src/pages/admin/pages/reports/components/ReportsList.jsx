import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../../config/users/axios.instance';
import toast from 'react-hot-toast';

const ReportsList = ({ university, campus }) => {
    const [reports, setReports] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [modelTypes, setModelTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        reportTypeId: '',
        status: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalItems: 0,
        currentPage: 1
    });

    useEffect(() => {
        fetchReportTypes();
        fetchModelTypes();
    }, []);

    useEffect(() => {
        fetchReports();
    }, [filters, university, campus]);

    const fetchReportTypes = async () => {
        try {
            const response = await axiosInstance.get('/api/super/report/types');
            if (response.data.success) {
                setReportTypes(response.data.reportTypes);
            }
        } catch (error) {
            console.error('Error fetching report types:', error);
        }
    };

    const fetchModelTypes = async () => {
        try {
            const response = await axiosInstance.get('/api/super/report/model/types');
            if (response.data.success) {
                setModelTypes(response.data.reportModelTypes);
            }
        } catch (error) {
            console.error('Error fetching model types:', error);
        }
    };

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: filters.page,
                limit: filters.limit,
                ...(filters.reportTypeId && { reportTypeId: filters.reportTypeId }),
                ...(filters.status && { status: filters.status }),
                ...(university?._id && { universityId: university._id }),
                ...(campus?._id && { campusId: campus._id })
            });

            const response = await axiosInstance.get(`/api/super/report/reports?${params}`);
            if (response.data.success) {
                setReports(response.data.reports);
                setPagination({
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalItems,
                    currentPage: response.data.page
                });
            }
        } catch (error) {
            toast.error('Failed to fetch reports');
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBanReport = async (reportId, reason) => {
        try {
            const response = await axiosInstance.post(`/api/super/report/ban/${reportId}`, { reason });
            if (response.data.success) {
                toast.success('Item banned successfully');
                fetchReports();
            }
        } catch (error) {
            toast.error('Failed to ban item');
            console.error('Error banning item:', error);
        }
    };

    const handleUnbanReport = async (reportId) => {
        try {
            const response = await axiosInstance.post(`/api/super/report/unban/${reportId}`);
            if (response.data.success) {
                toast.success('Item unbanned successfully');
                fetchReports();
            }
        } catch (error) {
            toast.error('Failed to unban item');
            console.error('Error unbanning item:', error);
        }
    };

    const getReportedContent = (report) => {
        if (report.reportedPost?.length > 0) {
            return { type: 'Post', content: report.reportedPost[0] };
        }
        if (report.reportedComment?.length > 0) {
            return { type: 'Comment', content: report.reportedComment[0] };
        }
        if (report.reportedUser?.length > 0) {
            return { type: 'User', content: report.reportedUser[0] };
        }
        if (report.reportedSociety?.length > 0) {
            return { type: 'Society', content: report.reportedSociety[0] };
        }
        if (report.reportedFeedback?.length > 0) {
            return { type: 'Teacher Rating', content: report.reportedFeedback[0] };
        }
        if (report.reportedFeedbackComment?.length > 0) {
            return { type: 'Feedback Comment', content: report.reportedFeedbackComment[0] };
        }
        return { type: 'Unknown', content: null };
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Reports</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {reports.length} of {pagination.totalItems} reports
                    {university && ` • University: ${university.name}`}
                    {campus && ` • Campus: ${campus.name}`}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Report Type</label>
                        <select
                            value={filters.reportTypeId}
                            onChange={(e) => setFilters(prev => ({ ...prev, reportTypeId: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        >
                            <option value="">All Report Types</option>
                            {reportTypes.map((type) => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Items per page</label>
                        <select
                            value={filters.limit}
                            onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">Loading reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No reports found</div>
                    ) : (
                        <div className="space-y-4">
                            {reports.map((report) => {
                                const reportedContent = getReportedContent(report);
                                return (
                                    <div key={report._id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="font-medium">
                                                    Report Type: {report.reportTypeDetails?.[0]?.name || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Content Type: {reportedContent.type}
                                                </p>
                                                {report.reportedBy?.[0] && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Reported by: {report.reportedBy[0].name} ({report.reportedBy[0].universityEmail})
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {report.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Enter reason for banning:');
                                                                if (reason) {
                                                                    handleBanReport(report._id, reason);
                                                                }
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Ban
                                                        </button>
                                                        <button
                                                            onClick={() => handleUnbanReport(report._id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                                                        >
                                                            Reject Report
                                                        </button>
                                                    </>
                                                )}
                                                {report.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleUnbanReport(report._id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                                                    >
                                                        Unban
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {reportedContent.content && (
                                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                                <h4 className="font-medium text-sm mb-2">Reported Content:</h4>
                                                {reportedContent.type === 'Post' && (
                                                    <div>
                                                        <p className="font-medium">{reportedContent.content.title}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {reportedContent.content.body?.substring(0, 100)}...
                                                        </p>
                                                    </div>
                                                )}
                                                {reportedContent.type === 'User' && (
                                                    <p>{reportedContent.content.name} ({reportedContent.content.universityEmail})</p>
                                                )}
                                                {reportedContent.type === 'Society' && (
                                                    <p>{reportedContent.content.name}</p>
                                                )}
                                                {reportedContent.type === 'Comment' && (
                                                    <p className="text-sm">{reportedContent.content.text?.substring(0, 100)}...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsList; 