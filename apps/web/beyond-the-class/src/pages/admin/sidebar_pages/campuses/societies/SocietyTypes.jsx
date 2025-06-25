import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../../config/users/axios.instance';

export default function SocietyTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Form data
  const [newTypeName, setNewTypeName] = useState('');
  const [editTypeName, setEditTypeName] = useState('');
  const [editTotalCount, setEditTotalCount] = useState('');

  // Fetch all types
  const fetchTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/super/societies/types');
      setTypes(response.data.types || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to fetch society types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Create new type
  const handleCreate = async () => {
    if (!newTypeName.trim()) {
      setFormError('Society type name is required');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    
    try {
      await axiosInstance.post('/api/super/societies/types/create', {
        type: newTypeName.trim()
      });
      
      setSuccessMsg('Society type created successfully');
      setShowCreateDialog(false);
      setNewTypeName('');
      fetchTypes();
    } catch (err) {
      setFormError(err?.response?.data || 'Failed to create society type');
    } finally {
      setFormLoading(false);
    }
  };

  // Update type
  const handleUpdate = async () => {
    if (!editTypeName.trim()) {
      setFormError('Society type name is required');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    
    try {
      await axiosInstance.put(`/api/super/societies/types/${selectedType._id}`, {
        type: editTypeName.trim(),
        totalCount: editTotalCount ? parseInt(editTotalCount) : undefined
      });
      
      setSuccessMsg('Society type updated successfully');
      setShowEditDialog(false);
      setSelectedType(null);
      setEditTypeName('');
      setEditTotalCount('');
      fetchTypes();
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Failed to update society type');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete type
  const handleDelete = async () => {
    setFormLoading(true);
    setFormError('');
    
    try {
      await axiosInstance.delete(`/api/super/societies/types/${selectedType._id}`);
      
      setSuccessMsg('Society type deleted successfully');
      setShowDeleteDialog(false);
      setSelectedType(null);
      fetchTypes();
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Failed to delete society type');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (type) => {
    setSelectedType(type);
    setEditTypeName(type.societyType);
    setEditTotalCount(type.totalCount || '');
    setShowEditDialog(true);
    setFormError('');
  };

  // Handle delete button click
  const handleDeleteClick = (type) => {
    setSelectedType(type);
    setShowDeleteDialog(true);
    setFormError('');
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-background text-foreground rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Society Types Management</h1>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          onClick={() => {
            setShowCreateDialog(true);
            setNewTypeName('');
            setFormError('');
          }}
        >
          Add New Type
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-destructive/10 text-destructive p-3 rounded border border-destructive/30">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded border border-green-200 dark:bg-green-900 dark:text-green-300">
          {successMsg}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading society types...</div>
      ) : (
        /* Types Table */
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm bg-background text-foreground rounded-lg shadow">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="px-4 py-3 border text-left">Society Type</th>
                <th className="px-4 py-3 border text-left">Total Count</th>
                <th className="px-4 py-3 border text-left">Created At</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    No society types found. Create your first society type!
                  </td>
                </tr>
              ) : (
                types.map((type) => (
                  <tr key={type._id} className="border-b hover:bg-accent">
                    <td className="px-4 py-3 border font-medium">{type.societyType}</td>
                    <td className="px-4 py-3 border">{type.totalCount || 0}</td>
                    <td className="px-4 py-3 border">
                      {type.createdAt ? new Date(type.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                          onClick={() => handleEditClick(type)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors text-xs"
                          onClick={() => handleDeleteClick(type)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New Society Type</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Type Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className="w-full bg-background border border-input text-foreground rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                disabled={formLoading}
                placeholder="Enter society type name..."
              />
            </div>
            {formError && (
              <div className="mb-4 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">
                {formError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowCreateDialog(false)}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCreate}
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Society Type</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Type Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className="w-full bg-background border border-input text-foreground rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring"
                value={editTypeName}
                onChange={(e) => setEditTypeName(e.target.value)}
                disabled={formLoading}
                placeholder="Enter society type name..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Total Count</label>
              <input
                type="number"
                className="w-full bg-background border border-input text-foreground rounded px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring"
                value={editTotalCount}
                onChange={(e) => setEditTotalCount(e.target.value)}
                disabled={formLoading}
                placeholder="Enter total count (optional)..."
                min="0"
              />
            </div>
            {formError && (
              <div className="mb-4 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">
                {formError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowEditDialog(false)}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleUpdate}
                disabled={formLoading}
              >
                {formLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 text-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Society Type</h2>
            <div className="mb-6">
              <p>Are you sure you want to delete the society type:</p>
              <p className="font-medium text-destructive mt-2">"{selectedType?.societyType}"</p>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            </div>
            {formError && (
              <div className="mb-4 bg-destructive/10 text-destructive text-sm p-2 rounded border border-destructive/30">
                {formError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-accent border border-border"
                onClick={() => setShowDeleteDialog(false)}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/80"
                onClick={handleDelete}
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
