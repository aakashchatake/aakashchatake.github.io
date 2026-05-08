const panels = document.querySelectorAll(".scope-grid article, .level-panel, .metrics div, .pipeline li");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

panels.forEach((panel) => {
  panel.style.opacity = "0";
  panel.style.transform = "translateY(14px)";
  panel.style.transition = "opacity 480ms ease, transform 480ms ease";
  observer.observe(panel);
});

const style = document.createElement("style");
style.textContent = ".is-visible{opacity:1!important;transform:translateY(0)!important}";
document.head.appendChild(style);

