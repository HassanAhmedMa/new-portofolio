/* =========================================================================
   HASSAN AHMED — PORTFOLIO SCRIPT
   Interactive 3D Spatial Canvas, Cylindrical Tech Wheel, Animations
   ========================================================================= */

/* =========================================================================
   1. TECH STACK WHEEL CONFIGURATION
   Easily add, remove, or modify skills below!
   ========================================================================= */
const TECH_STACK_CONFIG = {
  // Default centered/active skill on page load (case-insensitive)
  defaultSkill: "Docker",

  // List of all skills/services displayed on the cylindrical 3D roller
  skills: [
    "Antigravity",
    "Agentic AI",
    "Ubuntu",
    "n8n",
    "APIs",
    "Problem Solving",
    "Postgress",
    "RAG",
    "Docker",
    "Codex",
    "Docker",
    "Python",
    "Full-stack",
    "Cloudflare",
    "Automations",
    "Landing Pages",
    "HTML",
    "JavaScript",
    "CSS",
    "Python",
    "Java",
    "SQL",
    "Supabase",
    "My SQL",
    "Firebase",
    "Pydantic Ai",
    "FastAPI",
    "Flask"

  ]
};

(() => {
  /* =========================================================================
     2. NAVIGATION BAR & STAGGERED TEXT HOVER TREATMENT
     ========================================================================= */
  const navLinks = Array.from(document.querySelectorAll(".primary-nav .nav-link"));

  // Split nav labels into individual character spans for staggered upward sweep
  navLinks.forEach((link) => {
    const label = link.querySelector(".nav-label");
    if (!label || label.dataset.staggerReady === "true") return;

    const text = label.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;

    link.setAttribute("aria-label", text);

    const characters = Array.from(text);
    const makeLine = (isClone = false) => {
      const line = document.createElement("span");
      line.className = isClone ? "stagger-line stagger-clone" : "stagger-line";

      characters.forEach((character, index) => {
        const span = document.createElement("span");
        span.className = "stagger-char";
        span.style.setProperty("--i", String(index));
        span.textContent = character === " " ? "\u00a0" : character;
        line.append(span);
      });

      return line;
    };

    label.textContent = "";
    label.style.setProperty("--n", String(characters.length));
    label.append(makeLine());

    const clone = makeLine(true);
    clone.setAttribute("aria-hidden", "true");
    label.append(clone);

    label.setAttribute("aria-hidden", "true");
    label.dataset.staggerReady = "true";
  });

  // Nav link click behavior connected with spatial stages
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");

      if (href === "#home") {
        switchStage(0);
        return;
      }

      if (href === "#about") {
        switchStage(1);
        return;
      }

      if (href === "#projects") {
        switchStage(3);
        return;
      }

      if (href === "#contact") {
        scrollToContact();
        return;
      }

      navLinks.forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });

      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    });
  });

  const brandLink = document.querySelector(".brand");
  if (brandLink) {
    brandLink.addEventListener("click", (event) => {
      event.preventDefault();
      switchStage(0);
    });
  }

  /* =========================================================================
     3. HERO ACTION BUTTONS & SOFT CURSOR GLOW
     ========================================================================= */
  const actionLinks = Array.from(document.querySelectorAll(".action-link"));
  actionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      actionLinks.forEach((item) => item.classList.remove("is-clicked"));
      link.classList.add("is-clicked");
    });
    link.addEventListener("pointerleave", () => link.classList.remove("is-clicked"));
    link.addEventListener("blur", () => link.classList.remove("is-clicked"));
  });

  const cursorGlow = document.querySelector(".cursor-glow");
  if (cursorGlow) {
    let frame = null;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let hasMoved = false;

    const renderGlow = () => {
      frame = null;
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      cursorGlow.style.setProperty("--cursor-x", `${currentX.toFixed(2)}px`);
      cursorGlow.style.setProperty("--cursor-y", `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = requestAnimationFrame(renderGlow);
      }
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") return;
        targetX = event.clientX;
        targetY = event.clientY;

        if (!hasMoved) {
          hasMoved = true;
          currentX = targetX;
          currentY = targetY;
        }

        cursorGlow.classList.add("is-visible");
        if (frame === null) {
          frame = requestAnimationFrame(renderGlow);
        }
      },
      { passive: true }
    );

    const hideGlow = () => cursorGlow.classList.remove("is-visible");
    document.documentElement.addEventListener("pointerleave", hideGlow);
    window.addEventListener("blur", hideGlow);
    document.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch" && hasMoved) {
        cursorGlow.classList.add("is-visible");
      }
    });
  }

  /* =========================================================================
     4. HERO STATS COUNT-UP ANIMATION
     ========================================================================= */
  const statCounts = document.querySelectorAll(".stat-count");
  statCounts.forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);
    const statItem = counter.closest(".stat");
    const swipeInner = statItem ? statItem.querySelector(".swipe-inner") : null;

    let hasAnimated = false;
    const duration = target > 20 ? 1200 : 850;

    const startCounting = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(ease * target);
        counter.textContent = String(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = String(target);
        }
      };
      requestAnimationFrame(tick);
    };

    if (swipeInner) {
      swipeInner.addEventListener("animationend", startCounting, { once: true });
      const rawDelay = statItem.style.getPropertyValue("--d") || "0.8s";
      const delayMs = (parseFloat(rawDelay) + 0.7) * 1000 + 1400;
      setTimeout(startCounting, delayMs);
    } else {
      startCounting();
    }
  });

  /* =========================================================================
     5. SPATIAL STAGE TRANSITION (Hero <—> About <—> Signature)
     ========================================================================= */
  const viewport = document.querySelector(".spatial-viewport");
  const stageRunway = document.getElementById("stage-runway");
  const stageHero = document.getElementById("stage-hero");
  const stageSkills = document.getElementById("stage-skills");
  const stageSignature = document.getElementById("stage-signature");
  const sigElement = stageSignature ? stageSignature.querySelector(".sig") : null;
  const sigSvg = sigElement ? sigElement.querySelector("svg") : null;
  const projectsSection = document.getElementById("projects");
  const contactSection = document.getElementById("contact");
  const themeColorMeta = document.getElementById("theme-color-meta");
  const primaryNav = document.querySelector(".primary-nav");

  const heroCopy = stageHero ? stageHero.querySelector(".hero-copy") : null;
  const heroVisual = stageHero ? stageHero.querySelector(".hero-visual") : null;
  const heroStats = stageHero ? stageHero.querySelector(".stats-bar") : null;

  // A faint "ghost" of the signature sits behind the ink. It keeps the frame
  // populated while the mask is still drawing and fades out as the ink lands.
  let sigGhostSvg = null;
  if (sigElement && sigSvg) {
    sigGhostSvg = sigSvg.cloneNode(true);
    sigGhostSvg.classList.add("sig-ghost");
    sigGhostSvg.setAttribute("aria-hidden", "true");
    sigElement.appendChild(sigGhostSvg);
  }
  const spatialDots = Array.from(document.querySelectorAll(".spatial-dot"));
  const mobileQuery = window.matchMedia("(max-width: 880px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentStage = 0;
  let progressFrame = 0;
  let currentProgress = 0;
  let lastScrollY = window.scrollY;
  let scrollDirection = 0;
  let lightTheme = null;

  /*
   * Desktop scroll choreography. Every value below is a fraction of the
   * runway, so the whole journey is driven 1:1 by the scroll position:
   *
   *   0.00 → 0.38  camera dive: the Hero plane rushes past, Skills arrives
   *   0.38 → 0.50  Skills rests (tech wheel is interactive here)
   *   0.50 → 0.74  Skills dives past the camera, Signature flies in
   *   0.68 → 0.88  Signature ink is drawn 1:1 by the scroll (and rewinds)
   *   0.88 → 1.00  Signature holds / Projects unlocks
   */
  const P_HERO_END = 0.38;
  const P_SKILLS_EXIT_START = 0.5;
  const P_SKILLS_EXIT_END = 0.74;
  const P_SIG_ENTER_START = 0.52;
  const P_SIG_ENTER_END = 0.68;
  const P_SIG_DRAW_START = 0.68;
  const P_SIG_DRAW_END = 0.88;
  const PROJECTS_STAGE = 3;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const smoothstep = (start, end, value) => {
    const t = clamp01((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  const syncStageUI = (stage) => {
    spatialDots.forEach((dot) => {
      dot.classList.toggle("is-active", parseInt(dot.dataset.stage, 10) === stage);
    });

    navLinks.forEach((link) => {
      const text = (link.getAttribute("aria-label") || link.textContent).trim().toLowerCase();
      const isActive =
        (stage === 0 && text.includes("home")) ||
        (stage >= 1 && stage <= 2 && text.includes("about")) ||
        (stage === PROJECTS_STAGE && text.includes("project"));

      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  /* -------------------------------------------------------------------------
     Signature -> light theme unlock
     The signature flies in with the stage, then its ink is scrubbed directly
     by the scroll position: scrolling down writes it, scrolling back up
     rewinds it. Continuing past the last frame brings the light Projects
     world in.
     ------------------------------------------------------------------------- */
  const getSignatureProgress = () =>
    clamp01((currentProgress - P_SIG_DRAW_START) / (P_SIG_DRAW_END - P_SIG_DRAW_START));

  const paintSignatureScrub = (progress) => {
    if (!sigSvg) return;
    const position = `${(100 - progress * 100).toFixed(2)}% 0`;
    sigSvg.style.setProperty("-webkit-mask-position", position);
    sigSvg.style.setProperty("mask-position", position);
    if (sigGhostSvg) {
      // The ghost holds the frame, then dissolves as the ink arrives.
      sigGhostSvg.style.opacity = (0.03 + 0.15 * (1 - progress)).toFixed(3);
    }
  };

  const clearSignatureScrub = () => {
    if (!sigSvg) return;
    sigSvg.style.removeProperty("-webkit-mask-position");
    sigSvg.style.removeProperty("mask-position");
    if (sigGhostSvg) {
      sigGhostSvg.style.removeProperty("transition");
      sigGhostSvg.style.removeProperty("opacity");
    }
  };

  // Projects is the light "world" that follows the space runway. The theme is
  // driven purely by where the section sits relative to the fixed header, so
  // the header cross-fades exactly as Projects slides into place — no wipe, no
  // timer, no scroll jump. The flip point is the nav's own top edge: the theme
  // only turns light once Projects actually covers the labels, which keeps the
  // transparent header legible while the section is still sliding underneath.
  const projectsFlipPoint = () => {
    if (mobileQuery.matches) return 4;
    if (!primaryNav) return 24;
    // The middle of the nav labels: the theme turns light only once Projects
    // has reached the centre of the text, so the labels are always sitting on
    // the backdrop their colour was chosen for.
    const rect = primaryNav.getBoundingClientRect();
    return Math.max(0, rect.top + rect.height / 2);
  };

  const isProjectsAtTop = () => {
    if (!projectsSection) return false;
    return projectsSection.getBoundingClientRect().top <= projectsFlipPoint();
  };

  const setLightTheme = (light) => {
    if (light === lightTheme) return;
    lightTheme = light;
    document.body.classList.toggle("theme-light", light);
    document.documentElement.classList.toggle("theme-light", light);
    document.documentElement.dataset.theme = light ? "light" : "dark";
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", light ? "#f7f7f5" : "#030405");
    }
  };

  const syncThemeToProjects = () => {
    if (!projectsSection) return;
    setLightTheme(isProjectsAtTop());
  };

  const scrollToProjects = () => {
    if (!projectsSection) return;
    const top = projectsSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  const scrollToContact = () => {
    if (!contactSection) return;
    const top = contactSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  // Keep the Contact nav item in sync once the light contact section arrives.
  const contactNavLink = navLinks.find(
    (link) => link.getAttribute("href") === "#contact"
  );
  let contactNavActive = false;

  const syncContactNav = () => {
    if (!contactSection || !contactNavLink) return;
    const atContact = contactSection.getBoundingClientRect().top <= projectsFlipPoint() + 4;

    if (atContact) {
      contactNavActive = true;
      if (contactNavLink.classList.contains("is-active")) return;
      navLinks.forEach((link) => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });
      contactNavLink.classList.add("is-active");
      contactNavLink.setAttribute("aria-current", "page");
      return;
    }

    if (!contactNavActive) return;
    contactNavActive = false;
    syncStageUI(currentStage);
  };

  const preloadProjectImages = () => {
    if (!projectsSection) return;
    projectsSection.querySelectorAll(".project-image").forEach((img) => {
      img.loading = "eager";
    });
  };

  const applyStageClasses = (stage) => {
    if (!viewport || !stageHero || !stageSkills) return;

    viewport.classList.toggle("stage-1-active", stage === 1);
    viewport.classList.toggle("stage-2-active", stage >= 2);
    viewport.classList.toggle("stage-3-active", stage === PROJECTS_STAGE);
    document.body.classList.toggle("stage-3-active", stage === PROJECTS_STAGE);
    document.documentElement.classList.toggle("stage-3-active", stage === PROJECTS_STAGE);
    stageHero.classList.toggle("is-active", stage === 0);
    stageHero.classList.toggle("is-exited", stage >= 1);
    stageSkills.classList.toggle("is-next", stage === 0);
    stageSkills.classList.toggle("is-active", stage === 1);
    stageSkills.classList.toggle("is-exited", stage >= 2);

    if (stageSignature) {
      stageSignature.classList.toggle("is-next", stage <= 1);
      stageSignature.classList.toggle("is-active", stage >= 2);
    }
  };

  const clearProgressStyles = () => {
    if (!viewport || !stageHero || !stageSkills) return;
    [stageHero, stageSkills, stageSignature, heroCopy, heroVisual, heroStats].forEach((stage) => {
      if (!stage) return;
      stage.style.removeProperty("transform");
      stage.style.removeProperty("opacity");
      stage.style.removeProperty("pointer-events");
      stage.style.removeProperty("visibility");
      stage.style.removeProperty("filter");
    });
    viewport.style.removeProperty("--backdrop-scale");
    viewport.style.removeProperty("--stage-progress");
  };

  const startSignatureDraw = () => {
    if (!sigElement || sigElement.classList.contains("is-in")) return;
    clearSignatureScrub();
    if (sigGhostSvg) {
      sigGhostSvg.style.transition = "opacity 4s linear";
      sigGhostSvg.style.opacity = "0.03";
    }
    sigElement.classList.add("is-in");
  };

  /*
   * Mobile keeps the normal vertical read, but the stages still get the same
   * arrival/departure motion as the desktop camera move: each section lifts,
   * settles and dissolves as it crosses the viewport, and the signature ink is
   * scrubbed by the scroll instead of playing on a timer. Transform/opacity
   * only — no extra 3D or layout work.
   */
  const applyMobileStageMotion = () => {
    if (!mobileQuery.matches || reducedMotion) return;

    const vh = window.innerHeight;
    const stages = [
      { el: stageHero, fade: false },
      { el: stageSkills, fade: true },
      { el: stageSignature, fade: true }
    ];

    stages.forEach(({ el, fade }) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const enter = clamp01((vh - rect.top) / (vh * 0.82));
      const exit = clamp01((vh * 0.16 - rect.bottom) / (vh * 0.72));
      const opacity = (fade ? 0.12 + 0.88 * enter : 1) * (1 - exit);
      const lift = (1 - enter) * 34 - exit * 26;
      // Never scale past 1 on mobile — a scaled stage would widen the page.
      const scale = 0.986 + enter * 0.014 - exit * 0.006;

      el.style.transform =
        `translate3d(0, ${lift.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
    });

    if (stageSignature) {
      const rect = stageSignature.getBoundingClientRect();
      // Finish the ink while the signature is still in the middle of the
      // viewport, then let the stage hold and dissolve.
      const draw = clamp01(
        (vh * 0.85 - rect.top) / (vh * 0.55 + rect.height * 0.15)
      );
      if (sigElement && sigElement.classList.contains("is-in")) {
        sigElement.classList.remove("is-in");
      }
      paintSignatureScrub(draw);
    }
  };

  /*
   * Desktop scroll choreography. The entire voyage is one continuous camera
   * move driven 1:1 by the scroll position: the Hero plane is flown through,
   * the Skills stage arrives from deep space and rests, then dives past the
   * camera while the signature flies in; its ink is then drawn 1:1 by the
   * scroll before Projects unlocks.
   */
  const applyStageProgress = (value) => {
    if (!viewport || !stageHero || !stageSkills) return;

    const total = clamp01(value);
    currentProgress = total;

    if (mobileQuery.matches) {
      return;
    }

    // ── 1. Camera dive through the Hero plane (0 → P_HERO_END) ──
    const diveP = clamp01(total / P_HERO_END);

    if (total < P_HERO_END) {
      const eased = diveP * diveP;
      const heroZ = reducedMotion ? 0 : eased * 460;
      const heroScale = reducedMotion ? 1 : 1 + eased * 1.1;
      const heroLift = reducedMotion ? 0 : -smoothstep(0, 1, diveP) * 2.4;
      const heroOpacity = reducedMotion ? 1 - diveP : 1 - smoothstep(0.3, 0.68, diveP);
      const heroBlur = reducedMotion ? 0 : smoothstep(0.3, 0.7, diveP) * 8;

      stageHero.style.transform = `translate3d(0, ${heroLift.toFixed(2)}vh, ${heroZ.toFixed(1)}px) scale(${heroScale.toFixed(3)})`;
      stageHero.style.opacity = String(heroOpacity.toFixed(3));
      stageHero.style.filter = heroBlur > 0.05 ? `blur(${heroBlur.toFixed(1)}px)` : "none";
      stageHero.style.pointerEvents = diveP < 0.04 ? "auto" : "none";
      stageHero.style.visibility = "visible";
    } else {
      stageHero.style.visibility = "hidden";
      stageHero.style.opacity = "0";
      stageHero.style.filter = "none";
      stageHero.style.pointerEvents = "none";
    }

    if (heroCopy) heroCopy.style.transform = "none";
    if (heroVisual) heroVisual.style.transform = "none";
    if (heroStats) heroStats.style.transform = "none";

    // ── 2. Skills arrives from deep space, rests, then dives past the camera ──
    const skillsEase = easeOutCubic(clamp01((diveP - 0.45) / 0.55));
    const skillsEnterOpacity = smoothstep(0.42, 0.93, diveP);
    const exitP = clamp01(
      (total - P_SKILLS_EXIT_START) / (P_SKILLS_EXIT_END - P_SKILLS_EXIT_START)
    );
    const skillsOpacity = skillsEnterOpacity * (1 - smoothstep(0, 1, exitP));
    const skillsScale = 0.55 + 0.45 * skillsEase + (reducedMotion ? 0 : exitP * 0.9);
    const skillsZ = reducedMotion ? 0 : (1 - skillsEase) * -520 + exitP * 460;
    const skillsY = reducedMotion ? 0 : (1 - skillsEase) * 6;
    const skillsBlur = reducedMotion ? 0 : (1 - skillsEase) * 8 + exitP * 8;

    stageSkills.style.transform =
      `translate3d(0, ${skillsY.toFixed(2)}vh, ${skillsZ.toFixed(1)}px) scale(${skillsScale.toFixed(3)})`;
    stageSkills.style.opacity = String(skillsOpacity.toFixed(3));
    stageSkills.style.filter = skillsBlur > 0.05 ? `blur(${skillsBlur.toFixed(1)}px)` : "none";
    stageSkills.style.pointerEvents = diveP > 0.9 && exitP < 0.1 ? "auto" : "none";
    stageSkills.style.visibility = skillsOpacity <= 0.002 && exitP > 0.4 ? "hidden" : "visible";

    // ── 3. Signature arrives with the same camera fly-in, then draws itself ──
    const sigEnterP = clamp01(
      (total - P_SIG_ENTER_START) / (P_SIG_ENTER_END - P_SIG_ENTER_START)
    );
    const sigEase = easeOutCubic(sigEnterP);
    const sigOpacity = smoothstep(0, 0.8, sigEnterP);
    const sigScale = reducedMotion ? 1 : 0.55 + 0.45 * sigEase;
    const sigZ = reducedMotion ? 0 : (1 - sigEase) * -520;
    const sigBlur = reducedMotion ? 0 : (1 - sigEase) * 8;

    if (stageSignature) {
      stageSignature.style.transform =
        `translate3d(0, 0, ${sigZ.toFixed(1)}px) scale(${sigScale.toFixed(3)})`;
      stageSignature.style.opacity = String(sigOpacity.toFixed(3));
      stageSignature.style.filter = sigBlur > 0.05 ? `blur(${sigBlur.toFixed(1)}px)` : "none";
      stageSignature.style.pointerEvents = "none";
      stageSignature.style.visibility = sigOpacity <= 0.002 ? "hidden" : "visible";
    }

    // The ink follows the scroll 1:1, so scrolling back up rewinds the drawing.
    if (sigElement && sigElement.classList.contains("is-in")) {
      sigElement.classList.remove("is-in");
    }
    const drawP = clamp01(
      (total - P_SIG_DRAW_START) / (P_SIG_DRAW_END - P_SIG_DRAW_START)
    );
    paintSignatureScrub(drawP);

    // One continuous horizon: a gentle push while diving, then locked.
    viewport.style.setProperty(
      "--backdrop-scale",
      String((1 + smoothstep(0, 1, diveP) * 0.08).toFixed(3))
    );
    viewport.style.setProperty("--stage-progress", String(total));

    const nextStage = isProjectsAtTop()
      ? PROJECTS_STAGE
      : (total < 0.34 ? 0 : (total < 0.6 ? 1 : 2));
    if (nextStage !== currentStage) {
      currentStage = nextStage;
      if (currentStage === 0) stageHero.scrollTop = 0;
      applyStageClasses(currentStage);
      syncStageUI(currentStage);
      syncRockPlayback();
    }

    if (total > 0.03 && total < 0.85) ensureRock();
    if (total > 0.15) preloadProjectImages();
  };

  const getStageRange = () =>
    Math.max(
      1,
      (stageRunway ? stageRunway.offsetHeight : document.documentElement.scrollHeight) - window.innerHeight
    );

  const updateStageProgress = () => {
    progressFrame = 0;
    if (!viewport || !stageHero || !stageSkills) return;

    const total = clamp01(window.scrollY / getStageRange());
    currentProgress = total;

    syncThemeToProjects();

    if (!mobileQuery.matches) {
      applyStageProgress(total);
    } else {
      applyMobileStageMotion();
    }

    // Run last so the Contact state wins over the stage-driven Projects state
    // when the user jumps straight to the bottom of the page.
    syncContactNav();
  };

  const requestStageProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(updateStageProgress);
  };

  const switchStage = (targetStage) => {
    if (!viewport || !stageHero || !stageSkills) return;
    const nextStage = Math.max(0, Math.min(PROJECTS_STAGE, targetStage));

    // On small screens the sections are in normal flow. Navigation scrolls,
    // rather than trapping the page in a viewport-sized stage.
    if (mobileQuery.matches) {
      if (nextStage === PROJECTS_STAGE) {
        if (projectsSection) {
          currentStage = PROJECTS_STAGE;
          applyStageClasses(PROJECTS_STAGE);
          syncStageUI(PROJECTS_STAGE);
          projectsSection.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
        return;
      }

      currentStage = nextStage;
      applyStageClasses(nextStage);
      syncStageUI(nextStage);
      syncRockPlayback();

      if (nextStage === 2 && stageSignature) {
        stageSignature.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      } else if (nextStage === 1) {
        ensureRock();
        stageSkills.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? "auto" : "smooth"
        });
      }
      return;
    }

    if (nextStage === PROJECTS_STAGE) {
      if (!projectsSection) return;
      currentStage = PROJECTS_STAGE;
      applyStageClasses(PROJECTS_STAGE);
      syncStageUI(PROJECTS_STAGE);
      scrollToProjects();
      return;
    }

    if (nextStage === 1) ensureRock();

    const range = getStageRange();
    let targetY = 0;
    if (nextStage === 1) targetY = range * (P_HERO_END + 0.06);
    else if (nextStage === 2) targetY = range * P_SIG_DRAW_END;

    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  // Dots click handler
  spatialDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      switchStage(parseInt(dot.dataset.stage, 10));
    });
  });

  const handleBreakpointChange = () => {
    if (mobileQuery.matches) {
      clearProgressStyles();
      clearSignatureScrub();
      if (projectsSection) {
        const projectTop = projectsSection.getBoundingClientRect().top;
        if (projectTop < window.innerHeight * 0.48) {
          currentStage = PROJECTS_STAGE;
          applyStageClasses(PROJECTS_STAGE);
          syncStageUI(PROJECTS_STAGE);
          syncRockPlayback();
          return;
        }
      }
      if (stageSignature) {
        const sigRect = stageSignature.getBoundingClientRect();
        if (sigRect.top < window.innerHeight * 0.55 && sigRect.bottom > window.innerHeight * 0.15) {
          currentStage = 2;
          applyStageClasses(2);
          syncStageUI(2);
          syncRockPlayback();
          return;
        }
      }
      if (stageSkills) {
        const stageTop = stageSkills.getBoundingClientRect().top + window.scrollY;
        currentStage =
          window.scrollY + window.innerHeight * 0.4 >= stageTop ? 1 : 0;
      }
      applyStageClasses(currentStage);
      syncStageUI(currentStage);
      syncRockPlayback();
      return;
    }

    // Entering the pinned desktop layout: rebuild progress from scroll.
    requestStageProgress();
    syncRockPlayback();
  };

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", handleBreakpointChange);
  } else {
    mobileQuery.addListener(handleBreakpointChange);
  }

  const handleScroll = () => {
    const nextY = window.scrollY;
    const direction = nextY > lastScrollY ? 1 : nextY < lastScrollY ? -1 : 0;
    if (direction) scrollDirection = direction;
    lastScrollY = nextY;
    requestStageProgress();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", requestStageProgress);

  if (sigSvg) {
    sigSvg.addEventListener("animationend", (event) => {
      if (event.animationName === "sig-ltr" || event.animationName === "sig-rtl") {
        if (sigElement) sigElement.classList.add("is-in");
      }
    });
  }

  // Any anchor that points at the gated Projects area must ask the stage
  // controller first; otherwise the browser would jump past the signature wipe.
  document.querySelectorAll('a[href="#projects"]').forEach((link) => {
    if (link.closest(".primary-nav")) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      switchStage(PROJECTS_STAGE);
    });
  });

  document.querySelectorAll('a[href="#home"]').forEach((link) => {
    if (link.closest(".primary-nav") || link.classList.contains("brand")) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      switchStage(0);
    });
  });

  window.__themeDebug = {
    setLightTheme,
    syncThemeToProjects,
    syncContactNav,
    isProjectsAtTop,
    getSignatureProgress,
    switchStage,
    applyStageProgress,
    applyMobileStageMotion,
  };

  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");

  const setActiveProject = (activeCard) => {
    projectCards.forEach((card) => {
      card.classList.toggle("is-active", card === activeCard);
    });
  };

  const closeProjectCards = (except) => {
    projectCards.forEach((card) => {
      if (card !== except) card.classList.remove("is-open");
    });
  };

  // The copy inside a card only appears once the drawer has finished growing.
  // `is-settled` is what the CSS uses to fade the details in, so a card that is
  // already extended reveals them immediately while a collapsed one waits for
  // the flex transition to land.
  const projectSettleDelay = reducedMotion
    ? 0
    : coarsePointerQuery.matches
      ? 380
      : 720;

  const settleProject = (card, delay) => {
    window.clearTimeout(card._settleTimer);
    card.classList.remove("is-settled");
    if (delay <= 0) {
      card.classList.add("is-settled");
      return;
    }
    card._settleTimer = window.setTimeout(() => {
      if (
        card.classList.contains("is-active") &&
        card.matches(":hover, :focus-visible")
      ) {
        card.classList.add("is-settled");
      }
    }, delay);
  };

  const unsettleProject = (card) => {
    window.clearTimeout(card._settleTimer);
    card.classList.remove("is-settled");
  };

  projectCards.forEach((card) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      const wasActive = card.classList.contains("is-active");
      setActiveProject(card);
      settleProject(card, wasActive ? 0 : projectSettleDelay);
    });

    card.addEventListener("pointerleave", () => {
      unsettleProject(card);
    });

    card.addEventListener("focus", () => {
      // Only keyboard focus should reveal the copy; a tap/click focuses the
      // card too, and on touch the `.is-open` state owns that reveal.
      if (!card.matches(":focus-visible")) return;
      const wasActive = card.classList.contains("is-active");
      setActiveProject(card);
      settleProject(card, wasActive ? 0 : projectSettleDelay);
    });

    card.addEventListener("blur", () => {
      unsettleProject(card);
    });

    card.addEventListener("click", () => {
      const wasActive = card.classList.contains("is-active");
      const willOpen = !card.classList.contains("is-open");
      const scroller = card.closest(".projects-cards");
      const cardIndex = projectCards.indexOf(card);
      const collapsedCard = projectCards.find(
        (item) => item !== card && !item.classList.contains("is-active")
      );
      const collapsedWidth = collapsedCard
        ? collapsedCard.getBoundingClientRect().width
        : card.getBoundingClientRect().width;
      const scrollerGap = scroller
        ? parseFloat(getComputedStyle(scroller).columnGap) || 0
        : 0;

      setActiveProject(card);

      if (finePointerQuery.matches) return;

      closeProjectCards(card);
      card.classList.toggle("is-open", willOpen);
      // A card that was already extended does not need to wait for the drawer
      // animation before its copy can fade in.
      card.classList.toggle("is-instant", willOpen && wasActive);

      if (willOpen && scroller) {
        const coarsePointer = coarsePointerQuery.matches;
        const targetLeft = Math.max(0, cardIndex * (collapsedWidth + scrollerGap) - 12);
        window.setTimeout(() => {
          scroller.scrollTo({
            left: targetLeft,
            // Smooth scrolling while the drawer is still resizing makes touch
            // devices fight two animations at once. Let the drawer land first,
            // then snap the selected card into view.
            behavior: reducedMotion || coarsePointer ? "auto" : "smooth"
          });
        }, coarsePointer ? 360 : 80);
      }
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".project-card")) closeProjectCards();
  });

  // The rail arrow is a direct link to the live project. Keep that click from
  // reaching the card's own open/close handler.
  document.querySelectorAll(".project-rail-arrow").forEach((link) => {
    link.addEventListener("click", (event) => event.stopPropagation());
  });

  /* =========================================================================
     CONTACT FORM — animated submit + n8n webhook
     ========================================================================= */
  const CONTACT_ENDPOINT =
    "https://141.253.118.80.sslip.io/webhook/portofolio-submit-form";

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  const contactInquiry = document.getElementById("contact-inquiry");
  const submitBtn = contactForm ? contactForm.querySelector(".submit-btn") : null;
  let submitResetTimer = 0;

  const setSubmitState = (state) => {
    if (!submitBtn) return;
    submitBtn.dataset.state = state;
    submitBtn.disabled = state === "loading";
    submitBtn.setAttribute("aria-busy", state === "loading" ? "true" : "false");
  };

  const setContactStatus = (message, tone) => {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.classList.toggle("is-success", tone === "success");
    contactStatus.classList.toggle("is-error", tone === "error");
  };

  const autoGrowInquiry = () => {
    if (!contactInquiry) return;
    contactInquiry.style.height = "auto";
    contactInquiry.style.height = `${Math.min(contactInquiry.scrollHeight, 220)}px`;
  };

  if (contactInquiry) {
    contactInquiry.addEventListener("input", autoGrowInquiry);
    autoGrowInquiry();
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!submitBtn || submitBtn.dataset.state === "loading") return;
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        cause: String(formData.get("cause") || "").trim(),
        inquiry: String(formData.get("inquiry") || "").trim(),
        source: window.location.href,
        submittedAt: new Date().toISOString()
      };

      window.clearTimeout(submitResetTimer);
      setContactStatus("Sending…", null);
      setSubmitState("loading");

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      try {
        // Send a CORS-safelisted form post (no preflight). This is delivered to
        // n8n even when the webhook does not send Access-Control-Allow-Origin,
        // and n8n exposes the fields as body.name / body.email / body.cause /
        // body.inquiry / body.source / body.submittedAt.
        const formBody = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          formBody.append(key, String(value));
        });

        await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          body: formBody,
          signal: controller.signal
        });

        window.clearTimeout(timeout);

        setSubmitState("success");
        setContactStatus("Thanks — your message is on its way.", "success");
        contactForm.reset();
        autoGrowInquiry();
      } catch (error) {
        window.clearTimeout(timeout);
        console.error("Contact form submission failed:", error);
        setSubmitState("error");
        setContactStatus(
          "Couldn't send that just now — please try again in a moment.",
          "error"
        );
      }

      submitResetTimer = window.setTimeout(() => {
        setSubmitState("idle");
      }, 2800);
    });
  }

  // Footer navigation follows the same stage/scroll model as the header.
  const footerNavLinks = Array.from(document.querySelectorAll(".footer-nav a"));
  footerNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      event.preventDefault();

      if (href === "#home") {
        switchStage(0);
      } else if (href === "#about") {
        switchStage(1);
      } else if (href === "#projects") {
        switchStage(3);
      } else if (href === "#contact") {
        scrollToContact();
      }
    });
  });

  applyStageClasses(0);
  syncStageUI(0);
  const projectsNavLink = navLinks.find((link) => link.getAttribute("href") === "#projects");
  if (projectsNavLink) {
    projectsNavLink.addEventListener("pointerenter", preloadProjectImages, { once: true });
    projectsNavLink.addEventListener("focus", preloadProjectImages, { once: true });
  }
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadProjectImages, { timeout: 3500 });
  } else {
    window.setTimeout(preloadProjectImages, 2500);
  }
  applyStageProgress(0);
  requestStageProgress();

  // Keep the nav state honest while the mobile page is scrolled normally.
  if ("IntersectionObserver" in window) {
    if (stageSkills) {
      const aboutVisibility = new IntersectionObserver(
        (entries) => {
          if (!mobileQuery.matches) return;
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting && currentStage !== 1) {
            currentStage = 1;
            applyStageClasses(1);
            syncStageUI(1);
            syncRockPlayback();
          }
        },
        { threshold: 0.32 }
      );
      aboutVisibility.observe(stageSkills);
    }

    if (stageSignature) {
      const sigVisibility = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            // The ink is scroll-scrubbed on mobile (applyMobileStageMotion),
            // so the timed draw is only needed as a reduced-motion fallback.
            if (mobileQuery.matches && reducedMotion) startSignatureDraw();
            if (mobileQuery.matches && currentStage !== 2) {
              currentStage = 2;
              applyStageClasses(2);
              syncStageUI(2);
              syncRockPlayback();
            }
          }
        },
        { threshold: 0.3 }
      );
      sigVisibility.observe(stageSignature);
    }

    if (projectsSection) {
      const projectsVisibility = new IntersectionObserver(
        (entries) => {
          if (!mobileQuery.matches) return;
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            currentStage = PROJECTS_STAGE;
            applyStageClasses(PROJECTS_STAGE);
            syncStageUI(PROJECTS_STAGE);
            syncRockPlayback();
          }
        },
        { threshold: 0.18 }
      );
      projectsVisibility.observe(projectsSection);
    }
  }

  /* =========================================================================
     6. CONFIGURABLE 3D TECH STACK CYLINDRICAL WHEEL
     ========================================================================= */
  const wheelContainer = document.getElementById("tech-wheel-container");
  const wheelTrack = document.getElementById("tech-wheel-track");

  if (wheelContainer && wheelTrack && TECH_STACK_CONFIG.skills && TECH_STACK_CONFIG.skills.length > 0) {
    const skillsList = TECH_STACK_CONFIG.skills;
    wheelTrack.innerHTML = "";

    // Build wheel items dynamically from config
    skillsList.forEach((skillName, index) => {
      const item = document.createElement("div");
      item.className = "wheel-item";
      item.dataset.index = String(index);
      item.textContent = skillName;
      wheelTrack.appendChild(item);
    });

    const wheelItems = Array.from(wheelTrack.querySelectorAll(".wheel-item"));
    const maxWheelIndex = Math.max(0, skillsList.length - 1);
    const WHEEL_STEP_PX = 100; // One standard wheel notch advances roughly one skill.
    const WHEEL_RELEASE_PX = 140; // Extra travel at either end before changing stage.
    const TICK_INTERVAL_MS = 58; // Keeps fast flicks from turning into a rattle.
    const WHEEL_SOUND_URL = "assets/main-edit.mp3";

    // Identify starting active skill from config (default: "Docker")
    let activeWheelIndex = skillsList.findIndex(
      (s) => s.toLowerCase() === (TECH_STACK_CONFIG.defaultSkill || "").toLowerCase()
    );
    if (activeWheelIndex < 0) activeWheelIndex = 0;

    let wheelPosition = activeWheelIndex;
    let wheelTarget = activeWheelIndex;
    let wheelFrame = 0;
    let wheelLastFrame = 0;
    let boundaryOverscroll = 0;
    let boundaryDirection = 0;
    let lastTickIndex = activeWheelIndex;
    let lastTickTime = 0;
    // The supplied MP3 is a very short, quiet detent sample. Decode and
    // normalize it once, then replay it through a gentle limiter.
    let wheelAudio = null;
    let wheelSoundBuffer = null;
    let wheelSoundPromise = null;
    let wheelSoundDataPromise = null;

    const fetchWheelSound = () => {
      if (!wheelSoundDataPromise) {
        wheelSoundDataPromise = fetch(WHEEL_SOUND_URL)
          .then((response) => {
            if (!response.ok) throw new Error("Wheel sound could not be loaded");
            return response.arrayBuffer();
          })
          .catch(() => null);
      }
      return wheelSoundDataPromise;
    };

    const normalizeWheelBuffer = (buffer) => {
      let peak = 0;
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const samples = buffer.getChannelData(channel);
        for (let i = 0; i < samples.length; i++) {
          peak = Math.max(peak, Math.abs(samples[i]));
        }
      }

      if (peak > 0) {
        const scale = 0.82 / peak;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const samples = buffer.getChannelData(channel);
          for (let i = 0; i < samples.length; i++) {
            samples[i] *= scale;
          }
        }
      }

      return buffer;
    };

    const loadWheelSound = (ctx) => {
      if (wheelSoundBuffer) return Promise.resolve(wheelSoundBuffer);
      if (wheelSoundPromise) return wheelSoundPromise;

      wheelSoundPromise = fetchWheelSound()
        .then((data) => {
          if (!data) return null;
          return new Promise((resolve, reject) => {
            const result = ctx.decodeAudioData(data, resolve, reject);
            if (result && typeof result.then === "function") {
              result.then(resolve, reject);
            }
          });
        })
        .then((buffer) => {
          if (!buffer) return null;
          wheelSoundBuffer = normalizeWheelBuffer(buffer);
          return wheelSoundBuffer;
        })
        .catch(() => null)
        .finally(() => {
          if (!wheelSoundBuffer) wheelSoundPromise = null;
        });

      return wheelSoundPromise;
    };

    fetchWheelSound();

    const clampWheel = (value) => Math.min(maxWheelIndex, Math.max(0, value));

    const primeWheelAudio = () => {
      if (!wheelAudio) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;

        try {
          const ctx = new AudioCtx();
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -8;
          compressor.knee.value = 8;
          compressor.ratio.value = 4;
          compressor.attack.value = 0.003;
          compressor.release.value = 0.14;

          const master = ctx.createGain();
          // 5% of the original output level — a very quiet scroll detent.
          master.gain.value = 0.0225;
          master.connect(compressor);
          compressor.connect(ctx.destination);

          wheelAudio = { ctx, master };
          loadWheelSound(ctx);
        } catch (_) {
          return null;
        }
      }

      if (wheelAudio.ctx.state === "suspended") {
        wheelAudio.ctx.resume().catch(() => {});
      }
      return wheelAudio;
    };

    const playWheelTick = (intensity) => {
      if (!wheelAudio || wheelAudio.ctx.state !== "running" || !wheelSoundBuffer) return;

      const { ctx, master } = wheelAudio;
      const now = ctx.currentTime;
      const strength = 0.62 + Math.min(1, Math.max(0, intensity)) * 0.38;
      const duration = Math.min(wheelSoundBuffer.duration, 0.16);
      const fadeStart = Math.max(0.008, duration - 0.022);

      const source = ctx.createBufferSource();
      source.buffer = wheelSoundBuffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(strength, now + 0.003);
      gain.gain.setValueAtTime(strength, now + fadeStart);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      source.connect(gain);
      gain.connect(master);
      source.start(now);
      source.stop(now + duration + 0.01);
    };

    const paintWheel = (position) => {
      const nearest = Math.round(position);

      wheelItems.forEach((item, index) => {
        const diff = index - position;
        const distance = Math.abs(diff);
        const focus = Math.max(0, 1 - distance);
        const easedFocus = focus * focus * (3 - 2 * focus);

        const rotateX = -diff * 22;
        const translateY = diff * 52;
        const translateZ = -distance * 36;
        const opacity = distance < 0.001 ? 1 : Math.max(0.14, 1 - distance * 0.28);
        const scale = Math.max(0.72, 1.05 - distance * 0.08);
        const red = Math.round(85 + 170 * easedFocus);
        const green = Math.round(86 + 169 * easedFocus);
        const blue = Math.round(83 + 172 * easedFocus);

        item.style.transform = `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
        item.style.opacity = String(opacity);
        item.style.setProperty("--wheel-focus", easedFocus.toFixed(3));
        item.style.setProperty("--wheel-r", String(red));
        item.style.setProperty("--wheel-g", String(green));
        item.style.setProperty("--wheel-b", String(blue));
        item.style.setProperty("--wheel-glow-strong", (0.65 * easedFocus).toFixed(3));
        item.style.setProperty("--wheel-glow-soft", (0.28 * easedFocus).toFixed(3));

        const isActive = index === nearest;
        item.classList.toggle("is-active", isActive);
        if (isActive) {
          item.setAttribute("aria-selected", "true");
        } else {
          item.removeAttribute("aria-selected");
        }
      });

      activeWheelIndex = nearest;
    };

    const registerWheelSound = (now, speed) => {
      const nearest = Math.round(wheelPosition);
      if (nearest === lastTickIndex) return;
      lastTickIndex = nearest;

      if (now - lastTickTime < TICK_INTERVAL_MS) return;
      lastTickTime = now;
      playWheelTick(speed / 16);
    };

    const stepWheel = (now) => {
      wheelFrame = 0;
      if (!wheelLastFrame) wheelLastFrame = now;

      const deltaSeconds = Math.min(Math.max((now - wheelLastFrame) / 1000, 0.001), 0.05);
      wheelLastFrame = now;

      const remaining = wheelTarget - wheelPosition;
      if (Math.abs(remaining) < 0.001) {
        wheelPosition = wheelTarget;
        paintWheel(wheelPosition);
        wheelTrack.classList.remove("is-scrubbing");
        wheelLastFrame = 0;
        return;
      }

      const previous = wheelPosition;
      const easing = reducedMotion ? 1 : 1 - Math.exp(-deltaSeconds * 15);
      wheelPosition += remaining * easing;
      const speed = Math.abs(wheelPosition - previous) / deltaSeconds;

      paintWheel(wheelPosition);
      registerWheelSound(now, speed);

      wheelFrame = requestAnimationFrame(stepWheel);
    };

    const startWheel = () => {
      if (wheelFrame) return;
      wheelTrack.classList.add("is-scrubbing");
      wheelLastFrame = 0;
      wheelFrame = requestAnimationFrame(stepWheel);
    };

    const queueWheelMove = (items, direction) => {
      const previousTarget = wheelTarget;
      wheelTarget = clampWheel(wheelTarget + items);
      const leftover = items - (wheelTarget - previousTarget);

      if (Math.abs(leftover) > 0.0001) {
        const leftoverDirection = Math.sign(leftover);
        if (leftoverDirection !== boundaryDirection) {
          boundaryOverscroll = 0;
          boundaryDirection = leftoverDirection;
        }
        boundaryOverscroll += Math.abs(leftover) * WHEEL_STEP_PX;

        if (boundaryOverscroll >= WHEEL_RELEASE_PX) {
          boundaryOverscroll = 0;
          boundaryDirection = 0;
          startWheel();
          switchStage(direction > 0 ? 2 : 0);
          return;
        }
      } else {
        boundaryOverscroll = 0;
        boundaryDirection = 0;
      }

      startWheel();
    };

    paintWheel(wheelPosition);

    // Unlock audio on a pointer gesture as a fallback for browsers that do not
    // treat wheel input as user activation.
    wheelContainer.addEventListener("pointerdown", primeWheelAudio, { passive: true });

    // Click on a skill to glide the stack to it.
    wheelTrack.addEventListener("click", (e) => {
      if (mouseMoved) return;
      const item = e.target.closest(".wheel-item");
      if (!item) return;
      primeWheelAudio();
      const clickedIdx = parseInt(item.dataset.index, 10);
      if (isNaN(clickedIdx)) return;

      boundaryOverscroll = 0;
      boundaryDirection = 0;
      wheelTarget = clampWheel(clickedIdx);
      startWheel();
    });

    // Mouse dragging: grabbing and spinning the skill cylinder directly on PC/desktop.
    let mouseDragging = false;
    let mousePointerId = 0;
    let mouseStartY = 0;
    let mouseLastY = 0;
    let mouseLastTime = 0;
    let mouseVelocity = 0;
    let mouseMoved = false;
    let mouseOverscroll = 0;
    let mouseDirection = 0;

    wheelContainer.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return; // Touch is handled by touchstart/touchmove
      if (e.button !== 0) return;

      primeWheelAudio();
      mouseDragging = true;
      mousePointerId = e.pointerId;
      mouseStartY = e.clientY;
      mouseLastY = e.clientY;
      mouseLastTime = performance.now();
      mouseVelocity = 0;
      mouseMoved = false;
      mouseOverscroll = 0;
      mouseDirection = 0;
      boundaryOverscroll = 0;
      boundaryDirection = 0;
    });

    wheelContainer.addEventListener("pointermove", (e) => {
      if (!mouseDragging) return;

      const now = performance.now();
      const nextY = e.clientY;
      const totalMoved = Math.abs(nextY - mouseStartY);
      if (totalMoved > 4) {
        if (!mouseMoved) {
          mouseMoved = true;
          try {
            wheelContainer.setPointerCapture(mousePointerId);
          } catch (_) {}
          wheelContainer.classList.add("is-dragging");
        }
      }

      const dragDistance = mouseLastY - nextY;
      const dt = Math.max(1, now - mouseLastTime);
      mouseLastY = nextY;
      mouseLastTime = now;

      if (!dragDistance) return;

      // Track recent velocity for smooth flick momentum on release
      const currentVelocity = dragDistance / dt;
      mouseVelocity = mouseVelocity * 0.25 + currentVelocity * 0.75;

      const items = dragDistance / 44;
      const previousTarget = wheelTarget;
      wheelTarget = clampWheel(wheelTarget + items);
      const leftover = items - (wheelTarget - previousTarget);

      if (Math.abs(leftover) > 0.0001) {
        const leftoverDirection = Math.sign(leftover);
        if (leftoverDirection !== mouseDirection) {
          mouseOverscroll = 0;
          mouseDirection = leftoverDirection;
        }
        mouseOverscroll += Math.abs(leftover) * 44;
      } else {
        mouseOverscroll = 0;
        mouseDirection = 0;
      }

      startWheel();
    });

    const endMouseDrag = (e) => {
      if (!mouseDragging) return;
      mouseDragging = false;
      wheelContainer.classList.remove("is-dragging");
      try {
        if (wheelContainer.hasPointerCapture(e.pointerId)) {
          wheelContainer.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      if (mouseOverscroll >= 110) {
        switchStage(mouseDirection > 0 ? 2 : 0);
      } else if (mouseMoved) {
        const timeSinceMove = performance.now() - mouseLastTime;
        const effectiveVelocity = timeSinceMove > 70 ? 0 : mouseVelocity;
        const flickItems = Math.max(-5, Math.min(5, (effectiveVelocity * 1000) / 380));
        wheelTarget = clampWheel(Math.round(wheelTarget + flickItems));
        startWheel();
      } else {
        wheelTarget = clampWheel(Math.round(wheelTarget));
        startWheel();
      }

      mouseOverscroll = 0;
      mouseDirection = 0;

      if (mouseMoved) {
        window.setTimeout(() => {
          mouseMoved = false;
        }, 60);
      }
    };

    wheelContainer.addEventListener("pointerup", endMouseDrag);
    wheelContainer.addEventListener("pointercancel", endMouseDrag);

    // Wheel movement is proportional to the actual scroll distance. A light
    // notch moves one skill; a trackpad or fast flick can carry through several
    // without the old step-per-event magnet.
    wheelContainer.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) return; // Leave pinch-zoom alone.
        if (!e.deltaY) return;

        e.preventDefault();
        e.stopPropagation();

        primeWheelAudio();

        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 33;
        else if (e.deltaMode === 2) delta *= Math.max(240, wheelContainer.clientHeight);

        queueWheelMove(delta / WHEEL_STEP_PX, delta);
      },
      { passive: false }
    );

    // Touch follows the finger continuously instead of stepping on release.
    let touchTracking = false;
    let touchLastY = 0;
    let touchOverscroll = 0;
    let touchDirection = 0;

    wheelContainer.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches.length) return;
        primeWheelAudio();
        touchTracking = true;
        touchLastY = e.touches[0].clientY;
        touchOverscroll = 0;
        touchDirection = 0;
        boundaryOverscroll = 0;
        boundaryDirection = 0;
      },
      { passive: true }
    );

    wheelContainer.addEventListener(
      "touchmove",
      (e) => {
        if (!touchTracking || !e.touches.length) return;
        e.preventDefault();

        const nextY = e.touches[0].clientY;
        const dragDistance = touchLastY - nextY;
        touchLastY = nextY;
        if (!dragDistance) return;

        const items = dragDistance / 42;
        const previousTarget = wheelTarget;
        wheelTarget = clampWheel(wheelTarget + items);
        const leftover = items - (wheelTarget - previousTarget);

        if (Math.abs(leftover) > 0.0001) {
          const leftoverDirection = Math.sign(leftover);
          if (leftoverDirection !== touchDirection) {
            touchOverscroll = 0;
            touchDirection = leftoverDirection;
          }
          touchOverscroll += Math.abs(leftover) * 42;
        } else {
          touchOverscroll = 0;
          touchDirection = 0;
        }

        startWheel();
      },
      { passive: false }
    );

    wheelContainer.addEventListener(
      "touchend",
      () => {
        touchTracking = false;
        if (touchOverscroll >= 76) {
          switchStage(touchDirection > 0 ? 2 : 0);
        } else {
          wheelTarget = clampWheel(Math.round(wheelTarget));
          startWheel();
        }
        touchOverscroll = 0;
        touchDirection = 0;
      },
      { passive: true }
    );

    wheelContainer.addEventListener(
      "touchcancel",
      () => {
        touchTracking = false;
        touchOverscroll = 0;
        touchDirection = 0;
      },
      { passive: true }
    );
  }

  /* =========================================================================
     7. LAZY THREE.JS ASTEROID
     The static landing page stays light: Three.js, the loader and the GLB
     are only fetched when the About stage is needed and are paused when off.
     ========================================================================= */
  const canvas3d = document.getElementById("asteroid-canvas");
  const box3d = document.getElementById("skills-3d-box");
  const rockDragPill = box3d ? box3d.querySelector(".stone-drag-pill") : null;

  let rockPromise = null;
  let rockController = null;
  let rockInView = false;

  const loadExternalScript = (src) => {
    return new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts).find(
        (script) => script.getAttribute("src") === src
      );
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), {
          once: true
        });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => reject(new Error(`Could not load ${src}`)),
        { once: true }
      );
      document.head.appendChild(script);
    });
  };

  function ensureRock() {
    if (!canvas3d || !box3d) return Promise.resolve();
    // The 3D asteroid is a desktop-only feature — mobile devices skip the
    // Three.js download, texture decoding and render loop entirely.
    if (mobileQuery.matches) return Promise.resolve();
    if (rockPromise) return rockPromise;

    box3d.classList.add("is-loading");
    rockPromise = (async () => {
      try {
        await loadExternalScript("assets/three.min.js?v=21");
        await loadExternalScript("assets/GLTFLoader.js?v=21");

        if (!window.THREE || !window.THREE.GLTFLoader) {
          throw new Error("Three.js or GLTFLoader did not initialize.");
        }

        rockController = await createRockScene();
        box3d.classList.remove("is-loading");
        box3d.classList.add("is-ready");
        rockController.setActive(shouldRockRender());
      } catch (error) {
        console.warn("3D preview unavailable:", error);
        box3d.classList.remove("is-loading");
        box3d.classList.add("has-error");
      }
    })();

    return rockPromise;
  }

  function shouldRockRender() {
    if (document.hidden) return false;
    if (mobileQuery.matches) return false;
    return currentStage === 1;
  }

  function syncRockPlayback() {
    if (rockController) rockController.setActive(shouldRockRender());
  }

  function createRockEnvironment(renderer) {
    // A small procedural studio environment gives the facets crisp, dark-glass
    // reflections without shipping another large HDR asset.
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#111722");
    sky.addColorStop(0.44, "#040609");
    sky.addColorStop(0.72, "#010203");
    sky.addColorStop(1, "#000000");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glow = (x, y, radius, color, opacity) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.16, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.52, `rgba(210, 228, 255, ${opacity * 0.34})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    glow(776, 118, 178, "rgba(255, 255, 255, 1)", 0.95);
    glow(196, 188, 150, "rgba(196, 222, 255, 1)", 0.42);
    glow(522, 62, 120, "rgba(255, 246, 225, 1)", 0.22);
    glow(928, 330, 118, "rgba(188, 216, 255, 1)", 0.16);

    const envTexture = new THREE.CanvasTexture(canvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    if ("colorSpace" in envTexture && THREE.SRGBColorSpace) {
      envTexture.colorSpace = THREE.SRGBColorSpace;
    } else if ("encoding" in envTexture && THREE.sRGBEncoding) {
      envTexture.encoding = THREE.sRGBEncoding;
    }

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const target = pmrem.fromEquirectangular(envTexture);
    envTexture.dispose();
    pmrem.dispose();
    return target.texture;
  }

  async function createRockScene() {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();
      const textureLoader = new THREE.TextureLoader();

      const loadRockTexture = (url, colorTexture = false) =>
        new Promise((resolveTexture) => {
          textureLoader.load(
            url,
            (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              // The GLB uses a tiny 1/16 UV island; this maps one full texture
              // across every stone/shard while keeping the texture seamless.
              texture.repeat.set(16, 16);
              if (colorTexture) {
                if ("colorSpace" in texture && THREE.SRGBColorSpace) {
                  texture.colorSpace = THREE.SRGBColorSpace;
                } else if ("encoding" in texture) {
                  texture.encoding = THREE.sRGBEncoding;
                }
              }
              resolveTexture(texture);
            },
            undefined,
            () => resolveTexture(null)
          );
        });

      const texturesPromise = Promise.all([
        loadRockTexture("assets/rock-albedo.webp?v=26", true),
        loadRockTexture("assets/rock-normal.webp?v=26"),
        loadRockTexture("assets/rock-roughness.webp?v=26"),
        loadRockTexture("assets/rock-detail.webp?v=26")
      ]);

      loader.load(
        "assets/rock_optimized.glb?v=21",
        async (gltf) => {
          try {
            const scene = new THREE.Scene();
            const renderer = new THREE.WebGLRenderer({
              canvas: canvas3d,
              alpha: true,
              antialias: true,
              powerPreference: "high-performance"
            });

            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.01;
            if ("outputEncoding" in renderer) {
              renderer.outputEncoding = THREE.sRGBEncoding;
            }

            const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
            camera.position.set(0, 0.78, 5.15);
            camera.lookAt(0, 0.03, 0);

            try {
              const environment = createRockEnvironment(renderer);
              if (environment) scene.environment = environment;
            } catch (error) {
              console.warn("Rock environment unavailable:", error);
            }

            scene.add(new THREE.HemisphereLight(0xf7f8ff, 0x030405, 0.08));

            const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.45);
            keyLight.position.set(4.5, 6.5, 5.5);
            scene.add(keyLight);

            const rimLight = new THREE.DirectionalLight(0xd7e4ff, 1.25);
            rimLight.position.set(-5.5, 3, -3.5);
            scene.add(rimLight);

            const topLight = new THREE.DirectionalLight(0xeef5ff, 0.4);
            topLight.position.set(1.5, 5.5, -2.5);
            scene.add(topLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
            fillLight.position.set(-3.5, -3.5, 3.5);
            scene.add(fillLight);

            // A soft front light picks out the stone grain without flattening
            // the black volcanic base into grey.
            const frontLight = new THREE.DirectionalLight(0xfff8f0, 0.7);
            frontLight.position.set(-0.5, 1.5, 5.5);
            scene.add(frontLight);

            const masterGroup = new THREE.Group();
            masterGroup.rotation.set(0.23, -0.1, -0.07);
            scene.add(masterGroup);

            const stoneGroup = new THREE.Group();
            masterGroup.add(stoneGroup);

            const ringGroup = new THREE.Group();
            masterGroup.add(ringGroup);

            const [
              albedoTexture,
              normalTexture,
              roughnessTexture,
              detailTexture
            ] = await texturesPromise;

            const maxAnisotropy = Math.min(
              8,
              renderer.capabilities.getMaxAnisotropy()
            );
            [
              albedoTexture,
              normalTexture,
              roughnessTexture,
              detailTexture
            ].forEach((texture) => {
              if (texture) texture.anisotropy = maxAnisotropy;
            });

            const stoneMaterial = new THREE.MeshStandardMaterial({
              color: albedoTexture ? 0xffffff : 0x08090b,
              map: albedoTexture,
              normalMap: normalTexture,
              normalScale: new THREE.Vector2(1.1, 1.1),
              bumpMap: detailTexture,
              bumpScale: detailTexture ? 0.1 : 0,
              roughnessMap: roughnessTexture,
              roughness: roughnessTexture ? 1 : 0.62,
              metalness: 0.2,
              envMapIntensity: 0.3,
              dithering: true,
              flatShading: false
            });

            const ringMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              side: THREE.DoubleSide,
              transparent: false,
              opacity: 1,
              blending: THREE.NormalBlending,
              depthWrite: false,
              toneMapped: false
            });

            const ringGlowMaterial = new THREE.MeshBasicMaterial({
              color: 0xdcecff,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.14,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              toneMapped: false
            });

            const ringOuterGlowMaterial = new THREE.MeshBasicMaterial({
              color: 0xcfe1ff,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.09,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              toneMapped: false
            });

            gltf.scene.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(gltf.scene);
            const center = bounds.getCenter(new THREE.Vector3());
            const size = bounds.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 3.0;
            const modelScale = targetSize / maxDim;

            const shardMeshes = [];
            let stonePivot = null;

            gltf.scene.traverse((node) => {
              if (!node.isMesh) return;

              // Bake the GLB's node transform into the geometry before
              // centering. This preserves the ring/stone relationship and
              // makes every pivot local to the model center.
              const geometry = node.geometry.clone();
              geometry.applyMatrix4(node.matrixWorld);
              geometry.translate(-center.x, -center.y, -center.z);
              if (!geometry.attributes.normal) geometry.computeVertexNormals();
              geometry.computeBoundingSphere();

              // GLTFLoader sanitizes periods out of node names, so the raw
              // GLB name "Mesh_0.001" arrives here as "Mesh_0001". Check the
              // node, mesh, and parent userData names so the ring is classified
              // correctly regardless of loader version.
              const nodeNames = [
                node.name,
                node.userData && node.userData.name,
                node.parent && node.parent.userData && node.parent.userData.name
              ].filter(Boolean);
              const isRing = nodeNames.some((name) => /^Mesh_0[._]?001$/.test(name));
              const isStone = nodeNames.some((name) => /^Mesh_0$/.test(name));

              if (isRing) {
                const ring = new THREE.Mesh(geometry, ringMaterial);
                ring.renderOrder = 3;
                ringGroup.add(ring);

                // A few closely-spaced copies turn the GLB's hairline
                // orbit into a soft, readable glow instead of a 1px wire.
                [1.003, 1.006, 1.009, 1.012].forEach((scale) => {
                  const glow = new THREE.Mesh(geometry, ringGlowMaterial);
                  glow.scale.setScalar(scale);
                  glow.renderOrder = 2;
                  ringGroup.add(glow);
                });

                const outerGlow = new THREE.Mesh(geometry, ringOuterGlowMaterial);
                outerGlow.scale.setScalar(1.022);
                outerGlow.renderOrder = 1;
                ringGroup.add(outerGlow);
              } else {
                const mesh = new THREE.Mesh(geometry, stoneMaterial);
                mesh.renderOrder = 1;
                stoneGroup.add(mesh);

                if (isStone) {
                  geometry.computeBoundingBox();
                  stonePivot = geometry.boundingBox.getCenter(new THREE.Vector3());
                } else {
                  shardMeshes.push(mesh);
                }
              }

              node.geometry.dispose();
            });

            // Rotate the stone around its own center, not the model origin.
            if (stonePivot) {
              stoneGroup.position.copy(stonePivot);
              stoneGroup.children.forEach((child) => child.position.sub(stonePivot));
            }

            const shards = shardMeshes.map((mesh) => ({
              mesh,
              basePosition: mesh.position.clone(),
              phase: Math.random() * Math.PI * 2,
              speed: 0.75 + Math.random() * 0.7
            }));

            masterGroup.scale.setScalar(modelScale);

            // The backdrop is transparent; no box, no clear color, no fog.
            let isDragging = false;
            let lastX = 0;
            let lastY = 0;
            let targetX = 0;
            let targetY = -0.28;
            let elapsed = 0;
            let running = false;
            let frameId = 0;
            let lastFrame = 0;

            stoneGroup.rotation.x = targetX;
            stoneGroup.rotation.y = targetY;

            const updateTargets = (delta) => {
              if (!isDragging && !reducedMotion) targetY += 0.085 * delta;
            };

            const tick = (now) => {
              if (!running) return;
              const delta = Math.min((now - lastFrame) / 1000, 0.05) || 0.016;
              lastFrame = now;
              elapsed += delta;

              if (!isDragging) {
                updateTargets(delta);
                const ease = 1 - Math.exp(-delta * 9);
                stoneGroup.rotation.y += (targetY - stoneGroup.rotation.y) * ease;
                stoneGroup.rotation.x += (targetX - stoneGroup.rotation.x) * ease;
              } else {
                stoneGroup.rotation.y = targetY;
                stoneGroup.rotation.x = targetX;
              }

              if (!reducedMotion) {
                ringGroup.rotation.y += delta * 0.075;
                masterGroup.position.y = Math.sin(elapsed * 0.62) * 0.028;
              }

              if (!reducedMotion) {
                shards.forEach((shard) => {
                  shard.mesh.position.y =
                    shard.basePosition.y + Math.sin(elapsed * shard.speed + shard.phase) * 0.024;
                });
              }

              renderer.render(scene, camera);
              frameId = requestAnimationFrame(tick);
            };

            const start = () => {
              if (running) return;
              running = true;
              lastFrame = performance.now();
              frameId = requestAnimationFrame(tick);
            };

            const stop = () => {
              running = false;
              cancelAnimationFrame(frameId);
            };

            let active = false;
            const setActive = (next) => {
              const nextActive = Boolean(next);
              if (nextActive === active) {
                if (nextActive) start();
                box3d.dataset.renderState = nextActive ? "running" : "paused";
                return;
              }
              active = nextActive;
              if (active) {
                start();
              } else {
                stop();
              }
              box3d.dataset.renderState = active ? "running" : "paused";
            };

            // Pointer drag: the stone's pivot is its own center.
            canvas3d.addEventListener("pointerdown", (event) => {
              if (event.button !== undefined && event.button !== 0) return;
              isDragging = true;
              lastX = event.clientX;
              lastY = event.clientY;
              canvas3d.setPointerCapture(event.pointerId);
              start();
            });

            canvas3d.addEventListener("pointermove", (event) => {
              if (!isDragging) return;
              const dx = event.clientX - lastX;
              const dy = event.clientY - lastY;
              lastX = event.clientX;
              lastY = event.clientY;

              targetY += dx * 0.0075;
              targetX = Math.max(-1.05, Math.min(1.05, targetX + dy * 0.0052));
            });

            const finishDrag = (event) => {
              isDragging = false;
              try {
                canvas3d.releasePointerCapture(event.pointerId);
              } catch (_) {}
            };

            canvas3d.addEventListener("pointerup", finishDrag);
            canvas3d.addEventListener("pointercancel", finishDrag);
            canvas3d.addEventListener("lostpointercapture", () => {
              isDragging = false;
            });

            let resizeFrame = 0;
            const resize = () => {
              if (resizeFrame) return;
              resizeFrame = requestAnimationFrame(() => {
                resizeFrame = 0;
                const width = box3d.clientWidth;
                const height = box3d.clientHeight;
                if (!width || !height) return;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
                if (!running) renderer.render(scene, camera);
              });
            };

            const initialWidth = box3d.clientWidth;
            const initialHeight = box3d.clientHeight;
            if (initialWidth && initialHeight) {
              camera.aspect = initialWidth / initialHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(initialWidth, initialHeight, false);
            }
            renderer.render(scene, camera);

            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(box3d);

            if (rockDragPill) {
              rockDragPill.setAttribute("aria-hidden", "true");
            }

            resolve({
              setActive,
              get active() {
                return active;
              }
            });
          } catch (error) {
            reject(error);
          }
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  // Only start loading the heavy 3D assets when the user is near/reaches
  // the About section, or during idle time on desktop.
  if (canvas3d && box3d) {
    if ("IntersectionObserver" in window) {
      const rockObserver = new IntersectionObserver(
        (entries) => {
          rockInView = Boolean(entries[0] && entries[0].isIntersecting);
          syncRockPlayback();
        },
        { rootMargin: "260px 0px" }
      );
      rockObserver.observe(box3d);
    } else {
      rockInView = true;
    }

    document.addEventListener("visibilitychange", syncRockPlayback);

    const aboutLink = navLinks.find((link) => link.getAttribute("href") === "#about");
    if (aboutLink) {
      aboutLink.addEventListener("pointerenter", ensureRock, { once: true });
      aboutLink.addEventListener("focus", ensureRock, { once: true });
    }
  }

  if (canvas3d && box3d) {
    const connection = navigator.connection;
    const saveData = Boolean(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || "")));
    const warmRock = () => {
      if (!mobileQuery.matches) ensureRock();
    };

    if (!saveData && "requestIdleCallback" in window) {
      window.requestIdleCallback(warmRock, { timeout: 5000 });
    } else if (!saveData) {
      window.setTimeout(warmRock, 4000);
    }
  }
})();
