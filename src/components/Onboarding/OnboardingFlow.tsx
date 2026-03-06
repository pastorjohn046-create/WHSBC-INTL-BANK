import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Phone, Lock, ShieldCheck, Upload, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../Logo";

type Step = "auth" | "personal" | "security" | "identity";

export const OnboardingFlow = ({ onComplete }: { onComplete: (user: any) => void }) => {
  const [step, setStep] = useState<Step>("auth");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  React.useEffect(() => {
    let retries = 0;
    const maxRetries = 5;
    
    const checkConnection = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/health`);
        if (res.ok) {
          setIsOnline(true);
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(checkConnection, 2000);
        } else {
          setIsOnline(false);
        }
      } catch {
        if (retries < maxRetries) {
          retries++;
          setTimeout(checkConnection, 2000);
        } else {
          setIsOnline(false);
        }
      }
    };
    checkConnection();
  }, []);

  const handleAuth = async () => {
    setError("");
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    if (!isLogin && step === "auth") {
      setStep("personal");
      return;
    }

    try {
      const url = `${window.location.origin}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onComplete(data);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection failed. Please check if the server is running.");
    }
  };

  const handleNext = async () => {
    if (step === "personal") {
      if (!formData.name || !formData.email || !formData.phone) return;
      setStep("security");
    } else if (step === "security") {
      if (!formData.password || formData.pin.length !== 6) return;
      setStep("identity");
    } else if (step === "identity") {
      handleAuth();
    } else {
      handleAuth();
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-screen bg-zinc-950 text-white">
      <div className="flex justify-center mb-12">
        <Logo className="w-20 h-20" />
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase slam-in">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-zinc-500 text-sm">
                  {isLogin ? "Access your private wealth vault." : "Join the world's most exclusive bank."}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
              </div>

              {!isOnline && (
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center space-x-3 text-red-500">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Server Unreachable. Please check your connection.</p>
                </div>
              )}
            </motion.div>
          )}

          {step === "personal" && (
            <motion.div
              key="personal"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase slam-in">Personal Details</h2>
                <p className="text-zinc-500 text-sm">Tell us about yourself.</p>
              </div>

              <div className="space-y-4">
                <Input
                  icon={<User className="w-4 h-4" />}
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {step === "security" && (
            <motion.div
              key="security"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase slam-in">Security Setup</h2>
                <p className="text-zinc-500 text-sm">Set your 6-digit secure PIN.</p>
              </div>

              <div className="space-y-4">
                <Input
                  icon={<ShieldCheck className="w-4 h-4" />}
                  placeholder="6-Digit Secure PIN"
                  maxLength={6}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </motion.div>
          )}

          {step === "identity" && (
            <motion.div
              key="identity"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase slam-in">Identity Check</h2>
                <p className="text-zinc-500 text-sm">KYC compliance for high-net-worth accounts.</p>
              </div>

              <div className="p-12 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center space-y-4 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Upload Passport / ID</p>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">PDF, JPG or PNG (Max 5MB)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-6"
          >
            {error}
          </motion.p>
        )}
      </div>

      <div className="mt-12 space-y-4">
        <button
          onClick={handleNext}
          className="w-full py-5 rounded-2xl red-gradient font-black uppercase tracking-widest flex items-center justify-center group transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] active:scale-95"
        >
          {isLogin ? "Login to Vault" : step === "identity" ? "Complete Setup" : "Continue"}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        
        {step !== "auth" && (
          <button 
            onClick={() => setStep(step === "personal" ? "auth" : step === "security" ? "personal" : "security")}
            className="w-full py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};

const Input = ({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors">
      {icon}
    </div>
    <input
      {...props}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder:text-zinc-600"
    />
  </div>
);
