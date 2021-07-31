const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const blogRouter = express.Router();
const Blog = require("../models/blog")

blogRouter.get("/getblogs",async(req,res)=>{
    try{
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    }catch(err){
        res.status(404).json(err);
    }
})

blogRouter.post("/createBlog",async(req,res)=>{
    try{
        const blog = new Blog({
            title:req.body.title,
            image:req.body.image,
            content:req.body.content,
        });
        await blog.save();
        res.status(200).json(blog);
    }catch(err){
        res.status(404).json(err);
    }
})
blogRouter.delete("/deleteBlog/:id",async(req,res)=>{
    try{
        const blog = await Blog.findByIdAndRemove(req.params.id);
        res.status(200).json(blog);
    }catch(err){
        res.status(404).json(err);
    }
})
blogRouter.put("/blog/comment/:id", async (req, res) => [
  Blog.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        comment: req.body.comment,
      },
    }
  ).then((result,err) => {
      try{
    res
      .json({
        updated_list: result,
      })
    }
    catch(err)
    {
      res.json(err);
    }
  }),
]);
blogRouter.put("/blog/likes/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id,(err,blog)=>{
        if(err){
            res.status(404).json(err); 
        }else{
            blog.likesCount = blog.likesCount + 1;
            blog.save();
            res.status(200).json(blog);
        }
    })
});

//update blog
blogRouter.put("/blog/:id",async(req,res)=>{
    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json(blog);
    }catch(err){
        res.status(404).json(err);
    }
})

module.exports = blogRouter;
