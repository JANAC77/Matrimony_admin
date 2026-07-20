import { useEffect, useState, useRef } from "react";
import {
  Users,
  Search,
  Loader2,
  Send,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ManageUsersPage() {
  const [managedUsers, setManagedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [targetSearch, setTargetSearch] = useState("");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [sending, setSending] = useState(null);
  const [sendResult, setSendResult] = useState({ type: "", text: "" });

  const [viewUser, setViewUser] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `https://server.familiess.com/media_uploads/${imagePath}`;
  };

  const fetchManagedUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/managed-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load managed users");
      }

      const data = await res.json();
      setManagedUsers(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.filter(u => u.role !== "admin"));
      }
    } catch (err) {
      console.error("Failed to load users for dropdown", err);
    }
  };

  useEffect(() => {
    fetchManagedUsers();
    fetchAllUsers();
  }, []);

  const filteredManagedUsers = managedUsers.filter(user => {
    const name = user.profile?.name || `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || "No Name";
    const email = user.email || "";
    const phone = user.phone || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
  });

  const openSendInterestModal = (user) => {
    setSelectedSender(user);
    setSelectedTarget(null);
    setTargetSearch("");
    setSendResult({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const handleSendInterest = async (targetUserId) => {
    if (!targetUserId) return;

    setSending(targetUserId);
    setSendResult({ type: "", text: "" });

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/managed-users/${selectedSender._id}/send-interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send interest");
      }

      setSendResult({ type: "success", text: "Interest sent successfully!" });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      setSendResult({ type: "error", text: err.message });
    } finally {
      setSending(null);
    }
  };

  const filteredTargetUsers = allUsers.filter(u => {
    if (selectedSender && u._id === selectedSender._id) return false;

    // Auto-detect gender and show opposite
    if (selectedSender?.profile?.gender) {
      const senderGender = selectedSender.profile.gender.toLowerCase();
      const targetGender = u.profile?.gender?.toLowerCase();
      if (senderGender === 'male' && targetGender !== 'female') return false;
      if (senderGender === 'female' && targetGender !== 'male') return false;
    }

    if (!targetSearch) return true;

    const name = u.profile?.name || `${u.profile?.firstName || ""} ${u.profile?.lastName || ""}`.trim() || "No Name";
    const identifier = u.email || u.phone || "";

    return name.toLowerCase().includes(targetSearch.toLowerCase()) ||
      identifier.toLowerCase().includes(targetSearch.toLowerCase()) ||
      (u.uid && u.uid.toLowerCase().includes(targetSearch.toLowerCase()));
  }).slice(0, 10); // Limit results

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Users</h1>
          <p className="text-sm text-slate-600">Accounts operated by administration (Managed by Us)</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search managed users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-200/70 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <span className="text-slate-600 text-sm font-medium">Loading managed accounts...</span>
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
                <th className="px-6 py-4 whitespace-nowrap">Mobile Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Email Address</th>
                <th className="px-6 py-4 whitespace-nowrap">Tier Plan</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredManagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No managed users found. Ensure you have users with a "Managed by Us" plan.
                  </td>
                </tr>
              ) : (
                filteredManagedUsers.map((user) => {
                  const name = user.profile?.name || `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || "No Profile Set";
                  return (
                    <tr key={user._id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col font-medium text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.uid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-900">{user.phone || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-600">{user.email || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-600 border border-purple-500/20">
                          {user.premiumMembership?.planType || "Managed Plan"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setViewUser(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition-colors shadow-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openSendInterestModal(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Send Interest
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedSender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Send Interest on Behalf</h2>
                <p className="text-xs text-slate-500">From: {selectedSender.profile?.name || selectedSender.email}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {sendResult.text && (
                <div className={`flex items-start gap-3 rounded-xl p-4 text-sm ${sendResult.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {sendResult.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <p className="font-medium">{sendResult.text}</p>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search target users by name, ID, or email..."
                  value={targetSearch}
                  onChange={(e) => setTargetSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-6">
                {filteredTargetUsers.length > 0 ? (
                  filteredTargetUsers.map(u => (
                    <div key={u._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:border-purple-300 transition-all">
                      <div
                        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setViewUser(u)}
                        title="Click to view full profile details"
                      >
                        <div className="flex items-start gap-6 mb-6">
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-slate-100 shadow-sm bg-slate-200">
                            {u.profile?.photos?.[0] ? (
                              <img src={getImageUrl(u.profile.photos[0])} alt="profile" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-500 text-3xl font-bold">
                                {(u.profile?.name || u.email || "U")[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900">{u.profile?.name || u.email}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-2">{u.uid} • {u.profile?.gender || "N/A"}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {u.profile?.age && <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{u.profile.age} yrs</span>}
                              {u.profile?.height && <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{u.profile.height}</span>}
                              {u.profile?.location && <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{u.profile.location}</span>}
                              {u.profile?.profession && <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{u.profile.profession}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">Basic & Contact Info</h4>
                            <div className="space-y-2 text-sm text-slate-700">
                              <p><span className="font-semibold">Marital Status:</span> {u.profile?.maritalStatus || "N/A"}</p>
                              <p><span className="font-semibold">Religion/Caste:</span> {u.profile?.religion || "N/A"} {u.profile?.caste ? `• ${u.profile.caste}` : ""}</p>
                              <p><span className="font-semibold">Education:</span> {u.profile?.education || "N/A"}</p>
                              <p><span className="font-semibold">Income:</span> {u.profile?.income || "N/A"}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">Family & Lifestyle</h4>
                            <div className="space-y-2 text-sm text-slate-700">
                              <p><span className="font-semibold">Diet:</span> {u.profile?.diet || "N/A"}</p>
                              <p><span className="font-semibold">Family Status:</span> {u.profile?.familyFinancialStatus || "N/A"}</p>
                              <p><span className="font-semibold">Siblings:</span> {u.profile?.brothersCount || "0"} Brothers, {u.profile?.sistersCount || "0"} Sisters</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                        <button
                          onClick={() => handleSendInterest(u._id)}
                          disabled={sending === u._id}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                        >
                          {sending === u._id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Interest to {u.profile?.name || "this user"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900">No users found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your search to find more people.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{viewUser.profile?.name || `${viewUser.profile?.firstName || ""} ${viewUser.profile?.lastName || ""}`.trim() || "N/A"}</h3>
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
                      <p><span className="font-semibold">Age Range:</span> {viewUser.preferences?.minAge || "Any"} - {viewUser.preferences?.maxAge || "Any"}</p>
                      <p><span className="font-semibold">Height Range:</span> {viewUser.preferences?.minHeight || "Any"} - {viewUser.preferences?.maxHeight || "Any"}</p>
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

              {/* Action Button inside Details Modal */}
              {selectedSender && (
                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      handleSendInterest(viewUser._id);
                      setViewUser(null);
                    }}
                    disabled={sending === viewUser._id}
                    className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {sending === viewUser._id ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-5 w-5" /> Send Interest to {viewUser.profile?.name || viewUser.email}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
