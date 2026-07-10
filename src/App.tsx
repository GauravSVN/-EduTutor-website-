import React, { useState, useEffect } from "react";
import { Sun, Moon, LogOut, Users, GraduationCap, ShieldAlert, Sparkles, BookOpen, Heart, MessageSquare, Menu, X, ArrowRight } from "lucide-react";
import LandingPage from "./components/LandingPage";
import StudentPanel from "./components/StudentPanel";
import TutorPanel from "./components/TutorPanel";
import AdminPanel from "./components/AdminPanel";
import { User, Tutor, Booking, Assignment, Attendance, Payment, Message, Blog } from "./types";
import { motion, AnimatePresence } from "motion/react";

// Mock constant lists matching server side structures
const INITIAL_SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "English Literature"];
const INITIAL_CITIES = ["New York", "San Francisco", "Boston", "Chicago", "Seattle", "Austin"];

const INITIAL_BLOGS: Blog[] = [
  {
    id: "blog-1",
    title: "Mastering AP Calculus: 5 Core Differentiation Theorems",
    author: "Dr. Elizabeth Vance",
    category: "Mathematics",
    readTime: "6 min read",
    snippet: "High-school calculus doesn't have to be intimidating. Elizabeth Vance outlines the core limits and integration rules to guarantee an AP Grade 5.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60",
    createdAt: "2026-07-01",
  },
  {
    id: "blog-2",
    title: "Why Early Algorithmic Thinking Promotes General Brain Plasticity",
    author: "Prof. Marcus Sterling",
    category: "Computer Science",
    readTime: "8 min read",
    snippet: "Teaching kids Python loops and spatial logic puzzles alters their analytical reasoning. Sterling dissects cognitive development studies.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    createdAt: "2026-07-04",
  },
];

