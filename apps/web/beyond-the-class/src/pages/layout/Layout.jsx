import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Nav";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSetSideBarState } from "../../state_management/zustand/useSideBar";
import InfoBar from "../../components/infoBar/InfoBar";
import { useSetInfoBarState } from "../../state_management/zustand/useInfoBar";

const Layout = ({ children }) => {
  const { width } = useWindowDimensions();
  const { sideBarState, setSideBarState } = useSetSideBarState();
  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  return (
    <div className="text-black  placeholder-black dark:placeholder-white dark:text-white">
      <Sidebar />
      {sideBarState && (
        <div
          onClick={() => setSideBarState(false)}
          className="absolute md:hidden bg-[#121212] w-full z-[3] h-svh"
        ></div>
      )}
      <Navbar />

      <InfoBar />
      <div
        className={`flex-1 pt-20 p-4 dark:bg-gradient-to-br dark:from-blue-200 dark:to-blue-900 bg-gradient-to-br from-blue-200 to-blue-100 ${sideBarState && width > 768 ? "ml-64" : ""
          } ${infoBarState && width > 768 ? "mr-64" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};


// const Layout = ({ children }) => {

//     const { width } = useWindowDimensions();
//     const { sideBarState, setSideBarState } = useSetSideBarState();

//     useEffect(() => {
//         if (width > 768) {
//             setSideBarState(true);
//         } else {
//             setSideBarState(false);
//         }
//     }, [width]);

//     return (
//         <div className=" text-black dark:placeholder-white dark:text-white  ">

//             <Sidebar />
//             {sideBarState && <div onClick={() => setSideBarState(false)} className="absolute md:hidden bg-[#121212] w-full z-[3] h-svh">
//             </div>}
//             <Navbar />
//             <div className={`flex-1 pt-20 p-4 ${sideBarState && width > 768 ? "ml-64" : ""}`}>
//                 {children}
//             </div>
//         </div>
//     );
// };

export default Layout;
