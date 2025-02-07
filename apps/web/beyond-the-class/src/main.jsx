import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'



import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout/Layout";
import AddUniversityPage from "./pages/admin/add/AddUniversityPage";
import AddCampusPage from './pages/admin/add/AddCampusPage';
import Login from "./pages/login/Login";
import RoleBasedRoute, { SuperRoleBasedRoute } from "./config/RoleBasedRoute";
import AllHome from "./pages/home/AllHome";
import Unauthorized from "./pages/Unauthorized";
import ReviewPage from './pages/student/reviews/teachers/ReviewPage';
import ProgramNameAndCourses from "./pages/student/pastpapers/ProgramNameAndCourses";
import CourseInfo from "./pages/student/pastpapers/CourseInfo";
import ProtectedLayout from './context/ProtectedLayout.jsx';
import TypeCourse from './pages/student/pastpapers/type/TypeCourse.jsx';
import UploadForm from './pages/admin/upload/UploadForm.jsx';
import OneDiscussion from './pages/student/pastpapers/discussion/OneDiscussion.jsx';
import TeacherReviewPage from './pages/student/reviews/comments/TeacherReviewPage.jsx';
import UsersView from './pages/admin/pages/users/UsersView.jsx';
import CampusView from './pages/admin/pages/campus/CampusView.jsx';
import UniversityView from './pages/admin/pages/university/UniversityView.jsx';
import CreateEvent from './pages/society/mod/CreateEvent.jsx';
import AllSocieties from './pages/society/AllSocieties.jsx';
import Society from './pages/society/Society.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import OTPPage from './pages/otp/OTPPage.jsx';
import UniPosts from './pages/student/universities/UniPosts.jsx';
import CampusesPosts from './pages/student/campuses/CampusesPosts.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Feedback from './pages/teacher/feedback/Feedback.jsx';
import AddDepartmentAndSubjects from './pages/admin/add/edit/AddDepartmentAndSubjects.jsx';
import AddTeacher from './pages/admin/add/AddTeacher.jsx';
import AddPastPapers from './pages/admin/add/AddPastPapers.jsx';
import { ToastProviders } from './components/toaster/ToastCustom.jsx';
import OAuthRedirectHandler from './pages/auth/oAuthHandler.jsx';
import CompleteYourInfo from './pages/noAccess/CompleteYourInfo.jsx';
import NotUniversityMail from './pages/UnAuthenticatedPages/NotUniversityMail.jsx';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword.jsx';
import PostPage from './pages/society/post/PostPage/PostPage.jsx';
import SuperDashboard from './pages/home/super/SuperDashboard.jsx';
import ModDashboard from './pages/home/mod/ModDashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedLayout />
    ),
    children: [
      {
        path: "otp/:id",
        element: <OTPPage />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: 'oauth',
        element: <OAuthRedirectHandler />
      },
      {
        path: 'notUniversityMail',
        element: <NotUniversityMail />
      },
      // {
      //   element: <RoleBasedRoute allowedRoles={['no_access']} />,
      //   path: 'complete/info',
      //   children: [
      //     { index: true, element: <CompleteYourInfo /> },
      // { path: "complete/info", element: <CompleteYourInfo /> },

      //   ]
      // },

      // !ALL ROLES except SUPER_ROLES
      {
        element: <RoleBasedRoute allowedRoles={['student', 'alumni', 'ext_org', 'teacher']} />,
        children: [
          { index: true, element: <Layout><AllHome /></Layout> },
          { path: 'user/:id', element: <Layout><ProfilePage /></Layout> },
          { path: "complete/info", element: <CompleteYourInfo /> },

        ],
      },
      // !SUPER
      {
        element: <SuperRoleBasedRoute allowedRoles={['super']} />,
        path: 'super',
        children: [
          { index: true, element: <Layout> <SuperDashboard /></Layout> },
          { path: 'user/:id', element: <Layout><ProfilePage /></Layout> },


          { path: 'users', element: <Layout><UsersView /></Layout> },

          { path: 'universities', element: <Layout><UniversityView /></Layout> },
          { path: "university/create", element: <Layout> <AddUniversityPage /></Layout> },
          { path: "university/edit/:universityId", element: <Layout> <AddUniversityPage /></Layout> },


          { path: 'campuses', element: <Layout><CampusView /></Layout> },
          { path: "campus/create", element: <Layout> <AddCampusPage /></Layout> },
          { path: "campus/edit/:campusId", element: <Layout> <AddDepartmentAndSubjects /></Layout> },
          { path: "campus/pastpapers/:campusId", element: <Layout> <AddPastPapers /></Layout> },


          { path: "teachers", element: <Layout> <AddTeacher /></Layout> },


          { path: "pastpapers/upload", element: <Layout> <UploadForm /></Layout> },

        ],
      },

      // !CAMPUS MODERATOR
      {
        element: <SuperRoleBasedRoute allowedRoles={['mod']} />,
        path: 'mod',
        children: [
          { index: true, element: <Layout> <ModDashboard /></Layout> },
          { path: 'user/:id', element: <Layout><ProfilePage /></Layout> },

          { path: 'users', element: <Layout><UsersView /></Layout> },

          // { path: "campus/edit/:campusId", element: <Layout> <AddDepartmentAndSubjects /></Layout> },
          // { path: "campus/pastpapers/:campusId", element: <Layout> <AddPastPapers /></Layout> },


          // { path: "teachers", element: <Layout> <AddTeacher /></Layout> },

          // { path: "pastpapers/upload", element: <Layout> <UploadForm /></Layout> },

        ],
      },



      // !STUDENT
      {
        element: <RoleBasedRoute allowedRoles={['student']} />,
        path: "student",
        children: [
          { path: "all", element: <Layout> <UniPosts /></Layout> },
          { path: "inter", element: <Layout> <CampusesPosts /></Layout> },
          { path: ':societyName/comments/:postId/:postTitle', element: <Layout><PostPage /></Layout> },


          { path: "reviews/teachers", element: <Layout> <ReviewPage /></Layout> },
          { path: "teacher/comments/:id", element: <Layout> <TeacherReviewPage /></Layout> },

          { path: "search-courses", element: <Layout> <ProgramNameAndCourses /></Layout> },
          { path: "course-info/:id", element: <Layout> <CourseInfo /></Layout> },
          { path: ":courseType/:subjectId", element: <Layout> <TypeCourse /></Layout> },
          { path: "discussion/:toBeDisccusedId", element: <Layout> <OneDiscussion /></Layout> },



          { path: "gps", element: <Layout> <CreateEvent /></Layout> },
          { path: "societies", element: <Layout> <AllSocieties /></Layout> },
          { path: "society/:id", element: <Layout> <Society /></Layout> },

        ],
      },
      // !TEACHER
      {
        element: <RoleBasedRoute allowedRoles={['teacher']} />,
        path: "teacher",
        children: [
          { index: true, path: "all", element: <Layout> <UniPosts /></Layout> },
          // { path: "inter", element: <Layout> <CampusesPosts /></Layout> },



          { path: "feedbacks", element: <Layout> <Feedback /></Layout> },
          // { path: "teacher/comments/:id", element: <Layout> <TeacherReviewPage /></Layout> },

          // { path: "search-courses", element: <Layout> <ProgramNameAndCourses /></Layout> },
          // { path: "course-info/:id", element: <Layout> <CourseInfo /></Layout> },
          // { path: ":courseType/:subjectId", element: <Layout> <TypeCourse /></Layout> },
          // { path: "discussion/:toBeDisccusedId", element: <Layout> <OneDiscussion /></Layout> },



          // { path: "gps", element: <Layout> <CreateEvent /></Layout> },
          { path: "societies", element: <Layout> <AllSocieties /></Layout> },
          { path: "society/:id", element: <Layout> <Society /></Layout> },

        ],
      },




      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <Navigate to="/" replace /> },


    ],
  },
]);




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProviders>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthContextProvider>
    </ToastProviders>
  </StrictMode>,
)


