import React,{useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, searchPosts, subredditSelector } from "../../features/redditSlice";

  
  function SearchInput() {
    const subreddit = useSelector(subredditSelector);
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const handleChange = (e) => {
      setQuery(e.target.value);
    }
    const handleSubmit = (e) => {
      e.preventDefault();
      const audio = document.getElementById("audio2")
      audio.currentTime = 0;
      audio.play();
      document.getElementById("main").scrollTo(0, 0);
      dispatch(setSearchTerm({ searchTerm: query }));
      dispatch(searchPosts({ searchTerm: query, subreddit: subreddit }));                                   
      setQuery('');
    }
    const handleReturn = (e) => {
      e.preventDefault();
      dispatch(setSearchTerm({ searchTerm: false }));
      setQuery("")
    }
	return (
	  <>
      <form onSubmit={(e) => handleSubmit(e)} className="searchContainer">
        <input placeholder="Search" className={"searchInput"} type="search" value={query} onChange={(e) => handleChange(e)}/>
        <button type = "submit" className="submitButton">&#x1F50D;</button>
        <button type = "button" onClick={(e) => handleReturn(e)} className={"submitButton resetQueryButton"}>&#x1F5D1;</button>
      </form>
    </>
	);
  }
  
  export default SearchInput;
  