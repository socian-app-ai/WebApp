import React, { useEffect, useState, useCallback } from 'react'
import axiosInstance from '../../../../../config/users/axios.instance';
import useUniversityData from '../../../hooks/useUniversityData';
import { Verified, Users, Calendar, Shield, Eye, EyeOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X, MoreHorizontal, Eye as EyeIcon, EyeOff as EyeOffIcon, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Societies() {
    const { UniversitySelector, campus, currentUniversity, CampusSelector, currentCampus, setCurrentUniversity } = useUniversityData(); 
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [showHideDialog, setShowHideDialog] = useState(false);
    const [showUnhideDialog, setShowUnhideDialog] = useState(false);
    const [selectedSociety, setSelectedSociety] = useState(null);
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isFilterMode, setIsFilterMode] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all', // all, active, hidden, deleted
        visibility: 'all', // all, public, private
        restriction: 'all', // all, restricted, unrestricted
        verified: 'all' // all, verified, unverified
    });

    // Members drawer state
    const [showMembersDrawer, setShowMembersDrawer] = useState(false);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedSocietyForMembers, setSelectedSocietyForMembers] = useState(null);
    
    // Pagination state for members
    const [membersPage, setMembersPage] = useState(1);
    const [membersLimit] = useState(20);
    const [membersPagination, setMembersPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [hasMoreMembers, setHasMoreMembers] = useState(true);
    const [searchingMembers, setSearchingMembers] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    
    // Member actions state
    const [showMemberActionMenu, setShowMemberActionMenu] = useState(null);
    const [memberActionLoading, setMemberActionLoading] = useState(false);

    const fetchData = async () => {
        try {
            if (!currentCampus?._id) {
                return;
            }

            setLoading(true);
            const response = await axiosInstance.get(`/api/super/societies/paginated?campusId=${currentCampus._id}&page=${page}&limit=${limit}`);
            
            if (response?.data) {
                setData(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching societies:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to load societies';
            toast.error(errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const searchSociety = async (searchTerm) => {
        try {
            if (!searchTerm.trim()) {
                setIsSearchMode(false);
                await fetchData();
                return;
            }
            const query = currentCampus?._id ? `?campusId=${currentCampus._id}&search=${encodeURIComponent(searchTerm.trim())}` : `?search=${encodeURIComponent(searchTerm.trim())}`;

            setSearchLoading(true);
            setIsSearchMode(true);
            
            const response = await axiosInstance.get(`/api/super/societies/search${query}`);
            
            if (response?.data) {
                setData(response.data);
            } else {
                throw new Error('Invalid search response format');
            }
        } catch (error) {
            console.error('Error searching societies:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to search societies';
            toast.error(errorMessage);
            setData(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const filterSocieties = async () => {
        try {
            // if (!currentCampus?._id) {
            //     return;
            // }

            // Check if any filter is not 'all'
            const hasActiveFilters = Object.values(filters).some(filter => filter !== 'all');
            
            if (!hasActiveFilters) {
                setIsFilterMode(false);
                await fetchData();
                return;
            }

            setFilterLoading(true);
            setIsFilterMode(true);
            
            const queryParams = new URLSearchParams({
                campusId: currentCampus._id,
                ...filters
            });

            const response = await axiosInstance.get(`/api/super/societies/filter?${queryParams}`);
            
            if (response?.data) {
                setData(response.data);
            } else {
                throw new Error('Invalid filter response format');
            }
        } catch (error) {
            console.error('Error filtering societies:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to filter societies';
            toast.error(errorMessage);
            setData(null);
        } finally {
            setFilterLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleApplyFilters = () => {
        setPage(1); // Reset to first page when applying filters
        filterSocieties();
    };

    const handleClearFilters = () => {
        setFilters({
            status: 'all',
            visibility: 'all',
            restriction: 'all',
            verified: 'all'
        });
        setIsFilterMode(false);
        setPage(1);
        fetchData();
    };

    const hideSociety = async (societyId, reason) => {
        try {
            setActionLoading(true);
            const response = await axiosInstance.put(`/api/super/societies/society/hide/${societyId}`, { reason });
            toast.success('Society hidden successfully');
            await fetchData();
            setShowHideDialog(false);
            setSelectedSociety(null);
            setReason('');
        } catch (error) {
            console.error('Error hiding society:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to hide society';
            toast.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const unhideSociety = async (societyId, reason) => {
        try {
            setActionLoading(true);
            const response = await axiosInstance.put(`/api/super/societies/society/unhide/${societyId}`, { reason });
            toast.success('Society unhidden successfully');
            await fetchData();
            setShowUnhideDialog(false);
            setSelectedSociety(null);
            setReason('');
        } catch (error) {
            console.error('Error unhiding society:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to unhide society';
            toast.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleHideClick = (society) => {
        setSelectedSociety(society);
        setShowHideDialog(true);
        setShowActionMenu(null);
    };

    const handleUnhideClick = (society) => {
        setSelectedSociety(society);
        setShowUnhideDialog(true);
        setShowActionMenu(null);
    };

    const handleHideConfirm = () => {
        if (selectedSociety && reason.trim()) {
            hideSociety(selectedSociety._id, reason.trim());
        } else {
            toast.error('Please provide a reason for hiding the society');
        }
    };

    const handleUnhideConfirm = () => {
        if (selectedSociety && reason.trim()) {
            unhideSociety(selectedSociety._id, reason.trim());
        } else {
            toast.error('Please provide a reason for unhiding the society');
        }
    };

    const handleCancelAction = () => {
        setShowHideDialog(false);
        setShowUnhideDialog(false);
        setSelectedSociety(null);
        setReason('');
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId;
            return (searchTerm) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    searchSociety(searchTerm);
                }, 500); // 500ms delay
            };
        })(),
        [currentCampus?._id]
    );

    useEffect(() => {
        if (search.trim()) {
            debouncedSearch(search);
        } else {
            setIsSearchMode(false);
            fetchData();
        }
    }, [search, currentCampus, page, limit]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        if (!value.trim()) {
            setIsSearchMode(false);
            setPage(1); // Reset to first page when clearing search
        }
    };

    const handleClearSearch = () => {
        setSearch('');
        setIsSearchMode(false);
        setPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    const generatePageNumbers = () => {
        if (!data) return [];
        
        const totalPages = data.totalPages;
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

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(filter => filter !== 'all').length;
    };

    const handleViewMembers = async (society) => {
        try {
            setSelectedSocietyForMembers(society);
            setShowMembersDrawer(true);
            setMembersLoading(true);
            setMemberSearch('');
            setMembersPage(1);
            setMembers([]);
            setFilteredMembers([]);
            setSearchResults([]);
            setHasMoreMembers(true);
            
            const response = await axiosInstance.get(`/api/super/societies/society/members?societyId=${society._id}&page=1&limit=${membersLimit}`);
            
            if (response?.data) {
                setMembers(response.data.members || []);
                setFilteredMembers(response.data.members || []);
                setMembersPagination(response.data.pagination || {
                    page: 1,
                    limit: membersLimit,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPrevPage: false
                });
                setHasMoreMembers(response.data.pagination?.hasNextPage || false);
            } else {
                setMembers([]);
                setFilteredMembers([]);
                setMembersPagination({
                    page: 1,
                    limit: membersLimit,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPrevPage: false
                });
                setHasMoreMembers(false);
            }
        } catch (error) {
            console.error('Error fetching society members:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch society members';
            toast.error(errorMessage);
            setMembers([]);
            setFilteredMembers([]);
            setHasMoreMembers(false);
        } finally {
            setMembersLoading(false);
        }
    };

    const handleMemberSearch = (searchTerm) => {
        setMemberSearch(searchTerm);
        
        if (!searchTerm.trim()) {
            setFilteredMembers(members);
            setSearchResults([]);
            setSearchingMembers(false);
            return;
        }
        
        // First search in local paginated records
        const localFiltered = members.filter(member => 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.universityEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.personalEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredMembers(localFiltered);
        
        // If no results found locally, search in API
        if (localFiltered.length === 0) {
            searchMembersInAPI(searchTerm);
        } else {
            setSearchResults([]);
            setSearchingMembers(false);
        }
    };

    const searchMembersInAPI = async (searchTerm) => {
        try {
            setSearchingMembers(true);
            const response = await axiosInstance.get(`/api/super/societies/society/search?memberName=${encodeURIComponent(searchTerm.trim())}&societyId=${selectedSocietyForMembers._id}`);
            
            if (response?.data) {
                setSearchResults(response.data.members || []);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching members in API:', error);
            setSearchResults([]);
        } finally {
            setSearchingMembers(false);
        }
    };

    const loadMoreMembers = async () => {
        if (!hasMoreMembers || membersLoading || !selectedSocietyForMembers) return;
        
        try {
            const nextPage = membersPage + 1;
            setMembersLoading(true);
            
            const response = await axiosInstance.get(`/api/super/societies/society/members?societyId=${selectedSocietyForMembers._id}&page=${nextPage}&limit=${membersLimit}`);
            
            if (response?.data) {
                const newMembers = response.data.members || [];
                setMembers(prev => [...prev, ...newMembers]);
                setFilteredMembers(prev => [...prev, ...newMembers]);
                setMembersPage(nextPage);
                setMembersPagination(response.data.pagination || membersPagination);
                setHasMoreMembers(response.data.pagination?.hasNextPage || false);
            }
        } catch (error) {
            console.error('Error loading more members:', error);
            toast.error('Failed to load more members');
        } finally {
            setMembersLoading(false);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMoreMembers && !membersLoading) {
            loadMoreMembers();
        }
    };

    const closeMembersDrawer = () => {
        setShowMembersDrawer(false);
        setSelectedSocietyForMembers(null);
        setMembers([]);
        setFilteredMembers([]);
        setSearchResults([]);
        setMemberSearch('');
        setMembersPage(1);
        setHasMoreMembers(true);
        setSearchingMembers(false);
        setShowMemberActionMenu(null);
    };

    const handleBanMember = async (member) => {
        try {
            setMemberActionLoading(true);
            const response = await axiosInstance.put(`/api/super/societies/society/ban-member`, {
                societyId: selectedSocietyForMembers._id,
                memberId: member._id
            });
            
            if (response?.data) {
                toast.success('Member banned successfully');
                // Refresh members list
                await handleViewMembers(selectedSocietyForMembers);
            }
        } catch (error) {
            console.error('Error banning member:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to ban member';
            toast.error(errorMessage);
        } finally {
            setMemberActionLoading(false);
            setShowMemberActionMenu(null);
        }
    };

    const handleUnbanMember = async (member) => {
        try {
            setMemberActionLoading(true);
            const response = await axiosInstance.put(`/api/super/societies/society/unban-member`, {
                societyId: selectedSocietyForMembers._id,
                memberId: member._id
            });
            
            if (response?.data) {
                toast.success('Member unbanned successfully');
                // Refresh members list
                await handleViewMembers(selectedSocietyForMembers);
            }
        } catch (error) {
            console.error('Error unbanning member:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to unban member';
            toast.error(errorMessage);
        } finally {
            setMemberActionLoading(false);
            setShowMemberActionMenu(null);
        }
    };

    const toggleMemberActionMenu = (memberId) => {
        setShowMemberActionMenu(showMemberActionMenu === memberId ? null : memberId);
    };

    return (
        <div className='p-6 bg-white dark:bg-black text-black dark:text-white min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Societies Management</h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-2'>Manage and monitor campus societies</p>
                </div>
                
                <div className='mb-6 space-y-4'>
                    {UniversitySelector}
                    {CampusSelector}
                </div>

                {/* Search and Filter Bar */}
                <div className='mb-6 space-y-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        {/* Search Bar */}
                        <div className='flex-1'>
                            <div className='relative max-w-md'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Search className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder='Search societies by name or description...'
                                    className='block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:border-transparent'
                                />
                                {search && (
                                    <button
                                        onClick={handleClearSearch}
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    >
                                        <X className='h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300' />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Toggle Button */}
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2'
                            >
                                <Filter className='mr-2 h-4 w-4' />
                                Filters
                                {getActiveFiltersCount() > 0 && (
                                    <span className='ml-2 inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-medium h-5 w-5'>
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className='bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                                {/* Status Filter */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className='w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2'
                                    >
                                        <option value='all'>All Statuses</option>
                                        <option value='active'>Active</option>
                                        <option value='hidden'>Hidden</option>
                                        <option value='deleted'>Deleted</option>
                                    </select>
                                </div>

                                {/* Visibility Filter */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Visibility
                                    </label>
                                    <select
                                        value={filters.visibility}
                                        onChange={(e) => handleFilterChange('visibility', e.target.value)}
                                        className='w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2'
                                    >
                                        <option value='all'>All Visibility</option>
                                        <option value='public'>Public</option>
                                        <option value='private'>Private</option>
                                    </select>
                                </div>

                                {/* Restriction Filter */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Restriction
                                    </label>
                                    <select
                                        value={filters.restriction}
                                        onChange={(e) => handleFilterChange('restriction', e.target.value)}
                                        className='w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2'
                                    >
                                        <option value='all'>All Restrictions</option>
                                        <option value='restricted'>Restricted</option>
                                        <option value='unrestricted'>Unrestricted</option>
                                    </select>
                                </div>

                                {/* Verification Filter */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Verification
                                    </label>
                                    <select
                                        value={filters.verified}
                                        onChange={(e) => handleFilterChange('verified', e.target.value)}
                                        className='w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2'
                                    >
                                        <option value='all'>All Verification</option>
                                        <option value='verified'>Verified</option>
                                        <option value='unverified'>Unverified</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className='flex gap-3 mt-6'>
                                <button
                                    onClick={handleApplyFilters}
                                    className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 h-10 px-4 py-2'
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-10 px-4 py-2'
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status Indicators */}
                    {(isSearchMode || isFilterMode) && (
                        <div className='flex flex-wrap gap-2'>
                            {isSearchMode && (
                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                    Searching for: <span className='font-medium'>"{search}"</span>
                                </div>
                            )}
                            {isFilterMode && (
                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                    Filtering: <span className='font-medium'>{getActiveFiltersCount()} active filters</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {(loading || searchLoading || filterLoading) && (
                    <div className='flex items-center justify-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white'></div>
                    </div>
                )}

                {data && !loading && !searchLoading && !filterLoading && (
                    <div className='space-y-6'>
                        {/* Pagination Controls - Top */}
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                    Show:
                                </label>
                                <select
                                    value={limit}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    disabled={isSearchMode || isFilterMode}
                                    className='rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={75}>75</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    records per page
                                </span>
                            </div>
                            
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                {isSearchMode ? (
                                    `Found ${data.societies?.length || 0} societies matching "${search}"`
                                ) : isFilterMode ? (
                                    `Found ${data.societies?.length || 0} societies matching filters`
                                ) : (
                                    `Showing ${((page - 1) * limit) + 1} to ${Math.min(page * limit, data.totalSocieties)} of ${data.totalSocieties} societies`
                                )}
                            </div>
                        </div>

                        {/* Societies Table */}
                        <div className='bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm'>
                            <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                                <h2 className='text-xl font-semibold'>
                                    {isSearchMode ? 'Search Results' : isFilterMode ? 'Filtered Results' : 'Societies Overview'}
                                </h2>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                    {data.societies?.length || 0} societies {isSearchMode ? 'found' : isFilterMode ? 'matching filters' : 'on this page'}
                                </p>
                            </div>
                            
                            <div className='min-h-screen overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gray-50 dark:bg-gray-900'>
                                        <tr>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Society Name</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Description</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Members</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Status</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Created</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Visibility</th>
                                            <th className='h-12 px-6 text-left align-middle font-medium text-gray-700 dark:text-gray-300 text-sm'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                                        {data.societies?.map((society) => (
                                            <tr key={society._id} className='hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-medium'>{society.name}</span>
                                                        {society.verified && (
                                                            <Verified className='w-4 h-4 text-green-600 dark:text-green-400' />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <p className='text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate'>
                                                        {society.description || 'No description'}
                                                    </p>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div onClick={() => handleViewMembers(society)}     className='flex items-center gap-2 cursor-pointer'>
                                                        <Users className='w-4 h-4 text-gray-500' />
                                                        <span className='text-sm font-medium'>{society.totalMembers}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        {society.isDeleted ? (
                                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'>
                                                                Deleted
                                                            </span>
                                                        ) : society.hiddenByMod || society.hiddenBySuper ? (
                                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'>
                                                                Hidden
                                                            </span>
                                                        ) : (
                                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'>
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <Calendar className='w-4 h-4 text-gray-500' />
                                                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                            {formatDate(society.createdAt)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        {society.visibilityNone ? (
                                                            <>
                                                                <EyeOff className='w-4 h-4 text-gray-500' />
                                                                <span className='text-sm text-gray-600 dark:text-gray-400'>Private</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className='w-4 h-4 text-gray-500' />
                                                                <span className='text-sm text-gray-600 dark:text-gray-400'>Public</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='relative'>
                                                        <button
                                                            onClick={() => setShowActionMenu(showActionMenu === society._id ? null : society._id)}
                                                            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2'
                                                        >
                                                            <MoreHorizontal className='h-4 w-4' />
                                                        </button>
                                                        
                                                        {showActionMenu === society._id && (
                                                            <div className='absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg z-10'>
                                                                <div className='py-1'>
                                                                    {society.hiddenByMod || society.hiddenBySuper ? (
                                                                        <button
                                                                            onClick={() => handleUnhideClick(society)}
                                                                            className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                                                                        >
                                                                            <EyeIcon className='h-4 w-4' />
                                                                            Unhide Society
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleHideClick(society)}
                                                                            className='flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                                                                        >
                                                                            <EyeOffIcon className='h-4 w-4' />
                                                                            Hide Society
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Controls - Bottom (only show in non-search/filter mode) */}
                        {!isSearchMode && !isFilterMode && data.totalPages > 1 && (
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                <div className='text-sm text-gray-600 dark:text-gray-400'>
                                    Page {page} of {data.totalPages}
                                </div>
                                
                                <div className='flex items-center gap-2'>
                                    {/* First Page */}
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={page === 1}
                                        className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2'
                                    >
                                        <ChevronsLeft className='h-4 w-4' />
                                    </button>
                                    
                                    {/* Previous Page */}
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2'
                                    >
                                        <ChevronLeft className='h-4 w-4' />
                                    </button>
                                    
                                    {/* Page Numbers */}
                                    <div className='flex items-center gap-1'>
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
                                        disabled={page === data.totalPages}
                                        className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2'
                                    >
                                        <ChevronRight className='h-4 w-4' />
                                    </button>
                                    
                                    {/* Last Page */}
                                    <button
                                        onClick={() => handlePageChange(data.totalPages)}
                                        disabled={page === data.totalPages}
                                        className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-8 px-2'
                                    >
                                        <ChevronsRight className='h-4 w-4' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!data && !loading && !searchLoading && !filterLoading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                            {isSearchMode ? 'No societies found' : isFilterMode ? 'No societies match filters' : 'No societies found'}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isSearchMode 
                                ? `No societies match your search for "${search}"`
                                : isFilterMode
                                ? 'Try adjusting your filter criteria'
                                : 'No societies have been created for this campus yet.'
                            }
                        </p>
                    </div>
                )}

                {/* Hide Society Confirmation Dialog */}
                {showHideDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                                        <EyeOffIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Hide Society
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This will hide the society from public view
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                    Are you sure you want to hide <span className="font-semibold">{selectedSociety?.name}</span>?
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reason for hiding
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter the reason for hiding this society..."
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleCancelAction}
                                    disabled={actionLoading}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white h-10 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleHideConfirm}
                                    disabled={actionLoading || !reason.trim()}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-600 hover:bg-yellow-700 text-white h-10 px-4 py-2"
                                >
                                    {actionLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Hiding...
                                        </div>
                                    ) : (
                                        'Hide Society'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Unhide Society Confirmation Dialog */}
                {showUnhideDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                        <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Unhide Society
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This will make the society visible again
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                    Are you sure you want to unhide <span className="font-semibold">{selectedSociety?.name}</span>?
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reason for unhiding
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter the reason for unhiding this society..."
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleCancelAction}
                                    disabled={actionLoading}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white h-10 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUnhideConfirm}
                                    disabled={actionLoading || !reason.trim()}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white h-10 px-4 py-2"
                                >
                                    {actionLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Unhiding...
                                        </div>
                                    ) : (
                                        'Unhide Society'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Drawer */}
                {showMembersDrawer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
                        <div className="bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 h-full w-full max-w-sm flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Society Members
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                        {selectedSocietyForMembers?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={closeMembersDrawer}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-7 w-7"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={memberSearch}
                                        onChange={(e) => handleMemberSearch(e.target.value)}
                                        placeholder="Search members..."
                                        className="block w-full pl-8 pr-8 py-1.5 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:border-transparent text-sm"
                                    />
                                    {memberSearch && (
                                        <button
                                            onClick={() => handleMemberSearch('')}
                                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                                        >
                                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Members List */}
                            <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                                {membersLoading && members.length === 0 ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"></div>
                                    </div>
                                ) : (memberSearch && searchResults.length > 0) ? (
                                    // Show API search results
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Search Results ({searchResults.length})
                                            </h4>
                                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                                From API search
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {searchResults.map((member, index) => (
                                                <div
                                                    key={member._id || index}
                                                    className="flex items-center gap-2.5 p-2.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                                >
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                                {member.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Member Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                                                {member.name || 'Unknown User'}
                                                            </p>
                                                            {member.verified && (
                                                                <Verified className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {member.universityEmail || member.personalEmail || 'No email'}
                                                        </p>
                                                        {member.personalEmail && member.universityEmail && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                                                {member.personalEmail}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Menu */}
                                                    <div className="flex-shrink-0 relative">
                                                        <button
                                                            onClick={() => toggleMemberActionMenu(member._id)}
                                                            disabled={memberActionLoading}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-6 w-6"
                                                        >
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </button>
                                                        
                                                        {showMemberActionMenu === member._id && (
                                                            <div className="absolute right-0 top-full mt-1 w-32 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg z-10">
                                                                <div className="py-1">
                                                                    {member.isBanned ? (
                                                                        <button
                                                                            onClick={() => handleUnbanMember(member)}
                                                                            disabled={memberActionLoading}
                                                                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            Unban
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleBanMember(member)}
                                                                            disabled={memberActionLoading}
                                                                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            Ban
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (filteredMembers.length > 0 || searchResults.length > 0) ? (
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Members ({memberSearch ? filteredMembers.length : membersPagination.total})
                                            </h4>
                                            {memberSearch && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Local search results
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {(memberSearch ? filteredMembers : members).map((member, index) => (
                                                <div
                                                    key={member._id || index}
                                                    className="flex items-center gap-2.5 p-2.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                                >
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                                {member.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Member Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                                                {member.name || 'Unknown User'}
                                                            </p>
                                                            {member.verified && (
                                                                <Verified className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                            )}
                                                            {member.isBanned && (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                                                                    Banned
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {member.universityEmail || member.personalEmail || 'No email'}
                                                        </p>
                                                        {member.personalEmail && member.universityEmail && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                                                {member.personalEmail}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Menu */}
                                                    <div className="flex-shrink-0 relative">
                                                        <button
                                                            onClick={() => toggleMemberActionMenu(member._id)}
                                                            disabled={memberActionLoading}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 h-6 w-6"
                                                        >
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </button>
                                                        
                                                        {showMemberActionMenu === member._id && (
                                                            <div className="absolute right-0 top-full mt-1 w-32 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg z-10">
                                                                <div className="py-1">
                                                                    {member.isBanned ? (
                                                                        <button
                                                                            onClick={() => handleUnbanMember(member)}
                                                                            disabled={memberActionLoading}
                                                                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50"
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            Unban
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleBanMember(member)}
                                                                            disabled={memberActionLoading}
                                                                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            Ban
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Loading more indicator */}
                                        {membersLoading && hasMoreMembers && (
                                            <div className="flex items-center justify-center py-3">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black dark:border-white"></div>
                                                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Loading more...</span>
                                            </div>
                                        )}
                                        
                                        {/* End of list indicator */}
                                        {!hasMoreMembers && members.length > 0 && (
                                            <div className="text-center py-3">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    No more members to load
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            {memberSearch ? 'No members found' : 'No members'}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            {memberSearch 
                                                ? `No members match your search for "${memberSearch}"`
                                                : 'This society has no members yet.'
                                            }
                                        </p>
                                        {searchingMembers && (
                                            <div className="mt-3 flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black dark:border-white"></div>
                                                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Searching...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>
                                        {memberSearch 
                                            ? `Search results: ${searchResults.length > 0 ? searchResults.length : filteredMembers.length}`
                                            : `Total: ${membersPagination.total} members`
                                        }
                                    </span>
                                    {!memberSearch && (
                                        <span>
                                            Loaded: {members.length} of {membersPagination.total}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
