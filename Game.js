/* dependencies:
 * Matrix.js
 * helpers.js (in newMovingBlock)
 * block-logic.js (in newBlockRoutine)
 */

/* should be updated to match what the keyboard listener returns */
const directionToXOffset = {
	'<': -1,
	'>':  1,
	'v':  0,
};


class Game {
	
	constructor(height, width) {
		this.matrix = new Matrix(height, width);
		this.listeningInput = false;
		this.gameOver = false;

		/* playerBlock: points to the block guided by the player in the matrix */
		this.playerBlock = { x:null, y:null };

		this.newBlockRoutine();
	}


	/* newPlayerBlock: generates a position on the top,
	 * random horizontally, for a new block for the player to move */
	newPlayerBlock() {
		return {
			y: this.matrix.height - 1,
			x: randomIntBetween(0, this.matrix.width),
		};
	}


	gameOverRoutine() {
		this.listeningInput = false;
		this.gameOver = true;
		console.log('Game over!')
	}


	/* newBlockRoutine: creates a new block on the top,
	 * enables player to control it */
	newBlockRoutine() {
		this.playerBlock = this.newPlayerBlock();
		this.matrix.setBlock(this.playerBlock, randomBlock());
		this.listeningInput = true;
	}


	handleInput(input) {
		/* Assumes the input matches what updatePlayerBlock
		 * uses to indicate a direction for the block. */
		if (this.listeningInput)
			this.updatePlayerBlock(input);
	}


	/* updatedPosition: gives a proper updated position of the block
	 * the player is guiding, according to the given direction. */
	updatedPosition(direction) {
		/* Horizontally, the player can go left, right or stay.
		 * Then the block tries to also go down if possible. */

		const xMovement = directionToXOffset[direction];
		let original, belowOriginal, updated, belowUpdated;

		original = {
			x: this.playerBlock.x,
			y: this.playerBlock.y
		};
		belowOriginal = {
			x: original.x,
			y: original.y - 1,
		};
		updated = {
			x: original.x + xMovement,
			y: original.y,
		};
		belowUpdated = {
			x: updated.x,
			y: updated.y - 1,
		};

		/* First tries to move horizontally and down,
		 * if it can't, then tries to move just horizontally,
		 * if it can't, then tries to move just down,
		 * if it can't, then doesn't move at all (returns the original position) */
		if (this.matrix.isAvailable(belowUpdated)) return belowUpdated;
		else if (this.matrix.isAvailable(updated)) return updated;
		else if (this.matrix.isAvailable(belowOriginal)) return belowOriginal;
		else return original;
	}


	/* updatePlayerBlock: moves, according to the given direction,
	 * the block the player is currently guiding.
	 * Only handleInput() should call it.
	 * Calls playerBlockSettledRoutine() when the block reached ground.
	 * Possible game over if block settles on top row. */
	updatePlayerBlock(direction) {
		const updated = this.updatedPosition(direction);

		//moves playerBlock in matrix and updates its position
		this.playerBlock = this.matrix.moveBlock(this.playerBlock, updated);

		//checks for game over (block settled on top row)
		if (this.playerBlock.y == this.matrix.height-1) {
			this.gameOverRoutine();
			return;
		}

		//checks for block reaching ground
		if (this.playerBlock.y == 0) {
			this.playerBlockSettledRoutine();
		} else {
			const blockBelow = this.matrix.getBlock({
				y: this.playerBlock.y - 1,
				x: this.playerBlock.x,
			});
			if (blockBelow != ' ')
				this.playerBlockSettledRoutine();
		}
	}


	/* playerBlockSettledRoutine: does what is necessary
	 * once the block guided by the player is settled: evaluate
	 * and update the matrix until the game can continue by
	 * creating a new block */
	playerBlockSettledRoutine() {
		this.listeningInput = false;

		// ...

		this.newBlockRoutine();
	}
}