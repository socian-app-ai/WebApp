import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../../config/users/axios.instance';
import LabelInputCustomizable from '../../../../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../../../../components/Buttons/DarkButton';
import useUniversityData from '../../../hooks/useUniversityData';

export default function AddDepartmentAndSubjects() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const { campusId } = useParams();

    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [showDepBox, setShowDepBox] = useState(false);

    const [newSubjectName, setNewSubjectName] = useState('');
    const [showSubjectBox, setShowSubjectBox] = useState(false);

    const { UniversitySelector, campus, currentUniversity, CampusSelector, currentCampus, setCurrentUniversity } = useUniversityData();

    const fetchData = async (campusId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/super/campus/edit', {
                params: { campusId },
            });
            
            if (response?.data) {
                setData(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching campus data:', err);
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to load campus data';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campusId !== '0') {
            fetchData(campusId);
        } else {
            setLoading(false);
            if (currentUniversity && currentCampus && currentCampus._id) {
                fetchData(currentCampus._id);
            }
        }
    }, [campusId, currentCampus, currentUniversity]);

    const handleNwDepartmentSave = async () => {
        try {
            if (!newDepartmentName.trim()) {
                toast.error('Please enter a department name');
                return;
            }

            if (!data?.universityOrigin?._id) {
                toast.error('University data not available');
                return;
            }

            setSubmitting(true);
            const response = await axiosInstance.post('/api/super/department/', {
                universityId: data.universityOrigin._id,
                campusId: campusId === '0' ? currentCampus._id : campusId,
                name: newDepartmentName.trim()
            });

            if (response?.status === 200 && response?.data?.message?.name) {
                toast.success(`Department "${response.data.message.name}" created successfully!`);
                // Refresh data to show new department
                await fetchData(campusId === '0' ? currentCampus._id : campusId);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating department:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to create department';
            toast.error(errorMessage);
        } finally {
            setNewDepartmentName('');
            setShowDepBox(false);
            setSubmitting(false);
        }
    };

    const handleNwSubjectSave = async () => {
        try {
            if (!newSubjectName.trim()) {
                toast.error('Please enter a subject name');
                return;
            }

            if (!data?.universityOrigin?._id) {
                toast.error('University data not available');
                return;
            }

            if (!selectedDepartment?._id) {
                toast.error('Please select a department first');
                return;
            }

            setSubmitting(true);
            const response = await axiosInstance.post('/api/super/subject/create', {
                universityOrigin: data.universityOrigin._id,
                campusOrigin: campusId !== '0' ? campusId : currentCampus._id,
                departmentId: selectedDepartment._id,
                name: newSubjectName.trim()
            });

            if (response?.status === 200) {
                toast.success(`Subject "${newSubjectName}" created successfully!`);
                // Refresh data to show new subject
                await fetchData(campusId === '0' ? currentCampus._id : campusId);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating subject:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to create subject';
            toast.error(errorMessage);
        } finally {
            setNewSubjectName('');
            setShowSubjectBox(false);
            setSubmitting(false);
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
                    <h1 className="text-3xl font-bold tracking-tight">Department & Subject Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage departments and subjects for the selected campus
                    </p>
                </div>
            </div>

            {/* Selectors */}
            <div className="space-y-4">
                {UniversitySelector}
                {CampusSelector}
            </div>

            {/* Departments Section */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Departments</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage academic departments
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowDepBox(!showDepBox)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Department
                    </button>
                </div>

                {/* Add Department Form */}
                {showDepBox && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Add New Department</h3>
                        <div className="space-y-4">
                            <LabelInputCustomizable
                                type="text"
                                autoComplete="off"
                                className="w-full"
                                value={newDepartmentName}
                                label="Department Name"
                                placeholder="e.g., Computer Science"
                                width="w-full"
                                inputClassName="w-full"
                                onChange={(e) => {
                                    const titleCaseValue = e.target.value
                                        .toLowerCase()
                                        .replace(/\b\w/g, char => char.toUpperCase());
                                    setNewDepartmentName(titleCaseValue);
                                }}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleNwDepartmentSave}
                                    disabled={submitting || !newDepartmentName.trim()}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                                >
                                    {submitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save Department'
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDepBox(false);
                                        setNewDepartmentName('');
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.departments?.map(dep => (
                        <div 
                            key={dep._id} 
                            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{dep.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {Array.isArray(dep.subjects) ? dep.subjects.length : 0} subjects
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedDepartment(dep)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3"
                                >
                                    View Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {(!data?.departments || data.departments.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No departments found</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Get started by creating a new department.
                        </p>
                    </div>
                )}
            </section>

            {/* Subjects Section */}
            {selectedDepartment && (
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Subjects in {selectedDepartment.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage subjects for this department
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowSubjectBox(!showSubjectBox)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Subject
                        </button>
                    </div>

                    {/* Add Subject Form */}
                    {showSubjectBox && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
                            <div className="space-y-4">
                                <LabelInputCustomizable
                                    type="text"
                                    autoComplete="off"
                                    className="w-full"
                                    value={newSubjectName}
                                    label="Subject Name"
                                    placeholder="e.g., Introduction to Programming"
                                    width="w-full"
                                    inputClassName="w-full"
                                    onChange={(e) => {
                                        const titleCaseValue = e.target.value
                                            .toLowerCase()
                                            .replace(/\b\w/g, char => char.toUpperCase());
                                        setNewSubjectName(titleCaseValue);
                                    }}
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleNwSubjectSave}
                                        disabled={submitting || !newSubjectName.trim()}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black"></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            'Save Subject'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSubjectBox(false);
                                            setNewSubjectName('');
                                        }}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedDepartment.subjects?.map(sub => (
                            <div
                                key={sub._id}
                                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedSubject(sub)}
                            >
                                <h3 className="font-semibold text-lg">{sub.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Subject ID: {sub._id}
                                </p>
                            </div>
                        ))}
                    </div>

                    {(!selectedDepartment.subjects || selectedDepartment.subjects.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No subjects found</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Get started by creating a new subject for this department.
                            </p>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}








