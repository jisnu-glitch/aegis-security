import dns from 'dns';
const dnsPromises = dns.promises;

export async function scanDNS(hostname, isIpAddress) {
  if (isIpAddress || !hostname || hostname === 'localhost') {
    return {
      resolved: true,
      records: [],
      hasDnsWarning: false,
      details: 'IP or localhost target bypassed standard DNS query.'
    };
  }

  try {
    const addresses = await dnsPromises.resolve4(hostname).catch(() => []);
    const mxRecords = await dnsPromises.resolveMx(hostname).catch(() => []);
    const txtRecords = await dnsPromises.resolveTxt(hostname).catch(() => []);

    const resolved = addresses.length > 0;
    let hasDnsWarning = false;
    let dnsWarning = null;

    if (!resolved) {
      hasDnsWarning = true;
      dnsWarning = `Domain '${hostname}' failed DNS A-record resolution (unregistered or suspended host).`;
    }

    return {
      resolved,
      ipAddresses: addresses,
      mxCount: mxRecords.length,
      txtRecordsSample: txtRecords.flat().slice(0, 3),
      hasDnsWarning,
      dnsWarning
    };
  } catch (err) {
    return {
      resolved: false,
      ipAddresses: [],
      hasDnsWarning: true,
      dnsWarning: `DNS query failed: ${err.message}`
    };
  }
}
