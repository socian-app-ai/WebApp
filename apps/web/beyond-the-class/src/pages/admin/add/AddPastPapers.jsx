// import { useState } from "react";
// import useUniversityData from "../hooks/useUniversityData";
// import axiosInstance from "../../../config/users/axios.instance";
// import LabelInputCustomizable from "../../../components/TextField/LabelInputCustomizable";
// import DarkButton from "../../../components/Buttons/DarkButton";
// import { Plus } from "lucide-react";

// export default function AddPastPapers() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);


//     const { UniversitySelector, currentUniversity,
//         CampusSelector, currentCampus,
//         DepartmentSelector, currentDepartment,
//         SubjectSelector, currentSubject,
//         TeacherSelector, currentTeacher,
//     } = useUniversityData();


//     const [formData, setFormData] = useState({
//         departmentId: '',
//         subjectId: '',
//         paperName: '',
//         pdfUrl: '',
//         teachers: [],
//         type: '',
//         term: '',
//     });




//     return (
//         <div className="min-h-screen p-5 bg-gray-100">
//             <h1 className="text-2xl font-bold mb-5">Campus Admin Panel</h1>
//             <h1 className="text-3xl font-bold mb-5">Add Past Papers</h1>
//             {UniversitySelector}
//             {CampusSelector}
//             {DepartmentSelector}
//             {SubjectSelector}


//             <div>
//                 <LabelInputCustomizable
//                     type="text"
//                     autoComplete="off"
//                     className="my-3 w-full"
//                     value={formData.paperName}
//                     label="Assignment"
//                     placeholder="X"
//                     width="w-[100%]"
//                     inputClassName="w-min-[10rem]"
//                     onChange={(e) => setFormData({ ...formData, paperName: e.target.value })}
//                 />
//                 <div>
//                     {TeacherSelector}
//                     <Plus onClick={() => setFormData({ ...formData, teachers: currentTeacher._id })} />
//                 </div>
//                 <DarkButton
//                     loading={loading}
//                     onClick={3}
//                     type="submit"
//                     className="flex my-4 justify-center items-center w-full"
//                     text="Save"
//                 />
//             </div>

//             <div>
//                 <h5>Info</h5>

//                 {formData.map((data, idx) => {
//                     return (
//                         <div key={idx}>
//                             departmentId: {data.departmentId}
//                             subjectId: {data.subjectId}
//                             paperName: {data.paperName}
//                             pdfUrl: {data.pdfUrl}
//                             teachers: {data.teachers.map((teacher, idx) => (<p key={idx}>{teacher}</p>))},
//                             type: {data.type}
//                             term: {data.term}
//                         </div>
//                     )
//                 })}

//             </div>

//         </div>
//     )
// }


















import { useState } from "react";
import useUniversityData from "../hooks/useUniversityData";
import axiosInstance from "../../../config/users/axios.instance";
import LabelInputCustomizable from "../../../components/TextField/LabelInputCustomizable";
import DarkButton from "../../../components/Buttons/DarkButton";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useEffect } from "react";

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

    // const addTeacher = () => {
    //     if (currentTeacher && !formData.teachers.includes(currentTeacher._id)) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             teachers: [...prev.teachers, currentTeacher._id],
    //         }));
    //     }
    // };

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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    options={[
                        // { value: '', label: 'Select Type' },
                        { value: 'assignment', label: 'Assignment' },
                        { value: 'quiz', label: 'Quiz' },
                        { value: 'mid', label: 'Midterm' },
                        { value: 'final', label: 'Final Term' },
                        { value: 'sessional', label: 'Sessional' },
                    ]}
                />

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
                        label="Term"
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
                    {formData.teachers.map((teacher) => (
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
                <pre className="bg-gray-200 p-3 rounded">{JSON.stringify(formData, null, 2)}</pre>
            </div>
        </div>
    );
}
