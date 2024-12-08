// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../config/users/axios.instance';

// export default function AllSocieties() {
//     const [societiesUniversities, setSocietiesUniversities] = useState([]);
//     const [societiesCampuses, setSocietiesCampuses] = useState([]);
//     const [societiesCampus, setSocietiesCampus] = useState([]);
//     const [errorUni, setErrorUni] = useState(null);  // Add error state
//     const [errorCampuses, setErrorCampuses] = useState(null);  // Add error state
//     const [errorCampus, setErrorCampus] = useState(null);  // Add error state

//     useEffect(() => {
//         const fetchUni = async () => {
//             try {
//                 const universities = await axiosInstance.get('/api/society/universities/all');
//                 console.log("uni", universities)
//                 setSocietiesUniversities(universities.data);
//             } catch (err) {
//                 setErrorUni("Error fetching societies data");
//                 console.error("Error fetching societies: ", err);
//             }
//         };

//         fetchUni();

//         const fetchCampusues = async () => {
//             try {

//                 const campuses = await axiosInstance.get('/api/society/campuses/all');
//                 console.log("cams", campuses)
//                 setSocietiesCampuses(campuses.data);
//             } catch (err) {
//                 setErrorCampuses("Error fetching societies data");
//                 console.error("Error fetching societies: ", err);
//             }
//         };

//         fetchCampusues();



//         const fetch = async () => {
//             try {
//                 const campus = await axiosInstance.get('/api/society/campus/all');
//                 console.log("cam", campus)
//                 setSocietiesCampus(campus.data);
//             } catch (err) {
//                 setErrorCampus("Error fetching societies data");
//                 console.error("Error fetching societies: ", err);
//             }
//         };

//         fetch();
//     }, []);

//     // if (error) return <div>{error}</div>;  // Show error if there is any

//     return (
//         <div>
//             <h2>Universities Societies</h2>
//             <ul>
//                 {societiesUniversities.map((society) => (
//                     <li key={society._id}>{society.name}</li>
//                 ))}
//             </ul>

//             <h2>Campuses Societies</h2>
//             <ul>
//                 {societiesCampuses.map((society) => (
//                     <li key={society._id}>{society.name}</li>
//                 ))}
//             </ul>

//             <h2>Single Campus Societies</h2>
//             <ul>
//                 {societiesCampus.map((society) => (
//                     <li key={society._id}>{society.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/users/axios.instance';
import { Link } from 'react-router-dom';

export default function AllSocieties() {
    const [societiesUniversities, setSocietiesUniversities] = useState([]);
    const [societiesCampuses, setSocietiesCampuses] = useState([]);
    const [societiesCampus, setSocietiesCampus] = useState([]);
    const [errorUni, setErrorUni] = useState(null);
    const [errorCampuses, setErrorCampuses] = useState(null);
    const [errorCampus, setErrorCampus] = useState(null);
    const [loadingUni, setLoadingUni] = useState(false);
    const [loadingCampuses, setLoadingCampuses] = useState(false);
    const [loadingCampus, setLoadingCampus] = useState(false);

    useEffect(() => {
        const fetchUni = async () => {
            setLoadingUni(true);
            try {
                const universities = await axiosInstance.get('/api/society/universities/all');
                setSocietiesUniversities(universities.data);
            } catch (err) {
                setErrorUni("Error fetching universities.");
                console.error("Error fetching universities societies: ", err);
            } finally {
                setLoadingUni(false);
            }
        };

        const fetchCampuses = async () => {
            setLoadingCampuses(true);
            try {
                const campuses = await axiosInstance.get('/api/society/campuses/all');
                setSocietiesCampuses(campuses.data);
            } catch (err) {
                setErrorCampuses("Error fetching campuses.");
                console.error("Error fetching campuses societies: ", err);
            } finally {
                setLoadingCampuses(false);
            }
        };

        const fetchCampus = async () => {
            setLoadingCampus(true);
            try {
                const campus = await axiosInstance.get('/api/society/campus/all');
                setSocietiesCampus(campus.data);
            } catch (err) {
                setErrorCampus("Error fetching single campus.");
                console.error("Error fetching single campus societies: ", err);
            } finally {
                setLoadingCampus(false);
            }
        };

        fetchUni();
        fetchCampuses();
        fetchCampus();
    }, []);

    return (
        <div className="container">
            <h2 className="text-lg font-bold  mb-6">Universities Societies</h2>

            {/* Universities Section */}
            {loadingUni ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
            ) : errorUni ? (
                <div className="text-red-500 ">{errorUni}</div>
            ) : societiesUniversities.length === 0 ? (
                <div className="">No societies found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societiesUniversities.map((society) => (
                        <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
                            <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Campuses Section */}
            <h2 className="text-lg font-bold  mt-10 mb-6">Campuses Societies</h2>

            {loadingCampuses ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
            ) : errorCampuses ? (
                <div className="text-red-500 ">{errorCampuses}</div>
            ) : societiesCampuses.length === 0 ? (
                <div className="">No societies found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societiesCampuses.map((society) => (
                        <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
                            <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Single Campus Section */}
            <h2 className="text-lg font-bold  mt-10 mb-6">Single Campus Societies</h2>

            {loadingCampus ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
            ) : errorCampus ? (
                <div className="text-red-500 ">{errorCampus}</div>
            ) : societiesCampus.length === 0 ? (
                <div className="">No societies found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societiesCampus.map((society) => (
                        <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
                            <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
