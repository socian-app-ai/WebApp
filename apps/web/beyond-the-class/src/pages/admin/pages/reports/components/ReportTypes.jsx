import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../../config/users/axios.instance';
import toast from 'react-hot-toast';

const ReportTypes = () => {
    const [reportTypes, setReportTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchReportTypes();
    }, []);

    const fetchReportTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/api/super/report/types');
            if (response.data.success) {
                setReportTypes(response.data.reportTypes);
            }
        } catch (error) {
            toast.error('Failed to fetch report types');
            console.error('Error fetching report types:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/api/super/report/type/create', formData);
            if (response.data.success) {
                toast.success('Report type created successfully');
                setFormData({ name: '', description: '' });
                setShowCreateForm(false);
                fetchReportTypes();
            }
        } catch (error) {
            toast.error('Failed to create report type');
            console.error('Error creating report type:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this report type?')) return;

        try {
            const response = await axiosInstance.delete(`/api/super/report/type/${id}`);
            if (response.data.success) {
                toast.success('Report type deleted successfully');
                fetchReportTypes();
            }
        } catch (error) {
            toast.error('Failed to delete report type');
            console.error('Error deleting report type:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Report Types</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                    {showCreateForm ? 'Cancel' : 'Create New Type'}
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Create Report Type</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                placeholder="e.g., Harassment, Spam, Inappropriate Content"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                rows="3"
                                placeholder="Describe when this report type should be used"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Existing Report Types</h3>
                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : reportTypes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No report types found</div>
                    ) : (
                        <div className="space-y-3">
                            {reportTypes.map((type) => (
                                <div key={type._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{type.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(type._id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportTypes; 