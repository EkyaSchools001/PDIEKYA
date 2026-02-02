import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "@/app/context/AppContext";
import LandingPage from "@/app/components/LandingPage";
import LoginPage from "@/app/components/LoginPage";
import TeacherDashboard from "@/app/components/TeacherDashboard";
import SchoolLeaderDashboard from "@/app/components/SchoolLeaderDashboard";
import AdminDashboard from "@/app/components/AdminDashboard";
import ForgotPassword from "@/app/components/ForgotPassword";
import LoginRoleSelection from "@/app/components/LoginRoleSelection";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRoleSelection />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/:role/forgot-password" element={<ForgotPassword />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/school-leader" element={<SchoolLeaderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}