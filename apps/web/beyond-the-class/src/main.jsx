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
import AlumniHome from './pages/home/alumni/AlumniDashboard.jsx';
import UsersView from './pages/admin/pages/users/UsersView.jsx';
import CampusView from './pages/admin/pages/campus/CampusView.jsx';
import UniversityView from './pages/admin/pages/university/UniversityView.jsx';
import CreateEvent from './pages/society/mod/CreateEvent.jsx';
import AllSocieties from './pages/society/AllSocieties.jsx';
import Society from './pages/society/Society.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedLayout />
    ),
    children: [

      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "login",
        element: <Login />
      },

      {
        element: <RoleBasedRoute allowedRoles={['student', 'alumni', 'external_org', 'teacher']} />,
        children: [{ index: true, element: <Layout><AllHome /></Layout> }],
      },

      {
        element: <SuperRoleBasedRoute allowedRoles={['super']} />,
        path: 'super',
        children: [
          { index: true, element: <Layout> <AlumniHome /></Layout> },
          { path: 'users', element: <Layout><UsersView /></Layout> },

          { path: 'universities', element: <Layout><UniversityView /></Layout> },
          { path: "university/create", element: <Layout> <AddUniversityPage /></Layout> },
          { path: "university/edit/:universityId", element: <Layout> <AddUniversityPage /></Layout> },


          { path: 'campuses', element: <Layout><CampusView /></Layout> },
          { path: "campus/create", element: <Layout> <AddCampusPage /></Layout> },
          { path: "campus/edit/:campusId", element: <Layout> <AddCampusPage /></Layout> },


          { path: "pastpapers/upload", element: <Layout> <UploadForm /></Layout> },
        ],
      },
      {
        element: <RoleBasedRoute allowedRoles={['student']} />,
        path: "student",
        children: [
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
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthContextProvider>
  </StrictMode>,
)


