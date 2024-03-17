export async function searchSubreddits(query, list){
  console.log(list);
    let found = await list.flat().filter((subreddit) => 
    subreddit.display_name ? subreddit.display_name.toLowerCase().includes(query.toLowerCase()) : null ||
    subreddit.description ? subreddit.description.toLowerCase().includes(query.toLowerCase()) :null
  );
  console.log(found);

    return found;
}