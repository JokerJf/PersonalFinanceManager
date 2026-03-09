import { useState, useRef, useEffect } from "react";
import { useApp, Account } from "@/context/AppContext";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import NotificationsSheet from "@/components/NotificationsSheet";
import CardView from "@/components/CardView";
import CategoryIcon from "@/components/CategoryIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CreditCard, Banknote, Landmark, Sparkles, TrendingUp, Plus, DollarSign, MessageCircle, Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = { card: CreditCard, cash: Banknote, bank: Landmark };

// Get currencies that can be converted TO from account currencies
const getConvertibleCurrencies = (
  exchangeRates: { from: string; to: string; rate: number }[],
  accountCurrencies: string[],
  baseCurrency: string
) => {
  const currencies = new Set<string>();
  
  // If base is "all", get all currencies that any account can convert to
  if (baseCurrency === "all") {
    // Add all unique account currencies
    accountCurrencies.forEach(c => currencies.add(c));
    // Add all currencies that account currencies can convert to
    exchangeRates.forEach(r => {
      if (accountCurrencies.includes(r.from)) {
        currencies.add(r.to);
      }
    });
  } else {
    // If specific currency selected, only show that currency and what it can convert to
    currencies.add(baseCurrency);
    exchangeRates.forEach(r => {
      if (r.from === baseCurrency) {
        currencies.add(r.to);
      }
    });
  }
  
  return Array.from(currencies).sort();
};

