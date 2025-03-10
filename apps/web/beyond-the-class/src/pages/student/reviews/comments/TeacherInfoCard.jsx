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
        <Box className="bg-card dark:bg-card/95 rounded-lg border border-border shadow-lg mt-6 lg:sticky lg:top-7">
            <div className="p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                    {teacher ? (
                        <div className="relative w-32 h-40 overflow-hidden rounded-md border border-border">
                            <img
                                className="object-cover w-full h-full"
                                src={teacher.imageUrl ? teacher.imageUrl : 'https://via.placeholder.com/130x150'}
                                alt={teacher.name || "Unknown Teacher"}
                            />
                        </div>
                    ) : (
                        <Skeleton
                            variant="rounded"
                            sx={{ fontSize: '1rem' }}
                            width={130}
                            height={150}
                        />
                    )}

                    <div className="flex-1 space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {teacher ? teacher.name : <Skeleton variant="text" width={200} height={40} />}
                        </h1>
                        <p className="text-muted-foreground">
                            {teacher ? teacher.designation : <Skeleton variant="text" width={200} height={30} />}
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Best Rating:</span>
                            <span className="font-medium">
                                {teacher ? Number(teacher.rating).toFixed(2) : <Skeleton variant="text" width={20} height={30} />}
                            </span>
                            <CustomStarRating rating={teacher ? teacher.rating : 0} />
                        </div>
                        {teacher?.campusOrigin && (
                            <p className="text-sm text-muted-foreground">
                                <span className="inline-flex items-center">
                                    📍 {teacher.campusOrigin.location}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {teacher?.onLeave && (
                    <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                        <p>This teacher is currently on leave.</p>
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    {!teacher ? (
                        <>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Area of Interest</h3>
                                <Skeleton variant="text" width={300} height={20} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Department</h3>
                                <Skeleton variant="text" width={300} height={20} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Supervisor Status</h3>
                                <Skeleton variant="text" width={300} height={20} />
                            </div>
                        </>
                    ) : (
                        <>
                            {teacher?.areaOfInterest && (
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-foreground">Area of Interest</h3>
                                    <p className="text-muted-foreground">{teacher.areaOfInterest}</p>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <h3 className="font-semibold text-foreground">Department</h3>
                                <p className="text-muted-foreground">{teacher.department.name}</p>
                            </div>
                            {teacher?.supervisorStatus && (
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-foreground">Supervisor Status</h3>
                                    <p className="text-muted-foreground">{teacher.supervisorStatus}</p>
                                </div>
                            )}
                            <a
                                target="_blank"
                                href={teacher.imageUrl}
                                className="inline-flex items-center text-primary hover:underline mt-2"
                            >
                                Comsats Web Profile →
                            </a>
                        </>
                    )}

                    <div className="border-t border-border mt-6 pt-4">
                        <h3 className="font-semibold text-foreground mb-2">Feedback Summary</h3>
                        <p className="text-muted-foreground text-sm">
                            {teacher?.feedbackSummary || "No summary available."}
                        </p>
                    </div>
                </div>
            </div>
        </Box>
    )
}
