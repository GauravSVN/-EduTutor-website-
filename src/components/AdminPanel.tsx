import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShieldAlert, Users, CreditCard, Star, FileText, Check, X, RefreshCcw, Landmark, Plus, Trash2 } from "lucide-react";
import { Tutor, Payment } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  tutors: Tutor[];
  payments: Payment[];
  subjects: string[];
  cities: string[];
  onApproveTutor: (tutorId: string) => void;
  onRejectTutor: (tutorId: string) => void;
  onReleaseEscrow: (paymentId: string) => void;
  onRefundEscrow: (paymentId: string) => void;
  onAddSubject: (subject: string) => void;
  onAddCity: (city: string) => void;
}

export default function AdminPanel({
  tutors,
  payments,
  subjects,
  cities,
  onApproveTutor,
  onRejectTutor,
  onReleaseEscrow,
  onRefundEscrow,
  onAddSubject,
  onAddCity,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "verifications" | "escrows" | "cms">("metrics");

  // CMS state inputs
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const [newCityInput, setNewCityInput] = useState("");

  // Recharts mock growth history data
  const revenueHistory = [
    { month: "Feb", volume: 15400, platformCut: 1540 },
    { month: "Mar", volume: 22800, platformCut: 2280 },
    { month: "Apr", volume: 38100, platformCut: 3810 },
    { month: "May", volume: 51200, platformCut: 5120 },
    { month: "Jun", volume: 74900, platformCut: 7490 },
    { month: "Jul", volume: 92400, platformCut: 9240 },
  ];

  // Subject distribution chart data
  const subjectDistribution = [
    { name: "Math", value: 45 },
    { name: "Physics", value: 30 },
    { name: "Chemistry", value: 15 },
    { name: "Comp Sci", value: 10 },
  ];

  const COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#10b981"];

  // Core administrative calculations
  const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
  const escrowHeldTotal = payments.filter((p) => p.escrowStatus === "Held").reduce((sum, p) => sum + p.amount, 0);
  const pendingTutorsCount = tutors.filter((t) => t.verified === "Pending").length;
  const approvedTutorsCount = tutors.filter((t) => t.verified === "Approved").length;

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectInput.trim()) return;
    onAddSubject(newSubjectInput.trim());
    setNewSubjectInput("");
    alert(`Subject "${newSubjectInput}" dynamically registered into the learning pool!`);
  };

  const handleAddCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityInput.trim()) return;
    onAddCity(newCityInput.trim());
    setNewCityInput("");
    alert(`City "${newCityInput}" successfully added to the active coverage zones!`);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Admin Title bar & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/10 dark:bg-slate-950/20 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase text-red-600 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/20">
            🔐 Admin Console (Secured)
          </span>
          <h2 className="font-display font-extrabold text-2xl text-slate-800 dark:text-white mt-2">
            Platform Executive Back-Office
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manual control of tutor credential verifications, escrow disbursals, financial dashboards, and platform CMS constants.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "metrics", label: "Financial Metrics & Charts" },
            { id: "verifications", label: `Tutors Verification (${pendingTutorsCount})` },
            { id: "escrows", label: "Escrow Locked Deposits" },
            { id: "cms", label: "CMS Content Manager" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                  : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* METRICS & CHARTS */}
        {activeTab === "metrics" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Quick stats board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              {[
                { label: "Cumulated Transaction Vol.", val: `$${totalVolume}`, desc: "Processed securely via Stripe/Razorpay", icon: CreditCard, color: "text-emerald-600 bg-emerald-500/10" },
                { label: "Locked Escrow Deposits", val: `$${escrowHeldTotal}`, desc: "Held in EduTutor custody", icon: Landmark, color: "text-indigo-600 bg-indigo-500/10" },
                { label: "Registered Tutor Base", val: `${tutors.length}`, desc: `${approvedTutorsCount} approved, ${pendingTutorsCount} pending`, icon: Users, color: "text-purple-600 bg-purple-500/10" },
                { label: "Pending verifications", val: `${pendingTutorsCount}`, desc: "Manual checks required", icon: ShieldAlert, color: "text-red-500 bg-red-500/10" },
              ].map((stat, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 flex items-start gap-4 shadow-sm">
                  <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                    <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.val}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recharts Graphical Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              {/* Financial growth curve */}
              <div className="lg:col-span-8 glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-6">
                  Platform Volume & Revenue Growth (USD)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="volColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#volColor)" name="Total System Vol." />
                      <Area type="monotone" dataKey="platformCut" stroke="#10b981" strokeWidth={1.5} fillOpacity={0} name="Platform Commissions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject demands pie */}
              <div className="lg:col-span-4 glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-2">
                    Subject Enrollment Demands
                  </h3>
                  <p className="text-[10px] text-slate-400 mb-6">Aggregate metrics representing course demand ratios.</p>
                </div>
                <div className="h-44 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={subjectDistribution} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center Text */}
                  <div className="absolute text-center">
                    <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">100%</p>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest">Active Lessons</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {subjectDistribution.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                      <span className="truncate">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TUTORS VERIFICATION LIST */}
        {activeTab === "verifications" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20"
          >
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
              Manually Approve Academic Tutor Credentials
            </h3>

            {tutors.length > 0 ? (
              <div className="space-y-4 text-xs">
                {tutors.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-white/50 dark:bg-slate-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            t.verified === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : t.verified === "Pending"
                              ? "bg-amber-500/10 text-amber-600 animate-pulse"
                              : "bg-red-500/10 text-red-600"
                          }`}>
                            {t.verified}
                          </span>
                        </div>
                        <p className="text-slate-500 font-semibold">{t.subject} • ${t.fees}/hour</p>
                        <p className="text-slate-500 text-[11px] line-clamp-1">{t.bio}</p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-indigo-600 font-bold pt-1.5">
                          <span className="bg-indigo-500/5 px-2 py-0.5 rounded-lg">🎓 Deg: Verified PhD/MSc cert</span>
                          <span className="bg-indigo-500/5 px-2 py-0.5 rounded-lg">🪪 ID: Government Pass verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {t.verified !== "Rejected" && (
                        <button
                          onClick={() => onRejectTutor(t.id)}
                          className="text-[11px] font-bold text-red-500 hover:bg-red-500/10 px-3.5 py-1.5 rounded-xl border border-red-500/20 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Flag / Suspend
                        </button>
                      )}
                      {t.verified !== "Approved" && (
                        <button
                          onClick={() => onApproveTutor(t.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-500/10"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Profile
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No tutors listed on the platform.</p>
            )}
          </motion.div>
        )}

        {/* ESCROW locked funds desk */}
        {activeTab === "escrows" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  Escrow Deposits Custody Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Total secure user deposit balances in active custody. Disburse directly to teachers or return to students upon request.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Escrow Vault</p>
                <p className="text-xl font-bold text-indigo-600">${escrowHeldTotal}</p>
              </div>
            </div>

            {payments.length > 0 ? (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Student Sender</th>
                      <th className="pb-3">Tutor Beneficiary</th>
                      <th className="pb-3">Deposit Value</th>
                      <th className="pb-3">Escrow Custody Status</th>
                      <th className="pb-3 text-right">Administrative Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/15">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-4 font-mono text-[10px] text-slate-600 dark:text-slate-300">{p.transactionId}</td>
                        <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">{p.studentName}</td>
                        <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">{p.tutorName}</td>
                        <td className="py-4 font-bold text-slate-850 dark:text-slate-100">${p.amount}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            p.escrowStatus === "Held"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/25"
                              : p.escrowStatus === "Released"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25"
                              : "bg-red-500/10 text-red-600 border border-red-500/25"
                          }`}>
                            {p.escrowStatus === "Held" ? "🔒 Locked in Escrow" : p.escrowStatus === "Released" ? "🔓 Released to Tutor" : "↩️ Refunded"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {p.escrowStatus === "Held" ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => onRefundEscrow(p.id)}
                                className="text-[10px] font-bold text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/25"
                              >
                                Issue Refund
                              </button>
                              <button
                                onClick={() => onReleaseEscrow(p.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg"
                              >
                                Release Funds
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Settled & Handled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No platform ledger entries currently processed.</p>
            )}
          </motion.div>
        )}

        {/* CMS CONFIGURATION */}
        {activeTab === "cms" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs"
          >
            {/* Subjects Manager */}
            <div className="glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                Register Platform Subjects
              </h3>

              <form onSubmit={handleAddSubjectSubmit} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="e.g. Organic Chemistry, French..."
                  required
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-850 bg-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Register
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl font-medium border border-slate-200/40 dark:border-slate-850"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Cities Zone Coverage */}
            <div className="glass-panel p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                Active City Coverage Zones
              </h3>

              <form onSubmit={handleAddCitySubmit} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  placeholder="e.g. New York, Chicago, Houston..."
                  required
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add City
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {cities.map((city, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl font-medium border border-slate-200/40"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
