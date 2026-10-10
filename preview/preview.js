(() => {
  const root = document.documentElement;
  const body = document.body;
  const key = "mosenjo-review-theme";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const buttons = [...document.querySelectorAll(".theme-toggle")];
  let themeAnimating = false;

  try {
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (error) {
    // Theme toggle continues to work when browser storage is unavailable.
  }

  function refreshControls() {
    for (const button of buttons) {
      const light = root.dataset.theme !== "dark";
      button.querySelector(".theme-icon").textContent = light ? "☾" : "☀";
      button.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("title", light ? "Dark mode" : "Light mode");
    }
  }

  function saveTheme() {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(key, root.dataset.theme); } catch (error) {}
    refreshControls();
  }

  function setThemeAngle(angle) {
    const perspective = Math.max(window.innerWidth * 1.7, 900);
    body.style.transform = `perspective(${perspective}px) rotateY(${angle}deg)`;
  }

  // Match the flip on the published mosenjo.com: out at 90°, switch,
  // back from -90° to 0°. Respect reduced motion and repeated clicks.
  function flipTheme() {
    if (themeAnimating) return;
    if (reducedMotion.matches) {
      saveTheme();
      return;
    }
    themeAnimating = true;
    root.classList.add("is-theme-animating", "is-theme-moving");
    setThemeAngle(90);
    window.setTimeout(() => {
      saveTheme();
      root.classList.remove("is-theme-animating");
      setThemeAngle(-90);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        root.classList.add("is-theme-animating");
        setThemeAngle(0);
        window.setTimeout(() => {
          body.style.transform = "";
          root.classList.remove("is-theme-animating", "is-theme-moving");
          themeAnimating = false;
        }, 290);
      }));
    }, 285);
  }

  refreshControls();
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (themeAnimating) return;
      // Leave the Lisy-blue hand-drawn orbit exactly as it is for now.
      button.classList.remove("just-clicked");
      void button.offsetWidth;
      button.classList.add("just-clicked");
      window.setTimeout(() => button.classList.remove("just-clicked"), 1250);
      flipTheme();
    });
  }

  const menu = document.querySelector(".menu-toggle");
  if (menu) {
    const close = () => {
      body.classList.remove("menu-open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
    };
    menu.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    document.querySelectorAll(".navigation a").forEach(link => link.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && body.classList.contains("menu-open")) {
        close();
        menu.focus();
      }
    });
    const desktop = window.matchMedia("(min-width: 901px)");
    desktop.addEventListener("change", event => { if (event.matches) close(); });
  }
})();
