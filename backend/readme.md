Run on server:

```bash
chmod +x ./docorch
./docorch --master=hono:123
```

Run production on localhost:

```bash
deno run --unstable -A ./src/main.ts --master=hono:123
```
