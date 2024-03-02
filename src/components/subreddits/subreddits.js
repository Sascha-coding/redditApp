import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import {
  selectSubReddits,
} from "../../features/subredditsSlice";
import style from "./subreddits.module.css";

import {
  setSelectedSubreddit,
  toggleCloseAllComments,
  postsThunk,
} from "../../features/redditSlice";

function Subreddits(props) {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectSubReddits);
  const [stateLoaded, setStateLoaded] = useState(false);

  const loadSubreddit = async (subreddit) => {
    let audio = document.getElementById("audio2");
    audio.currentTime = 0;
    audio.play()
    dispatch(toggleCloseAllComments({ value: true }));
    dispatch(setSelectedSubreddit(subreddit.display_name_prefixed));
    dispatch(
      postsThunk({
        prefix: subreddit.display_name_prefixed,
        id: "",
        curPosts: [],
      })
    );
  };
  return (
    <aside className={style.subreddits}>
      <h1 className={style.subredditsh1}>Subreddits</h1>
      <div className={style.subredditsContainer}>
        {subreddits.map((subreddit) => (
          <div className={style.subreddit} key={subreddit.id}>
            <button
              id={subreddit.id}
              onClick={(e) => loadSubreddit(subreddit)}
              
              className={style.subredditButton}
            >
              <div className={style.imgWrapper}>
                <div className={style.beam2}>
                  <div className={style.light1}></div>
                  <div className={style.light2}></div>
                </div>

                <img
                  className={style.subredditImg}
                  src={
                    subreddit.icon_img ||
                    `https://api.adorable.io/avatars/25/${subreddit.display_name}`
                  }
                />
              </div>
              <div className={style.lightContainer2}>
                <div className={style.light4}></div>
                <hr className={style.subredditHr}></hr>
              </div>
                <div className={style.subredditName + " srn"}>
                  <div className={style.beam} id={"beam-" + subreddit.id}>
                    <div className={style.beamTop + " th"}></div>
                    <div className={style.beamBot + " th"}></div>
                  </div>
                  <div id="container" className={style.srdDiv}>
                    <div id={subreddit.id + "-span"} className={style.srdn}>
                      {subreddit.display_name}
                    </div>
                    <canvas
                      className={style.textShadowWrapper + " " + subreddit.id}
                    ></canvas>
                  </div>
                  <div className={style.beam + " " + style.beam3} id={"beam-" + subreddit.id+"-2"}>
                    <div className={style.beamTop + " th"}></div>
                    <div className={style.beamBot + " th"}></div>
                  </div>
                </div>
              <div className={style.lightContainer + " lc"}>
                <div className={style.light3}></div>
                <hr
                  className={style.subredditHr + " " + style.subredditHr2}
                ></hr>
              </div>
              
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Subreddits;
/*<div className={style.srdDiv}>
                  <span className={style.srdn}>{subreddit.display_name}</span>
                </div>
                */
