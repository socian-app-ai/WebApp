import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../../config/users/axios.instance';
import toast from 'react-hot-toast';

const BannedItems = () => {
    const [bannedItems, setBannedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalItems: 0,
        currentPage: 1
    });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchBannedItems();
    }, [filters]);

    const fetchBannedItems = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: filters.page,
                limit: filters.limit
            });

            const response = await axiosInstance.get(`/api/super/report/banned-items?${params}`);
            if (response.data.success) {
                setBannedItems(response.data.bannedItems);
                setPagination({
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalItems,
                    currentPage: response.data.page
                });
            }
        } catch (error) {
            toast.error('Failed to fetch banned items');
            console.error('Error fetching banned items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnban = async (itemId, modelType) => {
        if (!confirm('Are you sure you want to unban this item?')) return;

        try {
            // For unbanning, we need to find the report associated with this banned item
            // This is a simplified approach - in a real scenario, you might want to 
            // create a dedicated unban endpoint that handles this more elegantly
            const reportId = itemId; // Assuming we can use the item ID or need to find the report ID
            
            const response = await axiosInstance.post(`/api/super/report/unban/${reportId}`);
            if (response.data.success) {
                toast.success('Item unbanned successfully');
                fetchBannedItems();
            }
        } catch (error) {
            toast.error('Failed to unban item');
            console.error('Error unbanning item:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const renderItemContent = (item) => {
        switch (item.modelType) {
            case 'Post':
                return (
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.body?.substring(0, 100)}...
                        </p>
                    </div>
                );
            case 'PostComment':
                return (
                    <div>
                        <p className="text-sm">{item.text?.substring(0, 100)}...</p>
                    </div>
                );
            case 'User':
                return (
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.universityEmail}
                        </p>
                    </div>
                );
            case 'Society':
                return (
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description?.substring(0, 100)}...
                        </p>
                    </div>
                );
            case 'TeacherRating':
                return (
                    <div>
                        <p className="font-medium">Teacher Rating</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Rating: {item.rating}/5
                        </p>
                    </div>
                );
            case 'FeedBackCommentTeacher':
                return (
                    <div>
                        <p className="font-medium">Teacher Feedback Comment</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.comment?.substring(0, 100)}...
                        </p>
                    </div>
                );
            default:
                return (
                    <div>
                        <p className="font-medium">{item.modelType}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Content details not available
                        </p>
                    </div>
                );
        }
    };

    const getModelTypeColor = (modelType) => {
        const colors = {
            'Post': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'PostComment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'User': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'Society': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'TeacherRating': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'FeedBackCommentTeacher': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
        };
        return colors[modelType] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Banned Items</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {bannedItems.length} of {pagination.totalItems} banned items
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4">Display Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Banned Items List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">Loading banned items...</div>
                    ) : bannedItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No banned items found</div>
                    ) : (
                        <div className="space-y-4">
                            {bannedItems.map((item) => (
                                <div key={`${item.modelType}-${item._id}`} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getModelTypeColor(item.modelType)}`}>
                                                    {item.modelType}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Banned: {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                {renderItemContent(item)}
                                            </div>
                                            {item.isReported?.reason && (
                                                <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Ban Reason:</p>
                                                    <p className="text-sm text-red-600 dark:text-red-300">{item.isReported.reason}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => handleUnban(item._id, item.modelType)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                                            >
                                                Unban
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Additional Info */}
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>ID: {item._id}</span>
                                            {item.reportId && (
                                                <span>Report ID: {item.reportId}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
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

export default BannedItems; 