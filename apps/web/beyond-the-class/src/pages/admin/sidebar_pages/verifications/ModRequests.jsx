import React, { useEffect, useState, useRef } from 'react';
import useUniversityData from '../../hooks/useUniversityData';
import axiosInstance from '../../../../config/users/axios.instance';

const TIME_PLANS = [
  { label: '6 Months', value: 'six_month' },
  { label: '1 Year', value: 'year' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function ModRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [timePlan, setTimePlan] = useState('six_month');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [approveReason, setApproveReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/super/users/admin/mod-request/all');
      setRequests(res.data.modRequests || []);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to fetch mod requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setTimePlan('six_month');
    setShowApproveDialog(true);
    setActionError('');
    setSuccessMsg('');
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectDialog(true);
    setActionError('');
    setSuccessMsg('');
  };

  const submitApprove = async () => {
    if (!selectedRequest) return;
    if (!approveReason.trim()) {
      setActionError('Promotion reason is required.');
      return;
    }
    setActionLoading(true);
    setActionError('');
    try {
      await axiosInstance.put('/api/super/users/admin/mod-request/handle', {
        requestId: selectedRequest._id,
        action: 'approve',
        timePlan,
        universityOrigin: selectedRequest.universityId?._id,
        campusOrigin: selectedRequest.campusId?._id,
        reason: approveReason,
      });
      setSuccessMsg('Request approved successfully.');
      setShowApproveDialog(false);
      setApproveReason('');
      fetchRequests();
    } catch (e) {
      setActionError(e?.response?.data?.error || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const submitReject = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      setActionError('Rejection reason is required.');
      return;
    }
    setActionLoading(true);
    setActionError('');
    try {
      await axiosInstance.put('/api/super/users/admin/mod-request/handle', {
        requestId: selectedRequest._id,
        action: 'reject',
        rejectionReason,
      });
      setSuccessMsg('Request rejected successfully.');
      setShowRejectDialog(false);
      fetchRequests();
    } catch (e) {
      setActionError(e?.response?.data?.error || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-background text-foreground rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Moderator Requests</h1>
      {error && <div className="mb-4 bg-destructive/10 text-destructive p-2 rounded border border-destructive/30">{error}</div>}
      {successMsg && <div className="mb-4 bg-green-100 text-green-700 p-2 rounded border border-green-200 dark:bg-green-900 dark:text-green-300">{successMsg}</div>}
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm bg-background text-foreground rounded-lg shadow">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="px-3 py-2 border">User</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">University</th>
                <th className="px-3 py-2 border">Campus</th>
                <th className="px-3 py-2 border">Requested At</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted-foreground">No requests found.</td>
                </tr>
              )}
              {requests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-accent">
                  <td className="px-3 py-2 border">{req.userId?.name || '-'}</td>
                  <td className="px-3 py-2 border">{req.userId?.universityEmail || '-'}</td>
                  <td className="px-3 py-2 border">{req.universityId?.name || '-'}</td>
                  <td className="px-3 py-2 border">{req.campusId?.name || '-'}</td>
                  <td className="px-3 py-2 border">{req.createdAt ? new Date(req.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-3 py-2 border">
                    {req.status === 'pending' && <span className="text-yellow-600 dark:text-yellow-400">Pending</span>}
                    {req.status === 'approved' && <span className="text-green-600 dark:text-green-400">Approved</span>}
                    {req.status === 'rejected' && <span className="text-destructive">Rejected</span>}
                  </td>
                  <td className="px-3 py-2 border">
                    {req.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          onClick={() => handleApprove(req)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors"
                          onClick={() => handleReject(req)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : req.status === 'rejected' ? (
                      <span title={req.rejectionReason || ''} className="text-xs text-destructive">{req.rejectionReason ? 'Reason: ' + req.rejectionReason : ''}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Dialog */}
      {showApproveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-background text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Approve Moderator Request</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Promotion Reason <span className="text-destructive">*</span></label>
              <textarea
                className="w-full bg-background border border-input text-foreground rounded px-2 py-1 min-h-[60px] focus-visible:ring-2 focus-visible:ring-ring"
                value={approveReason}
                onChange={e => setApproveReason(e.target.value)}
                disabled={actionLoading}
                placeholder="Enter reason for promotion..."
              />
              <label className="block mb-2 text-sm font-medium mt-4">Select Time Plan</label>
              <select
                className="w-full bg-background border border-input text-foreground rounded px-2 py-1 focus-visible:ring-2 focus-visible:ring-ring"
                value={timePlan}
                onChange={e => setTimePlan(e.target.value)}
                disabled={actionLoading}
              >
                {TIME_PLANS.map(plan => (
                  <option key={plan.value} value={plan.value}>{plan.label}</option>
                ))}
              </select>
            </div>
            {actionError && <div className="mb-2 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">{actionError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowApproveDialog(false)}
                disabled={actionLoading}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={submitApprove}
                disabled={actionLoading}
              >{actionLoading ? 'Approving...' : 'Approve'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-background text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Reject Moderator Request</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Rejection Reason</label>
              <textarea
                className="w-full bg-background border border-input text-foreground rounded px-2 py-1 min-h-[60px] focus-visible:ring-2 focus-visible:ring-ring"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                disabled={actionLoading}
              />
            </div>
            {actionError && <div className="mb-2 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">{actionError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowRejectDialog(false)}
                disabled={actionLoading}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-destructive text-white hover:bg-destructive/80"
                onClick={submitReject}
                disabled={actionLoading}
              >{actionLoading ? 'Rejecting...' : 'Reject'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserSearchBar({ onMakeMod, campusId }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef();
  const [promotionReason, setPromotionReason] = useState('');

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setError('');
    axiosInstance.get(`/api/super/users/search?name=${encodeURIComponent(debouncedQuery)}`)
      .then(res => {
        setResults(res.data.results || []);
        setShowDropdown(true);
      })
      .catch(e => setError(e?.response?.data?.error || 'Search failed'))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-md mb-6" ref={inputRef}>
      <input
        className="w-full dark:bg-gray-800 border rounded px-3 py-2"
        placeholder="Search user by name to make mod..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => { if (results.length) setShowDropdown(true); }}
      />
      {loading && <div className="absolute right-2 top-2 text-xs text-muted-foreground">Loading...</div>}
      {error && <div className="text-destructive text-xs mt-1">{error}</div>}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 border rounded w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
          {results.map(user => (
            <div key={user._id} className="flex bg-white dark:bg-gray-800 items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer">
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.universityEmail}</div>
              </div>
              <button
                className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/80"
                onClick={() => onMakeMod(user)}
              >Make Mod</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModRequests() {
  const { UniversitySelector, CampusSelector, currentCampus } = useUniversityData();
  const [showMakeModDialog, setShowMakeModDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [makeModTimePlan, setMakeModTimePlan] = useState('six_month');
  const [makeModLoading, setMakeModLoading] = useState(false);
  const [makeModError, setMakeModError] = useState('');
  const [makeModSuccess, setMakeModSuccess] = useState('');
  const [promotionReason, setPromotionReason] = useState('');

  const handleMakeMod = (user) => {
    setSelectedUser(user);
    setShowMakeModDialog(true);
    setMakeModTimePlan('six_month');
    setMakeModError('');
    setMakeModSuccess('');
  };

  const submitMakeMod = async () => {
    if (!selectedUser || !currentCampus?._id) {
      setMakeModError('User and campus are required.');
      return;
    }
    if (!promotionReason.trim()) {
      setMakeModError('Promotion reason is required.');
      return;
    }
    setMakeModLoading(true);
    setMakeModError('');
    try {
      await axiosInstance.put('/api/super/users/user/promote/mod', {
        userId: selectedUser._id,
        timePlan: makeModTimePlan,
        campusOrigin: currentCampus._id,
        universityOrigin: currentCampus.universityOrigin || '',
        reason: promotionReason,
      });
      setMakeModSuccess('User promoted to mod successfully.');
      setShowMakeModDialog(false);
      setPromotionReason('');
    } catch (e) {
      setMakeModError(e?.response?.data?.error || 'Failed to promote user');
    } finally {
      setMakeModLoading(false);
    }
  };

    return (
        <div>
      <div className="mb-4 flex gap-4 items-center">
            {UniversitySelector}
            {CampusSelector}
      </div>
      <UserSearchBar onMakeMod={handleMakeMod} campusId={currentCampus?._id} />
      <ModRequestsTable />

      {/* Make Mod Dialog */}
      {showMakeModDialog && (
        <div className="fixed bg-black/30  inset-0 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Promote User to Moderator</h2>
            <div className="mb-4">
              <div className="mb-2">User: <span className="font-medium">{selectedUser?.name}</span></div>
              <div className="mb-2 text-xs text-muted-foreground">{selectedUser?.universityEmail}</div>
              <label className="block mb-2 text-sm font-medium">Promotion Reason <span className="text-destructive">*</span></label>
              <textarea
                className="w-full bg-background border border-input text-foreground rounded px-2 py-1 min-h-[60px] focus-visible:ring-2 focus-visible:ring-ring"
                value={promotionReason}
                onChange={e => setPromotionReason(e.target.value)}
                disabled={makeModLoading}
                placeholder="Enter reason for promotion..."
              />
              <label className="block mb-2 text-sm font-medium mt-4">Select Time Plan</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={makeModTimePlan}
                onChange={e => setMakeModTimePlan(e.target.value)}
                disabled={makeModLoading}
              >
                {TIME_PLANS.map(plan => (
                  <option key={plan.value} value={plan.value}>{plan.label}</option>
                ))}
              </select>
            </div>
            {makeModError && <div className="mb-2 text-destructive text-sm">{makeModError}</div>}
            {makeModSuccess && <div className="mb-2 text-green-600 text-sm">{makeModSuccess}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground hover:bg-accent"
                onClick={() => setShowMakeModDialog(false)}
                disabled={makeModLoading}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={submitMakeMod}
                disabled={makeModLoading}
              >{makeModLoading ? 'Promoting...' : 'Promote'}</button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
}