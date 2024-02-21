import React,{useState} from 'react';
import { useDispatch } from "react-redux";
import { setSearchTerm, searchPosts } from "../../features/redditSlice";

  
  function SearchInput() {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(setSearchTerm({ searchTerm: query }));
      dispatch(searchPosts({ searchTerm: query }));
      setQuery('');
    }
	return (
	  <>
      <form onSubmit={(e) => handleSubmit(e)} className="searchContainer">
        <input placeholder="Search" className={"searchInput"} type="search" value={query} onChange={(e) => setQuery(e.target.value)}/>
        <button type = "submit" className="submitButton">&#x1F50D;</button>
      </form>
    </>
	);
  }
  
  export default SearchInput;
  