const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 3001);
const publicDir = path.join(__dirname, "public");

function normalizeOrigin(origin) {
  return String(origin).trim().replace(/\/+$/, "").toLowerCase();
}

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://is401team09.us-east-2.elasticbeanstalk.com",
  "https://is401team09.us-east-2.elasticbeanstalk.com",
  "http://www.mmmorg15.com",
  "https://www.mmmorg15.com",
];

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
};

app.use(express.json());
app.use("/api", cors(corsOptions));
app.use(express.static(publicDir));

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

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
    console.error("DB health error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
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
    console.error("Signup error:", error);
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
    console.error("Login error:", error);
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

// Mood Logs endpoint with JOIN to include mood code and ordered by logged_at descending, limited to 20 entries
app.get("/api/mood-logs/:userId", async (req, res) => {
  const parsedUserId = Number(req.params.userId);

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "A valid userId is required." });
  }

  try {
    const result = await pool.query(
      `SELECT ml.id, ml.notes, ml.logged_at, m.code AS mood_code
       FROM mood_logs ml
       JOIN moods m ON ml.mood_id = m.id
       WHERE ml.user_id = $1
       ORDER BY ml.logged_at DESC
       LIMIT 20`,
      [parsedUserId]
    );
    return res.json({ moodLogs: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch mood logs." });
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

app.get("/api/journal-entries", async (req, res) => {
  const parsedUserId = Number(req.query.userId);

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "A valid userId query parameter is required." });
  }

  try {
    const user = await findUserById(parsedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const query = `
      SELECT
        je.id,
        je.user_id,
        je.mood_id,
        m.code AS mood_code,
        m.label AS mood_label,
        je.content,
        je.created_at,
        je.updated_at
      FROM journal_entries je
      LEFT JOIN moods m ON je.mood_id = m.id
      WHERE je.user_id = $1
      ORDER BY je.created_at DESC
    `;

    const result = await pool.query(query, [parsedUserId]);
    return res.json({ journalEntries: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load journal entries." });
  }
});

app.put("/api/journal-entries/:entryId", async (req, res) => {
  const parsedEntryId = Number(req.params.entryId);
  const parsedUserId = Number(req.body.userId);
  const { content, moodCode = null } = req.body;

  if (!parsedEntryId || Number.isNaN(parsedEntryId)) {
    return res.status(400).json({ message: "A valid entryId is required." });
  }

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

    const existingEntryResult = await pool.query(
      "SELECT id, user_id FROM journal_entries WHERE id = $1",
      [parsedEntryId]
    );
    const existingEntry = existingEntryResult.rows[0];

    if (!existingEntry) {
      return res.status(404).json({ message: "Journal entry not found." });
    }

    if (existingEntry.user_id !== parsedUserId) {
      return res.status(403).json({ message: "You can only edit your own journal entries." });
    }

    let moodId = null;
    if (moodCode) {
      moodId = await findMoodIdByCode(moodCode);
      if (!moodId) {
        return res.status(400).json({ message: "Invalid moodCode." });
      }
    }

    const updateQuery = `
      UPDATE journal_entries
      SET content = $1,
          mood_id = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, user_id, mood_id, content, created_at, updated_at
    `;

    const updatedResult = await pool.query(updateQuery, [trimmedContent, moodId, parsedEntryId]);
    return res.json({ journalEntry: updatedResult.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update journal entry." });
  }
});

app.delete("/api/journal-entries/:entryId", async (req, res) => {
  const parsedEntryId = Number(req.params.entryId);
  const parsedUserId = Number(req.body?.userId);

  if (!parsedEntryId || Number.isNaN(parsedEntryId)) {
    return res.status(400).json({ message: "A valid entryId is required." });
  }

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    return res.status(400).json({ message: "A valid userId is required." });
  }

  try {
    const user = await findUserById(parsedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingEntryResult = await pool.query(
      "SELECT id, user_id FROM journal_entries WHERE id = $1",
      [parsedEntryId]
    );
    const existingEntry = existingEntryResult.rows[0];

    if (!existingEntry) {
      return res.status(404).json({ message: "Journal entry not found." });
    }

    if (existingEntry.user_id !== parsedUserId) {
      return res.status(403).json({ message: "You can only delete your own journal entries." });
    }

    await pool.query("DELETE FROM journal_entries WHERE id = $1", [parsedEntryId]);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete journal entry." });
  }
});

app.get("/api/okr-stats", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users)::int                                              AS total_users,
        (SELECT COUNT(*) FROM journal_entries)::int                                    AS total_entries,
        (SELECT COUNT(DISTINCT user_id) FROM journal_entries)::int                     AS users_with_entries,
        (SELECT COUNT(DISTINCT user_id)
           FROM journal_entries
          WHERE created_at >= NOW() - INTERVAL '30 days')::int                        AS active_last_30_days,
        (SELECT COUNT(*) FROM journal_entries WHERE mood_id IS NOT NULL)::int          AS entries_with_mood
    `);
    const row = result.rows[0];
    const totalUsers = row.total_users;
    const usersWithEntries = row.users_with_entries;
    return res.json({
      totalUsers,
      totalEntries: row.total_entries,
      usersWithEntries,
      activeLast30Days: row.active_last_30_days,
      entriesWithMood: row.entries_with_mood,
      activationRate: totalUsers > 0 ? Math.round((usersWithEntries / totalUsers) * 100) : 0,
    });
  } catch (error) {
    console.error("OKR stats error:", error);
    return res.status(500).json({ message: "Failed to load OKR stats." });
  }
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/") || path.extname(req.path)) {
    return next();
  }

  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((_req, res) => {
  res.status(404).send("Not found");
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});