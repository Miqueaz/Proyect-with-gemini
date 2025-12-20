import type { ButtonProps } from "./type";


const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "primary", className = "" }) => {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200",
    secondary: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm"
  };
  return (
    <button onClick={onClick} className={`${styles[variant]} px-4 md:px-7 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 transition-all active:scale-95 ${className}`}>
      {children}
    </button>
  );
};

export { Button };