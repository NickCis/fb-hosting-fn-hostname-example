const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { pick, omitBy } = require("lodash");

admin.initializeApp();

exports.fnEcho = functions.https.onRequest((req, res) => {
  const request = pick(req, [
    "domain",
    "headers",
    "url",
    "method",
    "baseUrl",
    "originalUrl",
    "params"
  ]);

  const env = omitBy(process.env, (value, key) => key.startsWith("npm_"));

  res.send({ request, env });
});
