import { useState } from "react";
import { useApp, Transaction } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DateTimePicker } from "@/components/ui/date-time-picker";

type TxType = "expense" | "income" | "transfer";
type DetailTab = "date" | "description" | "note";

const categories = {
  expense: ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Housing", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

interface AddTransactionModalProps {
  onClose?: () => void;
  defaultType?: TxType;
  modalOpen?: boolean;
  openChange?: (open: boolean) => void;
  editTransaction?: Transaction | null;
}

function formatLocalDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function AddTransactionModal({ onClose, defaultType, modalOpen, openChange, editTransaction }: AddTransactionModalProps) {
  if (modalOpen === false) {
    return null;
  }

  const isEditMode = !!editTransaction;

  const { accounts, transactions, setTransactions, exchangeRates, updateTransaction } = useApp();
  const [txType, setTxType] = useState<TxType>(defaultType || editTransaction?.type || "expense");
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || "");
  const [toAmount, setToAmount] = useState(editTransaction?.toAmount?.toString() || "");
  const [category, setCategory] = useState(editTransaction?.category || "");
  const [description, setDescription] = useState(editTransaction?.description || "");
  const [fromAccountId, setFromAccountId] = useState(editTransaction?.accountId || accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState(editTransaction?.toAccountId || accounts[1]?.id || "");
  const [date, setDate] = useState(editTransaction?.date ? editTransaction.date.slice(0, 16) : formatLocalDateTime(new Date()));
  const [note, setNote] = useState(editTransaction?.note || "");
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("date");

  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const toAccount = accounts.find(a => a.id === toAccountId);

  const getExchangeRate = (from: string, to: string): number => {
    if (from === to) return 1;
    const rate = exchangeRates.find(r => r.from === from && r.to === to);
    return rate?.rate || 1;
  };

  const formatRate = (rate: number): string => {
    if (rate >= 1000) {
      return rate.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else if (rate >= 1) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(6);
    }
  };

  const convertedAmount = txType === "transfer" && fromAccount && toAccount && amount
    ? parseFloat(amount) * getExchangeRate(fromAccount.currency, toAccount.currency)
    : null;

  const handleClose = () => {
    if (openChange) {
      openChange(false);
    } else if (onClose) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!amount || (!category && txType !== "transfer")) return;
    
    let finalToAmount: number | undefined = undefined;
    if (txType === "transfer" && fromAccount && toAccount && amount) {
      if (fromAccount.currency !== toAccount.currency) {
        finalToAmount = toAmount ? parseFloat(toAmount) : parseFloat(amount) * getExchangeRate(fromAccount.currency, toAccount.currency);
      } else {
        finalToAmount = parseFloat(amount);
      }
    }

    const tx = {
      id: `tx-${Date.now()}`,
      type: txType,
      amount: parseFloat(amount),
      currency: fromAccount?.currency || "USD",
      category: txType === "transfer" ? "Transfer" : category,
      description: description || category,
      accountId: fromAccountId,
      accountName: fromAccount?.name || "",
      ...(txType === "transfer" && {
        toAccountId,
        toAccountName: toAccount?.name || "",
        toCurrency: toAccount?.currency,
        toAmount: finalToAmount,
      }),
      date,
      icon: txType === "expense" ? "💸" : txType === "income" ? "💰" : "🔄",
      note: note || undefined,
    };
    setTransactions([tx, ...transactions]);
    toast({ title: isEditMode ? "Transaction Updated" : "Transaction Added" });
    handleClose();
    if (onClose) onClose();
  };

  return (
    <Dialog open={modalOpen !== undefined ? modalOpen : true} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">{isEditMode ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Transaction Type */}
          <div className="flex rounded-2xl p-1 gap-1">
            {(["expense", "income", "transfer"] as TxType[]).map((t) => (
              <button 
                key={t} 
                type="button"
                onClick={() => setTxType(t)} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-colors shadow-sm ${txType === t ? "tab-active" : "tab-inactive"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">
              {txType === "transfer" ? "Amount to Send" : "Amount"}
            </label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00" 
              className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
            />
          </div>

          {/* Category + Account Row for expense/income */}
          {txType !== "transfer" && (
            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Category</label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full input-bg text-slate-900 dark:text-white rounded-2xl py-2.5 px-3 text-sm appearance-none pr-8 shadow-sm"
                  >
                    <option value="">Select</option>
                    {categories[txType].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Account */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Account</label>
                <div className="relative">
                  <select 
                    value={fromAccountId} 
                    onChange={e => setFromAccountId(e.target.value)} 
                    className="w-full input-bg text-slate-900 dark:text-white rounded-2xl py-2.5 px-3 text-sm appearance-none pr-8 shadow-sm"
                  >
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Section */}
          {txType === "transfer" && (
            <div className="space-y-3">
              {/* From Account + To Account Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* From Account */}
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">From Account</label>
                  <div className="relative">
                    <select 
                      value={fromAccountId} 
                      onChange={e => setFromAccountId(e.target.value)} 
                      className="w-full input-bg text-slate-900 dark:text-white rounded-2xl py-2.5 px-3 text-sm appearance-none pr-8 shadow-sm"
                    >
                      {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* To Account */}
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">To Account</label>
                  <div className="relative">
                    <select 
                      value={toAccountId} 
                      onChange={e => setToAccountId(e.target.value)} 
                      className="w-full input-bg text-slate-900 dark:text-white rounded-2xl py-2.5 px-3 text-sm appearance-none pr-8 shadow-sm"
                    >
                      {accounts.filter(a => a.id !== fromAccountId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount to Receive - only show when currencies are different */}
              {fromAccount && toAccount && fromAccount.currency !== toAccount.currency && (
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 mb-1 block">Amount to Receive</label>
                  <input 
                    type="number" 
                    value={toAmount} 
                    onChange={e => setToAmount(e.target.value)} 
                    placeholder={convertedAmount ? convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"} 
                    className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                  />
                  <p className="text-[10px] text-slate-500 dark:text-white/50 mt-1">
                    Rate: 1 {fromAccount.currency} = {formatRate(getExchangeRate(fromAccount.currency, toAccount.currency))} {toAccount.currency}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Detail Tabs: Date & Time, Description, Note */}
          <div>
            <div className="flex rounded-2xl p-1 gap-1">
              <button 
                type="button"
                onClick={() => setActiveDetailTab("date")} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm ${activeDetailTab === "date" ? "tab-active" : "tab-inactive"}`}
              >
                Date & Time
              </button>
              <button 
                type="button"
                onClick={() => setActiveDetailTab("description")} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm ${activeDetailTab === "description" ? "tab-active" : "tab-inactive"}`}
              >
                Description
              </button>
              <button 
                type="button"
                onClick={() => setActiveDetailTab("note")} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm ${activeDetailTab === "note" ? "tab-active" : "tab-inactive"}`}
              >
                Note (optional)
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-3">
              {activeDetailTab === "date" && (
                <DateTimePicker value={date} onChange={setDate} />
              )}
              
              {activeDetailTab === "description" && (
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Enter description..." 
                  className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                />
              )}
              
              {activeDetailTab === "note" && (
                <input 
                  type="text" 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  placeholder="Additional details..." 
                  className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit} 
            className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-sm shadow-md"
          >
            {isEditMode ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactionModal;
