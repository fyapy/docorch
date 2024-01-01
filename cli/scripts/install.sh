#!/bin/sh
curl -sSL https://github.com/fyapy/docorch/raw/master/cli/docli.zip -o /var/www/docli.zip

apt install unzip -y

unzip /var/www/docli.zip -d /var/www
chmod +x /var/www/docli

rm -rf /var/www/docli.zip
mv -f /var/www/docli /usr/bin/docli
