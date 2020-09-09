/* dependencies:
   helpers.js (in randomBlock)
*/

const numbers = ['1','2','3','4','5','6','7','8','9','0'];
const comparisions = ['=','!=','>','<','>=','<='];
const blocks = [...numbers, ...comparisions];

function isNumber(block) {
	return numbers.includes(block);
}

function isComparision(block) {
	return comparisions.includes(block);
}

function getType(block) {
	if (isNumber(block)) return 'number';
	if (isComparision(block)) return 'comparision';
	if (block == ' ') return 'empty';
	return 'invalid';
}

function randomBlock() {
	return randomElement(blocks);
	/* //50/50 chance of comparision or number
	return randomElement(Math.random() <= 0.5 ? comparisions : numbers); */
}

const operatorFunction = {
	'>':  (l,r) => l >  r,
	'<':  (l,r) => l <  r,
	'>=': (l,r) => l >= r,
	'<=': (l,r) => l <= r,
	'=':  (l,r) => l == r,
	'!=': (l,r) => l != r,
};

function isTrueExpression(leftOperand, operator, rightOperand) {
	const valid = isNumber(leftOperand) && isComparision(operator) && isNumber(rightOperand);
	if (!valid)
		return false;
	return operatorFunction[operator](Number(leftOperand), Number(rightOperand));
}