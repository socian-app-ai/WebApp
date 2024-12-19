
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import TeacherCard from "./TeacherCard";
import axiosInstance from "../../../../config/users/axios.instance";
import { useSetInfoBarState } from "../../../../state_management/zustand/useInfoBar";

export default function ReviewPage() {
  const [teachers, setTeachers] = useState([]);
  const [visibleTeachers, setVisibleTeachers] = useState(100);
  const [loading, setLoading] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === true) {
      setInfoBarState(false);
    }
  }, [setInfoBarState, infoBarState]);

  useEffect(() => {
    const fetchTeachersByCampus = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/teacher/teachers-by-campus`
        );
        console.log("Teachers: ", response);
        if (response.data) {
          setTeachers(response.data);
          setFilteredTeachers(response.data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersByCampus();
  }, []);

  const handleLoadMore = () => {
    setVisibleTeachers((prev) => prev + 7);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(query)
    );
    setFilteredTeachers(filtered);
    setVisibleTeachers(100);
  };
  // console.log(teachers && teachers)

  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", changeNavBg);
    return () => {
      window.removeEventListener("scroll", changeNavBg);
    };
  }, []);

  const changeNavBg = () => {
    console.log("hi");
    if (window.scrollY > 10) {
      setBackgroundColor(" bg-[#dbd2d2f5] dark:bg-[#121212f5]");
    } else {
      setBackgroundColor("");
    }
  };

  return (
    <div className="min-h-screen  pt-8 px-4  relative text-black dark:text-white ">
      <div className="container ">
        <div
          className={`scroll w-full  z-[5] p-1 -m-4 fixed   flex flex-col md:flex-row ${backgroundColor}  `}
        >
          <div className="flex w-full relative  ">
            <Search className="absolute top-[0.6rem] bottom-0 left-3" />
            <input
              type="text"
              placeholder="Search Teachers"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                minWidth: "5rem",
                width: "calc(100% -1rem)",
                maxWidth: "30rem",
              }}
              className="border-2 dark:border-none dark:bg-gray-700 w-[95%] rounded-full text-sm pl-10 text-black dark:text-white  py-[0.6rem]  px-10   focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  gap-1 sm:gap-2 lg:min-w-[55rem] lg:gap-2">
              {filteredTeachers.slice(0, visibleTeachers).map((teacher) => (
                <TeacherCard key={teacher.name} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
        {visibleTeachers < teachers.length && (
          <div className="text-center mt-8">
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
