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
function SubredditBrowser(props) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([]);
  const subredditList = useSelector(subredditsListSelector);
  const [filteredSubreddits, setFilteredSubreddits] = useState([]);
  const isLoading = useSelector(isLoadingSelector);
  const [more, setMore] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const subreddits = useSelector(selectSubReddits);
  const [display, setDisplay] = useState("Browse");
  const [savedPages, setSavedPages] = useState([]);
  useEffect(() => {
    let newFilteredSubreddits = [];
    if (
      display === "Browse" &&
      pages.flat().length < filteredSubreddits.length
    ) {
      generateResultLine(filteredSubreddits);
      return;
    }
    if (display === "Saved") {
      generateResultLine(subreddits);
      return;
    }  
    if (
        (subredditList.length > 0 || searchResult.length > 0) &&
        more === true &&
        isLoading === false
      ) {
        if (subreddits.length > 0) {
          for (let sub of subreddits) {
            if (newFilteredSubreddits.length === 0) {
              newFilteredSubreddits = subredditList.filter(
                (subreddit) => sub.id !== subreddit.id
              );
            } else {
              newFilteredSubreddits = newFilteredSubreddits.filter(
                (subreddit) => sub.id !== subreddit.id
              );
            }
          }
          if (searchResult.length > 0 && query !== "") {
            setFilteredSubreddits(newFilteredSubreddits);
            rerender(newFilteredSubreddits);
          } else {
            setFilteredSubreddits(newFilteredSubreddits);
            generateResultLine(newFilteredSubreddits);
            setMore(false);
          }
        } else {
          setFilteredSubreddits(subredditList);
          generateResultLine(subredditList);
          setMore(false);
        }
      }
    
  }, [subredditList, searchResult, display, subreddits]);
  const rerender = async (newFilteredSubreddits) => {
    const newSearchResults = await searchSubreddits(
      query,
      newFilteredSubreddits
    );

    setSearchResult(newSearchResults);
    generateResultLine(newSearchResults, "continuesSearch");
    setMore(false);
  };
  const subscribe = async (subreddit) => {
    let type;
    let name = subreddit.display_name;

    if (display === "Saved") {
      type = "unsubscribe";
      let newFilteredSubreddits = [subreddit, ...filteredSubreddits];

      setPages([]);

      setFilteredSubreddits(newFilteredSubreddits);
    } else {
      type = "subscribe";
      let newFilteredSubreddits = filteredSubreddits.filter(
        (sub) => sub.display_name !== name
      );
      setPages([]);

      setFilteredSubreddits(newFilteredSubreddits);
    }
    dispatch(addSubredditThunk({ name: name, type: type }));
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
    const after = subredditList[subredditList.length - 1].name;
    const length = subredditList.length;
    dispatch(
      browseSubredditCategorysThunk({
        subredditList: subredditList,
        after: after,
      })
    );
    setPage(0); // sollte vlt geändert werden das es bei der selben page bleibt und eine neue suche gestartet wird um die alte zu erweitern
    setMore(true);
  };
  const generateResultLine = async (list, type) => {
    let page = [];

    let newPages, begin;
    if (display === "Saved") {
      newPages = [];
      begin = newPages.length;
    } else {
      newPages = type ? [] : [...pages];
      begin = pages.flat().length;
    }

    if (
      pages[pages.length - 1] &&
      pages[pages.length - 1].length !== 10 &&
      display === "Browse"
    ) {
      page = pages[pages.length - 1];
    }

    for (let i = begin; i < list.length; i++) {
      const subreddit = list[i];

      page.push(subreddit);

      if (page.length === 10 || i === list.length - 1) {
        newPages.push(page);
        page = [];
      }
    }


    if (display === "Saved") {
      setSavedPages(newPages);
    } else {
      setPages(newPages);
    }

    setMore(false);
  };
  const handleDisplay = async (display) => {
    setPages([]);
    setSavedPages([]);
    setDisplay(display);
  };
  const handleChange = async (e) => {
    setQuery(e.target.value);
    const searchResults = await searchSubreddits(
      e.target.value,
      filteredSubreddits
    );
    if (searchResults.length > 0) {
      setPages([]);
      setSearchResult(searchResults);
      setPage(0);
      setMore(true);
    } else {
      setSearchResult([]);
      setPages([]);
    }
  };

  return (
    <div className={styles.browserOverlay}>
      <header className={styles.browserHeader}>
        <h1 className={styles.browserH1}>Subreddit Browser</h1>
        <div className={"searchContainer " + styles.search}>
          <input
            onChange={(e) => handleChange(e)}
            className="searchInput"
            placeholder="Search"
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
          ) : query !== "" && searchResult.length === 0 ? (
            <h1 className={styles.loadingH1}>
              {" "}
              {'No matches found for "' + query + '"'}{" "}
            </h1>
          ) : filteredSubreddits.length > 0 &&
            pages.length > 0 &&
            display === "Browse" ? (
            pages[page].map((subreddit) => (
              <ResultsRow
                display={display}
                subscribe={subscribe}
                subreddit={subreddit}
              />
            ))
          ) : subreddits.length > 0 &&
            savedPages.length > 0 &&
            display === "Saved" ? (
            savedPages[page].map((subreddit) => (
              <ResultsRow
                display={display}
                subscribe={subscribe}
                subreddit={subreddit}
              />
            ))
          ) : null}
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
            <Pagination
              page={page}
              pages={display === "Browse" ? pages : savedPages}
              changePage={changePage}
            />
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
