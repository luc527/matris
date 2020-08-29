/* dependencies:
   GameMatrix.js
   helpers.js (in newMovingBlock)
   block-logic.js (in newBlockRoutine)
*/

/* should be updated to match what the keyboard listener returns */
const LEFT  = '<';
const RIGHT = '>';
const DOWN  = 'v';

const directionToXOffset = {
	'<': -1,
	'>':  1,
	'v':  0,
};


class GameState {

	constructor(height, width) {
		this.matrix = new GameMatrix(height, width);
		/* movingBlock: position of the block currently guided by the player */
		this.movingBlock = { x:null, y:null }; 
		this.listeningInput = false;
		this.gameOver = false;

		this.newBlockRoutine();
	}


	/* newMovingBlock: generates a position on the top,
	   random horizontally, for a new block for the player to move */
	newMovingBlock() {
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
	   enables player to control it by turning on listeningInput */
	newBlockRoutine() {
		this.movingBlock = this.newMovingBlock();
		if (!this.matrix.isAvailablePosition(this.movingBlock)) {
			this.gameOverRoutine();
			return;
		}
		this.matrix.setBlock(this.movingBlock, randomBlock());
		this.listeningInput = true;
	}


	/* handleInput: handles using input, assuming it matches what
	   updateMovingBlock uses as direction for the block.
	   Basically calls updateMovingBlock or not depending on whether
	   listeningInput is turned on or off. */
	handleInput (input) {
		if (this.listeningInput)
			this.updateMovingBlock(input);
	}


	/* updatedPosition: gives an updated position
	   of the block the player is guiding according to the direction.
	   There are three possible directions: down+left, just down, down+right.
	   When down+left or down+right is impossible (against a wall),
	   the resulting direction is just down.
	   When all directions are impossible, returns the same position
	   as the current one. */
	updatedPosition(direction) {
		const yMovement = -1;
		const xMovement = directionToXOffset[direction];
		let updated = {
			y: this.movingBlock.y + yMovement,
			x: this.movingBlock.x + xMovement,
		};

		//can't move down+(left|right) (against a wall) -> just move down
		if (xMovement != 0 && !this.matrix.isAvailablePosition(updated))
			updated.x = this.movingBlock.x; //same x as before

		//can't move at all -> don't
		if (!this.matrix.isAvailablePosition(updated))
			updated = this.movingBlock; //same position as before

		return updated;
	}


	/* updateMovingBlock: moves the block tue player is currently
	   guiding according to the given direction.
	   Should be called only by handleInput().
	   Calls movingBlockSettledRoutine() when the block reached ground. */
	updateMovingBlock(direction) {
		const updated = this.updatedPosition(direction);

		this.movingBlock = this.matrix.moveBlock(
			this.movingBlock, updated
		);

		if (this.movingBlock.y == 0) //reached ground -> block settled
			this.movingBlockSettledRoutine();
		
		const blockBelow = this.matrix.getBlock({
			y: this.movingBlock.y - 1,
			x: this.movingBlock.x,
		});
		if (blockBelow != ' ') //on top of another block -> block settled
			this.movingBlockSettledRoutine();
	}


	/* movingBlockSettledRoutine: does what is necessary
	   once the block guided by the player is settled: evaluate
	   and update the matrix until the game can continue by
	   creating a new block */
	movingBlockSettledRoutine() {
		this.listeningInput = false;

		// ...

		this.newBlockRoutine();
	}




}