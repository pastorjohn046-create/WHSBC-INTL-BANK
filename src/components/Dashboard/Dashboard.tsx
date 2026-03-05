import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Repeat, 
  MoreHorizontal, 
  Copy, 
  Check,
  LogOut,
  TrendingUp,
  CreditCard,
  Shield,
  Home,
  PieChart,
  Settings,
  Users as UsersIcon
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { User } from "../../App";
import { cn } from "../../lib/utils";
import { TransactionModal } from "./TransactionModal";
import { Sun, Moon, Wallet, History, Globe, Lock, Bell, User as UserIcon, HelpCircle, ChevronRight } from "lucide-react";

const chartData = [
  { name: "Mon", value: 2400000 },
  { name: "Tue", value: 2450000 },
  { name: "Wed", value: 2420000 },
  { name: "Thu", value: 2510000 },
  { name: "Fri", value: 2480000 },
  { name: "Sat", value: 2500000 },
  { name: "Sun", value: 2500000 },
];

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onUpdateUser: (user: User) => void;
}

const WealthCard = ({ label, value, icon, color }: any) => (
  <div className="glass rounded-3xl p-6 space-y-4">
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", color)}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>
    <div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-black tracking-tight">{value}</p>
    </div>
  </div>
);

const ControlItem = ({ label, icon }: any) => (
  <div className="flex items-center justify-between p-4 glass rounded-2xl">
    <div className="flex items-center space-x-4">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-sm font-black uppercase tracking-tight">{label}</span>
    </div>
    <div className="w-12 h-6 bg-zinc-800 rounded-full relative p-1">
      <div className="w-4 h-4 bg-zinc-500 rounded-full" />
    </div>
  </div>
);

const VaultItem = ({ icon, label }: any) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors rounded-2xl">
    <div className="flex items-center space-x-4">
      <div className="text-zinc-400">{icon}</div>
      <span className="text-sm font-black uppercase tracking-tight text-zinc-900">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-zinc-300" />
  </button>
);

const WealthView = ({ user }: { user: User }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8"
  >
    <div className="space-y-2">
      <h3 className="text-2xl font-black tracking-tighter uppercase">Wealth Portfolio</h3>
      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Diversified Assets</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <WealthCard label="Cash" value={`$${(user.balance * 0.4).toLocaleString()}`} icon={<Wallet />} color="bg-emerald-500" />
      <WealthCard label="Equities" value={`$${(user.balance * 0.3).toLocaleString()}`} icon={<TrendingUp />} color="bg-blue-500" />
      <WealthCard label="Real Estate" value={`$${(user.balance * 0.2).toLocaleString()}`} icon={<Globe />} color="bg-amber-500" />
      <WealthCard label="Commodities" value={`$${(user.balance * 0.1).toLocaleString()}`} icon={<Shield />} color="bg-red-500" />
    </div>

    <div className="glass rounded-[32px] p-8 space-y-6">
      <h4 className="text-sm font-black tracking-tighter uppercase">Performance History</h4>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <Area type="monotone" dataKey="value" stroke="#ff0000" fill="#ff000020" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

const CardsView = ({ user }: { user: User }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8"
  >
    <div className="space-y-2">
      <h3 className="text-2xl font-black tracking-tighter uppercase">Private Cards</h3>
      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Infinite Access</p>
    </div>

    <div className="relative aspect-[1.58/1] w-full rounded-[24px] red-gradient p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">WHSBC Private</p>
          <div className="w-12 h-8 bg-amber-400/20 rounded-md border border-amber-400/30" />
        </div>
        <Shield className="w-8 h-8 text-white/20" />
      </div>
      
      <div className="space-y-4">
        <p className="text-2xl font-mono tracking-[0.2em] text-white">•••• •••• •••• 8888</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Card Holder</p>
            <p className="text-sm font-black uppercase tracking-tight">{user.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Expires</p>
            <p className="text-sm font-black">12/28</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
    </div>

    <div className="space-y-4">
      <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">Card Controls</h4>
      <div className="space-y-3">
        <ControlItem label="Freeze Card" icon={<Lock />} />
        <ControlItem label="Limit Settings" icon={<TrendingUp />} />
        <ControlItem label="Contactless" icon={<Globe />} />
      </div>
    </div>
  </motion.div>
);

const VaultView = ({ user, onLogout }: { user: User; onLogout: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-8"
  >
    <div className="space-y-2">
      <h3 className="text-2xl font-black tracking-tighter uppercase">Secure Vault</h3>
      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Account Management</p>
    </div>

    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl">
      <div className="p-6 border-b border-zinc-100 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full red-gradient flex items-center justify-center text-2xl font-black text-white">
          {user.name[0]}
        </div>
        <div>
          <h4 className="text-lg font-black uppercase tracking-tight text-zinc-900">{user.name}</h4>
          <div className="inline-block px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">{user.tier}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 border-b border-zinc-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</p>
            <p className="text-sm font-black uppercase tracking-tight text-zinc-900">{user.name}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</p>
            <p className="text-sm font-black tracking-tight text-zinc-900">{user.email}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Number</p>
            <p className="text-lg font-black tracking-widest text-zinc-900">{user.accountNumber}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(user.accountNumber);
            }}
            className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <Copy className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sort Code</p>
            <p className="text-lg font-black tracking-widest text-zinc-900">{user.sortCode}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(user.sortCode);
            }}
            className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <Copy className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        <VaultItem icon={<UserIcon className="text-zinc-400" />} label="Personal Information" />
        <VaultItem icon={<Shield className="text-zinc-400" />} label="Security & Privacy" />
        <VaultItem icon={<Bell className="text-zinc-400" />} label="Notifications" />
        <VaultItem icon={<HelpCircle className="text-zinc-400" />} label="Support Center" />
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-600 transition-colors rounded-2xl"
        >
          <div className="flex items-center space-x-4">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-tight">Logout Session</span>
          </div>
        </button>
      </div>
    </div>
  </motion.div>
);

