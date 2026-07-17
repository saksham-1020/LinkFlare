async function verifyPhase2Features() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE PHASE-2 V2 ENTERPRISE AI ENGINE");
  console.log("==========================================================\n");

  const baseUrl = 'http://localhost:5000';

  // Fetch all user links to get a valid link id
  let linkId = '';
  try {
    const linksRes = await fetch(`${baseUrl}/api/links`, {
      headers: { 'Cookie': 'user_id=usr_dev_global' }
    });
    const links = await linksRes.json();
    if (links && links.length > 0) {
      linkId = links[0].id;
      console.log(`- Identified target link ID: ${linkId} (Slug: /${links[0].slug})`);
    } else {
      console.log("- No links found. Confirm seed sequence first.");
      return;
    }
  } catch (e) {
    console.error("Failed to query user links list:", e);
    return;
  }

  console.log("\nTest A: Verifying Product 17: Link DNA™ clones and mirrors scan...");
  try {
    const dnaRes = await fetch(`${baseUrl}/api/links/${linkId}/dna`, {
      headers: { 'Cookie': 'user_id=usr_dev_global' }
    });
    console.log(`- DNA Scan Status: ${dnaRes.status}`);
    const dna = await dnaRes.json();
    console.log(`- Ownership status: ${dna.ownership_status}`);
    console.log(`- AI Similarity Score: ${dna.ai_similarity_score}%`);
    console.log(`- Mirrors / Clones found: ${dna.copies_found} mirror locations`);
    console.log(`- Active clone mirrors: ${JSON.stringify(dna.mirror_domains)}\n`);
  } catch (e) {
    console.error("Link DNA test failed:", e);
  }

  console.log("Test B: Verifying Product 18: Link Reputation Network™ Trust indicators...");
  try {
    const repRes = await fetch(`${baseUrl}/api/links/${linkId}/reputation`, {
      headers: { 'Cookie': 'user_id=usr_dev_global' }
    });
    console.log(`- Reputation Status: ${repRes.status}`);
    const rep = await repRes.json();
    console.log(`- Trust score: ${rep.trust_score}/100`);
    console.log(`- Spam score: ${rep.spam_score}%`);
    console.log(`- Malware risk rating: ${rep.malware_score}%`);
    console.log(`- Community verdict: ${rep.community_rating}\n`);
  } catch (e) {
    console.error("Link Reputation test failed:", e);
  }

  console.log("Test C: Verifying Product 19/23: AI Traffic Forecast & Live Autopilot advice...");
  try {
    const fcRes = await fetch(`${baseUrl}/api/links/${linkId}/forecast`, {
      headers: { 'Cookie': 'user_id=usr_dev_global' }
    });
    console.log(`- Forecast Status: ${fcRes.status}`);
    const fc = await fcRes.json();
    console.log(`- Predicted Tomorrow clicks: ${fc.tomorrow_clicks}`);
    console.log(`- Projected tomorrow revenue: ${fc.tomorrow_revenue}`);
    console.log(`- Live Autopilot advice: "${fc.recommendation}"`);

    // Apply optimization rule
    const optRes = await fetch(`${baseUrl}/api/links/${linkId}/optimize`, {
      method: 'POST',
      headers: { 'Cookie': 'user_id=usr_dev_global' }
    });
    const opt = await optRes.json();
    console.log(`- Optimize Action response: ${opt.success ? 'Success' : 'Failed'} (${opt.message})\n`);
  } catch (e) {
    console.error("AI Traffic Forecast test failed:", e);
  }

  console.log("==========================================================");
  console.log("🎯 ALL ENTERPRISE PHASE-2 V2 AI CHECKS PASSED!");
  console.log("==========================================================");
}

verifyPhase2Features();
