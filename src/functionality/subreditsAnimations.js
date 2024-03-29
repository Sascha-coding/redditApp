let leBlue = "rgb(164, 217, 249)";
let leRed = "rgba(255, 68, 0, 0.9)";

export const AddAnimations1 = () => {
  const subredditParagraphs = document.getElementsByClassName("srn");
  let styleSheet = document.createElement("style");
  let styleSheet2 = document.createElement("style");
  document.head.appendChild(styleSheet);
  document.head.appendChild(styleSheet2);
  const sheet = styleSheet.sheet;
  const sheet2 = styleSheet2.sheet;
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
  );
  for (let i = 0; i < subredditParagraphs.length; i++) {
    const paragraph = subredditParagraphs[i];
    const beam = paragraph.firstChild;
    const beam2 = paragraph.lastChild;
    const width = paragraph.offsetWidth;
    beam2.style.left = width - 2 + "px";
    const button = paragraph.parentElement;

    sheet.insertRule(
      `@keyframes beam${button.id} {
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
    );
    sheet2.insertRule(
      `@keyframes revbeam${button.id} {
          0% {
            width:3px;
            height:2px;
            left: ${width - 1}px;
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
            left: ${1}px;
            opacity:0%;
          }
        }`
    );
    let intervalId, timeOutId;
    const mouseEnter = (buttonId) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        clearTimeout(timeOutId);
        addedAnimations[buttonId].done = false;
        addedAnimations[buttonId].ready = false;
        addedAnimations[buttonId].lastPhase = 1;
        beam.style.animation = `beam${buttonId} 3.25s ease-in-out infinite`;
        clearInterval(addedAnimations[buttonId].lastIntervalId);
        intervalId = setInterval(() => {
          let animationId = requestAnimationFrame(changeTextColor);
          cancelAnimationFrame(animationId);
          changeTextColor(buttonId, intervalId, 1, false);
        }, 4);
      }, 1000);
    };

    button.removeEventListener("mouseenter", (e) => mouseEnter(button.id));
    button.addEventListener("mouseenter", (e) => mouseEnter(button.id));

    const mouseOut = (buttonId) => {
      beam2.style.animation = ``;
      
      clearTimeout(timeOutId);
      audio.pause();
      audio.currentTime = 0;
      addedAnimations[buttonId].lastPhase = 3;
      addedAnimations[buttonId].done = false;
      let animationId = requestAnimationFrame(changeTextColor);
      cancelAnimationFrame(animationId);
    };
    button.removeEventListener("mouseout", (e) => mouseOut(button.id));
    button.addEventListener("mouseout", (e) => mouseOut(button.id));
  }
};
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
            left: ${width + 50}px;
          }
        }`
    );
    let TimeoutId;
    button.addEventListener("mouseenter", () => {
      TimeoutId = setTimeout(() => {
        light.style.animation = `light3_${i} 3.25s ease-in-out infinite`;
      }, 1885);
    });
    button.addEventListener("mouseout", () => {
      clearTimeout(TimeoutId);
      light.style.animation = "";
    });
  }
};
let addedAnimations = {};
export const animate = (subreddits) => {
  addedAnimations = {};
  let ctx;
  let canvas;
  let id;
  let lastIntervalId;
  for (let subreddit of subreddits) {
    id = subreddit.id;
    if (addedAnimations.id) {
      canvas = addedAnimations.id.canvas;
      canvas.width = canvas.firstChild.offsetWidth;
      canvas.height = canvas.firstChild.offsetHeight;
      ctx = addedAnimations.id.ctx;
      id = addedAnimations.id.id;
      lastIntervalId = addedAnimations.id.lastIntervalId;
    } else {
      canvas = document.getElementsByClassName(id)[0];
      canvas.width = canvas.previousElementSibling.offsetWidth;
      canvas.height = canvas.previousElementSibling.offsetHeight;
      ctx = canvas.getContext("2d");
      addedAnimations[id] = {
        ready: false,
        done: false,
        lastPhase: 1,
        lastIntervalId: [],
        id: id,
        ctx: ctx,
        canvas: canvas,
        dn: subreddit.display_name,
        data: "",
      };
    }

    ctx.font = `36px 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`;
    ctx.letterSpacing = "1px";
    ctx.fillStyle = leRed; // Set fill style for the text
    ctx.textAlign = "start";
    ctx.textBaseline = "bottom";
    ctx.strokeStyle = leRed;

    ctx.moveTo(0, canvas.height - 4);
    ctx.lineTo(canvas.width, canvas.height - 4);
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.moveTo(0, canvas.height - 6);
    ctx.lineTo(canvas.width, canvas.height - 6);
    ctx.stroke();
    ctx.fillText(`${subreddit.display_name}`, 0, canvas.height);
  }
};
let x = 0;
const getNextInterval = (id) => {
  addedAnimations[id].lastIntervalId.forEach((intervalId) => {
    clearInterval(intervalId);
  });
  let phase3IntervalId = setInterval(() => {
    changeTextColor(id, phase3IntervalId, 3, true);
  }, 4);
  addedAnimations[id].lastPhase = 1;
};

