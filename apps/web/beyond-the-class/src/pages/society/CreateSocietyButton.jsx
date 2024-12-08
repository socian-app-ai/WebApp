// import React, { useState } from "react";
// import axios from "axios";
// import { useAuthContext } from "../../context/AuthContext";

// const CreateSocietyButton = () => {
//     const { authUser } = useAuthContext();
//     const [showModal, setShowModal] = useState(false);

//     const [categories, setCategories] = useState(['food', 'same'])
//     const [allowsList, setAllowsList] = useState([
//         { allow: "all", name: "Teachers,Students,Organizations" },
//         { allow: "teacher", name: "Teachers" },
//         { allow: "student", name: "Students" },
//         { allow: "ext_org", name: "Organizations" },
//     ]);

//     const [societyType, setSocietyType] = useState([
//         {
//             _id: "6754558dfb3e196884b19358",
//             societyType: "private",
//         },

//         {
//             _id: "67545595fb3e196884b19361",
//             societyType: "public",
//         },
//         {
//             _id: "6754559dfb3e196884b19366",
//             societyType: "restricted",
//         },
//     ]);

//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         // president: {
//         //     _id: "042807398rhfin38",
//         //     name: "bilal ellahi"
//         // },
//         category: [],
//         societyTypeId: '',
//         allows: [],

//     });

//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     const toggleModal = () => {
//         setShowModal(!showModal);
//         if (!showModal) {
//             setError(null);
//             setSuccess(null);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             console.log("THIS HERE,", formData)
//             return;
//             // const response = await axios.post("/api/society/create", formData);
//             // if (response.status === 201) {
//             //     setSuccess("Society created successfully!");
//             //     setFormData({
//             //         name: "",
//             //         description: "",
//             //         president: "",
//             //         societyType: "",
//             //         members: [],
//             //         allows: [],
//             //         subSociety: "",
//             //     });
//             //     setShowModal(false);
//             // }
//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "An error occurred while creating the society."
//             );
//         }
//     };

//     return (
//         <div>
//             <button
//                 onClick={toggleModal}
//                 className="bg-blue-500 text-white dark:text-bg-var-dark px-4 py-2 rounded hover:bg-blue-600"
//             >
//                 Create Society
//             </button>

//             {showModal && (
//                 <div className="fixed inset-0 bg-black  bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
//                         <h2 className="text-xl font-bold mb-4">Create Society</h2>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block font-medium text-gray-700">
//                                     Society Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-white dark:text-bg-var-dark  px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium text-gray-700">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-white dark:text-bg-var-dark  px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 />
//                             </div>
//                             {/* <div>
//                                 <label className="block font-medium text-gray-700">
//                                     President
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="president"
//                                     value={formData.president}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-white dark:text-bg-var-dark  px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 />
//                             </div> */}
//                             <div>
//                                 <label className="block font-medium text-gray-700">
//                                     Society Type
//                                 </label>
//                                 <select
//                                     name="societyType"
//                                     value={formData.societyTypeId}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-white dark:text-bg-var-dark  px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 >
//                                     <option disabled selected>Select Type</option>
//                                     {societyType.map((type) => (
//                                         <option className=" text-white dark:text-bg-var-dark " key={type._id} value={type._id}>{type.name}</option>
//                                     ))}

//                                 </select>
//                             </div>


//                             <div>
//                                 <label className="block font-medium text-gray-700">
//                                     Categories
//                                 </label>
//                                 <select
//                                     name="societyType"
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-white dark:text-bg-var-dark  px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 >
//                                     <option className=" text-white dark:text-bg-var-dark " disabled selected>Select Type</option>
//                                     {categories.map((category, idx) => (
//                                         <option className=" text-white dark:text-bg-var-dark " key={idx} value={category}>{category}</option>
//                                     ))}

//                                 </select>
//                             </div>



//                             <button
//                                 type="submit"
//                                 className="bg-green-500 text-white dark:text-bg-var-dark px-4 py-2 rounded hover:bg-green-600"
//                             >
//                                 Submit
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={toggleModal}
//                                 className="bg-red-500 text-white dark:text-bg-var-dark px-4 py-2 rounded hover:bg-red-600 ml-2"
//                             >
//                                 Cancel
//                             </button>
//                         </form>
//                         {error && <p className="text-red-500 mt-4">{error}</p>}
//                         {success && <p className="text-green-500 mt-4">{success}</p>}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CreateSocietyButton;



import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/users/axios.instance";

const CreateSocietyButton = () => {
    const { authUser } = useAuthContext();
    const [showModal, setShowModal] = useState(false);

    const [categories, setCategories] = useState(['food', 'same']);
    const [allowsList, setAllowsList] = useState([
        { allow: "all", name: "Teachers, Students, Organizations" },
        { allow: "teacher", name: "Teachers" },
        { allow: "student", name: "Students" },
        { allow: "ext_org", name: "Organizations" },
    ]);

    const [societyType, setSocietyType] = useState([
        {
            _id: "6754558dfb3e196884b19358",
            societyType: "private",
        },
        {
            _id: "67545595fb3e196884b19361",
            societyType: "public",
        },
        {
            _id: "6754559dfb3e196884b19366",
            societyType: "restricted",
        },
    ]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: [],
        societyTypeId: '',
        allows: [],
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const toggleModal = () => {
        setShowModal(!showModal);
        if (!showModal) {
            setError(null);
            setSuccess(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("THIS HERE,", formData);
            // return;
            const response = await axiosInstance.post("/api/society/create", formData);
            if (response.status === 201) {
                setSuccess("Society created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    president: "",
                    societyType: "",
                    members: [],
                    allows: [],
                    subSociety: "",
                });
                setShowModal(false);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "An error occurred while creating the society."
            );
        }
    };

    return (
        <div>
            <button
                onClick={toggleModal}
                className="bg-blue-500 text-white dark:text-gray-300 px-4 py-2 rounded hover:bg-blue-600"
            >
                Create Society
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg dark:bg-gray-800">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Society</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-200">
                                    Society Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-200">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-200">
                                    Society Type
                                </label>
                                <select
                                    name="societyTypeId"
                                    value={formData.societyTypeId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                                >
                                    <option disabled value="">Select Type</option>
                                    {societyType.map((type) => (
                                        <option key={type._id} value={type._id}>{type.societyType}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-200">
                                    Categories
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                                >
                                    <option disabled value="">Select Category</option>
                                    {categories.map((category, idx) => (
                                        <option key={idx} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">
                                    Allows Roles
                                </label>
                                <select
                                    name="allows"
                                    value={formData.allows}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                                >
                                    <option disabled value=''>Select Type</option>
                                    {allowsList.map((allow, idx) => (
                                        <option key={idx} value={allow.allow}>{allow.name}</option>
                                    ))}

                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white dark:text-gray-200 px-4 py-2 rounded hover:bg-green-600"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="bg-red-500 text-white dark:text-gray-200 px-4 py-2 rounded hover:bg-red-600 ml-2"
                            >
                                Cancel
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        {success && <p className="text-green-500 mt-4">{success}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSocietyButton;
