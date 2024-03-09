import React, { useState, useEffect } from "react";

import Logo from "../data/redditLogo";
import Subreddits from "../components/subreddits/subreddits";
import SubredditBrowser from "../components/subredditBrowser/subredditbrowser.js";
import Reddit from "../components/reddit/reddit";
import { useDispatch, useSelector} from "react-redux";
import SearchInput from "../components/SearchInput/searchInput";
import { setPostsToDB , initializeState, setPostSaved} from "../features/redditSlice.js"; 
import {  fetchSubreddits, selectSubReddits, browseSubredditCategorysThunk,  } from "../features/subredditsSlice.js";
import { Database, getAllDataFromIDBCollection, getDatabase, addPostToIDBCollection, removePostFromIDBCollection } from "../features/savedPosts.js";
import {
  AddAnimations1,
  AddAnimations2, 
  animate,
} from "../functionality/subreditsAnimations.js";
import { apiLoaded } from "../api/snoowrap.js";


const App = (props) => {
  const dispatch = useDispatch();
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [entered, setEntered] = useState(false);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [browseSubreddits, setBrowseSubreddits] = useState(false);
  const subreddits = useSelector(selectSubReddits);
  let ready = false;
  do{
    ready = apiLoaded();
    
  }while(!ready);
  const getSavedPosts = async () => {
    try {
      const data = await getAllDataFromIDBCollection("readwrite");
      data.reverse();
      const actions = {posts:data}
      dispatch(setPostsToDB(actions));
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchSubreddits());
    if (!stateLoaded && subreddits && subreddits.length > 0) {
      dispatch(initializeState(subreddits));
      setStateLoaded(true);
      
    }
    if (entered &&subreddits) {

      let buttons = document.querySelectorAll('button');
      let buttonArr = Array.from(buttons);
      buttonArr.forEach((button) => {
        if(button.id !== "welcome"){
          button.addEventListener("mouseover", hoverSound) 
        }
      })
    }
  },[entered])

  const savePost = async(post,subreddit) => {
    const response = await addPostToIDBCollection(post, "readwrite");
    const id=post.id
    dispatch(setPostSaved({saved:true, id:id, subreddit:subreddit}))
  }
  const removePostFromDb = async(id, subreddit) => {
    const response = await removePostFromIDBCollection(id, "readwrite");
    dispatch(setPostSaved({saved:false, id:id, subreddit:subreddit}))
  }
  const hoverSound = async() => {
      let audio = document.getElementById("audio");
      audio.volume = 0.03;
      console.log(audio.volume);
      var playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {

        })
        .catch(error => {
          console.error(error)
        });
      }else{
        playPromise = audio.pause();
      }
    }
  const openSubredditBrowser = (e) => {
    dispatch(browseSubredditCategorysThunk({after:"", subredditsList:"",}));
    setBrowseSubreddits(!browseSubreddits);
  }
  return (
    <>
      <header className="header">
        <div className="headerBackground">
          <div className="headerContent">
          <div className="logoWrapper">
            <Logo />
          </div>
          <SearchInput disabled={!entered}/>
          <div className={"headerButtons"}>
            <button disabled={!entered} className={"headerButton savedPosts"} onClick={(e) => getSavedPosts(e)}>Saved Posts</button>
            <button disabled={!entered} className={"headerButton savedSubreddits"} onClick={(e) => openSubredditBrowser(e)}>add Subreddit</button>
            <button disabled={!entered} className={"headerButton newPost"}>New Post</button>
          </div>
        </div>
        </div>
      </header>
      {entered? 
      <>
      <Subreddits hoverSound={hoverSound}/>
      <Reddit removePostFromDb = {removePostFromDb} posts={loadedPosts} savePost = {savePost} leIndex={0} Database = {Database}/>
      {browseSubreddits ? <SubredditBrowser openSubredditBrowser={openSubredditBrowser} /> : null}
      </>:<>
        <div className="welcomeCard">

          <h1 className="welcomeH1">Welcome</h1>
          <button className="welcomeBtn" id="welcome" onClick={(e) => {setEntered(true)}} >Enter</button>
        </div>
      </>}
    </>
  );
};

export default App;

