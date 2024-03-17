import dateFormatter from "./dateFormatter.js";
import { replaceLinks } from "./replaceLinks.js";
import {
  Database,
  getAllDataFromIDBCollection,
} from "../features/savedPosts.js";

export const listformatter = async (list, type, startIndex, endIndex,prevPosts) => {
  const listWithMetaData = [];
  console.log("list in listFormatter", list)
  if (type === "comments") {
    for (let comment of list) {
      if (!comment.subreddit_id) {
        continue;
      }
      const created = Number(comment.created) * 1000;
      const dateTime = dateFormatter(created);
      listWithMetaData.push({
        id: comment.id,
        name: comment.name,
        permalink: comment.permalink,
        title: comment.title,
        date: dateTime[0],
        time: dateTime[1],
        author: comment.author.name,
        ups: comment.ups,
        likes: comment.likes,
        body: replaceLinks(comment.body),
      });
    }
  } else if (type === "posts") {
    const savedPosts = await getAllDataFromIDBCollection();
    for (let i = startIndex; i < endIndex; i++) {
      try{
      let post = list[i];
      console.log("post in listFormatter", post);
      let duplicate = prevPosts?.find((entry) => entry.id === post.id)
      if(duplicate){
        continue;
      }
      if (!post.id) {
        continue;
      }
      let saved;
      if (savedPosts.find((savedPost) => savedPost.id === post.id)) {
        saved = true;
      } else {
        saved = false;
      }

      let isVideo
      if(post.post_hint === "hosted:video" || post.post_hint === "rich:video" || post.url.includes("video")){
        isVideo = true;
      }else{
        isVideo = false;
      }
      const selfText = replaceLinks(post.selftext);
      const dateTime = dateFormatter(post.created * 1000);
      let media;
      if( post.post_hint === "rich:video"){
      media = post.media_embed.content;
      media = media.split('src="')[1];
      media = media.split('"')[0];
      media.includes("&enablejsapi=1") ? media = media.split("&enablejsapi=1")[0] : media = media;
      }else{
        media = null;
      }
      
      listWithMetaData.push({
        id: post.id,
        name: post.name,
        permalink: post.permalink,
        title: post.title,
        comments: [],
        showingComments: false,
        loadingComments: false,
        errorComments: false,
        date: dateTime[0],
        time: dateTime[1],
        num_comments: post.num_comments,
        author: post.author.name,
        ups: post.ups,
        likes: post.likes,
        saved: saved,
        selftext: selfText,
        url: post.url,
        domain: post.domain,
        isVideo: isVideo,
        media: media,
        post_hint: post.post_hint,
        thumbnail: post.thumbnail,
      });
    }catch(error){
      console.log("error", error);
    }
    }
    
    
  }else if(type==="subreddits"){
    for(let subreddit of list){
      subreddit.data ? subreddit = subreddit.data : subreddit = subreddit;
      const dateTime = dateFormatter(subreddit.created_utc * 1000);
      listWithMetaData.push({
        id: subreddit.id,
        name: subreddit.name,
        subscribers: subreddit.subscribers,
        date: dateTime[0],
        time: dateTime[1],
        icon_image:subreddit.icon_img,
        display_name_prefixed:subreddit.display_name_prefixed,
        display_name:subreddit.display_name,
        description:subreddit.description,
      })
    }
  }
  console.log("listWithMetaData",listWithMetaData);
  return listWithMetaData;
};
