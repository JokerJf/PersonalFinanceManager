import { useState, useEffect } from "react";
import { useApp, Account } from "@/context/AppContext";
import CardView from "@/components/CardView";
import AddAccountModal from "@/components/AddAccountModal";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Banknote, Landmark, Plus, ChevronRight, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const iconMap = { card: CreditCard, cash: Banknote, bank: Landmark };

const networkColors: Record<string, string> = {
  visa: "from-[#1a1f71] to-[#2d4aa8]",
  mastercard: "from-[#eb001b] to-[#f79e1b]",
  humo: "from-[#00a651] to-[#4fc978]",
  uzcard: "from-[#0066b3] to-[#00a0e3]",
  none: "from-primary to-accent",
};

const Accounts = () => {
  const { t } = useTranslation();
  const { accounts, addAccount, setSelectedCardId, toggleAccountInBalance, isLoadingData, refreshData } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // При монтировании страницы обновляем данные с сервера
  // Это вызовет скелетную загрузку пока данные загружаются
  useEffect(() => {
    refreshData();
  }, []);

  const handleCardClick = (acc: Account) => {
    setSelectedCardId(acc.id);
  };

  const handleAdd = async (account: Omit<Account, 'id'>) => {
    // Создаем новый счет с помощью API
    await addAccount(account);
    toast({ title: "Account Added", description: `${account.name} has been created.` });
  };

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyCardNumber = (acc: Account) => {
    const num = acc.cardNumberFull || "";
    navigator.clipboard.writeText(num.replace(/\s/g, ""));
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied", description: "Card number copied to clipboard." });
  };

  const cards = accounts.filter(a => a.type === "card");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("accounts.title")}</h1>
        {!isLoadingData && (
          <button onClick={() => setShowAddModal(true)} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Cards - horizontal scroll full width */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-20 mb-3" />
          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4">
            <Skeleton className="h-48 w-[calc(100vw-2rem)] max-w-[400px] rounded-3xl flex-shrink-0" />
          </div>
        </div>
      ) : cards.length > 0 ? (
        <div>
          <h2 className="section-title mb-3">{t("accounts.cards")}</h2>
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
      ) : null}

      {/* Other Accounts */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-36 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      ) : accounts.filter(a => a.type !== "card").length > 0 && (
        <div>
          <h2 className="section-title mb-3">{t("accounts.otherAccounts")}</h2>
          <div className="space-y-3">
            {accounts.filter(a => a.type !== "card").map((acc) => {
              const Icon = iconMap[acc.type];
              return (
                <div key={acc.id} onClick={() => handleCardClick(acc)} className="rounded-2xl border border-border/30 flex items-center gap-3 py-3 cursor-pointer active:scale-[0.98] transition-transform px-4 dark:bg-[rgba(28,32,44,0.3)] bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-2xl card-bg flex items-center justify-center text-slate-900 dark:text-white">
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
      {!isLoadingData && (
        <button onClick={() => setShowAddModal(true)} className="w-full fintech-card border-2 border-dashed border-border flex items-center justify-center gap-2 py-6 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
          <Plus size={20} />
          <span className="text-sm font-medium">{t("accounts.addNewAccount")}</span>
        </button>
      )}

      {/* Add Account Modal */}
      <AddAccountModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onAdd={handleAdd} 
      />
    </div>
  );
};

export default Accounts;
