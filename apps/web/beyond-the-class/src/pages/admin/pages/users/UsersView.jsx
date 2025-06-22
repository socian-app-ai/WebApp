import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import toast from 'react-hot-toast';

export default function UsersView() {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/api/super/all-users');
                
                // Null safety check for response data
                if (res?.data && Array.isArray(res.data)) {
                    setAllUsers(res.data);
                } else {
                    console.warn('Invalid response format from users API');
                    setAllUsers([]);
                    toast.error('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                const errorMessage = error?.response?.data?.message || 'Failed to load users. Please try again later.';
                toast.error(errorMessage);
                setAllUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

    const getRoleBadgeColor = (role) => {
        if (!role) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'super':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'teacher':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'student':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'alumni':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all users in the system
                    </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {Array.isArray(allUsers) ? allUsers.length : 0} users
                </div>
            </div>

            {/* Content */}
            {!allUsers || allUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No users found</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        No users have been registered yet.
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        User
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Email
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Role
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        University
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {allUsers.map((user) => {
                                    // Null safety checks for user data
                                    if (!user || !user._id) {
                                        console.warn('Invalid user data:', user);
                                        return null;
                                    }

                                    return (
                                        <tr key={user._id} className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                        {user.profilePicture ? (
                                                            <img 
                                                                src={user.profilePicture} 
                                                                alt={user.name || 'User'}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ display: user.profilePicture ? 'none' : 'flex' }}>
                                                            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name || 'Unnamed User'}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{user.phone || 'No phone'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">{user.email || 'No email'}</div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.role === 'super' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                    user.role === 'mod' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                                                    user.role === 'teacher' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    user.role === 'student' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="text-sm">
                                                    {user.university?.name || 'No university'}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.isVerified 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {user.isVerified ? 'Verified' : 'Not Verified'}
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
        </div>
    );
}
