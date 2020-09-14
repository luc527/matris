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

function randomBlock() {
	return randomElement(blocks);
	/* //50/50 chance of comparison or number
	return randomElement(Math.random() <= 0.5 ? comparisons : numbers); */
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
