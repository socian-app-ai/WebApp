/* eslint-disable react/prop-types */

import SEO from '../../components/seo/SEO';

// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../config/users/axios.instance';
// import { Link } from 'react-router-dom';

// export default function AllSocieties() {
//     const [societiesUniversities, setSocietiesUniversities] = useState([]);
//     const [societiesCampuses, setSocietiesCampuses] = useState([]);
//     const [societiesCampus, setSocietiesCampus] = useState([]);
//     const [errorUni, setErrorUni] = useState(null);
//     const [errorCampuses, setErrorCampuses] = useState(null);
//     const [errorCampus, setErrorCampus] = useState(null);
//     const [loadingUni, setLoadingUni] = useState(false);
//     const [loadingCampuses, setLoadingCampuses] = useState(false);
//     const [loadingCampus, setLoadingCampus] = useState(false);

//     useEffect(() => {
//         const fetchUni = async () => {
//             setLoadingUni(true);
//             try {
//                 const universities = await axiosInstance.get('/api/society/universities/all');
//                 setSocietiesUniversities(universities.data);
//             } catch (err) {
//                 setErrorUni("Error fetching universities.");
//                 console.error("Error fetching universities societies: ", err);
//             } finally {
//                 setLoadingUni(false);
//             }
//         };

//         const fetchCampuses = async () => {
//             setLoadingCampuses(true);
//             try {
//                 const campuses = await axiosInstance.get('/api/society/campuses/all');
//                 setSocietiesCampuses(campuses.data);
//             } catch (err) {
//                 setErrorCampuses("Error fetching campuses.");
//                 console.error("Error fetching campuses societies: ", err);
//             } finally {
//                 setLoadingCampuses(false);
//             }
//         };

//         const fetchCampus = async () => {
//             setLoadingCampus(true);
//             try {
//                 const campus = await axiosInstance.get('/api/society/campus/all');
//                 setSocietiesCampus(campus.data);
//             } catch (err) {
//                 setErrorCampus("Error fetching single campus.");
//                 console.error("Error fetching single campus societies: ", err);
//             } finally {
//                 setLoadingCampus(false);
//             }
//         };

//         fetchUni();
//         fetchCampuses();
//         fetchCampus();
//     }, []);

//     return (
//         <div className="container">
//             <h2 className="text-lg font-bold  mb-6">Universities Societies</h2>

//             {/* Universities Section */}
//             {loadingUni ? (
//                 <div className="flex justify-center items-center">
//                     <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
//                 </div>
//             ) : errorUni ? (
//                 <div className="text-red-500 ">{errorUni}</div>
//             ) : societiesUniversities.length === 0 ? (
//                 <div className="">No societies found.</div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {societiesUniversities.map((society) => (
//                         <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
//                             <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
//                         </Link>
//                     ))}
//                 </div>
//             )}

//             {/* Campuses Section */}
//             <h2 className="text-lg font-bold  mt-10 mb-6">Campuses Societies</h2>

//             {loadingCampuses ? (
//                 <div className="flex justify-center items-center">
//                     <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
//                 </div>
//             ) : errorCampuses ? (
//                 <div className="text-red-500 ">{errorCampuses}</div>
//             ) : societiesCampuses.length === 0 ? (
//                 <div className="">No societies found.</div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {societiesCampuses.map((society) => (
//                         <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
//                             <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
//                         </Link>
//                     ))}
//                 </div>
//             )}

//             {/* Single Campus Section */}
//             <h2 className="text-lg font-bold  mt-10 mb-6">Single Campus Societies</h2>

//             {loadingCampus ? (
//                 <div className="flex justify-center items-center">
//                     <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
//                 </div>
//             ) : errorCampus ? (
//                 <div className="text-red-500 ">{errorCampus}</div>
//             ) : societiesCampus.length === 0 ? (
//                 <div className="">No societies found.</div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {societiesCampus.map((society) => (
//                         <Link to={`/student/society/${society._id}`} key={society._id} className="bg-white dark:bg-bg-var-dark p-2 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-2">{society.name}</h3>
//                             <p className="text-gray-600 text-sm">{society.description || 'No description available'}</p>
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, } from "lucide-react";
import axiosInstance from '../../config/users/axios.instance';
import { Building } from 'lucide-react';
import { Building2Icon } from 'lucide-react';
import { routesForApi } from '../../utils/routes/routesForLinks';
import { useAuthContext } from '../../context/AuthContext';

