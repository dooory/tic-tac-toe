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
	const incrementRound = () => setRound(getRound() + 1);

	const resetGame = () => {
		console.log("Resetting game!");

		setRound(0);
		setActivePlayer(1);
		GameBoard.resetBoard();
	};

	const newRoundMessage = (round) => {
		console.log(`Starting round ${round}`);
		console.log(`It is currently Player ${getActivePlayer()}'s turn`);
	};

	const playRound = (tileIndex) => {
		GameBoard.doMove(Number(tileIndex), getActivePlayer());
		switchActivePlayer();
		incrementRound();

		const nextRound = getRound() + 1;
		newRoundMessage(nextRound);
	};

	const startGame = () => {
		resetGame();
		setState("playing");

		console.log("Starting new game!");
		const currentRound = getRound() + 1;
		newRoundMessage(currentRound);

		console.log(GameBoard.getBoard());
		console.log("\n");
	};

	const endGame = () => {
		console.log("Ending game!");
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

for (let i = 0; i < 9; i++) {
	GameController.playRound(i);

	console.log(GameBoard.getBoard());
}

GameController.endGame();

GameController.resetGame();
