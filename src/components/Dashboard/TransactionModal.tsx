import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, ArrowDownLeft, Plus, Repeat, Shield, CheckCircle2, AlertCircle, Copy, Check, Bitcoin, CreditCard, DollarSign, Landmark } from "lucide-react";
import { User } from "../../App";
import { cn } from "../../lib/utils";

type TransactionType = "send" | "withdraw" | "deposit" | "swap";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  user: User;
  onSuccess: (updatedUser: User) => void;
}

export const TransactionModal = ({ isOpen, onClose, type, user, onSuccess }: TransactionModalProps) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [depositMethods, setDepositMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [copiedMethod, setCopiedMethod] = useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen && type === "deposit") {
      fetch("/api/deposit-methods")
        .then(res => res.json())
        .then(data => setDepositMethods(data));
    }
  }, [isOpen, type]);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMethod(id);
    setTimeout(() => setCopiedMethod(null), 2000);
  };

  const handleExecute = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("idle");
    
    try {
      const res = await fetch("/api/transactions/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          type,
          amount: Number(amount),
          description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
          recipientAccount: type === "send" ? recipient : null
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onSuccess(data);
          onClose();
          reset();
        }, 2000);
      } else {
        setErrorMessage(data.error || "Transaction failed");
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage("Connection error");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAmount("");
    setRecipient("");
    setDescription("");
    setStatus("idle");
    setErrorMessage("");
  };

  const getIcon = () => {
    switch (type) {
      case "send": return <ArrowUpRight className="w-6 h-6" />;
      case "withdraw": return <ArrowDownLeft className="w-6 h-6" />;
      case "deposit": return <Plus className="w-6 h-6" />;
      case "swap": return <Repeat className="w-6 h-6" />;
    }
  };

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'bitcoin': return <Bitcoin className="w-5 h-5" />;
      case 'paypal': return <CreditCard className="w-5 h-5" />;
      case 'dollar-sign': return <DollarSign className="w-5 h-5" />;
      case 'bank': return <Landmark className="w-5 h-5" />;
      default: return <Landmark className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "send": return "Send Wealth";
      case "withdraw": return "Withdraw Funds";
      case "deposit": return "Deposit Wealth";
      case "swap": return "Wealth Swap";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl red-gradient flex items-center justify-center shadow-lg shadow-red-600/20">
                  {getIcon()}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">{getTitle()}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure Transaction</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-zinc-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {status === "success" ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tighter uppercase">Transaction Complete</h4>
                    <p className="text-sm text-zinc-500">Your wealth has been moved securely.</p>
                  </div>
                </motion.div>
              ) : type === "deposit" ? (
                <div className="space-y-6">
                  <div className="p-6 glass rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Account Number</p>
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-black tracking-widest">{user.accountNumber}</p>
                      <button 
                        onClick={() => handleCopy(user.accountNumber, 0)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {copiedMethod === 0 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500">Deposit Methods</h4>
                    <div className="space-y-3">
                      {depositMethods.map((method) => (
                        <div key={method.id} className="p-4 glass rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                                {getMethodIcon(method.icon)}
                              </div>
                              <span className="text-sm font-black uppercase tracking-tight">{method.name}</span>
                            </div>
                            <button 
                              onClick={() => handleCopy(method.details, method.id)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              {copiedMethod === method.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
                            </button>
                          </div>
                          <p className="text-xs font-mono text-zinc-400 break-all bg-black/20 p-3 rounded-xl">{method.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount to Deposit ($)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-xl font-black tracking-tighter focus:outline-none focus:border-red-600/50 transition-all"
                      />
                    </div>
                    <button
                      disabled={loading}
                      onClick={handleExecute}
                      className={cn(
                        "w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3",
                        loading ? "bg-zinc-800 text-zinc-500" : "red-gradient text-white shadow-lg shadow-red-600/20"
                      )}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          <span>Notify Deposit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-500">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-6 pl-10 pr-6 text-3xl font-black tracking-tighter focus:outline-none focus:border-red-600/50 transition-all"
                        />
                      </div>
                    </div>

                    {type === "send" && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Recipient Account Number</label>
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          placeholder="Enter 8-digit account number"
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Reference (Optional)</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this for?"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center space-x-3 text-red-500"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-xs font-bold uppercase tracking-widest">{errorMessage}</p>
                    </motion.div>
                  )}

                  <button
                    disabled={loading}
                    onClick={handleExecute}
                    className={cn(
                      "w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3",
                      loading ? "bg-zinc-800 text-zinc-500" : "red-gradient text-white shadow-lg shadow-red-600/20"
                    )}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Confirm Transaction</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
