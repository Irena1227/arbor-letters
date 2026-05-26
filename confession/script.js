const progress = document.querySelector(".tear-progress span");
const seal = document.querySelector(".seal-note");
const canvas = document.querySelector(".noise-canvas");
const context = canvas?.getContext("2d");

const updateProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
};

const resizeNoise = () => {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const drawNoise = () => {
  if (!canvas || !context) return;
  const image = context.createImageData(canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value + Math.random() * 22;
    data[i + 2] = value + Math.random() * 38;
    data[i + 3] = Math.random() * 34;
  }
  context.putImageData(image, 0, 0);
  window.setTimeout(() => requestAnimationFrame(drawNoise), 90);
};

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const target = event.target.closest("[data-target]")?.dataset.target;

  if (target) {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (action === "seal") {
    seal?.classList.add("is-open");
    seal?.setAttribute("aria-hidden", "false");
  }

  if (action === "close-seal") {
    seal?.classList.remove("is-open");
    seal?.setAttribute("aria-hidden", "true");
  }
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", () => {
  updateProgress();
  resizeNoise();
});

resizeNoise();
updateProgress();
drawNoise();
