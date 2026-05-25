import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM — Refined Cinema Dashboard
   Aesthetic: Editorial · Dark accents · Warm orange · Clean
═══════════════════════════════════════════════════════════ */
const G = {
  // Backgrounds
  bg: "#f5f4f1",
  bgCard: "#ffffff",
  bgDark: "#1a1a2e",
  bgDeep: "#0f0f1a",
  // Orange palette
  or1: "#f97316",
  or2: "#ea6c0a",
  or3: "#fff3e8",
  or4: "#fed7aa",
  // Ink
  ink: "#111827",
  ink2: "#374151",
  ink3: "#6b7280",
  ink4: "#9ca3af",
  ink5: "#d1d5db",
  ink6: "#f3f4f6",
  // Status
  green: "#059669",
  greenBg: "#ecfdf5",
  greenBdr: "#a7f3d0",
  amber: "#d97706",
  amberBg: "#fffbeb",
  amberBdr: "#fde68a",
  red: "#dc2626",
  redBg: "#fef2f2",
  redBdr: "#fecaca",
  blue: "#2563eb",
  blueBg: "#eff6ff",
  blueBdr: "#bfdbfe",
  violet: "#7c3aed",
  violetBg: "#f5f3ff",
  violetBdr: "#ddd6fe",
};

/* ── Data ─────────────────────────────────────────────────── */
const MOVIES = [
  { id: 1, title: "Avengers: Infinity War", short: "Avengers", duration: 149, format: "IMAX", age: "T13", status: "Đang chiếu", color: "#dc2626" },
  { id: 2, title: "Spider-Man: No Way Home", short: "Spider-Man", duration: 148, format: "3D", age: "T13", status: "Đang chiếu", color: "#2563eb" },
  { id: 3, title: "Doctor Strange: Multiverse", short: "Dr. Strange", duration: 126, format: "IMAX", age: "T16", status: "Sắp chiếu", color: "#7c3aed" },
  { id: 4, title: "Thor: Love and Thunder", short: "Thor", duration: 119, format: "2D", age: "T13", status: "Ngừng chiếu", color: "#059669" },
  { id: 5, title: "Black Panther: Wakanda Forever", short: "Black Panther", duration: 161, format: "IMAX", age: "T13", status: "Đang chiếu", color: "#d97706" },
];

const CINEMAS = [
  { id: 1, name: "Gấu Phim Hà Nội", city: "HN" },
  { id: 2, name: "Gấu Phim TP.HCM", city: "HCM" },
  { id: 3, name: "Gấu Phim Đà Nẵng", city: "ĐN" },
];

const ROOMS = {
  1: [{ id: 1, name: "Phòng 1 — IMAX", seats: 180, type: "IMAX" }, { id: 2, name: "Phòng 2 — 3D", seats: 120, type: "3D" }, { id: 3, name: "Phòng 3 — 2D", seats: 90, type: "2D" }],
  2: [{ id: 4, name: "Phòng A — IMAX", seats: 200, type: "IMAX" }, { id: 5, name: "Phòng B — 3D", seats: 130, type: "3D" }],
  3: [{ id: 6, name: "Phòng 01 — 2D", seats: 100, type: "2D" }, { id: 7, name: "Phòng 02 — 3D", seats: 110, type: "3D" }],
};

const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DAYS_FULL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const ALL_TIMES = ["08:00","09:30","10:00","11:30","13:00","14:30","16:00","17:30","19:00","20:30","22:00"];

const timeTier = t => { const h = +t.split(":")[0]; return h < 12 ? "sáng" : h < 18 ? "chiều" : "tối"; };
const tierColor = t => ({ sáng: G.amber, chiều: G.or1, tối: G.violet }[timeTier(t)]);
const tierBg = t => ({ sáng: G.amberBg, chiều: G.or3, tối: G.violetBg }[timeTier(t)]);
const tierBdr = t => ({ sáng: G.amberBdr, chiều: G.or4, tối: G.violetBdr }[timeTier(t)]);
const fmt = n => n.toLocaleString("vi-VN") + "đ";
const getMovie = id => MOVIES.find(m => m.id === id);
const getCinema = id => CINEMAS.find(c => c.id === id);
const getRoom = id => { for (const rs of Object.values(ROOMS)) { const r = rs.find(r => r.id === id); if (r) return r; } };

const INIT = [
  { id: 1, movieId: 1, cinemaId: 1, roomId: 1, days: [1,3,5], times: ["10:00","14:30","19:00"], priceBase: 95000, priceWeekend: 110000, startDate: "2026-05-01", endDate: "2026-06-30", status: "Đang hoạt động", notes: "Suất đặc biệt IMAX" },
  { id: 2, movieId: 2, cinemaId: 1, roomId: 2, days: [2,4,6,0], times: ["11:30","16:00","20:30"], priceBase: 80000, priceWeekend: 95000, startDate: "2026-05-10", endDate: "2026-07-10", status: "Đang hoạt động", notes: "" },
  { id: 3, movieId: 5, cinemaId: 2, roomId: 4, days: [0,1,2,3,4,5,6], times: ["09:30","13:00","17:30","22:00"], priceBase: 100000, priceWeekend: 120000, startDate: "2026-05-20", endDate: "2026-08-20", status: "Đang hoạt động", notes: "Chạy full tuần" },
  { id: 4, movieId: 3, cinemaId: 3, roomId: 7, days: [3,6,0], times: ["14:30","19:00"], priceBase: 85000, priceWeekend: 100000, startDate: "2026-06-01", endDate: "2026-07-31", status: "Tạm dừng", notes: "" },
];

/* ── Tiny primitives ──────────────────────────────────────── */
const css = (...args) => Object.assign({}, ...args);

function useHover() {
  const [h, set] = useState(false);
  return [h, { onMouseEnter: () => set(true), onMouseLeave: () => set(false) }];
}

function Pill({ children, color, bg, border, size = "md", dot }) {
  const s = size === "sm" ? { fontSize: 10, px: "7px", py: "3px" } : { fontSize: 11.5, px: "10px", py: "4px" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:`${s.py} ${s.px}`, borderRadius:20, fontSize:s.fontSize, fontWeight:700, color, background:bg, border:`1px solid ${border}`, letterSpacing:0.2, whiteSpace:"nowrap" }}>
      {dot && <span style={{ width:6, height:6, borderRadius:"50%", background:color, animation: dot === "pulse" ? "gpulse 1.8s ease infinite" : "none" }} />}
      {children}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    "Đang hoạt động": { color: G.green, bg: G.greenBg, border: G.greenBdr, dot: "pulse", label: "Đang hoạt động" },
    "Tạm dừng": { color: G.amber, bg: G.amberBg, border: G.amberBdr, dot: "solid", label: "Tạm dừng" },
    "Hết hạn": { color: G.ink3, bg: G.ink6, border: G.ink5, dot: "solid", label: "Hết hạn" },
  };
  const s = map[status] || map["Hết hạn"];
  return <Pill color={s.color} bg={s.bg} border={s.border} dot={s.dot}>{s.label}</Pill>;
}

