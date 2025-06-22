import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UniversityView() {
    const [allUniversities, setAllUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUniversity = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/api/super/all-universities');
                
                // Null safety check for response data
                if (res?.data && Array.isArray(res.data)) {
                    setAllUniversities(res.data);
                } else {
                    console.warn('Invalid response format from universities API');
                    setAllUniversities([]);
                    toast.error('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching universities:', error);
                const errorMessage = error?.response?.data?.message || 'Failed to load universities. Please try again later.';
                toast.error(errorMessage);
                setAllUniversities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUniversity();
    }, []);

    const handleEditUniversity = (universityId) => {
        try {
            if (!universityId) {
                console.error('Invalid university ID provided');
                toast.error('Invalid university ID');
                return;
            }
            navigate(`/super/university/edit/${universityId}`);
        } catch (error) {
            console.error('Error navigating to edit university:', error);
            toast.error('Failed to navigate to edit page');
        }
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
                    <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all universities in the system
                    </p>
                </div>
                <Link 
                    to="/super/university/create" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add University
                </Link>
            </div>

            {/* Content */}
            {!allUniversities || allUniversities.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No universities found</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Get started by creating a new university.
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        University
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Location
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Campuses
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Users
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Status
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {allUniversities.map((university) => {
                                    // Null safety checks for university data
                                    if (!university || !university._id) {
                                        console.warn('Invalid university data:', university);
                                        return null;
                                    }

                                    return (
                                        <tr key={university._id} className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        {university.picture ? (
                                                            <img 
                                                                src={university.picture} 
                                                                alt={university.name || 'University'}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ display: university.picture ? 'none' : 'flex' }}>
                                                            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{university.name || 'Unnamed University'}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{university.telephone || 'No phone'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {university.mainLocationAddress || 'Not provided'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {Array.isArray(university.campuses) ? university.campuses.length : 0} campuses
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {Array.isArray(university.users) ? university.users.length : 0} users
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    university.registered?.isRegistered 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {university.registered?.isRegistered ? 'Registered' : 'Not Registered'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <button
                                                    onClick={() => handleEditUniversity(university._id)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3"
                                                >
                                                    <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
