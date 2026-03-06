import { useState } from "react";
import { useApp, Account, CardNetwork } from "@/context/AppContext";
import CardNetworkLogo from "@/components/CardNetworkLogo";
import CardView from "@/components/CardView";
import { CreditCard, Banknote, Landmark, Plus, ChevronRight, Wifi, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const iconMap = { card: CreditCard, cash: Banknote, bank: Landmark };

const networkColors: Record<string, string> = {
  visa: "from-[#1a1f71] to-[#2d4aa8]",
  mastercard: "from-[#eb001b] to-[#f79e1b]",
  humo: "from-[#00a651] to-[#4fc978]",
  uzcard: "from-[#0066b3] to-[#00a0e3]",
  none: "from-primary to-accent",
};

const Accounts = () => {
  const { accounts, setAccounts, setSelectedCardId } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"card" | "cash" | "bank">("card");
  const [newCurrency, setNewCurrency] = useState("USD");
  const [newBalance, setNewBalance] = useState("");
  const [newNetwork, setNewNetwork] = useState<CardNetwork>("visa");

  const handleCardClick = (acc: Account) => {
    setSelectedCardId(acc.id);
  };

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
    setAccounts([...accounts, acc]);
    setShowAddModal(false);
    setNewName("");
    setNewBalance("");
    toast({ title: "Account Added", description: `${newName} has been created.` });
  };

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyCardNumber = (acc: Account) => {
    const num = acc.cardNumberFull || acc.cardNumber || "";
    navigator.clipboard.writeText(num.replace(/\s/g, ""));
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied", description: "Card number copied to clipboard." });
  };

  const cards = accounts.filter(a => a.type === "card");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Accounts</h1>
        <button onClick={() => setShowAddModal(true)} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Plus size={18} />
        </button>
      </div>

      {/* Cards - horizontal scroll full width */}
      {cards.length > 0 && (
        <div>
          <h2 className="section-title mb-3">Cards</h2>
          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {cards.map((acc) => (
              <div
                key={acc.id}
                className="flex-shrink-0 w-[calc(100vw-2rem)] max-w-[400px] snap-center cursor-pointer"
                onClick={() => handleCardClick(acc)}
              >
                <CardView 
                  account={acc}
                  revealed={revealedCards.has(acc.id)}
                  onToggleReveal={() => toggleReveal(acc.id)}
                  onCopy={() => copyCardNumber(acc)}
                  copied={copiedId === acc.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Accounts */}
      {accounts.filter(a => a.type !== "card").length > 0 && (
        <div>
          <h2 className="section-title mb-3">Other Accounts</h2>
          <div className="space-y-3">
            {accounts.filter(a => a.type !== "card").map((acc) => {
              const Icon = iconMap[acc.type];
              return (
                <div key={acc.id} onClick={() => handleCardClick(acc)} className="rounded-2xl border border-border/30 flex items-center gap-3 py-3 cursor-pointer active:scale-[0.98] transition-transform px-4 dark:bg-[rgba(28,32,44,0.3)] bg-white shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl card-bg flex items-center justify-center text-slate-900 dark:text-white`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{acc.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{acc.type} · {acc.currency}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {acc.currency === "UZS" ? `${acc.balance.toLocaleString("en-US")} сум` : `${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Account Button */}
      <button onClick={() => setShowAddModal(true)} className="w-full fintech-card border-2 border-dashed border-border flex items-center justify-center gap-2 py-6 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
        <Plus size={20} />
        <span className="text-sm font-medium">Add New Account</span>
      </button>

      {/* Add Account Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)]">
          <DialogHeader><DialogTitle>Add Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Account Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. My Visa Card" className="w-full rounded-2xl input-bg border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["card", "cash", "bank"] as const).map(t => (
                  <button key={t} onClick={() => setNewType(t)} className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newType === t ? "bg-primary text-primary-foreground" : "btn-secondary"}`}>{t}</button>
                ))}
              </div>
            </div>
            {newType === "card" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Network</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["visa", "mastercard", "humo", "uzcard"] as const).map(n => (
                    <button key={n} onClick={() => setNewNetwork(n)} className={`py-2.5 rounded-2xl text-xs font-semibold capitalize transition-colors shadow-sm ${newNetwork === n ? "bg-primary text-primary-foreground" : "btn-secondary"}`}>
                      {n === "uzcard" ? "UzCard" : n === "humo" ? "HUMO" : n.charAt(0).toUpperCase() + n.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {["USD", "UZS", "EUR"].map(c => (
                  <button key={c} onClick={() => setNewCurrency(c)} className={`py-2.5 rounded-2xl text-xs font-semibold transition-colors shadow-sm ${newCurrency === c ? "bg-primary text-primary-foreground" : "btn-secondary"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Initial Balance</label>
              <input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} placeholder="0.00" className="w-full rounded-2xl input-bg border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" />
            </div>
            <button onClick={handleAdd} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm">Add Account</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
