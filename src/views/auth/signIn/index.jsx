import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS  –  injected once into <head>
   Fonts: Bebas Neue · Syne · JetBrains Mono  (Google Fonts)
   No external UI lib needed.
───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

:root{--o:#FF5500;--o2:#FF8C00;--o3:#FF3300;}

@keyframes cardReveal{from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:none}}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes scanMove{from{top:-2px}to{top:100%}}
@keyframes corePulse{0%,100%{transform:scale(1)}50%{transform:scale(.8)}}
@keyframes ringExp{0%{transform:scale(.5);opacity:1}100%{transform:scale(1);opacity:0}}
@keyframes shine{0%{left:-80%}35%,100%{left:130%}}
@keyframes secPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,85,0,0)}50%{box-shadow:0 0 0 6px rgba(255,85,0,.04)}}
@keyframes fdotMove{0%{transform:translateY(0);opacity:0}10%{opacity:.3}90%{opacity:.15}100%{transform:translateY(-120px);opacity:0}}
@keyframes textGlow{0%,100%{opacity:0}50%{opacity:.4}}

/* ── overlay layers ── */
.gp3-noise{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
  background-size:256px;}
.gp3-vignette{position:fixed;inset:0;z-index:2;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.7) 100%);}
.gp3-hlines{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.018;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,85,0,1) 3px,rgba(255,85,0,1) 4px);}
.gp3-scan{position:fixed;left:0;right:0;height:2px;z-index:3;pointer-events:none;
  background:linear-gradient(transparent,rgba(255,85,0,.5),transparent);
  animation:scanMove 3.5s linear infinite;}

/* ── card ── */
.gp3-card{
  width:100%;display:grid;grid-template-columns:1.2fr 1fr;
  border-radius:24px;overflow:hidden;position:relative;
  animation:cardReveal 1s cubic-bezier(.16,1,.3,1) both;
}
.gp3-card::before{
  content:'';position:absolute;inset:0;border-radius:24px;padding:1px;
  background:linear-gradient(135deg,rgba(255,85,0,.4),rgba(255,85,0,.05),rgba(255,85,0,.2));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
  pointer-events:none;z-index:20;}

/* ── LEFT ── */
.gp3-left{
  background:linear-gradient(145deg,#0A0A0A,#0D0D0D,#0F0808);
  padding:56px 52px;display:flex;flex-direction:column;
  position:relative;overflow:hidden;
  border-right:1px solid rgba(255,85,0,.08);}
.gp3-left::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(to right,transparent,rgba(255,85,0,.5),transparent);}
.gp3-watermark{
  position:absolute;right:-40px;bottom:-60px;
  font-family:'Bebas Neue',sans-serif;font-size:260px;color:transparent;
  -webkit-text-stroke:1px rgba(255,85,0,.05);line-height:1;
  pointer-events:none;user-select:none;letter-spacing:-10px;}
.gp3-ring{position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(255,85,0,.06);}
.gp3-ring1{width:420px;height:420px;right:-120px;top:-120px;animation:spin 60s linear infinite;}
.gp3-ring2{width:280px;height:280px;right:-60px;top:-60px;animation:spin 40s linear infinite reverse;border-style:dashed;border-color:rgba(255,85,0,.04);}
.gp3-ring3{width:160px;height:160px;right:20px;top:20px;animation:spin 25s linear infinite;border-color:rgba(255,85,0,.08);}
.gp3-ring4{width:320px;height:320px;left:-100px;bottom:-100px;animation:spin 50s linear infinite reverse;border-color:rgba(255,85,0,.04);}
.gp3-perfs{position:absolute;left:0;top:0;bottom:0;width:22px;
  display:flex;flex-direction:column;justify-content:space-around;
  padding:12px 4px;opacity:.08;pointer-events:none;}
.gp3-perf{width:14px;height:10px;border-radius:2px;background:var(--o);flex-shrink:0;}

/* logo gem spin */
.gp3-logo-gem{
  width:48px;height:48px;border-radius:14px;
  background:linear-gradient(135deg,rgba(255,85,0,.25),rgba(255,50,0,.08));
  border:1px solid rgba(255,85,0,.3);
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;}
.gp3-logo-gem::before{
  content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;
  background:conic-gradient(transparent,rgba(255,85,0,.15),transparent 30%);
  animation:spin 4s linear infinite;}
