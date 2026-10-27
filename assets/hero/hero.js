/* Hero stage v3.6 — ribbon + photo cutouts anim + Anton slam + powder scatter + CTAs. */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chefEl = document.getElementById("hero-chef");
  var ribbonEl = document.getElementById("hero-ribbon");
  var photoEl = document.getElementById("hero-photo");
  var canvas = document.getElementById("powder-canvas");

  /* ── Ribbon + chef life ── */
  if (typeof gsap !== "undefined" && !reduced) {
    if (ribbonEl) {
      // Rest home = perfectly centered (layout-aligned, no residual tilt)
      var ribbonRest = { x: 0, y: 0, rotation: 0, scale: 1, transformOrigin: "50% 50%" };
      gsap.set(ribbonEl, ribbonRest);

      function ribbonToRest(dur, ease) {
        return gsap.to(ribbonEl, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: dur == null ? 0.45 : dur,
          ease: ease || "power2.out",
          overwrite: "auto"
        });
      }

      // Intro → lands on centered rest
      gsap.fromTo(
        ribbonEl,
        { scale: 0.7, y: 24, x: 0, rotation: -8, opacity: 0 },
        {
          scale: 1,
          y: 0,
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.85,
          ease: "back.out(1.4)",
          delay: 0.1,
          overwrite: "auto",
          onComplete: function () {
            gsap.set(ribbonEl, ribbonRest);
            startRibbonIdle();
          }
        }
      );

      var ribbonIdle = null;
      function startRibbonIdle() {
        if (ribbonIdle) ribbonIdle.kill();
        // Float that always returns through centered rest each cycle
        ribbonIdle = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
        ribbonIdle
          .to(ribbonEl, { y: -5, rotation: 1.2, duration: 1.15 })
          .to(ribbonEl, { y: 0, rotation: 0, x: 0, duration: 1.15 })
          .to(ribbonEl, { y: -4, rotation: -1, duration: 1.15 })
          .to(ribbonEl, { y: 0, rotation: 0, x: 0, duration: 1.15 });
      }

      function pauseIdle() {
        if (ribbonIdle) ribbonIdle.pause();
      }
      function resumeIdle() {
        ribbonToRest(0.35, "power2.out").eventCallback("onComplete", function () {
          if (ribbonIdle) {
            ribbonIdle.restart(true);
            ribbonIdle.resume();
          } else {
            startRibbonIdle();
          }
        });
      }

      function popRibbon() {
        pauseIdle();
        gsap.fromTo(
          ribbonEl,
          { scale: 1, rotation: 0, x: 0, y: 0 },
          {
            scale: 1.08,
            rotation: 4,
            duration: 0.28,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: function () {
              gsap.set(ribbonEl, ribbonRest);
              resumeIdle();
            }
          }
        );
      }
      setInterval(popRibbon, 7000);

      ribbonEl.addEventListener("pointerenter", function () {
        pauseIdle();
        gsap.to(ribbonEl, {
          scale: 1.08,
          rotation: -2.5,
          y: -2,
          x: 0,
          duration: 0.35,
          ease: "back.out(2)",
          overwrite: "auto"
        });
      });
      ribbonEl.addEventListener("pointerleave", function () {
        // Always settle centered
        gsap.to(ribbonEl, {
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.55)",
          overwrite: "auto",
          onComplete: function () {
            gsap.set(ribbonEl, ribbonRest);
            if (ribbonIdle) {
              ribbonIdle.restart(true);
              ribbonIdle.resume();
            } else {
              startRibbonIdle();
            }
          }
        });
      });
    }

    if (chefEl) {
      gsap
        .timeline({ repeat: -1 })
        .to(chefEl, {
          rotation: 12,
          y: -10,
          scale: 1.06,
          duration: 0.38,
          ease: "sine.inOut",
          transformOrigin: "50% 90%"
        })
        .to(chefEl, { rotation: -10, y: -2, scale: 1.02, duration: 0.38, ease: "sine.inOut" })
        .to(chefEl, { rotation: 8, y: -8, scale: 1.05, duration: 0.34, ease: "sine.inOut" })
        .to(chefEl, { rotation: 0, y: 0, scale: 1, duration: 0.4, ease: "sine.inOut" });
    }

    var title = document.getElementById("hero-title");
    var line1 = title && title.querySelector(".hero__line:not(.hero__line--accent)");
    if (line1 && typeof SplitType !== "undefined") {
      var titleSplit = new SplitType(line1, { types: "words", tagName: "span", wordClass: "word" });
      gsap.from(titleSplit.words, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.05,
        delay: 0.45
      });
    } else if (line1) {
      gsap.from(line1, { opacity: 0, y: 16, duration: 0.55, delay: 0.45, ease: "power2.out" });
    }

    // Drop the one-shot accent pulse that fought the loop — loop alone is enough
    // (handled below in accent block)

    gsap.from(".hero__panel--photo .hero__plate", {
      scale: 1.06,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.15
    });
    gsap.from(".hero__badge", {
      scale: 0,
      rotation: -40,
      duration: 0.7,
      ease: "back.out(2)",
      delay: 0.9
    });

    /* ── Accent slam (Anton) + condiment cascade — animación fregona ── */
    var accent = document.querySelector(".hero__line--accent");
    if (accent) {
      gsap.fromTo(
        accent,
        { scaleX: 0.55, scaleY: 1.35, opacity: 0, x: -28, rotation: -3 },
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.7,
          delay: 0.72,
          ease: "back.out(2.4)",
          transformOrigin: "left center"
        }
      );
      // Soft pulse loop — display line keeps breathing
      gsap.timeline({ repeat: -1, delay: 3.4 })
        .to(accent, { scale: 1.035, duration: 0.45, ease: "sine.inOut", transformOrigin: "left center" })
        .to(accent, { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.6)", transformOrigin: "left center" })
        .to({}, { duration: 5.2 });
    }

    var condItems = document.querySelectorAll(".hero__condiments li");
    if (condItems.length) {
      gsap.set(condItems, { opacity: 0, y: 28, rotation: -8, scale: 0.7 });
      gsap.to(condItems, {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(2.2)",
        stagger: 0.08,
        delay: 0.95
      });
      // Idle bob — each item slightly offset; pause on hover
      condItems.forEach(function (li, i) {
        var bob = gsap.to(li, {
          y: i % 2 === 0 ? -5 : -3.5,
          rotation: i % 2 === 0 ? 2.5 : -2,
          duration: 1.4 + (i % 3) * 0.22,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 1.6 + i * 0.12
        });
        li.addEventListener("pointerenter", function () {
          bob.pause();
          gsap.to(li, {
            scale: 1.18,
            rotation: i % 2 === 0 ? 8 : -8,
            y: -10,
            duration: 0.35,
            ease: "back.out(2.5)",
            overwrite: "auto"
          });
        });
        li.addEventListener("pointerleave", function () {
          gsap.to(li, {
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
            onComplete: function () {
              bob.resume();
            }
          });
        });
      });
    }
  }

  /* ── Powder scatter canvas ── */
  if (!canvas || !photoEl) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var raf = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var hovering = false;
  var lastX = 0;
  var lastY = 0;

  var COLORS = [
    [140, 55, 35],
    [160, 70, 40],
    [110, 40, 28],
    [180, 90, 50],
    [95, 35, 25],
    [150, 80, 45],
    [125, 48, 30],
    [170, 100, 55]
  ];

  function resize() {
    var r = photoEl.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
    canvas.style.width = r.width + "px";
    canvas.style.height = r.height + "px";
  }

  function moundOrigin() {
    // Bottom-left zone where montañita sits in collage
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    return {
      x: w * 0.22,
      y: h * 0.82,
      spreadX: w * 0.28,
      spreadY: h * 0.16
    };
  }

  function spawn(n, ox, oy, burst) {
    var origin = moundOrigin();
    ox = ox != null ? ox : origin.x + (Math.random() - 0.3) * origin.spreadX;
    oy = oy != null ? oy : origin.y + (Math.random() - 0.5) * origin.spreadY;
    for (var i = 0; i < n; i++) {
      var c = COLORS[(Math.random() * COLORS.length) | 0];
      var angle = burst
        ? Math.random() * Math.PI * 2
        : -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
      var speed = burst ? 1.2 + Math.random() * 3.5 : 0.4 + Math.random() * 2.2;
      particles.push({
        x: ox * dpr,
        y: oy * dpr,
        vx: Math.cos(angle) * speed * dpr * (burst ? 1.4 : 1),
        vy: Math.sin(angle) * speed * dpr - (burst ? 1.5 : 0.3) * dpr,
        r: (1 + Math.random() * 2.8) * dpr,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        color: c,
        spin: (Math.random() - 0.5) * 0.2
      });
    }
    if (particles.length > 420) particles.splice(0, particles.length - 420);
  }

  function tick() {
    raf = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var gravity = 0.045 * dpr;
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += gravity;
      p.vx *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0 || p.y > canvas.height + 10) {
        particles.splice(i, 1);
        continue;
      }
      var a = Math.max(0, Math.min(1, p.life));
      ctx.beginPath();
      ctx.fillStyle =
        "rgba(" + p.color[0] + "," + p.color[1] + "," + p.color[2] + "," + a + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (particles.length || hovering) {
      raf = requestAnimationFrame(tick);
    }
  }

  function ensureTick() {
    if (!raf && !reduced) raf = requestAnimationFrame(tick);
  }

  function localXY(e) {
    var r = canvas.getBoundingClientRect();
    var clientX = e.clientX != null ? e.clientX : e.touches && e.touches[0] && e.touches[0].clientX;
    var clientY = e.clientY != null ? e.clientY : e.touches && e.touches[0] && e.touches[0].clientY;
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function nearPowder(x, y) {
    var o = moundOrigin();
    var dx = x - o.x;
    var dy = y - o.y;
    return dx * dx + dy * dy < (o.spreadX * 1.4) * (o.spreadX * 1.4);
  }

  if (!reduced) {
    resize();
    window.addEventListener("resize", function () {
      resize();
    });

    photoEl.addEventListener("pointerenter", function (e) {
      hovering = true;
      var pt = localXY(e);
      lastX = pt.x;
      lastY = pt.y;
      ensureTick();
    });

    photoEl.addEventListener("pointerleave", function () {
      hovering = false;
    });

    photoEl.addEventListener("pointermove", function (e) {
      var pt = localXY(e);
      var dx = pt.x - lastX;
      var dy = pt.y - lastY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      lastX = pt.x;
      lastY = pt.y;
      hovering = true;
      // Stronger scatter near montañita; lighter anywhere over collage
      var n = nearPowder(pt.x, pt.y) ? 6 + Math.min(10, dist | 0) : 2 + Math.min(4, (dist / 2) | 0);
      if (dist > 2) spawn(n, pt.x, pt.y, false);
      ensureTick();
    });

    photoEl.addEventListener(
      "pointerdown",
      function (e) {
        var pt = localXY(e);
        spawn(nearPowder(pt.x, pt.y) ? 48 : 22, pt.x, pt.y, true);
        ensureTick();
      },
      { passive: true }
    );

    // Mobile / no-hover: gentle idle spill from mound
    var coarse = window.matchMedia("(hover: none), (max-width: 900px)").matches;
    if (coarse) {
      setInterval(function () {
        if (document.hidden) return;
        var o = moundOrigin();
        spawn(5, o.x + (Math.random() - 0.2) * o.spreadX * 0.6, o.y - 8, false);
        ensureTick();
      }, 900);
    }

    // First taste so Edu sees motion without hunting
    setTimeout(function () {
      var o = moundOrigin();
      spawn(28, o.x, o.y - 10, true);
      ensureTick();
    }, 1400);
  }

  /* ── Seasoning CTA buttons: grain spark canvas ── */
  function initSeasonButtons() {
    if (reduced) return;
    var btns = document.querySelectorAll("[data-season-btn]");
    var COLORS = [
      [140, 55, 35], [160, 70, 40], [110, 40, 28], [180, 90, 50],
      [95, 35, 25], [150, 80, 45], [200, 120, 70], [80, 25, 18]
    ];

    btns.forEach(function (btn, idx) {
      var spark = document.createElement("canvas");
      spark.className = "hbtn__spark";
      spark.setAttribute("aria-hidden", "true");
      btn.appendChild(spark);
      var ctx = spark.getContext("2d");
      var parts = [];
      var raf = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var idleOn = true;

      function size() {
        var r = btn.getBoundingClientRect();
        var w = r.width + 16;
        var h = r.height + 28;
        spark.width = Math.max(1, Math.floor(w * dpr));
        spark.height = Math.max(1, Math.floor(h * dpr));
        spark.style.width = w + "px";
        spark.style.height = h + "px";
      }

      function spawn(n, burst, fromEdge) {
        var w = spark.width / dpr;
        var h = spark.height / dpr;
        for (var i = 0; i < n; i++) {
          var c = COLORS[(Math.random() * COLORS.length) | 0];
          var x, y, angle, speed;
          if (fromEdge) {
            // spill from bottom rim
            x = 10 + Math.random() * (w - 20);
            y = h * 0.62 + Math.random() * 8;
            angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.7;
            speed = 0.35 + Math.random() * 1.4;
          } else if (burst) {
            x = w * 0.5 + (Math.random() - 0.5) * w * 0.7;
            y = h * 0.45 + (Math.random() - 0.5) * h * 0.3;
            angle = Math.random() * Math.PI * 2;
            speed = 1.5 + Math.random() * 3.2;
          } else {
            x = 8 + Math.random() * (w - 16);
            y = 10 + Math.random() * (h * 0.55);
            angle = -Math.PI * 0.2 - Math.random() * Math.PI * 0.6;
            speed = 0.5 + Math.random() * 2;
          }
          parts.push({
            x: x * dpr,
            y: y * dpr,
            vx: Math.cos(angle) * speed * dpr,
            vy: Math.sin(angle) * speed * dpr - (burst ? 1.2 : 0.2) * dpr,
            r: (0.8 + Math.random() * 2.4) * dpr,
            life: 1,
            decay: 0.012 + Math.random() * 0.02,
            color: c
          });
        }
        if (parts.length > 180) parts.splice(0, parts.length - 180);
      }

      function tick() {
        raf = 0;
        ctx.clearRect(0, 0, spark.width, spark.height);
        var g = 0.05 * dpr;
        for (var i = parts.length - 1; i >= 0; i--) {
          var p = parts[i];
          p.vy += g;
          p.vx *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0) {
            parts.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.fillStyle =
            "rgba(" + p.color[0] + "," + p.color[1] + "," + p.color[2] + "," + Math.max(0, p.life) + ")";
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (parts.length || idleOn) raf = requestAnimationFrame(tick);
      }

      function ensure() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      size();
      window.addEventListener("resize", size);

      btn.addEventListener("pointerenter", function () {
        spawn(18, false, false);
        spawn(10, false, true);
        ensure();
        if (typeof gsap !== "undefined") {
          gsap.to(btn, { scale: 1.04, duration: 0.28, ease: "back.out(2)", overwrite: "auto" });
        }
      });
      btn.addEventListener("pointermove", function () {
        if (Math.random() > 0.55) spawn(3, false, false);
        ensure();
      });
      btn.addEventListener("pointerleave", function () {
        if (typeof gsap !== "undefined") {
          gsap.to(btn, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
        }
      });
      btn.addEventListener(
        "pointerdown",
        function () {
          spawn(36, true, false);
          spawn(14, false, true);
          ensure();
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              btn,
              { scale: 1.04 },
              { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut", overwrite: "auto" }
            );
          }
        },
        { passive: true }
      );

      // Idle: tiny grain fall from rim, staggered per button
      setInterval(function () {
        if (document.hidden) return;
        spawn(2 + (idx % 2), false, true);
        ensure();
      }, 1100 + idx * 280);

      // Intro burst so Edu sees it
      setTimeout(function () {
        spawn(16, false, true);
        ensure();
      }, 900 + idx * 200);
    });
  }
  initSeasonButtons();

})();
