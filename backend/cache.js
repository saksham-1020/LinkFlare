const { createClient } = require('redis');
const db = require('./db');

let redisClient = null;
let isRedis = false;

// In-Memory fallback cache
const linkCache = new Map();

if (process.env.REDIS_URL || process.env.REDISHOST) {
  isRedis = true;
  const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDISHOST || 'localhost'}:${process.env.REDISPORT || 6379}`;
  redisClient = createClient({ url: redisUrl });
  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  redisClient.connect()
    .then(() => console.log("Redis Client connected successfully."))
    .catch((err) => {
      console.error("Redis Connection failed, falling back to In-Memory Cache.", err);
      isRedis = false;
    });
}

/**
 * Load all active links with user plan details into memory / Redis
 */
async function syncCache() {
  try {
    const activeLinks = await db.all(`
      SELECT l.*, u.plan_type as user_plan_type, u.trial_expires_at as user_trial_expires_at
      FROM links l
      JOIN users u ON l.user_id = u.id
      WHERE l.is_active = 1
    `);
    
    if (isRedis) {
      // Clear legacy keys first
      const keys = await redisClient.keys('link:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      for (const link of activeLinks) {
        const parsedLink = parseLinkRules(link);
        await redisClient.set(`link:${parsedLink.slug}`, JSON.stringify(parsedLink));
      }
      console.log(`Redis cache synced. Cached ${activeLinks.length} active links.`);
    } else {
      linkCache.clear();
      for (const link of activeLinks) {
        const parsedLink = parseLinkRules(link);
        linkCache.set(parsedLink.slug, parsedLink);
      }
      console.log(`In-memory cache synced. Cached ${linkCache.size} active links.`);
    }
  } catch (err) {
    console.error("Failed to sync cache:", err);
  }
}

/**
 * Helper to parse raw JSON strings from DB columns
 */
function parseLinkRules(link) {
  if (!link) return null;
  return {
    ...link,
    geo_blocking: typeof link.geo_blocking === 'string' ? JSON.parse(link.geo_blocking) : link.geo_blocking,
    chameleon_rules: typeof link.chameleon_rules === 'string' ? JSON.parse(link.chameleon_rules) : link.chameleon_rules,
    allowed_brands: typeof link.allowed_brands === 'string' ? JSON.parse(link.allowed_brands) : link.allowed_brands,
    allowed_asns: typeof link.allowed_asns === 'string' ? JSON.parse(link.allowed_asns) : link.allowed_asns,
    language_rules: typeof link.language_rules === 'string' ? JSON.parse(link.language_rules) : link.language_rules,
    browser_rules: typeof link.browser_rules === 'string' ? JSON.parse(link.browser_rules) : link.browser_rules,
    os_rules: typeof link.os_rules === 'string' ? JSON.parse(link.os_rules) : link.os_rules
  };
}

module.exports = {
  syncCache,
  isRedis() { return isRedis; },
  
  /**
   * Get link from cache, fallback to DB if not found
   */
  async get(slug) {
    if (isRedis) {
      try {
        const data = await redisClient.get(`link:${slug}`);
        if (data) return JSON.parse(data);
      } catch (err) {
        console.error("Redis get failed:", err);
      }
    } else {
      if (linkCache.has(slug)) {
        return linkCache.get(slug);
      }
    }
    
    // Fallback: Query database
    const link = await db.get(`
      SELECT l.*, u.plan_type as user_plan_type, u.trial_expires_at as user_trial_expires_at
      FROM links l
      JOIN users u ON l.user_id = u.id
      WHERE l.slug = ? AND l.is_active = 1
    `, [slug]);
    
    if (link) {
      const parsedLink = parseLinkRules(link);
      if (isRedis) {
        try {
          await redisClient.set(`link:${slug}`, JSON.stringify(parsedLink));
        } catch (e) {}
      } else {
        linkCache.set(slug, parsedLink);
      }
      return parsedLink;
    }
    
    return null;
  },
  
  /**
   * Set link in cache
   */
  async set(slug, linkId) {
    const link = await db.get(`
      SELECT l.*, u.plan_type as user_plan_type, u.trial_expires_at as user_trial_expires_at
      FROM links l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `, [linkId]);
    
    if (link && link.is_active === 1) {
      const parsedLink = parseLinkRules(link);
      if (isRedis) {
        try {
          await redisClient.set(`link:${slug}`, JSON.stringify(parsedLink));
        } catch (e) {}
      } else {
        linkCache.set(slug, parsedLink);
      }
    } else {
      if (isRedis) {
        try {
          await redisClient.del(`link:${slug}`);
        } catch (e) {}
      } else {
        linkCache.delete(slug);
      }
    }
  },
  
  /**
   * Delete link from cache
   */
  async delete(slug) {
    if (isRedis) {
      try {
        await redisClient.del(`link:${slug}`);
      } catch (e) {}
    } else {
      linkCache.delete(slug);
    }
  },
  
  /**
   * Update cached click count atomically
   */
  async incrementClicks(slug) {
    if (isRedis) {
      try {
        const data = await redisClient.get(`link:${slug}`);
        if (data) {
          const parsed = JSON.parse(data);
          parsed.click_count = (parsed.click_count || 0) + 1;
          await redisClient.set(`link:${slug}`, JSON.stringify(parsed));
        }
      } catch (err) {
        console.error("Redis increment failed:", err);
      }
    } else {
      const link = linkCache.get(slug);
      if (link) {
        link.click_count = (link.click_count || 0) + 1;
        linkCache.set(slug, link);
      }
    }
  },
  
  /**
   * Evict cache when a user updates their account (to refresh subscription status for all their links)
   */
  async invalidateUserLinks(userId) {
    await syncCache();
  },

  /**
   * Set dynamic verification code / OTP to Redis or local Map
   */
  async setOtp(key, value, expireSeconds = 300) {
    if (isRedis) {
      try {
        await redisClient.set(`otp:${key}`, value, { EX: expireSeconds });
      } catch (e) {}
    } else {
      linkCache.set(`otp:${key}`, { value, expiresAt: Date.now() + expireSeconds * 1000 });
    }
  },

  /**
   * Retrieve verification code / OTP from cache
   */
  async getOtp(key) {
    if (isRedis) {
      try {
        return await redisClient.get(`otp:${key}`);
      } catch (e) {
        return null;
      }
    } else {
      const cached = linkCache.get(`otp:${key}`);
      if (cached) {
        if (Date.now() < cached.expiresAt) {
          return cached.value;
        } else {
          linkCache.delete(`otp:${key}`);
        }
      }
      return null;
    }
  }
};
