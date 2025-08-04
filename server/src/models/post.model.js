import mongoose,{ Schema }  from "mongoose";

const postSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
},{ timestamps: true});

export const PostModel = mongoose.model("Post", postSchema);