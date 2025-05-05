import React from 'react';
import { Plus, User, UserPlus, Users } from 'lucide-react';
import axiosInstance from '../../../../config/users/axios.instance';

import { useState } from 'react';
import LabelInputCustomizable from '../../../../components/TextField/LabelInputCustomizable';
import { useEffect } from 'react';
import { useToast } from '../../../../components/toaster/ToastCustom';

export default function CafeUsers() {
    const [cafes, setCafes] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToast } = useToast();

    // Form states
    const [selectedCafe, setSelectedCafe] = useState('');
    const [formType, setFormType] = useState('admin'); // 'admin' or 'employee'
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cafesRes, adminsRes] = await Promise.all([
                axiosInstance.get('/api/mod/cafe/all'),
                axiosInstance.get('/api/mod/cafe/admins')
            ]);
            setCafes(cafesRes.data.cafes || []);
            setAdmins(adminsRes.data.admins || []);
        } catch (err) {
            console.log(err);
            // setError(err.message);
            // addToast({
            //     title: 'Error',
            //     message: err.message,
            //     type: 'error'
            // });
            addToast(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = formType === 'admin' ? '/api/mod/cafe/create/admin' : '/api/mod/cafe/create/employee';
            const payload = {
                [`${formType}Name`]: formData.name,
                [`${formType}Username`]: formData.username,
                [`${formType}Email`]: formData.email,
                [`${formType}Phone`]: formData.phone,
                [`${formType}Password`]: formData.password,
                toAttachedCafeId: selectedCafe
            };

            const response = await axiosInstance.post(endpoint, payload);
            console.log(response);
            if (response.status === 200) {
                fetchData(); // Refresh data
                setFormData({ name: '', username: '', email: '', phone: '', password: '' });
                setSelectedCafe('');
            }
        } catch (err) {
            console.log(err);
            addToast(err?.response?.data?.message);
            // addToast(err.message);

            // setError(err.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cafe Users Management</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage cafe administrators and employees</p>
                    </div>
                </div>

                {/* Create User Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <button
                                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${formType === 'admin'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setFormType('admin')}
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Cafe Admin
                            </button>
                            <button
                                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${formType === 'employee'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setFormType('employee')}
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Cafe Employee
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <LabelInputCustomizable
                                    type="select"
                                    label="Select Cafe"
                                    value={selectedCafe}
                                    onChange={(e) => setSelectedCafe(e.target.value)}
                                    required={true}
                                    options={[
                                        { value: '', label: 'Choose a cafe' },
                                        ...cafes.map(cafe => ({
                                            value: cafe._id,
                                            label: cafe.name
                                        }))
                                    ]}
                                />

                                {Object.entries(formData).map(([key, value]) => (
                                    <LabelInputCustomizable
                                        key={key}
                                        type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        placeholder={`Enter ${key}`}
                                        value={value}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        required={true}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-200"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create {formType === 'admin' ? 'Admin' : 'Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Existing Users</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attached Cafe</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {admins.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {cafes.find(cafe => cafe._id === user.attachedCafe)?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