const INITIAL_TUTORS: Tutor[] = [
  {
    id: "tutor-1",
    userId: "user-tutor-1",
    name: "Dr. Elizabeth Vance",
    subject: "Mathematics & Advanced Calculus",
    subjectsList: ["Mathematics", "Physics"],
    classes: ["Class 11", "Class 12", "AP Calculus"],
    qualification: "Ph.D. in Applied Mathematics from MIT",
    experience: "12 Years",
    fees: 55,
    rating: 4.9,
    reviewsCount: 28,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
    city: "Boston",
    gender: "Female",
    bio: "Passionate academic coach. I specialize in preparing advanced students for MIT entrance sheets, AP exams, and rigorous Olympiads. I use step-by-step interactive whiteboards.",
    verified: "Approved",
    videoUrl: "https://vimeo.com/mock-math-lessons-vance",
    availability: {
      "Monday": ["14:00 - 15:00", "16:00 - 17:00"],
      "Wednesday": ["16:00 - 17:00", "18:00 - 19:00"],
    },
  },
  {
    id: "tutor-2",
    userId: "user-tutor-2",
    name: "Prof. Marcus Sterling",
    subject: "Computer Science & Python Algorithms",
    subjectsList: ["Computer Science"],
    classes: ["Class 9", "Class 10", "Class 11", "College Level"],
    qualification: "M.S. in Software Engineering from Stanford",
    experience: "8 Years",
    fees: 48,
    rating: 4.8,
    reviewsCount: 16,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60",
    city: "San Francisco",
    gender: "Male",
    bio: "Former Tech Lead at Netflix. I coach students in data structures, algorithms, frontend React, and basic web engineering. Lessons are project-based and highly interactive.",
    verified: "Approved",
    videoUrl: "https://vimeo.com/mock-cs-lessons-sterling",
    availability: {
      "Tuesday": ["15:00 - 16:00", "17:00 - 18:00"],
      "Thursday": ["17:00 - 18:00", "19:00 - 20:00"],
    },
  },
  {
    id: "tutor-3",
    userId: "user-tutor-3",
    name: "Clara Reynolds",
    subject: "Chemistry & Molecular Physics",
    subjectsList: ["Chemistry", "Physics"],
    classes: ["Class 10", "Class 11", "Class 12"],
    qualification: "B.S. in Chemical Engineering from Columbia",
    experience: "4 Years",
    fees: 38,
    rating: 4.7,
    reviewsCount: 9,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60",
    city: "New York",
    gender: "Female",
    bio: "Making organic chemistry formulas easy. I design custom molecular models and interactive quizzes so pupils can grasp stoichiometry easily.",
    verified: "Approved",
    availability: {
      "Friday": ["10:00 - 11:30", "14:00 - 15:30"],
    },
  },
  {
    id: "tutor-4",
    userId: "user-tutor-4",
    name: "Benjamin Harrison",
    subject: "Classical Physics & Kinetics",
    subjectsList: ["Physics"],
    classes: ["Class 11", "Class 12"],
    qualification: "M.Sc. in Physics from Oxford University",
    experience: "6 Years",
    fees: 42,
    rating: 4.0,
    reviewsCount: 2,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
    city: "Chicago",
    gender: "Male",
    bio: "Struggling with mechanics, vector diagrams, or thermodynamics? I break down complicated equations into simple graphical simulations.",
    verified: "Pending", // For testing admin approval flow!
    availability: {
      "Monday": ["10:00 - 11:00"],
    },
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    subject: "Mathematics",
    date: "2026-07-12",
    time: "Wednesday 16:00 - 17:00",
    status: "Upcoming",
    type: "Regular",
    amount: 55,
    meetingUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "book-2",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-2",
    tutorName: "Prof. Marcus Sterling",
    subject: "Computer Science",
    date: "2026-07-14",
    time: "Thursday 17:00 - 18:00",
    status: "Pending",
    type: "Demo",
    amount: 0,
  },
  {
    id: "book-3",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    subject: "Mathematics",
    date: "2026-07-05",
    time: "Monday 14:00 - 15:00",
    status: "Completed",
    type: "Regular",
    amount: 55,
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "as-1",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    title: "Calculus Limits Differentiation Worksheet",
    description: "Solve questions 1 to 15 regarding basic limits, chain rule derivations, and related rates theorem applications.",
    dueDate: "2026-07-11",
    status: "Pending",
  },
  {
    id: "as-2",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-2",
    tutorName: "Prof. Marcus Sterling",
    title: "Python Recursive Binary Search Tree",
    description: "Write a clean python script implementing dynamic insertions and searches in a sorted binary search tree. Document asymptotic time complexity.",
    dueDate: "2026-07-06",
    status: "Graded",
    submissionUrl: "https://github.com/alexjohnson/binary-tree-python",
    grade: "95/100",
    feedback: "Excellent modular code structures, Clara. Very clear explanation of O(log n) average complexity constraints. Keep it up!",
  },
];

const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: "att-1",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    date: "2026-07-05",
    time: "14:00 - 15:00",
    status: "Present",
    notes: "Active engagement, solved differentiation problems with minor supervision.",
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    bookingId: "book-1",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    amount: 55,
    escrowStatus: "Held", // Locked in Escrow custody!
    paymentMethod: "Stripe Wallet",
    transactionId: "ch_stripe_8f49a21b3901eef2",
    createdAt: "2026-07-08T10:45:00Z",
  },
  {
    id: "pay-2",
    bookingId: "book-3",
    studentId: "student-1",
    studentName: "Alex Johnson",
    tutorId: "tutor-1",
    tutorName: "Dr. Elizabeth Vance",
    amount: 55,
    escrowStatus: "Released", // Successfully disbursed to tutor!
    paymentMethod: "Razorpay Gateway",
    transactionId: "pay_rzp_9a2b02f9c81123a",
    createdAt: "2026-07-05T15:05:00Z",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "student-1",
    senderName: "Alex Johnson",
    receiverId: "user-tutor-1",
    text: "Hi Dr. Elizabeth! I pre-funded the calculus class and uploaded my algebra background worksheet. Looking forward to our MIT prep lesson.",
    timestamp: "2026-07-08T12:00:00Z",
  },
  {
    id: "msg-2",
    senderId: "user-tutor-1",
    senderName: "Dr. Elizabeth Vance",
    receiverId: "student-1",
    text: "Hello Alex! Perfect. I reviewed your sheet and we will start with the definition of limits before proceeding to derivatives. See you soon!",
    timestamp: "2026-07-08T12:15:00Z",
  },
];

