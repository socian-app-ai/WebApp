import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LabelFileInputCustomizable from '../../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../../components/TextField/LabelInputCustomizable';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../config/users/axios.instance';

export default function AddCampusPage() {
    const [currentCampus, setCurrentCampus] = useState({});
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const { campusId } = useParams();
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

        const fetchCampusData = async () => {
            if (campusId) {
                try {
                    setLoading(true);
                    const res = await axiosInstance.get(`/api/super/campus/${campusId}`);
                    setCurrentCampus(res.data);
                } catch (error) {
                    console.error("Error fetching campus data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentCampus({});
            }
        };

        fetchUniversities();
        fetchCampusData();
    }, [campusId]);

    const handleSave = async () => {
        try {
            setSaving(true);
            if (campusId) {
                    await axiosInstance.put(`/api/super/campus/${campusId}`, currentCampus);
            } else {
                await axiosInstance.post('/api/super/campus/register', currentCampus);
            }
            navigate('/super/campuses');
        } catch (error) {
            console.error("Error saving campus:", error);
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
                        {campusId ? 'Edit Campus' : 'Create New Campus'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {campusId ? 'Update campus information' : 'Add a new campus to the system'}
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
                            Save Campus
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
                                    Campus Name
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name="campus-name"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter campus name"
                                    value={currentCampus.name || ''}
                                    onChange={(e) => setCurrentCampus({ ...currentCampus, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Telephone
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name="telephone"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="042-XXXXXXX"
                                    value={currentCampus.telephone || ''}
                                    onChange={(e) => setCurrentCampus({ ...currentCampus, telephone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Location
                            </label>
                            <LabelInputUnderLineCustomizable
                                type="text"
                                name="location"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter campus location"
                                value={currentCampus.location || ''}
                                onChange={(e) => setCurrentCampus({ ...currentCampus, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Email Regex
                            </label>
                            <LabelInputUnderLineCustomizable
                                type="text"
                                name="regex"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="e.g. @cuilahore.edu.pk"
                                value={currentCampus?.regex || ''}
                                onChange={(e) => setCurrentCampus({ ...currentCampus, regex: e.target.value })}
                            />
                        </div>

                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Domain
                            </label>
                            <LabelInputUnderLineCustomizable
                                type="text"
                                name="domain"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g /^[a-z]{2}\d{2}-[a-z]{3}-\d{3}@cuilahore\.edu\.pk$/i"
                                value={currentCampus?.domain || ''}
                                onChange={(e) => setCurrentCampus({ ...currentCampus, domain: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                University
                            </label>
                            <select
                                value={currentCampus.universityOrigin || ''}
                                onChange={(e) => setCurrentCampus({ ...currentCampus, universityOrigin: e.target.value })}
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
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Media</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Campus Logo
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
