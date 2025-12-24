"use client";

import React, { useState, useEffect } from "react";
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

interface NavigationTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    key: "request",
    label: "Request",
    icon: FileText,
  },
  {
    key: "history",
    label: "History",
    icon: Calendar,
  },
  {
    key: "hours",
    label: "Hours",
    icon: Clock,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
];

export default function NavigationTabs({
  activeTab = "dashboard",
  onTabChange,
}: NavigationTabsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { hasUnreadNotifications } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleTabClick = (key: string) => {
    onTabChange?.(key);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-center bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-1 gap-0.5 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? "bg-[#B91434] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className="relative">
              <Icon className="h-4 w-4" />
              {key === "notifications" && hasUnreadNotifications && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Tablet Navigation */}
      <div className="md:block lg:hidden mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-[#B91434] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="relative">
                <Icon className="h-4 w-4" />
                {key === "notifications" && hasUnreadNotifications && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex items-center justify-around bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-2">
        {tabs.slice(0, 4).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
              activeTab === key
                ? "text-[#B91434] bg-red-50"
                : "text-gray-400"
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5 mb-1" />
              {key === "notifications" && hasUnreadNotifications && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
        
        {/* Toggle More Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
            isMenuOpen ? "text-[#B91434] bg-red-50" : "text-gray-400"
          }`}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>

      {/* Mobile Popover Menu (for "More" items) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Account & Settings</p>
            <div className="grid grid-cols-1 gap-2">
              {tabs.slice(4).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={`flex items-center gap-4 w-full p-4 rounded-xl text-left transition-all ${
                    activeTab === key
                      ? "bg-[#B91434] text-white"
                      : "bg-gray-50 text-gray-700 active:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {key === "notifications" && hasUnreadNotifications && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-32 right-6 z- [60] md:bottom-20 flex items-center justify-center w-12 h-12 bg-[#B91434] text-white rounded-full shadow-lg hover:bg-[#A01229] transition-all duration-200"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}