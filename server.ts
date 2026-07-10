import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize server-side Gemini API if key is present
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiApiKey) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.use(express.json());

// ==========================================
// DATABASE / MEMORY STATE FOR COMMERCIAL APP
// ==========================================

// Shared Collections
let users = [
  {
    id: "usr_student1",
    email: "student@tutor.com",
    password: "password123", // Real app would hash, this is standard mock-auth
    name: "Alex Johnson",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 019-2834",
    location: "Chicago",
    joinedAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "usr_tutor1",
    email: "sarah.m@tutor.com",
    password: "password123",
    name: "Dr. Sarah Mitchell",
    role: "tutor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 021-9876",
    location: "New York",
    joinedAt: "2026-02-10T11:30:00Z"
  },
  {
    id: "usr_tutor2",
    email: "james.k@tutor.com",
    password: "password123",
    name: "James Kincaid",
    role: "tutor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 034-5678",
    location: "San Francisco",
    joinedAt: "2026-03-01T14:15:00Z"
  },
  {
    id: "usr_tutor3",
    email: "priya.s@tutor.com",
    password: "password123",
    name: "Priya Sharma",
    role: "tutor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 045-6789",
    location: "Boston",
    joinedAt: "2026-03-12T09:00:00Z"
  },
  {
    id: "usr_admin",
    email: "faithandfocus1717@gmail.com", // Bootstrapped admin email
    password: "adminpassword",
    name: "System Admin",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 999-0001",
    location: "Seattle",
    joinedAt: "2026-01-01T00:00:00Z"
  }
];

let tutors: any[] = [
  {
    id: "tut_1",
    userId: "usr_tutor1",
    name: "Dr. Sarah Mitchell",
    subject: "Advanced Mathematics & Calculus",
    subjectsList: ["Mathematics", "Calculus", "Algebra", "Statistics"],
    classes: ["Class 10", "Class 11", "Class 12", "Undergraduate"],
    qualification: "Ph.D. in Applied Mathematics, Columbia University",
    experience: "12 Years",
    fees: 45, // USD per hour
    rating: 4.9,
    reviewsCount: 38,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    city: "New York",
    gender: "Female",
    bio: "Passionate about making complex mathematical structures intuitive and fun. I specialize in high school prep, college math, and standardized test coaching (SAT/ACT/AP).",
    verified: "Approved", // Approved, Pending, Rejected
    identityProof: "Passport_Sarah_M.pdf",
    degreeCertificate: "PhD_Columbia_Math.pdf",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    availability: {
      Monday: ["15:00 - 17:00", "18:00 - 20:00"],
      Wednesday: ["15:00 - 17:00", "18:00 - 20:00"],
      Friday: ["15:00 - 18:00"]
    }
  },
  {
    id: "tut_2",
    userId: "usr_tutor2",
    name: "James Kincaid",
    subject: "Physics & Chemistry",
    subjectsList: ["Physics", "Chemistry", "General Science"],
    classes: ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    qualification: "M.S. in Physics, Stanford University",
    experience: "6 Years",
    fees: 35,
    rating: 4.8,
    reviewsCount: 22,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    city: "San Francisco",
    gender: "Male",
    bio: "Hands-on virtual experiment setups and visual problem-solving approaches. My goal is to foster actual scientific curiosity, not just rote memorization.",
    verified: "Approved",
    identityProof: "DL_James_Kincaid.pdf",
    degreeCertificate: "MS_Stanford_Physics.pdf",
    videoUrl: "",
    availability: {
      Tuesday: ["16:00 - 19:00"],
      Thursday: ["16:00 - 19:00"],
      Saturday: ["10:00 - 14:00"]
    }
  },
  {
    id: "tut_3",
    userId: "usr_tutor3",
    name: "Priya Sharma",
    subject: "Full-Stack Coding & CS",
    subjectsList: ["Python", "JavaScript", "Computer Science", "React"],
    classes: ["Class 9", "Class 10", "Class 11", "Class 12", "Undergraduate", "Professionals"],
    qualification: "B.Tech in Computer Science, IIT Delhi",
    experience: "8 Years",
    fees: 50,
    rating: 4.95,
    reviewsCount: 47,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    city: "Boston",
    gender: "Female",
    bio: "Former Lead Engineer at a tech startup. Teaching is my true calling. I structure coding paths so students can build real, portfolio-ready web applications from scratch.",
    verified: "Pending", // For testing admin verification
    identityProof: "VoterID_Priya.pdf",
    degreeCertificate: "IIT_CS_Degree.pdf",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    availability: {
      Monday: ["17:00 - 21:00"],
      Tuesday: ["17:00 - 21:00"],
      Thursday: ["17:00 - 21:00"],
      Sunday: ["09:00 - 13:00"]
    }
  }
];

