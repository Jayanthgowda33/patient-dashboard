/** View layer: turns patient data into DOM. Uses textContent to avoid injecting API strings as HTML. */
const View = (() => {
  const $ = (id) => document.getElementById(id);

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthIndex = (name) => MONTHS.findIndex((m) => m.toLowerCase() === String(name).toLowerCase());

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  function avatar(patient, cls) {
    if (patient.profile_picture) {
      const img = el('img', `avatar ${cls}`);
      img.src = patient.profile_picture;
      img.alt = '';
      img.loading = 'lazy';
      return img;
    }
    return el('div', `avatar ${cls}`, initials(patient.name));
  }

  /** Latest-first -> chronological, limited to last N entries. */
  function lastMonths(history, count = 6) {
    return [...history]
      .sort((a, b) => a.year - b.year || monthIndex(a.month) - monthIndex(b.month))
      .slice(-count);
  }

  function renderPatientList(patients, activeName) {
    const list = $('patient-list');
    list.replaceChildren();
    patients.forEach((p) => {
      const li = el('li', 'patients__item' + (p.name === activeName ? ' is-active' : ''));
      li.append(avatar(p, 'avatar--md'));
      const text = el('div', 'patients__text');
      text.append(el('strong', '', p.name), el('span', '', `${p.gender}, ${p.age}`));
      li.append(text, el('span', 'dots', '•••'));
      list.append(li);
    });
    // Scroll the active patient into view within the list only.
    const active = list.querySelector('.is-active');
    if (active) list.scrollTop = active.offsetTop - list.offsetTop - 8;
  }

  function levelClass(levels) {
    const l = String(levels || '').toLowerCase();
    if (l.includes('higher')) return 'up';
    if (l.includes('lower')) return 'down';
    return 'normal';
  }

  function renderBpLegend(latest) {
    const box = $('bp-legend');
    box.replaceChildren();
    const rows = [
      ['Systolic', latest.blood_pressure.systolic, 'dot--systolic'],
      ['Diastolic', latest.blood_pressure.diastolic, 'dot--diastolic']
    ];
    rows.forEach(([label, data, dot], i) => {
      const block = el('div', 'bp-legend__block');
      const title = el('div', 'bp-legend__title');
      title.append(el('span', `dot ${dot}`), el('span', '', label));
      block.append(title, el('div', 'bp-legend__value', String(data.value)));
      const lvl = el('div', `level level--${levelClass(data.levels)}`);
      lvl.append(el('span', 'level__arrow', levelClass(data.levels) === 'up' ? '▲' : levelClass(data.levels) === 'down' ? '▼' : ''), document.createTextNode(data.levels));
      block.append(lvl);
      box.append(block);
      if (i === 0) box.append(el('hr'));
    });
  }

  const VITALS = [
    { key: 'respiratory_rate', label: 'Respiratory Rate', unit: 'bpm', mod: 'resp' },
    { key: 'temperature', label: 'Temperature', unit: '°F', mod: 'temp' },
    { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', mod: 'heart' }
  ];

  function renderVitals(latest) {
    const box = $('vitals');
    box.replaceChildren();
    VITALS.forEach(({ key, label, unit, mod }) => {
      const data = latest[key];
      const card = el('div', `vital vital--${mod}`);
      card.append(el('div', 'vital__icon'));
      card.append(el('div', 'vital__label', label));
      card.append(el('div', 'vital__value', `${data.value} ${unit}`));
      const lvl = el('div', 'vital__level');
      const c = levelClass(data.levels);
      lvl.append(el('span', 'level__arrow', c === 'up' ? '▲' : c === 'down' ? '▼' : ''), document.createTextNode(data.levels));
      card.append(lvl);
      box.append(card);
    });
  }

  function renderDiagnostics(list) {
    const body = $('diagnostic-list');
    body.replaceChildren();
    list.forEach((d) => {
      const tr = el('tr');
      tr.append(el('td', '', d.name), el('td', '', d.description), el('td', '', d.status));
      body.append(tr);
    });
  }

  function formatDob(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function renderProfile(p) {
    const box = $('profile');
    box.replaceChildren();
    const head = el('div', 'profile__head');
    head.append(avatar(p, 'avatar--xl'), el('h2', 'profile__name', p.name));
    box.append(head);

    const rows = [
      ['Date Of Birth', formatDob(p.date_of_birth)],
      ['Gender', p.gender],
      ['Contact Info.', p.phone_number],
      ['Emergency Contacts', p.emergency_contact],
      ['Insurance Provider', p.insurance_type]
    ];
    const dl = el('dl', 'profile__details');
    rows.forEach(([k, v]) => {
      const row = el('div', 'profile__row');
      row.append(el('dt', '', k), el('dd', '', v));
      dl.append(row);
    });
    box.append(dl);

    const btn = el('button', 'btn', 'Show All Information');
    btn.type = 'button';
    box.append(btn);
  }

  function renderLabs(labs) {
    const ul = $('lab-results');
    ul.replaceChildren();
    labs.forEach((name) => {
      const li = el('li', 'labs__item');
      li.append(el('span', '', name), el('span', 'labs__dl', '⤓'));
      ul.append(li);
    });
  }

  function setStatus(message, isError = false) {
    const node = $('status');
    node.textContent = message;
    node.hidden = !message;
    node.classList.toggle('status--error', isError);
  }

  return { lastMonths, renderPatientList, renderBpLegend, renderVitals, renderDiagnostics, renderProfile, renderLabs, setStatus };
})();
