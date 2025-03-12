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

                console.log("APst ", res.data.papers)
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

    const renderPdfSlide = (paper) => (
        <div key={paper._id} className="flex flex-col p-4 sm:p-6">
            <div className="m-2 w-full h-[60vh] overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                <PdfReact pdf={`${import.meta.env.VITE_BACKEND_API_URL}/api/uploads/${paper.file.url}`} />
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
            </div>
        </div>
    );

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

