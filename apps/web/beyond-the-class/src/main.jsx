import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './context/AuthContext.jsx'
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

const router = createBrowserRouter([
  
  
  {
    path: "/",
    element: (
      <ProtectedLayout />
    ),
    children: [
      
      {
        element: <RoleBasedRoute allowedRoles={['student', 'alumni', 'external_org', 'teacher']} />,
        children: [{ index: true, element: <Layout><AllHome /></Layout> }],
      },
      { path: "login",
        element: <Login /> 
      },
      {
        element: <SuperRoleBasedRoute allowedRoles={['super']} />,
        children: [
          { path: "create-university", element:<Layout> <AddUniversityPage /></Layout> },
          { path: "create-campus", element:<Layout> <AddCampusPage /></Layout> },
        ],
      },
      {
        element: <RoleBasedRoute allowedRoles={['student']} />,
        children: [
          { path: "student/reviews/teachers", element:<Layout> <ReviewPage /></Layout> },
          { path: "student/search-courses", element:<Layout> <ProgramNameAndCourses /></Layout> },
          { path: "student/course-info/:id", element:<Layout> <CourseInfo /></Layout> },
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
          <RouterProvider router={router}/>
          <Toaster />
      </AuthContextProvider>
  </StrictMode>,
)


