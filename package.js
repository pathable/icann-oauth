Package.describe({
  summary: "ICANN OAuth flow",
  version: "1.1.0",
  name: "pathable:icann-oauth",
  git: "https://github.com/pathable/icann",
});

Package.onUse((api) => {
  api.versionsFrom('2.3');

  api.use("ecmascript", ["client", "server"]);
  api.use("oauth2", ["client", "server"]);
  api.use("oauth", ["client", "server"]);
  api.use("http", "server");
  api.use("random", "client");
  api.use("service-configuration", ["client", "server"]);

  api.addFiles("icann_client.js", "client");
  api.addFiles("icann_server.js", "server");

  api.export("Icann");
});
