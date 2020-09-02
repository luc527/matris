/* dependencies:
 * Matrix.js
 * helpers.js (in createNewPlayerBlock)
 * block-logic.js (in createNewPlayerBlock)
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
		this.playerBlock = { x:null, y:null };
		/* playerBlock: points the block currently guided by the player * in the matrix */
	}


	isPlayerBlockSettled() {
		if (this.playerBlock.y == 0)
			return true;
		const blockBelow = {
			y: this.playerBlock.y - 1,
			x: this.playerBlock.x,
		};
		return !this.matrix.isAvailable(blockBelow);
	}
	

	isGameOver() {
		const lastRow = this.matrix.getRow(this.matrix.height-1);
		return lastRow.some(cell => cell != ' ');
	}


	/* createNewPlayerBlock: instantiates a new block on the top
	 * of the matrix, which this.playerBlock will point to it */
	createNewPlayerBlock() {
		this.playerBlock = {
			y: this.matrix.height - 1,
			x: randomIntBetween(0, this.matrix.width),
		};
		this.matrix.setBlock(this.playerBlock, randomBlock());
	}

	/* updatePlayerBlock: moves the playerBlock according
	 * to the given direction */
	updatePlayerBlock(direction) {
		/* horizontally, the player can go left, right or stay,
		 * then the block will also go down */

		const xMovement = directionToXOffset[direction];
		let updated, original, down, horizontal, horizontalDown;

		original = {
			y: this.playerBlock.y,
			x: this.playerBlock.x,
		};
		down = {
			y: original.y - 1,
			x: original.x,
		};
		horizontal = {
			y: original.y,
			x: original.x + xMovement,
		};
		horizontalDown = {
			y: horizontal.y - 1,
			x: horizontal.x,
		};

		/* first tries to move horizontally and down.
		 * if it can't, then tries to move just horizontally.
		 * if it can't, then tries to move just down.
		 * if it can't, then doesn't move at all, returning the original position. */
		if (this.matrix.isAvailable(horizontalDown))
			updated = horizontalDown;
		else if (this.matrix.isAvailable(horizontal))
			updated = horizontal;
		else if (this.matrix.isAvailable(down))
			updated = down;
		else
			updated = original;

		/* moves the block in the matrix and updates this.playerBlock to point to it */
		this.playerBlock = this.matrix.moveBlock(this.playerBlock, updated);
	}

}