.gp3-logo-gem svg{position:relative;z-index:1;}

/* h1 outline glow */
.gp3-h1-outline{
  display:block;color:transparent;
  -webkit-text-stroke:1.5px var(--o);
  letter-spacing:5px;font-size:72px;
  position:relative;}
.gp3-h1-outline::after{
  content:attr(data-text);position:absolute;left:0;top:0;
  color:transparent;-webkit-text-stroke:0;
  background:linear-gradient(90deg,var(--o),var(--o2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  opacity:0;animation:textGlow 3s ease-in-out infinite;}

/* stats block */
.gp3-stats{
  display:flex;background:rgba(255,255,255,.015);
  border:1px solid rgba(255,255,255,.05);border-radius:14px;overflow:hidden;}
.gp3-stat{flex:1;padding:16px 20px;border-right:1px solid rgba(255,255,255,.04);position:relative;}
.gp3-stat:last-child{border-right:none;}
.gp3-stat::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:1px;
  background:linear-gradient(to right,transparent,var(--o),transparent);opacity:0;transition:opacity .3s;}
.gp3-stat:hover::after{opacity:.4;}

/* pill hover */
.gp3-pill{transition:all .3s;cursor:default;position:relative;overflow:hidden;}
.gp3-pill::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,85,0,.08),transparent);opacity:0;transition:opacity .3s;}
.gp3-pill:hover{border-color:rgba(255,85,0,.25)!important;color:rgba(255,255,255,.7)!important;}
.gp3-pill:hover::before{opacity:1;}

/* ── RIGHT ── */
.gp3-right{
  background:#070707;padding:52px 46px;
  display:flex;flex-direction:column;justify-content:center;
  position:relative;overflow:hidden;}
.gp3-corner-tl{position:absolute;top:0;right:0;width:60px;height:60px;
  border-top:1px solid rgba(255,85,0,.3);border-right:1px solid rgba(255,85,0,.3);
  border-radius:0 0 0 24px;pointer-events:none;}
.gp3-corner-br{position:absolute;bottom:0;left:0;width:60px;height:60px;
  border-bottom:1px solid rgba(255,85,0,.15);border-left:1px solid rgba(255,85,0,.15);
  border-radius:0 24px 0 0;pointer-events:none;}
.gp3-fdot{position:absolute;border-radius:50%;background:var(--o);
  animation:fdotMove linear infinite;opacity:0;}

/* live badge */
.gp3-live-core{position:absolute;inset:0;border-radius:50%;background:var(--o);animation:corePulse 2s ease-in-out infinite;}
.gp3-live-ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px solid rgba(255,85,0,.5);animation:ringExp 2s ease-out infinite;}
.gp3-live-ring2{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(255,85,0,.2);animation:ringExp 2s ease-out infinite .4s;}

/* inputs */
.gp3-inp,.gp3-sel{
  width:100%;height:50px;
  background:rgba(255,255,255,.025);
  border:1px solid rgba(255,255,255,.06);
  border-radius:13px;color:#fff;
  font-size:13.5px;font-family:'Syne',sans-serif;
  padding:0 50px 0 18px;outline:none;
  transition:all .25s;-webkit-appearance:none;appearance:none;}
.gp3-inp::placeholder{color:rgba(255,255,255,.13);font-size:13px;}
.gp3-inp:focus,.gp3-sel:focus{
  border-color:rgba(255,85,0,.35);background:rgba(255,85,0,.025);
  box-shadow:0 0 0 4px rgba(255,85,0,.06),inset 0 1px 0 rgba(255,255,255,.04);}
.gp3-sel option{background:#0D0D0D;color:#fff;}
.gp3-inp-line{
  height:1px;margin-top:-1px;border-radius:0 0 13px 13px;
  background:linear-gradient(to right,transparent,var(--o),transparent);
  transform:scaleX(0);transform-origin:center;transition:transform .3s;opacity:.6;}

/* custom checkbox */
.gp3-chk-box{
  width:17px;height:17px;border-radius:5px;
  border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.02);
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;flex-shrink:0;position:relative;overflow:hidden;}
.gp3-chk-box.checked::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--o),var(--o3));border-radius:4px;}
.gp3-chk-box.checked::after{
  content:'';width:9px;height:5.5px;
  border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;
  transform:rotate(-45deg) translateY(-1px);display:block;position:relative;z-index:1;}

