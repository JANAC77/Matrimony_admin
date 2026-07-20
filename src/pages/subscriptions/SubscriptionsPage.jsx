import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Video,
  LifeBuoy,
  Users2,
  Heart
} from "lucide-react";



export default function SubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [matchesPerDay, setMatchesPerDay] = useState("10");
  const [directMessaging, setDirectMessaging] = useState(false);
  const [videoCalling, setVideoCalling] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(false);
  const [managedByUs, setManagedByUs] = useState(false);
  const [viewProfilesPerDay, setViewProfilesPerDay] = useState("10");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Inline edit state
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState("");
  const [inlineSubmitting, setInlineSubmitting] = useState(false);

  const handleInlineSubmit = async (e, plan) => {
    e.preventDefault();
    setInlineSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url = `https://server.familiess.com/api/admin/plans/${plan._id}`;
      const planData = {
        ...plan,
        price: parseFloat(inlinePrice)
      };
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Operation failed");
      }
      setInlineEditingId(null);
      fetchPlans();
    } catch (err) {
      alert(err.message);
    } finally {
      setInlineSubmitting(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load subscription plans");
      }

      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditClick = (plan) => {
    setEditingId(plan._id);
    setName(plan.name);
    setPrice(plan.price.toString());
    setDurationDays(plan.durationDays.toString());
    setMatchesPerDay(plan.matchesPerDay.toString());
    setDirectMessaging(plan.directMessaging);
    setVideoCalling(plan.videoCalling);
    setPrioritySupport(plan.prioritySupport);
    setManagedByUs(plan.managedByUs || false);
    setViewProfilesPerDay(plan.viewProfilesPerDay.toString());
    setIsActive(plan.isActive);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setDurationDays("");
    setMatchesPerDay("10");
    setDirectMessaging(false);
    setVideoCalling(false);
    setPrioritySupport(false);
    setManagedByUs(false);
    setViewProfilesPerDay("10");
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const planData = {
      name,
      price: parseFloat(price),
      durationDays: parseInt(durationDays),
      matchesPerDay: parseInt(matchesPerDay),
      directMessaging,
      videoCalling,
      prioritySupport,
      managedByUs,
      viewProfilesPerDay: parseInt(viewProfilesPerDay),
      isActive,
    };

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingId
        ? `https://server.familiess.com/api/admin/plans/${editingId}`
        : "https://server.familiess.com/api/admin/plans";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Operation failed");
      }

      handleCancel();
      fetchPlans();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePlan = async (id) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/plans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete plan");
      }

      setPlans(plans.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subscription Tiers (INR)</h1>
        <p className="text-sm text-slate-600">Configure client premium billing levels and feature limits</p>
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <span className="text-slate-600 text-sm font-medium">Loading subscription tiers...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400 text-sm">
          {error}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Plans List */}
          <div className="lg:col-span-2 space-y-10">

            {/* Regular Subscription Models */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Active Pricing Models
              </h2>
              {plans.filter(p => p.durationDays > 0).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                  No subscription models configured. Create one using the form.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {plans.filter(p => p.durationDays > 0).map((plan) => (
                    <div
                      key={plan._id}
                      className={`relative rounded-2xl bg-slate-200 border p-6 flex flex-col justify-between transition-all duration-300 hover:border-slate-400 ${plan.isActive ? "border-slate-200" : "border-slate-200 opacity-60"
                        }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-extrabold text-lg text-slate-900">{plan.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${plan.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-300 text-slate-600 border border-slate-400"
                            }`}>
                            {plan.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>

                        {/* Price & Duration */}
                        <div className="mt-4 flex items-baseline gap-1 text-slate-900">
                          <span className="text-3xl font-extrabold">₹{plan.price.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-slate-600 font-medium">/ {plan.durationDays} days</span>
                        </div>

                        {/* Features */}
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <Heart className="h-3.5 w-3.5 text-purple-500" /> Matches:
                            </span>
                            <span className="font-bold text-slate-900">
                              {plan.matchesPerDay >= 9999 ? "Unlimited" : plan.matchesPerDay}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <Users2 className="h-3.5 w-3.5 text-blue-400" /> Profiles Viewed:
                            </span>
                            <span className="font-bold text-slate-900">
                              {plan.viewProfilesPerDay >= 9999 ? "Unlimited" : plan.viewProfilesPerDay}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" /> Direct Messaging:
                            </span>
                            {plan.directMessaging ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-500" />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <Video className="h-3.5 w-3.5 text-purple-400" /> Video Calling:
                            </span>
                            {plan.videoCalling ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-500" />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2 text-slate-700">
                              <LifeBuoy className="h-3.5 w-3.5 text-amber-400" /> Voice Calls:
                            </div>
                            {plan.prioritySupport ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-500" />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Sparkles className="h-3.5 w-3.5 text-pink-400" /> Managed by Us:
                            </div>
                            {plan.managedByUs ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(plan)}
                          className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => deletePlan(plan._id)}
                          className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/25 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add-ons / Single Purchase Models */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-500" />
                Add-ons & Replenishments
              </h2>
              {plans.filter(p => p.durationDays === 0).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                  No add-on models configured.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {plans.filter(p => p.durationDays === 0).map((plan) => (
                    <div
                      key={plan._id}
                      className={`relative rounded-2xl bg-slate-200 border p-6 flex flex-col justify-between transition-all duration-300 hover:border-slate-400 ${plan.isActive ? "border-slate-200" : "border-slate-200 opacity-60"
                        }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-extrabold text-lg text-slate-900">{plan.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${plan.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-300 text-slate-600 border border-slate-400"
                            }`}>
                            {plan.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-1 text-slate-900">
                          {inlineEditingId === plan._id ? (
                            <form onSubmit={(e) => handleInlineSubmit(e, plan)} className="flex items-center gap-2 mt-2">
                              <span className="text-xl font-bold">₹</span>
                              <input
                                type="number"
                                value={inlinePrice}
                                onChange={(e) => setInlinePrice(e.target.value)}
                                className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-lg font-bold"
                                autoFocus
                                required
                              />
                              <button
                                type="submit"
                                disabled={inlineSubmitting}
                                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                              >
                                {inlineSubmitting ? "..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setInlineEditingId(null)}
                                className="rounded-lg bg-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-400"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <span className="text-3xl font-extrabold">₹{plan.price.toLocaleString("en-IN")}</span>
                              <span className="text-xs text-slate-600 font-medium">/ One-time</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                        {inlineEditingId !== plan._id && (
                          <button
                            onClick={() => {
                              setInlineEditingId(plan._id);
                              setInlinePrice(plan.price.toString());
                            }}
                            className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit Price
                          </button>
                        )}
                        <button
                          onClick={() => deletePlan(plan._id)}
                          className="flex items-center gap-1 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/25 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Form */}
          <div className="rounded-2xl bg-slate-200/70 border border-slate-200 p-6 h-fit space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {editingId ? "Modify Pricing Plan" : "Create Pricing Plan"}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Configure detailed rules toggled directly in the database
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Plan Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Gold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Cost (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="1499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Duration (Days)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      required
                      placeholder="30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white/50 pl-8 pr-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Plan limits */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                {/* Matches per day */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Matches</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={matchesPerDay}
                    onChange={(e) => setMatchesPerDay(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/50 px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">(Use 9999 for unlimited)</span>
                </div>

                {/* Profiles per day */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Profiles</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={viewProfilesPerDay}
                    onChange={(e) => setViewProfilesPerDay(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/50 px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">(Use 9999 for unlimited)</span>
                </div>
              </div>

              {/* Feature Checkboxes */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Feature Rules</span>

                {/* Direct Message Toggle */}
                <div className="flex items-center gap-3 bg-slate-200/80 p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="p-2 bg-purple-500/10 rounded-md text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    id="directMessaging"
                    checked={directMessaging}
                    onChange={(e) => setDirectMessaging(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 bg-white text-purple-500 focus:ring-purple-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label htmlFor="directMessaging" className="text-xs text-slate-700 cursor-pointer select-none">
                    Enable Direct Messaging
                  </label>
                </div>

                {/* Video Calling Toggle */}
                <div className="flex items-center gap-3 bg-slate-200/80 p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="p-2 bg-blue-500/10 rounded-md text-blue-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    id="videoCalling"
                    checked={videoCalling}
                    onChange={(e) => setVideoCalling(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 bg-white text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label htmlFor="videoCalling" className="text-xs text-slate-700 cursor-pointer select-none">
                    Enable Video Calling
                  </label>
                </div>

                {/* Voice Calls Toggle */}
                <div className="flex items-center gap-3 bg-slate-200/80 p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="p-2 bg-amber-500/10 rounded-md text-amber-400">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    id="prioritySupport"
                    checked={prioritySupport}
                    onChange={(e) => setPrioritySupport(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 bg-white text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label htmlFor="prioritySupport" className="text-xs text-slate-700 cursor-pointer select-none">
                    Enable Voice Calls
                  </label>
                </div>

                {/* Managed By Us Toggle */}
                <div className="flex items-center gap-3 bg-slate-200/80 p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="p-2 bg-pink-500/10 rounded-md text-pink-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    id="managedByUs"
                    checked={managedByUs}
                    onChange={(e) => setManagedByUs(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 bg-white text-pink-500 focus:ring-pink-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label htmlFor="managedByUs" className="text-xs text-slate-700 cursor-pointer select-none">
                    Enable Managed By Us
                  </label>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 py-2 border-t border-slate-200 pt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-200 bg-slate-50 accent-purple-500 text-purple-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  Make this pricing plan active immediately
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Tier
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
