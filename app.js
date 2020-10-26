const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const app = express();

app.use(express.static("public"));
let items=["Buy Food"];
let workItems=[];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
  let today = new Date();
  
  let options ={
    weekday:"long",
    day:"numeric",
    month:"long",
  };
  let day = today.toLocaleDateString("en-US",options);
  res.render("list", {
    listTitle: day,
    newListItems:items
  });

});

app.post("/",(req,res) => {

  let item=req.body.listItem;
  if(req.body.list === "Work")
  {
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }
  
});

app.get("/work",(req,res) => {
  res.render("list", {
    listTitle:"Work List",
    newListItems:workItems
  });
});

app.get("/about",(req,res) => {
  res.render("about");
});

let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("Server is running on port " + port);
});
