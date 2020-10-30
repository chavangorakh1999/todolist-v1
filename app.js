const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter event"],
  },
});

const workItem = mongoose.model("workItem", itemSchema);
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to list",
});

const item2 = new Item({
  name: "Press + icon to add to Item",
});
const item3 = new Item({
  name: "Press - icon to delete to Item",
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("items inserted sucessfully");
        }
      });
      res.redirect("/");
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  let item = req.body.listItem;
  if (req.body.list === "Work") {
    workItem.create({name:item},(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("work item added sucessfully");
      }
    });
    res.redirect("/work");
  } else {
    Item.create({ name: item }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("item updated sucessfully");
      }
    });
    res.redirect("/");
  }
});
app.post("/delete",(req,res)=>{
  const deleteItemId=req.body.checkbox;
  if(workItem.exists(deleteItemId))
  {
    workItem.findByIdAndDelete(deleteItemId,(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("documnet deleted sucessfully");
      }
    });
    res.redirect('/work');
  }else{
    Item.findByIdAndDelete(deleteItemId,(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("documnet deleted sucessfully");
      }
    });
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  workItem.find((err, foundworkItems) => {
    if (foundworkItems.length === 0) {
      workItem.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted documnent sucessfully");
        }
      });
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render("list", {
          listTitle: "Work",
          newListItems: foundworkItems,
        });
      }
    }
  });
  
});

app.get("/about", (req, res) => {
  res.render("about");
});

let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("Server is running on port " + port);
});
