import fs from 'fs';
import {Guid} from 'guid-typescript';
import {importJWK, SignJWT} from 'jose';
import {KEYUTIL} from 'jsrsasign';
import fetch from 'node-fetch'

(async () => {

    // Load the private key from the protected keystore
    const algorithm = 'PS256';
    const privateKeyPem = fs.readFileSync('./private.key', 'ascii');
    const privateKey = KEYUTIL.getJWKFromKey(KEYUTIL.getKeyFromEncryptedPKCS8PEM(privateKeyPem, 'top secret'));
    const privateJwk = await importJWK(privateKey, algorithm);
    
    // Provide other details provided by the API owner
    const keyId = '1';
    const clientID = 'partner-api-client'

    // Create a JWT client assertion signed with the private key
    const assertion = await new SignJWT({
        sub: clientID,  
        iss: clientID,
        aud: 'http://localhost:8443/oauth/v2/oauth-token',
        jti: Guid.create().toString(),
        scope: 'read',
    })
        .setProtectedHeader( {kid: keyId, alg: algorithm} )
        .setIssuedAt(Date.now() - 30000)
        .setExpirationTime(Date.now() + 30000)
        .sign(privateJwk);

    // Post a client credentials request to the token endpoint, to authenticate and get an access token
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_assertion', assertion);
    formData.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
    const response = await fetch('http://localhost:8443/oauth/v2/oauth-token', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        },
        body: formData,
    });
    
    if (response.status == 200) {

        // Output final access token details, with which the client can call APIs
        const data = await response.json();
        console.log(`Calling API with access token: ${data.access_token}`);

    } else {

        // Output authentication failure details
        console.log(`Authentication problem encountered, with status ${response.status}`);
        const errorResponse = await response.text();
        if (errorResponse) {
            console.log(errorResponse)
        }
    }

})();
