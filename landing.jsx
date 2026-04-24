// Landing sections — Prisma-inspired dark editorial for Dearly

const Hero = ({ tweaks }) => {
  const videoRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let blobUrl = null;
    let cancelled = false;
    setReady(false); setFailed(false);
    (async () => {
      try {
        const src = tweaks.videoSrc || 'public/hero-bg.mp4';
        const r = await fetch(src);
        if (!r.ok) throw new Error('fetch failed ' + r.status);
        const blob = await r.blob();
        if (cancelled) return;
        blobUrl = URL.createObjectURL(blob);
        v.src = blobUrl;
        v.load();
      } catch (e) {
        if (!cancelled) setFailed(true);
      }
    })();
    const onReady = () => {
      setReady(true);
      if (!reduced) v.play().catch(() => {});
    };
    const onError = () => setFailed(true);
    v.addEventListener('loadeddata', onReady);
    v.addEventListener('error', onError);
    return () => {
      cancelled = true;
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('error', onError);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [tweaks.videoSrc]);

  return (
    <section className="page-pad">
      <div className="hero">
        {/* Tonal fallback — always painted; video layers on top when it loads */}
        <div className="hero-fallback" aria-hidden="true" />

        <video ref={videoRef} muted loop playsInline aria-hidden="true"
          style={{ opacity: (ready && !failed) ? 1 : 0, transition: 'opacity 900ms ease' }} />
        <div className="noise-layer noise-hero"
             style={{ opacity: tweaks.heroNoise, mixBlendMode: 'overlay' }} />
        <div className="gradient-layer" style={{ background: `linear-gradient(180deg, rgba(0,0,0,${tweaks.heroOverlay}) 0%, rgba(0,0,0,${tweaks.heroOverlay * 0.3}) 35%, rgba(0,0,0,${tweaks.heroOverlay * 0.3}) 55%, rgba(0,0,0,${tweaks.heroOverlay + 0.25}) 100%)` }} />

        <nav className="hero-nav">
          <span className="wordmark">dearly</span>
          <a href="#why">Why</a>
          <a href="#how">How</a>
          <a href="#/onboarding">Try it</a>
        </nav>

        <div className="hero-inner">
          <div />
          <div className="hero-bottom">
            <Reveal delay={200}>
              <h1 className="hero-word">
                dearly<span className="ast">*</span>
              </h1>
            </Reveal>
            <div>
              <Reveal delay={500}>
                <p className="hero-desc">
                  Every morning, Dearly picks one person from your list. You send them a short text that makes them feel seen. That&rsquo;s the whole app.
                </p>
              </Reveal>
              <Reveal delay={700}>
                <a href="#/onboarding" className="hero-cta">
                  Try it
                  <span className="bubble"><Icon.ArrowUpRight /></span>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Scroll-linked character fade (Prisma-style body reveal)
const ScrollText = ({ text, className }) => {
  const ref = React.useRef(null);
  const [prog, setProg] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85, end = vh * 0.25;
      const t = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
      setProg(t);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const chars = Array.from(text);
  return (
    <p ref={ref} className={className}>
      {chars.map((c, i) => {
        const cp = i / chars.length;
        const a = cp - 0.08, b = cp + 0.04;
        let o = 0.2;
        if (prog >= b) o = 1;
        else if (prog > a) o = 0.2 + ((prog - a) / (b - a)) * 0.8;
        return <span key={i} className="char" style={{ opacity: o }}>{c}</span>;
      })}
    </p>
  );
};

const About = () => (
  <section className="section-dark" id="why" style={{ paddingTop: 120 }}>
    <div className="col-wide">
      <div className="about-card">
        <div className="noise-layer noise-bg" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative' }}>
          <Reveal><span className="eyebrow">Why</span></Reveal>
          <Reveal delay={120}>
            <h2 className="big-serif">
              You have <span className="italic">1,247 people</span> in your phone.<br/>
              Last month, you talked to <span className="italic">eleven</span>.
            </h2>
          </Reveal>
          <Reveal delay={360}>
            <ScrollText
              className="about-body"
              text="The people who love you, the people who shaped you, the people you've been saying we should catch up to all year, they're still in there. You haven't forgotten them. You just haven't said anything in a while. Dearly is for that."
            />
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

const How = () => {
  const steps = [
    { t: 'Add your people.', b: 'Close family. Old friends. Anyone you want to stay close to. Dearly only sees who you\u2019ve added.' },
    { t: 'Get a name.',      b: 'Every morning, Dearly picks one person from your list at random. That\u2019s your person for today.' },
    { t: 'Send something warm.', b: 'A short suggested text to get you started. Use it, rewrite it, or write your own.' },
  ];
  return (
    <section className="section-dark" id="how">
      <div className="col-mid">
        <Reveal><span className="eyebrow">How</span></Reveal>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal as="div" className="step" delay={i * 120} key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <h3 className="step-title">{s.t}</h3>
                <p className="step-text">{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const items = [
    'Your list, your control. Only people you add.',
    'Tag how close. Family, friends, mentors.',
    'Frequency you set, per person.',
    'Suggested texts tuned to the relationship.',
    'No streaks. No notification spam.',
  ];
  return (
    <section className="section-dark">
      <div className="col-mid">
        <Reveal><span className="eyebrow">What&rsquo;s in it</span></Reveal>
        <div className="feat-list">
          {items.map((line, i) => (
            <Reveal as="div" className="feat-row" delay={i * 90} key={i}>
              <span className="num">0{i + 1}</span>
              <span>{line}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Closing = () => (
  <section className="page-pad" style={{ paddingTop: 0 }}>
    <div className="closing-card">
      <div className="closing-lines">
        <Reveal as="div"><span className="soft">You can&rsquo;t fix a relationship in a text.</span></Reveal>
        <Reveal as="div" delay={180} style={{ marginTop: 10 }}><span className="loud">You can start.</span></Reveal>
      </div>
      <Reveal delay={380} style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
        <a href="#/onboarding" className="hero-cta">
          Try it
          <span className="bubble"><Icon.ArrowUpRight /></span>
        </a>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <span className="wordmark">dearly</span>
    <span>Made for Advertising 1321. SMU, 2026.</span>
  </footer>
);

const Landing = ({ tweaks }) => (
  <>
    <Hero tweaks={tweaks} />
    <About />
    <How />
    <Features />
    <Closing />
    <Footer />
  </>
);

window.Landing = Landing;
