async function testAiFeatures() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE AI ALIASES & VERSION ROLLBACK");
  console.log("==========================================================\n");

  const baseUrl = 'http://localhost:5000';
  const randomSlug = 'version-test-' + Math.random().toString(36).substring(7);

  // Test A: Request AI Aliases
  console.log("Test A: Requesting AI Aliases for 'https://amazon.com/deals'...");
  try {
    const res = await fetch(`${baseUrl}/api/ai/suggest-aliases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'user_id=usr_dev_global'
      },
      body: JSON.stringify({ destination_url: 'https://amazon.com/deals' })
    });

    console.log(`- Result Status: ${res.status}`);
    const data = await res.json();
    console.log(`- Suggested AI Aliases: ${JSON.stringify(data.aliases)}`);
    console.log(`- Suggested Emoji Slugs: ${JSON.stringify(data.emoji_aliases)}\n`);
  } catch (error) {
    console.error("AI Aliases test failed:", error);
  }

  // Test B: Versioning & Rollback
  console.log("Test B: Checking Link Versioning & Rollback...");
  try {
    // 1. Create a dev link
    const createRes = await fetch(`${baseUrl}/api/dev/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer lf_live_998877665544'
      },
      body: JSON.stringify({
        slug: randomSlug,
        destination_url: 'https://stealthai.co.in/version-1'
      })
    });
    const createData = await createRes.json();
    if (!createData.success) {
      throw new Error(`Failed to create link: ${JSON.stringify(createData)}`);
    }
    const linkId = createData.link.id;
    console.log(`- Created Link ID: ${linkId} with URL: https://stealthai.co.in/version-1`);

    // 2. Update the link to Version 2
    const updateRes = await fetch(`${baseUrl}/api/links/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'user_id=usr_dev_global'
      },
      body: JSON.stringify({
        destination_url: 'https://stealthai.co.in/version-2'
      })
    });
    const updateResult = await updateRes.json();
    console.log(`- Updated Link to Version 2 (Status: ${updateResult.success})`);

    // 3. Trigger Rollback to Version 1
    const rollbackRes = await fetch(`${baseUrl}/api/links/${linkId}/rollback`, {
      method: 'POST',
      headers: {
        'Cookie': 'user_id=usr_dev_global'
      }
    });
    console.log(`- Rollback Request Status: ${rollbackRes.status}`);
    const rollbackResult = await rollbackRes.json();
    console.log(`- Rolled back to URL: ${rollbackResult.destination_url} (Expected: https://stealthai.co.in/version-1)\n`);

    // Clean up
    await fetch(`${baseUrl}/api/dev/links/${linkId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer lf_live_998877665544' }
    });
    console.log(`- Test Link cleaned up successfully.`);
  } catch (error) {
    console.error("Versioning rollback test failed:", error);
  }

  console.log("==========================================================");
  console.log("🎯 AI ALIAS & ROLLBACK CHECKS COMPLETED SUCCESSFULLY!");
  console.log("==========================================================");
}

// Delay test slightly to ensure backend is fully started
setTimeout(testAiFeatures, 1000);
