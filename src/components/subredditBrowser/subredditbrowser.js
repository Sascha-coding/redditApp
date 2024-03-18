import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./subredditBrowser.module.css";
import { useSelector } from "react-redux";
import {
  subredditsListSelector,
  isLoadingSelector,
  browseSubredditCategorysThunk,
  addSubredditThunk,
  selectSubReddits,
} from "../../features/subredditsSlice.js";
import Pagination from "./pagination.js";
import { searchSubreddits } from "../../functionality/searchSubreddits.js";

import ResultsRow from "./subscribeButton.js";
import { postsThunk } from "../../features/redditSlice.js";
function SubredditBrowser(props) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [browsePages, setBrowsePages] = useState([]);
  const subredditList = useSelector(subredditsListSelector);
  const [filteredSubreddits, setFilteredSubreddits] = useState([]);
  const isLoading = useSelector(isLoadingSelector);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const subreddits = useSelector(selectSubReddits);
  const [display, setDisplay] = useState("Browse");
  const [savedPages, setSavedPages] = useState([]);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const initializePages = async () => {
      // Filter subreddits
      let filtered = await subredditList.filter((sub) => {
        return !subreddits.some(
          (subreddit) => sub.display_name === subreddit.display_name
        );
      });
      if (more === true) {
        filtered = filteredSubreddits.concat(filtered);
        setFilteredSubreddits(filtered);
      }else{
        setFilteredSubreddits(filtered);
      }
      // Generate pages
      const newBrowsePages = await generatePages(filtered);
      
      const newSavedPages = await generatePages(subreddits);
      
      if (more === true) {
        setMore(false);
        if(Object.keys(searchResults).length > 0){
          const keys = Object.keys(searchResults);
          let newSearchResultsArr = {...searchResults};
          for(let key of keys){
            let newSearchResults
            newSearchResults = await searchSubreddits(key, subredditList);
            newSearchResultsArr[key] = newSearchResultsArr[key].concat(newSearchResults);
        }
        setSearchResults(newSearchResultsArr);
        let newPages = [];
        let newPage = [];
        for(let i = 0; i < newSearchResultsArr[query].length; i++){
            
            let entry = newSearchResultsArr[query][i];
            newPage.push(entry);
            if(newPage.length === 10){
                newPages.push(newPage);
                newPage = [];
            }else if(i === newSearchResultsArr[query].length - 1){
                newPages.push(newPage);
            }
        }
        setPages(newPages);
        }
      }
      setBrowsePages(newBrowsePages);
      setSavedPages(newSavedPages);
      
    };
    if (filteredSubreddits.length === 0 || more === true) {
      initializePages();
    }
  }, [dispatch, subreddits, subredditList]);

  useEffect(() => {
    if (display === "Saved" && query === "") {
      setPages(savedPages);
    } else if(display === "Browse" && query === "") {
      setPages(browsePages);
    }
  }, [browsePages, savedPages, subreddits]);
  const subscribe = async (subreddit) => {
    let type = display === "Saved" ? "unsubscribe" : "subscribe";
    let name = subreddit.display_name;
    dispatch(addSubredditThunk({ name: name, type: type }));
    dispatch(postsThunk({ prefix: "r/"+name, posts: [], more: false }));
    if (display === "Saved") {
      let newFilteredSubreddits = [subreddit, ...filteredSubreddits];
      setFilteredSubreddits(newFilteredSubreddits);
      let newBrowsePages = [...browsePages];
      if (newBrowsePages.length === 0) {
        newSavedPages.push([subreddit]);
      } else {
        newBrowsePages[newBrowsePages.length - 1].length < 10
          ? newBrowsePages[newBrowsePages.length - 1].push(subreddit)
          : newBrowsePages.push([subreddit]);
      }
      setBrowsePages(newBrowsePages);

      let newSavedPages = [...savedPages];
      let newSavedPagesFlat = newSavedPages.flat();
      newSavedPagesFlat = newSavedPagesFlat.filter(
        (sub) => sub.display_name !== name
      );
      newSavedPages = [];
      let newPage = [];
      for (let entry of newSavedPagesFlat) {
        newPage.push(entry);
        if (newPage.length === 10) {
          newSavedPages.push(newPage);
          newPage = [];
        } else if (entry === newSavedPagesFlat[newSavedPagesFlat.length - 1]) {
          newSavedPages.push(newPage);
        }
      }
      setSavedPages(newSavedPages);
    } else {
      let newFilteredSubreddits = filteredSubreddits.filter(
        (sub) => sub.display_name !== name
      );
      setFilteredSubreddits(newFilteredSubreddits);
      let newSavedPages = [...savedPages];
      if (newSavedPages.length === 0) {
        newSavedPages.push([subreddit]);
      } else {
        newSavedPages[newSavedPages.length - 1].length < 10
          ? newSavedPages[newSavedPages.length - 1].push(subreddit)
          : newSavedPages.push([subreddit]);
      }

      setSavedPages(newSavedPages);

      let newBrowsePages = [...browsePages];
      let newBrowsePagesFlat = newBrowsePages.flat();
      newBrowsePagesFlat = newBrowsePagesFlat.filter(
        (sub) => sub.display_name !== name
      );
      newBrowsePages = [];
      let newPage = [];
      for (let entry of newBrowsePagesFlat) {
        newPage.push(entry);
        if (newPage.length === 10) {
          newBrowsePages.push(newPage);
          newPage = [];
        } else if (
          entry === newBrowsePagesFlat[newBrowsePagesFlat.length - 1]
        ) {
          newBrowsePages.push(newPage);
        }
      }
      setBrowsePages(newBrowsePages);
    }
  };
  const changePage = async (direction) => {
    let newPage;
    if (direction === true) {
      newPage = page + 1;
    } else if (direction === false) {
      newPage = page - 1;
    } else {
      newPage = direction;
    }
    if (newPage <= 0) {
      newPage = 0;
    } else if (newPage >= pages.length) {
      newPage = pages.length - 1;
    }

    setPage(newPage);
  };

  const loadMore = async () => {
    setMore(true);
    const after = subredditList[subredditList.length - 1].name;
    dispatch(
      browseSubredditCategorysThunk({
        after: after,
      })
    );
  };
  const generatePages = async (list, type) => {
    let page = [];
    let newPages;
    if (type === "more") {
      newPages = [...browsePages];
    } else {
      newPages = [];
    }

    let begin = newPages.length;

    if (
      newPages[newPages.length - 1] &&
      newPages[newPages.length - 1].length !== 10 &&
      display === "Browse"
    ) {
      page = newPages[pages.length - 1];
    }

    for (let i = begin; i < list.length; i++) {
      const subreddit = list[i];

      page.push(subreddit);

      if (page.length === 10 || i === list.length - 1) {
        newPages.push(page);
        page = [];
      }
    }

    return newPages;
  };

  const handleDisplay = async (display) => {
    setPage(0);
    document.getElementById("searchBrowser").value = "";
    if(query !== ""){
        setSearchResults({});
        setQuery("");
    }
    if (display === "Saved") {
      setPages(savedPages);
    } else {
      setPages(browsePages);
    }
    
    setDisplay(display);
  };
  const handleSearch = async (e) => {
    if(e.target.value.length === 0){
        setQuery("");
        setSearchResults({});
        const newPages = display === "Saved" ? savedPages : browsePages;
        setPages(newPages);
        return;
    }
    let neededArray = searchResults[query];
    if (Object.keys(searchResults).length === 0) {
      neededArray = display === "Saved" ? savedPages : browsePages;
    }else if (Object.keys(searchResults).length !== 0) {
      if (query.length > e.target.value.length) {
        let prevStr = query.substring(0, query.length - 1);
        neededArray = searchResults[query.substring(0, query.length - 1)];
      } else {
        neededArray = searchResults[query];
      }
    } 

    const newSearchResults = await searchSubreddits(
      e.target.value,
      neededArray
    );
    let newSearchResultsArr;
    if (newSearchResults) {
      if (e.target.value.length > query.length) {
        newSearchResultsArr = { ...searchResults };
        newSearchResultsArr[e.target.value] = newSearchResults;
        setSearchResults(newSearchResultsArr);
      } else if (e.target.value.length < query.length) {
        newSearchResultsArr = { ...searchResults };
        delete newSearchResultsArr[query];
        setSearchResults(newSearchResultsArr);
      }
    }

    setQuery(e.target.value);
    if(e.target.value.length === 0){
        setPages([]);
    }
    if (newSearchResults.length > 0) {
      const newPages = [];
      let newPage = [];
      for (let entry of newSearchResults) {
        newPage.push(entry);
        if (newPage.length === 10) {
          newPages.push(newPage);
          newPage = [];
        } else if (entry === newSearchResults[newSearchResults.length - 1]) {
          newPages.push(newPage);
          setPages(newPages);
          if (page > newPages.length - 1) {
            setPage(newPages.length - 1);
          }
        }
      }
    } else {
      setPages([]);
    }
  };

  return (
    <div className={styles.browserOverlay}>
      <header className={styles.browserHeader}>
        <h1 className={styles.browserH1}>Subreddit Browser</h1>
        <div className={"searchContainer " + styles.search}>
          <input
            onChange={(e) => handleSearch(e)}
            className="searchInput"
            placeholder="Search"
            id="searchBrowser"
          ></input>
          <button className={"submitButton " + styles.searchButton}>
            {"🔍"}
          </button>
        </div>
        <div className={styles.selectButtons}>
          <button
            onClick={(e) => handleDisplay("Browse")}
            style={display === "Browse" ? { filter: "brightness(1.2)" } : {}}
            disabled={display === "Browse" ? true : false}
          >
            Browse Subreddits
          </button>
          <button
            onClick={(e) => handleDisplay("Saved")}
            style={display === "Saved" ? { filter: "brightness(1.2)" } : {}}
            disabled={display === "Saved" ? true : false}
          >
            Saved Subreddits
          </button>
        </div>
        <div className={styles.browserButtons}>
          <button>❔</button>
          <button onClick={(e) => props.openSubredditBrowser()}>✖</button>
        </div>
      </header>
      <div className={styles.browserResultsWrapper}>
        <h2 className={styles.browserResultsH2}>Results</h2>
        <div className={styles.browserResults}>
          {isLoading ? (
            <h1 className={styles.loadingH1}> Loading... </h1>
          ) : query !== "" && Object.keys(searchResults).length === 0 ? (
            <h1 className={styles.loadingH1}>
              {" "}
              {'No matches found for "' + query + '"'}{" "}
            </h1>
          ) : (
            filteredSubreddits.length > 0 &&
            pages.length > 0 &&
            pages[page].map((subreddit) => (
              <ResultsRow
                display={display}
                subscribe={subscribe}
                subreddit={subreddit}
              />
            ))
          )}
        </div>
      </div>
      <div className={styles.buttonDiv}>
        <div className={styles.pagesDiv}>
          <div className={styles.prevDiv}>
            <button className={styles.dirButton} onClick={() => changePage(0)}>
              <hr className={styles.buttonHr}></hr>▲
            </button>
            <button
              className={styles.dirButton}
              onClick={() => changePage(false)}
            >
              ▲
            </button>
          </div>
          <div className={styles.pagesRow}>
            <Pagination page={page} pages={pages} changePage={changePage} />
          </div>
          <div className={styles.nextDiv}>
            <button
              className={styles.dirButton}
              onClick={() => changePage(true)}
            >
              ▲
            </button>
            <button
              className={styles.dirButton}
              onClick={() => changePage(pages.length - 1)}
            >
              <hr className={styles.buttonHr}></hr>▲
            </button>
          </div>
        </div>
        <button
          onClick={() => loadMore()}
          disabled={display === "Browse" ? false : true}
          className={styles.indexButton + " " + styles.loadMore}
        >
          load More!
        </button>
      </div>
    </div>
  );
}

export default SubredditBrowser;
