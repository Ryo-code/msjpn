'use strict';

const mongoose      = require("mongoose");
const Campground    = require("./models/campground");
const Comment       = require("./models/comment");

const data = [
    {
        name: "North Hill",
        image: "http://orig07.deviantart.net/be7a/f/2008/361/c/8/sp__the_camp_by_irethanari0n.jpg",
        description: "Oh god it's an anime version of South Park lol..."
    },
    {
        name: "Middle of Somewhere",
        image: "http://cdn.wallpapersafari.com/17/99/knHlCG.jpg",
        description: "We're not lost... totally!"
    },
    {
        name: "Sakura Park",
        image: "http://static.zerochan.net/Pixiv.Id.2993882.full.1591951.jpg",
        description: "Nice place to stop in the beginning of April"
    }
]

const seedDB = () => {
    //Wipe database (i.e. remove existing campgrounds)
    Campground.remove({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("Removed campgrounds!");
            
            //Create a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Successfully seeded a campground!");

                        //Create a seeded comment for each campground (they're the same for now, whatever)
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Paul Phister"
                            }, (err, comment) => {
                                if(err){
                                    console.log("A comment couldn't be created... ", err);
                                } else {
                                    campground.comments.push(comment); //Associate comment with corresponding campground's comment section
                                    campground.save(); //Save the campground with the new comment
                                    console.log("Created a new comment!", comment)
                                }
                            }
                        )
                    }
                })
            });
        }
    });
    

}

module.exports = seedDB;