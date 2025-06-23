import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LabelFileInputCustomizable from '../../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../../components/TextField/LabelInputCustomizable';
import toast from 'react-hot-toast';

export default function AddTeacher() {
    const [currentTeacher, setCurrentTeacher] = useState({});
    const [universities, setUniversities] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [formData, setFormData] = useState({});

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
            try {
                const response = await axiosInstance.get(`/api/super/teachers/teacher/${teacherId}`);
                const teacher = response.data;
                
                setFormData({
                    name: teacher.name || '',
                    email: teacher.email || '',
                    universityOrigin: teacher.universityOrigin || '',
                    campusOrigin: teacher.campusOrigin || '',
                    department: teacher.department || '',
                    designation: teacher.designation || '',
                    phone: teacher.phone || '',
                    cnic: teacher.cnic || '',
                    office: teacher.office || '',
                    website: teacher.website || '',
                    researchInterests: teacher.researchInterests || '',
                    education: teacher.education || '',
                    experience: teacher.experience || '',
                    publications: teacher.publications || '',
                    awards: teacher.awards || '',
                    isHidden: teacher.isHidden || false
                });
                
                // Fetch campuses and departments for the selected university and campus
                if (teacher.universityOrigin) {
                    const campusResponse = await axiosInstance.get(`/api/super/university/${teacher.universityOrigin}/campuses`);
                    setCampuses(campusResponse.data);
                    
                    if (teacher.campusOrigin) {
                        const departmentResponse = await axiosInstance.get(`/api/super/campus/${teacher.campusOrigin}/departments`);
                        setDepartments(departmentResponse.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchUniversities();
                
                if (teacherId) {
                    await fetchTeacherData();
                } else {
                    // Initialize formData for new teacher
                    setFormData({
                        name: '',
                        email: '',
                        universityOrigin: '',
                        campusOrigin: '',
                        department: '',
                        designation: '',
                        phone: '',
                        cnic: '',
                        office: '',
                        website: '',
                        researchInterests: '',
                        education: '',
                        experience: '',
                        publications: '',
                        awards: '',
                        isHidden: false
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [teacherId]);

    const handleUniversityChange = async (universityId) => {
        setFormData({ 
            ...formData, 
            universityOrigin: universityId,
            campusOrigin: '', // Reset campus when university changes
            department: '' // Reset department when university changes
        });
        
        clearError('universityOrigin');
        clearError('campusOrigin');
        clearError('department');
        
        if (universityId) {
            try {
                const response = await axiosInstance.get(`/api/super/university/${universityId}/campuses`);
                setCampuses(response.data.campuses);
            } catch (error) {
                console.error('Error fetching campuses:', error);
                setCampuses([]);
            }
        } else {
            setCampuses([]);
        }
        setDepartments([]);
    };

    const handleCampusChange = async (campusId) => {
        setFormData({ 
            ...formData, 
            campusOrigin: campusId,
            department: '' // Reset department when campus changes
        });
        
        clearError('campusOrigin');
        clearError('department');
        
        if (campusId) {
            try {
                const response = await axiosInstance.get(`/api/super/campus/${campusId}/departments`);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartments([]);
            }
        } else {
            setDepartments([]);
        }
    };

    const handleSave = async () => {
        setShowErrors(true);
        
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        try {
            const teacherData = {
                name: formData.name,
                email: formData.email,
                universityOrigin: formData.universityOrigin,
                campusOrigin: formData.campusOrigin,
                department: formData.department,
                designation: formData.designation || '',
                phone: formData.phone || '',
                cnic: formData.cnic || '',
                office: formData.office || '',
                website: formData.website || '',
                researchInterests: formData.researchInterests || '',
                education: formData.education || '',
                experience: formData.experience || '',
                publications: formData.publications || '',
                awards: formData.awards || '',
                isHidden: formData.isHidden || false
            };

            if (teacherId) {
                await axiosInstance.put(`/api/super/teachers/teacher/update/${teacherId}`, teacherData);
            } else {
                await axiosInstance.post('/api/super/teachers/teacher/create', teacherData);
            }
            toast.success("Teacher saved successfully");
        } catch (error) {
            toast.error("Error saving teacher");
            console.error("Error saving teacher:", error);
        } finally {
            setSaving(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email || formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.universityOrigin) {
            newErrors.universityOrigin = 'University is required';
        }
        
        if (!formData.campusOrigin) {
            newErrors.campusOrigin = 'Campus is required';
        }
        
        if (!formData.department) {
            newErrors.department = 'Department is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearError(field);
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
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.name 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                    placeholder="Enter teacher's full name"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                                {showErrors && errors.name && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="email"
                                    name="email"
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.email 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                    placeholder="teacher@university.com"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                                {showErrors && errors.email && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                                )}
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
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                                    value={formData.cnic || ''}
                                    onChange={(e) => handleInputChange('cnic', e.target.value)}
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
                                    value={formData.universityOrigin || ''}
                                    onChange={(e) => handleUniversityChange(e.target.value)}
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.universityOrigin 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                >
                                    <option value="">Select a university</option>
                                    {universities.map((university) => (
                                        <option key={university._id} value={university._id}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>
                                {showErrors && errors.universityOrigin && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.universityOrigin}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Campus
                                </label>
                                <select
                                    value={formData.campusOrigin || ''}
                                    onChange={(e) => handleCampusChange(e.target.value)}
                                    disabled={!formData.universityOrigin}
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.campusOrigin 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                >
                                    <option value="">Select a campus</option>
                                    {campuses.map((campus) => (
                                        <option key={campus._id} value={campus._id}>
                                            {campus.name}
                                        </option>
                                    ))}
                                </select>
                                {showErrors && errors.campusOrigin && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.campusOrigin}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Department
                                </label>
                                <select
                                    value={formData.department || ''}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    disabled={!formData.campusOrigin}
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.department 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                >
                                    <option value="">Select a department</option>
                                    {departments.map((department) => (
                                        <option key={department._id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                {showErrors && errors.department && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.department}</p>
                                )}
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
