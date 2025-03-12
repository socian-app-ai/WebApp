import { useState, useEffect } from "react";
import useUniversityData from "../hooks/useUniversityData";
import axiosInstance from "../../../config/users/axios.instance";
import LabelInputCustomizable from "../../../components/TextField/LabelInputCustomizable";
import DarkButton from "../../../components/Buttons/DarkButton";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import DropZone from "../../../components/dropZone/DropZone";

export default function AddPastPapers() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        setFile(newFile[0]);
    };

    useEffect(() => {
        if (currentDepartment && currentSubject) {
            setFormData((prev) => ({
                ...prev,
                departmentId: currentDepartment._id,
                subjectId: currentSubject._id,
            }));
        }
    }, [currentDepartment, currentSubject]);

    const handleTypeChange = (value) => {
        if (value !== 'SESSIONAL') {
            setFormData(prev => ({ ...prev, type: value, sessionType: '' }));
        } else {
            setFormData(prev => ({ ...prev, type: value }));
        }
    };

    const handleFileUpload = async () => {
        if (!formData.year || !formData.type || !currentDepartment || !currentSubject || !file) {
            alert('Please fill all required fields and upload a file.');
            return;
        }

        // Validate sessional type if applicable
        if (formData.type === 'SESSIONAL' && !formData.sessionType) {
            alert('Please select Sessional type (1 or 2)');
            return;
        }

        if (formData.type === 'MIDTERM' || formData.type === 'FINAL') {
            if (formData.term === '' || formData.termMode === '') {
                alert('Term and Term Mode are required for Mid/Final Term');
                return;
            }
        }

        const formDataConst = new FormData();
        formDataConst.append('file', file);
        formDataConst.append('departmentId', formData.departmentId);
        formDataConst.append('subjectId', formData.subjectId);
        formDataConst.append('year', formData.year);
        formDataConst.append('type', formData.type);
        formDataConst.append('term', formData.term);
        formDataConst.append('termMode', formData.termMode);
        if (formData.type === 'SESSIONAL') {
            formDataConst.append('sessionType', formData.sessionType);
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/uploads/upload/pastpaper/aws', formDataConst, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDisableUrlField(true);
            setFormData({ ...formData, pdfUrl: response.data.path });
        } catch (err) {
            console.error('File upload error:', err);
            setError(err.response?.data || 'File upload failed.');
            alert(err.response?.data || 'File upload failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.pdfUrl) {
            alert('Please upload a file first');
            return;
        }

        if (!formData.paperName) {
            alert('Please enter a paper name');
            return;
        }

        if (formData.teachers.length === 0) {
            alert('Please select at least one teacher');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const dataToSubmit = {
                ...formData,
                universityId: currentUniversity?._id,
                campusId: currentCampus?._id,
                teachers: formData.teachers.map(t => t.id)
            };

            const response = await axiosInstance.post('/api/super/pastpaper/upload/types', dataToSubmit);

            if (response.data) {
                alert('Past paper added successfully!');
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
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data || 'Failed to submit past paper.');
            alert(err.response?.data || 'Failed to submit past paper.');
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
        <div className="min-h-screen p-5">
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
                            <h2 className="text-lg font-semibold text-gray-700">Uploaded File Preview</h2>
                            {file.type === "application/pdf" ? (
                                <iframe
                                    src={file.preview}
                                    className="w-full h-48 border rounded-md mt-2"
                                    title={file.name}
                                ></iframe>
                            ) : (
                                <p className="text-gray-500 italic mt-2">Cannot preview this file type.</p>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">{file.name}</p>
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
                            if (currentTeacher && !formData.teachers.some((t) => t.id === currentTeacher._id)) {
                                setFormData((prev) => ({
                                    ...prev,
                                    teachers: [...prev.teachers, { id: currentTeacher._id, name: currentTeacher.name }],
                                }));
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
                                    setFormData((prev) => ({
                                        ...prev,
                                        teachers: prev.teachers.filter((t) => t.id !== teacher.id),
                                    }));
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
                    className="flex mt-8 justify-center items-center w-full"
                    text="Submit Past Paper"
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Form Data Preview</h3>
                <pre className="whitespace-pre-wrap overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded-lg">
                    {JSON.stringify({
                        ...formData,
                        currentUniversity: currentUniversity?._id,
                        currentCampus: currentCampus?._id,
                        currentDepartment: currentDepartment?._id,
                        currentSubject: currentSubject?._id,
                        currentTeacher: currentTeacher?._id,
                        fileInfo: file ? {
                            name: file.name,
                            type: file.type,
                            size: file.size
                        } : null
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
}
