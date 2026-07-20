import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ActiveSubscriptionsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/active-subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load subscription payments");
      }

      const data = await res.json();
      setPayments(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((pay) => {
    const name = pay.user?.profile?.name || `${pay.user?.profile?.firstName || ""} ${pay.user?.profile?.lastName || ""}`.trim() || "No Name";
    const email = pay.user?.email || "";
    const planName = pay.plan?.name || "";
    const txId = pay.transactionId || "";

    return name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      planName.toLowerCase().includes(search.toLowerCase()) ||
      txId.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiryString) => {
    return new Date(expiryString).getTime() < Date.now();
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Subscriptions</h1>
        <p className="text-sm text-slate-600">Track active billing plan memberships and client receipts</p>
      </div>

      {/* Search */}
      <div className="mb-6 flex max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by customer, email, plan name, or TXN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-slate-200/70 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <span className="text-slate-600 text-sm font-medium">Loading payments ledger...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-red-400 text-sm animate-pulse">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100">
          <table className="w-full border-collapse text-left text-sm text-slate-700">
            <thead className="bg-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 whitespace-nowrap">Plan Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount Paid</th>
                <th className="px-6 py-4 whitespace-nowrap">Transaction Details</th>
                <th className="px-6 py-4 whitespace-nowrap">Period</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No active subscription records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => {
                  const name = pay.user?.profile?.name || `${pay.user?.profile?.firstName || ""} ${pay.user?.profile?.lastName || ""}`.trim() || "No Name";
                  const expired = isExpired(pay.expiryDate);
                  return (
                    <tr key={pay._id} className="hover:bg-zinc-900/10 transition-colors">
                      {/* Customer Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{pay.user?.email || pay.user?.phone || "No Identifier"}</div>
                      </td>

                      {/* Plan Name */}
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                        {pay.plan?.name || "Standard Membership"}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                        ₹{pay.amount.toLocaleString("en-IN")}
                      </td>

                      {/* Transaction ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
                          <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                          {pay.transactionId}
                        </div>
                      </td>

                      {/* Period */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{formatDate(pay.startDate)} - {formatDate(pay.expiryDate)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-300 text-slate-600 px-2 py-0.5 text-xs font-semibold border border-slate-400">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-xs font-semibold border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        )}
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
