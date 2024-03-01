import React from "react";
import styles from "./reddit.module.css";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postsSelector,
  subredditSelector,
  postsThunk,
  toggleCloseAllComments,
  selectCloseAllComments,
  fittingPostsSelector,
  isLoadingSelector,
  initialPostsSelector,
  loadFromDbSelector,
  searchPosts,
} from "../../features/redditSlice.js";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Post from "../Posts/Post.js";

function Reddit(props) {
  const dispatch = useDispatch();
  const prefix = useSelector(subredditSelector);
  const isLoading = useSelector(isLoadingSelector);
  const initialPosts = useSelector(initialPostsSelector(prefix));
  const loadFromDb = useSelector(loadFromDbSelector);
  const DBPosts = useSelector(postsSelector("DB"));
  const posts = useSelector(postsSelector(prefix));
  const id = posts && posts.length > 0 ? posts[posts.length - 1].name : "";
  const fittingPosts = useSelector(fittingPostsSelector);
  const closeAllComments = useSelector(selectCloseAllComments);
  let [leIndex, setLeIndex] = useState(0);
  leIndex = leIndex ? leIndex : 0;
  let [more, setMore] = useState(true);

  const allObservingArrayOfObservingObservers = []
  useEffect(() => {
    if(leIndex !== 0){
      setLeIndex(posts.length)
    }
    if (closeAllComments) {
      dispatch(toggleCloseAllComments({ value: false }));
    }
    if (more){
      dispatch(postsThunk({prefix:prefix, id:id, curPosts:posts}));
      setMore(false)
    }
    if(loadFromDb){
      dispatch(postsThunk({prefix:prefix, id:id, curPosts:posts}));
    }
  }, [prefix,posts,loadFromDb]);
  const handleMouseEnter = (element) => {
    leIndex = element
  }
  const setFittingPosts = () => {
    leIndex = 0;
    dispatch(searchPosts({ searchTerm: "", subreddit: "returnToInitialqxyyyzq" }));
  }
  const setObserverCreated = () => {
    leIndex = 0;
  }
  const scrollUp = () =>{
    let curIndex = leIndex
    curIndex -= 1;
    curIndex = curIndex < 0 ? curIndex + 1: curIndex
    document.getElementById(curIndex).scrollIntoView( { behavior: 'smooth', block: 'start' } );
    leIndex = curIndex
  }
  const scrollDown = () => {
    let curIndex = leIndex
    curIndex += 1;
    const wrapper = document.getElementById("mainWrapper").scrollTop;
    if(wrapper.scrollTop === 0){
      curIndex = 1;
    }
    const length = fittingPosts.length > 0 ? fittingPosts.length - 1 : posts.length - 1;
    curIndex = curIndex > length ? curIndex - 1 : curIndex;
    const element = document.getElementById(curIndex);
    element.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    
    leIndex = curIndex;
  }
  const scrollToTop = () => {
    const wrapper = document.getElementById("mainWrapper");
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' } );
    leIndex = 0;
    
  };
  const scrollToBottom = () => {
    const element = document.getElementById("bottomAnchor");
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    leIndex = fittingPosts.length > 0 ? fittingPosts.length - 1 : posts.length - 1;
  }
  const getMore = async(prefix,id,posts) => {
     dispatch(postsThunk({prefix:prefix,id:id,curPosts:posts}));
     setMore=>true;
  }

  const timeOutArray = [];
  function SetIndex(id){
    timeOutArray.length > 0 ? timeOutArray.forEach(id => clearTimeout(id)) : null;
    const captureId = id;
    const oO = setLeIndex
    const timeOutId = setTimeout(() => {
      setLeIndex(captureId);
    }, 500)
    timeOutArray.push(timeOutId)
  }

  
  return (
    <>
      
      <main data-bs-spy="scroll" data-bs-target="#scrollDiv" data-bs-offset="0" id="main" className={styles.main}>
        {(
          <>
            <div id="mainWrapper" className={styles.wrapper}>
            <h2 className={styles.subredditH2}>{prefix}</h2>
              {loadFromDb 
              ? DBPosts.map((post,index) => (
                  <Post savePost={props.savePost} SetIndex = {SetIndex}  handleMouseEnter = {handleMouseEnter} setObserverCreated={setObserverCreated} allObservingArrayOfObservingObservers={allObservingArrayOfObservingObservers} posts={loadFromDb ? DBPosts : posts} post={post} id={index} key={post.id} permalink={post.permalink} />
              ))
              :
                fittingPosts && fittingPosts !== "No posts found" && fittingPosts.length > 0 
              ?
                fittingPosts && fittingPosts.map((post,index) => (
                  <Post savePost={props.savePost} SetIndex = {SetIndex}  handleMouseEnter = {handleMouseEnter} setObserverCreated={setObserverCreated} allObservingArrayOfObservingObservers={allObservingArrayOfObservingObservers} posts={loadFromDb ? DBPosts : posts} post={post} id={index} key={post.id} permalink={post.permalink} />
                ))
              : 
                initialPosts && posts.length === 25 
              ? 
                initialPosts.map((post,index) => (
                  <Post savePost={props.savePost} SetIndex = {SetIndex}  handleMouseEnter = {handleMouseEnter} setObserverCreated={setObserverCreated} allObservingArrayOfObservingObservers={allObservingArrayOfObservingObservers} posts={loadFromDb ? DBPosts : posts} post={post} id={index} key={post.id} permalink={post.permalink} />
                )) 
              : posts.map((post,index) => (
                  <Post savePost={props.savePost} SetIndex = {SetIndex}  handleMouseEnter = {handleMouseEnter} setObserverCreated={setObserverCreated} allObservingArrayOfObservingObservers={allObservingArrayOfObservingObservers} posts={loadFromDb ? DBPosts : posts} post={post} id={index} key={post.id} permalink={post.permalink} />
                ))}
                {isLoading ?
                <div className={styles.loadingContainer}>
                <h1 className={styles.loading}>{fittingPosts}</h1>
                <button className={styles.returnButton} onClick={(e) => setFittingPosts()}>Return</button>
                </div> : null
              }
            </div>
            {fittingPosts !== "No posts found" ? 
            <div id={posts.length} className={styles.loadMoreDiv}>
              <div className={styles.loadMoreWrapper}>
                <button
                  className={styles.loadMore}
                  onClick={(e) => getMore(prefix, id, posts)}
                >{!isLoading?
                  "Load More" : "Loading..."}
                </button>
              </div>
              <p id="bottomAnchor" className={styles.bottomAnchor}></p>
            </div>:null}
          </>
        )}
      </main>
      <button className={"scrollUp scrollToTop scrollDown"} onClick={(e) => scrollToTop()}>▲<hr className="scrollHr HrUp"></hr></button>
      <button id="scrollUp" onClick={(e) => scrollUp()} className="scrollUp scrollDown">▲</button>
      <button id="scrollDown" onClick={(e) => scrollDown()} className="scrollDown">▼</button>
      <button className={"scrollDown scrollToBottom"} onClick={(e) => scrollToBottom()}>▼<hr className="scrollHr HrDown"></hr></button>
      
    </>
  );
}

export default Reddit;
