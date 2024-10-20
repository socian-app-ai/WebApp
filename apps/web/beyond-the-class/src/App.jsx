import { Routes, Route } from "react-router-dom";
import StudentHome from "./pages/home/student/StudentHome";
import SuperAdminHome from "./pages/home/admin/SuperAdminHome";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout/Layout";

function App() {


  return (
    <>
      <Routes>


        {/* <Route path="/" element={<StudentHome />} /> */}
        <Route path="/" element={<Layout><SuperAdminHome /> </Layout>} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App