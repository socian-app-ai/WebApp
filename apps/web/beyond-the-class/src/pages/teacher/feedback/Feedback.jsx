/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../config/users/axios.instance";
import { useEffect } from "react";
import { useToast } from '../../../components/toaster/ToastCustom';
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";

// Loading Component
const Loading = () => (
    <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading...</div>
    </div>
);

// TeacherProfileCard Component
const TeacherProfileCard = ({ teacher }) => (
    <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
        <div className="grid gap-4">
            <div>
                <p className="text-sm text-gray-500">Department</p>
                <p>{teacher.department?.name || 'N/A'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p>{teacher.rating.toFixed(1)} / 5.0</p>
            </div>
        </div>
    </div>
);

// FeedbackList Component
const FeedbackList = ({ feedbacks }) => (
    <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Recent Feedbacks</h3>
        {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
                <div key={feedback._id} className="bg-white dark:bg-[#121212] rounded-lg shadow p-4 mb-4">
                    <p className="text-gray-700">{feedback.feedback}</p>
                    <div className="mt-2 text-sm text-gray-500">Rating: {feedback.rating}/5</div>
                    <div className="inline-flex items-center space-x-2 mt-2">
                        <div className='inline-flex justify-center items-center'>
                            <ArrowUp size={18} /> {feedback.upVotesCount}
                        </div>
                        <div className='inline-flex justify-center items-center'>
                            <ArrowDown size={18} /> {feedback.downVotesCount}
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No feedbacks available yet.</p>
        )}
    </div>
);

