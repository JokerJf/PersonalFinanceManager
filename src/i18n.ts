import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    ru: {
        translation: {
            common: {
                russian: "Русский",
                uzbek: "O‘zbekcha",
                english: "Английский",
                cancel: "Отмена",
                delete: "Удалить",
                reset: "Сбросить",
                seeAll: "Смотреть все",
                add: "Добавить",
                personal: "Личное",
                family: "Семья",
                balance: "Баланс",
                validThru: "Действителен до",
                totalBalance: "Общий баланс",
                tapToSwitch: "Нажмите для переключения",
                expense: "Расход",
                income: "Доход",
                transfer: "Перевод",
                debt: "Долг",
                exchangeRates: "Курсы валют",
                currencyConverter: "Конвертер валют",
                aiAssistant: "AI Ассистент",
                askAnything: "Спросить что угодно",
            },

            settings: {
                title: "Настройки",
                logout: "Выйти",

                sections: {
                    account: "Аккаунт",
                    preferences: "Предпочтения",
                    balanceAccounts: "Счета в балансе",
                    aiFeatures: "AI функции",
                    workspace: "Рабочее пространство",
                },

                items: {
                    currency: "Валюта",
                    balanceCurrency: "Валюта баланса",
                    language: "Язык",
                    theme: "Тема",
                    aiInsight: "AI Insight",
                    familyMode: "Семейный режим",
                    familyManagement: "Управление семьёй",
                },

                theme: {
                    dark: "Тёмная",
                    light: "Светлая",
                },

                balanceCurrency: {
                    all: "Все валюты",
                },

                family: {
                    membersCount_one: "{{count}} участник",
                    membersCount_few: "{{count}} участника",
                    membersCount_many: "{{count}} участников",
                    membersCount_other: "{{count}} участников",
                    inviteMember: "Пригласить участника",
                },

                dialogs: {
                    editProfile: {
                        title: "Редактировать профиль",
                        name: "Имя",
                        email: "Email",
                        save: "Сохранить изменения",
                    },
                    invite: {
                        title: "Пригласить участника",
                        email: "Email",
                        send: "Отправить приглашение",
                    },
                    resetFamily: {
                        title: "Сбросить семейные данные?",
                        description: "Все семейные счета, транзакции и связанные данные будут очищены.",
                    },
                    deleteFamily: {
                        title: "Удалить семью?",
                        description: "Это действие удалит семейное пространство и его нельзя будет отменить.",
                    },
                },

                toasts: {
                    profileUpdated: {
                        title: "Профиль обновлён",
                        description: "Изменения профиля сохранены.",
                    },
                    invited: {
                        title: "Приглашение отправлено",
                        description: "{{email}} был приглашён.",
                    },
                    familyReset: {
                        title: "Семейные данные сброшены",
                        description: "Все семейные данные очищены.",
                    },
                    familyDeleted: {
                        title: "Семья удалена",
                        description: "Семейное пространство было удалено.",
                    },
                    logout: {
                        title: "Выход",
                        description: "Вы вышли из аккаунта.",
                    },
                    currencyUpdated: {
                        title: "Валюта обновлена",
                        description: "Валюта установлена: {{currency}}.",
                    },
                    balanceCurrencyUpdated: {
                        title: "Валюта баланса обновлена",
                        description: "Баланс теперь отображается в {{currency}}.",
                        allDescription: "В балансе будут учитываться все валюты.",
                    },
                    languageUpdated: {
                        title: "Язык обновлён",
                        description: "Текущий язык: {{language}}.",
                    },
                    memberRemoved: {
                        title: "Участник удалён",
                        description: "{{name}} удалён из семьи.",
                    },
                    accountBalanceUpdated: {
                        title: "Баланс обновлён",
                        added: "Счёт {{account}} добавлен в баланс.",
                        removed: "Счёт {{account}} исключён из баланса.",
                    },
                },
            },
            debts: {
                title: "Долги и кредиты",
                debtsTab: "Долги",
                creditsTab: "Кредиты",
                iOwe: "Я должен",
                owedToMe: "Мне должны",
                open: "Открытые",
                closed: "Закрытые",
                noDebts: "Пока нет долгов",
                noCredits: "Пока нет кредитов или рассрочек",
                addDebt: "Добавить долг",
                addCredit: "Добавить кредит / рассрочку",
                debtClosed: "Долг закрыт",
                debtClosedDesc: "Запись помечена как закрытая.",
                debtAdded: "Долг добавлен",
                error: "Ошибка",
                fillDebtFields: "Заполни имя и корректную сумму.",
                fillCreditFields: "Заполни название, сумму, срок и дату начала.",
                createdPaymentPlan: "График платежей создан.",
                totalIOwe: "Всего я должен",
                totalOwedToMe: "Всего должны мне",
                active: "Активные",
                period: "Период",
                monthlyPayment: "Ежемесячный платёж",
                paid: "Оплачено",
                removePayment: "Убрать платёж",
                markPayment: "Отметить платёж",
                closedStatus: "Закрыт",
                personName: "Имя",
                amount: "Сумма",
                currency: "Валюта",
                description: "Описание",
                optionalDescription: "Описание",
                titleLabel: "Название",
                totalAmount: "Общая сумма",
                startDate: "Дата начала",
                months: "Срок в месяцах",
                preview: "Предпросмотр",
                endDate: "Конец срока",
                credit: "Кредит",
                installment: "Рассрочка"
            },
            transactions: {
                title: "Транзакции",
                noTransactions: "Пока нет транзакций",
                filters: {
                    all: "Все",
                    expense: "Расход",
                    income: "Доход",
                    transfer: "Перевод",
                    allAccounts: "Все счета"
                },
                currency: {
                    uzs: "сум"
                }
            },
            transactionForm: {
                title: "Добавить транзакцию",
                editTitle: "Редактировать транзакцию",
                amount: "Сумма",
                amountToSend: "Сумма отправки",
                amountToReceive: "Сумма получения",
                category: "Категория",
                account: "Счёт",
                fromAccount: "Со счёта",
                toAccount: "На счёт",
                save: "Сохранить изменения",
                add: "Добавить транзакцию",
                expense: "Расход",
                income: "Доход",
                transfer: "Перевод",
                rateLabel: "Курс",
                tabs: {
                    date: "Дата и время",
                    description: "Описание",
                    note: "Заметка"
                },
                placeholders: {
                    amount: "0.00",
                    description: "Введите описание...",
                    note: "Дополнительные детали...",
                    selectCategory: "Выбрать"
                },
                categories: {
                    foodDining: "Еда и рестораны",
                    transport: "Транспорт",
                    shopping: "Покупки",
                    entertainment: "Развлечения",
                    health: "Здоровье",
                    housing: "Жильё",
                    salary: "Зарплата",
                    freelance: "Фриланс",
                    investment: "Инвестиции",
                    gift: "Подарок",
                    transfer: "Перевод",
                    other: "Другое"
                },
                toasts: {
                    created: {
                        title: "Транзакция добавлена",
                        description: "Новая транзакция успешно создана."
                    },
                    updated: {
                        title: "Транзакция обновлена",
                        description: "Изменения транзакции сохранены."
                    },
                    error: {
                        title: "Ошибка",
                        description: "Заполни обязательные поля."
                    }
                }
            },
            accounts: {
                title: "Счета",
                addAccount: "Добавить счёт",
                noAccounts: "Пока нет счетов",
                cash: "Наличные",
                bank: "Банк",
                card: "Карта",
                included: "Включён в баланс",
                excluded: "Исключён из баланса",
                cards: "Карты",
                otherAccounts: "Другие счета",
                addNewAccount: "Добавить новый счёт"
            },
            dashboard: {
                title: "Главная",
                totalBalance: "Общий баланс",
                recentTransactions: "Последние транзакции",
                quickActions: "Быстрые действия",
                myCards: "Мои карты",
                seeAll: "Смотреть все"
            },
            analytics: {
                title: "Аналитика",
                incomeVsExpense: "Доходы и расходы",
                spendingByCategory: "Расходы по категориям",
                noData: "Недостаточно данных",
                balanceTrend: "Динамика баланса",
                periods: {
                    day: "День",
                    week: "Неделя",
                    month: "Месяц",
                    year: "Год"
                },
                income: "Доход",
                expenses: "Расход"
            },
            exchangeRates: {
                title: "Курсы валют",
                refresh: "Обновить",
                from: "Из",
                to: "В",
                rate: "Курс",
                ratesFor: "Курс для 1 {{currency}}",
                disclaimer: "Курсы приблизительны и приведены только в демонстрационных целях."
            },
            chatbot: {
                title: "AI помощник",
                placeholder: "Напиши сообщение...",
                send: "Отправить",
                empty: "Задай вопрос ассистенту"
            },

            notFound: {
                title: "404",
                message: "Упс! Страница не найдена",
                returnToHome: "Вернуться на главную"
            },

            index: {
                welcome: "Добро пожаловать в ваше приложение",
                subtitle: "Начните создавать ваш удивительный проект здесь!"
            },

        },
    },

    en: {
        translation: {
            common: {
                russian: "Русский",
                uzbek: "English",
                english: "English",
                cancel: "Cancel",
                delete: "Delete",
                reset: "Reset",
                seeAll: "See all",
                add: "Add",
                personal: "Personal",
                family: "Family",
                balance: "Balance",
                validThru: "Valid Thru",
                totalBalance: "Total Balance",
                tapToSwitch: "Tap to switch",
                expense: "Expense",
                income: "Income",
                transfer: "Transfer",
                debt: "Debt",
                exchangeRates: "Exchange Rates",
                currencyConverter: "Currency converter",
                aiAssistant: "AI Assistant",
                askAnything: "Ask anything"
            },

            settings: {
                title: "Settings",
                logout: "Logout",

                sections: {
                    account: "Account",
                    preferences: "Preferences",
                    balanceAccounts: "Balance Accounts",
                    aiFeatures: "AI Features",
                    workspace: "Workspace",
                },

                items: {
                    currency: "Currency",
                    balanceCurrency: "Balance Currency",
                    language: "Language",
                    theme: "Theme",
                    aiInsight: "AI Insight",
                    familyMode: "Family Mode",
                    familyManagement: "Family Management",
                },

                theme: {
                    dark: "Dark",
                    light: "Light",
                },

                balanceCurrency: {
                    all: "All currencies",
                },

                family: {
                    membersCount_one: "{{count}} member",
                    membersCount_few: "{{count}} members",
                    membersCount_many: "{{count}} members",
                    membersCount_other: "{{count}} members",
                    inviteMember: "Invite member",
                },

                dialogs: {
                    editProfile: {
                        title: "Edit profile",
                        name: "Name",
                        email: "Email",
                        save: "Save changes",
                    },
                    invite: {
                        title: "Invite member",
                        email: "Email",
                        send: "Send invitation",
                    },
                    resetFamily: {
                        title: "Reset family data?",
                        description: "All family accounts, transactions and related data will be cleared.",
                    },
                    deleteFamily: {
                        title: "Delete family?",
                        description: "This action will delete the family workspace and cannot be undone.",
                    },
                },

                toasts: {
                    profileUpdated: {
                        title: "Profile updated",
                        description: "Profile changes have been saved.",
                    },
                    invited: {
                        title: "Invitation sent",
                        description: "{{email}} has been invited.",
                    },
                    familyReset: {
                        title: "Family data reset",
                        description: "All family data has been cleared.",
                    },
                    familyDeleted: {
                        title: "Family deleted",
                        description: "The family workspace has been deleted.",
                    },
                    logout: {
                        title: "Logout",
                        description: "You have logged out.",
                    },
                    currencyUpdated: {
                        title: "Currency updated",
                        description: "Currency set to {{currency}}.",
                    },
                    balanceCurrencyUpdated: {
                        title: "Balance currency updated",
                        description: "Balance is now displayed in {{currency}}.",
                        allDescription: "All currencies will be included in the balance.",
                    },
                    languageUpdated: {
                        title: "Language updated",
                        description: "Current language: {{language}}.",
                    },
                    memberRemoved: {
                        title: "Member removed",
                        description: "{{name}} has been removed from the family.",
                    },
                    accountBalanceUpdated: {
                        title: "Balance updated",
                        added: "Account {{account}} added to balance.",
                        removed: "Account {{account}} excluded from balance.",
                    },
                },
            },
            debts: {
                title: "Debts and Credits",
                debtsTab: "Debts",
                creditsTab: "Credits",
                iOwe: "I owe",
                owedToMe: "Owed to me",
                open: "Open",
                closed: "Closed",
                noDebts: "No debts yet",
                noCredits: "No credits or installments yet",
                addDebt: "Add debt",
                addCredit: "Add credit / installment",
                debtClosed: "Debt closed",
                debtClosedDesc: "Entry marked as closed.",
                debtAdded: "Debt added",
                error: "Error",
                fillDebtFields: "Fill in name and correct amount.",
                fillCreditFields: "Fill in title, amount, term and start date.",
                createdPaymentPlan: "Payment schedule created.",
                totalIOwe: "Total I owe",
                totalOwedToMe: "Total owed to me",
                active: "Active",
                period: "Period",
                monthlyPayment: "Monthly payment",
                paid: "Paid",
                removePayment: "Remove payment",
                markPayment: "Mark payment",
                closedStatus: "Closed",
                personName: "Name",
                amount: "Amount",
                currency: "Currency",
                description: "Description",
                optionalDescription: "Description",
                titleLabel: "Title",
                totalAmount: "Total amount",
                startDate: "Start date",
                months: "Term in months",
                preview: "Preview",
                endDate: "End date",
                credit: "Credit",
                installment: "Installment"
            },
            transactions: {
                title: "Transactions",
                noTransactions: "No transactions yet",
                filters: {
                    all: "All",
                    expense: "Expense",
                    income: "Income",
                    transfer: "Transfer",
                    allAccounts: "All accounts"
                },
                currency: {
                    uzs: "sum"
                }
            },
            transactionForm: {
                title: "Add transaction",
                editTitle: "Edit transaction",
                amount: "Amount",
                amountToSend: "Amount to send",
                amountToReceive: "Amount to receive",
                category: "Category",
                account: "Account",
                fromAccount: "From account",
                toAccount: "To account",
                save: "Save changes",
                add: "Add transaction",
                expense: "Expense",
                income: "Income",
                transfer: "Transfer",
                rateLabel: "Rate",
                tabs: {
                    date: "Date and time",
                    description: "Description",
                    note: "Note"
                },
                placeholders: {
                    amount: "0.00",
                    description: "Enter description...",
                    note: "Additional details...",
                    selectCategory: "Select"
                },
                categories: {
                    foodDining: "Food and dining",
                    transport: "Transport",
                    shopping: "Shopping",
                    entertainment: "Entertainment",
                    health: "Health",
                    housing: "Housing",
                    salary: "Salary",
                    freelance: "Freelance",
                    investment: "Investment",
                    gift: "Gift",
                    transfer: "Transfer",
                    other: "Other"
                },
                toasts: {
                    created: {
                        title: "Transaction added",
                        description: "New transaction successfully created.",
                    },
                    updated: {
                        title: "Transaction updated",
                        description: "Transaction changes have been saved.",
                    },
                    error: {
                        title: "Error",
                        description: "Please fill in required fields.",
                    }
                }
            },
            accounts: {
                title: "Accounts",
                addAccount: "Add account",
                noAccounts: "No accounts yet",
                cash: "Cash",
                bank: "Bank",
                card: "Card",
                included: "Included in balance",
                excluded: "Excluded from balance",
                cards: "Cards",
                otherAccounts: "Other Accounts",
                addNewAccount: "Add New Account"
            },
            dashboard: {
                title: "Home",
                totalBalance: "Total balance",
                recentTransactions: "Recent transactions",
                quickActions: "Quick actions",
                myCards: "My Cards",
                seeAll: "See all"
            },
            analytics: {
                title: "Analytics",
                incomeVsExpense: "Income and expenses",
                spendingByCategory: "Spending by category",
                noData: "Not enough data",
                balanceTrend: "Balance Trend",
                periods: {
                    day: "Day",
                    week: "Week",
                    month: "Month",
                    year: "Year"
                },
                income: "Income",
                expenses: "Expenses"
            },
            exchangeRates: {
                title: "Exchange rates",
                refresh: "Refresh",
                from: "From",
                to: "To",
                rate: "Rate",
                ratesFor: "Rates for 1 {{currency}}",
                disclaimer: "Rates are approximate and for demonstration purposes only."
            },
            chatbot: {
                title: "AI Assistant",
                placeholder: "Write a message...",
                send: "Send",
                empty: "Ask the assistant a question"
            },

            notFound: {
                title: "404",
                message: "Oops! Page not found",
                returnToHome: "Return to Home"
            },

            index: {
                welcome: "Welcome to Your Blank App",
                subtitle: "Start building your amazing project here!"
            },

        },
    },

    uz: {
        translation: {
            common: {
                russian: "Ruscha",
                uzbek: "O‘zbekcha",
                english: "Inglizcha",
                cancel: "Bekor qilish",
                delete: "O‘chirish",
                reset: "Tiklash",
                seeAll: "Barchasini ko‘rish",
                add: "Qo‘shish",
                personal: "Shaxsiy",
                family: "Oila",
                balance: "Balans",
                validThru: "Amal qilish muddati",
                totalBalance: "Umumiy balans",
                tapToSwitch: "Almashtirish uchun bosing",
                expense: "Xarajat",
                income: "Daromad",
                transfer: "O‘tkazma",
                debt: "Qarz",
                exchangeRates: "Valyuta kurslari",
                currencyConverter: "Valyuta konvertori",
                aiAssistant: "AI Yordamchi",
                askAnything: "Har nima so‘rang",
            },
            settings: {
                title: "Sozlamalar",
                logout: "Chiqish",

                sections: {
                    account: "Hisob",
                    preferences: "Afzalliklar",
                    balanceAccounts: "Balansdagi hisoblar",
                    aiFeatures: "AI funksiyalar",
                    workspace: "Ish maydoni",
                },

                items: {
                    currency: "Valyuta",
                    balanceCurrency: "Balans valyutasi",
                    language: "Til",
                    theme: "Mavzu",
                    aiInsight: "AI Insight",
                    familyMode: "Oilaviy rejim",
                    familyManagement: "Oilani boshqarish",
                },

                theme: {
                    dark: "Qorong‘i",
                    light: "Yorug‘",
                },

                balanceCurrency: {
                    all: "Barcha valyutalar",
                },

                family: {
                    membersCount: "{{count}} a’zo",
                    inviteMember: "A’zo taklif qilish",
                },

                dialogs: {
                    editProfile: {
                        title: "Profilni tahrirlash",
                        name: "Ism",
                        email: "Email",
                        save: "O‘zgarishlarni saqlash",
                    },
                    invite: {
                        title: "A’zo taklif qilish",
                        email: "Email",
                        send: "Taklif yuborish",
                    },
                    resetFamily: {
                        title: "Oilaviy ma’lumotlar tiklansinmi?",
                        description: "Barcha oilaviy hisoblar, tranzaksiyalar va bog‘liq ma’lumotlar tozalanadi.",
                    },
                    deleteFamily: {
                        title: "Oilani o‘chirish kerakmi?",
                        description: "Bu amal oilaviy ish maydonini o‘chiradi va uni ortga qaytarib bo‘lmaydi.",
                    },
                },

                toasts: {
                    profileUpdated: {
                        title: "Profil yangilandi",
                        description: "Profil o‘zgarishlari saqlandi.",
                    },
                    invited: {
                        title: "Taklif yuborildi",
                        description: "{{email}} taklif qilindi.",
                    },
                    familyReset: {
                        title: "Oilaviy ma’lumotlar tiklandi",
                        description: "Barcha oilaviy ma’lumotlar tozalandi.",
                    },
                    familyDeleted: {
                        title: "Oila o‘chirildi",
                        description: "Oilaviy ish maydoni o‘chirildi.",
                    },
                    logout: {
                        title: "Chiqish",
                        description: "Siz akkauntdan chiqdingiz.",
                    },
                    currencyUpdated: {
                        title: "Valyuta yangilandi",
                        description: "Valyuta {{currency}} ga o‘rnatildi.",
                    },
                    balanceCurrencyUpdated: {
                        title: "Balans valyutasi yangilandi",
                        description: "Balans endi {{currency}} da ko‘rsatiladi.",
                        allDescription: "Balansda barcha valyutalar hisobga olinadi.",
                    },
                    languageUpdated: {
                        title: "Til yangilandi",
                        description: "Joriy til: {{language}}.",
                    },
                    memberRemoved: {
                        title: "A’zo olib tashlandi",
                        description: "{{name}} oiladan olib tashlandi.",
                    },
                    accountBalanceUpdated: {
                        title: "Balans yangilandi",
                        added: "{{account}} hisobi balansga qo‘shildi.",
                        removed: "{{account}} hisobi balansdan chiqarildi.",
                    },
                },
            },
            debts: {
                title: "Qarzlar va kreditlar",
                debtsTab: "Qarzlar",
                creditsTab: "Kreditlar",
                iOwe: "Men qarzdorman",
                owedToMe: "Menga qarzdor",
                open: "Ochiq",
                closed: "Yopilgan",
                noDebts: "Hozircha qarzlar yo‘q",
                noCredits: "Hozircha kredit yoki muddatli to‘lovlar yo‘q",
                addDebt: "Qarz qo‘shish",
                addCredit: "Kredit / muddatli to‘lov qo‘shish",
                debtClosed: "Qarz yopildi",
                debtClosedDesc: "Yozuv yopilgan deb belgilandi.",
                debtAdded: "Qarz qo‘shildi",
                error: "Xatolik",
                fillDebtFields: "Ism va to‘g‘ri summani kiriting.",
                fillCreditFields: "Nom, summa, muddat va boshlanish sanasini kiriting.",
                createdPaymentPlan: "To‘lov jadvali yaratildi.",
                totalIOwe: "Jami qarzim",
                totalOwedToMe: "Menga jami qarzdor",
                active: "Faol",
                period: "Davr",
                monthlyPayment: "Oylik to‘lov",
                paid: "To‘langan",
                removePayment: "To‘lovni olib tashlash",
                markPayment: "To‘lovni belgilash",
                closedStatus: "Yopilgan",
                personName: "Ism",
                amount: "Summa",
                currency: "Valyuta",
                description: "Tavsif",
                optionalDescription: "Tavsif",
                titleLabel: "Nomi",
                totalAmount: "Umumiy summa",
                startDate: "Boshlanish sanasi",
                months: "Oylar soni",
                preview: "Oldindan ko‘rish",
                endDate: "Tugash sanasi",
                credit: "Kredit",
                installment: "Muddatli to‘lov"
            },
            transactions: {
                title: "Tranzaksiyalar",
                noTransactions: "Hozircha tranzaksiyalar yo‘q",
                filters: {
                    all: "Barchasi",
                    expense: "Xarajat",
                    income: "Daromad",
                    transfer: "O‘tkazma",
                    allAccounts: "Barcha hisoblar"
                },
                currency: {
                    uzs: "so‘m"
                }
            },
            transactionForm: {
                title: "Tranzaksiya qo‘shish",
                editTitle: "Tranzaksiyani tahrirlash",
                amount: "Summa",
                amountToSend: "Yuboriladigan summa",
                amountToReceive: "Qabul qilinadigan summa",
                category: "Kategoriya",
                account: "Hisob",
                fromAccount: "Hisobdan",
                toAccount: "Hisobga",
                save: "O‘zgarishlarni saqlash",
                add: "Tranzaksiya qo‘shish",
                expense: "Xarajat",
                income: "Daromad",
                transfer: "O‘tkazma",
                rateLabel: "Kurs",
                tabs: {
                    date: "Sana va vaqt",
                    description: "Tavsif",
                    note: "Izoh"
                },
                placeholders: {
                    amount: "0.00",
                    description: "Tavsif kiriting...",
                    note: "Qo‘shimcha tafsilotlar...",
                    selectCategory: "Tanlang"
                },
                categories: {
                    foodDining: "Ovqat va restoranlar",
                    transport: "Transport",
                    shopping: "Xaridlar",
                    entertainment: "Ko‘ngilochar",
                    health: "Sog‘liq",
                    housing: "Uy-joy",
                    salary: "Maosh",
                    freelance: "Frilans",
                    investment: "Investitsiya",
                    gift: "Sovg‘a",
                    transfer: "O‘tkazma",
                    other: "Boshqa"
                },
                toasts: {
                    created: {
                        title: "Tranzaksiya qo‘shildi",
                        description: "Yangi tranzaksiya muvaffaqiyatli yaratildi."
                    },
                    updated: {
                        title: "Tranzaksiya yangilandi",
                        description: "Tranzaksiya o‘zgarishlari saqlandi."
                    },
                    error: {
                        title: "Xatolik",
                        description: "Majburiy maydonlarni to‘ldiring."
                    }
                }
            },
            accounts: {
                title: "Hisoblar",
                addAccount: "Hisob qo‘shish",
                noAccounts: "Hozircha hisoblar yo‘q",
                cash: "Naqd pul",
                bank: "Bank",
                card: "Karta",
                included: "Balansga kiritilgan",
                excluded: "Balansdan chiqarilgan",
                cards: "Kartalar",
                otherAccounts: "Boshqa hisoblar",
                addNewAccount: "Yangi hisob qo‘shish"
            },
            dashboard: {
                title: "Bosh sahifa",
                totalBalance: "Umumiy balans",
                recentTransactions: "So‘nggi tranzaksiyalar",
                quickActions: "Tezkor amallar"
            },
            analytics: {
                title: "Tahlil",
                incomeVsExpense: "Daromad va xarajatlar",
                spendingByCategory: "Kategoriya bo‘yicha xarajatlar",
                noData: "Ma’lumot yetarli emas",
                balanceTrend: "Balans dinamikasi",
                periods: {
                    day: "Kun",
                    week: "Hafta",
                    month: "Oy",
                    year: "Yil"
                },
                income: "Daromad",
                expenses: "Xarajat"
            },
            exchangeRates: {
                title: "Valyuta kurslari",
                refresh: "Yangilash",
                from: "Dan",
                to: "Ga",
                rate: "Kurs",
                ratesFor: "1 {{currency}} uchun kurs",
                disclaimer: "Kurslar taxminiy va faqat namoyish maqsadlarida."
            },
            chatbot: {
                title: "AI yordamchi",
                placeholder: "Xabar yozing...",
                send: "Yuborish",
                empty: "Yordamchiga savol bering"
            },

            notFound: {
                title: "404",
                message: "Kechirasiz, sahifa topilmadi",
                returnToHome: "Bosh sahifaga qaytish"
            },

            index: {
                welcome: "Ilovamizga xush kelibsiz",
                subtitle: "Ajoyib loyihangizni shu yerda yarating!"
            }
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "ru",
        supportedLngs: ["ru", "uz", "en"],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
        },
    });

export default i18n;