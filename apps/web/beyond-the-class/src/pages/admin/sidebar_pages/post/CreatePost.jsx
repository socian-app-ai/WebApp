import React, { useState } from 'react';
import useUniversityData from '../../hooks/useUniversityData';
import axiosInstance from '../../../../config/users/axios.instance';
import toast from 'react-hot-toast';

export default function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        body: '',
        universityOrigin: '',
        campusOrigin: '',
        forCampus: false,
        forUniversity: false,
        forAllUniversites: false,
        files: []
    });

    const [targetType, setTargetType] = useState('university'); // 'university', 'campus', 'all'
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState('');

    const {
        UniversitySelector,
        CampusSelector,
        currentUniversity,
        currentCampus,
        universities,
        campuses
    } = useUniversityData();

    const validateForm = () => {
        const newErrors = {};
        
        if (!post.title || post.title.trim() === '') {
            newErrors.title = 'Title is required';
        }
        
        if (!post.body || post.body.trim() === '') {
            newErrors.body = 'Post content is required';
        }
        
        // Validate target selection based on targetType
        if (targetType === 'university' && !post.universityOrigin) {
            newErrors.target = 'University is required';
        } else if (targetType === 'campus' && !post.campusOrigin) {
            newErrors.target = 'Campus is required';
        } else if (targetType === 'all') {
            // No validation needed for "all universities"
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

    const clearApiError = () => {
        setApiError('');
    };

    const handleInputChange = (field, value) => {
        setPost(prev => ({ ...prev, [field]: value }));
        clearError(field);
        clearApiError();
    };

    const handleTargetTypeChange = (type) => {
        setTargetType(type);
        clearError('target');
        clearApiError();
        
        // Reset all target flags and set the appropriate one
        setPost(prev => ({ 
            ...prev, 
            universityOrigin: '',
            campusOrigin: '',
            forCampus: false,
            forUniversity: false,
            forAllUniversites: false
        }));
        
        // Set the appropriate flag based on target type
        if (type === 'university') {
            setPost(prev => ({ ...prev, forUniversity: true }));
        } else if (type === 'campus') {
            setPost(prev => ({ ...prev, forCampus: true }));
        } else if (type === 'all') {
            setPost(prev => ({ ...prev, forAllUniversites: true }));
        }
    };

    const handleUniversityChange = (event, value) => {
        // Call the original onChange handler from useUniversityData to load campuses
        if (UniversitySelector.props.onChange) {
            UniversitySelector.props.onChange(event, value);
        }
        
        setPost(prev => ({ 
            ...prev, 
            universityOrigin: value ? value._id : '',
            campusOrigin: '' // Reset campus when university changes
        }));
        clearError('target');
        clearApiError();
    };

    const handleCampusChange = (event, value) => {
        // Call the original onChange handler from useUniversityData
        if (CampusSelector.props.onChange) {
            CampusSelector.props.onChange(event, value);
        }
        
        setPost(prev => ({ 
            ...prev, 
            campusOrigin: value ? value._id : ''
        }));
        clearError('target');
        clearApiError();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPost(prev => ({ ...prev, files }));
        clearError('files');
        clearApiError();
    };

    const handleSave = async () => {
        setShowErrors(true);
        setApiError('');
        
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('body', post.body);
            
            // Add target-specific fields based on targetType
            if (targetType === 'university' && post.universityOrigin) {
                formData.append('universityOrigin', post.universityOrigin);
                formData.append('forUniversity', 'true');
                formData.append('forCampus', 'false');
                formData.append('forAllUniversites', 'false');
            } else if (targetType === 'campus' && post.campusOrigin) {
                formData.append('campusOrigin', post.campusOrigin);
                formData.append('forCampus', 'true');
                formData.append('forUniversity', 'false');
                formData.append('forAllUniversites', 'false');
            } else if (targetType === 'all') {
                formData.append('forAllUniversites', 'true');
                formData.append('forCampus', 'false');
                formData.append('forUniversity', 'false');
            }
            
            // Append files if any
            if (post.files && post.files.length > 0) {
                post.files.forEach((file) => {
                    formData.append('file', file);
                });
            }

            const response = await axiosInstance.post('/api/super/post/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Post created successfully!');
            
            // Reset form
            setPost({
                title: '',
                body: '',
                universityOrigin: '',
                campusOrigin: '',
                forCampus: false,
                forUniversity: false,
                forAllUniversites: false,
                files: []
            });
            setTargetType('university');
            setShowErrors(false);
            setErrors({});
            setApiError('');

        } catch (error) {
            console.error('Error creating post:', error);
            
            // Handle different types of errors
            if (error.response) {
                const errorMessage = error.response.data;
                if (typeof errorMessage === 'string') {
                    setApiError(errorMessage);
                } else if (errorMessage.message) {
                    setApiError(errorMessage.message);
                } else {
                    setApiError('Failed to create post. Please try again.');
                }
            } else if (error.request) {
                setApiError('Network error. Please check your connection and try again.');
            } else {
                setApiError('An unexpected error occurred. Please try again.');
            }
            
            toast.error('Failed to create post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Create Admin Post
                            </h1>
                            <p className="text-muted-foreground">
                                Create a post for universities and campuses
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            {saving ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Post
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* API Error Display */}
                {apiError && (
                    <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-destructive">Error Creating Post</h3>
                                <p className="mt-1 text-sm text-destructive/90">{apiError}</p>
                            </div>
                            <button
                                onClick={clearApiError}
                                className="text-destructive/70 hover:text-destructive transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Post Information Card */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <h2 className="text-lg font-semibold text-foreground">Post Information</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                        Post Title <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            showErrors && errors.title 
                                                ? 'border-destructive focus-visible:ring-destructive' 
                                                : ''
                                        }`}
                                        placeholder="Enter post title"
                                        value={post.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                    />
                                    {showErrors && errors.title && (
                                        <div className="flex items-center space-x-2 text-sm text-destructive">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{errors.title}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                        Post Content <span className="text-destructive">*</span>
                                    </label>
                                    <textarea
                                        className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                                            showErrors && errors.body 
                                                ? 'border-destructive focus-visible:ring-destructive' 
                                                : ''
                                        }`}
                                        placeholder="Write your post content here..."
                                        value={post.body}
                                        onChange={(e) => handleInputChange('body', e.target.value)}
                                    />
                                    {showErrors && errors.body && (
                                        <div className="flex items-center space-x-2 text-sm text-destructive">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{errors.body}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Target Selection Card */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <h2 className="text-lg font-semibold text-foreground">Target Selection</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                        Choose Target <span className="text-destructive">*</span>
                                    </label>
                                    
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="targetType"
                                                value="university"
                                                checked={targetType === 'university'}
                                                onChange={() => handleTargetTypeChange('university')}
                                                className="h-4 w-4 text-primary border-input focus:ring-primary"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">Specific University</span>
                                                <span className="text-xs text-muted-foreground">Post will be visible to all campuses of the selected university</span>
                                            </div>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="targetType"
                                                value="campus"
                                                checked={targetType === 'campus'}
                                                onChange={() => handleTargetTypeChange('campus')}
                                                className="h-4 w-4 text-primary border-input focus:ring-primary"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">Specific Campus</span>
                                                <span className="text-xs text-muted-foreground">Post will be visible only to the selected campus</span>
                                            </div>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="targetType"
                                                value="all"
                                                checked={targetType === 'all'}
                                                onChange={() => handleTargetTypeChange('all')}
                                                className="h-4 w-4 text-primary border-input focus:ring-primary"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">All Universities</span>
                                                <span className="text-xs text-muted-foreground">Post will be visible to all universities and campuses</span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    {showErrors && errors.target && (
                                        <div className="flex items-center space-x-2 text-sm text-destructive">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{errors.target}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Conditional Target Selection Fields */}
                                {targetType === 'university' && (
                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                            Select University <span className="text-destructive">*</span>
                                        </label>
                                        <div>
                                            {React.cloneElement(UniversitySelector, {
                                                onChange: handleUniversityChange,
                                                value: currentUniversity
                                            })}
                                        </div>
                                    </div>
                                )}

                                {targetType === 'campus' && (
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                                Select University (Optional)
                                            </label>
                                            <div>
                                                {React.cloneElement(UniversitySelector, {
                                                    onChange: handleUniversityChange,
                                                    value: currentUniversity
                                                })}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                                Select Campus <span className="text-destructive">*</span>
                                            </label>
                                            <div>
                                                {React.cloneElement(CampusSelector, {
                                                    onChange: handleCampusChange,
                                                    value: currentCampus
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {targetType === 'all' && (
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/50">
                                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-muted-foreground">
                                                This post will be visible to all universities and campuses in the system.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media Upload Card */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <h2 className="text-lg font-semibold text-foreground">Media (Optional)</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                        Images/Videos
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">Images or videos (MAX. 50MB each)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*,video/*"
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Upload images or videos to accompany your post (optional)
                                    </p>
                                </div>

                                {post.files && post.files.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-foreground">Selected Files</h4>
                                            <span className="text-xs text-muted-foreground">{post.files.length} file(s)</span>
                                        </div>
                                        <div className="space-y-2">
                                            {post.files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 rounded-md border border-input bg-background">
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        <span className="text-sm text-foreground">{file.name}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
