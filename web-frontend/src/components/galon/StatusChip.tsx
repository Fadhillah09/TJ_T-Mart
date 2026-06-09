interface StatusChipProps {
  status: string;
  size?: 'sm' | 'lg';
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  selesai:    { label: 'Selesai / Lunas', className: 'bg-red-50 text-red-600 border border-red-200' },
  paid:       { label: 'Lunas',           className: 'bg-red-50 text-red-600 border border-red-200' },
  pending:    { label: 'Pending',         className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  diproses:   { label: 'Diproses',        className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  dibatalkan: { label: 'Dibatalkan',      className: 'bg-red-50 text-[#930014] border border-red-300' },
};

const StatusChip = ({ status, size = 'sm' }: StatusChipProps) => {
  const cfg = STATUS_MAP[status.toLowerCase()] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: 'bg-gray-100 text-gray-500 border border-gray-300',
  };

  const padding = size === 'lg' ? 'px-6 py-2' : 'px-3 py-1';
  const text    = size === 'lg' ? 'text-xs'   : 'text-[10px]';

  return (
    <span className={`${padding} ${text} rounded-full font-black uppercase tracking-wider shadow-sm ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

export default StatusChip;