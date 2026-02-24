const express = require("express");
const axios = require("axios");

const edges = [
  "http://localhost:9001",
  "http://localhost:9002",
  "http://localhost:9003",
];

let i = 0;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res) => {
  let edge = null;
  try {
    // round robin
    edge = edges[i++ % edges.length];
    console.log(edge + req.originalUrl);
    const response = await axios({
      method: req.method,
      url: edge + req.originalUrl,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    if (response.headers["content-type"]) {
      res.set("Content-Type", response.headers["content-type"]);
    }

    // Optional debug headers
    res.set("X-Router", "8080");

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error("Edge failed:", edge);
    res.status(502).json({ error: "Bad Gateway" });
  }
});
app.listen(8080, () => {
  console.log("CDN router runing on port 8080");
});
