/**
 * Author: Gabriel Luciano
 * Description: Genious Game
 *
 * Infos:
 * - colors index:
 *      0: green
 *      1: red
 *      2: yellow
 *      3: blue
 *
 */

class GeniusGame {
  level = 1;
  currentOrder = [];
  userOrder = [];
  status = "waiting";
  score = 0;
  soundControl = false;
  soundMap = ["A4", "B4", "D4", "E4"]

  constructor(colorElements, sound) {
    this.colorElements = colorElements;
    this.sound = sound;
  }

  // Generate random order for current level
  generateOrder() {
    this.currentOrder = [];

    for (let i = 0; i < this.level; i++) {
      const newValue = Math.floor(Math.random() * 4);
      this.currentOrder.push(newValue);
    }
  }

  // Increase game level
  increaseLevel() {
    this.level++;
  }

  // Start level
  start() {
    this.userOrder = [];
    this.generateOrder();
    this.lightElements();
  }

  // Finish game and reset game state
  over() {
    this.level = 1;
    this.userOrder = [];
    this.currentOrder = [];
    this.score = 0;
    this.status = "waiting";
  }

  // Compute player click
  computeClick(colorValue) {
    this.userOrder.push(colorValue);
    this.computeGameStatus();
  }

  // Compute game status by comparing userInputs and randomOrder
  computeGameStatus() {
    const userOrder = this.userOrder;
    const currentOrder = this.currentOrder;

    if (userOrder.length === 0) return (this.status = "waiting");

    if (
      userOrder[userOrder.length - 1] === currentOrder[userOrder.length - 1]
    ) {
      if (userOrder.length < this.level) return (this.status = "playing");
      else {
        this.score++;
        return (this.status = "win");
      }
    } else {
      return (this.status = "lose");
    }
  }

  // Light up a list of elements
  lightElements() {
    this.currentOrder.forEach((randomColorIndex, index) => {
      this.lightElement(randomColorIndex, index);
    });
  }

  // Light up an specific element
  lightElement(elementIndex, duration = 0) {
    const element = this.colorElements[elementIndex];

    setTimeout(() => {
      element.classList.add("selected");
      if (this.soundControl) this.sound.triggerAttackRelease(this.soundMap[elementIndex], "8n");
    }, duration * 1200);

    setTimeout(() => {
      element.classList.remove("selected");
    }, duration * 1200 + 800);
  }

  // Log game data
  log() {
    console.log("elements: ", this.colorElements);
    console.log("current level: ", this.level);
    console.log("current order: ", this.currentOrder);
    console.log("user order: ", this.userOrder);
    console.log("status: ", this.status);
    console.log("score: ", this.score);
  }
}

// Get dom elements that represents each color
const green = document.querySelector(".green");
const red = document.querySelector(".red");
const yellow = document.querySelector(".yellow");
const blue = document.querySelector(".blue");

// Modal Elements
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".start_game");

// Checkbox to allow sounds
const soundCheckbox = document.querySelector("input#sound");

// Displays modal with specifics title and button texts
function renderModal(titleText, buttonText) {
  const title = modal.querySelector("h2");
  title.innerText = titleText;

  modalButton.innerText = buttonText;
  modal.classList.remove("hide");
}

// Tone.js
// Sounds
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

// Handle audio
soundCheckbox.addEventListener("change", () => {
  console.log("hey");
  if (soundCheckbox.checked) {
    game.soundControl = true;
  } else {
    game.soundControl = false;
  }
});

// Game instance
const game = new GeniusGame([green, red, yellow, blue], synth);

// Starts game 1 sec after modalButton is clicked
modalButton.onclick = () => {
  modal.classList.add("hide");

  setTimeout(() => game.start(), 1000);
};

// Click listeners for colors elements
green.addEventListener("click", () => colorElementListener(0));
red.addEventListener("click", () => colorElementListener(1));
yellow.addEventListener("click", () => colorElementListener(2));
blue.addEventListener("click", () => colorElementListener(3));

// Callback for elements listeners
function colorElementListener(colorIndex) {
  game.computeClick(colorIndex);
  game.lightElement(colorIndex);
  checkGameStatus();
}

// Get game status and act accordingly
function checkGameStatus() {
  if (game.status === "playing") {
    return;
  }

  if (game.status === "win") {
    setTimeout(
      () => renderModal("Parabéns, você venceu este nível!", "Próximo nível"),
      1000
    );
    game.increaseLevel();
  }

  if (game.status === "lose") {
    renderModal(
      `Que pena, você perdeu!\nSua pontuação foi de ${game.score}`,
      "Jogar novamente"
    );
    game.over();
  }
}