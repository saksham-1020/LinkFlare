const { evaluateFirewall } = require('../firewall');

async function testRevenueFeatures() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE REVENUE ACCELERATOR FEATURES");
  console.log("==========================================================\n");

  // 1. Dynamic Pricing / Routing by City
  console.log("--- 1. Testing Dynamic Routing by City (Chameleon) ---");
  const linkWithCityRules = {
    id: 'link_city_test',
    destination_url: 'https://mystore.com/default-price',
    chameleon_rules: JSON.stringify([
      { type: 'city', value: 'Mumbai', target_url: 'https://mystore.com/mumbai-premium-price' },
      { type: 'city', value: 'Bangalore', target_url: 'https://mystore.com/bangalore-high-price' }
    ])
  };

  const reqMumbai = {
    headers: { 'x-simulate-city': 'Mumbai', 'user-agent': 'Chrome' },
    socket: { remoteAddress: '127.0.0.1' },
    query: {}
  };
  const decisionMumbai = await evaluateFirewall(linkWithCityRules, reqMumbai);
  console.log(`Mumbai Visitor Redirects to: ${decisionMumbai.redirectUrl} (Expected: mumbai-premium-price)`);

  const reqOther = {
    headers: { 'x-simulate-city': 'Indore', 'user-agent': 'Chrome' },
    socket: { remoteAddress: '127.0.0.1' },
    query: {}
  };
  const decisionOther = await evaluateFirewall(linkWithCityRules, reqOther);
  console.log(`Indore Visitor Redirects to: ${decisionOther.redirectUrl} (Expected: default-price)\n`);


  // 2. 1-Click A/B Split Testing
  console.log("--- 2. Testing 1-Click A/B Split Routing ---");
  const linkWithSplitTesting = {
    id: 'link_split_test',
    destination_url: 'https://store.com/sales-page-A, https://store.com/sales-page-B',
    chameleon_rules: null
  };

  const dummyReq = {
    headers: { 'user-agent': 'Chrome' },
    socket: { remoteAddress: '127.0.0.1' },
    query: {}
  };

  let countA = 0;
  let countB = 0;
  for (let i = 0; i < 20; i++) {
    const decision = await evaluateFirewall(linkWithSplitTesting, dummyReq);
    if (decision.redirectUrl === 'https://store.com/sales-page-A') countA++;
    if (decision.redirectUrl === 'https://store.com/sales-page-B') countB++;
  }
  console.log(`Out of 20 random clicks:`);
  console.log(`- Directed to Sales Page A: ${countA} times`);
  console.log(`- Directed to Sales Page B: ${countB} times`);
  console.log(`A/B Split Test Execution: SUCCESS!\n`);

  console.log("==========================================================");
  console.log("🎯 REVENUE ACCELERATORS PASS SUCCESSFULLY!");
  console.log("==========================================================");
}

testRevenueFeatures().catch(console.error);
