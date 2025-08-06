/* eslint-disable react/prop-types */
import { useEffect } from "react";
import PostComponent from "../../../components/postBox/PostComponent";
import { useAuthContext } from "../../../context/AuthContext";
import { useSetInfoBarState } from "../../../state_management/zustand/useInfoBar";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import axiosInstance from "../../../config/users/axios.instance";
import { useState } from "react";
import PostDiv from "../../society/post/PostDiv";
import { routesForApi } from "../../../utils/routes/routesForLinks";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import SEO from "../../../components/seo/SEO";

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

  const { infoBarState, setInfoBarState } = useSetInfoBarState();

  useEffect(() => {
    if (infoBarState === false && width > 768) {
      setInfoBarState(true);
    }
  }, []);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchPosts = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(routesForApi.posts.campusAll, {
        params: { page, limit: pagination.limit }
      });
      
      const { data: newPosts, pagination: newPagination } = response.data;
      
      if (append) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setPagination(newPagination);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      fetchPosts(pagination.page + 1, true);
    }
  };

  const { lastElementRef } = useInfiniteScroll(
    pagination.hasNextPage,
    loading,
    handleLoadMore
  );

  const updatePostVotes = (postId, voteData) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? {
              ...post,
              voteId: {
                ...post.voteId,
                upVotesCount: voteData.upVotesCount,
                downVotesCount: voteData.downVotesCount,
                userVotes: {
                  ...post.voteId.userVotes,
                  [authUser._id]: voteData.userVote
                }
              }
            }
          : post
      )
    );
  };

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen pt-[0.1rem] sm:pt-1 md:pt-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[0.1rem] sm:pt-1 md:pt-4 ">
      <SEO
        title="Student Dashboard"
        description="Student dashboard for Socian platform. Access course materials, connect with peers, and participate in academic discussions."
        keywords="student dashboard, academic platform, course materials, peer networking, student community"
        pageType="student"
      />
      <div className="fixed bg-[var(--var-bg-primary-color)] dark:bg-[#171718] w-full p-2 z-10">
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

      <div className="mt-12 flex flex-col justify-center items-center w-full lg:w-[90%]">
        {/* <div className="px-2 w-full md:w-4/5 lg:w-2/3">
          <PostBar authUser={authUser} />
        </div> */}

        {posts.length > 0 && (
          <div className="w-full md:w-4/5 lg:w-2/3">
            {posts.map((post, index) => (
              <div
                key={post._id}
                ref={index === posts.length - 1 ? lastElementRef : null}
              >
                <PostDiv 
                  postInfo={post} 
                  society={post.society}
                  onVoteUpdate={updatePostVotes}
                />
              </div>
            ))}
            
            {loading && !initialLoad && (
              <div className="flex justify-center py-6">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Loading more posts...</span>
                </div>
              </div>
            )}
            
            {!pagination.hasNextPage && posts.length > 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">You've reached the end of the posts</p>
              </div>
            )}
          </div>
        )}

        {!initialLoad && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const PostBar = ({ authUser }) => {
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
      <div className="flex flex-col items-start border-b border-gray-600 pb-3">
        <div className="flex flex-row">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h6>{authUser.name}</h6>
            <p className="text-balance">public</p>
          </div>
        </div>
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





