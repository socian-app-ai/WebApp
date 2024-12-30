/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import CustomAccordianPastPaper from "../../../../components/MaterialUI/CustomAccordianPastPaper";
import { MoreVertical } from "lucide-react";
import { DownloadIcon } from "lucide-react";

import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../../../../config/users/axios.instance";
import { FolderKanban } from "lucide-react";


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
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
      </div>
    </div>
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
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-10"></div>
      </div>
    </div>
  </div>
);
export default function TypeCourse() {
  const { courseType, subjectId } = useParams();
  const [data, setData] = useState({});
  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/pastpaper/${courseType}/${subjectId}`
        );
        setData(res.data.finalResult);
        setSubjectName(res.data.subjectName);
        // console.log(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading data.");
      }
    };
    fetchData();
  }, [courseType, subjectId]);


  if (error) return <p>{error}</p>;
  if (!data || Object.keys(data).length === 0) return <LoadingAnimation />;

  const renderPaper = (paper) => (
    <FilePreviewCard
      key={paper._id}
      title={paper.name}
      content={""}
      link={paper.file.pdf}
      t={paper}
      years={data}
      subject={subjectName}
    />
  );

  return (
    <div className="min-h-screen w-full px-2 pt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {courseType.charAt(0).toUpperCase() +
          courseType.split(1).toString().toLowerCase()}{" "}
        for Subject {subjectName}
      </h2>
      <div className="space-y-8">
        {Object.keys(data).map((year) => (
          <div key={year} className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">Year: {year}</h3>
            <div className="lg:space-x-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data[year].map((item, index) => (
                <div key={index}>
                  {renderPaper(item)}

                  {item?.mid && (
                    <div className="w-full">
                      <h5 className="font-semibold text-sm">
                        Midterm ({item.term})
                      </h5>
                      <ul className="lg:space-x-1  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {item.mid.map((doc, docIndex) => (
                          <li key={docIndex}>{renderPaper(doc)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item?.final && (
                    <div>
                      <h5 className="font-semibold text-sm">
                        Final ({item.term})
                      </h5>
                      <ul className="lg:space-x-1  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {item.final.map((doc, docIndex) => (
                          <li key={docIndex}>{renderPaper(doc)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item?.sessional && (
                    <div>
                      <h5 className="font-semibold text-sm">
                        Sessional ({item.term})
                      </h5>
                      <ul className="lg:space-x-1  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {item.sessional.map((doc, docIndex) => (
                          <li key={docIndex}>{renderPaper(doc)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FilePreviewCard = ({
  key,
  title = "",
  content = "",
  link = "",
  t,
  years,
  subject,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber] = useState(1);

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

  const navigate = useNavigate();

  const handleDiscussClick = (item) => {
    navigate(`/student/discussion/${item._id}`, {
      state: { years, subject, t },
    });
  };

  return (
    <div
      key={key}
      className="max-w-xs m-1 bg-white dark:bg-[#1F2937] rounded-md shadow-md p-3 font-sans"
    >
      {/* PDF Preview */}
      <div className="bg-gray-50 dark:bg-[#111827] rounded-lg p-4 mb-2">
        <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-2 overflow-hidden">
          {numPages ? (
            <>
              <Document file={link} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={180} />
              </Document>
              <p className="text-sm text-gray-500 mt-2">
                Page 1 of {numPages || "Loading..."}
              </p>
            </>
          ) : (
            <>
              <div className="h-3 my-1 bg-gray-200 dark:bg-[#1F2937] rounded-full w-3/4"></div>
              <div className="h-3 my-1 bg-gray-200 dark:bg-[#1F2937] rounded-full w-1/2"></div>
              <div className="h-3 my-1 bg-gray-200 dark:bg-[#1F2937] rounded-full w-2/3"></div>
            </>
          )}
        </div>
      </div>

      {/* Document Info */}
      <div className="space-y-1">
        <h3 className="font-medium dark:text-white text-gray-900">{title}</h3>
        <p className="text-sm dark:text-white text-gray-500 leading-tight">{content}</p>
        <p className="text-sm dark:text-white text-gray-500">PDF - 5.2 MB</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-1 justify-between mt-4">
        <button
          onClick={() => downloadFile(link)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white dark:bg-[#4B5563] rounded-lg hover:bg-gray-800 transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={() => handleDiscussClick(t)}
          className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white dark:bg-[#4B5563] rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FolderKanban className="w-4 h-4" />
          View
        </button>

        <button
          className="p-2 text-black dark:text-white  hover:bg-gray-100 rounded-full transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};




















// const FilePreviewCard = ({ key, title = "", content = "", link = "" }) => {
//   const downloadFile = (url) => {
//     // Create a temporary anchor tag
//     const anchor = document.createElement("a");
//     anchor.href = url; // Set the file URL
//     anchor.download = url.split("/").pop(); // Optional: Extract filename for the download attribute
//     anchor.style.display = "none";

//     // Append to the body, trigger click, and clean up
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//   };

//   return (
//     <div key={key} className="max-w-xs bg-white rounded-lg shadow-lg p-3 font-sans">
//       {/* Document Preview */}
//       <div className="bg-gray-50 rounded-lg p-4 mb-2">
//         <div className="border border-gray-200 rounded-sm p-2">
//           <div className="w-full space-y-2">
//             <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
//             <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
//             <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
//           </div>
//         </div>
//       </div>

//       {/* Document Info */}
//       <div className="space-y-1">
//         <h3 className="font-medium text-gray-900">{title}</h3>
//         <p className="text-sm text-gray-500 leading-tight">{content}</p>
//         <p className="text-sm text-gray-500">PDF - 5.2 MB</p>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-between mt-4">
//         <button
//           onClick={() => downloadFile(link)} // Trigger download
//           className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
//         >
//           <DownloadIcon className="w-4 h-4" />
//           Download
//         </button>

//         <button
//           className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//           aria-label="More options"
//         >
//           <MoreVertical className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };
