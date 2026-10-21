# agame 遊戲入口

玩家的固定入口：<https://linchao0815.github.io/agame/>

這一頁會依序試連 Oracle 上的遊戲入口主機（duckdns、sslip、IP），找到連得上的就整頁帶過去，所以在公司（擋 duckdns）和在外面都能進遊戲。

- 程式來源：pixi-colyseus-card 的 `kit/launcher/`（決策 0016），這裡只放部署用的副本與 `config.js`。
- 更新：從範本複製 `index.html`、`launcher.js` 過來；主機清單改 `config.js`。
