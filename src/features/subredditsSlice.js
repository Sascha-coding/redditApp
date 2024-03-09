import { createSlice, createSelector, createAsyncThunk, } from "@reduxjs/toolkit";
import { getSubReddits, browseSubreddits, subscribeSubreddit } from "../api/snoowrap";
import { listformatter } from "../functionality/listFormatter";

import dateFormatter from "../functionality/dateFormatter";

const browseSubredditCategorys = async (argsObj) => {
    const { subredditList, after } = argsObj
    console.log(after +"= after");
    const response = await browseSubreddits(after);
    console.log("browseSubreddits", response);
    let result = await listformatter(response, "subreddits");
    console.log("browseSubreddits", result);
    if(after !== ""){
        console.log("yup");
        let finalArr = await subredditList.concat(result);
        console.log("yup2");
        console.log("browseSubreddits", finalArr)
        return {list: finalArr};
    }else{
        return {list: result};
    }
}
const browseSubredditCategorysThunk = createAsyncThunk(
    "subreddits/browseSubredditsThunk",
    browseSubredditCategorys
);
const addSubreddit = async(argsObj) => {
    const {name, type} = argsObj;
    const result = await subscribeSubreddit(name,type);
    console.log(result);
    const formattedSubreddit = await listformatter([result], "subreddits");
    console.log(formattedSubreddit);
    return({subreddit: formattedSubreddit[0], type: type});
}
const addSubredditThunk = createAsyncThunk(
    "subreddits/addSubredditThunk",
    addSubreddit
)

const options = {
    name:"subreddits",
    initialState:{
        subreddits:[],
        subredditsList:[],
        isLoading:false,
        error:false
    },
    reducers:{
        startGetSubreddits(state){
            state.isLoading = true;
            state.error = false;
        },
        getSubredditsSuccess(state, action){
            const subreddits = action.payload.map(subreddit => ({
                id: subreddit.id,
                display_name: subreddit.display_name,
                display_name_prefixed: subreddit.display_name_prefixed,
                icon_image: subreddit.icon_img
            }))
            state.subreddits = subreddits;
            state.isLoading = false;
            state.error = false;
        },
        getSubredditsFailure(state){
            state.isLoading = false;
            state.error = true;
        },
        addSubreddit(state, action){
            state.subreddits.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(browseSubredditCategorysThunk.fulfilled, (state, action) => {
                const { list } = action.payload;
                console.log(list);
                state.subredditsList = list;
                state.isLoading = false;
                state.error = false;
            })
            .addCase(browseSubredditCategorysThunk.rejected, (state) => {
                state.isLoading = false;
                state.error = true;
            })
            .addCase(browseSubredditCategorysThunk.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
        builder
            .addCase(addSubredditThunk.fulfilled, (state, action) => {
                const { subreddit, type } = action.payload;
                console.log(subreddit);
                if(type === "subscribe"){
                    state.subreddits.push(subreddit);
                }else{
                    state.subreddits = state.subreddits.filter(sub => sub.display_name !== subreddit.display_name)
                }
                
                
            })
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
const subredditsListSelector = createSelector(state, (state) => state.subreddits.subredditsList);
const selectSubReddits = createSelector(state, (state) => state.subreddits.subreddits);
const isLoadingSelector = createSelector(state, (state) => state.subreddits.isLoading);

export {selectSubReddits,addSubredditThunk, browseSubredditCategorysThunk, subredditsListSelector, isLoadingSelector};
export const {startGetSubreddits, getSubredditsSuccess, getSubredditsFailure} = subredditsSlice.actions;
export default subredditsSlice;

