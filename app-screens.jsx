// App screens — dark editorial

const DEFAULT_CONTACTS = [
  { name: 'Sarah M.', tag: 'Old friend', last: 'last sent 3 days ago' },
  { name: 'Mom', tag: 'Family', last: 'last sent 1 day ago' },
  { name: 'Dad', tag: 'Family', last: 'last sent 8 days ago' },
  { name: 'Alex P.', tag: 'Close friend', last: 'last sent 14 days ago' },
  { name: 'Professor Ruiz', tag: 'Mentor', last: 'last sent 41 days ago' },
  { name: 'Jamie L.', tag: 'Old friend', last: 'never sent yet' },
];

const INITIAL_THREAD = [
  { text: 'Saw a dog today that looked exactly like Murphy. Made me laugh.', stamp: '24 days ago' },
  { text: 'Happy birthday. Hope it\u2019s a good one.', stamp: '11 days ago' },
  { text: 'Thinking about that road trip after junior year. What was the name of the breakfast spot we stopped at the second day?', stamp: '3 days ago' },
];

const TopBar = ({ title, sub, onBack, right }) => (
  <div className="app-top">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
      {onBack && <button className="back" onClick={onBack} aria-label="Back"><Icon.ArrowLeft /></button>}
      <div style={{ minWidth: 0 }}>
        <div className="title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
    </div>
    {right}
  </div>
);

const TodayScreen = ({ navigate }) => {
  const [thread, setThread] = React.useState(INITIAL_THREAD);
  const [draft, setDraft] = React.useState('Been thinking about you. How\u2019s the new job treating you?');
  const taRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const ta = taRef.current; if (!ta) return;
    ta.style.height = '22px';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [draft]);

  React.useEffect(() => {
    const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  const send = () => {
    const t = draft.trim(); if (!t) return;
    setThread(p => [...p, { text: t, stamp: 'just now' }]);
    setDraft('');
    const hist = JSON.parse(localStorage.getItem('dearly.history') || '[]');
    hist.unshift({ who: 'Sarah M.', msg: t, at: Date.now() });
    localStorage.setItem('dearly.history', JSON.stringify(hist));
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <TopBar title="Sarah M." sub="Old friend · 18 days since last" onBack={() => navigate('#/contacts')} />
      <div className="thread" ref={scrollRef}>
        {thread.map((m, i) => (
          <React.Fragment key={i}>
            <div className="bubble">{m.text}</div>
            <div className="bubble-stamp">{m.stamp}</div>
          </React.Fragment>
        ))}
      </div>
      <div className="compose">
        <div className="compose-box">
          <textarea ref={taRef} value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1} placeholder="Write something warm" />
          <button className="send-btn" onClick={send} disabled={!draft.trim()} aria-label="Send"><Icon.ArrowUp /></button>
        </div>
        <div className="hint">edit freely or send as is</div>
      </div>
    </div>
  );
};

const ContactsScreen = ({ navigate, contacts }) => (
  <div className="screen">
    <TopBar title="your people" sub={`${contacts.length} people on your list`}
      onBack={() => navigate('#/today')} right={<button className="cta">Add</button>} />
    <div className="contacts-list">
      {contacts.map((c, i) => (
        <div className="contact-row" key={i}>
          <div>
            <div className="name">{c.name}</div>
            <div className="meta">{c.tag} · {c.last}</div>
          </div>
          <button className="edit">edit</button>
        </div>
      ))}
      <div className="empty-hint">Dearly picks from this list every morning. Add up to twenty people.</div>
    </div>
  </div>
);

const HISTORY_GROUPS = [
  { label: 'APRIL 24', today: true, entries: [
    { who: 'Sarah M.', msg: 'Been thinking about you. How\u2019s the new job treating you?', time: '9:12 AM' },
  ]},
  { label: 'APRIL 23', today: false, entries: [
    { who: 'Mom', msg: 'Just wanted to say I appreciate you. That\u2019s it.', time: '10:04 AM' },
  ]},
  { label: 'APRIL 22', today: false, entries: [
    { who: 'Alex P.', msg: 'Was just remembering our freshman year roommate situation. What a disaster. Hope you\u2019re good.', time: '11:28 AM' },
    { who: 'Professor Ruiz', msg: 'Thinking of you this week. Hope the semester is treating you well.', time: '4:47 PM' },
  ]},
];

