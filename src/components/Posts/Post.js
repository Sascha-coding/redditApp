import React, { useEffect, useState, useRef } from "react";
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
import { InView } from "react-intersection-observer";

function Post(props) {
  const [buttonText, setButtonText] = useState("Show");
  const selectedSubreddit = useSelector(subredditSelector);
  const posts = props.posts;
  const post = posts.filter((post) => post.permalink === props.permalink)[0];
  const selectedComments = useSelector(commentsSelector);
  const loading = useSelector(commentsState);
  const [comments, setComments] = useState(selectedComments);
  const dispatch = useDispatch();
  const [observerCreated, setObserverCreated] = useState(false);

  useEffect(() => {
    setComments(selectedComments);
    const found = props.allObservingArrayOfObservingObservers.filter(observer => observer.id === props.id)
    const element = document.getElementById(props.id);
    if (!observerCreated && found.length === 0) {
      const observer = new IntersectionObserver(() => props.SetIndex(props.id), { threshold: calculateThreshold(element.offsetHeight) });
      observer.id = props.id;
      observer.observe(element);
      props.allObservingArrayOfObservingObservers.push(observer)
      setObserverCreated(true);
    }else if(!observerCreated){
      const observer = found[0]
      observer.observe(element);
      props.allObservingArrayOfObservingObservers.push(observer)
    }else{
      props.setObserverCreated(true);
    }
    
  }, [posts]);
  
  function calculateThreshold(offsetHeight){
    const viewportHeight = window.innerHeight;
    const thresholdFactor = 1;
    const over = (viewportHeight - offsetHeight);
    let threshold = 0.9;
    if(over < 0){
      threshold = viewportHeight / (offsetHeight);
      threshold = 1 - threshold;
    }
    return threshold
  }

  

  const closeComments = () => {
    setButtonText("Show"); 
    dispatch(
      setShowCommentsForPost({ value: false, permalink: props.permalink, posts: posts, subreddit: selectedSubreddit })
    );
  };
  const openComments = async (permalink) => {
    const post = posts.filter((post) => post.permalink === permalink)[0]; 
    if (post.comments.length === 0) {
      dispatch(fetchComments(permalink,selectedSubreddit));
    } else {
      dispatch(
        setShowCommentsForPost({
          value: true,
          permalink: props.permalink,
          posts: posts,
          subreddit: selectedSubreddit,
        })
      );
    }
    setButtonText("Hide");
  };
  const savePostToDb = () => {
    props.savePost(post);
  }
  return (
    <>
      <div
        
        className={styles.post + " " + selectedSubreddit + " postElement"}
        onMouseOver={(e) => props.handleMouseEnter(props.id)}
      >
        <div id={props.id} className={styles.postContainer}>
          <h3 id={post.id} className={styles.postH3}>
            {post.title}
          </h3>

          <div className={styles.imgContainer}>
            {post.domain === "i.redd.it" ||
            post.domain === "v.redd.it" ? (
              !post.isVideo ? (
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
              )
            ) : (
              <>
                <p className={styles.selfText}>{post.selftext}</p>
              </>
            )}
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
              <button className={styles.openComments} onClick={() => savePostToDb()}>Save Post</button>
            </div>
            {post.showingComments ? (
              <div
                className={styles.commentList}
                id={post.id + "_commentList"}
              >
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
                    <div
                      className={styles.commentVoteDiv}
                    >
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
