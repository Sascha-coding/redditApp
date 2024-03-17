import React, { useState, useEffect } from 'react';
import styles from './subredditBrowser.module.css';
  function Pagination(props) {
    const [buttonList , setButtonList] = useState([]);
    const [pages, setPages] = useState(props.pages);
    if(pages !== props.pages){
        
        setPages(props.pages);
    }
    useEffect(() => {
        generateButtons();
    },[props.page, props.pages]);
    const generateButtons = () => {

        let page = props.page;
        if(page < 0){
            page = 0;
        }

        let newButtonList = [];
        let min = Math.max(0, page - 5);
        let max = min + 9;
        if(pages.length < 10){
            max = pages.length -1;
            min = 0;
        }
        if(max > pages.length-1){
            max = pages.length-1;
            min = max - 9;
        }
        if(pages.length === 0){
            min = 0;
            max = 9;   
        }
        if(!pages === 0){
            min = 0;
            max = 0;
        }

        for(let i = min; i <= max; i++){

            const button = (
                <button
                key={i} // Important for React's reconciliation
                className={styles.indexButton}
                style={{
                  color: i === page ? "rgb(164, 217, 249)" : "rgba(255, 68, 0, 0.7)", // Style based on selection
                }}
                onClick={() => props.changePage(i)}
              >
                {i + 1}
              </button>
            )
            newButtonList.push(button);
        }
        if(props.pages.length === 0){
            newButtonList = [<button
                key={1} // Important for React's reconciliation
                className={styles.indexButton}
                style={{
                  color:"rgb(164, 217, 249)" 
                }}
                onClick={() => props.changePage(0)}
              >
                {1}
              </button>
                
            ]
        }
        setButtonList(newButtonList);
    }
    console.log(props.page);
	return (
	  <>
        {buttonList.map(button => button)}
      </>
	);
  }
  
  export default Pagination;
  