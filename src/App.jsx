import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/login/LoginPage";
import UsersPage from "./pages/users/UsersPage";
import ManageUsersPage from "./pages/manage-users/ManageUsersPage";
import RevenuePage from "./pages/revenue/RevenuePage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";
import ApprovalsPage from "./pages/approvals/ApprovalsPage";
import ContentManagerPage from "./pages/content/ContentManagerPage";
import ActiveSubscriptionsPage from "./pages/active-subscriptions/ActiveSubscriptionsPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import SettingsPage from "./pages/settings/SettingsPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/content" element={<ContentManagerPage />} />
          <Route path="/active-subscriptions" element={<ActiveSubscriptionsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
