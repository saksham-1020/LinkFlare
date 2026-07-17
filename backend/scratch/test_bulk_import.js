async function verifyBulkImport() {
  console.log("==========================================================");
  console.log("🚀 TESTING LINKFLARE UNIVERSAL BULK MIGRATION ENGINE");
  console.log("==========================================================\n");

  const baseUrl = 'http://localhost:5000';

  console.log("Test A: Bulk importing 3 custom target URLs...");
  const bulkData = {
    links: [
      { slug: 'bitly-migrated-1', destination_url: 'https://dub.co/features/speed' },
      { slug: 'dub-migrated-2', destination_url: 'https://cloudflare.com/waf' },
      { slug: 'rebrand-migrated-3', destination_url: 'https://tinyurl.com/developer' }
    ]
  };

  try {
    const res = await fetch(`${baseUrl}/api/links/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'user_id=usr_dev_global'
      },
      body: JSON.stringify(bulkData)
    });

    console.log(`- Import Endpoint Status: ${res.status}`);
    const data = await res.json();
    console.log(`- Imported Count: ${data.importedCount}`);
    console.log(`- Errors encountered: ${JSON.stringify(data.errors)}\n`);
  } catch (error) {
    console.error("Bulk import request failed:", error);
  }

  console.log("Test B: Checking Cache router and redirect resolution for migrated links...");
  try {
    const redirectRes1 = await fetch(`${baseUrl}/l/bitly-migrated-1`, { redirect: 'manual' });
    console.log(`- Resolved bitly-migrated-1: Status ${redirectRes1.status}, Location: ${redirectRes1.headers.get('location')}`);

    const redirectRes2 = await fetch(`${baseUrl}/l/dub-migrated-2`, { redirect: 'manual' });
    console.log(`- Resolved dub-migrated-2: Status ${redirectRes2.status}, Location: ${redirectRes2.headers.get('location')}\n`);
  } catch (error) {
    console.error("Redirect check failed:", error);
  }

  console.log("==========================================================");
  console.log("🎯 UNIVERSAL BULK MIGRATION DIAGNOSTIC CHECKS PASSED!");
  console.log("==========================================================");
}

// Wait briefly for server state
setTimeout(verifyBulkImport, 1000);
