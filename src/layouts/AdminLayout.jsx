import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-10 lg:py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}