let bookings = [
  {
    id: "b_1",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_1",
    tutorName: "Dr. Sarah Mitchell",
    subject: "Calculus",
    date: "2026-07-12",
    time: "16:00 - 17:00",
    status: "Upcoming", // Upcoming, Completed, Cancelled, Pending
    type: "Regular", // Demo, Regular
    amount: 45,
    meetingUrl: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "b_2",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_2",
    tutorName: "James Kincaid",
    subject: "Physics",
    date: "2026-07-15",
    time: "17:00 - 18:00",
    status: "Pending",
    type: "Demo",
    amount: 0,
    meetingUrl: ""
  }
];

let payments = [
  {
    id: "pay_1",
    bookingId: "b_1",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_1",
    tutorName: "Dr. Sarah Mitchell",
    amount: 45,
    escrowStatus: "Held", // Held, Released, Refunded
    paymentMethod: "Stripe",
    transactionId: "ch_stripe_283918293",
    createdAt: "2026-07-08T10:00:00Z"
  }
];

let messages = [
  {
    id: "msg_1",
    senderId: "usr_student1",
    senderName: "Alex Johnson",
    receiverId: "usr_tutor1",
    text: "Hello Dr. Mitchell, I am excited about our Calculus lesson this Sunday!",
    timestamp: "2026-07-09T18:30:00Z"
  },
  {
    id: "msg_2",
    senderId: "usr_tutor1",
    senderName: "Dr. Sarah Mitchell",
    receiverId: "usr_student1",
    text: "Hello Alex! I look forward to it. Please review the basic derivatives formula sheet before we begin.",
    timestamp: "2026-07-09T19:00:00Z"
  }
];

let assignments = [
  {
    id: "as_1",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_1",
    tutorName: "Dr. Sarah Mitchell",
    title: "Limits and Continuous Functions Sheet 1",
    description: "Complete all questions in section B and upload your step-by-step solution PDF.",
    dueDate: "2026-07-14",
    status: "Pending", // Pending, Submitted, Graded
    submissionUrl: "",
    grade: "",
    feedback: "",
    uploadedAt: "2026-07-08T12:00:00Z"
  }
];

let attendance = [
  {
    id: "att_1",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_1",
    tutorName: "Dr. Sarah Mitchell",
    date: "2026-07-05",
    time: "16:00 - 17:00",
    status: "Present", // Present, Absent
    notes: "Active participation in solving differential equations."
  }
];

let reviews = [
  {
    id: "rev_1",
    studentId: "usr_student1",
    studentName: "Alex Johnson",
    tutorId: "tut_1",
    rating: 5,
    text: "Dr. Sarah is incredible. She made calculus so straightforward in just one session!",
    createdAt: "2026-06-28T15:00:00Z"
  }
];

// CMS / Settings
let subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English Lit", "History", "Spanish"];
let cities = ["New York", "San Francisco", "Boston", "Chicago", "Seattle", "Austin", "Miami"];
let blogs = [
  {
    id: "bl_1",
    title: "10 Proven Strategies to Ace AP Calculus",
    author: "Dr. Sarah Mitchell",
    category: "Study Guides",
    readTime: "5 min read",
    snippet: "From understanding limits conceptually to mastering integration methods, explore the keys to a 5.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-06-15"
  },
  {
    id: "bl_2",
    title: "How Coding Builds Computational Thinking in High Schoolers",
    author: "Priya Sharma",
    category: "Technology",
    readTime: "7 min read",
    snippet: "Why starting with Python and hands-on modular design develops general problem-solving rigor.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
    createdAt: "2026-06-25"
  }
];

// Wishlist
let studentWishlist = {
  usr_student1: ["tut_2"] // Array of tutor IDs
};

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Helper for finding a user by auth
const authenticateUser = (req: express.Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  return users.find((u) => u.id === token);
};

// --- AUTHENTICATION ROUTES ---

