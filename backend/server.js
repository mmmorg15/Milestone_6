const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

async function findUserById(userId) {
  const userResult = await pool.query(
    "SELECT id, name, email, email_tips, created_at FROM users WHERE id = $1",
    [userId]
  );
  return userResult.rows[0] || null;
}

async function findMoodIdByCode(moodCode) {
  if (!moodCode) {
    return null;
  }

  const moodResult = await pool.query("SELECT id FROM moods WHERE code = $1", [
    String(moodCode).toLowerCase(),
  ]);

  return moodResult.rows[0]?.id ?? null;
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Database connection failed." });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  const { name = null, email, password, emailTips = false } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const query = `
      INSERT INTO users (name, email, password, email_tips)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, email_tips, created_at
    `;
    const values = [name, email, password, emailTips];
    const result = await pool.query(query, values);

    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const query = `
      SELECT id, name, email, email_tips, created_at
      FROM users
      WHERE email = $1 AND password = $2
    `;
    const result = await pool.query(query, [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Login request failed." });
  }
});

app.post("/api/mood-logs", async (req, res) => {
  const { userId, moodCode, notes = null } = req.body;
  const parsedUserId = Number(userId);

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "A valid userId is required." });
  }

  if (!moodCode) {
    return res.status(400).json({ message: "moodCode is required." });
  }

  try {
    const user = await findUserById(parsedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const moodId = await findMoodIdByCode(moodCode);
    if (!moodId) {
      return res.status(400).json({ message: "Invalid moodCode." });
    }

    const insertQuery = `
      INSERT INTO mood_logs (user_id, mood_id, notes)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, mood_id, notes, logged_at
    `;

    const result = await pool.query(insertQuery, [parsedUserId, moodId, notes]);
    return res.status(201).json({ moodLog: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save mood log." });
  }
});

app.post("/api/journal-entries", async (req, res) => {
  const { userId, content, moodCode = null } = req.body;
  const parsedUserId = Number(userId);

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "A valid userId is required." });
  }

  const trimmedContent = typeof content === "string" ? content.trim() : "";
  if (!trimmedContent) {
    return res.status(400).json({ message: "Journal content is required." });
  }

  try {
    const user = await findUserById(parsedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let moodId = null;
    if (moodCode) {
      moodId = await findMoodIdByCode(moodCode);
      if (!moodId) {
        return res.status(400).json({ message: "Invalid moodCode." });
      }
    }

    const insertQuery = `
      INSERT INTO journal_entries (user_id, mood_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, mood_id, content, created_at, updated_at
    `;

    const result = await pool.query(insertQuery, [parsedUserId, moodId, trimmedContent]);
    return res.status(201).json({ journalEntry: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save journal entry." });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
