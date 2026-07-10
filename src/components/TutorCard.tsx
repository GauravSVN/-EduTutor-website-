import { Star, MapPin, Award, CheckCircle, Heart, Video } from "lucide-react";
import { Tutor } from "../types";
import { motion } from "motion/react";

interface TutorCardProps {
  key?: string;
  tutor: Tutor;
  onBook: (tutor: Tutor) => void;
  onViewDetails: (tutor: Tutor) => void;
  isWishlisted: boolean;
  onToggleWishlist: (tutorId: string) => void;
}

export default function TutorCard({
  tutor,
  onBook,
  onViewDetails,
  isWishlisted,
  onToggleWishlist,
}: TutorCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-lg flex flex-col h-full bg-white/50 dark:bg-white/5 backdrop-blur-3xl relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300"
    >
      {/* Top Background / Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {tutor.verified === "Approved" ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Expert
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
            Verification Pending
          </span>
        )}

        {tutor.videoUrl && (
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-1 rounded-full border border-sky-500/20 backdrop-blur-md">
            <Video className="w-3.5 h-3.5" />
            Demo Video
          </span>
        )}
      </div>

      <button
        onClick={() => onToggleWishlist(tutor.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border border-slate-200/30 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
        title="Toggle Wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            isWishlisted ? "fill-red-500 text-red-500 scale-110" : ""
          }`}
        />
      </button>

      {/* Core Profile Area */}
      <div className="p-6 pt-12 flex flex-col items-stretch text-left border-b border-slate-200/40 dark:border-white/5">
        <div className="relative w-full h-36 bg-gradient-to-br from-indigo-500/10 to-blue-550/10 dark:from-indigo-550/20 dark:to-blue-600/20 rounded-2xl overflow-hidden mb-5 flex items-center justify-center border border-slate-200/20 dark:border-white/5">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-[#020617] shadow-xl"
          />
          <div className="absolute bottom-2 right-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 flex items-center gap-0.5 px-2 py-0.5 rounded-full shadow-sm text-[11px] font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {tutor.rating.toFixed(1)}
          </div>
        </div>

        <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onViewDetails(tutor)}>
          {tutor.name}
        </h3>
        <p className="text-xs font-semibold text-indigo-650 dark:text-indigo-450 mt-1 max-w-full truncate">
          {tutor.subject}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            {tutor.experience} Exp
          </span>
          <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full"></span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {tutor.city}
          </span>
        </div>
      </div>

      {/* Bio / Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-550 dark:text-slate-300 line-clamp-3 leading-relaxed mb-5">
            {tutor.bio}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {tutor.subjectsList.slice(0, 3).map((sub, i) => (
              <span
                key={i}
                className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/5"
              >
                {sub}
              </span>
            ))}
            {tutor.subjectsList.length > 3 && (
              <span className="text-[10px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
                +{tutor.subjectsList.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Hourly Rate
            </p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-150">
              ${tutor.fees}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                {" "}
                / hr
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(tutor)}
              className="text-xs font-bold px-3 py-2 rounded-xl text-slate-650 dark:text-slate-300 border border-slate-300/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => onBook(tutor)}
              className="text-xs font-extrabold bg-gradient-to-r from-indigo-650 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 transition-all"
            >
              Book Class
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
