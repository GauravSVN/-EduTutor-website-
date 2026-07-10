import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, CheckSquare, ShieldCheck, Search, MessageSquare, CreditCard, Settings, Star, Video, ArrowRight, UserCheck, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Tutor, Booking, Assignment, Attendance, Payment, Message } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface StudentPanelProps {
  tutors: Tutor[];
  bookings: Booking[];
  assignments: Assignment[];
  attendance: Attendance[];
  payments: Payment[];
  messages: Message[];
  studentUser: { id: string; name: string; avatar: string; email: string };
  onNewBooking: (data: { tutorId: string; subject: string; date: string; time: string; type: "Demo" | "Regular" }) => void;
  onNewMessage: (receiverId: string, text: string) => void;
  onSubmitAssignment: (assignmentId: string, submissionUrl: string) => void;
  onPostReview: (tutorId: string, rating: number, text: string) => void;
  onToggleWishlist: (tutorId: string) => void;
  wishlist: string[];
}

export default function StudentPanel({
  tutors,
  bookings,
  assignments,
  attendance,
  payments,
  messages,
  studentUser,
  onNewBooking,
  onNewMessage,
  onSubmitAssignment,
  onPostReview,
  onToggleWishlist,
  wishlist,
}: StudentPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tutors" | "assignments" | "attendance" | "chat" | "payments" | "settings">("overview");

  // State for Booking Modal
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [bookingSubject, setBookingSubject] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState<"Demo" | "Regular">("Regular");

  // State for Chat Selector
  const [selectedChatTutorId, setSelectedChatTutorId] = useState("");
  const [chatInput, setChatInput] = useState("");

  // State for Assignment Submit
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  // State for Review Post
  const [reviewTutorId, setReviewTutorId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Filters for Tutor Searching
  const [tutorQuery, setTutorQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterMaxFees, setFilterMaxFees] = useState(60);

  // Auto-fill chat receiver on active selection
  useEffect(() => {
    if (tutors.length > 0 && !selectedChatTutorId) {
      setSelectedChatTutorId(tutors[0].id);
    }
  }, [tutors, selectedChatTutorId]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor || !bookingSubject || !bookingDate || !bookingTime) return;

    onNewBooking({
      tutorId: selectedTutor.id,
      subject: bookingSubject,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
    });

    setSelectedTutor(null);
    setBookingSubject("");
    setBookingDate("");
    setBookingTime("");
    setActiveTab("overview");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatTutorId) return;

    // Find the actual tutor's user ID
    const tutorObj = tutors.find((t) => t.id === selectedChatTutorId);
    if (!tutorObj) return;

    onNewMessage(tutorObj.userId, chatInput);
    setChatInput("");
  };

  const handleAssignmentSubmit = (assignmentId: string) => {
    onSubmitAssignment(assignmentId, submissionUrl || "https://cloudinary.com/alex_johnson_limits_v2.pdf");
    setSubmittingAssignmentId(null);
    setSubmissionUrl("");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTutorId) return;
    onPostReview(reviewTutorId, reviewRating, reviewText);
    setReviewTutorId("");
    setReviewText("");
  };

  // Derived Metrics
  const hoursLearned = bookings.filter((b) => b.status === "Completed").length;
  const pendingAssignmentsCount = assignments.filter((a) => a.status === "Pending").length;
  const moneyHeldEscrow = payments
    .filter((p) => p.escrowStatus === "Held")
    .reduce((sum, p) => sum + p.amount, 0);

  // Filtered tutors inside Student dashboard
  const searchableTutors = tutors.filter((t) => {
    const queryMatch = t.name.toLowerCase().includes(tutorQuery.toLowerCase()) || t.subject.toLowerCase().includes(tutorQuery.toLowerCase());
    const subMatch = !filterSubject || t.subjectsList.some((s) => s.toLowerCase() === filterSubject.toLowerCase());
    const cityMatch = !filterCity || t.city.toLowerCase() === filterCity.toLowerCase();
    const genderMatch = !filterGender || t.gender.toLowerCase() === filterGender.toLowerCase();
    const feeMatch = t.fees <= filterMaxFees;
    return queryMatch && subMatch && cityMatch && genderMatch && feeMatch && t.verified === "Approved";
  });

  // Chat Filtered Messages
  const activeTutorUser = tutors.find((t) => t.id === selectedChatTutorId);
  const activeChatMessages = messages.filter(
    (m) =>
      (m.senderId === studentUser.id && activeTutorUser && m.receiverId === activeTutorUser.userId) ||
      (activeTutorUser && m.senderId === activeTutorUser.userId && m.receiverId === studentUser.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Student Nav Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 text-center flex flex-col items-center">
          <img
            src={studentUser.avatar}
            alt={studentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30 p-0.5 mb-3"
          />
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
            {studentUser.name}
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-1.5 uppercase">
            Student Account
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-panel rounded-2xl p-3 space-y-1.5 bg-white/40 dark:bg-slate-900/40 border border-white/25 dark:border-white/5">
          {[
            { id: "overview", label: "Dashboard Overview", icon: BookOpen },
            { id: "tutors", label: "Find & Book Tutors", icon: Search },
            { id: "assignments", label: "Homework Center", icon: CheckSquare },
            { id: "attendance", label: "Attendance Logs", icon: Calendar },
            { id: "chat", label: "Message Center", icon: MessageSquare },
            { id: "payments", label: "Invoices & Escrow", icon: CreditCard },
            { id: "settings", label: "Profile Settings", icon: Settings },
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

      {/* Main Student Console */}
      <div className="lg:col-span-9 space-y-8">
        <AnimatePresence mode="wait">
          {/* OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/25 flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Lessons Completed
                    </h4>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {hoursLearned} hrs
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Acquired academic growth</p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/25 flex items-start gap-4">
                  <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Pending Worksheets
                    </h4>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {pendingAssignmentsCount} Tasks
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Due before next scheduled class</p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-indigo-500/20 flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Safeguarded in Escrow
                    </h4>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      ${moneyHeldEscrow}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Released only after classes end</p>
                  </div>
                </div>
              </div>

              {/* Scheduled Classes & Requests list */}
              <div className="glass-panel p-6 rounded-2xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                  Upcoming Lessons Schedule
                </h3>

                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200/50 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                          <th className="pb-3">Tutor Name</th>
                          <th className="pb-3">Subject</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Time slot</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3 text-center">Status</th>
                          <th className="pb-3 text-right">Class Connection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/20">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                            <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">
                              {booking.tutorName}
                            </td>
                            <td className="py-4 text-slate-500 dark:text-slate-400">
                              {booking.subject}
                            </td>
                            <td className="py-4 text-slate-500 dark:text-slate-400">
                              {booking.date}
                            </td>
                            <td className="py-4 text-slate-500 dark:text-slate-400">
                              {booking.time}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                booking.type === "Demo"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                              }`}>
                                {booking.type}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                booking.status === "Upcoming"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : booking.status === "Pending"
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : booking.status === "Completed"
                                  ? "bg-slate-500/15 text-slate-600 dark:text-slate-400"
                                  : "bg-red-500/15 text-red-600 dark:text-red-400"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {booking.status === "Upcoming" && booking.meetingUrl ? (
                                <a
                                  href={booking.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                                >
                                  <Video className="w-3 h-3" /> Connect Live
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Tutor to confirm URL</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    No lessons booked yet. Select the 'Find & Book Tutors' tab to get started.
                  </div>
                )}
              </div>

              {/* POST REVIEW ACCORDION FORM */}
              <div className="glass-panel p-6 rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 text-left">
                <h3 className="font-display font-bold text-base text-slate-800 dark:text-white mb-4">
                  Leave a Tutor Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 text-left">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Select Tutor
                    </label>
                    <select
                      value={reviewTutorId}
                      onChange={(e) => setReviewTutorId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300/60 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value="">Choose tutor...</option>
                      {tutors.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Rating
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300/60 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 font-bold text-amber-500"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5</option>
                      <option value="4">⭐⭐⭐⭐ 4</option>
                      <option value="3">⭐⭐⭐ 3</option>
                      <option value="2">⭐⭐ 2</option>
                      <option value="1">⭐ 1</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 text-left">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Your Experience Comment
                    </label>
                    <input
                      type="text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      placeholder="e.g. Great teacher, highly recommended!"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300/60 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ADVANCED TUTORS SEARCH & BOOKING PANEL */}
          {activeTab === "tutors" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Quick Filters bar */}
              <div className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 text-left">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-4">
                  Refine Active Tutor Search
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    placeholder="Search name, bio..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300/60 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800"
                  />
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300/60 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option value="">Subject...</option>
                    <option value="Mathematics">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300/60 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option value="">Location...</option>
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Boston">Boston</option>
                  </select>
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300/60 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option value="">Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Max rate: ${filterMaxFees}/hr
                    </span>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={filterMaxFees}
                      onChange={(e) => setFilterMaxFees(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 accent-indigo-600 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Tutors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchableTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="glass-panel p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                      <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{tutor.name}</h4>
                        <p className="text-[10px] text-slate-500">{tutor.subject}</p>
                        <p className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500" /> {tutor.rating} ({tutor.reviewsCount} reviews)
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {tutor.bio}
                    </p>

                    <div className="flex flex-col gap-1 text-[10px] text-slate-500 mb-4">
                      <p><strong>Qualification:</strong> {tutor.qualification}</p>
                      <p><strong>Location:</strong> {tutor.city}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase">Rate</span>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100">${tutor.fees}/hr</p>
                      </div>
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        Book Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HOMEWORK CENTER (ASSIGNMENTS) */}
          {activeTab === "assignments" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                Active & Continuous Worksheets
              </h3>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((as) => (
                    <div
                      key={as.id}
                      className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Tutor: {as.tutorName}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
                        <p className="text-xs text-slate-600 dark:text-slate-300">{as.description}</p>
                        <p className="text-[10px] text-red-500 font-bold">Due Date: {as.dueDate}</p>
                        
                        {as.grade && (
                          <div className="mt-2 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 text-xs">
                            <p className="font-bold text-indigo-600 dark:text-indigo-400">Grade Score: {as.grade}</p>
                            <p className="text-slate-500 dark:text-slate-400 italic">" {as.feedback} "</p>
                          </div>
                        )}
                      </div>

                      <div>
                        {as.status === "Pending" && (
                          <div className="flex flex-col gap-2">
                            {submittingAssignmentId === as.id ? (
                              <div className="space-y-2 text-right">
                                <input
                                  type="text"
                                  value={submissionUrl}
                                  onChange={(e) => setSubmissionUrl(e.target.value)}
                                  placeholder="Submission Link (e.g. Google Drive/PDF)..."
                                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-[10px] w-48 text-slate-800 focus:outline-none"
                                />
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => setSubmittingAssignmentId(null)}
                                    className="text-[10px] font-bold text-slate-400 px-2 py-1"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAssignmentSubmit(as.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1 rounded-lg"
                                  >
                                    Submit File
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSubmittingAssignmentId(as.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                              >
                                Upload Submission
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No homework assignments pending. Your tutor will upload sheets here once lessons begin.
                </p>
              )}
            </motion.div>
          )}

          {/* ATTENDANCE REPORTS */}
          {activeTab === "attendance" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6">
                Attendance & Performance Reports
              </h3>

              {attendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200/50 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="pb-3">Log Date</th>
                        <th className="pb-3">Lesson Duration</th>
                        <th className="pb-3">Tutor</th>
                        <th className="pb-3">Mark</th>
                        <th className="pb-3 text-right">Lesson Summary Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/15">
                      {attendance.map((log) => (
                        <tr key={log.id}>
                          <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">{log.date}</td>
                          <td className="py-4 text-slate-500">{log.time}</td>
                          <td className="py-4 font-semibold text-slate-500">{log.tutorName}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              log.status === "Present"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-4 text-right text-slate-500 dark:text-slate-400 italic">
                            "{log.notes || "No notes logged"}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No attendance logs generated yet.
                </p>
              )}
            </motion.div>
          )}

          {/* REAL-TIME CHAT MODULE */}
          {activeTab === "chat" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left h-[500px] flex flex-col"
            >
              <div className="border-b border-slate-200/50 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                    Simulated Message Center
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Interact directly with your registered home tutors in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Chatting with:</span>
                  <select
                    value={selectedChatTutorId}
                    onChange={(e) => setSelectedChatTutorId(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-300 text-[10px] font-bold text-slate-800"
                  >
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Log */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {activeChatMessages.length > 0 ? (
                  activeChatMessages.map((msg) => {
                    const isMe = msg.senderId === studentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-2xl text-xs max-w-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                        }`}>
                          <p className="font-bold text-[9px] opacity-75 mb-1">{msg.senderName}</p>
                          <p>{msg.text}</p>
                          <span className="text-[8px] opacity-60 text-right block mt-1.5">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-12">
                    Send a message to introduce yourself and establish class schedules!
                  </p>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 px-4 rounded-xl transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* INVOICES & PAYMENTS HISTORY WITH ESCROW CUSTODY */}
          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                    Escrow Billing & Invoices
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your payments are held securely in custody. Tutors are paid only after you complete lessons.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total Locked Custody</p>
                  <p className="text-lg font-bold text-indigo-600">${moneyHeldEscrow}</p>
                </div>
              </div>

              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200/50 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="pb-3">Transaction ID</th>
                        <th className="pb-3">Tutor Target</th>
                        <th className="pb-3">Paid Amount</th>
                        <th className="pb-3">Provider</th>
                        <th className="pb-3">Custody Status</th>
                        <th className="pb-3 text-right">Invoices</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/15">
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td className="py-4 font-mono text-[10px] text-slate-600 dark:text-slate-300">{p.transactionId}</td>
                          <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">{p.tutorName}</td>
                          <td className="py-4 font-bold text-slate-800 dark:text-slate-100">${p.amount}</td>
                          <td className="py-4 text-slate-500">{p.paymentMethod}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              p.escrowStatus === "Held"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : p.escrowStatus === "Released"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}>
                              {p.escrowStatus === "Held" ? "🔒 Locked in Escrow" : p.escrowStatus === "Released" ? "🔓 Released to Tutor" : "↩️ Refunded"}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                alert(`Downloading Invoice PDF for transaction ${p.transactionId}\nGenerated under EduTutor commercial system.`);
                              }}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No payments processed yet. Booking regular lessons will log active Stripe/Razorpay invoices.
                </p>
              )}
            </motion.div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/20 text-left space-y-6"
            >
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                Personal Profile Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={studentUser.name}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="+1 (555) 019-2834"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Associated Location City
                  </label>
                  <input
                    type="text"
                    defaultValue="Chicago"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Registered Email Address (Locked)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={studentUser.email}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-400"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200/40">
                <button
                  onClick={() => alert("Profile update successfully saved.")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl"
                >
                  Save Profile Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILED BOOKING MODAL */}
      <AnimatePresence>
        {selectedTutor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-md w-full bg-white dark:bg-slate-950 rounded-3xl p-6 shadow-xl border border-white/20 text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                    Book Lesson Appointment
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Secure 1-on-1 tutoring scheduled under our secure custody system.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-2xl border border-indigo-100/30 mb-6">
                <img src={selectedTutor.avatar} alt={selectedTutor.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{selectedTutor.name}</h4>
                  <p className="text-[10px] text-slate-500">{selectedTutor.subject} • ${selectedTutor.fees}/hr</p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Class Category Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="bookingType"
                        value="Regular"
                        checked={bookingType === "Regular"}
                        onChange={() => setBookingType("Regular")}
                        className="accent-indigo-600"
                      />
                      Regular Class (${selectedTutor.fees}/hr)
                    </label>
                    <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="bookingType"
                        value="Demo"
                        checked={bookingType === "Demo"}
                        onChange={() => setBookingType("Demo")}
                        className="accent-indigo-600"
                      />
                      Free Demo (30 min)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Select Subject Focus
                  </label>
                  <select
                    value={bookingSubject}
                    onChange={(e) => setBookingSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                  >
                    <option value="">Choose subject...</option>
                    {selectedTutor.subjectsList.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      min="2026-07-10"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Select Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white"
                    >
                      <option value="">Select slot...</option>
                      {Object.entries(selectedTutor.availability).flatMap(([day, slots]) =>
                        (slots as string[]).map((slot) => (
                          <option key={`${day}-${slot}`} value={`${day} ${slot}`}>
                            {day}: {slot}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/50 flex items-start gap-2 text-[11px] text-slate-500 leading-normal mt-4">
                  <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p>
                    {bookingType === "Regular" ? (
                      <span>
                        Upon booking, <strong>${selectedTutor.fees}</strong> will be securely pre-authorized and locked in our Escrow wallet. Funds are released strictly after lesson completion.
                      </span>
                    ) : (
                      <span>
                        Demo lessons are completely free. The tutor will consult you on custom schedules, curriculums, and lesson rates.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedTutor(null)}
                    className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
