interface NotificationFooterProps {
  count: number;
}

export function NotificationFooter({ count }: NotificationFooterProps) {
  if (count === 0) return null;

  return (
    <div className="px-4 lg:px-8 py-3 lg:py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-700">
      <p className="text-[10px] lg:text-sm text-slate-400 dark:text-slate-500 text-center italic">
        Showing {count} notifications
      </p>
    </div>
  );
}