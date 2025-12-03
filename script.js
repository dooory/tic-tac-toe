function Player(name, id, shape) {
	let wins = 0;

	const getName = () => name;
	const getId = () => id;
	const getWins = () => wins;
	const getShape = () => shape;

	const setWins = (newWins) => (wins = newWins);
	const incrementWins = () => setWins(getWins() + 1);

	const doMove = (position) => GameBoard.doMove(position, shape);

	let playerObject = {
		getName,
		getId,
		doMove,
		getWins,
		incrementWins,
		getShape,
	};

	playerList[id] = playerObject;

	return playerObject;
}

const GameBoard = (() => {
	let board = [];

	const getBoard = () => board;

	const doMove = (position, playerShape) => {
		if (GameController.getState() === "idle") {
			console.error("Game is currently in an idle state");

			return false;
		}

		if (board[position] !== "") {
			console.error(
				`Board Position ${position} is already occupied by ${board[position]}`
			);

			return false;
		}

		board[position] = playerShape;

		return true;
	};

	const isWinningMove = (board) => {
		const winningLines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < winningLines.length; i++) {
			let [a, b, c] = winningLines[i];

			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return winningLines[i];
			}
		}
	};

	const resetBoard = () => {
		board = Array(9).fill("", 0, 9);
	};

	resetBoard();

	return { doMove, getBoard, resetBoard, isWinningMove };
})();

const GameController = (() => {
	const roundMax = 9;
	let round = 0;
	let state = "idle";
	let activePlayerId = 0;
	let lastMatchOutcome;

	const getRound = () => round;
	const getState = () => state;
	const getActivePlayer = () => playerList[activePlayerId];

	const setRound = (number) => (round = number);
	const setState = (newState) => (state = newState);
	const setActivePlayer = (id) => (activePlayerId = id);

	const switchActivePlayer = () =>
		activePlayerId === 0 ? (activePlayerId = 1) : (activePlayerId = 0);

	const incrementRound = () => setRound(getRound() + 1);

	const resetGame = () => {
		console.log("Resetting game!");

		setRound(0);
		setActivePlayer(1);
		GameBoard.resetBoard();
	};

	const newRoundMessage = (round) => {
		console.log(`Starting round ${round}`);
		console.log(`It is currently ${getActivePlayer().getName()}'s turn`);
	};

	const playRound = (tileIndex) => {
		if (getState() === "idle") {
			console.error("Game is currently in an idle state");

			return;
		}

		if (typeof tileIndex !== "number") {
			console.error(
				`Tileindex must be of type number not <${typeof tileIndex}>`
			);

			return;
		}

		if (GameBoard.getBoard()[tileIndex]) {
			console.error(
				`Tileindex <${tileIndex}> is already occupied by <${
					GameBoard.getBoard()[tileIndex]
				}>`
			);

			return;
		}

		incrementRound();

		const currentRound = getRound();
		newRoundMessage(currentRound);

		const activePlayer = getActivePlayer();
		activePlayer.doMove(Number(tileIndex));

		const winningLines = GameBoard.isWinningMove(GameBoard.getBoard());

		if (winningLines) {
			const winnerName = getActivePlayer().getName();

			console.log(`The winner is: ${winnerName}!`);
			console.log(`Winning lines: ${winningLines}`);

			getActivePlayer().incrementWins();

			endGame();

			return "Win";
		}

		if (getRound() === roundMax) {
			console.log(`Its a draw!`);

			endGame();

			return "Draw";
		}

		switchActivePlayer();
	};

	const startGame = () => {
		setState("playing");

		console.log("\nStarting new game!");
		resetGame();
	};

	const endGame = () => {
		console.log("Ending game!");

		console.log("\nCurrent scores:\n");
		console.log(`${playerList[0].getName()}: ${playerList[0].getWins()}`);
		console.log(`${playerList[1].getName()}: ${playerList[1].getWins()}`);

		setState("idle");
	};

	return {
		getRound,
		getState,
		getActivePlayer,
		resetGame,
		startGame,
		endGame,
		playRound,
	};
})();

let playerList = [];

const player1 = Player("John", 0, "X");
const player2 = Player("Simon", 1, "O");

const ScreenController = (() => {
	const gameStateDiv = document.querySelector(".game-state");
	const player1ScoreDiv = document.querySelector(".player1-score > .score");
	const player2ScoreDiv = document.querySelector(".player2-score > .score");

	const boardDiv = document.querySelector(".game-board");

	const startGameButton = document.querySelector(".start-button");

	const clearScreen = () => (boardDiv.textContent = "");

	const createTileButton = (content, index) => {
		let tileButton = document.createElement("button");
		tileButton.classList.add("tile-button");
		tileButton.textContent = content;
		tileButton.dataset.index = index;

		tileButton.addEventListener("click", handleTileClick);

		boardDiv.appendChild(tileButton);
	};

	const updateScreen = (matchOutcome) => {
		clearScreen();

		const currentBoard = GameBoard.getBoard();

		for (let index = 0; index < currentBoard.length; index++) {
			const tileContent = currentBoard[index];

			createTileButton(tileContent, index);
		}

		const currentGameState = GameController.getState();

		if (currentGameState === "playing") {
			gameStateDiv.textContent = `It's currently ${GameController.getActivePlayer().getName()}'s turn`;
		}

		if (currentGameState === "idle") {
			console.log(matchOutcome);

			if (matchOutcome === "Draw") {
				gameStateDiv.textContent = `It's a draw!`;
			} else if (matchOutcome === "Win") {
				const winner = GameController.getActivePlayer();
				gameStateDiv.textContent = `${winner.getName()} has won!`;
			}
		}

		player1ScoreDiv.textContent = `${player1.getName()}: ${player1.getWins()}`;
		player2ScoreDiv.textContent = `${player2.getName()}: ${player2.getWins()}`;
	};

	const handleTileClick = (element) => {
		const tile = element.target;
		const tileIndex = tile.dataset.index;

		const outcome = GameController.playRound(Number(tileIndex));

		updateScreen(outcome);
	};

	const handleStartClick = (element) => {
		GameController.startGame();

		updateScreen();
	};

	startGameButton.addEventListener("click", handleStartClick);
	updateScreen();

	return {
		updateScreen,
	};
})();
