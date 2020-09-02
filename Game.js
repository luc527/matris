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
		const y = this.matrix.height - 1;
		for (let x = 0; x < this.matrix.width; x++)
			if (!this.matrix.isAvailable({x, y})
			 && !this.matrix.isAvailable({x, y:y-1})) //game over: block settled on top row
			 	return true;
		return false;
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
		 * if it can't, then doesn't move at all */
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


	start() {
		this.createNewPlayerBlock();
	}


	update(input) {
		if (this.isGameOver()) return;

		this.updatePlayerBlock(input);

		if (this.isGameOver()) return;
		if (this.isPlayerBlockSettled()) {
			//calls some evaluation function, adds score etc.
			this.createNewPlayerBlock();
		}
	}


	/* HTMLrendering: returns a rendering of the matrix as an HTML table.
	 * styling is defered, as only the css classes are provided */
	HTMLrendering() {
		let html = '';
		let block;
		let danger; //to make the top row red, indicating game over
		html += '<table id="game-table">';
		for (let y = this.matrix.height-1; y >= 0; y--) {
			danger = y == this.matrix.height-1 ? 'danger' : '';
			html += '<tr class="game-row">';
			for (let x = 0; x < this.matrix.width; x++) {
				block = this.matrix.getBlock({y, x});
				html += `<td class="game-cell ${danger} ${getType(block)}">`;
				html += block;
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';
		if (this.isGameOver())
			html += '<p id="game-over">Game over!</h1>'
		return html;
	}
}