"use client";

import { Megaphone, Plus, Search, Filter } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function AnnouncementsHeader() {
  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg">
      {/* Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#B91434] to-[#8B0F28] shadow-md">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">Announcements</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Company-wide announcements and important updates
            </p>
          </div>
        </div>
        
        {/* New Announcement Button */}
        <Button className="bg-black hover:bg-gray-900 text-white shadow-md transition-all duration-200 hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar - Half Width */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search announcements..." 
            className="pl-9 border-gray-300 focus:border-[#B91434] focus:ring-[#B91434] bg-white shadow-sm" 
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Filter className="h-4 w-4 text-gray-600" />
          </div>

          <Select>
            <SelectTrigger className="w-[160px] border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="company-a">Company A</SelectItem>
              <SelectItem value="company-b">Company B</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[150px] border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[140px] border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}