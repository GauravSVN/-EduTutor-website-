import React, { useState } from "react";
import { Search, MapPin, Sparkles, GraduationCap, CheckCircle, Users, BookOpen, ChevronDown, Send, BookMarked, MessageSquare, ArrowRight } from "lucide-react";
import { Tutor, Blog } from "../types";
import TutorCard from "./TutorCard";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  tutors: Tutor[];
  blogs: Blog[];
  subjects: string[];
  cities: string[];
  onBook: (tutor: Tutor) => void;
  onViewDetails: (tutor: Tutor) => void;
  wishlist: string[];
  onToggleWishlist: (tutorId: string) => void;
  onBecomeTutor: () => void;
}

export default function LandingPage({
  tutors,
  blogs,
  subjects,
  cities,
  onBook,
  onViewDetails,
  wishlist,
  onToggleWishlist,
  onBecomeTutor,
}: LandingPageProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxFees, setMaxFees] = useState<number>(60);

  // AI Matcher State
  const [aiRequirement, setAiRequirement] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  // FAQ Active Index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Filter tutors for list
  const filteredTutors = tutors.filter((t) => {
    const matchesSearch =
      searchTerm === "" ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "" ||
      t.subjectsList.some((s) => s.toLowerCase() === selectedSubject.toLowerCase());
    const matchesCity = selectedCity === "" || t.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesFees = t.fees <= maxFees;
    const isApproved = t.verified === "Approved"; // Display only approved on landing page

    return matchesSearch && matchesSubject && matchesCity && matchesFees && isApproved;
  });

  // Handle AI Matching
  const handleAiMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiRequirement.trim()) return;

    setAiLoading(true);
    setAiResult("");

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: aiRequirement,
          preferredSubject: selectedSubject,
          preferredCity: selectedCity,
          budgetLimit: maxFees,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiResult(data.rawText);
      } else {
        setAiResult(`### Matchmaking Issue\n\n${data.error || "Failed to process recommendations."}`);
      }
    } catch (err) {
      setAiResult("### Connection Error\n\nUnable to reach the Gemini Matchmaker API. Please check your setup.");
    } finally {
      setAiLoading(false);
    }
  };

  const faqs = [
    {
      q: "How does the escrow payment system protect students and tutors?",
      a: "When you book a package or class, funds are held securely by EduTutor. We release the payment to the tutor only after the student confirms the class is successfully completed. This prevents payment disputes and guarantees professional service.",
    },
    {
      q: "Can I request a free demo lesson before committing to payments?",
      a: "Absolutely. Most of our expert tutors offer a complimentary 30-minute demo class. Select 'Book Class' on any tutor profile and choose 'Demo' as the type to align goals, evaluate teaching styles, and request custom schedules.",
    },
    {
      q: "What background checks do tutors undergo?",
      a: "Every single tutor profile must upload recognized academic degrees, identity proof documents, and optionally complete video assessments. Our administration manually cross-checks these credentials before granting the 'Verified Expert' status.",
    },
    {
      q: "How do assignments and homework reports work?",
      a: "Tutors can directly upload assignments, continuous worksheets, and digital PDFs on the student's dashboard. Students complete them and upload submissions for grading. All results, marks, and detailed feedback are tracked in real-time.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero / Header Search Section */}
      <section className="relative pt-12 pb-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Next Gen Learning Platform
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] tracking-tight text-slate-900 dark:text-white">
            Find the Perfect <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 dark:from-indigo-400 dark:via-blue-400 dark:to-emerald-400">Home Tutor</span> <br/>
            Aligned with Your Goals.
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with verified school teachers, Ivy League specialists, and professional computer programmers for personalized 1-on-1 virtual or home education.
          </p>
        </motion.div>

        {/* Multi-Filter Search Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-5xl mt-12 px-4"
        >
          <div className="p-4 bg-white/45 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-indigo-500/5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/60 dark:divide-white/10">
              {/* Keyword Search */}
              <div className="flex flex-col text-left md:px-3 first:pl-0">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  Search Tutor Name or Bio
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. Calculus, Dr. Sarah..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Subject Dropdown */}
              <div className="flex flex-col text-left md:px-4 pt-4 md:pt-0">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="" className="dark:bg-[#020617] dark:text-white">All Subjects</option>
                  {subjects.map((sub, idx) => (
                    <option key={idx} value={sub} className="dark:bg-[#020617] dark:text-white">
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="flex flex-col text-left md:px-4 pt-4 md:pt-0">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  Select City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="" className="dark:bg-[#020617] dark:text-white">All Cities</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city} className="dark:bg-[#020617] dark:text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Hourly Fee Range */}
              <div className="flex flex-col text-left md:pl-4 pt-4 md:pt-0 justify-center">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Max Rate / Hour
                  </span>
                  <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400">
                    ${maxFees}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={maxFees}
                  onChange={(e) => setMaxFees(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Statistics Dashboard with Micro-interactions */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Happy Students", val: "10,000+", desc: "Active monthly learning", icon: Users, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10" },
            { label: "Verified Tutors", val: "450+", desc: "Ph.D. & School experts", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
            { label: "Classes Completed", val: "125,000+", desc: "Hours logged securely", icon: GraduationCap, color: "text-purple-600 dark:text-purple-400 bg-purple-500/10" },
            { label: "Escrow Protected", val: "100%", desc: "Satisfied or refunded", icon: BookOpen, color: "text-pink-600 dark:text-pink-400 bg-pink-500/10" },
          ].map((stat, idx) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-white/25 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 text-left flex items-start gap-4 shadow-sm"
            >
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
                  {stat.val}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI TUTOR MATCHMAKER (COMMERCIAL JEWEL WITH REAL GEMINI INTEGRATION) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-2xl bg-white/40 dark:bg-white/5 backdrop-blur-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -z-10"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Context & Description */}
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" /> AI Matching Engine
              </span>
              <h2 className="font-display font-extrabold text-3xl text-slate-800 dark:text-white leading-tight">
                Ask Gemini to Match Tutors
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe your child's learning bottlenecks, personal traits, custom budget restrictions, or preferred teaching formats. Our integrated Gemini AI will scan the registered directories and compile a match review.
              </p>

              <div className="bg-slate-105/50 dark:bg-white/5 p-4 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 border border-slate-200/40 dark:border-white/5">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Try typing:</p>
                <p className="italic">"I need a female Calculus teacher from Columbia or equivalent to prepare my daughter for the upcoming AP Calculus exam. We need lessons twice a week, maximum budget is $50/hour."</p>
              </div>
            </div>

            {/* Input Form & Real-time Output */}
            <div className="lg:col-span-7 flex flex-col h-full justify-center">
              <form onSubmit={handleAiMatch} className="space-y-4">
                <textarea
                  value={aiRequirement}
                  onChange={(e) => setAiRequirement(e.target.value)}
                  placeholder="Describe your learning goals, background, subject, and special requests here..."
                  className="w-full h-32 p-4 rounded-2xl border border-slate-200/65 dark:border-white/10 bg-white/60 dark:bg-white/5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-405 dark:placeholder:text-slate-600"
                  maxLength={400}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {aiRequirement.length}/400 characters
                  </span>
                  <button
                    type="submit"
                    disabled={aiLoading || !aiRequirement.trim()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Consulting Gemini...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Analyze & Match
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Match Result Display */}
              <AnimatePresence>
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-5 rounded-2xl bg-indigo-50/70 dark:bg-slate-950/70 text-left border border-indigo-100 dark:border-indigo-950/50 max-h-64 overflow-y-auto"
                  >
                    <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-semibold text-xs border-b border-indigo-100 dark:border-indigo-950/50 pb-2">
                      <Sparkles className="w-4 h-4" /> Customized Gemini Match Report
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {aiResult}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vetted Tutors List */}
      <section className="max-w-6xl mx-auto px-4 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-white">
              Vetted Expert Tutors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Browse profiles with manual verification, high ratings, and certified backgrounds.
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer hover:underline">
            Viewing {filteredTutors.length} approved teachers <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                onBook={onBook}
                onViewDetails={onViewDetails}
                isWishlisted={wishlist.includes(tutor.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center border border-dashed border-slate-300 dark:border-slate-800">
            <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-700 dark:text-slate-300">
              No matching tutors found
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              Try removing some search filters or adjusting the rate slider.
            </p>
          </div>
        )}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-white">
            How EduTutor Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Secure matching, seamless virtual setups, and reliable escrow protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Find & Consult", desc: "Use search filters or consult Gemini AI to find matched profiles. Request a complimentary demo lesson." },
            { step: "02", title: "Fund in Escrow", desc: "Pre-fund regular lesson credits. Payments are securely held in custody and only released once class ends." },
            { step: "03", title: "Track & Scale", desc: "Interact in live virtual calls, submit assigned worksheets, check attendance, and view test progress reports." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl relative bg-white/40 dark:bg-slate-900/40 border border-white/25 dark:border-white/5 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-display font-extrabold text-5xl text-indigo-500/20 absolute top-4 right-6">
                {item.step}
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mt-4">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ACCORDION FAQ */}
      <section className="max-w-4xl mx-auto px-4 text-left">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Answers to our most popular questions regarding tutor verification, booking, and refunds.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-sm">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-6xl mx-auto px-4 text-left">
        <div className="mb-10">
          <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-white">
            Educational Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Handy study advice, tips on college admissions, and general cognitive development strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={blog.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 shadow-sm flex flex-col md:flex-row h-full"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full md:w-44 h-44 object-cover shrink-0"
              />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 mt-3 hover:text-indigo-600 cursor-pointer">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {blog.snippet}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-850/20 pt-3">
                  <span>By {blog.author}</span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/40 pt-12 text-left text-xs text-slate-500 dark:text-slate-400 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-display font-bold text-sm tracking-wider">
                ET
              </span>
              <span className="font-display font-extrabold text-base text-slate-800 dark:text-white tracking-tight">
                EduTutor
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier, fully transparent marketplace for high-performance home coaching and student mentoring. Escrow supported.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider text-[10px]">
              Explore
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-indigo-500 cursor-pointer">Math Tutors</li>
              <li className="hover:text-indigo-500 cursor-pointer">Science Specialists</li>
              <li className="hover:text-indigo-500 cursor-pointer">Coding Mentors</li>
              <li className="hover:text-indigo-500 cursor-pointer">Study Guides</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider text-[10px]">
              Platform
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-indigo-500 cursor-pointer" onClick={onBecomeTutor}>Become a Tutor</li>
              <li className="hover:text-indigo-500 cursor-pointer">Escrow Safety</li>
              <li className="hover:text-indigo-500 cursor-pointer">Client Reviews</li>
              <li className="hover:text-indigo-500 cursor-pointer">Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider text-[10px]">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Email: contact@edututor.io</li>
              <li>Phone: +1 (555) 019-2834</li>
              <li>Address: 500 Market St, San Francisco</li>
              <li className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Live support online
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/50 dark:border-slate-800/30 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© 2026 EduTutor Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Escrow Disclosures</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
