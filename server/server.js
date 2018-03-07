const path = require("path");
const express = require("express");

// //One way to access a directory on the same level (such as public in this case.)
// console.log(__dirname + "/../public");

// Another way:
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
