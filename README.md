<!-- DO NOT DELETE 
validate_template=true
template_path=.github/ISSUE_TEMPLATE/bug_report.md
-->

<!--
Thank you for contributing to the Firebase community!

Think you found a bug?
=======================
Yeah, we're definitely not perfect! Please use this template and include a minimal repro when opening the issue. If you know how to solve the issue, please create a Pull Request, and we'd be happy to review it!

Have a feature request?
========================
Great, we love hearing how we can improve our products! However, do not use this template to submit a feature request. Please submit your feature requests to: https://firebase.google.com/support/contact/bugs-features/

Have a usage question?
=======================
We get lots of those and we love helping you, but GitHub is not the best place for them and they will be closed. Please take a look at the guide first: https://firebase.google.com/docs/cli/

If the official documentation doesn't help, try asking through our official support channel: https://firebase.google.com/support/

Additional locations to check for solutions or assistance from the community:
- Stack Overflow: https://stackoverflow.com/
- Firebase Slack Community: https://firebase.community/

*Please avoid duplicate posting across multiple channels!*
-->

### [REQUIRED] Environment info

<!-- What version of the Firebase CLI (`firebase-tools`) are you using? Note that your issue may already be fixed in the latest versions. The latest version can be found at https://github.com/firebase/firebase-tools/releases -->

<!-- Output of `firebase --version` -->
**firebase-tools:** 6.10.0

<!-- e.g. macOS, Windows, Ubuntu -->
**Platform:** Arch Linux (Linux nicolas-pc 5.1.3-arch1-1-ARCH #1 SMP PREEMPT Thu May 16 20:59:36 UTC 2019 x86_64 GNU/Linux)

### [REQUIRED] Test case

<!-- Provide a minimal, complete, and verifiable example (http://stackoverflow.com/help/mcve) -->

[Public repo](https://github.com/NickCis/fb-hosting-fn-hostname-example)

```js
// functions/index.js

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

// firebase.json
{
  "rewrites": [
    {
      "source": "**",
      "function": "fnEcho"
    }
  ]
}
```

### [REQUIRED] Steps to reproduce

<!-- Provide the steps needed to reproduce the issue with the above test case. -->

Run above test function in a new project, once locally in the emulator, and once deployed. Observe the response from each scenario. (see Actual behavior below for a sample)

### [REQUIRED] Expected behavior

<!-- What is the expected behavior? -->

I expect to have the correct `hostname` (`req.hostname`) while running an emulated function through a hosting rewrite.

### [REQUIRED] Actual behavior

<!-- Run the command with --debug flag, and include the logs below. -->

While in the emulated function the `hostname` is wrong, the deployed function gets correctly the `hostname`.

<details><summary>emulated response</summary>

```json
{  
  "request":{  
    "hostname":"localhost",
    "headers":{  
      "x-forwarded-host":"admin.localtest.me:5000",
      "x-original-url":"/",
      "pragma":"no-cache",
      "cache-control":"no-cache, no-store",
      "host":"localhost:5001",
      "connection":"keep-alive",
      "upgrade-insecure-requests":"1",
      "user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "referer":"http://admin.localtest.me:5000/",
      "accept-encoding":"gzip, deflate",
      "accept-language":"es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6"
    }
  }
}
```

</details>

<details><summary>deployed response</summary>

```json
{
  "request":{
    "hostname":"fooder.waitless.app",
    "headers":{
      "host":"us-central1-boarder-1e4b0.cloudfunctions.net",
      "user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding":"gzip",
      "accept-language":"es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6",
      "cache-control":"no-cache, no-store",
      "cdn-loop":"Fastly, Fastly",
      "fastly-client":"1",
      "fastly-client-ip":"200.114.214.155",
      "fastly-ff":"s48hDkrIORDrAz3sjuyh5gIWcInqIjSROZ47KAY+w/I=!EZE!cache-eze19326-EZE, s48hDkrIORDrAz3sjuyh5gIWcInqIjSROZ47KAY+w/I=!EZE!cache-eze19322-EZE",
      "fastly-orig-accept-encoding":"gzip, deflate, br",
      "fastly-ssl":"1",
      "fastly-temp-xff":"200.114.214.155, 200.114.214.155",
      "forwarded":"for=\"104.198.56.253\";proto=https",
      "function-execution-id":"2a0f3bksiv8c",
      "pragma":"no-cache",
      "purpose":"prefetch",
      "upgrade-insecure-requests":"1",
      "x-appengine-api-ticket":"d16444e2e887cea6",
      "x-appengine-city":"?",
      "x-appengine-citylatlong":"0.000000,0.000000",
      "x-appengine-country":"US",
      "x-appengine-default-version-hostname":"u702c9978f77f7001-tp.appspot.com",
      "x-appengine-https":"on",
      "x-appengine-region":"?",
      "x-appengine-request-log-id":"5cf2e90d00ff00ff210a10597f4c0001737e75373032633939373866373766373030312d7470000134376430393530626162633866386534313861333533333336353431313535353a3131000100",
      "x-appengine-user-ip":"104.198.56.253",
      "x-cloud-trace-context":"4e970f592f1c9954f385b530ebe6afa7/9080332991501847951;o=1",
      "x-forwarded-for":"200.114.214.155,104.198.56.253",
      "x-forwarded-host":"fooder.waitless.app",
      "x-forwarded-proto":"https",
      "x-forwarded-server":"cache-eze19326-EZE",
      "x-forwarded-url":"/",
      "x-nginx-proxy":"true",
      "x-real-ip":"157.52.88.22",
      "x-timer":"S1559423245.826066,VS0",
      "x-varnish":"2158596768, 3509260374",
      "connection":"close"
    }
  }
}
```

</details>

