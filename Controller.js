class Controller {

	constructor(game) {
		this.game = game; //Game instance (from Game.js)
		this.gameOver = false;
		this.game.createNewPlayerBlock();
	}


	updateGame(input) {
		if (this.gameOver)
			return;
		this.game.updatePlayerBlock(input);
		if (this.game.isGameOver()) {
			console.log('Game over!')
			this.gameOver = true;
		} else if (this.game.isPlayerBlockSettled()) {
			//calls some evaluation function, adds score etc.
			this.game.createNewPlayerBlock();
		}
	}

}