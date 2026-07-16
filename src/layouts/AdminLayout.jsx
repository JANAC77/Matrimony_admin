import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
