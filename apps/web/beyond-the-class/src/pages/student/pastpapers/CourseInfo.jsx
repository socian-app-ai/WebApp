// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../../config/users/axios.instance";
// import { ArrowBack } from "@mui/icons-material";

// export default function CourseInfo() {
//   const { id } = useParams();
//   const [pastPapers, setPastPapers] = useState(null); // Hold past papers data

//   const [subjectName, setSubjectName] = useState(null);
//   const [error, setError] = useState(null); // Track errors
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await axiosInstance.get(
//           "/api/pastpaper/all-pastpapers-in-subject/" + id
//         );
//         setPastPapers(res.data.pastPapers);
//         setSubjectName(res.data.subjectName)
//         console.log(res.data);
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setError("Error loading past papers data.");
//       }
//     };
//     fetch();
//   }, [id]);

//   if (error) return <p>{error}</p>;
//   if (!pastPapers) return <p>Loading...</p>; // Placeholder while data loads

//   // Click handler for showing specific papers
//   const handleItemClick = (category) => {
//     navigate(`/student/${category}/${id}`); // Navigate to specific category page with subjectId
//   };

//   return (
//     <div className="min-h-screen w-full pt-8 px-2">
//       <div className="flex items-center">
//         <ArrowBack onClick={() => { navigate(-1) }} />
//         <h6 className="text-2xl font-bold p-2 text-gray-800 dark:text-gray-200">{subjectName}</h6>

//       </div>
//       {pastPapers.map((paper, index) => (
//         <div key={paper._id} className="mb-4">
//           <h3>{paper.year}</h3>
//           <div className="grid grid-cols-4 gap-4">
//             <PaperItem
//               title="Assignments"
//               count={paper.assignments?.length ?? 0}
//               onClick={() => handleItemClick("assignments")}
//             />

//             <PaperItem
//               title="Quizzes"
//               count={paper.quizzes?.length ?? 0}
//               onClick={() => handleItemClick("quizzes")}
//             />
//             <PaperItem
//               title={paper.type === "MIDTERM" ? "Midterms" : "Sessional"}
//               count={paper.fall?.mid?.theory?.length ?? 0}
//               onClick={() =>
//                 handleItemClick(
//                   paper.type === "MIDTERM" ? "midterms" : "sessional"
//                 )
//               }
//             />
//             <PaperItem
//               title="Finals"
//               count={paper.fall?.final?.theory?.length ?? 0}
//               onClick={() => handleItemClick("finals")}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function PaperItem({ title, count, onClick }) {
//   return (
//     <div
//       className="border-2 h-32 cursor-pointer flex items-center justify-center"
//       onClick={onClick}
//     >
//       {title}: {count}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/users/axios.instance";
import { ArrowBack } from "@mui/icons-material";
import { useSetInfoBarState } from "../../../state_management/zustand/useInfoBar";

export default function CourseInfo() {
  const { id } = useParams();
  const [pastPapers, setPastPapers] = useState(null); // Hold past papers data

  const [subjectName, setSubjectName] = useState(null);
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();
  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === true) {
      setInfoBarState(false);
    }
  }, [setInfoBarState, infoBarState]);


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/pastpaper/all-pastpapers-in-subject/" + id
        );
        setPastPapers(res.data.pastPapers);
        setSubjectName(res.data.subjectName);
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
    <div className="min-h-screen w-full pt-8 px-4 sm:px-6 md:px-8">
      <div className="flex items-center mb-6">
        <ArrowBack onClick={() => navigate(-1)} className="cursor-pointer mr-2" />
        <h6 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
          {subjectName}
        </h6>
      </div>
      {pastPapers.map((paper, index) => (
        <div key={paper._id} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{paper.year}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <PaperItem
              title="Assignments"
              count={paper.assignments?.length ?? 0}
              onClick={() => handleItemClick("assignments")}
            />
            <PaperItem
              title="Quizzes"
              count={paper.quizzes?.length ?? 0}
              onClick={() => handleItemClick("quizzes")}
            />
            <PaperItem
              title={paper.type === "MIDTERM" ? "Midterms" : "Sessional"}
              count={paper.fall?.mid?.theory?.length ?? 0}
              onClick={() =>
                handleItemClick(
                  paper.type === "MIDTERM" ? "midterms" : "sessional"
                )
              }
            />
            <PaperItem
              title="Finals"
              count={paper.fall?.final?.theory?.length ?? 0}
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
      className="border-2 h-24 sm:h-28 md:h-32 cursor-pointer flex flex-col items-center justify-center text-center rounded-lg hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <p className="text-sm sm:text-base md:text-lg font-medium">{title}</p>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold">{count}</p>
    </div>
  );
}
