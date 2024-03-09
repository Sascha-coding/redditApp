import React,{useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, searchPosts, subredditSelector } from "../../features/redditSlice";

  
  function SearchInput(props) {
    const subreddit = useSelector(subredditSelector);
    const [query, setQuery] = useState('');
    const [search, setSearch] = useState(false);
    const dispatch = useDispatch();
    useEffect(()=> {
      console.log(search);
    },[search])
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
      setSearch(!search)
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
        <input  disabled={props.disabled} placeholder="Search" className={"searchInput"} type="search" value={query} onChange={(e) => handleChange(e)}/>
        <button disabled={props.disabled} type = "submit" className="submitButton">{!search ? "🔍" : "✖" }</button>
        <button disabled={props.disabled} type = "button" onClick={(e) => handleReturn(e)} className={"submitButton resetQueryButton"}>🗑</button>
      </form>
    </>
	);
  }
  
  export default SearchInput;
  