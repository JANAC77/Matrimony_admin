import { useEffect, useState } from "react";
import { Loader2, Check, X, FileText, User, UserCheck, ShieldAlert } from "lucide-react";



export default function ApprovalsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      setUsers(users.map(u => u._id === userId ? { ...u, verificationStatus: action, isVerified: action === "approved" } : u));
    } catch (err) {
      alert(err.message);
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100">
          <table className="w-full border-collapse text-left text-sm text-slate-700">
            <thead className="bg-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User Account</th>
                <th className="px-6 py-4">Verification Document</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Review Action</th>
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
                    <tr key={user._id} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500">{user.email || user.phone}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <FileText className="h-4 w-4 text-slate-500" />
                          {user.verificationDoc ? (
                            <span className="text-purple-400 font-semibold cursor-pointer underline">View Uploaded ID</span>
                          ) : (
                            <span className="text-slate-500 italic">No Document Uploaded</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${user.verificationStatus === "approved"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : user.verificationStatus === "rejected"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                          {user.verificationStatus || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction(user._id, "approved")}
                            disabled={user.verificationStatus === "approved"}
                            className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(user._id, "rejected")}
                            disabled={user.verificationStatus === "rejected"}
                            className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-red-400 hover:bg-red-500/25 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
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
    </>
  );
}
