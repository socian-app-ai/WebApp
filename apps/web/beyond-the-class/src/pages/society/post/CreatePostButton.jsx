import React, { useEffect, useState, useRef } from 'react';
import { Plus, X, Send, Search, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../config/users/axios.instance';

const CreatePostButton = () => {
    const { authUser } = useAuthContext();
    const modalRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [societies, setSocieties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSocieties, setFilteredSocieties] = useState([]);
    const [selectedSociety, setSelectedSociety] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        societyId: '',
    });

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleModal = (e) => {
        e?.preventDefault();
        setShowModal(!showModal);
        if (!showModal) {
            resetForm();
        }
    };

    const resetForm = () => {
        setError(null);
        setSuccess(null);
        setFormData({ title: '', body: '', societyId: '' });
        setSelectedSociety(null);
        setSearchQuery('');
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const { title, body } = formData;
        if (!title || !body || !selectedSociety) {
            setError('Please fill in all fields and select a society.');
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/api/posts/create', {
                title,
                body,
                societyId: selectedSociety._id,
                author: authUser._id,
            });

            setLoading(false);
            setSuccess('Post created successfully!');
            setTimeout(() => {
                toggleModal();
            }, 1500);
        } catch (err) {
            setLoading(false);
            setError('Failed to create post.');
            console.error('Error creating post:', err);
        }
    };

    useEffect(() => {
        const fetchSubscribedSocieties = async () => {
            try {
                const response = await axiosInstance.get(`/api/society/user/subscribedSocieties`);
                setSocieties(response.data);
            } catch (err) {
                console.error('Error fetching subscribed societies:', err);
            }
        };
        showModal && fetchSubscribedSocieties();
    }, [showModal]);

    useEffect(() => {
        setFilteredSocieties(
            societies.filter((society) =>
                society.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, societies]);

    return (
        <div className="relative">
            <button
                onClick={toggleModal}
                className="flex items-center justify-center w-10 h-10 text-white rounded-full shadow-lg  transition-colors duration-300"
            >
                <Plus size={24} />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Post</h2>
                            <button
                                onClick={toggleModal}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="p-6 space-y-6">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Select Society
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for a society"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {selectedSociety && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown size={18} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {searchQuery && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredSocieties.length > 0 ? (
                                            filteredSocieties.map((society) => (
                                                <div
                                                    key={society._id}
                                                    onClick={() => {
                                                        setSelectedSociety(society);
                                                        setSearchQuery(society.name);
                                                    }}
                                                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${selectedSociety && selectedSociety._id === society._id ? 'bg-blue-100 dark:bg-gray-600' : ''}`}
                                                >
                                                    {society.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 dark:text-gray-300">
                                                No societies found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter post title"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Body
                                </label>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    placeholder="Write your post content"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center">
                                    <X className="mr-2" size={20} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg flex items-center">
                                    <Send className="mr-2" size={20} />
                                    {success}
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        px-6 py-2 rounded-lg text-white transition-colors duration-300 
                                        ${loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }
                                    `}
                                >
                                    {loading ? 'Creating...' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePostButton;



// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useAuthContext } from '../../../context/AuthContext';
// import axiosInstance from '../../../config/users/axios.instance';

// const CreatePostButton = () => {
//     const { authUser } = useAuthContext();

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState(null);

//     const [showModal, setShowModal] = useState(false);
//     const [societies, setSocieties] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredSocieties, setFilteredSocieties] = useState([]);
//     const [selectedSociety, setSelectedSociety] = useState(null);

//     const [formData, setFormData] = useState({
//         title: '',
//         body: '',
//         societyId: '',
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const toggleModal = (e) => {
//         e.preventDefault();
//         setShowModal(!showModal);
//         if (!showModal) {
//             setError(null);
//             setSuccess(null);
//             setFormData({ title: '', body: '', societyId: '' });
//             setSelectedSociety(null);
//         }
//     };

//     const handleCreatePost = async (e) => {
//         e.preventDefault();
//         const { title, body } = formData;
//         if (!title || !body || !selectedSociety) {
//             setError('Please fill in all fields and select a society.');
//             return;
//         }

//         setLoading(true);
//         try {
//             await axiosInstance.post('/api/posts/create', {
//                 title,
//                 body,
//                 societyId: selectedSociety._id,
//                 author: authUser._id,
//             });

//             setLoading(false);
//             setSuccess('Post created successfully!');
//             toggleModal();
//         } catch (err) {
//             setLoading(false);
//             setError('Failed to create post.');
//             console.error('Error creating post:', err);
//         }
//     };

//     useEffect(() => {
//         const fetchSubscribedSocieties = async () => {
//             try {
//                 const response = await axiosInstance.get(`/api/society/user/subscribedSocieties`);
//                 console.log("subscribes", response)
//                 setSocieties(response.data);
//             } catch (err) {
//                 console.error('Error fetching subscribed societies:', err);
//             }
//         };
//         showModal && fetchSubscribedSocieties();
//     }, [showModal]);

//     useEffect(() => {
//         setFilteredSocieties(
//             societies.filter((society) =>
//                 society.name.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//         );
//     }, [searchQuery, societies]);

//     return (
//         <div>
//             <button
//                 onClick={toggleModal}
//                 className="px-4 py-2 text-white bg-blue-500 rounded"
//             >
//                 Create Post
//             </button>

//             {showModal && (
//                 <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
//                     <form onSubmit={(e) => handleCreatePost(e)} className="dark:bg-bg-var-dark bg-white p-6 rounded-lg w-1/3 z-20">
//                         <h2 className="text-xl font-bold mb-4">Create New Post</h2>

//                         {/* <div className="mb-4">
//                             <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Select Society</label>
//                             <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => {
//                                     e.preventDefault()
//                                     setSearchQuery(e.target.value)
//                                 }}
//                                 placeholder="Search for a society"

//                                 name="search"
//                                 required
//                                 className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"

//                             />
//                             <select required
//                                 className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                             >
//                                 {filteredSocieties.map((society) => (
//                                     <option
//                                         key={society._id}
//                                         className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedSociety && selectedSociety._id === society._id
//                                             ? 'bg-gray-200'
//                                             : ''
//                                             }`}
//                                         onClick={() => setSelectedSociety(society)}
//                                     >
//                                         {society.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div> */}




//                         <div className="mb-4 relative">
//                             <label className="block text-sm font-semibold dark:text-white text-bg-var-dark mb-2">
//                                 Select Society
//                             </label>
//                             <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 placeholder="Search for a society"
//                                 name="search"
//                                 required
//                                 className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
//                             />

//                             {searchQuery && filteredSocieties.length > 0 && (
//                                 <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border rounded mt-1 max-h-60 overflow-y-auto">
//                                     {filteredSocieties.map((society) => (
//                                         <li
//                                             key={society._id}
//                                             className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${selectedSociety && selectedSociety._id === society._id ? 'bg-gray-200 dark:bg-gray-600' : ''
//                                                 }`}
//                                             onClick={() => {
//                                                 setSelectedSociety(society);
//                                                 setSearchQuery(society.name); // Set search query to the selected society name
//                                             }}
//                                         >
//                                             {society.name}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}

//                             {searchQuery && filteredSocieties.length === 0 && (
//                                 <p className="absolute z-10 w-full bg-white dark:bg-gray-700 border rounded mt-1 p-2 text-gray-500 dark:text-gray-300">
//                                     No societies found.
//                                 </p>
//                             )}
//                         </div>


//                         <div className="mb-4">
//                             <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Title</label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleInputChange}
//                                 required placeholder="Enter the title"
//                                 className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"

//                             />
//                         </div>

//                         <div className="mb-4">
//                             <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Body</label>
//                             <textarea
//                                 name="body"
//                                 value={formData.body}
//                                 onChange={handleInputChange}
//                                 className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300" placeholder="Enter the content of the post"
//                             />
//                         </div>

//                         {error && <div className="text-red-600 mb-4">{error}</div>}
//                         {success && <div className="text-green-600 mb-4">{success}</div>}

//                         <div className="flex justify-between">
//                             <button
//                                 onClick={toggleModal}
//                                 className="px-4 py-2 bg-gray-300 text-black rounded"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type='submit'
//                                 className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Creating...' : 'Create Post'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//             )}
//         </div>
//     );
// };

// export default CreatePostButton;