import { generateSecureRandomString } from "../functionality/randomString";
import queryString from "query-string";
import { Base64 } from "js-base64";

import snoowrap from "snoowrap";

const CLIENT_ID = "T70Ml8SzSnHD1quNtlRjKQ";
const searchParams = new URLSearchParams(window.location.search);
const scopes = [
  "creddits",
  "modnote",
  "modcontributors",
  "modmail",
  "modconfig",
  "subscribe",
  "structuredstyles",
  "vote",
  "wikiedit",
  "mysubreddits",
  "submit",
  "modlog",
  "modposts",
  "modflair",
  "save",
  "modothers",
  "read",
  "privatemessages",
  "report",
  "identity",
  "livemanage",
  "account",
  "modtraffic",
  "wikiread",
  "edit",
  "modwiki",
  "modself",
  "history",
  "flair",
];
let code;
let state;
if(sessionStorage.getItem("code")){
  code = sessionStorage.getItem("code");
}else if(searchParams.size !== 0){
  code = searchParams.get("code");
  state = searchParams.get("state");
  sessionStorage.setItem("code", code);
  sessionStorage.setItem("state", state);
}else if (searchParams.size === 0) {
  allowAccess();
  function allowAccess() {
    const urlParams = new URLSearchParams();
    urlParams.set("client_id", CLIENT_ID);
    urlParams.set("response_type", "code");
    urlParams.set("state", generateSecureRandomString(20));
    urlParams.set("redirect_uri", "http://localhost:3000/");
    urlParams.set("duration", "permanent");
    urlParams.set("scope", scopes);
    const authorizationUrl = new URL("https://www.reddit.com/api/v1/authorize");
    authorizationUrl.search = urlParams.toString();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = viewportWidth / 2;
    const height = viewportHeight / 2;
    const left = (viewportWidth - width) / 2;
    const top = (viewportHeight - height) / 2;
    window.open(
      authorizationUrl,
      "_self",
      `popup=yes, width=${width}, height=${height}, left=${left}, top=${top}`
    );
  }
}
const API_ROOT = "https://www.reddit.com";
const CLIENT_SECRET = "3l478obJCzJVJhrYqpQ_Ic_P-dF8uA";

