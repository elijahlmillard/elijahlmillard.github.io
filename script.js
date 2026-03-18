// ============================================================
// LOGIC SETUP — Sets up all the core functions and variables for the intro sequence,
// ============================================================

let skipped = false; // flag to track if the user has skipped the intro

// ============================================================
// CANVAS SETUP — grain filter that runs the entire time
// ============================================================
const canvas = document.getElementById('filter');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// ============================================================
// LEADER CANVAS SETUP — separate canvas for the countdown
// ============================================================
const leaderEl = document.getElementById('leader');
const leaderCanvas = document.getElementById('leader-canvas');
const leaderCtx = leaderCanvas ? leaderCanvas.getContext('2d') : null;
// only set canvas size if leader canvas exists (it doesn't on portfolio.html)
if (leaderCanvas) {
  leaderCanvas.width = window.innerWidth;
  leaderCanvas.height = window.innerHeight;
}

// ============================================================
// GRAIN SETTINGS
// ============================================================
let lastTime = 0;
const grainAlpha = 36;        // grain transparency — 0 to 255
const fps = 24;               // frames per second
const frameDuration = 1000 / fps;

// ============================================================
// GRAIN — fills the canvas with random monochromatic noise
// each frame giving the film grain effect
// ============================================================
function generateGrain() {
  const imageData = ctx.createImageData(width, height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const gray = Math.random() * 255 | 0;
    pixels[i] = gray;         // red channel
    pixels[i + 1] = gray;     // green channel
    pixels[i + 2] = gray;     // blue channel
    pixels[i + 3] = grainAlpha; // alpha channel
  }

  ctx.putImageData(imageData, 0, 0);
}

