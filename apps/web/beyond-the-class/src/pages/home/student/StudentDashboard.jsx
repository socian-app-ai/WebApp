import { useEffect } from "react";
import PostComponent from "../../../components/postBox/PostComponent";
import { useAuthContext } from "../../../context/AuthContext";
import { useSetInfoBarState } from "../../../state_management/zustand/useInfoBar";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import axiosInstance from "../../../config/users/axios.instance";
import { useState } from "react";
import PostDiv from "../../society/post/PostDiv";
import { routesForApi } from "../../../utils/routes/routesForLinks";

export default function StudentDashboard() {
  const { authUser } = useAuthContext();
  const { width } = useWindowDimensions();

  const filters = [
    { filterName: "Latest Feed" },
    { filterName: "QnA" },
    { filterName: "Ongoing" },
    { filterName: "Lost & Found" },
    { filterName: "Polls" },
    { filterName: "Latest Feed" },
    { filterName: "QnA" },
    { filterName: "Ongoing" },
    { filterName: "Lost & Found" },
    { filterName: "Polls" },
    { filterName: "Latest Feed" },
    { filterName: "QnA" },
    { filterName: "Ongoing" },
    { filterName: "Lost & Found" },
    { filterName: "Polls" },
  ];
  console.log("here");

  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === false && width > 768) {
      setInfoBarState(true);
    }
  }, [setInfoBarState, infoBarState]);


  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axiosInstance.get(routesForApi.posts.campusAll);
        console.log("POSTS,", response.data)
        setPosts(response.data)
        console.log("hie", response)
      } catch (err) {
        // setError("Error fetching society data.");
        console.error("Error fetching society details:", err);
      } finally {
        // setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen pt-8 px-2">
      {/* <p className="p-10 m-10 font-extrabold text-4xl">CREATE UI FIRST</p> */}
      <div className="sticky w-full pb-4">
        <div className="flex overflow-x-auto space-x-4 flex-row ">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              className="px-2 py-1 border rounded-md whitespace-nowrap"
            >
              {filter.filterName}
            </button>
          ))}
        </div>
      </div>




      {posts.length > 0 && (
        <div className="space-y-4 w-100 md:w-4/5 lg:w-2/3">
          {posts.map((post) => {
            // console.log("POST-", post)
            return (<PostDiv key={post._id} postInfo={post} society={post.society} />
            )
          })}
        </div>
      )}
      {/* <div className="pt-5 pl-5 ">
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
      </div> */}
    </div>
  );
}

// {authUser && authUser.university && authUser.university.campusId ? (
//   typeof authUser.university.campusId === "string" ? (
//     <p>{authUser.university.campusId}</p>
//   ) : (
//     <div>
//       {Array.isArray(authUser.university.campusId) ? (
//         authUser.university.campusId.map((location, index) => (
//           <p key={index}>{location.name}</p>
//         ))
//       ) : (
//         <p>{authUser.university.campusId.name}</p>
//       )}
//     </div>
//   )
// ) : (
//   <p>No campus data available</p>
// )}
// <div className="p-4">
//   {authUser ? (
//     <div>
//       <div className="profile-info mb-4">
//         <img
//           src={authUser.profile.picture}
//           alt="Profile"
//           className="rounded-full w-20 h-20 mb-2"
//         />
//         <h1 className="text-xl font-bold">{authUser.email}</h1>
//         <p>Role: {authUser.role}</p>
//         <p>Bio: {authUser.profile.bio || "No bio available"}</p>
//       </div>

//       <div className="university-info mb-4">
//         <h2 className="text-lg font-bold">University Information</h2>
//         <p>University: {authUser.university.name.name}</p>
//         <p>Location: {authUser.university.name.mainLocationAddress}</p>
//         <img
//           src={authUser.university.name.picture}
//           alt="University Logo"
//           className="w-12 h-12"
//         />
//       </div>

//       <div className="campus-info mb-4">
//         <h3 className="text-lg font-bold">Campus Information</h3>
//         <p>Campus: {authUser.university.campusId.name}</p>
//         <p>Location: {authUser.university.campusId.location}</p>
//         <img
//           src={authUser.university.campusId.picture}
//           alt="Campus Logo"
//           className="w-12 h-12"
//         />

//         {authUser.university.campusId.emailPatterns.studentPatterns
//           .length > 0 && (
//           <div className="email-patterns mt-2">
//             <h4 className="font-bold">Allowed Student Email Patterns:</h4>
//             <ul>
//               {authUser.university.campusId.emailPatterns.studentPatterns.map(
//                 (pattern, index) => (
//                   <li key={index}>{pattern}</li>
//                 )
//               )}
//             </ul>
//           </div>
//         )}
//       </div>

//       <div className="respect-info mb-4">
//         <h3 className="text-lg font-bold">Respect Information</h3>
//         <p>Post Respect: {authUser.profile.respect.postRespect}</p>
//         <p>Comment Respect: {authUser.profile.respect.commentRespect}</p>
//       </div>
//     </div>
//   ) : (
//     <p>No user information available.</p>
//   )}
// </div>
