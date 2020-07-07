var express= require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/yelpcampModel")
var Comment = require("../models/commentModel")
var middleware = require("../middleware")

//GET
router.get("/campground/:id/comments/new", middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else{
            console.log(campground)
            res.render("newComment", {campground: campground})
        }
    });
});

//POST
router.post("/campground/:id/comments",middleware.isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/"+ campground._id)
                }
            })
        }
    })
});

//EDIT Route

router.get("/campground/:id/comments/:commId/edit", middleware.checkCommentAuthorisation, function(req, res){
    Comment.findById(req.params.commId, function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    res.render("editComment", {comment: comment, campground_id: req.params.id})
                }
        });
    
});

router.put("/campground/:id/comments/:commId", middleware.checkCommentAuthorisation, function(req, res){
    Comment.findByIdAndUpdate(req.params.commId, req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else{
                    res.redirect("/campground/"+ req.params.id)
                }
            })
    });

router.delete("/campground/:id/comments/:commId", middleware.checkCommentAuthorisation, function(req, res){
    Comment.findByIdAndRemove(req.params.commId, function(err){
        if(err){
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("/campground/"+ req.params.id);
        }
    })
});





module.exports = router;