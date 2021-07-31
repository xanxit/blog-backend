const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    likesCount:{
        type: Number,
        default:0
    },
    comment:{
        type: Array
    }

})
const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;