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
		/* playerBlock: position of the block currently guided by the player */
		this.playerBlock = { x:null, y:null }; 
		this.listeningInput = false;
		this.gameOver = false;

		this.newBlockRoutine();
	}


	/* newPlayerBlock: generates a position on the top,
	   random horizontally, for a new block for the player to move */
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
	   enables player to control it by turning on listeningInput,
	   possible game over */
	newBlockRoutine() {
		this.playerBlock = this.newPlayerBlock();
		if (!this.matrix.isAvailablePosition(this.playerBlock)) {
			this.gameOverRoutine();
			return;
		}
		this.matrix.setBlock(this.playerBlock, randomBlock());
		this.listeningInput = true;
	}


	/* handleInput: handles user input, assuming it matches what
	   updatePlayerBlock uses as direction for the block.
	   Basically calls updatePlayerBlock or not depending on whether
	   listeningInput is turned on or off. */
	handleInput (input) {
		if (this.listeningInput)
			this.updatePlayerBlock(input);
	}


	/* updatedPosition: gives an updated position of the block the player is
	   guiding, according to the given direction.
	   There are three possible directions: down+left, just down, down+right.
	   When down+left or down+right is impossible (against a wall), the
	   resulting direction is just down.
	   When all directions are impossible, it just returns the same position
	   as the current one. */
	updatedPosition(direction) {
		const yMovement = -1;
		const xMovement = directionToXOffset[direction];
		let updated = {
			y: this.playerBlock.y + yMovement,
			x: this.playerBlock.x + xMovement,
		};

		//can't move down+(left|right) (is against a wall) -> just move down
		if (xMovement != 0 && !this.matrix.isAvailablePosition(updated))
			updated.x = this.playerBlock.x; //same x as before, only goes down

		//can't move at all
		if (!this.matrix.isAvailablePosition(updated))
			updated = this.playerBlock; //same position as before

		return updated;
	}


	/* updatePlayerBlock: moves, according to the given direction,
	   the block the player is currently guiding.
	   Should be called only by handleInput().
	   Calls movingBlockSettledRoutine() when the block reached ground. */
	updatePlayerBlock(direction) {
		const updated = this.updatedPosition(direction);

		this.playerBlock = this.matrix.moveBlock(
			this.playerBlock, updated
		);

		if (this.playerBlock.y == 0) //reached ground -> block settled
			this.playerBlockSettledRoutine();
		
		const blockBelow = this.matrix.getBlock({
			y: this.playerBlock.y - 1,
			x: this.playerBlock.x,
		});
		if (blockBelow != ' ') //on top of another block -> block settled
			this.playerBlockSettledRoutine();
	}


	/* playerBlockSettledRoutine: does what is necessary
	   once the block guided by the player is settled: evaluate
	   and update the matrix until the game can continue by
	   creating a new block */
	playerBlockSettledRoutine() {
		this.listeningInput = false;

		// ...

		this.newBlockRoutine();
	}
}