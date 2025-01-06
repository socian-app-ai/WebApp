



import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import Discussions from "./Discussions";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import PdfReact from "../../../../components/pdf/PdfReact";

export default function OneDiscussion() {
    const location = useLocation();
    const { years, subject, t } = location.state || {};
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    // console.log(years, subject, t)

    const settings = {
        // dots: true,
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


    const renderPdfSlide = (pdfItem, year, term, examType) => (
        <div className="flex flex-col p-4 sm:p-6">
            <div className="m-2 w-full h-[60vh] overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg" key={`${term}-${examType}`}>
                {/* <PdfReact pdf={pdfItem.file} /> */}
                <iframe
                    className="w-full h-full "
                    src={`${t.file.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                    style={{ border: "none" }}
                ></iframe>

            </div>
            <div className="p-2 text-center text-xs sm:text-sm text-white">
                <p className="text-black dark:text-white">{year} - {term} - {examType}</p>
            </div>
        </div>
    );

    // const generateSlides = () => {
    //     const slides = [];
    //     const yearsArray = Array.isArray(years) ? years : Object.keys(years).map(year => ({ year, ...years[year] }));

    //     console.log("year", years)
    //     if (Array.isArray(yearsArray)) {
    //         yearsArray.forEach(yearData => {
    //             if (yearData.fall) {
    //                 slides.push(...yearData.fall.final.theory.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Fall', 'Final')));
    //                 slides.push(...yearData.fall.mid.theory.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Fall', 'Mid')));
    //                 slides.push(...yearData.fall.final.lab.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Fall', 'Final')));
    //                 slides.push(...yearData.fall.mid.lab.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Fall', 'Mid')));
    //             }
    //             if (yearData.spring) {
    //                 slides.push(...yearData.spring.final.theory.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Spring', 'Final')));
    //                 slides.push(...yearData.spring.mid.theory.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Spring', 'Mid')));
    //                 slides.push(...yearData.spring.final.lab.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Spring', 'Final')));
    //                 slides.push(...yearData.spring.mid.lab.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Spring', 'Mid')));
    //             }
    //             if (yearData.assignments) {
    //                 slides.push(...yearData.assignments.map(pdfItem => renderPdfSlide(pdfItem, yearData.year, 'Assignments', 'General')));
    //             }
    //         });
    //     }
    //      else {
    //         console.warn("Expected 'years' to be an array but received:", years);
    //     }
    //     return slides;
    // };

    const generateSlides = () => {
        const slides = [];

        // Ensure `years` is an object
        if (typeof years === 'object') {
            Object.keys(years).forEach(yearKey => {
                const yearDocuments = years[yearKey];

                yearDocuments.forEach(doc => {
                    if (doc.file && doc.file.pdf) {
                        slides.push(renderPdfSlide(doc.file, yearKey, doc.name, 'General'));
                    }
                });
            });
        } else {
            console.warn("Expected 'years' to be an object but received:", years);
        }

        return slides;
    };

    return (
        <div className="min-h-screen w-full p-2 dark:bg-[#1b1b1bb8]">

            <div className="flex items-center mb-2">
                <ArrowBack onClick={() => { navigate(-1); }} />
                <h6 className="text-2xl font-bold p-2 text-gray-800 dark:text-gray-200">{subject}</h6>
            </div>

            <div className="w-full mt-2 relative overflow-hidden custom-scrollbar">

                <Slider arrows={false} {...settings} ref={sliderRef} className="w-full custom-scrollbar max-w-full mt-5">
                    {t && (
                        <div key={t._id} className="flex flex-col p-4 sm:p-6">
                            <div className="m-2 w-full h-[60vh] overflow-auto border border-gray-200 dark:border-gray-600">
                                <PdfReact pdf={t.file.pdf} />
                                <iframe
                                    className="w-full h-full "
                                    src={`${t.file.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                                    style={{ border: "none" }}
                                ></iframe>
                                {/* {t.file} */}
                            </div>
                            <div className="p-2 text-center text-xs sm:text-sm">
                                <p className="dark:text-white">Requested PDF</p>
                            </div>
                        </div>
                    )}
                    {generateSlides()}
                </Slider>

                <div className="absolute top-0 flex justify-between w-full px-2 md:pr-5 md:pl-7 space-x-2">
                    <button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                        Back
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
                {/* Discussion of {t.pdf} */}
                <Discussions toBeDisccusedId={t._id} />
            </div>
        </div>
    );
}
