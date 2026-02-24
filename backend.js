  const http = require("http");

  const PORT = process.argv[2];

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Response from backend",
        port: PORT,
        path: req.url,
      })
    );
  });

  server.listen(PORT, () => {
    console.log(`Backend server running on port: ${PORT}`);
  });
