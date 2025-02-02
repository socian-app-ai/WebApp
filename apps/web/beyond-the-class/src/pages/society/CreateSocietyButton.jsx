/* eslint-disable react/prop-types */



// import React, { useState } from "react";
// import axios from "axios";
// import { useAuthContext } from "../../context/AuthContext";
// import axiosInstance from "../../config/users/axios.instance";

// const CreateSocietyButton = () => {
//     const { authUser } = useAuthContext();
//     const [showModal, setShowModal] = useState(false);

//     const [categories, setCategories] = useState(['food', 'same']);
//     const [allowsList, setAllowsList] = useState([
//         { allow: "all", name: "Teachers, Students, Organizations" },
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
//             console.log("THIS HERE,", formData);
//             // return;
//             const response = await axiosInstance.post("/api/society/create", formData);
//             if (response.status === 201) {
//                 setSuccess("Society created successfully!");
//                 setFormData({
//                     name: "",
//                     description: "",
//                     president: "",
//                     societyType: "",
//                     members: [],
//                     allows: [],
//                     subSociety: "",
//                 });
//                 setShowModal(false);
//             }
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
//                 className="bg-blue-500 text-white dark:text-gray-300 px-4 py-2 rounded hover:bg-blue-600"
//             >
//                 Create Society
//             </button>

//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg dark:bg-gray-800">
//                         <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Society</h2>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                                     Society Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-[#2f2f2f] px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-[#2f2f2f] px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                                     Society Type
//                                 </label>
//                                 <select
//                                     name="societyTypeId"
//                                     value={formData.societyTypeId}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-[#2f2f2f] px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 >
//                                     <option disabled value="">Select Type</option>
//                                     {societyType.map((type) => (
//                                         <option key={type._id} value={type._id}>{type.societyType}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                                     Categories
//                                 </label>
//                                 <select
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-[#2f2f2f] px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 >
//                                     <option disabled value="">Select Category</option>
//                                     {categories.map((category, idx) => (
//                                         <option key={idx} value={category}>{category}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block font-medium text-gray-700">
//                                     Allows Roles
//                                 </label>
//                                 <select
//                                     name="allows"
//                                     value={formData.allows}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-[#2f2f2f] px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                                 >
//                                     <option disabled value=''>Select Type</option>
//                                     {allowsList.map((allow, idx) => (
//                                         <option key={idx} value={allow.allow}>{allow.name}</option>
//                                     ))}

//                                 </select>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="bg-green-500 text-white dark:text-gray-200 px-4 py-2 rounded hover:bg-green-600"
//                             >
//                                 Submit
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={toggleModal}
//                                 className="bg-red-500 text-white dark:text-gray-200 px-4 py-2 rounded hover:bg-red-600 ml-2"
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
import { Layers, Users, Globe, Tag, PlusCircle, XCircle } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/users/axios.instance";
import { Plus } from "lucide-react";

const CreateSocietyButton = () => {
    // const { authUser } = useAuthContext();
    const [showModal, setShowModal] = useState(false);

    const categories = ['Food', 'Technology', 'Arts', 'Sports', 'Academic'];
    const allowsList = [
        { allow: "all", name: "Teachers, Students, Organizations", icon: Users },
        { allow: "teacher", name: "Teachers Only", icon: Globe },
        { allow: "student", name: "Students Only", icon: Tag },
        { allow: "alumni", name: "Alumni Only", icon: Tag },
        { allow: "ext_org", name: "External Organizations", icon: Layers },
    ];

    const societyTypes = [
        { _id: "6754558dfb3e196884b19358", societyType: "Private", icon: Layers },
        { _id: "67545595fb3e196884b19361", societyType: "Public", icon: Globe },
        { _id: "6754559dfb3e196884b19366", societyType: "Restricted", icon: Users },
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        societyTypeId: '',
        allows: "",
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("formDAA", formData)
            const response = await axiosInstance.post("/api/society/create", formData);
            if (response.status === 201) {
                setSuccess("Society created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    category: "",
                    societyTypeId: '',
                    allows: "",
                });
                setTimeout(() => {
                    setShowModal(false);
                    setSuccess(null);
                }, 2000);
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
                className="flex justify-center  w-full items-center my-2 py-1 bg-[#373737] text-white  rounded-md hover:bg-[#222b3f] transition-colors"
            >
                <Plus className="" size={18} />
                <p>Create Society</p>
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-lg shadow-2xl p-6 relative">
                        <button
                            onClick={toggleModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <XCircle size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                            Create a New Society
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputField
                                label="Society Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter society name"
                                Icon={Tag}
                            />

                            <InputField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                type="textarea"
                                placeholder="Describe your society"
                                Icon={Layers}
                            />

                            <SelectField
                                label="Society Type"
                                name="societyTypeId"
                                value={formData.societyTypeId}
                                onChange={handleInputChange}
                                options={societyTypes}
                                Icon={Globe}
                            />

                            <SelectField
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                options={categories}
                                Icon={Tag}
                            />

                            <SelectField
                                label="Allowed Roles"
                                name="allows"
                                value={formData.allows}
                                onChange={handleInputChange}
                                options={allowsList}
                                Icon={Users}
                            />

                            <div className="flex justify-between space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="flex-1 bg-[#242424] text-white hover:bg-[#333] hover:border-[#ffffff] border border-[#ffffff80] py-2 rounded-md transition-colors flex items-center justify-center"
                                >
                                    <XCircle className="mr-2" size={20} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#131313] text-white hover:bg-[#333] hover:border-[#ffffff] border border-[#ffffff80] py-2 rounded-md  transition-colors flex items-center justify-center"
                                >
                                    <PlusCircle className="mr-2" size={20} />
                                    Create Society
                                </button>

                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                                {success}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSocietyButton;





const InputField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = true,
    placeholder = "",
    Icon
}) => (
    <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {Icon && <Icon className="mr-2 text-blue-500" size={18} />}
            {label}
        </label>
        {type === "textarea" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-gray-200"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-gray-200"
            />
        )}
    </div>
);






const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    required = true,
    Icon
}) => (
    <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {Icon && <Icon className="mr-2 text-blue-500" size={18} />}
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-gray-200"
        >
            <option value="" disabled>Select {label}</option>
            {options.map((option) => {
                // console.log("option", option)
                return <option
                    key={option._id || option.allow || option}
                    value={option._id || option.allow || option}
                >
                    {option.societyType || option.name || option}
                </option>
            })}
        </select>
    </div>
);