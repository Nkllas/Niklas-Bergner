// Bewegung auf der Seite: weiches Scrollen (Lenis) und Animationen (GSAP + ScrollTrigger + SplitText).
// Alle Inhalte sind auch ohne dieses Skript sichtbar; wer im Betriebssystem
// "Bewegung reduzieren" eingestellt hat, bekommt eine ruhige Seite ohne Effekte.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('nav');
  const isHome = document.body.classList.contains('page-home');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_H = 68;

  // ---------- Header: über dem Hero transparent, beim Runterscrollen ausblenden ----------
  let lastY = window.scrollY;
  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle('is-solid', y > 40);
    const menuOpen = nav && nav.classList.contains('open');
    const goingDown = y > lastY + 2;
    const goingUp = y < lastY - 2;
    if (goingDown && y > window.innerHeight * 0.6 && !menuOpen) header.classList.add('is-hidden');
    else if (goingUp || y < 80) header.classList.remove('is-hidden');
    lastY = y;
  }
  updateHeader(window.scrollY);

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
    return;
  }
  window.__motionReady = true;

  const hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);

  // ---------- Lenis: weiches Scrollen, synchron mit ScrollTrigger ----------
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.lenis = lenis;
    lenis.on('scroll', (e) => { ScrollTrigger.update(); updateHeader(e.scroll); });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
  }

  // Sprungmarken (#profil, #top …) weich anscrollen
  const samePage = (url) => url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.hasAttribute('data-open-contact') || !lenis) return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (!samePage(url) || !url.hash || url.hash === '#') return;
    const target = url.hash === '#top' ? 0 : document.querySelector(url.hash);
    if (target === null) return;
    e.preventDefault();
    header && header.classList.remove('is-hidden');
    lenis.scrollTo(target, { offset: url.hash === '#top' ? 0 : -HEADER_H, duration: 1.4 });
  });

  // Schrift abwarten, damit SplitText die richtigen Zeilen misst (höchstens 1,2 s)
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1200)),
  ]);

  fontsReady.then(() => {
    intro();
    scrollAnimations();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });

  // ---------- Einstieg beim Laden ----------
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (header) {
      tl.fromTo(header, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: .9, clearProps: 'transform' }, 0.2);
    }

    // Seitentitel der Unterseite
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && hasSplit) {
      const split = SplitText.create(pageTitle, { type: 'words,chars', mask: 'chars' });
      tl.from(split.chars, { yPercent: 110, duration: 1, stagger: .03 }, 0.1);
    }

    if (!isHome) return;

    // Name Buchstabe für Buchstabe
    const name = document.querySelector('.hero-name');
    gsap.set(name, { autoAlpha: 1 });
    if (hasSplit) {
      const split = SplitText.create('.hero-line', { type: 'words,chars', mask: 'chars' });
      tl.from(split.chars, { yPercent: 115, duration: 1.2, stagger: .04 }, 0.15);
    }
    tl.fromTo('[data-hero]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .09 }, 0.55);

    // Taktiktafel: Linien zeichnen sich, dann stellen sich die Spieler auf
    const lines = gsap.utils.toArray('.pitch-lines > *');
    lines.forEach((el) => {
      const len = el.getTotalLength ? el.getTotalLength() : 800;
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to(lines, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: .06 }, 0.3)
      .from('.pitch-spots circle', { scale: 0, transformOrigin: '50% 50%', duration: .4, stagger: .05 }, 1.2)
      .fromTo('.players circle', { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)', stagger: { each: .05, from: 'end' } }, 1.3)
      .fromTo('.me', { opacity: 0, scale: .3, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: .9, ease: 'elastic.out(1, .5)' }, 1.9)
      .fromTo('.board-caption', { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: .9 }, 2.0)
      .from('.scroll-cue', { autoAlpha: 0, duration: .8 }, 2.2);
  }

  // ---------- Animationen beim Scrollen ----------
  function scrollAnimations() {
    if (isHome) {
      // Hero bewegt sich beim Wegscrollen in die Tiefe
      const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-inner', { yPercent: -14, ease: 'none', scrollTrigger: heroST });
      gsap.to('.board', { yPercent: 16, rotate: -5, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero-glow', { opacity: .25, scale: 1.15, ease: 'none', scrollTrigger: heroST });
      gsap.to('.scroll-cue', { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true } });
    }

    tickerLoop();

    // Überschriften: Zeilen steigen aus einer Maske auf
    if (hasSplit) {
      document.querySelectorAll('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }),
        });
      });
    }

    // Texte sanft einblenden
    gsap.utils.toArray('[data-fade]').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: 28, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Gruppen (Fakten, Kennzahlen, Karten) gestaffelt
    gsap.utils.toArray('[data-stagger]').forEach((group) => {
      gsap.from(group.children, {
        autoAlpha: 0, y: 40, duration: .9, ease: 'power3.out', stagger: .08,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });

    // Kennzahlen zählen hoch
    gsap.utils.toArray('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const n = { v: 0 };
      el.textContent = '0' + suffix;
      gsap.to(n, {
        v: target, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { el.textContent = Math.round(n.v) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // Tabellenzeilen laufen von links ein
    gsap.utils.toArray('[data-rows]').forEach((wrap) => {
      gsap.from(wrap.querySelectorAll('tbody tr, tfoot tr'), {
        autoAlpha: 0, x: -24, duration: .7, ease: 'power3.out', stagger: .05,
        scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
      });
    });

    // Zeitstrahl füllt sich mit dem Scrollen, erreichte Stationen leuchten auf
    const timeline = document.querySelector('.timeline');
    if (timeline) {
      gsap.fromTo('.timeline-progress span', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: timeline, start: 'top 62%', end: 'bottom 62%', scrub: .6 },
      });
      timeline.querySelectorAll('li:not(.timeline-progress)').forEach((li) => {
        ScrollTrigger.create({
          trigger: li, start: 'top 64%',
          onEnter: () => li.classList.add('is-reached'),
          onLeaveBack: () => li.classList.remove('is-reached'),
        });
        gsap.from(li.children, {
          x: -18, duration: .8, ease: 'power3.out', stagger: .05,
          scrollTrigger: { trigger: li, start: 'top 80%', once: true },
        });
      });
    }

    // Galerie: Bilder öffnen sich von unten und bewegen sich leicht in der Tiefe
    gsap.utils.toArray('.gallery figure').forEach((fig, i) => {
      gsap.from(fig, {
        clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', delay: (i % 2) * .12,
        scrollTrigger: { trigger: fig, start: 'top 90%', once: true },
      });
      const img = fig.querySelector('img');
      if (img) {
        gsap.fromTo(img, { yPercent: -7 }, {
          yPercent: 7, ease: 'none',
          scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    });
  }

  // ---------- Laufband: läuft immer, wird beim Scrollen schneller und dreht mit der Richtung ----------
  function tickerLoop() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;
    const copies = 4;
    let loop = track.scrollWidth / copies;
    let x = 0, dir = 1, speed = 1;
    window.addEventListener('resize', () => { loop = track.scrollWidth / copies; });
    const wrap = (v) => gsap.utils.wrap(-loop, 0, v);
    gsap.ticker.add((time, delta) => {
      const v = lenis ? lenis.velocity : 0;
      if (lenis && lenis.direction) dir = lenis.direction;
      const targetSpeed = 1 + Math.min(Math.abs(v) * .35, 9);
      speed += (targetSpeed - speed) * .08;
      x = wrap(x - 55 * speed * dir * (delta / 1000));
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  }
})();