const REDIRECT_URI = "http://localhost:3000/";
const password = "sasfis13";
const username = "mr_mountain_dew";
const userAgent = "readit";
let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");
let user;
let reddit;
const getToken = async (body) => {
  const authorizationHeader = `Basic ${Base64.encode(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  )}`;
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: authorizationHeader,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: queryString.stringify(body),
  });
  const json = await response.json();
  return json;
};
const getUser = async (accessToken) =>{
  const response = await fetch(`https://oauth.reddit.com/api/v1/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });
  const json = await response.json();
  return json;
};
const initializeSnoowrap = async () => {
  const reddit = new snoowrap({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refreshToken,
    access_token: accessToken,
    user_agent: userAgent,
    username: username,
    password: password,
    redirect_uri: REDIRECT_URI,
    installed_app_client_id: CLIENT_ID,
  });
  return reddit;
};
const initializeAPI = async () => {
  if (code) {
    const token = await getToken({
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }); 
    accessToken = sessionStorage.getItem("accessToken") ? sessionStorage.getItem("accessToken") : token.access_token;
    refreshToken = sessionStorage.getItem("refreshToken") ? sessionStorage.getItem("refreshToken") : token.refresh_token;
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    user = await getUser(accessToken);
    reddit = await initializeSnoowrap();
    localStorage.setItem("done", true);
    console.log(user);
    console.log(reddit);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(user.id);
    return reddit;
  }
};
const r = code
    ? await initializeAPI()
    : null;

export const embedVideos = (url) => {
  const endpoints = `https://www.reddit.com/api/oembed?url=${url}`;
  const request = fetch(endpoint);
}
const apiLoaded = () => {
  const response = r ? true : false;
  return response;
};

const getSubReddits = async () => {
  const response = await r.getSubscriptions();
  return response;
};
const getPosts = async (prefix, posts, more) => {
  if(more !== true){
    const subreddit = await r.getSubreddit(prefix);
    posts = subreddit.getHot({ limit: 25 });
    return posts;
  }else{
    let list = posts.list;
    posts = {...posts};
    
    await list.fetchMore({ amount: 25 }).then(extendListing => {
       list = extendListing;
    });
    return list;
  }
  
};
async function getComments(id, limit = 25, depth = 10) {
  try {
    // Await the fetch operation to ensure comments are retrieved
    const post = await r.getSubmission(id).fetch()
    const comments = await post.comments;
    return comments; // Return the expanded comments
  } catch (error) {
    console.error("Error fetching comments:", error);
    // Handle the error (e.g., display an error message to the user)
  }
}

const sendVote = async (id, vote, type,thing) => {
  let response;
  thing = {...thing};
  try {
    switch (type) {
      case "post":
      if (vote === 1) {
        if (thing.likes === true) {
          response = await r.getSubmission(id).unvote();
          thing.ups = thing.ups - 1;
          thing.likes = null;
        } else if (thing.likes === false) {
          response = await r.getSubmission(id).upvote();
          thing.ups = thing.ups + 2;
          thing.likes = true;
        } else if (thing.likes === null) {
          response = await r.getSubmission(id).upvote();
          thing.ups = thing.ups + 1;
          thing.likes = true;
        }
      } else if (vote === -1) {

        if (thing.likes === false) {
          response = await r.getSubmission(id).unvote();
          thing.ups = thing.ups + 1;
          thing.likes = null;
        } else if (thing.likes === true) {
          response = await r.getSubmission(id).downvote();
          thing.ups = thing.ups - 2;
          thing.likes = false;
        } else if (thing.likes === null) {
          response = await r.getSubmission(id).downvote();
          thing.ups = thing.ups - 1;
          thing.likes = false;
        }
      }
      break;
      case "comment":
        if (vote === 1) {
          if (thing.likes === true) {
            response = await r.getComment(id).unvote();
            thing.ups = thing.ups - 1;
            thing.likes = null;
          } else if (thing.likes === false) {
            response = await r.getComment(id).upvote();
            thing.ups = thing.ups + 2;
            thing.likes = true;
          } else if (thing.likes === null) {
            response = await r.getComment(id).upvote();
            thing.ups = thing.ups + 1;
            thing.likes = true;
          }
        } else if (vote === -1) {
  
          if (thing.likes === false) {
            response = await r.getComment(id).unvote();
            thing.ups = thing.ups + 1;
            thing.likes = null;
          } else if (thing.likes === true) {
            response = await r.getComment(id).downvote();
            thing.ups = thing.ups - 2;
            thing.likes = false;
          } else if (thing.likes === null) {
            response = await r.getComment(id).downvote();
            thing.ups = thing.ups - 1;
            thing.likes = false;
          }
        }
        break;
      default:
        break;
  
      }
    return thing;
  } catch (error) {
    console.error(error);
  }
}

export const browseSubreddits = async(after) => {
  console.log(after);
  try{
    const response = await fetch(`https://www.reddit.com/reddits.json?limit=100&after=${after}`);
    const json = await response.json();
    const result = json.data.children;
    return result;
  }catch(error){
    console.log(error);
  }
}

export const subscribeSubreddit = async(name,type) => {
  try{
    
    let response, subreddit
    if(type === "subscribe"){
       subreddit = await r.getSubreddit(name);
       response = await subreddit.subscribe();
       subreddit = await subreddit.fetch();
       return subreddit;
    }else{
       subreddit = await r.getSubreddit(name);
       response = await subreddit.unsubscribe();
       subreddit = await subreddit.fetch();
       console.log(subreddit);
       return subreddit;
    } 
    
    
  }catch(error){
    console.log(error);
  }
}

export { API_ROOT }
export { getSubReddits, getPosts, getComments, sendVote, apiLoaded }
