import React, { useState, useMemo, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

/* ═══════════════════════════════════════════════════════════
   HỖ TRỢ KHÁCH HÀNG — Gấu Phim
   Dark mode + Clean layout + Realtime indicator
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
};

const STATUS_KEYS = {
  "Chờ phản hồi": { colorKey:"or1",   dot:true  },
  "Đang xử lý":   { colorKey:"amber", dot:true  },
  "Đã hoàn thành":{ colorKey:"green", dot:false },
  "Đã đóng":      { colorKey:"ink3",  dot:false },
  "Chuyển Admin": { colorKey:"red",   dot:false },
};

const PRIORITY_KEYS = {
  "Thấp":        "green",
  "Bình thường": "blue",
  "Cao":         "amber",
  "Khẩn cấp":    "red",
};

const CATEGORY_KEYS = {
  "Hỏi thông tin":     "blue",
  "Khiếu nại":         "red",
  "Báo lỗi":           "amber",
  "Yêu cầu hoàn tiền": "or1",
};

// ─── HELPERS ───────────────────────────────────────────────────────────────
const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toLocaleDateString("vi-VN");

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
const TICKETS_RAW = [
  {
    id: "TK-001", name: "Nguyễn Văn An", email: "nguyenvanan@gmail.com",
    subject: "Không đặt được vé phim Avengers",
    message: "Tôi đã thử thanh toán nhiều lần nhưng hệ thống báo lỗi. Mã lỗi hiển thị: PAYMENT_FAILED_4023. Giao dịch vẫn bị trừ tiền nhưng vé chưa được xác nhận.",
    category: "Báo lỗi", priority: "Cao", status: "Đang xử lý",
    date: "22/05/2026", time: "14:32", isNew: true,
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chào anh/chị, chúng tôi đang kiểm tra lại giao dịch. Vui lòng cho biết số điện thoại đăng ký tài khoản.", time: "14:45" },
    ],
  },
  {
    id: "TK-002", name: "Trần Thị Bình", email: "tranthibinh@gmail.com",
    subject: "Yêu cầu hoàn tiền vé suất chiếu 20:00",
    message: "Tôi đã đặt vé suất 20:00 ngày 21/05 nhưng gia đình có việc đột xuất không xem được. Xin được hoàn lại tiền theo chính sách hoàn vé của rạp.",
    category: "Yêu cầu hoàn tiền", priority: "Bình thường", status: "Chờ phản hồi",
    date: "21/05/2026", time: "09:15", isNew: true, replies: [],
  },
  {
    id: "TK-003", name: "Lê Hoàng Cường", email: "lehcuong@gmail.com",
    subject: "Hỏi về chương trình ưu đãi hội viên",
    message: "Cho tôi hỏi hội viên Vàng được giảm giá bao nhiêu phần trăm khi mua vé cuối tuần?",
    category: "Hỏi thông tin", priority: "Thấp", status: "Đã hoàn thành",
    date: "20/05/2026", time: "16:50", isNew: false,
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Hội viên Vàng được giảm 15% vé cuối tuần và 20% vé ngày thường. Ưu đãi áp dụng tối đa 2 vé/lần đặt.", time: "17:10" },
    ],
  },
  {
    id: "TK-004", name: "Phạm Minh Đức", email: "phamminhduc@gmail.com",
    subject: "Ghế ngồi bị hỏng, ảnh hưởng trải nghiệm xem phim",
    message: "Tôi đặt ghế C5 phòng 2 tối qua. Ghế bị hỏng lò xo, không ngồi được thoải mái suốt 2 tiếng xem phim.",
    category: "Khiếu nại", priority: "Khẩn cấp", status: "Chuyển Admin",
    date: "22/05/2026", time: "22:05", isNew: true,
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chúng tôi thành thật xin lỗi về sự cố này. Trường hợp đã được chuyển lên cấp quản lý.", time: "22:30" },
    ],
  },
  {
    id: "TK-005", name: "Hoàng Thị Lan", email: "hoangtilan@gmail.com",
    subject: "App bị treo khi chọn ghế",
    message: "Ứng dụng điện thoại (iOS 17.4) bị treo hoàn toàn ở bước chọn ghế. Tôi đã thử xoá và cài lại nhưng vẫn gặp lỗi tương tự.",
    category: "Báo lỗi", priority: "Cao", status: "Đang xử lý",
    date: "22/05/2026", time: "11:20", isNew: false, replies: [],
  },
  {
    id: "TK-006", name: "Vũ Quốc Toản", email: "vuquoctoan@gmail.com",
    subject: "Không nhận được email xác nhận vé",
    message: "Tôi đã thanh toán thành công (đã trừ tiền) nhưng sau 30 phút vẫn không nhận được email xác nhận vé.",
    category: "Báo lỗi", priority: "Bình thường", status: "Đã đóng",
    date: "19/05/2026", time: "20:40", isNew: false,
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chúng tôi đã gửi lại email xác nhận. Anh/chị vui lòng kiểm tra hộp thư.", time: "21:00" },
      { from: "user", name: "Vũ Quốc Toản", content: "Đã nhận được rồi ạ. Cảm ơn!", time: "21:05" },
    ],
  },
];

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────
function StatusChip({status,C}){
  const key=STATUS_KEYS[status]||STATUS_KEYS["Đã đóng"];
  const color=C[key.colorKey];
  const bgKey = key.colorKey==="or1" ? "or3" : `${key.colorKey}Bg`;
  const bdrKey = key.colorKey==="or1" ? "or4" : `${key.colorKey}Bdr`;
  return(<span style={{
    display:"inline-flex",alignItems:"center",gap:5,
    padding:"4px 10px",borderRadius:20,fontSize:11.5,fontWeight:700,
    color,border:`1px solid ${C[bdrKey]}`,background:C[bgKey],whiteSpace:"nowrap"
  }}>
    <span style={{
      width:6,height:6,borderRadius:"50%",background:color,
      animation:key.dot?"op-pulse 1.8s ease infinite":"none"
    }}/>
    {status}
  </span>);
}

function PriorityChip({priority,C}){
  const key=PRIORITY_KEYS[priority]||"blue";
  return(<span style={{
    padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:800,
    color:C[key],background:C[`${key}Bg`],border:`1px solid ${C[`${key}Bdr`]}`,
    whiteSpace:"nowrap",display:"inline-block"
  }}>{priority}</span>);
}

function CategoryChip({category,C}){
  const key=CATEGORY_KEYS[category]||"blue";
  const bgKey = key==="or1" ? "or3" : `${key}Bg`;
  const bdrKey = key==="or1" ? "or4" : `${key}Bdr`;
  return(<span style={{
    padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:700,
    color:C[key],background:C[bgKey],border:`1px solid ${C[bdrKey]}`,
    whiteSpace:"nowrap",display:"inline-block"
  }}>{category}</span>);
}

function Btn({children,variant="primary",size="md",icon,onClick,full,disabled,C}){
  const[h,hov]=useHover();
  const pad=size==="sm"?"6px 14px":size==="xs"?"4px 10px":"10px 22px";
  const fs=size==="sm"?12:size==="xs"?11:13.5;
  const styles={
    primary:{background:disabled?C.ink5:h?C.or2:C.or1,color:"#fff",border:"none",boxShadow:disabled?"none":h?"0 6px 20px rgba(249,115,22,.4)":"0 3px 10px rgba(249,115,22,.25)",transform:(!disabled&&h)?"translateY(-1px)":"none"},
    ghost:{background:h?C.ink6:"transparent",color:C.ink3,border:`1.5px solid ${C.ink5}`},
    danger:{background:C.redBg,color:C.red,border:`1px solid ${C.redBdr}`},
    success:{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBdr}`},
    warn:{background:C.amberBg,color:C.amber,border:`1px solid ${C.amberBdr}`},
    violet:{background:C.violetBg,color:C.violet,border:`1px solid ${C.violetBdr}`},
  };
  return(<button onClick={disabled?undefined:onClick} {...(disabled?{}:hov)} disabled={disabled} style={{
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    padding:pad,borderRadius:10,fontSize:fs,fontWeight:700,
    cursor:disabled?"not-allowed":"pointer",outline:"none",
    transition:"all 0.18s",width:full?"100%":"auto",border:"none",...styles[variant]
  }}>
    {icon&&<span style={{fontSize:fs+1}}>{icon}</span>}{children}
  </button>);
}

function StatCard({label,value,emoji,accent,trend,delay=0,C}){
  const[h,hov]=useHover();
  const trendColor = trend>=0 ? C.green : C.red;
  return(<div {...hov} style={{
    background:C.bgCard,borderRadius:16,border:`1px solid ${C.ink6}`,
    padding:"16px 18px",position:"relative",overflow:"hidden",
    boxShadow:h?"0 8px 24px rgba(0,0,0,.09)":"0 2px 6px rgba(0,0,0,.04)",
    transform:h?"translateY(-3px)":"none",transition:"all 0.2s",
    animationDelay:`${delay}s`,animation:"slideup 0.4s ease both",
  }}>
    <div style={{position:"absolute",top:-30,right:-30,width:90,height:90,borderRadius:"50%",background:`${accent}18`,filter:"blur(24px)",pointerEvents:"none"}}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:"0.8px",textTransform:"uppercase",color:C.ink4,marginBottom:5}}>{label}</div>
        <div style={{fontSize:26,fontWeight:900,color:C.ink,lineHeight:1,letterSpacing:"-1px"}}>{value}</div>
        {trend!==undefined&&(
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}>
            <span style={{fontSize:10,fontWeight:800,color:trendColor,background:trend>=0?C.greenBg:C.redBg,padding:"1px 5px",borderRadius:5}}>
              {trend>=0?"▲":"▼"} {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      <div style={{width:44,height:44,borderRadius:13,background:`${accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{emoji}</div>
    </div>
  </div>);
}

// ─── TICKET DETAIL DRAWER ──────────────────────────────────────────────────
function TicketDrawer({ticket,onClose,onReply,onStatusChange,onTransfer,toastFn,C}){
  const[reply,setReply]=useState("");
  const[tab,setTab]=useState("info");
  const isMobile=useIsMobile();

  const handleReply=()=>{
    if(!reply.trim())return;
    onReply(ticket.id,reply.trim());
    setReply("");
    toastFn("📨 Đã gửi phản hồi đến khách hàng");
  };

  const tabs=[
    {k:"info",    label:"Thông tin", icon:"📋"},
    {k:"chat",    label:`Trao đổi${ticket.replies.length>0?` (${ticket.replies.length})`:""}`, icon:"💬"},
    {k:"actions", label:"Hành động", icon:"⚡"},
  ];

  return(<>
    <div style={{position:"fixed",inset:0,background:"rgba(9,9,11,.55)",backdropFilter:"blur(4px)",zIndex:999,animation:"fadein 0.2s ease"}} onClick={onClose}/>
    <div style={{
      position:"fixed",top:0,right:0,bottom:0,
      width:isMobile?"100vw":"min(620px,100vw)",
      background:C.bgCard,boxShadow:"-8px 0 40px rgba(0,0,0,.18)",
      zIndex:1000,overflowY:"auto",animation:"slidefromright 0.3s cubic-bezier(.4,0,.2,1)",
      display:"flex",flexDirection:"column"
    }}>
      {/* Header */}
      <div style={{position:"sticky",top:0,background:C.bgCard,borderBottom:`1px solid ${C.ink6}`,padding:"16px 20px",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{minWidth:0,flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <span style={{
                padding:"2px 8px",borderRadius:6,fontSize:10.5,fontWeight:800,
                color:C.or1,background:C.or3,border:`1px solid ${C.or4}`,
                fontFamily:"'JetBrains Mono',monospace",letterSpacing:0.5
              }}>{ticket.id}</span>
              <StatusChip status={ticket.status} C={C}/>
            </div>
            <div style={{fontSize:15,fontWeight:900,color:C.ink,lineHeight:1.3}}>{ticket.subject}</div>
          </div>
          <button onClick={onClose} style={{
            width:34,height:34,borderRadius:9,border:`1.5px solid ${C.ink5}`,
            background:C.ink6,cursor:"pointer",fontSize:16,
            display:"flex",alignItems:"center",justifyContent:"center",color:C.ink3,flexShrink:0
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:2,background:C.ink6,borderRadius:10,padding:3}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,
              padding:"7px 10px",borderRadius:8,fontSize:11.5,fontWeight:700,
              border:"none",cursor:"pointer",transition:"all 0.18s",
              background:tab===t.k?C.bgCard:"transparent",
              color:tab===t.k?C.or1:C.ink4,
              boxShadow:tab===t.k?"0 2px 8px rgba(0,0,0,.08)":"none",
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:14,flex:1}}>

        {/* TAB INFO */}
        {tab==="info"&&(<>
          <div style={{
            background:C.bgDark,borderRadius:14,padding:18,
            position:"relative",overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.or1},#fbbf24)`}}/>
            <div style={{fontSize:11,fontWeight:700,color:"#71717a",textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>📝 Nội dung yêu cầu</div>
            <div style={{fontSize:13,color:"#e2e8f0",lineHeight:1.7,fontWeight:500}}>{ticket.message}</div>
          </div>

          <div style={{background:C.bgCard,borderRadius:16,border:`1px solid ${C.ink6}`,padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:3,height:14,borderRadius:2,background:`linear-gradient(180deg,${C.or1},#fbbf24)`}}/>
              <span style={{fontSize:10.5,fontWeight:900,letterSpacing:"1.2px",textTransform:"uppercase",color:C.ink3}}>👤 Khách hàng</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                ["👤 Họ tên", ticket.name],
                ["✉️ Email", ticket.email],
                ["📅 Ngày gửi", `${ticket.date} • ${ticket.time}`],
                ["🏷️ Loại", ticket.category],
              ].map(([l,v])=>(
                <div key={l} style={{padding:"9px 11px",borderRadius:9,background:C.ink6,border:`1px solid ${C.ink5}`}}>
                  <div style={{fontSize:9.5,color:C.ink4,fontWeight:700,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,color:C.ink,fontWeight:700,wordBreak:"break-word"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <PriorityChip priority={ticket.priority} C={C}/>
            <CategoryChip category={ticket.category} C={C}/>
          </div>
        </>)}

        {/* TAB CHAT */}
        {tab==="chat"&&(<>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* User original message */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:C.ink6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👤</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.ink}}>{ticket.name}</div>
                  <div style={{fontSize:10,color:C.ink4}}>{ticket.date} • {ticket.time}</div>
                </div>
                <span style={{padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,color:C.ink3,background:C.ink6}}>Khách hàng</span>
              </div>
              <div style={{marginLeft:isMobile?0:38,padding:"12px 14px",borderRadius:10,background:C.ink6,border:`1px solid ${C.ink5}`}}>
                <div style={{fontSize:13,color:C.ink2,lineHeight:1.7}}>{ticket.message}</div>
              </div>
            </div>

            {/* Replies */}
            {ticket.replies.map((r,i)=>{
              const isStaff=r.from==="staff";
              return(
                <div key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{
                      width:30,height:30,borderRadius:"50%",
                      background:isStaff?`linear-gradient(135deg,${C.or1},${C.or5})`:C.ink6,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:14
                    }}>{isStaff?"🎧":"👤"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.ink}}>{r.name}</div>
                      <div style={{fontSize:10,color:C.ink4}}>{r.time}</div>
                    </div>
                    <span style={{
                      padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:700,
                      color:isStaff?C.or1:C.ink3,background:isStaff?C.or3:C.ink6
                    }}>{isStaff?"Nhân viên":"Khách hàng"}</span>
                  </div>
                  <div style={{
                    marginLeft:isMobile?0:38,padding:"12px 14px",borderRadius:10,
                    background:isStaff?C.or3:C.ink6,
                    border:`1px solid ${isStaff?C.or4:C.ink5}`
                  }}>
                    <div style={{fontSize:13,color:C.ink2,lineHeight:1.7}}>{r.content}</div>
                  </div>
                </div>
              );
            })}

            {ticket.replies.length===0&&(
              <div style={{textAlign:"center",padding:"24px 0",color:C.ink4,fontSize:12.5}}>
                <div style={{fontSize:28,marginBottom:6,opacity:0.6}}>💬</div>
                Chưa có phản hồi nào
              </div>
            )}
          </div>

          {/* Reply box */}
          <div style={{background:C.bgCard,borderRadius:14,border:`1px solid ${C.ink6}`,padding:14,marginTop:"auto"}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.9px",textTransform:"uppercase",color:C.ink3,marginBottom:8}}>✍️ Phản hồi khách hàng</div>
            <textarea value={reply} onChange={e=>setReply(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              rows={3}
              style={{
                width:"100%",padding:"10px 12px",borderRadius:10,fontSize:13,
                border:`1.5px solid ${C.ink5}`,outline:"none",resize:"vertical",
                fontFamily:"inherit",boxSizing:"border-box",background:C.subtleBg,color:C.ink
              }}
              onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
              onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
              <Btn variant="primary" size="sm" icon="📨" onClick={handleReply} disabled={!reply.trim()} C={C}>
                Gửi phản hồi
              </Btn>
            </div>
          </div>
        </>)}

        {/* TAB ACTIONS */}
        {tab==="actions"&&(<>
          <div style={{background:C.bgCard,borderRadius:14,border:`1px solid ${C.ink6}`,padding:16}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.9px",textTransform:"uppercase",color:C.ink3,marginBottom:12}}>⚡ Cập nhật trạng thái</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {status:"Đang xử lý",    variant:"warn",    icon:"⚙️", accent:"#f59e0b"},
                {status:"Đã hoàn thành", variant:"success", icon:"✅", accent:"#10b981"},
                {status:"Đã đóng",       variant:"ghost",   icon:"🔒", accent:C.ink3},
                {status:"Chuyển Admin",  variant:"danger",  icon:"⬆️", accent:"#dc2626"},
              ].map(a=>(
                <button key={a.status} onClick={()=>{
                  onStatusChange(ticket.id,a.status);
                  toastFn(`✅ Đã chuyển sang "${a.status}"`);
                }} style={{
                  padding:"12px 10px",borderRadius:10,cursor:"pointer",
                  border:`1.5px solid ${C.ink5}`,background:C.subtleBg,
                  textAlign:"left",transition:"all 0.18s",
                  fontFamily:"inherit",
                }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.borderColor=a.accent;
                    e.currentTarget.style.background=C.ink6;
                    e.currentTarget.style.transform="translateY(-2px)";
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.borderColor=C.ink5;
                    e.currentTarget.style.background=C.subtleBg;
                    e.currentTarget.style.transform="translateY(0)";
                  }}
                >
                  <div style={{fontSize:14,marginBottom:4}}>{a.icon}</div>
                  <div style={{fontSize:12,fontWeight:800,color:C.ink}}>{a.status}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{background:C.amberBg,borderRadius:12,border:`1px solid ${C.amberBdr}`,padding:"14px 16px"}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.8px",textTransform:"uppercase",color:C.amber,marginBottom:6}}>⚠️ Lưu ý</div>
            <div style={{fontSize:12,color:C.ink2,lineHeight:1.6}}>
              Chuyển Admin khi yêu cầu vượt thẩm quyền (hoàn tiền lớn, khiếu nại nghiêm trọng). Hệ thống sẽ gửi thông báo cho cấp quản lý.
            </div>
          </div>

          <div style={{background:C.bgCard,borderRadius:14,border:`1px solid ${C.ink6}`,padding:16}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.9px",textTransform:"uppercase",color:C.ink3,marginBottom:12}}>🎯 Hành động nhanh</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Btn variant="ghost" size="sm" icon="📋" onClick={()=>toastFn("📋 Đã sao chép mã ticket")} C={C} full>
                Sao chép mã ticket
              </Btn>
              <Btn variant="ghost" size="sm" icon="📧" onClick={()=>toastFn("📧 Đã mở trình soạn email")} C={C} full>
                Gửi email trực tiếp
              </Btn>
              <Btn variant="ghost" size="sm" icon="🖨️" onClick={()=>toastFn("🖨️ Đã xuất PDF")} C={C} full>
                Xuất PDF ticket
              </Btn>
            </div>
          </div>
        </>)}
      </div>
    </div>
  </>);
}

// ─── ADD TICKET MODAL ──────────────────────────────────────────────────────
function AddTicketModal({isOpen,onClose,onSave,C}){
  const[form,setForm]=useState({
    name:"",email:"",subject:"",message:"",
    category:"Hỏi thông tin",priority:"Bình thường",status:"Chờ phản hồi"
  });
  const isMobile=useIsMobile();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const canSave=form.name&&form.email&&form.subject&&form.message;

  useEffect(()=>{
    if(isOpen)setForm({name:"",email:"",subject:"",message:"",category:"Hỏi thông tin",priority:"Bình thường",status:"Chờ phản hồi"});
  },[isOpen]);

  if(!isOpen)return null;

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

  const body=(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:14,overflowY:"auto",flex:1}}>
      <div style={{
        background:`linear-gradient(135deg,${C.or3},${C.or3})`,
        borderRadius:14,padding:"14px 16px",border:`1px solid ${C.or4}`,
        display:"flex",alignItems:"center",gap:12
      }}>
        <div style={{
          width:40,height:40,borderRadius:11,
          background:`linear-gradient(135deg,${C.or1},${C.or5})`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
          boxShadow:`0 4px 12px rgba(249,115,22,.3)`,flexShrink:0
        }}>🎧</div>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:C.ink}}>Tạo yêu cầu hỗ trợ</div>
          <div style={{fontSize:11.5,color:C.ink4,marginTop:2}}>Trường có dấu <span style={{color:C.or1}}>*</span> là bắt buộc</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
        <div>
          <label style={labelSt}>Tên khách hàng *</label>
          <input style={inputStyle} placeholder="Nguyễn Văn A"
            value={form.name} onChange={e=>set("name",e.target.value)}
            onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
            onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
        </div>
        <div>
          <label style={labelSt}>Email *</label>
          <input style={inputStyle} type="email" placeholder="email@gmail.com"
            value={form.email} onChange={e=>set("email",e.target.value)}
            onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
            onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
        </div>
      </div>

      <div>
        <label style={labelSt}>Chủ đề *</label>
        <input style={inputStyle} placeholder="VD: Không đặt được vé"
          value={form.subject} onChange={e=>set("subject",e.target.value)}
          onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
          onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
      </div>

      <div>
        <label style={labelSt}>Mô tả chi tiết *</label>
        <textarea style={{...inputStyle,height:"auto",padding:"10px 14px",resize:"vertical"}}
          rows={4} placeholder="Mô tả chi tiết vấn đề..."
          value={form.message} onChange={e=>set("message",e.target.value)}
          onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
          onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:12}}>
        {[
          {label:"Loại yêu cầu",key:"category",opts:["Hỏi thông tin","Khiếu nại","Báo lỗi","Yêu cầu hoàn tiền"]},
          {label:"Ưu tiên",    key:"priority",opts:["Thấp","Bình thường","Cao","Khẩn cấp"]},
          {label:"Trạng thái", key:"status",  opts:["Chờ phản hồi","Đang xử lý","Đã hoàn thành","Đã đóng"]},
        ].map(f=>(
          <div key={f.key}>
            <label style={labelSt}>{f.label}</label>
            <select style={inputStyle} value={form[f.key]} onChange={e=>set(f.key,e.target.value)}>
              {f.opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const footer=(
    <div style={{
      padding:"16px 20px",borderTop:`1px solid ${C.ink6}`,
      display:"flex",justifyContent:"flex-end",gap:10,
      background:C.bgCard,
    }}>
      <Btn variant="ghost" onClick={onClose} C={C}>Hủy</Btn>
      <Btn variant="primary" disabled={!canSave} icon="✚"
        onClick={()=>{if(canSave){onSave(form);onClose();}}} C={C}>
        Tạo yêu cầu
      </Btn>
    </div>
  );

  // Mobile: Bottom sheet
  if(isMobile){
    return(
      <div style={{position:"fixed",inset:0,zIndex:2000,animation:"fadein 0.2s ease"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(9,9,11,.65)",backdropFilter:"blur(8px)"}} onClick={onClose}/>
        <div style={{
          position:"absolute",left:0,right:0,bottom:0,
          background:C.bgCard,borderTopLeftRadius:22,borderTopRightRadius:22,
          maxHeight:"92vh",display:"flex",flexDirection:"column",
          animation:"slideup 0.3s cubic-bezier(.4,0,.2,1)",overflow:"hidden",
        }}>
          <div style={{height:4,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24,${C.or5},${C.or1})`,backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
          <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
            <div style={{width:40,height:4,borderRadius:99,background:C.ink5}}/>
          </div>
          {body}
          {footer}
        </div>
      </div>
    );
  }

  // Desktop: Modal centered
  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadein 0.2s ease"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(9,9,11,.65)",backdropFilter:"blur(8px)"}} onClick={onClose}/>
      <div style={{
        position:"relative",background:C.bgCard,borderRadius:22,
        width:"100%",maxWidth:640,boxShadow:"0 40px 100px rgba(0,0,0,.35)",
        display:"flex",flexDirection:"column",maxHeight:"90vh",overflow:"hidden",
        animation:"scalein 0.25s cubic-bezier(.22,1,.36,1)"
      }}>
        <div style={{height:4,background:`linear-gradient(90deg,${C.or1},${C.or5},#fbbf24,${C.or5},${C.or1})`,backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite"}}/>
        <div style={{position:"absolute",top:14,right:14,zIndex:10}}>
          <button onClick={onClose} style={{
            width:34,height:34,borderRadius:9,border:`1.5px solid ${C.ink5}`,
            background:C.ink6,cursor:"pointer",fontSize:16,
            display:"flex",alignItems:"center",justifyContent:"center",color:C.ink3
          }}>✕</button>
        </div>
        {body}
        {footer}
      </div>
    </div>
  );
}

// ─── FILTER DRAWER (Mobile) ────────────────────────────────────────────────
function FilterDrawer({isOpen,onClose,filterStatus,setFilterStatus,filterCategory,setFilterCategory,C}){
  if(!isOpen)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:2000,animation:"fadein 0.2s ease"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(9,9,11,.55)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div style={{
        position:"absolute",left:0,right:0,bottom:0,
        background:C.bgCard,borderTopLeftRadius:22,borderTopRightRadius:22,
        padding:"0 0 24px",maxHeight:"85vh",overflowY:"auto",
        animation:"slideup 0.3s cubic-bezier(.4,0,.2,1)"
      }}>
        <div style={{height:4,background:`linear-gradient(90deg,${C.or1},${C.or5})`}}/>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:40,height:4,borderRadius:99,background:C.ink5}}/>
        </div>
        <div style={{padding:"8px 20px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:15,fontWeight:800,color:C.ink}}>Bộ lọc</div>
            <button onClick={onClose} style={{
              width:30,height:30,borderRadius:8,border:`1.5px solid ${C.ink5}`,
              background:C.ink6,cursor:"pointer",fontSize:14,
              display:"flex",alignItems:"center",justifyContent:"center",color:C.ink3
            }}>✕</button>
          </div>

          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.9px",textTransform:"uppercase",color:C.ink3,marginBottom:10}}>Trạng thái</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
            {["Tất cả","Chờ phản hồi","Đang xử lý","Đã hoàn thành","Đã đóng","Chuyển Admin"].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)} style={{
                padding:"7px 14px",borderRadius:9,fontSize:12,fontWeight:700,
                cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit",
                background:filterStatus===s?`linear-gradient(135deg,${C.or1},${C.or5})`:C.subtleBg,
                color:filterStatus===s?"#fff":C.ink3,
                border:filterStatus===s?"none":`1.5px solid ${C.ink5}`,
                boxShadow:filterStatus===s?`0 3px 12px rgba(249,115,22,.3)`:"none",
              }}>{s}</button>
            ))}
          </div>

          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:"0.9px",textTransform:"uppercase",color:C.ink3,marginBottom:10}}>Loại yêu cầu</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {["Tất cả","Hỏi thông tin","Khiếu nại","Báo lỗi","Yêu cầu hoàn tiền"].map(c=>(
              <button key={c} onClick={()=>setFilterCategory(c)} style={{
                padding:"7px 14px",borderRadius:9,fontSize:12,fontWeight:700,
                cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit",
                background:filterCategory===c?`linear-gradient(135deg,${C.or1},${C.or5})`:C.subtleBg,
                color:filterCategory===c?"#fff":C.ink3,
                border:filterCategory===c?"none":`1.5px solid ${C.ink5}`,
                boxShadow:filterCategory===c?`0 3px 12px rgba(249,115,22,.3)`:"none",
              }}>{c}</button>
            ))}
          </div>

          <Btn variant="primary" full onClick={onClose} C={C}>Áp dụng bộ lọc</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── TICKET CARD (Mobile) ──────────────────────────────────────────────────
function TicketCard({ticket,idx,onClick,C}){
  const[h,hov]=useHover();
  const isNew=ticket.isNew;
  return(<div {...hov} onClick={onClick} style={{
    background:isNew?C.or3:C.bgCard,borderRadius:14,
    border:h?`1.5px solid ${C.or1}`:`1.5px solid ${isNew?C.or4:C.ink6}`,
    boxShadow:h?"0 4px 20px rgba(249,115,22,.12)":isNew?"0 2px 8px rgba(249,115,22,.08)":"0 1px 4px rgba(0,0,0,.04)",
    transition:"all 0.18s",cursor:"pointer",overflow:"hidden",
    animation:`slideup 0.35s ease ${idx*.04}s both`,position:"relative"
  }}>
    {isNew&&<div style={{position:"absolute",top:0,left:0,width:3,bottom:0,background:`linear-gradient(180deg,${C.or1},#fbbf24)`,borderRadius:"2px 0 0 2px"}}/>}
    <div style={{padding:"14px 14px 14px 18px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          {isNew&&<span style={{padding:"1px 6px",borderRadius:5,fontSize:9.5,fontWeight:800,background:C.or1,color:"#fff"}}>NEW</span>}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,fontWeight:800,color:C.or1}}>{ticket.id}</span>
        </div>
        <StatusChip status={ticket.status} C={C}/>
      </div>

      <div style={{fontSize:14,fontWeight:800,color:C.ink,marginBottom:8,lineHeight:1.35}}>{ticket.subject}</div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
        <span style={{fontSize:12,color:C.ink3}}>👤 {ticket.name}</span>
        <span style={{fontSize:11,color:C.ink4}}>{ticket.date} • {ticket.time}</span>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        <PriorityChip priority={ticket.priority} C={C}/>
        <CategoryChip category={ticket.category} C={C}/>
        {ticket.replies.length>0&&(
          <span style={{
            padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:700,
            color:C.ink3,background:C.ink6,border:`1px solid ${C.ink5}`,
            display:"inline-flex",alignItems:"center",gap:4
          }}>💬 {ticket.replies.length}</span>
        )}
      </div>
    </div>
  </div>);
}

// ─── TICKET ROW (Desktop) ──────────────────────────────────────────────────
function TicketRow({ticket,idx,onClick,C}){
  const[h,hov]=useHover();
  const isNew=ticket.isNew;
  return(<div {...hov} onClick={onClick} style={{
    background:isNew?C.or3:C.bgCard,borderRadius:12,
    border:h?`1.5px solid ${C.or1}`:`1.5px solid ${isNew?C.or4:C.ink6}`,
    boxShadow:h?"0 4px 20px rgba(249,115,22,.12)":isNew?"0 2px 8px rgba(249,115,22,.08)":"0 1px 4px rgba(0,0,0,.04)",
    transition:"all 0.18s",cursor:"pointer",overflow:"hidden",
    animation:`slideup 0.35s ease ${idx*.04}s both`,position:"relative"
  }}>
    {isNew&&<div style={{position:"absolute",top:0,left:0,width:3,bottom:0,background:`linear-gradient(180deg,${C.or1},#fbbf24)`,borderRadius:"2px 0 0 2px"}}/>}
    <div style={{padding:"14px 18px"}}>
      <div style={{display:"grid",gridTemplateColumns:"80px 180px 1fr 90px 140px 100px 60px",gap:14,alignItems:"center"}}>

        {/* ID */}
        <div>
          {isNew&&<span style={{padding:"1px 6px",borderRadius:5,fontSize:9.5,fontWeight:800,background:C.or1,color:"#fff",display:"inline-block",marginBottom:3}}>NEW</span>}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:800,color:C.or1}}>{ticket.id}</div>
        </div>

        {/* Customer */}
        <div style={{minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:800,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ticket.name}</div>
          <div style={{fontSize:11,color:C.ink4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ticket.email}</div>
        </div>

        {/* Subject + Category */}
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ticket.subject}</div>
          <CategoryChip category={ticket.category} C={C}/>
        </div>

        {/* Priority */}
        <div><PriorityChip priority={ticket.priority} C={C}/></div>

        {/* Status */}
        <div><StatusChip status={ticket.status} C={C}/></div>

        {/* Date */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:C.ink3}}>{ticket.date}</div>
          <div style={{fontSize:10,color:C.ink4}}>{ticket.time}</div>
        </div>

        {/* Replies */}
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:13}}>💬</span>
          <span style={{fontSize:12,fontWeight:700,color:C.ink3}}>{ticket.replies.length}</span>
        </div>
      </div>
    </div>
  </div>);
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Hotrokhachhang(){
  const { colorMode } = useColorMode();
  const C = useTheme(colorMode === "dark");

  const[tickets,setTickets]=useState(TICKETS_RAW);
  const[selected,setSelected]=useState(null);
  const[search,setSearch]=useState("");
  const[filterStatus,setFilterStatus]=useState("Tất cả");
  const[filterCategory,setFilterCategory]=useState("Tất cả");
  const[showAddModal,setShowAddModal]=useState(false);
  const[showFilter,setShowFilter]=useState(false);
  const[toast,setToast]=useState(null);
  const isMobile=useIsMobile();

  const toastFn=msg=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const filtered=useMemo(()=>{
    return tickets.filter(t=>{
      const q=search.toLowerCase();
      const mS=!q||t.name.toLowerCase().includes(q)||t.email.toLowerCase().includes(q)||
               t.subject.toLowerCase().includes(q)||t.id.toLowerCase().includes(q);
      const mSt=filterStatus==="Tất cả"||t.status===filterStatus;
      const mC=filterCategory==="Tất cả"||t.category===filterCategory;
      return mS&&mSt&&mC;
    });
  },[tickets,search,filterStatus,filterCategory]);

  const counts={
    total:tickets.length,
    waiting:tickets.filter(t=>t.status==="Chờ phản hồi").length,
    processing:tickets.filter(t=>t.status==="Đang xử lý").length,
    done:tickets.filter(t=>t.status==="Đã hoàn thành").length,
    urgent:tickets.filter(t=>t.priority==="Khẩn cấp"&&(t.status==="Chờ phản hồi"||t.status==="Đang xử lý")).length,
  };

  const handleAdd=form=>{
    setTickets(prev=>[{
      ...form,
      id:`TK-${String(prev.length+1).padStart(3,"0")}`,
      date:today(),
      time:now(),
      isNew:true,
      replies:[],
    },...prev]);
    toastFn("✅ Đã tạo yêu cầu mới");
  };

  const handleReply=(id,content)=>{
    setTickets(prev=>prev.map(t=>t.id===id?{
      ...t,
      replies:[...t.replies,{
        from:"staff",
        name:"Nhân viên CSKH",
        content,
        time:now(),
      }],
    }:t));
    setSelected(prev=>prev?.id===id?{
      ...prev,
      replies:[...prev.replies,{from:"staff",name:"Nhân viên CSKH",content,time:now()}],
    }:prev);
  };

  const handleStatusChange=(id,status)=>{
    setTickets(prev=>prev.map(t=>t.id===id?{...t,status,isNew:false}:t));
    setSelected(prev=>prev?.id===id?{...prev,status,isNew:false}:prev);
  };

  const hasFilter=filterStatus!=="Tất cả"||filterCategory!=="Tất cả";
  const resetFilters=()=>{setFilterStatus("Tất cả");setFilterCategory("Tất cả");setSearch("");};

  const STYLES=`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;}
    @keyframes slideup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadein{from{opacity:0}to{opacity:1}}
    @keyframes scalein{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes slidein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slidefromright{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes op-pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
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

      {selected&&<TicketDrawer
        ticket={tickets.find(t=>t.id===selected.id)||selected}
        onClose={()=>setSelected(null)}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
        toastFn={toastFn}
        C={C}
      />}

      <AddTicketModal
        isOpen={showAddModal} onClose={()=>setShowAddModal(false)}
        onSave={handleAdd} C={C}
      />

      <FilterDrawer
        isOpen={showFilter} onClose={()=>setShowFilter(false)}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        C={C}
      />

      <div style={{maxWidth:1400,margin:"0 auto"}}>

        {/* Page header */}
        <div style={{
          display:"flex",alignItems:isMobile?"flex-start":"center",
          justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap",
          animation:"slideup 0.4s ease both"
        }}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{
              width:isMobile?44:52,height:isMobile?44:52,borderRadius:14,
              background:`linear-gradient(135deg,${C.or1},#fbbf24)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:isMobile?20:24,boxShadow:`0 8px 24px rgba(249,115,22,.38)`,flexShrink:0
            }}>🎧</div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <h1 style={{fontSize:isMobile?20:26,fontWeight:900,color:C.ink,letterSpacing:"-0.6px",lineHeight:1.1,margin:0}}>
                  Hỗ trợ khách hàng
                </h1>
                {counts.urgent>0&&(
                  <span style={{
                    padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:800,
                    color:C.red,background:C.redBg,border:`1px solid ${C.redBdr}`,
                    animation:"op-pulse 1.8s ease infinite"
                  }}>{counts.urgent} khẩn cấp</span>
                )}
              </div>
              <p style={{fontSize:isMobile?11:12.5,color:C.ink4,marginTop:3,fontWeight:500,margin:0}}>
                Quản lý yêu cầu, phản hồi và khiếu nại của khách hàng
              </p>
            </div>
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {counts.waiting>0&&!isMobile&&(
              <div style={{
                display:"flex",alignItems:"center",gap:6,
                padding:"7px 12px",borderRadius:9,
                background:C.or3,border:`1px solid ${C.or4}`,
              }}>
                <span style={{fontSize:12}}>📬</span>
                <span style={{fontSize:11.5,fontWeight:800,color:C.or1}}>{counts.waiting} chờ</span>
              </div>
            )}
            <Btn variant="primary" icon="✚" onClick={()=>setShowAddModal(true)} C={C}>
              Tạo yêu cầu
            </Btn>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          <StatCard label="Tổng yêu cầu"  value={counts.total}      emoji="🎫" accent={C.or1}   trend={6.8}  delay={0}    C={C}/>
          <StatCard label="Chờ phản hồi"  value={counts.waiting}    emoji="📬" accent={C.or5}   trend={12.4} delay={0.05} C={C}/>
          <StatCard label="Đang xử lý"    value={counts.processing} emoji="⚙️" accent="#f59e0b" trend={-3.2} delay={0.1}  C={C}/>
          <StatCard label="Đã hoàn thành" value={counts.done}       emoji="✅" accent={C.green}  trend={8.1}  delay={0.15} C={C}/>
        </div>

        {/* Filter bar */}
        <div style={{
          background:C.bgCard,borderRadius:14,border:`1px solid ${C.ink6}`,
          boxShadow:"0 2px 8px rgba(0,0,0,.04)",marginBottom:12,overflow:"hidden",
        }}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.ink6}`,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:"1 1 220px",minWidth:0}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,pointerEvents:"none",opacity:0.6}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Tìm tên, email, mã ticket..."
                style={{
                  width:"100%",height:38,paddingLeft:32,paddingRight:10,
                  borderRadius:9,fontSize:12.5,fontWeight:500,
                  background:C.subtleBg,border:`1.5px solid ${C.ink5}`,
                  outline:"none",color:C.ink,
                }}
                onFocus={e=>e.target.style.border=`1.5px solid ${C.or1}`}
                onBlur={e=>e.target.style.border=`1.5px solid ${C.ink5}`}/>
            </div>

            {isMobile?(
              <button onClick={()=>setShowFilter(true)} style={{
                display:"flex",alignItems:"center",gap:6,height:38,padding:"0 14px",
                borderRadius:9,fontSize:12,fontWeight:700,
                border:`1.5px solid ${hasFilter?C.or1:C.ink5}`,
                background:hasFilter?C.or3:C.subtleBg,
                color:hasFilter?C.or1:C.ink3,cursor:"pointer",
              }}>
                ⚙️ Lọc {hasFilter&&<span style={{
                  padding:"1px 5px",borderRadius:9,fontSize:10,fontWeight:800,
                  background:C.or1,color:"#fff",minWidth:16,textAlign:"center"
                }}>{[filterStatus!=="Tất cả",filterCategory!=="Tất cả"].filter(Boolean).length}</span>}
              </button>
            ):(
              <>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{
                  flex:"0 1 160px",height:38,padding:"0 10px",borderRadius:9,
                  fontSize:12.5,fontWeight:600,
                  background:C.subtleBg,border:`1.5px solid ${C.ink5}`,
                  outline:"none",color:C.ink3,cursor:"pointer",
                }}>
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option>Chờ phản hồi</option>
                  <option>Đang xử lý</option>
                  <option>Đã hoàn thành</option>
                  <option>Đã đóng</option>
                  <option>Chuyển Admin</option>
                </select>
                <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} style={{
                  flex:"0 1 160px",height:38,padding:"0 10px",borderRadius:9,
                  fontSize:12.5,fontWeight:600,
                  background:C.subtleBg,border:`1.5px solid ${C.ink5}`,
                  outline:"none",color:C.ink3,cursor:"pointer",
                }}>
                  <option value="Tất cả">Tất cả loại</option>
                  <option>Hỏi thông tin</option>
                  <option>Khiếu nại</option>
                  <option>Báo lỗi</option>
                  <option>Yêu cầu hoàn tiền</option>
                </select>
                {hasFilter&&<Btn variant="ghost" size="sm" onClick={resetFilters} C={C}>✕ Xóa</Btn>}
              </>
            )}
          </div>

          {/* List */}
          <div style={{padding:"10px"}}>
            {filtered.length===0?(
              <div style={{textAlign:"center",padding:"48px 20px",color:C.ink4}}>
                <div style={{fontSize:44,marginBottom:12,opacity:0.7}}>🎧</div>
                <div style={{fontSize:14.5,fontWeight:800,color:C.ink3,marginBottom:5}}>Không tìm thấy yêu cầu nào</div>
                <div style={{fontSize:12.5,marginBottom:16}}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                {hasFilter&&(
                  <Btn variant="ghost" size="sm" onClick={resetFilters} C={C}>✕ Xóa bộ lọc</Btn>
                )}
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {filtered.map((t,idx)=>
                  isMobile
                    ?<TicketCard key={t.id} ticket={t} idx={idx} onClick={()=>setSelected(t)} C={C}/>
                    :<TicketRow  key={t.id} ticket={t} idx={idx} onClick={()=>setSelected(t)} C={C}/>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding:"12px 16px",borderTop:`1px solid ${C.ink6}`,
            display:"flex",justifyContent:"space-between",alignItems:"center",
            flexWrap:"wrap",gap:8,
          }}>
            <span style={{fontSize:12,color:C.ink4,fontWeight:600}}>
              Hiển thị <strong style={{color:C.ink}}>{filtered.length}</strong> / {tickets.length} yêu cầu
            </span>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:11,color:C.ink4,fontWeight:500}}>⏱ Cập nhật realtime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}