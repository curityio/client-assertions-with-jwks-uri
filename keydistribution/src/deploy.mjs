import fs from 'fs';
import {generateKeyPair, exportJWK, exportPKCS8} from 'jose';
import {KEYUTIL} from 'jsrsasign';

(async () => {

    // Demonstrate the concept of generating a public and private key
    const algorithm = 'PS256';
    var keyPair = await generateKeyPair(algorithm);

    // Deploy a protected keystore to the client
    var privateKey = await exportPKCS8(keyPair.privateKey);
    var keystore = KEYUTIL.getPEM(KEYUTIL.getKey(privateKey), 'PKCS8PRV', 'top secret', 'AES-256-CBC');
    fs.writeFileSync('../client/private.key', keystore);

    // Deploy the public key to the JWKS provided by the API owner
    var publicJwk = await exportJWK(keyPair.publicKey);
    publicJwk.alg = algorithm;
    publicJwk.kid = '1';
    fs.writeFileSync('../jwks/public.key', JSON.stringify(publicJwk, null, 2));
})();