app.post("/api/auth/register", (req, res) => {
  const { email, password, name, role, phone, location } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const newUser = {
    id: `usr_${Math.random().toString(36).substring(2, 11)}`,
    email,
    password,
    name,
    role,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    phone: phone || "",
    location: location || "Chicago",
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);

  // If role is tutor, create a basic pending tutor profile
  if (role === "tutor") {
    tutors.push({
      id: `tut_${Math.random().toString(36).substring(2, 11)}`,
      userId: newUser.id,
      name: newUser.name,
      subject: "Science & Mathematics Helper",
      subjectsList: ["Mathematics", "General Science"],
      classes: ["Class 8", "Class 9", "Class 10"],
      qualification: "College Degree (Pending Submission)",
      experience: "1 Year",
      fees: 25,
      rating: 5.0,
      reviewsCount: 0,
      avatar: newUser.avatar,
      city: newUser.location,
      gender: "Male",
      bio: "Excited to meet students and help improve grades, clarify complex math formulas, and design simple coding worksheets.",
      verified: "Pending",
      identityProof: "DL_Pending.pdf",
      degreeCertificate: "Degree_Pending.pdf",
      videoUrl: "",
      availability: {
        Monday: ["16:00 - 18:00"],
        Friday: ["16:00 - 18:00"]
      }
    });
  }

  res.json({
    message: "Registration successful. Welcome to Home Tutor Platform!",
    token: newUser.id,
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, avatar: newUser.avatar }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    token: user.id,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
  });
});

app.get("/api/auth/me", (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  res.json({ user });
});

// --- TUTOR PROFILE ROUTES ---

