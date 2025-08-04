import { PostModel } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if(!content){
        throw new ApiError(400, "Post content required.");
    }

    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized");

    const post = await PostModel.create({
        content,
        author: userId 
    });

    return res.status(201).json(new ApiResponse(201, post, "Post created successfully."));
})

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await PostModel
        .find()
        .populate("author", "name email bio _id")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully."));
});
 
export const getPostsByUser = asyncHandler(async (req, res) => {
    const userId =  req.user?._id

    const posts = await PostModel
        .find({ author: userId })
        .populate("author", "name email _id")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, posts, "User posts fetched successfully."));
});

export const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId =  req.user?._id;

    if (!postId) {
        throw new ApiError(400, "PostId required for update.");
    }

    if (!content) {
        throw new ApiError(400, "Post content required for update.");
    }

    const post = await PostModel.findById(postId);
    if (!post){ 
        throw new ApiError(400, "Post not found.");
    }
                                
    if (post.author.toString() !== userId.toString()) {
        throw new ApiError(401, "Not authorized to edit this post");
    }

    post.content = content;
    await post.save();

    await post.populate("author", "name email _id");

    return res.status(200).json(new ApiResponse(200, post, "Post updated successfully."));
});

export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId =  req.user?._id;

    if (!postId) {
        throw new ApiError(400, "PostId required for update.");
    }
    
    const post = await PostModel.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    if (post.author.toString() !== userId.toString()) {
        throw new ApiError(403, "Not authorized to delete this post");
    }

    await post.deleteOne();

    return res.status(200).json( new ApiResponse(200, {}, "Post deleted successfully."));
});