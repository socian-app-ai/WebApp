

import React, { useEffect, useState, useRef } from 'react';
import { Plus, X, Send, Search, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../config/users/axios.instance';
import { useNavigate } from 'react-router-dom';

import slugify from 'slugify';


const CreatePostButton = () => {
    const { authUser } = useAuthContext();
    const modalRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [societies, setSocieties] = useState([]);
    const [mergedSocieties, setMergedSocieties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSocieties, setFilteredSocieties] = useState([]);
    const [selectedSociety, setSelectedSociety] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate()



    const [formData, setFormData] = useState({
        title: '',
        body: '',
        file: [],
        societyId: '',
    });

    const [doing, setDoing] = useState('body');
    const [videoFiles, setVideoFiles] = useState([]);


    const handleVideoUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFiles((prevFiles) => {
                const newFiles = [...prevFiles];
                newFiles[index] = file;
                return newFiles;
            });
        }
    };

    const addNewVideoInput = (e) => {
        e.preventDefault()
        setVideoFiles((prevFiles) => [...prevFiles, null]);
    };

    const removeVideo = (e, index) => {
        e.preventDefault()
        setVideoFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };



    const handleDoingChange = (e, value) => {
        e.preventDefault()
        setDoing(value)
    }
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
        const { title, body, file } = formData;
        // console.log(title, body)
        // console.log("file", file)
        // console.log("videoFiles", videoFiles)
        if (!title || body === '' || !selectedSociety) {
            setError('Please fill in title, body and select a society.');
            return;
        }


        const formDataU = new FormData();
        formDataU.append("title", title);
        // if (body) {
            formDataU.append("body", body);
        // }
        // else 
        if (videoFiles?.length > 0) {
            videoFiles.forEach((f) => formDataU.append("file", f));
        }
        else if (file?.length > 0) {
            // formDataU.append("file", file);
            file.forEach(f => formDataU.append("file", f))

        }
        formDataU.append("societyId", selectedSociety._id);
        formDataU.append("author", authUser._id);



        // console.log("FORM DATA CONTENT:", [...formDataU]);
        // console.log("FORM DATA", formDataU)


        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/posts/create', formDataU,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                },
            );

            setLoading(false);
            setSuccess('Post created successfully!');
            setTimeout(() => {
                toggleModal();
            }, 1500);

            // console.log("Retirn", response)
            navigate(`${authUser.role}/${response.data.societyName ?? "unknown"}/comments/${response.data.postId}/${response.data.postTitle.toString().replace(/\s+/g, '-')}`)
            // navigate(`${authUser.role}/${response.data.societyName ?? "unknown"}/comments/${response.data.postId}/${slugify(response.data.postTitle, { lower: true })}`);

        } catch (err) {
            setLoading(false);
            setError('Failed to create post.');
            console.error('Error creating post:', err);
        }
    };

    useEffect(() => {
        const fetchSubscribedSocieties = async () => {
            try {
                const response = await axiosInstance.get(`/api/society/public/societies`);
                setSocieties(response.data);
            } catch (err) {
                console.error('Error fetching subscribed societies:', err);
            }
        };
        showModal && fetchSubscribedSocieties();
    }, [showModal]);

    useEffect(() => {
        // Merge authUser.joinedSocieties with societies
        const mergeSocieties = () => {
            const authUserSocieties = authUser?.joinedSocieties || [];
            const newSocieties = societies.filter(
                (society) => !authUserSocieties.some((userSociety) => userSociety._id === society._id)
            );
            setMergedSocieties([...authUserSocieties, ...newSocieties]);
        };
        mergeSocieties();
    }, [societies, authUser]);

    useEffect(() => {
        setFilteredSocieties(
            mergedSocieties.filter((society) =>
                society.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, mergedSocieties]);


    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             file: file,
    //         }));
    //         console.log("FILE HERE", file)
    //     }
    // };
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array

        setFormData((prevData) => ({
            ...prevData,
            file: Array.isArray(prevData.file) ? [...prevData.file, ...files] : [...files], // Ensure prevData.file is an array
        }));
    };


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (formData.title || formData.body || formData.file.length > 0 || videoFiles.length > 0) {
                event.preventDefault();
                event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [formData, videoFiles]);








    return (
        <div className="relative">
            <button
                onClick={toggleModal}
                className="flex items-center justify-center w-10 h-10 text-black dark:text-white rounded-full   transition-colors duration-300"
            >
                <Plus size={24} />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
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

                        <form noValidate encType='multipart/form-data' onSubmit={handleCreatePost} className="p-6 space-y-6">
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
                                        onChange={(e) => {
                                            setIsDropdownOpen(true)
                                            setSearchQuery(e.target.value)

                                        }}
                                        placeholder="Search for a society"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-white"
                                    />
                                    {selectedSociety && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown size={18} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {isDropdownOpen && searchQuery && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2f2f2f] border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {filteredSocieties.length > 0 ? (
                                            filteredSocieties.map((society) => (
                                                <div
                                                    key={society._id}
                                                    onClick={() => {
                                                        setSelectedSociety(society);
                                                        setSearchQuery(society.name);
                                                        setIsDropdownOpen(false)

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
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-white"
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
                                            className="whitespace-pre-line w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#2f2f2f] dark:text-white resize-none"
                                        />
                                    </div>

                            <div className='flex justify-evenly  bg-[#131313]'>
                                {/* <button className={`px-2 my-1 rounded-md ${doing === 'body' && 'bg-[#333]'}`} onClick={(e) => handleDoingChange(e, 'body')}>Body</button> */}
                                <button className={`px-2 my-1 rounded-md ${doing === 'image' && 'bg-[#333]'}`} onClick={(e) => handleDoingChange(e, 'image')}>Image</button>
                                <button className={`px-2 my-1 rounded-md ${doing === 'video' && 'bg-[#333]'}`} onClick={(e) => handleDoingChange(e, 'video')}>Video</button>
                            </div>

                            


                            {/* {
                                doing === 'video' && (<div>
                                    <input className='border rounded-md bg-[#333] px-2 py-1' type="file" accept="video/*" onChange={handleFileUpload} />
                                </div>)
                            } */}

                            {doing === 'video' && (
                                <div className="space-y-2">
                                    {videoFiles.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleVideoUpload(e, index)}
                                                className="border rounded-md bg-[#333] px-2 py-1"
                                            />
                                            {videoFiles.length > 1 && (
                                                <button
                                                    onClick={(e) => removeVideo(e, index)}
                                                    className="text-red-500 text-sm"
                                                >
                                                    <X />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {videoFiles.length < 3 && ( // Limit number of videos (optional)
                                        <button
                                            onClick={(e) => addNewVideoInput(e)}
                                            className="text-white text-sm flex items-center space-x-1"
                                        >
                                            <Plus size={16} /> <span>Add Video</span>
                                        </button>
                                    )}
                                </div>
                            )}



                            {
                                doing === 'image' && (<div className='border rounded-md bg-[#333] px-2 py-1' >
                                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
                                </div>)
                            }
                            {/* {
                                formData.file && (
                                    <div>
                                        <img src={formData.file[0]} />
                                    </div>
                                )
                            } */}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {/* formData.file */}
                                {formData.file && formData.file.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <button
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    files: prev.file.filter((_, i) => i !== index),
                                                }))
                                            }
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>



                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center">
                                    <X className="mr-2" size={20} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="dark:bg-[#333] border border-[#6a6a6aa2] text-[#2f2f2f] dark:text-[#dedede] p-3 rounded-lg flex items-center">
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
                                    className={`px-6 py-2 rounded-lg text-white transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#242424] text-white hover:bg-[#333] hover:border-[#ffffff] border border-[#ffffff80]'}`}
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
