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

const GameController = () => {
	let round = 0;
	let state = "idle";
	let activePlayer = 1;

	const getRound = () => round;
	const getState = () => state;
	const getActivePlayer = () => activePlayer;

	const setRound = (number) => (round = number);
	const setState = (state) => (state = state);
	const setActivePlayer = (id) => (activePlayer = id);

	return {
		getRound,
		getState,
		getActivePlayer,
	};
};

GameBoard.resetBoard();

const player1 = Player("Player 1", 1);
const player2 = Player("Player 2", 2);
