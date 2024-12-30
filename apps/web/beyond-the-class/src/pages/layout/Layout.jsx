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
          className="fixed md:hidden dark:bg-[#121212] bg-slate-50 opacity-[0.6] w-full z-[3] h-svh"
        ></div>
      )}
      <Navbar />

      {infoBarState && <InfoBar />}
      <div
        // dark:bg-gradient-to-br dark:from-blue-200 dark:to-blue-900 bg-gradient-to-br from-blue-200 to-blue-100
        className={`flex-1 pt-10   ${sideBarState && width > 768 ? "ml-60" : ""}
                ${infoBarState && width > 768 ? " mr-64" : ""}
              `}
      >
        {children}
      </div>
    </div >
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
