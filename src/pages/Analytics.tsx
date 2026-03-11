import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

const pieData = [
  { name: "Food", value: 420, color: "hsl(24, 85%, 55%)" },
  { name: "Transport", value: 180, color: "hsl(225, 73%, 57%)" },
  { name: "Shopping", value: 310, color: "hsl(330, 70%, 55%)" },
  { name: "Entertainment", value: 95, color: "hsl(280, 67%, 55%)" },
  { name: "Health", value: 65, color: "hsl(152, 69%, 41%)" },
];

const barData = [
  { month: "Sep", income: 3800, expenses: 2900 },
  { month: "Oct", income: 4200, expenses: 3100 },
  { month: "Nov", income: 3900, expenses: 2800 },
  { month: "Dec", income: 5100, expenses: 4200 },
  { month: "Jan", income: 4000, expenses: 3300 },
  { month: "Feb", income: 3650, expenses: 2850 },
];

const lineData = [
  { month: "Sep", balance: 12000 },
  { month: "Oct", balance: 13100 },
  { month: "Nov", balance: 14200 },
  { month: "Dec", balance: 15100 },
  { month: "Jan", balance: 15800 },
  { month: "Feb", balance: 17391 },
];

type Period = "day" | "week" | "month" | "year";

const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("month");

  const total = pieData.reduce((s, d) => s + d.value, 0);
  const topCategory = pieData.reduce((a, b) => a.value > b.value ? a : b);

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
            {t(`analytics.periods.${p}`)}
          </button>
        ))}
      </div>

      {/* Expenses by Category */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.spendingByCategory")}</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold">{Math.round(topCategory.value / total * 100)}%</p>
              <p className="text-[9px] text-muted-foreground font-medium">{topCategory.name}</p>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground font-medium">{d.name}</span>
                </div>
                <span className="font-semibold">${d.value} <span className="text-muted-foreground font-normal">({Math.round(d.value / total * 100)}%)</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expenses */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.incomeVsExpense")}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={40} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
            <Bar dataKey="income" fill="hsl(152, 69%, 41%)" radius={[6, 6, 0, 0]} barSize={14} />
            <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium"><div className="w-2.5 h-2.5 rounded-full bg-success" />{t("analytics.income")}</div>
          <div className="flex items-center gap-1.5 text-xs font-medium"><div className="w-2.5 h-2.5 rounded-full bg-destructive" />{t("analytics.expenses")}</div>
        </div>
      </div>

      {/* Balance Trend */}
      <div className="rounded-3xl border border-border/30 p-5 card-container">
        <h3 className="section-title mb-4">{t("analytics.balanceTrend")}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={45} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
            <Line type="natural" dataKey="balance" stroke="hsl(225, 73%, 57%)" strokeWidth={2.5} dot={{ fill: "hsl(225, 73%, 57%)", r: 3, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