// ============================================================
// SCRATCHES — randomly draws full height vertical lines
// on the grain canvas to simulate film damage
// ============================================================
function drawScratches() {
  // only draws scratches on roughly 30% of frames
  const scratchCount = Math.random() < 0.3
    ? Math.floor(Math.random() * 3) + 1
    : 0;

  for (let i = 0; i < scratchCount; i++) {
    const x = Math.random() * width;
    const opacity = Math.random() * 0.4 + 0.1;
    const lineWidth = Math.random() * 1.5 + 0.5;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    // slight diagonal offset for organic feel
    ctx.lineTo(x + (Math.random() - 0.5) * 3, height);
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

// ============================================================
// MAIN LOOP — runs grain and scratches at 24fps
// using requestAnimationFrame for smooth timing
// ============================================================
const loop = (currentTime) => {
  requestAnimationFrame(loop);
  const elapsed = Math.floor(currentTime - lastTime);

  if (elapsed > frameDuration) {
    lastTime = Math.floor(currentTime - (elapsed % frameDuration));
    generateGrain();
    drawScratches();
  }
};

requestAnimationFrame(loop);

// ============================================================
// RESIZE — keeps canvas filling the screen if window resizes
// ============================================================
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// ============================================================
// FLASH CUT — briefly flashes white then swaps background
// gives the ViewMaster mechanical snap feel
// ============================================================
function flashCut(newPhoto) {
  const flash = document.getElementById('flash');
  const bg = document.getElementById('section-bg');

  // flash white
  flash.style.opacity = '1';

  setTimeout(() => {
    // swap photo while screen is white
    bg.style.backgroundImage = `url(${newPhoto})`;
    // fade flash out
    flash.style.opacity = '0';
  }, 150);
}

// ============================================================
// INTERSECTION OBSERVER — watches which section is visible
// swaps background photo and highlights nav link accordingly
// ============================================================
function initObserver() {
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // swap background photo with flash cut
        if (sectionPhotos[id]) {
          flashCut(sectionPhotos[id]);
        }

        // update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  // observe every section
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
}

// ============================================================
// NAV CLICKS — smooth scroll to section on click
// ============================================================
function initNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ============================================================
// LEADER — draws each numbered frame onto the leader canvas
// with jitter and brightness flicker for 1895 era feel
// ============================================================
function playLeader() {
  const numbers = [3, 2, 1];
  let index = 0;
  const stamp = 'ELIJAHM1  //  MILLARD PICTURES CO.';
  const frameStamp = 'REEL 01';

  // draws a single frame with the current number
  // jitter and brightness are randomized each call
  function drawFrame(num) {
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
  function flashWhite() {
    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
    leaderCtx.fillStyle = '#fff';
    leaderCtx.fillRect(0, 0, leaderCanvas.width, leaderCanvas.height);
  }

  // advances to the next number in the countdown
  // when all numbers are done, ends the leader and starts intro
  function nextNumber() {
    if (index >= numbers.length) {
      flashWhite();
      setTimeout(() => {
        leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
        setTimeout(() => {
          leaderEl.style.display = 'none';
          if (!skipped) startIntro();
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

// ============================================================
// INTRO SEQUENCE — plays after the leader ends
// reveals photo, name, and summary in sequence
// ============================================================
function startIntro() {
  const intro = document.getElementById('intro');
  const photo = document.getElementById('intro-photo');
  const label = document.getElementById('intro-label');
  const name = document.getElementById('intro-name');
  const summary = document.getElementById('intro-summary');

  // make the intro div visible
  intro.style.display = 'block';

  // step one — photo burns in from black
  setTimeout(() => {
    photo.style.opacity = '1';
  }, 500);

  // step two — introducing label fades in above name
  setTimeout(() => {
    label.style.transition = 'opacity 1s ease';
    label.style.opacity = '1';
  }, 1200);

  // step three — name burns in from white then settles
  setTimeout(() => {
    name.style.transition = 'opacity 1.5s ease, color 2s ease, text-shadow 2s ease';
    name.style.opacity = '1';
    setTimeout(() => {
      name.style.color = '#f5f0e8';
      name.style.textShadow = 'none';
    }, 300);
  }, 2000);

  // step four — summary scrolls up from bottom of screen
  setTimeout(() => {
    summary.style.transform = 'translate(-50%, -120%)';
  }, 3500);

  // step five — continue prompt appears after everything settles
  setTimeout(() => {
    showContinue();
  }, 6000);
}

// ============================================================
// CONTINUE PROMPT — appears after intro settles
// waits for any key or click then advances to main portfolio
// ============================================================
function showContinue() {
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
    color: hsl(51, 12%, 78%);
    z-index: 9999;
    opacity: 0;
    transition: opacity 1s ease;
  `;
  document.body.appendChild(prompt);

  // slight delay so the opacity transition actually fires
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
// END INTRO — fades out intro and starts main content
// ============================================================
function endIntro() {
  const intro = document.getElementById('intro');
  const prompt = document.getElementById('continue-prompt');

  // fade out intro and prompt together
  intro.style.transition = 'opacity 1s ease';
  intro.style.opacity = '0';
  if (prompt) prompt.style.opacity = '0';

  // after fade completes navigate to portfolio
  setTimeout(() => {
  intro.style.display = 'none';
  if (prompt) prompt.remove();
  localStorage.setItem('completed', 'true');

  // flash white then navigate
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    inset: 0;
    background: #fff;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.15s ease;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.style.opacity = '1', 50);
  setTimeout(() => {
    window.location.href = 'portfolio.html';
  }, 300);

}, 1000);
}

// ============================================================
// SHOW SKIP — shows a skip prompt if the user has already seen the intro
// ============================================================

function showSkip() {
  const skip = document.createElement('div');
  skip.id = 'skip-btn';
  skip.innerText = '[ SPACE TO SKIP ]';
  skip.style.cssText = `
    position: fixed;
    bottom: 40px;
    width: 100%;
    text-align: center;
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.4em;
    color: #a09880;
    z-index: 99999;
    opacity: 0;
    transition: opacity 1s ease;
  `;
  document.body.appendChild(skip);
  setTimeout(() => skip.style.opacity = '1', 100);

  const skipHandler = (e) => {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    document.removeEventListener('keydown', skipHandler);
    document.removeEventListener('click', skipHandler);
    skipped = true;
    skip.remove();
    localStorage.setItem('completed', 'true');
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: #fff;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.15s ease;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.style.opacity = '1', 50);
    setTimeout(() => {
      window.location.href = 'portfolio.html';
    }, 300);
  };

      document.addEventListener('keydown', skipHandler);
      document.addEventListener('click', skipHandler);

      // leader still plays for returning visitors
      playLeader();
}

// ============================================================
// IMAGE CYCLING — loads and cycles background images
// for the main portfolio section
// ============================================================
const newImg = () => {
  // keep maximum of one img div at a time
  const divs = document.querySelectorAll('div[id^="img"]');
  if (divs.length >= 2) {
    divs[0].remove();
  }

  const container = document.createElement('div');
  const newSrc = './assets/images/cover_photo.jpg';

  container.style.backgroundImage = `url(${newSrc})`;
  container.id = 'img';

  const backgroundImage = new Image();
  backgroundImage.src = newSrc;

  // only show image once it has fully loaded
  backgroundImage.onload = () => {
    const pan = [
      "0% 0%",
      "100% 0%",
      "100% 100%",
      "0% 100%"
    ][~~(Math.random() * 4)];
    container.style.backgroundPosition = pan;
    container.style.opacity = "100%";
  };

  document.body.append(container);
};

// ============================================================
// KICK OFF — start the leader, everything else chains from it
// Checks if the user has already seen the intro in this session and skips it if so
// ============================================================
if (document.getElementById('leader')) {
  if (localStorage.getItem('completed')) {
    showSkip();
  } else {
    playLeader();
  }
}

// ============================================================
// PORTFOLIO INIT — only runs on portfolio.html
// ============================================================
if (document.getElementById('film-strip')) {

  const sectionPhotos = {
    about:      './assets/images/about.jpg',
    projects:   './assets/images/steam_train.jpg',
    resume:     './assets/images/factory.jpg',
    contact:    'assets/images/telegraph_key.jpg',
    leadership: 'assets/images/theatre.jpg',
    business:   'assets/images/streets.jpg',
    career:     'assets/images/lighthouse.jpg'
  };

  // reveal content panel with slide up animation
  function showPanel(id) {
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
      const inner = panel.querySelector('.panel-inner');
      if (inner) {
        inner.classList.remove('visible');
      }
    });

    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      // slight delay so transition fires
      setTimeout(() => {
        const inner = target.querySelector('.panel-inner');
        if (inner) inner.classList.add('visible');
      }, 50);
    }
  }

  // flash cut then swap background and show new panel
  function switchSection(id) {
    const flash = document.getElementById('flash');
    const bg = document.getElementById('section-bg');

    // update active film frame
    document.querySelectorAll('.film-frame').forEach(frame => {
      frame.classList.remove('active');
    });
    const activeFrame = document.querySelector(`.film-frame[data-section="${id}"]`);
    if (activeFrame) activeFrame.classList.add('active');

    // flash white
    flash.style.opacity = '1';

    setTimeout(() => {
      // swap background
      if (sectionPhotos[id]) {
        bg.style.backgroundImage = `url(${sectionPhotos[id]})`;
      }
      // show new panel
      showPanel(id);
      // fade flash out
      flash.style.opacity = '0';
    }, 150);
  }

  // wire up film frame clicks
  document.querySelectorAll('.film-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const id = frame.getAttribute('data-section');
      switchSection(id);
    });
  });

  // show first panel on load
  setTimeout(() => {
    const inner = document.querySelector('#about .panel-inner');
    if (inner) inner.classList.add('visible');
  }, 100);

}