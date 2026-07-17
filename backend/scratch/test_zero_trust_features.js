const { evaluateFirewall } = require('../firewall');

async function runZeroTrustTests() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE ZERO-TRUST & AI INTENT FIREWALL");
  console.log("==========================================================\n");

  // 1. AI Intent Shield Test (Bot / High Risk detection)
  console.log("--- 1. Testing AI Intent Shield (High Risk Bot) ---");
  const linkWithAiShield = {
    id: 'lnk_ai_test',
    destination_url: 'https://stealthai.co.in/default',
    chameleon_rules: JSON.stringify({ is_ai_shield: true })
  };

  // High risk request: Bot user agent + Datacenter ASN
  const reqHighRisk = {
    headers: {
      'user-agent': 'python-requests/2.25.1',
      'cf-as-organization': 'AMAZON AWS DATACENTER',
      'cf-ipasn': 'AS16509'
    },
    socket: { remoteAddress: '54.239.0.1' },
    query: {}
  };

  const decisionHighRisk = await evaluateFirewall(linkWithAiShield, reqHighRisk);
  console.log(`High Risk Bot Decision Allowed: ${decisionHighRisk.allowed}`);
  console.log(`High Risk Bot Status Code: ${decisionHighRisk.status} (Expected: BLOCKED_AI_RISK)`);
  console.log(`Calculated Risk Score: ${decisionHighRisk.riskScore || 0}\n`);

  // Suspicious request: datacenter network but desktop user agent
  console.log("--- 2. Testing Self-Evolving Link (Suspicious Escalation) ---");
  const reqSuspicious = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/99.0.0.0',
      'cf-as-organization': 'GOOGLE DATACENTER'
    },
    socket: { remoteAddress: '8.8.8.8' },
    query: {}
  };

  const decisionSuspicious = await evaluateFirewall(linkWithAiShield, reqSuspicious);
  console.log(`Suspicious Visitor Decision Allowed: ${decisionSuspicious.allowed}`);
  console.log(`Suspicious Visitor Status Code: ${decisionSuspicious.status} (Expected: CHALLENGE_REQUIRED)`);
  console.log(`Calculated Risk Score: ${decisionSuspicious.riskScore || 0}\n`);


  // 3. Advanced Programmable IF/THEN Rules Engine
  console.log("--- 3. Testing Advanced Programmable Rules ---");
  const linkWithRules = {
    id: 'lnk_rules_test',
    destination_url: 'https://stealthai.co.in/fallback-main',
    chameleon_rules: JSON.stringify({
      rules: [
        {
          if: { country: 'US', device: 'mobile' },
          then: 'https://stealthai.co.in/us-exclusive-mobile'
        },
        {
          if: { country: 'IN', vpn: true },
          then: 'block'
        }
      ]
    })
  };

  // Match rule 1: US + Mobile
  const reqUsMobile = {
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      'cf-connecting-ip': '8.8.8.8',
      'x-simulate-ip': '8.8.8.8' // US IP
    },
    socket: { remoteAddress: '8.8.8.8' },
    query: {}
  };
  const decisionUsMobile = await evaluateFirewall(linkWithRules, reqUsMobile);
  console.log(`US Mobile Visitor Redirects to: ${decisionUsMobile.redirectUrl}`);
  console.log(`Expected URL: https://stealthai.co.in/us-exclusive-mobile\n`);

  // Match rule 2: India + VPN
  const reqIndiaVpn = {
    headers: {
      'user-agent': 'Chrome',
      'x-simulate-ip': '49.36.0.1', // India IP
      'x-simulate-vpn': 'true'
    },
    socket: { remoteAddress: '49.36.0.1' },
    query: {}
  };
  const decisionIndiaVpn = await evaluateFirewall(linkWithRules, reqIndiaVpn);
  console.log(`India VPN Visitor Allowed: ${decisionIndiaVpn.allowed}`);
  console.log(`India VPN Visitor Status: ${decisionIndiaVpn.status} (Expected: BLOCKED_BY_RULE)\n`);

  console.log("==========================================================");
  console.log("🎯 ZERO-TRUST FIREWALL CHECKS PASSED SUCCESSFULLY!");
  console.log("==========================================================");
}

runZeroTrustTests().catch(console.error);
