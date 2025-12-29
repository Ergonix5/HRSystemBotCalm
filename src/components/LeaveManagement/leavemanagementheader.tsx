"use client";

import { Calendar, Search, Filter, Plus, Edit, Trash2, ChevronDown, Settings } from "lucide-react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";

const defaultLeaveTypes = [
  { id: 1, name: "Casual Leave", amount: 12 },
  { id: 2, name: "Annual Leave", amount: 21 },
  { id: 3, name: "Sick Leave", amount: 14 },
  { id: 4, name: "Maternity Leave", amount: 90 },
  { id: 5, name: "Paternity Leave", amount: 7 },
  { id: 6, name: "Non-Paid Leave", amount: 0 },
];

export default function LeaveManagementHeader() {
  const [leaveTypes, setLeaveTypes] = useState(defaultLeaveTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedLeaveType, setSelectedLeaveType] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });
  const [showLeaveTypes, setShowLeaveTypes] = useState(false);

  const openDialog = (
    mode: "add" | "edit",
    leaveType: { id: number; name: string; amount: number } | null = null
  ) => {
    setDialogMode(mode);
    setSelectedLeaveType(leaveType);
    if (leaveType) {
      setFormData({ name: leaveType.name, amount: leaveType.amount.toString() });
    } else {
      setFormData({ name: "", amount: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      const newLeaveType = {
        id: Math.max(...leaveTypes.map(lt => lt.id)) + 1,
        name: formData.name,
        amount: parseInt(formData.amount) || 0,
      };
      setLeaveTypes([...leaveTypes, newLeaveType]);
    } else if (dialogMode === "edit") {
      setLeaveTypes(
        leaveTypes.map(lt =>
          lt.id === selectedLeaveType?.id
            ? { ...lt, name: formData.name, amount: parseInt(formData.amount) || 0 }
            : lt
        )
      );
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setLeaveTypes(leaveTypes.filter(lt => lt.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#B91434] to-[#8B0F28] shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Leave Management</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage employee leave requests and approvals
              </p>
            </div>
          </div>
          
          {/* Leave Types Button */}
          <Button
            onClick={() => setShowLeaveTypes(!showLeaveTypes)}
            className="bg-black hover:bg-gray-900 text-white shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Leave Types & Allocations
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showLeaveTypes ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar - Half Width */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search leave requests..." 
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
              <SelectTrigger className="w-[140px] border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {leaveTypes.map(lt => (
                  <SelectItem key={lt.id} value={lt.name.toLowerCase().replace(/\s+/g, '-')}>
                    {lt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Leave Types Configuration Section - Collapsible */}
      {showLeaveTypes && (
        <Card className="p-6 space-y-4 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-black">Leave Types & Allocations</h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Configure leave types and their annual allocations
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={() => openDialog("add")}
              className="bg-[#B91434] hover:bg-[#8B0F28] text-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Leave Type
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveTypes.map((leaveType) => (
              <Card 
                key={leaveType.id} 
                className="p-4 space-y-3 bg-white border-gray-200 shadow-md hover:shadow-xl transition-all duration-200 hover:border-[#B91434] group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-black group-hover:text-[#B91434] transition-colors">
                      {leaveType.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold text-[#B91434]">{leaveType.amount}</span>
                      <span className="text-sm text-gray-600">
                        {leaveType.amount === 1 ? 'day' : 'days'} / year
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-gray-100 hover:text-[#B91434] transition-colors"
                      onClick={() => openDialog("edit", leaveType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-gray-600 hover:bg-red-50 hover:text-[#B91434] transition-colors"
                      onClick={() => handleDelete(leaveType.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">
              {dialogMode === "add" ? "Add Leave Type" : "Edit Leave Type"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {dialogMode === "add"
                ? "Create a new leave type and set its annual allocation."
                : "Update the leave type details and allocation."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black font-medium">Leave Type Name</Label>
              <Input
                id="name"
                placeholder="e.g., Casual Leave"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-gray-300 focus:border-[#B91434] focus:ring-[#B91434]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-black font-medium">Annual Allocation (Days)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 12"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="border-gray-300 focus:border-[#B91434] focus:ring-[#B91434]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#B91434] hover:bg-[#8B0F28] text-white shadow-md"
            >
              {dialogMode === "add" ? "Add" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}