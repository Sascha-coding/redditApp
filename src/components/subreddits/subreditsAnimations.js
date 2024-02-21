import React from "react";

export const AddAnimations1 = () => {
    const subredditParagraphs = document.getElementsByClassName("srn");
    let styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    const sheet = styleSheet.sheet;
    sheet.insertRule(
      `@keyframes brightness {
        0% {
          filter:brightness(100%);
        }
        3.1%{
          filter:brightness(150%);
        }
        30.99%{
          filter:brightness(150%);
        }
        31%{
          filter:brightness(100%);
        }
      }`
      )
    sheet.insertRule(
      `@keyframes rotate {
          0% {
            opacity: 100%;
          }
        
          /* Rotating keyframes every 1% */
          0%, 1%, 2%, 3%, 4%, 5%, 6%, 7%, 8%, 9%, 10%, 11%, 12%, 13%, 14%, 15%, 16%, 17%, 18%, 19%, 20%, 21%, 22%, 23%, 24%, 25%, 26%, 27%, 28%, 29% {
            rotate:20deg;
          }
        
          /* Rotating keyframes every 1% */
          0.5%, 1.5%, 2.5%, 3.5%, 4.5%, 5.5%, 6.5%, 7.5%, 8.5%, 9.5%, 10.5%, 11.5%, 12.5%, 13.5%, 14.5%, 15.5%, 16.5%, 17.5%, 18.5%, 19.5%, 20.5%, 21.5%, 22.5%, 23.5%, 24.5%, 25.5%, 26.5%, 27.5%, 28.5%, 29.5% {
            rotate : -20deg;
          }
        
      }`
    )
    for (let i = 0; i < subredditParagraphs.length; i++) {
      const paragraph = subredditParagraphs[i];
      const beam = paragraph.firstChild;
      const top = beam.firstChild;
      const bot = beam.lastChild;
      const width = paragraph.offsetWidth;
      const button = paragraph.parentElement;
      const thunders = document.getElementsByClassName("th")
      
      sheet.insertRule(
        `@keyframes beam${i} {
          0% {
            width:1px;
            height:2px;
            left: 0px;
            opacity: 50%;
          }
          3.1%{
            top:0px;
            height:3vh;
          }
          26.45%{
            height:3vh;
            top:0px;
          }
          30%{
            width:1px;
          }
          30.99%{
            opacity:50%
          }
          31% {
            width:30px;
            top:1.25vh;
            height:2px;
            left: ${width}px;
            opacity:0%;
          }
        }`
      )
      let timeOutId;
      button.addEventListener("mouseover", () => {
        timeOutId = setTimeout(() => {
          beam.style.animation = `beam${i} 3.25s ease-in-out infinite`;
          top.style.animation = `brightness 3.25s ease-in-out infinite`;
          bot.style.animation = `brightness 3.25s ease-in-out infinite`;
          for(let i = 0; i < thunders.length; i++){
            thunders[i].style.animation = `rotate 1s ease-in-out infinite`;
          }
        },1000)
      })
      button.addEventListener("mouseout", () => {
        beam.style.animation = "";
        top.style.animation = "";
        bot.style.animation = "";
        for(let i = 0; i < thunders.length; i++){
          thunders[i].style.animation = "";
        }
        clearTimeout(timeOutId);
      })
    }
    return (
        <>
            <style rel="stylesheet" href={sheet} />
        </>
    )
}
  export const AddAnimations2 = () => {
    const containers = document.getElementsByClassName("lc");
    let styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    const sheet = styleSheet.sheet;
    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      const light = container.firstChild;
      const width = container.offsetWidth;
      const button = container.parentElement;
      
      sheet.insertRule(
        `@keyframes light3_${i} {
          0% {
            width:20px;
            filter:brightness(150%);
            opacity:100%;
            left: 0px;
          }
          1%{
            width:2px;
          }
          22.99%{
            filter:brightness(150%);
            opacity:100%
          }
          23% {
            filter:brightness(100%);
            opacity:0%;
            left: ${width}px;
          }
        }`
      )
      let TimeoutId
      button.addEventListener("mouseover", () => {
        TimeoutId = setTimeout(() => {
          light.style.animation = `light3_${i} 3.25s ease-in-out infinite`;
        },1885)
      })
      button.addEventListener("mouseout", () => {
        clearTimeout(TimeoutId);
        light.style.animation = "";
      })
    }
    return (
        <>
            <style rel="stylesheet" href={sheet} />
        </>
    )
  }