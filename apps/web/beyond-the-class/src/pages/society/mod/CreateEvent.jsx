
// import React, { useEffect, useRef, useState } from 'react';
// import { GoogleMap, LoadScript } from '@react-google-maps/api';

// const DrawingMap = () => {
//     const [map, setMap] = useState(null);
//     const [coordinates, setCoordinates] = useState([]); // Store area coordinates
//     const drawingManager = useRef(null);



//     useEffect(() => {
//         if (map) {
//             // Initialize the DrawingManager
//             drawingManager.current = new window.google.maps.drawing.DrawingManager({
//                 drawingMode: window.google.maps.drawing.OverlayType.MARKER,
//                 drawingControl: true,
//                 drawingControlOptions: {
//                     position: window.google.maps.ControlPosition.TOP_CENTER,
//                     drawingModes: [
//                         window.google.maps.drawing.OverlayType.MARKER,
//                         window.google.maps.drawing.OverlayType.CIRCLE,
//                         window.google.maps.drawing.OverlayType.POLYGON,
//                         window.google.maps.drawing.OverlayType.POLYLINE,
//                         window.google.maps.drawing.OverlayType.RECTANGLE,
//                     ],
//                 },
//                 markerOptions: {
//                     icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
//                 },
//                 circleOptions: {
//                     fillColor: "#ffff00",
//                     fillOpacity: 1,
//                     strokeWeight: 5,
//                     clickable: false,
//                     editable: true,
//                     zIndex: 1,
//                 },
//             });

//             // Attach event listeners for shape completion
//             window.google.maps.event.addListener(
//                 drawingManager.current,
//                 'polygoncomplete',
//                 handlePolygonComplete
//             );

//             window.google.maps.event.addListener(
//                 drawingManager.current,
//                 'circlecomplete',
//                 handleCircleComplete
//             );

//             // Attach the DrawingManager to the map
//             drawingManager.current.setMap(map);
//         }
//     }, [map]);

//     const handleLoad = (mapInstance) => {
//         setMap(mapInstance);
//     };

//     // Handle completed polygon
//     const handlePolygonComplete = (polygon) => {
//         const path = polygon.getPath();
//         const coords = [];
//         for (let i = 0; i < path.getLength(); i++) {
//             const point = path.getAt(i);
//             coords.push({ lat: point.lat(), lng: point.lng() });
//         }
//         setCoordinates(coords);
//         sendCoordinatesToBackend({ type: 'polygon', coordinates: coords });
//         polygon.setMap(null); // Remove the polygon after completion
//     };

//     // Handle completed circle
//     const handleCircleComplete = (circle) => {
//         const center = circle.getCenter();
//         const radius = circle.getRadius();
//         const circleData = {
//             center: { lat: center.lat(), lng: center.lng() },
//             radius,
//         };
//         setCoordinates([circleData]);
//         sendCoordinatesToBackend({ type: 'circle', ...circleData });
//         circle.setMap(null); // Remove the circle after completion
//     };

//     // Function to send coordinates to the backend
//     const sendCoordinatesToBackend = async (data) => {
//         try {
//             const response = await fetch('/api/areas', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data),
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 console.log('Area saved successfully:', result);
//                 alert('Area saved successfully!');
//             } else {
//                 console.error('Error saving area:', result);
//                 alert('Error saving area');
//             }
//         } catch (error) {
//             console.error('Network error:', error);
//             alert('Network error: Unable to save area.');
//         }
//     };

//     return (
//         <div>
//             <h2>Drawing Map with Backend Integration</h2>
//             <LoadScript
//                 googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//                 libraries={['drawing']} // Important to include drawing library
//             >
//                 <GoogleMap
//                     mapContainerStyle={{ width: '100%', height: '400px' }}
//                     center={{ lat: -34.397, lng: 150.644 }}
//                     zoom={8}
//                     onLoad={handleLoad}
//                 >
//                     {/* DrawingManager is already added when map is loaded */}
//                 </GoogleMap>
//             </LoadScript>
//             <div>
//                 <h3>Captured Coordinates: <CurrentLocation /></h3>
//                 <pre>{JSON.stringify(coordinates, null, 2)}</pre>
//             </div>
//         </div>
//     );
// };

