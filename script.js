const progressBar = document.querySelector(".reading-progress span");
const revealItems = document.querySelectorAll(".letter, .archive-visual, .letter-card");
const letterCards = document.querySelectorAll(".letter-card");
const tailNote = document.querySelector(".tail-note");

const updateProgress = () => {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const revealHashTarget = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target?.classList.contains("letter")) {
    target.classList.add("is-visible");
  }
};

revealHashTarget();
window.addEventListener("hashchange", revealHashTarget);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      letterCards.forEach((card) => {
        const link = card.querySelector(`a[href="#${id}"]`);
        card.classList.toggle("active", Boolean(link));
      });
    });
  },
  { rootMargin: "-38% 0px -50% 0px", threshold: 0 }
);

document.querySelectorAll(".letter").forEach((letter) => activeObserver.observe(letter));

document.addEventListener("click", (event) => {
  const hashLink = event.target.closest('a[href^="#letter-"]');
  if (hashLink) {
    const target = document.querySelector(hashLink.getAttribute("href"));
    target?.classList.add("is-visible");
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "soft-light") {
    document.body.classList.toggle("soft-light");
    return;
  }

  if (action === "tail-note") {
    tailNote?.classList.add("is-open");
    tailNote?.setAttribute("aria-hidden", "false");
    return;
  }

  if (action === "tail-note-close") {
    tailNote?.classList.remove("is-open");
    tailNote?.setAttribute("aria-hidden", "true");
  }
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
