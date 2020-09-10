/* dependencies:
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
		let position = {y:null, x:null};
		for (position.y = 0; position.y < copy.height; position.y++)
			for (position.x = 0; position.x < copy.width; position.x++)
				copy.setBlock(position, this.getBlock(position));
		return copy;
	}

	/* initializeMatrix: sets matrix[i][j] = ' '
	 * for i=0..height and j=0..width */
	initializeMatrix() {
		this.matrix = new Array(this.height);
		for (let i = 0; i < this.height; i++) {
			this.matrix[i] = new Array(this.width);
			for (let j = 0; j < this.width; j++)
				this.matrix[i][j] = ' ';
		}
	}


	/* isValid: returns whether the given position
	 * is within the bounds of the matrix */
	isValid(position) {
		return position.x >= 0 && position.x < this.width
		    && position.y >= 0 && position.y < this.height;
	}


	/* getBlock: returns block at the given position in the matrix,
	 * or undefined if the given position is invalid */
	getBlock(position) {
		if (this.isValid(position))
			return this.matrix[position.y][position.x];
	}


	/* isAvailablePosition: returns whether the given position
	 * is valid AND is available (not occupied) */
	isAvailable(position) {
		return this.getBlock(position) == ' ';
	}


	/* setBlock: sets the given position in the matrix
	 * to the given block, if possible */
	setBlock(position, block) {
		if (this.isValid(position))
			this.matrix[position.y][position.x] = block;
	}


	/* moveBlock: moves block from 'oldPosition' to 'newPosition', if possible.
	 * returns the resulting position:
	 * - if the movement was possible, same as 'newPosition';
	 * - otherwise, same as 'oldPosition'. (like a multiplexer) */
	moveBlock(oldPosition, newPosition) {
		const canMove = this.isValid(oldPosition)
		             && this.isAvailable(newPosition);
		if (canMove) {
			this.setBlock(newPosition, this.getBlock(oldPosition));
			this.setBlock(oldPosition, ' ');
			return newPosition;
		} else {
			return oldPosition;
		}
	}


	/* HTMLrendering: returns a rendering of the matrix as an HTML table.
	 * styling is defered, as only the css classes are provided */
	HTMLrendering() {
		let html = '';
		let block;
		html += '<table id="game-matrix-table">';
		for (let y = this.height-1; y >= 0; y--) {
			html += '<tr class="game-matrix-row">';
			for (let x = 0; x < this.width; x++) {
				block = this.getBlock({y, x});
				html += `<td class="game-matrix-cell ${getType(block)}">`;
				html += block;
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';
		return html;
	}

}
