import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import useUniversityData from '../hooks/useUniversityData';
import LabelFileInputCustomizable from '../../../components/Upload/LabelFileInputCustomizable';
import { LabelInputUnderLineCustomizable } from '../../../components/TextField/LabelInputCustomizable';
// import DepartmentsManager, { AcademicFormat, CreateCampusComponent, Departments } from '../components/CreateCampusComponent';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/users/axios.instance';

export default function AddUniversityPage() {
    // const [universities, setUniversities] = useState([]);
    // const [universityData, setUniversityData] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState({});
    // const [campusName, setCampusName] = useState('');
    // const [campusLocation, setCampusLocation] = useState('');
    // const [isNewUniversity, setIsNewUniversity] = useState(false);

    const { universityId } = useParams();
    const navigate = useNavigate();

    // const { UniversitySelector, setCurrentUniversityData } = useUniversityData();

    useEffect(() => {
        if (universityId) {

            const fetchUniversityData = async () => {
                try {
                    const res = await axios.get(`/api/university/${universityId}`);
                    setCurrentUniversity(res.data);
                    // setIsNewUniversity(false);
                } catch (error) {
                    console.error("Error fetching university data:", error);
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
            if (universityId) {
                await axiosInstance.put(`/api/university/${universityId}`, currentUniversity);
            } else {
                await axiosInstance.post('/api/university/register', currentUniversity);
            }
            navigate('/super/universities');
        } catch (error) {
            console.error("Error saving university:", error);
        }
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

            <div>
                <h1 className="text-2xl font-bold mb-4">{!(universityId) ? 'Create New University' : 'Edit University'}</h1>
                <hr />
                <div className="flex flex-row items-baseline space-x-2">
                    <p>Name: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="university-name"
                        className="m-0"
                        placeholder="University Name"
                        value={currentUniversity.name || ''}
                        onChange={(e) => setCurrentUniversity({ ...currentUniversity, name: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Address: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="mainLocation-address"
                        className="my-2"
                        placeholder="University Address"
                        value={currentUniversity.mainLocationAddress || ''}
                        onChange={(e) => setCurrentUniversity({ ...currentUniversity, mainLocationAddress: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Telephone: </p>
                    <LabelInputUnderLineCustomizable
                        type="text"
                        name="telephone"
                        className="my-2"
                        placeholder="042-XXXXXXX"
                        value={currentUniversity.telephone || ''}
                        onChange={(e) => setCurrentUniversity({ ...currentUniversity, telephone: e.target.value })}
                    />
                </div>

                <div className="flex flex-row items-baseline space-x-2">
                    <p>Admin Emails: </p>
                    <LabelInputUnderLineCustomizable
                        type="email"
                        name="admin-email"
                        className="my-2"
                        placeholder="admin@university.com"
                        value={currentUniversity.adminEmails || ''}
                        onChange={(e) => setCurrentUniversity({ ...currentUniversity, adminEmails: e.target.value })}
                    />
                </div>

                {/* Upload Campus Picture */}
                <LabelFileInputCustomizable
                    divClassName="flex space-x-2 flex-row align-baseline items-start text-black"
                    label="Upload Campus Picture"
                    labelClassName="dark:text-white text-black"
                    className="h-fit dark:text-white text-black "
                />
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




// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import useUniversityData from '../hooks/useUniversityData';
// import LabelFileInputCustomizable from '../../../components/Upload/LabelFileInputCustomizable';
// import { LabelInputUnderLineCustomizable } from '../../../components/TextField/LabelInputCustomizable';
// import DepartmentsManager, { AcademicFormat, CreateCampusComponent, Departments } from '../components/CreateCampusComponent';

// //Only super admin can create or select uni, admin can create campus [!important]

// export default function AddUniversityPage() {
//     const [universities, setUniversities] = useState([]);
//     const [universityData, setUniversityData] = useState([])
//     // const [universityId, setUniversityId] = useState(null)



//     const urlParams = useParams()
//     console.log(urlParams)

//     const { UniversitySelector, campus, currentUniversity, setCurrentUniversity } = useUniversityData()
//     // if (currentUniversity) {
//     //     universityData.length != 0 && setCurrentUniversity(universityData)
//     // }

//     useEffect(() => {
//         // DID CODE FOR CAMPUS , MOVE THIS TO CAMPUS
//         const fetch = async () => {
//             const res = await axios.get(`/api/university/${currentUniversity._id}`)
//             setUniversityData(res.data)
//         }
//         currentUniversity && fetch()



//         // Fetch universities
//         // const fetchUniversities = async () => {
//         //     try {

//         //         const response = await axios.get("/api/university/")
//         //         console.log(response.data)

//         //         setUniversities(response.data);
//         //         // console.log("universities: ", universities)
//         //     } catch (error) {
//         //         console.error(error.message)
//         //     }
//         // }
//         // fetchUniversities()
//     }, [])


//     return (
//         <div className='space-y-2'>
//             <div className='relative'>
//                 <button className='absolute top-1 right-1 border p-1 mx-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg text-sm '> Save this</button>
//                 {UniversitySelector}
//                 <div>
//                     <h1 className='text-2xl font-bold mb-4'>University Details </h1>
//                     <hr />
//                     <div className='flex flex-row items-baseline space-x-2'>
//                         <p>Name: </p>
//                         <LabelInputUnderLineCustomizable
//                             type="university-name"
//                             name="university-name"
//                             className="m-0"
//                             placeholder="cuilahore"
//                             onChange={(e) => setCurrentUniversity({ ...currentUniversity, name: e.target.value })}

//                             value={currentUniversity.length != 0 ? currentUniversity.name : ''}
//                         />
//                     </div>

//                     <div className='flex flex-row items-baseline space-x-2'>
//                         <p>Address: </p>
//                         <LabelInputUnderLineCustomizable
//                             type="mainLocation-address"
//                             name="mainLocation-address"
//                             className="my-2"
//                             placeholder="lahore"
//                             onChange={(e) => setCurrentUniversity({ ...currentUniversity, mainLocationAddress: e.target.value })}

//                             value={currentUniversity.length != 0 ? currentUniversity.mainLocationAddress : ''}
//                         />
//                     </div>

//                     <div className='flex flex-row items-baseline space-x-2'>
//                         <p>Telephone: </p>
//                         <LabelInputUnderLineCustomizable
//                             type="telephone"
//                             name="telephone"
//                             className="my-2"
//                             placeholder="042 XXXXX"
//                             onChange={(e) => setCurrentUniversity({ ...currentUniversity, telephone: e.target.value })}

//                             value={currentUniversity.length != 0 ? currentUniversity.telephone : ''}
//                         />
//                     </div>


//                     <div className='flex flex-row items-baseline space-x-2'>
//                         <p>Admin emails: </p>
//                         <LabelInputUnderLineCustomizable
//                             type="admin-email"
//                             name="admin-email"
//                             className="my-2"
//                             placeholder="admin-emailcuilahore.pk"
//                             onChange={(e) => setCurrentUniversity({ ...currentUniversity, adminEmails: e.target.value })}

//                             value={currentUniversity.length != 0 ? currentUniversity.adminEmails : ''}
//                         />
//                     </div>



//                     <LabelFileInputCustomizable
//                         divClassName="flex space-x-2 flex-row align-baseline items-start text-black"
//                         label="Upload Campus Picture"
//                         labelClassName="dark:text-white text-black"
//                         className="h-fit"
//                     />

//                 </div>

//             </div>


//             <CreateCampusComponent />
//             {/* {console.log("Cam", currentUniversity)}
//             {
//                 currentUniversity.length != 0
//                 && (
//                     <ShowPreviousCampusComponent
//                         universityOrigin={currentUniversity._id}
//                     />
//                 )
//             } */}

//             <AcademicFormat />
//             <Departments />

//             <DepartmentsManager />





//         </div>
//     )
// }








// // db data
// // name
// // mainLocationAddress
// // telephone
// // adminEmails
// // picture
// // campuses
// // registered
// // isRegistered
// // registeredBy
// // users


// // // PSeudo
// // <select university>

// // if already selected>
// // university name
// // main location
// // telephone number
// // admin emails



// // Add 1
// // campus Name
// // campus Location

// // patterns
// // teahcer
// // student{
// //     domain: @cuilahore.edu.pk
// //     reg: fa21-bcs-058 or se,ai,etc
// // }
// //     <------------>

// // Add 2
// // campus Name
// // campus Location

// // patterns
// // teahcer
// // student{
// //     domain: @cuilahore.edu.pk
// //     reg: fa21-bcs-058 or se,ai,etc
// // }


// // Next Page
// // <SELECT CAMPUS>
// // Acadmeic Format :
// // 1. Quiz, assignment, midterm , final term
// // 2. Quiz, assignment, sessoinal 1+sessoinal 2 , final term
// // 3. other?

// // Departments
// // <ADD Departments>
// // <SELECT FROM DEFAULT LIST>


// // Subjects

// // <Select Departments>
// // <ADD Subject>