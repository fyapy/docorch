Run production on localhost:

```bash
MASTER=login:password deno run --unstable -A ./src/main.ts
```

Install Docker to server:

```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $(whoami)
```
