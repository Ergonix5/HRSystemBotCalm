import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, Download } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];

export function SearchAndFilter({ searchTerm, onSearchChange, filterStatus, onFilterChange }: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search requests..."
          className="pl-9 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-1.5">
        {statusOptions.map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'secondary' : 'ghost'}
            size="sm"
            className={filterStatus === status ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
            onClick={() => onFilterChange(status)}
          >
            {status}
          </Button>
        ))}
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
        <Button variant="outline" size="icon" className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}