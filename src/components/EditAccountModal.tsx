import { useState, useEffect } from "react";
import { Account } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditAccountModalProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: Account) => void;
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

const EditAccountModal = ({ account, open, onOpenChange, onSave }: EditAccountModalProps) => {
  const [formData, setFormData] = useState<Partial<Account>>({});

  useEffect(() => {
    if (account) {
      setFormData({ ...account });
    }
  }, [account]);

  const handleChange = (field: keyof Account, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.name) {
      // Generate new card number and color if type changed to card
      let finalData = { ...formData };
      if (formData.type === "card" && !formData.cardNumberFull) {
        const network = formData.cardNetwork || "visa";
        finalData.color = networkColors[network] || networkColors.none;
        finalData.cardNumberFull = `${network === "humo" ? "9860" : network === "uzcard" ? "8600" : "4276"}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
        finalData.expiryDate = "12/29";
      }
      onSave(finalData as Account);
      onOpenChange(false);
    }
  };

  if (!account) return null;

  const isCardType = formData.type === "card";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Edit Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Name */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Account Name</label>
            <input 
              value={formData.name || ""} 
              onChange={(e) => handleChange("name", e.target.value)} 
              placeholder="e.g. My Visa Card" 
              className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["card", "cash", "bank"] as const).map(t => (
                <button 
                  key={t} 
                  type="button"
                  onClick={() => handleChange("type", t)} 
                                    className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${formData.type === t ? "bg-primary text-white" : "btn-secondary"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Card Network - only for card type */}
          {isCardType && (
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Card Network</label>
              <div className="grid grid-cols-2 gap-2">
                {(["visa", "mastercard", "humo", "uzcard"] as const).map(n => (
                  <button 
                    key={n} 
                    type="button"
                    onClick={() => handleChange("cardNetwork", n)} 
                                        className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${formData.cardNetwork === n ? "bg-primary text-white" : "btn-secondary"}`}
                  >
                    {n === "uzcard" ? "UzCard" : n === "humo" ? "HUMO" : n.charAt(0).toUpperCase() + n.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Style - only for card type */}
          {isCardType && (
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Card Style</label>
              <div className="flex flex-wrap gap-2 justify-start">
                {cardColorGradients.map((gradient, index) => {
                  const colorKey = `from-${gradient.from} to-${gradient.to}`;
                  const isNoColor = gradient.isNoColor;
                  const isSelected = formData.color === colorKey;
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleChange("color", colorKey)}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
                        isSelected 
                          ? "ring-2 ring-primary scale-110" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        background: isNoColor
                          ? `linear-gradient(135deg, #ffffff 50%, #1e293b 50%)`
                          : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                      }}
                    >
                      {isSelected && !isNoColor && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                      {isSelected && isNoColor && (
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

          {/* Currency */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {["USD", "UZS", "EUR"].map(c => (
                <button 
                  key={c} 
                  type="button"
                  onClick={() => handleChange("currency", c)} 
                                    className={`py-2.5 rounded-2xl text-xs font-semibold transition-colors shadow-sm ${formData.currency === c ? "bg-primary text-white" : "btn-secondary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Balance */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Balance</label>
            <input 
              type="number" 
              value={formData.balance || 0} 
              onChange={(e) => handleChange("balance", Number(e.target.value) || 0)} 
              placeholder="0.00" 
              className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
            />
          </div>

          {/* Submit Button */}
                    <button type="submit" className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-sm shadow-md">
            Save Changes
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountModal;
