#!/bin/bash
set -e

DOMAIN="www.mmmorg15.com"
EMAIL="mmmorg15@byu.edu"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
  yum install -y certbot
fi

# Stop nginx so certbot can use port 80
systemctl stop nginx || true

# Get or renew certificate
certbot certonly --standalone \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --keep-until-expiring

# Write the nginx HTTPS config (after cert exists)
cat > /etc/nginx/conf.d/https.conf << 'EOF'
server {
  listen 443 ssl;
  server_name www.mmmorg15.com;

  ssl_certificate /etc/letsencrypt/live/www.mmmorg15.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/www.mmmorg15.com/privkey.pem;

  location / {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}

server {
  listen 80;
  server_name www.mmmorg15.com;
  return 301 https://$host$request_uri;
}
EOF

# Start nginx with the new config
systemctl start nginx || true
