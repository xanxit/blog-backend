const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const blogRouter = express.Router();
const Blog = require("../models/blog");

blogRouter.get("/getblogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(404).json(err);
  }
});
blogRouter.get("/getblog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json(blog);
  } catch (err) {
    res.status(404).json(err);
  }
});
blogRouter.get("/getcomments/:id", async (req, res) => {
  try {
    const comments = await Blog.findById(req.params.id);
    res.status(200).json(comments.comment);
  } catch (err) {
    res.status(404).json(err);
  }
});

blogRouter.post("/createBlog", async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      image: req.body.image,
      content: req.body.content,
    });
    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(404).json(err);
  }
});
blogRouter.delete("/deleteBlog", async (req, res) => {
    const blog = await Blog.deleteOne({ title: req.body.title }).then(function(){
    res.json("Data deleted"); // Success
}).catch(function(error){
    res.json(error); // Failure
});
});




blogRouter.put("/blog/comment/:id", async (req, res) => [
  Blog.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        comment: req.body.comment,
      },
    }
  ).then((result, err) => {
    try {
      res.json({
        updated_list: result,
      });
    } catch (err) {
      res.json(err);
    }
  }),
]);
blogRouter.put("/blog/likes/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.status(404).json(err);
    } else {
      blog.likesCount = blog.likesCount + 1;
      blog.save();
      res.status(200).json(blog);
    }
  });
});

//update blog
blogRouter.put("/blog", async (req, res) => {
    const blog = await Blog.findOne({title: req.body.title});
    if(req.body.image)
    {
      blog.image = req.body.image;
    }
    if(req.body.content)
    {
      blog.content = req.body.content;
    }
        try {
          blog.save();
        } catch (error) {
          res.json(error);
        }
        res.status(200).json({ message: "Blog updated successfully!" });
});

module.exports = blogRouter;
