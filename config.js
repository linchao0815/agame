// Hosts the launcher tries, in order (the one that worked last time first). Source: pixi-colyseus-card
// kit/launcher, decision 0016. Each host serves the hub's ping and lists https://linchao0815.github.io
// in HUB_LAUNCHER_ORIGINS.
window.AGAME_LAUNCHER = {
  // No IP host: it cannot log in (Google takes no IP redirect URI) and nginx sends it on to sslip anyway.
  hosts: ["https://agame.duckdns.org", "https://168-110-59-183.sslip.io"],
  timeoutMs: 4000,
};
