//require modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const lodash = require("lodash");
const port = 3000;

//represent modules
const app = express();

//mongoose connect.
mongoose.connect("mongodb://localhost:27017/blogdb", { useNewUrlParser: true });

//use modules
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//create schema
const blogSchema = new mongoose.Schema({
  title: String,
  category: String,
  content: String,
});

const blogModel = mongoose.model("blog", blogSchema);

app
  .route("/admin")
  .post(function (request, response) {
    const title = request.body.title;
    const category = request.body.category;
    const content = request.body.content;

    const blog = new blogModel({
      title: title,
      category: category,
      content: content,
    });

    blog.save(function () {
      console.log("Saved Successfully");
      response.redirect("/admin");
    });
  })
  .get(function (request, response) {
    response.render("admin/admin");
  });

app.route("/admin/integrate").post(function(request, response){}).get(function(request, response){
  
  blogModel.find({}, function(error, foundData){
    if(error){
      console(error);
      response.redirect("/admin");
    }else{
      response.render("admin/integrate", {blogCard: foundData});
    }
  });
});

app.post("/delete", function(request, response){
  const deletePost = request.body.delete_btn;
  blogModel.findByIdAndRemove(deletePost, function(error){
    if(error){
      console.log(error);
      response.redirect("/admin");
    }else{
      console.log("Deleted Posts From Post");
      response.redirect("/admin/integrate");
    }
  });
});

app.post("/update", function(request, response){
  const title = request.body.title;
  const content = request.body.content;
  const blogId = request.body.edit_btn;
  blogModel.findByIdAndUpdate({blogId}, {title: title, content: content}, function(error){
    if(error){
      console.log(error);
      response.redirect("/admin/integrate");
    }else{
      console.log("Updated Successfully !!!");
      response.redirect("/admin");
    }
  });
});

app.get("/", function (request, response) {
  blogModel.find({}, function(error, foundPost){
    if(error){
      console.log(error);
      response.redirect("/");
    }else{
      response.render("users/home", {blogCard: foundPost});
    }
  });
});

app.get("/post/:info", function (request, response) {
  const postData = lodash.lowerCase(request.params.info);
  blogModel.find({title: postData}, function(error, foundPost){
    if(error){
      console.log(error);
      response.redirect("/");
    }else{
      response.render("users/index", {blogCard: foundPost});
    }
  });
});

app.get("/nav-link/:navData", function (request, response) {
  const navData = lodash.lowerCase(request.params.navData);
  blogModel.find({category: navData}, function(error, foundPost){
    if(error){
      console.log(error);
      response.redirect("/");
    }else{
      response.render("users/index", {blogCard: foundPost});
    }
  });
});

//listening port
app.listen(port, function () {
  console.log("Server has started on port", port.toLocaleString());
});
