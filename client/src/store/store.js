import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import postSlice from "./postSlice.js"

export const store = configureStore({
    reducer:{
        auth: userSlice,
        post: postSlice,
    }
})