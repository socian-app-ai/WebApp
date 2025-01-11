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
  const navigate = useNavigate();


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
      keyVal={paper._id}
      title={paper.name}
      content={""}
      link={paper.file.pdf}
      t={paper}
      years={data}
      subject={subjectName}
    />
  );

  console.log("DATA", data)
  return (
    <div className="min-h-screen w-full px-2 pt-8">
      <ArrowBack onClick={() => navigate(-1)} className="cursor-pointer mr-2" />

      <h2 className="text-2xl font-semibold mb-4">
        {courseType.charAt(0).toUpperCase() +
          courseType.slice(1).toString().toLowerCase()}{" "}
        for Subject {subjectName}
      </h2>
      <div className="space-y-1">
        {Object.keys(data).map((year) => (

          <div key={year} >
            {(data[year]?.length > 0) && <h3 className="text-xl font-bold mb-2  border-b  w-full">Year: {year}</h3>}

            <div className="flex flex-col xs:flex-row flex-wrap" >
              {data[year].map((item, index) => {

                console.log(index, year)
                return (
                  <div key={index} className="flex flex-col xs:flex-row flex-wrap">

                    {item?.quizzes &&
                      (item.quizzes.map((doc) => renderPaper(doc))
                      )}

                    {item?.assignments &&
                      (item.assignments.map((doc) => renderPaper(doc)))}

                    {item?.sessional &&
                      (item.sessional.map((doc) => renderPaper(doc)
                      )
                      )}

                    {item?.mid && (

                      <div className="flex flex-col xs:flex-row flex-wrap">
                        <ul>
                          <h5 className="font-semibold text-sm px-2">
                            Midterm ({item.term}) ({item.type})
                          </h5>
                          {item.mid.map((doc, docIndex) => (
                            <li className="flex flex-col xs:flex-row flex-wrap" key={docIndex}>{renderPaper(doc)}</li>
                          )
                          )}
                        </ul>
                      </div>
                    )}
                    {item?.final && (

                      <div >
                        <h5 className="font-semibold text-sm px-2">
                          Final ({item.term}) ({item.type})
                        </h5>
                        <ul className="flex flex-col xs:flex-row flex-wrap">

                          {item.final.map((doc, docIndex) =>
                            (<li className="flex flex-col xs:flex-row flex-wrap" key={docIndex}>{renderPaper(doc)}</li>)
                          )}
                        </ul>
                      </div>

                    )}
                    {item?.sessional && (
                      <div>
                        <h5 className="font-semibold text-sm">
                          Sessional
                        </h5>
                        <ul >
                          {item.sessional.map((doc, docIndex) => (
                            <li key={docIndex}>{renderPaper(doc)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        ))}
      </div>
    </div >
  );
}

const FilePreviewCard = ({
  keyVal,
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
      key={keyVal}
      className=" m-1 bg-white dark:bg-[#2a3c56] rounded-md shadow-md p-3 font-sans"
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

