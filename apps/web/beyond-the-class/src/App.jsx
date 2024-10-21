import { Routes, Route } from "react-router-dom";
import StudentHome from "./pages/home/student/StudentHome";
import SuperAdminHome from "./pages/admin/home/SuperAdminHome";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout/Layout";
import AddUniversityPage from "./pages/admin/add/AddUniversityPage";
import AddCampusPage from './pages/admin/add/AddCampusPage';

function App() {


  return (
    <>
      <Routes>


        {/* <Route path="/" element={<StudentHome />} /> */}
        <Route path="/" element={<Layout><SuperAdminHome /> </Layout>} />
        <Route path="/create-university" element={<Layout><AddUniversityPage /> </Layout>} />
        <Route path="/create-campus" element={<Layout><AddCampusPage /> </Layout>} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App