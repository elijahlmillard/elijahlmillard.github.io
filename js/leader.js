document.addEventListener('DOMContentLoaded', () => {

// // ============================================================
// // LEADER CANVAS SETUP — separate canvas for the countdown
// // ============================================================
const leaderEl = document.getElementById('leader');
const leaderCanvas = document.getElementById('leader-canvas');
const leaderCtx = leaderCanvas.getContext('2d');
leaderCanvas.width = window.innerWidth;
leaderCanvas.height = window.innerHeight;

// ============================================================
// LEADER — draws each numbered frame onto the leader canvas
// with jitter and brightness flicker for 1895 era feel
// ============================================================
window.playLeader = function() {
  const numbers = [3, 2, 1];
  let index = 0;
  const stamp = 'ELIJAHM1  //  MILLARD PICTURES CO.';
  const frameStamp = 'REEL 01';

  // draws a single frame with the current number
  // jitter and brightness are randomized each call
  window.drawFrame = function(num) {
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 8;
    const brightness = 0.85 + Math.random() * 0.3;

    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
    leaderCtx.save();
    leaderCtx.globalAlpha = brightness;

    // large countdown number in center
    leaderCtx.fillStyle = '#f5f0e8';
    leaderCtx.font = 'bold 280px monospace';
    leaderCtx.textAlign = 'center';
    leaderCtx.textBaseline = 'middle';
    leaderCtx.fillText(
      num,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 + jitterY
    );

    // top stamp — library and studio name
    leaderCtx.font = '18px monospace';
    leaderCtx.fillText(
      stamp,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 - 180 + jitterY
    );

    // bottom stamp — reel number
    leaderCtx.fillText(
      frameStamp,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 + 180 + jitterY
    );

    leaderCtx.restore();
  }

  // briefly flashes the screen white between numbers
  // simulating film burning between frames
  window.flashWhite = function() {
    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
    leaderCtx.fillStyle = '#fff';
    leaderCtx.fillRect(0, 0, leaderCanvas.width, leaderCanvas.height);
  }

  // advances to the next number in the countdown
  // when all numbers are done, ends the leader and starts intro
  window.nextNumber = function() {
    if (index >= numbers.length) {
      flashWhite();
      setTimeout(() => {
        leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
        setTimeout(() => {
          leaderEl.style.display = 'none';
          if (!window.skipped) window.startIntro();
        }, 500);
      }, 80);
      return;
    }

    const num = numbers[index];
    index++;

    // flickers each number for ~800ms then flashes white
    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
      drawFrame(num);
      flickerCount++;
      if (flickerCount >= 10) {
        clearInterval(flickerInterval);
        flashWhite();
        setTimeout(nextNumber, 80);
      }
    }, 80);
  }

  nextNumber();
}

});