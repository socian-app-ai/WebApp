
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MediaSwiper({ media }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDots, setShowDots] = useState(true);
    const [videoThumbnail, setVideoThumbnail] = useState(null);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => setShowDots(false), 5000);
        return () => clearTimeout(timeout);
    }, [currentIndex]);

    useEffect(() => {
        const currentMedia = media[currentIndex];

        if (currentMedia?.type.startsWith("video")) {
            extractVideoThumbnail(currentMedia.url);
        } else {
            setVideoThumbnail(null);
        }
    }, [currentIndex]);

    const extractVideoThumbnail = (videoUrl) => {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.currentTime = 5; // Capture frame at 1s
        video.onloadeddata = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setVideoThumbnail(canvas.toDataURL("image/jpeg"));
        };
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!touchStartX.current) return;
        const touchEndX = e.touches[0].clientX;
        const deltaX = touchStartX.current - touchEndX;

        if (deltaX > 50 && currentIndex < media.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else if (deltaX < -50 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }

        touchStartX.current = null;
        setShowDots(true);
    };

    const handleNext = () => {
        if (currentIndex < media.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setShowDots(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setShowDots(true);
        }
    };

    const currentMedia = media[currentIndex];
    const backgroundUrl =
        currentMedia?.type.startsWith("video") && videoThumbnail
            ? videoThumbnail
            : currentMedia?.url;

    return (
        <div
            ref={containerRef}
            className="z-0 relative overflow-hidden w-full max-w-2xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            {/* Background Blur */}
            <div
                className="absolute inset-0 bg-black/50 z-[-1]"
                style={{
                    backgroundImage: `url(${backgroundUrl})`,
                    filter: "blur(10px)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>

            <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {media.map((file, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex justify-center items-center">
                        {file.type.startsWith("video") ? (
                            <video
                                color="none"
                                src={file.url}
                                controls
                                className="object-contain w-full max-h-[22rem] rounded-lg bg-transparent"
                            />
                        ) : (
                            <img
                                src={file.url}
                                alt="media"
                                className="object-contain w-full max-h-[22rem] rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </motion.div>

            {currentIndex > 0 && (
                <button
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft />
                </button>
            )}

            {currentIndex < media.length - 1 && (
                <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={handleNext}
                    disabled={currentIndex === media.length - 1}
                >
                    <ChevronRight />
                </button>
            )}

            {showDots && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-opacity duration-500">
                    {media.map((_, index) => (
                        <span
                            key={index}
                            className={`w-2 h-2 rounded-full cursor-pointer ${index === currentIndex ? "bg-white" : "bg-gray-400 opacity-50"
                                }`}
                            onClick={() => setCurrentIndex(index)}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
}



// /* eslint-disable react/prop-types */
// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft } from "lucide-react";
// import { ChevronRight } from "lucide-react";

// export default function MediaSwiper({ media }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [showDots, setShowDots] = useState(true);
//     const containerRef = useRef(null);
//     const touchStartX = useRef(null);

//     useEffect(() => {
//         const timeout = setTimeout(() => setShowDots(false), 5000);
//         return () => clearTimeout(timeout);
//     }, [currentIndex]);

//     const handleTouchStart = (e) => {
//         touchStartX.current = e.touches[0].clientX;
//     };

//     const handleTouchMove = (e) => {
//         if (!touchStartX.current) return;
//         const touchEndX = e.touches[0].clientX;
//         const deltaX = touchStartX.current - touchEndX;

//         if (deltaX > 50 && currentIndex < media.length - 1) {
//             setCurrentIndex((prev) => prev + 1);
//         } else if (deltaX < -50 && currentIndex > 0) {
//             setCurrentIndex((prev) => prev - 1);
//         }

//         touchStartX.current = null;
//         setShowDots(true);
//     };

//     const handleNext = () => {
//         if (currentIndex < media.length - 1) {
//             setCurrentIndex((prev) => prev + 1);
//             setShowDots(true);
//         }
//     };

//     const handlePrev = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex((prev) => prev - 1);
//             setShowDots(true);
//         }
//     };

//     return (
//         <div
//             ref={containerRef}
//             className="z-0 relative overflow-hidden w-full max-w-2xl mx-auto "
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//         // style={{ "max-height": "22rem", "min-height": "22rem", "max-width": "24rem", "min-width": "10rem" }}
//         >

//             <div
//                 className="absolute inset-0 bg-black/50  z-[-1]"
//                 style={{ backgroundImage: `url(${media[currentIndex]?.url})`, filter: "blur(5px)", backgroundSize: "cover", backgroundPosition: "center" }}
//             ></div>
//             {console.log(media[currentIndex]?.url)}

//             <motion.div
//                 className="flex"
//                 animate={{ x: `-${currentIndex * 100}%` }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//                 {media.map((file, index) => (
//                     <div key={index} className="w-full flex-shrink-0 flex justify-center items-center">
//                         {file.type.startsWith("video") ? (
//                             <video src={file.url} controls style={{ "max-height": "22rem", "min-height": "22rem", "max-width": "24rem", "min-width": "10rem" }} className="object-contain w-full rounded-lg" />
//                         ) : (
//                             <img src={file.url} alt="media" style={{ "max-height": "22rem", "min-height": "22rem", "max-width": "24rem", "min-width": "10rem" }} className="object-contain w-full rounded-lg" />
//                         )}
//                     </div>
//                 ))}
//             </motion.div>

//             {
//                 currentIndex > 0 && (
//                     <button
//                         className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                         onClick={handlePrev}
//                         disabled={currentIndex === 0}
//                     >
//                         <ChevronLeft />
//                     </button>
//                 )
//             }

//             {
//                 currentIndex < media.length - 1 &&
//                 (<button
//                     className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                     onClick={handleNext}
//                     disabled={currentIndex === media.length - 1}
//                 >
//                     <ChevronRight />
//                 </button>)
//             }

//             {showDots && (
//                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-opacity duration-500">
//                     {media.map((_, index) => (
//                         <span
//                             key={index}
//                             className={`w-2 h-2 rounded-full cursor-pointer ${index === currentIndex ? "bg-white" : "bg-gray-400 opacity-50"}`}
//                             onClick={() => setCurrentIndex(index)}
//                         ></span>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }










// /* eslint-disable react/prop-types */
// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function MediaSwiper({ media }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [showDots, setShowDots] = useState(true);
//     const containerRef = useRef(null);
//     const touchStartX = useRef(null);
//     const videoRef = useRef(null);

//     useEffect(() => {
//         const timeout = setTimeout(() => setShowDots(false), 5000);
//         return () => clearTimeout(timeout);
//     }, [currentIndex]);

//     useEffect(() => {
//         if (videoRef.current) {
//             // Sync background video with the main video
//             const currentMedia = media[currentIndex];
//             if (currentMedia?.type.startsWith("video")) {
//                 videoRef.current.play();
//             }
//         }
//     }, [currentIndex]);

//     const handleTouchStart = (e) => {
//         touchStartX.current = e.touches[0].clientX;
//     };

//     const handleTouchMove = (e) => {
//         if (!touchStartX.current) return;
//         const touchEndX = e.touches[0].clientX;
//         const deltaX = touchStartX.current - touchEndX;

//         if (deltaX > 50 && currentIndex < media.length - 1) {
//             setCurrentIndex((prev) => prev + 1);
//         } else if (deltaX < -50 && currentIndex > 0) {
//             setCurrentIndex((prev) => prev - 1);
//         }

//         touchStartX.current = null;
//         setShowDots(true);
//     };

//     const handleNext = () => {
//         if (currentIndex < media.length - 1) {
//             setCurrentIndex((prev) => prev + 1);
//             setShowDots(true);
//         }
//     };

//     const handlePrev = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex((prev) => prev - 1);
//             setShowDots(true);
//         }
//     };

//     const currentMedia = media[currentIndex];

//     return (
//         <div
//             ref={containerRef}
//             className="z-0 relative overflow-hidden w-full max-w-2xl mx-auto"
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//         >
//             {/* Background Video */}
//             {currentMedia?.type.startsWith("video") && (
//                 <video
//                     ref={videoRef}
//                     className="absolute inset-0 w-full h-full object-cover z-[-1]"
//                     src={currentMedia.url}
//                     loop
//                     muted
//                     autoPlay
//                     style={{ filter: "blur(5px)" }}
//                 />
//             )}

//             {/* Media Display */}
//             <motion.div
//                 className="flex"
//                 animate={{ x: `-${currentIndex * 100}%` }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             >
//                 {media.map((file, index) => (
//                     <div key={index} className="w-full flex-shrink-0 flex justify-center items-center">
//                         {file.type.startsWith("video") ? (
//                             <video
//                                 src={file.url}
//                                 controls
//                                 className="object-contain w-full max-h-[22rem] rounded-lg"
//                             />
//                         ) : (
//                             <img
//                                 src={file.url}
//                                 alt="media"
//                                 className="object-contain w-full max-h-[22rem] rounded-lg"
//                             />
//                         )}
//                     </div>
//                 ))}
//             </motion.div>

//             {currentIndex > 0 && (
//                 <button
//                     className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                     onClick={handlePrev}
//                     disabled={currentIndex === 0}
//                 >
//                     <ChevronLeft />
//                 </button>
//             )}

//             {currentIndex < media.length - 1 && (
//                 <button
//                     className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                     onClick={handleNext}
//                     disabled={currentIndex === media.length - 1}
//                 >
//                     <ChevronRight />
//                 </button>
//             )}

//             {showDots && (
//                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-opacity duration-500">
//                     {media.map((_, index) => (
//                         <span
//                             key={index}
//                             className={`w-2 h-2 rounded-full cursor-pointer ${index === currentIndex ? "bg-white" : "bg-gray-400 opacity-50"
//                                 }`}
//                             onClick={() => setCurrentIndex(index)}
//                         ></span>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
