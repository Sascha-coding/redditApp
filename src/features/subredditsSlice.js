import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getSubReddits } from "../api/snoowrap";

const options = {
    name:"subreddits",
    initialState:{
        subreddits:[],
        isLoading:false,
        error:false
    },
    reducers:{
        startGetSubreddits(state){
            state.isLoading = true;
            state.error = false;
        },
        getSubredditsSuccess(state, action){
            state.subreddits = action.payload;
            state.isLoading = false;
            state.error = false;
        },
        getSubredditsFailure(state){
            state.isLoading = false;
            state.error = true;
        }
    }
}
const subredditsSlice = createSlice(options);

export const fetchSubreddits = () => async (dispatch) => {
    try{
        dispatch(startGetSubreddits());
        const subreddits = await getSubReddits();
        dispatch(getSubredditsSuccess(subreddits));
    }catch(error){
        dispatch(getSubredditsFailure());
        console.log(error);
    }
}

const state = (state) => state;
const selectSubReddits = createSelector(state, (state) => state.subreddits.subreddits);

export {selectSubReddits}
export const {startGetSubreddits, getSubredditsSuccess, getSubredditsFailure} = subredditsSlice.actions;
export default subredditsSlice;