/* main button */
.gp3-btn-main{
  width:100%;height:54px;
  background:linear-gradient(135deg,#FF5500,#FF3300,#FF7700);
  background-size:200% 100%;color:#fff;
  font-size:13px;font-weight:700;font-family:'Syne',sans-serif;
  letter-spacing:1.5px;text-transform:uppercase;
  border:none;border-radius:14px;cursor:pointer;
  position:relative;overflow:hidden;
  transition:transform .15s,box-shadow .2s,background-position .4s;}
.gp3-btn-main::before{content:'';position:absolute;inset:0;border-radius:14px;
  background:linear-gradient(to bottom,rgba(255,255,255,.12),transparent 60%);}
.gp3-btn-main:hover{transform:translateY(-2px);background-position:100% 0;
  box-shadow:0 16px 50px rgba(255,60,0,.45),0 0 30px rgba(255,85,0,.2);}
.gp3-btn-main:active{transform:translateY(0);}
.gp3-shine{position:absolute;top:0;left:-80%;width:60%;height:100%;
  background:linear-gradient(to right,transparent,rgba(255,255,255,.2),transparent);
  transform:skewX(-20deg);animation:shine 3s infinite 1.5s;}

/* alt buttons */
.gp3-btn-alt{
  flex:1;height:46px;background:transparent;
  border:1px solid rgba(255,255,255,.06);border-radius:12px;
  color:rgba(255,255,255,.3);font-size:12px;font-family:'Syne',sans-serif;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .25s;letter-spacing:.3px;position:relative;overflow:hidden;}
.gp3-btn-alt::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,85,0,.06),transparent);opacity:0;transition:opacity .3s;}
.gp3-btn-alt:hover{border-color:rgba(255,85,0,.2);color:rgba(255,255,255,.6);}
.gp3-btn-alt:hover::before{opacity:1;}

/* security */
.gp3-sec-icon{
  width:34px;height:34px;background:rgba(255,85,0,.05);
  border:1px solid rgba(255,85,0,.1);border-radius:10px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  animation:secPulse 3s ease-in-out infinite;}

/* eye button */
.gp3-eye-btn{
  position:absolute;right:14px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;
  color:rgba(255,85,0,.4);padding:4px;display:flex;transition:color .2s;}
.gp3-eye-btn:hover{color:var(--o);}

/* forgot */
.gp3-fgt{background:none;border:none;font-family:'Syne',sans-serif;
  font-size:12.5px;font-weight:600;color:rgba(255,85,0,.65);
  cursor:pointer;padding:0;letter-spacing:.3px;transition:all .2s;}
.gp3-fgt:hover{color:var(--o);text-shadow:0 0 12px rgba(255,85,0,.4);}

