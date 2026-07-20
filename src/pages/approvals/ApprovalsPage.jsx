import { useEffect, useState } from "react";
import { Loader2, Check, X, FileText, User, UserCheck, ShieldAlert, Award } from "lucide-react";

export default function ApprovalsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `https://server.familiess.com/media_uploads/${imagePath}`;
  };

  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/approvals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load approvals list");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/approvals/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });

      if (!res.ok) throw new Error("Verification action failed");

      // Remove the user from the pending list and close the modal to move to the next step
      setUsers(users.filter(u => u._id !== userId));
      setViewUser(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manual Approvals</h1>
        <p className="text-sm text-slate-600">Review documents, check photos, and grant verified badges</p>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-slate-700">
            <thead className="bg-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">User Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Email Address</th>
                <th className="px-6 py-4 whitespace-nowrap">Mobile Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Tier Plan</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No pending profile verifications found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const name = user.profile?.name || `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || "No Name";
                  return (
                    <tr 
                      key={user._id} 
                      className="hover:bg-purple-50 cursor-pointer transition-colors bg-white group"
                      onClick={() => setViewUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">{name}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{user.email || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{user.phone || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.premiumMembership?.isPremium ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                            <Award className="h-4 w-4" />
                            {user.premiumMembership?.planType || "Premium"}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Free Tier</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${user.verificationStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : user.verificationStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                          {user.verificationStatus || "pending"}
                        </span>
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
                <h2 className="text-lg font-bold text-slate-900">User Details & Verification</h2>
                <p className="text-xs text-slate-500">{viewUser.uid}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${viewUser.verificationStatus === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : viewUser.verificationStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                  }`}>
                  STATUS: {viewUser.verificationStatus || "pending"}
                </span>
                <button
                  onClick={() => setViewUser(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 flex-1">
              {/* Profile Header */}
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
                    {viewUser.profile?.location && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.location}</span>}
                    {viewUser.profile?.profession && <span className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-700">{viewUser.profile.profession}</span>}
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                {/* Basic Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Basic & Contact Info</h3>
                    <div className="space-y-3 text-sm text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <p><span className="font-semibold text-slate-900">DOB:</span> {viewUser.profile?.dob ? new Date(viewUser.profile.dob).toLocaleDateString() : "N/A"}</p>
                      <p><span className="font-semibold text-slate-900">Marital Status:</span> {viewUser.profile?.maritalStatus || "N/A"}</p>
                      <p><span className="font-semibold text-slate-900">Phone:</span> {viewUser.phone || "N/A"}</p>
                      <p><span className="font-semibold text-slate-900">City:</span> {viewUser.profile?.city || "N/A"}</p>
                      <p><span className="font-semibold text-slate-900">State:</span> {viewUser.profile?.state || "N/A"}</p>
                      <p><span className="font-semibold text-slate-900">Country:</span> {viewUser.profile?.country || "N/A"}</p>
                    </div>
                  </div>

                  {viewUser.premiumMembership?.isPremium && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-purple-100 pb-2">Premium Membership</h3>
                      <div className="space-y-3 text-sm text-slate-700 bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <p><span className="font-semibold text-purple-900">Active Plan:</span> <span className="font-bold text-purple-700">{viewUser.premiumMembership.planType}</span></p>
                        <p><span className="font-semibold text-purple-900">Valid Until:</span> {viewUser.premiumMembership.expiryDate ? new Date(viewUser.premiumMembership.expiryDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Documents section */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Verification Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* ID Proof */}
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm">
                        <h4 className="font-semibold text-sm mb-3 text-slate-800">ID Proof Document</h4>
                        {viewUser.idProofDoc ? (
                          <a href={getImageUrl(viewUser.idProofDoc)} target="_blank" rel="noreferrer" className="block w-full overflow-hidden rounded-lg border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all">
                            <img src={getImageUrl(viewUser.idProofDoc)} alt="ID Proof" className="w-full h-40 object-cover" />
                            <div className="bg-white py-2 text-center text-xs text-purple-600 font-bold border-t border-slate-200 uppercase tracking-wider">
                              Click to Enlarge
                            </div>
                          </a>
                        ) : (
                          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 text-sm italic">
                            No ID Proof
                          </div>
                        )}
                      </div>

                      {/* Selfie */}
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm">
                        <h4 className="font-semibold text-sm mb-3 text-slate-800">Selfie Document</h4>
                        {viewUser.selfieDoc ? (
                          <a href={getImageUrl(viewUser.selfieDoc)} target="_blank" rel="noreferrer" className="block w-full overflow-hidden rounded-lg border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all">
                            <img src={getImageUrl(viewUser.selfieDoc)} alt="Selfie" className="w-full h-40 object-cover" />
                            <div className="bg-white py-2 text-center text-xs text-purple-600 font-bold border-t border-slate-200 uppercase tracking-wider">
                              Click to Enlarge
                            </div>
                          </a>
                        ) : (
                          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 text-sm italic">
                            No Selfie
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              {viewUser.profile?.photos?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Profile Photos</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {viewUser.profile.photos.map((photo, idx) => (
                      <a key={idx} href={getImageUrl(photo)} target="_blank" rel="noreferrer" className="block flex-shrink-0 h-48 w-48 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-purple-400 hover:shadow-md transition-all">
                        <img src={getImageUrl(photo)} alt={`Photo ${idx+1}`} className="h-full w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end gap-4 bg-white sticky bottom-0 z-10 pb-4">
                <button
                  onClick={() => handleAction(viewUser._id, "rejected")}
                  disabled={viewUser.verificationStatus === "rejected" || actionLoading === viewUser._id}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-8 py-4 text-sm font-bold text-red-600 border border-red-200 shadow-sm hover:bg-red-100 disabled:opacity-50 transition-colors min-w-[200px]"
                >
                  {actionLoading === viewUser._id ? (
                     <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><X className="h-5 w-5" /> Reject Profile</>
                  )}
                </button>
                <button
                  onClick={() => handleAction(viewUser._id, "approved")}
                  disabled={viewUser.verificationStatus === "approved" || actionLoading === viewUser._id}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors min-w-[200px]"
                >
                  {actionLoading === viewUser._id ? (
                     <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><UserCheck className="h-5 w-5" /> Approve Profile</>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
