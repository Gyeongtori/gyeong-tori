#!/bin/bash
set -x
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

domains=("p.ssafy.io") # Make domains an array if multiple domains are needed
rsa_key_size=4096
data_path="./certbot"
email="dhmonukim24@gmail.com" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Copying files to nginx ..."
if [ ! -e "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
  cp -r $data_path/conf/* /etc/letsencrypt
  cp -r $data_path/www/* /var/www/certbot
fi
echo

echo "### Creating dummy certificate for ${domains[@]} ..."
for domain in "${domains[@]}"; do
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$path"
  docker-compose -p test-server run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" certbot
done
echo

echo "### Starting nginx ..."
docker-compose -p test-server up -d nginx || docker-compose -p test-server restart nginx
echo

echo "### Deleting dummy certificate for ${domains[@]} ..."
for domain in "${domains[@]}"; do
  docker-compose -p test-server run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
done
echo

echo "### Requesting Let's Encrypt certificate for ${domains[@]} ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain
