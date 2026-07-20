import { useEffect, useState } from "react";
import {
  Check,
  X,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Loader2,
  Award,
  Filter
} from "lucide-react";



export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterPremium, setFilterPremium] = useState("all"); // all, premium, free
  const [activeTab, setActiveTab] = useState("users"); // users, admins
  const [viewUser, setViewUser] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `https://server.familiess.com/media_uploads/${imagePath}`;
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load users list");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleVerification = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update verification status");
      }

      setUsers(users.map(u => u._id === userId ? { ...u, isVerified: !currentStatus } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user and all their chats/interests? This cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by role tab
    const isTabMatch = activeTab === "admins" ? user.role === "admin" : user.role !== "admin";
    if (!isTabMatch) return false;

    const name = user.profile?.name || `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || "No Name";
    const email = user.email || "";
    const phone = user.phone || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);

    const isPremium = user.premiumMembership?.isPremium || false;
    const matchesFilter = filterPremium === "all" ||
      (filterPremium === "premium" && isPremium) ||
      (filterPremium === "free" && !isPremium);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Accounts</h1>
        <p className="text-sm text-slate-600">View, search, verify, and delete user profiles</p>
      </div>

      {/* Tab Selection */}
      <div className="flex border-b border-slate-300 mb-6 gap-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === "users"
            ? "border-purple-500 text-purple-550 font-bold text-purple-500"
            : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
        >
          Registered Users ({users.filter(u => u.role !== "admin").length})
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === "admins"
            ? "border-purple-500 text-purple-550 font-bold text-purple-500"
            : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
        >
          Administrators ({users.filter(u => u.role === "admin").length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-slate-500" />
          <select
            value={filterPremium}
            onChange={(e) => setFilterPremium(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-200/70 px-4 py-2.5 text-sm text-slate-700 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="premium">Premium Members Only</option>
            <option value="free">Free Users Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <span className="text-slate-600 text-sm font-medium">Loading user accounts...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400 text-sm">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100">
          <table className="w-full border-collapse text-left text-sm text-slate-700">
            <thead className="bg-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Name / ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Gender & Age</th>
                <th className="px-6 py-4 whitespace-nowrap">Mobile Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Tier Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Verification</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No user records match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const name = user.profile?.name || `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || "No Profile Set";
                  const isPremium = user.premiumMembership?.isPremium || false;
                  return (
                    <tr key={user._id} className="hover:bg-purple-50 cursor-pointer transition-colors group" onClick={() => setViewUser(user)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col font-medium text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.email || user.phone}</div>
                        {user.role === "admin" && (
                          <span className="mt-1 inline-flex items-center rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-700">{user.profile?.gender || "—"}</span>
                        {user.profile?.age && (
                          <span className="text-slate-500">, {user.profile.age} yrs</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isPremium ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                            <Award className="h-4 w-4" />
                            {user.premiumMembership?.planType || "Premium"}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Free Tier</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVerification(user._id, user.isVerified); }}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition-all duration-200 ${user.isVerified
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white text-slate-600 border-slate-300 hover:text-slate-800"
                            }`}
                        >
                          {user.isVerified ? (
                            <>
                              <Check className="h-3 w-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3" />
                              Unverified
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleVerification(user._id, user.isVerified); }}
                            title={user.isVerified ? "Revoke Verification" : "Verify User"}
                            className={`p-1.5 rounded-lg border text-slate-600 hover:text-white transition-all ${user.isVerified ? "border-slate-300 hover:bg-slate-200" : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400"
                              }`}
                          >
                            {user.isVerified ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteUser(user._id); }}
                            title="Delete User"
                            className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Details Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewUser(null)} />
          <div className="relative w-[95vw] max-w-7xl h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-xl flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-8 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">User Details</h2>
                <p className="text-xs text-slate-500">{viewUser.uid}</p>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-slate-100 pb-8">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-slate-100 shadow-sm bg-slate-200">
                    {viewUser.profile?.photos?.[0] ? (
                      <img src={getImageUrl(viewUser.profile.photos[0])} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500 text-5xl font-bold">
                        {(viewUser.profile?.name || viewUser.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{viewUser.profile?.name || "N/A"}</h3>
                  <p className="text-slate-500 text-sm mb-4">{viewUser.uid} • {viewUser.profile?.gender || "N/A"} • {viewUser.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm">
                    {viewUser.profile?.age && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.age} yrs</span>}
                    {viewUser.profile?.height && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.height}</span>}
                    {viewUser.profile?.location && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.location}</span>}
                    {viewUser.profile?.profession && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.profession}</span>}
                  </div>
                  {viewUser.profile?.bio && (
                    <p className="mt-4 text-sm text-slate-600 max-w-2xl">{viewUser.profile.bio}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Basic & Contact Info</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><span className="font-semibold">DOB:</span> {viewUser.profile?.dob ? new Date(viewUser.profile.dob).toLocaleDateString() : "N/A"}</p>
                      <p><span className="font-semibold">Marital Status:</span> {viewUser.profile?.maritalStatus || "N/A"}</p>
                      <p><span className="font-semibold">Phone:</span> {viewUser.phone || "N/A"}</p>
                      <p><span className="font-semibold">City:</span> {viewUser.profile?.city || "N/A"}</p>
                      <p><span className="font-semibold">State:</span> {viewUser.profile?.state || "N/A"}</p>
                      <p><span className="font-semibold">Country:</span> {viewUser.profile?.country || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Religion & Community</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><span className="font-semibold">Religion:</span> {viewUser.profile?.religion || "N/A"}</p>
                      <p><span className="font-semibold">Caste:</span> {viewUser.profile?.caste || "N/A"}</p>
                      <p><span className="font-semibold">Community:</span> {viewUser.profile?.community || "N/A"}</p>
                      <p><span className="font-semibold">Sub Community:</span> {viewUser.profile?.subCommunity || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Education & Career</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><span className="font-semibold">Education:</span> {viewUser.profile?.education || "N/A"}</p>
                      <p><span className="font-semibold">College:</span> {viewUser.profile?.college || "N/A"}</p>
                      <p><span className="font-semibold">Profession:</span> {viewUser.profile?.profession || "N/A"}</p>
                      <p><span className="font-semibold">Work Role:</span> {viewUser.profile?.workRole || "N/A"}</p>
                      <p><span className="font-semibold">Company:</span> {viewUser.profile?.companyName || "N/A"}</p>
                      <p><span className="font-semibold">Income:</span> {viewUser.profile?.income || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Family & Lifestyle</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><span className="font-semibold">Diet:</span> {viewUser.profile?.diet || "N/A"}</p>
                      <p><span className="font-semibold">Family Status:</span> {viewUser.profile?.familyFinancialStatus || "N/A"}</p>
                      <p><span className="font-semibold">Father Status:</span> {viewUser.profile?.fatherStatus || "N/A"}</p>
                      <p><span className="font-semibold">Mother Status:</span> {viewUser.profile?.motherStatus || "N/A"}</p>
                      <p><span className="font-semibold">Siblings:</span> {viewUser.profile?.brothersCount || "0"} Brothers, {viewUser.profile?.sistersCount || "0"} Sisters</p>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Partner Preferences</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><span className="font-semibold">Age Range:</span> {viewUser.preferences?.ageRange?.[0] || "Any"} - {viewUser.preferences?.ageRange?.[1] || "Any"}</p>
                      <p><span className="font-semibold">Height Range:</span> {viewUser.preferences?.heightRange?.[0] || "Any"} - {viewUser.preferences?.heightRange?.[1] || "Any"}</p>
                      <p><span className="font-semibold">Marital Status:</span> {Array.isArray(viewUser.preferences?.maritalStatus) ? viewUser.preferences.maritalStatus.join(", ") : viewUser.preferences?.maritalStatus || "Any"}</p>
                      <p><span className="font-semibold">Religion:</span> {Array.isArray(viewUser.preferences?.religion) ? viewUser.preferences.religion.join(", ") : viewUser.preferences?.religion || "Any"}</p>
                      <p><span className="font-semibold">Caste:</span> {Array.isArray(viewUser.preferences?.caste) ? viewUser.preferences.caste.join(", ") : viewUser.preferences?.caste || "Any"}</p>
                      <p><span className="font-semibold">Mother Tongue:</span> {Array.isArray(viewUser.preferences?.motherTongue) ? viewUser.preferences.motherTongue.join(", ") : viewUser.preferences?.motherTongue || "Any"}</p>
                      <p><span className="font-semibold">Education:</span> {Array.isArray(viewUser.preferences?.education) ? viewUser.preferences.education.join(", ") : viewUser.preferences?.education || "Any"}</p>
                      <p><span className="font-semibold">Income:</span> {Array.isArray(viewUser.preferences?.income) ? viewUser.preferences.income.join(", ") : viewUser.preferences?.income || "Any"}</p>
                      <p><span className="font-semibold">Location:</span> {Array.isArray(viewUser.preferences?.location) ? viewUser.preferences.location.join(", ") : viewUser.preferences?.location || "Any"}</p>
                      <p><span className="font-semibold">Diet:</span> {Array.isArray(viewUser.preferences?.diet) ? viewUser.preferences.diet.join(", ") : viewUser.preferences?.diet || "Any"}</p>
                    </div>
                  </div>

                  {viewUser.premiumMembership?.isPremium && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-purple-100 pb-2">Premium Membership</h3>
                      <div className="space-y-3 text-sm text-slate-700 bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p><span className="font-semibold text-purple-900">Active Plan:</span> <span className="font-bold text-purple-700">{viewUser.premiumMembership.planType}</span></p>
                        <p><span className="font-semibold text-purple-900">Valid Until:</span> {viewUser.premiumMembership.expiryDate ? new Date(viewUser.premiumMembership.expiryDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
