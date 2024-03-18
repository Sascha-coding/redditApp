import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../reddit/reddit.module.css";
import Post from "./Post";
import {
  randomPostsSelector,
  randomPostsThunk,
  removeFirstRndPost,
} from "../../features/redditSlice.js";
import { getRandomSubmissions } from "../../api/snoowrap.js";
import { listformatter } from "../../functionality/listFormatter.js";

let randomPostsPromise;
let singlePostPromise;
let arrayLoaded;
function RandomPost(props) {
  const dispatch = useDispatch();
  const randomPosts = useSelector(randomPostsSelector);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const getPost = async () => {
    const result = await getRandomSubmissions([], true);
    return result;
  };

  useEffect(() => {
    let newPost;

    if (props.arrayLoaded) {
      arrayLoaded = true;
      setLoading(false);
    }

    if (!arrayLoaded) {

      if (initLoad !== false) {

        setInitLoad(false);
        singlePostPromise = new Promise(async (resolve, reject) => {
          try {
            newPost = await getPost();
            newPost = await listformatter([newPost], "posts", 0, 1);
            newPost = newPost[0];
            resolve(newPost);
          } catch (error) {
            reject(error);
          }
        });

        singlePostPromise
          .then((newPost) => {
            singlePostPromise = null;
            setPost(newPost);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching first post:", error);
          });
      }
    }
    if (
      randomPosts &&
      randomPosts.length % 5 === 0 &&
      !randomPostsPromise &&
      !props.randomPostsPromise
    ) {
      let newPosts = [...randomPosts];
      randomPostsPromise = new Promise((resolve, reject) => {
        try {
          dispatch(randomPostsThunk({ posts: newPosts, init: false }))
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              console.error("Error fetching rnd post:", error);
              reject(false);
            });
        } catch (error) {
          console.log(error);
          reject(false);
        }
      });
      randomPostsPromise
        .then(() => {
          randomPostsPromise = null;
          arrayLoaded = true;
        })
        .catch(() => {
          console.error("Error fetching rnd post:", error);
        });
    }
  }, [randomPostsPromise, initLoad, props.arrayLoaded, post]);
  const openRandomPost = async () => {
    if (!initLoad && !singlePostPromise && !arrayLoaded) {
      let newPost;
      setLoading(true);
      singlePostPromise = new Promise(async (resolve, reject) => {
        try {
          newPost = await getPost();
          newPost = await listformatter([newPost], "posts", 0, 1);
          newPost = newPost[0];
          resolve(newPost);
        } catch (error) {
          reject(error);
        }
      });

      singlePostPromise
        .then((newPost) => {
          singlePostPromise = null;
          setPost(newPost);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching first post:", error);
        });
      setLoading(true);
    } else if (arrayLoaded) {
      
      setPost(randomPosts[0]);
      if (randomPosts.length === 1) {
        arrayLoaded = false;
      }
      dispatch(removeFirstRndPost());
    }
  };
  return (
    <main
      data-bs-spy="scroll"
      data-bs-target="#scrollDiv"
      data-bs-offset="0"
      id="main"
      className={styles.main+ " " + styles.randomPostMain}
    >
       <h2 className={styles.subredditH2}>Random</h2>
      {!loading ? (
        <div id="mainWrapper" className={styles.wrapper+" "+styles.randomPostWrapper}>
          {post ? <Post type="randomPost" post={post} /> : null}
          <div className={styles.rndBtnDiv}>
          <button className="getRandomPost" onClick={(e) => openRandomPost()}>
            Get another one!
          </button>
          <button
            className="getRandomPost"
            onClick={(e) => props.setRandomDisplay(false)}
          >
            Return
          </button>
          </div>
        </div>
      ) : (
        <div id="mainWrapper" className={styles.wrapper+" "+styles.randomPostWrapper}>
          <div className={"loadingContainer lC2"}>
            <h1 className={"loading"}>{"loading..."}</h1>
          </div>
        </div>
      )}
    </main>
  );
}

export default RandomPost;

/*
          
         */

//const { post } = await getRandomSubmission();
//let result = await listformatter([post], "posts", 0, 1);
//setRandomPost(result[0]);
