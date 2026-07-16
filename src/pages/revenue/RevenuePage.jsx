import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Tag, Calendar, Percent, Sparkles, Award } from "lucide-react";



export default function RevenuePage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxUses, setMaxUses] = useState("100");
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load coupons list");
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discountPercentage: parseFloat(discountPercentage),
          expiryDate: new Date(expiryDate),
          maxUses: parseInt(maxUses)
        })
      });

      if (res.ok) {
        setCode("");
        setDiscountPercentage("");
        setExpiryDate("");
        setMaxUses("100");
        fetchCoupons();
      }
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this discount coupon?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Revenue & Promo Codes</h1>
        <p className="text-sm text-slate-600">Generate discount coupon codes and inspect growth analytics</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coupons list */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" /> Active Discount Codes
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="rounded-2xl border border-slate-200 bg-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-xl">
                        <Tag className="h-3.5 w-3.5" /> {coupon.code}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">{coupon.discountPercentage}% OFF</span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Expiry Date:</span>
                        <span className="font-semibold text-slate-800">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Usage Statistics:</span>
                        <span className="font-semibold text-slate-800">{coupon.usedCount} / {coupon.maxUses} times used</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="mt-6 w-full flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 py-2 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Coupon
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Create form */}
          <div className="rounded-2xl bg-slate-200/70 border border-slate-200 p-6 h-fit space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Generate Code</h3>
              <p className="text-xs text-slate-500 mt-1">Configure user promotion rules</p>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Discount Percent</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    required
                    placeholder="30"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-8 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-8 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Max Uses</label>
                <input
                  type="number"
                  required
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
