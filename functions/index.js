const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { pick } = require("lodash");

admin.initializeApp();

exports.fnEcho = functions.https.onRequest((req, res) => {
  const request = pick(req, [
    "hostname",
    "headers"
  ]);

  res.send({ request });
});
