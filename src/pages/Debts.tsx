import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp, Debt, Credit } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Check, CreditCard, CalendarDays, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type DebtTab = "owe" | "owed";
type MainTab = "debts" | "credits";

const formatMoney = (amount: number, currency: string) => {
  if (currency === "UZS") {
    return `${Math.round(amount).toLocaleString("en-US")} сум`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const addMonthsToDate = (dateString: string, months: number) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
};

const calcMonthlyPayment = (totalAmount: number, months: number) => {
  if (!months || months <= 0) return 0;
  return totalAmount / months;
};

const Debts = () => {
  const { t } = useTranslation();
  const { debts, setDebts, credits, setCredits, isLoadingData } = useApp();

  const [mainTab, setMainTab] = useState<MainTab>("debts");
  const [debtTab, setDebtTab] = useState<DebtTab>("owe");

  const [showAddDebt, setShowAddDebt] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);

  // debt form
  const [debtName, setDebtName] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [debtCurrency, setDebtCurrency] = useState("USD");
  const [debtType, setDebtType] = useState<"owe" | "owed">("owe");
  const [debtDesc, setDebtDesc] = useState("");

  // credit form
  const [creditTitle, setCreditTitle] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditCurrency, setCreditCurrency] = useState("USD");
  const [creditKind, setCreditKind] = useState<"credit" | "installment">("credit");
  const [creditMonths, setCreditMonths] = useState("5");
  const [creditStartDate, setCreditStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [creditDesc, setCreditDesc] = useState("");

  const filteredDebts = debts.filter((d) => d.type === debtTab);
  const openDebts = filteredDebts.filter((d) => d.status === "open");
  const closedDebts = filteredDebts.filter((d) => d.status === "closed");
  const totalOpenDebts = openDebts.reduce((sum, d) => sum + d.amount, 0);

  const activeCredits = credits.filter((c) => c.status === "active");
  const closedCredits = credits.filter((c) => c.status === "closed");

  const totalCreditBalance = useMemo(() => {
    return activeCredits.reduce((sum, credit) => {
      const monthlyPayment = calcMonthlyPayment(credit.totalAmount, credit.months);
      const remainingPayments = Math.max(credit.months - credit.paidInstallments, 0);
      return sum + monthlyPayment * remainingPayments;
    }, 0);
  }, [activeCredits]);

  const markDebtClosed = (id: string) => {
    setDebts(
      debts.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "closed",
            }
          : d
      )
    );

    toast({
      title: t("debts.debtClosed"),
      description: t("debts.debtClosedDesc"),
    });
  };

  const handleAddDebt = () => {
    if (!debtName.trim() || !debtAmount || Number(debtAmount) <= 0) {
      toast({
        title: t("debts.error"),
        description: t("debts.fillDebtFields"),
      });
      return;
    }

    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name: debtName.trim(),
      amount: Number(debtAmount),
      currency: debtCurrency,
      type: debtType,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      description: debtDesc.trim() || undefined,
    };

    setDebts([newDebt, ...debts]);
    setShowAddDebt(false);
    setDebtName("");
    setDebtAmount("");
    setDebtDesc("");

    toast({
      title: t("debts.debtAdded"),
    });
  };

  const handleAddCredit = () => {
    const totalAmount = Number(creditAmount);
    const months = Number(creditMonths);

    if (!creditTitle.trim() || !totalAmount || totalAmount <= 0 || !months || months <= 0 || !creditStartDate) {
      toast({
        title: t("debts.error"),
        description: t("debts.fillCreditFields"),
      });
      return;
    }

    const newCredit: Credit = {
      id: `credit-${Date.now()}`,
      title: creditTitle.trim(),
      totalAmount,
      currency: creditCurrency,
      kind: creditKind,
      startDate: creditStartDate,
      endDate: addMonthsToDate(creditStartDate, months),
      months,
      paidInstallments: 0,
      status: "active",
      description: creditDesc.trim() || undefined,
    };

    setCredits([newCredit, ...credits]);
    setShowAddCredit(false);

    setCreditTitle("");
    setCreditAmount("");
    setCreditCurrency("USD");
    setCreditKind("credit");
    setCreditMonths("5");
    setCreditStartDate(new Date().toISOString().split("T")[0]);
    setCreditDesc("");

    toast({
      title: t("debts.addCredit"),
      description: t("debts.createdPaymentPlan"),
    });
  };

  const updatePaidInstallments = (id: string, delta: number) => {
    setCredits(
      credits.map((credit) => {
        if (credit.id !== id) return credit;

        const nextPaid = Math.min(Math.max(credit.paidInstallments + delta, 0), credit.months);

        return {
          ...credit,
          paidInstallments: nextPaid,
          status: nextPaid >= credit.months ? "closed" : "active",
        };
      })
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("debts.title")}</h1>

        {!isLoadingData && (
          <button
            onClick={() => (mainTab === "debts" ? setShowAddDebt(true) : setShowAddCredit(true))}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* main tabs */}
      {isLoadingData ? (
        <Skeleton className="h-12 w-full rounded-2xl" />
      ) : (
        <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
          {[
            { key: "debts" as MainTab, label: t("debts.debtsTab") },
            { key: "credits" as MainTab, label: t("debts.creditsTab") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                mainTab === tab.key ? "tab-active" : "tab-inactive"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* DEBTS */}
      {mainTab === "debts" && (
        <>
          {isLoadingData ? (
            <Skeleton className="h-12 w-full rounded-2xl" />
          ) : (
            <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
              {[
                { key: "owe" as DebtTab, label: t("debts.iOwe") },
                { key: "owed" as DebtTab, label: t("debts.owedToMe") },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDebtTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    debtTab === tab.key ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {isLoadingData ? (
            <Skeleton className="h-24 w-full rounded-3xl" />
          ) : (
            <div className="fintech-card-elevated text-center py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {debtTab === "owe" ? t("debts.totalIOwe") : t("debts.totalOwedToMe")}
              </p>
              <p className={`text-2xl font-bold ${debtTab === "owe" ? "text-destructive" : "text-success"}`}>
                {formatMoney(totalOpenDebts, "USD")}
              </p>
            </div>
          )}

          {isLoadingData ? (
            <div>
              <Skeleton className="h-6 w-16 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            </div>
          ) : openDebts.length > 0 ? (
            <div>
              <h2 className="section-title mb-3">{t("debts.open")}</h2>
              <div className="space-y-2">
                {openDebts.map((d) => (
                  <div key={d.id} className="fintech-card flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-xl secondary-bg flex items-center justify-center text-lg font-bold text-primary">
                      {d.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.date}
                        {d.description ? ` · ${d.description}` : ""}
                      </p>
                    </div>

                    <p className={`text-sm font-semibold ${debtTab === "owe" ? "text-destructive" : "text-success"}`}>
                      {formatMoney(d.amount, d.currency)}
                    </p>

                    <button
                      onClick={() => markDebtClosed(d.id)}
                      className="p-1.5 rounded-lg bg-success/10 text-success"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!isLoadingData && closedDebts.length > 0 && (
            <div>
              <h2 className="section-title mb-3">{t("debts.closed")}</h2>
              <div className="space-y-2">
                {closedDebts.map((d) => (
                  <div key={d.id} className="fintech-card flex items-center gap-3 py-3 opacity-50">
                    <div className="w-10 h-10 rounded-xl secondary-bg flex items-center justify-center text-lg font-bold">
                      {d.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-through">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.date}</p>
                    </div>

                    <p className="text-sm font-semibold text-muted-foreground">
                      {formatMoney(d.amount, d.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoadingData && openDebts.length === 0 && closedDebts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-sm">{t("debts.noDebts")}</p>
            </div>
          )}
        </>
      )}

      {/* CREDITS */}
      {mainTab === "credits" && (
        <>
          {isLoadingData ? (
            <Skeleton className="h-24 w-full rounded-3xl" />
          ) : (
            <div className="fintech-card-elevated py-4 px-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={18} className="text-primary" />
                <p className="text-sm font-semibold">{t("debts.active")}</p>
              </div>

              <p className="text-2xl font-bold text-destructive">{formatMoney(totalCreditBalance, "USD")}</p>
            </div>
          )}

          {!isLoadingData && activeCredits.length > 0 && (
            <div>
              <h2 className="section-title mb-3">{t("debts.active")}</h2>
              <div className="space-y-3">
                {activeCredits.map((credit) => {
                  const monthlyPayment = calcMonthlyPayment(credit.totalAmount, credit.months);
                  const remainingPayments = Math.max(credit.months - credit.paidInstallments, 0);
                  const remainingAmount = monthlyPayment * remainingPayments;
                  const progress = (credit.paidInstallments / credit.months) * 100;

                  return (
                    <div key={credit.id} className="fintech-card space-y-3 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl secondary-bg flex items-center justify-center text-primary">
                          <CalendarDays size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">{credit.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {credit.kind === "credit" ? t("debts.credit") : t("debts.installment")}
                                {credit.description ? ` · ${credit.description}` : ""}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-destructive">
                              {formatMoney(remainingAmount, credit.currency)}
                            </p>
                          </div>

                          <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            <p>
                              {t("debts.period")}: {credit.startDate} → {credit.endDate}
                            </p>
                            <p>
                              {t("debts.monthlyPayment")}: {formatMoney(monthlyPayment, credit.currency)}
                            </p>
                            <p>
                              {t("debts.paid")}: {credit.paidInstallments} / {credit.months}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => updatePaidInstallments(credit.id, -1)}
                          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl secondary-bg text-sm"
                        >
                          <Minus size={14} />
                          {t("debts.removePayment")}
                        </button>

                        <button
                          onClick={() => updatePaidInstallments(credit.id, 1)}
                          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                        >
                          <Check size={14} />
                          {t("debts.markPayment")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isLoadingData && closedCredits.length > 0 && (
            <div>
              <h2 className="section-title mb-3">{t("debts.closed")}</h2>
              <div className="space-y-2">
                {closedCredits.map((credit) => (
                  <div key={credit.id} className="fintech-card py-3 opacity-60">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium line-through">{credit.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {credit.kind === "credit" ? t("debts.credit") : t("debts.installment")} · {credit.months}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-success">{t("debts.closedStatus")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoadingData && activeCredits.length === 0 && closedCredits.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-sm">{t("debts.noCredits")}</p>
            </div>
          )}
        </>
      )}

      {/* ADD DEBT MODAL */}
      <Dialog open={showAddDebt} onOpenChange={setShowAddDebt}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)]">
          <DialogHeader>
            <DialogTitle>{t("debts.addDebt")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
              {(["owe", "owed"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDebtType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    debtType === type ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {type === "owe" ? t("debts.iOwe") : t("debts.owedToMe")}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.personName")}
              </label>
              <input
                value={debtName}
                onChange={(e) => setDebtName(e.target.value)}
                placeholder={t("debts.personName")}
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.amount")}
              </label>
              <input
                type="number"
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.currency")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["USD", "UZS", "EUR"].map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setDebtCurrency(currency)}
                    className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                      debtCurrency === currency
                        ? "bg-primary text-primary-foreground"
                        : "secondary-bg text-muted-foreground"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.optionalDescription")}
              </label>
              <input
                value={debtDesc}
                onChange={(e) => setDebtDesc(e.target.value)}
                placeholder={t("debts.description")}
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              onClick={handleAddDebt}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              {t("debts.addDebt")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD CREDIT MODAL */}
      <Dialog open={showAddCredit} onOpenChange={setShowAddCredit}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)]">
          <DialogHeader>
            <DialogTitle>{t("debts.addCredit")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex rounded-2xl p-1 gap-1 shadow-sm">
              {(["credit", "installment"] as const).map((kind) => (
                <button
                  key={kind}
                  onClick={() => setCreditKind(kind)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    creditKind === kind ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {kind === "credit" ? t("debts.credit") : t("debts.installment")}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.titleLabel")}
              </label>
              <input
                value={creditTitle}
                onChange={(e) => setCreditTitle(e.target.value)}
                placeholder={t("debts.titleLabel")}
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.totalAmount")}
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.currency")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["USD", "UZS", "EUR"].map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setCreditCurrency(currency)}
                    className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                      creditCurrency === currency
                        ? "bg-primary text-primary-foreground"
                        : "secondary-bg text-muted-foreground"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.startDate")}
              </label>
              <input
                type="date"
                value={creditStartDate}
                onChange={(e) => setCreditStartDate(e.target.value)}
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.months")}
              </label>
              <input
                type="number"
                min="1"
                value={creditMonths}
                onChange={(e) => setCreditMonths(e.target.value)}
                placeholder="5"
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="rounded-2xl secondary-bg p-3 text-sm">
              <p className="font-medium mb-1">{t("debts.preview")}</p>
              <p className="text-muted-foreground">
                {t("debts.endDate")}:{" "}
                <span className="text-foreground">
                  {addMonthsToDate(creditStartDate, Number(creditMonths) || 0) || "—"}
                </span>
              </p>
              <p className="text-muted-foreground">
                {t("debts.monthlyPayment")}:{" "}
                <span className="text-foreground">
                  {formatMoney(
                    calcMonthlyPayment(Number(creditAmount) || 0, Number(creditMonths) || 1),
                    creditCurrency
                  )}
                </span>
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("debts.optionalDescription")}
              </label>
              <input
                value={creditDesc}
                onChange={(e) => setCreditDesc(e.target.value)}
                placeholder={t("debts.description")}
                className="w-full rounded-xl bg-secondary dark:bg-[rgba(28,32,44,0.3)] border-0 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              onClick={handleAddCredit}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              {t("debts.addCredit")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Debts;