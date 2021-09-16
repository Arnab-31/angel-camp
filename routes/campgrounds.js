var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")


//SHOW ALL CAMPGROUNDS

router.get("/",function(req,res)
{
    Campground.find({},function(err, allCampgrounds)
    {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
    })
})

//CREATE NEW CAMPGROUND

router.get("/new",middleware.isLoggedIn,function(req,res)
{
    res.render("campgrounds/new.ejs");
})

router.post("/",middleware.isLoggedIn,function(req,res)
{
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    Campground.create(newCampground, function(err, newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            req.flash("success", "Successfully created your Campground!")
            res.redirect("/campgrounds");
        }
    });
});

//SHOW A SPECIFIC CAMPGROUND

router.get("/:id",function(req,res)                 //Module(5) - Express.js
{
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)         //Module(6) - Mongo DB manipulation      
    {
        if(err)
            console.log(err);
        else
        {
            res.render("campgrounds/show",{campground: foundCampground, currentUser: req.user});
        } 
    })
});

//EDIT CAMPGROUND
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res)       
{
        Campground.findById(req.params.id, function(err, foundCampground)
        {
            if(req.user._id.equals(foundCampground.author.id))   
            {
                res.render("campgrounds/edit", {campground: foundCampground})
            }
        });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res)            //Module(5) - Express.js
{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground)        //Module(6) - Mongo DB manipulation      
    {
        if(err)
            res.redirect("/campgrounds");
        else
        {
            req.flash("success", "You have Successfully edited your Campground!");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
})

//Destroy Campground 

router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res)          //Module(5) - Express.js
{
    Campground.findByIdAndRemove(req.params.id, function(err)                        //Module(6) - Mongo DB manipulation      
    {
        if(err)
            res.redirect("/campgrounds");
        else
        {
            req.flash("success", "You have Successfully deleted your Campground!")
            res.redirect("/campgrounds");
        }
    })
})




module.exports=router;