const HistoryScreen = ({ navigate }) => {
  const live = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('dearly.history') || '[]'); } catch { return []; }
  }, []);
  const fmt = (t) => { const d = new Date(t); let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM'; h = h%12 || 12; return `${h}:${String(m).padStart(2,'0')} ${ap}`; };
  const extras = live.map(e => ({ who: e.who, msg: e.msg, time: fmt(e.at) }));
  const groups = HISTORY_GROUPS.map((g, i) => i === 0 && extras.length ? { ...g, entries: [...extras, ...g.entries] } : g);

  return (
    <div className="screen">
      <TopBar title="what you've sent" sub={`${43 + live.length} messages over 62 days`} onBack={() => navigate('#/today')} />
      <div className="history">
        {groups.map((g, gi) => (
          <div className="date-group" key={gi}>
            <div className="date-label">{g.label}{g.today && <span className="today-tag">(today)</span>}</div>
            {g.entries.map((e, ei) => (
              <div className="history-entry" key={ei}>
                <div>
                  <div className="who">{e.who}</div>
                  <div className="msg">&ldquo;{e.msg}&rdquo;</div>
                </div>
                <div className="time">{e.time}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const OnboardingScreen = ({ navigate }) => {
  const [rows, setRows] = React.useState([{ name: '', rel: '' }, { name: '', rel: '' }, { name: '', rel: '' }]);
  const ph = ['e.g. Mom', 'e.g. your college roommate', 'e.g. a mentor who shaped you'];
  const update = (i, k, v) => setRows(p => p.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const start = () => {
    const added = rows.filter(r => r.name.trim()).map(r => ({ name: r.name.trim(), tag: r.rel || 'Close friend', last: 'never sent yet' }));
    if (added.length) {
      const existing = JSON.parse(localStorage.getItem('dearly.contacts') || 'null') || [];
      localStorage.setItem('dearly.contacts', JSON.stringify([...added, ...existing]));
    }
    navigate('#/today');
  };

  return (
    <div className="screen">
      <div className="onboard-wrap">
        <Reveal>
          <div className="onboard-welcome">
            <span>Welcome to Dearly.</span>
            <span className="l2">Start by adding three people you want to stay close to.</span>
          </div>
        </Reveal>
        <div className="form">
          {rows.map((r, i) => (
            <Reveal as="div" className="form-row" delay={120 + i*100} key={i}>
              <input type="text" placeholder={ph[i]} value={r.name} onChange={e => update(i, 'name', e.target.value)} />
              <div className="chev">
                <select value={r.rel} onChange={e => update(i, 'rel', e.target.value)} className={r.rel ? 'chosen' : ''}>
                  <option value="">relationship</option>
                  <option value="Family">family</option>
                  <option value="Close friend">close friend</option>
                  <option value="Old friend">old friend</option>
                  <option value="Mentor">mentor</option>
                </select>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}>
          <div className="start-row">
            <button className="btn-cream" onClick={start}>
              Start <span className="bubble"><Icon.ArrowUpRight /></span>
            </button>
            <div className="later">You can always add more later.</div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

const SettingsScreen = ({ navigate }) => {
  const [pt, setPt] = React.useState('8:00 AM');
  const [q, setQ] = React.useState(false);
  return (
    <div className="screen">
      <TopBar title="settings" onBack={() => navigate('#/today')} />
      <div className="settings">
        <div className="setting-row">
          <div><div className="s-label">What time Dearly picks</div><div className="s-desc">When you get a new person each morning.</div></div>
          <select value={pt} onChange={e => setPt(e.target.value)}>
            <option>7:00 AM</option><option>8:00 AM</option><option>9:00 AM</option><option>10:00 AM</option>
          </select>
        </div>
        <div className="setting-row">
          <div><div className="s-label">Quiet weekends</div><div className="s-desc">Skip Saturday and Sunday if you want to rest.</div></div>
          <button className={`toggle ${q ? 'on' : ''}`} onClick={() => setQ(x => !x)} aria-pressed={q} />
        </div>
        <div className="setting-row">
          <div><div className="s-label">Edit your people</div><div className="s-desc">Add, remove, or change tags on your list.</div></div>
          <a href="#/contacts" className="link-slate">open contacts</a>
        </div>
        <div className="setting-row">
          <div><div className="s-label">Reset everything</div><div className="s-desc">Clear all contacts, history, and settings. Can&rsquo;t be undone.</div></div>
          <button className="link-postmark" onClick={() => { localStorage.removeItem('dearly.history'); localStorage.removeItem('dearly.contacts'); alert('Reset.'); }}>reset</button>
        </div>
        <div className="settings-footer">dearly v0.1 · made at SMU.</div>
      </div>
    </div>
  );
};

const TabBar = ({ route, go }) => {
  const tabs = [['Today', '#/today'], ['People', '#/contacts'], ['History', '#/history'], ['Settings', '#/settings']];
  return (
    <nav className="tabbar">
      {tabs.map(([l, h]) => <button key={h} className={route === h ? 'active' : ''} onClick={() => go(h)}>{l}</button>)}
    </nav>
  );
};

const AppShell = ({ route, go }) => {
  const contacts = React.useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dearly.contacts') || 'null');
      if (saved && saved.length) return [...saved, ...DEFAULT_CONTACTS];
    } catch {}
    return DEFAULT_CONTACTS;
  }, [route]);

  if (route === '#/onboarding') {
    return (
      <div className="app-backdrop">
        <div className="device"><OnboardingScreen navigate={go} /></div>
      </div>
    );
  }

  let Screen = TodayScreen;
  if (route === '#/contacts') Screen = ContactsScreen;
  else if (route === '#/history') Screen = HistoryScreen;
  else if (route === '#/settings') Screen = SettingsScreen;

  return (
    <div className="app-backdrop">
      <div className="device">
        <Screen navigate={go} contacts={contacts} />
        <TabBar route={route} go={go} />
      </div>
    </div>
  );
};

window.AppShell = AppShell;
