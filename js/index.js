const 정답 = "LOVEU";

let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%   { transform: translateY(0px); }
        50%  { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);

    const div = document.createElement("div");
    div.innerText = "🎉 정답입니다! \n 🥰I LOVE U!!😍";
    div.style =
      "display: flex; justify-content: center; align-items: center;" +
      "position: absolute; top: 40vh; left: 45%;" +
      "background-color: white; width: 250px; height: 100px;" +
      "border-radius: 12px; font-weight: bold; font-size: 16px;" +
      "animation: float 2s ease-in-out infinite; z-index: 999;";
    document.body.appendChild(div);
  };

  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes shake {
      0% { transform: translateX(0); }
      20% { transform: translateX(-5px); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
      100% { transform: translateX(0); }
    }

    .shake {
      animation: shake 0.4s;
    }
  `;
  document.head.appendChild(shakeStyle);

  function setupKeyboardClicks() {
    const keys = document.querySelectorAll(".keyboard-column");
    keys.forEach((keyEl) => {
      keyEl.addEventListener("click", () => {
        const key = keyEl.dataset.key || keyEl.innerText;
        handleKeyInput(key.toUpperCase());
      });
    });
  }

  function handleKeyInput(key) {
    const keyCode = key.charCodeAt(0);

    if (key === "BACK" || key === "BACKSPACE") {
      handleBackspace();
    } else if (key === "ENTER") {
      if (index === 5) {
        handleEnterKey();
      } else {
        alert("5글자를 모두 입력하세요!");
      }
    } else if (65 <= keyCode && keyCode <= 90 && index < 5) {
      const thisBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index}']`
      );
      thisBlock.innerText = key;
      index += 1;
    }
  }
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const nextLine = () => {
    if (attempts === 6) return;
    attempts += 1;
    index = 0;
  };

  const handleEnterKey = () => {
    let 맞은_갯수 = 0;
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.backgroundColor = "#6aaa64";
        updateKeyboardColor(입력한_글자, "#6aaa64");
      } else if (정답.includes(입력한_글자)) {
        block.style.backgroundColor = "#c9b458";
        updateKeyboardColor(입력한_글자, "#c9b458");
      } else {
        block.style.backgroundColor = "#787c7e";
        updateKeyboardColor(입력한_글자, "#787c7e");
      }

      block.style.color = "white";
    }

    if (맞은_갯수 === 5) {
      gameover();
    } else {
      for (let i = 0; i < 5; i++) {
        const block = document.querySelector(
          `.board-column[data-index='${attempts}${i}']`
        );
        block.classList.add("shake");
        block.addEventListener(
          "animationend",
          () => {
            block.classList.remove("shake");
          },
          { once: true }
        );
      }

      nextLine();
    }
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
      index -= 1;
    }
  };

  const handleKeydown = (e) => {
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;

    if (e.key === "Backspace") {
      handleBackspace();
    } else if (e.key === "Enter") {
      if (index === 5) {
        handleEnterKey();
      } else {
        alert("5글자를 모두 입력하세요!");
      }
    } else if (65 <= keyCode && keyCode <= 90 && index < 5) {
      const thisBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index}']`
      );
      thisBlock.innerText = key;
      index += 1;
    }
  };

  function toPadStart(num) {
    return String(num).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const clock = document.getElementById("clock");

    clock.innerHTML =
      `${year}년 ${toPadStart(month)}월 ${toPadStart(date)}일 ` +
      `${toPadStart(hours)}시 ${toPadStart(minutes)}분 ${toPadStart(
        seconds
      )}초`;

    setTimeout(updateClock, 1000);
  }

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `경과 시간: ${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  function updateKeyboardColor(key, color) {
    document.querySelectorAll(".keyboard-column").forEach((el) => {
      if (el.innerText === key) {
        const currentColor = el.style.backgroundColor;
        if (
          currentColor === "rgb(106, 170, 100)" || // 초록
          (currentColor === "rgb(201, 180, 88)" && color === "#787c7e") // 노랑 후 회색 무시
        )
          return;
        el.style.backgroundColor = color;
        el.style.color = "white";
      }
    });
  }

  setupKeyboardClicks();
  updateClock();
  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
