import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  getPosts,
  getComments,
  sendVote,
  getRandomSubmissions,
} from "../api/snoowrap.js";
import { listformatter } from "../functionality/listFormatter.js";

const fetchRandomPosts = async (argsObj) => {
  let { posts, init } = argsObj;
  let response;
  try {
    if (init) {
      response = await getRandomSubmissions([], init);
      const result = await listformatter([response], "posts", 0, 1);
      return { rndPosts: result };
    } else {
      let newPosts = [...posts];
      response = await getRandomSubmissions(posts.length, init);
      let result = await listformatter(response, "posts", 0, 25 - posts.length);
      result = newPosts.concat(result);
      return { rndPosts: result };
    }
  } catch (error) {
    console.log(error);
  }
};
const randomPostsThunk = createAsyncThunk(
  "reddit/randomPostsThunk",
  fetchRandomPosts
);

const fetchComments = async (argObj) => {
  const { id, permalink, subreddit } = argObj;
  let commentsWithMetaData;
  try {
    const comments = await getComments(id);
    commentsWithMetaData = await listformatter(comments, "comments");
  } catch (error) {}
  return {
    comments: commentsWithMetaData,
    permalink: permalink,
    subreddit: subreddit,
  };
};
const commentsThunk = createAsyncThunk("reddit/commentsThunk", fetchComments);

const fetchPosts = async (argObj) => {
  try {
    const { prefix, posts, more, sorting } = argObj;
    if (prefix === "DB" || prefix === "DBPosts") {
      return;
    }
    const newPosts = [...posts];
    let result = await getPosts(prefix, posts, more, sorting);
    let addedPosts
    if(more === true){
      addedPosts = await listformatter(result, "posts", posts.length, posts.length + 25);
    }else{
      addedPosts = await listformatter(result, "posts", 0, 25);
    }
    let finalPosts = newPosts.concat(addedPosts);
    finalPosts["list"] = addedPosts.list;
    console.log("finalPosts", finalPosts);
    /*let list = [...result];
    let startIndex, endIndex;
    if (more === true) {
      startIndex = posts.list.length;
      endIndex = result.length;
      
    } else {
      startIndex = 0;
      endIndex = result.length;
      
      console.log("posts = ", posts);
      console.log("list = ", list);
      console.log("posts['list'] = ", posts["list"]);
    }
    const postsWithAddedList = await listformatter(
      result,
      "posts",
      startIndex,
      endIndex,
      posts
    );
    if(more === true){
      postsWithAddedList["list"] = posts.list.concat(list);
    }else{
      postsWithAddedList["list"] = list;
    }*/

    return { posts: finalPosts, prefix: prefix};
  } catch (error) {
    console.log(error);
  }
};

const postsThunk = createAsyncThunk("reddit/postsThunk", fetchPosts);

