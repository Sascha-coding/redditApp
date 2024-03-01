import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getPosts, getComments } from "../api/snoowrap.js";
import dateFormatter from "../functionality/dateFormatter.js";

const fetchComments = (permalink, subreddit) => async (dispatch) => {
  try {
    dispatch(startGetComments());
    const comments = await getComments(permalink);
    const more = comments.filter((comment) => comment.kind === "more");
    comments.splice(comments.indexOf(more[0]), 1);
    comments.map((comment) => {
      const text = comment.body;
      const regex =
        /\b((?:https?\:\/\/|www\.)(?!(?:[\[\]\(\)]|\\[\\\/]))[^\s\[\]\(\)]+)\b/gi;
      comment.body = text.replace(
        regex,
        " <a target='_blank' href='$1'>$1</a> "
      );
    });
    dispatch(
      getCommentsSuccess({
        comments: comments,
        permalink: permalink,
        subreddit: subreddit,
      })
    );
  } catch (error) {
    dispatch(getCommentsFailure());
    console.log(error);
  }
};

const fetchPosts = async (argObj) => {
  const { prefix, id, curPosts } = argObj;
    let count = 0;
    if (curPosts && curPosts.length > 0) {
      count = curPosts.length;
    }

    const result = await getPosts(prefix, id, count)
    const postsWithMetaData = curPosts ? [...curPosts] : [];
    for (let post of result) {
      const dateTime = dateFormatter(post.created * 1000);

      postsWithMetaData.push({
        ...post,
        comments: [],
        showingComments: false,
        loadingComments: false,
        errorComments: false,
        date: dateTime[0],
        time: dateTime[1],
      });
    }

    return {posts:postsWithMetaData, prefix:prefix};
};

const postsThunk = createAsyncThunk("reddit/postsThunk", fetchPosts);

