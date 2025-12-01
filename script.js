function Player(name, id) {
	const getName = () => name;
	const getId = () => id;

	const doMove = (position) => GameBoard.doMove(position, id);

	return { getName, getId, doMove };
}
