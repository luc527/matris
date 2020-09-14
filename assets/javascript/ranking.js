let rankingScores = JSON.parse(localStorage.getItem("ranking_scores")) || [];

if (rankingScores.length > 10) {
	rankingScores.splice(-1, 1);
}

// STORE SCORE

function storeScore(score) {
	if (score > 0) {
		rankingScores.push(score);

		rankingScores.sort((a,b) => b - a); //Sort numerically, in descending order 

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
