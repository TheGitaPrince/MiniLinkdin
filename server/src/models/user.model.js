import mongoose,{ Schema }  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name:{
        type: String,
        default: ""
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        default: ""
    },
    refresh_token:{
        type: String,
        default:""
    },
},{ timestamps: true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
     this.password = await bcrypt.hash(this.password,10)
     next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   if (!password || !this.password) {
       throw new Error("Missing password for comparison");
   }  
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id   
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const UserModel = mongoose.model("User",userSchema)