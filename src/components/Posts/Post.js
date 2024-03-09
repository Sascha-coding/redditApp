import React, { useEffect, useState, useRef } from "react";
import styles from "./post.module.css";
import { UpVote, DownVote } from "./Vote/vote.js";
import { useDispatch, useSelector } from "react-redux";
import {
  removedPostFromDb,
  postSelector,
  commentsState,
  setShowCommentsForPost,
  subredditSelector,
  updatePostThunk,
  updateCommentThunk,
  commentsThunk,
} from "../../features/redditSlice.js";
import { Comment } from "./Comment/comment.js";


function Post(props) {
  const [buttonText, setButtonText] = useState("Show");
  const selectedSubreddit = useSelector(subredditSelector);
  let post = useSelector(postSelector(selectedSubreddit, props.post.id));
  //let [post, setPost] = useState(posts.filter((post) => post.permalink === props.permalink)[0]);
  let promise = false;
  const loading = useSelector(commentsState);
  const dispatch = useDispatch();
  const [observerCreated, setObserverCreated] = useState(false);
  const [postIsDeleted, setPostIsDeleted] = useState(false);
  const [playerInitiated, setPlayerInitiated] = useState(false);

  useEffect(() => {
    const found = props.allObservingArrayOfObservingObservers.filter(
      (observer) => observer.id === props.id
    );
    const element = document.getElementById(props.id);
    if (!observerCreated && found.length === 0) {
      const observer = new IntersectionObserver(
        () => props.SetIndex(props.id),
        { threshold: calculateThreshold(element.offsetHeight) }
      );
      observer.id = props.id;
      observer.observe(element);
      props.allObservingArrayOfObservingObservers.push(observer);
      setObserverCreated(true);
    } else if (!observerCreated) {
      const observer = found[0];
      observer.observe(element);
      props.allObservingArrayOfObservingObservers.push(observer);
    } else {
      props.setObserverCreated(true);
    }
    if(post.domain !== "i.redd.it", post.domain !== "v.redd.it"){
    }
  }, [post]);

  function calculateThreshold(offsetHeight) {
    const viewportHeight = window.innerHeight;
    const thresholdFactor = 1;
    const over = viewportHeight - offsetHeight;
    let threshold = 0.9;
    if (over < 0) {
      threshold = viewportHeight / offsetHeight;
      threshold = 1 - threshold;
    }
    return threshold;
  }

  const handleVote = async (e, postId, vote, type,thing , commentId) => {
    if (promise !== true) {
      promise = true;
      
      if(type === "comment"){
        dispatch(updateCommentThunk({postId:postId, vote:vote, type:type, thing:thing, subreddit:selectedSubreddit, commentId:commentId}));
      }else if(type === "post"){
        dispatch(updatePostThunk({postId:postId, vote:vote, type:type, thing:thing, subreddit:selectedSubreddit, commentId:commentId}));  
      }
      
      promise = false;  
    }
  };

  const closeComments = () => {
    setButtonText("Show");
    dispatch(
      setShowCommentsForPost({
        value: false,
        permalink: post.permalink,
        subreddit: selectedSubreddit,
      })
    );
  };
  const openComments = async (permalink) => {
    
    if (post.comments.length === 0) {
      dispatch(commentsThunk({id:post.id, subreddit:selectedSubreddit, permalink:permalink}));
      dispatch(
        setShowCommentsForPost({
          value: true,
          permalink: props.permalink,
          subreddit: selectedSubreddit,
        })
      );
    } else {
      dispatch(
        setShowCommentsForPost({
          value: true,
          permalink: props.permalink,
          subreddit: selectedSubreddit,
        })
      );
    }
    setButtonText("Hide");
  };
  const savePostToDb = () => {
    props.savePost(post,props.subreddit);
  };
  const removePostFromDb = async() => {
    await props.removePostFromDb(post.id,props.subreddit);
    props.loadFromDb ? setPostIsDeleted(true) : null;
  }
  
  return (
    
    !postIsDeleted ?  
    <>
      <div
        className={styles.post + " " + selectedSubreddit + " postElement"}
        onMouseOver={(e) => props.handleMouseEnter(props.id)}
        id={post.id+ "-postElement"}
      >
        <div id={props.id} className={styles.postContainer}>
          <h3 id={post.id} className={styles.postH3}>
            {post.title}
          </h3>

          <div className={styles.imgContainer}>
            {post.post_hint === "image" || post.isVideo ? (
              post.post_hint === "rich:video" ? 
              (
                <>
                <embed
                  className={styles.embed}
                  src={post.media}
                  wmode="transparent"
                  type="video/mp4"
                  width="100%" height="100%"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                  title="Keyboard Cat"
                ></embed>
                </>
              )
              :post.isVideo ? (
                <>
                  <video
                    className={styles.postVid}
                    preload="true"
                    controls
                    data-setup='{
                      "techOrder": ["youtube"],
                      "sources": [{ "type": "video/youtube", "src":
                      "https://www.youtube.com/watch?v=xjS6SftYQaQ"}] },
                      "youtube": {
                          "ytControls": 2,
                          "customVars": { "wmode": "transparent"}
                      }'
                  >
                    <source src={post.url}></source>
                  </video>
                </>
              ):(
                <>
                  <img className={styles.postImg} src={post.url} />
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
                <button
                  onClick={(e) => handleVote(e, post.id, 1, "post", post)}
                  className={styles.voteButton}
                >
                  <UpVote liked={post.likes} />
                </button>
                <p id={post.name + "-ups"} className={styles.ups}>
                  {post.ups}
                </p>
                <button
                  onClick={(e) => handleVote(e, post.id, -1, "post", post)}
                  className={styles.voteButton}
                >
                  <DownVote liked={post.likes} />
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
              <button
                className={styles.openComments}
                onClick={post.saved ?() => removePostFromDb() :() => savePostToDb()}
              >
                {post.saved? "Remove from Saves" : "Add to Saves"}
              </button>
            </div>
            {post.showingComments ? (
              <div className={styles.commentList} id={post.id + "_commentList"}>
                {post.comments.map((comment) => (
                  <Comment
                    handleVote={handleVote}
                    key={comment.id}
                    comment={comment}
                    postId = {post.id}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>: null
  );
}


export default Post;
//<iframe sandbox = "allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-same-origin-frame" className= {styles.postVid+ " " + styles.iframe} src={post.media}></iframe>
//<div className="video-js vjs-default-skin" id={post.id + "-player"}></div>
                