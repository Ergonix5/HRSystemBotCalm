"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import { candidatesData } from "./interviewData";
import { interviewAPI } from "@/src/lib/interviewAPI";
import { Spinner } from "@/src/components/ui/spinner";

export default function CandidatesSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.name.toLowerCase().replace(" ", "") + "@example.com".includes(searchTerm.toLowerCase());
    const matchesJob = jobFilter === "all" || 
                       (jobFilter === "se" && candidate.job === "Software Engineer") ||
                       (jobFilter === "ui" && candidate.job === "UI Designer") ||
                       (jobFilter === "qa" && candidate.job === "QA Engineer");
    const matchesStatus = statusFilter === "all" || candidate.status.toLowerCase() === statusFilter.toLowerCase();
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
                  <TableHead>Name</TableHead>
                  <TableHead>Applied Job</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>ATS Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.job}</TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>{candidate.score}</TableCell>
                    <TableCell>{getStatusBadge(candidate.status)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
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
