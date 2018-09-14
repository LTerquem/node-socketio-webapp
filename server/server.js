const path = require("path");
const express = require("express");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "public");

// Server setup
const app = express();

app.use(express.static(publicPath));

// Routes

app.listen(port, () => console.log(`Server running on port ${port}`));