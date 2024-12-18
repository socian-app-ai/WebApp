import { useEffect } from "react";
import PostComponent from "../../../components/postBox/PostComponent";
import { useAuthContext } from "../../../context/AuthContext";
import { useSetInfoBarState } from "../../../state_management/zustand/useInfoBar";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import axiosInstance from "../../../config/users/axios.instance";
import { useState } from "react";
import PostDiv from "../../society/post/PostDiv";
import { routesForApi } from "../../../utils/routes/routesForLinks";

import { FaCamera, FaImage, FaEdit, FaMapMarkerAlt, FaSmile } from "react-icons/fa";
import { ChevronDown } from "lucide-react";


export default function StudentDashboard() {
  const { authUser } = useAuthContext();
  const { width } = useWindowDimensions();

  const filters = [
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
    <div className="min-h-screen pt-4 px-2 ">
      {/* <p className="p-10 m-10 font-extrabold text-4xl">CREATE UI FIRST</p> */}
      <div className="fixed bg-[#dcdada] dark:bg-[#171718] w-full p-2">
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



      <div className="mt-10 flex flex-col justify-center items-center w-full lg:w-[90%]  ">

        <div className=" w-full md:w-4/5 lg:w-2/3">
          <Navbar />

        </div>

        {posts.length > 0 && (
          <div className="space-y-4 w-full md:w-4/5 lg:w-2/3">
            {posts.map((post) => {
              // console.log("POST-", post)
              return (<PostDiv key={post._id} postInfo={post} society={post.society} />
              )
            })}
          </div>
        )}
      </div>


      {/* <div className="pt-5 pl-5 ">
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
      </div> */}
    </div>
  );
}

const Navbar = () => {
  const [postContent, setPostContent] = useState("");

  const handleChange = (e) => {
    setPostContent(e.target.value);
  };

  const handlePost = () => {
    alert("Post submitted: " + postContent);
    setPostContent("");
  };

  const handleSaveDraft = () => {
    alert("Post saved as draft: " + postContent);
  };

  return (
    <div className="max-w-2xl w-full bg-white  dark:bg-[#1c1c1e] p-4  my-2 rounded-lg shadow-md">
      {/* Profile and Input */}
      <div className="flex items-center border-b border-gray-600 pb-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <input
          type="text"
          placeholder="What's on your mind?"
          value={postContent}
          onChange={handleChange}
          className="w-full dark:bg-[#2c2c2e] dark:text-gray-300 bg-slate-200 rounded-md p-2 outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-4 text-gray-400">
          <FaCamera className="hover:text-white cursor-pointer" title="Add Photo" />
          <FaImage className="hover:text-white cursor-pointer" title="Add Image" />
          <FaEdit className="hover:text-white cursor-pointer" title="Write Post" />
          <FaMapMarkerAlt className="hover:text-white cursor-pointer" title="Add Location" />
          <FaSmile className="hover:text-white cursor-pointer" title="Add Emoji" />
        </div>
        <div>
          <button
            onClick={handleSaveDraft}
            className="text-gray-400 hover:text-white mr-4"
          >
            Draft
          </button>
          <button
            onClick={handlePost}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};





