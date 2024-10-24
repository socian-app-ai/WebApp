import { Chip, Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
export default function TeacherCard({ teacher }) {
    return (
        <Link to={`/teacher/reviews?id=${teacher._id}`} className="bg-gray-100 dark:bg-[#222222] rounded-lg shadow-xl p-4 mt-5 mx-2">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 overflow-hidden rounded-full">
                    <img
                        className="object-cover w-full h-full"
                        src={teacher.imageUrl}
                        alt={`${teacher.name}'s photo`}
                    />
                </div>
                <div className="ml-3">
                    <h2 className="text-md font-semibold dark:text-white">{teacher.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{teacher?.designation || ''}</p>
                </div>

            </div>
            <div className="">
                <div className="flex my-2">


                    <p>Raitngs: </p><Rating
                        readOnly
                        className="mx-2 "
                        value={teacher.rating}
                        // defaultValue={2}

                        precision={0.5}
                        emptyIcon={<Star className=" opacity-90 text-[#BABBBD] " fontSize="inherit" />}
                        size="medium"
                    />
                </div>
                {teacher.onLeave && <Chip

                    label="on leave"
                    variant="outlined"
                    size="small"
                    className="dark:text-white dark:border-white"
                />
                }
                <p><strong>Designation:</strong> {teacher?.designation || ''}</p>
            </div>


        </Link>
    );
}