const options = {
  name: "reddit",
  initialState: {
    selectedSubreddit: "/r/pics",
    searchTerm: "",
    posts: {
        '/r/pics': [],
    },
    initialPosts: {
        '/r/pics': [],
    },
    fittingPosts: [],
    DBPosts: [],
    comments: [],
    isLoading: false,
    error: false,
    commentsIsLoading: false,
    commentsError: false,
    closeAllComments: false,
    after: "",
    loadFromDb:false,
  },
  reducers: {
    setSelectedSubreddit(state, action) {
      state.selectedSubreddit = action.payload;
      state.searchTerm = "";
      state.loadFromDb = false;
    },
    initializeState(state,action) {
        const subreddits = action.payload;
        subreddits.map((subreddit) => {
            state.posts[subreddit.display_name_prefixed] = [];
            state.initialPosts[subreddit.display_name_prefixed] = [];
        })
        state.posts["DBPosts"] = [];
        state.initialPosts["DBPosts"] = [];
    },
    startGetComments(state) {
      state.commentsIsLoading = true;
      state.commentsError = false;
    },
    getCommentsSuccess(state, action) {
      const { comments, permalink, post, subreddit } = action.payload;
      let index = 0;

      comments.forEach((comment) => {
        const dateTime = dateFormatter(comment.created * 1000);
        comment.date = dateTime[0];
        comment.time = dateTime[1];
      });
      for (let post of state.posts[subreddit]) {
        if (post.permalink === permalink) {
          break;
        }
        index++;
      }
      state.comments = comments;
      state.posts[subreddit][index].comments = comments;
      state.posts[subreddit][index].showingComments = true;
      state.commentsIsLoading = false;
      state.commentsError = false;
    },
    getCommentsFailure(state) {
      state.commentsIsLoading = false;
      state.commentsError = true;
    },
    setShowCommentsForPost(state, action) {
      const { posts, permalink, value, subreddit } = action.payload;
      const post = posts.filter((post) => post.permalink === permalink)[0];
      posts.map((entry,index) => { entry.permalink === post.permalink ?  state.posts[subreddit][index].showingComments = value : null;})
    },
    toggleCloseAllComments(state) {
      const keys = Object.keys(state.posts)
      keys.map((key) => {
        state.posts[key].map((post,index) => {
          state.posts[key][index].showingComments = false;
        })
      });
      state.closeAllComments = false;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    searchPosts(state, action) {
      const { searchTerm,subreddit } = action.payload;
      if(subreddit === "returnToInitialqxyyyzq"){
        state.fittingPosts = [];
        return;
      }
      let foundPosts = [];
      state.fittingPosts = [];
      state.posts[subreddit].map((post, index) => {
        const fittingPost = {
          ...post,
        };
        if (post.showingComments === true) {
          const fittingComments = post.comments.filter((comment) =>
            comment.body.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (fittingComments.length > 0) {
            fittingPost.comments = fittingComments;
            foundPosts.push(fittingPost);
          }
        }
      });
      state.posts[subreddit].map((post, index) => {
        if (post.title.includes(searchTerm) && foundPosts.filter((fittingPost) => fittingPost.id === post.id).length === 0) {
          foundPosts.push(post);
        }
      });
      if(foundPosts.length === 0){
        state.fittingPosts = "No posts found";
      }else{
        state.fittingPosts = foundPosts;
      }
      state.searchTerm = "";
    },
    setPosts(state, action) {
      const { posts } = action.payload;
      state.posts["DB"] = posts;
      state.initialPosts = [];
      state.selectedSubreddit = "DB";
      state.loadFromDb = true;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(postsThunk.fulfilled, (state, action) => {
        const {posts,prefix} = action.payload;
        const after = posts[posts.length - 1].name; 
        state.posts[prefix] = posts;
        state.isLoading = false;
        state.error = false;
        state.fittingPosts = [];
        state.searchTerm = "";
        state.after = after;
        state.loadFromDb = false;
      })
      .addCase(postsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
      .addCase(postsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      });
  },
};

const selectedSubreddit = (state) => state.reddit.selectedSubreddit;
const posts = (subreddit) => (state) => {
    let posts = state.reddit.posts[subreddit];
    return posts;
};
const comments = (state) => state.reddit.comments;
const commentsAreLoading = (state) => state.reddit.commentsIsLoading;
const closeAllComments = (state) => state.reddit.closeAllComments;
const fittingPosts = (state) => state.reddit.fittingPosts;
const initialPosts = (subreddit) => (state) => {
    let posts = state.reddit.posts[subreddit];
    return posts;
}
const isLoading = (state) => state.reddit.isLoading;
const getAfter = (state) => (state.after ? state.reddit.after : null);
const loadFromDb = (state) => state.reddit.loadFromDb;
const postsSelector = createSelector(posts, (posts) => posts);
const subredditSelector = createSelector(
  selectedSubreddit,
  (selectedSubreddit) => selectedSubreddit
);
const commentsSelector = createSelector(comments, (comments) => comments);
const commentsState = createSelector(
  commentsAreLoading,
  (commentsAreLoading) => commentsAreLoading
);
const selectCloseAllComments = createSelector(
  closeAllComments,
  (closeAllComments) => closeAllComments
);
const fittingPostsSelector = createSelector(
  fittingPosts,
  (fittingPosts) => fittingPosts
);
const loadFromDbSelector = createSelector(
  loadFromDb,
  (loadFromDb) => loadFromDb
)
const isLoadingSelector = createSelector(isLoading, (isLoading) => isLoading);
const afterSelector = createSelector(getAfter, (getAfter) => getAfter);
const initialPostsSelector = createSelector(initialPosts, (initialPosts) => initialPosts);
const redditSlice = createSlice(options);

export {
  loadFromDbSelector,
  afterSelector,
  isLoadingSelector,
  fittingPostsSelector,
  selectCloseAllComments,
  postsSelector,
  subredditSelector,
  commentsSelector,
  initialPostsSelector,
  commentsState,
  postsThunk,
  fetchComments,
};
export const {
  setPosts,
  initializeState,
  toggleisLoading,
  searchPosts,
  setSearchTerm,
  toggleCloseAllComments,
  setShowCommentsForPost,
  removeComments,
  setSelectedSubreddit,
  startGetComments,
  getCommentsSuccess,
  getCommentsFailure,
} = redditSlice.actions;
export default redditSlice;

/*startGetPosts(state){
            state.isLoading = true;
            state.error = false;
        },
        getPostsSuccess(state, action){
            const {posts, after} = action.payload;
            state.posts = posts;
            state.isLoading = false;
            state.error = false;
            state.fittingPosts = [];
            state.searchTerm = "";
            state.after = after;
        },
        getPostsFailure(state){
            state.isLoading = false;
            state.error = true;
        },*/
