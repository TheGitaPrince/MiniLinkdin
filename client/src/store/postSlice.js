import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axios.js"

export const createPost = createAsyncThunk('createPost', async (postData, { rejectWithValue }) => {
        try {
            const response = await  authAxios.post('/post/create',postData); 
            return  response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data );
        }
});

export const getAllPosts = createAsyncThunk('getAllPosts', async (_, { rejectWithValue }) => {
    try {
        const response = await authAxios.get("/post/get-post");
        return  response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});
 
export const getPostsByUser = createAsyncThunk('getPostsByUser', async (_, { rejectWithValue }) => {
    try {
        const response = await authAxios.get("/post/my-post");
        return  response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const updatePost = createAsyncThunk('updatePost', async ({ postId, content },{ rejectWithValue, dispatch }) => {
    try {
       const response = await authAxios.patch(`/post/${postId}`,{ content });
       return  response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const deletePost = createAsyncThunk('deletePost', async ({ postId },{ rejectWithValue, dispatch }) => {
    try {
       const response = await authAxios.delete(`/post/${postId}`);
       return null;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

const initialState = {
    posts: [],
    myPosts: [],
    loading: false,
    error: null
};

const postSlice = createSlice({
    name: "post",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.myPosts = action.payload;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getPostsByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPostsByUser.fulfilled, (state, action) => {
                 state.loading = false;
                 state.myPosts = action.payload;
            })
            .addCase(getPostsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.myPosts = action.payload;
            })           
            .addCase(updatePost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = null;
            })           
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
     },
});

export default postSlice.reducer;