const API_ROOT = 'https://www.reddit.com';

const getSubReddits = async () => {
    const response = await fetch(`${API_ROOT}/subreddits.json`);
    const json = await response.json();
    return json.data.children.map((post) => post.data);
}
const getPosts = async (prefix) => {
    const response = await fetch(`${API_ROOT}/${prefix}.json`);
    const json = await response.json();
    const posts = json.data.children.map((post) => post.data);
    posts.map((post) => {
        if(post.media && Object.keys(post.media).includes("reddit_video")) {
        post.url = post.media.reddit_video.fallback_url;
        post.isVideo = true;
        };
    })
    return posts
}
const getComments = async (permalink) => {
    console.log("fetching comments");
    const response = await fetch(`${API_ROOT}${permalink}.json`);
    const json = await response.json();
    console.log(json);
    return json[1].data.children.map((post) => post.data);
}
export {API_ROOT}
export {getSubReddits, getPosts, getComments}