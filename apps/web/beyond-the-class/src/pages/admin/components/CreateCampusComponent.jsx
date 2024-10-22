import { useState } from "react";
import { LabelInputUnderLineCustomizable } from "../../../components/TextField/LabelInputCustomizable";
import axios from "axios";
import { useEffect } from 'react';

import { Avatar } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export function CreateCampusComponent() {
    const [campusData, setCampusData] = useState({
        universityOrigin: '',
        campusName: '',
        location: '',
        studentPattern: [],
        teacherPattern: [],
    });

    const [studentInput, setStudentInput] = useState('');
    const [teacherInput, setTeacherInput] = useState('');
    const [editStudentIndex, setEditStudentIndex] = useState(null);
    const [editTeacherIndex, setEditTeacherIndex] = useState(null);


    const handleStudentInputChange = (e) => setStudentInput(e.target.value);

    const handleAddStudentPattern = () => {
        if (studentInput.trim()) {
            setCampusData(prevData => ({
                ...prevData,
                studentPattern: [...prevData.studentPattern, studentInput.trim()],
            }));
            setStudentInput('');
        }
    };

    const handleEditStudentPattern = (index) => {
        setEditStudentIndex(index);
        setStudentInput(campusData.studentPattern[index]);
    };

    const handleSaveStudentEdit = () => {
        if (editStudentIndex !== null && studentInput.trim()) {
            const updatedPatterns = [...campusData.studentPattern];
            updatedPatterns[editStudentIndex] = studentInput.trim();
            setCampusData(prevData => ({
                ...prevData,
                studentPattern: updatedPatterns,
            }));
            setEditStudentIndex(null);
            setStudentInput('');
        }
    };


    const handleTeacherInputChange = (e) => setTeacherInput(e.target.value);

    const handleAddTeacherPattern = () => {
        if (teacherInput.trim()) {
            setCampusData(prevData => ({
                ...prevData,
                teacherPattern: [...prevData.teacherPattern, teacherInput.trim()],
            }));
            setTeacherInput('');
        }
    };

    const handleEditTeacherPattern = (index) => {
        setEditTeacherIndex(index);
        setTeacherInput(campusData.teacherPattern[index]);
    };

    const handleSaveTeacherEdit = () => {
        if (editTeacherIndex !== null && teacherInput.trim()) {
            const updatedPatterns = [...campusData.teacherPattern];
            updatedPatterns[editTeacherIndex] = teacherInput.trim();
            setCampusData(prevData => ({
                ...prevData,
                teacherPattern: updatedPatterns,
            }));
            setEditTeacherIndex(null);
            setTeacherInput('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(campusData);

    };

    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>Add another Campus to University </h1>
            <hr />

            <form onSubmit={handleSubmit} className='relative'>
                <button
                    type="submit"
                    className='absolute top-1 right-1 border p-1 mx-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg text-sm'>
                    Save this
                </button>

                <div className=' p-1'>
                    <div className='flex flex-row items-baseline space-x-2'>
                        <p>Campus Name: </p>
                        <LabelInputUnderLineCustomizable
                            type="text"
                            name="campus-name"
                            className="my-2"
                            placeholder="comsats lahore campus"
                            onChange={(e) => setCampusData({ ...campusData, campusName: e.target.value })}
                            value={campusData.campusName}
                        />
                    </div>

                    <div className='flex flex-row items-baseline space-x-2'>
                        <p>Location: </p>
                        <LabelInputUnderLineCustomizable
                            type="text"
                            name="location"
                            className="my-2"
                            placeholder="Lahore"
                            onChange={(e) => setCampusData({ ...campusData, location: e.target.value })}
                            value={campusData.location}
                        />
                    </div>


                    <div className='flex flex-row items-baseline space-x-2'>
                        <p>Student Pattern: </p>
                        <LabelInputUnderLineCustomizable
                            type="text"
                            name="student-pattern"
                            className="my-2"
                            placeholder="fa21-bcs-000@cuilahore.edu.pk"
                            onChange={handleStudentInputChange}
                            value={studentInput}
                            onKeyPress={(e) => e.key === 'Enter' && editStudentIndex === null ? handleAddStudentPattern() : null}
                        />
                        {editStudentIndex !== null ? (
                            <button className="p-1 bg-green-500 text-white rounded" type="button" onClick={handleSaveStudentEdit}>
                                Save
                            </button>
                        ) : (
                            <button className="p-1 bg-green-400 text-white rounded" type="button" onClick={handleAddStudentPattern}>
                                +
                            </button>
                        )}
                    </div>


                    <div className='flex flex-col mt-2 space-y-1'>
                        {campusData.studentPattern.map((pattern, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span>{pattern}</span>
                                <button className="text-sm text-blue-600 underline" type="button" onClick={() => handleEditStudentPattern(index)}>
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>


                    <div className='flex flex-row items-baseline space-x-2'>
                        <p>Teacher Pattern: </p>
                        <LabelInputUnderLineCustomizable
                            type="text"
                            name="teacher-pattern"
                            className="my-2"
                            placeholder="teacher@cuilahore.edu.pk"
                            onChange={handleTeacherInputChange}
                            value={teacherInput}
                            onKeyPress={(e) => e.key === 'Enter' && editTeacherIndex === null ? handleAddTeacherPattern() : null}
                        />
                        {editTeacherIndex !== null ? (
                            <button className="p-1 bg-green-500 text-white rounded" type="button" onClick={handleSaveTeacherEdit}>
                                Save
                            </button>
                        ) : (
                            <button className="p-1 bg-green-400 text-white rounded" type="button" onClick={handleAddTeacherPattern}>
                                +
                            </button>
                        )}
                    </div>


                    <div className='flex flex-col mt-2 space-y-1'>
                        {campusData.teacherPattern.map((pattern, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span>{pattern}</span>
                                <button className="text-sm text-blue-600 underline" type="button" onClick={() => handleEditTeacherPattern(index)}>
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>


            </form>
        </>
    );
}

export function AcademicFormat() {
    const [selectedFormat, setSelectedFormat] = useState('');
    const [format, setFormat] = useState('');

    const handleRadioChange = (e) => {
        setSelectedFormat(e.target.value);
        if (e.target.value !== 'Other') {
            setFormat(e.target.value);
        }
    };

    const handleOtherFormatChange = (e) => {
        setFormat(e.target.value);
    };

    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>Manage Academic Format </h1>
            <hr />
            <div className="flex flex-col p-2 ">
                <label>
                    <input
                        type="radio"
                        value="Quiz, assignments, mid term, final term"
                        checked={selectedFormat === 'Quiz, assignments, mid term, final term'}
                        onChange={handleRadioChange}
                    />
                    1. Quiz, assignments, mid term, final term
                </label>
                <label>
                    <input
                        type="radio"
                        value="Quiz, assignments, sessional 1, sessional 2, final term"
                        checked={selectedFormat === 'Quiz, assignments, sessional 1, sessional 2, final term'}
                        onChange={handleRadioChange}
                    />
                    2. Quiz, assignments, sessional 1, sessional 2, final term
                </label>
                <label>
                    <input
                        type="radio"
                        value="Other"
                        checked={selectedFormat === 'Other'}
                        onChange={handleRadioChange}
                    />
                    3. Other
                    {selectedFormat === 'Other' && (
                        <LabelInputUnderLineCustomizable
                            type="text"
                            value={format}
                            placeholder="Specify other format"
                            onChange={handleOtherFormatChange}
                        />
                    )}
                </label>
            </div>
        </>
    );
}


export function Departments() {

    const [departments, setdepartments] = useState([]);
    const [newInput, setNewInput] = useState("");


    const handleTeacherInputChange = (index, value) => {
        const updatedPatterns = [...departments];
        updatedPatterns[index] = value;
        setdepartments(updatedPatterns);
    };


    const handleAddTeacherPattern = () => {
        if (newInput.trim() !== "") {
            setdepartments([...departments, newInput]);
            setNewInput("");
        }
    };


    const handleRemoveTeacherPattern = (index) => {
        const updatedPatterns = departments.filter((_, i) => i !== index);
        setdepartments(updatedPatterns);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/departments/create-list?campusId=${}&universityId=${}', { departments });
            console.log('Data submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>Manage Departments </h1>
            <hr />

            <div className="px-2 my-2  ">
                <form className="relative" onSubmit={handleSubmit}>
                    <button
                        type="submit"
                        className='absolute top-1 right-1 border p-1 mx-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg text-sm'>
                        Save this
                    </button>
                    <div className="flex flex-row items-baseline space-x-2">
                        <p>Department:</p>
                        <LabelInputUnderLineCustomizable
                            type="text"
                            name="deparments"
                            className="my-2"
                            placeholder="Departments"
                            value={newInput}
                            onChange={(e) => setNewInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? handleAddTeacherPattern() : null}
                        />
                        <button type="button" onClick={handleAddTeacherPattern} className="px-2 py-1 bg-green-400 text-white rounded">
                            +
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-x-2.5">
                        {departments.map((pattern, index) => (
                            <div key={index} className="flex flex-row items-center">
                                <LabelInputUnderLineCustomizable
                                    type="text"
                                    name={`departments-${index}`}
                                    value={pattern}
                                    placeholder="Departments"
                                    onChange={(e) => handleTeacherInputChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemoveTeacherPattern(index)}
                                    className="px-2 py-1  bg-red-500 text-white rounded">
                                    -
                                </button>
                            </div>

                        ))}
                    </div>



                </form>
            </div>
        </>
    );
}






export default function DepartmentsManager() {

    const [departments, setDepartments] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState({});
    const [newSubjectInput, setNewSubjectInput] = useState({});
    const [expanded, setExpanded] = useState(false); // For handling open/close of departments

    useEffect(() => {
        // Fetch departments with their subjects
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments/');
                setDepartments(response.data);

                // Initialize subject state for each department
                const initialSubjects = {};
                response.data.forEach(department => {
                    initialSubjects[department._id] = department.subjects || [];
                });
                setSelectedSubjects(initialSubjects);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleAddSubject = (deptId) => {
        const subject = newSubjectInput[deptId]?.trim();
        if (subject && !selectedSubjects[deptId].includes(subject)) {
            const updatedSubjects = { ...selectedSubjects, [deptId]: [...selectedSubjects[deptId], subject] };
            setSelectedSubjects(updatedSubjects);
            setNewSubjectInput({ ...newSubjectInput, [deptId]: '' }); // Clear the input field
        }
    };

    const handleRemoveSubject = (deptId, index) => {
        const updatedSubjects = selectedSubjects[deptId].filter((_, i) => i !== index);
        setSelectedSubjects({ ...selectedSubjects, [deptId]: updatedSubjects });
    };

    const handleSaveSubjects = async (deptId) => {
        try {
            const response = await axios.post(`/api/departments/${deptId}/update-subjects`, {
                subjects: selectedSubjects[deptId],
            });
            console.log('Subjects updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating subjects:', error);
        }
    };

    const handleAccordionChange = (deptId) => (event, isExpanded) => {
        setExpanded(isExpanded ? deptId : false);
    };

    return (
        <div className='w-full'>
            <h1 className='text-2xl font-bold mb-4'>Manage Departments and Subjects</h1>
            <hr />
            {departments.map((department) => (
                <Accordion key={department._id} expanded={expanded === department._id} onChange={handleAccordionChange(department._id)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="flex items-center">
                            <Avatar src={department.logo} className='mr-2' />
                            <p className='text-lg'>{department.name}</p>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className='space-y-3'>
                            <div className="space-y-2">
                                {selectedSubjects[department._id]?.map((subject, index) => (
                                    <div key={index} className='flex items-center justify-between'>
                                        <p className='text-sm'>{subject}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubject(department._id, index)}
                                            className="text-red-500 text-sm">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className='flex items-center'>
                                <input
                                    type='text'
                                    value={newSubjectInput[department._id] || ''}
                                    onChange={(e) => setNewSubjectInput({ ...newSubjectInput, [department._id]: e.target.value })}
                                    placeholder='Add new subject'
                                    className='border rounded p-1 mr-2'
                                />
                                <button onClick={() => handleAddSubject(department._id)} className='px-2 py-1 bg-green-500 text-white rounded'>
                                    Add
                                </button>
                            </div>

                            <button
                                onClick={() => handleSaveSubjects(department._id)}
                                className='px-3 py-1 bg-blue-500 text-white rounded'>
                                Save Subjects
                            </button>
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
