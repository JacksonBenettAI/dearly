// Dearly — shared helpers + router + entry
const Icon = {
  ArrowUpRight: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="8 7 17 7 17 16"/></svg>),
  ArrowLeft: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  ArrowUp: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>),
};

const Reveal = ({ as = 'div', className = '', delay = 0, children, style, ...rest }) => {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`reveal ${className} ${seen ? 'is-in' : ''}`} style={{ '--rev-delay': `${delay}ms`, ...style }} {...rest}>{children}</Tag>;
};

window.Icon = Icon;
window.Reveal = Reveal;

// ---------- Router ----------
const useHashRoute = () => {
  const [route, setRoute] = React.useState(() => window.location.hash || '#/');
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (href) => { window.location.hash = href.replace(/^#/, ''); };
  return [route, go];
};

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroOverlay": 0.35,
  "heroNoise": 0.55,
  "accent": "#C8433E",
  "videoSrc": "public/hero-bg.mp4"
}/*EDITMODE-END*/;

const App = () => {
  const [route, go] = useHashRoute();
  const [tweaks, setTweak] = useTweaks(DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--postmark', tweaks.accent);
  }, [tweaks.accent]);

  React.useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const isApp = ['#/today', '#/contacts', '#/history', '#/settings', '#/onboarding'].some(p => route.startsWith(p));

  return (
    <>
      <a className="mode-switch" href={isApp ? '#/' : '#/onboarding'}>
        {isApp ? '← Back to site' : 'Open the app →'}
      </a>

      {isApp ? <AppShell route={route} go={go} /> : <Landing tweaks={tweaks} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakText label="Video URL" value={tweaks.videoSrc}
          placeholder="public/hero-bg.mp4"
          onChange={(v) => setTweak('videoSrc', v)} />
        <TweakSlider label="Overlay" value={tweaks.heroOverlay} min={0} max={0.8} step={0.01}
          onChange={(v) => setTweak('heroOverlay', v)} />
        <TweakSlider label="Grain" value={tweaks.heroNoise} min={0} max={1} step={0.01}
          onChange={(v) => setTweak('heroNoise', v)} />
        <TweakSection label="Accent" />
        <TweakRadio value={tweaks.accent}
          options={[
            { value: '#C8433E', label: 'Postmark' },
            { value: '#B64A44', label: 'Soft' },
            { value: '#D15C3A', label: 'Warm' },
          ]}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Jump to" />
        <TweakButton label="Landing" onClick={() => go('#/')} />
        <TweakButton label="Onboarding" onClick={() => go('#/onboarding')} />
        <TweakButton label="Today" onClick={() => go('#/today')} />
        <TweakButton label="Contacts" onClick={() => go('#/contacts')} />
        <TweakButton label="History" onClick={() => go('#/history')} />
        <TweakButton label="Settings" onClick={() => go('#/settings')} />
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
