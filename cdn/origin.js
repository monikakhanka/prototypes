const express = require("express");
const app = express();

app.use("/assets", express.static("assets"));

app.get("/data", (req, res) => {
  res.json({
    source: "ORIGIN",
    time: new Date().toISOString(),
  });
});

app.listen(7000, () => {
  console.log("origin running on port 7000");
});
