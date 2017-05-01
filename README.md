# Calling a API to store, get user objects using webtask.

Sample project for creating an Express-based server that runs on webtask.io for saving basic information and provides search capability.
### Version
0.0.1
# Initial Setup & Configuration
```bash
# Create a new wt-cli profile
npm install -g wt-cli
wt init

# Or, if you already use wt-cli:
wt profile ls
```

### Initialization
```sh
$ wt create --name accounts webtask.js -p {WEBTASK_CONTAINER} --ignore-package-json

```
The above command would create a webtask and give you a url like this
```
Webtask created

You can access your webtask at the following url:

https://{tenant}.auth0.com/accounts

### Run Locally

```sh
Replace the webtask module to return just app in webtask.js

module.exports = app;

$ node server.js
```