// TeacherList Component
const TeacherList = ({ teachers, onSelect }) => (
    <div className="grid gap-2 md:grid-cols-4">
        {teachers.map((teacher) => (
            <div key={teacher._id} className="bg-white dark:bg-[#121212] rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
                    <h3 className="text-md font-normal mb-2">{teacher.email}</h3>
                    <img src={teacher.imageUrl} className='h-10 w-10 mb-2' alt="Teacher" />
                    <div className="space-y-2">
                        <p>Department: {teacher.department?.name || 'N/A'}</p>
                        <p>Rating: {teacher.rating.toFixed(1)}/5.0</p>
                        <p className="text-sm text-gray-500">
                            {teacher.onLeave ? 'Currently on leave' : 'Active'}
                        </p>
                        <button
                            onClick={() => onSelect(teacher._id)}
                            disabled={teacher.userAttachedBool}
                            className={`w-full mt-4 py-2 px-4 rounded ${teacher.userAttachedBool ? 'bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white transition-colors`}
                        >
                            {teacher.userAttachedBool ? 'An account Attached already' : 'Request to Attach'}
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// CreateTeacherButton Component
const CreateTeacherButton = ({ onCreate }) => (
    <button
        onClick={onCreate}
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
    >
        Create Teacher Profile
    </button>
);

// Main TeacherFeedback Component
const TeacherFeedback = () => {
    const { authUser } = useAuthContext();
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        const initializeTeacherData = async () => {
            try {
                setLoading(true);
                if (authUser?.teacherConnectivities?.attached) {
                    const response = await axiosInstance.get(`/api/teacher/account/feedbacks`, {
                        params: {
                            teacherId: authUser.teacherConnectivities.teacherModal
                        }
                    });
                    setSelectedTeacher(response.data.teacher);
                    setFeedbacks(response.data.feedbacks);
                } else {
                    const response = await axiosInstance.get('/api/user/teacher/attachUser');
                    setMessage(response.data.message);
                    setTeachers(response.data.teachers || []);
                    setSelectedTeacher(response.data.teacher || null);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        initializeTeacherData();
    }, [authUser]);

    const handleTeacherSelect = async (teacherId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/user/teacher/joinModel', { params: { teacherId } });
            setSelectedTeacher(response.data.teacher);
            addToast(response.data.message);
            setMessage('Successfully attached to teacher');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to attach to teacher');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacherProfile = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/teacher/by/teacher/create');
            setSelectedTeacher(response.data.teacher);
            setMessage('Teacher profile created successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create teacher profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="mt-10 px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Teacher Feedbacks</h2>

            {message && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">{message}</div>
            )}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error}</div>
            )}

            {selectedTeacher ? (
                <div className="space-y-4">
                    <TeacherProfileCard teacher={selectedTeacher} />
                    <FeedbackList feedbacks={feedbacks} />
                </div>
            ) : teachers?.length > 0 ? (
                <div>
                    <p className='text-sm font-thin my-3'>
                        By Default your account is attached to your teacher Modal. However, If no Modal is found, you can find your Teacher Modal Here and attach to it. If not even a modal is found, you can Create One.
                    </p>
                    <TeacherList teachers={teachers} onSelect={handleTeacherSelect} />
                </div>
            ) : (
                <div className="text-center">
                    <p className="mb-4">No existing teacher profile found. You can create a new one</p>
                    <CreateTeacherButton onCreate={handleCreateTeacherProfile} />
                </div>
            )}
        </div>
    );
};

export default TeacherFeedback;



// import React, { useState, useEffect } from 'react';
// import { useAuthContext } from '../../../context/AuthContext';
// import axiosInstance from '../../../config/users/axios.instance';
// import { useToast } from '../../../components/toaster/ToastCustom';
// import { ArrowUp } from 'lucide-react';
// import { ArrowDown } from 'lucide-react';

// const TeacherFeedback = () => {
//     const { authUser } = useAuthContext();
//     const [teachers, setTeachers] = useState([]);
//     const [selectedTeacher, setSelectedTeacher] = useState(null);
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [error, setError] = useState(null);
//     const { addToast } = useToast()

//     useEffect(() => {
//         const initializeTeacherData = async () => {
//             try {
//                 setLoading(true);
//                 if (authUser?.teacherConnectivities?.attached) {
//                     const response = await axiosInstance.get(`/api/teacher/account/feedbacks`, {
//                         params: {
//                             teacherId: authUser.teacherConnectivities.teacherModal
//                         }
//                     });
//                     // console.log(response)
//                     setSelectedTeacher(response.data.teacher);
//                     setFeedbacks(response.data.feedbacks);
//                 } else {
//                     const response = await axiosInstance.get('/api/user/teacher/attachUser');
//                     // console.log(response)
//                     setMessage(response.data.message);
//                     if (response.data.teachers) {
//                         setTeachers(response.data.teachers);
//                     }
//                     if (response.data.teacher) {
//                         setSelectedTeacher(response.data.teacher);
//                     }
//                 }
//             } catch (err) {
//                 setError(err.response?.data?.message || 'An error occurred');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         initializeTeacherData();
//     }, [authUser]);

//     const handleTeacherSelect = async (teacherId) => {
//         try {
//             // console.log("TEACHER ID", teacherId)
//             setLoading(true);
//             const response = await axiosInstance.get('/api/user/teacher/joinModel', {
//                 params: {
//                     teacherId
//                 }
//             });

//             if (response.ok) {
//                 setSelectedTeacher(response.data.teacher);
//                 addToast(response.data.message)
//                 setMessage('Successfully attached to teacher');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to attach to teacher');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreateTeacherProfile = async () => {
//         try {
//             setLoading(true);
//             const response = await axiosInstance.post('/api/teacher/by/teacher/create');
//             if (response.data.success) {
//                 setSelectedTeacher(response.data.teacher);
//                 setMessage('Teacher profile created successfully');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create teacher profile');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-[200px]">
//                 <div className="text-gray-600">Loading...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="mt-10 px-4 mx-auto">
//             <h2 className="text-2xl font-bold mb-6">Teacher Feedbacks</h2>

//             {message && (
//                 <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">
//                     {message}
//                 </div>
//             )}

//             {error && (
//                 <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
//                     {error}
//                 </div>
//             )}

//             {selectedTeacher ? (
//                 <div className="space-y-4">
//                     <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-6">
//                         <h3 className="text-xl font-semibold mb-2">{selectedTeacher.name}</h3>
//                         <div className="grid gap-4">
//                             <div>
//                                 <p className="text-sm text-gray-500">Department</p>
//                                 <p>{selectedTeacher.department?.name || 'N/A'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Rating</p>
//                                 <p>{selectedTeacher.rating.toFixed(1)} / 5.0</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-6">
//                         <h3 className="text-xl font-semibold mb-4">Recent Feedbacks</h3>
//                         {feedbacks.length > 0 ? (
//                             feedbacks.map((feedback) => (
//                                 <div key={feedback._id} className="bg-white dark:bg-[#121212] rounded-lg shadow p-4 mb-4">
//                                     <p className="text-gray-700">{feedback.feedback}</p>
//                                     <div className="mt-2 text-sm text-gray-500">
//                                         Rating: {feedback.rating}/5
//                                     </div>
//                                     <div>
//                                         <div className='inline-flex justify-center items-center'>
//                                             <ArrowUp size={18} /> {feedback.upVotesCount}
//                                         </div>
//                                         <div className='inline-flex justify-center items-center'>
//                                             <ArrowDown size={18} /> {feedback.downVotesCount}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-500">No feedbacks available yet.</p>
//                         )}
//                     </div>
//                 </div>
//             ) : teachers?.length > 0 ? (
//                 <div>
//                     <div className='text-sm font-thin my-3'>
//                         By Default your account is attached to your teacher Modal. However, If no Modal is found.
//                         You can find your Teacher Modal Here and attach to it. If not even modal is found you can Create One.
//                     </div>
//                     <div className="grid gap-2 md:grid-cols-4">

//                         {teachers.map((teacher) => (
//                             <div key={teacher._id} className="bg-white dark:bg-[#121212] rounded-lg shadow hover:shadow-lg transition-shadow">
//                                 <div className="p-6">
//                                     {console.log(teacher)}
//                                     <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
//                                     <h3 className="text-md font-normal mb-2">{teacher.email}</h3>
//                                     <img src={teacher.imageUrl} className=' h-10 w-10' />
//                                     <div className="space-y-2">
//                                         <p>Department: {teacher.department?.name || 'N/A'}</p>
//                                         <p>Rating: {teacher.rating.toFixed(1)}/5.0</p>
//                                         <p className="text-sm text-gray-500">
//                                             {teacher.onLeave ? 'Currently on leave' : 'Active'}
//                                         </p>

//                                         {
//                                             !teacher.userAttachedBool ?
//                                                 <button

//                                                     onClick={() => handleTeacherSelect(teacher._id)}
//                                                     className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
//                                                 >
//                                                     Request to Attach
//                                                 </button>
//                                                 :
//                                                 <button

//                                                     // onClick={() => {}} // TOTELL user to request a query to mod to adjust your email
//                                                     disabled // for now
//                                                     className="w-full mt-4 bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
//                                                 >
//                                                     An account Attached already
//                                                 </button>
//                                         }
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="text-center">
//                     <p className="mb-4">No existing teacher profile found. You can create a new one</p>
//                 </div>
//             )}

//             {!selectedTeacher && <button
//                 onClick={handleCreateTeacherProfile}
//                 className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
//             >
//                 Create Teacher Profile
//             </button>}
//         </div>
//     );
// };

// export default TeacherFeedback;