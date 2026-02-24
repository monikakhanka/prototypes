const http = require("http");

const BACKENDS = [
  { host: "localhost", port: 4001 },
  { host: "localhost", port: 4002 },
  { host: "localhost", port: 4003 },
];

let currentIndex = 0;

// Round robin selection
function getNextBackend() {
  const backend = BACKENDS[currentIndex];
  currentIndex = (currentIndex + 1) % BACKENDS.length;
  return backend;
}

const server = http.createServer((clientReq, clientRes) => {
  const backend = getNextBackend();

  console.log(`Assigned ${clientReq.url} → ${backend.port}`);
  const options = {
    hostname: backend.host,
    port: backend.port,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on("error", (err) => {
    clientRes.writeHead(502);
    clientRes.end("Bad gateway");
  });

  clientReq.pipe(proxyReq);
});

server.listen(3000, () => console.log(`Load balancer running on port 3000`));