const Dashboard = () => {
  const { totalBalance, accounts, transactions, workspace, familyMembers, userName, currency, aiInsightEnabled, setSelectedCardId, selectedCurrency, setSelectedTransactionId, setAddTransactionModalOpen, setAddTransactionDefaultType, balanceCurrency, exchangeRates, isLoadingExchangeRates, isLoadingData } = useApp();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"expense" | "income" | "transfer">("expense");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  
  // Get unique currencies from accounts
  const accountCurrencies = [...new Set(accounts.map(a => a.currency))];
  
  // Get available currencies based on account currencies and balanceCurrency setting
  const availableCurrencies = getConvertibleCurrencies(exchangeRates, accountCurrencies, balanceCurrency);
  
  // Display currency for Total Balance (for conversion when clicking)
  const [displayCurrency, setDisplayCurrency] = useState(balanceCurrency === "all" ? "USD" : balanceCurrency);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(0);

  const cards = accounts.filter(a => a.type === "card");

  // Copy card number to clipboard
  const handleCopyCardNumber = (cardNumber: string, cardId: string) => {
    if (cardNumber) {
      navigator.clipboard.writeText(cardNumber);
      setCopiedCardId(cardId);
      setTimeout(() => setCopiedCardId(null), 2000);
    }
  };
  const toggleCardReveal = (id: string) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Calculate total balance based on balanceCurrency setting
  // If balanceCurrency is "all" - include all accounts with includedInBalance = true
  // If balanceCurrency is specific (USD, UZS, etc.) - only include accounts with that currency
  const filteredAccounts = accounts.filter(a => 
    a.includedInBalance !== false && 
    (balanceCurrency === "all" || a.currency === balanceCurrency)
  );

  // Calculate total in original currencies (before conversion)
  const originalTotal = filteredAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Calculate total balance in display currency (for conversion when clicking)
  useEffect(() => {
    let total = 0;
    
    filteredAccounts.forEach(acc => {
      // Find rate from account currency to display currency
      const rateObj = exchangeRates.find(r => r.from === acc.currency && r.to === displayCurrency);
      // If no direct rate, try USD as intermediate
      let rate = rateObj?.rate;
      if (!rate && acc.currency !== displayCurrency) {
        const toUSD = exchangeRates.find(r => r.from === acc.currency && r.to === "USD");
        const fromUSD = exchangeRates.find(r => r.from === "USD" && r.to === displayCurrency);
        if (toUSD && fromUSD) {
          rate = toUSD.rate * fromUSD.rate;
        }
      }
      if (!rate) rate = 1; // Fallback
      total += acc.balance * rate;
    });
    
    // Animate the balance change
    if (isAnimating) {
      setDisplayBalance(total);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setDisplayBalance(total);
    }
  }, [filteredAccounts, displayCurrency, isAnimating]);

  // Update display currency when balanceCurrency changes in settings
  useEffect(() => {
    if (balanceCurrency === "all") {
      setDisplayCurrency("USD");
    } else {
      setDisplayCurrency(balanceCurrency);
    }
  }, [balanceCurrency]);

  // Cycle through currencies when clicking on Total Balance
  const handleCurrencySwitch = () => {
    setIsAnimating(true);
    const currentIndex = availableCurrencies.indexOf(displayCurrency);
    const nextIndex = (currentIndex + 1) % availableCurrencies.length;
    setDisplayCurrency(availableCurrencies[nextIndex]);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : 1;
      setActiveCard(Math.round(scrollLeft / cardWidth));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const openModal = (type: "expense" | "income" | "transfer") => {
    setAddTransactionDefaultType(type);
    setAddTransactionModalOpen(true);
  };

  const quickActions = [
    { icon: ArrowUpRight, label: "Expense", bgColor: "bg-destructive/10", color: "text-destructive", action: () => openModal("expense") },
    { icon: ArrowDownLeft, label: "Income", bgColor: "bg-success/10", color: "text-success", action: () => openModal("income") },
    { icon: ArrowLeftRight, label: "Transfer", bgColor: "bg-primary/10", color: "text-primary", action: () => openModal("transfer") },
    { icon: Plus, label: "Debt", bgColor: "bg-warning/10", color: "text-warning", action: () => navigate("/debts") },
  ];

  const handleCardClick = (id: string) => {
    setSelectedCardId(id);
  };

  const handleCopyNumber = (acc: Account) => {
    if (acc.cardNumberFull) {
      handleCopyCardNumber(acc.cardNumberFull, acc.id);
    }
  };

  const handleTransactionClick = (id: string) => {
    setSelectedTransactionId(id);
  };

  const currencySymbol = displayCurrency === "UZS" ? "" : displayCurrency === "EUR" ? "€" : displayCurrency === "GBP" ? "£" : displayCurrency === "RUB" ? "₽" : "$";
  
  const formatBalance = (val: number) => {
    if (displayCurrency === "UZS") return `${val.toLocaleString("en-US")} сум`;
    return `${currencySymbol}${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 header-user-info min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold flex-shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">FinWallet</p>
            <p className="text-xs sm:text-sm font-semibold truncate">{userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/chatbot")} className="w-9 h-9 rounded-full bg-secondary dark:bg-[rgba(28,32,44,0.3)] flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle size={18} />
          </button>
          <NotificationsSheet />
        </div>
      </div>

      {isLoadingData ? <Skeleton className="h-10 w-full rounded-xl" /> : <WorkspaceSwitcher />}

      {workspace === "family" && (
        <div className="flex gap-3 family-members">
          {familyMembers.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary">
                {m.avatar}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{m.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total Balance */}
      {isLoadingData ? (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
      <div 
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 shadow-2xl cursor-pointer group" 
        onClick={handleCurrencySwitch}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-black/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-black/5 translate-y-1/2 -translate-x-1/3" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-black/10 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={20} className="text-slate-900 dark:text-white" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/80">Total Balance</p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">+2.4%</span>
            </div>
          </div>
          
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2 transition-all duration-300 ${isAnimating ? 'scale-105 opacity-50' : 'scale-100 opacity-100'}`}>
            {isLoadingExchangeRates ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              formatBalance(displayBalance)
            )}
          </p>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40" />
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-white/70 font-medium">{displayCurrency}</span>
            </div>
            {balanceCurrency === "all" ? (
              <div className="flex items-center gap-1.5 group-hover:gap-2 transition-all">
                <Repeat size={12} className="text-slate-400 dark:text-white/40" />
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-white/70 font-medium">Tap to switch</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40" />
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-white/70 font-medium">
                  {filteredAccounts.length} accounts
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Cards */}
      {isLoadingData ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4">
            <Skeleton className="h-48 w-[calc(100vw-2rem)] max-w-[400px] rounded-3xl flex-shrink-0" />
          </div>
        </div>
      ) : (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">My Cards</h2>
          <button onClick={() => navigate("/accounts")} className="text-[10px] sm:text-xs text-primary font-semibold">See all</button>
        </div>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory card-slider-container">
          {cards.map((acc) => (
            <div
              key={acc.id}
              onClick={() => handleCardClick(acc.id)}
              className="flex-shrink-0 w-[calc(100vw-2rem)] max-w-[400px] snap-center cursor-pointer"
            >
              <CardView 
                account={acc} 
                revealed={revealedCards.has(acc.id)}
                onToggleReveal={() => toggleCardReveal(acc.id)}
                onCopy={() => handleCopyNumber(acc)}
                copied={copiedCardId === acc.id}
              />
            </div>
          ))}
        </div>
        {/* Page indicator */}
        {cards.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeCard ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      )}
      {/* Quick Actions */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        </div>
      ) : (
      <div>
        <h2 className="section-title mb-2 sm:mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {quickActions.map((action) => (
            <button key={action.label} className={`quick-action-btn ${action.bgColor} dark:bg-[rgba(28,32,44,0.3)] shadow-sm`} onClick={action.action}>
              <action.icon size={20} className={action.color} />
              <span className="text-[9px] sm:text-[11px] font-semibold text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Exchange Rate + AI buttons row */}
      {isLoadingData ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 exchange-ai-buttons">
        <button onClick={() => navigate("/exchange")} className="rounded-2xl border border-border/30 flex items-center gap-2 sm:gap-3 py-3 cursor-pointer active:scale-[0.98] transition-transform px-4 dark:bg-[rgba(28,32,44,0.3)] bg-white shadow-sm">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} className="text-primary" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs sm:text-sm font-semibold truncate">Exchange Rates</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-medium truncate">Currency converter</p>
          </div>
        </button>
        <button onClick={() => navigate("/chatbot")} className="rounded-2xl border border-border/30 flex items-center gap-2 sm:gap-3 py-3 cursor-pointer active:scale-[0.98] transition-transform px-4 dark:bg-[rgba(28,32,44,0.3)] bg-white shadow-sm">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} className="text-accent" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs sm:text-sm font-semibold truncate">AI Assistant</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-medium truncate">Ask anything</p>
          </div>
        </button>
      </div>
      )}

      {/* AI Insight */}
      {aiInsightEnabled && !isLoadingData && (
        <div className="fintech-card ai-insight-card bg-gradient-to-br from-card to-warning/5 dark:from-[rgba(28,32,44,0.3)] dark:to-warning/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warning/10 dark:bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AI Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">You spent 20% more on Food this month compared to last month. Consider setting a budget limit.</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {isLoadingData ? (
        <div className="recent-transactions">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      ) : (
      <div className="recent-transactions">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="section-title">Recent Transactions</h2>
          <button onClick={() => navigate("/transactions")} className="text-[10px] sm:text-xs text-primary font-semibold">See all</button>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {transactions.slice(0, 4).map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => handleTransactionClick(tx.id)}
              className="rounded-2xl border border-border/30 flex items-center gap-3 py-3 cursor-pointer px-4 dark:bg-[rgba(28,32,44,0.3)] bg-white shadow-sm"
            >
              <CategoryIcon icon={tx.icon} size={16} className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground truncate">{tx.category} · {tx.accountName}</p>
              </div>
              <p className={`text-sm font-semibold flex-shrink-0 ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
                {tx.currency === "UZS" ? `${tx.amount.toLocaleString("en-US")} сум` : `${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              </p>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
