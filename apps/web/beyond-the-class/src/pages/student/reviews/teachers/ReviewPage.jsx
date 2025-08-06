import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import TeacherCard from "./TeacherCard";
import axiosInstance from "../../../../config/users/axios.instance";
import { useSetInfoBarState } from "../../../../state_management/zustand/useInfoBar";
import { routesForApi } from "../../../../utils/routes/routesForLinks";
import useSearchStore from "../../../../state_management/zustand/searchBar";
import SEO from "../../../../components/seo/SEO";

export default function ReviewPage() {
  const [teachers, setTeachers] = useState([]);
  const [visibleTeachers, setVisibleTeachers] = useState(100);
  const [loading, setLoading] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const { searchQuery, setSearchQuery } = useSearchStore();
  // const [searchQuery, setSearchQuery] = useState("");


  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState) {
      setInfoBarState(false);
    }
  }, [setInfoBarState, infoBarState]);

  useEffect(() => {
    const fetchTeachersByCampus = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          routesForApi.teacher.teacherInCampus
        );
        if (response.data) {
          setTeachers(response.data);
          setFilteredTeachers(response.data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersByCampus();
  }, []);

  const handleLoadMore = () => {
    setVisibleTeachers((prev) => prev + 7);
  };

  // const handleSearch = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchQuery(query);
  //   const filtered = teachers.filter((teacher) =>
  //     teacher.name.toLowerCase().includes(query)
  //   );
  //   setFilteredTeachers(filtered);
  //   setVisibleTeachers(100);
  // };

  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", changeNavBg);
    return () => {
      window.removeEventListener("scroll", changeNavBg);
    };
  }, []);

  const changeNavBg = () => {
    if (window.scrollY > 10) {
      setBackgroundColor("bg-[#dbd2d2f5] dark:bg-[#121212f5]");
    } else {
      setBackgroundColor("");
    }
  };


  useEffect(() => {
    // Apply search filtering based on global searchQuery
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeachers(filtered);
    setVisibleTeachers(100);
  }, [searchQuery, teachers]);


  return (
    <div className="min-h-screen pt-1 px-4 md:px-6 relative text-black dark:text-white">
      <SEO
        title="Teacher Reviews"
        description="Read and write teacher reviews on Socian. Share your academic experiences and help other students make informed decisions."
        keywords="teacher reviews, academic feedback, professor ratings, student experiences, course evaluations"
        pageType="reviews"
      />
      <div className="container">
        {/* Search Bar */}
        <div
          className={`fixed top-10 left-0 w-full z-10 px-4 py-3 ${backgroundColor} shadow-md`}
        >
          <div className="md:hidden flex w-full relative">
            <Search className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Teachers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 dark:border-none dark:bg-gray-700 w-full rounded-full text-sm pl-12 pr-4 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teachers List */}
        <div className="pt-20 md:pt-10">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeachers.slice(0, visibleTeachers).map((teacher) => (
                <TeacherCard key={teacher.name} teacher={teacher} />
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleTeachers < teachers.length && (
          <div className="text-center mt-8">
            <button
              className="bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-800 transition"
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
