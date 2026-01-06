# RPC Connection Troubleshooting

Guide for diagnosing and fixing RPC connection issues.

## Common Issues

### 1. Connection Refused

**Symptoms:** `ERR_CONNECTION_REFUSED` or timeout

**Causes:**
- Chain node not running
- Wrong port
- Firewall blocking

**Solutions:**
```bash
# Check if node is running
sudo systemctl status demiurge-chain

# Check if port is listening
sudo netstat -tlnp | grep 8545

# Check firewall
sudo ufw status
sudo ufw allow 8545/tcp  # If needed
```

### 2. CORS Errors

**Symptoms:** Browser console shows CORS errors

**Current Configuration** (`chain/src/rpc.rs`):
```rust
let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
```

The chain allows all origins. If you see CORS errors, check nginx config:

```nginx
# Add to nginx location block
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "POST, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type";

# Handle preflight
if ($request_method = OPTIONS) {
    return 204;
}
```

### 3. Intermittent Disconnections

**Symptoms:** RPC works sometimes, then drops

**Possible Causes:**
1. **Nginx proxy timeout** - Default is 60s
2. **Keep-alive not configured**
3. **Server resource limits**

**Solutions:**

Add to nginx:
```nginx
location /rpc {
    proxy_pass http://127.0.0.1:8545/rpc;
    proxy_http_version 1.1;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Keep-alive
    proxy_set_header Connection "";
    keepalive_timeout 65;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 4. SSL/TLS Issues

**Symptoms:** Works on HTTP, fails on HTTPS

**Check certificate:**
```bash
sudo certbot certificates
openssl s_client -connect rpc.demiurge.cloud:443
```

**Renew if expired:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### 5. High Latency

**Symptoms:** Requests complete but slowly

**Diagnostics:**
```bash
# Test local RPC
time curl -X POST http://localhost:8545/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'

# Test remote RPC
time curl -X POST https://rpc.demiurge.cloud/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'
```

**Solutions:**
- Check server load: `htop`
- Check disk I/O: `iostat -x 1`
- Check network: `iftop`

## Diagnostic Commands

### Check Chain Node

```bash
# Service status
sudo systemctl status demiurge-chain

# Recent logs
sudo journalctl -u demiurge-chain -n 100

# Follow logs
sudo journalctl -u demiurge-chain -f
```

### Check Nginx

```bash
# Config test
sudo nginx -t

# Error logs
sudo tail -f /var/log/nginx/error.log

# Access logs
sudo tail -f /var/log/nginx/access.log
```

### Test RPC

```bash
# Basic health check
curl -X POST http://localhost:8545/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'

# With verbose output
curl -v -X POST http://localhost:8545/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'
```

## Production Recommendations

### 1. Rate Limiting

Add to nginx:
```nginx
limit_req_zone $binary_remote_addr zone=rpc_limit:10m rate=10r/s;

location /rpc {
    limit_req zone=rpc_limit burst=20 nodelay;
    # ... rest of config
}
```

### 2. Monitoring

Set up monitoring for:
- RPC response times
- Error rates
- Connection counts
- Server resources

Recommended tools:
- Prometheus + Grafana
- Datadog
- New Relic

### 3. Redundancy

For production:
- Multiple RPC nodes behind load balancer
- Health check endpoints
- Automatic failover

## Current Production Status

- **Server:** 51.210.209.112
- **RPC Port:** 8545 (local)
- **Public URL:** https://rpc.demiurge.cloud/rpc
- **Status:** Check `sudo systemctl status demiurge-chain`

---

*If issues persist, check chain logs for errors.*
