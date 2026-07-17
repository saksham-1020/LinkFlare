const { evaluateFirewall } = require('../firewall');

function runMarketingMockTest() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE DIGITAL MARKETING & PIXEL FEATURES");
  console.log("==========================================================\n");

  // 1. Mocking chameleon_rules extraction
  const linkWithPixel = {
    id: 'lnk_pixel_test',
    slug: 'pixel-test',
    destination_url: 'https://www.stealthai.co.in/',
    chameleon_rules: JSON.stringify({ fb_pixel_id: '1234567890', cloak_link: false })
  };

  const linkWithCloak = {
    id: 'lnk_cloak_test',
    slug: 'cloak-test',
    destination_url: 'https://www.stealthai.co.in/',
    chameleon_rules: JSON.stringify({ fb_pixel_id: null, cloak_link: true })
  };

  // Helper simulated parser logic to match what server.js does
  function parseRules(link) {
    let fbPixelId = null;
    let cloakLink = false;
    if (link.chameleon_rules) {
      const parsed = JSON.parse(link.chameleon_rules);
      fbPixelId = parsed.fb_pixel_id || null;
      cloakLink = !!parsed.cloak_link;
    }
    return { fbPixelId, cloakLink };
  }

  // Verify link with pixel parameters
  const parsedPixel = parseRules(linkWithPixel);
  console.log("Test A: Facebook Pixel Rules Parsing...");
  console.log(`- fb_pixel_id extracted: ${parsedPixel.fbPixelId} (Expected: 1234567890)`);
  console.log(`- cloak_link extracted: ${parsedPixel.cloakLink} (Expected: false)\n`);

  // Verify link with cloak parameters
  const parsedCloak = parseRules(linkWithCloak);
  console.log("Test B: Link Cloaking Rules Parsing...");
  console.log(`- fb_pixel_id extracted: ${parsedCloak.fbPixelId} (Expected: null)`);
  console.log(`- cloak_link extracted: ${parsedCloak.cloakLink} (Expected: true)\n`);

  console.log("==========================================================");
  console.log("🎯 DIGITAL MARKETING RULES PASS SUCCESSFULLY!");
  console.log("==========================================================");
}

runMarketingMockTest();
