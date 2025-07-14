import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useEffect, useState } from "react";
import Discussions from "./Discussions";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import PdfReact from "../../../../components/pdf/PdfReact";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../config/users/axios.instance";

export default function OneDiscussion() {
    const location = useLocation();
    const { subject, paper } = location.state || {};
    const [relatedPapers, setRelatedPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFileIndexes, setSelectedFileIndexes] = useState({});
    const sliderRef = useRef(null);
    const navigate = useNavigate();
    const { toBeDisccusedId } = useParams();

    useEffect(() => {
        const fetchRelatedPapers = async () => {
            try {
                if (!paper?.type || !paper?.subjectId) return;
                const res = await axiosInstance.get(
                    `/api/pastpaper/${paper.type.toLowerCase()}/${paper.subjectId}`
                );

                console.log("Papers Data: ", res.data.papers);
                // Flatten the papers array and filter for the same type
                const allPapers = res.data.papers.reduce((acc, yearGroup) => {
                    const papersOfType = yearGroup.papers.filter(p =>
                        p.type.toLowerCase() === paper.type.toLowerCase()
                    );
                    return [...acc, ...papersOfType];
                }, []);

                // Move the current paper to the front
                const sortedPapers = allPapers.sort((a, b) => {
                    if (a._id === paper._id) return -1;
                    if (b._id === paper._id) return 1;
                    return b.academicYear - a.academicYear;
                });

                // Initialize selected file indexes (default to first file for each paper)
                const initialFileIndexes = {};
                sortedPapers.forEach(paper => {
                    if (paper.files && paper.files.length > 0) {
                        initialFileIndexes[paper._id] = 0;
                    }
                });
                setSelectedFileIndexes(initialFileIndexes);

                setRelatedPapers(sortedPapers);
            } catch (error) {
                console.error("Error fetching related papers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedPapers();
    }, [paper]);

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1080,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const getFileUrl = (paper) => {
        if (!paper.files || paper.files.length === 0) return null;
        const selectedIndex = selectedFileIndexes[paper._id] || 0;
        const file = paper.files[selectedIndex];
        return file ? file.url : null;
    };

    const handleFileChange = (paperId, fileIndex) => {
        setSelectedFileIndexes(prev => ({
            ...prev,
            [paperId]: fileIndex
        }));
    };

    const renderPdfSlide = (paper) => {
        const fileUrl = getFileUrl(paper);
        const selectedFileIndex = selectedFileIndexes[paper._id] || 0;
        
        if (!fileUrl) {
            return (
                <div key={paper._id} className="flex flex-col p-4 sm:p-6">
                    <div className="m-2 w-full h-[60vh] flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">No files available for this paper</p>
                    </div>
                    <div className="p-2 text-center">
                        <p className="text-sm sm:text-base font-medium dark:text-white">
                            {paper.name} - {paper.type} ({paper.academicYear})
                            {paper._id === toBeDisccusedId && " (Selected)"}
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div key={paper._id} className="flex flex-col p-4 sm:p-6">
                {/* File selector for papers with multiple files */}
                {paper.files && paper.files.length > 1 && (
                    <div className="mb-2 flex items-center justify-center">
                        <select
                            value={selectedFileIndex}
                            onChange={(e) => handleFileChange(paper._id, parseInt(e.target.value))}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            {paper.files.map((file, index) => (
                                <option key={index} value={index}>
                                    File {index + 1} of {paper.files.length}
                                    {file.uploadedBy && ` (by ${file.uploadedBy.name || file.uploadedBy.username || 'Anonymous'})`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="m-2 w-full h-[60vh] overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                    <PdfReact pdf={`${import.meta.env.VITE_BACKEND_API_URL}/api/uploads/${fileUrl}`} />
                </div>
                
                <div className="p-2 text-center">
                    <p className="text-sm sm:text-base font-medium dark:text-white">
                        {paper.name} - {paper.type} ({paper.academicYear})
                        {paper._id === toBeDisccusedId && " (Selected)"}
                    </p>
                    {paper.term && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Term: {paper.term}
                        </p>
                    )}
                    {paper.files && paper.files.length > 1 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            Showing file {selectedFileIndex + 1} of {paper.files.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading papers...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-2 dark:bg-[#1b1b1bb8]">
            <div className="flex items-center mb-2">
                <ArrowBack onClick={() => { navigate(-1); }} />
                <h6 className="text-2xl font-bold p-2 text-gray-800 dark:text-gray-200">
                    {subject} - {paper?.type} Papers
                </h6>
            </div>

            <div className="w-full mt-2 relative overflow-hidden custom-scrollbar">
                <Slider arrows={false} {...settings} ref={sliderRef} className="w-full custom-scrollbar max-w-full mt-5">
                    {relatedPapers.map(paper => renderPdfSlide(paper))}
                </Slider>

                <div className="absolute top-0 flex justify-between w-full px-2 md:pr-5 md:pl-7 space-x-2">
                    <button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => sliderRef.current.slickNext()}
                        className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="w-full min-h-screen">
                <Discussions toBeDisccusedId={toBeDisccusedId} />
            </div>
        </div>
    );
}

