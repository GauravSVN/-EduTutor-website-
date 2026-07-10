import React, { useState } from "react";
import { BookOpen, Calendar, CheckSquare, ShieldCheck, FileText, MessageSquare, CreditCard, Star, Users, Video, DollarSign, Upload, Plus, Trash2, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Tutor, Booking, Assignment, Attendance, Review } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TutorPanelProps {
  tutor: Tutor;
  bookings: Booking[];
  assignments: Assignment[];
  attendance: Attendance[];
  reviews: Review[];
  onAcceptBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onLogAttendance: (data: { studentId: string; date: string; time: string; status: "Present" | "Absent"; notes: string }) => void;
  onUploadAssignment: (data: { studentId: string; title: string; description: string; dueDate: string }) => void;
  onGradeAssignment: (assignmentId: string, grade: string, feedback: string) => void;
  onUpdateTutorProfile: (updatedData: Partial<Tutor>) => void;
}

export default function TutorPanel({
  tutor,
  bookings,
  assignments,
  attendance,
  reviews,
  onAcceptBooking,
  onRejectBooking,
  onLogAttendance,
  onUploadAssignment,
  onGradeAssignment,
  onUpdateTutorProfile,
}: TutorPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "assignments" | "schedule" | "income" | "reviews" | "profile">("overview");

  // State for Assignment Creation Form
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");

  // State for Attendance Log Form
  const [attStudentId, setAttStudentId] = useState("");
  const [attDate, setAttDate] = useState("");
  const [attTime, setAttTime] = useState("");
  const [attStatus, setAttStatus] = useState<"Present" | "Absent">("Present");
  const [attNotes, setAttNotes] = useState("");

  // State for Assignment Grading Form
  const [gradingAssignmentId, setGradingAssignmentId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  // State for Withdrawal Request Form
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankRouting, setBankRouting] = useState("");

  // Handler for Profile Update Form
  const [editFees, setEditFees] = useState(tutor.fees);
  const [editBio, setEditBio] = useState(tutor.bio);
  const [editSubject, setEditSubject] = useState(tutor.subject);

  // Derived calculations
  const pendingRequests = bookings.filter((b) => b.status === "Pending");
  const upcomingClasses = bookings.filter((b) => b.status === "Upcoming");
  const finishedClasses = bookings.filter((b) => b.status === "Completed");

  // Calculate gross income
  const totalEarned = bookings
    .filter((b) => b.status === "Completed" && b.type === "Regular")
    .reduce((sum, b) => sum + b.amount, 0);

  // Get distinct students list
  const uniqueStudents = Array.from(new Set(bookings.map((b) => b.studentId))).map((id) => {
    const booking = bookings.find((b) => b.studentId === id);
    return {
      id,
      name: booking ? booking.studentName : "Alex Johnson",
    };
  });

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !assignmentTitle || !assignmentDesc || !assignmentDueDate) return;

    onUploadAssignment({
      studentId: selectedStudentId,
      title: assignmentTitle,
      description: assignmentDesc,
      dueDate: assignmentDueDate,
    });

    setAssignmentTitle("");
    setAssignmentDesc("");
    setAssignmentDueDate("");
    setSelectedStudentId("");
    setActiveTab("students");
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attStudentId || !attDate || !attTime) return;

    onLogAttendance({
      studentId: attStudentId,
      date: attDate,
      time: attTime,
      status: attStatus,
      notes: attNotes,
    });

    setAttStudentId("");
    setAttDate("");
    setAttTime("");
    setAttNotes("");
    alert("Attendance logged successfully!");
  };

  const handleGradingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignmentId || !gradeInput) return;

    onGradeAssignment(gradingAssignmentId, gradeInput, feedbackInput);
    setGradingAssignmentId(null);
    setGradeInput("");
    setFeedbackInput("");
  };

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !bankAccount) return;
    alert(`Withdrawal Request of $${withdrawAmount} received.\nFunds will be wired to account ****${bankAccount.slice(-4)} within 2 business days under standard escrow clearing policies.`);
    setWithdrawAmount("");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTutorProfile({
      fees: editFees,
      bio: editBio,
      subject: editSubject,
    });
    alert("Tutor profile updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Side Profile Card & Verification Banner */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 flex flex-col items-center text-center">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30 p-0.5 mb-3"
          />
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
            {tutor.name}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mb-3 max-w-[150px] truncate">{tutor.subject}</p>

          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 border ${
            tutor.verified === "Approved"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 animate-pulse"
          }`}>
            {tutor.verified === "Approved" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Approval Pending
              </>
            )}
          </span>
        </div>

        {/* Tab Selection Navigation */}
        <div className="glass-panel rounded-2xl p-3 space-y-1.5 bg-white/40 dark:bg-slate-900/40 border border-white/25 dark:border-white/5">
          {[
            { id: "overview", label: "Overview & Requests", icon: Clock },
            { id: "students", label: "My Active Students", icon: Users },
            { id: "assignments", label: "Assignment Center", icon: CheckSquare },
            { id: "schedule", label: "Calendar Schedule", icon: Calendar },
            { id: "income", label: "Income & Escrow", icon: DollarSign },
            { id: "reviews", label: "Reviews & Ratings", icon: Star },
            { id: "profile", label: "Profile Editing", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Control Console */}
      <div className="lg:col-span-9 space-y-8">
        <AnimatePresence mode="wait">
          {/* OVERVIEW & CLIENT CLASS REQUESTS */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Core metrics overview row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Gross Earnings", val: `$${totalEarned}`, desc: "Earned from completing lessons", icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                  { label: "Unique Students", val: `${uniqueStudents.length}`, desc: "Active distinct profiles", icon: Users, color: "text-indigo-600 bg-indigo-500/10" },
                  { label: "Class Schedule", val: `${upcomingClasses.length}`, desc: "Pending slots to deliver", icon: Calendar, color: "text-purple-600 bg-purple-500/10" },
                  { label: "Average Rating", val: `${tutor.rating}`, desc: `Voted by ${tutor.reviewsCount} clients`, icon: Star, color: "text-amber-500 bg-amber-500/10" },
                ].map((stat, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${stat.color} shrink-0`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{stat.label}</p>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{stat.val}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class Booking Requests list */}
              <div className="glass-panel p-6 rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                      Incoming Booking Requests
                    </h3>
                    <p className="text-xs text-slate-500">
                      Incoming requests from students. Complete scheduled times to release escrow funds.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                    {pendingRequests.length} Pending Actions
                  </span>
                </div>

                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-5 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {req.studentName}
                            </span>
                            <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-600 px-2 rounded-full">
                              {req.type} Class
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Requested <strong>{req.subject}</strong> on <strong>{req.date}</strong> at <strong>{req.time}</strong>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Amount: ${req.amount} (held in escrow)
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onRejectBooking(req.id)}
                            className="text-xs font-semibold text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => onAcceptBooking(req.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm"
                          >
                            Accept & Connect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No active student lesson proposals currently pending approval.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* MY ACTIVE STUDENTS & LOG WORK AREA */}
          {activeTab === "students" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active logs list */}
                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                    Active Pupil Registry
                  </h3>
                  {uniqueStudents.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {uniqueStudents.map((stud) => (
                        <div key={stud.id} className="py-3.5 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                              {stud.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-100">{stud.name}</p>
                              <p className="text-[10px] text-slate-400">Regular 1-on-1 Student</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedStudentId(stud.id);
                                alert(`Student ${stud.name} selected. Fill the worksheet upload form on the right.`);
                              }}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              Assign Homework
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">No active student logs found.</p>
                  )}
                </div>

                {/* Upload Homework Form */}
                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                    Issue New Homework Worksheet
                  </h3>
                  <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Student</label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                      >
                        <option value="">Select target pupil...</option>
                        {uniqueStudents.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Worksheet Title</label>
                      <input
                        type="text"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                        required
                        placeholder="e.g. Calculus Differentiation Sheet"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Instructions / Description</label>
                      <textarea
                        value={assignmentDesc}
                        onChange={(e) => setAssignmentDesc(e.target.value)}
                        required
                        placeholder="Provide details on exercises, reading pages, and expectations..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white h-20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Due Date</label>
                      <input
                        type="date"
                        value={assignmentDueDate}
                        onChange={(e) => setAssignmentDueDate(e.target.value)}
                        required
                        min="2026-07-10"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                    >
                      Assign Task
                    </button>
                  </form>
                </div>
              </div>

              {/* Log Attendance form */}
              <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200">
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                  Log Attendance & Lesson Session Summary
                </h3>
                <form onSubmit={handleAttendanceSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">Student</label>
                    <select
                      value={attStudentId}
                      onChange={(e) => setAttStudentId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-850"
                    >
                      <option value="">Choose Student...</option>
                      {uniqueStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">Date</label>
                    <input
                      type="date"
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">Time Period</label>
                    <input
                      type="text"
                      value={attTime}
                      onChange={(e) => setAttTime(e.target.value)}
                      required
                      placeholder="e.g. 16:00 - 17:00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5">Status</label>
                    <select
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div>
                    <button type="submit" className="w-full bg-slate-800 text-white font-bold py-2 rounded-xl transition-all">
                      Save Lesson Log
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ASSIGNMENT CENTER & GRADING INTERFACE */}
          {activeTab === "assignments" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                Assigned Worksheets & Submissions Tracker
              </h3>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((as) => (
                    <div
                      key={as.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white/50 dark:bg-slate-950/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-600">Student: {as.studentName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                            as.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : as.status === "Submitted"
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {as.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{as.title}</h4>
                        <p className="text-slate-500">{as.description}</p>
                        <p className="text-[10px] text-red-500 font-bold">Due: {as.dueDate}</p>

                        {as.submissionUrl && (
                          <p className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer">
                            📁 <a href={as.submissionUrl} target="_blank" rel="noopener noreferrer">View Submitted PDF Link</a>
                          </p>
                        )}

                        {as.grade && (
                          <div className="mt-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                            <p className="font-bold text-emerald-600">Grade Score: {as.grade}</p>
                            <p className="text-slate-500 italic">" {as.feedback} "</p>
                          </div>
                        )}
                      </div>

                      <div>
                        {as.status === "Submitted" && (
                          <div className="flex flex-col gap-2">
                            {gradingAssignmentId === as.id ? (
                              <form onSubmit={handleGradingSubmit} className="space-y-2 text-right w-48">
                                <input
                                  type="text"
                                  value={gradeInput}
                                  onChange={(e) => setGradeInput(e.target.value)}
                                  placeholder="Grade (e.g. A, 95/100)..."
                                  required
                                  className="w-full px-2 py-1 border rounded bg-white text-slate-800"
                                />
                                <input
                                  type="text"
                                  value={feedbackInput}
                                  onChange={(e) => setFeedbackInput(e.target.value)}
                                  placeholder="Feedback comments..."
                                  className="w-full px-2 py-1 border rounded bg-white text-slate-800"
                                />
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setGradingAssignmentId(null)}
                                    className="text-[10px] text-slate-400"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg"
                                  >
                                    Submit Grade
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => setGradingAssignmentId(as.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                              >
                                Grade Submission
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No assigned worksheets listed.</p>
              )}
            </motion.div>
          )}

          {/* CALENDAR SCHEDULE */}
          {activeTab === "schedule" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">
                Tutor Schedule Calendar
              </h3>

              {upcomingClasses.length > 0 ? (
                <div className="space-y-4 text-xs">
                  {upcomingClasses.map((cl) => (
                    <div key={cl.id} className="p-4 rounded-xl bg-white/50 dark:bg-slate-950/30 border border-slate-200/40 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{cl.studentName}</span>
                          <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 rounded-full">{cl.type}</span>
                        </div>
                        <p className="text-slate-500 mt-1">Topic: {cl.subject}</p>
                        <p className="text-slate-400 text-[10px]">Slot: {cl.date} at {cl.time}</p>
                      </div>

                      <div className="flex gap-2">
                        {cl.meetingUrl && (
                          <a
                            href={cl.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" /> Launch Live Room
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No lessons scheduled on your board.</p>
              )}
            </motion.div>
          )}

          {/* INCOME CENTER & BANK WITHDRAWAL */}
          {activeTab === "income" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
                {/* Gross Ledger */}
                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-6">
                    Earnings & Escrow Transactions
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-950/40 p-4 rounded-2xl flex justify-between items-center border border-slate-200/50">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Gross Disbursals</p>
                        <p className="text-2xl font-bold text-emerald-600">${totalEarned}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Transferred via Platform</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {finishedClasses.length > 0 ? (
                        finishedClasses.map((cl) => (
                          <div key={cl.id} className="p-3 bg-white dark:bg-slate-950 border border-slate-100 rounded-xl flex justify-between items-center text-[11px]">
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{cl.studentName}</p>
                              <p className="text-[10px] text-slate-400">Lesson on {cl.date}</p>
                            </div>
                            <span className="font-bold text-emerald-600">+${cl.amount}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">No completed regular classes logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Withdrawal Desk */}
                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                    Transfer Funds to Bank
                  </h3>
                  <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Transfer Amount ($)</label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        required
                        max={totalEarned}
                        placeholder={`Max available: $${totalEarned}`}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Bank Routing Number</label>
                      <input
                        type="text"
                        value={bankRouting}
                        onChange={(e) => setBankRouting(e.target.value)}
                        required
                        placeholder="9-digit routing code..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Account Number</label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        required
                        placeholder="Checking account destination..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={totalEarned === 0}
                      className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-2.5 rounded-xl transition-all shadow-md"
                    >
                      Process Wire Withdrawal
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* REVIEWS & RATINGS */}
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                Client Testimonials & Feedback
              </h3>

              {reviews.length > 0 ? (
                <div className="space-y-4 text-xs">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-white/50 dark:bg-slate-950/30 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{rev.studentName}</p>
                          <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-amber-500 font-bold flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic">" {rev.text} "</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No client reviews submitted yet.</p>
              )}
            </motion.div>
          )}

          {/* PROFILE EDITING */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                Edit Professional Profile Details
              </h3>
              <form onSubmit={handleProfileSave} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Hourly Lesson Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      value={editFees}
                      onChange={(e) => setEditFees(Number(e.target.value))}
                      required
                      min="20"
                      max="100"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Main Subject Tagline
                    </label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Professional Biography & Methodologies
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white h-24 resize-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-md"
                  >
                    Save Biography Profile
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
