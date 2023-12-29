Run on server as master:

```bash
chmod +x ./docorch
./docorch --master=login:password
```

Run on server:

```bash
chmod +x ./docorch
./docorch --slave=masterIp
```

Run production on localhost:

```bash
deno run --unstable -A ./src/main.ts --master=hono:123
```

Install Docker to server:

```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $(whoami)
exit
```
