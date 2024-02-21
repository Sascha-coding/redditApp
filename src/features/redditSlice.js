import { createSlice,createSelector} from "@reduxjs/toolkit";
import { getPosts,getComments } from "../api/snoowrap.js";
import dateFormatter from "../functionality/dateFormatter.js";


const options = {
    name:"reddit",
    initialState:{
        selectedSubreddit:"/r/pics",
        searchTerm:"",
        posts:[],
        fittingPosts:[],
        comments:[],
        isLoading:false,
        error:false,
        commentsIsLoading:false,
        commentsError:false,
        closeAllComments:false,
    },
    reducers:{
        setSelectedSubreddit(state, action,){
            state.selectedSubreddit = action.payload;
            state.searchTerm="";
        },
        startGetPosts(state){
            state.isLoading = true;
            state.error = false;
        },
        getPostsSuccess(state, action){
            console.log(action.payload);
            state.posts = action.payload;
            state.isLoading = false;
            state.error = false;
            state.fittingPosts = [];
            state.searchTerm = "";
        },
        getPostsFailure(state){
            state.isLoading = false;
            state.error = true;
        },
        startGetComments(state){
            state.commentsIsLoading = true;
            state.commentsError = false;
        },
        getCommentsSuccess(state, action){
            const {comments, permalink, posts, more} = action.payload;
            let index = 0;
            
            comments.forEach(comment => {
                const dateTime = dateFormatter(comment.created*1000);
                comment.date = dateTime[0]
                comment.time = dateTime[1]
            })
            for(let post of posts){
                if(post.permalink === permalink){
                    break;
                }
                index++;
            }
            state.comments = comments;
            state.posts[index].comments = comments;
            state.posts[index].showingComments = true;
            state.commentsIsLoading = false;
            state.commentsError = false;
        },
        getCommentsFailure(state){
            state.commentsIsLoading = false;
            state.commentsError = true;
        },
        removeComments(state){
            state.comments = [];
        },
        setShowCommentsForPost(state, action){
            const {posts, post , value, comments} = action.payload;
            const index = posts.indexOf(post);
            if(value){
                state.comments.length > 0 ? state.comments = [] : state.comments = comments
            }
            state.posts[index].showingComments = value;
            comments ? state.posts[index].comments = comments : state.posts[index].comments = [];
        },
        toggleCloseAllComments(state,action){
            const {value} = action.payload;
            state.posts.map((post,index) => {state.posts[index].showingComments = false});
            state.closeAllComments = value;
        },
        setSearchTerm(state, action){
            state.searchTerm = action.payload;
        },
        searchPosts(state, action){
            const {searchTerm} = action.payload;
            state.fittingPosts = [];
            state.posts.map((post,index) => {
                const fittingPost = {
                    ...post
                }
                if(post.showingComments === true){
                    const fittingComments = post.comments.filter(comment => comment.body.toLowerCase().includes(searchTerm.toLowerCase()))
                    if(fittingComments.length > 0){
                        fittingPost.comments = fittingComments;
                        state.fittingPosts[index] = fittingPost;
                    }
                }  
            })
            state.posts.map((post,index) => {
                if(post.title.includes(searchTerm) && state.fittingPosts.filter(fittingPost => fittingPost.id === post.id).length === 0){
                     state.fittingPosts[index] = post;
                }
            })      
            state.searchTerm = "";
        }
    }
}



const fetchPosts = (prefix) => async (dispatch) => {
    try{
        dispatch(startGetPosts());
        const posts = await getPosts(prefix);
        
        const postsWithMetaData = [];
        
        for(let post of posts){
            const dateTime = dateFormatter(post.created*1000)
           
            postsWithMetaData.push({...post,
            comments:[],
            showingComments: false,
            loadingComments: false,
            errorComments: false,
            date:dateTime[0],
            time:dateTime[1]
        })
        };
        dispatch(getPostsSuccess(postsWithMetaData));
    }catch(error){
        dispatch(getPostsFailure());
        console.log(error);
    }
}


const fetchComments = (permalink, posts) => async (dispatch) => {
    try{
        dispatch(startGetComments());
        const comments = await getComments(permalink);
        const more = comments.filter(comment => comment.kind === "more");
        comments.splice(comments.indexOf(more[0]), 1);
        comments.map((comment) => {
            const text = comment.body;
            const regex = /\b((?:https?\:\/\/|www\.)(?!(?:[\[\]\(\)]|\\[\\\/]))[^\s\[\]\(\)]+)\b/gi;
            comment.body = text.replace(regex, " <a target='_blank' href='$1'>$1</a> ");
        })
        dispatch(getCommentsSuccess({
            comments:comments,
            permalink:permalink,
            posts:posts,
            more:more,
        }));
    }catch(error){
        dispatch(getCommentsFailure());
        console.log(error);
    }
}

const selectedSubreddit = (state) => state.reddit.selectedSubreddit;
const posts = (state) => state.reddit.posts;
const comments = (state) => state.reddit.comments;
const commentsAreLoading = (state) => state.reddit.commentsIsLoading;
const closeAllComments = (state) => state.reddit.closeAllComments;
const fittingPosts = (state) => state.reddit.fittingPosts;
const postsSelector = createSelector(posts, (posts) => posts);
const subredditSelector = createSelector(selectedSubreddit, (selectedSubreddit) => selectedSubreddit);
const commentsSelector = createSelector(comments, (comments) => comments);
const commentsState = createSelector(commentsAreLoading, (commentsAreLoading) => commentsAreLoading);
const selectCloseAllComments = createSelector(closeAllComments, (closeAllComments) => closeAllComments);
const fittingPostsSelector = createSelector(fittingPosts, (fittingPosts) => fittingPosts);

const redditSlice = createSlice(options);

export {fittingPostsSelector, selectCloseAllComments, postsSelector, subredditSelector, commentsSelector,commentsState, fetchPosts, fetchComments}
export const {searchPosts, setSearchTerm, toggleCloseAllComments, setShowCommentsForPost, removeComments, setSelectedSubreddit, startGetPosts, getPostsSuccess, getPostsFailure,getSelectedSubreddit, startGetComments, getCommentsSuccess, getCommentsFailure} = redditSlice.actions
export default redditSlice

