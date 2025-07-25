document.addEventListener('DOMContentLoaded', function () {
    // Progress-Count initialisieren
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    const progressEl = document.getElementById('progress');
    const celebrationEl = document.getElementById('celebration-overlay');

    function updateProgress() {
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

    updateProgress();

    // Prüfen-Button
    const form = document.getElementById('answer-form');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const nextForm = document.getElementById('next-form');
    const resultEl = document.getElementById('result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = parseFloat(document.getElementById('answer-input').value.trim());
        const correct = parseFloat(document.querySelector('.game-container').dataset.answer);

        if (!isNaN(input) && input === correct) {
            resultEl.textContent = 'Richtig! 🎉';
            resultEl.classList.add('correct');
            confetti();
            correctCount++;
            localStorage.setItem('correctCount', correctCount);
            updateProgress();
        } else {
            resultEl.textContent = `Falsch. Richtig wäre ${correct}`;
            resultEl.classList.remove('correct');
        }

        // Check-Button ausblenden, Next-Button einblenden
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
    });

    // „Nächste Aufgabe“-Button: verstecktes Formular abschicken
    nextBtn.addEventListener('click', function () {
        nextForm.submit();
    });

    newGameBtn.addEventListener('click', function () {
        localStorage.removeItem('correctCount');
        window.location.href = '/';
    });
});