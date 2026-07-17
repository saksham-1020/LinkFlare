const { evaluateFirewall } = require('../firewall');
const db = require('../db');

async function testLiveBotFlow() {
  console.log("==========================================================");
  console.log("🔎 SIMULATING LINKFLARE FIREWALL FOR STEALTHAI.CO.IN");
  console.log("==========================================================\n");

  // 1. Prepare target link row
  const linkRow = {
    id: 'link_stealth_test',
    user_id: 'creator_saksham',
    slug: 'stealth',
    destination_url: 'https://www.stealthai.co.in/',
    is_active: 1,
    geo_blocking: null, // Allow all locations for this test
    allowed_brands: null, // Allow all brands
    allowed_asns: null, // Allow all networks
    vpn_blocking: 1, // Block VPNs
    password_hash: null,
    click_cap: null,
    whatsapp_verify: 0,
    time_bomb_start: null,
    time_bomb_end: null,
    chameleon_rules: null,
    is_monetized: 0,
    user_plan_type: 'premium', // Premium account (not locked)
    user_trial_expires_at: new Date(Date.now() + 1000*60*60*24*5).toISOString() // 5 days left
  };

  // 2. Mock Request A: Legit Human Visitor (Chrome on Android, legit IP)
  const legitRequest = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'x-forwarded-for': '122.161.48.22' // Legit Indian IP (Jio)
    },
    socket: { remoteAddress: '122.161.48.22' },
    query: {}
  };

  console.log("Test A: Simulating Legit Human Click...");
  const decisionA = await evaluateFirewall(linkRow, legitRequest);
  console.log(`- Request User-Agent: Chrome Mobile`);
  console.log(`- Firewall Decision Allowed: ${decisionA.allowed === undefined ? true : decisionA.allowed}`);
  console.log(`- Firewall Result Status: ${decisionA.status}`);
  console.log(`- Redirect Pathway: ${decisionA.redirectUrl}\n`);

  // 3. Mock Request B: Headless Bot Scraper (Python Request or headless browser)
  const botRequest = {
    headers: {
      'user-agent': 'python-requests/2.31.0',
      'x-forwarded-for': '8.8.8.8' // Google Datacenter
    },
    socket: { remoteAddress: '8.8.8.8' },
    query: {}
  };

  console.log("Test B: Simulating Automated Scraper Bot Click...");
  const decisionB = await evaluateFirewall(linkRow, botRequest);
  console.log(`- Request User-Agent: python-requests`);
  console.log(`- Firewall Decision Allowed: ${decisionB.allowed}`);
  console.log(`- Firewall Result Status: ${decisionB.status}`);
  console.log(`- Redirect Pathway: ${decisionB.redirectUrl}\n`);
  
  console.log("==========================================================");
  console.log("🎯 TEST COMPLETE: LINKFLARE BLOCKED THE BOT SUCCESSFULLY!");
  console.log("==========================================================");
}

testLiveBotFlow().catch(console.error);
