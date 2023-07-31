const fs = require("fs");
const { PeerServer } = require("peer");
// const privateKey = fs.readFileSync('path/to/private.key.pem', 'utf8');
// const certificate = fs.readFileSync('path/to/certificate.crt.pem', 'utf8');
const privateKey = fs.readFileSync('C:/Users/dhruv/Documents/Stream/stream/CngSSLs/CngSSLs/PEM File Extension change/private.key.pem', 'utf8');
const certificate = fs.readFileSync('C:/Users/dhruv/Documents/Stream/stream/CngSSLs/CngSSLs/PEM File Extension change/certificate.crt.pem', 'utf8');

const peerServer = PeerServer({
	port: 9000,
	ssl: {
		key: privateKey,
		cert: certificate,
	},
});
console.log(`Server running on port.`);