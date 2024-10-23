import { Routes, Route, Navigate } from "react-router-dom";
import StudentHome from "./pages/home/student/StudentHome";
import SuperAdminHome from "./pages/admin/home/SuperAdminHome";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout/Layout";
import AddUniversityPage from "./pages/admin/add/AddUniversityPage";
import AddCampusPage from './pages/admin/add/AddCampusPage';
import Login from "./pages/login/Login";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext()

  return (
    <>
      <Routes>


        <Route path="/" element={<StudentHome />} />
        <Route path="/administrator-in" element={<Layout><SuperAdminHome /> </Layout>} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/create-university" element={<Layout><AddUniversityPage /> </Layout>} />
        <Route path="/create-campus" element={<Layout><AddCampusPage /> </Layout>} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App