export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "tutor" | "admin";
  avatar: string;
  phone?: string;
  location?: string;
  joinedAt?: string;
}

export interface Tutor {
  id: string;
  userId: string;
  name: string;
  subject: string;
  subjectsList: string[];
  classes: string[];
  qualification: string;
  experience: string;
  fees: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  city: string;
  gender: string;
  bio: string;
  verified: "Approved" | "Pending" | "Rejected" | "Suspended";
  identityProof?: string;
  degreeCertificate?: string;
  videoUrl?: string;
  availability: Record<string, string[]>;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  status: "Pending" | "Upcoming" | "Completed" | "Cancelled";
  type: "Demo" | "Regular";
  amount: number;
  meetingUrl?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  amount: number;
  escrowStatus: "Held" | "Released" | "Refunded";
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  title: string;
  description: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  submissionUrl?: string;
  grade?: string;
  feedback?: string;
  uploadedAt?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  date: string;
  time: string;
  status: "Present" | "Absent";
  notes?: string;
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  snippet: string;
  image: string;
  createdAt: string;
}
