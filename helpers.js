/* randomIntBetween: random integer in interval [min,max) */
function randomIntBetween(min, max) {
	return Math.floor(min + (Math.random() * (max - min)));
}

/* randomElement: returns a random element of the given array */
function randomElement(arr) {
	return arr[randomIntBetween(0, arr.length)];
}