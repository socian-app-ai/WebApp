import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CampusView() {
    const [allCampuses, setAllCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [campusToDelete, setCampusToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllCampuses = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/api/super/all-campuses');
                
                // Null safety check for response data
                if (res?.data && Array.isArray(res.data)) {
                    setAllCampuses(res.data);
                } else {
                    console.warn('Invalid response format from campuses API');
                    setAllCampuses([]);
                    toast.error('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching campuses:', error);
                const errorMessage = error?.response?.data?.message || 'Failed to load campuses. Please try again later.';
                toast.error(errorMessage);
                setAllCampuses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllCampuses();
    }, []);

    const handleEditCampus = (campusId) => {
        try {
            if (!campusId) {
                console.error('Invalid campus ID provided');
                toast.error('Invalid campus ID');
                return;
            }
            navigate(`/super/campus/edit/${campusId}`);
        } catch (error) {
            console.error('Error navigating to edit campus:', error);
            toast.error('Failed to navigate to edit page');
        }
    };

    const handleDeleteClick = (campus) => {
        try {
            if (!campus || !campus._id) {
                toast.error('Invalid campus data');
                return;
            }
            setCampusToDelete(campus);
            setShowDeleteDialog(true);
        } catch (error) {
            console.error('Error opening delete dialog:', error);
            toast.error('Failed to open delete dialog');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!campusToDelete || !campusToDelete._id) {
                toast.error('Invalid campus data');
                return;
            }

            setDeleteLoading(true);
            const response = await axiosInstance.delete(`/api/super/campus/${campusToDelete._id}`);

            if (response?.data?.success) {
                toast.success('Campus deleted successfully!');
                // Remove the deleted campus from the list
                setAllCampuses(prev => prev.filter(campus => campus._id !== campusToDelete._id));
            } else {
                throw new Error('Failed to delete campus');
            }
        } catch (error) {
            console.error('Error deleting campus:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to delete campus. Please try again.';
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setShowDeleteDialog(false);
            setCampusToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setCampusToDelete(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-white dark:bg-black text-black dark:text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campuses</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all campuses in the system
                    </p>
                </div>
                <Link 
                    to="/super/campus/create" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Campus
                </Link>
            </div>

            {/* Content */}
            {!allCampuses || allCampuses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No campuses found</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Get started by creating a new campus.
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Campus
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        University
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Location
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Departments
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Teachers
                                    </th>
                                    {/* <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Status
                                    </th> */}
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {allCampuses.map((campus) => {
                                    // Null safety checks for campus data
                                    if (!campus || !campus._id) {
                                        console.warn('Invalid campus data:', campus);
                                        return null;
                                    }

                                    return (
                                        <tr key={campus._id} className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        {campus.picture ? (
                                                            <img 
                                                                src={campus.picture} 
                                                                alt={campus.name || 'Campus'}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ display: campus.picture ? 'none' : 'flex' }}>
                                                            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{campus.name || 'Unnamed Campus'}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{campus.telephone || 'No phone'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {campus.universityOrigin?.name || 'No university'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {campus.location || 'Not provided'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {Array.isArray(campus.departments) ? campus.departments.length : 0} departments
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {Array.isArray(campus.teachers) ? campus.teachers.length : 0} teachers
                                                </div>
                                            </td>
                                            {/* <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    campus.isDeleted     
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {campus.isDeleted ? 'Active' : 'Inactive'}
                                                </div>
                                            </td> */}
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditCampus(campus._id)}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3"
                                                    >
                                                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(campus)}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-200 dark:border-red-800 bg-white dark:bg-black hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 h-8 px-3"
                                                    >
                                                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Confirm Delete
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Are you sure you want to delete <span className="font-semibold">{campusToDelete?.name}</span>? 
                                This will permanently remove the campus and all associated data.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                            >
                                {deleteLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    'Delete Campus'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}