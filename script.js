function Player(name, id) {
	const getName = () => name;
	const getId = () => id;

	return { getName, getId };
}
