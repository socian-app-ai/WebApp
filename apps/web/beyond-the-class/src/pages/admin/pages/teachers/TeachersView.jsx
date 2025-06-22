import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import toast from 'react-hot-toast';
import useUniversityData from '../../hooks/useUniversityData';
import { Star, Eye, EyeOff, MoreHorizontal, Shield, Users, Calendar, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { debounce } from 'lodash';

export default function TeachersView() {
    
    const { UniversitySelector, campus, currentUniversity,
        CampusSelector, currentCampus, setCurrentUniversity,
        DepartmentSelector, currentDepartment,
    } = useUniversityData();

    const [allTeachers, setAllTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Confirmation dialog state
    const [showHideDialog, setShowHideDialog] = useState(false);
    const [showUnhideDialog, setShowUnhideDialog] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [reason, setReason] = useState('');
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [filteredTeacher, setFilteredTeacher] = useState(null);

    // Reviews sheet state
    const [showReviewsSheet, setShowReviewsSheet] = useState(false);
    const [selectedTeacherForReviews, setSelectedTeacherForReviews] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsLimit] = useState(10);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);

    // Replies state
    const [expandedReplies, setExpandedReplies] = useState(new Set());
    const [repliesLoading, setRepliesLoading] = useState({});
    const [repliesData, setRepliesData] = useState({});

    // Nested replies state (replies to replies)
    const [expandedNestedReplies, setExpandedNestedReplies] = useState(new Set());
    const [nestedRepliesLoading, setNestedRepliesLoading] = useState({});
    const [nestedRepliesData, setNestedRepliesData] = useState({});

    // Hide/Unhide confirmation dialogs state
    const [showHideReviewDialog, setShowHideReviewDialog] = useState(false);
    const [showHideReplyDialog, setShowHideReplyDialog] = useState(false);
    const [showHideNestedReplyDialog, setShowHideNestedReplyDialog] = useState(false);
    const [selectedItemForHide, setSelectedItemForHide] = useState(null);
    const [hideReason, setHideReason] = useState('');
    const [hideLoading, setHideLoading] = useState(false);

    useEffect(() => {
        const fetchAllTeachers = async () => {
            try {
                if (!currentCampus?._id) {
                    setAllTeachers([]);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const response = await axiosInstance.get("/api/super/teachers/campus", {
                    params: { 
                        campusId: currentCampus._id,
                        page: page,
                        limit: limit
                    }
                });
                console.log("response.data", response)                          

                if (response?.data) {
                    setAllTeachers(response.data.teachers || []);
                    setPagination(response.data.pagination || {
                        total: 0,
                        page: 1,
                        limit: 25,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: false
                    });
                } else {
                    setAllTeachers([]);
                    setPagination({
                        total: 0,
                        page: 1,
                        limit: 25,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: false
                    });
                }
                
            } catch (error) {
                console.error('Error fetching teachers:', error);
                const errorMessage = error?.response?.data?.message || 'Failed to load teachers. Please try again later.';
                toast.error(errorMessage);
                setAllTeachers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTeachers();
    }, [currentCampus?._id, page, limit]);

    const handleHideTeacher = async (teacherId, reason) => {
        try {
            setActionLoading(true);
            const response = await axiosInstance.put(`/api/super/teachers/teacher/hide?teacherId=${teacherId}`, { reason });
            toast.success('Teacher hidden successfully');
            // Refresh the teachers list with current pagination
            const refreshResponse = await axiosInstance.get("/api/super/teachers/campus", {
                params: { 
                    campusId: currentCampus._id,
                    page: page,
                    limit: limit
                }
            });
            if (refreshResponse?.data) {
                setAllTeachers(refreshResponse.data.teachers || []);
                setPagination(refreshResponse.data.pagination || pagination);
            }
        } catch (error) {
            console.error('Error hiding teacher:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to hide teacher';
            toast.error(errorMessage);
        } finally {
            setActionLoading(false);
            setShowHideDialog(false);
            setSelectedTeacher(null);
            setReason('');
        }
    };

    const handleUnhideTeacher = async (teacherId, reason) => {
        try {
            setActionLoading(true);
            const response = await axiosInstance.put(`/api/super/teachers/teacher/unhide?teacherId=${teacherId}`, { reason });
            toast.success('Teacher unhidden successfully');
            // Refresh the teachers list with current pagination
            const refreshResponse = await axiosInstance.get("/api/super/teachers/campus", {
                params: { 
                    campusId: currentCampus._id,
                    page: page,
                    limit: limit
                }
            });
            if (refreshResponse?.data) {
                setAllTeachers(refreshResponse.data.teachers || []);
                setPagination(refreshResponse.data.pagination || pagination);
            }
        } catch (error) {
            console.error('Error unhiding teacher:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to unhide teacher';
            toast.error(errorMessage);
        } finally {
            setActionLoading(false);
            setShowUnhideDialog(false);
            setSelectedTeacher(null);
            setReason('');
        }
    };

    const handleHideClick = (teacher) => {
        console.log('Hide click triggered for teacher:', teacher.name);
        setSelectedTeacher(teacher);
        setShowHideDialog(true);
        setShowActionMenu(null);
        setReason(''); // Reset reason when opening dialog
    };

    const handleUnhideClick = (teacher) => {
        console.log('Unhide click triggered for teacher:', teacher.name);
        setSelectedTeacher(teacher);
        setShowUnhideDialog(true);
        setShowActionMenu(null);
        setReason(''); // Reset reason when opening dialog
    };

    const handleHideConfirm = () => {
        console.log('Hide confirm triggered with reason:', reason);
        if (selectedTeacher && reason.trim()) {
            handleHideTeacher(selectedTeacher._id, reason.trim());
        } else {
            toast.error('Please provide a reason for hiding the teacher');
        }
    };

    const handleUnhideConfirm = () => {
        console.log('Unhide confirm triggered with reason:', reason);
        if (selectedTeacher && reason.trim()) {
            handleUnhideTeacher(selectedTeacher._id, reason.trim());
        } else {
            toast.error('Please provide a reason for unhiding the teacher');
        }
    };

    const handleCancelAction = () => {
        console.log('Cancel action triggered');
        setShowHideDialog(false);
        setShowUnhideDialog(false);
        setSelectedTeacher(null);
        setReason('');
    };

    // Close dialogs when clicking outside
    const handleDialogBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancelAction();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    const generatePageNumbers = () => {
        const totalPages = pagination.totalPages;
        const currentPage = page;
        const pages = [];
        
        // Always show first page
        pages.push(1);
        
        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        if (start > 2) {
            pages.push('...');
        }
        
        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }
        
        if (end < totalPages - 1) {
            pages.push('...');
        }
        
        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim() || !currentCampus?._id) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            try {
                setSearchLoading(true);
                const response = await axiosInstance.get("/api/super/teachers/search", {
                    params: {
                        search: query.trim(),
                        campusId: currentCampus._id
                    }
                });
                console.log("response.data", response)

                if (response?.data?.teachers) {
                    setSearchResults(response.data.teachers);
                    setShowSearchResults(true);
                }
            } catch (error) {
                console.error('Error searching teachers:', error);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300),
        [currentCampus]
    );

    // Search effect
    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    // Reset search when campus changes
    useEffect(() => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
        setFilteredTeacher(null);
    }, [currentCampus]);

    // Click outside handler for search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSearchResults && !event.target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchResults]);

    // Handle search result selection
    const handleSearchResultSelect = (teacher) => {
        setSearchQuery(teacher.name);
        setShowSearchResults(false);
        setFilteredTeacher(teacher);
        
        // Scroll to the teacher in the main table
        const teacherElement = document.getElementById(`teacher-${teacher._id}`);
        if (teacherElement) {
            teacherElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            teacherElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
            setTimeout(() => {
                teacherElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900');
            }, 2000);
        }
    };

    // Clear search filter
    const clearSearchFilter = () => {
        setSearchQuery('');
        setFilteredTeacher(null);
        setSearchResults([]);
        setShowSearchResults(false);
    };

    // Get teachers to display (either filtered or all)
    const displayTeachers = filteredTeacher ? [filteredTeacher] : allTeachers;

    // Handle opening reviews sheet
    const handleOpenReviews = async (teacher) => {
        setSelectedTeacherForReviews(teacher);
        setShowReviewsSheet(true);
        setReviews([]);
        setReviewsPage(1);
        setHasMoreReviews(true);
        await fetchReviews(teacher._id, 1, true);
    };

    // Fetch reviews for a teacher
    const fetchReviews = async (teacherId, page = 1, reset = false) => {
        try {
            setReviewsLoading(true);
            const response = await axiosInstance.get("/api/super/teachers/mob/reviews/feedbacks", {
                params: {
                    id: teacherId,
                    page: page,
                    limit: reviewsLimit
                }
            });

            if (response?.data?.reviews) {
                if (reset) {
                    setReviews(response.data.reviews);
                } else {
                    setReviews(prev => [...prev, ...response.data.reviews]);
                }
                setHasMoreReviews(response.data.reviews.length === reviewsLimit);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    };

    // Load more reviews
    const loadMoreReviews = async () => {
        if (!selectedTeacherForReviews || reviewsLoading || !hasMoreReviews) return;
        
        const nextPage = reviewsPage + 1;
        setReviewsPage(nextPage);
        await fetchReviews(selectedTeacherForReviews._id, nextPage, false);
    };

    // Close reviews sheet
    const handleCloseReviews = () => {
        setShowReviewsSheet(false);
        setSelectedTeacherForReviews(null);
        setReviews([]);
        setReviewsPage(1);
        setHasMoreReviews(true);
        setExpandedReplies(new Set());
        setRepliesData({});
        setRepliesLoading({});
        setExpandedNestedReplies(new Set());
        setNestedRepliesData({});
        setNestedRepliesLoading({});
    };

    // Toggle replies expansion
    const toggleReplies = async (reviewId, feedbackCommentId) => {
        const newExpanded = new Set(expandedReplies);
        
        if (newExpanded.has(reviewId)) {
            // Collapse
            newExpanded.delete(reviewId);
            setExpandedReplies(newExpanded);
        } else {
            // Expand and load replies
            newExpanded.add(reviewId);
            setExpandedReplies(newExpanded);
            
            if (!repliesData[reviewId]) {
                await loadReplies(reviewId, feedbackCommentId);
            }
        }
    };

    // Load replies for a specific review
    const loadReplies = async (reviewId, feedbackCommentId, page = 1) => {
        try {
            setRepliesLoading(prev => ({ ...prev, [reviewId]: true }));
            
            const response = await axiosInstance.get("/api/super/teachers/reply/feedback", {
                params: {
                    feedbackCommentId: feedbackCommentId,
                    page: page,
                    limit: 10
                }
            });

            console.log("response", response)
            if (response?.data?.replies) {
                if (page === 1) {
                    setRepliesData(prev => ({
                        ...prev,
                        [reviewId]: {
                            replies: response.data.replies,
                            totalReplies: response.data.totalReplies,
                            currentPage: response.data.currentPage,
                            hasMore: response.data.replies.length === 10
                        }
                    }));
                } else {
                    setRepliesData(prev => ({
                        ...prev,
                        [reviewId]: {
                            ...prev[reviewId],
                            replies: [...prev[reviewId].replies, ...response.data.replies],
                            currentPage: response.data.currentPage,
                            hasMore: response.data.replies.length === 10
                        }
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading replies:', error);
            toast.error('Failed to load replies');
        } finally {
            setRepliesLoading(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    // Load more replies for a specific review
    const loadMoreReplies = async (reviewId, feedbackCommentId) => {
        const currentData = repliesData[reviewId];
        if (!currentData || !currentData.hasMore) return;
        
        await loadReplies(reviewId, feedbackCommentId, currentData.currentPage + 1);
    };

    // Toggle nested replies expansion
    const toggleNestedReplies = async (replyId, feedbackCommentId) => {
        const newExpanded = new Set(expandedNestedReplies);
        
        if (newExpanded.has(replyId)) {
            // Collapse
            newExpanded.delete(replyId);
            setExpandedNestedReplies(newExpanded);
        } else {
            // Expand and load nested replies
            newExpanded.add(replyId);
            setExpandedNestedReplies(newExpanded);
            
            if (!nestedRepliesData[replyId]) {
                await loadNestedReplies(replyId, feedbackCommentId);
            }
        }
    };

    // Load nested replies for a specific reply
    const loadNestedReplies = async (replyId, feedbackCommentId, page = 1) => {
        try {
            setNestedRepliesLoading(prev => ({ ...prev, [replyId]: true }));
            
            const response = await axiosInstance.get("/api/super/teachers/reply/reply/feedback", {
                params: {
                    feedbackCommentId: feedbackCommentId,
                    page: page,
                    limit: 10
                }
            });

            console.log("nested replies response", response);

            if (response?.data?.replies) {
                if (page === 1) {
                    setNestedRepliesData(prev => ({
                        ...prev,
                        [replyId]: {
                            replies: response.data.replies,
                            totalReplies: response.data.totalReplies,
                            currentPage: response.data.currentPage,
                            hasMore: response.data.replies.length === 10
                        }
                    }));
                } else {
                    setNestedRepliesData(prev => ({
                        ...prev,
                        [replyId]: {
                            ...prev[replyId],
                            replies: [...prev[replyId].replies, ...response.data.replies],
                            currentPage: response.data.currentPage,
                            hasMore: response.data.replies.length === 10
                        }
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading nested replies:', error);
            toast.error('Failed to load nested replies');
        } finally {
            setNestedRepliesLoading(prev => ({ ...prev, [replyId]: false }));
        }
    };

    // Load more nested replies for a specific reply
    const loadMoreNestedReplies = async (replyId, feedbackCommentId) => {
        const currentData = nestedRepliesData[replyId];
        if (!currentData || !currentData.hasMore) return;
        
        await loadNestedReplies(replyId, feedbackCommentId, currentData.currentPage + 1);
    };

    // Handle hide review click
    const handleHideReviewClick = (review) => {
        setSelectedItemForHide({
            type: 'review',
            data: review,
            teacherId: selectedTeacherForReviews._id
        });
        setShowHideReviewDialog(true);
        setHideReason('');
    };

    // Handle hide reply click
    const handleHideReplyClick = (reply, reviewId) => {
        setSelectedItemForHide({
            type: 'reply',
            data: reply,
            reviewId: reviewId
        });
        setShowHideReplyDialog(true);
        setHideReason('');
    };

    // Handle hide nested reply click
    const handleHideNestedReplyClick = (nestedReply, replyId) => {
        setSelectedItemForHide({
            type: 'nestedReply',
            data: nestedReply,
            replyId: replyId
        });
        setShowHideNestedReplyDialog(true);
        setHideReason('');
    };

    // Handle hide confirmation
    const handleHideReviewConfirm = async () => {
        if (!selectedItemForHide || !hideReason.trim()) return;

        try {
            setHideLoading(true);
            let response;

            switch (selectedItemForHide.type) {
                case 'review':
                    response = await axiosInstance.put("/api/super/teachers/teacher/reviews/feedbacks/hide", {
                        teacherId: selectedItemForHide.teacherId,
                        reviewId: selectedItemForHide.data._id,
                        reason: hideReason.trim()
                    });
                    break;
                case 'reply':
                    response = await axiosInstance.put(`/api/super/teachers/teacher/reply/feedback/hide?feedbackReviewId=${selectedItemForHide.data._id}`, {
                        reason: hideReason.trim()
                    });
                    break;
                case 'nestedReply':
                    response = await axiosInstance.put(`/api/super/teachers/teacher/reply/reply/feedback/hide?feedbackCommentId=${selectedItemForHide.data._id}`, {
                        reason: hideReason.trim()
                    });
                    break;
                default:
                    throw new Error('Invalid item type');
            }

            if (response?.status === 200 || response?.status === 201) {
                toast.success('Item hidden successfully');
                
                // Refresh the reviews data
                if (selectedTeacherForReviews) {
                    await fetchReviews(selectedTeacherForReviews._id, 1, true);
                }
                
                // Close all dialogs
                setShowHideReviewDialog(false);
                setShowHideReplyDialog(false);
                setShowHideNestedReplyDialog(false);
                setSelectedItemForHide(null);
                setHideReason('');
            }
        } catch (error) {
            console.error('Error hiding item:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to hide item';
            toast.error(errorMessage);
        } finally {
            setHideLoading(false);
        }
    };

    // Handle hide cancel
    const handleHideReviewCancel = () => {
        setShowHideReviewDialog(false);
        setShowHideReplyDialog(false);
        setShowHideNestedReplyDialog(false);
        setSelectedItemForHide(null);
        setHideReason('');
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
                    <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all teachers in the system
                    </p>
                </div>
            </div>

            {UniversitySelector}
            {CampusSelector}
            {DepartmentSelector}

            {/* Search Bar */}
            {currentCampus?._id && (
                <div className="relative search-container">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search teachers by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {searchLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black dark:border-white"></div>
                            ) : (
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>
                        {(searchQuery || filteredTeacher) && (
                            <button
                                onClick={clearSearchFilter}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filter Active Indicator */}
                    {filteredTeacher && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                Showing: {filteredTeacher.name}
                            </span>
                            <button
                                onClick={clearSearchFilter}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Clear filter
                            </button>
                        </div>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((teacher, index) => (
                                <div
                                    key={teacher._id || index}
                                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                                    onClick={() => {
                                        handleSearchResultSelect(teacher);
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-black dark:text-white">
                                                    {teacher.name}
                                                </div>
                                                {teacher.hiddenByMod && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {teacher.department?.name || teacher.department}
                                            </div>
                                            {teacher.email && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {teacher.email}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {teacher.rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {teacher.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                                {teacher.userAttachedBool ? 'Verified' : 'Unverified'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {showSearchResults && searchQuery.trim() && searchResults.length === 0 && !searchLoading && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                No teachers found matching "{searchQuery}"
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls - Top */}
            {!loading && allTeachers.length > 0 && !filteredTeacher && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Show:
                        </label>
                        <select
                            value={limit}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2"
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={75}>75</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            records per page
                        </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} teachers
                    </div>
                </div>
            )}

            {/* Filtered View Message */}
            {filteredTeacher && (
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        Showing filtered results for <span className="font-medium">{filteredTeacher.name}</span>
                    </div>
                    <button
                        onClick={clearSearchFilter}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Show all teachers
                    </button>
                </div>
            )}

            {/* Content */}
            {!allTeachers || allTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No teachers found</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        No teachers have been registered for this campus yet.
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Teacher
                                    </th>
                                   
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Department
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                                        Rating
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
                                {displayTeachers.map((teacher) => {
                                    // Null safety checks for teacher data
                                    if (!teacher || !teacher._id) {
                                        console.warn('Invalid teacher data:', teacher);
                                        return null;
                                    }

                                    return (
                                        <tr key={teacher._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" id={`teacher-${teacher._id}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={teacher.imageUrl || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                                            alt={teacher.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {teacher.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {teacher.email || "No email"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {teacher.department?.name || teacher.department}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleOpenReviews(teacher)}
                                                    className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                                                >
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {teacher.rating ? teacher.rating.toFixed(1) : '0.0'}
                                                    </span>
                                                    {teacher.ratingsByStudents && teacher.ratingsByStudents.length > 0 && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            ({teacher.ratingsByStudents.length})
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {teacher.hiddenByMod ? 'Hidden' : teacher.onLeave ? 'On Leave' : 'Active'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowActionMenu(showActionMenu === teacher._id ? null : teacher._id)}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {showActionMenu === teacher._id && (
                                                        <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg z-10">
                                                            <div className="py-1">
                                                                {(teacher.hiddenByMod || teacher.hiddenBySuper) ? (
                                                                    <button
                                                                        onClick={() => handleUnhideClick(teacher)}
                                                                        disabled={actionLoading}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        Unhide Teacher
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleHideClick(teacher)}
                                                                        disabled={actionLoading}
                                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
                                                                    >
                                                                        <EyeOff className="h-4 w-4" />
                                                                        Hide Teacher
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
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

            {/* Pagination Controls - Bottom */}
            {!loading && pagination.totalPages > 1 && !filteredTeacher && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page} of {pagination.totalPages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* First Page */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        
                        {/* Previous Page */}
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {generatePageNumbers().map((pageNum, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                                    disabled={pageNum === '...'}
                                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-8 px-3 ${
                                        pageNum === page
                                            ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                            : pageNum === '...'
                                            ? 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-400 cursor-default'
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        
                        {/* Next Page */}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pagination.totalPages}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        
                        {/* Last Page */}
                        <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            disabled={page === pagination.totalPages}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews Sheet */}
            {showReviewsSheet && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseReviews}
                    />
                    
                    {/* Sheet */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <img
                                    src={selectedTeacherForReviews?.imageUrl || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt={selectedTeacherForReviews?.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-sm text-black dark:text-white">
                                        {selectedTeacherForReviews?.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {selectedTeacherForReviews?.department?.name || selectedTeacherForReviews?.department}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseReviews}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto h-[calc(100vh-80px)]">
                            {reviewsLoading && reviews.length === 0 ? (
                                <div className="flex items-center justify-center p-6">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black dark:border-white"></div>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <Star className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                        No reviews yet
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        This teacher hasn't received any reviews yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-3">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                                            {/* Review Header */}
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={review.user.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                                        alt={review.user.name}
                                                        className="h-6 w-6 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium text-xs text-black dark:text-white">
                                                                {review.user.name}
                                                            </span>
                                                            {review.user.isVerified && (
                                                                <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {review.isAnonymous && (
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    (Anonymous)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-2.5 w-2.5 ${
                                                                            i < review.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300 dark:text-gray-600'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDate(review.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {review.upvoteCount > 0 && (
                                                        <span className="text-xs text-green-600 dark:text-green-400">
                                                            +{review.upvoteCount}
                                                        </span>
                                                    )}
                                                    {review.downvoteCount > 0 && (
                                                        <span className="text-xs text-red-600 dark:text-red-400">
                                                            -{review.downvoteCount}
                                                        </span>
                                                    )}
                                                    {/* Hide Review Button */}
                                                    <button
                                                        onClick={() => handleHideReviewClick(review)}
                                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                        title="Hide Review"
                                                    >
                                                        <svg className="h-3 w-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Review Content */}
                                            <div className="mb-2">
                                                <p className="text-xs text-gray-900 dark:text-white leading-relaxed">
                                                    {review.feedback}
                                                </p>
                                                {review.isEdited && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                                                        (edited)
                                                    </span>
                                                )}
                                            </div>

                                            {/* Teacher Response */}
                                            {review.teacherDirectComment && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 mb-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                                                            Teacher Response
                                                        </span>
                                                        <span className="text-xs text-blue-600 dark:text-blue-400">
                                                            {formatDate(review.teacherDirectComment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-blue-900 dark:text-blue-100">
                                                        {review.teacherDirectComment.text}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Replies Section */}
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Replies ({review.replies?.length || 0})
                                                    </span>
                                                    {(review.replies?.length > 0 || review.replies?.length === 0) && (
                                                        <button
                                                            onClick={() => toggleReplies(review._id, review._id)}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                                        >
                                                            {expandedReplies.has(review._id) ? 'Hide Replies' : 'View Replies'}
                                                            {repliesLoading[review._id] && (
                                                                <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Expanded Replies */}
                                                {expandedReplies.has(review._id) && (
                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                        {repliesLoading[review._id] && !repliesData[review._id] ? (
                                                            <div className="flex items-center justify-center py-3">
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 dark:border-gray-400"></div>
                                                            </div>
                                                        ) : repliesData[review._id]?.replies?.length > 0 ? (
                                                            <>
                                                                {repliesData[review._id].replies.map((reply) => (
                                                                    <div key={reply._id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 ml-3 border-l-2 border-gray-200 dark:border-gray-700">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                                {reply.user?.name || 'Unknown User'}
                                                                            </span>
                                                                            {reply.user?.universityEmailVerified && (
                                                                                <svg className="h-2.5 w-2.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                </svg>
                                                                            )}
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {formatDate(reply.createdAt)}
                                                                            </span>
                                                                            {/* Hide Reply Button */}
                                                                            <button
                                                                                onClick={() => handleHideReplyClick(reply, review._id)}
                                                                                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ml-auto"
                                                                                title="Hide Reply"
                                                                            >
                                                                                <svg className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                                                            {reply.comment}
                                                                        </p>
                                                                        {reply.gifUrl && (
                                                                            <img src={reply.gifUrl} alt="GIF" className="w-full h-auto mt-1 rounded" />
                                                                        )}

                                                                        {/* Nested Replies Section */}
                                                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                                    Replies ({reply.replies?.length || 0})
                                                                                </span>
                                                                                {(reply.replies?.length > 0 || reply.replies?.length === 0) && (
                                                                                    <button
                                                                                        onClick={() => toggleNestedReplies(reply._id, reply._id)}
                                                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                                                                    >
                                                                                        {expandedNestedReplies.has(reply._id) ? 'Hide Replies' : 'View Replies'}
                                                                                        {nestedRepliesLoading[reply._id] && (
                                                                                            <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
                                                                                        )}
                                                                                    </button>
                                                                                )}
                                                                            </div>

                                                                            {/* Expanded Nested Replies */}
                                                                            {expandedNestedReplies.has(reply._id) && (
                                                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                                    {nestedRepliesLoading[reply._id] && !nestedRepliesData[reply._id] ? (
                                                                                        <div className="flex items-center justify-center py-2">
                                                                                            <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-gray-600 dark:border-gray-400"></div>
                                                                                        </div>
                                                                                    ) : nestedRepliesData[reply._id]?.replies?.length > 0 ? (
                                                                                        <>
                                                                                            {nestedRepliesData[reply._id].replies.map((nestedReply) => (
                                                                                                <div key={nestedReply._id} className="bg-gray-100 dark:bg-gray-800/50 rounded p-1.5 ml-2 border-l border-gray-300 dark:border-gray-600">
                                                                                                    <div className="flex items-center gap-1 mb-0.5">
                                                                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                                                                            {nestedReply.user?.name || 'Unknown User'}
                                                                                                        </span>
                                                                                                        {nestedReply.user?.universityEmailVerified && (
                                                                                                            <svg className="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                                            </svg>
                                                                                                        )}
                                                                                                        <span className="text-xs text-gray-500 dark:text-gray-500">
                                                                                                            {formatDate(nestedReply.createdAt)}
                                                                                                        </span>
                                                                                                        {nestedReply.replyTo && (
                                                                                                            <span className="text-xs text-blue-500 dark:text-gray-500">
                                                                                                                → {nestedReply.replyTo?.name}
                                                                                                            </span>
                                                                                                        )}
                                                                                                        {/* Hide Nested Reply Button */}
                                                                                                        <button
                                                                                                            onClick={() => handleHideNestedReplyClick(nestedReply, reply._id)}
                                                                                                            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ml-auto"
                                                                                                            title="Hide Reply"
                                                                                                        >
                                                                                                            <svg className="h-2 w-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                                                        {nestedReply.comment}
                                                                                                    </p>
                                                                                                    {nestedReply.gifUrl && (
                                                                                                        <img src={nestedReply.gifUrl} alt="GIF" className="w-full h-auto mt-0.5 rounded" />
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                            
                                                                                            {/* Load More Nested Replies Button */}
                                                                                            {nestedRepliesData[reply._id]?.hasMore && (
                                                                                                <div className="flex justify-center pt-1">
                                                                                                    <button
                                                                                                        onClick={() => loadMoreNestedReplies(reply._id, reply._id)}
                                                                                                        disabled={nestedRepliesLoading[reply._id]}
                                                                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                                                                                                    >
                                                                                                        {nestedRepliesLoading[reply._id] ? 'Loading...' : 'Load More Replies'}
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="text-center py-2 text-xs text-gray-500 dark:text-gray-400">
                                                                                            No replies yet
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center py-3 text-xs text-gray-500 dark:text-gray-400">
                                                                No replies yet
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMoreReviews && (
                                        <div className="flex justify-center pt-3">
                                            <button
                                                onClick={loadMoreReviews}
                                                disabled={reviewsLoading}
                                                className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-3"
                                            >
                                                {reviewsLoading ? (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black dark:border-white"></div>
                                                ) : (
                                                    'Load More Reviews'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hide Teacher Confirmation Dialog */}
            {showHideDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDialogBackdropClick} />
                    <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Hide Teacher
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to hide <span className="font-medium">{selectedTeacher?.name}</span>? This action will hide the teacher from students.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for hiding
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for hiding this teacher..."
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelAction}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHideConfirm}
                                disabled={actionLoading || !reason.trim()}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-600 hover:bg-yellow-700 text-white h-10 px-4 py-2"
                            >
                                {actionLoading ? 'Hiding...' : 'Hide Teacher'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Unhide Teacher Confirmation Dialog */}
            {showUnhideDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDialogBackdropClick} />
                    <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Unhide Teacher
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to unhide <span className="font-medium">{selectedTeacher?.name}</span>? This action will make the teacher visible to students again.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for unhiding
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for unhiding this teacher..."
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelAction}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnhideConfirm}
                                disabled={actionLoading || !reason.trim()}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white h-10 px-4 py-2"
                            >
                                {actionLoading ? 'Unhiding...' : 'Unhide Teacher'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hide Review Confirmation Dialog */}
            {showHideReviewDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleHideReviewCancel} />
                    <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Hide Review
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to hide this review? This action will remove the review from the teacher's profile.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for hiding
                            </label>
                            <textarea
                                value={hideReason}
                                onChange={(e) => setHideReason(e.target.value)}
                                placeholder="Enter the reason for hiding this review..."
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleHideReviewCancel}
                                disabled={hideLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHideReviewConfirm}
                                disabled={hideLoading || !hideReason.trim()}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                            >
                                {hideLoading ? 'Hiding...' : 'Hide Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hide Reply Confirmation Dialog */}
            {showHideReplyDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleHideReviewCancel} />
                    <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Hide Reply
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to hide this reply? This action will remove the reply from the review.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for hiding
                            </label>
                            <textarea
                                value={hideReason}
                                onChange={(e) => setHideReason(e.target.value)}
                                placeholder="Enter the reason for hiding this reply..."
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleHideReviewCancel}
                                disabled={hideLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHideReviewConfirm}
                                disabled={hideLoading || !hideReason.trim()}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                            >
                                {hideLoading ? 'Hiding...' : 'Hide Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hide Nested Reply Confirmation Dialog */}
            {showHideNestedReplyDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleHideReviewCancel} />
                    <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Hide Reply
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to hide this reply? This action will remove the reply from the conversation.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for hiding
                            </label>
                            <textarea
                                value={hideReason}
                                onChange={(e) => setHideReason(e.target.value)}
                                placeholder="Enter the reason for hiding this reply..."
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleHideReviewCancel}
                                disabled={hideLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHideReviewConfirm}
                                disabled={hideLoading || !hideReason.trim()}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
                            >
                                {hideLoading ? 'Hiding...' : 'Hide Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
                    <div>Hide Dialog: {showHideDialog ? 'Open' : 'Closed'}</div>
                    <div>Unhide Dialog: {showUnhideDialog ? 'Open' : 'Closed'}</div>
                    <div>Selected Teacher: {selectedTeacher?.name || 'None'}</div>
                    <div>Reason: {reason || 'Empty'}</div>
                </div>
            )}
        </div>
    );
}
