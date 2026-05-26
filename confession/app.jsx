/* CODEX // 忏悔录 — app shell */

const { useState, useEffect, useCallback } = React;

function App() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace(/^#/, "");
    return h || "/";
  });

  useEffect(() => {
    const on = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const go = useCallback((path) => {
    window.location.hash = path;
  }, []);

  // /entry/:id pattern
  const m = route.match(/^\/entry\/(.+)$/);
  if (m) {
    const id = decodeURIComponent(m[1]);
    const entry = CONFESSIONS.find(c => c.id === id);
    if (entry) {
      return (
        <>
          <ScrollCrack />
          <StatusCorner />
          <Detail entry={entry} onBack={() => go("/")} />
        </>
      );
    }
  }

  return (
    <>
      <ScrollCrack />
      <StatusCorner />
      <div className="shell">
        <Hero />
        <Wall onOpen={(id) => go(`/entry/${encodeURIComponent(id)}`)} />
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
