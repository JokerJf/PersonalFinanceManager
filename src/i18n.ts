import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    ru: {
        translation: {
            common: {
                russian: "Русский",
                uzbek: "O‘zbekcha",
                cancel: "Отмена",
                delete: "Удалить",
                reset: "Сбросить",
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
                excluded: "Исключён из баланса"
            },
            dashboard: {
                title: "Главная",
                totalBalance: "Общий баланс",
                recentTransactions: "Последние транзакции",
                quickActions: "Быстрые действия"
            },
            analytics: {
                title: "Аналитика",
                incomeVsExpense: "Доходы и расходы",
                spendingByCategory: "Расходы по категориям",
                noData: "Недостаточно данных"
            },
            exchangeRates: {
                title: "Курсы валют",
                refresh: "Обновить",
                from: "Из",
                to: "В",
                rate: "Курс"
            },
            chatbot: {
                title: "AI помощник",
                placeholder: "Напиши сообщение...",
                send: "Отправить",
                empty: "Задай вопрос ассистенту"
            },

        },
    },

    uz: {
        translation: {
            common: {
                russian: "Ruscha",
                uzbek: "O‘zbekcha",
                cancel: "Bekor qilish",
                delete: "O‘chirish",
                reset: "Tiklash",
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
                excluded: "Balansdan chiqarilgan"
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
                noData: "Ma’lumot yetarli emas"
            },
            exchangeRates: {
                title: "Valyuta kurslari",
                refresh: "Yangilash",
                from: "Dan",
                to: "Ga",
                rate: "Kurs"
            },
            chatbot: {
                title: "AI yordamchi",
                placeholder: "Xabar yozing...",
                send: "Yuborish",
                empty: "Yordamchiga savol bering"
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
        supportedLngs: ["ru", "uz"],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
        },
    });

export default i18n;