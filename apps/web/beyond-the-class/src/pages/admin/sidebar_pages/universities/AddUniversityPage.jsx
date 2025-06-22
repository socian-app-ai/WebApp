import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import useUniversityData from '../hooks/useUniversityData';
import LabelFileInputCustomizable from '../../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../../components/TextField/LabelInputCustomizable';
// import DepartmentsManager, { AcademicFormat, CreateCampusComponent, Departments } from '../components/CreateCampusComponent';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../config/users/axios.instance';

export default function AddUniversityPage() {
    // const [universities, setUniversities] = useState([]);
    // const [universityData, setUniversityData] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState({});
    // const [campusName, setCampusName] = useState('');
    // const [campusLocation, setCampusLocation] = useState('');
    // const [isNewUniversity, setIsNewUniversity] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const { universityId } = useParams();
    const navigate = useNavigate();

    // const { UniversitySelector, setCurrentUniversityData } = useUniversityData();

    useEffect(() => {
        if (universityId) {
            const fetchUniversityData = async () => {
                try {
                    setLoading(true);
                    const res = await axiosInstance.get(`/api/super/university/${universityId}`);
                    setCurrentUniversity(res.data);
                    // setIsNewUniversity(false);
                } catch (error) {
                    console.error("Error fetching university data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUniversityData();
        } else {
            // setIsNewUniversity(true);
            setCurrentUniversity({});
        }
    }, [universityId]);

    const handleSave = async () => {
        try {
            setSaving(true);
            if (universityId) {
                await axiosInstance.put(`/api/super/university/${universityId}`, currentUniversity);
            } else {
                await axiosInstance.post('/api/super/university/register', currentUniversity);
            }
            navigate('/super/universities');
        } catch (error) {
            console.error("Error saving university:", error);
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
                        {universityId ? 'Edit University' : 'Create New University'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {universityId ? 'Update university information' : 'Add a new university to the system'}
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
                            Save University
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
                                    University Name
                                </label>
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name="university-name"
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter university name"
                                    value={currentUniversity.name || ''}
                                    onChange={(e) => setCurrentUniversity({ ...currentUniversity, name: e.target.value })}
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
                                    value={currentUniversity.telephone || ''}
                                    onChange={(e) => setCurrentUniversity({ ...currentUniversity, telephone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Main Address
                            </label>
                            <LabelInputUnderLineCustomizable
                                type="text"
                                name="mainLocation-address"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter university address"
                                value={currentUniversity.mainLocationAddress || ''}
                                onChange={(e) => setCurrentUniversity({ ...currentUniversity, mainLocationAddress: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Admin Emails
                            </label>
                            <LabelInputUnderLineCustomizable
                                type="email"
                                name="admin-email"
                                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="admin@university.com"
                                value={currentUniversity.adminEmails || ''}
                                onChange={(e) => setCurrentUniversity({ ...currentUniversity, adminEmails: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Media</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                University Logo
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

            {/* Campus Section */}
            {/* <div>
                <h2 className="text-xl font-semibold">Add Campus</h2>
                <div className="flex flex-row space-x-2">
                    <div>
                        <input
                            type="text"
                            name="campusName"
                            placeholder="Campus Name"
                            value={campusName}
                            onChange={handleCampusChange}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="campusLocation"
                            placeholder="Campus Location"
                            value={campusLocation}
                            onChange={handleCampusChange}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setCurrentUniversity({
                                ...currentUniversity,
                                campuses: [
                                    ...currentUniversity.campuses,
                                    { name: campusName, location: campusLocation },
                                ],
                            });
                            setCampusName('');
                            setCampusLocation('');
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                        Add Campus
                    </button>
                </div>
                <div>
                    <h3 className="mt-4">Campuses List:</h3>
                    <ul>
                        {currentUniversity.campuses?.map((campus, index) => (
                            <li key={index}>{campus.name} - {campus.location}</li>
                        ))}
                    </ul>
                </div>
            </div> */}

            {/* Academic Format Section */}
            {/* <AcademicFormat /> */}

            {/* Departments Section */}
            {/* <Departments /> */}

            {/* Departments Manager */}
            {/* <DepartmentsManager /> */}
        </div>
    );
}

