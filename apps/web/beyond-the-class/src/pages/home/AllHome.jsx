import { useAuthContext } from '../../context/AuthContext'
import StudentDashboard from './student/StudentDashboard';
import AlumniHome from './alumni/AlumniDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import ExternalOrgDashboard from './externalOrgranization/ExternalOrgDashboard';

export default function AllHome() {

    const { authUser } = useAuthContext()

    const renderContent = () => {
        if (authUser) {
            if (authUser.role === 'student') {
                return <StudentDashboard />;
            } else if (authUser.role === 'alumni') {
                return <AlumniHome />;
            } else if (authUser.role === 'teacher') {
                return <TeacherDashboard />;
            } else if (authUser.role === 'external_org') {
                return <ExternalOrgDashboard />;
            }
        }
    };

    return (
        <div>
            {renderContent}
        </div>
    )
}