export default function AllSocieties() {
    const [activeTab, setActiveTab] = useState('universities');
    const [societiesUniversities, setSocietiesUniversities] = useState([]);
    const [societiesCampuses, setSocietiesCampuses] = useState([]);
    const [societiesCampus, setSocietiesCampus] = useState([]);
    const [errorUni, setErrorUni] = useState(null);
    const [errorCampuses, setErrorCampuses] = useState(null);
    const [errorCampus, setErrorCampus] = useState(null);
    const [loadingUni, setLoadingUni] = useState(false);
    const [loadingCampuses, setLoadingCampuses] = useState(false);
    const [loadingCampus, setLoadingCampus] = useState(false);

    const { authUser } = useAuthContext()

    useEffect(() => {
        const fetchUni = async () => {
            setLoadingUni(true);
            try {

                const universities = await axiosInstance.get(routesForApi.society.universitiesAll);
                setSocietiesUniversities(universities.data);
                // console.log("universities", universities.data)
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
                const campuses = await axiosInstance.get(routesForApi.society.campusesAll);
                setSocietiesCampuses(campuses.data);
                // console.log("campuses", campuses.data)
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
                const campus = await axiosInstance.get(routesForApi.society.campusAll);
                setSocietiesCampus(campus.data);
                // console.log("campus", campus.data)
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

    const SocietyCard = ({ society }) => (
        <Link to={`/${authUser.role}/society/${society._id}`} className="block transition-transform duration-200 hover:scale-105">
            <div className="h-full bg-white dark:bg-[#141414cc] rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                <div className='flex flex-row'>
                    <p className="text-md font-sans mb-2">{society.name}</p>
                    {/* {society.references.campusOrigin.name} */}
                    <div className="inline-flex items-center mx-[0.1rem] bg-[#292929c5] text-white text-xs font-thin h-min px-1 py-1 rounded-2xl">
                        {society.references.universityOrigin.name}
                    </div>
                    <div className="inline-flex items-center mx-[0.1rem] bg-[#292929c5] text-white text-xs font-thin h-min px-1 py-1 rounded-2xl">
                        <h5>{society.references.campusOrigin.location} </h5>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {society.description || 'No description available'}
                </p>
            </div>
        </Link>
    );

    const LoadingState = () => (
        <div className="flex justify-center items-center min-h-32">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#292929c5] rounded-full"></div>
        </div>
    );

    const ErrorState = ({ message }) => (
        <div className="flex items-center justify-center min-h-32">
            <div className="text-red-500 bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-lg">
                {message}
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="flex items-center justify-center min-h-32">
            <div className="text-gray-500 dark:text-gray-400">
                No societies found
            </div>
        </div>
    );

    return (
        <div className="">
            <SEO
                title="Student Societies"
                description="Explore student societies and organizations on Socian. Join clubs, participate in events, and build your campus community."
                keywords="student societies, campus clubs, university organizations, academic groups, student activities"
                pageType="societies"
            />
            <div className=" p-6 mb-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Student Societies</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Explore and join societies across different campuses and universities
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex flex-col md:flex-row rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                        {[
                            { id: 'universities', icon: Building, label: 'Universities' },
                            { id: 'campuses', icon: Building2Icon, label: `${authUser.university.universityId.name.toUpperCase()}` },
                            { id: 'campus', icon: Users, label: `${authUser.university.campusId.name.toUpperCase()}` }
                        ].map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                                    ${activeTab === id
                                        ? 'bg-white dark:bg-gray-500 dark:text-[#ffff] text-[#141414cc] shadow-sm'
                                        : 'text-gray-[#141414cc] dark:text-gray-200 hover:text-[#292929c5] dark:hover:text-[#ffffff]'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    {activeTab === 'universities' && (
                        <div>
                            {loadingUni ? (
                                <LoadingState />
                            ) : errorUni ? (
                                <ErrorState message={errorUni} />
                            ) : societiesUniversities.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                                    {societiesUniversities.map((society) => (
                                        <SocietyCard key={society._id} society={society} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'campuses' && (
                        <div>
                            {loadingCampuses ? (
                                <LoadingState />
                            ) : errorCampuses ? (
                                <ErrorState message={errorCampuses} />
                            ) : societiesCampuses.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {societiesCampuses.map((society) => (
                                        <SocietyCard key={society._id} society={society} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'campus' && (
                        <div>
                            {loadingCampus ? (
                                <LoadingState />
                            ) : errorCampus ? (
                                <ErrorState message={errorCampus} />
                            ) : societiesCampus.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {societiesCampus.map((society) => (
                                        <SocietyCard key={society._id} society={society} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}