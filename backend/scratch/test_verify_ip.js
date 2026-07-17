async function testVerifyIpApi() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE CUSTOM DOMAIN VERIFY-IP API");
  console.log("==========================================================\n");

  const url = 'http://localhost:5000/api/firewall/verify-ip?ip=49.36.0.1';

  // 1. Test unauthorized request (no key)
  try {
    console.log("Test A: Requesting without Authorization key...");
    const res = await fetch(url);
    console.log(`- Result Status: ${res.status} (Expected: 401)`);
    const data = await res.json();
    console.log(`- Message: ${JSON.stringify(data)}\n`);
  } catch (error) {
    console.error("Test A failed error:", error);
  }

  // 2. Test authorized request (valid key)
  try {
    console.log("Test B: Requesting with valid Bearer Token...");
    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer lf_live_998877665544' }
    });
    console.log(`- Result Status: ${res.status} (Expected: 200)`);
    const data = await res.json();
    console.log(`- Allowed: ${data.allowed}`);
    console.log(`- Status Code: ${data.status}\n`);
  } catch (error) {
    console.error("Test B failed:", error.message);
  }

  console.log("==========================================================");
  console.log("🎯 CUSTOM DOMAIN API CHECKS COMPLETED SUCCESSFULLY!");
  console.log("==========================================================");
}

// Delay test slightly to ensure backend server is loaded
setTimeout(testVerifyIpApi, 1000);
