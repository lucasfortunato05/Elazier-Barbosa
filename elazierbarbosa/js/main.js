(function () {
  const header = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  let isScrollQueued = false;

  // Atualiza o estado visual da navbar fixa.
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  // Mostra ou esconde o botão de voltar ao topo.
  const setBackToTopState = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 300);
  };

  // Mantém menu, botão e body sincronizados.
  const setMenuState = (isOpen) => {
    if (!toggle || !panel) return;
    toggle.classList.toggle("is-open", isOpen);
    panel.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("nav-open", isOpen);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  const toggleMenu = () => {
    if (!toggle || !panel) return;
    setMenuState(!panel.classList.contains("is-open"));
  };

  // Resolve links internos sem depender de seletores CSS.
  const getAnchorTarget = (href) => {
    if (!href || href === "#") return null;
    return document.getElementById(href.slice(1));
  };

  // Executa o scroll suave para seções da página.
  const scrollToAnchor = (href) => {
    const target = getAnchorTarget(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Marca no menu a seção mais próxima do topo.
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

  const syncScrollState = () => {
    setHeaderState();
    setBackToTopState();
    setActiveLink();
    isScrollQueued = false;
  };

  const requestScrollSync = () => {
    if (isScrollQueued) return;
    isScrollQueued = true;
    window.requestAnimationFrame(syncScrollState);
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!getAnchorTarget(href)) return;

      event.preventDefault();
      closeMenu();
      scrollToAnchor(href);
    });
  });

  if (toggle) {
    toggle.addEventListener("click", toggleMenu);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      scrollToAnchor("#inicio");
    });
  }

  window.addEventListener("scroll", requestScrollSync, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
    requestScrollSync();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  syncScrollState();
})();
