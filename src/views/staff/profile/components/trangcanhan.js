import React, { useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

/* ═══════════════════════════════════════════════════════════
   TRANG CÁ NHÂN — Gấu Phim · Staff Profile
   Dark mode + Modern hero + Activity timeline
═══════════════════════════════════════════════════════════ */

// ─── LIGHT THEME ────────────────────────────────────────────────────────────
const LIGHT = {
  or1:"#ea580c",or2:"#f97316",or3:"#fff7ed",or4:"#fed7aa",or5:"#fb923c",
  bg:"#f5f5f2",bgCard:"#ffffff",bgDark:"#18181b",bgDeep:"#09090b",
  ink:"#09090b",ink2:"#18181b",ink3:"#52525b",ink4:"#a1a1aa",ink5:"#d4d4d8",ink6:"#f4f4f5",
  green:"#16a34a",greenBg:"#f0fdf4",greenBdr:"#86efac",
  amber:"#d97706",amberBg:"#fffbeb",amberBdr:"#fcd34d",
  red:"#dc2626",redBg:"#fef2f2",redBdr:"#fca5a5",
  blue:"#2563eb",blueBg:"#eff6ff",blueBdr:"#93c5fd",
  violet:"#7c3aed",violetBg:"#f5f3ff",violetBdr:"#c4b5fd",
  teal:"#0d9488",tealBg:"#f0fdfa",tealBdr:"#99f6e4",
  subtleBg:"#fafafa",hoverRow:"#fffaf7",
  bannerFrom:"#431407",bannerMid:"#7c2d12",bannerTo:"#431407",
};

// ─── DARK THEME ─────────────────────────────────────────────────────────────
const DARK = {
  or1:"#fb923c",or2:"#f97316",or3:"rgba(249,115,22,0.12)",or4:"rgba(249,115,22,0.3)",or5:"#fdba74",
  bg:"#0b1120",bgCard:"#1a2332",bgDark:"#0f172a",bgDeep:"#020617",
  ink:"#f8fafc",ink2:"#e2e8f0",ink3:"#94a3b8",ink4:"#64748b",ink5:"#334155",ink6:"#1e293b",
  green:"#4ade80",greenBg:"rgba(74,222,128,0.12)",greenBdr:"rgba(74,222,128,0.3)",
  amber:"#fbbf24",amberBg:"rgba(251,191,36,0.12)",amberBdr:"rgba(251,191,36,0.3)",
  red:"#f87171",redBg:"rgba(248,113,113,0.12)",redBdr:"rgba(248,113,113,0.3)",
  blue:"#60a5fa",blueBg:"rgba(96,165,250,0.12)",blueBdr:"rgba(96,165,250,0.3)",
  violet:"#a78bfa",violetBg:"rgba(167,139,250,0.12)",violetBdr:"rgba(167,139,250,0.3)",
  teal:"#2dd4bf",tealBg:"rgba(45,212,191,0.12)",tealBdr:"rgba(45,212,191,0.3)",
  subtleBg:"#0f172a",hoverRow:"rgba(249,115,22,0.08)",
  bannerFrom:"#0f172a",bannerMid:"#1e293b",bannerTo:"#0b1120",
};

// ─── HOOKS ─────────────────────────────────────────────────────────────────
function useHover(){
  const [h,set]=useState(false);
  return [h,{onMouseEnter:()=>set(true),onMouseLeave:()=>set(false)}];
}
function useIsMobile(){
  const [m,setM]=useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(()=>{
    const fn=()=>setM(window.innerWidth<768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  return m;
}
function useTheme(dark){ return dark ? DARK : LIGHT; }

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const STATS = [
  { label:"Vé bán hôm nay", value:"124",  emoji:"🎫", accent:"or1",    trend:"+12%" },
  { label:"Doanh thu ca",   value:"8.4tr", emoji:"💰", accent:"green",  trend:"+8.1%" },
  { label:"Khách phục vụ",  value:"87",   emoji:"👥", accent:"blue",   trend:"+5.2%" },
  { label:"Ca làm việc",    value:"22",   emoji:"📅", accent:"violet", trend:"tháng này" },
];

const SKILLS = [
  { label:"Kỹ năng bán vé",         pct: 96, color:"or1" },
  { label:"Xử lý tình huống",       pct: 88, color:"blue" },
  { label:"Kiến thức sản phẩm",     pct: 74, color:"violet" },
  { label:"Tốc độ phục vụ",         pct: 81, color:"green" },
];

const ACHIEVEMENTS = [
  { id:1, emoji:"🏆", title:"Nhân viên xuất sắc", desc:"Tháng 4/2026",   accent:"amber" },
  { id:2, emoji:"⭐", title:"100 vé trong 1 ca",  desc:"Đạt 12/05/2026", accent:"or1" },
  { id:3, emoji:"🎯", title:"Không lỗi giao dịch", desc:"30 ngày liên tục", accent:"green" },
];

const ACTIVITY_LOG = [
  { time:"16:42", type:"sale",     title:"Bán vé Avengers: Doomsday",  detail:"Ghế F5, F6 · 180.000đ",        accent:"or1" },
  { time:"16:38", type:"checkin",  title:"Check-in vé #TK-0042",       detail:"Phòng P1 · Suất 16:30",        accent:"green" },
  { time:"16:35", type:"sale",     title:"Bán vé Lật Mặt 8",           detail:"Ghế C3 · 90.000đ",             accent:"or1" },
  { time:"16:28", type:"support",  title:"Hỗ trợ khách đổi vé",        detail:"Đơn #GPF-2026005",             accent:"blue" },
  { time:"16:15", type:"sale",     title:"Bán combo bắp nước",         detail:"Combo Couple x1 · 95.000đ",    accent:"or1" },
  { time:"16:05", type:"checkin",  title:"Check-in vé #TK-0038",       detail:"Phòng P2 · Suất 16:00",        accent:"green" },
];

const ACCOUNT_INFO = [
  { label:"Mã nhân viên",  value:"NV-2024-001" },
  { label:"Phòng ban",     value:"Vận hành rạp" },
  { label:"Ca làm việc",   value:"Ca sáng · 8:00 – 16:00" },
  { label:"Ngày vào làm",  value:"01/01/2024" },
  { label:"Quản lý trực tiếp", value:"Trần Văn Bình" },
];

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────
function SectionHead({label, icon, action, C}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:3,height:16,borderRadius:2,background:`linear-gradient(180deg,${C.or1},${C.or5})`}}/>
        <span style={{fontSize:11,fontWeight:800,color:C.ink,letterSpacing:"1.2px",textTransform:"uppercase"}}>
          {icon} {label}
        </span>
      </div>
      {action}
    </div>
  );
}

function StatCard({item, delay, C}){
  const[h,hov]=useHover();
  const accent = C[item.accent];
  const accentBg = C[`${item.accent}Bg`];
  const accentBdr = C[`${item.accent}Bdr`];
  return(
    <div {...hov} style={{
      background:C.bgCard,borderRadius:16,border:`1px solid ${C.ink6}`,
      padding:"16px 18px",position:"relative",overflow:"hidden",
      boxShadow:h?"0 8px 24px rgba(0,0,0,.09)":"0 2px 6px rgba(0,0,0,.04)",
      transform:h?"translateY(-3px)":"none",transition:"all 0.2s",
      animationDelay:`${delay}s`,animation:"slideup 0.4s ease both",
    }}>
      <div style={{position:"absolute",top:-30,right:-30,width:90,height:90,borderRadius:"50%",background:`${accent}18`,filter:"blur(24px)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:accentBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
            {item.emoji}
          </div>
          <span style={{fontSize:10.5,fontWeight:800,color:accent,background:accentBg,border:`1px solid ${accentBdr}`,padding:"2px 7px",borderRadius:6}}>
            {item.trend}
          </span>
        </div>
        <div style={{fontSize:24,fontWeight:900,color:C.ink,lineHeight:1,letterSpacing:"-0.5px",marginBottom:4}}>{item.value}</div>
        <div style={{fontSize:11.5,color:C.ink4,fontWeight:600}}>{item.label}</div>
      </div>
    </div>
  );
}

function SkillBar({skill, index, C}){
  const accent = C[skill.color];
  return(
    <div style={{animation:`slideup 0.4s ease ${index*0.08+0.1}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:12,fontWeight:600,color:C.ink2}}>{skill.label}</span>
        <span style={{fontSize:12,fontWeight:800,color:accent}}>{skill.pct}%</span>
      </div>
      <div style={{height:6,borderRadius:99,background:C.ink6,overflow:"hidden"}}>
        <div style={{
          height:"100%",width:`${skill.pct}%`,borderRadius:99,
          background:`linear-gradient(90deg,${accent},${C.or5})`,
          boxShadow:`0 0 8px ${accent}40`,transition:"width 1s ease"
        }}/>
      </div>
    </div>
  );
}

function AchievementBadge({badge, C}){
  const[h,hov]=useHover();
  const accent = C[badge.accent];
  const bg = C[`${badge.accent}Bg`];
  const bdr = C[`${badge.accent}Bdr`];
  return(
    <div {...hov} style={{
      display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
      borderRadius:12,background:bg,border:`1px solid ${bdr}`,
      transition:"all 0.2s",cursor:"default",
      transform:h?"translateY(-2px)":"none",
    }}>
      <div style={{fontSize:22,flexShrink:0}}>{badge.emoji}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:800,color:accent,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{badge.title}</div>
        <div style={{fontSize:10.5,color:C.ink4,fontWeight:600,marginTop:2}}>{badge.desc}</div>
      </div>
    </div>
  );
}

function ActivityItem({item, index, isLast, C}){
  const accent = C[item.accent];
  const accentBg = C[`${item.accent}Bg`];
  const icons = { sale:"💰", checkin:"✅", support:"🎧" };
  return(
    <div style={{
      display:"flex",gap:12,position:"relative",
      paddingBottom:isLast?0:14,
      animation:`slideup 0.35s ease ${index*0.05}s both`,
    }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{
          position:"absolute",left:17,top:36,bottom:0,width:2,
          background:C.ink6,
        }}/>
      )}
      {/* Icon */}
      <div style={{
        width:36,height:36,borderRadius:10,background:accentBg,
        border:`1px solid ${accent}40`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:15,flexShrink:0,zIndex:1,position:"relative",
      }}>{icons[item.type]||"•"}</div>
      {/* Content */}
      <div style={{flex:1,minWidth:0,paddingTop:2}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
          <span style={{fontSize:12.5,fontWeight:800,color:C.ink}}>{item.title}</span>
          <span style={{fontSize:10,fontWeight:700,color:accent,background:accentBg,padding:"1px 6px",borderRadius:5}}>
            {item.time}
          </span>
        </div>
        <div style={{fontSize:11.5,color:C.ink3,fontWeight:500,lineHeight:1.5}}>{item.detail}</div>
      </div>
    </div>
  );
}

function EditProfileModal({isOpen,onClose,onSave,C}){
  const[form,setForm]=useState({
    fullname:"Lý Tiểu Long",
    email:"admin@cinema.com",
    phone:"0900 000 000",
    dept:"Vận hành rạp",
  });
  const isMobile=useIsMobile();

  useEffect(()=>{ if(!isOpen) return; },[isOpen]);
  if(!isOpen) return null;

  const inputStyle={
    width:"100%",height:42,padding:"0 14px",borderRadius:10,
    fontSize:13.5,fontWeight:500,background:C.subtleBg,
    border:`1.5px solid ${C.ink5}`,outline:"none",color:C.ink,
    fontFamily:"inherit",boxSizing:"border-box",
  };
  const labelSt={
    fontSize:"10.5px",fontWeight:800,letterSpacing:"0.9px",
    textTransform:"uppercase",color:C.ink3,marginBottom:7,display:"block"
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadein 0.2s ease"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(9,9,11,.65)",backdropFilter:"blur(8px)"}} onClick={onClose}/>
      <div style={{
        position:"relative",background:C.bgCard,borderRadius:22,
        width:"100%",maxWidth:520,boxShadow:"0 40px 100px rgba(0,0,0,.35)",
        overflow:"hidden",animation:"scalein 0.25s cubic-bezier(.22,1,.36,1)"
      }}>
        <div style={{height:4,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24,${C.or5},${C.or1})`,backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
        <div style={{padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{
              width:44,height:44,borderRadius:12,
              background:`linear-gradient(135deg,${C.or1},${C.or5})`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
              boxShadow:`0 4px 12px ${C.or1}40`
            }}>✏️</div>
            <div>
              <div style={{fontSize:16,fontWeight:900,color:C.ink}}>Chỉnh sửa hồ sơ</div>
              <div style={{fontSize:11.5,color:C.ink4,marginTop:2}}>Cập nhật thông tin cá nhân</div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={labelSt}>Họ tên</label>
              <input style={inputStyle} value={form.fullname}
                onChange={e=>setForm(f=>({...f,fullname:e.target.value}))}/>
            </div>
            <div>
              <label style={labelSt}>Email</label>
              <input style={inputStyle} type="email" value={form.email}
                onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
              <div>
                <label style={labelSt}>Số điện thoại</label>
                <input style={inputStyle} value={form.phone}
                  onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
              </div>
              <div>
                <label style={labelSt}>Phòng ban</label>
                <input style={inputStyle} value={form.dept}
                  onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/>
              </div>
            </div>
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:22}}>
            <button onClick={onClose} style={{
              padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,
              background:"transparent",color:C.ink3,border:`1.5px solid ${C.ink5}`,
              cursor:"pointer",fontFamily:"inherit"
            }}>Hủy</button>
            <button onClick={()=>{onSave(form);onClose();}} style={{
              padding:"10px 24px",borderRadius:10,fontSize:13,fontWeight:800,
              background:`linear-gradient(135deg,${C.or1},${C.or5})`,
              color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit",
              boxShadow:`0 4px 14px ${C.or1}40`
            }}>Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function TrangCaNhan(){
  const { colorMode } = useColorMode();
  const C = useTheme(colorMode === "dark");
  const isMobile = useIsMobile();
  const[showEdit,setShowEdit]=useState(false);
  const[toast,setToast]=useState(null);

  const fullname = localStorage.getItem("fullname") || "Lý Tiểu Long";
  const role = localStorage.getItem("role") || "Staff";

  const toastFn=msg=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const STYLES=`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;}
    @keyframes slideup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadein{from{opacity:0}to{opacity:1}}
    @keyframes scalein{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes op-pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(249,115,22,.4)}70%{box-shadow:0 0 0 12px rgba(249,115,22,0)}100%{box-shadow:0 0 0 0 rgba(249,115,22,0)}}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${C.ink5};border-radius:99px}
    input,select,textarea,button{font-family:'Sora',system-ui,sans-serif;color:${C.ink}}
    select{appearance:auto;color-scheme:${colorMode}}
    @media(max-width:767px){
      .stats-grid{grid-template-columns:1fr 1fr!important;}
    }
  `;

  return(
    <div style={{
      minHeight:"100vh",background:C.bg,fontFamily:"'Sora',system-ui,sans-serif",
      paddingTop:isMobile?"90px":"80px",
      paddingLeft:isMobile?12:20,paddingRight:isMobile?12:20,paddingBottom:60,
      color:C.ink,transition:"background 0.3s, color 0.3s",
    }}>
      <style>{STYLES}</style>

      {toast&&(
        <div style={{
          position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
          padding:"13px 20px",borderRadius:14,background:C.bgDark,color:"#fff",
          fontSize:13,fontWeight:700,boxShadow:"0 10px 36px rgba(0,0,0,.35)",
          zIndex:9999,animation:"toast-in 0.3s ease",
          whiteSpace:"nowrap",maxWidth:"calc(100vw - 32px)",textAlign:"center",
        }}>{toast}</div>
      )}

      <EditProfileModal isOpen={showEdit} onClose={()=>setShowEdit(false)}
        onSave={f=>{toastFn("✅ Đã lưu thông tin hồ sơ");localStorage.setItem("fullname",f.fullname);}} C={C}/>

      <div style={{maxWidth:1400,margin:"0 auto"}}>

        {/* ── HERO BANNER ── */}
        <div style={{
          marginBottom:24,borderRadius:22,overflow:"hidden",
          boxShadow:`0 16px 48px ${C.or1}25`,
          animation:"fadein 0.5s ease both",
          border:`1px solid ${C.ink6}`,
        }}>
          {/* Banner gradient */}
          <div style={{
            height:isMobile?160:190,
            background:`linear-gradient(135deg, ${C.bannerFrom} 0%, ${C.bannerMid} 50%, ${C.bannerTo} 100%)`,
            position:"relative",overflow:"hidden",
          }}>
            {/* Film strip dots top-left */}
            <div style={{position:"absolute",top:14,left:20,display:"flex",gap:6,opacity:.25}}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{width:8,height:8,borderRadius:2,background:"#fff"}}/>
              ))}
            </div>
            {/* Film strip dots bottom-right */}
            <div style={{position:"absolute",bottom:14,right:20,display:"flex",gap:6,opacity:.15}}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} style={{width:8,height:8,borderRadius:2,background:"#fff"}}/>
              ))}
            </div>

            {/* Glow orb */}
            <div style={{
              position:"absolute",top:-40,right:isMobile?-40:60,
              width:220,height:220,borderRadius:"50%",
              background:`radial-gradient(circle, ${C.or1}40 0%, transparent 70%)`,
            }}/>

            {/* Shimmer line bottom */}
            <div style={{
              position:"absolute",bottom:0,left:0,right:0,height:2,
              background:`linear-gradient(90deg, transparent, ${C.or1}, ${C.or5}, #fbbf24, ${C.or5}, ${C.or1}, transparent)`,
              backgroundSize:"200% 100%",
              animation:"shimmer 3s linear infinite"
            }}/>

            {/* Role badge */}
            <div style={{
              position:"absolute",top:16,right:20,
              display:"flex",alignItems:"center",gap:6,
              padding:"6px 12px",borderRadius:10,
              background:"rgba(255,255,255,.08)",
              border:"1px solid rgba(255,255,255,.15)",
              backdropFilter:"blur(8px)",
            }}>
              <span style={{fontSize:12}}>🛡️</span>
              <span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:"1.5px"}}>{role.toUpperCase()}</span>
            </div>

            {/* Greeting text */}
            <div style={{
              position:"absolute",bottom:16,left:isMobile?16:24,
              display:"flex",alignItems:"center",gap:8,
            }}>
              <span style={{fontSize:isMobile?11:12,color:"rgba(255,255,255,.5)",fontWeight:700,letterSpacing:1}}>
                {new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"numeric",month:"long"})}
              </span>
            </div>
          </div>

          {/* Profile card */}
          <div style={{
            background:C.bgCard,
            padding:isMobile?"0 16px 20px":"0 32px 22px",
          }}>
            <div style={{
              display:"flex",alignItems:"flex-end",gap:isMobile?14:20,
              marginTop:-44,marginBottom:16,
              flexDirection:isMobile?"column":"row",
              alignItems:isMobile?"center":"flex-end",
            }}>
              {/* Avatar */}
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{
                  width:isMobile?100:120,height:isMobile?100:120,
                  borderRadius:"50%",overflow:"hidden",
                  border:"4px solid "+C.bgCard,
                  boxShadow:`0 0 0 3px ${C.or1}, 0 8px 24px rgba(0,0,0,.2)`,
                  animation:"pulse-ring 3s ease infinite",
                }}>
                  <img
                    src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-ngau-2.jpg"
                    alt="avatar"
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                  />
                </div>
                {/* Online dot */}
                <div style={{
                  position:"absolute",bottom:6,right:6,
                  width:14,height:14,borderRadius:"50%",
                  background:"#10b981",
                  border:"2.5px solid "+C.bgCard,
                }}/>
              </div>

              {/* Name + actions */}
              <div style={{
                flex:1,width:"100%",
                display:"flex",justifyContent:"space-between",alignItems:"flex-end",
                flexDirection:isMobile?"column":"row",
                gap:10,
                textAlign:isMobile?"center":"left",
              }}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{
                    display:"flex",alignItems:"center",gap:8,marginBottom:3,
                    justifyContent:isMobile?"center":"flex-start",
                  }}>
                    <span style={{
                      fontSize:isMobile?20:24,fontWeight:900,color:C.ink,letterSpacing:"-0.5px"
                    }}>{fullname}</span>
                    <span style={{fontSize:20}}>✓</span>
                  </div>
                  <div style={{
                    display:"flex",alignItems:"center",gap:6,
                    justifyContent:isMobile?"center":"flex-start",
                  }}>
                    <span style={{fontSize:13}}>👤</span>
                    <span style={{fontSize:13,color:C.ink3,fontWeight:500}}>
                      Nhân viên vận hành · Gấu Phim
                    </span>
                  </div>
                </div>

                <button onClick={()=>setShowEdit(true)} style={{
                  height:40,padding:"0 20px",borderRadius:10,
                  fontWeight:700,fontSize:13,cursor:"pointer",
                  background:`linear-gradient(135deg,${C.or1},${C.or5})`,
                  color:"#fff",border:"none",fontFamily:"inherit",
                  display:"flex",alignItems:"center",gap:6,
                  boxShadow:`0 4px 14px ${C.or1}40`,
                  transition:"all 0.2s",
                  flexShrink:0,
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${C.or1}55`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 14px ${C.or1}40`;}}
                >
                  <span>✏️</span> Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>

            {/* Quick info chips */}
            <div style={{
              display:"flex",gap:10,flexWrap:"wrap",
              justifyContent:isMobile?"center":"flex-start",
            }}>
              {[
                { icon:"✉️", label:"admin@cinema.com" },
                { icon:"📱", label:"0900 000 000" },
                { icon:"🏢", label:"Gấu Phim Hà Nội" },
              ].map(({icon,label})=>(
                <div key={label} style={{
                  display:"flex",alignItems:"center",gap:6,
                  padding:"7px 12px",borderRadius:10,
                  background:C.subtleBg,border:`1px solid ${C.ink6}`,
                }}>
                  <span style={{fontSize:13}}>{icon}</span>
                  <span style={{fontSize:12,fontWeight:600,color:C.ink2}}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="stats-grid" style={{
          display:"grid",gridTemplateColumns:"repeat(4,1fr)",
          gap:isMobile?10:14,marginBottom:22,
        }}>
          {STATS.map((s,i)=><StatCard key={s.label} item={s} delay={i*0.05} C={C}/>)}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:isMobile?"1fr":"1fr 1.6fr",
          gap:18,
        }}>

          {/* LEFT COLUMN */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>

            {/* Account info */}
            <div style={{
              background:C.bgCard,borderRadius:18,
              border:`1px solid ${C.ink6}`,
              boxShadow:"0 1px 4px rgba(0,0,0,.04)",
              overflow:"hidden",
              animation:"slideup 0.45s ease 0.2s both",
            }}>
              <div style={{height:3,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24)`}}/>
              <div style={{padding:22}}>
                <SectionHead label="Thông tin tài khoản" icon="📋" C={C}/>
                {ACCOUNT_INFO.map(({label,value})=>(
                  <div key={label} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"11px 0",borderBottom:`1px solid ${C.ink6}`,
                  }}>
                    <span style={{fontSize:12,fontWeight:600,color:C.ink4}}>{label}</span>
                    <span style={{fontSize:12.5,fontWeight:700,color:C.ink}}>{value}</span>
                  </div>
                ))}
                <div style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"11px 0",
                }}>
                  <span style={{fontSize:12,fontWeight:600,color:C.ink4}}>Trạng thái</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{
                      width:6,height:6,borderRadius:"50%",background:"#10b981",
                      animation:"op-pulse 1.8s ease infinite"
                    }}/>
                    <span style={{fontSize:12.5,fontWeight:700,color:C.green}}>Đang hoạt động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background:C.bgCard,borderRadius:18,
              border:`1px solid ${C.ink6}`,
              boxShadow:"0 1px 4px rgba(0,0,0,.04)",
              overflow:"hidden",
              animation:"slideup 0.45s ease 0.28s both",
            }}>
              <div style={{height:3,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24)`}}/>
              <div style={{padding:22}}>
                <SectionHead label="Hiệu suất công việc" icon="📊" C={C}/>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {SKILLS.map((s,i)=><SkillBar key={s.label} skill={s} index={i} C={C}/>)}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div style={{
              background:C.bgCard,borderRadius:18,
              border:`1px solid ${C.ink6}`,
              boxShadow:"0 1px 4px rgba(0,0,0,.04)",
              overflow:"hidden",
              animation:"slideup 0.45s ease 0.34s both",
            }}>
              <div style={{height:3,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24)`}}/>
              <div style={{padding:22}}>
                <SectionHead label="Thành tích nổi bật" icon="🏆" C={C}/>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {ACHIEVEMENTS.map(a=><AchievementBadge key={a.id} badge={a} C={C}/>)}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Activity */}
          <div style={{
            background:C.bgCard,borderRadius:18,
            border:`1px solid ${C.ink6}`,
            boxShadow:"0 1px 4px rgba(0,0,0,.04)",
            overflow:"hidden",
            animation:"slideup 0.45s ease 0.24s both",
            display:"flex",flexDirection:"column",
          }}>
            <div style={{
              height:3,
              background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24,${C.or5},${C.or1})`,
              backgroundSize:"200% 100%",
              animation:"shimmer 4s linear infinite",
            }}/>
            <div style={{padding:22,display:"flex",flexDirection:"column",flex:1}}>
              <SectionHead label="Hoạt động trong ca" icon="⏱️"
                action={
                  <div style={{
                    display:"flex",alignItems:"center",gap:6,
                    padding:"4px 10px",borderRadius:8,
                    background:C.or3,border:`1px solid ${C.or4}`,
                  }}>
                    <div style={{
                      width:6,height:6,borderRadius:"50%",background:C.or1,
                      animation:"op-pulse 1.6s ease infinite"
                    }}/>
                    <span style={{fontSize:10.5,fontWeight:800,color:C.or1,letterSpacing:0.5}}>LIVE</span>
                  </div>
                }
                C={C}/>

              <div style={{display:"flex",flexDirection:"column",flex:1}}>
                {ACTIVITY_LOG.map((item,i)=>(
                  <ActivityItem key={i} item={item} index={i} isLast={i===ACTIVITY_LOG.length-1} C={C}/>
                ))}
              </div>

              {/* Footer — today summary */}
              <div style={{
                marginTop:16,padding:14,borderRadius:12,
                background:`linear-gradient(135deg,${C.or3},${C.bgCard})`,
                border:`1px solid ${C.or4}`,
              }}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{
                      width:32,height:32,borderRadius:9,
                      background:`linear-gradient(135deg,${C.or1},${C.or5})`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      boxShadow:`0 3px 10px ${C.or1}40`,fontSize:15
                    }}>📊</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:800,color:C.ink}}>Doanh thu ca hôm nay</div>
                      <div style={{fontSize:10.5,color:C.ink4,fontWeight:500}}>Từ {ACTIVITY_LOG.length * 31} giao dịch</div>
                    </div>
                  </div>
                  <div style={{fontSize:18,fontWeight:900,color:C.or1,letterSpacing:"-0.3px"}}>
                    8.470.000đ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}