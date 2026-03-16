const canvas = document.getElementById('filter');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Film grain parameters
  let lastTime = 0;
  const grainAlpha = 36; // Between 0 and 255 for transparency
  const fps = 24;        // Frames per second
  const frameDuration = 1000 / fps;

  //leader parameters
  const leaderEl = document.getElementById('leader');
  const leaderCanvas = document.getElementById('leader-canvas');
  const leaderCtx = leaderCanvas.getContext('2d');
  leaderCanvas.width = window.innerWidth;
  leaderCanvas.height = window.innerHeight;

  //play leader function
  function playLeader() {
  const numbers = [3, 2, 1];
  let index = 0;
  const stamp = 'ELIJAHM1  //  MILLARD PICTURES CO.';
  const frameStamp = 'REEL 01 // ELIJAHM1';

  function drawFrame(num) {
    const jitterX = (Math.random() - 0.5) * 8;
    const jitterY = (Math.random() - 0.5) * 8;
    const brightness = 0.85 + Math.random() * 0.3;

    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);

    leaderCtx.save();
    leaderCtx.globalAlpha = brightness;

    // number
    leaderCtx.fillStyle = '#f5f0e8';
    leaderCtx.font = 'bold 280px monospace';
    leaderCtx.textAlign = 'center';
    leaderCtx.textBaseline = 'middle';
    leaderCtx.fillText(
      num,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 + jitterY
    );

    // top stamp
    leaderCtx.font = '18px monospace';
    leaderCtx.fillText(
      stamp,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 - 180 + jitterY
    );

    // bottom stamp
    leaderCtx.fillText(
      frameStamp,
      leaderCanvas.width / 2 + jitterX,
      leaderCanvas.height / 2 + 180 + jitterY
    );

    leaderCtx.restore();
  }

  function flashWhite() {
    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
    leaderCtx.fillStyle = '#fff';
    leaderCtx.fillRect(0, 0, leaderCanvas.width, leaderCanvas.height);
  }

  function nextNumber() {
    if (index >= numbers.length) {
      // flash then end
      flashWhite();
      setTimeout(() => {
        leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
        setTimeout(() => {
          leaderEl.style.display = 'none';
          startIntro();
        }, 500);
      }, 80);
      return;
    }

    const num = numbers[index];
    index++;

    // flicker the number for 800ms then flash
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

  function startIntro() {
  newImg();
  setInterval(newImg, 4000);
}

  function generateGrain() {
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const gray = Math.random() * 255 | 0;
      pixels[i] = gray; // Red
      pixels[i + 1] = gray; // Green
      pixels[i + 2] = gray; // Blue
      pixels[i + 3] = grainAlpha; // Alpha (transparency)
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

function drawScratches() {
  const scratchCount = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
  
  for (let i = 0; i < scratchCount; i++) {
    const x = Math.random() * width;
    const opacity = Math.random() * 0.4 + 0.1;
    const lineWidth = Math.random() * 1.5 + 0.5;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, height);
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

  const loop = (currentTime) => {
    requestAnimationFrame(loop);
    const elapsed = Math.floor(currentTime - lastTime);
  
    if (elapsed > frameDuration) {
      lastTime = Math.floor(currentTime - (elapsed % frameDuration));
      generateGrain();
      drawScratches();
    }
   
  };

  requestAnimationFrame(loop); // Start the loop
  window.addEventListener('resize', resizeCanvas);





const newImg = () => {
	const divs = document.querySelectorAll('div[id^="img"]');
  if (divs.length >= 2) {
    divs[0].remove();
  }
	
 const container = document.createElement('div');
 const random = ~~(Math.random() * 500) + 1920;
 //const newSrc = `https://picsum.photos/${random}.webp`;
  const newSrc = './assets/images/cover_photo.jpg';
  
  container.style.backgroundImage = `url(${newSrc})`;
  container.id = `img`;
  const backgroundImage = new Image();
  backgroundImage.src = newSrc;
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

playLeader();
// newImg();
// setInterval(newImg, 4000)