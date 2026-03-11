import { useTranslation } from "react-i18next";
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

// Форматирует номер карты в формат XXXX •••• •••• XXXX
const formatCardNumber = (number: string): string => {
  if (!number) return "";
  const digits = number.replace(/\D/g, "");
  if (digits.length === 16) {
    return `${digits.slice(0, 4)} •••• •••• ${digits.slice(12, 16)}`;
  }
  return digits;
};

// Форматирует полный номер карты с пробелами для отображения
const formatFullCardNumber = (number: string): string => {
  if (!number) return "";
  const digits = number.replace(/\D/g, "");
  if (digits.length === 16) {
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  }
  return number;
};

// Функция для преобразования цвета в CSS градиент
const getGradientStyle = (color: string | undefined): { isCustom?: boolean, isNoColor?: boolean } => {
  if (!color) return { isCustom: false };
  
  // Проверяем, содержит ли цвет hex коды
  const hexMatch = color.match(/from-\[(#(?:[0-9a-fA-F]{3}){1,2})\]\s+to-\[(#(?:[0-9a-fA-F]{3}){1,2})\]/);
  
  if (hexMatch) {
    const fromColor = hexMatch[1];
    // Проверяем, безцветный ли это (белый/светлый + темный)
    const isNoColor = fromColor === '#ffffff';
    return { 
      isCustom: true,
      isNoColor
    };
  }
  
  // Для стандартных tailwind классов используем их как есть
  return { isCustom: false };
};

const CardView = ({ 
  account, 
  revealed = false, 
  onToggleReveal, 
  onCopy,
  copied = false,
  className = "" 
}: CardViewProps) => {
  const { t } = useTranslation();
  const { isCustom, isNoColor } = getGradientStyle(account.color);
  
  // Для безцветного режима используем tailwind классы день/ночь
  const noColorClasses = isNoColor 
    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' 
    : '';
  
  // Генерируем inline style для кастомных градиентов
  const getInlineStyle = (): React.CSSProperties | undefined => {
    if (!isCustom || isNoColor) return undefined;
    const hexMatch = account.color?.match(/from-\[(#(?:[0-9a-fA-F]{3}){1,2})\]\s+to-\[(#(?:[0-9a-fA-F]{3}){1,2})\]/);
    if (hexMatch) {
      return { background: `linear-gradient(135deg, ${hexMatch[1]}, ${hexMatch[2]})` };
    }
    return undefined;
  };
  
  return (
    <div 
      className={`h-48 rounded-3xl p-5 ${isCustom && !isNoColor ? '' : 'bg-gradient-to-br '}${isNoColor ? noColorClasses : (account.color || 'from-blue-500 to-blue-700')} ${!isNoColor ? 'text-white' : ''} relative overflow-hidden shadow-lg ${className}`}
      style={getInlineStyle()}
    >
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
              {revealed ? formatFullCardNumber(account.cardNumberFull || "") : formatCardNumber(account.cardNumberFull || "")}
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
              <p className="text-[10px] opacity-40 uppercase font-semibold tracking-wider">{t("common.balance")}</p>
              <p className="text-xl font-bold">
                {account.currency === "UZS" 
                  ? `${account.balance.toLocaleString("en-US")} сум` 
                  : account.currency === "USD"
                    ? `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : account.currency === "EUR"
                      ? `€${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      : `${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${account.currency}`
                }
              </p>
            </div>
            {account.expiryDate && (
              <div className="text-right">
                <p className="text-[10px] opacity-40 uppercase font-semibold">{t("common.validThru")}</p>
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