export const changeTextColor = (id, intervalId, phase, ready) => {
  if (!addedAnimations[id]) {
    return;
  }
  let animationId = requestAnimationFrame(changeTextColor);

  const canvas = addedAnimations[id].canvas;
  const ctx = addedAnimations[id].ctx;
  const dn = addedAnimations[id].dn;
  addedAnimations[id].lastIntervalId.push(intervalId);
  let gradient;
  if (phase === 1) {
    const animationElement = document.getElementById(`beam-${id}`);
    const computedStyle = window.getComputedStyle(animationElement);
    if (!addedAnimations[id].done) {
      const width = Number(
        computedStyle.left.slice(0, computedStyle.left.length - 2)
      ).toFixed(2);

      let scaledWidth =
        width / canvas.width + 0.025 >= 1 ? 1 : width / canvas.width + 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(scaledWidth, leBlue); // Start color (left)
      gradient.addColorStop(scaledWidth, leBlue); // Start color (left)
      gradient.addColorStop(scaledWidth, leRed);
      gradient.addColorStop(1, leRed); // End color (right)
      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      if (scaledWidth === 1) {
        ctx.fillStyle = leBlue;
        ctx.strokeStyle = leBlue;
        addedAnimations[id].done = true;
        if (addedAnimations[id].lastPhase === 3) {
          addedAnimations[id].ready = true;
        }
      }
      ctx.moveTo(0, canvas.height - 4);
      ctx.lineTo(canvas.width, canvas.height - 4);
      ctx.moveTo(0, canvas.height - 5);
      ctx.lineTo(canvas.width, canvas.height - 5);
      ctx.moveTo(0, canvas.height - 6);
      ctx.lineTo(canvas.width, canvas.height - 6);
      ctx.stroke();
      ctx.fillText(`${dn}`, 0, canvas.height);
    }
    if (addedAnimations[id].ready === true) {
      clearInterval(intervalId);
      cancelAnimationFrame(animationId);
      animationElement.style.animation = ``;
      animationElement.style.left = `${canvas.width}px`;
      addedAnimations[id].done = false;
      addedAnimations[id].ready = false;
      getNextInterval(id);
    }
  } else if (phase === 3) {
    const animationElement = document.getElementById(`beam-${id}-2`);
    animationElement.style.animation = `revbeam${id} 1.5s ease-in-out`;
    animationElement.style.animationFillMode = "forwards";
    const computedStyle = window.getComputedStyle(animationElement);
    let width = Number(
      computedStyle.left.slice(0, computedStyle.left.length - 2)
    ).toFixed(2);
    width = canvas.width - width;
    if (width <= -1) {
      width = 1;
      //cancelAnimationFrame(animationId);
      //clearInterval(intervalId);
    }
    let scaledWidth =
      width / canvas.width + 0.025 >= 1 ? 1 : width / canvas.width + 0.02;
    scaledWidth = scaledWidth <= 0 ? 0.01 : scaledWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gradient = ctx.createLinearGradient(canvas.width, 0, 0, 0);
    gradient.addColorStop(scaledWidth, leRed);
    gradient.addColorStop(scaledWidth, leRed);
    gradient.addColorStop(scaledWidth, leBlue);
    gradient.addColorStop(1, leBlue);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = gradient;
    if (scaledWidth === 1) {
      clearInterval(intervalId);
      addedAnimations[id].lastIntervalId.forEach((id) => {
        clearInterval(id);
      })
      addedAnimations[id].done = false;
      addedAnimations[id].ready = false;
      addedAnimations[id].lastPhase = 1;
      ctx.fillStyle = leRed;
      ctx.strokeStyle = leRed;
      animationElement.style.animation = "";
      animationElement.style.left = `${canvas.width}px`;
      
      cancelAnimationFrame(animationId);
    }
    ctx.moveTo(0, canvas.height - 4);
    ctx.lineTo(canvas.width, canvas.height - 4);
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.moveTo(0, canvas.height - 6);
    ctx.lineTo(canvas.width, canvas.height - 6);
    ctx.stroke();
    ctx.fillText(`${dn}`, 0, canvas.height);
  }
};
