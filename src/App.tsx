import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingFlow } from "./components/Onboarding/OnboardingFlow";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { SupportChat } from "./components/Chat/SupportChat";
import { cn } from "./lib/utils";

export type User = {
  id: number;
  name: string;
  email: string;
  balance: number;
  tier: string;
  accountNumber: string;
  sortCode: string;
  role: string;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("whsbc_user", JSON.stringify(userData));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("whsbc_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (!parsedUser.role) {
        localStorage.removeItem("whsbc_user");
        setUser(null);
      } else {
        setUser(parsedUser);
        // Fetch latest data from server to avoid stale balance
        fetch(`${window.location.origin}/api/user/${parsedUser.id}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.id) {
              handleUpdateUser(data);
            }
          })
          .catch(err => console.error("Failed to sync user data:", err));
      }
    }
    const savedTheme = localStorage.getItem("whsbc_theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("whsbc_theme", newTheme ? "dark" : "light");
  };

  const handleLogin = (userData: User) => {
    handleUpdateUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("whsbc_user");
  };

  if (loading) return null;

  return (
    <div className={cn(
      "min-h-screen overflow-x-hidden transition-colors duration-500",
      isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !user ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <OnboardingFlow onComplete={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              onUpdateUser={handleUpdateUser}
            />
            <SupportChat user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
