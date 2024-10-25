import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/home/student/StudentDashboard";
import SuperAdminHome from "./pages/admin/home/SuperAdminHome";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout/Layout";
import AddUniversityPage from "./pages/admin/add/AddUniversityPage";
import AddCampusPage from './pages/admin/add/AddCampusPage';
import Login from "./pages/login/Login";
import { useAuthContext } from "./context/AuthContext";
import RoleBasedRoute, { SuperRoleBasedRoute } from "./config/RoleBasedRoute";
import AllHome from "./pages/home/AllHome";
import Unauthorized from "./pages/Unauthorized";
import ReviewPage from './pages/student/reviews/teachers/ReviewPage';
import ProgramNameAndCourses from "./pages/student/pastpapers/ProgramNameAndCourses";

function App() {
  const { authUser } = useAuthContext()

  return (
    <>
      <Routes>
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />


        {authUser && (
          <>

            <Route element={<RoleBasedRoute allowedRoles={['student', 'alumni', 'external_org', 'teacher']} />}>
              <Route path="/" element={<Layout><AllHome /></Layout>} />
            </Route>


            <Route element={<SuperRoleBasedRoute allowedRoles={['super']} />} >
              {/* <Route path="/administrator-in" element={<USE DIFFERENT LAYOUT HERE><SuperAdminHome /> </Layout>} /> */}
              <Route path="/create-university" element={<Layout><AddUniversityPage /> </Layout>} />
              <Route path="/create-campus" element={<Layout><AddCampusPage /> </Layout>} />
            </Route>


            {/* Routes for Student */}
            <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
              {/* <Route path="/pastpapers" element={<StudentPastPapers />} /> */}
              <Route path="/student/reviews/teachers" element={<Layout><ReviewPage /></Layout>} />
              <Route path="/student/search-pastpapers" element={<Layout><ProgramNameAndCourses /></Layout>} />

            </Route>

            {/* Routes for Alumni */}
            <Route element={<RoleBasedRoute allowedRoles={['alumni']} />}>

            </Route>

            {/* Routes for External Organizations */}
            <Route element={<RoleBasedRoute allowedRoles={['external_org']} />}>

            </Route>

            {/* Routes for Teachers */}
            <Route element={<RoleBasedRoute allowedRoles={['teacher']} />}>

            </Route>


            {/* Default fallback for unauthorized access */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </>
        )}


      </Routes>
      <Toaster />
    </>
  )
}

export default App

