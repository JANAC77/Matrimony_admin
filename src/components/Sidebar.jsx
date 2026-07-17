import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BadgePercent,
  LogOut,
  Heart,
  Menu,
  X,
  CheckSquare,
  FileText,
  BarChart3,
  Wallet,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const email = localStorage.getItem("adminEmail");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      setAdminEmail(email || "admin@example.com");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    navigate("/login");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Manage Users", href: "/manage-users", icon: Users },
    { name: "Pending Approvals", href: "/approvals", icon: CheckSquare },
    { name: "Subscription Plans", href: "/subscriptions", icon: CreditCard },
    { name: "Active Subscriptions", href: "/active-subscriptions", icon: BadgePercent },
    { name: "Payments", href: "/payments", icon: Wallet },
    // { name: "Content Manager", href: "/content", icon: FileText },
    { name: "Revenue & Coupons", href: "/revenue", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 text-slate-900 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-wider bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Matrimony Admin
          </span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-300 bg-slate-50 text-slate-800 transition-transform duration-300 lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo / Header */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-200 bg-white/50 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-slate-900 uppercase">
              Matrimony
            </span>
            <span className="text-xs font-medium text-purple-500">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent"
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-purple-400" : "text-slate-500 group-hover:text-zinc-300"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Admin User Footer info */}
        <div className="border-t border-slate-200 p-4 bg-white/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-700 truncate">
                {adminEmail}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                System Administrator
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-purple-400 hover:bg-purple-500/5 border border-transparent hover:border-purple-500/10 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
