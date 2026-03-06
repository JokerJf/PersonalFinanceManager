import { Account } from "@/context/AppContext";
import CardNetworkLogo from "@/components/CardNetworkLogo";
import { Wifi, Eye, EyeOff, Copy, Check } from "lucide-react";

interface CardViewProps {
  account: Account;
  revealed?: boolean;
  onToggleReveal?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  className?: string;
}

const CardView = ({ 
  account, 
  revealed = false, 
  onToggleReveal, 
  onCopy,
  copied = false,
  className = "" 
}: CardViewProps) => {
  return (
    <div className={`h-48 rounded-3xl p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden shadow-lg dark:shadow-none ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-black/5 dark:bg-white/5 -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 translate-y-1/3 -translate-x-1/3" />
      <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 blur-xl" />
      
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={18} className="opacity-40 rotate-90" />
            <span className="text-xs opacity-60 font-semibold tracking-wider">{account.name}</span>
          </div>
          {account.cardNetwork && (
            <div className="w-16 h-8 flex items-center justify-end">
              <CardNetworkLogo network={account.cardNetwork} className="h-7 w-auto opacity-70" />
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm opacity-60 font-mono tracking-widest">
              {revealed ? (account.cardNumberFull || account.cardNumber) : account.cardNumber}
            </p>
            {onToggleReveal && (
              <button onClick={(e) => { e.stopPropagation(); onToggleReveal(); }} className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
                {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            )}
            {onCopy && (
              <button onClick={(e) => { e.stopPropagation(); onCopy(); }} className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] opacity-40 uppercase font-semibold tracking-wider">Balance</p>
              <p className="text-xl font-bold">
                {account.currency === "UZS" 
                  ? `${account.balance.toLocaleString("en-US")} сум` 
                  : `${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                }
              </p>
            </div>
            {account.expiryDate && (
              <div className="text-right">
                <p className="text-[10px] opacity-40 uppercase font-semibold">Valid Thru</p>
                <p className="text-xs opacity-60 font-mono">{account.expiryDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
