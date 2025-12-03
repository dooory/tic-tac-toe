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

	playerList.push(playerObject);

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

	return { doMove, getBoard, resetBoard, isWinningMove };
})();

const GameController = (() => {
	const roundMax = 9;
	let round = 0;
	let state = "idle";
	let activePlayerId = 1;

	const getRound = () => round;
	const getState = () => state;
	const getActivePlayer = () => playerList[activePlayerId - 1];

	const setRound = (number) => (round = number);
	const setState = (newState) => (state = newState);
	const setActivePlayer = (id) => (activePlayerId = id);

	const switchActivePlayer = () =>
		activePlayerId === 1 ? (activePlayerId = 2) : (activePlayerId = 1);

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

			return;
		}

		if (getRound() === roundMax) {
			console.log(`Its a draw!`);

			endGame();

			return;
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

const player1 = Player("John", 1, "X");
const player2 = Player("Simon", 2, "O");

for (let index = 0; index < 1; index++) {
	GameController.startGame();

	for (let i = 0; i < 9; i++) {
		if (GameController.getState() == "idle") {
			break;
		}

		GameController.playRound(i);
	}
}