const AdminView = ({ currentUser, onUpdateUser }: { currentUser: User; onUpdateUser: (user: User) => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [depositMethods, setDepositMethods] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newMethodDetails, setNewMethodDetails] = useState("");

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const fetchMethods = () => {
    fetch("/api/deposit-methods")
      .then(res => res.json())
      .then(data => setDepositMethods(data));
  };

  useEffect(() => {
    fetchUsers();
    fetchMethods();
  }, []);

  const handleUpdate = async () => {
    if (!editingUser) return;
    const res = await fetch("/api/admin/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: editingUser.id,
        balance: parseFloat(newBalance),
        accountNumber: newAccountNumber
      })
    });
    if (res.ok) {
      const updatedUser = await res.json();
      if (updatedUser.id === currentUser.id) {
        onUpdateUser(updatedUser);
      }
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleUpdateMethod = async () => {
    if (!editingMethod) return;
    const res = await fetch("/api/admin/update-deposit-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingMethod.id,
        details: newMethodDetails
      })
    });
    if (res.ok) {
      setEditingMethod(null);
      fetchMethods();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tighter uppercase">Admin Control</h3>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Manage All Accounts</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">Deposit Methods</h4>
        {depositMethods.map(m => (
          <div key={m.id} className="glass rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight">{m.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Payment Detail</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingMethod(m);
                  setNewMethodDetails(m.details);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-600/10 text-red-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-mono text-zinc-400 break-all bg-black/20 p-3 rounded-xl">{m.details}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">User Accounts</h4>
        {users.map(u => (
          <div key={u.id} className="glass rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full red-gradient flex items-center justify-center font-black text-white">
                  {u.name[0]}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight">{u.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{u.email}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingUser(u);
                  setNewBalance(u.balance.toString());
                  setNewAccountNumber(u.accountNumber);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-600/10 text-red-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Balance</p>
                <p className="text-sm font-black">${u.balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Account #</p>
                <p className="text-sm font-black">{u.accountNumber}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm glass rounded-[32px] p-8 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Edit Account</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{editingUser.name}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adjust Balance ($)</label>
                  <input 
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Number</label>
                  <input 
                    type="text"
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-red-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-500 font-black uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 py-4 rounded-2xl red-gradient text-white font-black uppercase tracking-widest text-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMethod && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm glass rounded-[32px] p-8 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Edit Method</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{editingMethod.name}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payment Details / Address</label>
                  <textarea 
                    value={newMethodDetails}
                    onChange={(e) => setNewMethodDetails(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-red-600 transition-all min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setEditingMethod(null)}
                  className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-500 font-black uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateMethod}
                  className="flex-1 py-4 rounded-2xl red-gradient text-white font-black uppercase tracking-widest text-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-2 group">
    <div className="w-full aspect-square rounded-2xl glass flex items-center justify-center group-hover:bg-red-600/10 group-hover:text-red-600 transition-all group-hover:scale-105">
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{label}</span>
  </button>
);

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center space-y-1 px-2 py-1 rounded-2xl transition-all duration-300",
      active ? "text-red-600" : "text-zinc-500 hover:text-zinc-300"
    )}
  >
    {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    {active && (
      <motion.div 
        layoutId="nav-pill"
        className="w-1 h-1 rounded-full bg-red-600 mt-1"
      />
    )}
  </button>
);

const TransactionItem: React.FC<{ tx: any }> = ({ tx }) => (
  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
    <div className="flex items-center space-x-3">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        tx.type === 'send' ? "bg-red-600/10 text-red-600" : "bg-emerald-600/10 text-emerald-600"
      )}>
        {tx.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
      </div>
      <div>
        <p className="text-sm font-bold">{tx.description}</p>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{tx.status}</p>
      </div>
    </div>
    <p className={cn(
      "text-sm font-black tracking-tight",
      tx.type === 'send' ? "text-white" : "text-emerald-500"
    )}>
      {tx.type === 'send' ? '-' : '+'}${tx.amount.toLocaleString()}
    </p>
  </div>
);

export const Dashboard = ({ user, onLogout, isDarkMode, toggleTheme, onUpdateUser }: DashboardProps) => {
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [modalType, setModalType] = useState<"send" | "withdraw" | "deposit" | "swap" | null>(null);

  const fetchTransactions = () => {
    fetch(`/api/transactions/${user.id}`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  };

  const fetchUserData = () => {
    fetch(`/api/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== user.balance) {
          onUpdateUser(data);
        }
      });
  };

  useEffect(() => {
    fetchTransactions();
    // Poll for user data updates every 5 seconds for "instant" reflection
    const interval = setInterval(() => {
      fetchUserData();
      fetchTransactions();
    }, 5000);
    return () => clearInterval(interval);
  }, [user.id, user.balance]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransactionSuccess = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    fetchTransactions();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Balance Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative overflow-hidden rounded-[32px] p-8 red-gradient shadow-[0_20px_40px_rgba(255,0,0,0.3)]"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Total Wealth</p>
                    <h3 className="text-4xl font-black tracking-tighter text-white">
                      ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-[8px] font-black text-white">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{user.tier}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/20 rounded-full blur-2xl" />
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-4">
              <ActionButton onClick={() => setModalType("send")} icon={<ArrowUpRight />} label="Send" />
              <ActionButton onClick={() => setModalType("withdraw")} icon={<ArrowDownLeft />} label="Withdraw" />
              <ActionButton onClick={() => setModalType("deposit")} icon={<Plus />} label="Deposit" />
              <ActionButton onClick={() => setModalType("swap")} icon={<Repeat />} label="Swap" />
            </div>

            {/* Portfolio Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">Portfolio</h4>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="glass rounded-[32px] p-6 h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff0000" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ff0000" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">Activity</h4>
                <button className="text-[10px] font-bold text-red-600 uppercase tracking-widest">See All</button>
              </div>
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TransactionItem key={tx.id} tx={tx} />
                  ))
                ) : (
                  <div className="glass rounded-3xl p-8 text-center space-y-2">
                    <CreditCard className="w-8 h-8 text-zinc-800 mx-auto" />
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No recent movement</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case "wealth":
        return <WealthView user={user} />;
      case "cards":
        return <CardsView user={user} />;
      case "vault":
        return <VaultView user={user} onLogout={onLogout} />;
      case "admin":
        return <AdminView currentUser={user} onUpdateUser={onUpdateUser} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "max-w-md mx-auto min-h-screen flex flex-col pb-24 transition-colors duration-500",
      isDarkMode ? "bg-zinc-950" : "bg-zinc-50"
    )}>
      {/* Top Header */}
      <header className={cn(
        "p-6 flex items-center justify-between sticky top-0 backdrop-blur-xl z-30",
        isDarkMode ? "bg-zinc-950/80" : "bg-zinc-50/80"
      )}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full red-gradient flex items-center justify-center font-black text-lg shadow-lg">
            {user.name[0]}
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user.tier}</p>
            <h2 className="text-sm font-black tracking-tight uppercase slam-in">{user.name}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-900/10 border border-zinc-800/10 text-zinc-500 hover:text-red-600 transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl bg-zinc-900/10 border border-zinc-800/10 text-zinc-500 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 z-40">
        <div className={cn(
          "rounded-[32px] p-2 flex items-center justify-around shadow-2xl border transition-colors duration-500",
          isDarkMode ? "glass border-white/10" : "bg-white border-zinc-200"
        )}>
          <NavButton 
            active={activeTab === "home"} 
            onClick={() => setActiveTab("home")} 
            icon={<Home />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === "wealth"} 
            onClick={() => setActiveTab("wealth")} 
            icon={<PieChart />} 
            label="Wealth" 
          />
          <div className="relative -top-8">
            <button 
              onClick={() => setModalType("deposit")}
              className="w-14 h-14 rounded-full red-gradient shadow-[0_10px_20px_rgba(255,0,0,0.4)] flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <NavButton 
            active={activeTab === "cards"} 
            onClick={() => setActiveTab("cards")} 
            icon={<CreditCard />} 
            label="Cards" 
          />
          <NavButton 
            active={activeTab === "vault"} 
            onClick={() => setActiveTab("vault")} 
            icon={<Lock />} 
            label="Vault" 
          />
          {user.role === 'admin' && (
            <NavButton 
              active={activeTab === "admin"} 
              onClick={() => setActiveTab("admin")} 
              icon={<UsersIcon />} 
              label="Admin" 
            />
          )}
        </div>
      </nav>

      <TransactionModal 
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        type={modalType || "send"}
        user={user}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

