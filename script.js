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
		board[position] = playerId;

		return board;
	};

	const resetBoard = () => {
		board = Array(9).fill("", 0, 9);
	};

	return { doMove, getBoard, resetBoard };
})();

const player1 = Player("Player 1", 1);
const player2 = Player("Player 2", 2);
