"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import React from "react"

interface Detail {
  label: string
  value: string | number
  primary?: boolean
  isStatus?: boolean
  isImage?: boolean
}

interface DetailsModalProps {
  title: string
  subtitle?: string
  isOpen: boolean
  onClose: () => void
  details: Detail[]
  headerImage?: string
}

export function DetailsModal({
  title,
  subtitle,
  isOpen,
  onClose,
  details,
  headerImage,
}: DetailsModalProps) {
  const StatusBadge = ({ status }: { status: string }) => {
    const active = status.toLowerCase() === "active"
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          active ? "bg-green-100 text-green-700" : "bg-red-100 text-[#B91434]"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-2 ${
            active ? "bg-green-500" : "bg-[#B91434]"
          }`}
        />
        {status}
      </span>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 bg-white overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b sticky top-0 bg-white z-10 flex flex-col items-center">
          {headerImage && (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
              <img src={headerImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          {subtitle && <p className="text-xs text-gray-500 mt-1 text-center">{subtitle}</p>}
        </DialogHeader>

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="absolute left-0 top-0 h-full w-1 bg-[#B91434]" />
          <div className="p-6 pl-8 space-y-4">
            {details.map(({ label, value, primary, isStatus, isImage }, idx) => (
              <div key={idx} className="flex justify-between items-start border-b pb-3 last:border-0">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
                <div className="text-right max-w-[65%]">
                  {isStatus ? <StatusBadge status={value as string} /> : 
                   isImage ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                      <img src={value as string} alt={label} className="w-full h-full object-cover" />
                    </div>
                   ) : (
                    <p className={`text-sm ${primary ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 z-10">
          <Button
            onClick={onClose}
            className="bg-[#B91434] hover:bg-[#8e1028] text-white px-6"
          >
            Close
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
