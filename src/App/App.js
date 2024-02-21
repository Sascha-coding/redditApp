import React from "react";
import styles from "./App.module.css";

import Logo from "../data/redditLogo";
import Subreddits from "../components/subreddits/subreddits";
import Reddit from "../components/reddit/reddit";

import SearchInput from "../components/SearchInput/searchInput";

const App = (props) => {

  return (
    <>
      <header className="header">
        <div className="headerBackground">
          <div className="headerContent">
          <div className="logoWrapper">
            <Logo />
          </div>
          <SearchInput />
        </div>
        </div>
      </header>
      <Reddit />
      <Subreddits />
    </>
  );
};

export default App;
