document.addEventListener("DOMContentLoaded", () => {
  const hangmanGame = new HangmanGame();
  hangmanGame.initializeGame();

  document.getElementById("reset-button").addEventListener("click", () => {
    hangmanGame.initializeGame();
  });
});

class HangmanGame {
  constructor() {
    this.words = [
      "javascript",
      "hangman",
      "developer",
      "programming",
      "computer",
      "algorithm",
      "database",
      "interface",
    ];
    this.selectedWord = "";
    this.guessedWord = [];
    this.maxGuesses = 10;
    this.currentGuesses = 0;
    this.guessedLetters = new Set();
    this.gameOver = false;
  }

  initializeGame() {
    this.selectedWord =
      this.words[Math.floor(Math.random() * this.words.length)];
    this.guessedWord = Array(this.selectedWord.length).fill("_");
    this.currentGuesses = 0;
    this.guessedLetters.clear();
    this.gameOver = false;

    const buttonsContainer = document.getElementById("buttons-container");
    buttonsContainer.innerHTML = "";
    for (const letter of "abcdefghijklmnopqrstuvwxyz") {
      const button = document.createElement("button");
      button.textContent = letter.toUpperCase();
      button.className = "letter-button";
      button.addEventListener("click", () => this.makeGuess(letter));
      buttonsContainer.appendChild(button);
    }

    this.updateWordDisplay();
    this.drawHangman();
    this.updateGameStatus(`Good luck! You have ${this.maxGuesses} guesses.`);
  }

  updateGameStatus(message) {
    const gameStatus = document.getElementById("game-status");
    gameStatus.textContent = message;
  }

  updateWordDisplay() {
    const wordDisplay = document.getElementById("word-display");
    wordDisplay.textContent = this.guessedWord.join(" ");
  }

  makeGuess(letter) {
    if (this.gameOver || this.guessedLetters.has(letter)) {
      return;
    }

    this.guessedLetters.add(letter);
    let found = false;

    for (let i = 0; i < this.selectedWord.length; i++) {
      if (this.selectedWord[i] === letter) {
        this.guessedWord[i] = letter;
        found = true;
      }
    }

    if (!found) {
      this.currentGuesses++;
    }

    this.updateWordDisplay();
    this.drawHangman();

    const clickedButton = Array.from(
      document.querySelectorAll(".letter-button")
    ).find(
      (button) => button.textContent.toLowerCase() === letter.toLowerCase()
    );
    if (clickedButton) {
      clickedButton.disabled = true;
      clickedButton.style.backgroundColor = found ? "#4caf50" : "#ccc";
    }

    if (this.guessedWord.join("") === this.selectedWord) {
      this.gameOver = true;
      this.updateGameStatus(
        "Congratulations! You won! Click New Game to play again."
      );
      this.disableAllButtons();
      return;
    }

    if (this.currentGuesses >= this.maxGuesses) {
      this.gameOver = true;
      this.updateGameStatus(`Game Over! The word was: ${this.selectedWord}`);
      this.disableAllButtons();
      return;
    }

    const remainingGuesses = this.maxGuesses - this.currentGuesses;
    this.updateGameStatus(`Guesses remaining: ${remainingGuesses}`);
  }

  disableAllButtons() {
    const buttons = document.querySelectorAll(".letter-button");
    buttons.forEach((button) => {
      button.disabled = true;
      button.style.backgroundColor = "#ccc";
    });
  }

  drawHangman() {
    const svg = document.getElementById("hangman-svg");
    svg.innerHTML = "";

    const parts = [
      { d: "M20 250 L180 250", stroke: "black", "stroke-width": 4 }, // Base
      { d: "M50 250 L50 20", stroke: "black", "stroke-width": 4 }, // Pole
      { d: "M50 20 L150 20", stroke: "black", "stroke-width": 4 }, // Top
      { d: "M150 20 L150 50", stroke: "black", "stroke-width": 4 }, // Noose
      {
        cx: 150,
        cy: 80,
        r: 30,
        fill: "none",
        stroke: "black",
        "stroke-width": 4,
      }, // Head
      { d: "M150 110 L150 180", stroke: "black", "stroke-width": 4 }, // Body
      { d: "M150 130 L120 160", stroke: "black", "stroke-width": 4 }, // Left arm
      { d: "M150 130 L180 160", stroke: "black", "stroke-width": 4 }, // Right arm
      { d: "M150 180 L120 220", stroke: "black", "stroke-width": 4 }, // Left leg
      { d: "M150 180 L180 220", stroke: "black", "stroke-width": 4 }, // Right leg
    ];

    const partsToShow = Math.min(this.currentGuesses, parts.length);

    for (let i = 0; i < partsToShow; i++) {
      const part = parts[i];
      const element = part.d
        ? document.createElementNS("http://www.w3.org/2000/svg", "path")
        : document.createElementNS("http://www.w3.org/2000/svg", "circle");

      for (const [attr, value] of Object.entries(part)) {
        element.setAttribute(attr, value);
      }
      svg.appendChild(element);
    }
  }
}
