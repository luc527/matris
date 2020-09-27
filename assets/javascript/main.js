/* dependencies:
    helpers.js (in randomBlock)
  */

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const comparisons = ["!=", ">", "<", ">=", "<="];
const blocks = [...numbers, ...comparisons];

function isNumber(block) {
	return numbers.includes(block);
}

function isComparison(block) {
	return comparisons.includes(block);
}

function getType(block) {
	if (isNumber(block)) return "number";
	if (isComparison(block)) return "comparison";
	if (block == " ") return "empty";
	return "invalid";
}

/* function randomBlock() {
    return randomElement(blocks);
  } */

/* randomBalancedBlock: given the amount of numbers and comparisons at the game,
 * if the amount is balanced, just return a random block
 * otherwise, return a block to balance it (too many numbers -> returns comparison, and vice-versa) */
function randomBalancedBlock(typeCount) {
	const threshold = 5;

	if (typeCount.comparisons == 0) typeCount.comparisons = 1; //preventing division by zero
	if (typeCount.numbers == 0) typeCount.numbers = 1; //preventing ratio=0, which is < 1/threshold

	const ratio = typeCount.numbers / typeCount.comparisons;
	if (ratio > threshold)
		//too many numbers -- more than <threshold> numbers to 1 comparisons
		return randomElement(comparisons);
	if (ratio < 1 / threshold)
		// too many comparisons -- more than <threshold> comparisons to 1 number
		return randomElement(numbers);
	return randomElement(blocks);
}

const comparisonFunctions = {
	">": (l, r) => l > r,
	"<": (l, r) => l < r,
	">=": (l, r) => l >= r,
	"<=": (l, r) => l <= r,
	"!=": (l, r) => l != r,
};

function isTrueExpression(leftOperand, operator, rightOperand) {
	const valid =
		isNumber(leftOperand) && isComparison(operator) && isNumber(rightOperand);
	if (!valid) return false;
	return comparisonFunctions[operator](
		Number(leftOperand),
		Number(rightOperand)
	);
}
/* dependencies:
 * Matrix.js
 * helpers.js (in createNewPlayerBlock)
 * block-logic.js (in createNewPlayerBlock and updateScore)
 */

const directionToXOffset = {
	ArrowLeft: -1,
	ArrowRight: 1,
	ArrowDown: 0,
};

class Game {
	constructor(height, width) {
		this.matrix = new Matrix(height, width);
		this.playerBlock = { x: null, y: null };
		/* playerBlock: points to the block currently guided by the player in the matrix */
		this.score = 0;
		this.gameOverModalShown = false;
	}

	isPlayerBlockSettled() {
		if (this.playerBlock.y == 0) return true;
		const blockBelow = {
			y: this.playerBlock.y - 1,
			x: this.playerBlock.x,
		};
		return !this.matrix.isAvailable(blockBelow);
	}

	isGameOver() {
		const y = this.matrix.height - 1;
		for (let x = 0; x < this.matrix.width; x++) {
			const settled =
				!this.matrix.isAvailable({ x, y }) &&
				!this.matrix.isAvailable({ x, y: y - 1 });
			if (settled) return true;
		}
		return false;
	}

	/* blockTypeCount: returns a {numbers, comparisons} object with the
	 * number of number blocks and comparison blocks on the matrix */
	blockTypeCount() {
		let c = {
			numbers: 0,
			comparisons: 0,
		};
		let i = { y: null, x: null };
		for (i.y = 0; i.y < this.matrix.height; i.y++)
			for (i.x = 0; i.x < this.matrix.width; i.x++) {
				const type = getType(this.matrix.getBlock(i));
				if (type == "number") c.numbers++;
				else if (type == "comparison") c.comparisons++;
			}
		return c;
	}