function TimeBubble({ time, active, onClick }) {
  const [h, hov] = useHover();
  const col = tierColor(time);
  const bg = active ? col : h ? tierBg(time) : "#fafafa";
  const c = active ? "#fff" : col;
  return (
    <button onClick={onClick} {...hov} style={{ padding:"5px 11px", borderRadius:8, fontSize:12, fontWeight:700, border:`1.5px solid ${active ? col : tierBdr(time)}`, background:bg, color:c, cursor:"pointer", transition:"all 0.15s", outline:"none" }}>
      {time}
    </button>
  );
}

function DayBtn({ day, active, onClick }) {
  const [h, hov] = useHover();
  const weekend = day === 0 || day === 6;
  return (
    <button onClick={onClick} {...hov} style={{ width:38, height:38, borderRadius:10, fontSize:11.5, fontWeight:800, cursor:"pointer", outline:"none", transition:"all 0.15s", border: active ? `2px solid ${G.or1}` : `1.5px solid ${G.ink5}`, background: active ? G.or1 : h ? G.ink6 : "#fafafa", color: active ? "#fff" : weekend ? G.or1 : G.ink3 }}>
      {DAYS_VI[day]}
    </button>
  );
}

function Btn({ children, variant="primary", size="md", icon, onClick, full, style: sx }) {
  const [h, hov] = useHover();
  const pad = size === "sm" ? "6px 14px" : size === "xs" ? "5px 11px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "xs" ? 11 : 13.5;
  const styles = {
    primary: { background: h ? G.or2 : G.or1, color:"#fff", border:"none", boxShadow: h ? "0 6px 20px rgba(249,115,22,.45)" : "0 3px 12px rgba(249,115,22,.30)", transform: h ? "translateY(-1px)" : "none" },
    ghost: { background: h ? G.ink6 : "#fff", color: G.ink2, border:`1.5px solid ${G.ink5}`, transform: h ? "translateY(-1px)" : "none" },
    danger: { background: h ? "#fee2e2" : G.redBg, color: G.red, border:`1px solid ${G.redBdr}` },
    success: { background: h ? "#d1fae5" : G.greenBg, color: G.green, border:`1px solid ${G.greenBdr}` },
    warn: { background: h ? "#fef3c7" : G.amberBg, color: G.amber, border:`1px solid ${G.amberBdr}` },
    dark: { background: h ? "#2d2d4a" : G.bgDark, color:"#fff", border:"none", boxShadow: h ? "0 6px 20px rgba(0,0,0,.4)" : "0 3px 12px rgba(0,0,0,.2)", transform: h ? "translateY(-1px)" : "none" },
  };
  return (
    <button onClick={onClick} {...hov} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:pad, borderRadius:10, fontSize:fs, fontWeight:700, cursor:"pointer", outline:"none", transition:"all 0.18s", width: full ? "100%" : "auto", ...styles[variant], ...sx }}>
      {icon && <span style={{ fontSize: fs + 1 }}>{icon}</span>}{children}
    </button>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize:10, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", color: G.ink4, marginBottom:6 }}>{children}</div>;
}

function FInput({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ width:"100%", height:42, padding:"0 13px", borderRadius:10, fontSize:13.5, fontWeight:500, background:"#fafafa", color: G.ink, border:`1.5px solid ${f ? G.or1 : G.ink5}`, boxShadow: f ? `0 0 0 3px rgba(249,115,22,.12)` : "none", outline:"none", transition:"all 0.18s", boxSizing:"border-box", ...props.style }} />
    </div>
  );
}

function FSelect({ label, children, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ width:"100%", height:42, padding:"0 13px", borderRadius:10, fontSize:13.5, fontWeight:500, background:"#fafafa", color: G.ink, border:`1.5px solid ${f ? G.or1 : G.ink5}`, boxShadow: f ? `0 0 0 3px rgba(249,115,22,.12)` : "none", outline:"none", transition:"all 0.18s", cursor:"pointer", boxSizing:"border-box" }}>
        {children}
      </select>
    </div>
  );
}

function SectionHead({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:18 }}>
      <div style={{ width:3, height:16, borderRadius:2, background:`linear-gradient(180deg,${G.or1},#fbbf24)` }} />
      <span style={{ fontSize:10.5, fontWeight:900, letterSpacing:"1.4px", textTransform:"uppercase", color: G.ink2 }}>{label}</span>
    </div>
  );
}

function Panel({ children, style: sx }) {
  return <div style={{ background: G.bgCard, borderRadius:18, border:`1px solid ${G.ink6}`, boxShadow:"0 2px 8px rgba(0,0,0,.06)", padding:22, ...sx }}>{children}</div>;
}

