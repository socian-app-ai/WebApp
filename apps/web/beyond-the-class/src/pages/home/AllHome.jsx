import { useAuthContext } from "../../context/AuthContext";
import AlumniHome from "./alumni/AlumniDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import ExternalOrgDashboard from "./externalOrgranization/ExternalOrgDashboard";
import StudentDashboard from "./student/StudentDashboard";
import AddUniversityPage from "../admin/add/AddUniversityPage";

export default function AllHome() {
  const { authUser, isLoading } = useAuthContext();
  // console.log("here3");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {

    if (authUser) {
      if (authUser?.super_role === 'super') {
        return <AddUniversityPage />
      }

      if (authUser.role === "student") {
        return <StudentDashboard />;
      } else if (authUser.role === "alumni") {
        return <AlumniHome />;
      } else if (authUser.role === "teacher") {
        return <TeacherDashboard />;
      } else if (authUser.role === "external_org") {
        return <ExternalOrgDashboard />;
      }
    }
  };

  return <div>{renderContent()}</div>;
}
