"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search, Eye, CheckCircle, XCircle, Filter } from "lucide-react";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import { candidatesData } from "./interviewData";
import { interviewAPI } from "@/src/lib/interviewAPI";
import { Spinner } from "@/src/components/ui/spinner";

export default function CandidatesSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobForFilter, setSelectedJobForFilter] = useState<string>("");
  const [candidates, setCandidates] = useState<any[]>(candidatesData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const result = await interviewAPI.getCandidates();
      if (result.data && result.data.length > 0) {
        setCandidates(result.data);
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterCVs = async () => {
    if (!selectedJobForFilter) {
      alert("Please select a job position first");
      return;
    }

    try {
      console.log("Filtering CVs for job:", selectedJobForFilter);
      
      // Filter candidates by selected job
      const filtered = candidates.filter((candidate) => {
        const candidateJob = candidate.job || candidate.current_position || '';
        return candidateJob.toLowerCase().includes(selectedJobForFilter.toLowerCase());
      });
      
      console.log(`Found ${filtered.length} CVs for ${selectedJobForFilter}`);

      if (filtered.length === 0) {
        alert(`No CVs found for ${selectedJobForFilter}`);
        return;
      }

      // Send filtered CVs to backend API (which will forward to n8n)
      const response = await fetch('/api/n8n/filter-cvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_position: selectedJobForFilter,
          total_candidates: filtered.length,
          candidates: filtered.map(candidate => ({
            candidate_id: candidate.candidate_id || candidate._id,
            name: candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
            email: candidate.email,
            phone: candidate.phone,
            current_position: candidate.job || candidate.current_position,
            status: candidate.status,
            cv_file: candidate.cv_file,
            skills: candidate.skills,
            experience_years: candidate.experience_years,
          })),
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Successfully sent to n8n:', result);
        alert(`✅ Successfully sent ${filtered.length} CVs for ${selectedJobForFilter} to n8n workflow!`);
      } else {
        console.error('Failed to send to n8n:', result);
        alert(`⚠️ ${result.message || 'Failed to send to n8n workflow'}`);
      }
    } catch (error) {
      console.error('Error filtering CVs:', error);
      alert('❌ Error occurred while filtering CVs');
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const candidateName = candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
    const candidateJob = candidate.job || candidate.current_position || '';
    const candidateStatus = candidate.status || '';

    const matchesSearch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = jobFilter === "all" ||
      (jobFilter === "se" && candidateJob.includes("Software Engineer")) ||
      (jobFilter === "ui" && candidateJob.includes("Designer")) ||
      (jobFilter === "qa" && candidateJob.includes("QA"));
    const matchesStatus = statusFilter === "all" || candidateStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesJob && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Shortlisted") {
      return <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>;
    }
    if (status === "Rejected") {
      return <Badge className="bg-red-600 hover:bg-red-700">{status}</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <>
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Applicants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="se">Software Engineer</SelectItem>
                    <SelectItem value="ui">UI Designer</SelectItem>
                    <SelectItem value="qa">QA Engineer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Applied Job</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => {
                      const displayName = candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
                      const displayJob = candidate.job || candidate.current_position || '—';

                      return (
                        <TableRow key={candidate.id || candidate._id}>
                          <TableCell className="font-mono text-sm">{candidate.candidate_id || '—'}</TableCell>
                          <TableCell className="font-medium">{displayName}</TableCell>
                          <TableCell>{displayJob}</TableCell>
                          <TableCell className="text-sm">{candidate.email || '—'}</TableCell>
                          <TableCell className="text-sm">{candidate.phone || '—'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedCandidate(candidate)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Filter CVs Button */}
              <div className="flex justify-end items-center gap-3 mt-4">
                <Select value={selectedJobForFilter} onValueChange={setSelectedJobForFilter}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select job to filter CVs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="UI Designer">UI Designer</SelectItem>
                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleFilterCVs}
                  disabled={!selectedJobForFilter}
                >
                  <Filter className="h-4 w-4" />
                  Filter CVs
                </Button>
              </div>

            </>
          )}
        </CardContent>
      </Card>

      {/* Profile Drawer */}
      <CandidateProfileDrawer
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  );
}
