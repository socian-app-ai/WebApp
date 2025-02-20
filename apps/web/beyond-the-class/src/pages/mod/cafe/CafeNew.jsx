import { useState, useEffect } from "react";
import axios from "axios";
import LabelInputCustomizable from "../../../components/TextField/LabelInputCustomizable";
import { Button, MenuItem, Select } from "@mui/material";
import GoogleMapReact from 'google-map-react';

export default function CafeNew() {
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

    useEffect(() => {
        async function fetchCafeUsers() {
            try {
                const response = await axios.get("/api/cafe/users");
                setCafeUsers(response.data);
            } catch (err) {
                console.error("Error fetching cafe users:", err);
            }
        }
        fetchCafeUsers();
    }, []);

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

        try {
            const response = await axios.post("/api/cafe/create", newCafe);
            console.log("Cafe created successfully:", response.data);
        } catch (err) {
            console.error("Error creating cafe:", err);
            setError("Failed to create cafe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-8 px-4 min-h-screen max-w-lg mx-auto">
            <h5 className="text-lg font-semibold mb-4">Create New Cafe</h5>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <LabelInputCustomizable
                    type="text"
                    name="information"
                    label="Additional Information"
                    placeholder="Provide more details"
                    value={newCafe.information}
                    onChange={handleChange}
                />

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Assign Cafe Admin</label>
                    <Select
                        name="attachedCafeAdmin"
                        value={newCafe.attachedCafeAdmin}
                        onChange={handleChange}
                        fullWidth
                    >
                        {cafeUsers.map((user) => (
                            <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                        ))}
                    </Select>
                </div>

                <div className="mb-4 h-64">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Set Cafe Location</label>
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
        </div>
    );
}




// // import ShinyButton from "../../../components/Shinny/ShinnyButton";
// // import TypeWork, { useTypeEffect } from "../../../components/Shinny/Type/TypeWork";

// export default function CafeNew() {

//     // const { textAreaRef, textValue, handleChange, RenderTextEffect } = useTypeEffect()

//     return (
//         <div className="pt-8 px-2 min-h-screen">
//             <h5 className="text-lg font-semibold">Create New Cafe</h5>
//             {/* <ShinyButton />
//             <TypeWork />


//             <textarea
//                 onChange={handleChange}
//                 ref={textAreaRef}
//                 className="opacity-0 w-0 h-0"
//             />
//             <RenderTextEffect /> */}
//         </div>
//     )
// }
