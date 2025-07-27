document.addEventListener('DOMContentLoaded', (function (e) {
    const form = document.getElementById('pyramid-form');
    const resultEl = document.getElementById('pyramid-result');
    const progressEl = document.getElementById('pyramid-progress');
    if (!progressEl) return;
    const celebrationEl = document.getElementById('celebration-overlay');
    const nextPyramidBtn = document.getElementById('next-pyramid');
    const nextForm = document.getElementById('next-pyramid-form');

    // Setup reset listener on the modal's "Neues Spiel" button
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', function () {
            // Reset progress and hide overlay
            localStorage.removeItem('correctCount');
            updatePyramidProgress();
            celebrationEl.style.display = 'none';
            // Re-enable Prüfen & hide Next button
            const checkBtn = document.getElementById('check-pyramid');
            if (checkBtn) checkBtn.style.display = 'inline-block';
            nextPyramidBtn.style.display = 'none';
        });
    }

    // Initialize correctCount from localStorage, default to 0
    let correctCount = parseInt(localStorage.getItem('correctCount')) || 0;

    function updatePyramidProgress() {
        const pct = Math.min((correctCount / 10) * 100, 100);
        progressEl.style.width = pct + '%';
        if (correctCount >= 10) {
            // show celebration overlay in modal
            celebrationEl.style.display = 'block';
        }
    }

    updatePyramidProgress();

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        console.log(data);
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
                    // Versuche Data-Attribute, sonst greife auf name-Attribut zurück
                    let selector = `input[data-row="${cell.row}"][data-col="${cell.col}"]`;
                    let inp = document.querySelector(selector);
                    console.log('Checking cell', cell, 'selector was', selector);
                    if (!inp) {
                        selector = `input[name="user-${cell.row}-${cell.col}"]`;
                        inp = document.querySelector(selector);
                    }
                    if (!inp) {
                        console.warn(`No input found for selector ${selector}`);
                        return;
                    }
                    inp.classList.toggle('wrong', !cell.correct);
                    inp.classList.toggle('correct', cell.correct);
                });

                resultEl.textContent =
                    json.correct === json.total
                        ? 'Alles richtig! 🎉'
                        : `Richtig ${json.correct} von ${json.total}.`;
                if (json.correct !== json.total) {
                    // color all inputs red, which are not correct
                    json.results.forEach(cell => {
                        if (!cell.correct) {
                            let selector = `input[data-row="${cell.row}"][data-col="${cell.col}"]`;
                            let inp = document.querySelector(selector);
                            if (!inp) {
                                selector = `input[name="user-${cell.row}-${cell.col}"]`;
                                inp = document.querySelector(selector);
                            }
                            if (inp) {
                                inp.classList.add('wrong');
                                // Highlight the input with a red background
                                inp.style.backgroundColor = '#ffcccc'; // Light red background
                            }
                        } else {
                            // color correct inputs with a green background
                            let selector = `input[data-row="${cell.row}"][data-col="${cell.col}"]`;
                            let inp = document.querySelector(selector);
                            if (!inp) {
                                selector = `input[name="user-${cell.row}-${cell.col}"]`;
                                inp = document.querySelector(selector);
                            }
                            if (inp) {
                                inp.classList.add('correct');
                                // Highlight the input with a green background
                                inp.style.backgroundColor = '#ccffcc'; // Light green background
                            }
                        }
                    });
                }

                // confetti nur bei komplett richtig
                if (json.correct === json.total) {
                    resultEl.textContent = 'Alles richtig! 🎉';
                    resultEl.classList.add('correct');
                    confetti();
                    correctCount++;
                    localStorage.setItem('correctCount', correctCount);
                    updatePyramidProgress();
                }
                // Show next task button and hide check button
                const checkBtn = document.getElementById('check-pyramid');
                const nextBtn = document.getElementById('next-pyramid');
                if (checkBtn && nextBtn) {
                    checkBtn.style.display = 'none';
                    nextBtn.style.display = 'inline-block';
                }

            });
    });

    // „Nächste Aufgabe“-Button: verstecktes Formular abschicken
    nextPyramidBtn.addEventListener('click', function () {
        // Show the Prüfen button again and hide the Next button
        const checkBtn = document.getElementById('check-pyramid');
        if (checkBtn) {
            checkBtn.style.display = 'inline-block';
        }
        nextPyramidBtn.style.display = 'none';
        // Submit the hidden form to generate a new puzzle
        if (nextForm) {
            nextForm.submit();
        }
    });
}));