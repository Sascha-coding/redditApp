import React from 'react';
import styles from './App.module.css';

import Logo from '../data/redditLogo';

const App = () => {
  return (
    <header>
      <div className={styles.Logo}>
        <Logo/>
        <p>RedditApp</p>
      </div>
    </header>
  );
}

export default App;
