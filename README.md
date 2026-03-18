# [YOUR NAME] — Developer Portfolio

Live site: [elijahlmillard.github.io](https://elijahlmillard.github.io)

---

## About

This is the personal developer portfolio of Elijah Millard, a technically driven problem solver with strong systems thinking and communication skills. Passionate about understanding complex systems and applying creative precision to technical challenges. Currently looking to enter the world of maintaining and modernizing legacy systems.

---

## Site Structure

The portfolio is split into two pages:

**index.html** — The intro sequence. Plays a 1895-era silent film countdown leader, followed by a cinematic introduction sequence revealing the developer's name, photo, and professional summary. First-time visitors see the full sequence. Returning visitors see the leader with an option to skip directly to the portfolio.

**portfolio.html** — The main portfolio. A tabbed interface styled as a 35mm film strip on the left side of the screen. Seven sections, each with its own thematic background photo and a flash cut transition between them.

### Sections
1. About Me
2. Projects
3. Resume
4. Contact
5. Leadership
6. Business
7. Career Planning

---

## Technical Details

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no build tools.

### Film grain effect
A `<canvas>` element sits fixed over the entire page at all times. Every frame at 24fps the canvas is filled with randomized monochromatic pixel noise using the Canvas 2D API, creating an animated film grain texture. Random vertical scratch lines are drawn on approximately 30% of frames to simulate physical film damage.

### Countdown leader
Drawn entirely on a second canvas using the Canvas 2D API. Each numbered frame is rendered with randomized position jitter and brightness flicker to simulate the unstable projection of 1895-era nitrate film. White flashes between numbers simulate film burning between frames.

### Intro sequence
A sequence of CSS transitions and JavaScript `setTimeout` chains that reveal the background photo, name, and professional summary in order. Orchestrated entirely in vanilla JS with no animation libraries.

### Film strip navigation
A fixed left panel styled to resemble a 35mm film strip with sprocket holes and numbered frames. Clicking a frame triggers a flash cut — a brief white overlay — while the background photo and content panel swap underneath.

### LocalStorage
Used to track whether a visitor has completed the full intro sequence. Returning visitors see the leader play with a skip button. The flag is set only on completion of the full sequence, not on skip.

---

## File Structure
```
elijahlmillard.github.io/
├── index.html          — intro sequence
├── portfolio.html      — main portfolio
├── style.css           — all styles
├── script.js           — all JavaScript
└── assets/
    └── images/
        ├── cover_photo.jpg
        ├── about.jpg
        ├── steam_train.jpg
        ├── factory.jpg
        ├── telegraph_key.jpg
        ├── theatre.jpg
        ├── streets.jpg
        └── lighthouse.jpg
```

---

## Aesthetic Reference

The visual design is inspired by the 1895–1905 era of silent cinema — specifically the nitrate film stock of the Lumière Brothers and Edison Manufacturing Company actualities. Key visual elements include:

- Animated film grain running at 24fps
- Vertical film scratches appearing on 30% of frames
- Orange sepia tone (`sepia(0.9)`) referencing deteriorating nitrate stock
- Flash cuts between sections referencing the ViewMaster slide advance mechanism
- Monospace typography throughout referencing telegram and film stamp aesthetics
- A countdown leader styled after pre-Academy raw numbered frames

---

## COBOL

COBOL programs are available live on PUB400 under library `ELIJAHM1`.

---

## Contact

elijahlmillard@gmail.com  
[My LinkedIn](https://www.linkedin.com/in/elijahmillard)

[github.com/elijahlmillard](https://github.com/elijahlmillard)