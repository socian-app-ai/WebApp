import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useUniversityData from '../hooks/useUniversityData';
import LabelFileInputCustomizable from '../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../components/TextField/LabelInputCustomizable';
import DepartmentsManager, { AcademicFormat, CreateCampusComponent, Departments } from '../components/CreateCampusComponent';
import { useNavigate } from 'react-router-dom';

export default function AddCampusPage() {
    // const [universities, setUniversities] = useState([]);
    // const [universityData, setUniversityData] = useState([]);
    const [currentUniversityData, setCurrentUniversityData] = useState({});
    const [campusName, setCampusName] = useState('');
    const [campusLocation, setCampusLocation] = useState('');

    const { campusId } = useParams();
    const navigate = useNavigate();

    const { UniversitySelector, campus, currentUniversity, setCurrentUniversity } = useUniversityData();

    console.log(currentUniversity, "or\n", currentUniversityData._id)
    useEffect(() => {
        if (campusId) {
            const fetchUniversityData = async () => {
                try {
                    const res = await axios.get(`/api/campus/${campusId}`);
                    setCurrentUniversityData(res.data);

                } catch (error) {
                    console.error("Error fetching university data:", error);
                }
            };
            fetchUniversityData();
        } else {
            setCurrentUniversityData(currentUniversity);
        }
    }, [campusId, currentUniversity]);


    const handleSave = async () => {
        try {
            if (campusId) {
                await axios.put(`/api/university/${campusId}`, currentUniversityData);

            } else {
                await axios.post('/api/university/register', currentUniversityData);
            }
            navigate('/admin/universities');
        } catch (error) {
            console.error("Error saving university:", error);
        }
    };

    const handleCampusChange = (e) => {
        const { name, value } = e.target;
        if (name === 'campusName') setCampusName(value);
        if (name === 'campusLocation') setCampusLocation(value);
    };

    return (
        <div className="space-y-2">
            {/* Save button */}
            <div className="relative">
                <button
                    className="absolute top-1 right-1 border p-1 mx-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg text-sm"
                    onClick={handleSave}
                >
                    Save this
                </button>
            </div>

            {/* University Selector */}
            {!campusId && UniversitySelector}

            {/* University Details Section */}
            <div>
                <h1 className="text-2xl font-bold mb-4">{(!campusId) ? 'Create New University' : 'Edit University'}</h1>
                <hr />
                <div className="flex flex-row items-baseline space-x-2">
                    <p>Name: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="university-name"
                        className="m-0"
                        placeholder="University Name"
                        value={currentUniversityData.name || ''}
                        onChange={(e) => setCurrentUniversityData({ ...currentUniversityData, name: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Address: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="mainLocation-address"
                        className="my-2"
                        placeholder="University Address"
                        value={currentUniversityData.mainLocationAddress || ''}
                        onChange={(e) => setCurrentUniversityData({ ...currentUniversityData, mainLocationAddress: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Telephone: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="telephone"
                        className="my-2"
                        placeholder="042-XXXXXXX"
                        value={currentUniversityData.telephone || ''}
                        onChange={(e) => setCurrentUniversityData({ ...currentUniversityData, telephone: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Admin Emails: </p>
                    <LabelInputUnderLineCustomizable
                        type="email"
                        name="admin-email"
                        className="my-2"
                        placeholder="admin@university.com"
                        value={currentUniversityData.adminEmails || ''}
                        onChange={(e) => setCurrentUniversityData({ ...currentUniversityData, adminEmails: e.target.value })}
                    />
                </div>

                {/* Upload Campus Picture */}
                <LabelFileInputCustomizable
                    divClassName="flex space-x-2 flex-row align-baseline items-start text-black"
                    label="Upload Campus Picture"
                    labelClassName="dark:text-white text-black"
                    className="h-fit"
                />
            </div>

            <div className='border py-1 px-2'>
                <h1 className='text-2xl font-bold mb-4'>Existing Campuses</h1>
                {(!campusId) && campus.map((cmp) => (
                    <div key={cmp._id} className='border my-1 px-1'>
                        {cmp.name}
                    </div>
                ))}
            </div>
            <CreateCampusComponent universityId={currentUniversityData._id} />
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
                            setCurrentUniversityData({
                                ...currentUniversityData,
                                campuses: [
                                    ...currentUniversityData.campuses,
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
                        {currentUniversityData.campuses?.map((campus, index) => (
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
