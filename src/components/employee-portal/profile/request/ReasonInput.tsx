interface ReasonInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReasonInput({ value, onChange }: ReasonInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Annual family trip..."
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B91434]/20 focus:border-[#B91434] outline-none transition-all text-sm resize-none"
      ></textarea>
    </div>
  );
}