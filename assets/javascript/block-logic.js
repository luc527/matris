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
	if (ratio > threshold) //too many numbers -- more than <threshold> numbers to 1 comparisons
		return randomElement(comparisons);
	if (ratio < 1/threshold) // too many comparisons -- more than <threshold> comparisons to 1 number
		return randomElement(numbers);
	return randomElement(blocks);
}

const operatorFunction = {
	">": (l, r) => l > r,
	"<": (l, r) => l < r,
	">=": (l, r) => l >= r,
	"<=": (l, r) => l <= r,
	"=": (l, r) => l == r,
	"!=": (l, r) => l != r,
};

function isTrueExpression(leftOperand, operator, rightOperand) {
	const valid =
		isNumber(leftOperand) && isComparison(operator) && isNumber(rightOperand);
	if (!valid) return false;
	return operatorFunction[operator](Number(leftOperand), Number(rightOperand));
}
