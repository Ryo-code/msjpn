//SCHEMA SETUP (note: schema is the structure/organization of a database)
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Campground = mongoose.model("Campground", campgroundSchema); //This line turns the schema (ie. blueprint) of what a campground is, and compiles it into a model which has a bunch of methods like .find() and .create()
