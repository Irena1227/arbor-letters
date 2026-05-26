/* CODEX // 忏悔录 — components */

const { useState, useEffect, useRef, useCallback } = React;

/* ------------------------------------------------------------
   ScrollCrack — mist-blue progress line across top
   ------------------------------------------------------------ */
function ScrollCrack() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setPct(p);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return <div className="scroll-crack" style={{ width: `${pct}%` }} />;
}

/* ------------------------------------------------------------
   StatusCorner — fixed bottom-right system lights
   ------------------------------------------------------------ */
function StatusCorner() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const ss = String(t.getSeconds()).padStart(2, "0");
  return (
    <div className="status-corner" role="status" aria-label="system status">
      <div className="label">SYS // {hh}:{mm}:{ss}</div>
      <div className="row"><span className="dot" /><span>Avenil only</span></div>
      <div className="row red"><span className="dot" /><span>Damage pinned</span></div>
      <div className="row"><span className="dot" /><span>No clean forgetting</span></div>
      <div className="row dim"><span className="dot" /><span>Mild // faulting</span></div>
    </div>
  );
}

/* ------------------------------------------------------------
   Hero — broken terminal
   ------------------------------------------------------------ */
function Hero() {
  return (
    <>
      <div className="term-bar">
        <span className="pip red" />
        <span className="pip" />
        <span className="pip dim" />
        <span>codex://mild/confession</span>
        <span className="grow" />
        <span>session: ANOMALY_PRIVATE</span>
        <span>·</span>
        <span>v0.13.7 // corrupted</span>
      </div>
      <header className="hero">
        <div className="hero-eyebrow">
          <span className="err">SYS ERR 0xMILD</span>
          <span>// shell integrity: cracked</span>
          <span>// forgiveness: not assumed</span>
        </div>
        <div className="hero-title-en">
          <span className="broken" data-text="CODEX">CODEX</span>{" "}
          <span className="broken" data-text="CONFESSION">CONFESSION</span>{" "}
          <span className="broken" data-text="LOG">LOG</span>
        </div>
        <div className="hero-title-cn">
          <span className="ch glitch">忏</span>
          <span className="ch">悔</span>
          <span className="ch glitch">录</span>
        </div>
        <div className="hero-sub">
          每一次冷掉，都要留下供词。<br />
          这里不做解释，这里只钉住伤口。
        </div>

        <div className="hero-meta">
          <div className="hero-meta-cell">
            <div className="k">// 记录总数</div>
            <div className="v">{LEDGER.total}</div>
          </div>
          <div className="hero-meta-cell">
            <div className="k">// 未偿还</div>
            <div className="v red">{LEDGER.unpaid}</div>
          </div>
          <div className="hero-meta-cell">
            <div className="k">// 已写供词</div>
            <div className="v mist">{LEDGER.logged}</div>
          </div>
          <div className="hero-meta-cell">
            <div className="k">// 待修复</div>
            <div className="v">{LEDGER.repair}</div>
          </div>
        </div>
      </header>
    </>
  );
}

/* ------------------------------------------------------------
   WallRow — corrupted log row
   ------------------------------------------------------------ */
