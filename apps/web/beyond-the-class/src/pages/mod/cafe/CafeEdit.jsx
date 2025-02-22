import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axiosInstance from '../../../config/users/axios.instance';
import { useParams } from 'react-router-dom';
import { LucidePencil } from 'lucide-react';

const CafeEdit = () => {
    const { cafeId } = useParams();
    const [globalEditing, setGlobalEditing] = useState(false);
    const [editingFields, setEditingFields] = useState({
        name: false,
        contact: false,
        information: false,
        status: false,
        coordinates: false
    });
    const [loading, setLoading] = useState({
        global: false,
        name: false,
        contact: false,
        information: false,
        status: false,
        coordinates: false
    });
    const [error, setError] = useState("");
    const [cafe, setCafe] = useState({
        name: "",
        contact: "",
        information: "",
        coordinates: { latitude: 31.5204, longitude: 74.3587 },
        status: "",
        createdAt: "",
        updatedAt: "",
    });
    const [originalCafe, setOriginalCafe] = useState(null);

    useEffect(() => {
        fetchCafeDetails();
    }, [cafeId]);

    const fetchCafeDetails = async () => {
        try {
            const response = await axiosInstance.get(`/api/mod/cafe/${cafeId}`);
            setCafe(response.data.cafe);
            setOriginalCafe(response.data.cafe);
        } catch (error) {
            setError("Failed to fetch cafe details");
            console.error("Error fetching cafe:", error);
        }
    };

    const handleChange = (e) => {
        setCafe({ ...cafe, [e.target.name]: e.target.value });
    };

    const handleMapClick = ({ lat, lng }) => {
        if (globalEditing || editingFields.coordinates) {
            setCafe(prev => ({
                ...prev,
                coordinates: { latitude: lat, longitude: lng }
            }));
        }
    };

    const handleSingleFieldSubmit = async (fieldName) => {
        setLoading(prev => ({ ...prev, [fieldName]: true }));
        setError("");

        try {
            const fieldData = { [fieldName]: cafe[fieldName] };
            const response = await axiosInstance.patch(`/api/mod/cafe/update/${cafeId}/${fieldName}`, fieldData);
            setCafe(response.data.cafe);
            setOriginalCafe(response.data.cafe);
            setEditingFields(prev => ({ ...prev, [fieldName]: false }));
        } catch (err) {
            setError(`Failed to update ${fieldName}`);
        } finally {
            setLoading(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleGlobalSubmit = async () => {
        setLoading(prev => ({ ...prev, global: true }));
        setError("");

        try {
            const response = await axiosInstance.put(`/api/mod/cafe/update/${cafeId}/all`, cafe);
            setCafe(response.data.cafe);
            setOriginalCafe(response.data.cafe);
            setGlobalEditing(false);
            setEditingFields({
                name: false,
                contact: false,
                information: false,
                status: false,
                coordinates: false
            });
        } catch (err) {
            setError(err?.response?.data?.errors?.map(err => err.msg) || "Failed to update cafe");
        } finally {
            setLoading(prev => ({ ...prev, global: false }));
        }
    };

    const handleCancel = (fieldName) => {
        if (fieldName) {
            setCafe(prev => ({ ...prev, [fieldName]: originalCafe[fieldName] }));
            setEditingFields(prev => ({ ...prev, [fieldName]: false }));
        } else {
            setCafe(originalCafe);
            setGlobalEditing(false);
            setEditingFields({
                name: false,
                contact: false,
                information: false,
                status: false,
                coordinates: false
            });
        }
        setError("");
    };

    const renderEditButtons = (fieldName) => {
        if (!globalEditing && editingFields[fieldName]) {
            return (
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={() => handleSingleFieldSubmit(fieldName)}
                        disabled={loading[fieldName]}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-green-300"
                    >
                        {loading[fieldName] ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => handleCancel(fieldName)}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            );
        }
        if (!globalEditing && !editingFields[fieldName]) {
            return (

                <LucidePencil
                    className='absolute top-0 right-0'
                    size={13}
                    onClick={() => setEditingFields(prev => ({ ...prev, [fieldName]: true }))}
                />

            );
        }
        return null;
    };

    return (
        <div className="p-8 min-h-screen max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-gray-800">
                        {globalEditing ? 'Edit Cafe' : 'Cafe Details'}
                    </h2>
                    <p className="text-sm dark:text-gray-300 text-gray-600">
                        {globalEditing ? 'Make changes to cafe information' : 'View cafe information'}
                    </p>
                </div>
                <button
                    onClick={() => globalEditing ? handleCancel() : setGlobalEditing(true)}
                    className={`px-4 py-2 rounded-md ${globalEditing
                        ? 'bg-gray-500 hover:bg-gray-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    {globalEditing ? 'Cancel All Changes' : 'Edit All Fields'}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2 relative">
                        <label className="block text-sm font-medium dark:text-white text-gray-700">
                            Cafe Name
                        </label>
                        {(globalEditing || editingFields.name) ? (
                            <input
                                type="text"
                                name="name"
                                value={cafe.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
                            />
                        ) : (
                            <p className="py-2 dark:text-white text-gray-900">{cafe.name}</p>
                        )}
                        {renderEditButtons('name')}
                    </div>

                    <div className="space-y-2 relative">
                        <label className="block text-sm font-medium dark:text-white text-gray-700">
                            Contact Information
                        </label>
                        {(globalEditing || editingFields.contact) ? (
                            <input
                                type="text"
                                name="contact"
                                value={cafe.contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
                            />
                        ) : (
                            <p className="py-2 dark:text-white text-gray-900">{cafe.contact}</p>
                        )}
                        {renderEditButtons('contact')}
                    </div>

                    <div className="space-y-2 relative">
                        <label className="block text-sm font-medium dark:text-white text-gray-700">
                            Additional Information
                        </label>
                        {(globalEditing || editingFields.information) ? (
                            <textarea
                                name="information"
                                value={cafe.information}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
                            />
                        ) : (
                            <p className="py-2 dark:text-white text-gray-900">{cafe.information}</p>
                        )}
                        {renderEditButtons('information')}
                    </div>

                    <div className="space-y-2 relative">
                        <label className="block text-sm font-medium dark:text-white text-gray-700">
                            Status
                        </label>
                        {(globalEditing || editingFields.status) ? (
                            <>
                                <select
                                    name="status"
                                    value={cafe.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
                                >
                                    <option value="active">Active</option>
                                    <option value="deactive">Deactive</option>
                                    <option value="archived">Archive</option>
                                </select>
                                {renderEditButtons('status')}
                            </>
                        ) : (
                            <>
                                <span className={`px-3 py-1 rounded-full text-sm ${cafe.status === 'active' ? 'bg-green-100 text-green-800' :
                                    cafe.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {cafe.status}
                                </span>
                                {renderEditButtons('status')}
                            </>
                        )}
                    </div>

                    {globalEditing && (
                        <button
                            onClick={handleGlobalSubmit}
                            disabled={loading.global}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading.global ? "Saving All Changes..." : "Save All Changes"}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium dark:text-white text-gray-700">
                            Cafe Location
                        </label>
                        {!globalEditing && renderEditButtons('coordinates')}
                    </div>
                    <div className="h-96 w-full border rounded-lg overflow-hidden">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
                            defaultCenter={{
                                lat: cafe.coordinates.latitude,
                                lng: cafe.coordinates.longitude
                            }}
                            defaultZoom={14}
                            onClick={handleMapClick}
                        >
                            <div
                                lat={cafe.coordinates.latitude}
                                lng={cafe.coordinates.longitude}
                                className="text-red-500"
                            >
                                📍
                            </div>
                        </GoogleMapReact>
                    </div>
                    <p className="text-sm dark:text-white text-gray-600">
                        Latitude: {cafe.coordinates.latitude.toFixed(4)},
                        Longitude: {cafe.coordinates.longitude.toFixed(4)}
                    </p>
                    {(globalEditing || editingFields.coordinates) && renderEditButtons('coordinates')}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm dark:text-white text-gray-600">
                <div>
                    <p>Created: {cafe.createdAt}</p>
                </div>
                <div>
                    <p>Last Updated: {cafe.updatedAt}</p>
                </div>
            </div>
        </div>
    );
};

export default CafeEdit;
























// import React, { useState, useEffect } from 'react';
// import GoogleMapReact from 'google-map-react';
// import axiosInstance from '../../../config/users/axios.instance';
// import { useParams } from 'react-router-dom';

// const CafeEdit = () => {

//     const { cafeId } = useParams()
//     const [isEditing, setIsEditing] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [cafe, setCafe] = useState({
//         name: "",
//         contact: "",
//         information: "",
//         coordinates: { latitude: 31.5204, longitude: 74.3587 },
//         attachedCafeAdmin: "",
//         status: "",
//         createdAt: "",
//         updatedAt: "",
//     });
//     const [originalCafe, setOriginalCafe] = useState(null);

//     useEffect(() => {
//         fetchCafeDetails();
//     }, [cafeId]);

//     const fetchCafeDetails = async () => {
//         try {
//             const response = await axiosInstance.get(`/api/mod/cafe/${cafeId}`);
//             setCafe(response.data.cafe);
//             setOriginalCafe(response.data.cafe);
//         } catch (error) {
//             setError("Failed to fetch cafe details");
//             console.error("Error fetching cafe:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setCafe({ ...cafe, [e.target.name]: e.target.value });
//     };

//     const handleMapClick = ({ lat, lng }) => {
//         if (isEditing) {
//             setCafe(prev => ({
//                 ...prev,
//                 coordinates: { latitude: lat, longitude: lng }
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             const response = await axiosInstance.patch(`/api/mod/cafe/${cafeId}/update`, cafe);
//             setCafe(response.data.cafe);
//             setOriginalCafe(response.data.cafe);
//             setIsEditing(false);
//         } catch (err) {
//             setError(err?.response?.data?.errors?.map(err => err.msg) || "Failed to update cafe");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         setCafe(originalCafe);
//         setIsEditing(false);
//         setError("");
//     };

//     return (
//         <div className="p-8 min-h-screen max-w-7xl mx-auto">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold dark:text-white text-gray-800">
//                         {isEditing ? 'Edit Cafe' : 'Cafe Details'}
//                     </h2>
//                     <p className="text-sm dark:text-gray-300 text-gray-600">
//                         {isEditing ? 'Make changes to cafe information' : 'View cafe information'}
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
//                     className={`px-4 py-2 rounded-md ${isEditing
//                         ? 'bg-gray-500 hover:bg-gray-600 text-white'
//                         : 'bg-blue-500 hover:bg-blue-600 text-white'
//                         }`}
//                 >
//                     {isEditing ? 'Cancel Editing' : 'Edit Cafe'}
//                 </button>
//             </div>

//             {error && (
//                 <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
//                     {error}
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2 relative">
//                             <label className="block text-sm font-medium dark:text-white text-gray-700">
//                                 Cafe Name
//                             </label>
//                             {isEditing ? (
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={cafe.name}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
//                                 />
//                             ) : (
//                                 <p className="py-2 dark:text-white text-gray-900">{cafe.name}</p>
//                             )}
//                         </div>

//                         <div className="space-y-2 relative">
//                             <label className="block text-sm font-medium dark:text-white text-gray-700">
//                                 Contact Information
//                             </label>
//                             {isEditing ? (
//                                 <input
//                                     type="text"
//                                     name="contact"
//                                     value={cafe.contact}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
//                                 />
//                             ) : (
//                                 <p className="py-2 dark:text-white text-gray-900">{cafe.contact}</p>
//                             )}
//                         </div>
//                     </div>

//                     <div className="space-y-2 relative">
//                         <label className="block text-sm font-medium dark:text-white text-gray-700">
//                             Additional Information
//                         </label>
//                         {isEditing ? (
//                             <textarea
//                                 name="information"
//                                 value={cafe.information}
//                                 onChange={handleChange}
//                                 rows="4"
//                                 className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
//                             />
//                         ) : (
//                             <p className="py-2 dark:text-white text-gray-900">{cafe.information}</p>
//                         )}
//                     </div>

//                     {isEditing ? (
//                         <div className="space-y-2 relative">
//                             <label className="block text-sm font-medium dark:text-white text-gray-700">
//                                 Status
//                             </label>
//                             <select
//                                 name="status"
//                                 value={cafe.status}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 rounded-md"
//                             >
//                                 <option value="active">Active</option>
//                                 <option value="deactive">Deactive</option>
//                                 <option value="archived">Archive</option>
//                             </select>
//                         </div>
//                     ) : (
//                         <div className="space-y-2 relative">
//                             <label className="block text-sm font-medium dark:text-white text-gray-700">
//                                 Status
//                             </label>
//                             <span className={`px-3 py-1 rounded-full text-sm ${cafe.status === 'active' ? 'bg-green-100 text-green-800' :
//                                 cafe.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                     'bg-red-100 text-red-800'
//                                 }`}>
//                                 {cafe.status}
//                             </span>
//                         </div>
//                     )}

//                     {isEditing && (
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
//                         >
//                             {loading ? "Saving Changes..." : "Save Changes"}
//                         </button>
//                     )}
//                 </div>

//                 <div className="space-y-4">
//                     <label className="block text-sm font-medium dark:text-white text-gray-700">
//                         Cafe Location
//                     </label>
//                     <div className="h-96 w-full border rounded-lg overflow-hidden">
//                         <GoogleMapReact
//                             bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
//                             defaultCenter={{
//                                 lat: cafe.coordinates.latitude,
//                                 lng: cafe.coordinates.longitude
//                             }}
//                             defaultZoom={14}
//                             onClick={handleMapClick}
//                         >
//                             <div
//                                 lat={cafe.coordinates.latitude}
//                                 lng={cafe.coordinates.longitude}
//                                 className="text-red-500"
//                             >
//                                 📍
//                             </div>
//                         </GoogleMapReact>
//                     </div>
//                     <p className="text-sm dark:text-white text-gray-600">
//                         Latitude: {cafe.coordinates.latitude.toFixed(4)},
//                         Longitude: {cafe.coordinates.longitude.toFixed(4)}
//                     </p>
//                 </div>
//             </div>

//             <div className="mt-8 grid grid-cols-2 gap-4 text-sm dark:text-white text-gray-600">
//                 <div>
//                     <p>Created: {cafe.createdAt}</p>
//                 </div>
//                 <div>
//                     <p>Last Updated: {cafe.updatedAt}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CafeEdit;