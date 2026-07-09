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

const collaborationForm = document.querySelector("#collaborationForm");

if (collaborationForm) {
  collaborationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(collaborationForm);
    const subject = encodeURIComponent(`GFIS Collaboration Inquiry - ${data.get("interest") || "General"}`);
    const body = encodeURIComponent(
      [
        "GFIS collaboration/support inquiry",
        "",
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Organization: ${data.get("organization") || ""}`,
        `Interest area: ${data.get("interest") || ""}`,
        "",
        "Message:",
        data.get("message") || "",
        "",
        "Submitted from gfis.chatakeinnoworks.com contact page."
      ].join("\n")
    );
    window.location.href = `mailto:gfis@chatakeinnoworks.com?cc=greenworks@chatakeinnoworks.com,research@chatakeinnoworks.com&subject=${subject}&body=${body}`;
  });
}
