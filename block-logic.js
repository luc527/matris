/* dependencies:
   helpers.js (in randomBlock())
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
	const comparision = Math.random() <= 0.5;
	if (comparision) return comparisions[randomIntBetween(0, comparisions.length)];
	else return numbers[randomIntBetween(0, numbers.length)];
}