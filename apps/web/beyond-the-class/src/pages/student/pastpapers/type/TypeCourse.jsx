/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MoreVertical, DownloadIcon, FolderKanban, FileText } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../../../../config/users/axios.instance";
import { ArrowBack } from "@mui/icons-material";
import FileInfoDisplay from "../../../../components/pastpapers/FileInfoDisplay";
import PaperStatsCard from "../../../../components/pastpapers/PaperStatsCard";

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
        console.log("Past Papers Data: ", res.data.papers);
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

  // Get all papers for stats
  const allPapers = Object.values(papersByYear).flat();

  return (
    <div className="min-h-screen w-full px-4 pt-8">
      <div className="flex items-center mb-6">
        <ArrowBack onClick={() => navigate(-1)} className="cursor-pointer mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {courseType.charAt(0).toUpperCase() + courseType.slice(1).toLowerCase()} Papers for {subjectName}
        </h2>
      </div>

      {/* Statistics Card */}
      {allPapers.length > 0 && (
        <PaperStatsCard papers={allPapers} className="mb-8" />
      )}

      <div className="space-y-8">
        {sortedYears.map(year => (
          <div key={year} className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {year} {selectedYear === year && "(Selected Year)"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {papersByYear[year].map((paper) => 
                paper.files && paper.files.length > 0 ? (
                  paper.files.map((file, fileIndex) => (
                    <FilePreviewCard
                      key={`${paper._id}-${fileIndex}`}
                      title={paper.name}
                      content={`${paper.term || ''} ${paper.category || ''}`}
                      link={`${import.meta.env.VITE_BACKEND_API_URL}/api/uploads/${file.url}`}
                      paper={paper}
                      file={file}
                      fileNumber={paper.files.length > 1 ? fileIndex + 1 : null}
                      totalFiles={paper.files.length}
                      subject={subjectName}
                    />
                  ))
                ) : (
                  <div key={paper._id} className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 text-center">
                    <p className="text-gray-500">No files available</p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {allPapers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {courseType.toLowerCase()} papers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no {courseType.toLowerCase()} papers available for {subjectName} yet.
          </p>
        </div>
      )}
    </div>
  );
}

const FilePreviewCard = ({
  title,
  content,
  link,
  paper,
  file,
  fileNumber,
  totalFiles,
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
    <div className="bg-white dark:bg-[#2a3c56] rounded-md shadow-md p-3 font-sans">
      {/* File Info Display */}
      <div className="mb-3">
        <FileInfoDisplay
          file={file}
          paper={paper}
          showFileNumber={fileNumber !== null}
          fileNumber={fileNumber}
          totalFiles={totalFiles}
        />
      </div>

      {/* PDF Preview */}
      <div className={`${numPages ? 'p-1' : 'p-3'} bg-gray-50 dark:bg-[#111827] rounded-lg mb-3`}>
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

      {/* Paper Info */}
      <div className="space-y-2 mb-3">
        <h3 className="font-medium dark:text-white text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-sm dark:text-gray-300 text-gray-600 leading-tight">{content}</p>
        <p className="text-sm dark:text-gray-300 text-gray-500">PDF</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-1 justify-between">
        <button
          onClick={() => downloadFile(link)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-900 text-white dark:bg-[#4B5563] rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          <DownloadIcon className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={() => handleDiscussClick(paper)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <FolderKanban className="w-4 h-4" />
          Discuss
        </button>

        <button
          className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

