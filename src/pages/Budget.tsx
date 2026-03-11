import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Pencil, AlertTriangle, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, BudgetPlan, BudgetIncomePlanItem, BudgetCategoryLimit } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const expenseCategories = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Housing",
  "Groceries",
  "Other",
];

const formatMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthLabel = (monthKey: string, locale: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString(locale === "uz" ? "uz-UZ" : "ru-RU", {
    month: "long",
    year: "numeric",
  });
};

const formatMoney = (amount: number, currency: string) => {
  if (currency === "UZS") {
    return `${Math.round(amount).toLocaleString("en-US")} сум`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusColor = (progress: number) => {
  if (progress >= 100) return "bg-destructive";
  if (progress >= 80) return "bg-warning";
  return "bg-success";
};

const getProgressTextColor = (progress: number) => {
  if (progress >= 100) return "text-destructive";
  if (progress >= 80) return "text-warning";
  return "text-success";
};

const Budget = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    workspace,
    language,
    selectedCurrency,
    transactions,
    budgetPlans,
    setBudgetPlans,
    budgetIncomePlanItems,
    setBudgetIncomePlanItems,
    budgetCategoryLimits,
    setBudgetCategoryLimits,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(formatMonthKey(new Date()));

  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const currentPlan = useMemo(() => {
    return budgetPlans.find(
      (plan) => plan.month === selectedMonth && plan.workspace === workspace
    );
  }, [budgetPlans, selectedMonth, workspace]);

  const currentPlanId = currentPlan?.id ?? null;

  const currentIncomeItems = useMemo(() => {
    if (!currentPlanId) return [];
    return budgetIncomePlanItems.filter((item) => item.budgetPlanId === currentPlanId);
  }, [budgetIncomePlanItems, currentPlanId]);

  const currentCategoryLimits = useMemo(() => {
    if (!currentPlanId) return [];
    return budgetCategoryLimits.filter((item) => item.budgetPlanId === currentPlanId);
  }, [budgetCategoryLimits, currentPlanId]);

  const monthTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const actualIncome = useMemo(() => {
    return monthTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [monthTransactions]);

  const actualExpenses = useMemo(() => {
    return monthTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [monthTransactions]);

  const actualIncomeByCategory = useMemo(() => {
    return monthTransactions
      .filter((tx) => tx.type === "income")
      .reduce<Record<string, number>>((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
  }, [monthTransactions]);

  const actualExpenseByCategory = useMemo(() => {
    return monthTransactions
      .filter((tx) => tx.type === "expense")
      .reduce<Record<string, number>>((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
  }, [monthTransactions]);

  const totalPlannedIncome = useMemo(() => {
    if (currentIncomeItems.length > 0) {
      return currentIncomeItems.reduce((sum, item) => sum + item.plannedAmount, 0);
    }
    return currentPlan?.plannedIncome ?? 0;
  }, [currentIncomeItems, currentPlan]);

  const totalExpenseLimit = useMemo(() => {
    if (currentCategoryLimits.length === 0) return currentPlan?.plannedExpense ?? 0;
    return currentCategoryLimits.reduce((sum, item) => sum + item.limitAmount, 0);
  }, [currentCategoryLimits, currentPlan]);

  const incomeRows = useMemo(() => {
    return incomeCategories.map((category) => {
      const planned =
        currentIncomeItems.find((item) => item.category === category)?.plannedAmount ?? 0;
      const actual = actualIncomeByCategory[category] ?? 0;
      const diff = actual - planned;

      return {
        category,
        planned,
        actual,
        diff,
      };
    });
  }, [currentIncomeItems, actualIncomeByCategory]);

  const expenseRows = useMemo(() => {
    return expenseCategories
      .map((category) => {
        const limit =
          currentCategoryLimits.find((item) => item.category === category)?.limitAmount ?? 0;
        const actual = actualExpenseByCategory[category] ?? 0;
        const remaining = limit - actual;
        const progress = limit > 0 ? (actual / limit) * 100 : 0;

        return {
          category,
          limit,
          actual,
          remaining,
          progress,
        };
      })
      .filter((row) => row.limit > 0 || row.actual > 0);
  }, [currentCategoryLimits, actualExpenseByCategory]);

  const warnings = useMemo(() => {
    const list: string[] = [];

    if (totalPlannedIncome > 0 && actualIncome < totalPlannedIncome * 0.5) {
      list.push(
        `Фактический доход за ${formatMonthLabel(selectedMonth, language)} заметно ниже плана`
      );
    }

    expenseRows.forEach((row) => {
      if (row.limit > 0 && row.actual >= row.limit) {
        list.push(`Категория "${row.category}" превысила лимит`);
      } else if (row.limit > 0 && row.actual >= row.limit * 0.8) {
        list.push(`Категория "${row.category}" достигла 80% лимита`);
      }
    });

    if (totalExpenseLimit > 0 && actualExpenses > totalExpenseLimit) {
      list.push("Общий лимит расходов превышен");
    }

    return list;
  }, [expenseRows, totalPlannedIncome, totalExpenseLimit, actualIncome, actualExpenses, selectedMonth, language]);

  const goPrevMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const nextDate = new Date(year, month - 2, 1);
    setSelectedMonth(formatMonthKey(nextDate));
  };

  const goNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const nextDate = new Date(year, month, 1);
    setSelectedMonth(formatMonthKey(nextDate));
  };

  const savePlan = (plannedIncome: number, plannedExpense: number) => {
    if (currentPlan) {
      setBudgetPlans(
        budgetPlans.map((plan) =>
          plan.id === currentPlan.id
            ? { ...plan, plannedIncome, plannedExpense, currency: selectedCurrency }
            : plan
        )
      );
    } else {
      const newPlan: BudgetPlan = {
        id: `budget-plan-${Date.now()}`,
        month: selectedMonth,
        workspace,
        currency: selectedCurrency,
        plannedIncome,
        plannedExpense,
      };
      setBudgetPlans([...budgetPlans, newPlan]);
    }
  };

  const saveIncomeItem = (category: string, plannedAmount: number) => {
    if (!currentPlan) {
      const newPlan: BudgetPlan = {
        id: `budget-plan-${Date.now()}`,
        month: selectedMonth,
        workspace,
        currency: selectedCurrency,
        plannedIncome: 0,
        plannedExpense: 0,
      };

      setBudgetPlans([...budgetPlans, newPlan]);

      const newItem: BudgetIncomePlanItem = {
        id: `income-plan-${Date.now()}`,
        budgetPlanId: newPlan.id,
        category,
        plannedAmount,
      };

      setBudgetIncomePlanItems([...budgetIncomePlanItems, newItem]);
      return;
    }

    const existing = currentIncomeItems.find((item) => item.category === category);

    if (existing) {
      setBudgetIncomePlanItems(
        budgetIncomePlanItems.map((item) =>
          item.id === existing.id ? { ...item, plannedAmount } : item
        )
      );
    } else {
      const newItem: BudgetIncomePlanItem = {
        id: `income-plan-${Date.now()}`,
        budgetPlanId: currentPlan.id,
        category,
        plannedAmount,
      };

      setBudgetIncomePlanItems([...budgetIncomePlanItems, newItem]);
    }
  };

  const saveExpenseLimit = (category: string, limitAmount: number) => {
    if (!currentPlan) {
      const newPlan: BudgetPlan = {
        id: `budget-plan-${Date.now()}`,
        month: selectedMonth,
        workspace,
        currency: selectedCurrency,
        plannedIncome: 0,
        plannedExpense: 0,
      };

      setBudgetPlans([...budgetPlans, newPlan]);

      const newItem: BudgetCategoryLimit = {
        id: `expense-limit-${Date.now()}`,
        budgetPlanId: newPlan.id,
        category,
        limitAmount,
      };

      setBudgetCategoryLimits([...budgetCategoryLimits, newItem]);
      return;
    }

    const existing = currentCategoryLimits.find((item) => item.category === category);

    if (existing) {
      setBudgetCategoryLimits(
        budgetCategoryLimits.map((item) =>
          item.id === existing.id ? { ...item, limitAmount } : item
        )
      );
    } else {
      const newItem: BudgetCategoryLimit = {
        id: `expense-limit-${Date.now()}`,
        budgetPlanId: currentPlan.id,
        category,
        limitAmount,
      };

      setBudgetCategoryLimits([...budgetCategoryLimits, newItem]);
    }
  };

  const projectedSavings = totalPlannedIncome - totalExpenseLimit;
  const actualNet = actualIncome - actualExpenses;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full secondary-bg flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Бюджет</h1>
          <p className="text-xs text-muted-foreground">
            Планирование и сравнение с фактом
          </p>
        </div>
      </div>

      {/* Month switcher */}
      <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={goPrevMonth}
            className="w-10 h-10 rounded-2xl secondary-bg flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Период
            </p>
            <p className="text-lg font-bold capitalize">
              {formatMonthLabel(selectedMonth, language)}
            </p>
          </div>

          <button
            onClick={goNextMonth}
            className="w-10 h-10 rounded-2xl secondary-bg flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">План дохода</p>
          <p className="text-lg font-bold text-success">
            {formatMoney(totalPlannedIncome, selectedCurrency)}
          </p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Факт дохода</p>
          <p className="text-lg font-bold text-success">
            {formatMoney(actualIncome, selectedCurrency)}
          </p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Лимит расходов</p>
          <p className="text-lg font-bold text-warning">
            {formatMoney(totalExpenseLimit, selectedCurrency)}
          </p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Факт расходов</p>
          <p className="text-lg font-bold text-destructive">
            {formatMoney(actualExpenses, selectedCurrency)}
          </p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Плановый остаток</p>
          <p className="text-lg font-bold">
            {formatMoney(projectedSavings, selectedCurrency)}
          </p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Фактический итог</p>
          <p className={`text-lg font-bold ${actualNet >= 0 ? "text-success" : "text-destructive"}`}>
            {formatMoney(actualNet, selectedCurrency)}
          </p>
        </div>
      </div>

      {/* Budget setup */}
      <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-primary" />
            <h2 className="section-title">Параметры бюджета</h2>
          </div>

          <button
            onClick={() => setShowPlanDialog(true)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          >
            <Pencil size={16} />
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">План доходов</span>
            <span className="font-semibold">{formatMoney(totalPlannedIncome, selectedCurrency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">План расходов</span>
            <span className="font-semibold">{formatMoney(totalExpenseLimit, selectedCurrency)}</span>
          </div>
        </div>
      </div>

      {/* Income plan */}
      <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">План доходов по категориям</h2>
          <button
            onClick={() => setShowIncomeDialog(true)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {incomeRows.map((row) => (
            <div
              key={row.category}
              className="rounded-2xl border border-border/30 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">{row.category}</p>
                <p className="text-xs text-muted-foreground">
                  План: {formatMoney(row.planned, selectedCurrency)} · Факт:{" "}
                  {formatMoney(row.actual, selectedCurrency)}
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${
                  row.diff >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {row.diff >= 0 ? "+" : ""}
                {formatMoney(row.diff, selectedCurrency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense limits */}
      <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Лимиты расходов</h2>
          <button
            onClick={() => setShowLimitDialog(true)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {expenseRows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Лимиты пока не заданы
            </div>
          ) : (
            expenseRows.map((row) => (
              <div key={row.category} className="rounded-2xl border border-border/30 p-4">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">{row.category}</p>
                    <p className="text-xs text-muted-foreground">
                      Лимит: {formatMoney(row.limit, selectedCurrency)} · Факт:{" "}
                      {formatMoney(row.actual, selectedCurrency)}
                    </p>
                  </div>

                  <p className={`text-sm font-semibold ${getProgressTextColor(row.progress)}`}>
                    {row.remaining >= 0
                      ? `Осталось ${formatMoney(row.remaining, selectedCurrency)}`
                      : `Перерасход ${formatMoney(Math.abs(row.remaining), selectedCurrency)}`}
                  </p>
                </div>

                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStatusColor(row.progress)}`}
                    style={{ width: `${Math.min(row.progress, 100)}%` }}
                  />
                </div>

                <p className="text-[10px] text-muted-foreground mt-1">
                  Использовано {row.limit > 0 ? Math.round(row.progress) : 0}%
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-3xl border border-border/30 p-4 card-container shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-warning" />
          <h2 className="section-title">Предупреждения</h2>
        </div>

        {warnings.length === 0 ? (
          <div className="text-sm text-success">Все выглядит нормально. Бюджет под контролем.</div>
        ) : (
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="rounded-2xl bg-warning/10 text-warning px-4 py-3 text-sm"
              >
                {warning}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <PlanDialog
        open={showPlanDialog}
        onOpenChange={setShowPlanDialog}
        initialIncome={currentPlan?.plannedIncome ?? totalPlannedIncome}
        initialExpense={currentPlan?.plannedExpense ?? totalExpenseLimit}
        onSave={savePlan}
      />

      <IncomeDialog
        open={showIncomeDialog}
        onOpenChange={setShowIncomeDialog}
        items={currentIncomeItems}
        onSave={saveIncomeItem}
      />

      <ExpenseLimitDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        items={currentCategoryLimits}
        onSave={saveExpenseLimit}
      />
    </div>
  );
};

const PlanDialog = ({
  open,
  onOpenChange,
  initialIncome,
  initialExpense,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIncome: number;
  initialExpense: number;
  onSave: (income: number, expense: number) => void;
}) => {
  const [income, setIncome] = useState(initialIncome.toString());
  const [expense, setExpense] = useState(initialExpense.toString());

  const handleSave = () => {
    onSave(Number(income || 0), Number(expense || 0));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Параметры бюджета</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              План дохода
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              План расходов
            </label>
            <input
              type="number"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Сохранить
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const IncomeDialog = ({
  open,
  onOpenChange,
  items,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BudgetIncomePlanItem[];
  onSave: (category: string, amount: number) => void;
}) => {
  const [category, setCategory] = useState(incomeCategories[0]);
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (!amount || Number(amount) < 0) return;
    onSave(category, Number(amount));
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle>План дохода по категории</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Категория
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            >
              {incomeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl secondary-bg p-3 text-xs text-muted-foreground">
            Уже задано:{" "}
            {items.find((item) => item.category === category)?.plannedAmount ?? 0}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Сумма
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Сохранить
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ExpenseLimitDialog = ({
  open,
  onOpenChange,
  items,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BudgetCategoryLimit[];
  onSave: (category: string, amount: number) => void;
}) => {
  const [category, setCategory] = useState(expenseCategories[0]);
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (!amount || Number(amount) < 0) return;
    onSave(category, Number(amount));
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Лимит расходов по категории</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Категория
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            >
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl secondary-bg p-3 text-xs text-muted-foreground">
            Уже задано: {items.find((item) => item.category === category)?.limitAmount ?? 0}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Лимит
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl input-bg px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Сохранить
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Budget;