@media(max-width:740px){
  .gp3-left{display:none!important;}
  .gp3-card{grid-template-columns:1fr!important;}
  .gp3-right{padding:36px 24px!important;}
}
`;

/* ─────────────────────────────────────────────
   Canvas 1 – Particle background
───────────────────────────────────────────── */
function ParticleBg() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext("2d");
    let W, H, id;
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    class P {
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.r = Math.random() * 1.4 + .2;
        this.vx = (Math.random() - .5) * .25; this.vy = -Math.random() * .5 - .08;
        this.a = Math.random() * .35 + .04;
        this.life = Math.random() * 220 + 80; this.age = 0;
        this.hue = 10 + Math.random() * 25; this.sat = 70 + Math.random() * 30;
      }
      constructor() { this.reset(); this.age = Math.random() * this.life; }
    }
    const pts = Array.from({ length: 140 }, () => new P());
    const draw = () => {
      cx.fillStyle = "#050505"; cx.fillRect(0, 0, W, H);
      [[W*.12,H*.18,W*.42,"rgba(255,60,0,.06)"],[W*.88,H*.82,W*.3,"rgba(255,100,0,.04)"],[W*.5,H*.5,W*.25,"rgba(255,40,0,.02)"]].forEach(([x,y,r,c]) => {
        const g = cx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,c); g.addColorStop(1,"transparent");
        cx.fillStyle = g; cx.fillRect(0,0,W,H);
      });
      pts.forEach(p => {
        p.age++;
        if (p.age > p.life) p.reset();
        const f = p.age < 20 ? p.age/20 : p.age > p.life-20 ? (p.life-p.age)/20 : 1;
        cx.beginPath();
        cx.arc(p.x + p.vx*p.age, p.y + p.vy*p.age, p.r, 0, Math.PI*2);
        cx.fillStyle = `hsla(${p.hue},${p.sat}%,62%,${p.a*f})`;
        cx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0 }} />;
}

/* ─────────────────────────────────────────────
   Canvas 2 – Film strip sides
───────────────────────────────────────────── */
function FilmStripBg() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext("2d");
    let W, H, offset = 0, id;
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    const drawStrip = (x) => {
      const sw=34, sh=26, gap=8, ph=8, pw=8, pr=2, fullH=sh+gap;
      cx.fillStyle = "rgba(255,85,0,0.03)";
      cx.fillRect(x, 0, sw, H);
      for (let i = 0; i * fullH - offset < H + fullH; i++) {
        const y = i * fullH - (offset % fullH);
        cx.fillStyle = "rgba(255,85,0,0.06)";
        cx.beginPath(); cx.roundRect(x+3, y, pw, ph, pr); cx.fill();
        cx.beginPath(); cx.roundRect(x+sw-pw-3, y, pw, ph, pr); cx.fill();
      }
    };
    const frame = () => {
      cx.clearRect(0, 0, W, H);
      offset = (offset + .4) % (34 + 8);
      drawStrip(0); drawStrip(W - 34);
      id = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:1 }} />;
}

/* ─────────────────────────────────────────────
   Live clock
───────────────────────────────────────────── */
function LiveClock() {
  const [t, setT] = useState("— 00:00:00 · HCMC");
  useEffect(() => {
    const tick = () => {
      const n = new Date(), p = v => String(v).padStart(2,"0");
      setT(`— ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())} · HCMC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(255,85,0,.45)", letterSpacing:2.5, marginTop:14, display:"block" }}>
      {t}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Count-up number