// export default DrawingMap;



// const CurrentLocation = () => {
//     const [location, setLocation] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Check if the browser supports Geolocation API
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser.');
//             return;
//         }

//         // Get the user's current position
//         const fetchLocation = () => {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ lat: latitude, lng: longitude });
//                 },
//                 (err) => {
//                     setError('Unable to retrieve your location.');
//                     console.error(err);
//                 }
//             );
//         };

//         fetchLocation();
//     }, []);

//     return (
//         <div>
//             <h2>User's Current Location</h2>
//             {location ? (
//                 <p>
//                     Latitude: {location.lat}, Longitude: {location.lng}
//                 </p>
//             ) : error ? (
//                 <p style={{ color: 'red' }}>{error}</p>
//             ) : (
//                 <p>Fetching location...</p>
//             )}
//         </div>
//     );
// };


import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const DrawingMap = () => {
    const [map, setMap] = useState(null);
    const [coordinates, setCoordinates] = useState([]); // Store area coordinates
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const drawingManager = useRef(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
            },
            (err) => {
                setError('Unable to retrieve your location.');
                console.error(err);
            }
        );
    }, []);

    useEffect(() => {
        if (map) {
            drawingManager.current = new window.google.maps.drawing.DrawingManager({
                drawingMode: window.google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        window.google.maps.drawing.OverlayType.MARKER,
                        window.google.maps.drawing.OverlayType.CIRCLE,
                        window.google.maps.drawing.OverlayType.POLYGON,
                        window.google.maps.drawing.OverlayType.POLYLINE,
                        window.google.maps.drawing.OverlayType.RECTANGLE,
                    ],
                },
                markerOptions: {
                    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                },
                circleOptions: {
                    fillColor: "#ffff00",
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                },
            });

            // Attach event listeners for shape completion
            window.google.maps.event.addListener(
                drawingManager.current,
                'polygoncomplete',
                handlePolygonComplete
            );

            window.google.maps.event.addListener(
                drawingManager.current,
                'circlecomplete',
                handleCircleComplete
            );

            drawingManager.current.setMap(map);
        }
    }, [map]);

    const handleLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    const handlePolygonComplete = (polygon) => {
        const path = polygon.getPath();
        const coords = [];
        for (let i = 0; i < path.getLength(); i++) {
            const point = path.getAt(i);
            coords.push({ lat: point.lat(), lng: point.lng() });
        }
        setCoordinates(coords);
        sendCoordinatesToBackend({ type: 'polygon', coordinates: coords });
        polygon.setMap(null); // Remove the polygon after completion
    };

    const handleCircleComplete = (circle) => {
        const center = circle.getCenter();
        const radius = circle.getRadius();
        const circleData = {
            center: { lat: center.lat(), lng: center.lng() },
            radius,
        };
        setCoordinates([circleData]);
        sendCoordinatesToBackend({ type: 'circle', ...circleData });
        circle.setMap(null); // Remove the circle after completion
    };

    const sendCoordinatesToBackend = async (data) => {
        try {
            const response = await fetch('/api/areas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                console.log('Area saved successfully:', result);
                alert('Area saved successfully!');
            } else {
                console.error('Error saving area:', result);
                alert('Error saving area');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error: Unable to save area.');
        }
    };

    return (
        <div>
            <h2>Drawing Map with Backend Integration</h2>
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                libraries={['drawing']}
            >
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    center={location || { lat: 0, lng: 0 }} // Default center while location loads
                    zoom={location ? 8 : 2}
                    onLoad={handleLoad}
                >
                    {/* DrawingManager is added to the map via effect */}
                </GoogleMap>
            </LoadScript>
            <div>
                <h3>
                    Current Location:
                    {location ? (
                        ` Lat: ${location.lat}, Lng: ${location.lng}`
                    ) : error ? (
                        <span style={{ color: 'red' }}>{error}</span>
                    ) : (
                        ' Loading...'
                    )}
                </h3>
                <h3>Captured Coordinates:</h3>
                <pre>{JSON.stringify(coordinates, null, 2)}</pre>
            </div>
        </div>
    );
};

export default DrawingMap;
