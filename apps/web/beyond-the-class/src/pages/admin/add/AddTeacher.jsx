import React, { useEffect } from 'react'
import useUniversityData from '../hooks/useUniversityData';
import axiosInstance from '../../../config/users/axios.instance';
import { useState } from 'react';
import toast from 'react-hot-toast';
import LabelInputCustomizable from '../../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../../components/Buttons/DarkButton';

export default function AddTeacher() {
    const { UniversitySelector, campus, currentUniversity,
        CampusSelector, currentCampus, setCurrentUniversity,
        DepartmentSelector, currentDepartment,
    } = useUniversityData();

    const [loading, setLoading] = useState(false);

    const [teachers, setTeachers] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get("/api/teacher/super-teachers-by-campus", {
                    params: { campusId: currentCampus._id }
                })
                console.log(response.data)
                setTeachers(response.data)
            } catch (error) {
                console.error(error.message)
            }
        }
        if (currentCampus && currentCampus._id) {
            fetch()
        }
    }, [currentCampus])



    const [newTeacherName, setNewTeacherName] = useState('')
    const [newTeacherEmail, setNewTeacherEmail] = useState('')
    const [showTeacherBox, setShowTeacherBox] = useState(false)
    const [newTeacherPictureUrl, setNewTeacherPictureUrl] = useState('')

    const [selectedTeacher, setSelectedTeacher] = useState(null);


    const handleNewTeacherSave = async () => {
        if (newTeacherName === '' || newTeacherEmail === '' || newTeacherPictureUrl === '') return
        try {
            const response = await axiosInstance.post('/api/teacher/',
                {
                    universityOrigin: currentUniversity._id,
                    campusOrigin: currentCampus._id,
                    departmentId: currentDepartment._id,
                    name: newTeacherName,
                    picture: newTeacherPictureUrl,
                    email: newTeacherEmail
                }
            )
            if (response.status === 200) {
                toast.success(`OK `)
            }
            console.log("response newTeacherName", response)
        } catch (error) {
            console.error(error)
            toast.error(error)
        } finally {
            setNewTeacherName('')
            setShowTeacherBox(false)
        }
    }

    return (
        <div className='pt-10 px-3 min-h-screen'>
            <h5>Teachers</h5>
            <div>
                {UniversitySelector}
                {CampusSelector}
                {DepartmentSelector}
            </div>

            <div>
                Current Campus: {currentCampus?.name}
            </div>



            {currentCampus?._id && teachers && (
                <section className="mb-10">
                    <div className='flex flex-row justify-between'>
                        <h2 className="text-xl  font-semibold mb-3">Teachers in  {currentCampus?.name}</h2>
                        <button className='btn-dark ' onClick={() => setShowTeacherBox(!showTeacherBox)}>add Teacher</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {teachers.map((teacher, idx) => (
                            <div
                                key={teacher._id}
                                className="text-black dark:text-white p-2 rounded shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedTeacher(teacher);
                                }}
                            >
                                <p><strong>{idx}.{teacher.name}</strong></p>
                            </div>
                        ))}


                    </div>
                </section>
            )}



            {currentCampus?._id && teachers && showTeacherBox && (<div className='border border-black p-2'>
                {currentDepartment && <h5>Selected Department: {currentDepartment.name}</h5>}

                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={newTeacherName}

                    label="Teacher Name"
                    placeholder="name"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => {
                        const titleCaseValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, char => char.toUpperCase()); // Convert first letter of each word to uppercase
                        setNewTeacherName(titleCaseValue);
                    }}
                />




                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={newTeacherEmail}

                    label="Email"
                    placeholder="@gmail.com"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => {
                        const titleCaseValue = e.target.value.toLowerCase()
                        setNewTeacherEmail(titleCaseValue);
                    }}
                />

                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={newTeacherPictureUrl}

                    label="Teacher Image"
                    placeholder="image"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => {
                        const titleCaseValue = e.target.value
                        setNewTeacherPictureUrl(titleCaseValue);
                    }}
                />

                <DarkButton
                    loading={loading}
                    onClick={handleNewTeacherSave}
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Save"
                />
            </div>)}

        </div>
    )
}
