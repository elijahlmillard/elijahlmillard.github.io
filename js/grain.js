document.addEventListener('DOMContentLoaded', () => {

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
window.generateGrain = function() {
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
window.drawScratches = function() {
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

});