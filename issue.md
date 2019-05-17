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

**For Posterity**

This stems from a conversation in this issue: https://github.com/firebase/firebase-tools/issues/1279#issuecomment-493548486

[@christiannaths commented](https://github.com/firebase/firebase-tools/issues/1279#issuecomment-493181822)

> As far as I can tell, there is now no way to get the actual request path when running functions in the emulator.

> For example, I need to generate an oauth callback url for the google OAuth2Client. I managed this before by using a combination of request.protocol, request.headers.host, and request.path. After this change–given that request.path no longer reflects the actual path, and the actual path is not stored anywhere–I'm at a loss as to how I can accomplish this without some hackery.

[@abeisgoat commented](https://github.com/firebase/firebase-tools/issues/1279#issuecomment-493548486)

> @christiannaths Thanks for your input, this is a great question and if I'm understanding correctly, you aren't saying that the old emulator handled this well, just that the new one (with the change to match the old one) now breaks you?

> If this is the case, then I think this will be a prime candidate to introduce into emulators:start so serve will have the same bug as the old emulator and emulators:start will make the prefix available in some way (along with some other IS_FIREBASE_EMULATOR type env.)

> That being said, since the original issue that @tmcf reported is now fixed, @christiannaths can you open a new issue with your thoughts? Feel free to just copy/paste what you said here, I just want to keep things organized.

### [REQUIRED] Environment info

<!-- What version of the Firebase CLI (`firebase-tools`) are you using? Note that your issue may already be fixed in the latest versions. The latest version can be found at https://github.com/firebase/firebase-tools/releases -->

<!-- Output of `firebase --version` -->

**firebase-tools:** 6.9.2

<!-- e.g. macOS, Windows, Ubuntu -->

**Platform:** macOS

### [REQUIRED] Test case

```js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { pick, omitBy } = require("lodash");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
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
```

<!-- Provide a minimal, complete, and verifiable example (http://stackoverflow.com/help/mcve) -->

### [REQUIRED] Steps to reproduce

Run above test function in a new project, once locally in the emulator, and once deployed. Observe the response from each scenario. (see _Actual behavior_ below for a sample)

<!-- Provide the steps needed to reproduce the issue with the above test case. -->

### [REQUIRED] Expected behavior

<!-- What is the expected behavior? -->

**I expect to be able to generate an absolute url to a function from within a function. This should work both in the emulator and when deployed. For example, this is required in order to use Google Oauth without a browser (in a chatbot, for example).**

I see two ways to solve this:

1. Do away with the prefix entirely (best)
1. Expose just the function path prefix somewhere, if it exists.
1. Let me know that the function is being run in the emulator (worst)

To be perfectly honest, I strongly feel that having a prefix in the emulator at all is unexpected behavior, though I do understand the behaviour exists for legacy support.

As a suggestion, perhaps the newer `firebase emulators:start` could serve the functions without the prefix, and legacy behaviour could be supported with `firebase serve`.

### [REQUIRED] Actual behavior

<!-- Run the command with --debug flag, and include the logs below. -->

<details><summary>emulated response</summary>

```json
{
  "request": {
    "domain": null,
    "headers": {
      "host": "localhost:5001",
      "connection": "keep-alive",
      "cache-control": "max-age=0",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "dnt": "1",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9"
    },
    "url": "/christiannaths-com/us-central1/fnEcho",
    "method": "GET",
    "baseUrl": "",
    "originalUrl": "/christiannaths-com/us-central1/fnEcho",
    "params": {
      "0": "christiannaths-com/us-central1/fnEcho"
    }
  },
  "env": {
    "...note": "A few non-relevant env vars have been removed",
    "NODE": "/Users/christiannaths/.n/bin/node",
    "INIT_CWD": "/Users/christiannaths/Desktop/firebase-functions-path-prefix-example/functions",
    "TMPDIR": "/var/folders/d3/nflw9g251rb3v09s0ymcc3v80000gn/T/",
    "SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.UAAe7tnG6D/Listeners",
    "__CF_USER_TEXT_ENCODING": "0x1F5:0x0:0x52",
    "_": "/usr/local/bin/firebase",
    "PWD": "/Users/christiannaths/Desktop/firebase-functions-path-prefix-example/functions",
    "GCLOUD_PROJECT": "christiannaths-com",
    "FIREBASE_CONFIG": "{\"databaseURL\":\"https://christiannaths-com.firebaseio.com\",\"storageBucket\":\"christiannaths-com.appspot.com\",\"projectId\":\"christiannaths-com\"}"
  }
}
```

</details>

<details><summary>deployed response</summary>

```json
{
  "request": {
    "domain": null,
    "headers": {
      "host": "us-central1-christiannaths-com.cloudfunctions.net",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "dnt": "1",
      "forwarded": "for=\"187.237.217.18\";proto=https",
      "function-execution-id": "zx1mppz9po8n",
      "pragma": "no-cache",
      "upgrade-insecure-requests": "1",
      "x-appengine-api-ticket": "[redacted]",
      "x-appengine-city": "[redacted]",
      "x-appengine-citylatlong": "[redacted]",
      "x-appengine-country": "[redacted]",
      "x-appengine-default-version-hostname": "[redacted]",
      "x-appengine-https": "[redacted]",
      "x-appengine-region": "[redacted]",
      "x-appengine-request-log-id": "[redacted]",
      "x-appengine-user-ip": "[redacted]",
      "x-cloud-trace-context": "[redacted]",
      "x-forwarded-for": "[redacted]",
      "x-forwarded-proto": "https",
      "connection": "close"
    },
    "url": "/",
    "method": "GET",
    "baseUrl": "",
    "originalUrl": "/",
    "params": {
      "0": ""
    }
  },
  "env": {
    "X_GOOGLE_FUNCTION_TIMEOUT_SEC": "60",
    "NO_UPDATE_NOTIFIER": "true",
    "X_GOOGLE_FUNCTION_MEMORY_MB": "256",
    "FUNCTION_TIMEOUT_SEC": "60",
    "FUNCTION_MEMORY_MB": "256",
    "X_GOOGLE_LOAD_ON_START": "false",
    "X_GOOGLE_FUNCTION_TRIGGER_TYPE": "HTTP_TRIGGER",
    "PORT": "8080",
    "ENTRY_POINT": "fnEcho",
    "HOME": "/tmp",
    "X_GOOGLE_SUPERVISOR_HOSTNAME": "169.254.8.129",
    "FUNCTION_TRIGGER_TYPE": "HTTP_TRIGGER",
    "X_GOOGLE_GCLOUD_PROJECT": "christiannaths-com",
    "X_GOOGLE_FUNCTION_NAME": "fnEcho",
    "FUNCTION_NAME": "fnEcho",
    "SUPERVISOR_INTERNAL_PORT": "8081",
    "X_GOOGLE_GCP_PROJECT": "christiannaths-com",
    "X_GOOGLE_FUNCTION_REGION": "us-central1",
    "X_GOOGLE_ENTRY_POINT": "fnEcho",
    "FUNCTION_REGION": "us-central1",
    "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "X_GOOGLE_WORKER_PORT": "8091",
    "CODE_LOCATION": "/srv",
    "WORKER_PORT": "8091",
    "SUPERVISOR_HOSTNAME": "169.254.8.129",
    "DEBIAN_FRONTEND": "noninteractive",
    "X_GOOGLE_FUNCTION_IDENTITY": "christiannaths-com@appspot.gserviceaccount.com",
    "X_GOOGLE_CONTAINER_LOGGING_ENABLED": "false",
    "GCLOUD_PROJECT": "christiannaths-com",
    "FUNCTION_IDENTITY": "christiannaths-com@appspot.gserviceaccount.com",
    "X_GOOGLE_CODE_LOCATION": "/srv",
    "PWD": "/srv",
    "GCP_PROJECT": "christiannaths-com",
    "X_GOOGLE_SUPERVISOR_INTERNAL_PORT": "8081",
    "X_GOOGLE_FUNCTION_VERSION": "1",
    "X_GOOGLE_NEW_FUNCTION_SIGNATURE": "true",
    "NODE_ENV": "production",
    "FIREBASE_CONFIG": "{\"projectId\":\"christiannaths-com\",\"databaseURL\":\"https://christiannaths-com.firebaseio.com\",\"storageBucket\":\"christiannaths-com.appspot.com\",\"cloudResourceLocation\":\"us-central\"}"
  }
}
```

</details>
