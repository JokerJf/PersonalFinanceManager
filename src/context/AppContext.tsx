import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { api } from "../api/api";
import i18n from "../i18n";
import {
  mockAccounts,
  mockTransactions,
  mockDebts,
  mockNotifications,
  mockFamilyMembers,
  mockExchangeRates
} from "../api/mockData";

export type Workspace = "personal" | "family";
export type CardNetwork = "visa" | "mastercard" | "humo" | "uzcard" | "none";

export interface Account {
  id: string;
  name: string;
  type: "card" | "cash" | "bank";
  currency: string;
  balance: number;
  color: string;
  cardNetwork?: CardNetwork;
  cardNumberFull?: string;
  expiryDate?: string;
  includedInBalance?: boolean;
}

export interface Transaction {
  id: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  currency: string;
  category: string;
  description: string;
  accountId: string;
  accountName: string;
  toAccountId?: string;
  toAccountName?: string;
  toCurrency?: string;
  toAmount?: number;
  date: string;
  icon: string;
  note?: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  currency: string;
  type: "owe" | "owed";
  status: "open" | "closed";
  date: string;
  description?: string;
}

export interface Credit {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  kind: "credit" | "installment";
  startDate: string;
  endDate: string;
  months: number;
  paidInstallments: number;
  status: "active" | "closed";
  description?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "member";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

export const categoryIcons: Record<string, string> = {
  "Food & Dining": "utensils-crossed",
  Transport: "car",
  Shopping: "shopping-bag",
  Entertainment: "film",
  Health: "heart-pulse",
  Housing: "home",
  Groceries: "shopping-cart",
  Salary: "briefcase",
  Freelance: "laptop",
  Investment: "trending-up",
  Gift: "gift",
  Transfer: "arrow-left-right",
  Other: "circle-dot",
};

interface AppContextType {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;

  accounts: Account[];
  setAccounts: (a: Account[]) => void;

  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;

  debts: Debt[];
  setDebts: (d: Debt[]) => void;

  credits: Credit[];
  setCredits: (c: Credit[]) => void;

  familyMembers: FamilyMember[];
  setFamilyMembers: (m: FamilyMember[]) => void;

  totalBalance: number;
  balanceCurrency: string;
  setBalanceCurrency: (c: string) => void;

  currency: string;
  notifications: Notification[];

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  userName: string;
  setUserName: (n: string) => void;

  userEmail: string;
  setUserEmail: (e: string) => void;

  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;

  language: "ru" | "uz";
  setLanguage: (lang: "ru" | "uz") => void;
  changeLanguage: (lang: "ru" | "uz") => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  familyEnabled: boolean;
  setFamilyEnabled: (v: boolean) => void;

  aiInsightEnabled: boolean;
  setAiInsightEnabled: (v: boolean) => void;

  exchangeRates: ExchangeRate[];
  isLoadingExchangeRates: boolean;
  isLoadingData: boolean;

  refreshData: () => Promise<void>;
  refreshExchangeRates: () => Promise<void>;

  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;

  selectedTransactionId: string | null;
  setSelectedTransactionId: (id: string | null) => void;

  addAccountModalOpen: boolean;
  setAddAccountModalOpen: (open: boolean) => void;

  addTransactionModalOpen: boolean;
  setAddTransactionModalOpen: (open: boolean) => void;

  addTransactionDefaultType: "expense" | "income" | "transfer";
  setAddTransactionDefaultType: (type: "expense" | "income" | "transfer") => void;

  resetFamilyData: () => void;
  deleteFamily: () => void;
  removeFamilyMember: (id: string) => void;
  toggleAccountInBalance: (id: string) => void;

