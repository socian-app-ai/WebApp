// import React from 'react'
// import axiosInstance from '../../../../config/users/axios.instance'
// import { useState } from 'react'

// export default function UniversityView() {
//     const [allUniversities, setAllUniversities] = useState([])

//     React.useEffect(() => {
//         const fetchAllUniversity = async () => {
//             try {
//                 const res = await axiosInstance.get('/api/super/all-universities')
//                 setAllUniversities(res.data)
//                 console.log(res.data)
//             } catch (error) {
//                 console.error(error)
//                 setAllUniversities([])
//             }
//         }
//         fetchAllUniversity()
//     }, [])
//     return (
//         <div className='flex flex-col font-thin'>
//             {allUniversities.map((university) => (
//                 <div className='flex flex-row space-x-3 bg-gray-600 rounded-lg my-1' key={university._id}>
//                     <div className='w-10 h-10 rounded-md overflow-hidden'>
//                         <img src={university?.picture} className='w-full h-full' />
//                     </div>

//                     {/* {JSON.stringify(university)} */}

//                     <h6 className='text-md font-bold'>{university?.name || 'No name'}</h6>

//                     <h6 className='text-md font-bold'>{university?.mainLocationAddress || 'No name'}</h6>

//                     <h6 className='text-md font-bold'>Campuses:{university?.campuses.length || 'No name'}</h6>

//                     <p className='text-gray-300'>Users:{university?.users?.length || '-'}</p>

//                     <span className='text-fuchsia-100 font-semibold'>{university?.registered?.isRegistered || 'UnReg'}</span>
//                 </div>
//             ))}

//         </div>
//     )
// }
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { Link } from 'react-router-dom'; // For redirecting to the Edit page
import { useNavigate } from 'react-router-dom';

export default function UniversityView() {
    const [allUniversities, setAllUniversities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUniversity = async () => {
            try {
                const res = await axiosInstance.get('/api/super/all-universities');
                setAllUniversities(res.data);
            } catch (error) {
                console.error('Error fetching universities:', error);
                setAllUniversities([]);
            }
        };
        fetchAllUniversity();
    }, []);

    const handleEditUniversity = (universityId) => {

        navigate(`/super/university/edit/${universityId}`);
    };

    return (
        <div className="flex flex-col font-thin">
            <div className='flex flex-row justify-between'>
                <h1 className="text-2xl font-bold mb-4">All Universities</h1>
                {/* Button to Create a New University */}
                <Link to="/super/university/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create New University
                </Link>
            </div>


            {allUniversities.length === 0 ? (
                <p>No universities available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Main Location</th>
                                <th className="py-3 px-4 text-left">Campuses</th>
                                <th className="py-3 px-4 text-left">Users</th>
                                <th className="py-3 px-4 text-left">Registration Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUniversities.map((university) => (
                                <tr key={university._id} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{university.name}</td>
                                    <td className="py-3 px-4">{university.mainLocationAddress || 'Not Provided'}</td>
                                    <td className="py-3 px-4">{university.campuses?.length || 0}</td>
                                    <td className="py-3 px-4">{university.users?.length || 0}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-${university.registered?.isRegistered ? 'green' : 'red'}-500 font-semibold`}>
                                            {university.registered?.isRegistered ? 'Registered' : 'Not Registered'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleEditUniversity(university._id)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


        </div>
    );
}
