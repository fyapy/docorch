#!/bin/sh
mkdir -p /etc/docorch
curl -sSL https://github.com/fyapy/docorch/raw/master/cli/docorch.zip -o /etc/docorch/docorch.zip

apt install unzip -y

unzip /etc/docorch/docorch.zip -d /etc/docorch
chmod +x /etc/docorch/docorch

rm -rf /etc/docorch/docorch.zip
mv -f /etc/docorch/docorch /usr/bin/docorch

curl -sSL https://get.docker.com | sh
usermod -aG docker $(whoami)
