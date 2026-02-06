"use client";

import { useState } from "react";
import { Eye, Edit, Check, X, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import
    {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from "../ui/dropdown-menu";
import
    {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
    } from "../ui/alert-dialog";
import { LeaveRequest } from "./leave-columns";
import { useAuth } from "../../app/store/authStore";
import { PERMS } from "../../app/config/perms";
import { useToast } from "../ui/use-toast";

interface LeaveActionsProps
{
    leave: LeaveRequest;
    onView?: (leave: LeaveRequest) => void;
    onEdit?: (leave: LeaveRequest) => void;
    onApprove?: (leave: LeaveRequest) => void;
    onReject?: (leave: LeaveRequest) => void;
}

export function LeaveActions({
    leave,
    onView,
    onEdit,
    onApprove,
    onReject,
}: LeaveActionsProps)
{
    const { user, has } = useAuth();
    const { toast } = useToast();
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleView = () =>
    {
        if (onView)
        {
            onView(leave);
        } else
        {
            console.log("View leave:", leave);
        }
    };

    const handleEdit = () =>
    {
        if (onEdit)
        {
            onEdit(leave);
        } else
        {
            console.log("Edit leave:", leave);
        }
    };

    const handleApprove = async () =>
    {
        setIsProcessing(true);
        try
        {
            const response = await fetch(`/api/LeaveRequests/${leave.leaveId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    status: "Approved",
                    approver_employee_id: user?.id
                }),
            });

            const result = await response.json();

            if (!response.ok)
            {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message || "Failed to approve leave request",
                });
                return;
            }

            toast({
                variant: "success",
                title: "Success",
                description: "Leave request approved successfully!",
            });

            if (onApprove)
            {
                onApprove(leave);
            }

            // Refresh the page to show updated data
            window.location.reload();
        } catch (error)
        {
            console.error("Error approving leave:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred. Please try again.",
            });
        } finally
        {
            setIsProcessing(false);
            setShowApproveDialog(false);
        }
    };

    const handleReject = async () =>
    {
        setIsProcessing(true);
        try
        {
            const response = await fetch(`/api/LeaveRequests/${leave.leaveId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    status: "Rejected",
                    approver_employee_id: user?.id
                }),
            });

            const result = await response.json();

            if (!response.ok)
            {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message || "Failed to reject leave request",
                });
                return;
            }

            toast({
                variant: "success",
                title: "Success",
                description: "Leave request rejected successfully!",
            });

            if (onReject)
            {
                onReject(leave);
            }

            // Refresh the page to show updated data
            window.location.reload();
        } catch (error)
        {
            console.error("Error rejecting leave:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred. Please try again.",
            });
        } finally
        {
            setIsProcessing(false);
            setShowRejectDialog(false);
        }
    };

    // Check if user can approve/reject (has LEAVE_APPROVE permission)
    const canApprove = has(PERMS.LEAVE_APPROVE);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(leave.leaveId)}
                    >
                        Copy Leave ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleView}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Request
                    </DropdownMenuItem>
                    {leave.status === "Pending" && canApprove && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setShowApproveDialog(true)}
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Approve Request
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setShowRejectDialog(true)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reject Request
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Leave Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve this leave request for{" "}
                            <strong>{leave.name}</strong>?
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Leave Type:</strong> {leave.leaveType}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Duration:</strong> {leave.duration}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Reason:</strong> {leave.reason}
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Approving..." : "Approve"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Leave Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this leave request for{" "}
                            <strong>{leave.name}</strong>?
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Leave Type:</strong> {leave.leaveType}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Duration:</strong> {leave.duration}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Reason:</strong> {leave.reason}
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Rejecting..." : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
