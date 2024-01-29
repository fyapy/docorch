#!/bin/sh
mkdir -p /etc/docorch
curl -sSL https://github.com/fyapy/docorch/raw/master/cli/doctl -o /usr/bin/doctl

chmod +x /etc/docorch/doctl

mv -f /etc/docorch/doctl /usr/bin/doctl

curl -sSL https://get.docker.com | sh
usermod -aG docker $(whoami)
