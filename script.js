function Player(name, id) {
	let wins = 0;

	const getName = () => name;
	const getId = () => id;
	const getWins = () => wins;

	const setWins = (newWins) => (wins = newWins);
	const incrementWins = () => setWins(getWins() + 1);

	const doMove = (position) => GameBoard.doMove(position, id);

	let playerObject = { getName, getId, doMove, getWins, incrementWins };

	playerList.push(playerObject);

	return playerObject;
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
				`Board Position ${position} is already occupied by ${board[position]}`,
			);

			return false;
		}

		board[position] = playerId;

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
		incrementRound();

		const currentRound = getRound();
		newRoundMessage(currentRound);

		GameBoard.doMove(Number(tileIndex), getActivePlayer());

		const winningLines = GameBoard.isWinningMove(GameBoard.getBoard());

		if (winningLines) {
			const winner = playerList[getActivePlayer()];
			const winnerName = winner.getName();

			console.log(`The winner is: ${winnerName}!`);
			console.log(`Winning lines: ${winningLines}`);

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

		console.log("Starting new game!");
		resetGame();
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

let playerList = [];

const player1 = Player("Player 1", 1);
const player2 = Player("Player 2", 2);
