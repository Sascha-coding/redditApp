import React from 'react';
import styles from "./subredditBrowser.module.css";
import style from "../subreddits/subreddits.module.css"; 
  function ResultsRow(props) {
    const subreddit = props.subreddit;
    const display = props.display;
	return (
            <div className={styles.resultLine}>
              <div className={styles.buttonBackground}>
                <div className={styles.subredditButton2}>
                  <div className={style.imgWrapper}>
                    <img
                      className={style.subredditImg}
                      src={subreddit.icon_image}
                    />
                  </div>
                  <div className={style.lightContainer2}>
                    <hr className={style.subredditHr}></hr>
                  </div>
                  <div className={style.subredditName + " srn2"}>
                    <div id="container" className={style.srdDiv}>
                      <div id={subreddit.id + "-span"} className={styles.srdn2}>
                        {subreddit.display_name}
                      </div>
                    </div>
                  </div>
                  <div className={style.lightContainer + " lc"}>
                    <hr
                      className={style.subredditHr + " " + style.subredditHr2}
                    ></hr>
                  </div>
                </div>
              </div>
              <div className={styles.resultLineInfo}>
                <div className={styles.spanDiv}>
                  <span>
                    {"created on: " + subreddit.date + " at " + subreddit.time}
                  </span>
                  <span>
                    {"subscribers: "}
                    <span className={styles.subscriber}>
                      {subreddit.subscribers}
                    </span>
                  </span>
                </div>
                <button
                  onClick={(e) => props.subscribe(subreddit)}
                  className={styles.plusButton}
                >
                  {display === "Browse" ? "+" : "🗑"}
                </button>
              </div>
            </div>
          
	);
  }
  
  export default ResultsRow;
  