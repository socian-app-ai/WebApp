import { useState } from "react";
import useUniversityData from "../hooks/useUniversityData";
import axiosInstance from "../../../config/users/axios.instance";
import LabelInputCustomizable from "../../../components/TextField/LabelInputCustomizable";
import DarkButton from "../../../components/Buttons/DarkButton";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useEffect } from "react";
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
        termMode: ''
    });


    const [file, setFile] = useState(null);
    const [disableUrlField, setDisableUrlField] = useState(false)

    const handleFilesAdded = (newFile) => {
        setFile(newFile[0]);
        console.log(newFile)
    };

    useEffect(() => {
        if (currentDepartment && currentSubject) {
            setFormData((prev) => ({
                ...prev,
                departmentId: currentDepartment._id,
                subjectId: currentSubject._id,
            }));
        }
    }, [currentDepartment, currentSubject])

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            const payload = {
                ...formData,
                departmentId: currentDepartment?._id,
                subjectId: currentSubject?._id,
                teachers: formData.teachers.map((teacher) => teacher.id), // Only include IDs
            };

            const response = await axiosInstance.post("/api/pastpaper/upload/types", payload);
            console.log("Saved successfully:", response.data);
            alert("Past paper added successfully!");

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };


    // const validateForm = () => {
    //     let requiredFields = ["year", "type", "departmentId", "subjectId"];
    //     if (formData.type === 'mid' || formData.type === 'final') {
    //         requiredFields.push(...requiredFields, ["termMode", "term"])
    //     }
    //     for (const field of requiredFields) {
    //         if (!formData[field]) {
    //             alert(`${field} is required.`);
    //             return false;
    //         }
    //     }
    //     if (file.length === 0 && !formData.pdfUrl) {
    //         alert("Please upload a file or provide a URL.");
    //         return false;
    //     }
    //     return true;
    // };

    // const handleFileUpload = async () => {
    //     try {
    //         setLoading(true);
    //         setError(null);
    //         if (
    //             formData.year === '' ||
    //             formData.departmentId === '' ||
    //             formData.subjectId === '' ||
    //             formData.type === '' ||
    //             // formData.term === '' ||
    //             // formData.termMode === '' ||
    //             file.length === 0
    //         ) {
    //             alert('all field required except url')
    //             return
    //         }
    //         const payload = {
    //             ...formData,
    //             file: file[0],
    //             departmentId: currentDepartment?._id,
    //             subjectId: currentSubject?._id,
    //         };

    //         const response = await axiosInstance.post("/api/uploads/upload/pastpaper/aws", payload);
    //         console.log("Saved successfully:", response.data);
    //         alert("Past paper file uploaded successfully!");
    //         setDisableUrlField(true)
    //     } catch (err) {
    //         setError(err.response?.data?.message || "Something went wrong!");
    //     } finally {
    //         setLoading(false);
    //     }
    // }



    const handleFileUpload = async () => {
        if (!formData.year || !formData.type || !currentDepartment || !currentSubject || !file) {

            alert('Please fill all required fields and upload a file.');
            return;
        }
        if (formData.type === 'mid' || formData.type === 'final') {
            if (formData.term === '' || formData.termMode === '') {
                alert('Term and TemMode also required when Mid/Final Term');
                return;
            }
        }


        if (!file) {
            alert('Please upload a file');
            return;
        }

        const formDataConst = new FormData();
        formDataConst.append('file', file);
        formDataConst.append('departmentId', formData.departmentId);
        formDataConst.append('subjectId', formData.subjectId);
        formDataConst.append('year', formData.year);
        formDataConst.append('type', formData.type);
        formDataConst.append('term', formData.term);
        formDataConst.append('termMode', formData.termMode);

        try {
            const response = await axiosInstance.post('/api/uploads/upload/pastpaper/aws', formDataConst, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // alert('File uploaded successfully!');
            console.log(response.data);

            setDisableUrlField(true)
            setFormData({ ...formData, pdfUrl: response.data.path })
            console.log("FORM DATA ", formData)
        } catch (err) {
            console.error('File upload error:', err);
            alert(err.response?.data || 'File upload failed.');
        }
    };


    const addTeacher = () => {
        if (currentTeacher && !formData.teachers.some((t) => t.id === currentTeacher._id)) {
            setFormData((prev) => ({
                ...prev,
                teachers: [...prev.teachers, { id: currentTeacher._id, name: currentTeacher.name }],
            }));
        }
    };

    const removeTeacher = (id) => {
        setFormData((prev) => ({
            ...prev,
            teachers: prev.teachers.filter((teacher) => teacher.id !== id),
        }));
    };


    const currentYear = new Date().getFullYear(); // Get the latest year
    const yearsOptions = Array.from({ length: (currentYear - 1999) + 1 }, (_, i) => {
        const year = 1999 + i;
        return { value: year, label: `${year}` };
    });

    return (
        <div className="min-h-screen p-5 bg-gray-100">
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
                    onChange={(e) => {
                        setFormData({ ...formData, type: e.target.value })
                        if (formData.type !== 'mid' || formData.type !== 'final') {
                            setFormData({
                                ...formData,
                                type: e.target.value,
                                termMode: '',
                                term: ''
                            })
                        }
                    }}
                    options={[
                        // { value: '', label: 'Select Type' },
                        { value: 'assignment', label: 'Assignment' },
                        { value: 'quiz', label: 'Quiz' },
                        { value: 'mid', label: 'Midterm' },
                        { value: 'final', label: 'Final Term' },
                        { value: 'sessional', label: 'Sessional' },
                    ]}
                />
                <div>
                    <h3 className="font-semibold">Complete all Fields to generate a PDF Url</h3>
                    <p className="font-thin text-xs">The url will be pasted on PDF url field please do not edit it.</p>
                    <p className="font-thin text-xs">If you have a url then paste it(we recommend using our service for faster cdn)</p>
                    <div className="my-2">
                        <DropZone onFilesAdded={handleFilesAdded} />
                    </div>
                    <div>PDF View

                        {file && (
                            <div className="mt-4 bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-lg font-semibold text-gray-700">Uploaded File Preview</h2>
                                {file.type.startsWith("image/") ? (
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="w-full h-48 object-cover rounded-md mt-2"
                                    />
                                ) : file.type === "application/pdf" ? (
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
                        type="submit"
                        className="flex my-4 justify-center items-center w-full"
                        text="Process"
                    />
                </div>

                {(formData.type === "mid" || formData.type === "final") && (
                    <LabelInputCustomizable
                        type="select"
                        autoComplete="off"
                        className="my-3 w-full"
                        value={formData.term}
                        label="Term"
                        placeholder="Midterm/Final"
                        width="w-[100%]"
                        inputClassName="min-w-[10rem]"
                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                        options={[
                            // { value: '', label: 'Select Type' },
                            { value: 'fall', label: 'Fall' },
                            { value: 'spring', label: 'Spring' }
                        ]}
                    />
                )}


                {(formData.type === "mid" || formData.type === "final") && (
                    <LabelInputCustomizable
                        type="select"
                        autoComplete="off"
                        className="my-3 w-full"
                        value={formData.termMode}
                        label="TermMode"
                        placeholder="Lab/Theory"
                        width="w-[100%]"
                        inputClassName="min-w-[10rem]"
                        onChange={(e) => setFormData({ ...formData, termMode: e.target.value })}
                        options={[
                            // { value: '', label: 'Select Type' },
                            { value: 'lab', label: 'Lab' },
                            { value: 'theory', label: 'Theory' }
                        ]}
                    />
                )}

                <div className="flex items-center gap-2">
                    {TeacherSelector}
                    <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={addTeacher}
                    >
                        <Plus />
                    </button>
                </div>

                <DarkButton
                    loading={loading}
                    onClick={handleSave}
                    type="submit"
                    className="flex my-4 justify-center items-center w-full"
                    text="Save"
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div>
                <div className="mt-4">
                    <h5 className="font-bold mb-2">Selected Teachers</h5>
                    {formData.teachers && formData.teachers.length !== 0 && formData.teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex items-center gap-2 bg-gray-200 p-2 rounded mb-2"
                        >
                            <span>{teacher.name}</span>
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => removeTeacher(teacher.id)}
                            >
                                <Trash />
                            </button>
                        </div>
                    ))}
                </div>
                <h5 className="font-bold mt-5">Form Data Preview</h5>
                <pre className="bg-gray-200 p-3 rounded whitespace-break-spaces" style={{ lineBreak: 'anywhere' }}>{JSON.stringify(formData, null, 2)}</pre>
            </div>
        </div>
    );
}
