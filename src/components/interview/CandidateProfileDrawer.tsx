"use client";

import React from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Award,
  ChevronRight,
  Download,
  ExternalLink,
  Linkedin,
  Globe
} from "lucide-react";

/** * PREMIUM MINIMALIST COMPONENTS */

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "error" | "brand" | "outline" }) => {
  const styles: Record<string, string> = {
    default: "bg-slate-100 text-slate-500",
    success: "bg-emerald-50 text-emerald-600",
    error: "bg-rose-50 text-rose-600",
    brand: "bg-[#B91434]/10 text-[#B91434]",
    outline: "border border-slate-200 text-slate-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300 block mb-6">
    {children}
  </label>
);

/** * MAIN DRAWER COMPONENT */

export default function CandidateProfileDrawer({ candidate, open, onClose }: { candidate: any; open: boolean; onClose: () => void }) {
  if (!candidate) return null;

  // Mocking extra details for a fuller "Pro" look
  const skills = candidate.skills || ["React Architecture", "TypeScript", "Cloud Infrastructure", "System Design", "Technical Leadership"];

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop with sophisticated blur */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Drawer Content */}
      <div 
        className={`relative w-full max-w-xl bg-white h-full shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-12 space-y-14">
            
            {/* Header Meta */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge variant="brand"> Dossier #{candidate.id}092</Badge>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Modified 4h ago</span>
              </div>
              <button 
                onClick={onClose}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Close <XCircle className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Main Profile Identity */}
            <section className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-5xl font-light tracking-tighter text-slate-900 leading-none">
                    {candidate.name}
                  </h1>
                  <p className="text-slate-400 text-xl font-light tracking-tight">{candidate.job || "Senior Strategic Lead"}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-50" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * (candidate.score || 85)) / 100} className="text-emerald-500" />
                    </svg>
                    <span className="text-lg font-bold text-slate-900 tracking-tighter">{candidate.score || 85}%</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.2em] mt-2">ATS Match</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant={candidate.status === "Rejected" ? "error" : "success"}>
                  {candidate.status || "Active Pipeline"}
                </Badge>
                <Badge variant="outline">Executive Tier</Badge>
                <div className="flex-1" />
                <div className="flex gap-4">
                  <Linkedin className="h-4 w-4 text-slate-300 hover:text-[#0077b5] cursor-pointer transition-colors" />
                  <Globe className="h-4 w-4 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
                </div>
              </div>
            </section>

            {/* Structured Info Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 border-t border-slate-100 pt-12">
              <div>
                <SectionLabel>Communication</SectionLabel>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{candidate.email || "n.perera@ergonix.ai"}</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">+94 77 123 4567</span>
                  </div>
                </div>
              </div>
              <div>
                <SectionLabel>Deployment</SectionLabel>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Colombo, Sri Lanka</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Briefcase className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{candidate.exp || candidate.experience || "5 Years"} Exp.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Competencies */}
            <section>
              <SectionLabel>Core Competencies</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Document Ledger */}
            <section>
              <SectionLabel>Verified Documents</SectionLabel>
              <div className="group flex items-center justify-between p-5 rounded border border-slate-100 hover:border-slate-900 transition-all cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-slate-50 rounded flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <FileText className="h-6 w-6 text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Curriculum_Vitae_Official.pdf</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Secure PDF • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Signed</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Ver. 2.1</p>
                  </div>
                  <Download className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
            </section>

            {/* Decision Roadmap */}
            <section className="pb-8">
              <SectionLabel>Selection Roadmap</SectionLabel>
              <div className="space-y-10 relative">
                <div className="absolute left-1.75 top-2 bottom-2 w-px bg-slate-100" />
                
                <div className="flex gap-6 relative">
                  <div className="h-4 w-4 rounded-full border-4 border-white bg-emerald-500 z-10 shadow-sm" />
                  <div className="space-y-1 -mt-1">
                    <p className="text-sm font-bold text-slate-900">Application Received</p>
                    <p className="text-xs text-slate-400 font-medium">Automatic parsing completed • Jan 12</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="h-4 w-4 rounded-full border-4 border-white bg-slate-200 z-10 shadow-sm" />
                  <div className="space-y-1 -mt-1">
                    <p className="text-sm font-bold text-slate-400">Technical Assessment</p>
                    <p className="text-xs text-slate-300 font-medium italic">Awaiting candidate submission</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Floating Action Footer */}
        <div className="p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md flex gap-4">
          <button className="flex-2 h-14 bg-slate-900 text-white rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#B91434] hover:shadow-lg hover:shadow-[#B91434]/20 transition-all active:scale-[0.98]">
            Move to Interview
          </button>
          <button className="flex-1 h-14 border border-slate-200 text-slate-400 rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-rose-600 hover:border-rose-100 transition-all">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}