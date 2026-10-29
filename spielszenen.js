// Spielszenen-Daten.
// Videos legen: videos/<id>/1.mp4, videos/<id>/2.mp4 ... (id = Feld "id" unten)
const MATCHES = [
  { id: '2025-11-30-germania',  date: '2025-11-30', title: '1. FC Herzogenaurach – Germania Nürnberg', league: 'Bezirksliga Mittelfr. Nord', scenes: 10 },
  { id: '2025-11-02-nuernberg-fuerth', date: '2025-11-02', title: '1. FC Herzogenaurach – Nürnberg-Fürth', league: 'Bezirksliga Mittelfr. Nord', scenes: 3 },
  { id: '2025-10-19-erlangen',  date: '2025-10-19', title: '1. FC Herzogenaurach – SpVgg Erlangen', league: 'Bezirksliga Mittelfr. Nord', scenes: 2 },
  { id: '2025-10-12-vach',      date: '2025-10-12', title: '1. FC Herzogenaurach – ASV Vach', league: 'Bezirksliga Mittelfr. Nord', scenes: 3 },
  { id: '2025-10-05-laufer-sv', date: '2025-10-05', title: 'Laufer SV – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord', scenes: 2 },
  { id: '2025-09-28-oesdorf',   date: '2025-09-28', title: '1. FC Herzogenaurach – DJK Oesdorf', league: 'Bezirksliga Mittelfr. Nord', scenes: 7 },
  { id: '2025-07-17-erlangen-test', date: '2025-07-17', title: '1. FC Herzogenaurach – SpVgg Erlangen', league: 'Testspiel', scenes: 3 },
  { id: '2024-07-20-hersbruck', date: '2024-07-20', title: 'Hersbruck – 1. FC Herzogenaurach', league: 'Testspiel', scenes: 5 },
  { id: '2024-05-18-roeslau',   date: '2024-05-18', title: 'Röslau – 1. FC Herzogenaurach', league: 'Landesliga Bayern Nordost', scenes: 4 },
  { id: 'unbekannt-wendelstein', date: null, title: 'Wendelstein – 1. FC Herzogenaurach', league: 'Testspiel', scenes: 1 }
];
const TEAM = 'Herren I'; // Alle Szenen stammen aus dem Herrenbereich

const list = document.getElementById('matches');
const empty = document.getElementById('empty');
const teamSel = document.getElementById('filter-team');
const leagueSel = document.getElementById('filter-league');
const summary = document.getElementById('summary');

const fmt = (iso) => iso ? iso.split('-').reverse().join('.') : 'Datum unbekannt';
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// Zusammenfassung
const totalScenes = MATCHES.reduce((s, m) => s + m.scenes, 0);
summary.textContent = `${MATCHES.length} Spiele · ${totalScenes} Videos`;

// Filter-Optionen
teamSel.add(new Option(TEAM, TEAM));
[...new Set(MATCHES.map((m) => m.league))].forEach((l) => leagueSel.add(new Option(l, l)));

function render() {
  const team = teamSel.value;
  const league = leagueSel.value;
  const shown = MATCHES.filter((m) => (!team || team === TEAM) && (!league || m.league === league));

  list.innerHTML = '';
  empty.hidden = shown.length > 0;

  shown.forEach((m) => {
    const panelId = `scenes-${m.id}`;
    const el = document.createElement('article');
    el.className = 'match';
    el.innerHTML = `
      <button class="match-toggle" aria-expanded="false" aria-controls="${panelId}">
        <span class="match-date">${fmt(m.date)}</span>
        <span class="match-title">${m.title}</span>
        <span class="match-meta">${m.league} · ${plural(m.scenes, 'Szene', 'Szenen')}</span>
        <span class="match-action">Szenen</span>
      </button>
      <div class="scenes" id="${panelId}" hidden></div>`;

    const btn = el.querySelector('.match-toggle');
    const panel = el.querySelector('.scenes');
    let loaded = false;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      if (!open && !loaded) {
        for (let i = 1; i <= m.scenes; i++) {
          const s = document.createElement('div');
          s.className = 'scene';
          s.innerHTML = `<video controls preload="none" src="videos/${m.id}/${i}.mp4"></video><span>Szene ${i}</span>`;
          panel.appendChild(s);
        }
        loaded = true;
      }
    });

    list.appendChild(el);
  });
}

teamSel.addEventListener('change', render);
leagueSel.addEventListener('change', render);
render();
