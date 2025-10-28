// ======================
// NOXUS CLAN — SCRIPT.JS (versione corretta e commentata in italiano)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  /* ======================
     CAROUSEL GENERICO (STREAMER / PLAYER / SPONSOR)
     ====================== */
  const carousels = document.querySelectorAll(".nxs-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".nxs-track");
    if (!track) return;

    const slides = Array.from(track.children);
    const prev = carousel.querySelector(".nxs-prev");
    const next = carousel.querySelector(".nxs-next");
    const dotsContainer =
      carousel.querySelector(".nxs-dots") || document.createElement("div");

    if (!carousel.querySelector(".nxs-dots")) {
      dotsContainer.className = "nxs-dots";
      carousel.appendChild(dotsContainer);
    }

    const autoplayAttr = parseInt(carousel.dataset.autoplay, 10) || 4000;
    let current = 0;
    let intervalId = null;
    const total = slides.length;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const d = document.createElement("button");
      d.className = "nxs-dot";
      d.setAttribute("aria-label", `Vai alla slide ${i + 1}`);
      d.dataset.index = i;
      d.type = "button";
      dotsContainer.appendChild(d);
    }

    const dots = Array.from(dotsContainer.children);

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    const nextSlide = () => goTo(current + 1);
    const prevSlide = () => goTo(current - 1);

    next?.addEventListener("click", () => {
      nextSlide();
      restartAutoplay();
    });
    prev?.addEventListener("click", () => {
      prevSlide();
      restartAutoplay();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const i = Number(e.currentTarget.dataset.index);
        goTo(i);
        restartAutoplay();
      });
    });

    function startAutoplay() {
      if (intervalId) return;
      intervalId = setInterval(nextSlide, autoplayAttr);
    }
    function stopAutoplay() {
      clearInterval(intervalId);
      intervalId = null;
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    goTo(0);
    startAutoplay();
  });

  /* ======================
     MODAL PLAYER
     ====================== */
  document.querySelectorAll(".player-card").forEach((card) => {
    card.addEventListener("click", () => {
      const name =
        card.dataset.name || card.querySelector("img")?.alt || "Player";
      const bio = card.dataset.bio || "";
      const img = card.dataset.img || card.querySelector("img")?.src || "";
      const twitch = card.dataset.twitch || card.dataset.link || "#";
      const tiktok = card.dataset.tiktok || "#";
      const insta = card.dataset.instagram || "#";

      document.getElementById("modalName").textContent = name;
      document.getElementById("modalBio").textContent = bio;
      document.getElementById("modalImg").src = img;

      // Aggiorna icone social nel modal
      document.getElementById("twitchLink").href = twitch;
      document.getElementById("tiktokLink").href = tiktok;
      document.getElementById("instagramLink").href = insta;

      const pm = document.getElementById("playerModal");
      pm.setAttribute("aria-hidden", "false");
      pm.style.display = "flex";
    });
  });

  document.getElementById("playerClose")?.addEventListener("click", () => {
    const pm = document.getElementById("playerModal");
    pm.setAttribute("aria-hidden", "true");
    pm.style.display = "none";
  });

  /* ======================
     MODAL STAFF
     ====================== */
  document.querySelectorAll(".staff-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".staff-social a")) return;

      const name = card.querySelector("h3")?.textContent || "Staff";
      const role = card.querySelector("p")?.textContent || "";
      const bio = card.dataset.bio || "";
      const img = card.querySelector("img")?.src || "";
      document.getElementById("staffName").textContent = name;
      document.getElementById("staffRole").textContent = role;
      document.getElementById("staffBio").textContent = bio;
      document.getElementById("staffImg").src = img;

      const staffLinksContainer = document.getElementById("staffLinks");
      staffLinksContainer.innerHTML = "";

      const twitch = card.dataset.twitch || "#";
      const tiktok = card.dataset.tiktok || "#";
      const instagram = card.dataset.instagram || "#";

      [{ href: twitch, icon: "fab fa-twitch" },
       { href: tiktok, icon: "fab fa-tiktok" },
       { href: instagram, icon: "fab fa-instagram" }]
      .forEach(({ href, icon }) => {
        if (href && href !== "#") {
          const a = document.createElement("a");
          a.href = href;
          a.target = "_blank";
          a.rel = "noopener";
          a.innerHTML = `<i class="${icon}"></i>`;
          staffLinksContainer.appendChild(a);
        }
      });

      const sm = document.getElementById("staffModal");
      sm.setAttribute("aria-hidden", "false");
      sm.style.display = "flex";
    });
  });

  document.getElementById("staffClose")?.addEventListener("click", () => {
    const sm = document.getElementById("staffModal");
    sm.setAttribute("aria-hidden", "true");
    sm.style.display = "none";
  });
  /* ======================
     MODAL ABOUT DEVELOPER (Easter Egg nel footer)
     ====================== */
  const devLink = document.getElementById("openDevModal");
  const devModal = document.getElementById("devModal");
  const devClose = document.getElementById("devClose");

  if (devLink && devModal && devClose) {
    // Apre la modale cliccando su @RealMarcio__ nel footer
    devLink.addEventListener("click", (e) => {
      e.preventDefault();
      devModal.setAttribute("aria-hidden", "false");
      devModal.style.display = "flex";
    });

    // Chiude con la X
    devClose.addEventListener("click", () => {
      devModal.setAttribute("aria-hidden", "true");
      devModal.style.display = "none";
    });

    // Chiude cliccando fuori dal contenuto
    window.addEventListener("click", (e) => {
      if (e.target === devModal) {
        devModal.setAttribute("aria-hidden", "true");
        devModal.style.display = "none";
      }
    });

    // Accessibilità: chiusura con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && devModal.getAttribute("aria-hidden") === "false") {
        devModal.setAttribute("aria-hidden", "true");
        devModal.style.display = "none";
      }
    });
  }


  /* ======================
     CHIUSURA MODALI CLIC FUORI
     ====================== */
  window.addEventListener("click", (e) => {
    const pm = document.getElementById("playerModal");
    const sm = document.getElementById("staffModal");
    if (e.target === pm) {
      pm.setAttribute("aria-hidden", "true");
      pm.style.display = "none";
    }
    if (e.target === sm) {
      sm.setAttribute("aria-hidden", "true");
      sm.style.display = "none";
    }
  });

  /* ======================
     TOGGLE TEMA (CHIARO / SCURO)
     ====================== */
  const body = document.body;
  const desktop = document.getElementById("themeSwitchDesktop");
  const mobile = document.getElementById("themeSwitchMobile");

  const savedTheme = localStorage.getItem("theme") || "dark";
  const isLight = savedTheme === "light";
  body.classList.toggle("light-theme", isLight);
  if (desktop) desktop.checked = isLight;
  if (mobile) mobile.checked = isLight;

  function applyTheme(checked) {
    body.classList.toggle("light-theme", checked);
    localStorage.setItem("theme", checked ? "light" : "dark");
    if (desktop) desktop.checked = checked;
    if (mobile) mobile.checked = checked;
  }

  desktop?.addEventListener("change", (e) => applyTheme(e.target.checked));
  mobile?.addEventListener("change", (e) => applyTheme(e.target.checked));

  /* ======================
     HAMBURGER MENU — con chiusura al clic fuori
     ====================== */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (hamburger && navMenu) {
    const icon = hamburger.querySelector("i");
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");
      icon?.classList.toggle("fa-bars");
      icon?.classList.toggle("fa-times");
    });

    // Chiude il menu quando si clicca un link
    document.querySelectorAll("#nav-menu a").forEach((a) =>
      a.addEventListener("click", () => {
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        icon?.classList.add("fa-bars");
        icon?.classList.remove("fa-times");
      })
    );

    // Chiude il menu se si clicca ovunque fuori
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        icon?.classList.add("fa-bars");
        icon?.classList.remove("fa-times");
      }
    });
  }

  /* ======================
     EFFETTO FUMO SUL LOGO ALL'AVVIO
     ====================== */
  window.addEventListener("load", () => {
    const logo = document.querySelector(".smoke-logo");
    if (logo) {
      setTimeout(() => logo.classList.add("glow"), 2500);
    }
  });
});

/* ======================
   FADE-UP ON SCROLL (animazioni in entrata)
   ====================== */
const fadeSections = document.querySelectorAll(
  "section, .content, .staff-card, .player-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeSections.forEach((el) => {
  el.classList.add("fade-up");
  observer.observe(el);
});

/* ======================
   CURSORE LUMINOSO PERSONALIZZATO (solo desktop)
   ====================== */
if (window.innerWidth > 768) {
  const cursor = document.createElement("div");
  cursor.classList.add("noxus-cursor");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });

  document.addEventListener("click", () => {
    cursor.classList.add("click");
    setTimeout(() => cursor.classList.remove("click"), 150);
  });
}


/* ======================
   CURSORE MOBILE (EFFETTO TOUCH RIPPLE)
   ====================== */
if (window.innerWidth <= 768) {
  document.addEventListener("touchstart", function (e) {
    const ripple = document.createElement("span");
    ripple.className = "touch-ripple";
    ripple.style.left = e.touches[0].clientX + "px";
    ripple.style.top = e.touches[0].clientY + "px";
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}
