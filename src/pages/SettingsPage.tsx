import { ChevronRight, User, DollarSign, Users, LogOut, Moon, Sun, Check, Sparkles, Trash2, UserMinus, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
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

const SettingsPage = () => {
  const {
    userName, setUserName, userEmail, setUserEmail,
    selectedCurrency, setSelectedCurrency,
    darkMode, toggleDarkMode,
    familyMembers, familyEnabled, setFamilyEnabled,
    aiInsightEnabled, setAiInsightEnabled,
    resetFamilyData, deleteFamily, removeFamilyMember, setFamilyMembers,
    accounts, toggleAccountInBalance,
  } = useApp();

  const [showProfile, setShowProfile] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [inviteEmail, setInviteEmail] = useState("");

  // Dropdown states
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);

  const saveProfile = () => {
    setUserName(editName);
    setUserEmail(editEmail);
    setShowProfile(false);
    toast({ title: "Profile Updated", description: "Your profile has been saved." });
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    setFamilyMembers([...familyMembers, {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: inviteEmail.charAt(0).toUpperCase(),
      role: "member",
    }]);
    setInviteEmail("");
    setShowInvite(false);
    toast({ title: "Invited", description: `${inviteEmail} has been invited.` });
  };

  const handleResetFamily = () => {
    resetFamilyData();
    setShowResetConfirm(false);
    toast({ title: "Family Data Reset", description: "All family data has been cleared." });
  };

  const handleDeleteFamily = () => {
    deleteFamily();
    setShowDeleteConfirm(false);
    setShowFamily(false);
    setFamilyOpen(false);
    toast({ title: "Family Deleted", description: "Family workspace has been deleted." });
  };

  const sections = [
    {
      title: "Account",
      items: [
        { 
          icon: User, 
          label: "Profile", 
          desc: userName, 
          action: () => { setEditName(userName); setEditEmail(userEmail); setShowProfile(true); },
          isDropdown: false
        },
        { 
          icon: DollarSign, 
          label: "Currency", 
          desc: selectedCurrency, 
          action: () => {},
          isDropdown: true
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: darkMode ? Moon : Sun, label: "Theme", desc: darkMode ? "Dark" : "Light", action: toggleDarkMode, isDropdown: false },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Profile Card */}
      <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
        <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/50 transition-colors card-container">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">{userName.charAt(0)}</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground shrink-0" />
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="section-title mb-3">{section.title}</h2>
          <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
            {section.items.map((item, i) => (
              <div key={item.label} className={`${i < section.items.length - 1 ? "border-b border-border/30" : ""}`}>
                {item.isDropdown ? (
                  <DropdownMenu open={currencyOpen} onOpenChange={setCurrencyOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
                        <item.icon size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        <span className="text-xs text-muted-foreground font-medium">{item.desc}</span>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-80 border-border modal-bg rounded-xl">
                      {currencies.map(c => (
                        <DropdownMenuItem 
                          key={c} 
                          onClick={() => { setSelectedCurrency(c); setCurrencyOpen(false); toast({ title: "Currency Updated", description: `Currency set to ${c}` }); }}
                          className="flex items-center justify-between py-3 cursor-pointer"
                        >
                          <span className="text-sm font-medium">{c}</span>
                          {selectedCurrency === c && <Check size={18} className="text-primary" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
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

      {/* AI Insight Toggle */}
      <div>
        <h2 className="section-title mb-3">AI Features</h2>
        <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-warning shrink-0" />
              <span className="text-sm font-medium">AI Insight</span>
            </div>
            <Switch checked={aiInsightEnabled} onCheckedChange={setAiInsightEnabled} />
          </div>
        </div>
      </div>

      {/* Family Section */}
      <div>
        <h2 className="section-title mb-3">Workspace</h2>
        <div className="rounded-3xl border border-border/30 overflow-hidden card-container shadow-sm">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Family Mode</span>
            </div>
            <Switch checked={familyEnabled} onCheckedChange={setFamilyEnabled} />
          </div>
          {familyEnabled && (
            <DropdownMenu open={familyOpen} onOpenChange={setFamilyOpen}>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
                  <Users size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium flex-1 text-left">Family Management</span>
                  <span className="text-xs text-muted-foreground font-medium">{familyMembers.length} members</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-80 border-border p-0 modal-bg rounded-xl">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Family Management</h3>
                  <p className="text-xs text-muted-foreground">{familyMembers.length} members</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {familyMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">{m.role}</span>
                      {m.id !== "m1" && (
                        <button onClick={() => { removeFamilyMember(m.id); toast({ title: "Removed", description: `${m.name} has been removed.` }); }} className="p-1.5 rounded-xl text-destructive hover:bg-destructive/10 shrink-0">
                          <UserMinus size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 space-y-2">
                  <button onClick={() => { setFamilyOpen(false); setShowInvite(true); }} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
                    Invite Member
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => { setFamilyOpen(false); setShowResetConfirm(true); }} className="flex-1 py-2.5 rounded-xl bg-warning/10 text-warning font-semibold text-sm flex items-center justify-center gap-1.5">
                      <Trash2 size={12} /> Reset
                    </button>
                    <button onClick={() => { setFamilyOpen(false); setShowDeleteConfirm(true); }} className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm flex items-center justify-center gap-1.5">
                      <AlertTriangle size={12} /> Delete
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <button onClick={() => toast({ title: "Logged Out", description: "You have been logged out." })} className="w-full rounded-3xl border border-border/30 flex items-center justify-center gap-2 text-destructive font-semibold text-sm py-3.5 hover:bg-secondary/50 transition-colors card-container shadow-sm">
        <LogOut size={16} />
        Logout
      </button>

      {/* Profile Edit Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
              <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" />
            </div>
            <button onClick={saveProfile} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md">Save Changes</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader><DialogTitle>Invite Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="member@email.com" className="w-full rounded-2xl input-bg text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm" />
            </div>
            <button onClick={handleInvite} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md">Send Invite</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader><DialogTitle>Reset Family Data?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will clear all family accounts, transactions, and debts. Members will not be removed.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-3 rounded-2xl bg-secondary font-semibold text-sm shadow-sm">Cancel</button>
            <button onClick={handleResetFamily} className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm shadow-md">Reset</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:mx-4 mx-0 sm:max-w-sm max-w-[calc(100vw-1rem)] modal-bg rounded-2xl">
          <DialogHeader><DialogTitle>Delete Family?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove all members, clear all family data, and disable the family workspace. This action cannot be undone.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-2xl bg-secondary font-semibold text-sm shadow-sm">Cancel</button>
            <button onClick={handleDeleteFamily} className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm shadow-md">Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
