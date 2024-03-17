
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import redditSlice from "../features/redditSlice.js";
import subredditsSlice from "../features/subredditsSlice.js";

const rootReducer = combineReducers({
    reddit: redditSlice.reducer,
    subreddits: subredditsSlice.reducer
})
const store = configureStore({
    reducer: rootReducer
})

export default store