const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  var today = new Date();
  var presentDay = today.getDay();
  var day = "";
  var week=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    day = week[presentDay];
  res.render("list", {
    kindOfDay: day,
  });

});

var port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("Server is running on port " + port);
});
