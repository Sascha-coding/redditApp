import React from "react";
import styles from "./reddit.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postsSelector, subredditSelector, fetchPosts,toggleCloseAllComments,selectCloseAllComments, fittingPostsSelector} from "../../features/redditSlice.js";
import Post from "../Posts/Post.js";

function Reddit() {
  const dispatch = useDispatch();
  const posts = useSelector(postsSelector);
  const fittingPosts = useSelector(fittingPostsSelector);
  console.log(fittingPosts);
  const prefix = useSelector(subredditSelector);
  const closeAllComments = useSelector(selectCloseAllComments)

  useEffect(() => {
    if(closeAllComments){
        dispatch(toggleCloseAllComments({value:false}));
    }
    dispatch(fetchPosts(prefix));
  }, [dispatch, prefix]);
  return (
    <>
      <main className={styles.main}>
          <div className={styles.wrapper}>
            {fittingPosts.length > 0 ? fittingPosts.map((post) => (
              <Post key={post.id} permalink={post.permalink} />
            )):posts.map((post) => (
              <Post key={post.id} permalink={post.permalink} />
            ))}
          </div>
      </main>
    </>
  );
}

export default Reddit;
