Run on server as master:

```bash
chmod +x ./backend
./backend --master=login:password
```

Run on server:

```bash
chmod +x ./backend
./backend --slave=masterIp
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
