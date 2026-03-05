import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Shield } from "lucide-react";
import { User as UserType } from "../../App";
import { cn } from "../../lib/utils";

type Message = {
  sender: string;
  text: string;
  timestamp: string;
  userId?: number;
};

export const SupportChat = ({ user }: { user: UserType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "System",
      text: "Welcome to WHSBC Private Banking Support. Your dedicated wealth manager is available to assist you.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    ws.current = new WebSocket(`${protocol}//${window.location.host}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !ws.current) return;

    const msgData = {
      sender: user.name,
      text: message,
      userId: user.id,
    };

    ws.current.send(JSON.stringify(msgData));
    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 right-6 w-16 h-16 rounded-full red-gradient shadow-[0_10px_30px_rgba(255,0,0,0.4)] flex items-center justify-center z-40 group"
      >
        <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[380px] h-[500px] glass rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-6 red-gradient flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tighter uppercase">Private Support</h4>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Always Secure</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.sender === user.name ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm font-medium",
                    msg.sender === user.name 
                      ? "bg-red-600 text-white rounded-tr-none" 
                      : "bg-zinc-800 text-zinc-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-900/50 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:border-red-600/50 transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
