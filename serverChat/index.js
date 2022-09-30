const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

dbConnection();

app.use("/api/auth", require("./routes/user.route"));
app.use("/api/conversation", require("./routes/consversation.route"));
app.use("/api/messages", require("./routes/messages.route"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
