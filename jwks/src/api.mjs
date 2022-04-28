import fs from 'fs';
import http from 'http';

const server = http.createServer((req, res) => {

    const json = fs.readFileSync('./public.key', 'ascii');
    const publicJwk = JSON.parse(json);
    const keyset = {
        keys: [
            publicJwk,
        ],
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(keyset));
});

const port = 3000;
server.listen(port, () => {
    console.log(`JWKS URI is hosted at http://localhost:${port}/.well-known/jwks`);
});
