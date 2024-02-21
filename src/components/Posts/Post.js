import React, { useEffect, useState } from "react";
import styles from "./post.module.css";
import { UpVote, DownVote } from "../../data/upAndDownVote.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  postsSelector,
  commentsSelector,
  removeComments,
  commentsState,
  setShowCommentsForPost,
  subredditSelector,
} from "../../features/redditSlice.js";

function Post(props) {
  const [buttonText, setButtonText] = useState("Show");
  const selectedSubreddit = useSelector(subredditSelector);
  const posts = useSelector(postsSelector);
  const post = posts.find((post) => post.permalink === props.permalink);
  const selectedComments = useSelector(commentsSelector);
  const loading = useSelector(commentsState);
  const [comments, setComments] = useState(selectedComments);
  const dispatch = useDispatch();
  const [minWidth, setminWidth] = useState("0px");

  useEffect(() => {
    setComments(selectedComments);
    getWidths();  
  }, []);

  const closeComments = () => {
    setButtonText("Show");
    setComments([]);
    dispatch(removeComments({}));
    dispatch(
      setShowCommentsForPost({ value: false, post: post, posts: posts })
    );
  };
  const openComments = async (permalink) => {
    const post = posts.find((post) => post.permalink === permalink);
    if (post.comments.length === 0) {
      dispatch(fetchComments(permalink, posts));
    } else {
      dispatch(
        setShowCommentsForPost({
          value: true,
          post: post,
          posts: posts,
          comments: post[comments],
        })
      );
    }
    setButtonText("Hide");
  };

  const getWidths = () => {
    const postId = post.id;
    const minWidth = document.getElementById(postId).offsetWidth;
    setminWidth(minWidth + "px");
  }
  return (
    <>
      <div className={styles.post + " " + selectedSubreddit}>
        <div className={styles.postContainer}>
          <h3 className={styles.postH3}>{post.title}</h3>
          
          <div className={styles.imgContainer}>
            {post.domain === "i.redd.it" || post.domain === "v.redd.it" ? (!post.isVideo ? (
              <>
                <img className={styles.postImg} src={post.url} />
              </>
            ) : (
              <>
                <video
                  className={styles.postVid}
                  autoPlay="true"
                  preload="true"
                  controls
                >
                  <source src={post.url}></source>
                </video>
              </>
            )):
            <>
              <p className={styles.selfText}>{post.selftext}</p>
            </>}
            <div className={styles.postInfo}>
              <span className={styles.postAuthor}>
                {"Post created by: " +
                  post.author +
                  ", on: " +
                  post.date +
                  " at " +
                  post.time}
              </span>
              <div id={post.id} className={styles.voteDiv + " postUps"}>
                <button className={styles.voteButton}>
                  <UpVote />
                </button>
                <p className={styles.ups}>{post.ups}</p>
                <button className={styles.voteButton}>
                  <DownVote />
                </button>
              </div>
            </div>
          </div>
          <hr className={styles.HR}></hr>
          <div className={styles.commentsContainer}>
            <div className={styles.openCommentsContainer}>
              <button
                id={post.permalink}
                onClick={
                  buttonText === "Show"
                    ? (e) => openComments(e.target.id)
                    : (e) => closeComments(e.target.id)
                }
                className={styles.openComments}
              >
                {loading ? "Loading..." : buttonText + " comments"}
              </button>
            </div>
            {post.showingComments ? (
              <div className={styles.commentList} id={post.id + "_commentList"}>
                {post.comments.map((comment) => (
                  <div key={comment.id} className={styles.commentContainer}>
                    <span className={styles.commentSpan}>
                      {"Author: " + comment.author}
                    </span>
                    <span className={styles.commentSpan}>
                      {"On: " + comment.date + " at " + comment.time}
                    </span>
                    <p
                      className={styles.comment}
                      key={comment.id}
                      dangerouslySetInnerHTML={{ __html: comment.body }}
                    ></p>
                    <div className={styles.commentVoteDiv} style={{"min-width": minWidth}}>
                      <button className={styles.voteButton}>
                        <UpVote />
                      </button>
                      <p className={styles.ups}>{comment.ups}</p>
                      <button className={styles.voteButton}>
                        <DownVote />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
