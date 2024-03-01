const API_ROOT = "https://www.reddit.com";

const getSubReddits = async () => {
  const response = await fetch(`${API_ROOT}/subreddits.json`);
  const json = await response.json();
  return json.data.children.map((post) => post.data);
};
const getPosts = async (prefix, id, count) => {
  console.log("fetch Posts");
  let endPoint = `${API_ROOT}/${prefix}.json?limit=${25}`;
  if (id) {
    endPoint =`${API_ROOT}/${prefix}.json?count=${count}&after=${id}`
  }
  console.log(endPoint);
  const response = await fetch(endPoint, {
    method: "GET",
    redirect: 'follow',
  });
  console.log(response);
  const json = await response.json();
  console.log(json);

  const posts = await json.data.children.map((post) => post.data);
  await posts.map((post) => {
    if (post.media && Object.keys(post.media).includes("reddit_video")) {
      post.url = post.media.reddit_video.fallback_url;
      post.isVideo = true;
    }
  });
  console.log(posts);
  return posts;
};
const getComments = async (name) => {
    console.log(name)
  const response = await fetch(`${API_ROOT}${name}.json`);
  console.log(response);
  const json = await response.json();
  console.log(json);
  return json[1].data.children.map((post) => post.data);
};

export { API_ROOT };
export { getSubReddits, getPosts, getComments };
