/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MoreVertical, DownloadIcon, FolderKanban } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../../../../config/users/axios.instance";
import { ArrowBack } from "@mui/icons-material";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const LoadingAnimation = () => (
  <div className="min-h-screen w-full flex flex-row pt-8 px-2 ">
    <div className="m-2 animate-pulse w-60">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-2">
        <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-2">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function TypeCourse() {
  const { courseType, subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get('year');
  const [papers, setPapers] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/pastpaper/${courseType}/${subjectId}`
        );
        console.log("APst ", res.data.papers)
        setPapers(res.data.papers);
        setSubjectName(res.data.subjectName);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading data.");
      }
    };
    fetchData();
  }, [courseType, subjectId]);

  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!papers) return <LoadingAnimation />;

  // Group papers by year
  const papersByYear = papers.reduce((acc, yearGroup) => {
    const year = yearGroup.academicYear;
    const papersOfType = yearGroup.papers.filter(p =>
      p.type.toLowerCase() === courseType.toLowerCase()
    );
    if (papersOfType.length > 0) {
      acc[year] = papersOfType;
    }
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(papersByYear).sort((a, b) => b - a);

  // If a year is selected, move it to the top
  if (selectedYear && sortedYears.includes(selectedYear)) {
    sortedYears.splice(sortedYears.indexOf(selectedYear), 1);
    sortedYears.unshift(selectedYear);
  }

  return (
    <div className="min-h-screen w-full px-4 pt-8">
      <div className="flex items-center mb-6">
        <ArrowBack onClick={() => navigate(-1)} className="cursor-pointer mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {courseType.charAt(0).toUpperCase() + courseType.slice(1).toLowerCase()} Papers for {subjectName}
        </h2>
      </div>

      <div className="space-y-8">
        {sortedYears.map(year => (
          <div key={year} className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {year} {selectedYear === year && "(Selected Year)"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {papersByYear[year].map((paper) => (
                <FilePreviewCard
                  key={paper._id}
                  keyVal={paper._id}
                  title={paper.name}
                  content={`${paper.term || ''} ${paper.category || ''}`}
                  link={`${import.meta.env.VITE_BACKEND_API_URL}/api/uploads/${paper.file.url}`}
                  paper={paper}
                  subject={subjectName}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FilePreviewCard = ({
  keyVal,
  title,
  content,
  link,
  paper,
  subject,
}) => {
  const [numPages, setNumPages] = useState(null);
  const navigate = useNavigate();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadFile = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url.split("/").pop();
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleDiscussClick = (item) => {
    navigate(`/student/discussion/${item._id}`, {
      state: { subject, paper },
    });
  };

  return (
    <div
      key={keyVal}
      className="bg-white dark:bg-[#2a3c56] rounded-md shadow-md p-3 font-sans"
    >
      <div className={`${numPages ? 'p-1' : 'p-3'} bg-gray-50 dark:bg-[#111827] rounded-lg mb-1`}>
        <div className={`${numPages ? 'w-full h-36' : 'p-2'} border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden`}>
          {numPages ? (
            <>
              <Document file={link} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
              <p className="text-sm text-gray-500 mt-2">
                Page 1 of {numPages}
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-[#1F2937] rounded-full w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-[#1F2937] rounded-full w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-[#1F2937] rounded-full w-2/3"></div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium dark:text-white text-gray-900">{title}</h3>
        <p className="text-sm dark:text-white text-gray-500 leading-tight">{content}</p>
        <p className="text-sm dark:text-white text-gray-500">PDF</p>
      </div>

      <div className="flex space-x-1 justify-between mt-4">
        <button
          onClick={() => downloadFile(link)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white dark:bg-[#4B5563] rounded-lg hover:bg-gray-800 transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={() => handleDiscussClick(paper)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white dark:bg-[#4B5563] rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FolderKanban className="w-4 h-4" />
          View
        </button>

        <button
          className="p-2 text-black dark:text-white hover:bg-gray-100 rounded-full transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

