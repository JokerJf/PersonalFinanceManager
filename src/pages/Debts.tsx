import { useState } from "react";
import { useApp, Debt } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type Tab = "owe" | "owed";

const Debts = () => {
  const { debts, setDebts, isLoadingData } = useApp();
  const [tab, setTab] = useState<Tab>("owe");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [type, setType] = useState<"owe" | "owed">("owe");
  const [desc, setDesc] = useState("");

  const filtered = debts.filter(d => d.type === tab);
  const openDebts = filtered.filter(d => d.status === "open");
  const closedDebts = filtered.filter(d => d.status === "closed");

  const totalOpen = openDebts.reduce((sum, d) => sum + d.amount, 0);

  const markClosed = (id: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, status: "closed" } : d));
    toast({ title: "Debt Closed", description: "Marked as closed." });
  };

  const handleAdd = () => {
    if (!name || !amount) return;
    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name,
      amount: parseFloat(amount),
      currency,
      type,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      description: desc || undefined,
    };
    setDebts([newDebt, ...debts]);
    setShowAdd(false);
    setName(""); setAmount(""); setDesc("");
    toast({ title: "Debt Added" });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Debts</h1>
        {!isLoadingData && (
          <button onClick={() => setShowAdd(true)} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Tabs */}
      {isLoadingData ? (
        <Skeleton className="h-12 w-full rounded-2xl" />
      ) : (
        <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
          {([{ key: "owe" as Tab, label: "I Owe" }, { key: "owed" as Tab, label: "Owed to Me" }]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? "tab-active" : "tab-inactive"}`}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Summary */}
      {isLoadingData ? (
        <Skeleton className="h-24 w-full rounded-3xl" />
      ) : (
        <div className="fintech-card-elevated text-center py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{tab === "owe" ? "Total I Owe" : "Total Owed to Me"}</p>
          <p className={`text-2xl font-bold ${tab === "owe" ? "text-destructive" : "text-success"}`}>
            ${totalOpen.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {/* Open */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      ) : openDebts.length > 0 && (
        <div>
          <h2 className="section-title mb-3">Open</h2>
          <div className="space-y-2">
            {openDebts.map(d => (
              <div key={d.id} className="fintech-card flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-xl secondary-bg flex items-center justify-center text-lg font-bold text-primary">
                  {d.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.date}{d.description ? ` · ${d.description}` : ""}</p>
                </div>
                <p className={`text-sm font-semibold ${tab === "owe" ? "text-destructive" : "text-success"}`}>
                  {d.currency === "UZS" ? `${d.amount.toLocaleString("en-US")} сум` : `${d.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                </p>
                <button onClick={() => markClosed(d.id)} className="p-1.5 rounded-lg bg-success/10 text-success">
                  <Check size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed */}
      {!isLoadingData && closedDebts.length > 0 && (
        <div>
          <h2 className="section-title mb-3">Closed</h2>
          <div className="space-y-2">
            {closedDebts.map(d => (
              <div key={d.id} className="fintech-card flex items-center gap-3 py-3 opacity-50">
                <div className="w-10 h-10 rounded-xl secondary-bg flex items-center justify-center text-lg font-bold">{d.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-through">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.date}</p>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">${d.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoadingData && openDebts.length === 0 && closedDebts.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">No debts yet</p>
        </div>
      )}

      {/* Add Debt Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)]">
          <DialogHeader><DialogTitle>Add Debt</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
              {(["owe", "owed"] as const).map(t => (
                <button key={t} onClick={() => setType(t)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${type === t ? "tab-active" : "tab-inactive"}`}>
                  {t === "owe" ? "I Owe" : "Owed to Me"}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Person Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {["USD", "UZS", "EUR"].map(c => (
                  <button key={c} onClick={() => setCurrency(c)} className={`py-2 rounded-xl text-xs font-medium transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "secondary-bg text-muted-foreground"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (optional)</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What for?" className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Add Debt</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Debts;
