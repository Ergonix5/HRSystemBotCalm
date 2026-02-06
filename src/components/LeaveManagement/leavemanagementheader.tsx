"use client";

import { Calendar, Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../app/store/authStore";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import
  {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import
  {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "../ui/dialog";
import { Label } from "../ui/label";
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";
import { PermissionCheck } from "../PermissionCheck";
import { PERMS } from "../../app/config/perms";

const defaultLeaveTypes = [
  { id: 1, name: "Casual Leave", amount: 12 },
  { id: 2, name: "Annual Leave", amount: 21 },
  { id: 3, name: "Sick Leave", amount: 14 },
  { id: 4, name: "Maternity Leave", amount: 90 },
  { id: 5, name: "Paternity Leave", amount: 7 },
  { id: 6, name: "Non-Paid Leave", amount: 0 },
];

interface LeaveManagementHeaderProps
{
  onCompanyChange?: (companyId: string) => void;
  onStatusChange?: (status: string) => void;
  onLeaveTypeChange?: (leaveType: string) => void;
}

export default function LeaveManagementHeader({
  onCompanyChange,
  onStatusChange,
  onLeaveTypeChange
}: LeaveManagementHeaderProps = {})
{
  const { user, has } = useAuth();
  const { toast } = useToast();
  const [leaveTypes, setLeaveTypes] = useState(defaultLeaveTypes);
  const [companies, setCompanies] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLeaveTypeFilter, setSelectedLeaveTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedLeaveType, setSelectedLeaveType] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });

  // Fetch leave types from API based on selected company
  useEffect(() =>
  {
    const fetchLeaveTypes = async () =>
    {
      // Determine which organization to fetch leave types for
      const orgId = selectedCompany !== "all" ? selectedCompany : user?.organization_id;

      if (!orgId) return;

      try
      {
        setLoading(true);
        const response = await fetch(
          `/api/LeaveType?organizationId=${orgId}&limit=100`,
          { credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch leave types");

        const result = await response.json();

        // Transform API data to match our interface
        const transformedData = result.data.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name,
          amount: item.anual_allocation || 0,
          _id: item._id, // Keep the MongoDB ID for API operations
          leave_type_id: item.leave_type_id,
          organization: item.organization,
        }));

        setLeaveTypes(transformedData);
      } catch (error)
      {
        console.error("Error fetching leave types:", error);
        // Keep default data on error
      } finally
      {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, [user?.organization_id, selectedCompany]);

  // Fetch companies/organizations - Only for users with leave.view_all permission
  useEffect(() =>
  {
    const fetchCompanies = async () =>
    {
      // Only fetch if user has permission to view all organizations
      if (!has(PERMS.LEAVE_VIEW_ALL)) return;

      try
      {
        const response = await fetch(
          `/api/Organization?limit=100`,
          { credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch companies");

        const result = await response.json();
        setCompanies(result.data || []);
      } catch (error)
      {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [user?.organization_id]);

  const openDialog = (
    mode: "add" | "edit",
    leaveType: { id: number; name: string; amount: number } | null = null
  ) =>
  {
    setDialogMode(mode);
    setSelectedLeaveType(leaveType);
    if (leaveType)
    {
      setFormData({ name: leaveType.name, amount: leaveType.amount.toString() });
    } else
    {
      setFormData({ name: "", amount: "" });
    }
    setIsDialogOpen(true);
  };

  const fetchLeaveTypesData = async () =>
  {
    // Determine which organization to fetch leave types for
    const orgId = selectedCompany !== "all" ? selectedCompany : user?.organization_id;

    if (!orgId) return;

    try
    {
      setLoading(true);
      const response = await fetch(
        `/api/LeaveType?organizationId=${orgId}&limit=100`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch leave types");

      const result = await response.json();

      const transformedData = result.data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        amount: item.anual_allocation || 0,
        _id: item._id,
        leave_type_id: item.leave_type_id,
        organization: item.organization,
      }));

      setLeaveTypes(transformedData);
    } catch (error)
    {
      console.error("Error fetching leave types:", error);
    } finally
    {
      setLoading(false);
    }
  };

  const handleSave = async () =>
  {
    // Determine which organization to use
    const orgId = selectedCompany !== "all" ? selectedCompany : user?.organization_id;

    if (!orgId)
    {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Organization ID not found",
      });
      return;
    }

    if (!formData.name.trim() || !formData.amount)
    {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try
    {
      if (dialogMode === "add")
      {
        // Generate a unique leave_type_id
        const leaveTypeId = `LT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch("/api/LeaveType", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            organization: orgId,
            leave_type_id: leaveTypeId,
            name: formData.name.trim(),
            description: "",
            anual_allocation: parseInt(formData.amount) || 0,
          }),
        });

        const result = await response.json();

        if (!response.ok)
        {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to create leave type",
          });
          return;
        }

        toast({
          variant: "success",
          title: "Success",
          description: "Leave type created successfully!",
        });
      } else if (dialogMode === "edit" && selectedLeaveType)
      {
        const leaveTypeData: any = leaveTypes.find(lt => lt.id === selectedLeaveType.id);

        if (!leaveTypeData?._id)
        {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Leave type ID not found",
          });
          return;
        }

        const response = await fetch(`/api/LeaveType/${leaveTypeData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            organization: orgId,
            leave_type_id: leaveTypeData.leave_type_id,
            name: formData.name.trim(),
            description: "",
            anual_allocation: parseInt(formData.amount) || 0,
          }),
        });

        const result = await response.json();

        if (!response.ok)
        {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to update leave type",
          });
          return;
        }

        toast({
          variant: "success",
          title: "Success",
          description: "Leave type updated successfully!",
        });
      }

      // Refetch leave types to update the UI
      await fetchLeaveTypesData();
      setIsDialogOpen(false);
      setFormData({ name: "", amount: "" });
    } catch (error)
    {
      console.error("Error saving leave type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const handleDelete = async (id: number) =>
  {
    // Determine which organization to use
    const orgId = selectedCompany !== "all" ? selectedCompany : user?.organization_id;

    if (!orgId)
    {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Organization ID not found",
      });
      return;
    }

    const leaveTypeData: any = leaveTypes.find(lt => lt.id === id);

    if (!leaveTypeData?._id)
    {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Leave type ID not found",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${leaveTypeData.name}"?`))
    {
      return;
    }

    try
    {
      const response = await fetch(
        `/api/LeaveType/${leaveTypeData._id}?organizationId=${orgId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok)
      {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to delete leave type",
        });
        return;
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Leave type deleted successfully!",
      });

      // Refetch leave types to update the UI
      await fetchLeaveTypesData();
    } catch (error)
    {
      console.error("Error deleting leave type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* <div className="p-2.5 rounded-xl bg-black shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div> */}
            <div>
              <h2 className="text-2xl font-bold text-black">Leave Management</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage employee leave requests and approvals
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          {/* Search Bar - Half Width */}
          <div className="relative flex-1 min-w-50 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leave requests..."
              className="pl-9 rounded-md border-gray-300 focus:border-[#B91434] focus:ring-[#B91434] bg-white shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Filter className="h-4 w-4 text-gray-600" />
            </div>

            {/* Company Filter - Only visible to HR/Admin with leave.view_all */}
            {has(PERMS.LEAVE_VIEW_ALL) && (
              <Select value={selectedCompany} onValueChange={(value) =>
              {
                setSelectedCompany(value);
                setSelectedLeaveTypeFilter("all"); // Reset leave type filter when company changes
                onCompanyChange?.(value);
                onLeaveTypeChange?.("all"); // Notify parent about reset
              }}>
                <SelectTrigger className="w-[160px] rounded-md border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedLeaveTypeFilter} onValueChange={(value) =>
            {
              setSelectedLeaveTypeFilter(value);
              onLeaveTypeChange?.(value);
            }}>
              <SelectTrigger className="w-[140px] rounded-md border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
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

            <Select value={selectedStatus} onValueChange={(value) =>
            {
              setSelectedStatus(value);
              onStatusChange?.(value);
            }}>
              <SelectTrigger className="w-[140px] rounded-md border-gray-300 bg-white shadow-sm hover:border-[#B91434] transition-colors">
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

      {/* Leave Types Configuration Section */}
      <PermissionCheck permission={PERMS.LEAVE_MANAGE_TYPES}>
        <Card className="p-6 space-y-4 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg">
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

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-auto max-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading leave types...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-bold text-black">Leave Type</TableHead>
                    <TableHead className="font-bold text-black text-center">Annual Allocation</TableHead>
                    <TableHead className="font-bold text-black text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((leaveType) => (
                    <TableRow
                      key={leaveType.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-black">
                        {leaveType.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#B91434]">
                            {leaveType.amount}
                          </span>
                          <span className="text-sm text-gray-600">
                            {leaveType.amount === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </PermissionCheck>

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