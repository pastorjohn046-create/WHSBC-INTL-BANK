import express from "express";
import { createServer as createHttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("whsbc.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT,
    pin TEXT,
    balance REAL DEFAULT 10000.00,
    tier TEXT DEFAULT 'Private Tier Member',
    account_number TEXT,
    sort_code TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    amount REAL,
    status TEXT,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    sender TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deposit_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    details TEXT,
    icon TEXT
  );

  -- Add default deposit methods
  INSERT OR IGNORE INTO deposit_methods (id, name, details, icon) VALUES (1, 'Bitcoin (BTC)', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'bitcoin');
  INSERT OR IGNORE INTO deposit_methods (id, name, details, icon) VALUES (2, 'PayPal', 'payments@whsbc.bank', 'paypal');
  INSERT OR IGNORE INTO deposit_methods (id, name, details, icon) VALUES (3, 'Cash App', '$WHSBCWealth', 'dollar-sign');
  INSERT OR IGNORE INTO deposit_methods (id, name, details, icon) VALUES (4, 'Bank Wire', 'WHSBC Global Wealth Management - Account: 00000000', 'bank');

  -- Add default admin users
  INSERT OR IGNORE INTO users (name, email, phone, password, pin, balance, tier, account_number, sort_code, role)
  VALUES ('Admin User', 'admin@whsbc.bank', '+44 20 7946 0000', 'WHSBC_Admin_2026!', '123456', 999999999.99, 'Elite Private Tier', '00000001', '40-00-00', 'admin');
  
  INSERT OR IGNORE INTO users (name, email, phone, password, pin, balance, tier, account_number, sort_code, role)
  VALUES ('Executive Admin', 'executive@whsbc.bank', '+44 20 7946 0001', 'WHSBC_Exec_2026!', '654321', 999999999.99, 'Executive Private Tier', '00000002', '40-00-00', 'admin');

  -- Ensure admin roles are set correctly for default accounts
  UPDATE users SET role = 'admin' WHERE email IN ('admin@whsbc.bank', 'executive@whsbc.bank');
`);

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const wss = new WebSocketServer({ server: httpServer });
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const normalizeUser = (user: any) => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      tier: user.tier,
      accountNumber: user.account_number,
      sortCode: user.sort_code,
      role: user.role
    };
  };

  // Ensure role column exists
  try {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
  } catch (e) {}

  // API Routes
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, phone, password, pin } = req.body;
    const accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const sortCode = "40-00-00";
    
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, phone, password, pin, balance, account_number, sort_code, role) VALUES (?, ?, ?, ?, ?, 10000.00, ?, ?, 'user')");
      const info = stmt.run(name, email, phone, password, pin, accountNumber, sortCode);
      res.json({ id: info.lastInsertRowid, name, email, phone, balance: 10000.00, tier: 'Private Tier Member', accountNumber, sortCode, role: 'user' });
    } catch (err) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(normalizeUser(user));
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/transactions/:userId", (req, res) => {
    const transactions = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10").all(req.params.userId);
    res.json(transactions);
  });

  app.get("/api/user/:userId", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.userId);
    if (user) {
      res.json(normalizeUser(user));
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users.map(normalizeUser));
  });

  app.post("/api/admin/update-user", (req, res) => {
    const { userId, balance, accountNumber } = req.body;
    try {
      db.transaction(() => {
        const oldUser = db.prepare("SELECT balance FROM users WHERE id = ?").get(userId);
        if (!oldUser) throw new Error("User not found");
        
        const diff = balance - oldUser.balance;
        
        db.prepare("UPDATE users SET balance = ?, account_number = ? WHERE id = ?").run(balance, accountNumber, userId);
        
        if (Math.abs(diff) > 0.01) {
          db.prepare("INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, ?, ?, ?, ?)")
            .run(userId, diff > 0 ? 'deposit' : 'withdraw', Math.abs(diff), 'completed', 'Administrative Wealth Adjustment');
        }
      })();
      
      const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      res.json(normalizeUser(updatedUser));
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/deposit-methods", (req, res) => {
    const methods = db.prepare("SELECT * FROM deposit_methods").all();
    res.json(methods);
  });

  app.post("/api/admin/update-deposit-method", (req, res) => {
    const { id, details } = req.body;
    try {
      db.prepare("UPDATE deposit_methods SET details = ? WHERE id = ?").run(details, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/transactions/execute", (req, res) => {
    const { userId, type, amount, description, recipientAccount } = req.body;
    
    try {
      db.transaction(() => {
        const user = db.prepare("SELECT balance FROM users WHERE id = ?").get(userId);
        if (!user) throw new Error("User not found");

        let newBalance = user.balance;
        if (type === "withdraw" || type === "send") {
          if (user.balance < amount) throw new Error("Insufficient funds");
          newBalance -= amount;
        } else if (type === "deposit") {
          newBalance += amount;
        } else if (type === "swap") {
          // Simple swap simulation
        }

        db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, userId);
        db.prepare("INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, ?, ?, ?, ?)")
          .run(userId, type, amount, "completed", description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`);

        if (type === "send" && recipientAccount) {
          const recipient = db.prepare("SELECT id, balance FROM users WHERE account_number = ?").get(recipientAccount);
          if (recipient) {
            db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(recipient.balance + amount, recipient.id);
            db.prepare("INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, ?, ?, ?, ?)")
              .run(recipient.id, "receive", amount, "completed", `Received from account ending in ...${recipientAccount.slice(-4)}`);
          }
        }
      })();
      
      const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      res.json(normalizeUser(updatedUser));
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // WebSocket Chat
  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      // Broadcast to all clients (simple for demo)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            ...message,
            timestamp: new Date().toISOString()
          }));
        }
      });
      
      // Save to DB if user_id exists
      if (message.userId) {
        db.prepare("INSERT INTO chat_messages (user_id, sender, message) VALUES (?, ?, ?)").run(message.userId, message.sender, message.text);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
