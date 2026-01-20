"use client";

import { useState } from "react";

export default function DBTest() {
  const [dbResult, setDbResult] = useState<any>(null);
  const [profileResult, setProfileResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDB = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/db-check');
      const data = await response.json();
      setDbResult(data);
    } catch (error) {
      setDbResult({ error: (error as Error).message });
    }
    setLoading(false);
  };

  const testProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employee/profile');
      const data = await response.json();
      setProfileResult(data);
    } catch (error) {
      setProfileResult({ error: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testDB}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test DB Connection'}
        </button>
        
        <button 
          onClick={testProfile}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Profile API'}
        </button>
      </div>

      {dbResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">DB Connection Result:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(dbResult, null, 2)}</pre>
        </div>
      )}

      {profileResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Profile API Result:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(profileResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}