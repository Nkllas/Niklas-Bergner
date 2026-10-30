// Spielszenen-Daten.
// Videos legen: videos/<id>/<dateiname> – die Dateinamen stehen bei jeder Szene.
// Jede Szene: ['Titel auf der Website', 'dateiname.mp4']
const MATCHES = [
  { id: '2025-11-30-germania-nuernberg-1fc-herzogenaurach', date: "2025-11-30", title: 'Germania Nürnberg – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Balleroberung", '01-balleroberung.mp4'],
      ["Zweikampf", '02-zweikampf.mp4'],
      ["Ball im Mittelfeld", '03-ball-im-mittelfeld.mp4'],
      ["Steilpass", '04-steilpass.mp4'],
      ["Steckpass", '05-steckpass.mp4'],
      ["Pass auf Stürmer", '06-pass-auf-stuermer.mp4'],
      ["Ball auf Stürmer", '07-ball-auf-stuermer.mp4'],
      ["Ball über die Kette", '08-ball-ueber-die-kette.mp4'],
      ["Angriff", '09-angriff.mp4'],
      ["Flanke", '10-flanke.mp4'],
      ["Flanke II", '11-flanke-ii.mp4'],
      ["Freistoßflanke", '12-freistossflanke.mp4'],
      ["Tor", '13-tor.mp4']
    ] },
  { id: '2025-11-16-1fc-herzogenaurach-sv-tennenlohe', date: "2025-11-16", title: '1. FC Herzogenaurach – SV Tennenlohe', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Pass", '01-pass.mp4'],
      ["Doppelpass", '02-doppelpass.mp4'],
      ["Dribbling", '03-dribbling.mp4'],
      ["Dribbling II", '04-dribbling-ii.mp4'],
      ["Freistoßflanke", '05-freistossflanke.mp4'],
      ["Freistoßflanke II", '06-freistossflanke-ii.mp4']
    ] },
  { id: '2025-11-08-asv-zirndorf-1fc-herzogenaurach', date: "2025-11-08", title: 'ASV Zirndorf – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Annahme und Eröffnung", '01-annahme-und-eroeffnung.mp4'],
      ["Pass", '02-pass.mp4'],
      ["Balleroberung", '03-balleroberung.mp4'],
      ["Zweikampf", '04-zweikampf.mp4'],
      ["Mittelfeldaktion", '05-mittelfeldaktion.mp4'],
      ["Dribbling", '06-dribbling.mp4'],
      ["Dribbling II", '07-dribbling-ii.mp4']
    ] },
  { id: '2025-11-02-1fc-herzogenaurach-sgv-nuernberg-fuerth-1883', date: "2025-11-02", title: '1. FC Herzogenaurach – SGV Nürnberg-Fürth 1883', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Dribbling und Steckball", '01-dribbling-und-steckball.mp4'],
      ["Steckball auf Stürmer", '02-steckball-auf-stuermer.mp4']
    ] },
  { id: '2025-10-19-1fc-herzogenaurach-spvgg-erlangen', date: "2025-10-19", title: '1. FC Herzogenaurach – SpVgg Erlangen', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Steckball", '01-steckball.mp4'],
      ["Langer Ball auf Stürmer", '02-langer-ball-auf-stuermer.mp4']
    ] },
  { id: '2025-10-12-1fc-herzogenaurach-asv-vach', date: "2025-10-12", title: '1. FC Herzogenaurach – ASV Vach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Dribbling", '01-dribbling.mp4'],
      ["Weiterleiten mit der Hacke", '03-weiterleiten-mit-der-hacke.mp4'],
      ["Distanzschuss", '04-distanzschuss.mp4']
    ] },
  { id: '2025-10-05-1fc-herzogenaurach-laufer-sv', date: "2025-10-05", title: '1. FC Herzogenaurach – Laufer SV', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Tor nach Einwurf", '01-tor-nach-einwurf.mp4'],
      ["Tor nach gutem Pass", '02-tor-nach-gutem-pass.mp4']
    ] },
  { id: '2025-09-28-djk-oesdorf-1fc-herzogenaurach', date: "2025-09-28", title: 'DJK Oesdorf – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Erster Kontakt", '01-erster-kontakt.mp4'],
      ["Spieleröffnung", '02-spieleroeffnung.mp4'],
      ["Doppelpass", '03-doppelpass.mp4'],
      ["Kleines Dribbling", '04-kleines-dribbling.mp4'],
      ["Konter", '05-konter.mp4'],
      ["Flanke", '06-flanke.mp4'],
      ["Schuss geblockt", '07-schuss-geblockt.mp4']
    ] },
  { id: '2025-08-10-sv-tennenlohe-1fc-herzogenaurach', date: "2025-08-10", title: 'SV Tennenlohe – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Gute Bewegung", '01-gute-bewegung.mp4']
    ] },
  { id: '2025-07-17-spvgg-erlangen-1fc-herzogenaurach', date: "2025-07-17", title: 'SpVgg Erlangen – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Torschuss mit links", '01-torschuss-mit-links.mp4'],
      ["Tor von außerhalb", '02-tor-von-ausserhalb.mp4'],
      ["Pass auf Najim", '03-pass-auf-najim.mp4']
    ] },
  { id: '2025-05-11-sc-huettenbach-1fc-herzogenaurach', date: "2025-05-11", title: 'SC Hüttenbach – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Dribbling im Mittelfeld", '01-dribbling-im-mittelfeld.mp4'],
      ["1 gegen 1 hinten", '02-1-gegen-1-hinten.mp4']
    ] },
  { id: '2025-03-16-sc-kalchreuth-1fc-herzogenaurach', date: "2025-03-16", title: 'SC Kalchreuth – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Dribbling und guter Pass", '01-dribbling-und-guter-pass.mp4'],
      ["Dribbling im 16er und Vorlage zum Torschuss", '02-dribbling-im-16er-und-vorlage-zum-torschuss.mp4'],
      ["Torschuss", '03-torschuss.mp4']
    ] },
  { id: '2024-08-04-tsv-wendelstein-1fc-herzogenaurach', date: "2024-08-04", title: 'TSV Wendelstein – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Steckpass in den Lauf", '01-steckpass-in-den-lauf.mp4'],
      ["Steckpass in den Lauf II", '02-steckpass-in-den-lauf-ii.mp4'],
      ["Balleroberung und guter Pass", '03-balleroberung-und-guter-pass.mp4'],
      ["Diagonalball", '04-diagonalball.mp4'],
      ["Kleines Dribbling und Pass", '05-kleines-dribbling-und-pass.mp4'],
      ["Dribbling", '06-dribbling.mp4'],
      ["Aufgedreht, Dribbling, Flanke", '07-aufgedreht-dribbling-flanke.mp4'],
      ["Heber hinter die Innenverteidigung", '08-heber-hinter-die-innenverteidigung.mp4']
    ] },
  { id: '2024-07-28-spvgg-erlangen-1fc-herzogenaurach', date: "2024-07-28", title: 'SpVgg Erlangen – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Gute Bewegung", '01-gute-bewegung.mp4'],
      ["Kurzer Antritt und Balleroberung", '02-kurzer-antritt-und-balleroberung.mp4'],
      ["Dribbling und Pass", '03-dribbling-und-pass.mp4'],
      ["Dribbling und guter Pass", '04-dribbling-und-guter-pass.mp4'],
      ["Kurzer Chip am Gegner vorbei", '05-kurzer-chip-am-gegner-vorbei.mp4'],
      ["Angriffsaktion mit Kevin", '06-angriffsaktion-mit-kevin.mp4']
    ] },
  { id: '2024-07-20-sv-hersbruck-1fc-herzogenaurach', date: "2024-07-20", title: 'SV Hersbruck – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Press-Dribbling im Mittelfeld", '01-press-dribbling-im-mittelfeld.mp4'],
      ["Dribbling", '02-dribbling.mp4'],
      ["Langer Diagonalball", '03-langer-diagonalball.mp4'],
      ["Kombination und Steckpass zum Tor", '04-kombination-und-steckpass-zum-tor.mp4'],
      ["Langes Solo und Tor", '05-langes-solo-und-tor.mp4']
    ] },
  { id: '2024-05-18-fc-vorwaerts-roeslau-1fc-herzogenaurach', date: "2024-05-18", title: 'FC Vorwärts Röslau – 1. FC Herzogenaurach', league: 'Landesliga Bayern Nordost',
    scenes: [
      ["Press-Dribbling im Mittelfeld", '01-press-dribbling-im-mittelfeld.mp4'],
      ["Dribbling durchs Mittelfeld und guter Pass", '02-dribbling-durchs-mittelfeld-und-guter-pass.mp4'],
      ["Doppelpass mit Denk", '03-doppelpass-mit-denk.mp4'],
      ["Solo, Doppelpass, Tor", '04-solo-doppelpass-tor.mp4']
    ] },
  { id: '2024-05-15-moegeldorf-1fc-herzogenaurach', date: "2024-05-15", title: 'Mögeldorf – 1. FC Herzogenaurach', league: 'Bezirksliga Mittelfr. Nord',
    scenes: [
      ["Starkes Solo", '01-starkes-solo.mp4']
    ] },
  { id: 'ohne-datum-1fc-herzogenaurach-tsv-buch', date: null, title: '1. FC Herzogenaurach – TSV Buch', league: 'Testspiel', note: 'Gegner aus der Landesliga',
    scenes: [
      ["Ballannahme", '01-ballannahme.mp4'],
      ["Press lösen", '02-press-loesen.mp4'],
      ["Press gelöst", '03-press-geloest.mp4'],
      ["Mittelfeld gedreht", '04-mittelfeld-gedreht.mp4'],
      ["Mittelfeldaktion", '05-mittelfeldaktion.mp4'],
      ["Doppelpass", '06-doppelpass.mp4'],
      ["Verlagerung", '07-verlagerung.mp4'],
      ["Angriff", '08-angriff.mp4'],
      ["Angriff II", '09-angriff-ii.mp4']
    ] },
  { id: 'ohne-datum-viktoria-erlangen-1fc-herzogenaurach', date: null, title: 'Viktoria Erlangen – 1. FC Herzogenaurach', league: 'Pokalspiel',
    scenes: [
      ["Guter Pass", '01-guter-pass.mp4'],
      ["Seitenverlagerung", '02-seitenverlagerung.mp4'],
      ["Steckbälle", '03-steckbaelle.mp4'],
      ["Sololauf", '04-sololauf.mp4'],
      ["Angriff", '05-angriff.mp4'],
      ["Tor", '06-tor.mp4']
    ] }
];
// Eigene Vereine stehen im Filter oben, abgesetzt von den Gegnern
const MY_CLUBS = ['1. FC Herzogenaurach', 'ASV Weisendorf'];
const LEAGUES = ['Landesliga Bayern Nordost', 'Bezirksliga Mittelfr. Nord', 'Pokalspiel', 'Testspiel'];
const teams = (m) => m.title.split(' – ');

