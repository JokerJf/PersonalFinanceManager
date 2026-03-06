import { useState } from "react";
import { useApp, Transaction } from "@/context/AppContext";
import { Plus } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";

type Filter = "all" | "expense" | "income" | "transfer";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "expense", label: "Expense" },
  { key: "income", label: "Income" },
  { key: "transfer", label: "Transfer" },
];

const Transactions = () => {
  const { transactions, selectedTransactionId, setSelectedTransactionId, setAddTransactionModalOpen } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const grouped = filtered.reduce<Record<string, typeof transactions>>((acc, tx) => {
    (acc[tx.date] = acc[tx.date] || []).push(tx);
    return acc;
  }, {});

  const formatAmount = (tx: Transaction) => {
    const prefix = tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "";
    if (tx.currency === "UZS") return `${prefix}${tx.amount.toLocaleString("en-US")} сум`;
    return `${prefix}$${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const handleTransactionClick = (id: string) => {
    setSelectedTransactionId(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Transactions</h1>
        <button onClick={() => setAddTransactionModalOpen(true)} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex rounded-2xl p-1 gap-1">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all shadow-sm ${filter === f.key ? "tab-active" : "tab-inactive"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">
              {new Date(date).toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" })}
            </p>
            <div className="space-y-2">
              {txs.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => handleTransactionClick(tx.id)}
                  className="rounded-2xl border border-border/30 flex items-center gap-3 py-3 cursor-pointer active:scale-[0.98] transition-transform px-4 card-container"
                >
                  <CategoryIcon icon={tx.icon} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    {tx.note && (
                      <p className="text-[10px] text-muted-foreground truncate">{tx.note}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{tx.category} · {tx.accountName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                      {formatAmount(tx)}
                    </p>
                    {tx.toCurrency && tx.toCurrency !== tx.currency && (
                      <p className="text-[10px] text-muted-foreground">
                        → {tx.toCurrency === "UZS" ? `${tx.toAmount?.toLocaleString("en-US")} сум` : `${tx.toAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
