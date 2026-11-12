// Bewegung auf der Seite: weiches Scrollen (Lenis) und Szenen (GSAP + ScrollTrigger + SplitText).
// Alle Inhalte sind auch ohne dieses Skript sichtbar. Wer im Betriebssystem
// "Bewegung reduzieren" eingestellt hat, bekommt eine ruhige Seite ohne Effekte.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('nav');
  const isHome = document.body.classList.contains('page-home');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_H = 68;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Header: über dem Hero transparent, beim Runterscrollen ausblenden ----------
  let lastY = window.scrollY;
  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle('is-solid', y > 40);
    const menuOpen = nav && nav.classList.contains('open');
    if (y > lastY + 2 && y > window.innerHeight * 0.6 && !menuOpen) header.classList.add('is-hidden');
    else if (y < lastY - 2 || y < 80) header.classList.remove('is-hidden');
    lastY = y;
  }
  updateHeader(window.scrollY);

  // ---------- Hero-Schriftzug an die Bildschirmgröße anpassen (läuft immer) ----------
  const maskSvg = $('.hero-mask');
  const maskText = maskSvg && $('.mask-text', maskSvg);
  function fitMask() {
    if (!maskSvg) return;
    const w = maskSvg.clientWidth, h = maskSvg.clientHeight;
    if (!w || !h) return;
    maskSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    maskSvg.setAttribute('preserveAspectRatio', 'none');
    const ratio = 3.4; // "BERGNER" in Barlow Condensed ist etwa 3,4-mal so breit wie hoch
    let size = Math.min((w * (w < 700 ? 0.92 : 0.86)) / ratio, h * 0.46);
    maskText.setAttribute('x', w / 2);
    maskText.setAttribute('y', h * 0.53);
    maskText.setAttribute('font-size', size);
    maskText.setAttribute('textLength', size * ratio);
  }
  fitMask();
  window.addEventListener('resize', fitMask);

  // Große Schriftzüge so verkleinern, dass sie nie über den Rand laufen
  function fitWidth(els, maxW) {
    els.forEach((el) => { el.style.fontSize = ''; });
    const widest = Math.max(...els.map((el) => el.scrollWidth));
    if (widest > maxW) {
      const base = parseFloat(getComputedStyle(els[0]).fontSize);
      els.forEach((el) => { el.style.fontSize = (base * maxW / widest) + 'px'; });
    }
  }
  const markEl = $('.footer-mark');
  const roleWords = $$('.role-word');
  function fitRoles() {
    const win = $('.roles-window');
    if (win && roleWords.length) fitWidth(roleWords, win.clientWidth * 0.94);
  }
  function fitAll() {
    if (markEl) fitWidth([markEl], window.innerWidth * 0.96);
    fitRoles();
  }
  fitAll();
  window.addEventListener('resize', fitAll);

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
    if (reduce) $$('video').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
    return;
  }
  window.__motionReady = true;

  const hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);

  // ---------- Lenis ----------
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.lenis = lenis;
    lenis.on('scroll', (e) => { ScrollTrigger.update(); updateHeader(e.scroll); });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
  }

  // Sprungmarken weich anscrollen
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
    lenis.scrollTo(target, { offset: url.hash === '#top' ? 0 : -HEADER_H, duration: 1.6 });
  });

  // Videos nur abspielen, wenn sie zu sehen sind
  $$('video').forEach((v) => {
    ScrollTrigger.create({
      trigger: v.closest('section') || v, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => (self.isActive ? v.play().catch(() => {}) : v.pause()),
    });
  });

  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1200)),
  ]);

  fontsReady.then(() => {
    fitMask();
    fitAll();
    scenes();
    return loader();
  }).then(intro).then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ---------- Ladebildschirm (einmal pro Besuch) ----------
  function loader() {
    const el = $('.loader');
    if (!el) return Promise.resolve();
    let seen = false;
    try { seen = sessionStorage.getItem('nb-loaded') === '1'; sessionStorage.setItem('nb-loaded', '1'); } catch (e) {}
    if (seen || window.scrollY > 10) { el.remove(); return Promise.resolve(); }
    return new Promise((resolve) => {
      const count = $('.loader-count', el);
      const n = { v: 0 };
      lenis && lenis.stop();
      gsap.timeline({ onComplete: () => { el.remove(); lenis && lenis.start(); } })
        .to(n, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(2, '0'); } })
        .to('.loader-content', { autoAlpha: 0, y: -24, duration: .45, ease: 'power2.in' }, '+=.1')
        .add(resolve)
        .to('.loader-top', { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '<')
        .to('.loader-bottom', { yPercent: 100, duration: 1.1, ease: 'power4.inOut' }, '<');
    });
  }

  // ---------- Einstieg ----------
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (header) tl.fromTo(header, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: .9, clearProps: 'transform' }, .3);

    const pageTitle = $('.page-title');
    if (pageTitle && hasSplit) {
      const split = SplitText.create(pageTitle, { type: 'words,chars', mask: 'chars' });
      tl.from(split.chars, { yPercent: 110, duration: 1, stagger: .03 }, .1);
    }
    if (!isHome) return;

    tl.from('.hero-video', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.mask-zoom', { scale: .82, svgOrigin: `${maskSvg.clientWidth / 2} ${maskSvg.clientHeight * .53}`, duration: 1.8, ease: 'expo.out' }, 0)
      .fromTo('.hero-top', { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, .2);
    if (hasSplit) {
      const kick = SplitText.create('.hero-kicker', { type: 'words', mask: 'words' });
      const first = SplitText.create('.hero-first', { type: 'chars', mask: 'chars' });
      tl.from(kick.words, { yPercent: 110, duration: .9, stagger: .04 }, .35)
        .from(first.chars, { yPercent: 110, duration: 1.1, stagger: .05 }, .3);
    }
    tl.from('.scroll-cue', { autoAlpha: 0, duration: .8 }, 1);
  }

  // ---------- Szenen beim Scrollen ----------
  function scenes() {
    if (isHome) {
      heroScene();
      statementScene();
      careerScene();
      rolesScene();
      reelScene();
      footerMark();
    }
    tickerLoop();
    reveals();
  }

  // Hero: durch den Buchstaben ins Video fliegen
  function heroScene() {
    const zoom = $('.mask-zoom');
    let origin = '0 0', scaleTo = 60;
    const measure = () => {
      fitMask();
      const w = maskSvg.clientWidth, h = maskSvg.clientHeight;
      try {
        const r = maskText.getExtentOfChar(0); // das "B"
        const x = r.x + r.width * .17, y = r.y + r.height * .5;
        origin = `${x} ${y}`;
        scaleTo = Math.max(w, h) / Math.max(r.width * .2, 4) * 2.2;
      } catch (e) {
        origin = `${w * .1} ${h * .53}`;
      }
    };
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=230%', pin: true, scrub: 1, invalidateOnRefresh: true },
      defaults: { ease: 'none' },
    })
      .to('.scroll-cue', { autoAlpha: 0, duration: .08 }, 0)
      .to('.hero-top', { autoAlpha: 0, y: -50, duration: .2 }, 0)
      .fromTo(zoom, { scale: 1 }, { scale: () => scaleTo, svgOrigin: () => origin, duration: .62, ease: 'power3.in' }, .04)
      .to('.hero-mask', { autoAlpha: 0, duration: .04 }, .62)
      .fromTo('.hero-video', { scale: 1.2 }, { scale: 1, duration: .8 }, 0)
      .fromTo('.hero-info', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .22, ease: 'power2.out' }, .66)
      .to({}, { duration: .14 });
  }

  // Statement: Wörter hellen sich nacheinander auf
  function statementScene() {
    const el = $('[data-words]');
    if (!el || !hasSplit) return;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    gsap.fromTo(split.words, { opacity: .14 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true },
    });
  }

  // Karriere: Stationen laufen seitlich vorbei
  function careerScene() {
    const career = $('.career');
    if (!career) return;
    career.classList.add('is-horizontal');
    const track = $('.career-track', career);
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.timeline({
      scrollTrigger: { trigger: career, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      defaults: { ease: 'none' },
    })
      .to(track, { x: () => -dist() }, 0)
      .to('.career-bar span', { scaleX: 1 }, 0);
    gsap.from($$('.station', career), {
      y: 70, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: .07,
      scrollTrigger: { trigger: career, start: 'top 70%', once: true },
    });
  }

  // Rolle: Wortliste läuft durch, das aktive Wort leuchtet
  function rolesScene() {
    const roles = $('.roles');
    if (!roles) return;
    const items = $$('.roles-list li', roles);
    const list = $('.roles-list', roles);
    const desc = $('.roles-desc', roles);
    const n = items.length;
    roles.classList.add('is-pinned');
    const texts = items.map((li) => {
      const p = document.createElement('p');
      p.textContent = $('p', li).textContent;
      desc.appendChild(p);
      return p;
    });
    gsap.set(texts, { position: 'absolute', top: 0, left: 0, right: 0, autoAlpha: 0 });
    let wordH = 0;
    const measure = () => {
      fitRoles();
      const fs = parseFloat(getComputedStyle($('.role-word', roles)).fontSize);
      wordH = fs * 1.08;
      roles.style.setProperty('--word-h', wordH + 'px');
    };
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    let active = -1;
    const setActive = (i) => {
      if (i === active) return;
      items.forEach((li, k) => li.classList.toggle('is-active', k === i));
      if (active > -1) gsap.to(texts[active], { autoAlpha: 0, y: -16, duration: .35, overwrite: true });
      gsap.fromTo(texts[i], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5, delay: .1, overwrite: true });
      active = i;
    };
    setActive(0);

    gsap.fromTo(list, { y: () => wordH }, {
      y: () => -(n - 2) * wordH, ease: 'none',
      scrollTrigger: {
        trigger: roles, start: 'top top', end: () => '+=' + n * 65 + '%', pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
      },
    });
  }

  // Spielszenen: Fenster wächst zum Vollbild
  function reelScene() {
    const reel = $('.reel');
    if (!reel) return;
    reel.classList.add('is-pinned');
    const startClip = () => (window.innerWidth < 760 ? 'inset(28% 6% 34% 6% round 14px)' : 'inset(16% 22% 22% 22% round 18px)');
    gsap.timeline({
      scrollTrigger: { trigger: reel, start: 'top top', end: '+=170%', pin: true, scrub: 1, invalidateOnRefresh: true },
      defaults: { ease: 'none' },
    })
      .fromTo('.reel-frame', { clipPath: startClip }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
      .fromTo('.reel-video', { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
      .fromTo('.reel-copy > *', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: .08, duration: .35, ease: 'power2.out' }, .62)
      .to({}, { duration: .25 });
  }

  // Großer Schriftzug im Footer steigt beim Ankommen auf
  function footerMark() {
    const mark = $('.footer-mark');
    if (!mark || !hasSplit) return;
    const split = SplitText.create(mark, { type: 'chars', mask: 'chars' });
    gsap.from(split.chars, {
      yPercent: 100, ease: 'none', stagger: .06,
      scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }

  // Überschriften, Texte, Gruppen, Zahlen, Tabelle, Galerie
  function reveals() {
    if (hasSplit) {
      $$('[data-split]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: .1,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }),
        });
      });
    }
    $$('[data-fade]').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: 28, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    $$('[data-stagger]').forEach((group) => {
      gsap.from(group.children, {
        autoAlpha: 0, y: 40, duration: .9, ease: 'power3.out', stagger: .08,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });
    $$('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', n = { v: 0 };
      el.textContent = '0' + suffix;
      gsap.to(n, {
        v: target, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { el.textContent = Math.round(n.v) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    $$('[data-rows]').forEach((wrap) => {
      gsap.from($$('tbody tr, tfoot tr', wrap), {
        autoAlpha: 0, x: -24, duration: .7, ease: 'power3.out', stagger: .05,
        scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
      });
    });
    $$('.gallery figure').forEach((fig, i) => {
      gsap.from(fig, {
        clipPath: 'inset(100% 0% 0% 0% round 14px)', duration: 1.3, ease: 'power4.inOut', delay: (i % 2) * .12,
        scrollTrigger: { trigger: fig, start: 'top 90%', once: true },
      });
      const img = $('img', fig);
      if (img) gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  // Laufband: wird beim Scrollen schneller und dreht mit der Richtung
  function tickerLoop() {
    const track = $('.ticker-track');
    if (!track) return;
    let loop = track.scrollWidth / 4, x = 0, dir = 1, speed = 1;
    window.addEventListener('resize', () => { loop = track.scrollWidth / 4; });
    gsap.ticker.add((time, delta) => {
      const v = lenis ? lenis.velocity : 0;
      if (lenis && lenis.direction) dir = lenis.direction;
      speed += (1 + Math.min(Math.abs(v) * .35, 9) - speed) * .08;
      x = gsap.utils.wrap(-loop, 0, x - 55 * speed * dir * (delta / 1000));
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  }
})();