export default function App() {
  // Mode selection & navigation routing state
  const [currentRoute, setCurrentRoute] = useState<"home" | "student-panel" | "tutor-panel" | "admin-panel">("home");
  const [darkMode, setDarkMode] = useState(true);

  // Core Mock Datasets
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [subjects, setSubjects] = useState<string[]>(INITIAL_SUBJECTS);
  const [cities, setCities] = useState<string[]>(INITIAL_CITIES);
  const [wishlist, setWishlist] = useState<string[]>(["tutor-2"]);

  // Role context accounts (Preloaded for developer / user testing)
  const [currentUser, setCurrentUser] = useState<User>({
    id: "student-1",
    email: "alex.johnson@edu.io",
    name: "Alex Johnson",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
  });

  // Dark Mode side effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle Dynamic User Selection Switcher in persistent Header Navbar
  const handleUserRoleSwitch = (role: "student" | "tutor" | "admin") => {
    if (role === "student") {
      setCurrentUser({
        id: "student-1",
        email: "alex.johnson@edu.io",
        name: "Alex Johnson",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
      });
      setCurrentRoute("student-panel");
    } else if (role === "tutor") {
      setCurrentUser({
        id: "user-tutor-1",
        email: "elizabeth.vance@mit.edu",
        name: "Dr. Elizabeth Vance",
        role: "tutor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
      });
      setCurrentRoute("tutor-panel");
    } else {
      setCurrentUser({
        id: "admin-super",
        email: "chief.admin@edututor.io",
        name: "SuperAdmin Chief",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60",
      });
      setCurrentRoute("admin-panel");
    }
  };

  // Student Actions callbacks
  const handleNewBooking = (data: { tutorId: string; subject: string; date: string; time: string; type: "Demo" | "Regular" }) => {
    const matchedTutor = tutors.find((t) => t.id === data.tutorId);
    if (!matchedTutor) return;

    const newBookingId = `book-${bookings.length + 1}`;
    const newBooking: Booking = {
      id: newBookingId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      tutorId: matchedTutor.id,
      tutorName: matchedTutor.name,
      subject: data.subject,
      date: data.date,
      time: data.time,
      status: "Pending",
      type: data.type,
      amount: data.type === "Regular" ? matchedTutor.fees : 0,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // If it is a regular class, process secure escrow pre-auth deposit simulation
    if (data.type === "Regular") {
      const newPayment: Payment = {
        id: `pay-${payments.length + 1}`,
        bookingId: newBookingId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        tutorId: matchedTutor.id,
        tutorName: matchedTutor.name,
        amount: matchedTutor.fees,
        escrowStatus: "Held", // Held in escrow custody
        paymentMethod: "Stripe Wallet (Mocked)",
        transactionId: `ch_stripe_ref_${Math.random().toString(16).slice(2, 10)}`,
        createdAt: new Date().toISOString(),
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    alert(`Class Proposal successfully registered!\n${data.type === "Regular" ? "Escrow pre-funded securely." : "Demo session queued."}`);
  };

  const handleNewMessage = (receiverId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-${messages.length + 1}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto response after 3 seconds from the recipient to prove full chat fluidity
    setTimeout(() => {
      const recipientName = tutors.find((t) => t.userId === receiverId)?.name || "Teacher Response";
      const autoMsg: Message = {
        id: `msg-${messages.length + 2}`,
        senderId: receiverId,
        senderName: recipientName,
        receiverId: currentUser.id,
        text: `Got your message! Let's align on this topic. I will update our schedule log shortly.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, autoMsg]);
    }, 2500);
  };

  const handleSubmitAssignment = (assignmentId: string, submissionUrl: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: "Submitted", submissionUrl, uploadedAt: new Date().toLocaleDateString() }
          : a
      )
    );
    alert("Homework Worksheet PDF submitted to tutor database successfully!");
  };

  const handlePostReview = (tutorId: string, rating: number, text: string) => {
    // Add review and recalculate tutor aggregate score
    setTutors((prev) =>
      prev.map((t) => {
        if (t.id === tutorId) {
          const totalScore = t.rating * t.reviewsCount + rating;
          const newCount = t.reviewsCount + 1;
          return {
            ...t,
            reviewsCount: newCount,
            rating: parseFloat((totalScore / newCount).toFixed(1)),
          };
        }
        return t;
      })
    );

    alert("Thank you! Review logged and tutor score recalculated successfully.");
  };

  const handleToggleWishlist = (tutorId: string) => {
    setWishlist((prev) =>
      prev.includes(tutorId) ? prev.filter((id) => id !== tutorId) : [...prev, tutorId]
    );
  };

  // Tutor Actions callbacks
  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "Upcoming", meetingUrl: "https://meet.google.com/abc-defg-hij" }
          : b
      )
    );
    alert("Student booking approved! Live Google Meet virtual classroom link created.");
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
    // Refund payment if it was regular and locked
    setPayments((prev) =>
      prev.map((p) => (p.bookingId === bookingId ? { ...p, escrowStatus: "Refunded" } : p))
    );
    alert("Student lesson request rejected. Pre-funded escrow returned to student credit card.");
  };

  const handleLogAttendance = (data: { studentId: string; date: string; time: string; status: "Present" | "Absent"; notes: string }) => {
    const newAtt: Attendance = {
      id: `att-${attendance.length + 1}`,
      studentId: data.studentId,
      studentName: bookings.find((b) => b.studentId === data.studentId)?.studentName || "Alex Johnson",
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      date: data.date,
      time: data.time,
      status: data.status,
      notes: data.notes,
    };
    setAttendance((prev) => [newAtt, ...prev]);

    // Automatically trigger booking completion and release of locked escrow funds to prove seamless integration!
    const activeBooking = bookings.find((b) => b.studentId === data.studentId && b.status === "Upcoming");
    if (activeBooking) {
      setBookings((prev) =>
        prev.map((b) => (b.id === activeBooking.id ? { ...b, status: "Completed" } : b))
      );
      setPayments((prev) =>
        prev.map((p) => (p.bookingId === activeBooking.id ? { ...p, escrowStatus: "Released" } : p))
      );
    }
  };

  const handleUploadAssignment = (data: { studentId: string; title: string; description: string; dueDate: string }) => {
    const newAs: Assignment = {
      id: `as-${assignments.length + 1}`,
      studentId: data.studentId,
      studentName: bookings.find((b) => b.studentId === data.studentId)?.studentName || "Alex Johnson",
      tutorId: currentUser.id,
      tutorName: currentUser.name,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: "Pending",
    };
    setAssignments((prev) => [newAs, ...prev]);
    alert("Homework task published to student center.");
  };

  const handleGradeAssignment = (assignmentId: string, grade: string, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId ? { ...a, status: "Graded", grade, feedback } : a
      )
    );
    alert("Homework sheet successfully graded!");
  };

  const handleUpdateTutorProfile = (updatedData: Partial<Tutor>) => {
    setTutors((prev) =>
      prev.map((t) => (t.userId === currentUser.id ? { ...t, ...updatedData } : t))
    );
  };

  // Admin Actions callbacks
  const handleApproveTutor = (tutorId: string) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, verified: "Approved" } : t))
    );
    alert("Tutor successfully approved! The profile is now visible on public directory.");
  };

  const handleRejectTutor = (tutorId: string) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutorId ? { ...t, verified: "Rejected" } : t))
    );
    alert("Tutor credential marked as rejected/suspended.");
  };

  const handleReleaseEscrow = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, escrowStatus: "Released" } : p))
    );
    // Complete booking too
    const pay = payments.find((p) => p.id === paymentId);
    if (pay) {
      setBookings((prev) =>
        prev.map((b) => (b.id === pay.bookingId ? { ...b, status: "Completed" } : b))
      );
    }
    alert("Escrow release confirmed! Funds disbursed to tutor bank.");
  };

  const handleRefundEscrow = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, escrowStatus: "Refunded" } : p))
    );
    const pay = payments.find((p) => p.id === paymentId);
    if (pay) {
      setBookings((prev) =>
        prev.map((b) => (b.id === pay.bookingId ? { ...b, status: "Cancelled" } : b))
      );
    }
    alert("Refund processed successfully. Pre-funded locked custody returned to student card.");
  };

  const handleAddSubject = (subject: string) => {
    setSubjects((prev) => [...prev, subject]);
  };

  const handleAddCity = (city: string) => {
    setCities((prev) => [...prev, city]);
  };

  // Active tutor detail review (modal or inline)
  const [activeReviewTutor, setActiveReviewTutor] = useState<Tutor | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Immersive Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 blur-[160px] rounded-full pointer-events-none"></div>

      {/* PERSISTENT HEADER BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/40 dark:bg-[#020617]/45 border-b border-slate-200/45 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentRoute("home")}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
              EduTutor<span className="text-indigo-500">.</span>
            </span>
          </div>

          {/* Quick links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => setCurrentRoute("home")} className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${currentRoute === "home" ? "text-indigo-600 dark:text-white font-bold" : ""}`}>
              Home Explorer
            </button>
            <button onClick={() => handleUserRoleSwitch("student")} className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${currentRoute === "student-panel" ? "text-indigo-600 dark:text-white font-bold" : ""}`}>
              Student Dashboard
            </button>
            <button onClick={() => handleUserRoleSwitch("tutor")} className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${currentRoute === "tutor-panel" ? "text-indigo-600 dark:text-white font-bold" : ""}`}>
              Tutor Workplace
            </button>
            <button onClick={() => handleUserRoleSwitch("admin")} className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${currentRoute === "admin-panel" ? "text-indigo-600 dark:text-white font-bold" : ""}`}>
              Admin Control
            </button>
          </nav>

          {/* Actions & Role Switcher Dropdown */}
          <div className="flex items-center gap-4">
            
            {/* Quick Testing Dropdown Tool */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">
                Mock View:
              </span>
              <select
                value={currentUser.role}
                onChange={(e) => handleUserRoleSwitch(e.target.value as any)}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="student" className="dark:bg-[#020617] dark:text-white">Student: Alex Johnson</option>
                <option value="tutor" className="dark:bg-[#020617] dark:text-white">Tutor: Dr. Elizabeth Vance</option>
                <option value="admin" className="dark:bg-[#020617] dark:text-white">Admin: SuperAdmin Chief</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Avatar with drop action */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-slate-800">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="text-left hidden lg:block">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 font-semibold uppercase">{currentUser.role} Account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE PAGES PORT ROUTING WITH ANIMATION CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {currentRoute === "home" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                tutors={tutors}
                blogs={INITIAL_BLOGS}
                subjects={subjects}
                cities={cities}
                onBook={(tutor) => {
                  // Swap to student role to book seamlessly
                  handleUserRoleSwitch("student");
                  alert(`Swapped view to Student dashboard. Open the 'Find & Book Tutors' tab to configure times.`);
                }}
                onViewDetails={(tutor) => {
                  setActiveReviewTutor(tutor);
                }}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onBecomeTutor={() => {
                  handleUserRoleSwitch("tutor");
                  alert("Swapped view to Tutor Workspace. Setup your hourly fees and biography details in 'Profile Editing'.");
                }}
              />
            </motion.div>
          )}

          {currentRoute === "student-panel" && (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <StudentPanel
                tutors={tutors}
                bookings={bookings.filter((b) => b.studentId === currentUser.id)}
                assignments={assignments.filter((a) => a.studentId === currentUser.id)}
                attendance={attendance.filter((a) => a.studentId === currentUser.id)}
                payments={payments.filter((p) => p.studentId === currentUser.id)}
                messages={messages}
                studentUser={{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, email: currentUser.email }}
                onNewBooking={handleNewBooking}
                onNewMessage={handleNewMessage}
                onSubmitAssignment={handleSubmitAssignment}
                onPostReview={handlePostReview}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            </motion.div>
          )}

          {currentRoute === "tutor-panel" && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const activeTutorObj = tutors.find((t) => t.userId === currentUser.id);
                if (!activeTutorObj) {
                  return (
                    <div className="glass-panel p-12 rounded-3xl text-center border">
                      <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="font-display font-bold text-lg">No Tutor Profile Linked</h3>
                      <p className="text-xs text-slate-400 mt-2">Could not find a tutor structure matching active session.</p>
                    </div>
                  );
                }
                return (
                  <TutorPanel
                    tutor={activeTutorObj}
                    bookings={bookings.filter((b) => b.tutorId === activeTutorObj.id)}
                    assignments={assignments.filter((a) => a.tutorId === activeTutorObj.id)}
                    attendance={attendance.filter((a) => a.tutorId === activeTutorObj.id)}
                    reviews={INITIAL_MESSAGES.map((m, idx) => ({
                      id: `rev-m-${idx}`,
                      studentId: "student-1",
                      studentName: "Alex Johnson",
                      tutorId: activeTutorObj.id,
                      rating: 5,
                      text: "Highly dedicated teacher. Explains hard mathematical derivations with real simplicity.",
                      createdAt: "2026-07-06",
                    }))}
                    onAcceptBooking={handleAcceptBooking}
                    onRejectBooking={handleRejectBooking}
                    onLogAttendance={handleLogAttendance}
                    onUploadAssignment={handleUploadAssignment}
                    onGradeAssignment={handleGradeAssignment}
                    onUpdateTutorProfile={handleUpdateTutorProfile}
                  />
                );
              })()}
            </motion.div>
          )}

          {currentRoute === "admin-panel" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                tutors={tutors}
                payments={payments}
                subjects={subjects}
                cities={cities}
                onApproveTutor={handleApproveTutor}
                onRejectTutor={handleRejectTutor}
                onReleaseEscrow={handleReleaseEscrow}
                onRefundEscrow={handleRefundEscrow}
                onAddSubject={handleAddSubject}
                onAddCity={handleAddCity}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DETAILED PUBLIC PROFILE / REVIEW DETAILS MODAL */}
      <AnimatePresence>
        {activeReviewTutor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-2xl w-full bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-xl border border-white/20 relative"
            >
              <button
                onClick={() => setActiveReviewTutor(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-6 border-b border-slate-200/50 pb-6 mb-6">
                <img
                  src={activeReviewTutor.avatar}
                  alt={activeReviewTutor.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 p-0.5"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-full uppercase">
                    {activeReviewTutor.verified} Expert
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                    {activeReviewTutor.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{activeReviewTutor.subject}</p>
                  <p className="text-xs text-slate-400 font-semibold">{activeReviewTutor.qualification}</p>
                  <p className="text-[11px] font-bold text-amber-500 flex items-center gap-1 pt-1">
                    ★ {activeReviewTutor.rating} ({activeReviewTutor.reviewsCount} verified reviews)
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                    Teaching Biography
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeReviewTutor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                      Platform Pricing
                    </h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      ${activeReviewTutor.fees} / hour
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                      Primary coverage city
                    </h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {activeReviewTutor.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-6 border-t border-slate-100 mt-6">
                <button
                  onClick={() => setActiveReviewTutor(null)}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-300"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    setActiveReviewTutor(null);
                    handleUserRoleSwitch("student");
                    alert("Swapped view to Student dashboard. Open the 'Find & Book Tutors' tab to configure times.");
                  }}
                  className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-xl"
                >
                  Book 1-on-1 Class
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
