import { useEffect, useState } from "react";
import {
  Users,
  Heart,
  DollarSign,
  ShieldAlert,
  Loader2,
  TrendingUp,
  Award
} from "lucide-react";



export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard metrics");
      }

      const data = await res.json();
      setStats(data.stats);
      setTiers(data.tierDistribution || []);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalTierUsers = tiers.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-600">Real-time statistics and user distribution metrics</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <span className="text-slate-600 text-sm font-medium">Gathering metrics...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400">
          <ShieldAlert className="h-6 w-6 shrink-0" />
          <div>
            <h3 className="font-semibold">Failed to load metrics</h3>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Users */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200/70 border border-slate-200 p-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
                <Users className="h-20 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Total Users</span>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-2 text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</h3>
                <p className="mt-1 text-xs text-slate-500">Registered accounts</p>
              </div>
            </div>

            {/* Card 2: Total Matches */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200/70 border border-slate-200 p-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
                <Heart className="h-20 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Mutual Matches</span>
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-2 text-purple-400">
                  <Heart className="h-5 w-5 fill-purple-500/20" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-slate-900">{stats?.totalMatches || 0}</h3>
                <p className="mt-1 text-xs text-slate-500">Accepted interest connections</p>
              </div>
            </div>

            {/* Card 3: Payments Revenue */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200/70 border border-slate-200 p-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
                <DollarSign className="h-20 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Payments Revenue</span>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-slate-900">
                  ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString("en-IN") : "0"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Successful subscriptions revenue</p>
              </div>
            </div>

            {/* Card 4: Active Subscriptions */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200/70 border border-slate-200 p-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
                <Award className="h-20 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Active Subscriptions</span>
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-2 text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-slate-900">{stats?.activeSubscribers || 0}</h3>
                <p className="mt-1 text-xs text-slate-500">Premium members</p>
              </div>
            </div>
          </div>

          {/* Custom Premium Chart & breakdown */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Chart container */}
            <div className="rounded-2xl bg-slate-200 border border-slate-200 p-6 md:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">User Tier Distribution</h3>
                  <p className="text-xs text-slate-600">Comparison of users registered across subscription tiers</p>
                </div>
                <TrendingUp className="h-5 w-5 text-slate-500" />
              </div>

              {/* SVG/CSS Chart */}
              <div className="space-y-4">
                {tiers.map((tier) => {
                  const percentage = Math.round((tier.count / totalTierUsers) * 100);
                  return (
                    <div key={tier.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{tier.name}</span>
                        <span className="text-slate-600">
                          {tier.count} {tier.count === 1 ? "user" : "users"} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3.5 w-full rounded-full bg-slate-50 overflow-hidden border border-slate-200">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${tier.name === "Free"
                            ? "bg-gradient-to-r from-zinc-600 to-zinc-400"
                            : tier.name.includes("Gold")
                              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                              : tier.name.includes("Diamond")
                                ? "bg-gradient-to-r from-blue-500 to-indigo-400"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600"
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Card info */}
            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-purple-500/10 to-indigo-500/5 border border-purple-500/20 p-6">
              <div>
                <h3 className="text-lg font-bold text-purple-400">Welcome to Admin Hub</h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  Here you can oversee all core metrics, verify user profiles, setup subscription plans, and review payment logs.
                </p>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  Check the side navigation to browse accounts, change memberships, or manage features.
                </p>
              </div>
              <div className="mt-6 border-t border-purple-500/10 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Database Status</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
