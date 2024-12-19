import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function CampusView() {
    const [allCampus, setAllCampus] = useState([]);
    const navigate = useNavigate();

    // Fetch all campuses
    useEffect(() => {
        const fetchAllCampus = async () => {
            try {
                const res = await axiosInstance.get('/api/super/all-campuses');
                setAllCampus(res.data);
            } catch (error) {
                console.error('Error fetching campuses:', error);
                setAllCampus([]);
            }
        };
        fetchAllCampus();
    }, []);

    // Handle editing campus
    const handleEditCampus = (campusId) => {
        navigate(`/super/campus/edit/${campusId}`);
    };

    // Handle deleting campus
    const handleDeleteCampus = async (campusId) => {
        try {
            const res = await axiosInstance.delete(`/api/super/campus/${campusId}`);
            if (res.status === 200) {
                setAllCampus(allCampus.filter((campus) => campus._id !== campusId));
                alert('Campus deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting campus:', error);
            alert('Error deleting campus');
        }
    };

    return (
        <div className="flex flex-col font-thin pt-8">
            <div className="flex flex-row justify-between mb-4">
                <h1 className="text-2xl font-bold">All Campuses</h1>
                {/* Button to Create a New Campus */}
                <Link to="/super/campus/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create New Campus
                </Link>
            </div>

            {allCampus.length === 0 ? (
                <p>No campuses available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Location</th>
                                <th className="py-3 px-4 text-left">Academic Format</th>
                                <th className="py-3 px-4 text-left">University</th>
                                <th className="py-3 px-4 text-left">Registration Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCampus.map((campus) => (
                                <tr key={campus._id} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{campus.name}</td>
                                    <td className="py-3 px-4">{campus.location || 'Not Provided'}</td>
                                    <td className="py-3 px-4">{campus.academic?.FormatType || 'Not Provided'}</td>
                                    <td className="py-3 px-4">{campus.universityOrigin?.name || 'No University'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-${campus.registered?.isRegistered ? 'green' : 'red'}-500 font-semibold`}>
                                            {campus.registered?.isRegistered ? 'Registered' : 'Not Registered'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 space-x-2 flex flex-row">
                                        {/* Edit Button */}
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleEditCampus(campus._id)}
                                        >
                                            Edit
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleDeleteCampus(campus._id)}
                                        >
                                            Delete
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


// import React from 'react'
// import axiosInstance from '../../../../config/users/axios.instance'
// import { useState } from 'react'

// export default function CampusView() {
//     const [allCampus, setAllCampus] = useState([])

//     React.useEffect(() => {
//         const fetchAllCampus = async () => {
//             try {
//                 const res = await axiosInstance.get('/api/super/all-campuses')
//                 setAllCampus(res.data)
//             } catch (error) {
//                 console.error(error)
//                 setAllCampus([])
//             }
//         }
//         fetchAllCampus()
//     }, [])
//     return (
//         <div className='flex flex-col font-thin'>
//             {allCampus.map((campus) => (
//                 <div className='flex flex-row space-x-3 bg-gray-600 rounded-lg my-1' key={campus._id}>
//                     <div className='w-10 h-10 rounded-md overflow-hidden'>
//                         <img src={campus?.picture} className='w-full h-full' />
//                     </div>

//                     <h6 className='text-md font-bold'>{campus?.name || 'No name'}</h6>

//                     <h6 className='text-md font-bold'>{campus?.location || 'No name'}</h6>

//                     <h6 className='text-md font-bold'>{campus?.academic.FormatType || 'No name'}</h6>

//                     <p className='text-gray-300'>{campus?.universityOrigin.name || 'No campusn ame'}</p>
//                     <div className='w-10 h-10 rounded-md overflow-hidden'>
//                         <img src={campus?.universityOrigin.picture} className='w-full h-full' />
//                     </div>


//                     <span className='text-fuchsia-100 font-semibold'>{campus?.registered?.isRegistered || 'No Role'}</span>
//                 </div>
//             ))}

//         </div>
//     )
// }
