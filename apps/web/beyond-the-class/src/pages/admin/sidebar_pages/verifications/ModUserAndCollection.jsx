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

function CampusModsTable({ campusId }) {
  const [mods, setMods] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoteLoading, setDemoteLoading] = useState(false);
  const [demoteError, setDemoteError] = useState('');
  const [demoteSuccess, setDemoteSuccess] = useState('');
  const [showDemoteDialog, setShowDemoteDialog] = useState(false);
  const [selectedMod, setSelectedMod] = useState(null);
  const [demoteReason, setDemoteReason] = useState('');

  useEffect(() => {
    if (!campusId) return;
    setLoading(true);
    setError('');
    setMods(null);
    axiosInstance.get(`/api/super/users/admin/mod-request/${campusId}`)
      .then(res => setMods(res.data.modcollection))
      .catch(e => setError(e?.response?.data?.error || 'Failed to fetch mods'))
      .finally(() => setLoading(false));
  }, [campusId, demoteSuccess]);

  const handleDemote = (mod) => {
    setSelectedMod(mod);
    setShowDemoteDialog(true);
    setDemoteError('');
    setDemoteSuccess('');
    setDemoteReason('');
  };

  const submitDemote = async () => {
    if (!selectedMod?.user?._id || !campusId) return;
    if (!demoteReason.trim()) {
      setDemoteError('Reason for demotion is required.');
      return;
    }
    setDemoteLoading(true);
    setDemoteError('');
    try {
      await axiosInstance.put('/api/super/users/user/demote/mod', {
        userId: selectedMod.user._id,
        campusOrigin: campusId,
        notModAnymoreReason: demoteReason,
      });
      setDemoteSuccess('User demoted from mod successfully.');
      setShowDemoteDialog(false);
      setSelectedMod(null);
      setDemoteReason('');
    } catch (e) {
      setDemoteError(e?.response?.data?.error || 'Failed to demote user');
    } finally {
      setDemoteLoading(false);
    }
  };

  if (!campusId) return null;
  return (
    <div className="my-6 bg-background rounded-lg border shadow p-4">
      <h2 className="text-lg font-semibold mb-2 text-foreground">Current & Previous Mods for Campus</h2>
      {loading && <div className="text-muted-foreground">Loading mods...</div>}
      {error && <div className="text-destructive mb-2 bg-destructive/10 p-2 rounded border border-destructive/30">{error}</div>}
      {demoteSuccess && <div className="mb-2 bg-green-100 text-green-700 p-2 rounded border border-green-200 dark:bg-green-900 dark:text-green-300">{demoteSuccess}</div>}
      {mods && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs bg-background text-foreground rounded-lg shadow">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="px-2 py-1 border">Type</th>
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Email</th>
                <th className="px-2 py-1 border">Start</th>
                <th className="px-2 py-1 border">End</th>
                <th className="px-2 py-1 border">Time Plan</th>
                <th className="px-2 py-1 border">Predefined End</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(mods.nowModUsers || []).map((mod, i) => (
                <tr key={mod.user?._id || i} className="border-b hover:bg-accent">
                    {console.log(mods)}
                  <td className="border px-2 py-1">Current</td>
                  <td className="border px-2 py-1">{mod.user?.name || '-'}</td>
                  <td className="border px-2 py-1">{mod.user?.universityEmail || '-'}</td>
                  <td className="border px-2 py-1">{mod.modUser?.startTime ? new Date(mod.modUser.startTime).toLocaleString() : '-'}</td>
                  <td className="border px-2 py-1">{mod.modUser?.endTime ? new Date(mod.modUser.endTime).toLocaleString() : '-'}</td>
                  <td className="border px-2 py-1">{mod.modUser?.timePeriod || '-'}</td>
                  <td className="border px-2 py-1">{mod.modUser?.predefinedEndTime ? new Date(mod.modUser.predefinedEndTime).toLocaleString() : '-'}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors"
                      onClick={() => handleDemote(mod)}
                    >Demote</button>
                  </td>
                </tr>
              ))}
              {(mods.prevModUsers || []).map((mod, i) => (
                <tr key={mod.user?._id + '_prev' || i} className="border-b hover:bg-accent">
                  <td className="border px-2 py-1">Previous</td>
                  <td className="border px-2 py-1">{mod.user?.name || '-'}</td>
                  <td className="border px-2 py-1">{mod.user?.universityEmail || '-'}</td>
                  <td className="border px-2 py-1">{mod.modUser?.startTime ? new Date(mod.modUser.startTime).toLocaleString() : '-'}</td>
                  <td className="border px-2 py-1">
                    {mod.modUser?.endTime ? new Date(mod.modUser.endTime).toLocaleString() : '-'}
                  </td>
                  <td className="border px-2 py-1">{mod.modUser?.timePeriod || '-'}</td>
                  <td className="border px-2 py-1 text-muted-foreground">{mod.modUser?.predefinedEndTime ? new Date(mod.modUser.predefinedEndTime).toLocaleString() : '-'}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors"
                      onClick={() => handleDemote(mod)}
                    >Demote</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Demote Dialog */}
      {showDemoteDialog && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Demote Moderator</h2>
            <div className="mb-4">
              <div className="mb-2">Are you sure you want to demote <span className="font-medium">{selectedMod?.user?.name}</span>?</div>
              <div className="mb-2 text-xs text-muted-foreground">{selectedMod?.user?.universityEmail}</div>
              <label className="block mb-2 text-sm font-medium">Reason for demotion <span className="text-destructive">*</span></label>
              <textarea
                className="w-full bg-background border border-input text-foreground rounded px-2 py-1 min-h-[60px] focus-visible:ring-2 focus-visible:ring-ring"
                value={demoteReason}
                onChange={e => setDemoteReason(e.target.value)}
                disabled={demoteLoading}
                placeholder="Enter reason for demotion..."
              />
            </div>
            {demoteError && <div className="mb-2 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">{demoteError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowDemoteDialog(false)}
                disabled={demoteLoading}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-destructive text-white hover:bg-destructive/80"
                onClick={submitDemote}
                disabled={demoteLoading}
              >{demoteLoading ? 'Demoting...' : 'Demote'}</button>
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

export default function ModUserAndCollection() {
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
    setPromotionReason('');
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
      <CampusModsTable campusId={currentCampus?._id} />

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
                placeholder="Enter promotion reason..."
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
