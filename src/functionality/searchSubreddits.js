export async function searchSubreddits(query, list){
  console.log("list",list)
    let found = list.filter((subreddit) => 
    subreddit.display_name.toLowerCase().includes(query.toLowerCase()) ||
    subreddit.description.toLowerCase().includes(query.toLowerCase())
  );
  

    return found;
}