const list = document.getElementById('matches');
const empty = document.getElementById('empty');
const teamSel = document.getElementById('filter-team');
const leagueSel = document.getElementById('filter-league');
const summary = document.getElementById('summary');

const fmt = (iso) => iso ? iso.split('-').reverse().join('.') : 'Datum unbekannt';
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// Zusammenfassung
const totalScenes = MATCHES.reduce((s, m) => s + m.scenes.length, 0);
summary.textContent = `${MATCHES.length} Spiele · ${totalScenes} Videos`;

// Filter-Optionen
function addGroup(select, label, values) {
  const group = document.createElement('optgroup');
  group.label = label;
  values.forEach((v) => group.appendChild(new Option(v, v)));
  select.appendChild(group);
}
const opponents = [...new Set(MATCHES.flatMap(teams))]
  .filter((t) => !MY_CLUBS.includes(t))
  .sort((a, b) => a.localeCompare(b, 'de'));
addGroup(teamSel, 'Meine Vereine', MY_CLUBS);
addGroup(teamSel, 'Gegner', opponents);
const usedLeagues = new Set(MATCHES.map((m) => m.league));
LEAGUES.filter((l) => usedLeagues.has(l)).forEach((l) => leagueSel.add(new Option(l, l)));

function render() {
  const team = teamSel.value;
  const league = leagueSel.value;
  const shown = MATCHES.filter((m) => (!team || teams(m).includes(team)) && (!league || m.league === league));

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
        <span class="match-meta">${m.league}${m.note ? ` (${m.note})` : ''} · ${plural(m.scenes.length, 'Szene', 'Szenen')}</span>
        <span class="match-action">Szenen</span>
      </button>
      <div class="scenes" id="${panelId}" hidden style="display: none"></div>`;

    const btn = el.querySelector('.match-toggle');
    const panel = el.querySelector('.scenes');
    let loaded = false;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (!open && !loaded) {
        m.scenes.forEach(([name, file]) => {
          const s = document.createElement('div');
          s.className = 'scene';
          s.innerHTML = `<video controls preload="metadata" src="videos/${m.id}/${file}"></video><span>${name}</span>`;
          panel.appendChild(s);
        });
        loaded = true;
      }
      slide(panel, !open);
    });

    list.appendChild(el);
  });
}

// Sanftes Auf- und Zuklappen der Szenen
function slide(panel, open) {
  const from = panel.hidden ? 0 : panel.getBoundingClientRect().height;
  if (panel._anim) panel._anim.cancel();
  const finish = () => {
    panel.hidden = !open;
    panel.style.display = open ? '' : 'none';
    panel.style.overflow = '';
    panel._anim = null;
  };
  panel.hidden = false;
  panel.style.display = '';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
  const full = panel.scrollHeight;
  const pad = getComputedStyle(panel).paddingBottom;
  const shut = { height: '0px', paddingBottom: '0px', opacity: 0 };
  const shown = { height: full + 'px', paddingBottom: pad, opacity: 1 };
  panel.style.overflow = 'hidden';
  panel._anim = panel.animate(
    open ? [{ ...shut, height: from + 'px' }, shown] : [{ ...shown, height: from + 'px' }, shut],
    { duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)' }
  );
  panel._anim.onfinish = finish;
}

teamSel.addEventListener('change', render);
leagueSel.addEventListener('change', render);
render();