	/* createNewPlayerBlock: instantiates a new block on the top
	 * of the matrix, which this.playerBlock will point to */
	createNewPlayerBlock() {
		this.playerBlock = {
			y: this.matrix.height - 1,
			x: randomIntBetween(0, this.matrix.width),
		};
		this.matrix.setBlock(
			this.playerBlock,
			randomBalancedBlock(this.blockTypeCount())
		);
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

		/* first tries to move horizontally and down;
		 * if it can't, then tries to move just horizontally;
		 * if it can't, then tries to move just down;
		 * if it can't, then doesn't move at all;
		 * in this strict order */
		if (this.matrix.isAvailable(horizontalDown)) updated = horizontalDown;
		else if (this.matrix.isAvailable(horizontal)) updated = horizontal;
		else if (this.matrix.isAvailable(down)) updated = down;
		else updated = original;

		/* moves the block in the matrix and updates this.playerBlock to point to it */
		this.playerBlock = this.matrix.moveBlock(this.playerBlock, updated);
	}

	start() {
		this.createNewPlayerBlock();
	}

	update(input) {
		if (this.isGameOver()) return;
		if (this.isGameOver()) return;

		this.updatePlayerBlock(input);
		if (!this.isGameOver() && this.isPlayerBlockSettled()) {
			if (this.isGameOver()) {
				storeScore(this.score);
			} else if (this.isPlayerBlockSettled()) {
				this.updateScore();
				this.createNewPlayerBlock();
				/* has to check for game over directly after createNewPlayerBlock
          * because a player block may be created and settle on the red row immediatly,
          /* has to also check for game over directly after createNewPlayerBlock
          * because a player block may settle on the red row immediatly after it is created,
          * which happens when the player makes a tower high enough */
				if (this.isGameOver()) {
					console.log(`Game over! Storing score of ${this.score}`);
					if (this.isGameOver()) storeScore(this.score);
				}
			}
		}
	}

	/* makeBlocksFall: applies gravity to the matrix,
	 * blocks with empty spaces below will go down until reaching ground */
	makeBlocksFall() {
		let i = { y: null, x: null };
		for (i.y = 1; i.y < this.matrix.height; i.y++) {
			for (i.x = 0; i.x < this.matrix.width; i.x++) {
				const below = { y: i.y - 1, x: i.x };
				if (!this.matrix.isAvailable(i) && this.matrix.isAvailable(below)) {
					//block at i is floating
					let ground = { y: i.y - 1, x: i.x };
					while (this.matrix.isAvailable(ground)) ground.y--;
					ground.y++; //move block ABOVE ground, not IN the ground
					this.matrix.moveBlock(i, ground);
				}
			}
		}
	}

