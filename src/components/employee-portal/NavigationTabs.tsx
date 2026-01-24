"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  FileText,
  Clock,
  User,
  Bell,
  BarChart3,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";

// --- Animation Variants ---
const navVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const menuVariants = {
  closed: { scale: 0.95, opacity: 0, y: 20 },
  open: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", duration: 0.4, bounce: 0.3 } 
  }
};

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "request", label: "Request", icon: FileText },
  { key: "history", label: "History", icon: Calendar },
  { key: "hours", label: "Hours", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "profile", label: "Profile", icon: User },
];

export default function NavigationTabs({ activeTab = "dashboard", onTabChange }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { hasUnreadNotifications } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (key: string) => {
    onTabChange?.(key);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* 1. Desktop Navigation with Animated Active Indicator */}
      <nav className="hidden lg:flex items-center justify-center gap-1 mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`relative px-6 py-4 flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
              activeTab === key ? "text-[#B91434]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {activeTab === key && (
              <motion.div 
                layoutId="activeTabDesktop"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B91434]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* 2. Tablet Navigation (Chip Style) */}
      <div className="md:block lg:hidden mb-6 px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map(({ key, label, icon: Icon }) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={key}
              onClick={() => handleTabClick(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-[#B91434] text-white shadow-lg shadow-red-100"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 3. Mobile Floating Bottom Bar */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex items-center justify-around bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-3xl p-2"
      >
        {tabs.slice(0, 4).map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className="relative flex flex-col items-center justify-center flex-1 py-2 outline-none"
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
                className={`${isActive ? "text-[#B91434]" : "text-gray-400"}`}
              >
                <Icon className="h-6 w-6" />
                {key === "notifications" && hasUnreadNotifications && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </motion.div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? "text-[#B91434]" : "text-gray-400"}`}>
                {label}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
            isMenuOpen ? "text-[#B91434]" : "text-gray-400"
          }`}
        >
          <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
          <span className="text-[10px] mt-1 font-bold">More</span>
        </button>
      </motion.nav>

      {/* 4. Mobile More Menu Popover */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden fixed bottom-28 left-4 right-4 z-40 bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Settings</h3>
              <div className="space-y-2">
                {tabs.slice(4).map(({ key, label, icon: Icon }) => (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={key}
                    onClick={() => handleTabClick(key)}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${
                      activeTab === key ? "bg-red-50 text-[#B91434]" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${activeTab === key ? "text-[#B91434]" : "text-gray-400"}`} />
                    <span className="font-semibold">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Scroll to Top - Animated Appearance */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-32 right-6 z-[60] flex items-center justify-center w-12 h-12 bg-[#B91434] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}