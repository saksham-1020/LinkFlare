const firewall = require('./firewall');

/**
 * Firewall Unit Testing Harness
 * Verifies rules-engine blocking and routing decisions for various client profiles.
 */

const mockLink = {
  id: 'lnk_test_123',
  user_id: 'usr_test_123',
  slug: 'test-slug',
  destination_url: 'https://mywebsite.com/success',
  click_count: 5,
  click_cap: 10,
  fallback_url: 'https://mywebsite.com/soldout',
  is_active: 1,
  geo_blocking: ['IN', 'US'], // Allowed countries
  vpn_blocking: 1, // Enable VPN block
  password_hash: null,
  whatsapp_verify: 0,
  time_bomb_start: null,
  time_bomb_end: null,
  allowed_brands: ['Apple', 'Samsung', 'Tesla'],
  allowed_asns: ['AS55836'], // Lock to Jio ASN
  is_monetized: 0,
  chameleon_rules: [
    { type: 'device', value: 'mobile', target_url: 'https://mywebsite.com/mobile-success' }
  ],
  user_plan_type: 'free_trial',
  user_trial_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days remaining
};

// Set of test requests
const testCases = [
  {
    name: "✅ Legit Indian Jio User on iPhone (Should ALLOW & route to Chameleon Mobile)",
    req: {
      headers: {
        'cf-connecting-ip': '49.36.12.34', // Indian IP
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm Limited'
      },
      socket: { remoteAddress: '49.36.12.34' },
      query: {}
    },
    expectedStatus: 'ALLOWED',
    expectedRedirect: 'https://mywebsite.com/mobile-success' // Route matches mobile rule
  },
  {
    name: "❌ Bot Attempt on Headless Browser (Should BLOCK as Bot)",
    req: {
      headers: {
        'cf-connecting-ip': '49.36.12.34',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/115.0.0.0 Safari/537.36',
        'webdriver': 'true' // WebDriver bot flag
      },
      socket: { remoteAddress: '49.36.12.34' },
      query: {}
    },
    expectedStatus: 'BLOCKED_BOT'
  },
  {
    name: "❌ User connecting from Russia (Should BLOCK as Geo-Restricted)",
    req: {
      headers: {
        'x-simulate-ip': '95.24.0.1', // Russia IP
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'cf-ipasn': 'AS55836' // Jio mock to bypass ASN check
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_GEO'
  },
  {
    name: "❌ User using a VPN (Should BLOCK as VPN Connected)",
    req: {
      headers: {
        'x-simulate-ip': '49.36.12.34', // Indian Jio IP range
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm',
        'x-simulate-vpn': 'true' // Simulates active VPN
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_VPN'
  },
  {
    name: "❌ User on Datacenter Network (Should BLOCK as VPN/Proxy)",
    req: {
      headers: {
        'x-simulate-ip': '54.210.12.34', // AWS IP
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'cf-ipasn': 'AS16509',
        'cf-as-organization': 'AMAZON-02' // Datacenter ISP name
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_VPN'
  },
  {
    name: "❌ User on Restricted ASN (Airtel instead of Jio) (Should BLOCK as ASN restricted)",
    req: {
      headers: {
        'x-simulate-ip': '122.161.0.1', // Airtel IP
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'cf-ipasn': 'AS45609', // Airtel ASN
        'cf-as-organization': 'Bharti Airtel Limited'
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_ASN'
  },
  {
    name: "❌ User on Vivo Android (Allowed brands are Apple, Samsung, Tesla) (Should BLOCK as Brand restricted)",
    req: {
      headers: {
        'x-simulate-ip': '49.36.12.34',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13; V2204) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36', // Vivo phone
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm'
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_BRAND'
  },
  {
    name: "❌ Expired Account Link (Should BLOCK as Trial Expired)",
    req: {
      headers: {
        'cf-connecting-ip': '49.36.12.34',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'cf-ipasn': 'AS55836'
      },
      socket: { remoteAddress: '49.36.12.34' },
      query: {}
    },
    expectedStatus: 'BLOCKED_TRIAL_EXPIRED',
    // Overriding link parameter
    linkOverride: {
      user_plan_type: 'free_trial',
      user_trial_expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Expired yesterday
    }
  },
  {
    name: "❌ Firefox User Blocked (Allowed is Chrome/Safari via mockLink overrides) (Should BLOCK as Browser Restricted)",
    req: {
      headers: {
        'x-simulate-ip': '49.36.12.34',
        'x-simulate-browser': 'Firefox',
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm'
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_BROWSER',
    linkOverride: {
      allowed_brands: [],
      vpn_blocking: 0,
      geo_blocking: [],
      browser_rules: JSON.stringify(['Chrome', 'Safari'])
    }
  },
  {
    name: "❌ Android OS Blocked (Allowed is iOS/macOS via mockLink overrides) (Should BLOCK as OS Restricted)",
    req: {
      headers: {
        'x-simulate-ip': '49.36.12.34',
        'x-simulate-os': 'Android',
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm'
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_OS',
    linkOverride: {
      allowed_brands: [],
      vpn_blocking: 0,
      geo_blocking: [],
      os_rules: JSON.stringify(['iOS', 'macOS'])
    }
  },
  {
    name: "❌ French Language User Blocked (Allowed is English/Hindi via mockLink overrides) (Should BLOCK as Language Restricted)",
    req: {
      headers: {
        'x-simulate-ip': '49.36.12.34',
        'x-simulate-language': 'fr',
        'cf-ipasn': 'AS55836',
        'cf-as-organization': 'Reliance Jio Infocomm'
      },
      socket: { remoteAddress: '127.0.0.1' },
      query: {}
    },
    expectedStatus: 'BLOCKED_LANGUAGE',
    linkOverride: {
      allowed_brands: [],
      vpn_blocking: 0,
      geo_blocking: [],
      language_rules: JSON.stringify(['en', 'hi'])
    }
  }
];

async function runTests() {
  console.log("==================================================");
  console.log("      🚀 RUNNING LINKFLARE FIREWALL TESTS         ");
  console.log("==================================================");
  
  let passedCount = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const link = { ...mockLink, ...(tc.linkOverride || {}) };
    
    try {
      const result = await firewall.evaluateFirewall(link, tc.req);
      
      const statusMatch = result.status === tc.expectedStatus;
      const redirectMatch = tc.expectedRedirect ? result.redirectUrl === tc.expectedRedirect : true;
      
      if (statusMatch && redirectMatch) {
        console.log(`\x1b[32m[PASS] Test ${i + 1}: ${tc.name}\x1b[0m`);
        passedCount++;
      } else {
        console.log(`\x1b[31m[FAIL] Test ${i + 1}: ${tc.name}\x1b[0m`);
        console.log(`  Expected Status: ${tc.expectedStatus}, Got: ${result.status}`);
        if (tc.expectedRedirect) {
          console.log(`  Expected Redirect: ${tc.expectedRedirect}, Got: ${result.redirectUrl}`);
        }
        console.log("  Evaluated Client Info:", result.clientInfo);
      }
    } catch (err) {
      console.error(`\x1b[31m[ERROR] Exception in Test ${i + 1}: ${tc.name}\x1b[0m`, err);
    }
    console.log("--------------------------------------------------");
  }
  
  console.log(`\nTest Results: ${passedCount} / ${testCases.length} Passed`);
  if (passedCount === testCases.length) {
    console.log("\x1b[32m✨ ALL FIREWALL CHECKS PASSED SUCCESSFULLY! Production-grade compliance ready.\x1b[0m");
  } else {
    console.log("\x1b[31m❌ SOME TESTS FAILED. Please review the rule assertions.\x1b[0m");
    process.exit(1);
  }
}

runTests();
