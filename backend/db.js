require('dotenv').config();
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let pool = null;
let db = null;
let isPostgres = false;

if (process.env.DATABASE_URL || process.env.PGHOST) {
  isPostgres = true;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')
      ? { rejectUnauthorized: false }
      : false
  });
} else {
  const dbPath = path.join(__dirname, 'linkflare.db');
  db = new sqlite3.Database(dbPath);
}

// Helper to convert "?" placeholders to "$1, $2, $3" for Postgres
function convertSql(sql) {
  if (!isPostgres) return sql;
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

async function run(sql, params = []) {
  if (isPostgres) {
    const res = await pool.query(convertSql(sql), params);
    return { id: (res.rows[0] && res.rows[0].id) || null, changes: res.rowCount };
  } else {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
}

async function get(sql, params = []) {
  if (isPostgres) {
    const res = await pool.query(convertSql(sql), params);
    return res.rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

async function all(sql, params = []) {
  if (isPostgres) {
    const res = await pool.query(convertSql(sql), params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

// Initialize tables
async function initDb() {
  if (isPostgres) {
    // ----------------------------------------------------
    // POSTGRESQL SCHEMA INITIALIZATION
    // ----------------------------------------------------
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        plan_type VARCHAR(50) DEFAULT 'free_trial',
        trial_expires_at TIMESTAMP NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS links (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        slug VARCHAR(255) UNIQUE NOT NULL,
        destination_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        geo_blocking TEXT DEFAULT NULL,
        vpn_blocking INTEGER DEFAULT 0,
        password_hash TEXT DEFAULT NULL,
        click_cap INTEGER DEFAULT NULL,
        click_count INTEGER DEFAULT 0,
        fallback_url TEXT DEFAULT NULL,
        whatsapp_verify INTEGER DEFAULT 0,
        time_bomb_start TIMESTAMP DEFAULT NULL,
        time_bomb_end TIMESTAMP DEFAULT NULL,
        chameleon_rules TEXT DEFAULT NULL,
        allowed_brands TEXT DEFAULT NULL,
        is_monetized INTEGER DEFAULT 0,
        allowed_asns TEXT DEFAULT NULL,
        tags TEXT DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        folder TEXT DEFAULT NULL,
        utm_params TEXT DEFAULT NULL,
        deep_links TEXT DEFAULT NULL,
        ab_variants TEXT DEFAULT NULL,
        weighted_routes TEXT DEFAULT NULL,
        is_favorite INTEGER DEFAULT 0,
        is_archived INTEGER DEFAULT 0,
        is_maintenance INTEGER DEFAULT 0,
        is_preview INTEGER DEFAULT 0,
        language_rules TEXT DEFAULT NULL,
        browser_rules TEXT DEFAULT NULL,
        os_rules TEXT DEFAULT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS clicks_log (
        id SERIAL PRIMARY KEY,
        link_id VARCHAR(255) NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(255),
        country VARCHAR(50),
        user_agent TEXT,
        device_type VARCHAR(100),
        device_brand VARCHAR(100),
        is_vpn INTEGER DEFAULT 0,
        is_bot INTEGER DEFAULT 0,
        status VARCHAR(100) NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS whatsapp_sessions (
        session_id VARCHAR(255) PRIMARY KEY,
        link_id VARCHAR(255) NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        phone VARCHAR(50) DEFAULT NULL,
        is_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS domains (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        domain VARCHAR(255) NOT NULL,
        verified INTEGER DEFAULT 0,
        dns_status VARCHAR(100) DEFAULT 'pending',
        ssl_status VARCHAR(100) DEFAULT 'pending',
        health VARCHAR(100) DEFAULT 'unknown',
        edge_region VARCHAR(100) DEFAULT 'auto',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        target VARCHAR(255),
        details TEXT,
        ip_address VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        key VARCHAR(255) PRIMARY KEY,
        enabled INTEGER DEFAULT 1,
        description TEXT
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        device VARCHAR(255),
        browser VARCHAR(255),
        ip_address VARCHAR(255),
        is_trusted INTEGER DEFAULT 0,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("PostgreSQL Database tables initialized successfully.");
  } else {
    // ----------------------------------------------------
    // SQLITE SCHEMA INITIALIZATION
    // ----------------------------------------------------
    await run("PRAGMA foreign_keys = ON;");

    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        plan_type TEXT DEFAULT 'free_trial',
        trial_expires_at DATETIME NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        destination_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        geo_blocking TEXT DEFAULT NULL,
        vpn_blocking INTEGER DEFAULT 0,
        password_hash TEXT DEFAULT NULL,
        click_cap INTEGER DEFAULT NULL,
        click_count INTEGER DEFAULT 0,
        fallback_url TEXT DEFAULT NULL,
        whatsapp_verify INTEGER DEFAULT 0,
        time_bomb_start DATETIME DEFAULT NULL,
        time_bomb_end DATETIME DEFAULT NULL,
        chameleon_rules TEXT DEFAULT NULL,
        allowed_brands TEXT DEFAULT NULL,
        is_monetized INTEGER DEFAULT 0,
        allowed_asns TEXT DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS clicks_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        country TEXT,
        user_agent TEXT,
        device_type TEXT,
        device_brand TEXT,
        is_vpn INTEGER DEFAULT 0,
        is_bot INTEGER DEFAULT 0,
        status TEXT NOT NULL,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS whatsapp_sessions (
        session_id TEXT PRIMARY KEY,
        link_id TEXT NOT NULL,
        phone TEXT DEFAULT NULL,
        is_verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS domains (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        domain TEXT NOT NULL,
        verified INTEGER DEFAULT 0,
        dns_status TEXT DEFAULT 'pending',
        ssl_status TEXT DEFAULT 'pending',
        health TEXT DEFAULT 'unknown',
        edge_region TEXT DEFAULT 'auto',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        action TEXT NOT NULL,
        target TEXT,
        details TEXT,
        ip_address TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        key TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 1,
        description TEXT
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        device TEXT,
        browser TEXT,
        ip_address TEXT,
        is_trusted INTEGER DEFAULT 0,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Add new columns to links table (silently fail if already exist)
    const newLinkColumns = [
      { name: 'tags', type: 'TEXT DEFAULT NULL' },
      { name: 'notes', type: 'TEXT DEFAULT NULL' },
      { name: 'folder', type: 'TEXT DEFAULT NULL' },
      { name: 'utm_params', type: 'TEXT DEFAULT NULL' },
      { name: 'deep_links', type: 'TEXT DEFAULT NULL' },
      { name: 'ab_variants', type: 'TEXT DEFAULT NULL' },
      { name: 'weighted_routes', type: 'TEXT DEFAULT NULL' },
      { name: 'is_favorite', type: 'INTEGER DEFAULT 0' },
      { name: 'is_archived', type: 'INTEGER DEFAULT 0' },
      { name: 'is_maintenance', type: 'INTEGER DEFAULT 0' },
      { name: 'is_preview', type: 'INTEGER DEFAULT 0' },
      { name: 'language_rules', type: 'TEXT DEFAULT NULL' },
      { name: 'browser_rules', type: 'TEXT DEFAULT NULL' },
      { name: 'os_rules', type: 'TEXT DEFAULT NULL' }
    ];
    for (const col of newLinkColumns) {
      try {
        await run(`ALTER TABLE links ADD COLUMN ${col.name} ${col.type}`);
      } catch (e) {
        // Column already exists, ignore
      }
    }

    console.log("SQLite Database tables initialized successfully.");
  }

  // Seed developer user
  try {
    const trialExpires = new Date();
    trialExpires.setDate(trialExpires.getDate() + 365);
    const sql = isPostgres
      ? "INSERT INTO users (id, email, name, picture, plan_type, trial_expires_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING"
      : "INSERT OR IGNORE INTO users (id, email, name, picture, plan_type, trial_expires_at) VALUES (?, ?, ?, ?, ?, ?)";
    await run(sql, ['usr_dev_global', 'developer@linkflare.in', 'Developer User', 'https://lh3.googleusercontent.com/a/default-user', 'premium', trialExpires.toISOString()]);
  } catch (err) {
    console.error("Failed to seed developer user:", err);
  }
}

module.exports = {
  db,
  initDb,
  run,
  get,
  all,
  isPostgres() { return isPostgres; },
  
  // User operations
  async syncUser(profile) {
    const existing = await get("SELECT * FROM users WHERE id = ?", [profile.id]);
    if (existing) {
      await run(
        "UPDATE users SET name = ?, picture = ? WHERE id = ?",
        [profile.name, profile.picture, profile.id]
      );
      return await get("SELECT * FROM users WHERE id = ?", [profile.id]);
    } else {
      // 7 days trial
      const trialExpires = new Date();
      trialExpires.setDate(trialExpires.getDate() + 7);
      const trialExpiresStr = trialExpires.toISOString();

      await run(
        "INSERT INTO users (id, email, name, picture, trial_expires_at) VALUES (?, ?, ?, ?, ?)",
        [profile.id, profile.email, profile.name, profile.picture, trialExpiresStr]
      );
      return await get("SELECT * FROM users WHERE id = ?", [profile.id]);
    }
  },

  async getUser(id) {
    return await get("SELECT * FROM users WHERE id = ?", [id]);
  },

  async updateUserPlan(userId, planType, trialExpiresAt) {
    return await run(
      "UPDATE users SET plan_type = ?, trial_expires_at = ? WHERE id = ?",
      [planType, trialExpiresAt, userId]
    );
  },

  // Link operations
  async createLink(link) {
    return await run(
      `INSERT INTO links (
        id, user_id, slug, destination_url, is_active, 
        geo_blocking, vpn_blocking, password_hash, click_cap, 
        fallback_url, whatsapp_verify, time_bomb_start, time_bomb_end, 
        chameleon_rules, allowed_brands, is_monetized, allowed_asns,
        tags, notes, folder, utm_params, deep_links, ab_variants,
        weighted_routes, is_favorite, is_archived, is_maintenance,
        is_preview, language_rules, browser_rules, os_rules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        link.id, link.user_id, link.slug, link.destination_url, link.is_active || 1,
        link.geo_blocking || null, link.vpn_blocking || 0, link.password_hash || null, link.click_cap || null,
        link.fallback_url || null, link.whatsapp_verify || 0, link.time_bomb_start || null, link.time_bomb_end || null,
        link.chameleon_rules || null, link.allowed_brands || null, link.is_monetized || 0, link.allowed_asns || null,
        link.tags || null, link.notes || null, link.folder || null, link.utm_params || null,
        link.deep_links || null, link.ab_variants || null, link.weighted_routes || null,
        link.is_favorite || 0, link.is_archived || 0, link.is_maintenance || 0,
        link.is_preview || 0, link.language_rules || null, link.browser_rules || null, link.os_rules || null
      ]
    );
  },

  async getLink(id) {
    return await get("SELECT * FROM links WHERE id = ?", [id]);
  },

  async getLinkBySlug(slug) {
    return await get("SELECT * FROM links WHERE slug = ?", [slug]);
  },

  async getLinksByUser(userId) {
    return await all("SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  },

  async updateLink(id, link) {
    return await run(
      `UPDATE links SET 
        destination_url = ?, is_active = ?, geo_blocking = ?, 
        vpn_blocking = ?, password_hash = ?, click_cap = ?, 
        fallback_url = ?, whatsapp_verify = ?, time_bomb_start = ?, 
        time_bomb_end = ?, chameleon_rules = ?, allowed_brands = ?, 
        is_monetized = ?, allowed_asns = ?,
        tags = ?, notes = ?, folder = ?, utm_params = ?,
        deep_links = ?, ab_variants = ?, weighted_routes = ?,
        is_favorite = ?, is_archived = ?, is_maintenance = ?,
        is_preview = ?, language_rules = ?, browser_rules = ?, os_rules = ?
      WHERE id = ?`,
      [
        link.destination_url, link.is_active, link.geo_blocking,
        link.vpn_blocking, link.password_hash, link.click_cap,
        link.fallback_url, link.whatsapp_verify, link.time_bomb_start,
        link.time_bomb_end, link.chameleon_rules, link.allowed_brands,
        link.is_monetized, link.allowed_asns,
        link.tags, link.notes, link.folder, link.utm_params,
        link.deep_links, link.ab_variants, link.weighted_routes,
        link.is_favorite, link.is_archived, link.is_maintenance,
        link.is_preview, link.language_rules, link.browser_rules, link.os_rules,
        id
      ]
    );
  },

  async deleteLink(id, userId) {
    return await run("DELETE FROM links WHERE id = ? AND user_id = ?", [id, userId]);
  },

  async incrementClickCount(id) {
    return await run("UPDATE links SET click_count = click_count + 1 WHERE id = ?", [id]);
  },

  // Click logs
  async logClick(log) {
    return await run(
      `INSERT INTO clicks_log (
        link_id, ip_address, country, user_agent, 
        device_type, device_brand, is_vpn, is_bot, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.link_id, log.ip_address, log.country, log.user_agent,
        log.device_type, log.device_brand, log.is_vpn, log.is_bot, log.status
      ]
    );
  },

  async getLogsByUser(userId, limit = 100, rangeVal = '30d') {
    let dateFilter = '';
    if (rangeVal === 'today') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE "
        : " AND c.timestamp >= date('now', 'start of day') ";
    } else if (rangeVal === 'yesterday') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '1 day' AND c.timestamp < CURRENT_DATE "
        : " AND c.timestamp >= date('now', '-1 day', 'start of day') AND c.timestamp < date('now', 'start of day') ";
    } else if (rangeVal === '7d') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '7 days' "
        : " AND c.timestamp >= date('now', '-7 days') ";
    } else if (rangeVal === '30d') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '30 days' "
        : " AND c.timestamp >= date('now', '-30 days') ";
    }

    return await all(`
      SELECT c.*, l.slug, l.destination_url 
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? ${dateFilter}
      ORDER BY c.timestamp DESC
      LIMIT ?
    `, [userId, limit]);
  },

  async getAnalytics(userId, rangeVal = '30d') {
    let dateFilter = '';
    if (rangeVal === 'today') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE "
        : " AND c.timestamp >= date('now', 'start of day') ";
    } else if (rangeVal === 'yesterday') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '1 day' AND c.timestamp < CURRENT_DATE "
        : " AND c.timestamp >= date('now', '-1 day', 'start of day') AND c.timestamp < date('now', 'start of day') ";
    } else if (rangeVal === '7d') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '7 days' "
        : " AND c.timestamp >= date('now', '-7 days') ";
    } else if (rangeVal === '30d') {
      dateFilter = isPostgres
        ? " AND c.timestamp >= CURRENT_DATE - INTERVAL '30 days' "
        : " AND c.timestamp >= date('now', '-30 days') ";
    }

    // Total clicks
    const totalClicksRow = await get(`
      SELECT COUNT(*) as count 
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? ${dateFilter}
    `, [userId]);

    // Allowed clicks
    const allowedRow = await get(`
      SELECT COUNT(*) as count 
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.status = 'ALLOWED' ${dateFilter}
    `, [userId]);

    // Blocked threats
    const blockedRow = await get(`
      SELECT COUNT(*) as count 
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.status LIKE 'BLOCKED_%' ${dateFilter}
    `, [userId]);

    // Breakdown of blocks
    const blocksBreakdown = await all(`
      SELECT c.status, COUNT(*) as count
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.status LIKE 'BLOCKED_%' ${dateFilter}
      GROUP BY c.status
    `, [userId]);

    // Geographic distribution
    const geoDistribution = await all(`
      SELECT c.country, COUNT(*) as count
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? ${dateFilter}
      GROUP BY c.country
      ORDER BY count DESC
      LIMIT 10
    `, [userId]);

    // Device distribution
    const deviceDistribution = await all(`
      SELECT c.device_type, COUNT(*) as count
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? ${dateFilter}
      GROUP BY c.device_type
    `, [userId]);

    // Brand distribution
    const brandDistribution = await all(`
      SELECT c.device_brand, COUNT(*) as count
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.device_brand IS NOT NULL AND c.device_brand != '' ${dateFilter}
      GROUP BY c.device_brand
      ORDER BY count DESC
      LIMIT 10
    `, [userId]);

    // Daily threat trends (past 7 days)
    const dailyTrendsSql = isPostgres ? `
      SELECT (c.timestamp::date)::text as date,
             SUM(CASE WHEN c.status = 'ALLOWED' THEN 1 ELSE 0 END) as allowed,
             SUM(CASE WHEN c.status LIKE 'BLOCKED_%' THEN 1 ELSE 0 END) as blocked
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY c.timestamp::date
      ORDER BY date ASC
    ` : `
      SELECT DATE(c.timestamp) as date,
             SUM(CASE WHEN c.status = 'ALLOWED' THEN 1 ELSE 0 END) as allowed,
             SUM(CASE WHEN c.status LIKE 'BLOCKED_%' THEN 1 ELSE 0 END) as blocked
      FROM clicks_log c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ? AND c.timestamp >= date('now', '-7 days')
      GROUP BY DATE(c.timestamp)
      ORDER BY date ASC
    `;
    const dailyTrends = await all(dailyTrendsSql, [userId]);

    return {
      totalClicks: totalClicksRow.count || 0,
      allowedClicks: allowedRow.count || 0,
      blockedThreats: blockedRow.count || 0,
      blocksBreakdown,
      geoDistribution,
      deviceDistribution,
      brandDistribution,
      dailyTrends
    };
  },

  // Settings
  async getSetting(key) {
    const row = await get("SELECT value FROM settings WHERE key = ?", [key]);
    return row ? row.value : null;
  },

  async setSetting(key, value) {
    const sql = isPostgres
      ? "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value"
      : "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value";
    return await run(sql, [key, value]);
  },

  // WhatsApp Verification
  async createWhatsAppSession(sessionId, linkId) {
    return await run(
      "INSERT INTO whatsapp_sessions (session_id, link_id, is_verified) VALUES (?, ?, 0)",
      [sessionId, linkId]
    );
  },

  async getWhatsAppSession(sessionId) {
    return await get("SELECT * FROM whatsapp_sessions WHERE session_id = ?", [sessionId]);
  },

  async verifyWhatsAppSession(sessionId, phone) {
    return await run(
      "UPDATE whatsapp_sessions SET is_verified = 1, phone = ? WHERE session_id = ?",
      [phone, sessionId]
    );
  },

  // Audit Logs
  async logAudit(userId, action, target, details, ip) {
    return await run(
      "INSERT INTO audit_logs (user_id, action, target, details, ip_address) VALUES (?, ?, ?, ?, ?)",
      [userId, action, target, details || null, ip || null]
    );
  },

  async getAuditLogs(userId, limit = 50) {
    return await all(
      "SELECT * FROM audit_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
      [userId, limit]
    );
  },

  // Domain operations
  async getDomainsByUser(userId) {
    return await all("SELECT * FROM domains WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  },

  async createDomain(domain) {
    return await run(
      `INSERT INTO domains (id, user_id, domain, verified, dns_status, ssl_status, health, edge_region)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        domain.id, domain.user_id, domain.domain,
        domain.verified || 0, domain.dns_status || 'pending',
        domain.ssl_status || 'pending', domain.health || 'unknown',
        domain.edge_region || 'auto'
      ]
    );
  },

  async updateDomainStatus(id, updates) {
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(id);
    return await run(`UPDATE domains SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  // Feature Flags
  async getFeatureFlags() {
    return await all("SELECT * FROM feature_flags");
  },

  async setFeatureFlag(key, enabled, description) {
    const sql = isPostgres
      ? `INSERT INTO feature_flags (key, enabled, description) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET enabled = EXCLUDED.enabled, description = COALESCE(EXCLUDED.description, feature_flags.description)`
      : `INSERT INTO feature_flags (key, enabled, description) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET enabled = excluded.enabled, description = COALESCE(excluded.description, feature_flags.description)`;
    return await run(sql, [key, enabled, description || null]);
  },

  // Session management
  async getUserSessions(userId) {
    return await all("SELECT * FROM sessions WHERE user_id = ? ORDER BY last_active DESC", [userId]);
  },

  async createSession(session) {
    return await run(
      `INSERT INTO sessions (id, user_id, device, browser, ip_address, is_trusted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        session.id, session.user_id, session.device || null,
        session.browser || null, session.ip_address || null,
        session.is_trusted || 0
      ]
    );
  },

  async deleteSession(id) {
    return await run("DELETE FROM sessions WHERE id = ?", [id]);
  },

  // Duplicate link
  async duplicateLink(linkId, userId) {
    const original = await get("SELECT * FROM links WHERE id = ? AND user_id = ?", [linkId, userId]);
    if (!original) return null;

    const newId = 'lnk_' + Math.random().toString(36).substring(2, 11);
    const newSlug = original.slug + '-copy';

    // Check slug collision and append random suffix if needed
    const existingSlug = await get("SELECT id FROM links WHERE slug = ?", [newSlug]);
    const finalSlug = existingSlug ? newSlug + '-' + Math.random().toString(36).substring(2, 6) : newSlug;

    const clone = { ...original, id: newId, slug: finalSlug, click_count: 0 };
    await run(
      `INSERT INTO links (
        id, user_id, slug, destination_url, is_active,
        geo_blocking, vpn_blocking, password_hash, click_cap,
        fallback_url, whatsapp_verify, time_bomb_start, time_bomb_end,
        chameleon_rules, allowed_brands, is_monetized, allowed_asns,
        tags, notes, folder, utm_params, deep_links, ab_variants,
        weighted_routes, is_favorite, is_archived, is_maintenance,
        is_preview, language_rules, browser_rules, os_rules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clone.id, clone.user_id, clone.slug, clone.destination_url, clone.is_active,
        clone.geo_blocking, clone.vpn_blocking, clone.password_hash, clone.click_cap,
        clone.fallback_url, clone.whatsapp_verify, clone.time_bomb_start, clone.time_bomb_end,
        clone.chameleon_rules, clone.allowed_brands, clone.is_monetized, clone.allowed_asns,
        clone.tags || null, clone.notes || null, clone.folder || null, clone.utm_params || null,
        clone.deep_links || null, clone.ab_variants || null, clone.weighted_routes || null,
        clone.is_favorite || 0, clone.is_archived || 0, clone.is_maintenance || 0,
        clone.is_preview || 0, clone.language_rules || null, clone.browser_rules || null, clone.os_rules || null
      ]
    );

    return await get("SELECT * FROM links WHERE id = ?", [newId]);
  }
};
