import { Routes, Route } from "react-router-dom";
import CompletedServices from "./CompletedServices/CompletedServices";
import AdminManagement from "./AdminManagement/UsersManagement";
import AdminSidebar from "./AdminSidebar";
import AdminLayout from "./AdminManagement/AdminLayout";
import Statistics from "./statistics/Statistics";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <AdminSidebar />
      <AdminLayout>
        <Routes>
          <Route index element={<Statistics />} />
          <Route path="completed-services" element={<CompletedServices />} />
          <Route path="management" element={<AdminManagement />} />
          <Route path="statistics" element={<Statistics />} />
        </Routes>
      </AdminLayout>
    </div>
  );
}