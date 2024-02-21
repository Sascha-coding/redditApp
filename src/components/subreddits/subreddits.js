import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  fetchSubreddits,
  selectSubReddits,
} from "../../features/subredditsSlice";
import style from "./subreddits.module.css";
import { AddAnimations1, AddAnimations2 } from "./subreditsAnimations.js";
import { setSelectedSubreddit, fetchPosts, toggleCloseAllComments,postsSelector} from "../../features/redditSlice";

function Subreddits() {
  const dispatch = useDispatch();
  const [sheets, setSheets] = useState([]);
  const subreddits = useSelector(selectSubReddits);
  const posts = useSelector(postsSelector);
  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const loadSubreddit = (subreddit) => {
    const commentLists = document.getElementsByClassName("commentList");
    for (let i = 0; i < commentLists.length; i++) {
      document.removeChild(commentLists[i]);
    }
    dispatch(toggleCloseAllComments({value:true}))
    dispatch(setSelectedSubreddit(subreddit.display_name_prefixed));
  }

  return (
    <aside className={style.subreddits}>
    <AddAnimations1/>
    <AddAnimations2/>
      <h1 className={style.subredditsh1}>Subreddits</h1>
      <div className={style.subredditsContainer}>
        {subreddits.map((subreddit) => (
          <div className={style.subreddit} key={subreddit.id}>
            <button id={subreddit.id} onClick={(e) => loadSubreddit(subreddit)} className={style.subredditButton}>
              <div className={style.rotatingContainer}>
                <div className={style.light1}></div>
              </div>
              <div className={style.rotatingContainer}>
                <div className={style.light2}></div>
              </div>
              <img
                className={style.subredditImg}
                src={
                  subreddit.icon_img ||
                  `https://api.adorable.io/avatars/25/${subreddit.display_name}`
                }
              />
              <div className={style.lightContainer2}>
                <div className={style.light4}></div>
                <hr className={style.hr}></hr>
              </div>
              <div className={style.subredditName + " srn"}>
                <div className={style.beam}>
                  <div className={style.beamTop+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.thunder+" th"}></div>
                  <div className={style.beamBot+" th"}></div>
                </div>
                {subreddit.display_name}
              </div>
              <div className={style.lightContainer + " lc"}>
                <div className={style.light3}></div>
                <hr className={style.hr + " " + style.hr2}></hr>
              </div>
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Subreddits;