  deleteTransaction: (id: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;

  addAccount: (account: Omit<Account, "id">) => Promise<Account>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<Transaction>;
}

const personalAccounts: Account[] = [
  { id: "1", name: "Visa Platinum", type: "card", currency: "USD", balance: 4250.8, color: "from-[#1a1f71] to-[#2d4aa8]", cardNetwork: "visa", cardNumberFull: "4276123456783421", expiryDate: "09/28", includedInBalance: true },
  { id: "2", name: "Humo", type: "card", currency: "UZS", balance: 12800000, color: "from-[#00a651] to-[#4fc978]", cardNetwork: "humo", cardNumberFull: "9860456789017812", expiryDate: "03/27", includedInBalance: true },
  { id: "3", name: "UzCard", type: "card", currency: "UZS", balance: 5400000, color: "from-[#0066b3] to-[#00a0e3]", cardNetwork: "uzcard", cardNumberFull: "8600789012341456", expiryDate: "11/26", includedInBalance: true },
  { id: "4", name: "Savings Account", type: "bank", currency: "USD", balance: 12800.0, color: "from-emerald-600 to-teal-500", includedInBalance: true },
  { id: "5", name: "Cash", type: "cash", currency: "USD", balance: 340.5, color: "from-amber-500 to-orange-400", includedInBalance: true },
];

const defaultFamilyAccounts: Account[] = [
  { id: "f1", name: "Family Visa", type: "card", currency: "USD", balance: 8920.3, color: "from-violet-600 to-purple-500", cardNetwork: "visa", cardNumberFull: "4276987654329988", expiryDate: "12/27", includedInBalance: true },
  { id: "f2", name: "Joint Savings", type: "bank", currency: "USD", balance: 25400.0, color: "from-emerald-600 to-teal-500", includedInBalance: true },
];

const personalTransactions: Transaction[] = [
  { id: "t1", type: "expense", amount: 42.5, currency: "USD", category: "Food & Dining", description: "Grocery Store", accountId: "1", accountName: "Visa Platinum", date: "2026-02-28T14:30", icon: "utensils-crossed", note: "Weekly grocery shopping at Makro" },
  { id: "t2", type: "expense", amount: 12.99, currency: "USD", category: "Entertainment", description: "Netflix Subscription", accountId: "1", accountName: "Visa Platinum", date: "2026-02-27T09:15", icon: "film", note: "Monthly subscription" },
  { id: "t3", type: "income", amount: 3500.0, currency: "USD", category: "Salary", description: "Monthly Salary", accountId: "4", accountName: "Savings Account", date: "2026-02-25T10:00", icon: "briefcase", note: "February salary" },
  { id: "t4", type: "expense", amount: 65.0, currency: "USD", category: "Transport", description: "Gas Station", accountId: "1", accountName: "Visa Platinum", date: "2026-02-24T18:45", icon: "car", note: "Filled up tank at BP" },
  { id: "t5", type: "transfer", amount: 500.0, currency: "USD", category: "Transfer", description: "To Savings", accountId: "1", accountName: "Visa Platinum", toAccountId: "4", toAccountName: "Savings Account", date: "2026-02-23T11:20", icon: "arrow-left-right", note: "Monthly savings" },
  { id: "t6", type: "expense", amount: 89.99, currency: "USD", category: "Shopping", description: "Amazon Purchase", accountId: "1", accountName: "Visa Platinum", date: "2026-02-22T16:30", icon: "shopping-bag", note: "Headphones and cables" },
  { id: "t7", type: "expense", amount: 28.0, currency: "USD", category: "Health", description: "Pharmacy", accountId: "5", accountName: "Cash", date: "2026-02-21T12:00", icon: "heart-pulse", note: "Vitamins and medicine" },
  { id: "t8", type: "income", amount: 150.0, currency: "USD", category: "Freelance", description: "Design Project", accountId: "1", accountName: "Visa Platinum", date: "2026-02-20T15:45", icon: "laptop", note: "Logo design for client" },
  { id: "t9", type: "transfer", amount: 6500000, currency: "UZS", category: "Transfer", description: "USD to UZS Exchange", accountId: "1", accountName: "Visa Platinum", toAccountId: "2", toAccountName: "Humo", toCurrency: "UZS", toAmount: 6500000, date: "2026-02-19T13:30", icon: "arrow-left-right", note: "Currency exchange at 12,800 rate" },
  { id: "t10", type: "expense", amount: 350000, currency: "UZS", category: "Food & Dining", description: "Korzinka", accountId: "2", accountName: "Humo", date: "2026-02-18T10:15", icon: "utensils-crossed", note: "Daily groceries" },
];

const defaultFamilyTransactions: Transaction[] = [
  { id: "ft1", type: "expense", amount: 230.0, currency: "USD", category: "Groceries", description: "Weekly Groceries", accountId: "f1", accountName: "Family Visa", date: "2026-02-28T11:30", icon: "shopping-cart", note: "Weekly shopping at Costco" },
  { id: "ft2", type: "expense", amount: 1200.0, currency: "USD", category: "Housing", description: "Rent Payment", accountId: "f1", accountName: "Family Visa", date: "2026-02-25T09:00", icon: "home", note: "Monthly rent for March" },
  { id: "ft3", type: "income", amount: 7000.0, currency: "USD", category: "Salary", description: "Combined Income", accountId: "f2", accountName: "Joint Savings", date: "2026-02-25T14:00", icon: "briefcase", note: "Both salaries deposited" },
];

const personalDebts: Debt[] = [
  { id: "d1", name: "Alex", amount: 150.0, currency: "USD", type: "owe", status: "open", date: "2026-02-15", description: "Dinner at restaurant" },
  { id: "d2", name: "Maria", amount: 75.0, currency: "USD", type: "owed", status: "open", date: "2026-02-10", description: "Taxi fare" },
  { id: "d3", name: "John", amount: 200.0, currency: "USD", type: "owed", status: "closed", date: "2026-01-20", description: "Concert tickets" },
  { id: "d4", name: "Sardor", amount: 500000, currency: "UZS", type: "owe", status: "open", date: "2026-02-20", description: "Phone repair" },
];

const personalCredits: Credit[] = [
  {
    id: "c1",
    title: "iPhone 15 Pro",
    totalAmount: 1200,
    currency: "USD",
    kind: "installment",
    startDate: "2026-03-01",
    endDate: "2026-08-01",
    months: 5,
    paidInstallments: 2,
    status: "active",
    description: "Рассрочка на телефон",
  },
];

const defaultFamilyCredits: Credit[] = [];

const defaultFamilyMembers: FamilyMember[] = [
  { id: "m1", name: "You", email: "you@email.com", avatar: "Y", role: "admin" },
  { id: "m2", name: "Partner", email: "partner@email.com", avatar: "P", role: "admin" },
  { id: "m3", name: "Child", email: "child@email.com", avatar: "C", role: "member" },
];

const initialNotifications: Notification[] = [
  { id: "n1", title: "Salary Received", message: "Your monthly salary of $3,500 has been deposited to Savings Account.", date: "2026-02-25", read: false, type: "success" },
  { id: "n2", title: "Budget Warning", message: "You've spent 85% of your Food & Dining budget this month.", date: "2026-02-26", read: false, type: "warning" },
  { id: "n3", title: "New Feature", message: "Family workspace is now available! Invite your family members.", date: "2026-02-20", read: true, type: "info" },
  { id: "n4", title: "Card Payment", message: "Payment of $42.50 at Grocery Store from Visa Platinum.", date: "2026-02-28", read: false, type: "info" },
  { id: "n5", title: "Transfer Complete", message: "Transfer of $500 from Visa Platinum to Savings Account completed.", date: "2026-02-23", read: true, type: "success" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace>("personal");
  const [personalAccs, setPersonalAccs] = useState<Account[]>([]);
  const [familyAccs, setFamilyAccs] = useState<Account[]>([]);
  const [personalTxs, setPersonalTxs] = useState<Transaction[]>([]);
  const [familyTxs, setFamilyTxs] = useState<Transaction[]>([]);
  const [personalDebtsState, setPersonalDebts] = useState<Debt[]>([]);
  const [familyDebtsState, setFamilyDebts] = useState<Debt[]>([]);
  const [personalCreditsState, setPersonalCredits] = useState<Credit[]>([]);
  const [familyCreditsState, setFamilyCredits] = useState<Credit[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("alex@email.com");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [language, setLanguageState] = useState<"ru" | "uz">(
    (i18n.resolvedLanguage as "ru" | "uz") || "ru"
  );
  const [balanceCurrency, setBalanceCurrency] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [familyEnabled, setFamilyEnabled] = useState(true);
  const [aiInsightEnabled, setAiInsightEnabled] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [addTransactionDefaultType, setAddTransactionDefaultType] = useState<"expense" | "income" | "transfer">("expense");
  const [familyMembersState, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [exchangeRatesState, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoadingExchangeRates, setIsLoadingExchangeRates] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const currentLang = (i18n.resolvedLanguage as "ru" | "uz") || "ru";
    setLanguageState(currentLang);
    document.documentElement.lang = currentLang;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const accounts = await api.accounts.getAllAccounts();
        setPersonalAccs(accounts);

        const transactions = await api.transactions.getAllTransactions();
        setPersonalTxs(transactions);

        const debts = await api.debts.getAllDebts();
        setPersonalDebts(debts);

        setPersonalCredits(personalCredits);
        setFamilyCredits(defaultFamilyCredits);

        const notificationsData = await api.notifications.getAllNotifications();
        setNotifications(notificationsData);

        const rates = await api.exchangeRates.getExchangeRates();
        setExchangeRates(rates);

        setFamilyAccs(defaultFamilyAccounts);
        setFamilyTxs(defaultFamilyTransactions);
        setFamilyDebts([]);
        setFamilyMembers(defaultFamilyMembers);

        setIsLoadingExchangeRates(false);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Error loading data:", error);

        setPersonalAccs(personalAccounts);
        setFamilyAccs(defaultFamilyAccounts);
        setPersonalTxs(personalTransactions);
        setFamilyTxs(defaultFamilyTransactions);
        setPersonalDebts(personalDebts);
        setFamilyDebts([]);
        setPersonalCredits(personalCredits);
        setFamilyCredits(defaultFamilyCredits);
        setNotifications(initialNotifications);
        setFamilyMembers(defaultFamilyMembers);
        setExchangeRates(mockExchangeRates);
        setIsLoadingExchangeRates(false);
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const accounts = workspace === "personal" ? personalAccs : familyAccs;
  const setAccounts = (a: Account[]) => {
    if (workspace === "personal") setPersonalAccs(a);
    else setFamilyAccs(a);
  };

  const transactions = workspace === "personal" ? personalTxs : familyTxs;
  const setTransactions = (t: Transaction[]) => {
    if (workspace === "personal") setPersonalTxs(t);
    else setFamilyTxs(t);
  };

  const debts = workspace === "personal" ? personalDebtsState : familyDebtsState;
  const setDebts = (d: Debt[]) => {
    if (workspace === "personal") setPersonalDebts(d);
    else setFamilyDebts(d);
  };

  const credits = workspace === "personal" ? personalCreditsState : familyCreditsState;
  const setCredits = (c: Credit[]) => {
    if (workspace === "personal") setPersonalCredits(c);
    else setFamilyCredits(c);
  };

  const totalBalance = accounts
    .filter((a) => (balanceCurrency === "all" || a.currency === balanceCurrency) && a.includedInBalance !== false)
    .reduce((sum, a) => sum + a.balance, 0);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const changeLanguage = useCallback((lang: "ru" | "uz") => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleAccountInBalance = useCallback((id: string) => {
    const updater = (accs: Account[]) =>
      accs.map((a) => (a.id === id ? { ...a, includedInBalance: !a.includedInBalance } : a));

    if (workspace === "personal") setPersonalAccs((prev) => updater(prev));
    else setFamilyAccs((prev) => updater(prev));
  }, [workspace]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.transactions.deleteTransaction(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }

    if (workspace === "personal") setPersonalTxs((prev) => prev.filter((t) => t.id !== id));
    else setFamilyTxs((prev) => prev.filter((t) => t.id !== id));
  }, [workspace]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await api.accounts.deleteAccount(id);
    } catch (error) {
      console.error("Error deleting account:", error);
    }

    if (workspace === "personal") {
      setPersonalTxs((prev) => prev.filter((t) => t.accountId !== id));
      setPersonalAccs((prev) => prev.filter((a) => a.id !== id));
    } else {
      setFamilyTxs((prev) => prev.filter((t) => t.accountId !== id));
      setFamilyAccs((prev) => prev.filter((a) => a.id !== id));
    }
  }, [workspace]);

  const updateTransaction = useCallback(async (tx: Transaction) => {
    try {
      await api.transactions.updateTransaction(tx.id, tx);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }

    const updater = (txs: Transaction[]) => txs.map((t) => (t.id === tx.id ? tx : t));

    if (workspace === "personal") setPersonalTxs((prev) => updater(prev));
    else setFamilyTxs((prev) => updater(prev));
  }, [workspace]);

  const updateAccount = useCallback(async (account: Account) => {
    try {
      await api.accounts.updateAccount(account.id, account);
    } catch (error) {
      console.error("Error updating account:", error);
    }

    const updater = (accs: Account[]) => accs.map((a) => (a.id === account.id ? account : a));

    if (workspace === "personal") setPersonalAccs((prev) => updater(prev));
    else setFamilyAccs((prev) => updater(prev));
  }, [workspace]);

  const addAccount = useCallback(async (account: Omit<Account, "id">) => {
    try {
      const newAccount = await api.accounts.createAccount(account);

      if (workspace === "personal") setPersonalAccs((prev) => [...prev, newAccount]);
      else setFamilyAccs((prev) => [...prev, newAccount]);

      return newAccount;
    } catch (error) {
      console.error("Error creating account:", error);

      const fallbackAccount: Account = {
        ...account,
        id: Date.now().toString(),
      };

      if (workspace === "personal") setPersonalAccs((prev) => [...prev, fallbackAccount]);
      else setFamilyAccs((prev) => [...prev, fallbackAccount]);

      return fallbackAccount;
    }
  }, [workspace]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = await api.transactions.createTransaction(transaction);

      if (workspace === "personal") setPersonalTxs((prev) => [...prev, newTransaction]);
      else setFamilyTxs((prev) => [...prev, newTransaction]);

      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);

      const fallbackTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      };

      if (workspace === "personal") setPersonalTxs((prev) => [...prev, fallbackTransaction]);
      else setFamilyTxs((prev) => [...prev, fallbackTransaction]);

      return fallbackTransaction;
    }
  }, [workspace]);

  const resetFamilyData = useCallback(() => {
    setFamilyAccs(defaultFamilyAccounts);
    setFamilyTxs(defaultFamilyTransactions);
    setFamilyDebts([]);
    setFamilyCredits(defaultFamilyCredits);
  }, []);

  const deleteFamily = useCallback(() => {
    setFamilyAccs([]);
    setFamilyTxs([]);
    setFamilyDebts([]);
    setFamilyCredits([]);
    setFamilyMembers(defaultFamilyMembers.filter((m) => m.role === "admin" && m.id === "m1"));
    setFamilyEnabled(false);
    setWorkspace("personal");
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoadingData(true);

    try {
      const accounts = await api.accounts.getAllAccounts();
      const transactions = await api.transactions.getAllTransactions();
      const debts = await api.debts.getAllDebts();
      const notificationsData = await api.notifications.getAllNotifications();

      if (workspace === "personal") {
        setPersonalAccs(accounts);
        setPersonalTxs(transactions);
        setPersonalDebts(debts);
        setPersonalCredits(personalCredits);
      } else {
        setFamilyAccs(accounts);
        setFamilyTxs(transactions);
        setFamilyDebts(debts);
        setFamilyCredits(defaultFamilyCredits);
      }

      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [workspace]);

  const refreshExchangeRates = useCallback(async () => {
    setIsLoadingExchangeRates(true);

    try {
      const rates = await api.exchangeRates.getExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error("Error refreshing exchange rates:", error);
    } finally {
      setIsLoadingExchangeRates(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        workspace,
        setWorkspace,
        accounts,
        setAccounts,
        transactions,
        setTransactions,
        debts,
        setDebts,
        credits,
        setCredits,
        familyMembers: familyMembersState,
        setFamilyMembers,
        totalBalance,
        balanceCurrency,
        setBalanceCurrency,
        currency: selectedCurrency,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        selectedCurrency,
        setSelectedCurrency,
        language,
        setLanguage: setLanguageState,
        changeLanguage,
        darkMode,
        toggleDarkMode,
        familyEnabled,
        setFamilyEnabled,
        aiInsightEnabled,
        setAiInsightEnabled,
        exchangeRates: exchangeRatesState,
        isLoadingExchangeRates,
        isLoadingData,
        refreshData,
        refreshExchangeRates,
        selectedCardId,
        setSelectedCardId,
        selectedTransactionId,
        setSelectedTransactionId,
        addAccountModalOpen,
        setAddAccountModalOpen,
        addTransactionModalOpen,
        setAddTransactionModalOpen,
        addTransactionDefaultType,
        setAddTransactionDefaultType,
        resetFamilyData,
        deleteFamily,
        removeFamilyMember,
        toggleAccountInBalance,
        deleteTransaction,
        deleteAccount,
        updateTransaction,
        updateAccount,
        addAccount,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};