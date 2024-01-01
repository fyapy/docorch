#!/bin/sh
# Run script:
# curl -sSL https://raw.githubusercontent.com/fyapy/docorch/master/cli/scripts/install.sh | sh

curl -sSL https://github.com/fyapy/docorch/raw/master/cli/docli.zip -o /var/www/docli.zip

apt install unzip -y

unzip /var/www/docli.zip
chmod +x /var/www/docli

ls /var/www
