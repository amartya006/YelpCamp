var express= require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/yelpcampModel");
var Comment = require("../models/commentModel");
var middleware= require("../middleware")



router.get("/campground", function(req, res){
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err)
        } else{
            console.log(camps)
            res.render("campgrounds", {camps: camps})
        }
    })
    
    
});

//NEW
router.get("/campground/new",middleware.isLoggedIn, function(req,res){
    
    res.render("newCampground")
})

//SHOW
router.get("/campground/:id", function(req, res){
    var id = req.params.id
    Campground.findById(id).populate("comments").exec(function(err, campsData){
        if(err || !campsData){
            console.log(err)
            req.flash("error", "Something Went Wrong")
            res.redirect("/campground")
        } else{
            console.log(campsData)
            res.render("show", {campsData: campsData})
        }
    }) 
});

//CREATE
router.post("/campground",middleware.isLoggedIn , function(req, res){
    var name=req.body.name;
    var url = req.body.url;
    var desc= req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, url: url, description: desc , author: author};
    console.log(author);
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log(err);
        }
        else{
            console.log(camp)
            res.redirect("/campground")
        }
    })
    
});

//Edit Route
router.get("/campground/:id/edit",middleware.checkAuthorisation, function(req,res){
   Campground.findById(req.params.id, function(err,campgroundFound){
      if(err){
          console.log(err || !campgroundFound)
          req.flash("error", "Something Went Wrong")
          res.redirect("back");
      } else{
          res.render("edit", {campground: campgroundFound});
      }
   });
});

//UPDATE Route
router.put("/campground/:id", middleware.checkAuthorisation, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campgroundFound){
        if(err){
            console.log(err);
            res.redirect("/campground")
        } else{
            req.flash("success", "Successfully Edited Campground")
         res.redirect("/campground/"+ campgroundFound._id);
        }
    })
});


//DELETE ROUTE 
router.delete("/campground/:id",middleware.checkAuthorisation, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campground")
           
        }
    })
    
});


module.exports = router;