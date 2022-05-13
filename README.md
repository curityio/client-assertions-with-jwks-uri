# Client Assertions and the JWKS URI

A code example to demonstrate an end-to-end solution using client assertions and a JWKS URI.\
This strong security option could be used for many security use cases, such as B2B APIs.

## Instructions

First ensure that Docker Desktop and Node.js are installed.

### Generate an Asymmetric Keypair

From the root folder, run these commands to generate a PS256 public and private key:

```bash
cd keydistribution
npm install
npm start
```

### Host a JWKS URI

From the root folder, run these commands to host a JSON Web Key Set (JWKS) via a simple Node.js API:

```bash
cd jwks
npm install
npm start
```

Then run this command in another terminal window to download the public keys:

```bash
curl http://localhost:3000/.well-known/jwks
```

### Deploy the Curity Identity Server

From the root folder, run these commands to deploy a Docker based instance.\
Then login to the Admin UI with credentials `admin / Password1` and complete the initial setup.

```bash
cd idsvr
docker compose up
```

Select the Changes / Upload option, then import and merge the `idsvr/import.xml` file.

### Send a Client Assertion

From the root folder, use these commands to send a client assertion from the simple console client:

```bash
cd client
npm install
npm start
```

### Call the Secured API

The client then authenticates successfully and receives an access token.\
The demo client outputs a simple debug message, whereas a real client would continue by calling an API:

```text
Calling API with access token: _0XBPWQQ_804cc417-cb17-4ad1-a86f-00895c2b9cdb
```

The API would then receive a JWT access token in the standard way.\
Using client assertions has no impact on the API's code, and no special infrastructure is needed.

## Website Documentation

See the [API Access via JWT Assertions](https://curity.io/resources/learn/api-jwt-assertions) for further details on the end-to-end solution.

## More Information

Please visit [curity.io](https://curity.io/) for more information about the Curity Identity Server.
