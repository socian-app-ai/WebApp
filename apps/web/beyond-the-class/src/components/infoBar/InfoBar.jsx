// import { Link } from "react-router-dom";
// import useWindowDimensions from "../../hooks/useWindowDimensions";
// import { useAuthContext } from "../../context/AuthContext";
// import { useSetInfoBarState } from "../../state_management/zustand/useInfoBar";
// import { useEffect } from "react";

// function InfoBar() {
//   const { infoBarState, setInfoBarState } = useSetInfoBarState();
//   const { width } = useWindowDimensions();
//   const { authUser } = useAuthContext();

//   useEffect(() => {

//     if (width < 1028) {
//       setInfoBarState(false);
//     }

//     if (width > 1028) {
//       setInfoBarState(true);
//     }
//     if (authUser?.super_role === 'super') setInfoBarState(false)
//     // console.log("useEffect");
//   }, [width, setInfoBarState]);

//   if (authUser.role !== "student") return;

//   return (
//     <div
//       className={`${infoBarState ? "right-0" : "-right-[100rem]"
//         }  z-10 w-64 bg-sidebar-pattern bg-bg-var-sidebar dark:bg-bg-var-sidebar-dark dark:text-white h-screen p-4 fixed`}
//     >
//       <nav className="mt-14">
//         <div>
//           <h5 className="mb-1 font-bold">My Connection</h5>
//           <div className="my-2">
//             <div className="flex flex-row">
//               <img src="" className="w-5 h-5 rounded-full mr-3" />
//               <p>Bilal E.</p>
//             </div>

//             <div className="flex flex-row">
//               <img src="" className="w-5 h-5 rounded-full mr-3" />
//               <p>Bilal E.</p>
//             </div>

//             <div className="flex flex-row">
//               <img src="" className="w-5 h-5 rounded-full mr-3" />
//               <p>Bilal E.</p>
//             </div>
//           </div>

//           <div className="w-full flex justify-center">
//             <button
//               className="border rounded-md px-2 py-1"
//               style={{ backgroundColor: "var(--var-btn-primary)" }}
//             >
//               <p style={{ color: "var(--var-text-primary)" }}>show more</p>
//             </button>
//           </div>
//         </div>
//         <div>
//           <div className="py-2 px-1 m-1">
//             {/* Current Gathering */}
//             <h5 className="font-bold mb-1">Current Gathering</h5>
//             {/* 1st */}
//             <div className="border rounded-md mb-1">
//               <h6 className="text-center font-bold text-lg">
//                 Dramatic Society
//               </h6>
//               <p className="text-center font-semibold text-xs">
//                 Invitation for rehearsal
//               </p>

//               <div className="flex flex-row p-2 justify-between">
//                 <div className="text-xs">
//                   <p className="font-semibold">Outside N block</p>
//                   <p>43 people gathering</p>
//                 </div>

//                 <button className="text-xs text-end hover:text-slate-800">
//                   click for details
//                 </button>
//               </div>
//             </div>
//             {/* 2nd */}
//             <div className="border rounded-md mb-1">
//               <h6 className="text-center font-bold text-lg">Other Society</h6>
//               <p className="text-center font-semibold text-xs">
//                 Invitation for rehearsal
//               </p>

//               <div className="flex flex-row p-2 justify-between">
//                 <div className="text-xs">
//                   <p className="font-semibold">Outside N block</p>
//                   <p>43 people gathering</p>
//                 </div>

//                 <button className="text-xs text-end hover:text-slate-800">
//                   click for details
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* Upcoming Gathering */}
//           <div className="py-2 px-1 m-1">
//             <h5 className="font-bold mb-1"> Upcoming Gathering</h5>
//             <div className="border rounded-md mb-1">
//               <h6 className="text-center font-bold text-lg">
//                 Dramatic Society
//               </h6>
//               <p className="text-center font-semibold text-xs">
//                 Invitation for rehearsal
//               </p>

//               <div className="flex flex-row p-2 justify-between">
//                 <div className="text-xs">
//                   <p className="font-semibold">Outside N block</p>
//                   <p>43 people gathering</p>
//                 </div>

