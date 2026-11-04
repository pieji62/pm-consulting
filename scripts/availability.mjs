const value = process.env.SITE_URL;
try {
  if (!value) throw new Error('Configure SITE_URL in repository variables. Check NOT EXECUTED.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.endsWith('.azurestaticapps.net')) throw new Error('SITE_URL must be the public HTTPS Azure Static Web Apps URL. Custom domains require assessment.');
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('The page did not respond correctly. Get help; do not redeploy blindly.');
  console.log('The page responded correctly. This does not verify every feature.');
} catch (e) { console.error(e.message); process.exitCode = 1; }