───────────────────────────────────────────── */
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const step = Math.ceil(target / 40);
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + step, target);
      setVal(n);
      if (n >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

/* ─────────────────────────────────────────────
   Input field wrapper
───────────────────────────────────────────── */
function Field({ label, iconPath, delay, children }) {
  return (
    <div style={{ marginBottom:15, animation:`fu .6s ${delay}s both` }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width:12, height:12, flexShrink:0 }}>
          {iconPath}
        </svg>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, fontWeight:500, color:"rgba(255,255,255,.3)", letterSpacing:1.2, textTransform:"uppercase" }}>
          {label}
        </span>
      </div>
      <div style={{ position:"relative" }}>
        {children}
        <div className="gp3-inp-line" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StaffSignIn() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  // Inject CSS once
  useEffect(() => {
    if (document.getElementById("gp3-css")) return;
    const s = document.createElement("style");
    s.id = "gp3-css"; s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);

  // Focus line effect
  useEffect(() => {
    const handler = (e) => {
      const box = e.target.closest("[data-ibox]");
      if (!box) return;
      const line = box.querySelector(".gp3-inp-line");
      if (!line) return;
      line.style.transform = e.type === "focusin" ? "scaleX(1)" : "scaleX(0)";
    };
    document.addEventListener("focusin", handler);
    document.addEventListener("focusout", handler);
    return () => { document.removeEventListener("focusin", handler); document.removeEventListener("focusout", handler); };
  }, []);

  const PILLS = ["Tra cứu phim","Chọn ghế live","In vé QR","Báo cáo ca","Hoàn vé","Combo bắp nước"];

  const S = (style) => style; // passthrough helper for inline style objects

  return (
    <div style={{ minHeight:"100vh", background:"#050505", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden", fontFamily:"'Syne',sans-serif" }}>

      {/* Background layers */}
      <ParticleBg />
      <FilmStripBg />
      <div className="gp3-noise" />
      <div className="gp3-vignette" />
      <div className="gp3-hlines" />
      <div className="gp3-scan" />

      {/* ── CARD ── */}
      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:1100 }}>
        <div className="gp3-card">

          {/* ════════════ LEFT ════════════ */}
          <div className="gp3-left">
            <div className="gp3-watermark">GF</div>
            <div className="gp3-ring gp3-ring1" />
            <div className="gp3-ring gp3-ring2" />
            <div className="gp3-ring gp3-ring3" />
            <div className="gp3-ring gp3-ring4" />

            {/* Film perfs */}
            <div className="gp3-perfs">
              {Array.from({ length: 26 }).map((_, i) => <div key={i} className="gp3-perf" />)}
            </div>

            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:14, position:"relative", zIndex:2, animation:"fu .7s .1s both" }}>
              <div className="gp3-logo-gem">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round" style={{ width:22, height:22 }}>
                  <rect x="2" y="4" width="20" height="14" rx="2"/>
                  <path d="M8 4v14M16 4v14M2 10h20M2 14h4M18 14h4"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:"#FF5500", letterSpacing:3 }}>GấuPhim</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(255,255,255,.2)", letterSpacing:2 }}>Staff Portal · v3.0</div>
              </div>
            </div>

            {/* Hero */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", margin:"42px 0", position:"relative", zIndex:2, animation:"fu .7s .2s both" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:32, height:1.5, background:"linear-gradient(to right,#FF5500,transparent)" }} />
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, color:"rgba(255,85,0,.7)", letterSpacing:3, textTransform:"uppercase" }}>Hệ thống nội bộ</span>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:80, lineHeight:.88, color:"#fff", letterSpacing:3 }}>
                ĐẶT VÉ
                <span className="gp3-h1-outline" data-text="TRỰC TIẾP">TRỰC TIẾP</span>
              </div>
              <LiveClock />
              <p style={{ fontSize:13.5, color:"rgba(255,255,255,.28)", lineHeight:1.75, maxWidth:310, marginTop:22, fontWeight:300 }}>
                Tra cứu suất chiếu, chọn ghế, thanh toán và in vé QR trong 30 giây. Tất cả trong một màn hình duy nhất.
              </p>
            </div>

            {/* Stats */}
            <div className="gp3-stats" style={{ animation:"fu .7s .35s both" }}>
              {[["CountUp-12","Rạp chiếu"],["CountUp-480","Suất / ngày"],["24/7","Hoạt động"]].map(([n,l],i) => (
                <div key={l} className="gp3-stat">
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:"#FF5500", letterSpacing:1, lineHeight:1 }}>
                    {n === "CountUp-12" ? <CountUp target={12} /> : n === "CountUp-480" ? <CountUp target={480} suffix="+" /> : n}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"rgba(255,255,255,.2)", letterSpacing:1.5, textTransform:"uppercase", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Pills */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:24, position:"relative", zIndex:2, animation:"fu .7s .42s both" }}>
              {PILLS.map(p => (
                <div key={p} className="gp3-pill" style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:100, fontSize:11, color:"rgba(255,255,255,.35)" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,85,0,.6)", flexShrink:0 }} />
                  {p}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ paddingTop:22, borderTop:"1px solid rgba(255,255,255,.04)", marginTop:24, position:"relative", zIndex:2, animation:"fu .7s .5s both" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"9px 16px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.04)", borderRadius:100 }}>
                <span style={{ fontSize:18 }}>🇻🇳</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,.4)" }}>GấuPhim — Việt Nam</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.15)" }}>Hoàng Sa – Trường Sa là của Việt Nam</div>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════ RIGHT ════════════ */}
          <div className="gp3-right">
            <div className="gp3-corner-tl" />
            <div className="gp3-corner-br" />

            {/* Floating dots */}
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
              {Array.from({ length: 18 }).map((_, i) => {
                const s = Math.random() * 3 + 1.5;
                return (
                  <div key={i} className="gp3-fdot" style={{ width:s, height:s, left:`${Math.random()*100}%`, bottom:-s, animationDuration:`${4+Math.random()*6}s`, animationDelay:`${Math.random()*5}s` }} />
                );
              })}
            </div>

            {/* Form header */}
            <div style={{ marginBottom:30, animation:"fu .6s .2s both" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 13px 5px 9px", background:"rgba(255,85,0,.07)", border:"1px solid rgba(255,85,0,.15)", borderRadius:100, marginBottom:18 }}>
                <div style={{ position:"relative", width:8, height:8, flexShrink:0 }}>
                  <div className="gp3-live-core" />
                  <div className="gp3-live-ring" />
                  <div className="gp3-live-ring2" />
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:500, color:"#FF7744", letterSpacing:1.5, textTransform:"uppercase" }}>Nhân viên · Ca đang mở</span>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44, letterSpacing:2, color:"#fff", lineHeight:1, marginBottom:6 }}>ĐĂNG NHẬP</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"rgba(255,255,255,.22)", fontWeight:300 }}>// xác thực tài khoản nhân viên GấuPhim</div>
            </div>

            {/* Email */}
            <Field label="Email nhân viên" delay={0.28} iconPath={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>}>
              <input className="gp3-inp" type="email" placeholder="ten.nhanvien@gauphim.vn" autoComplete="email" data-ibox />
            </Field>

            {/* Password */}
            <Field label="Mật khẩu" delay={0.34} iconPath={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}>
              <input className="gp3-inp" type={showPwd ? "text" : "password"} placeholder="••••••••••" autoComplete="current-password" data-ibox />
              <button className="gp3-eye-btn" onClick={() => setShowPwd(v => !v)} type="button">
                {showPwd
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:15, height:15 }}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:15, height:15 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </Field>

            {/* Branch */}
            <Field label="Rạp làm việc" delay={0.4} iconPath={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>}>
              <select className="gp3-sel" data-ibox>
                <option value="" disabled>Chọn rạp của bạn...</option>
                {["GấuPhim Quận 1 — Hồ Chí Minh","GấuPhim Quận 7 — Phú Mỹ Hưng","GấuPhim Bình Thạnh — Hồ Chí Minh","GấuPhim Thủ Đức — Hồ Chí Minh","GấuPhim Hoàn Kiếm — Hà Nội","GấuPhim Cầu Giấy — Hà Nội","GấuPhim Hải Châu — Đà Nẵng","GấuPhim Sơn Trà — Đà Nẵng"].map(r => <option key={r}>{r}</option>)}
              </select>
              <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.18)", pointerEvents:"none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:14, height:14 }}><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </Field>

            {/* Options row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", margin:"6px 0 20px", animation:"fu .6s .44s both" }}>
              <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" style={{ display:"none" }} checked={remember} onChange={e => setRemember(e.target.checked)} />
                <div className={`gp3-chk-box${remember ? " checked" : ""}`} onClick={() => setRemember(v => !v)} />
                <span style={{ fontSize:12.5, color:"rgba(255,255,255,.28)" }}>Ghi nhớ ca này</span>
              </label>
              <button className="gp3-fgt">Quên mật khẩu?</button>
            </div>

            {/* Main button */}
            <button className="gp3-btn-main" style={{ animation:"fu .6s .47s both" }}>
              <div className="gp3-shine" />
              Bắt đầu ca làm việc
            </button>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0", animation:"fu .6s .52s both" }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,.04)" }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(255,255,255,.12)", letterSpacing:2, textTransform:"uppercase" }}>hoặc đăng nhập bằng</span>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,.04)" }} />
            </div>

            {/* Alt buttons */}
            <div style={{ display:"flex", gap:10, animation:"fu .6s .57s both" }}>
              {[
                { label:"Quét QR", icon:<><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h2v2M17 21h2M21 17v2M21 15v-2h-2M21 21h-2v-2"/></> },
                { label:"Mã NV", icon:<><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></> },
                { label:"SSO công ty", icon:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
              ].map(({ label, icon }) => (
                <button key={label} className="gp3-btn-alt">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width:16, height:16 }}>{icon}</svg>
                  {label}
                </button>
              ))}
            </div>

            {/* Security */}
            <div style={{ display:"flex", alignItems:"center", gap:11, marginTop:20, paddingTop:20, borderTop:"1px solid rgba(255,255,255,.03)", animation:"fu .6s .62s both" }}>
              <div className="gp3-sec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" style={{ width:15, height:15 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(255,255,255,.16)", lineHeight:1.6, fontWeight:300 }}>
                <b style={{ color:"rgba(255,255,255,.28)", fontWeight:400 }}>SSL 256-bit · Mã hoá đầu cuối · Zero-log.</b><br />
                Chỉ dành cho nhân viên GấuPhim. Mọi hành động được kiểm soát.
              </p>
            </div>
          </div>
          {/* ── end right ── */}

        </div>
      </div>
    </div>
  );
}