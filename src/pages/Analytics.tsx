import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Period = "day" | "week" | "month" | "year";

const CHART_COLORS = [
  "hsl(24, 85%, 55%)",
  "hsl(225, 73%, 57%)",
  "hsl(330, 70%, 55%)",
  "hsl(280, 67%, 55%)",
  "hsl(152, 69%, 41%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 80%, 50%)",
  "hsl(45, 93%, 47%)",
];

const Analytics = () => {
  const { t, i18n } = useTranslation();
  const { transactions } = useApp();

  const [period, setPeriod] = useState<Period>("month");

  const now = new Date();

  const isSameDay = (date: Date, target: Date) => {
    return (
      date.getDate() === target.getDate() &&
      date.getMonth() === target.getMonth() &&
      date.getFullYear() === target.getFullYear()
    );
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);

      if (period === "day") {
        return isSameDay(txDate, now);
      }

      if (period === "week") {
        const start = getWeekStart(now);
        const end = getWeekEnd(now);
        return txDate >= start && txDate <= end;
      }

      if (period === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return txDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, period]);

  const getCategoryLabel = (categoryKey: string) => {
    const map: Record<string, string> = {
      "Food & Dining": t("transactionForm.categories.foodDining"),
      "Transport": t("transactionForm.categories.transport"),
      "Shopping": t("transactionForm.categories.shopping"),
      "Entertainment": t("transactionForm.categories.entertainment"),
      "Health": t("transactionForm.categories.health"),
      "Housing": t("transactionForm.categories.housing"),
      "Salary": t("transactionForm.categories.salary"),
      "Freelance": t("transactionForm.categories.freelance"),
      "Investment": t("transactionForm.categories.investment"),
      "Gift": t("transactionForm.categories.gift"),
      "Transfer": t("transactionForm.categories.transfer"),
      "Other": t("transactionForm.categories.other"),
      "Groceries": t("transactionForm.categories.groceries"),
    };

    return map[categoryKey] || categoryKey;
  };

  const incomeTransactions = filteredTransactions.filter((tx) => tx.type === "income");
  const expenseTransactions = filteredTransactions.filter((tx) => tx.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};

    expenseTransactions.forEach((tx) => {
      if (!grouped[tx.category]) {
        grouped[tx.category] = 0;
      }
      grouped[tx.category] += tx.amount;
    });

    return Object.entries(grouped)
      .map(([name, value], index) => ({
        name,
        label: getCategoryLabel(name),
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenseTransactions, i18n.language]);

  const totalCategoryAmount = pieData.reduce((s, d) => s + d.value, 0);
  const topCategory = pieData.length > 0 ? pieData[0] : null;

  const barData = useMemo(() => {
    if (period === "day") {
      return Array.from({ length: 24 }, (_, hour) => {
        const hourTransactions = filteredTransactions.filter((tx) => {
          const d = new Date(tx.date);
          return d.getHours() === hour;
        });

        return {
          label: `${hour}:00`,
          income: hourTransactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0),
          expenses: hourTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0),
        };
      });
    }

    if (period === "week") {
      const days = [0, 1, 2, 3, 4, 5, 6];
      const weekStart = getWeekStart(now);

      return days.map((offset) => {
        const current = new Date(weekStart);
        current.setDate(weekStart.getDate() + offset);

        const dayTransactions = filteredTransactions.filter((tx) =>
          isSameDay(new Date(tx.date), current)
        );

        return {
          label: current.toLocaleDateString(i18n.language === "uz" ? "uz-UZ" : "ru-RU", {
            weekday: "short",
          }),
          income: dayTransactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0),
          expenses: dayTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0),
        };
      });
    }

    if (period === "month") {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      return Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;

        const dayTransactions = filteredTransactions.filter((tx) => {
          const d = new Date(tx.date);
          return d.getDate() === day;
        });

        return {
          label: `${day}`,
          income: dayTransactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0),
          expenses: dayTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0),
        };
      });
    }

    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthTransactions = transactions.filter((tx) => {
        const d = new Date(tx.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === monthIndex;
      });

      return {
        label: new Date(now.getFullYear(), monthIndex, 1).toLocaleDateString(
          i18n.language === "uz" ? "uz-UZ" : "ru-RU",
          { month: "short" }
        ),
        income: monthTransactions
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + tx.amount, 0),
        expenses: monthTransactions
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + tx.amount, 0),
      };
    });
  }, [filteredTransactions, transactions, period, i18n.language]);

  const lineData = useMemo(() => {
    let runningBalance = 0;

    return barData.map((item) => {
      runningBalance += item.income - item.expenses;
      return {
        label: item.label,
        balance: runningBalance,
      };
    });
  }, [barData]);

  const formatMoney = (value: number) => {
    return `$${value.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">{t("analytics.title")}</h1>

      {/* Period Filter */}
      <div className="flex rounded-2xl p-1 gap-1">
        {(["day", "week", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all shadow-sm ${
              period === p ? "tab-active" : "tab-inactive bg-secondary/50"
            }`}
          >
            {t(`analytics.period.${p}`)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-3xl border border-border/30 p-4 card-container">
          <p className="text-xs text-muted-foreground mb-1">{t("analytics.income")}</p>
          <p className="text-lg font-bold text-success">{formatMoney(totalIncome)}</p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container">
          <p className="text-xs text-muted-foreground mb-1">{t("analytics.expense")}</p>
          <p className="text-lg font-bold text-destructive">{formatMoney(totalExpenses)}</p>
        </div>

        <div className="rounded-3xl border border-border/30 p-4 card-container">
          <p className="text-xs text-muted-foreground mb-1">{t("analytics.balance")}</p>
          <p className="text-lg font-bold">{formatMoney(netBalance)}</p>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.byCategory")}</h3>

        {pieData.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("analytics.noData")}</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={62}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--card))"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name, payload) => [
                      formatMoney(value),
                      payload?.payload?.label,
                    ]}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 16,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              {topCategory && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-bold">
                    {Math.round((topCategory.value / totalCategoryAmount) * 100)}%
                  </p>
                  <p className="text-[9px] text-muted-foreground font-medium text-center px-2">
                    {topCategory.label}
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2.5">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground font-medium">{d.label}</span>
                  </div>
                  <span className="font-semibold">
                    {formatMoney(d.value)}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({Math.round((d.value / totalCategoryAmount) * 100)}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Income vs Expenses */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.incomeVsExpense")}</h3>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => formatMoney(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 16,
                fontSize: 12,
              }}
            />
            <Bar dataKey="income" fill="hsl(152, 69%, 41%)" radius={[6, 6, 0, 0]} barSize={14} />
            <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            {t("analytics.income")}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            {t("analytics.expense")}
          </div>
        </div>
      </div>

      {/* Balance Trend */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.balanceTrend")}</h3>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={lineData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={45}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => formatMoney(value)}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 16,
                fontSize: 12,
              }}
            />
            <Line
              type="natural"
              dataKey="balance"
              stroke="hsl(225, 73%, 57%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(225, 73%, 57%)", r: 3, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;