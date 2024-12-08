import { useEffect } from 'react';
import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import axiosInstance from '../../../config/users/axios.instance';

const CreatePostButton = () => {
    const { authUser } = useAuthContext();

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleModal = (e) => {
        e.preventDefault();
        setShowModal(!showModal);
        if (!showModal) {
            setError(null);
            setSuccess(null);
            setFormData({ title: '', body: '', societyId: '' });
            setSelectedSociety(null);
        }
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
            toggleModal();
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
                console.log("subscribes", response)
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
        <div>
            <button
                onClick={toggleModal}
                className="px-4 py-2 text-white bg-blue-500 rounded"
            >
                Create Post
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
                    <form onSubmit={(e) => handleCreatePost(e)} className="dark:bg-bg-var-dark bg-white p-6 rounded-lg w-1/3 z-20">
                        <h2 className="text-xl font-bold mb-4">Create New Post</h2>

                        {/* <div className="mb-4">
                            <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Select Society</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setSearchQuery(e.target.value)
                                }}
                                placeholder="Search for a society"

                                name="search"
                                required
                                className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"

                            />
                            <select required
                                className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                            >
                                {filteredSocieties.map((society) => (
                                    <option
                                        key={society._id}
                                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedSociety && selectedSociety._id === society._id
                                            ? 'bg-gray-200'
                                            : ''
                                            }`}
                                        onClick={() => setSelectedSociety(society)}
                                    >
                                        {society.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}




                        <div className="mb-4 relative">
                            <label className="block text-sm font-semibold dark:text-white text-bg-var-dark mb-2">
                                Select Society
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a society"
                                name="search"
                                required
                                className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"
                            />

                            {searchQuery && filteredSocieties.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border rounded mt-1 max-h-60 overflow-y-auto">
                                    {filteredSocieties.map((society) => (
                                        <li
                                            key={society._id}
                                            className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${selectedSociety && selectedSociety._id === society._id ? 'bg-gray-200 dark:bg-gray-600' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedSociety(society);
                                                setSearchQuery(society.name); // Set search query to the selected society name
                                            }}
                                        >
                                            {society.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {searchQuery && filteredSocieties.length === 0 && (
                                <p className="absolute z-10 w-full bg-white dark:bg-gray-700 border rounded mt-1 p-2 text-gray-500 dark:text-gray-300">
                                    No societies found.
                                </p>
                            )}
                        </div>


                        <div className="mb-4">
                            <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required placeholder="Enter the title"
                                className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300"

                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold  dark:text-white text-bg-var-dark mb-2">Body</label>
                            <textarea
                                name="body"
                                value={formData.body}
                                onChange={handleInputChange}
                                className="w-full border rounded text-gray-900 dark:text-gray-200 dark:bg-gray-700 px-3 py-2 mt-1 focus:ring focus:ring-blue-300" placeholder="Enter the content of the post"
                            />
                        </div>

                        {error && <div className="text-red-600 mb-4">{error}</div>}
                        {success && <div className="text-green-600 mb-4">{success}</div>}

                        <div className="flex justify-between">
                            <button
                                onClick={toggleModal}
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                            >
                                Cancel
                            </button>

                            <button
                                type='submit'
                                className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>

            )}
        </div>
    );
};

export default CreatePostButton;
