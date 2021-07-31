const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 1027;
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute"); 
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
mongoose.connect(
  process.env.MONGODB_URL,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  } 
);
  
mongoose.connection.on("connected", function () {
  console.log("mongo db connected");
}); 

mongoose.set("useFindAndModify", false);
app.use("/api", userRoute);
app.use("/api",blogRoute);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
