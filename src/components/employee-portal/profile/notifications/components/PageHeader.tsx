export function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1 mb-10">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Manage your time off requests and view balance.</p>
      </div>
    </div>
  );
}