const updateThing = async (argObj) => {
  const { postId, vote, type, thing, subreddit, commentId } = argObj;
  const id = commentId !== undefined ? commentId : postId;
  const result = await sendVote(id, vote, type, thing);
  return {
    thing: result,
    subreddit: subreddit,
    postId: postId,
    commentId: commentId,
  };
};
const updatePostThunk = createAsyncThunk("reddit/updatePostThunk", updateThing);
const updateCommentThunk = createAsyncThunk(
  "reddit/updateCommentThunk",
  updateThing
);
const options = {
  name: "reddit",                           // Name of the Redux slice
  initialState: {                           // Initial state object
    selectedSubreddit: "/r/Home",           // Current selected subreddit
    searchTerm: "",                         // Search term
    posts: {                                // Object containing posts for each subreddit
      "/r/Home": [],                        // Initial posts for the "/r/Home" subreddit
    },
    initialPosts: {                         // Object containing initial posts for each subreddit
      "/r/Home": [],                        // Initial posts for the "/r/Home" subreddit
    },
    randomPosts: [],                        // Array for random posts
    fittingPosts: [],                       // Array for fitting posts
    DBPosts: [],                            // Array for indexDB posts
    isLoading: false,                       // Loading state indicator
    error: false,                           // Error state indicator
    commentsIsLoading: false,               // Loading state indicator for comments
    commentsError: false,                   // Error state indicator for comments
    closeAllComments: false,                // Indicator to close all comments
    loadFromDb: false,                      // Indicator to load posts from database
  },
  reducers: {
    setInitialSubreddit(state, action) {
      const { initialSubreddit } = action.payload;
      state.selectedSubreddit = initialSubreddit;
    },
    setSelectedSubreddit(state, action) {
      state.selectedSubreddit = action.payload.value;
      state.searchTerm = "";
      state.loadFromDb = false;
    },
    initializeState(state, action) {
      const subreddits = action.payload;
      state.selectedSubreddit = subreddits[0].display_name_prefixed;
      subreddits.map((subreddit) => {
        state.posts[subreddit.display_name_prefixed] = [];
        state.initialPosts[subreddit.display_name_prefixed] = [];
      });
      state.posts["DBPosts"] = [];
      state.initialPosts["DBPosts"] = [];
    },

    setShowCommentsForPost(state, action) {
      const { permalink, value, subreddit } = action.payload;
      state.posts[subreddit].map((entry, index) => {
        entry.permalink === permalink
          ? (state.posts[subreddit][index].showingComments = value)
          : null;
      });
    },
    toggleCloseAllComments(state) {
      const keys = Object.keys(state.posts);
      keys
        ? keys.map((key) => {
            state.posts[key] !== null
              ? state.posts[key].map((post, index) => {
                  state.posts[key][index].showingComments = false;
                })
              : null;
          })
        : null;
      state.closeAllComments = false;
    },
    setSearchTerm(state, action) {
      if (action.payload.searchTerm === false) {
        state.fittingPosts = [];
        state.searchTerm = "";
      } else {
        state.searchTerm = action.payload.searchTerm;
      }
    },
    searchPosts(state, action) {
      const { searchTerm, subreddit } = action.payload;
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
        if (
          post.title.includes(searchTerm) &&
          foundPosts.filter((fittingPost) => fittingPost.id === post.id)
            .length === 0
        ) {
          foundPosts.push(post);
        }
      });
      if (foundPosts.length === 0) {
        state.fittingPosts = "No posts found";
      } else {
        state.fittingPosts = foundPosts;
      }
      state.searchTerm = "";
    },
    setPostsToDB(state, action) {
      const { posts } = action.payload;
      state.posts["DB"] = posts;
      state.loadFromDb = true;
    },
    setPostSaved(state, action) {
      const { id, subreddit, saved } = action.payload;
      state.DBPosts = state.DBPosts.filter((post) => post.id !== id);
      state.posts[subreddit].map((post, index) => {
        if (post.id === id) {
          state.posts[subreddit][index].saved = saved;
        }
      });
    },
    loadingUpdate(state) {
      state.isLoading = !state.isLoading;
    },
    removeFirstRndPost(state) {
      state.randomPosts.shift();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(postsThunk.fulfilled, (state, action) => {
        const posts = action.payload ? action.payload.posts : null;
        const prefix = action.payload ? action.payload.prefix : null;
        state.posts[prefix] = posts;
        state.isLoading = false;
        state.error = false;
        state.fittingPosts = [];
        state.searchTerm = "";
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
    builder
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const { thing, subreddit, postId } = action.payload;
        state.posts[subreddit].map((entry, index) => {
          if (entry.id === postId) {
            state.posts[subreddit][index] = thing;
          }
        });
      })
      .addCase(updatePostThunk.rejected, (state) => {
        //error handling
      });
    builder
      .addCase(commentsThunk.pending, (state) => {
        state.commentsIsLoading = true;
        state.commentsError = false;
      })
      .addCase(commentsThunk.fulfilled, (state, action) => {
        const { comments, permalink, subreddit } = action.payload;
        let index = 0;
        for (let post of state.posts[subreddit]) {
          if (post.permalink === permalink) {
            break;
          }
          index++;
        }
        state.posts[subreddit][index].comments = comments;
        state.posts[subreddit][index].showingComments = true;
        state.commentsIsLoading = false;
        state.commentsError = false;
      })
      .addCase(commentsThunk.rejected, (state) => {
        state.commentsIsLoading = false;
        state.commentsError = true;
      });
    builder.addCase(updateCommentThunk.fulfilled, (state, action) => {
      const { thing, subreddit, postId, commentId } = action.payload;
      state.posts[subreddit].map((entry1, index1) => {
        if (entry1.id === postId) {
          state.posts[subreddit][index1].comments.map((entry2, index2) => {
            if (entry2.id === commentId) {
              state.posts[subreddit][index1].comments[index2] = thing;
            }
          });
        }
      });
    });
    builder.addCase(randomPostsThunk.fulfilled, (state, action) => {
      const { rndPosts } = action.payload;
      state.randomPosts = rndPosts;
    });
  },
};

const selectedSubreddit = (state) => state.reddit.selectedSubreddit;
const posts = (subreddit) => (state) => {
  let posts = state.reddit.posts[subreddit];
  return posts;
};
const post = (subreddit, id) => (state) => {
  let post = state.reddit.posts[subreddit].filter((post) => post.id === id)[0];
  return post;
};
const comments = (state) => state.reddit.comments;
const commentsAreLoading = (state) => state.reddit.commentsIsLoading;
const closeAllComments = (state) => state.reddit.closeAllComments;
const fittingPosts = (state) => state.reddit.fittingPosts;
const initialPosts = (subreddit) => (state) => {
  let posts = state.reddit.posts[subreddit];
  return posts;
};
const isLoading = (state) => state.reddit.isLoading;
const loadFromDb = (state) => state.reddit.loadFromDb;
const randomPosts = (state) => state.reddit.randomPosts;
const postsSelector = createSelector(posts, (posts) => posts);
const postSelector = createSelector(post, (post) => post);
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
);
const isLoadingSelector = createSelector(isLoading, (isLoading) => isLoading);
const initialPostsSelector = createSelector(
  initialPosts,
  (initialPosts) => initialPosts
);
const randomPostsSelector = createSelector(
  randomPosts,
  (randomPosts) => randomPosts
);

const redditSlice = createSlice(options);
export {
  randomPostsSelector,
  loadFromDbSelector,
  isLoadingSelector,
  fittingPostsSelector,
  selectCloseAllComments,
  postsSelector,
  postSelector,
  subredditSelector,
  commentsSelector,
  initialPostsSelector,
  commentsState,
  postsThunk,
  randomPostsThunk,
  updatePostThunk,
  updateCommentThunk,
  commentsThunk,
};
export const {
  setPostsToDB,
  setPostSaved,
  initializeState,
  toggleisLoading,
  searchPosts,
  setSearchTerm,
  toggleCloseAllComments,
  setShowCommentsForPost,
  removeComments,
  removedPostFromDb,
  setSelectedSubreddit,
  startGetComments,
  getCommentsSuccess,
  getCommentsFailure,
  loadingUpdate,
  removeFirstRndPost,
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
