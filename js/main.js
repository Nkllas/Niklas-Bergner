// Mobile-Menü
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Alter automatisch aus dem Geburtsdatum berechnen (20.08.2003)
const ageEl = document.getElementById('age');
if (ageEl) {
  const birth = new Date(2003, 7, 20);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hadBirthday) age--;
  ageEl.textContent = age;
}

// ---------- Anfrage-Fenster ----------
// Die Anfragen gehen über Formspree an deine E-Mail-Adresse.
// Hier deine persönliche Formspree-URL eintragen:
const FORMSPREE_URL = 'https://formspree.io/f/xjyyopde';
// Nur für den Notfall-Link, falls das Senden nicht klappt:
const CONTACT_EMAIL = 'niiikkbuild@gmail.com';

const dlg = document.createElement('dialog');
dlg.className = 'contact-dialog';
dlg.setAttribute('aria-labelledby', 'contact-title');
dlg.innerHTML = `
  <div class="dialog-inner">
    <button type="button" class="dialog-close" data-close aria-label="Fenster schließen">&times;</button>
    <div class="dialog-form">
      <h2 id="contact-title">Anfrage senden</h2>
      <p class="lead">Für sportliche Anfragen, Probetrainings oder ein Gespräch. Ich antworte in der Regel innerhalb weniger Tage.</p>
      <form id="contact-form" class="form" novalidate>
        <label>Name
          <input type="text" name="name" required autocomplete="name">
        </label>
        <label>E-Mail
          <input type="email" name="email" required autocomplete="email">
        </label>
        <label>Verein / Organisation (optional)
          <input type="text" name="org" autocomplete="organization">
        </label>
        <label>Nachricht
          <textarea name="message" rows="5" required></textarea>
        </label>
        <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn" type="submit">Anfrage senden</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
    <div class="dialog-done" hidden>
      <h2>Danke für deine Anfrage</h2>
      <p>Sie ist angekommen. Ich melde mich in der Regel innerhalb weniger Tage.</p>
      <button type="button" class="btn" data-close>Schließen</button>
    </div>
  </div>`;
document.body.appendChild(dlg);

const form = dlg.querySelector('#contact-form');
const status = form.querySelector('.form-status');
const submitBtn = form.querySelector('button[type="submit"]');
const formView = dlg.querySelector('.dialog-form');
const doneView = dlg.querySelector('.dialog-done');

function openContact() {
  formView.hidden = false;
  doneView.hidden = true;
  status.textContent = '';
  status.className = 'form-status';
  document.body.classList.add('dialog-open');
  if (nav) nav.classList.remove('open');
  dlg.showModal();
  form.querySelector('input[name="name"]').focus();
}
function closeContact() { dlg.close(); }

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open-contact]');
  if (t) { e.preventDefault(); openContact(); }
});
dlg.addEventListener('click', (e) => {
  if (e.target === dlg || e.target.closest('[data-close]')) closeContact();
});
dlg.addEventListener('close', () => document.body.classList.remove('dialog-open'));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').trim();
  const email = (data.get('email') || '').trim();
  const org = (data.get('org') || '').trim();
  const message = (data.get('message') || '').trim();

  let valid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    const ok = field.value.trim() !== '' && field.checkValidity();
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok) valid = false;
  });
  if (!valid) {
    status.className = 'form-status error';
    status.textContent = 'Bitte fülle Name, eine gültige E-Mail und eine Nachricht aus.';
    return;
  }
  if (data.get('_honey')) return; // Spam-Falle

  submitBtn.disabled = true;
  submitBtn.textContent = 'Wird gesendet …';
  status.className = 'form-status';
  status.textContent = '';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name, email, Verein: org || '–', Nachricht: message,
        _subject: 'Neue Anfrage über die Website von ' + name,
        _replyto: email
      })
    });
    if (!res.ok) throw new Error('send failed');
    form.reset();
    formView.hidden = true;
    doneView.hidden = false;
  } catch (err) {
    const subject = 'Anfrage von ' + name + (org ? ' (' + org + ')' : '');
    const body = message + '\n\nName: ' + name + '\nE-Mail: ' + email + (org ? '\nVerein/Organisation: ' + org : '');
    const href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.className = 'form-status error';
    status.textContent = 'Das Senden hat nicht geklappt. ';
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'Stattdessen per Mailprogramm senden';
    status.appendChild(link);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Anfrage senden';
  }
});

// ---------- Scroll-Animationen ----------
// Elemente mit data-reveal erscheinen beim Hereinscrollen und verschwinden
// wieder, sobald man an ihnen vorbei- bzw. wegscrollt.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('[data-reveal]');

// Zahlen hochzählen
function countTo(el, run) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  cancelAnimationFrame(el._raf);
  if (!run || reduceMotion) { el.textContent = (run ? target : 0) + suffix; return; }
  const start = performance.now(), dur = 1400;
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) el._raf = requestAnimationFrame(tick);
  };
  el._raf = requestAnimationFrame(tick);
}

if (revealEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const inView = entry.isIntersecting;
      entry.target.classList.toggle('in-view', inView);
      entry.target.querySelectorAll('[data-count]').forEach((n) => countTo(n, inView));
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => {
    el.querySelectorAll('[data-count]').forEach((n) => countTo(n, false));
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}
