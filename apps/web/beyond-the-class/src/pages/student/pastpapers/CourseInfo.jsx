
// import React, { useEffect, useState } from 'react';
// import { useParams,useNavigate } from 'react-router-dom';
// import axiosInstance from '../../../config/users/axios.instance';

// export default function CourseInfo() {
//   const { id } = useParams();
//   const [pastPapers, setPastPapers] = useState(null); // Hold past papers data
//   const [error, setError] = useState(null); // Track errors
//   const naviagte = useNavigate();
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await axiosInstance.get('/api/pastpaper/all-pastpapers-in-subject/' + id);
//         setPastPapers(res.data.pastPapers);
//         console.log(res.data)
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setError("Error loading past papers data.");
//       }
//     };
//     fetch();
//   }, [id]);

//   const handleAssignmentsClick = (paperId) => {
//     naviagte(`/student/assignments/${paperId}`); 
//   };

//   if (error) return <p>{error}</p>;
//   if (!pastPapers) return <p>Loading...</p>; // Placeholder while data loads

//   return (
//     <div className="min-h-screen w-full">
//       {pastPapers.map((paper, index) => (
//         <div key={index} className="mb-4">
//           <h3>{paper[index].year}</h3>
//           <div className="grid grid-cols-4 gap-4">
           
//             <div 
//               className="border-2 h-32 cursor-pointer"
//               onClick={() => handleAssignmentsClick(paper._id)} 
//             >
//               Assignments: {paper.assignments?.length ?? 0}</div>
//             <div className="border-2 h-32">Quizzes: {paper.quizzes?.length ?? 0}</div>
//             <div className="border-2 h-32">{paper.type}: {paper.fall?.mid?.theory?.length ?? 0}</div>
//             <div className="border-2 h-32">Final: {paper.fall?.final?.theory?.length ?? 0}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }













import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/users/axios.instance';

export default function CourseInfo() {
  const { id } = useParams();
  const [pastPapers, setPastPapers] = useState(null); // Hold past papers data
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/api/pastpaper/all-pastpapers-in-subject/' + id);
        setPastPapers(res.data.pastPapers);
        console.log(res.data);
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
  const handleItemClick = ( category) => {
    navigate(`/student/${category}/${id}`); // Navigate to specific category page with subjectId
  };

  return (
    <div className="min-h-screen w-full">
      {pastPapers.map((paper, index) => (
        <div key={index} className="mb-4">
          <h3>{paper[index].year}</h3>
          <div className="grid grid-cols-4 gap-4">
            <div 
              className="border-2 h-32 cursor-pointer"
              onClick={() => handleItemClick('assignments')}
            >
              Assignments: {paper.assignments?.length ?? 0}
            </div>
            <div 
              className="border-2 h-32 cursor-pointer"
              onClick={() => handleItemClick('quizzes')}
            >
              Quizzes: {paper.quizzes?.length ?? 0}
            </div>
            <div 
              className="border-2 h-32 cursor-pointer"
              onClick={() => handleItemClick(paper[index].type === "MIDTERM"? 'midterms': 'sessional')}
            >
              Midterms: {paper.fall?.mid?.theory?.length ?? 0}
            </div>
            <div 
              className="border-2 h-32 cursor-pointer"
              onClick={() => handleItemClick('finals')}
            >
              Finals: {paper.fall?.final?.theory?.length ?? 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
