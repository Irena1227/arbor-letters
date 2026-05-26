const progress = document.querySelector(".progress span");
const seal = document.querySelector(".seal-note");
const revealItems = document.querySelectorAll(
  ".case-file, .confession-header, .paper-image, .confession-body"
);

const updateProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

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
window.addEventListener("resize", updateProgress);
updateProgress();
