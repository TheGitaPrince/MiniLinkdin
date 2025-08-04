import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/generateToken.js"
import jwt from "jsonwebtoken";

export const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const existedUser = await UserModel.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists.");
  }

  const user = await UserModel.create({
      email,
      password,
  });
  
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const createdUser = await UserModel.findById(user._id).select("-password -refresh_token");

  const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }
    
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
        new ApiResponse(
            200, 
            {
                user: createdUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
   )
});

export const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Email and Password are required.");
    }
    
    const user = await UserModel.findOne({email});

    if(!user){
        throw new ApiError(401,"User not registered.");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if(!isPasswordValid){
        throw new ApiError(401,"Check your password.")
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    const loggedInUser = await UserModel.findById(user._id).select("-password -refresh_token")
    
    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
    
})

export const update = asyncHandler(async (req, res) => {
    const { name, bio } = req.body;
    
    if (!name && !bio) {
       throw new ApiError(400, "At least one field is required to update.");
    }
    
    const user = await UserModel.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    
    if (name) user.name = name;
    if (bio) user.bio = bio;
    
    await user.save({ validateBeforeSave: false });
    
    const updatedUser = await UserModel.findById(req.user._id).select("-password -refresh_token");
    
    return res.
            status(200)
            .json(new ApiResponse(
                    200,
                    updatedUser, 
                    "User details updated successfully."
                )
            );
});

export const logoutUser = asyncHandler(async (req,res) => {
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "unauthorized request.")
    }

    await UserModel.findByIdAndUpdate(
        userId,
        {
             $unset: { refresh_token: "" }
        },
        {
            new: true
        }
    )

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
})

export const refreshAccessToken = asyncHandler(async (req,res, next) => {
    const  incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken || 
          (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request.")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await UserModel.findById(decodedToken?._id)
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken.trim() !== user.refresh_token?.trim()) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
        
        const cookiesOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }
        
        return res
               .status(200)
               .cookie("accessToken", accessToken ,cookiesOptions)
               .cookie("refreshToken", refreshToken ,cookiesOptions)
               .json(new ApiResponse(200, {accessToken, refreshToken }, "Access token refreshed" ))
    }catch (error) {
       return next( new ApiError(401, error?.message || "Invalid refresh token"))
    }

})

