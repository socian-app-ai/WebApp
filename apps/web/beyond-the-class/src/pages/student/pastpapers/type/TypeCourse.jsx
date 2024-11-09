import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../config/users/axios.instance";
import { useNavigate } from "react-router-dom";
import CustomAccordianPastPaper from "../../../../components/MaterialUI/CustomAccordianPastPaper";

export default function TypeCourse() {
  const { courseType, subjectId } = useParams(); // Get courseType and subjectId from URL params
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
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading data.");
      }
    };
    fetchData();
  }, [courseType, subjectId]);

  const handleDiscussionClick = (item) => {
    navigate(`/student/discussion/${item._id}`, {
      state: {
        years: data, // Passing the entire year data
        subject: subjectName,
        t: item, // Specific item to discuss
      },
    });
  };

  if (error) return <p>{error}</p>;
  if (!data || Object.keys(data).length === 0) return <p>Loading...</p>;

  const renderPaper = (paper) => (
    <div className="w-full flex flex-col">
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {paper.name}
      </p>
      <CustomAccordianPastPaper
        key={paper._id}
        t={paper}
        years={data}
        subject={subjectName}
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {courseType} for Subject {subjectName}
      </h2>
      <div className="space-y-8">
        {Object.keys(data).map((year) => (
          <div key={year} className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">Year: {year}</h3>
            <div className="space-y-2">
              {data[year].map((item, index) => (
                <div key={index}>
                  {renderPaper(item)}

                  {item?.mid && (
                    <div>
                      <h5 className="font-semibold text-sm">
                        Midterm ({item.term})
                      </h5>
                      <ul>
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
                      <ul>
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
                      <ul>
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
