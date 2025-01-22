import { Box, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../config/users/axios.instance";
import useTriggerReRender from "../../../../state_management/zustand/useTriggerReRender";
import CustomStarRating from '../../../../components/tailwind/CustomStarRating';
import { useParams } from "react-router-dom";

export default function TeacherInfoCard() {


    const { id } = useParams()
    const teacherId = id
    const [teacher, setTeacher] = useState(null);
    const { triggerReRender, setTriggerReRender } = useTriggerReRender();

    useEffect(() => {

        const fetchTeacher = async () => {
            try {
                const response = await axiosInstance.get(`/api/teacher/info?id=${teacherId}`);
                setTeacher(response.data);
                setTriggerReRender(false);

                // console.log("Teacher Crd", response.data)

            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        };

        fetchTeacher();
    }, [location.search, triggerReRender]);
    return (
        <Box className="bg-gray-100 dark:bg-[#222222] min-h-[fit] max-h-min rounded-lg shadow-lg  mt-10  pt-3  m-2 lg:sticky lg:top-7 ">

            <div className=" mx-auto p-2 ">
                <div className="flex flex-row sm:flex-row lg:flex-col p-4 xl:flex-row">
                    {/* {teacher ? <img className="border w-32 h-40" src={teacher ? teacher.imageUrl : 'https://avatar.iran.liara.run/username?username=[Unknown]'} /> : <Skeleton variant="rounded" sx={{ fontSize: '1rem', marginTop: '-0.2rem' }} width={130} height={150} />} */}
                    {teacher ? (
                        <img
                            className="border w-32 h-40"
                            src={teacher.imageUrl ? teacher.imageUrl : 'https://via.placeholder.com/130x150'}
                            alt={teacher.name || "Unknown Teacher"}
                        />
                    ) : (
                        <Skeleton
                            variant="rounded"
                            sx={{ fontSize: '1rem', marginTop: '-0.2rem' }}
                            width={130}
                            height={150}
                        />
                    )}

                    <div className="ml-2 lg:ml-0 xl:ml-2">
                        <h1 className="text-2xl font-bold dark:text-white">{teacher ? teacher.name : <Skeleton variant="text" sx={{ fontSize: '1rem', marginTop: '-0.2rem' }} width={200} height={40} />}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{teacher ? teacher.designation : <Skeleton variant="text" sx={{ fontSize: '1rem', marginTop: '-0.2rem' }} width={200} height={30} />}</p>
                        <div className="flex items-center -mt-1 mb-2">
                            <p className="flex mr-2 items-center">Best Rating: {teacher ? Number(teacher.rating).toFixed(2) : <Skeleton variant="text" sx={{ fontSize: '1rem', marginLeft: 1 }} width={20} height={30} />} </p>

                            <CustomStarRating rating={teacher ? teacher.rating : 0} />

                        </div>
                        {teacher && teacher?.campusOrigin && (
                            <p>Location: {teacher.campusOrigin.location}</p>
                        )}
                    </div>
                </div>
                <div className="p-2">
                    <p>{teacher && teacher.onLeave && (
                        <p className="text-red-600">This teacher is currently on leave.</p>
                    )}</p>

                    <div className="mt-4 m-1">
                        {!teacher ? (
                            <>
                                <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Area of Interest:<br /></span>
                                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={300} height={20} />
                                </p>
                                <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Department:</span>
                                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={300} height={20} />
                                </p>
                                <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Supervisor Status:</span>
                                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={300} height={20} />
                                </p>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={200} height={20} />
                            </>
                        ) : (
                            <>
                                {teacher?.areaOfInterest && <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Area of Interest:<br /></span>
                                    {teacher.areaOfInterest}
                                </p>}
                                <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Department:</span>
                                    {teacher.department.name}
                                </p>
                                {teacher?.supervisorStatus && <p className="text-gray-700 dark:text-white mb-2">
                                    <span className="font-semibold text-lg dark:text-gray-300">Supervisor Status:</span>
                                    {teacher.supervisorStatus}
                                </p>}
                                <a
                                    target="_blank"
                                    href={teacher.imageUrl}
                                    className="text-blue-500 dark:text-blue-400 hover:underline"
                                >
                                    Comsats Web Profile
                                </a>
                            </>
                        )}
                    </div>


                </div>

            </div>
        </Box>
    )
}
