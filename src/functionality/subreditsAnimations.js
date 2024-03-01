let leBlue = "rgb(164, 217, 249)";
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
    for (let i = 0; i < subredditParagraphs.length; i++) {
      const paragraph = subredditParagraphs[i];
      const beam = paragraph.firstChild;
      const width = paragraph.offsetWidth;
      beam.style.left = `${width}px`;
      const button = paragraph.parentElement;
      
      sheet.insertRule(
        `@keyframes beam${i} {
          0% {
            width:3px;
            height:2px;
            left: ${1}px;
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
      let intervalId,timeOutId
      
      button.addEventListener("mouseenter", (event) => {
        
        timeOutId = setTimeout(() => {
          clearTimeout(timeOutId);
          beam.style.animation = `beam${i} 3.25s ease-in-out infinite`;
          intervalId = setInterval(() => {
            let animationId = requestAnimationFrame(changeTextColor);
            cancelAnimationFrame(animationId)
            changeTextColor(event.target.id,intervalId,1,animationId);
            
          },4);
          
        },1000)
      })
      button.addEventListener("mouseout", (event) => {
        
        
        beam.style.animation = `beam${i} 3.25s ease-in-out infinite reverse`;
        clearTimeout(timeOutId);
        clearInterval(intervalId);
        audio.pause();
        audio.currentTime = 0;
        intervalId = setInterval(() => {
          let animationId = requestAnimationFrame(changeTextColor);
          cancelAnimationFrame(animationId);
          changeTextColor(event.target.id,intervalId,3,animationId);
          
        },4);
        x=0;
      })
    }
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
            width:10px;
            filter:brightness(150%);
            opacity:1;
            left: 0px;
          }
          22.99%{
            filter:brightness(150%);
            opacity:100%;
          }
          23% {
            filter:brightness(100%);
            opacity:0%;
            width:50px;
            left: ${width+50}px;
          }
        }`
      )
      let TimeoutId
      button.addEventListener("mouseenter", () => {
        TimeoutId = setTimeout(() => {
          light.style.animation = `light3_${i} 3.25s ease-in-out infinite`;

        },1885)
      })
      button.addEventListener("mouseout", () => {
        clearTimeout(TimeoutId);
        light.style.animation = "";
      })
    }
  }
  let addedAnimations = {}
  export const animate = (subreddits) => {
    let ctx;
    let canvas;
    let id;
    
    for(let subreddit of subreddits){
      id=subreddit.id;
      if(addedAnimations.id){
        canvas = addedAnimations.id.canvas;
        canvas.width = canvas.firstChild.offsetWidth;
        canvas.height = canvas.firstChild.offsetHeight;
        ctx = addedAnimations.id.ctx;
        id = addedAnimations.id.id;
      }else{
        canvas = document.getElementsByClassName(id)[0];
        canvas.width = canvas.previousElementSibling.offsetWidth;
        canvas.height = canvas.previousElementSibling.offsetHeight;
        ctx = canvas.getContext("2d");
        addedAnimations[id] = {id:id, ctx:ctx, canvas:canvas, dn:subreddit.display_name, data:""}
      }
      
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      addedAnimations[id].imageData = imageData;
      ctx.font = `36px 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`;
      ctx.letterSpacing="1px";
      ctx.fillStyle = "orangered"; // Set fill style for the text
      ctx.textAlign = "start";
      ctx.textBaseline = "bottom";
      ctx.strokeStyle = "orangered";
      
      ctx.moveTo(0, canvas.height - 4);
      ctx.lineTo(canvas.width,canvas.height - 4);
      ctx.moveTo(0, canvas.height - 5);
      ctx.lineTo(canvas.width,canvas.height - 5);
      ctx.moveTo(0, canvas.height - 6);
      ctx.lineTo(canvas.width,canvas.height - 6);
      ctx.stroke();
      ctx.fillText(`${subreddit.display_name}`,  0,canvas.height); 
  }
  console.log(addedAnimations);
}
let x = 0;
const runningIds = [];
export const changeTextColor = (id,intervalId,phase,animationId) => {
  if(!addedAnimations[id]){
    return
  }
  animationId = requestAnimationFrame(changeTextColor);
  if (runningIds.includes(id)){
    
  }
  const animationElement = document.getElementById(`beam-${id}`);
  const canvas = addedAnimations[id].canvas;
  const ctx = addedAnimations[id].ctx;
  const dn = addedAnimations[id].dn
  ctx.clearRect(0,0,canvas.width,canvas.height); 
  let gradient;
  if(phase === 1){
    console.log(phase);
    const computedStyle = window.getComputedStyle(animationElement);

    const width = Number(computedStyle.left.slice(0, computedStyle.left.length - 2)).toFixed(2);
  
    let scaledWidth = (width / canvas.width) > 1 ? 1 : (width / canvas.width);
    gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(scaledWidth, leBlue); // Start color (left)
    gradient.addColorStop(scaledWidth, leBlue); // Start color (left)
    gradient.addColorStop(scaledWidth, "orangered");
    gradient.addColorStop(1, "orangered"); // End color (right)
    ctx.fillStyle=gradient;
    ctx.strokeStyle=gradient;
    if(scaledWidth >= 0.95){ 
      ctx.fillStyle=leBlue;
      ctx.strokeStyle= leBlue;
      clearInterval(intervalId);
      cancelAnimationFrame(animationId);
      /*const intervalId2 =setInterval(()=>{
        changeTextColor(id,intervalId2,2);
      },100)*/
    }
    
  }else if(phase === 2){
    /*x+=0.01;
    if (x >= 0.5) {
      clearInterval(intervalId);
    }else{
    let x2 = x * 2;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gradient = ctx.createLinearGradient(canvas.width / 2, canvas.height, canvas.width / 2, 0);
    gradient.addColorStop(0, "skyblue");
    gradient.addColorStop(x, "skyblue");
    gradient.addColorStop(0.495, "white");
    gradient.addColorStop(0.505, "white");
    gradient.addColorStop(x2, "skyblue");
    gradient.addColorStop(1, "skyblue");
    }*/
  }else if(phase === 3){
    let beam = document.getElementById("beam-"+id);
    const computedStyle = window.getComputedStyle(beam);
    console.log(computedStyle.left);    
    const width = Number(computedStyle.left.slice(0, computedStyle.left.length - 2)).toFixed(2);

    let scaledWidth = (width / canvas.width) > 1 ? 1 : (width / canvas.width);
    gradient = ctx.createLinearGradient(canvas.width, 0, 0, 0, );
    gradient.addColorStop(scaledWidth, "orangered");
    gradient.addColorStop(scaledWidth, "orangered");
    gradient.addColorStop(scaledWidth, leBlue);
    gradient.addColorStop(1, leBlue); // End color (right)
    ctx.fillStyle=gradient;
    ctx.strokeStyle=gradient;
    console.log(scaledWidth)
    if(scaledWidth >= 0.95){ 
      console.log("YUP");
      ctx.fillStyle="orangered";
      ctx.strokeStyle= "orangered";
      beam.style.animation = "";
      beam.style.left = "1px";
      clearInterval(intervalId);
      cancelAnimationFrame(animationId)
    }
  }

  ctx.moveTo(0, canvas.height - 4);
  ctx.lineTo(canvas.width,canvas.height - 4);
  ctx.moveTo(0, canvas.height - 5);
  ctx.lineTo(canvas.width,canvas.height - 5);
  ctx.moveTo(0, canvas.height - 6);
  ctx.lineTo(canvas.width,canvas.height - 6);
  ctx.stroke();
  ctx.fillText(`${dn}`,  0,canvas.height);
  
}

