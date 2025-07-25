document.addEventListener('DOMContentLoaded', (function(e) {
    const form = document.getElementById('pyramid-form');
    const resultEl = document.getElementById('pyramid-result');
    const progressEl = document.getElementById('pyramid-progress');
    if (!progressEl) return;
    const celebrationEl = document.getElementById('celebration-overlay');
    const newGameBtn = document.getElementById('new-game-btn');

    let correctCount = 0;

    function updatePyramidProgress() {
        const pct = Math.min((correctCount / 10) * 100, 100);
        progressEl.style.width = pct + '%';
        if (correctCount >= 10) {
            // show celebration overlay in modal
            celebrationEl.style.display = 'block';

            // if "Neues Spiel" button is clicked, reset the game
            celebrationEl.querySelector('.new-game-btn').addEventListener('click', function () {
                correctCount = 0;
                localStorage.setItem('correctCount', correctCount);
                updateProgress();
                celebrationEl.style.display = 'none';
            });
        }
    }

    updatePyramidProgress();

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        fetch('/pyramid/validate/', {
            method: 'POST',
            headers: {'X-CSRFToken': data.get('csrfmiddlewaretoken')},
            body: data,
        })
            .then(r => r.json())
            .then(json => {
                if (json.error) {
                    resultEl.textContent = 'Fehler: ' + json.error;
                    return;
                }
                // Highlight each input
                json.results.forEach(cell => {
                    const selector = `input[data-row="${cell.row}"][data-col="${cell.col}"]`;
                    const inp = document.querySelector(selector);
                    inp.classList.toggle('wrong', !cell.correct);
                    inp.classList.toggle('correct', cell.correct);
                });
                resultEl.textContent =
                    json.correct === json.total
                        ? 'Alles richtig! 🎉'
                        : `Richtig ${json.correct} von ${json.total}.`;
                // confetti nur bei komplett richtig
                if (json.correct === json.total) {
                    resultEl.textContent = 'Alles richtig! 🎉';
                    resultEl.classList.add('correct');
                    confetti();
                    correctCount++;
                    localStorage.setItem('correctCount', correctCount);
                    updatePyramidProgress();
                }
            });
    });

    // „Nächste Aufgabe“-Button: verstecktes Formular abschicken
    next-pyramid.addEventListener('click', function () {
        nextForm.submit();
    });
}));