document.addEventListener('DOMContentLoaded', () => {

// ============================================================
// SKIP FLAG — prevents continue prompt if visitor skipped
// ============================================================
let skipped = false;

// ============================================================
// START INTRO
// ============================================================
window.startIntro = function() {
  const intro = document.getElementById('intro');
  const photo = document.getElementById('intro-photo');
  const label = document.getElementById('intro-label');
  const name = document.getElementById('intro-name');
  const summary = document.getElementById('intro-summary');

  intro.style.display = 'block';

  setTimeout(() => {
    photo.style.opacity = '1';
  }, 500);

  setTimeout(() => {
    label.style.transition = 'opacity 1s ease';
    label.style.opacity = '1';
  }, 1200);

  setTimeout(() => {
    name.style.transition = 'opacity 1.5s ease, color 2s ease, text-shadow 2s ease';
    name.style.opacity = '1';
    setTimeout(() => {
      name.style.color = '#f5f0e8';
      name.style.textShadow = 'none';
    }, 300);
  }, 2000);

  setTimeout(() => {
    summary.style.transform = 'translate(-50%, -120%)';
  }, 3500);

  setTimeout(() => {
    showContinue();
  }, 6000);
}

// ============================================================
// SHOW CONTINUE PROMPT
// ============================================================
window.showContinue = function() {
  if (skipped) return;
  const skipBtn = document.querySelector('#skip-btn');
  if (skipBtn) skipBtn.remove();

  const prompt = document.createElement('div');
  prompt.id = 'continue-prompt';
  prompt.innerText = 'PRESS ANY KEY TO CONTINUE';
  prompt.style.cssText = `
    position: fixed;
    bottom: 40px;
    width: 100%;
    text-align: center;
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.4em;
    color: #a09880;
    z-index: 9999;
    opacity: 0;
    transition: opacity 1s ease;
  `;
  document.body.appendChild(prompt);
  setTimeout(() => prompt.style.opacity = '1', 100);

  const advance = () => {
    document.removeEventListener('keydown', advance);
    document.removeEventListener('click', advance);
    endIntro();
  };

  document.addEventListener('keydown', advance);
  document.addEventListener('click', advance);
}

// ============================================================
// END INTRO — navigates to portfolio page
// ============================================================
window.endIntro = function() {
  const intro = document.getElementById('intro');
  const prompt = document.getElementById('continue-prompt');
  intro.style.transition = 'opacity 1s ease';
  intro.style.opacity = '0';
  if (prompt) prompt.style.opacity = '0';

  setTimeout(() => {
    intro.style.display = 'none';
    if (prompt) prompt.remove();
    localStorage.setItem('visited', 'true');
    window.location.href = 'portfolio.html';
  }, 1000);
}

// ============================================================
// KICK OFF
// ============================================================
if (localStorage.getItem('visited')) {
  window.location.href = 'portfolio.html';
} else {
  playLeader();
}

});