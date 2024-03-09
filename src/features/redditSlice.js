import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getPosts, getComments, sendVote } from "../api/snoowrap.js";
import { listformatter } from "../functionality/listFormatter.js";
//links im post selftext ändern;

const fetchComments = async (argObj) => {
  const { id, permalink, subreddit } = argObj;
  let commentsWithMetaData;
  try {
    const comments = await getComments(id);
    commentsWithMetaData = await listformatter(comments, "comments");
  } catch (error) {
  }
  return {
    comments: commentsWithMetaData,
    permalink: permalink,
    subreddit: subreddit,
  };
};
const commentsThunk = createAsyncThunk("reddit/commentsThunk", fetchComments);

const fetchPosts = async (argObj) => {
  try {
    const { prefix, posts, more } = argObj;
    if(prefix === "DB" || prefix === "DBPosts"){
      return; 
    }

    let result = await getPosts(prefix, posts, more,);

    let startIndex, endIndex;
    if (more === true) {
      startIndex = posts.list.length;
      endIndex = result.length;
    } else {
      startIndex = 0;
      endIndex = result.length;
      posts["list"] = result;
    }
    const postsWithAddedList = await listformatter(
      result,
      "posts",
      startIndex,
      endIndex,
      posts
    );
    let finalPosts = posts ? [...posts] : [];
    finalPosts.splice(finalPosts.length, 1);
    finalPosts = finalPosts.concat(postsWithAddedList);
    return { posts: finalPosts, prefix: prefix, list: result };
  } catch (error) {
    console.log(error);
  }
 
};

const postsThunk = createAsyncThunk("reddit/postsThunk", fetchPosts);

const updateThing = async (argObj) => {
  const { postId, vote, type, thing, subreddit, commentId } = argObj;
  const prevVotes = thing.ups;
  const prevLikes = thing.likes;
  const id = commentId !== undefined ? commentId : postId;
  const result = await sendVote(id, vote, type, thing);
  return {
    thing: result,
    subreddit: subreddit,
    postId: postId,
    commentId: commentI
  };
};
const updatePostThunk = createAsyncThunk("reddit/updatePostThunk", updateThing);
const updateCommentThunk = createAsyncThunk(
  "reddit/updateCommentThunk",
  updateThing
);
const options = {
  name: "reddit",
  initialState: {
    selectedSubreddit: "r/worldnews",
    searchTerm: "",
    posts: {
      "r/worldnews": [],
    },
    initialPosts: {
      "r/worldnews": [],
    },
    fittingPosts: [],
    DBPosts: [],
    isLoading: false,
    error: false,
    commentsIsLoading: false,
    commentsError: false,
    closeAllComments: false,
    after: "",
    loadFromDb: false,
  },
  reducers: {
    setSelectedSubreddit(state, action) {
      state.selectedSubreddit = action.payload.value;
      state.searchTerm = "";
      state.loadFromDb = false;
    },
    initializeState(state, action) {
      const subreddits = action.payload;
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
      keys ? keys.map((key) => {
        key !== null ? state.posts[key].map((post, index) => {
          state.posts[key][index].showingComments = false;
        }):null;
      }):null;
      state.closeAllComments = false;
    },
    setSearchTerm(state, action) {
      const searchTerm = action.payload.searchTerm;
      if (action.payload === "") {
        state.fittingPosts = [];
        state.searchTerm = "";
      } else {
        state.searchTerm = action.payload;
      }
    },
    searchPosts(state, action) {
      const { searchTerm, subreddit } = action.payload;
      if (subreddit === "returnToInitialqxyyyzq") {
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(postsThunk.fulfilled, (state, action) => {
        const posts = action.payload ? action.payload.posts : null;
        const prefix = action.payload ? action.payload.prefix : null;
        const list = action.payload ? action.payload.list : null;
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
const getAfter = (state) => (state.after ? state.reddit.after : null);
const loadFromDb = (state) => state.reddit.loadFromDb;
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
const afterSelector = createSelector(getAfter, (getAfter) => getAfter);
const initialPostsSelector = createSelector(
  initialPosts,
  (initialPosts) => initialPosts
);
const redditSlice = createSlice(options);

export {
  loadFromDbSelector,
  afterSelector,
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
