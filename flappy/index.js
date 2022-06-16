const boxContainer = document.querySelector(".boxContainer");
boxContainer.style.width = toPx(BOX_WIDTH);
boxContainer.style.height = toPx(BOX_HEIGHT);
const playMenu = document.querySelector(".playMenu");
const gameOver = document.querySelector(".gameOver");
const scoreBox = document.querySelector(".scoreBox");

let frames = 0;

// control the flow of game
//first case:the first menu screen and if switch to play mode hide the menu screen
boxContainer.addEventListener("click", function (evt) {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      playMenu.style.display = "none";
      break;
    case state.game:
      if (bird.y - bird.radius <= 0) return; // if bird is outside the top frame will return back
      bird.flap();
      break;
    case state.over: //if game is over reset to play again
      pipes.reset();
      bird.speedReset();
      score.reset();
      state.current = state.getReady;
      break;
  }
});

// the backgorund of the game
const bg = {
  make: function () {
    background = document.createElement("img");
    background.src = "./image/background.png";
    background.style.width = toPx(BOX_WIDTH);
    background.style.height = toPx(BOX_HEIGHT);
    boxContainer.appendChild(background);
  },
};

// the base at the bottom
const fg = {
  w: BOX_WIDTH,
  h: BOX_HEIGHT * 0.1,
  x: 0,
  y: BOX_HEIGHT * 0.9,

  make: function () {
    background = document.createElement("img");
    background.src = "./image/base.png";
    background.style.width = toPx(BOX_WIDTH);
    background.style.height = toPx(BOX_HEIGHT * 0.1);
    background.style.position = "absolute";
    background.style.zIndex = "1";
    background.style.left = toPx(this.x);
    background.style.top = toPx(this.y);
    boxContainer.appendChild(background);
  },
};

//animating the bird as it has different animation continuously
const bird = {
  animation: [
    "./image/bird-up.png",
    "./image/bird-mid.png",
    "./image/bird-down.png",
    "./image/bird-mid.png",
  ],

  x: 50,
  y: 150,
  w: 34,
  h: 26,
  radius: 12,
  frame: 0,
  speed: 0, //when bird goes up
  gravity: 0.25, // when bird goes down ->gravity
  jump: 4.6,
  rotation: 0,
  element: null,

  //creating the bird
  create: function () {
    let bird = document.createElement("img");
    bird.src = this.animation[1];
    bird.style.width = toPx(this.w);
    bird.style.height = toPx(this.h);
    bird.style.position = "absolute";
    bird.style.left = toPx(this.x - this.w / 2); //to make center
    bird.style.top = toPx(this.y - this.h / 2); //to make center
    boxContainer.appendChild(bird);
    this.element = bird;
  },
  make: function () {
    let bird = this.animation[this.frame];
    this.element.src = bird;
    this.element.style.left = toPx(this.x - this.w / 2);
    this.element.style.top = toPx(this.y - this.h / 2);
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function () {
    // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
    this.period = state.current == state.getReady ? 10 : 5;
    // WE INCREMENT THE FRAME BY 1, EACH PERIOD
    this.frame += frames % this.period == 0 ? 1 : 0;
    // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
    //  OUR ANIMATION LENGTH IS 4
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150; // RESET POSITION OF THE BIRD AFTER GAME OVER
      this.rotation = 0;
    } else {
      this.speed += this.gravity;
      this.y += this.speed; //-ve goes top, +ve goes bottom

      //checking with the base
      if (this.y + this.h / 2 >= BOX_HEIGHT - fg.h) {
        //if the pos y+half of bird greater than box height minus the base height
        this.y = BOX_HEIGHT - fg.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
        }
      }

      // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
      if (this.speed >= this.jump) {
        this.rotation = 90;
        this.frame = 1;
      } else {
        this.rotation = -25;
      }
    }
  },
  speedReset: function () {
    this.speed = 0;
  },
};