	/* updateScore: called after the player settles a block on the matrix;
	 * evaluates the matrix, updates the score, and erases formed expressions to free space */
	updateScore() {
		let left, center, right;
		let leftOperand, operator, rightOperand;

		let hExprCount = 0; //# of horizontal expressions found
		let vExprCount = 0; //# of vertical expressions found

		let oldMatrix = this.matrix.copy();
		/* This procedure reads the expression from a copy (oldMatrix)
		 * and modifies this.matrix accordingly (erasing true expressions to free space).
		 * To understand why this is done, consider the following situation:
		 * 7 >
		 * x x <
		 * x x 9
		 * ------
		 * 7 > 3    <- player guides 3 there, forming two expressions
		 * x x <
		 * x x 9
		 * Note that the 3 is part of two expression (7>3 and 3<9), and we want to consider both.
		 * To do so, the procedure reads 7>3 from oldMatrix and erases it in this.matrix.
		 * Since the expression isn't erased in oldMatrix, the 3 is still going to be there
		 * when 3<9 is read.*/

		// Find and count true expressions in rows (horizontal)
		for (let row = 0; row < oldMatrix.height; row++) {
			for (let col = 1; col < oldMatrix.width - 1; col++) {
				left = { y: row, x: col - 1 };
				center = { y: row, x: col };
				right = { y: row, x: col + 1 };

				leftOperand = oldMatrix.getBlock(left);
				operator = oldMatrix.getBlock(center);
				rightOperand = oldMatrix.getBlock(right);

				if (isTrueExpression(leftOperand, operator, rightOperand)) {
					this.matrix.setBlock(left, " ");
					this.matrix.setBlock(center, " ");
					this.matrix.setBlock(right, " ");
					hExprCount++;
				}
			}
		}

		// Find and count true expressions in cols (vertical)
		for (let row = 1; row < oldMatrix.height - 1; row++) {
			for (let col = 0; col < oldMatrix.width; col++) {
				left = { y: row + 1, x: col };
				center = { y: row, x: col };
				right = { y: row - 1, x: col };

				leftOperand = oldMatrix.getBlock(left);
				operator = oldMatrix.getBlock(center);
				rightOperand = oldMatrix.getBlock(right);

				if (isTrueExpression(leftOperand, operator, rightOperand)) {
					this.matrix.setBlock(left, " ");
					this.matrix.setBlock(center, " ");
					this.matrix.setBlock(right, " ");
					vExprCount++;
				}
			}
		}

		// Calculates score
		const hExprValue = 1;
		const vExprValue = 2;
		this.score += hExprValue * hExprCount + vExprValue * vExprCount;

		if (hExprCount > 0 || vExprCount > 0) {
			// expressions got erased
			this.makeBlocksFall();
			/* makeBlocksFall because expressions may be formed below other blocks, and we don't want
			 * those blocks to just float after the expression is erased */
			this.updateScore();
			/* updateScore is called again because a falling block (after makeBlocksFall())
			 * may form some new expression, requiring a second evaluation of the matrix,
			 * as shown in the example:
			 *     3
			 *     >
			 *   = 4
			 * x x 2
			 * ------
			 *     3
			 *     >
			 * 4 = 4    <- player guided 4 to form 4=4
			 * x x 2
			 * ------
			 *     3
			 *     >
			 * x x 2    <- 4=4 erased; new expression (3>2) formed from falling blocks
			 * ------
			 *
			 *
			 * x x      by calling updateScore again, this new expression is evaluated and erased
			 * */
		}
	}

	showGameOverModal() {
		const html = `<div id="game-over-modal" class="modal">
                        <div class="modal__container">
                          <h2>Game over!</h2>
                          <p>${
														this.score > 0
															? `Você fez ${this.score} pontos`
															: "Você não pontuou"
													}</p>
                          <button type="button" title="Jogar novamente!" onclick="window.location.reload();">Jogar novamente!</button>
                        </div>
                      </div>`;

		document.body.insertAdjacentHTML("beforeend", html);
		this.gameOverModalShown = true;
	}

	/* HTMLrendering: returns a rendering of the matrix as an HTML table.
	 * styling is defered -- only the css classes are provided */
	HTMLrendering() {
		let html = "";
		let block;
		let danger; //to make the top row red, indicating game over
		html += '<table id="game-table">';
		html += `<caption id ="game-score">Pontuação: ${this.score}</caption>`;
		for (let y = this.matrix.height - 1; y >= 0; y--) {
			danger = y == this.matrix.height - 1 ? "danger" : "";
			html += '<tr class="game-row">';
			for (let x = 0; x < this.matrix.width; x++) {
				block = this.matrix.getBlock({ y, x });
				html += `<td class="game-cell ${danger} ${getType(block)}">`;
				html += block;
				html += "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		if (this.isGameOver() && this.gameOverModalShown === false) {
			this.showGameOverModal();
		}

		return html;
	}
}
/* randomIntBetween: random integer in interval [min,max) */
function randomIntBetween(min, max) {
	return Math.floor(min + Math.random() * (max - min));
}

/* randomElement: returns a random element of the given array */
function randomElement(arr) {
	return arr[randomIntBetween(0, arr.length)];
} /* dependencies:
    block-logic.js (in HTMLrendering())
  */

class Matrix {
	constructor(height, width) {
		this.height = height;
		this.width = width;
		this.matrix = null;
		this.initializeMatrix();
	}

