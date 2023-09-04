const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();

const app = express();
const port = process.env.PORT || 5000; // Use the environment variable if set, otherwise use port 3000

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }
  next();
});


app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/Book"));


app.listen(port, () => {
  console.log(
    `Your Pustakalaya app listening on port http://localhost:${port}`
  );
});
