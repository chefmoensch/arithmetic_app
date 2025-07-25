document.addEventListener('DOMContentLoaded', () => {
  const checkBtn = document.getElementById('check-pyramid');
  const resultEl = document.getElementById('pyramid-result');
  checkBtn.addEventListener('click', () => {
    let allCorrect = true;
    document.querySelectorAll('.input').forEach(input => {
      const row = parseInt(input.dataset.row);
      const col = parseInt(input.dataset.col);
      const userVal = parseInt(input.value);
      // hole korrekte Pyramide aus data-Attribut? Oder per AJAX?
      // Beispiel: const correctVal = pyramid[row][col];
      // if (userVal !== correctVal) allCorrect = false;
    });
    resultEl.textContent = allCorrect ? 'Super gemacht! 🎉' : 'Einige Felder sind falsch.';
  });
});