interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    transcribed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    generated: "bg-purple-100 text-purple-700 border-purple-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    default: "bg-slate-100 text-slate-700 border-slate-200"
  };

  const labels: Record<string, string> = {
    transcribed: "Transcrito",
    generated: "Generado",
    draft: "Borrador"
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.default}`}>
      {labels[status] || status}
    </span>
  );
};
