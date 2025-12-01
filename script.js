function Player(name, id) {
	const getName = () => name;
	const getId = () => id;

	const doMove = (position) => GameBoard.doMove(position, id);

	return { getName, getId, doMove };
}

const GameBoard = (() => {
	let board = [];

	const getBoard = () => board;

	const doMove = (position, playerId) => {
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

		board[position] = playerId;

		return true;
	};

	const resetBoard = () => {
		board = Array(9).fill("", 0, 9);
	};

	return { doMove, getBoard, resetBoard };
})();

const GameController = (() => {
	let round = 0;
	let state = "idle";
	let activePlayer = 1;

	const getRound = () => round;
	const getState = () => state;
	const getActivePlayer = () => activePlayer;

	const setRound = (number) => (round = number);
	const setState = (newState) => (state = newState);
	const setActivePlayer = (id) => (activePlayer = id);
	const switchActivePlayer = () =>
		activePlayer === 1 ? (activePlayer = 2) : (activePlayer = 1);

	const resetGame = () => {
		setRound(0);
		setActivePlayer(1);
		GameBoard.resetBoard();
	};

	const playRound = (tileIndex) => {
		const currentRound = getRound() + 1;
		console.log(`Starting round ${currentRound}`);

		GameBoard.doMove(tileIndex, getActivePlayer());
	};

	const startGame = () => {
		resetGame();
		setState("playing");

		console.log("Starting new game!");
	};

	const endGame = () => {
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

const player1 = Player("Player 1", 1);
const player2 = Player("Player 2", 2);

GameController.startGame();

GameController.playRound(1);

console.log(GameBoard.getBoard());
