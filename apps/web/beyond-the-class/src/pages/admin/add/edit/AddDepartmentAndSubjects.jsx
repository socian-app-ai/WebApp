

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../config/users/axios.instance';
import LabelInputCustomizable from '../../../../components/TextField/LabelInputCustomizable';
import DarkButton from '../../../../components/Buttons/DarkButton';
import useUniversityData from '../../hooks/useUniversityData';

export default function AddDepartmentAndSubjects() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState({ type: null, payload: null });
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);


    const { campusId } = useParams();

    const [newDepartmentName, setNewDepartmentName] = useState('')
    const [showDepBox, setShowDepBox] = useState(false)


    const [newSubjectName, setNewSubjectName] = useState('')
    const [showSubjectBox, setShowSubjectBox] = useState(false)



    const { UniversitySelector, campus, currentUniversity, CampusSelector, currentCampus, setCurrentUniversity } = useUniversityData();

    const fetchData = async (campusId) => {
        try {
            const response = await axiosInstance.get('/api/campus/edit', {
                params: { campusId },
            });
            setData(response.data);
            console.log("DATA", response.data)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (campusId !== '0') {
            fetchData(campusId);
        } else {
            setLoading(false);
            if (currentUniversity && currentCampus && currentCampus._id) {
                fetchData(currentCampus._id);
            }
        }
    }, [campusId, currentCampus, currentUniversity]);



    const handleNwDepartmentSave = async () => {
        if (newDepartmentName === '' && !data.universityOrigin._id) return
        try {
            const response = await axiosInstance.post('/api/department/',
                {
                    universityId: data.universityOrigin._id,
                    campusId: campusId,
                    name: newDepartmentName
                }
            )
            if (response.status === 200) {
                toast.success(`OK ${response.data.message.name}`)
            }
            console.log("response newDepartmentName", response)
        } catch (error) {
            console.error(error)
            toast.error(error)
        } finally {
            setNewDepartmentName('')
            setShowDepBox(false)
        }
    }

    const handleNwSubjectSave = async () => {
        if (newSubjectName === '' && !data.universityOrigin._id) return
        try {
            const response = await axiosInstance.post('/api/subject/create',
                {
                    universityOrigin: data.universityOrigin._id,
                    campusOrigin: campusId,
                    departmentId: selectedDepartment._id,
                    name: newSubjectName
                }
            )
            if (response.status === 200) {
                toast.success(`OK `)
            }
            console.log("response newSubjectName", response)
        } catch (error) {
            console.error(error)
            toast.error(error)
        } finally {
            setNewSubjectName('')
            setShowSubjectBox(false)
        }
    }




    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen p-5 bg-gray-100">
            <h1 className="text-2xl font-bold mb-5">Campus Admin Panel</h1>
            {UniversitySelector}
            {CampusSelector}
            <section className="mb-10">
                <div className='flex flex-row justify-between'>
                    <h2 className="text-xl font-semibold mb-3">Departments</h2>
                    <button className='btn-dark ' onClick={() => setShowDepBox(!showDepBox)}>addDepartment</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data?.departments.map(dep => (
                        <div key={dep._id} className="flex flex-col justify-between sm:flex-row bg-white p-2 rounded shadow">
                            <p><strong>{dep.name}</strong></p>
                            <div className="">
                                <button
                                    onClick={() => setSelectedDepartment(dep)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                                >
                                    View Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {selectedDepartment && (
                <section className="mb-10">
                    <div className='flex flex-row justify-between'>
                        <h2 className="text-xl font-semibold mb-3">Subjects in  {selectedDepartment.name}</h2>
                        <button className='btn-dark ' onClick={() => setShowSubjectBox(!showSubjectBox)}>add Subject</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedDepartment.subjects.map(sub => (
                            <div
                                key={sub._id}
                                className="bg-white p-5 rounded shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedSubject(sub);
                                }}
                            >
                                <p><strong>{sub.name}</strong></p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {showDepBox && (<div className='border border-black p-2'>
                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={newDepartmentName}

                    label="Department"
                    placeholder="Computer Science"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => {
                        const titleCaseValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, char => char.toUpperCase()); // Convert first letter of each word to uppercase
                        setNewDepartmentName(titleCaseValue);
                    }}
                />
                <DarkButton
                    loading={loading}
                    onClick={handleNwDepartmentSave}
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Save"
                />
            </div>)}





            {showSubjectBox && (<div className='border border-black p-2'>
                {selectedDepartment._id}
                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={newSubjectName}

                    label="Subject"
                    placeholder="Computer Science"
                    width="w-[100%]"
                    inputClassName="w-min-[10rem]"
                    onChange={(e) => {
                        const titleCaseValue = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, char => char.toUpperCase()); // Convert first letter of each word to uppercase
                        setNewSubjectName(titleCaseValue);
                    }}
                />
                <DarkButton
                    loading={loading}
                    onClick={handleNwSubjectSave}
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Save"
                />
            </div>)}




        </div>
    );
}








