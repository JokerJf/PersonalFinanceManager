import {
  ChevronRight,
  User,
  DollarSign,
  Wallet,
  Users,
  LogOut,
  Moon,
  Sun,
  Check,
  Sparkles,
  Trash2,
  UserMinus,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currencies = ["USD", "UZS", "EUR", "RUB", "GBP"];
const balanceCurrencies = ["all", "USD", "UZS", "EUR", "GBP", "RUB"];
const languages = ["ru", "uz"] as const;

const SettingsPage = () => {
  const { t } = useTranslation();

  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    selectedCurrency,
    setSelectedCurrency,
    balanceCurrency,
    setBalanceCurrency,
    darkMode,
    toggleDarkMode,
    familyMembers,
    familyEnabled,
    setFamilyEnabled,
    aiInsightEnabled,
    setAiInsightEnabled,
    resetFamilyData,
    deleteFamily,
    removeFamilyMember,
    setFamilyMembers,
    accounts,
    toggleAccountInBalance,
    language,
    changeLanguage,
    isLoadingData,
  } = useApp();

  const [showProfile, setShowProfile] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [inviteEmail, setInviteEmail] = useState("");

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [balanceCurrencyOpen, setBalanceCurrencyOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    setEditName(userName);
    setEditEmail(userEmail);
  }, [userName, userEmail]);

  const getBalanceCurrencyLabel = (c: string) => {
    if (c === "all") return t("settings.balanceCurrency.all");
    return c;
  };

  const getLanguageLabel = (lang: "ru" | "uz") => {
    return lang === "ru" ? t("common.russian") : t("common.uzbek");
  };

  const saveProfile = () => {
    setUserName(editName);
    setUserEmail(editEmail);
    setShowProfile(false);

    toast({
      title: t("settings.toasts.profileUpdated.title"),
      description: t("settings.toasts.profileUpdated.description"),
    });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    const nextMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: inviteEmail.charAt(0).toUpperCase(),
      role: "member" as const,
    };

    setFamilyMembers([...familyMembers, nextMember]);

    const invitedEmail = inviteEmail;
    setInviteEmail("");
    setShowInvite(false);

    toast({
      title: t("settings.toasts.invited.title"),
      description: t("settings.toasts.invited.description", { email: invitedEmail }),
    });
  };

  const handleResetFamily = () => {
    resetFamilyData();
    setShowResetConfirm(false);

    toast({
      title: t("settings.toasts.familyReset.title"),
      description: t("settings.toasts.familyReset.description"),
    });
  };

  const handleDeleteFamily = () => {
    deleteFamily();
    setShowDeleteConfirm(false);
    setShowFamily(false);
    setFamilyOpen(false);

    toast({
      title: t("settings.toasts.familyDeleted.title"),
      description: t("settings.toasts.familyDeleted.description"),
    });
  };

  const sections = [
    {
      title: t("settings.sections.account"),
      items: [
        {
          icon: DollarSign,
          label: t("settings.items.currency"),
          desc: selectedCurrency,
          isDropdown: true,
          dropdownType: "currency" as const,
        },
        {
          icon: Wallet,
          label: t("settings.items.balanceCurrency"),
          desc: getBalanceCurrencyLabel(balanceCurrency),
          isDropdown: true,
          dropdownType: "balance" as const,
        },
        {
          icon: User,
          label: t("settings.items.language"),
          desc: getLanguageLabel(language),
          isDropdown: true,
          dropdownType: "language" as const,
        },
      ],
    },
    {
      title: t("settings.sections.preferences"),
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: t("settings.items.theme"),
          desc: darkMode ? t("settings.theme.dark") : t("settings.theme.light"),
          action: toggleDarkMode,
          isDropdown: false,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">{t("settings.title")}</h1>

      {/* Profile Card */}
      {isLoadingData ? (
        <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
          <div
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/50 transition-colors card-container"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </div>
        </div>
      )}

      {isLoadingData ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-16 w-full rounded-3xl" />
          </div>
        </div>
      ) : (
        <>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="section-title mb-3">{section.title}</h2>
              <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
                {section.items.map((item, i) => (
                  <div
                    key={item.label}
                    className={`${i < section.items.length - 1 ? "border-b border-border/30" : ""}`}
                  >
                    {item.isDropdown ? (
                      <DropdownMenu
                        open={
                          item.dropdownType === "balance"
                            ? balanceCurrencyOpen
                            : item.dropdownType === "language"
                            ? languageOpen
                            : currencyOpen
                        }
                        onOpenChange={
                          item.dropdownType === "balance"
                            ? setBalanceCurrencyOpen
                            : item.dropdownType === "language"
                            ? setLanguageOpen
                            : setCurrencyOpen
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
                            <item.icon size={18} className="text-muted-foreground" />
                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                            <span className="text-xs text-muted-foreground font-medium">{item.desc}</span>
                            <ChevronRight size={14} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="start"
                          className="w-[calc(100vw-2rem)] sm:w-80 border-border modal-bg rounded-xl"
                        >
                          {item.dropdownType === "balance" ? (
                            <>
                              {balanceCurrencies.map((c) => (
                                <DropdownMenuItem
                                  key={c}
                                  onClick={() => {
                                    setBalanceCurrency(c);
                                    setBalanceCurrencyOpen(false);
                                    toast({
                                      title: t("settings.toasts.balanceCurrencyUpdated.title"),
                                      description:
                                        c === "all"
                                          ? t("settings.toasts.balanceCurrencyUpdated.allDescription")
                                          : t("settings.toasts.balanceCurrencyUpdated.description", { currency: c }),
                                    });
                                  }}
                                  className="flex items-center justify-between py-3 cursor-pointer"
                                >
                                  <span className="text-sm font-medium">{getBalanceCurrencyLabel(c)}</span>
                                  {balanceCurrency === c && <Check size={18} className="text-primary" />}
                                </DropdownMenuItem>
                              ))}
                            </>
                          ) : item.dropdownType === "language" ? (
                            <>
                              {languages.map((lang) => (
                                <DropdownMenuItem
                                  key={lang}
                                  onClick={() => {
                                    changeLanguage(lang);
                                    setLanguageOpen(false);
                                    toast({
                                      title: t("settings.toasts.languageUpdated.title"),
                                      description: t("settings.toasts.languageUpdated.description", {
                                        language: getLanguageLabel(lang),
                                      }),
                                    });
                                  }}
                                  className="flex items-center justify-between py-3 cursor-pointer"
                                >
                                  <span className="text-sm font-medium">{getLanguageLabel(lang)}</span>
                                  {language === lang && <Check size={18} className="text-primary" />}
                                </DropdownMenuItem>
                              ))}
                            </>
                          ) : (
                            <>
                              {currencies.map((c) => (
                                <DropdownMenuItem
                                  key={c}
                                  onClick={() => {
                                    setSelectedCurrency(c);
                                    setCurrencyOpen(false);
                                    toast({
                                      title: t("settings.toasts.currencyUpdated.title"),
                                      description: t("settings.toasts.currencyUpdated.description", {
                                        currency: c,
                                      }),
                                    });
                                  }}
                                  className="flex items-center justify-between py-3 cursor-pointer"
                                >
                                  <span className="text-sm font-medium">{c}</span>
                                  {selectedCurrency === c && <Check size={18} className="text-primary" />}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <button
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors"
                      >
                        <item.icon size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        <span className="text-xs text-muted-foreground font-medium">{item.desc}</span>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Accounts Included In Balance */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-36 mb-3" />
          <Skeleton className="h-28 w-full rounded-3xl" />
        </div>
      ) : (
        <div>
          <h2 className="section-title mb-3">{t("settings.sections.balanceAccounts")}</h2>
          <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
            {accounts.map((account, index) => (
              <div
                key={account.id}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  index < accounts.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${account.color} shrink-0`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{account.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.currency}</p>
                  </div>
                </div>

                <Switch
                  checked={account.includedInBalance !== false}
                  onCheckedChange={() => {
                    toggleAccountInBalance(account.id);
                    toast({
                      title: t("settings.toasts.accountBalanceUpdated.title"),
                      description:
                        account.includedInBalance !== false
                          ? t("settings.toasts.accountBalanceUpdated.removed", { account: account.name })
                          : t("settings.toasts.accountBalanceUpdated.added", { account: account.name }),
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insight Toggle */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      ) : (
        <div>
          <h2 className="section-title mb-3">{t("settings.sections.aiFeatures")}</h2>
          <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-warning shrink-0" />
                <span className="text-sm font-medium">{t("settings.items.aiInsight")}</span>
              </div>
              <Switch checked={aiInsightEnabled} onCheckedChange={setAiInsightEnabled} />
            </div>
          </div>
        </div>
      )}

      {/* Family Section */}
      {isLoadingData ? (
        <div>
          <Skeleton className="h-6 w-28 mb-3" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      ) : (
        <div>
          <h2 className="section-title mb-3">{t("settings.sections.workspace")}</h2>
          <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/30">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t("settings.items.familyMode")}</span>
              </div>
              <Switch checked={familyEnabled} onCheckedChange={setFamilyEnabled} />
            </div>

            {familyEnabled && (
              <DropdownMenu open={familyOpen} onOpenChange={setFamilyOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
                    <Users size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium flex-1 text-left">
                      {t("settings.items.familyManagement")}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("settings.family.membersCount", { count: familyMembers.length })}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-[calc(100vw-2rem)] sm:w-80 border-border p-0 modal-bg rounded-xl"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">{t("settings.items.familyManagement")}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t("settings.family.membersCount", { count: familyMembers.length })}
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {familyMembers.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {m.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                          {m.role}
                        </span>

                        {m.id !== "m1" && (
                          <button
                            onClick={() => {
                              removeFamilyMember(m.id);
                              toast({
                                title: t("settings.toasts.memberRemoved.title"),
                                description: t("settings.toasts.memberRemoved.description", {
                                  name: m.name,
                                }),
                              });
                            }}
                            className="p-1.5 rounded-xl text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 space-y-2">
                    <button
                      onClick={() => {
                        setFamilyOpen(false);
                        setShowInvite(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                    >
                      {t("settings.family.inviteMember")}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFamilyOpen(false);
                          setShowResetConfirm(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-warning/10 text-warning font-semibold text-sm flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={12} /> {t("common.reset")}
                      </button>

                      <button
                        onClick={() => {
                          setFamilyOpen(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={12} /> {t("common.delete")}
                      </button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {/* Logout */}
      {!isLoadingData && (
        <button
          onClick={() =>
            toast({
              title: t("settings.toasts.logout.title"),
              description: t("settings.toasts.logout.description"),
            })
          }
          className="w-full rounded-3xl border border-border/30 flex items-center justify-center gap-2 text-destructive font-semibold text-sm py-3.5 hover:bg-secondary/50 transition-colors card-container shadow-sm"
        >
          <LogOut size={16} />
          {t("settings.logout")}
        </button>
      )}

      {/* Profile Edit Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("settings.dialogs.editProfile.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("settings.dialogs.editProfile.name")}
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("settings.dialogs.editProfile.email")}
              </label>
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm"
              />
            </div>

            <button
              onClick={saveProfile}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md"
            >
              {t("settings.dialogs.editProfile.save")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("settings.dialogs.invite.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {t("settings.dialogs.invite.email")}
              </label>
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@email.com"
                className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm"
              />
            </div>

            <button
              onClick={handleInvite}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md"
            >
              {t("settings.dialogs.invite.send")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirm */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              {t("settings.dialogs.resetFamily.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("settings.dialogs.resetFamily.description")}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleResetFamily}
                className="flex-1 py-3 rounded-2xl bg-warning text-white font-semibold text-sm"
              >
                {t("common.reset")}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-destructive" />
              {t("settings.dialogs.deleteFamily.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("settings.dialogs.deleteFamily.description")}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeleteFamily}
                className="flex-1 py-3 rounded-2xl bg-destructive text-white font-semibold text-sm"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;