//                 <button className="text-xs text-end hover:text-slate-800">
//                   click for details
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="w-full flex justify-center">
//             <button
//               className="border rounded-md px-2 py-1"
//               style={{ backgroundColor: "var(--var-btn-primary)" }}
//             >
//               <p style={{ color: "var(--var-text-primary)" }}>see all</p>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }
// export default InfoBar;








// DO NOT DELETE ABOVE COMMENTS








import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useAuthContext } from "../../context/AuthContext";
import { useSetInfoBarState } from "../../state_management/zustand/useInfoBar";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import axiosInstance from "../../config/users/axios.instance";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { routesForApi } from "../../utils/routes/routesForLinks";

function InfoBar() {
  const { infoBarState, setInfoBarState } = useSetInfoBarState();
  const { width } = useWindowDimensions();
  const { authUser } = useAuthContext();

  useEffect(() => {

    if (width < 1028) {
      setInfoBarState(false);
    }

    if (width >= 1028) {
      setInfoBarState(true);
    }
    if (authUser?.super_role === 'super') setInfoBarState(false)
    // console.log("useEffect");
  }, [width, setInfoBarState]);

  if (authUser.role !== "student") return;

  return (
    <div
      className={`${infoBarState ? "right-0" : "-right-[100rem]"
        }  z-10 w-64 flex flex-col justify-center dark:text-white h-screen p-4 fixed`}
    >
      <div className="h-[80%] space-y-2 mt-11">
        <Trending />
        <ConnectionsList />
      </div>

    </div>
  );
}
export default InfoBar;




























const Trending = () => {

  const [topSocities, setTopSocieties] = useState(null)

  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get('/api/user/societies-top', {
          params: { id: authUser._id }
        });
        setTopSocieties(res.data); // Adjusted to match the response structure
        // console.log("topSocities", res);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };
    fetchFriends();
  }, [authUser._id]);

  const navigate = useNavigate()

  return (
    <div className="dark:bg-[#1E1F24] dark:border-gray-700  dark:text-white   
    bg-[#F9FAFB] border-gray-300 border text-gray-900

    max-w-xs p-3 rounded-md shadow-md font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Today Societies</h2>
        <button>
          <span className="text-gray-400">
            <ChevronDown />
          </span>
        </button>
      </div>

      {/* Trending List */}
      <div className="space-y-2">
        {topSocities && topSocities.length != 0 && topSocities.map((society) => (
          <Link
            onClick={() => navigate(`${authUser.role}/society/${society._id}`)} key={society._id}
            className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-b-0"
          >
            <div>
              <p className="text-sm font-normal">{society.name}</p>
              <p className="text-xs text-gray-400">{society.postsToday} posts today</p>
            </div>
            <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
              {/* {item.inHour} */}
            </span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-2">
        <a
          href="#"
          className="text-blue-400 text-sm font-medium hover:underline"
        >
          See all
        </a>
      </div>
    </div>
  );
};


const ConnectionsList = () => {
  const [friendsData, setFriendsData] = useState(null);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (authUser._id) {
          const res = await axiosInstance.get(routesForApi.user.connection.stream);
          setFriendsData(res.data.connections); // Adjusted to match the response structure
          console.log("CONNECTIONS", res.data);
        }

      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="dark:bg-[#1E1F24] dark:border-gray-700 dark:text-white
    bg-[#F9FAFB] border-gray-300 border text-gray-900
    max-w-xs p-2 rounded-md shadow-md font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My connections</h2>
        <button>
          <span className="text-gray-400">
            <ChevronDown />
          </span>
        </button>
      </div>

      {/* Friends List */}
      <div className="space-y-4">
        {friendsData && friendsData.length !== 0 ? (
          friendsData.map((friend, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Avatar */}
                <img
                  src={friend?.picture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full"
                />
                {/* Name and Status */}
                <div>
                  <p className="text-sm font-medium">{friend.name}</p>
                  {friend?.status && <p className="text-xs text-gray-400">{friend.status}</p>}
                </div>
              </div>
              {/* Badge */}
              {friend?.badge && (
                <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                  {friend.badge}
                </span>
              )}
            </div>
          ))
        ) : (
          <p>No connections found.</p>
        )}
      </div>
    </div>
  );
};





