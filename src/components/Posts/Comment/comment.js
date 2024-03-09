import React, { useState } from 'react';
import { UpVote, DownVote } from '../Vote/vote';
import styles from '../post.module.css'
function Comment(props){
    const comment = props.comment;
    const [liked, setLiked] = useState(comment.likes);
    const swapColor = () => {
        setLiked(!liked)
    }
	return (
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
          <button onClick={(e) => props.handleVote(e,props.postId, 1, "comment",comment, comment.id)} className={styles.voteButton}>
            <UpVote liked = {comment.likes}/>
          </button>
          <p className={styles.ups}>{comment.ups}</p>
          <button onClick={(e) => props.handleVote(e,props.postId, -1, "comment",comment, comment.id)} className={styles.voteButton}>
            <DownVote liked = {comment.likes}/>
          </button>
        </div>
      </div>
	);
  }
  
  export {Comment};
  