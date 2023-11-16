# BitBurner

## How to use

Tested on BitBurner v2.5.0

```shell
cd /path/to/this/repo
npm run watch
```

After running `npm run watch`, the terminal should output a **port number**.
Take that port number, go to BitBurner, go to Options, then Remote API and enter
the port number.  Everything should get synced and so long as the npm watch process is
running it should keep it in sync.