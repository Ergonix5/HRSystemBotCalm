const API_BASE = '/api';

export const interviewAPI = {
  // Candidates
  getCandidates: async (params?: { page?: number; limit?: number; q?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/Candidate?${query}`);
    return res.json();
  },

  createCandidate: async (data: any) => {
    const res = await fetch(`${API_BASE}/Candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCandidateById: async (id: string) => {
    const res = await fetch(`${API_BASE}/Candidate/${id}`);
    return res.json();
  },

  updateCandidate: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/Candidate/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteCandidate: async (id: string) => {
    const res = await fetch(`${API_BASE}/Candidate/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