// PIPES
const pipes = {
  position: [],

  topPipeImgSrc: "./image/pipe-top.png",
  bottomPipeImgSrc: "./image/pipe-bottom.png",

  w: 53,
  h: 400,
  gap: 120,
  maxYPos: -150,
  dx: 2,
  elementUp: null,
  elementDown: null,
  element: [],
  elementCount: 0,
  create: function () {
    let pipeTop = document.createElement("img");
    pipeTop.src = this.topPipeImgSrc;
    pipeTop.style.width = toPx(this.w);
    pipeTop.style.height = toPx(this.h);
    pipeTop.style.position = "absolute";
    pipeTop.style.left = toPx(BOX_WIDTH);
    pipeTop.style.top = toPx(BOX_HEIGHT);
    boxContainer.appendChild(pipeTop);
    this.elementUp = pipeTop;

    let pipeBottom = document.createElement("img");
    pipeBottom.src = this.bottomPipeImgSrc;
    pipeBottom.style.width = toPx(this.w);
    pipeBottom.style.height = toPx(this.h);
    pipeBottom.style.position = "absolute";
    pipeBottom.style.left = toPx(BOX_WIDTH);
    pipeBottom.style.top = toPx(BOX_HEIGHT);
    boxContainer.appendChild(pipeBottom);
    this.elementDown = pipeBottom;
    this.element.push({ pipeTop, pipeBottom });
    this.elementCount++;
  },

  make: function () {
    //move the position
    if (state.current !== state.game) return;
    if (frames % 100 == 0) {
      //only pipe comes after 100 frames
      pipes.create();
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      console.log("poos", this.position.length, this.elementCount); //screen pipe equal to position as it pushes conti

      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      // top pipe
      this.element[i].pipeTop.style.left = toPx(p.x);
      this.element[i].pipeTop.style.top = toPx(topYPos);

      // bottom pipe
      this.element[i].pipeBottom.style.left = toPx(p.x);
      this.element[i].pipeBottom.style.top = toPx(bottomYPos);
    }
  },

  update: function () {
    if (state.current !== state.game) return;

    if (frames % 100 == 0) {
      //for every 100 frame push
      this.position.push({
        x: BOX_WIDTH,
        y: this.maxYPos * (Math.random() + 1), //random generate the position
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let bottomPipeYPos = p.y + this.h + this.gap; //position for the bottom pipe

      // COLLISION DETECTION
      // TOP PIPE
      if (
        bird.x + bird.radius > p.x && //check the right side of bird with pipe
        bird.x - bird.radius < p.x + this.w && //check the left side of bird with pipe
        bird.y + bird.radius > p.y && //check the bottom of the bird with pipe
        bird.y - bird.radius < p.y + this.h //check the top with pipe
      ) {
        state.current = state.over;
      }
      // BOTTOM PIPE
      if (
        bird.x + bird.radius > p.x && //same for bottom pipe
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeYPos &&
        bird.y - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.over;
      }

      // MOVE THE PIPES TO THE LEFT
      p.x -= this.dx;

      // if the pipes go beyond , we delete them from the array
      if (p.x + this.w <= 0) {
        this.position.shift();
        this.remove();

        score.value += 1;
        score.highScore = Math.max(score.value, score.highScore);
        localStorage.setItem("highScore", score.highScore);
      }
    }
  },

  //for removing pipe from DOM
  remove: function () {
    let removedPipe = this.element.shift(); //pop the element by fifo
    removedPipe.pipeTop.parentNode.removeChild(removedPipe.pipeTop);
    removedPipe.pipeBottom.parentNode.removeChild(removedPipe.pipeBottom);
    console.log("removedPipe", removedPipe);
  },

  reset: function () {
    this.position = [];
    //remove all pipe created
    this.element.forEach((ele) => {
      let removedPipe = ele;
      removedPipe.pipeTop.parentNode.removeChild(removedPipe.pipeTop);
      removedPipe.pipeBottom.parentNode.removeChild(removedPipe.pipeBottom);
      console.log("removedPipe", removedPipe);
    });
    this.element = [];
    this.elementCount = 0;
  },
};

// GET READY MESSAGE
const getReadyMsg = {
  make: function () {
    if (state.current == state.getReady) {
      playMenu.style.display = "flex";
      gameOver.style.display = "none";
    }
  },
};
// GAME OVER MESSAGE
const gameOverMsg = {
  make: function () {
    if (state.current == state.over) {
      playMenu.style.display = "none";
      gameOver.style.display = "flex";
    }
  },
};

// SCORE
const score = {
  highScore: parseInt(localStorage.getItem("highScore")) || 0,
  value: 0,

  make: function () {
    if (state.current == state.game) {
      scoreBox.style.display = "flex";
      scoreBox.querySelector(".score").textContext = this.value;
    } else if (state.current == state.over) {
      scoreBox.style.display = "flex";
      // SCORE VALUE
      scoreBox.querySelector(".score").textContent = this.value;

      // HIGH SCORE
      scoreBox.querySelector(".highScore").textContent = this.highScore;
    }
  },

  reset: function () {
    this.value = 0;
  },
};

function make() {
  bird.make();
  pipes.make();
  getReadyMsg.make();
  gameOverMsg.make();
  score.make();
}

function update() {
  bird.update();
  pipes.update();
}

function loop() {
  update();
  make();
  frames++;
  requestAnimationFrame(loop);
}

bg.make();
fg.make();
bird.create();
loop();
