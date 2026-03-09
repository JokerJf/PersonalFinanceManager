import { useState } from "react";
import { Account } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (account: Omit<Account, 'id'>) => void;
}

const networkColors: Record<string, string> = {
  visa: "from-[#1a1f71] to-[#2d4aa8]",
  mastercard: "from-[#eb001b] to-[#f79e1b]",
  humo: "from-[#00a651] to-[#4fc978]",
  uzcard: "from-[#0066b3] to-[#00a0e3]",
  none: "from-primary to-accent",
};

// 8 цветовых вариантов для карт
const cardColorGradients = [
  { from: "#ffffff", to: "#1e293b", isNoColor: true }, // Безцветный (день/ночь)
  { from: "#64748b", to: "#94a3b8" }, // Серый
  { from: "#1a1f71", to: "#2d4aa8" }, // Синий (Visa)
  { from: "#eb001b", to: "#f79e1b" }, // Красно-оранжевый (Mastercard)
  { from: "#00a651", to: "#4fc978" }, // Зеленый (Humo)
  { from: "#0066b3", to: "#00a0e3" }, // Голубой (UzCard)
  { from: "#7c3aed", to: "#a855f7" }, // Фиолетовый
  { from: "#059669", to: "#10b981" }, // Эмеральд
];

// Валюты для различных сетей карт
const networkCurrencies: Record<string, string> = {
  visa: "USD",
  mastercard: "USD",
  humo: "UZS",
  uzcard: "UZS",
};

// Функция для форматирования номера карты
const formatCardNumber = (value: string): string => {
  return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

// Функция для форматирования даты истечения
const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

const AddAccountModal = ({ open, onOpenChange, onAdd }: AddAccountModalProps) => {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"card" | "cash" | "bank">("card");
  const [newCurrency, setNewCurrency] = useState("USD");
  const [newBalance, setNewBalance] = useState("");
  const [newNetwork, setNewNetwork] = useState<"visa" | "mastercard" | "humo" | "uzcard">("visa");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [newColor, setNewColor] = useState<string>(networkColors.visa);
  const [includedInBalance, setIncludedInBalance] = useState(true);

  const handleAdd = () => {
    if (!newName || !newBalance) return;
    
    // Преобразуем цвет в формат с квадратными скобками для Tailwind
    const formattedColor = newType === "card" 
      ? newColor.replace(/from-(\#[a-f0-9]{6})/, 'from-[$1]').replace(/to-(\#[a-f0-9]{6})/, 'to-[$1]')
      : (newType === "bank" ? "from-emerald-600 to-teal-500" : "from-amber-500 to-orange-400");
    
    const acc: Omit<Account, 'id'> = {
      name: newName,
      type: newType,
      currency: newType === "card" ? networkCurrencies[newNetwork] : newCurrency,
      balance: parseFloat(newBalance),
      color: formattedColor,
      includedInBalance: includedInBalance,
      ...(newType === "card" && {
        cardNetwork: newNetwork,
        cardNumberFull: newCardNumber.replace(/\s/g, ''), // Сохраняем номер без пробелов
        expiryDate: newExpiryDate,
      }),
    };
    
    console.log("Adding account with color:", acc.color);
    onAdd(acc);
    onOpenChange(false);
    
    // Reset form
    setNewName("");
    setNewBalance("");
    setNewCardNumber("");
    setNewExpiryDate("");
    setNewCurrency("USD");
    setNewNetwork("visa");
    setNewColor(`from-${cardColorGradients[0].from} to-${cardColorGradients[0].to}`); // Сбрасываем на дефолтный
    setIncludedInBalance(true);
  };

  const handleNetworkChange = (network: "visa" | "mastercard" | "humo" | "uzcard") => {
    setNewNetwork(network);
    // Определяем цвет по выбранной сети
    const networkColor = networkColors[network];
    // Преобразуем в формат для нового дизайна
    const gradient = cardColorGradients.find(g => 
      (network === "visa" && g.from === "#1a1f71") ||
      (network === "mastercard" && g.from === "#eb001b") ||
      (network === "humo" && g.from === "#00a651") ||
      (network === "uzcard" && g.from === "#0066b3")
    );
    if (gradient) {
      const colorStr = `from-${gradient.from} to-${gradient.to}`;
      setNewColor(colorStr);
      console.log("Network change color:", colorStr);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl sm:rounded-lg sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Account Name */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Account Name</label>
            <input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="e.g. My Visa Card" 
              className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["card", "cash", "bank"] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => setNewType(t)} 
                  className={`py-2 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newType === t ? "bg-primary text-white" : "btn-secondary"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Currency - only for cash and bank */}
          {newType !== "card" && (
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {(["USD", "UZS", "EUR"] as const).map(c => (
                  <button 
                    key={c} 
                    onClick={() => setNewCurrency(c)} 
                    className={`py-2 rounded-2xl text-xs font-semibold transition-colors shadow-sm ${newCurrency === c ? "bg-primary text-white" : "btn-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Network - only for card type */}
          {newType === "card" && (
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Card Network</label>
              <div className="grid grid-cols-2 gap-2">
                {(["visa", "mastercard", "humo", "uzcard"] as const).map(n => (
                  <button 
                    key={n} 
                    onClick={() => handleNetworkChange(n)} 
                    className={`py-2 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newNetwork === n ? "bg-primary text-white" : "btn-secondary"}`}
                  >
                    {n === "uzcard" ? "UzCard" : n === "humo" ? "HUMO" : n.charAt(0).toUpperCase() + n.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Details - only for card type */}
          {newType === "card" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700 mb-1 block">Card Number</label>
                <input 
                  value={newCardNumber} 
                  onChange={(e) => setNewCardNumber(formatCardNumber(e.target.value))} 
                  placeholder="0000 0000 0000 0000" 
                  maxLength={19} // 16 digits + 3 spaces
                  className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Expiry Date</label>
                <input 
                  value={newExpiryDate} 
                  onChange={(e) => setNewExpiryDate(formatExpiryDate(e.target.value))} 
                  placeholder="MM/YY" 
                  maxLength={5}
                  className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                />
              </div>
            </div>
          )}

          {/* Card Style - only for card type */}
          {newType === "card" && (
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Card Style</label>
              <div className="flex flex-wrap gap-2 justify-start">
                {cardColorGradients.map((gradient, index) => {
                  const colorKey = `from-${gradient.from} to-${gradient.to}`;
                  const isNoColor = gradient.isNoColor;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setNewColor(colorKey)}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
                        newColor === colorKey 
                          ? "ring-2 ring-primary scale-110" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        background: isNoColor
                          ? `linear-gradient(135deg, #ffffff 50%, #1e293b 50%)`
                          : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                      }}
                    >
                      {newColor === colorKey && !isNoColor && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                      {newColor === colorKey && isNoColor && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-pulse" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Initial Balance */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Initial Balance</label>
            <input 
              type="number" 
              value={newBalance} 
              onChange={(e) => setNewBalance(e.target.value)} 
              placeholder="0.00" 
              className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
            />
          </div>

          {/* Included in Balance */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-white/70">Include in Balance</label>
            <button 
              onClick={() => setIncludedInBalance(!includedInBalance)} 
              className={`w-10 h-5 rounded-full transition-colors ${includedInBalance ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <div className={`w-3 h-3 rounded-full bg-white ml-1 transition-transform ${includedInBalance ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleAdd} 
            className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-sm shadow-md"
          >
            Add Account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
