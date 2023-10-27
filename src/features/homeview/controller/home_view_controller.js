import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'
import client from '../../../helpers/client'
import { HOMEPAGEDETAIL_QUERY } from '../query/home_screen_query'
// First, create the thunk
export const getDashboardData = createAsyncThunk(
    'homeController/getDashboardData',
    async (params, thunkAPI) => {
        try {
            console.log("getDashbaordData");
            const loginToken = await EncryptedStorage.getItem("access_token")
            const response = await client(loginToken).query({
                query: HOMEPAGEDETAIL_QUERY,

            });
            console.log("what is the response data");
            console.log(response);
            console.log(response.data);
            return response;
        } catch (error) {

            return thunkAPI.rejectWithValue(error);

        }
    }
)

// Then, handle actions in your reducers:
const homeController = createSlice({
    name: 'homeController',
    initialState: { state: [], loading: false, error: "" },
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(getDashboardData.fulfilled, (state, action) => {

        })
    },
})



export default homeController.reducer