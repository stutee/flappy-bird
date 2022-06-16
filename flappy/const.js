const BOX_WIDTH = 320;
const BOX_HEIGHT = 480;
const toPx = (px) => `${px}px`;

// the different states of the game
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};
