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

// List Schema

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [itemSchema],
});

const List = mongoose.model("List", listSchema);

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
  let itemName = req.body.listItem;
  let listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if(listName === "Today"){
    
    item.save();

    res.redirect("/");
  }else{
    List.findOne({name:listName},(err,foundList)=>{
      foundList.items.push(item);
      foundList.save();
    });
    res.redirect("/"+listName);;
  }
  
});


app.post("/delete", (req, res) => {
  const deleteItemId = req.body.checkbox;
  const listTitle = req.body.listTitle;

  if(listTitle==="Today"){
    Item.findByIdAndDelete(deleteItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("documnet deleted sucessfully");
      }
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:deleteItemId}}},(err,foundList)=>{
      if(!err){
        res.redirect("/"+listTitle);
      }
     
    });
  }

  
  
});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (foundList) {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      } else {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    } else {
      console.log(err);
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
