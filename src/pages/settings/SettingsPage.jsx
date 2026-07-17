import { useState, useEffect } from "react";
import { Lock, Save, AlertCircle, CheckCircle, CreditCard, UserPlus } from "lucide-react";

export default function SettingsPage() {
  const [upiId, setUpiId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminConfirm, setNewAdminConfirm] = useState("");

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingUpi, setSavingUpi] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/settings", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUpiId(data.data.upiId || "");
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleUpdateUpi = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSavingUpi(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ upiId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "UPI ID updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update UPI ID." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error updating UPI ID." });
    } finally {
      setSavingUpi(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and Confirm password do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error changing password." });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newAdminPassword !== newAdminConfirm) {
      setMessage({ type: "error", text: "New admin passwords do not match." });
      return;
    }

    setCreatingAdmin(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/settings/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: newAdminName, 
          email: newAdminEmail, 
          password: newAdminPassword 
        })
      });
      const data = await res.json();
      if (data.success || res.status === 201) {
        setMessage({ type: "success", text: "New admin account created successfully!" });
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminConfirm("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create admin." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error creating new admin." });
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your admin account password and global app settings.
        </p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-medium ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-600 border-red-200' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Payment Settings</h2>
              <p className="text-xs text-slate-500">Configure manual payment options</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateUpi} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID (For manual payments)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@upi"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
                <p className="mt-1 text-xs text-slate-500">This UPI ID will be shown to users when they choose to pay manually via QR/UPI.</p>
              </div>
              <button
                type="submit"
                disabled={savingUpi || loadingSettings}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
              >
                {savingUpi ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
                Save UPI ID
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-500">Update your admin login password</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
              >
                {savingPassword ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Lock className="h-4 w-4" />}
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Create New Admin */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit md:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create New Admin</h2>
              <p className="text-xs text-slate-500">Add an additional administrator to manage the platform</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newAdminConfirm}
                    onChange={(e) => setNewAdminConfirm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  {creatingAdmin ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <UserPlus className="h-4 w-4" />}
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
