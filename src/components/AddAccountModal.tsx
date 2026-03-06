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
  onAdd: (account: Account) => void;
}

const networkColors: Record<string, string> = {
  visa: "from-[#1a1f71] to-[#2d4aa8]",
  mastercard: "from-[#eb001b] to-[#f79e1b]",
  humo: "from-[#00a651] to-[#4fc978]",
  uzcard: "from-[#0066b3] to-[#00a0e3]",
  none: "from-primary to-accent",
};

const AddAccountModal = ({ open, onOpenChange, onAdd }: AddAccountModalProps) => {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"card" | "cash" | "bank">("card");
  const [newCurrency, setNewCurrency] = useState("USD");
  const [newBalance, setNewBalance] = useState("");
  const [newNetwork, setNewNetwork] = useState<"visa" | "mastercard" | "humo" | "uzcard">("visa");

  const handleAdd = () => {
    if (!newName || !newBalance) return;
    
    const acc: Account = {
      id: `acc-${Date.now()}`,
      name: newName,
      type: newType,
      currency: newCurrency,
      balance: parseFloat(newBalance),
      transactions: 0,
      color: newType === "card" ? networkColors[newNetwork] || networkColors.none : newType === "bank" ? "from-emerald-600 to-teal-500" : "from-amber-500 to-orange-400",
      includedInBalance: true,
      ...(newType === "card" && {
        cardNetwork: newNetwork,
        cardNumber: `${newNetwork === "humo" ? "9860" : newNetwork === "uzcard" ? "8600" : "4276"} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        cardNumberFull: `${newNetwork === "humo" ? "9860" : newNetwork === "uzcard" ? "8600" : "4276"} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: "12/29",
      }),
    };
    
    onAdd(acc);
    onOpenChange(false);
    
    // Reset form
    setNewName("");
    setNewBalance("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                  className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newType === t ? "bg-primary text-white" : "btn-secondary"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Card Network - only for card type */}
          {newType === "card" && (
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Card Network</label>
              <div className="grid grid-cols-2 gap-2">
                {(["visa", "mastercard", "humo", "uzcard"] as const).map(n => (
                  <button 
                    key={n} 
                    onClick={() => setNewNetwork(n)} 
                                      className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newNetwork === n ? "bg-primary text-white" : "btn-secondary"}`}
                  >
                    {n === "uzcard" ? "UzCard" : n === "humo" ? "HUMO" : n.charAt(0).toUpperCase() + n.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Currency */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {["USD", "UZS", "EUR"].map(c => (
                <button 
                  key={c} 
                  onClick={() => setNewCurrency(c)} 
                                    className={`py-2.5 rounded-2xl text-xs font-semibold transition-colors shadow-sm ${newCurrency === c ? "bg-primary text-white" : "btn-secondary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

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
