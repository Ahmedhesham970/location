const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/locations")
  .then(() => {
    console.log("Connected to the database successfully", {host:mongoose.connection.host});
  })
  .catch((error) => {
    console.error(`error in connect with database${error}`);
  });