/* ── Stat Card ────────────────────────────────────────────── */
function StatCard({ label, value, sub, emoji, accent, delay = 0 }) {
  const [h, hov] = useHover();
  return (
    <div {...hov} style={{ background: G.bgCard, borderRadius:16, border:`1px solid ${G.ink6}`, padding:"20px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: h ? "0 8px 24px rgba(0,0,0,.10)" : "0 2px 6px rgba(0,0,0,.05)", transform: h ? "translateY(-3px)" : "none", transition:"all 0.22s", animationDelay:`${delay}s`, animation:"gfadeUp 0.45s ease both" }}>
      <div>
        <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.9px", textTransform:"uppercase", color: G.ink4, marginBottom:6 }}>{label}</div>
        <div style={{ fontSize:30, fontWeight:900, color: G.ink, lineHeight:1, letterSpacing:"-1px" }}>{value}</div>
        {sub && <div style={{ fontSize:11, color: G.ink4, marginTop:5, fontWeight:500 }}>{sub}</div>}
      </div>
      <div style={{ width:50, height:50, borderRadius:14, background:`${accent}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{emoji}</div>
    </div>
  );
}

/* ── Schedule Card (the main list item) ─────────────────── */
function ScheduleCard({ sch, index, onView, onEdit, onClone, onToggle }) {
  const [h, hov] = useHover();
  const movie = getMovie(sch.movieId);
  const cinema = getCinema(sch.cinemaId);
  const room = getRoom(sch.roomId);
  const totalSlots = sch.days.length * sch.times.length;

  return (
    <div {...hov} style={{ background: G.bgCard, borderRadius:16, border: h ? `1.5px solid ${G.or1}` : `1.5px solid ${G.ink6}`, boxShadow: h ? `0 6px 28px rgba(249,115,22,.10)` : "0 2px 8px rgba(0,0,0,.05)", transition:"all 0.2s", overflow:"hidden", animation:`gfadeUp 0.38s ease ${index*.06}s both` }}>
      {/* Accent strip */}
      <div style={{ height:3, background: h ? `linear-gradient(90deg,${G.or1},#fbbf24)` : `linear-gradient(90deg,${movie?.color || G.or1}40,transparent)`, transition:"all 0.2s" }} />

      <div style={{ padding:"18px 22px" }}>
        {/* ── TOP ROW ── */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16, flexWrap:"wrap" }}>
          {/* Movie color swatch + title */}
          <div style={{ display:"flex", alignItems:"center", gap:12, flex:"1 1 220px", minWidth:0 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${movie?.color || G.or1}18`, border:`1.5px solid ${movie?.color || G.or1}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎬</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:800, color: G.ink, lineHeight:1.25, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{movie?.title}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <Pill color={G.ink3} bg={G.ink6} border={G.ink5} size="sm">{movie?.duration}p · {movie?.format} · {movie?.age}</Pill>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ display:"flex", gap:8, flex:"1 1 160px", alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ padding:"8px 12px", borderRadius:10, background: G.blueBg, border:`1px solid ${G.blueBdr}` }}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.8px", textTransform:"uppercase", color: G.blue, marginBottom:2 }}>Rạp</div>
              <div style={{ fontSize:12.5, fontWeight:700, color: G.ink2 }}>{cinema?.name}</div>
            </div>
            <div style={{ padding:"8px 12px", borderRadius:10, background: G.violetBg, border:`1px solid ${G.violetBdr}` }}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.8px", textTransform:"uppercase", color: G.violet, marginBottom:2 }}>Phòng</div>
              <div style={{ fontSize:12.5, fontWeight:700, color: G.ink2 }}>{room?.name?.replace(" —", " –")}</div>
            </div>
          </div>

          {/* Status + slots summary */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ textAlign:"center", padding:"8px 14px", borderRadius:10, background: G.or3, border:`1px solid ${G.or4}` }}>
              <div style={{ fontSize:20, fontWeight:900, color: G.or1, lineHeight:1 }}>{totalSlots}</div>
              <div style={{ fontSize:9.5, fontWeight:700, color: G.or2, textTransform:"uppercase", letterSpacing:0.8, marginTop:1 }}>suất/tuần</div>
            </div>
            <StatusPill status={sch.status} />
          </div>
        </div>

        {/* ── MIDDLE ROW — Days + Times + Price ── */}
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"stretch", marginBottom:16 }}>
          {/* Days */}
          <div style={{ flex:"1 1 200px", padding:"12px 14px", borderRadius:12, background: G.ink6, border:`1px solid ${G.ink5}` }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", color: G.ink4, marginBottom:9 }}>Ngày chiếu / tuần</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {[0,1,2,3,4,5,6].map(d => {
                const active = sch.days.includes(d);
                const weekend = d === 0 || d === 6;
                return (
                  <div key={d} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10.5, fontWeight:800, background: active ? G.or1 : "#fff", color: active ? "#fff" : weekend ? G.or1 : G.ink4, border:`1.5px solid ${active ? G.or1 : G.ink5}`, boxShadow: active ? "0 2px 6px rgba(249,115,22,.30)" : "none" }}>
                    {DAYS_VI[d]}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize:11, color: G.ink3, marginTop:8, fontWeight:500 }}>
              {sch.days.map(d => DAYS_FULL[d]).join(" · ")}
            </div>
          </div>

          {/* Times */}
          <div style={{ flex:"1 1 200px", padding:"12px 14px", borderRadius:12, background: G.ink6, border:`1px solid ${G.ink5}` }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", color: G.ink4, marginBottom:9 }}>Suất chiếu / ngày</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {sch.times.map(t => (
                <span key={t} style={{ padding:"4px 10px", borderRadius:7, fontSize:12, fontWeight:700, background: tierBg(t), color: tierColor(t), border:`1px solid ${tierBdr(t)}` }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
              {["sáng","chiều","tối"].map(tier => {
                const count = sch.times.filter(t => timeTier(t) === tier).length;
                if (!count) return null;
                const col = { sáng: G.amber, chiều: G.or1, tối: G.violet }[tier];
                return <span key={tier} style={{ fontSize:10, color: col, fontWeight:600 }}>{count} {tier}</span>;
              })}
            </div>
          </div>

          {/* Price + Date */}
          <div style={{ flex:"1 1 150px", display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ flex:1, padding:"12px 14px", borderRadius:12, background: G.or3, border:`1px solid ${G.or4}` }}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", color: G.or2, marginBottom:6 }}>Giá vé</div>
              <div style={{ fontSize:18, fontWeight:900, color: G.or1, letterSpacing:"-0.5px" }}>{fmt(sch.priceBase)}</div>
              <div style={{ fontSize:11, color: G.or2, marginTop:2, fontWeight:500 }}>{fmt(sch.priceWeekend)} cuối tuần</div>
            </div>
            <div style={{ padding:"10px 14px", borderRadius:12, background: G.ink6, border:`1px solid ${G.ink5}` }}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", color: G.ink4, marginBottom:4 }}>Hiệu lực</div>
              <div style={{ fontSize:11.5, fontWeight:700, color: G.ink2 }}>{sch.startDate}</div>
              <div style={{ fontSize:11, color: G.ink4 }}>→ {sch.endDate}</div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM — Actions ── */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", borderTop:`1px solid ${G.ink6}`, paddingTop:14 }}>
          {sch.notes && (
            <div style={{ flex:"1 1 100%", fontSize:11.5, color: G.ink3, fontStyle:"italic", marginBottom:4 }}>📝 {sch.notes}</div>
          )}
          <div style={{ flex:1, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Btn variant="ghost" size="sm" icon="👁" onClick={() => onView(sch)}>Xem chi tiết</Btn>
            <Btn variant="primary" size="sm" icon="✏️" onClick={() => onEdit(sch)}>Chỉnh sửa</Btn>
            <Btn variant="success" size="sm" icon="📋" onClick={() => onClone(sch)}>Nhân bản</Btn>
            <Btn variant={sch.status === "Đang hoạt động" ? "warn" : "ghost"} size="sm"
              icon={sch.status === "Đang hoạt động" ? "⏸" : "▶"}
              onClick={() => onToggle(sch.id)}>
              {sch.status === "Đang hoạt động" ? "Tạm dừng" : "Kích hoạt"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Calendar Week View ────────────────────────────────────── */
function WeekView({ schedules }) {
  const [cinema, setCinema] = useState("all");
  const list = cinema === "all" ? schedules : schedules.filter(s => s.cinemaId === parseInt(cinema));
  const hours = ["08","09","10","11","12","13","14","15","16","17","18","19","20","21","22"];

  return (
    <Panel style={{ padding:0, overflow:"hidden" }}>
      <div style={{ padding:"16px 22px", borderBottom:`1px solid ${G.ink6}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <SectionHead label="Lịch chiếu theo tuần" />
        <select value={cinema} onChange={e => setCinema(e.target.value)} style={{ height:34, padding:"0 12px", borderRadius:8, fontSize:12.5, fontWeight:600, border:`1.5px solid ${G.ink5}`, background:"#fafafa", color: G.ink2, cursor:"pointer", outline:"none" }}>
          <option value="all">Tất cả rạp</option>
          {CINEMAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        <div style={{ minWidth:700 }}>
          {/* Header */}
          <div style={{ display:"grid", gridTemplateColumns:"56px repeat(7, 1fr)", borderBottom:`1px solid ${G.ink6}` }}>
            <div style={{ background: G.ink6 }} />
            {[0,1,2,3,4,5,6].map(d => {
              const w = d === 0 || d === 6;
              return (
                <div key={d} style={{ padding:"10px 4px", textAlign:"center", background: w ? G.or3 : G.ink6, borderLeft:`1px solid ${G.ink5}` }}>
                  <div style={{ fontSize:12, fontWeight:900, color: w ? G.or1 : G.ink3, letterSpacing:1 }}>{DAYS_VI[d]}</div>
                  <div style={{ fontSize:9, color: G.ink4, marginTop:2 }}>{w ? "Cuối tuần" : "Thường"}</div>
                </div>
              );
            })}
          </div>
          {/* Rows */}
          {hours.map((hour, hi) => (
            <div key={hour} style={{ display:"grid", gridTemplateColumns:"56px repeat(7, 1fr)", borderBottom:`1px solid ${G.ink6}30`, minHeight:54, background: hi % 2 === 0 ? "#fafafa" : G.bgCard }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"flex-end", paddingRight:10, paddingTop:8 }}>
                <span style={{ fontSize:10, fontWeight:700, color: G.ink4 }}>{hour}:00</span>
              </div>
              {[0,1,2,3,4,5,6].map(day => {
                const items = [];
                list.forEach(s => {
                  if (!s.days.includes(day)) return;
                  s.times.filter(t => t.startsWith(hour)).forEach(t => {
                    const mv = getMovie(s.movieId);
                    items.push({ t, mv, col: tierColor(t), bg: tierBg(t), bdr: tierBdr(t) });
                  });
                });
                const w = day === 0 || day === 6;
                return (
                  <div key={day} style={{ padding:"4px 3px", borderLeft:`1px solid ${G.ink6}30`, background: w ? "rgba(249,115,22,.02)" : "transparent", display:"flex", flexDirection:"column", gap:3 }}>
                    {items.map((it, i) => (
                      <div key={i} style={{ background: it.bg, border:`1px solid ${it.bdr}`, borderLeft:`3px solid ${it.col}`, borderRadius:6, padding:"3px 6px" }}>
                        <div style={{ fontSize:10, fontWeight:800, color: it.col }}>{it.t}</div>
                        <div style={{ fontSize:9, fontWeight:600, color: G.ink3, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", maxWidth:90 }}>{it.mv?.short}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{ padding:"12px 22px", borderTop:`1px solid ${G.ink6}`, display:"flex", gap:18, flexWrap:"wrap" }}>
        {[["🌅 Buổi sáng","trước 12:00", G.amber],["☀️ Buổi chiều","12:00–17:59",G.or1],["🌙 Buổi tối","18:00–22:30",G.violet]].map(([l,r,c]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />
            <span style={{ fontSize:11, color: G.ink3, fontWeight:600 }}>{l} <span style={{ color: G.ink4, fontWeight:400 }}>({r})</span></span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Bulk Price Modal ─────────────────────────────────────── */
function BulkModal({ schedules, onClose, onApply }) {
  const [prices, setPrices] = useState({ sáng:{base:60000,wk:70000}, chiều:{base:80000,wk:95000}, tối:{base:95000,wk:115000} });
  const [sel, setSel] = useState(schedules.map(s => s.id));
  const set = (tier, k, v) => setPrices(p => ({ ...p, [tier]: { ...p[tier], [k]: parseInt(v)||0 } }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,15,26,.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, animation:"gfadeIn 0.2s ease", padding:16 }}>
      <div style={{ background: G.bgCard, borderRadius:22, width:"100%", maxWidth:540, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.30)", animation:"gscaleIn 0.25s ease" }}>
        {/* Header */}
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${G.ink6}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color: G.ink, letterSpacing:"-0.3px" }}>💰 Chỉnh giá vé hàng loạt</div>
            <div style={{ fontSize:12, color: G.ink4, marginTop:3 }}>Áp dụng giá theo khung giờ cho nhiều lịch chiếu</div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:9, border:`1.5px solid ${G.ink5}`, background: G.ink6, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>
          {/* Tier prices */}
          <SectionHead label="Giá theo khung giờ" />
          {[["sáng","🌅 Buổi sáng",G.amber],["chiều","☀️ Buổi chiều",G.or1],["tối","🌙 Buổi tối",G.violet]].map(([k,lbl,col]) => (
            <div key={k} style={{ padding:14, borderRadius:12, marginBottom:10, background:`${col}08`, border:`1px solid ${col}25` }}>
              <div style={{ fontSize:12, fontWeight:800, color:col, marginBottom:10 }}>{lbl}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <FInput label="Ngày thường (đ)" type="number" step="5000" value={prices[k].base} onChange={e => set(k,"base",e.target.value)} />
                <FInput label="Cuối tuần (đ)" type="number" step="5000" value={prices[k].wk} onChange={e => set(k,"wk",e.target.value)} />
              </div>
            </div>
          ))}
          {/* Schedules */}
          <SectionHead label="Áp dụng cho lịch chiếu" />
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
            {schedules.map(s => {
              const checked = sel.includes(s.id);
              const mv = getMovie(s.movieId);
              return (
                <label key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:11, cursor:"pointer", background: checked ? G.or3 : G.ink6, border:`1.5px solid ${checked ? G.or4 : G.ink5}`, transition:"all 0.15s" }}>
                  <input type="checkbox" checked={checked} onChange={() => setSel(p => checked ? p.filter(i => i !== s.id) : [...p, s.id])} style={{ accentColor: G.or1, width:15, height:15 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color: G.ink, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{mv?.title}</div>
                    <div style={{ fontSize:11, color: G.ink3, marginTop:2 }}>{getCinema(s.cinemaId)?.name} · {s.times.length} suất/ngày</div>
                  </div>
                  <StatusPill status={s.status} />
                </label>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={onClose}>Hủy</Btn>
            <Btn variant="primary" icon="✓" onClick={() => { onApply(sel, prices); onClose(); }}>Áp dụng ({sel.length} lịch)</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Schedule Form ─────────────────────────────────────────── */
function ScheduleForm({ schedule, onCancel, onSave, isAdd }) {
  const [form, setForm] = useState(schedule || {
    movieId:1, cinemaId:1, roomId:1, days:[1,3,5],
    times:["10:00","14:30","19:00"], priceBase:80000, priceWeekend:95000,
    startDate:"2026-05-24", endDate:"2026-06-30", status:"Đang hoạt động", notes:"",
  });
  const s = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleDay = d => s("days")(form.days.includes(d) ? form.days.filter(x=>x!==d) : [...form.days,d].sort());
  const toggleTime = t => s("times")(form.times.includes(t) ? form.times.filter(x=>x!==t) : [...form.times,t].sort());
  const rooms = ROOMS[form.cinemaId] || [];
  const totalSlots = form.days.length * form.times.length;
  const mv = getMovie(form.movieId);

  return (
    <div style={{ animation:"gscaleIn 0.3s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24, flexWrap:"wrap" }}>
        <Btn variant="ghost" icon="←" onClick={onCancel}>Quay lại</Btn>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color: G.ink, letterSpacing:"-0.5px" }}>{isAdd ? "🗓 Tạo lịch chiếu định kỳ" : "✏️ Chỉnh sửa lịch chiếu"}</div>
          <div style={{ fontSize:12.5, color: G.ink4, marginTop:3 }}>{isAdd ? "Thiết lập lịch chiếu lặp lại theo tuần" : "Cập nhật thông tin lịch chiếu"}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 300px", gap:18, alignItems:"start" }}>
        {/* ── LEFT ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Phim & địa điểm */}
          <Panel>
            <SectionHead label="Phim & Địa điểm" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <FSelect label="Phim *" value={form.movieId} onChange={e => setForm(f => ({ ...f, movieId: parseInt(e.target.value) }))}>
                {MOVIES.filter(m => m.status !== "Ngừng chiếu").map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </FSelect>
              <FSelect label="Rạp chiếu *" value={form.cinemaId} onChange={e => {
                const id = parseInt(e.target.value);
                setForm(f => ({ ...f, cinemaId: id, roomId: (ROOMS[id]||[])[0]?.id || 1 }));
              }}>
                {CINEMAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </FSelect>
            </div>
            <FSelect label="Phòng chiếu *" value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: parseInt(e.target.value) }))}>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.seats} ghế)</option>)}
            </FSelect>
          </Panel>

          {/* Ngày chiếu */}
          <Panel>
            <SectionHead label="Ngày chiếu trong tuần" />
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
              {[0,1,2,3,4,5,6].map(d => <DayBtn key={d} day={d} active={form.days.includes(d)} onClick={() => toggleDay(d)} />)}
            </div>
            {form.days.length > 0 && (
              <div style={{ padding:"9px 13px", borderRadius:9, background: G.or3, border:`1px solid ${G.or4}`, fontSize:12, fontWeight:600, color: G.or2 }}>
                📅 {form.days.length} ngày/tuần: {form.days.map(d => DAYS_FULL[d]).join(", ")}
              </div>
            )}
          </Panel>

          {/* Giờ chiếu */}
          <Panel>
            <SectionHead label="Suất chiếu trong ngày" />
            {["sáng","chiều","tối"].map(tier => {
              const label = { sáng:"🌅 Buổi sáng (trước 12:00)", chiều:"☀️ Buổi chiều (12:00–17:59)", tối:"🌙 Buổi tối (18:00–22:30)" }[tier];
              const col = { sáng:G.amber, chiều:G.or1, tối:G.violet }[tier];
              const times = ALL_TIMES.filter(t => timeTier(t) === tier);
              return (
                <div key={tier} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:800, color: col, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{label}</div>
                  <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                    {times.map(t => <TimeBubble key={t} time={t} active={form.times.includes(t)} onClick={() => toggleTime(t)} />)}
                  </div>
                </div>
              );
            })}
            {form.times.length > 0 && (
              <div style={{ padding:"9px 13px", borderRadius:9, background: G.greenBg, border:`1px solid ${G.greenBdr}`, fontSize:12, fontWeight:600, color: G.green }}>
                🕐 {form.times.length} suất/ngày: {form.times.join(" · ")}
              </div>
            )}
          </Panel>

          {/* Giá vé */}
          <Panel>
            <SectionHead label="Cài đặt giá vé" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
              <FInput label="Giá ngày thường (đ) *" type="number" step="5000" value={form.priceBase} onChange={e => setForm(f => ({ ...f, priceBase: parseInt(e.target.value)||0 }))} />
              <FInput label="Giá cuối tuần (đ) *" type="number" step="5000" value={form.priceWeekend} onChange={e => setForm(f => ({ ...f, priceWeekend: parseInt(e.target.value)||0 }))} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {[["sáng",G.amber],["chiều",G.or1],["tối",G.violet]].map(([tier,col]) => (
                <div key={tier} style={{ padding:"10px 12px", borderRadius:10, background:`${col}0f`, border:`1px solid ${col}30` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:col, textTransform:"uppercase", letterSpacing:0.8, marginBottom:4 }}>Buổi {tier}</div>
                  <div style={{ fontSize:13, fontWeight:800, color: G.ink }}>{fmt(form.priceBase)}</div>
                  <div style={{ fontSize:10.5, color: G.ink4, marginTop:2 }}>CT: {fmt(form.priceWeekend)}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Thời gian & trạng thái */}
          <Panel>
            <SectionHead label="Thời gian hiệu lực & Trạng thái" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
              <FInput label="Ngày bắt đầu *" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              <FInput label="Ngày kết thúc *" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              <FSelect label="Trạng thái" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Đang hoạt động</option>
                <option>Tạm dừng</option>
              </FSelect>
            </div>
            <FieldLabel>Ghi chú nội bộ</FieldLabel>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Ghi chú thêm về lịch chiếu..." rows={2}
              style={{ width:"100%", padding:"10px 13px", borderRadius:10, fontSize:13, fontWeight:500, background:"#fafafa", color: G.ink, border:`1.5px solid ${G.ink5}`, outline:"none", resize:"vertical", fontFamily:"inherit", transition:"all 0.18s", boxSizing:"border-box" }}
              onFocus={e=>{e.target.style.border=`1.5px solid ${G.or1}`;e.target.style.boxShadow=`0 0 0 3px rgba(249,115,22,.12)`;}}
              onBlur={e=>{e.target.style.border=`1.5px solid ${G.ink5}`;e.target.style.boxShadow="none";}}
            />
          </Panel>
        </div>

        {/* ── RIGHT — Preview ── */}
        <div style={{ position:"sticky", top:20, display:"flex", flexDirection:"column", gap:14 }}>
          <Panel>
            <SectionHead label="Xem trước" />
            {/* Movie */}
            <div style={{ padding:"14px", borderRadius:12, background: G.bgDark, marginBottom:14, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${mv?.color||G.or1}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🎬</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff", lineHeight:1.3, marginBottom:4 }}>{mv?.title}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>{mv?.duration}p · {mv?.format} · {mv?.age}</div>
              </div>
            </div>
            {/* Stat grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              {[["Ngày/tuần",form.days.length+" ngày",G.blue],["Suất/ngày",form.times.length+" suất",G.green],["Tổng/tuần",totalSlots+" suất",G.or1],["Ghế/phòng",(getRoom(form.roomId)?.seats||0)+" ghế",G.violet]].map(([l,v,c]) => (
                <div key={l} style={{ padding:"10px 12px", borderRadius:10, background:`${c}10`, border:`1px solid ${c}25` }}>
                  <div style={{ fontSize:9.5, fontWeight:700, color: G.ink4, textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:17, fontWeight:900, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            {/* Days */}
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, color: G.ink4, textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>Ngày chiếu</div>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2,3,4,5,6].map(d => (
                  <div key={d} style={{ flex:1, height:26, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, fontWeight:800, background: form.days.includes(d) ? G.or1 : G.ink6, color: form.days.includes(d) ? "#fff" : G.ink4 }}>{DAYS_VI[d]}</div>
                ))}
              </div>
            </div>
            {/* Times */}
            {form.times.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:700, color: G.ink4, textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>Suất chiếu</div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {form.times.map(t => (
                    <div key={t} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 10px", borderRadius:7, background: tierBg(t), border:`1px solid ${tierBdr(t)}` }}>
                      <span style={{ fontSize:12, fontWeight:700, color: tierColor(t) }}>{t}</span>
                      <span style={{ fontSize:10, color: G.ink4, textTransform:"capitalize" }}>Buổi {timeTier(t)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Price */}
            <div style={{ padding:"12px 14px", borderRadius:11, background: G.or3, border:`1px solid ${G.or4}` }}>
              <div style={{ fontSize:10, fontWeight:700, color: G.or2, textTransform:"uppercase", letterSpacing:0.8, marginBottom:7 }}>Giá vé</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div><div style={{ fontSize:10.5, color: G.or2 }}>Ngày thường</div><div style={{ fontSize:16, fontWeight:900, color: G.or1 }}>{fmt(form.priceBase)}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:10.5, color: G.or2 }}>Cuối tuần</div><div style={{ fontSize:16, fontWeight:900, color: G.or1 }}>{fmt(form.priceWeekend)}</div></div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ marginTop:18, padding:"16px 22px", background: G.bgCard, borderRadius:14, border:`1px solid ${G.ink6}`, boxShadow:"0 -2px 10px rgba(0,0,0,.05)", display:"flex", justifyContent:"flex-end", gap:10, position:"sticky", bottom:0, zIndex:10 }}>
        <Btn variant="ghost" icon="✕" onClick={onCancel}>Hủy bỏ</Btn>
        <Btn variant="primary" icon="✓" onClick={() => onSave(form)}>{isAdd ? "🗓 Tạo lịch chiếu" : "💾 Lưu thay đổi"}</Btn>
      </div>
    </div>
  );
}

/* ── Detail View ────────────────────────────────────────────── */
function DetailView({ sch, onBack, onEdit }) {
  const mv = getMovie(sch.movieId);
  const cinema = getCinema(sch.cinemaId);
  const room = getRoom(sch.roomId);
  const totalSlots = sch.days.length * sch.times.length;

  return (
    <div style={{ animation:"gfadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Btn variant="ghost" icon="←" onClick={onBack}>Quay lại</Btn>
          <div>
            <div style={{ fontSize:19, fontWeight:900, color: G.ink, letterSpacing:"-0.4px" }}>Chi tiết lịch #{sch.id}</div>
            <div style={{ fontSize:12, color: G.ink4, marginTop:2 }}>{mv?.title}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <StatusPill status={sch.status} />
          <Btn variant="primary" icon="✏️" onClick={onEdit}>Chỉnh sửa</Btn>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: G.bgDark, borderRadius:20, padding:"28px 32px", marginBottom:18, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${G.or1},#fbbf24,${G.or1})`, backgroundSize:"200% 100%", animation:"gshimmer 3s linear infinite" }} />
        <div style={{ position:"absolute", top:0, right:0, width:200, height:200, borderRadius:"50%", background:`${mv?.color||G.or1}12`, transform:"translate(50%,-50%)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:22, flexWrap:"wrap", position:"relative" }}>
          <div style={{ width:68, height:68, borderRadius:18, background:`${mv?.color||G.or1}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>🎬</div>
          <div style={{ flex:1, minWidth:180 }}>
            <div style={{ fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"-0.5px", marginBottom:8 }}>{mv?.title}</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">⏱ {mv?.duration}p</Pill>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">📽 {mv?.format}</Pill>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">🏢 {cinema?.name}</Pill>
              <Pill color="#94a3b8" bg="rgba(255,255,255,.08)" border="rgba(255,255,255,.12)" size="sm">🎭 {room?.name}</Pill>
            </div>
          </div>
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Tổng suất / tuần</div>
            <div style={{ fontSize:44, fontWeight:900, color: G.or1, lineHeight:1 }}>{totalSlots}</div>
            <div style={{ fontSize:12, color:"#64748b" }}>suất chiếu</div>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
        <StatCard label="Ngày / tuần" value={sch.days.length} emoji="📅" accent={G.blue} sub={`${DAYS_FULL[sch.days[0]]} – ${DAYS_FULL[sch.days[sch.days.length-1]]}`} />
        <StatCard label="Suất / ngày" value={sch.times.length} emoji="🕐" accent={G.green} sub={sch.times[0] + " → " + sch.times[sch.times.length-1]} />
        <StatCard label="Giá thường" value={fmt(sch.priceBase)} emoji="💰" accent={G.or1} />
        <StatCard label="Giá cuối tuần" value={fmt(sch.priceWeekend)} emoji="🎉" accent={G.violet} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 300px", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Week grid */}
          <Panel>
            <SectionHead label="Bảng lịch chiếu trong tuần" />
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:550 }}>
                <thead>
                  <tr>
                    <th style={{ padding:"8px 10px", textAlign:"left", fontSize:10, fontWeight:800, color: G.ink4, textTransform:"uppercase", letterSpacing:0.8 }}>Giờ chiếu</th>
                    {[0,1,2,3,4,5,6].map(d => {
                      const active = sch.days.includes(d);
                      const w = d===0||d===6;
                      return (
                        <th key={d} style={{ padding:"8px 6px", textAlign:"center", fontSize:11, fontWeight:900, color: active ? G.or1 : G.ink4, background: active ? G.or3 : "transparent", borderRadius: active ? "8px 8px 0 0" : 0 }}>
                          {DAYS_VI[d]}{w&&<div style={{fontSize:8.5,color:G.ink4}}>CT</div>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sch.times.map(t => (
                    <tr key={t}>
                      <td style={{ padding:"7px 10px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ width:6, height:6, borderRadius:2, background: tierColor(t) }} />
                          <span style={{ fontSize:13, fontWeight:800, color: tierColor(t) }}>{t}</span>
                          <span style={{ fontSize:10.5, color: G.ink4, textTransform:"capitalize" }}>({timeTier(t)})</span>
                        </div>
                      </td>
                      {[0,1,2,3,4,5,6].map(d => (
                        <td key={d} style={{ padding:"7px 6px", textAlign:"center" }}>
                          {sch.days.includes(d) ? (
                            <div style={{ width:"100%", padding:"6px 4px", background: tierBg(t), border:`1px solid ${tierBdr(t)}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <span style={{ fontSize:13, color: tierColor(t) }}>✓</span>
                            </div>
                          ) : <span style={{ fontSize:13, color: G.ink5 }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Tier breakdown */}
          <Panel>
            <SectionHead label="Phân tích giá theo khung giờ" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {["sáng","chiều","tối"].map(tier => {
                const col = { sáng:G.amber, chiều:G.or1, tối:G.violet }[tier];
                const lbl = { sáng:"🌅 Buổi sáng", chiều:"☀️ Buổi chiều", tối:"🌙 Buổi tối" }[tier];
                const count = sch.times.filter(t => timeTier(t) === tier).length;
                return (
                  <div key={tier} style={{ padding:"16px 14px", borderRadius:12, background:`${col}0a`, border:`1px solid ${col}28` }}>
                    <div style={{ fontSize:11.5, fontWeight:800, color:col, marginBottom:5 }}>{lbl}</div>
                    <div style={{ fontSize:26, fontWeight:900, color:col, lineHeight:1, marginBottom:8 }}>{count}</div>
                    <div style={{ fontSize:10, color: G.ink4, marginBottom:4, fontWeight:600 }}>suất chiếu</div>
                    <div style={{ height:1, background:`${col}25`, marginBottom:8 }} />
                    <div style={{ fontSize:12, fontWeight:700, color: G.ink2 }}>{fmt(sch.priceBase)}</div>
                    <div style={{ fontSize:10.5, color: G.ink4 }}>{fmt(sch.priceWeekend)} CT</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Panel>
            <SectionHead label="Thông tin chung" />
            {[
              ["Phim", mv?.title],
              ["Rạp chiếu", cinema?.name],
              ["Phòng chiếu", room?.name],
              ["Sức chứa", room?.seats+" ghế"],
              ["Bắt đầu", sch.startDate],
              ["Kết thúc", sch.endDate],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"9px 0", borderBottom:`1px solid ${G.ink6}` }}>
                <span style={{ fontSize:12, color: G.ink3, fontWeight:600, flexShrink:0 }}>{l}</span>
                <span style={{ fontSize:12.5, color: G.ink, fontWeight:700, textAlign:"right", maxWidth:160, lineHeight:1.3 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:12 }}><StatusPill status={sch.status} /></div>
            {sch.notes && <div style={{ marginTop:10, padding:"10px 12px", borderRadius:9, background: G.ink6, border:`1px solid ${G.ink5}`, fontSize:12.5, color: G.ink3, lineHeight:1.5 }}>📝 {sch.notes}</div>}
          </Panel>

          <Panel>
            <SectionHead label="Thao tác nhanh" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <Btn variant="primary" icon="📋" full>Nhân bản lịch tuần này</Btn>
              <Btn variant="ghost" icon="📊" full>Xem thống kê vé</Btn>
              <Btn variant="warn" icon="💰" full>Chỉnh giá hàng loạt</Btn>
              <Btn variant="danger" icon="⏸" full>Tạm dừng lịch chiếu</Btn>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("list");
  const [scheds, setScheds] = useState(INIT);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("list");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCinema, setFilterCinema] = useState("all");
  const [filterMovie, setFilterMovie] = useState("all");
  const [showBulk, setShowBulk] = useState(false);
  const [toast, setToast] = useState(null);

  const toast$ = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const filtered = scheds.filter(s =>
    (filterStatus === "Tất cả" || s.status === filterStatus) &&
    (filterCinema === "all" || s.cinemaId === parseInt(filterCinema)) &&
    (filterMovie === "all" || s.movieId === parseInt(filterMovie))
  );

  const counts = {
    total: scheds.length,
    active: scheds.filter(s => s.status === "Đang hoạt động").length,
    paused: scheds.filter(s => s.status === "Tạm dừng").length,
    slots: scheds.reduce((a, s) => a + s.days.length * s.times.length, 0),
  };

  const handleSave = (form) => {
    if (view === "add") {
      setScheds(p => [...p, { ...form, id: Date.now() }]);
      toast$("✅ Tạo lịch chiếu định kỳ thành công!");
    } else {
      setScheds(p => p.map(s => s.id === sel.id ? { ...s, ...form } : s));
      setSel(s => ({ ...s, ...form }));
      toast$("✅ Cập nhật lịch chiếu thành công!");
    }
    setView("list");
  };

  const handleClone = (s) => {
    setScheds(p => [...p, { ...s, id: Date.now(), notes: `[Nhân bản #${s.id}] ${s.notes}` }]);
    toast$("📋 Đã nhân bản lịch chiếu!");
  };

  const handleToggle = (id) => {
    setScheds(p => p.map(s => s.id === id ? { ...s, status: s.status === "Đang hoạt động" ? "Tạm dừng" : "Đang hoạt động" } : s));
    toast$("⏯ Đã cập nhật trạng thái!");
  };

  const handleBulk = (ids, prices) => {
    setScheds(p => p.map(s => {
      if (!ids.includes(s.id)) return s;
      const tier = timeTier(s.times[0] || "10:00");
      return { ...s, priceBase: prices[tier]?.base || s.priceBase, priceWeekend: prices[tier]?.wk || s.priceWeekend };
    }));
    toast$(`💰 Đã cập nhật giá cho ${ids.length} lịch chiếu!`);
  };

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    @keyframes gfadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes gfadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes gscaleIn { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes gpulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes gshimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes gtoastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    input[type=number]::-webkit-inner-spin-button { opacity:1; }
    select { appearance: auto; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background:#f1f5f9; }
    ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:99px; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .resp-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .resp-grid-2 { grid-template-columns: 1fr !important; }
      .resp-form-grid { grid-template-columns: 1fr !important; }
      .resp-hide { display: none !important; }
      .resp-full { width: 100% !important; }
      .resp-wrap { flex-wrap: wrap !important; }
      .resp-stack { flex-direction: column !important; }
      .resp-hero-pad { padding: 18px 16px !important; }
      .resp-hero-text { font-size: 18px !important; }
    }
    @media (max-width: 480px) {
      .resp-grid-4 { grid-template-columns: 1fr 1fr !important; }
      .resp-hero-text { font-size: 16px !important; }
      .resp-sm-wrap { flex-wrap: wrap !important; }
    }
  `;

  if (view !== "list") {
    return (
      <div style={{ minHeight:"100vh", background: G.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", padding:"24px 16px 48px" }}>
        <style>{STYLES}</style>
        <div style={{ maxWidth:1320, margin:"0 auto" }}>
          {view === "add" && <ScheduleForm isAdd onCancel={() => setView("list")} onSave={handleSave} />}
          {view === "edit" && sel && <ScheduleForm schedule={scheds.find(s => s.id === sel.id)||sel} onCancel={() => setView("detail")} onSave={handleSave} />}
          {view === "detail" && sel && <DetailView sch={scheds.find(s => s.id === sel.id)||sel} onBack={() => setView("list")} onEdit={() => setView("edit")} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background: G.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{STYLES}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", padding:"13px 22px", borderRadius:14, background: G.bgDark, color:"#fff", fontSize:13.5, fontWeight:700, boxShadow:"0 8px 32px rgba(0,0,0,.30)", zIndex:9999, animation:"gtoastIn 0.3s ease", whiteSpace:"nowrap" }}>{toast}</div>
      )}

      {showBulk && <BulkModal schedules={scheds.filter(s => s.status==="Đang hoạt động")} onClose={() => setShowBulk(false)} onApply={handleBulk} />}

      {/* ── PAGE CONTENT ── */}
      <div style={{ maxWidth:1320, margin:"0 auto", padding:"85px 16px 48px" }}>

        {/* Page header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, gap:14, flexWrap:"wrap", animation:"gfadeUp 0.4s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:50, height:50, borderRadius:15, background:`linear-gradient(135deg,${G.or1},#fbbf24)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:`0 6px 18px rgba(249,115,22,.38)`, flexShrink:0 }}>🗓</div>
            <div>
              <h1 style={{ fontSize:26, fontWeight:900, color: G.ink, letterSpacing:"-0.6px", lineHeight:1.1 }}>Lịch chiếu định kỳ</h1>
              <p style={{ fontSize:13, color: G.ink4, marginTop:4, fontWeight:500 }}>Quản lý lịch chiếu lặp lại · Nhân bản & Chỉnh giá hàng loạt</p>
            </div>
          </div>
          <div className="resp-wrap" style={{ display:"flex", gap:10 }}>
            <Btn variant="warn" icon="💰" onClick={() => setShowBulk(true)}>Chỉnh giá loạt</Btn>
            <Btn variant="dark" icon="+" onClick={() => setView("add")}>Tạo lịch chiếu</Btn>
          </div>
        </div>

        {/* Stats */}
        <div className="resp-grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          <StatCard label="Tổng lịch chiếu" value={counts.total} emoji="🗓" accent={G.or1} sub={`${counts.slots} suất/tuần`} delay={0} />
          <StatCard label="Đang hoạt động" value={counts.active} emoji="▶" accent={G.green} delay={0.05} />
          <StatCard label="Tạm dừng" value={counts.paused} emoji="⏸" accent={G.amber} delay={0.10} />
          <StatCard label="Suất chiếu/tuần" value={counts.slots} emoji="🎬" accent={G.violet} delay={0.15} />
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:18, background:"#e2e8f0", borderRadius:12, padding:4, width:"fit-content" }}>
          {[{k:"list",l:"📋 Danh sách"},{k:"calendar",l:"📅 Lịch tuần"}].map(({k,l}) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding:"8px 20px", borderRadius:9, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", transition:"all 0.18s", background: tab===k ? G.or1 : "transparent", color: tab===k ? "#fff" : G.ink3, boxShadow: tab===k ? "0 2px 10px rgba(249,115,22,.35)" : "none" }}>{l}</button>
          ))}
        </div>

        {tab === "calendar" ? (
          <div style={{ animation:"gfadeIn 0.3s ease" }}>
            <WeekView schedules={scheds} />
          </div>
        ) : (
          <div style={{ animation:"gfadeIn 0.3s ease" }}>
            {/* Filter bar */}
            <div style={{ background: G.bgCard, borderRadius:16, border:`1px solid ${G.ink6}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)", marginBottom:14 }}>
              <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${G.ink6}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:15, fontWeight:800, color: G.ink }}>Danh sách lịch chiếu</span>
                    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, background: G.or3, border:`1px solid ${G.or4}`, color: G.or1 }}>{filtered.length} lịch</span>
                  </div>
                </div>
                <div className="resp-sm-wrap" style={{ display:"flex", gap:10 }}>
                  {[
                    { val:filterCinema, set:setFilterCinema, opts:[{v:"all",l:"Tất cả rạp"},...CINEMAS.map(c=>({v:c.id,l:c.name}))] },
                    { val:filterMovie, set:setFilterMovie, opts:[{v:"all",l:"Tất cả phim"},...MOVIES.map(m=>({v:m.id,l:m.title}))], flex:2 },
                    { val:filterStatus, set:setFilterStatus, opts:[{v:"Tất cả",l:"Tất cả trạng thái"},{v:"Đang hoạt động",l:"Đang hoạt động"},{v:"Tạm dừng",l:"Tạm dừng"},{v:"Hết hạn",l:"Hết hạn"}] },
                  ].map((f,i) => (
                    <select key={i} value={f.val} onChange={e => f.set(e.target.value)} style={{ flex: f.flex||1, minWidth:0, height:38, padding:"0 12px", borderRadius:10, fontSize:12.5, fontWeight:600, border:`1.5px solid ${G.ink5}`, background:"#fafafa", color: G.ink2, cursor:"pointer", outline:"none" }}>
                      {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  ))}
                </div>
              </div>

              {/* Column labels — desktop only */}
              <div className="resp-hide" style={{ padding:"9px 22px", background:"#fafbfc", borderBottom:`1px solid ${G.ink6}`, display:"flex", gap:16, alignItems:"center" }}>
                {[["Phim & Địa điểm","flex:2.5"],["Ngày chiếu","flex:1.2"],["Suất chiếu","flex:1.2"],["Giá vé","flex:0.9"],["Thời gian","flex:0.9"],["Trạng thái","flex:0.8"],["Hành động","flex:1.5"]].map(([l,f]) => (
                  <div key={l} style={{ fontSize:9.5, fontWeight:900, color: G.ink4, textTransform:"uppercase", letterSpacing:"1px", [f.startsWith("flex") ? "flex" : "width"]: f.split(":")[1] }}>{l}</div>
                ))}
              </div>

              {/* List */}
              <div style={{ padding:12 }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"56px 0", color: G.ink4 }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🗓</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>Không tìm thấy lịch chiếu nào</div>
                    <div style={{ fontSize:12, marginTop:6 }}>Thử thay đổi bộ lọc hoặc tạo lịch mới</div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {filtered.map((s, i) => (
                      <ScheduleCard key={s.id} sch={s} index={i}
                        onView={x => { setSel(x); setView("detail"); }}
                        onEdit={x => { setSel(x); setView("edit"); }}
                        onClone={handleClone}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}