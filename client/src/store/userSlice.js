import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axios.js"

export const createUser = createAsyncThunk('createUser', async (userData, { rejectWithValue }) => {
        try {
            const response = await  authAxios.post('/users/create',userData); 
            return {
                user: response.data.data.user,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data );
        }
});

export const loginUser = createAsyncThunk('loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await authAxios.post("/users/login", userData);
         return {
                user: response.data.data.user,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
         };
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});
 
export const update = createAsyncThunk('update', async (userData, { rejectWithValue }) => {
    try {
        const response = await authAxios.patch("/users/update", userData);
         return  response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const logoutUser = createAsyncThunk('logoutUser', async (_,{ rejectWithValue, dispatch }) => {
    try {
       const response = await authAxios.post("/users/logout");
        return null;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(update.pending, (state) => {
                state.loading = true;
                state.error = null;
             })
             .addCase(update.fulfilled, (state, action) => {
                 state.loading = false;
                 state.user = action.payload;
                 localStorage.setItem("user", JSON.stringify(action.payload));
             })
             .addCase(update.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
             })
             .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            })           
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
            })
     },
});

export default userSlice.reducer;