	/* copy: returns a copy of this object */
	copy() {
		let copy = new Matrix(this.height, this.width);
		let position = { y: null, x: null };
		for (position.y = 0; position.y < copy.height; position.y++)
			for (position.x = 0; position.x < copy.width; position.x++)
				copy.setBlock(position, this.getBlock(position));
		return copy;
	}

	/* initializeMatrix: sets all positions in the matrix to ' ' */
	initializeMatrix() {
		this.matrix = new Array(this.height);
		for (let i = 0; i < this.height; i++) {
			this.matrix[i] = new Array(this.width);
			for (let j = 0; j < this.width; j++) this.matrix[i][j] = " ";
		}
	}

	/* isValid: returns whether the given position
	 * is within the bounds of the matrix */
	isValid(position) {
		return (
			position.x >= 0 &&
			position.x < this.width &&
			position.y >= 0 &&
			position.y < this.height
		);
	}

	/* getBlock: returns block at the given position in the matrix,
	 * or undefined if the given position is invalid */
	getBlock(position) {
		if (this.isValid(position)) return this.matrix[position.y][position.x];
	}

	/* isAvailablePosition: returns whether the given position
	 * is valid AND is available (not occupied) */
	isAvailable(position) {
		return this.getBlock(position) == " ";
	}

	/* setBlock: sets the given position in the matrix
	 * to the given block, if possible */
	setBlock(position, block) {
		if (this.isValid(position)) this.matrix[position.y][position.x] = block;
	}

	/* moveBlock: moves block from 'oldPosition' to 'newPosition', if possible.
	 * returns the resulting position:
	 * - if the movement was possible, same as 'newPosition';
	 * - otherwise, same as 'oldPosition'. (like a multiplexer) */
	moveBlock(oldPosition, newPosition) {
		const canMove = this.isValid(oldPosition) && this.isAvailable(newPosition);
		if (canMove) {
			this.setBlock(newPosition, this.getBlock(oldPosition));
			this.setBlock(oldPosition, " ");
			return newPosition;
		} else {
			return oldPosition;
		}
	}

	/* HTMLrendering: returns a rendering of the matrix as an HTML table.
	 * styling is defered, as only the css classes are provided */
	HTMLrendering() {
		let html = "";
		let block;
		html += '<table id="game-matrix-table">';
		for (let y = this.height - 1; y >= 0; y--) {
			html += '<tr class="game-matrix-row">';
			for (let x = 0; x < this.width; x++) {
				block = this.getBlock({ y, x });
				html += `<td class="game-matrix-cell ${getType(block)}">`;
				html += block;
				html += "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		return html;
	}
}
let rankingScores = JSON.parse(localStorage.getItem("ranking_scores")) || [];

if (rankingScores.length > 10) {
	rankingScores.splice(-1, 1);
}

// STORE SCORE

function storeScore(score) {
	if (score > 0) {
		rankingScores.push(score);

		rankingScores.sort((a, b) => b - a); //Sort numerically, in descending order

		saveToStorage();
	}
}

function saveToStorage() {
	localStorage.setItem("ranking_scores", JSON.stringify(rankingScores));
}

// RENDER SCORES

function renderRanking() {
	let html = "";

	html += `<div id="ranking-modal" class="modal modal--ranking" style="display: flex;">`;
	html += `<div class="modal__container">`;
	html += `<h2>Ranking!</h2>`;

	if (rankingScores.length > 0) {
		html += `<ol>`;

		for (score of rankingScores) {
			html += `<li>${score} pontos</li>`;
		}

		html += `</ol>`;
	} else {
		html += `<h3>Você ainda não pontuou</h3>`;
	}

	html += `<button type="button" title="Fechar!" onclick="closeModal('#ranking-modal')" >Fechar</button>`;
	html += `</div>`;
	html += `</div>`;

	document.body.insertAdjacentHTML("beforeend", html);
}
