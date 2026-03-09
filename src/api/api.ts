import { 
  Account, 
  Transaction, 
  Debt, 
  Notification, 
  FamilyMember,
  ExchangeRate
} from '../context/AppContext';
import { 
  mockAccounts, 
  mockTransactions, 
  mockDebts, 
  mockNotifications, 
  mockFamilyMembers, 
  mockExchangeRates 
} from './mockData';

// Имитация задержки для реальности
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Тип для настроек API
export interface ApiConfig {
  baseUrl: string;
  useMockData: boolean;
  mockDelay: number;
}

// По умолчанию используем фейковые данные
let apiConfig: ApiConfig = {
  baseUrl: 'https://api.example.com',
  useMockData: true,
  mockDelay: 1000
};

// Функция для изменения настроек API
export const setApiConfig = (config: Partial<ApiConfig>) => {
  apiConfig = { ...apiConfig, ...config };
};

// Функция для получения настроек API
export const getApiConfig = () => apiConfig;

// Базовая функция для имитации запросов
const fetchData = async <T>(getData: () => T, delayMs?: number): Promise<T> => {
  await delay(delayMs ?? apiConfig.mockDelay);
  return Promise.resolve(getData());
};

// Функция для имитации ошибок
const fetchError = async (message: string, delayMs?: number): Promise<never> => {
  await delay(delayMs ?? apiConfig.mockDelay);
  return Promise.reject(new Error(message));
};

// API для счетов
export const accountsApi = {
  // Получить все счета
  async getAllAccounts(): Promise<Account[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockAccounts);
  },

  // Получить счет по ID
  async getAccountById(id: string): Promise<Account | undefined> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockAccounts.find(account => account.id === id));
  },

  // Создать новый счет
  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    };
    return fetchData(() => newAccount);
  },

  // Обновить счет
  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const updatedAccount: Account = {
      ...(mockAccounts.find(account => account.id === id) as Account),
      ...updates
    };
    return fetchData(() => updatedAccount);
  },

  // Удалить счет
  async deleteAccount(id: string): Promise<void> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => undefined);
  }
};

// API для транзакций
export const transactionsApi = {
  // Получить все транзакции
  async getAllTransactions(): Promise<Transaction[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockTransactions);
  },

  // Получить транзакции по счету
  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockTransactions.filter(transaction => 
      transaction.accountId === accountId
    ));
  },

  // Создать новую транзакцию
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    return fetchData(() => newTransaction);
  },

  // Обновить транзакцию
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const updatedTransaction: Transaction = {
      ...(mockTransactions.find(transaction => transaction.id === id) as Transaction),
      ...updates
    };
    return fetchData(() => updatedTransaction);
  },

  // Удалить транзакцию
  async deleteTransaction(id: string): Promise<void> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => undefined);
  }
};

// API для долгов
export const debtsApi = {
  // Получить все долги
  async getAllDebts(): Promise<Debt[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockDebts);
  },

  // Создать новый долг
  async createDebt(debt: Omit<Debt, 'id'>): Promise<Debt> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString()
    };
    return fetchData(() => newDebt);
  },

  // Обновить долг
  async updateDebt(id: string, updates: Partial<Debt>): Promise<Debt> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const updatedDebt: Debt = {
      ...(mockDebts.find(debt => debt.id === id) as Debt),
      ...updates
    };
    return fetchData(() => updatedDebt);
  },

  // Удалить долг
  async deleteDebt(id: string): Promise<void> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => undefined);
  }
};

// API для уведомлений
export const notificationsApi = {
  // Получить все уведомления
  async getAllNotifications(): Promise<Notification[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockNotifications);
  },

  // Создать новое уведомление
  async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    return fetchData(() => newNotification);
  },

  // Удалить уведомление
  async deleteNotification(id: string): Promise<void> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => undefined);
  }
};

// API для членов семьи
export const familyMembersApi = {
  // Получить всех членов семьи
  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockFamilyMembers);
  },

  // Создать нового члена семьи
  async createFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString()
    };
    return fetchData(() => newMember);
  },

  // Обновить члена семьи
  async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const updatedMember: FamilyMember = {
      ...(mockFamilyMembers.find(member => member.id === id) as FamilyMember),
      ...updates
    };
    return fetchData(() => updatedMember);
  },

  // Удалить члена семьи
  async deleteFamilyMember(id: string): Promise<void> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => undefined);
  }
};

// API для курсов валют
export const exchangeRatesApi = {
  // Получить все курсы валют
  async getExchangeRates(): Promise<ExchangeRate[]> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    return fetchData(() => mockExchangeRates);
  },

  // Обновить курс валюты
  async updateExchangeRate(from: string, to: string, rate: number): Promise<ExchangeRate> {
    if (!apiConfig.useMockData) {
      return fetchError('Real API not implemented', 0);
    }
    const updatedRate: ExchangeRate = {
      from,
      to,
      rate
    };
    return fetchData(() => updatedRate);
  }
};

// Общий API объект для удобного импорта
export const api = {
  accounts: accountsApi,
  transactions: transactionsApi,
  debts: debtsApi,
  notifications: notificationsApi,
  familyMembers: familyMembersApi,
  exchangeRates: exchangeRatesApi,
  config: {
    set: setApiConfig,
    get: getApiConfig
  }
};

export default api;
