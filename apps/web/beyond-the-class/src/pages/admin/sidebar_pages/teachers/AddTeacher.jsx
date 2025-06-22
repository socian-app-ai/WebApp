import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LabelFileInputCustomizable from '../../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../../components/TextField/LabelInputCustomizable';

export default function AddTeacher() {
    const [currentTeacher, setCurrentTeacher] = useState({});
    const [universities, setUniversities] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const { teacherId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await axiosInstance.get('/api/super/university/');
                setUniversities(res.data);
            } catch (error) {
                console.error('Error fetching universities:', error);
                setUniversities([]);
            }
        };

        const fetchTeacherData = async () => {
            if (teacherId) {
                try {
                    setLoading(true);
                    const res = await axiosInstance.get(`/api/super/teacher/${teacherId}`);
                    setCurrentTeacher(res.data);
                } catch (error) {
                    console.error("Error fetching teacher data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentTeacher({});
            }
        };

        fetchUniversities();
        fetchTeacherData();
    }, [teacherId]);

    const handleUniversityChange = async (universityId) => {
        setCurrentTeacher({ ...currentTeacher, university: universityId, campus: '', department: '' });
        setCampuses([]);
        setDepartments([]);

        if (universityId) {
            try {
                const res = await axiosInstance.get(`/api/super/university/${universityId}`);
                setCampuses(res.data.campuses || []);
            } catch (error) {
                console.error('Error fetching campuses:', error);
            }
        }
    };

    const handleCampusChange = async (campusId) => {
        setCurrentTeacher({ ...currentTeacher, campus: campusId, department: '' });
        setDepartments([]);

        if (campusId) {
            try {
                const res = await axiosInstance.get(`/api/super/campus/${campusId}`);
                setDepartments(res.data.departments || []);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (teacherId) {
                await axiosInstance.put(`/api/super/teacher/${teacherId}`, currentTeacher);
            } else {
                await axiosInstance.post('/api/super/teacher/register', currentTeacher);
            }
            navigate('/super/teachers');
        } catch (error) {
            console.error("Error saving teacher:", error);
        } finally {
            setSaving(false);
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
                    <h1 className="text-3xl font-bold tracking-tight">
                        {teacherId ? 'Edit Teacher' : 'Create New Teacher'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {teacherId ? 'Update teacher information' : 'Add a new teacher to the system'}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                >
                    {saving ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Teacher
                        </>
                    )}
                </button>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Basic Information</h2>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Full Name
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name="teacher-name"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter teacher's full name"
                                    value={currentTeacher.name || ''}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="email"
                                    name="email"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="teacher@university.com"
                                    value={currentTeacher.email || ''}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Phone Number
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="tel"
                                    name="phone"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="+92-XXX-XXXXXXX"
                                    value={currentTeacher.profile?.phone || ''}
                                    onChange={(e) => setCurrentTeacher({ 
                                        ...currentTeacher, 
                                        profile: { ...currentTeacher.profile, phone: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    CNIC
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name="cnic"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="XXXXX-XXXXXXX-X"
                                    value={currentTeacher.profile?.cnic || ''}
                                    onChange={(e) => setCurrentTeacher({ 
                                        ...currentTeacher, 
                                        profile: { ...currentTeacher.profile, cnic: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Institution Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Institution Information</h2>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    University
                                </label>
                                <select
                                    value={currentTeacher.university || ''}
                                    onChange={(e) => handleUniversityChange(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a university</option>
                                    {universities.map((university) => (
                                        <option key={university._id} value={university._id}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Campus
                                </label>
                                <select
                                    value={currentTeacher.campus || ''}
                                    onChange={(e) => handleCampusChange(e.target.value)}
                                    disabled={!currentTeacher.university}
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a campus</option>
                                    {campuses.map((campus) => (
                                        <option key={campus._id} value={campus._id}>
                                            {campus.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Department
                                </label>
                                <select
                                    value={currentTeacher.department || ''}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, department: e.target.value })}
                                    disabled={!currentTeacher.campus}
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a department</option>
                                    {departments.map((department) => (
                                        <option key={department._id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Media</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Profile Picture
                            </label>
                            <LabelFileInputCustomizable
                                divClassName="flex space-x-2 flex-row align-baseline items-start"
                                label=""
                                labelClassName="sr-only"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
