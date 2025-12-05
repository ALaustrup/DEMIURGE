/**
 * DNS Service Entry Point
 */

import { createServer } from './server';

const PORT = parseInt(process.env.DNS_SERVICE_PORT || '8083', 10);

const app = createServer();

app.listen(PORT, () => {
  console.log(`[DNS Service] Listening on port ${PORT}`);
  console.log(`[DNS Service] Database: ${process.env.DNS_DB_PATH || './dns-cache.db'}`);
  console.log(`[DNS Service] RPC URL: ${process.env.DEMIURGE_RPC_URL || 'https://rpc.demiurge.cloud/rpc'}`);
});

