import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/users/axios.instance";

export default function CourseInfo() {
  const { id } = useParams();
  const [pastPapers, setPastPapers] = useState(null); // Hold past papers data

  const [subjectName, setSubjectName] = useState(null);
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/pastpaper/all-pastpapers-in-subject/" + id
        );
        setPastPapers(res.data.pastPapers);
        setSubjectName(res.data.subjectName)
        // console.log(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error loading past papers data.");
      }
    };
    fetch();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!pastPapers) return <p>Loading...</p>; // Placeholder while data loads

  // Click handler for showing specific papers
  const handleItemClick = (category) => {
    navigate(`/student/${category}/${id}`); // Navigate to specific category page with subjectId
  };

  return (
    <div className="min-h-screen w-full pt-8 px-2">
      <p className="font-bold">{subjectName}</p>
      {pastPapers.map((paper, index) => (
        <div key={index} className="mb-4">
          <h3>{paper[index].year}</h3>
          <div className="grid grid-cols-4 gap-4">
            <PaperItem
              title="Assignments"
              count={paper[index].assignments?.length ?? 0}
              onClick={() => handleItemClick("assignments")}
            />

            <PaperItem
              title="Quizzes"
              count={paper[index].quizzes?.length ?? 0}
              onClick={() => handleItemClick("quizzes")}
            />
            <PaperItem
              title={paper[index].type === "MIDTERM" ? "Midterms" : "Sessional"}
              count={paper[index].fall?.mid?.theory?.length ?? 0}
              onClick={() =>
                handleItemClick(
                  paper[index].type === "MIDTERM" ? "midterms" : "sessional"
                )
              }
            />
            <PaperItem
              title="Finals"
              count={paper[index].fall?.final?.theory?.length ?? 0}
              onClick={() => handleItemClick("finals")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaperItem({ title, count, onClick }) {
  return (
    <div
      className="border-2 h-32 cursor-pointer flex items-center justify-center"
      onClick={onClick}
    >
      {title}: {count}
    </div>
  );
}
