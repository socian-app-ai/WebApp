import { useState, useEffect } from "react";
import useUniversityData from "../../../hooks/useUniversityData";
import axiosInstance from "../../../../../config/users/axios.instance";
import LabelInputCustomizable from "../../../../../components/TextField/LabelInputCustomizable";
import DarkButton from "../../../../../components/Buttons/DarkButton";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import DropZone from "../../../../../components/dropZone/DropZone";
import { useAuthContext } from "../../../../../context/AuthContext";
import toast from 'react-hot-toast';

export default function AddPastPapers() {
    const [loading, setLoading] = useState(false);

    const {authUser} = useAuthContext()

    const {
        UniversitySelector, currentUniversity,
        CampusSelector, currentCampus,
        DepartmentSelector, currentDepartment,
        SubjectSelector, currentSubject,
        TeacherSelector, currentTeacher
    } = useUniversityData();

    const [formData, setFormData] = useState({
        departmentId: '',
        subjectId: '',
        year: 0,
        paperName: '',
        pdfUrl: '',
        teachers: [],
        type: '',
        term: '',
        termMode: '',
        sessionType: ''
    });

    const [file, setFile] = useState(null);
    const [disableUrlField, setDisableUrlField] = useState(false);

    const handleFilesAdded = (newFile) => {
        try {
            if (newFile && Array.isArray(newFile) && newFile.length > 0) {
                setFile(newFile[0]);
            } else {
                console.warn('Invalid file data received');
                setFile(null);
            }
        } catch (error) {
            console.error('Error handling file addition:', error);
            setFile(null);
        }
    };

    useEffect(() => {
        try {
            if (currentDepartment && currentSubject) {
                setFormData((prev) => ({
                    ...prev,
                    departmentId: currentDepartment._id || '',
                    subjectId: currentSubject._id || '',
                }));
            }
        } catch (error) {
            console.error('Error updating form data:', error);
        }
    }, [currentDepartment, currentSubject]);

    const handleTypeChange = (value) => {
        try {
            if (value !== 'SESSIONAL') {
                setFormData(prev => ({ ...prev, type: value, sessionType: '' }));
            } else {
                setFormData(prev => ({ ...prev, type: value }));
            }
        } catch (error) {
            console.error('Error handling type change:', error);
        }
    };

    const validateForm = () => {
        const requiredFields = {
            year: formData.year,
            type: formData.type,
            department: currentDepartment,
            subject: currentSubject,
            file: file
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            const fieldNames = missingFields.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(', ');
            throw new Error(`Please fill all required fields: ${fieldNames}`);
        }

        // Validate sessional type if applicable
        if (formData.type === 'SESSIONAL' && !formData.sessionType) {
            throw new Error('Please select Sessional type (1 or 2)');
        }

        if (formData.type === 'MIDTERM' || formData.type === 'FINAL') {
            if (formData.term === '' || formData.termMode === '') {
                throw new Error('Term and Term Mode are required for Mid/Final Term');
            }
        }
    };

    const handleFileUpload = async () => {
        try {
            setLoading(true);

            validateForm();

            if(!currentCampus?._id || !currentUniversity?._id){
                return
            }
            const formDataConst = new FormData();
            formDataConst.append('file', file);
            formDataConst.append('departmentId', formData.departmentId);
            formDataConst.append('subjectId', formData.subjectId);
            formDataConst.append('year', formData.year);
            formDataConst.append('type', formData.type);
            formDataConst.append('term', formData.term);
            formDataConst.append('termMode', formData.termMode);
            formDataConst.append('universityOrigin', currentUniversity._id);
            formDataConst.append('campusOrigin', currentCampus._id);
            
            if (formData.type === 'SESSIONAL') {
                formDataConst.append('sessionType', formData.sessionType);
            }

            const response = await axiosInstance.post('/api/uploads/upload/pastpaper/aws', formDataConst, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response?.data?.path) {
                setDisableUrlField(true);
                setFormData({ ...formData, pdfUrl: response.data.path });
                toast.success('File uploaded successfully!');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('File upload error:', err);
            const errorMessage = err.message || err.response?.data || 'File upload failed.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!formData.pdfUrl) {
                throw new Error('Please upload a file first');
            }

            if (!formData.paperName) {
                throw new Error('Please enter a paper name');
            }

            const dataToSubmit = {
                ...formData,
                universityOrigin: currentUniversity?._id,
                campusOrigin: currentCampus?._id,
                userId: authUser?._id,
                teachers: formData.teachers.map(t => t.id)
            };

            const response = await axiosInstance.post('/api/super/pastpaper/upload/types', dataToSubmit);

            if (response.data) {
                toast.success('Past paper added successfully!');
                // Reset form
                setFormData({
                    departmentId: currentDepartment?._id || '',
                    subjectId: currentSubject?._id || '',
                    year: 0,
                    paperName: '',
                    pdfUrl: '',
                    teachers: [],
                    type: '',
                    term: '',
                    termMode: '',
                    sessionType: ''
                });
                setFile(null);
                setDisableUrlField(false);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Submit error:', err);
            const errorMessage = err.message || err.response?.data || 'Failed to submit past paper.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: (currentYear - 1999) + 1 }, (_, i) => {
        const year = 1999 + i;
        return { value: year, label: `${year}` };
    });

    return (
        <div className="min-h-screen p-5 bg-white dark:bg-black text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-5">Campus Admin Panel</h1>
            <h1 className="text-3xl font-bold mb-5">Add Past Papers</h1>

            {UniversitySelector}
            {CampusSelector}
            {DepartmentSelector}
            {SubjectSelector}

            <div>
                <LabelInputCustomizable
                    type="select"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={formData.year}
                    label="Year"
                    placeholder="Enter year"
                    width="w-[100%]"
                    inputClassName="min-w-[10rem]"
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    options={yearsOptions}
                />

                <LabelInputCustomizable
                    type="text"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={formData.paperName}
                    label="Paper Name"
                    placeholder="Enter paper name"
                    width="w-[100%]"
                    inputClassName="min-w-[10rem]"
                    onChange={(e) => setFormData({ ...formData, paperName: e.target.value })}
                />

                <LabelInputCustomizable
                    type="url"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={formData.pdfUrl}
                    label="PDF URL"
                    placeholder="Enter PDF URL"
                    disabled={disableUrlField}
                    width="w-[100%]"
                    inputClassName="min-w-[10rem]"
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                />

                <LabelInputCustomizable
                    type="select"
                    autoComplete="off"
                    className="my-3 w-full"
                    value={formData.type}
                    label="Type"
                    placeholder="Assignment/Quiz/Exam"
                    width="w-[100%]"
                    inputClassName="min-w-[10rem]"
                    onChange={(e) => handleTypeChange(e.target.value)}
                    options={[
                        { value: 'ASSIGNMENT', label: 'Assignment' },
                        { value: 'QUIZ', label: 'Quiz' },
                        { value: 'MIDTERM', label: 'Midterm' },
                        { value: 'SESSIONAL', label: 'Sessional' },
                        { value: 'FINAL', label: 'Final Term' }
                    ]}
                />

                {formData.type === 'SESSIONAL' && (
                    <LabelInputCustomizable
                        type="select"
                        autoComplete="off"
                        className="my-3 w-full"
                        value={formData.sessionType}
                        label="Sessional Type"
                        placeholder="Select Sessional Type"
                        width="w-[100%]"
                        inputClassName="min-w-[10rem]"
                        onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                        options={[
                            { value: '1', label: 'Sessional 1' },
                            { value: '2', label: 'Sessional 2' }
                        ]}
                    />
                )}

                {(formData.type === 'MIDTERM' || formData.type === 'FINAL') && (
                    <>
                        <LabelInputCustomizable
                            type="select"
                            autoComplete="off"
                            className="my-3 w-full"
                            value={formData.term}
                            label="Term"
                            placeholder="Fall/Spring"
                            width="w-[100%]"
                            inputClassName="min-w-[10rem]"
                            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                            options={[
                                { value: 'FALL', label: 'Fall' },
                                { value: 'SPRING', label: 'Spring' }
                            ]}
                        />

                        <LabelInputCustomizable
                            type="select"
                            autoComplete="off"
                            className="my-3 w-full"
                            value={formData.termMode}
                            label="Term Mode"
                            placeholder="Lab/Theory"
                            width="w-[100%]"
                            inputClassName="min-w-[10rem]"
                            onChange={(e) => setFormData({ ...formData, termMode: e.target.value })}
                            options={[
                                { value: 'LAB', label: 'Lab' },
                                { value: 'THEORY', label: 'Theory' }
                            ]}
                        />
                    </>
                )}

                <div>
                    <h3 className="font-semibold">Complete all Fields to generate a PDF Url</h3>
                    <p className="font-thin text-xs">The url will be pasted on PDF url field please do not edit it.</p>
                    <p className="font-thin text-xs">If you have a url then paste it(we recommend using our service for faster cdn)</p>
                    <div className="my-2">
                        <DropZone onFilesAdded={handleFilesAdded} />
                    </div>
                    {file && (
                        <div className="mt-4 dark:bg-gray-900 bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Uploaded File Preview</h2>
                            {file.type === "application/pdf" ? (
                                <iframe
                                    src={file.preview}
                                    className="w-full h-48 border rounded-md mt-2"
                                    title={file.name}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                ></iframe>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic mt-2">Cannot preview this file type.</p>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{file.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DarkButton
                    loading={loading}
                    onClick={handleFileUpload}
                    type="button"
                    className="flex my-4 justify-center items-center w-full"
                    text="Process File Upload"
                />

                <div className="flex items-center gap-2">
                    {TeacherSelector}
                    <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => {
                            try {
                                if (currentTeacher && !formData.teachers.some((t) => t.id === currentTeacher._id)) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        teachers: [...prev.teachers, { id: currentTeacher._id, name: currentTeacher.name }],
                                    }));
                                    toast.success('Teacher added successfully!');
                                } else if (currentTeacher) {
                                    toast.error('Teacher already added');
                                }
                            } catch (error) {
                                console.error('Error adding teacher:', error);
                                toast.error('Failed to add teacher');
                            }
                        }}
                    >
                        <Plus />
                    </button>
                </div>

                <div className="mt-4">
                    <h5 className="font-bold mb-2">Selected Teachers</h5>
                    {formData.teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex items-center gap-2 dark:bg-gray-900 bg-gray-200 p-2 rounded mb-2"
                        >
                            <span>{teacher.name}</span>
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => {
                                    try {
                                        setFormData((prev) => ({
                                            ...prev,
                                            teachers: prev.teachers.filter((t) => t.id !== teacher.id),
                                        }));
                                        toast.success('Teacher removed successfully!');
                                    } catch (error) {
                                        console.error('Error removing teacher:', error);
                                        toast.error('Failed to remove teacher');
                                    }
                                }}
                            >
                                <Trash />
                            </button>
                        </div>
                    ))}
                </div>

                <DarkButton
                    loading={loading}
                    onClick={handleSubmit}
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Submit Past Paper"
                />
            </div>
        </div>
    );
}
