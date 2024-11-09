
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axiosInstance from '../../../../config/users/axios.instance';

// export default function TypeCourse() {
//   const { courseType, subjectId } = useParams(); // Get courseType and subjectId from URL params
//   const [data, setData] = useState({});
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axiosInstance.get(`/api/pastpaper/${courseType}/${subjectId}`);
//         setData(res.data);
//         console.log(res.data)
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setError("Error loading data.");
//       }
//     };
//     fetchData();
//   }, [courseType, subjectId]);

//   if (error) return <p>{error}</p>;
//   if (!data || Object.keys(data).length === 0) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen w-full p-6">
//       <h2 className="text-2xl font-semibold mb-4">{courseType} for Subject ID: {subjectId}</h2>
//       <div className="space-y-8">
//         {Object.keys(data).map((year) => (
//           <div key={year} className="border-b pb-4">
//             <h3 className="text-xl font-bold mb-2">Year: {year}</h3>
//             <div className="grid grid-cols-1 gap-4">
//               {data[year].map((item, index) => (
//                 <div key={index} className="border p-4 rounded-lg shadow-sm">
//                   <h4 className="text-lg font-medium">{item?.name || "Unnamed Document"}</h4>
//                   <p>{item?.description || "No description available."}</p>
//                   <a 
//                     href={item?.file} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="text-blue-500 underline mt-2"
//                   >
//                     Download
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../config/users/axios.instance';
import Discussions from '../discussion/Discussions';
import { useNavigate } from 'react-router-dom';

export default function TypeCourse() {
  const { courseType, subjectId } = useParams(); // Get courseType and subjectId from URL params
  const [data, setData] = useState({});
  const [subjectName, setSubjectName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/api/pastpaper/${courseType}/${subjectId}`);
        setData(res.data.finalResult);
        setSubjectName(res.data.subjectName)
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
        years: data,  // Passing the entire year data
        subject: subjectName,
        t: item,  // Specific item to discuss
      },
    });
  };

  if (error) return <p>{error}</p>;
  if (!data || Object.keys(data).length === 0) return <p>Loading...</p>;

  return (
    <div className="min-h-screen w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">{courseType} for Subject  {subjectName}</h2>
      <div className="space-y-8">
        {Object.keys(data).map((year) => (
          <div key={year} className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">Year: {year}</h3>
            <div className="space-y-4">
              {data[year].map((item, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium">{item?.name || "Unnamed Document"}</h4>
                  {/* <p>{item?.description || "No description available."}</p> */}
                  <p>{item?.file || "No url available."}</p>
                  {/* Check for term (fall/spring) and display data accordingly */}
                  <button onClick={() => handleDiscussionClick(item)}>
                    Discuss
                  </button>
                  {item?.mid && (
                    <div>
                      <h5 className="font-semibold text-sm">Midterm ({item.term})</h5>
                      <ul>
                        {item.mid.map((doc, docIndex) => (
                          <li key={docIndex}>
                            <a 
                              href={doc?.file} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 underline mt-2"
                            >
                              Download Midterm
                            </a>

                            <button onClick={() => handleDiscussionClick(item)}>
                    Discuss
                  </button>
                          </li>
                        ))}
                        
                      </ul>
                      
                    </div>
                  )}
                  {item?.final && (
                    <div>
                      <h5 className="font-semibold text-sm">Final ({item.term})</h5>
                      <ul>
                        {item.final.map((doc, docIndex) => (
                          <li key={docIndex}>
                            <a 
                              href={doc?.file} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 underline mt-2"
                            >
                              Download Final
                            </a>
                            <button onClick={() => handleDiscussionClick(item)}>
                    Discuss
                  </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item?.sessional && (
                    <div>
                      <h5 className="font-semibold text-sm">Sessional ({item.term})</h5>
                      <ul>
                        {item.sessional.map((doc, docIndex) => (
                          <li key={docIndex}>
                            <a 
                              href={doc?.file} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-500 underline mt-2"
                            >
                              Download Sessional
                            </a>
                            <button onClick={() => handleDiscussionClick(item)}>
                    Discuss
                  </button>
                          </li>
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
