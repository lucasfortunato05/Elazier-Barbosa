(function () {
  const header = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.classList.remove("is-open");
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const toggleMenu = () => {
    if (!toggle || !panel) return;
    const isOpen = toggle.classList.toggle("is-open");
    panel.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  };

  const scrollToAnchor = (anchor) => {
    const target = document.querySelector(anchor);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setActiveLink = () => {
    let currentId = "inicio";
    const offset = window.innerHeight * 0.32;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      event.preventDefault();
      closeMenu();
      scrollToAnchor(href);
    });
  });

  if (toggle) {
    toggle.addEventListener("click", toggleMenu);
  }

  window.addEventListener("scroll", () => {
    setHeaderState();
    setActiveLink();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  setHeaderState();
  setActiveLink();
})();