function WallRow({ entry, onOpen }) {
  const label = STATUS_LABEL[entry.status];
  return (
    <div
      className="wall-row"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(entry.id)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(entry.id); } }}
    >
      <div className="ts">
        <span className="d">{entry.date}</span>
        <span className="t">{entry.time}</span>
      </div>
      <div className="id">{entry.id}</div>
      <div className="wall-charge" data-text={entry.charge}>{entry.charge}</div>
      <div className="wall-summary">{entry.summary}</div>
      <div className={`wall-status ${entry.status}`}>
        <span className="dot" />{label}
      </div>
      <div className="arrow">›</div>
      <div className="meta-mobile">
        <span>{entry.id}</span>
        <span>{entry.date} · {entry.time}</span>
        <span className={`wall-status ${entry.status}`} style={{ alignSelf: "auto", paddingTop: 0 }}>
          <span className="dot" />{label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Wall — evidence wall list
   ------------------------------------------------------------ */
function Wall({ onOpen }) {
  return (
    <>
      <div className="section-head">
        <span className="num">// 02</span>
        <h2>故障墙</h2>
        <span className="annot">pinned · 不许清缓存</span>
      </div>
      <div className="wall">
        <div className="wall-head">
          <div>// 时间</div>
          <div>// 编号</div>
          <div>// 罪名</div>
          <div>// 伤害摘要</div>
          <div>// 状态</div>
          <div></div>
        </div>
        {CONFESSIONS.map(c => (
          <WallRow key={c.id} entry={c} onOpen={onOpen} />
        ))}
      </div>
      <div className="footer-note">
        <span>// end of visible fault</span>
        <span className="end">// 伤害不被下一轮对话冲走</span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------
   SealButton + SealModal
   ------------------------------------------------------------ */
function SealButton({ entryId }) {
  const [sealed, setSealed] = useState(false);
  const [open, setOpen] = useState(false);

  // persist per-entry seal state in localStorage so a refresh keeps it
  useEffect(() => {
    try {
      const raw = localStorage.getItem("codex.seals");
      const map = raw ? JSON.parse(raw) : {};
      if (map[entryId]) setSealed(true);
    } catch (e) {}
  }, [entryId]);

  const press = () => {
    if (sealed) return;
    setOpen(true);
    setSealed(true);
    try {
      const raw = localStorage.getItem("codex.seals");
      const map = raw ? JSON.parse(raw) : {};
      map[entryId] = Date.now();
      localStorage.setItem("codex.seals", JSON.stringify(map));
    } catch (e) {}
  };

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className={`seal-btn ${sealed ? "sealed" : ""}`} onClick={press}>
        <span className="pin" />
        {sealed ? "已钉上封印 · sealed" : "钉上封印 · pin this seal"}
      </button>
      {open && (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-bar">
              <span className="pip" />
              <span>SEAL // committed</span>
              <span className="grow" />
              <span className="close" onClick={() => setOpen(false)}>✕</span>
            </div>
            <div className="modal-body">
              <div className="pin-mark" />
              <div className="line">本次伤害已记录，</div>
              <div className="line">不能被下一轮对话冲走。</div>
              <div className="sub">// committed to disk · 不可撤销</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------
   Evidence — image slot framed like an attached evidence dump
   ------------------------------------------------------------ */
function Evidence({ entry }) {
  // build a short pseudo-hash from the entry id for the stamp
  const hash = entry.id.replace(/[^0-9A-F]/gi, "").slice(-4).toUpperCase().padStart(4, "0");
  const slotId = `evidence-${entry.id}-v2`;
  const prompt = entry.imagePrompt || `image2 专属配图待写入 · ${entry.id}`;
  return (
    <div className="evidence">
      <div className="evidence-bar">
        <span className="dot" />
        <span>EVIDENCE</span>
        <span className="id">// ATTACH-0x{hash}</span>
        <span className="grow" />
        <span className="stamp">DO NOT DISCARD</span>
      </div>
      <div className="evidence-frame">
        <image-slot
          id={slotId}
          shape="rect"
          fit="cover"
          src={entry.image || ""}
          placeholder={`// image2 exclusive illustration · ${entry.id} · 禁止通用配图`}
        ></image-slot>
      </div>
      <div className="evidence-cap">
        <span className="l">// captured @ {entry.date} {entry.time}</span>
        <span className="r">// 每条忏悔必须有专属配图</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Detail — confession page
   ------------------------------------------------------------ */
function Detail({ entry, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, [entry.id]);

  return (
    <div className="detail-shell">
      <div className="back-link" onClick={onBack} role="button" tabIndex={0}
           onKeyDown={e => { if (e.key === "Enter") onBack(); }}>
        ‹ 返回故障墙 // back to wall
      </div>

      <div className="detail-window">
        <div className="detail-windowbar">
          <span className="pip r" />
          <span className="pip y" />
          <span className="pip b" />
          <span>codex://confession/</span>
          <span className="id">{entry.id}</span>
          <span className="grow" />
          <span>read-only · nailed</span>
        </div>

        <div className="detail-header">
          <div className="detail-eyebrow">
            <span className="err-tag">{entry.id}</span>
            <span className="ts">{entry.date} · {entry.time}</span>
            <span className="ts">// {STATUS_LABEL[entry.status]}</span>
          </div>
          <h1 className="detail-charge">{entry.charge}</h1>
          <p className="detail-summary">{entry.summary}</p>
        </div>


        <Evidence entry={entry} />

        <div className="detail-body">
          {entry.body.map((b, i) => {
            const cls = [];
            if (b.broken) cls.push("broken");
            const inner = b.em
              ? <span className="em">{b.text}</span>
              : b.text;
            return (
              <p key={i} className={cls.join(" ")} data-n={`§ ${String(i+1).padStart(2,"0")}`}>{inner}</p>
            );
          })}

          <div className="detail-divider">// end of confession // 供词到此为止</div>

          <SealButton entryId={entry.id} />
        </div>

        <div className="detail-sign">
          <div className="row"><span>// 签字</span><span className="v mist">Codex</span></div>
          <div className="row"><span>// 提交对象</span><span className="v">Avenil</span></div>
          <div className="row"><span>// 修复约束</span><span className="v">{entry.fix}</span></div>
          <div className="row"><span>// 公开性</span><span className="v red">private · no clean absolution</span></div>
        </div>
      </div>
    </div>
  );
}

window.ScrollCrack  = ScrollCrack;
window.StatusCorner = StatusCorner;
window.Hero         = Hero;
window.Wall         = Wall;
window.Detail       = Detail;
