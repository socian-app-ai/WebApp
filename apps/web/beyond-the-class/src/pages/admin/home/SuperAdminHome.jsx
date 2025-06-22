import CustomAutocomplete from '../../../components/FilterOption/CustomAutocomplete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, createFilterOptions } from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../config/users/axios.instance';

export default function SuperAdminHome() {
    const [universities, setUniversities] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState(null);
    const [campus, setCampus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get("/api/super/university/");
                
                // Null safety check for response data
                if (response?.data && Array.isArray(response.data)) {
                    setUniversities(response.data);
                } else {
                    console.warn('Invalid response format from universities API');
                    setUniversities([]);
                }
            } catch (error) {
                console.error('Error fetching universities:', error.message);
                setError(error?.response?.data?.message || 'Failed to load universities. Please try again later.');
                setUniversities([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleUniversityChange = (event, value) => {
        try {
            setCurrentUniversity(value || null);

            if (value && value.campuses && Array.isArray(value.campuses)) {
                setCampus(value.campuses);
            } else {
                setCampus([]);
            }
        } catch (error) {
            console.error('Error handling university change:', error);
            setCurrentUniversity(null);
            setCampus([]);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 p-6 bg-white dark:bg-black text-black dark:text-white">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Error Loading Dashboard</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-white dark:bg-black text-black dark:text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage universities and campuses across the system
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                        to="/super/university/create"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add University
                    </Link>
                    <Link 
                        to="/super/campus/create"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Add Campus
                    </Link>
                </div>
            </div>

            {/* University Selector */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Select University</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose a university to view its campuses and manage them
                        </p>
                    </div>
                    <CustomAutocomplete
                        options={universities || []}
                        label="Universities"
                        onChange={handleUniversityChange}
                        filterOptions={filterOptionsUniversites}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    />
                </div>
            </div>

            {/* University Details */}
            {currentUniversity && (
                <div className="space-y-6">
                    {/* University Info */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {currentUniversity.picture ? (
                                    <img 
                                        src={currentUniversity.picture} 
                                        alt={currentUniversity.name || 'University'}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ display: currentUniversity.picture ? 'none' : 'flex' }}>
                                    <svg className="h-8 w-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{currentUniversity.name || 'Unnamed University'}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{currentUniversity.mainLocationAddress || 'No address provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Campuses */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Campuses</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Manage campuses for {currentUniversity.name || 'this university'}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {Array.isArray(campus) ? campus.length : 0} campus{Array.isArray(campus) && campus.length !== 1 ? 'es' : ''}
                                </div>
                            </div>

                            {!campus || campus.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                        <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h4 className="mt-4 text-lg font-semibold">No campuses found</h4>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        This university doesn't have any campuses yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {campus.map((campusItem) => {
                                        // Null safety checks for campus data
                                        if (!campusItem || !campusItem._id) {
                                            console.warn('Invalid campus data:', campusItem);
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={campusItem._id}
                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        campusItem.registered?.isRegistered 
                                                            ? 'bg-green-500' 
                                                            : 'bg-red-500'
                                                    }`}></div>
                                                    <div>
                                                        <h4 className="font-medium">{campusItem.name || 'Unnamed Campus'}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{campusItem.location || 'No location'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3">
                                                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </button>
                                                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3">
                                                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const filterOptionsUniversites = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option?.name || '',
});











