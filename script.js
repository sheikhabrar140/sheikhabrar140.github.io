document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("cosmos-engine");
  if (!canvas) return console.warn("Canvas not found");
  const ctx = canvas.getContext("2d");
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    drawScene(); // redraw on resize
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  /* ===================== SCIENTIFIC STAR COLORS ===================== */
  const SPECTRAL_CLASSES = [
    { color: "#9bb0ff", weight: 5 },
    { color: "#aabfff", weight: 5 },
    { color: "#cad7ff", weight: 10 },
    { color: "#f8f7ff", weight: 15 },
    { color: "#fff4ea", weight: 20 },
    { color: "#ffd2a1", weight: 30 },
    { color: "#ffcc6f", weight: 31 }
  ];

  function getStarColor() {
    const totalWeight = SPECTRAL_CLASSES.reduce((acc, type) => acc + type.weight, 0);
    let random = Math.random() * totalWeight;
    for (let type of SPECTRAL_CLASSES) {
      if (random < type.weight) return type.color;
      random -= type.weight;
    }
    return "#ffffff";
  }

  /* ===================== STARS ===================== */
  const STAR_COUNT = 400;

  class Star {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 0.2;
      this.color = getStarColor();
      this.opacity = Math.random() * 0.8 + 0.2;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ===================== STATIC ELEMENTS ===================== */

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#020617");   // deep navy
    gradient.addColorStop(1, "#000000");   // black

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawGalaxy() {
    const galaxy = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 0,
      width * 0.5, height * 0.4, width * 0.6
    );

    galaxy.addColorStop(0, "rgba(99,102,241,0.25)");
    galaxy.addColorStop(0.3, "rgba(139,92,246,0.15)");
    galaxy.addColorStop(0.6, "rgba(30,27,75,0.08)");
    galaxy.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = galaxy;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDust() {
    for (let i = 0; i < 8; i++) {
      const dust = ctx.createRadialGradient(
        Math.random() * width,
        Math.random() * height,
        0,
        Math.random() * width,
        Math.random() * height,
        Math.random() * 300 + 200
      );

      dust.addColorStop(0, "rgba(255,255,255,0.03)");
      dust.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = dust;
      ctx.fillRect(0, 0, width, height);
    }
  }

  /* ===================== CREATE STARS ===================== */
  const slowStars = Array.from({ length: STAR_COUNT }, () => new Star());
  const fastStars = []; // kept for compatibility
  const meteor = null;  // removed (static theme)

  /* ===================== MAIN DRAW ===================== */
  function drawScene() {
    ctx.clearRect(0, 0, width, height);

    drawBackground();
    drawGalaxy();
    drawDust();

    slowStars.forEach(star => star.draw());
  }

});

/* ===================== SECTION SCROLL ANIMATION ===================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.1 });

// Target all sections to make them appear on scroll
document.querySelectorAll("section").forEach(sec => observer.observe(sec));