'use strict';
let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let campgrounds = [
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
];

app.get("/", (req, res) => {
   res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds}); 
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image}; //gets from data, adds to campgrounds array
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, function () {
  console.log('The YelpCamp Server has started (on port 3000)!')
})