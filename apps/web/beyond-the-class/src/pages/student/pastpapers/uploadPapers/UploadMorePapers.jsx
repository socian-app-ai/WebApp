import { useEffect, useState } from 'react';
import axiosInstance from '../../../config/axios.instance';
import { LoaderIcon } from 'react-hot-toast';

export default function UploadMorePapers() {
    const [file, setFile] = useState(null);
    const [year, setYear] = useState('');

    const [type, setType] = useState('');
    const [scheme, setScheme] = useState('');
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    // const [years, setYears] = useState([]);

    const [subjectID, setSubjectID] = useState('');
    const [subjectName, setSubjectName] = useState('');

    const [departmentID, setDepartmentID] = useState('');
    const [departmentName, setDepartmentName] = useState('');


    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState('');




    useEffect(() => {
        async function fetchDepartments() {
            try {
                const response = await axiosInstance.get('api/department');
                // console.log(response.data.departments._id)
                setDepartments(response.data.departments);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        }

        fetchDepartments();
    }, []);


    useEffect(() => {
        async function fetchSubjects(departmentId) {
            try {
                const response = await axiosInstance.get(`api/subject/by-dept?departmentId=${departmentId}`);
                // console.log(response.data)
                setSubjects(response.data.subjects.subjects);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        }

        if (departmentID) {
            fetchSubjects(departmentID);
        }
    }, [departmentID]);


    // useEffect(() => {
    //     async function fetchYears() {
    //         try {
    //             const response = await axiosInstance.get(`api/years/`);
    //             console.log(response.data)
    //             setYears(response.data.years);
    //         } catch (error) {
    //             console.error('Error fetching subjects:', error);
    //         }
    //     }

    //     fetchYears();

    // }, [years]);//create years model for this later

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {

        // console.log(
        //     departmentName
        //     , courseName
        //     , subjectName
        //     , year
        //     , type
        //     , scheme
        //     , file
        // )
        if (!file || !year || !subjectName || !type || !scheme || !departmentName || !courseName) {
            alert('Please fill all fields and select a file.');
            return;
        }
        setLoading(true)

        const formData = new FormData();
        formData.append('file', file);
        formData.append('year', year);
        formData.append('subject', subjectName);
        formData.append('type', type);
        formData.append('scheme', scheme);
        formData.append('department', departmentName);
        formData.append('courseId', courseName);


        try {
            const response = await axiosInstance.post('/api/pastpapers/upload/user-request', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');

        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-svh flex items-center justify-center ">
            <div className=" p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Upload Past Papers</h2>

                <div className="mb-4">
                    Department
                    <select onChange={(e) => {
                        const selectedDept = departments.find(dept => dept._id === e.target.value);
                        if (selectedDept) {
                            setDepartmentName(selectedDept.name);
                            setDepartmentID(selectedDept._id);
                            // console.log("selectedDept: ", selectedDept);
                        }
                    }}
                        className="w-full px-4 py-2 capitalize border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            < option key={dept._id} value={dept._id} > {dept.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    Subject
                    <select onChange={(e) => {
                        const selectedSubject = subjects.find(subj => subj._id === e.target.value);
                        if (selectedSubject) {
                            setSubjectID(selectedSubject._id)
                            setSubjectName(selectedSubject.name)
                            // console.log("selectedSubject: ", selectedSubject);
                            setCourseName(selectedSubject.courseCode.courseCode)
                        }

                    }} className="w-full px-4 py-2 capitalize border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Subject</option>
                        {subjects.map((subj) => (
                            <option key={subj._id} value={subj._id}>{subj.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    Year
                    <input
                        type="text"
                        placeholder="e.g FA23"
                        autoCapitalize="characters"
                        value={year}
                        onChange={(e) => setYear(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 capitalize text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* <div className="mb-4">
                    
                    <input
                        type="text"
                        placeholder="e.g MIDTERM"
                        autoCapitalize="characters"
                        value={type}
                        onChange={(e) => setType(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 capitalize text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div> */}

                <div className="mb-4">
                    Type
                    <select value={type} onChange={(e) => setType(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 capitalize border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option defaultChecked>FINAL</option>
                        <option>MIDTERM</option>
                    </select>
                </div>

                <div className="mb-4">
                    Scheme
                    <select value={scheme} onChange={(e) => setScheme(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 capitalize border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option defaultChecked>THEORY</option>
                        <option>LAB</option>
                    </select>
                </div>

                <div className="mb-4">
                    File
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 text-black dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    disabled={loading}
                    onClick={handleUpload}
                    className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200">
                    {!loading ? 'Upload' : <LoaderIcon />}
                </button>
            </div>
        </div >
    );
}











// import { useState } from 'react';
// import axiosInstance from '../../../config/axios.instance';

// export default function UploadMorePapers() {
//     const [file, setFile] = useState(null);
//     const [year, setYear] = useState('');
//     const [subject, setSubject] = useState('');
//     const [type, setType] = useState('');
//     const [scheme, setScheme] = useState('');

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file || !year || !subject || !type || !scheme) {
//             alert('Please fill all fields and select a file.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('year', year);
//         formData.append('subject', subject);
//         formData.append('type', type);
//         formData.append('scheme', scheme);

//         console.log(file, year, subject, type, scheme)
//         try {
//             const response = await axiosInstance.post('/ap/pastpapers/upload/user-request', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             alert(response.data);
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert('Error uploading file');
//         }
//     };

//     return (
//         <div className="min-h-svh flex items-center justify-center ">
//             <div className=" p-8 rounded-lg shadow-lg w-full max-w-lg">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Upload Past Papers</h2>
//                 <div className="mb-4">
//                     Year
//                     <input
//                         type="text"
//                         placeholder="e.g FA23"
//                         autoCapitalize='characters'
//                         value={year}
//                         onChange={(e) => setYear(e.target.value.toUpperCase())}
//                         className="w-full px-4 py-2 capitalize text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     Subject
//                     <input
//                         type="text"
//                         placeholder="e.g DCCN"
//                         autoCapitalize='characters'
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value.toUpperCase())}
//                         className="w-full px-4 py-2 capitalize text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     Type
//                     <input
//                         type="text"
//                         placeholder="e.g MIDTERM"
//                         autoCapitalize='characters'
//                         value={type}
//                         onChange={(e) => setType(e.target.value.toUpperCase())}
//                         className="w-full px-4 py-2 capitalize text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div>
//                     Scheme
//                     <select onChange={(e) => setScheme(e.target.value.toUpperCase())}
//                         className="w-full px-4 py-2 capitalize border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >

//                         <option defaultChecked>THEORY</option>
//                         <option>LAB</option>
//                     </select>

//                 </div>
//                 <div className="mb-4">
//                     File
//                     <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className="w-full px-4 py-2 text-black dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <button
//                     onClick={handleUpload}
//                     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
//                 >
//                     Upload
//                 </button>
//             </div>
//         </div>
//     );
// }
