import React, { useState, useEffect } from "react";

import Logo from "../data/redditLogo";
import Subreddits from "../components/subreddits/subreddits";
import Reddit from "../components/reddit/reddit";
import { useDispatch, useSelector} from "react-redux";
import SearchInput from "../components/SearchInput/searchInput";
import { setPosts , initializeState} from "../features/redditSlice.js"; 
import {  fetchSubreddits, selectSubReddits } from "../features/subredditsSlice.js";
import { getAllDataFromIDBCollection, getDatabase, addPostToIDBCollection } from "../features/savedPosts.js";
import {
  AddAnimations1,
  AddAnimations2,
  animate,
} from "../functionality/subreditsAnimations.js";

const App = (props) => {
  const dispatch = useDispatch();
  const Database = getDatabase();
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [entered, setEntered] = useState(false);
  const [stateLoaded, setStateLoaded] = useState(false);
  const subreddits = useSelector(selectSubReddits);
    const getSavedPosts = async () => {
      try {
        const data = await getAllDataFromIDBCollection("readwrite");
        console.log(data);
        data.reverse();
        const actions = {posts:data}
        dispatch(setPosts(actions));
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        // Handle the error appropriately, e.g., display an error message to the user
      }
    };
    let i = 0;
    useEffect(() => {
      console.log(i)
      dispatch(fetchSubreddits());
      if (!stateLoaded && subreddits.length > 0) {
        dispatch(initializeState(subreddits));
        setStateLoaded(true);
      }
      if (entered &&subreddits) {
        console.log("entered");
        AddAnimations1();
        AddAnimations2();
        animate(subreddits);
        let buttons = document.querySelectorAll('button');
        let buttonArr = Array.from(buttons);
        buttonArr.forEach((button) => {
          if(button.id !== "welcome"){
            button.addEventListener("mouseover", hoverSound) 
          }
        })
      }
      console.log("what?")
    },[entered, subreddits.length])

  const savePost = async(post) => {
    const response = await addPostToIDBCollection(post, "readwrite");
    response.reverse();
    setLoadedPosts(response);
  }
  const hoverSound = async() => {
      let audio = document.getElementById("audio");
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
  return (
    <>
      <header className="header">
        <div className="headerBackground">
          <div className="headerContent">
          <div className="logoWrapper">
            <Logo />
          </div>
          <SearchInput />
          <div className={"headerButtons"}>
            <button className={"headerButton savedPosts"} onClick={(e) => getSavedPosts()}>Saved Posts</button>
            <button className={"headerButton newPost"}>New Post</button>
            <button className={"headerButton savedSubreddits"}>add Subreddit</button>
          </div>
        </div>
        </div>
      </header>
      {entered? 
      <>
      <Subreddits hoverSound={hoverSound}/>
      <Reddit posts={loadedPosts} savePost = {savePost} leIndex={0} Database = {Database}/>
      </>:<>
        <div className="welcomeCard">
          <h1 className="welcomeH1">Welcome</h1>
          <button id="welcome" onClick={(e) => {setEntered(true)}} className="welcomeBtn">Enter</button>
        </div>
      </>}
    </>
  );
};

export default App;

