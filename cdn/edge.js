const express = require("express");
const axios = require("axios");
require("dotenv").config();

const EDGE_ID = process.env.EDGE_ID;
const PORT = process.env[`EDGE_${EDGE_ID}_PORT`];
const cache = new Map();
const TTL = 10_000;

const app = express();

app.use(async (req, res) => {
  const key = req.originalUrl;
  const now = Date.now();

  if (cache.has(key)) {
    const { buffer, contentType, expiry } = cache.get(key);
    if (now < expiry) {
      res.set("Content-Type", contentType);
      res.set("X-Cache", "HIT");
      res.set("X-Edge", PORT);
      return res.send(buffer);
    }

    cache.delete(key);
  }

  // cache miss -> fetch from origin
  const response = await axios.get(`http://localhost:7000${key}`, {
    responseType: "arraybuffer",
  });

  const contentType =
    response.headers["content-type"] || "application/octet-stream";

  cache.set(key, {
    buffer: response.data,
    contentType,
    expiry: now + TTL,
  });

  res.set("Content-Type", contentType);
  res.set("X-Cache", "MISS");
  res.set("X-Edge", PORT);
  res.send(response.data);
});
app.listen(PORT, () => {
  console.log(`Edge running on port ${PORT}`);
});
