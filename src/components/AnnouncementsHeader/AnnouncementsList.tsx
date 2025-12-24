"use client";

import { useState } from "react";

import {
  AlertCircle,
  Pencil,
  Trash2,
  ChevronDown,
  Building2,
  CalendarDays,
  Clock,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  body: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Expired";
  company: string;
  publishedOn: string;
  expiresOn: string;
  updatedOn: string;
}

const mockAnnouncements: Announcement[] = Array.from({ length: 7 }, (_, i) => ({
  id: `ANN-00${i + 1}`,
  title: "IT System Maintenance",
  description: "Scheduled maintenance window this weekend",
  body: "The IT team will perform system maintenance this Saturday from 10 PM to 2 AM. Email and internal systems may be temporarily unavailable.",
  priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
  status: i % 2 === 0 ? "Active" : "Expired",
  company: "Global Innovations Ltd.",
  publishedOn: "Dec 8, 2024",
  expiresOn: "Dec 15, 2024",
  updatedOn: "Dec 8, 2024, 03:00 PM",
}));

export default function AnnouncementsList() {
  return (
    <div className="space-y-4 pb-4">
      {mockAnnouncements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [open, setOpen] = useState(false);

  const getPriorityStyles = () => {
    switch (announcement.priority) {
      case "High":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200";
      case "Medium":
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
      case "Low":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200";
    }
  };

  const getPriorityBadgeStyles = () => {
    switch (announcement.priority) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-orange-500 text-white";
      case "Low":
        return "bg-blue-500 text-white";
    }
  };

  const getStatusStyles = () => {
    return announcement.status === "Active"
      ? "bg-green-500 text-white"
      : "bg-gray-400 text-white";
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getPriorityStyles()} shadow-md hover:shadow-lg transition-all duration-200 hover:border-[#B91434] group`}
    >
      {/* Compact Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Title and Description */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#B91434] to-[#8B0F28] shadow-sm">
              <AlertCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black text-sm truncate group-hover:text-[#B91434] transition-colors">
                {announcement.title}
              </h3>
              <p className="text-xs text-gray-500">{announcement.description}</p>
            </div>
          </div>

          {/* Inline Info */}
          <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-gray-400" />
              <span>{announcement.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-gray-400" />
              <span>{announcement.publishedOn}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-black">
                Expires: {announcement.expiresOn}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 text-xs rounded-md hover:bg-[#B91434] hover:text-white transition-colors font-medium flex items-center gap-1 text-gray-700">
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button className="h-7 px-3 text-xs rounded-md hover:bg-red-600 hover:text-white transition-colors font-medium flex items-center gap-1 text-gray-700">
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityBadgeStyles()}`}
          >
            {announcement.priority}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusStyles()}`}
          >
            {announcement.status}
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs font-medium text-[#B91434] hover:text-[#8B0F28] transition-colors"
        >
          {open ? "Less" : "Details"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Section */}
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-300 space-y-3 animate-in slide-in-from-top-2 duration-300">
          {/* Body */}
          <div className="rounded-lg bg-white border border-gray-200 p-3">
            <p className="text-xs font-semibold text-black mb-1">Details</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {announcement.body}
            </p>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <span>
                <span className="font-medium text-black">ID:</span>{" "}
                {announcement.id}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>
                <span className="font-medium text-black">Updated:</span>{" "}
                {announcement.updatedOn}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}