import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../config/users/axios.instance';
import LabelFileInputCustomizable from '../../../../components/Upload/LabelFileInputCustomizable';

export default function TeachersBulkStore() {
    const [universities, setUniversities] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    
    const [formData, setFormData] = useState({
        universityOrigin: '',
        campusOrigin: '',
        department: '',
        csvFile: null,
        pictures: []
    });

    const [uploadResults, setUploadResults] = useState(null);

    // Fetch universities on component mount
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axiosInstance.get('/api/super/universities');
                setUniversities(response.data);
            } catch (error) {
                console.error('Error fetching universities:', error);
                toast.error('Failed to load universities');
            }
        };
        
        fetchUniversities();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.universityOrigin) {
            newErrors.universityOrigin = 'University is required';
        }
        
        if (!formData.campusOrigin) {
            newErrors.campusOrigin = 'Campus is required';
        }
        
        if (!formData.department) {
            newErrors.department = 'Department is required';
        }
        
        if (!formData.csvFile) {
            newErrors.csvFile = 'CSV file is required';
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
                toast.error('Failed to load campuses');
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
                toast.error('Failed to load departments');
            }
        } else {
            setDepartments([]);
        }
    };

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);
        if (field === 'csvFile') {
            const csvFile = files[0];
            if (csvFile && csvFile.type !== 'text/csv' && !csvFile.name.endsWith('.csv')) {
                toast.error('Please select a valid CSV file');
                return;
            }
            handleInputChange(field, csvFile);
        } else if (field === 'pictures') {
            handleInputChange(field, files);
        }
        clearError(field);
    };

    const handleUpload = async () => {
        setShowErrors(true);
        
        if (!validateForm()) {
            return;
        }
        
        setUploading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('csvFile', formData.csvFile);
            formDataToSend.append('universityOrigin', formData.universityOrigin);
            formDataToSend.append('campusOrigin', formData.campusOrigin);
            formDataToSend.append('department', formData.department);
            
            // Append pictures if any
            if (formData.pictures && formData.pictures.length > 0) {
                formData.pictures.forEach((picture, index) => {
                    formDataToSend.append('pictures', picture);
                });
            }

            const response = await axiosInstance.post('/api/super/teachers/teacher/bulk-upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadResults(response.data);
            
            if (response.data.successful && response.data.successful.length > 0) {
                toast.success(`Successfully uploaded ${response.data.successful.length} teachers`);
            }
            
            if (response.data.failed && response.data.failed.length > 0) {
                toast.error(`${response.data.failed.length} teachers failed to upload`);
            }

        } catch (error) {
            console.error('Error uploading teachers:', error);
            toast.error('Failed to upload teachers');
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = 'name,email\nJohn Doe,john.doe@university.com\nJane Smith,jane.smith@university.com';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teachers_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 p-6 bg-white dark:bg-black text-black dark:text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bulk Upload Teachers
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload multiple teachers using a CSV file
                    </p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Template
                </button>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                <div className="p-6 space-y-6">
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

                    {/* File Upload */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">File Upload</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    CSV File
                                </label>
                                <LabelFileInputCustomizable
                                    divClassName="flex space-x-2 flex-row align-baseline items-start"
                                    label=""
                                    labelClassName="sr-only"
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        showErrors && errors.csvFile 
                                            ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white'
                                    }`}
                                    accept=".csv"
                                    onChange={(e) => handleFileChange(e, 'csvFile')}
                                />
                                {showErrors && errors.csvFile && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.csvFile}</p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Upload a CSV file with columns: name, email
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Teacher Pictures (Optional)
                                </label>
                                <LabelFileInputCustomizable
                                    divClassName="flex space-x-2 flex-row align-baseline items-start"
                                    label=""
                                    labelClassName="sr-only"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e, 'pictures')}
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Upload teacher profile pictures (optional)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2"
                        >
                            {uploading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Teachers
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Results */}
            {uploadResults && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Upload Results</h2>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            {uploadResults.successful && uploadResults.successful.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-green-600 dark:text-green-400">
                                        Successful ({uploadResults.successful.length})
                                    </h3>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {uploadResults.successful.map((teacher, index) => (
                                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                                {teacher.name} ({teacher.email})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {uploadResults.failed && uploadResults.failed.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                                        Failed ({uploadResults.failed.length})
                                    </h3>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {uploadResults.failed.map((failure, index) => (
                                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                                {failure.name} ({failure.email}) - {failure.reason}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
