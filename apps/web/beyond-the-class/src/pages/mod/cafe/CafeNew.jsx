
import { useState, useEffect } from "react";
import LabelInputCustomizable, { LabelDropDownSearchableInputCustomizable, LabelDropDownSearchableInputCustomizableSecond } from "../../../components/TextField/LabelInputCustomizable";
import { Button, MenuItem, Select } from "@mui/material";
import GoogleMapReact from 'google-map-react';
import { routesForApi } from "../../../utils/routes/routesForLinks";
import axiosInstance from "../../../config/users/axios.instance";
import { useToast } from "../../../components/toaster/ToastCustom";
import { Search } from "lucide-react";

export default function CafeNew() {

    const { addToast } = useToast();

    const [newCafe, setNewCafe] = useState({
        name: "",
        contact: "",
        information: "",
        coordinates: { latitude: 0, longitude: 0 },
        attachedCafeAdmin: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cafeUsers, setCafeUsers] = useState([]);

    async function fetchCafeUsers() {
        try {
            const response = await axiosInstance.get(routesForApi.mod.cafe.admins);
            console.log("Cafe Users", response)
            // setCafeUsers(response.data.admins);
            return response.data.admins;
        } catch (err) {
            console.error("Error fetching cafe users:", err);
            return []
        }
    }

    // useEffect(() => {

    //     fetchCafeUsers();
    // }, []);

    const handleChange = (e) => {
        setNewCafe({ ...newCafe, [e.target.name]: e.target.value });
    };

    const handleMapClick = ({ lat, lng }) => {
        setNewCafe((prev) => ({ ...prev, coordinates: { latitude: lat, longitude: lng } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (newCafe.coordinates.longitude === 0 || newCafe.coordinates.latitude === 0 || newCafe.contact === ""
            || newCafe.information === "" || newCafe.name === ""
        ) {
            addToast("Fill All Fields")
            setLoading(false)
            return;
        }

        try {
            const response = await axiosInstance.post(routesForApi.mod.cafe.create, newCafe);
            console.log("Cafe created successfully:", response.data);
            addToast(response.data?.message || "Cafe created successfully")
        } catch (err) {
            console.error("Error creating cafe:", err, err?.response?.data?.errors?.msg);
            addToast(err?.response?.data?.errors?.map(err => err.msg).join('\n') || "Failed to create cafe. Please try again.")

            setError(err?.response?.data?.errors?.map(err => err.msg).join('\n') || "Failed to create cafe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-8 px-4 min-h-screen  mx-auto">
            <h5 className="text-lg font-semibold">Create New Cafe</h5>
            <p className="text-xs dark:text-gray-200 ">By Default cafe is deactive if an admin is not* assigned</p>

            {error && <p className="text-red-500 mb-3 whitespace-pre">{error}</p>}

            <div className="flex flex-col lg:flex-row">
                <form
                    noValidate={true}
                    onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-row space-x-2">
                        <LabelInputCustomizable
                            type="text"
                            name="name"
                            label="Cafe Name"
                            placeholder="Enter cafe name"
                            value={newCafe.name}
                            onChange={handleChange}
                        />

                        <LabelInputCustomizable
                            type="text"
                            name="contact"
                            label="Contact Information"
                            placeholder="Enter contact details"
                            value={newCafe.contact}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-row space-x-2">
                        <LabelInputCustomizable
                            type="text"
                            name="information"
                            label="Additional Information"
                            placeholder="Provide more details"
                            value={newCafe.information}
                            onChange={handleChange}
                        />



                        <LabelDropDownSearchableInputCustomizableSecond
                            fetchOptions={fetchCafeUsers}
                            type="text"
                            autoComplete="off"
                            name="assign_cafe_admin"
                            className="my-4 w-full"
                            value={newCafe.attachedCafeAdmin}
                            label="Assign Cafe Admin"
                            placeholder="Ahmad"
                            width="w-[100%]"
                            inputClassName="w-min-[10rem]"
                            onChange={handleChange}
                        />
                    </div>



                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Cafe"}
                    </Button>
                </form>


                <div className="mb-4 h-64 w-full mx-2">
                    <label className="block dark:text-white text-gray-700 text-sm font-bold mb-2">Set Cafe Location</label>
                    <div className="h-full w-full border rounded-lg overflow-hidden">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
                            defaultCenter={{ lat: 31.5204, lng: 74.3587 }}
                            defaultZoom={14}
                            onClick={handleMapClick}
                        />
                    </div>
                    <p className="text-sm mt-2">Latitude: {newCafe.coordinates.latitude}, Longitude: {newCafe.coordinates.longitude}</p>
                </div>





            </div>



            {/* <MapComponent
                setNewCafe={setNewCafe}
                coordinates={newCafe.coordinates}
                onLocationSelect={({ lat, lng }) => {
                    setNewCafe(prev => ({
                        ...prev,
                        coordinates: { latitude: lat, longitude: lng }
                    }));
                }}
            /> */}
        </div>
    );
}



































// // Custom Pin Component
// // const MapPin = () => (
// //     <div className="relative -translate-x-1/2 -translate-y-full">
// //         <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce">
// //             <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-red-500 transform rotate-45 -translate-x-1/2 translate-y-1/2" />
// //         </div>
// //     </div>
// // );

// // // Search Box Component
// // const SearchBox = ({ onSearch }) => {
// //     const [query, setQuery] = useState("");

// //     const handleSearch = async (e) => {
// //         e.preventDefault();
// //         if (query.trim()) {
// //             onSearch(query);
// //         }
// //     };

// //     return (
// //         <form onSubmit={handleSearch} className="absolute top-4 left-4 z-10 flex">
// //             <input
// //                 type="text"
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //                 placeholder="Search location..."
// //                 className="px-4 py-2 w-64 dark:bg-gray-900 dark:text-white text-black border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //             <button
// //                 type="submit"
// //                 className="px-4 py-2 bg-blue-500 dark:bg-gray-900 dark:text-white text-black rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //                 <Search className="w-5 h-5" />
// //             </button>
// //         </form>
// //     );
// // };



// const SearchBox = ({ onSearch }) => {
//     const [query, setQuery] = useState("");

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         if (query.trim()) {
//             onSearch(query);
//         }
//     };

//     return (
//         <form onSubmit={handleSearchSubmit} className="absolute top-4 left-4 z-10 flex">
//             <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search location..."
//                 className="px-4 py-2 w-64 dark:bg-gray-900 dark:text-white text-black border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 dark:bg-gray-900 dark:text-white text-black rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//                 <Search className="w-5 h-5" />
//             </button>
//         </form>
//     );
// };


// const MapPin = ({ lat, lng }) => (
//     <div className="relative -translate-x-1/2 -translate-y-full">
//         <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce border border-white shadow-lg">
//             <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-red-500 transform rotate-45 -translate-x-1/2 translate-y-1/2" />
//         </div>
//     </div>
// );





// const MapComponent = ({ coordinates, onLocationSelect, setNewCafe }) => {
//     const [map, setMap] = useState(null);
//     const [maps, setMaps] = useState(null);
//     const [searchError, setSearchError] = useState("");
//     const [searchedLocation, setSearchedLocation] = useState(null);

//     const defaultCenter = {
//         lat: coordinates.latitude || 31.5204,
//         lng: coordinates.longitude || 74.3587
//     };

//     // const handleSearch = async (query) => {
//     //     if (!maps || !map) return;

//     //     const geocoder = new maps.Geocoder();
//     //     try {
//     //         const result = await new Promise((resolve, reject) => {
//     //             geocoder.geocode({ address: query }, (results, status) => {
//     //                 console.log("GEO", results, "status", status)
//     //                 if (status === "OK") {
//     //                     resolve(results[0]);
//     //                 } else {
//     //                     reject(new Error(`Geocoding failed: ${status}`));
//     //                 }
//     //             });
//     //         });

//     //         const { lat, lng } = result.geometry.location;
//     //         const latitude = lat();
//     //         const longitude = lng();

//     //         map.panTo({ lat: latitude, lng: longitude });
//     //         map.setZoom(15);

//     //         onLocationSelect({ lat: latitude, lng: longitude });

//     //         // Store the searched location to display a pin
//     //         setSearchedLocation({ latitude, longitude });

//     //         setSearchError("");
//     //     } catch (error) {
//     //         setSearchError("Location not found. Please try again.");
//     //         console.error("Geocoding error:", error);
//     //     }
//     // };


//     const handleSearch = async (query, setNewCafe) => {
//         try {
//             const response = await axiosInstance.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//                 params: {
//                     address: query,
//                     key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//                 }
//             });

//             if (response.data.status === "OK") {
//                 const location = response.data.results[0].geometry.location;
//                 console.log("Location Found:", location);

//                 setNewCafe((prev) => ({
//                     ...prev,
//                     coordinates: {
//                         latitude: location.lat,
//                         longitude: location.lng
//                     }
//                 }));
//             } else {
//                 console.error("Geocode API Error:", response.data.status);
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };
//     const handleApiLoaded = (map, maps) => {
//         setMap(map);
//         setMaps(maps);
//     };

//     return (
//         <div className="relative h-full w-full">
//             <SearchBox onSearch={handleSearch} />
//             {searchError && <p className="text-red-500">{searchError}</p>}
//             <div className="h-full w-full border rounded-lg overflow-hidden">
//                 <GoogleMapReact
//                     bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
//                     defaultCenter={defaultCenter}
//                     defaultZoom={14}
//                     onClick={({ lat, lng }) => onLocationSelect({ lat, lng })}
//                     yesIWantToUseGoogleMapApiInternals
//                     onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
//                 >
//                     {/* Display the marker when a place is searched */}
//                     {searchedLocation && (
//                         <MapPin lat={searchedLocation.latitude} lng={searchedLocation.longitude} />
//                     )}
//                 </GoogleMapReact>
//             </div>
//         </div>
//     );
// };




// // const MapComponent = ({ coordinates, onLocationSelect }) => {
// //     const [map, setMap] = useState(null);
// //     const [maps, setMaps] = useState(null);
// //     const [searchError, setSearchError] = useState("");

// //     const defaultCenter = {
// //         lat: coordinates.latitude || 31.5204,
// //         lng: coordinates.longitude || 74.3587
// //     };

// //     const handleSearch = async (query) => {
// //         if (!maps || !map) return;

// //         const geocoder = new maps.Geocoder();
// //         try {
// //             const result = await new Promise((resolve, reject) => {
// //                 geocoder.geocode({ address: query }, (results, status) => {
// //                     console.log("GEO", results, "status", status)
// //                     if (status === 'OK') {
// //                         resolve(results[0]);
// //                     } else {
// //                         reject(new Error(`Geocoding failed: ${status}`));
// //                     }
// //                 });
// //             });

// //             const { lat, lng } = result.geometry.location;
// //             const latitude = lat();
// //             const longitude = lng();

// //             map.panTo({ lat: latitude, lng: longitude });
// //             map.setZoom(15);
// //             onLocationSelect({ lat: latitude, lng: longitude });
// //             setSearchError("");
// //         } catch (error) {
// //             setSearchError("Location not found. Please try again.");
// //             console.error("Geocoding error:", error);
// //         }
// //     };

// //     const handleApiLoaded = (map, maps) => {
// //         setMap(map);
// //         setMaps(maps);
// //     };

// //     return (
// //         <div className="relative h-full w-full">
// //             <SearchBox onSearch={handleSearch} />
// //             {searchError && (
// //                 <div className="absolute top-16 left-4 z-10 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
// //                     {searchError}
// //                 </div>
// //             )}
// //             <GoogleMapReact
// //                 bootstrapURLKeys={{
// //                     key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
// //                     libraries: ['places', 'geometry']
// //                 }}
// //                 defaultCenter={defaultCenter}
// //                 defaultZoom={14}
// //                 onClick={onLocationSelect}
// //                 yesIWantToUseGoogleMapApiInternals
// //                 onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
// //             >
// //                 {coordinates.latitude !== 0 && coordinates.longitude !== 0 && (
// //                     <MapPin
// //                         lat={coordinates.latitude}
// //                         lng={coordinates.longitude}
// //                     />
// //                 )}
// //             </GoogleMapReact>
// //         </div>
// //     );
// // };