app.get("/api/tutors", (req, res) => {
  // Returns all tutors, supports extensive filters
  const { subject, city, gender, verified, maxFees, query } = req.query;
  
  let result = [...tutors];

  if (subject) {
    result = result.filter((t) => t.subjectsList.some((s) => s.toLowerCase() === (subject as string).toLowerCase()));
  }
  if (city) {
    result = result.filter((t) => t.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (gender) {
    result = result.filter((t) => t.gender.toLowerCase() === (gender as string).toLowerCase());
  }
  if (verified) {
    result = result.filter((t) => t.verified === verified);
  }
  if (maxFees) {
    result = result.filter((t) => t.fees <= Number(maxFees));
  }
  if (query) {
    const q = (query as string).toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get("/api/tutors/:id", (req, res) => {
  const tutor = tutors.find((t) => t.id === req.params.id);
  if (!tutor) {
    return res.status(404).json({ error: "Tutor profile not found." });
  }
  const tutorReviews = reviews.filter((r) => r.tutorId === tutor.id);
  res.json({ tutor, reviews: tutorReviews });
});

app.put("/api/tutors/profile", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "tutor") {
    return res.status(403).json({ error: "Unauthorized. Tutor role required." });
  }

  const tutorIndex = tutors.findIndex((t) => t.userId === user.id);
  if (tutorIndex === -1) {
    return res.status(404).json({ error: "Tutor profile not found." });
  }

  const updatedProfile = { ...tutors[tutorIndex], ...req.body };
  tutors[tutorIndex] = updatedProfile;

  res.json({ message: "Profile updated successfully.", tutor: updatedProfile });
});

// --- BOOKING ROUTES ---

app.get("/api/bookings", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === "student") {
    res.json(bookings.filter((b) => b.studentId === user.id));
  } else if (user.role === "tutor") {
    const tutor = tutors.find((t) => t.userId === user.id);
    if (!tutor) return res.json([]);
    res.json(bookings.filter((b) => b.tutorId === tutor.id));
  } else {
    res.json(bookings); // Admin sees all
  }
});

app.post("/api/bookings", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "student") {
    return res.status(403).json({ error: "Only students can book tutors." });
  }

  const { tutorId, subject, date, time, type } = req.body;
  if (!tutorId || !subject || !date || !time) {
    return res.status(400).json({ error: "Missing required scheduling fields." });
  }

  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor) return res.status(404).json({ error: "Tutor not found." });

  const amount = type === "Demo" ? 0 : tutor.fees;

  const newBooking = {
    id: `b_${Math.random().toString(36).substring(2, 11)}`,
    studentId: user.id,
    studentName: user.name,
    tutorId: tutor.id,
    tutorName: tutor.name,
    subject,
    date,
    time,
    status: type === "Demo" ? "Pending" : "Upcoming",
    type: type || "Regular",
    amount,
    meetingUrl: type === "Demo" ? "" : "https://meet.google.com/abc-defg-hij"
  };

  bookings.push(newBooking);

  if (amount > 0) {
    payments.push({
      id: `pay_${Math.random().toString(36).substring(2, 11)}`,
      bookingId: newBooking.id,
      studentId: user.id,
      studentName: user.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      amount,
      escrowStatus: "Held",
      paymentMethod: "Razorpay",
      transactionId: `ch_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString()
    });
  }

  res.json({ message: "Booking created successfully!", booking: newBooking });
});

app.post("/api/bookings/:id/action", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { action } = req.body; // Accept, Reject, Complete, Cancel
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  if (action === "Accept") {
    booking.status = "Upcoming";
    booking.meetingUrl = "https://meet.google.com/xyz-pdqr-zcs";
  } else if (action === "Reject") {
    booking.status = "Cancelled";
  } else if (action === "Complete") {
    booking.status = "Completed";
    // Release payment if completed automatically or held in escrow
    const pay = payments.find((p) => p.bookingId === booking.id);
    if (pay) pay.escrowStatus = "Released";
  } else if (action === "Cancel") {
    booking.status = "Cancelled";
    const pay = payments.find((p) => p.bookingId === booking.id);
    if (pay) pay.escrowStatus = "Refunded";
  }

  res.json({ message: `Booking status updated to ${booking.status}`, booking });
});

// --- ASSIGNMENTS & HOMEWORK ---

app.get("/api/assignments", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === "student") {
    res.json(assignments.filter((a) => a.studentId === user.id));
  } else if (user.role === "tutor") {
    const tutor = tutors.find((t) => t.userId === user.id);
    if (!tutor) return res.json([]);
    res.json(assignments.filter((a) => a.tutorId === tutor.id));
  } else {
    res.json(assignments);
  }
});

app.post("/api/assignments", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "tutor") {
    return res.status(403).json({ error: "Only tutors can create assignments." });
  }

  const { studentId, title, description, dueDate } = req.body;
  const tutor = tutors.find((t) => t.userId === user.id);
  if (!tutor) return res.status(404).json({ error: "Tutor profile not found." });

  const studentUser = users.find((u) => u.id === studentId);
  if (!studentUser) return res.status(404).json({ error: "Student not found." });

  const newAssignment = {
    id: `as_${Math.random().toString(36).substring(2, 11)}`,
    studentId,
    studentName: studentUser.name,
    tutorId: tutor.id,
    tutorName: tutor.name,
    title,
    description,
    dueDate,
    status: "Pending",
    submissionUrl: "",
    grade: "",
    feedback: "",
    uploadedAt: new Date().toISOString()
  };

  assignments.push(newAssignment);
  res.json({ message: "Assignment uploaded successfully!", assignment: newAssignment });
});

app.post("/api/assignments/:id/submit", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "student") {
    return res.status(403).json({ error: "Only students can submit assignments." });
  }

  const assignment = assignments.find((a) => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ error: "Assignment not found." });

  const { submissionUrl } = req.body;
  assignment.status = "Submitted";
  assignment.submissionUrl = submissionUrl || "https://cloudinary.com/sample_submission.pdf";

  res.json({ message: "Assignment submitted successfully!", assignment });
});

app.post("/api/assignments/:id/grade", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "tutor") {
    return res.status(403).json({ error: "Only tutors can grade assignments." });
  }

  const assignment = assignments.find((a) => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ error: "Assignment not found." });

  const { grade, feedback } = req.body;
  assignment.status = "Graded";
  assignment.grade = grade;
  assignment.feedback = feedback || "";

  res.json({ message: "Assignment graded successfully!", assignment });
});

// --- ATTENDANCE ROUTES ---

app.get("/api/attendance", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === "student") {
    res.json(attendance.filter((a) => a.studentId === user.id));
  } else if (user.role === "tutor") {
    const tutor = tutors.find((t) => t.userId === user.id);
    if (!tutor) return res.json([]);
    res.json(attendance.filter((a) => a.tutorId === tutor.id));
  } else {
    res.json(attendance);
  }
});

app.post("/api/attendance", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "tutor") {
    return res.status(403).json({ error: "Only tutors can log attendance." });
  }

  const { studentId, date, time, status, notes } = req.body;
  const tutor = tutors.find((t) => t.userId === user.id);
  if (!tutor) return res.status(404).json({ error: "Tutor profile not found." });

  const studentUser = users.find((u) => u.id === studentId);
  const name = studentUser ? studentUser.name : "Student";

  const newLog = {
    id: `att_${Math.random().toString(36).substring(2, 11)}`,
    studentId,
    studentName: name,
    tutorId: tutor.id,
    tutorName: tutor.name,
    date,
    time,
    status,
    notes: notes || ""
  };

  attendance.push(newLog);
  res.json({ message: "Attendance logged successfully!", attendance: newLog });
});

// --- CHAT ENDPOINTS ---

app.get("/api/chat", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const chatMessages = messages.filter((m) => m.senderId === user.id || m.receiverId === user.id);
  res.json(chatMessages);
});

app.post("/api/chat", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { receiverId, text } = req.body;
  if (!receiverId || !text) {
    return res.status(400).json({ error: "Receiver and text required." });
  }

  const receiver = users.find((u) => u.id === receiverId);
  const rName = receiver ? receiver.name : "User";

  const newMsg = {
    id: `msg_${Math.random().toString(36).substring(2, 11)}`,
    senderId: user.id,
    senderName: user.name,
    receiverId,
    text,
    timestamp: new Date().toISOString()
  };

  messages.push(newMsg);
  res.json(newMsg);
});

// --- WISHLIST ---

app.get("/api/wishlist", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.json([]);
  const list = studentWishlist[user.id as keyof typeof studentWishlist] || [];
  res.json(list);
});

app.post("/api/wishlist/toggle", (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { tutorId } = req.body;
  if (!tutorId) return res.status(400).json({ error: "Tutor ID is required." });

  const currentList = studentWishlist[user.id as keyof typeof studentWishlist] || [];
  let updatedList = [];

  if (currentList.includes(tutorId)) {
    updatedList = currentList.filter((id) => id !== tutorId);
  } else {
    updatedList = [...currentList, tutorId];
  }

  studentWishlist[user.id as keyof typeof studentWishlist] = updatedList;
  res.json({ message: "Wishlist updated successfully", wishlist: updatedList });
});

// --- REVIEWS & RATINGS ---

app.post("/api/reviews", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "student") {
    return res.status(403).json({ error: "Only logged-in students can leave reviews." });
  }

  const { tutorId, rating, text } = req.body;
  if (!tutorId || !rating) {
    return res.status(400).json({ error: "Tutor ID and rating required." });
  }

  const newReview = {
    id: `rev_${Math.random().toString(36).substring(2, 11)}`,
    studentId: user.id,
    studentName: user.name,
    tutorId,
    rating: Number(rating),
    text: text || "",
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);

  // Recalculate tutor rating
  const tutor = tutors.find((t) => t.id === tutorId);
  if (tutor) {
    const tutorReviews = reviews.filter((r) => r.tutorId === tutorId);
    const sum = tutorReviews.reduce((acc, r) => acc + r.rating, 0);
    tutor.rating = Number((sum / tutorReviews.length).toFixed(2));
    tutor.reviewsCount = tutorReviews.length;
  }

  res.json({ message: "Review posted successfully!", review: newReview });
});

// --- ADMIN CONTROL ENDPOINTS ---

app.get("/api/admin/dashboard", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin resource only." });
  }

  // Calculate statistics
  const totalRevenue = payments
    .filter((p) => p.escrowStatus !== "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const heldInEscrow = payments
    .filter((p) => p.escrowStatus === "Held")
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    metrics: {
      revenue: totalRevenue,
      escrow: heldInEscrow,
      studentsCount: users.filter((u) => u.role === "student").length,
      tutorsCount: tutors.length,
      bookingsCount: bookings.length,
      pendingVerificationsCount: tutors.filter((t) => t.verified === "Pending").length
    },
    bookingsSummary: bookings,
    tutorsList: tutors,
    studentsList: users.filter((u) => u.role === "student"),
    paymentsList: payments
  });
});

app.post("/api/admin/tutors/:id/verify", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }

  const { status } = req.body; // Approved, Suspended, Rejected
  const tutor = tutors.find((t) => t.id === req.params.id);
  if (!tutor) return res.status(404).json({ error: "Tutor profile not found." });

  tutor.verified = status;
  res.json({ message: `Tutor verification status set to ${status}`, tutor });
});

app.post("/api/admin/payments/:id/escrow", (req, res) => {
  const user = authenticateUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }

  const { action } = req.body; // Release, Refund
  const pay = payments.find((p) => p.id === req.params.id);
  if (!pay) return res.status(404).json({ error: "Payment not found." });

  if (action === "Release") {
    pay.escrowStatus = "Released";
  } else if (action === "Refund") {
    pay.escrowStatus = "Refunded";
    // Also cancel the associated booking
    const booking = bookings.find((b) => b.id === pay.bookingId);
    if (booking) booking.status = "Cancelled";
  }

  res.json({ message: `Escrow payment has been ${pay.escrowStatus}`, payment: pay });
});

app.post("/api/admin/cms/subjects", (req, res) => {
  const { subject } = req.body;
  if (!subject) return res.status(400).json({ error: "Subject title required." });
  if (!subjects.includes(subject)) {
    subjects.push(subject);
  }
  res.json(subjects);
});

app.post("/api/admin/cms/cities", (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City name required." });
  if (!cities.includes(city)) {
    cities.push(city);
  }
  res.json(cities);
});

app.get("/api/cms/meta", (req, res) => {
  res.json({ subjects, cities, blogs });
});

// ==========================================
// AI-POWERED MATCHMAKER ENDPOINT
// ==========================================

app.post("/api/ai/match", async (req, res) => {
  const { requirement, preferredSubject, preferredCity, budgetLimit } = req.body;

  if (!requirement) {
    return res.status(400).json({ error: "Please enter your search requirement for the AI Matcher." });
  }

  // Construct a prompt context of our actual tutors to provide grounding
  const activeTutors = tutors.filter((t) => t.verified === "Approved");
  const tutorContextString = activeTutors
    .map(
      (t) =>
        `Tutor ID: ${t.id}\nName: ${t.name}\nSubject Specialization: ${t.subject}\nSubjects Taught: ${t.subjectsList.join(
          ", "
        )}\nClasses: ${t.classes.join(", ")}\nCity: ${t.city}\nGender: ${t.gender}\nQualifications: ${t.qualification}\nExperience: ${t.experience}\nHourly Fee: $${t.fees}\nRating: ${t.rating}\nBio Summary: ${t.bio}\n`
    )
    .join("\n---\n");

  const prompt = `
You are the Premium AI Matching Engine of a Home Tutor Marketplace.
Your task is to analyze the student's learning requirement, subject, budget limit, and city, and recommend the best matching tutor(s) from our active vetted directory.

STUDENT REQUIREMENT: "${requirement}"
PREFERRED SUBJECT: "${preferredSubject || "Any"}"
PREFERRED CITY: "${preferredCity || "Any"}"
BUDGET LIMIT: ${budgetLimit ? `$${budgetLimit}/hr` : "No limit"}

vetted ACTIVE DIRECTORY:
${tutorContextString}

INSTRUCTIONS:
1. Identify the most matching tutor(s) based on Subject compatibility first, then experience/qualification, and then budget/city.
2. Provide a polite, structured commercial-grade recommendation report.
3. For each recommended tutor, give:
   - Match Score (percentage)
   - Specific reasons for the match based on their bio and experience.
   - Recommended next action (e.g. "Book a free 1-hour demo class with Dr. Sarah Mitchell to align schedules").
4. If there is no exact tutor match for a subject, state how our platform can support them or recommend the closest match.
5. Do NOT output markdown code blocks like \`\`\`json. Output clean, friendly paragraphs, bullet points, and an explicit match breakdown. Keep it highly encouraging, premium, and professional.
`;

  try {
    if (!ai) {
      // Fallback if GEMINI_API_KEY is not defined
      return res.json({
        recommendations: [
          {
            tutorId: "tut_1",
            matchScore: 95,
            reason: "Dr. Sarah Mitchell is an absolute perfect match. She is based in New York and holds a Ph.D. in Applied Mathematics. Her extensive 12-year high-school prep experience matches your calculus focus, and her fee is within reasonable ranges.",
            action: "We recommend booking an introductory session."
          }
        ],
        rawText: `### AI Tutor Matching Report (Demo Mode)\n\nBased on your requirement: **"${requirement}"**, we highly recommend **Dr. Sarah Mitchell**!\n\n- **Match Score**: 95%\n- **Experience Alignment**: Dr. Sarah holds a Ph.D. from Columbia and has 12 years of tutoring algebra and AP Calculus.\n- **Recommended Next Step**: Book a Demo session with Dr. Sarah via your student panel.`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const recommendationText = response.text || "No response received from AI Matchmaker.";

    res.json({
      rawText: recommendationText
    });
  } catch (error) {
    console.error("AI matching failed:", error);
    res.status(500).json({ error: "AI matching engine failed to synthesize recommendations." });
  }
});

// ==========================================
// VITE DEV SERVER & PRODUCTION ASSET STATIC SERVING
// ==========================================

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with Static Assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduTutor Home Tutor Platform active at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to boot full stack server:", err);
});
