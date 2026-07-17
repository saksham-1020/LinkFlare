const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const db = require('./db');

// In-memory cache for IP lookup fallbacks (to prevent API spam on localhost)
const localIpCache = new Map();
const linkFingerprints = new Map(); // link_id -> locked_fingerprint md5

/**
 * Core Firewall Rules Engine
 * Evaluates request headers, IP, and user-agent against the link rules.
 * Returns { allowed: boolean, status: string, redirectUrl: string|null }
 */
async function evaluateFirewall(link, req) {
  const clientInfo = await getClientInfo(req);

  // AI Intent Firewall & Risk Assessment
  let riskScore = 0;
  if (clientInfo.isBot) riskScore += 40;
  if (clientInfo.isVpn) riskScore += 30;
  const ispUpperStr = (clientInfo.isp || '').toUpperCase();
  const dcKeywords = ['AMAZON', 'GOOGLE', 'DIGITALOCEAN', 'HETZNER', 'LINODE', 'OVH', 'MICROSOFT', 'DATACENTER'];
  if (dcKeywords.some(dc => ispUpperStr.includes(dc))) riskScore += 20;
  if (!clientInfo.userAgent || clientInfo.userAgent.length < 15) riskScore += 15;

  let aiShieldEnabled = false;
  if (link.chameleon_rules) {
    try {
      const parsed = typeof link.chameleon_rules === 'string' ? JSON.parse(link.chameleon_rules) : link.chameleon_rules;
      if (parsed && parsed.is_ai_shield) {
        aiShieldEnabled = true;
      }
    } catch(e) {}
  }

  // Self-Evolving / Dynamic Threat Escalation
  if (aiShieldEnabled) {
    if (riskScore >= 70) {
      return { allowed: false, status: 'BLOCKED_AI_RISK', riskScore, clientInfo };
    } else if (riskScore >= 35) {
      // Elevate protection: Require Challenge
      return { allowed: true, status: 'CHALLENGE_REQUIRED', riskScore, clientInfo };
    }
  }

  // 1. Subscription Check (7-Day Trial Lockout)
  if (link.user_plan_type === 'free_trial') {
    const expiry = new Date(link.user_trial_expires_at);
    if (expiry < new Date()) {
      return { allowed: false, status: 'BLOCKED_TRIAL_EXPIRED', clientInfo };
    }
  }

  // 1b. Maintenance Mode Check
  if (link.is_maintenance === 1) {
    return { allowed: false, status: 'BLOCKED_MAINTENANCE', clientInfo };
  }

  // 1c. Preview Mode Check
  if (link.is_preview === 1) {
    return { allowed: false, status: 'SHOW_PREVIEW', clientInfo };
  }

  // 2. Click Cap Check
  if (link.click_cap !== null && link.click_count >= link.click_cap) {
    return {
      allowed: false,
      status: 'BLOCKED_CAP',
      redirectUrl: link.fallback_url || link.destination_url,
      clientInfo
    };
  }

  // 3. Time-Bomb Check
  const now = new Date();
  if (link.time_bomb_start) {
    const start = new Date(link.time_bomb_start);
    if (now < start) return { allowed: false, status: 'BLOCKED_TIME', clientInfo };
  }
  if (link.time_bomb_end) {
    const end = new Date(link.time_bomb_end);
    if (now > end) return { allowed: false, status: 'BLOCKED_TIME', clientInfo };
  }

  // 4. Bot / Automation Detection
  if (clientInfo.isBot) {
    return { allowed: false, status: 'BLOCKED_BOT', clientInfo };
  }

  // 5. Geo-Blocking Check
  if (link.geo_blocking && link.geo_blocking.length > 0) {
    // If client country is not in the allowed list
    const isAllowedCountry = link.geo_blocking.some(
      country => country.toUpperCase() === clientInfo.country.toUpperCase()
    );
    if (!isAllowedCountry) {
      return { allowed: false, status: 'BLOCKED_GEO', clientInfo };
    }
  }

  // 6. VPN / Proxy Check
  if (link.vpn_blocking === 1 && clientInfo.isVpn) {
    return { allowed: false, status: 'BLOCKED_VPN', clientInfo };
  }

  // 7. ASN / Network Check
  if (link.allowed_asns && link.allowed_asns.length > 0) {
    const asnStr = clientInfo.asn ? String(clientInfo.asn).toUpperCase() : '';
    const isAllowedAsn = link.allowed_asns.some(
      asn => String(asn).toUpperCase() === asnStr || asnStr.includes(String(asn).toUpperCase())
    );
    if (!isAllowedAsn) {
      return { allowed: false, status: 'BLOCKED_ASN', clientInfo };
    }
  }

  // 8. Device Brand / Hardware Fingerprint Check
  if (link.allowed_brands && link.allowed_brands.length > 0) {
    const brandStr = clientInfo.deviceBrand ? clientInfo.deviceBrand.toUpperCase() : 'UNKNOWN';
    const isAllowedBrand = link.allowed_brands.some(
      brand => brandStr.includes(brand.toUpperCase()) || brand.toUpperCase().includes(brandStr)
    );
    if (!isAllowedBrand) {
      return { allowed: false, status: 'BLOCKED_BRAND', clientInfo };
    }
  }

  // 9. Device Fingerprint / Share Lock
  const crypto = require('crypto');
  const userAgentStr = clientInfo.userAgent || '';
  const fingerprint = crypto.createHash('md5').update(userAgentStr + clientInfo.deviceType + clientInfo.country).digest('hex');

  // Automatically lock device if any geo or vpn restrictions are active
  // if (link.vpn_blocking === 1 || (link.geo_blocking && link.geo_blocking.length > 0)) {
  //   if (!linkFingerprints.has(link.id)) {
  //     linkFingerprints.set(link.id, fingerprint);
  //   } else {
  //     const lockedFingerprint = linkFingerprints.get(link.id);
  //     if (lockedFingerprint !== fingerprint) {
  //       return { allowed: false, status: 'BLOCKED_FINGERPRINT_MISMATCH', clientInfo };
  //     }
  //   }
  // }



  const parseRules = (val) => {
    if (!val) return [];
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return String(val).split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  // 9b. Browser Rules Check
  if (link.browser_rules) {
    const allowedBrowsers = parseRules(link.browser_rules);
    if (allowedBrowsers.length > 0) {
      const clientBrowser = clientInfo.browser ? clientInfo.browser.toUpperCase() : '';
      const isAllowedBrowser = allowedBrowsers.some(
        b => clientBrowser.includes(b.toUpperCase()) || b.toUpperCase().includes(clientBrowser)
      );
      if (!isAllowedBrowser) {
        return { allowed: false, status: 'BLOCKED_BROWSER', clientInfo };
      }
    }
  }

  // 9c. OS Rules Check
  if (link.os_rules) {
    const allowedOs = parseRules(link.os_rules);
    if (allowedOs.length > 0) {
      const clientOs = clientInfo.os ? clientInfo.os.toUpperCase() : '';
      const isAllowedOs = allowedOs.some(
        o => clientOs.includes(o.toUpperCase()) || o.toUpperCase().includes(clientOs)
      );
      if (!isAllowedOs) {
        return { allowed: false, status: 'BLOCKED_OS', clientInfo };
      }
    }
  }

  // 9d. Language Rules Check
  if (link.language_rules) {
    const allowedLanguages = parseRules(link.language_rules);
    if (allowedLanguages.length > 0) {
      const clientLang = clientInfo.language ? clientInfo.language.toUpperCase() : '';
      const isAllowedLang = allowedLanguages.some(
        l => clientLang.includes(l.toUpperCase()) || l.toUpperCase().includes(clientLang)
      );
      if (!isAllowedLang) {
        return { allowed: false, status: 'BLOCKED_LANGUAGE', clientInfo };
      }
    }
  }

  // 10. Advanced Programmable Rules Engine
  let targetUrl = link.destination_url;
  if (link.chameleon_rules) {
    try {
      const parsed = typeof link.chameleon_rules === 'string' ? JSON.parse(link.chameleon_rules) : link.chameleon_rules;
      const rules = parsed.rules || (Array.isArray(parsed) ? parsed : []);
      if (Array.isArray(rules)) {
        for (const rule of rules) {
          let ruleMatches = false;

          if (rule.if) {
            // Programmable format: IF conditions THEN target
            const conditions = rule.if;
            let matchCount = 0;
            let totalConditions = 0;

            if (conditions.country) {
              totalConditions++;
              if (clientInfo.country.toUpperCase() === conditions.country.toUpperCase()) matchCount++;
            }
            if (conditions.city) {
              totalConditions++;
              const clientCity = clientInfo.city ? clientInfo.city.toUpperCase() : '';
              if (clientCity.includes(conditions.city.toUpperCase()) || conditions.city.toUpperCase().includes(clientCity)) matchCount++;
            }
            if (conditions.device) {
              totalConditions++;
              if (clientInfo.deviceType.toUpperCase() === conditions.device.toUpperCase()) matchCount++;
            }
            if (conditions.vpn !== undefined) {
              totalConditions++;
              const expectedVpn = conditions.vpn === true || conditions.vpn === 'true';
              if (clientInfo.isVpn === expectedVpn) matchCount++;
            }
            if (conditions.bot !== undefined) {
              totalConditions++;
              const expectedBot = conditions.bot === true || conditions.bot === 'true';
              if (clientInfo.isBot === expectedBot) matchCount++;
            }

            if (totalConditions > 0 && matchCount === totalConditions) {
              ruleMatches = true;
            }
          } else {
            // Legacy / Standard format
            if (rule.type === 'device' && rule.value) {
              ruleMatches = clientInfo.deviceType.toUpperCase() === rule.value.toUpperCase();
            } else if (rule.type === 'country' && rule.value) {
              ruleMatches = clientInfo.country.toUpperCase() === rule.value.toUpperCase();
            } else if (rule.type === 'city' && rule.value) {
              const clientCity = clientInfo.city ? clientInfo.city.toUpperCase() : '';
              ruleMatches = clientCity.includes(rule.value.toUpperCase()) || rule.value.toUpperCase().includes(clientCity);
            } else if (rule.type === 'time' && rule.value) {
              const [startStr, endStr] = rule.value.split('-');
              const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
              ruleMatches = currentHourMin >= startStr && currentHourMin <= endStr;
            }
          }

          if (ruleMatches) {
            const target = rule.then || rule.target_url;
            if (target === 'block') {
              return { allowed: false, status: 'BLOCKED_BY_RULE', clientInfo };
            } else if (target) {
              targetUrl = target;
              break; // Stop evaluating on first match
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to evaluate rules engine:", e);
    }
  }

  // 11. A/B Testing & Weighted Routing
  let statusText = 'ALLOWED';
  if (link.weighted_routes) {
    try {
      const routes = typeof link.weighted_routes === 'string' ? JSON.parse(link.weighted_routes) : link.weighted_routes;
      if (Array.isArray(routes) && routes.length > 0) {
        const totalWeight = routes.reduce((sum, r) => sum + (parseInt(r.weight) || 0), 0);
        if (totalWeight > 0) {
          const randomVal = Math.random() * totalWeight;
          let accum = 0;
          for (const route of routes) {
            accum += parseInt(route.weight) || 0;
            if (randomVal <= accum) {
              targetUrl = route.url;
              statusText = `ALLOWED (Weighted: ${route.weight}%)`;
              break;
            }
          }
        }
      }
    } catch (e) {
      console.error("Weighted routing evaluation error:", e);
    }
  } else if (targetUrl && targetUrl.includes(',')) {
    const urls = targetUrl.split(',');
    const randomVal = Math.random();
    if (randomVal < 0.5) {
      targetUrl = urls[0].trim();
      statusText = 'ALLOWED (Variant A)';
    } else {
      targetUrl = urls[1].trim();
      statusText = 'ALLOWED (Variant B)';
    }
  }

  return {
    allowed: true,
    status: statusText,
    redirectUrl: targetUrl,
    clientInfo,
    riskScore
  };
}

/**
 * Extracts and analyzes client request headers to determine IP, Country, VPN, Bot, and Device Fingerprint
 */
async function getClientInfo(req) {
  const headers = req.headers;
  
  // Extract client IP (handle Cloudflare & proxies)
  let ip = headers['cf-connecting-ip'] || 
           headers['x-forwarded-for'] || 
           req.socket.remoteAddress || 
           '127.0.0.1';
  
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // Handle localhost lookup mapping (for local tests)
  let lookupIp = ip;
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    // If local request, allow header simulation
    lookupIp = headers['x-simulate-ip'] || '49.36.0.1'; // Default simulate an Indian IP (Jio)
  }

  // 1. GeoIP Check (Offline lookup)
  let country = 'US'; // Fallback
  let city = 'Indore'; // Simulation fallback for localhost
  const geo = geoip.lookup(lookupIp);
  if (geo) {
    country = geo.country;
    city = geo.city || '';
  }

  // Allow header override for testing
  if (headers['x-simulate-city']) {
    city = headers['x-simulate-city'];
  }

  // 2. Hardware / User-Agent Fingerprint
  const userAgent = headers['user-agent'] || '';
  const parser = new UAParser(userAgent);
  const uaResult = parser.getResult();

  const deviceType = uaResult.device.type || 'desktop'; // desktop, mobile, tablet, console, smarttv, wearable
  let deviceBrand = uaResult.device.vendor || ''; // Apple, Samsung, Huawei, Sony, Xbox, LG, Tesla etc.
  
  // Custom parsing for special systems like Tesla
  if (userAgent.toLowerCase().includes('tesla')) {
    deviceBrand = 'Tesla';
  } else if (userAgent.toLowerCase().includes('playstation') || userAgent.toLowerCase().includes('playstation 5')) {
    deviceBrand = 'Sony';
  } else if (userAgent.toLowerCase().includes('xbox')) {
    deviceBrand = 'Microsoft';
  }

  // 3. Bot Detection
  const botUserAgents = [
    'headlesschrome', 'puppeteer', 'selenium', 'playwright', 
    'bot', 'crawler', 'spider', 'googlebot', 'yandexbot', 
    'bingbot', 'baidu', 'facebookexternalhit', 'python-requests', 
    'curl', 'wget', 'postman'
  ];
  let isBot = botUserAgents.some(b => userAgent.toLowerCase().includes(b));
  
  // Check common automation flags
  if (headers['webdriver'] || headers['x-automation'] || req.query.is_bot === 'true') {
    isBot = true;
  }

  // 4. ASN and ISP Network (Cloudflare-first, local-simulate second, API lookup third)
  let asn = headers['cf-ipasn'] || '';
  let isp = headers['cf-as-organization'] || '';

  // Simulation overlays for localhost testing
  if (headers['x-simulate-asn']) {
    asn = headers['x-simulate-asn'];
  }
  if (headers['x-simulate-isp']) {
    isp = headers['x-simulate-isp'];
  }

  // Real offline / cached API ASN checking fallback for localhost developer runs
  if (!asn && lookupIp && lookupIp !== '127.0.0.1') {
    if (localIpCache.has(lookupIp)) {
      const cached = localIpCache.get(lookupIp);
      asn = cached.asn;
      isp = cached.isp;
    } else {
      try {
        // Quick, non-blocking fetch from ip-api with a short timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        
        const response = await fetch(`http://ip-api.com/json/${lookupIp}?fields=status,as,org`, { signal: controller.signal });
        clearTimeout(timeout);
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            const parts = (data.as || '').split(' ');
            asn = parts[0] || '';
            isp = data.org || '';
            localIpCache.set(lookupIp, { asn, isp });
          }
        }
      } catch (err) {
        // Silent catch, API down or timeout
      }
    }
  }

  // 5. VPN Detection
  let isVpn = false;
  
  // Cloudflare threat score / VPN check
  if (headers['cf-connecting-device-type'] === 'bot' || headers['cf-threat-score'] > 50) {
    isVpn = true;
  }
  
  // Check simulation flag
  if (headers['x-simulate-vpn'] === 'true' || req.query.vpn === 'true') {
    isVpn = true;
  }

  // Datacenter/hosting network ASN patterns (often indicates proxy/VPN)
  const datacenters = [
    'AMAZON', 'GOOGLE', 'DIGITALOCEAN', 'HETZNER', 'LINODE', 'OVH', 
    'MICROSOFT', 'ALIBABA', 'TENCENT', 'ORACLE', 'HOSTING', 'DEDICATED',
    'COLOCATION', 'CLOUDFLARE', 'FASTLY', 'DATACENTER', 'M25'
  ];
  const ispUpper = isp.toUpperCase();
  if (datacenters.some(dc => ispUpper.includes(dc))) {
    isVpn = true;
  }

  return {
    ip: lookupIp,
    country,
    city,
    userAgent,
    deviceType,
    deviceBrand,
    isBot,
    isVpn,
    asn,
    isp,
    browser: headers['x-simulate-browser'] || uaResult.browser.name || '',
    os: headers['x-simulate-os'] || uaResult.os.name || '',
    language: headers['x-simulate-language'] || (headers['accept-language'] ? headers['accept-language'].split(',')[0].split(';')[0].trim().substring(0, 5) : 'en')
  };
}

module.exports = {
  evaluateFirewall,
  getClientInfo
};
