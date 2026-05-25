import React, { useState, useMemo } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, SimpleGrid,
  Grid, Avatar, AvatarBadge, Textarea,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, ModalFooter, useDisclosure,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  keyframes,
} from "@chakra-ui/react";
import {
  MdPerson, MdSearch, MdFilterList, MdVisibility, MdLock,
  MdLockOpen, MdStar, MdEmail, MdPhone, MdCalendarToday,
  MdLocationOn, MdHistory, MdClose, MdCheckCircle,
  MdAdd, MdRemove, MdNotifications, MdArrowBack,
  MdBlock, MdVerified, MdTrendingUp, MdCardMembership,
  MdFavorite, MdShoppingCart, MdAttachMoney, MdWarning,
  MdPeople, MdPersonOff, MdDiamond, MdWorkspacePremium,
} from "react-icons/md";
import {
  FaUsers, FaUserCheck, FaUserSlash, FaCrown,
  FaMedal, FaTicketAlt, FaCoins, FaHeart,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.45}`;

// ─── Member rank config ──────────────────────────────────────────────────────
const RANK_CONFIG = {
  "Đồng":    { color: "#92400e", bg: "#fef3c7", border: "#fcd34d", icon: FaMedal,           grad: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
  "Bạc":     { color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", icon: FaMedal,           grad: "linear-gradient(135deg,#94a3b8,#cbd5e1)" },
  "Vàng":    { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: FaCrown,           grad: "linear-gradient(135deg,#f59e0b,#f97316)" },
  "Kim cương":{ color: "#4f46e5",bg: "#eef2ff", border: "#a5b4fc", icon: MdDiamond,         grad: "linear-gradient(135deg,#6366f1,#818cf8)" },
};

const STATUS_CONFIG = {
  "Hoạt động": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Bị khóa":   { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
};

// ─── Generate users ──────────────────────────────────────────────────────────
const FIRST_NAMES = ["Nguyễn","Trần","Lê","Phạm","Hoàng","Đỗ","Vũ","Bùi","Đặng","Ngô"];
const LAST_NAMES  = ["Văn An","Thị Bình","Minh Châu","Thu Dung","Văn Em","Thị Phương","Ngọc Giang","Anh Hùng","Thị Lan","Văn Khoa","Thị Mai","Bảo Nam"];
const MOVIES_FAV  = ["Avengers: Endgame","Spider-Man: No Way Home","Doctor Strange 2","Thor: Love & Thunder","Black Panther","Ant-Man 3"];
const RANKS       = ["Đồng","Đồng","Bạc","Bạc","Vàng","Kim cương"];
const CITIES      = ["Hồ Chí Minh","Hà Nội","Đà Nẵng","Buôn Ma Thuột","Cần Thơ","Hải Phòng"];

function genUsers() {
  return Array.from({ length: 52 }, (_, i) => {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
    const tickets = Math.floor(Math.random() * 80) + 1;
    const points  = tickets * Math.floor(Math.random() * 50 + 10);
    const d = new Date(2024, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1);
    const joinDate = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
    const lastActive = `${Math.floor(Math.random()*30)+1} ngày trước`;
    const spent = tickets * (Math.floor(Math.random()*80000)+50000);
    return {
      id: `UID${String(i+1001).padStart(5,"0")}`,
      name,
      email: `${fn.toLowerCase()}${i+1}@gmail.com`,
      phone: `09${Math.floor(10000000+Math.random()*90000000)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      city: CITIES[Math.floor(Math.random()*CITIES.length)],
      rank,
      status: Math.random() > 0.12 ? "Hoạt động" : "Bị khóa",
      joinDate,
      lastActive,
      tickets,
      points,
      spent,
      favorites: MOVIES_FAV.slice(0, Math.floor(Math.random()*4)+1),
      pointHistory: [
        { date: "22/05/2026", action: "Mua vé Spider-Man", delta: +120, balance: points },
        { date: "18/05/2026", action: "Đổi điểm ưu đãi",  delta: -200, balance: points - 120 },
        { date: "10/05/2026", action: "Mua vé Avengers",   delta: +95,  balance: points - 120 + 200 },
        { date: "01/05/2026", action: "Mua vé Doctor Strange", delta: +80, balance: points - 120 + 200 - 95 },
      ],
      ticketHistory: [
        { id:`TK${1001+i}`, movie:"Spider-Man: No Way Home", date:"22/05/2026", seat:"F12,F13", amount:240000, status:"Đã check-in" },
        { id:`TK${1002+i}`, movie:"Avengers: Endgame",       date:"18/05/2026", seat:"C8",      amount:120000, status:"Đã check-in" },
        { id:`TK${1003+i}`, movie:"Doctor Strange 2",         date:"05/05/2026", seat:"D5,D6",   amount:220000, status:"Đã hủy" },
      ],
    };
  });
}

const ALL_USERS = genUsers();
const fmt = (n) => n.toLocaleString("vi-VN") + "₫";
const PAGE_SIZE = 12;

// ─── Shared styles ───────────────────────────────────────────────────────────
const inputSx = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "13px", fontWeight: "500",
  h: { base: "42px", md: "36px" },
  _placeholder: { color: "#b0bac8" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316" },
  transition: "all 0.2s",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  const cfg = RANK_CONFIG[rank] || RANK_CONFIG["Đồng"];
  return (
    <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="7px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Icon as={cfg.icon} boxSize="10px" color={cfg.color} />
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{rank}</Text>
    </Flex>
  );
}

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Hoạt động"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Hoạt động" ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function StatCard({ label, value, sub, icon, accent, delay = 0 }) {
  return (
    <Box p={{ base:"14px 16px", md:"18px 20px" }} borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow:"0 6px 20px rgba(0,0,0,0.09)", transform:"translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base:"10px", md:"11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base:"22px", md:"26px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#64748b" mt="3px" fontWeight="500">{sub}</Text>}
        </Box>
        <Box w={{ base:"38px", md:"44px" }} h={{ base:"38px", md:"44px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center" flexShrink="0"
        >
          <Icon as={icon} boxSize={{ base:"16px", md:"19px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── User Detail Panel ────────────────────────────────────────────────────────
function UserDetail({ user, onBack, onToggleLock, onAdjustPoints }) {
  const [noteText, setNoteText]         = useState("");
  const [pointDelta, setPointDelta]     = useState("");
  const [pointNote, setPointNote]       = useState("");
  const [showPointForm, setShowPointForm] = useState(false);
  const rankCfg = RANK_CONFIG[user.rank] || RANK_CONFIG["Đồng"];

  const handleAdjust = (sign) => {
    const val = parseInt(pointDelta);
    if (!isNaN(val) && val > 0) {
      onAdjustPoints(user.id, sign * val, pointNote);
      setPointDelta(""); setPointNote(""); setShowPointForm(false);
    }
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base:"flex-start", md:"center" }} justify="space-between"
        direction={{ base:"column", sm:"row" }} gap="12px" mb="20px"
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg:"#f8fafc" }}
          onClick={onBack}
        >Quay lại</Button>
        <Button h="38px" px="18px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg={user.status === "Hoạt động"
            ? "linear-gradient(135deg,#fef2f2,#fee2e2)"
            : "linear-gradient(135deg,#ecfdf5,#d1fae5)"}
          color={user.status === "Hoạt động" ? "#dc2626" : "#059669"}
          border={`1px solid ${user.status === "Hoạt động" ? "#fca5a5" : "#6ee7b7"}`}
          leftIcon={<Icon as={user.status === "Hoạt động" ? MdLock : MdLockOpen} />}
          _hover={{ opacity:0.88 }} transition="all 0.2s"
          onClick={() => onToggleLock(user.id)}
        >
          {user.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa"}
        </Button>
      </Flex>

      {/* Hero profile card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }}
        />
        <Flex direction={{ base:"column", md:"row" }} p={{ base:"20px", md:"28px" }} gap="24px" align="flex-start">
          {/* Avatar + basic */}
          <Flex direction="column" align={{ base:"center", md:"flex-start" }} gap="12px" flexShrink="0">
            <Box position="relative">
              <Box w={{ base:"80px", md:"96px" }} h={{ base:"80px", md:"96px" }}
                borderRadius="20px" overflow="hidden"
                border="3px solid #fed7aa" boxShadow="0 4px 16px rgba(249,115,22,0.2)"
              >
                <img src={user.avatar} alt={user.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </Box>
              {user.status === "Bị khóa" && (
                <Box position="absolute" bottom="-4px" right="-4px"
                  w="22px" h="22px" borderRadius="full" bg="#dc2626"
                  display="flex" alignItems="center" justifyContent="center"
                  border="2px solid white"
                >
                  <Icon as={MdLock} boxSize="11px" color="white" />
                </Box>
              )}
            </Box>
            <StatusDot status={user.status} />
          </Flex>

          {/* Info */}
          <Box flex="1" minW="0">
            <Flex align="center" gap="10px" mb="6px" flexWrap="wrap">
              <Text fontSize={{ base:"20px", md:"24px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.4px">
                {user.name}
              </Text>
              <RankBadge rank={user.rank} />
            </Flex>
            <Text fontSize="12px" color="#64748b" fontFamily="mono" mb="14px">{user.id}</Text>

            <Grid templateColumns={{ base:"1fr 1fr", md:"repeat(4,1fr)" }} gap="10px" mb="16px">
              {[
                { icon:MdEmail,        val:user.email,   label:"Email" },
                { icon:MdPhone,        val:user.phone,   label:"Điện thoại" },
                { icon:MdCalendarToday,val:user.joinDate,label:"Ngày tham gia" },
                { icon:MdLocationOn,   val:user.city,    label:"Thành phố" },
              ].map(({ icon:Ic, val, label }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9px" fontWeight="700" color="#94a3b8" letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                  </Flex>
                  <Text fontSize="12px" fontWeight="600" color="#0f172a" noOfLines={1}>{val}</Text>
                </Box>
              ))}
            </Grid>

            {/* Key metrics */}
            <SimpleGrid columns={{ base:2, md:4 }} spacing="10px">
              {[
                { icon:FaTicketAlt, label:"Vé đã mua",    val:user.tickets,         color:"#f97316" },
                { icon:FaCoins,     label:"Điểm hiện có",  val:user.points+" điểm",  color:"#f59e0b" },
                { icon:MdAttachMoney,label:"Tổng chi tiêu",val:fmt(user.spent),      color:"#10b981" },
                { icon:MdHistory,   label:"Hoạt động",     val:user.lastActive,       color:"#6366f1" },
              ].map(({ icon:Ic, label, val, color }) => (
                <Box key={label} p="12px 14px" borderRadius="12px"
                  bg="white" border="1px solid #f1f5f9" boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                >
                  <Flex align="center" gap="6px" mb="4px">
                    <Icon as={Ic} boxSize="12px" color={color} />
                    <Text fontSize="9.5px" fontWeight="700" color="#94a3b8" letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                  </Flex>
                  <Text fontSize="13.5px" fontWeight="800" color="#0f172a">{val}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>

      {/* Tabs */}
      <Tabs variant="unstyled">
        <TabList bg="white" borderRadius="14px" border="1px solid #f1f5f9"
          p="6px" mb="14px" gap="4px" display="flex"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        >
          {["Lịch sử vé","Tích điểm","Yêu thích","Điều chỉnh điểm"].map((label) => (
            <Tab key={label} flex="1" h="36px" borderRadius="10px" fontSize="12.5px" fontWeight="600"
              color="#64748b" transition="all 0.2s"
              _selected={{
                bg: "linear-gradient(135deg,#f97316,#fb923c)",
                color: "white",
                boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
                fontWeight: "700",
              }}
            >{label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {/* Tab 1: Ticket history */}
          <TabPanel p="0">
            <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" overflow="hidden"
            >
              <Box p="16px 20px" borderBottom="1px solid #f8fafc">
                <Text fontWeight="800" fontSize="14px" color="#0f172a">Lịch sử đặt vé</Text>
              </Box>
              <Flex direction="column" gap="0">
                {user.ticketHistory.map((t, i) => (
                  <Flex key={t.id} px="20px" py="14px"
                    borderBottom={i < user.ticketHistory.length-1 ? "1px solid #f8fafc" : "none"}
                    align={{ base:"flex-start", sm:"center" }}
                    direction={{ base:"column", sm:"row" }}
                    gap="10px"
                    transition="all 0.15s"
                    _hover={{ bg:"#fffbf7" }}
                  >
                    <Box flex="1" minW="0">
                      <Flex align="center" gap="8px" mb="3px">
                        <Text fontSize="11px" fontWeight="700" color="#f97316" fontFamily="mono">{t.id}</Text>
                        <Box px="7px" py="2px" borderRadius="5px"
                          bg={t.status === "Đã check-in" ? "#ecfdf5" : "#fef2f2"}
                          border={`1px solid ${t.status === "Đã check-in" ? "#6ee7b7" : "#fca5a5"}`}
                        >
                          <Text fontSize="10px" fontWeight="700"
                            color={t.status === "Đã check-in" ? "#059669" : "#dc2626"}
                          >{t.status}</Text>
                        </Box>
                      </Flex>
                      <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{t.movie}</Text>
                      <Flex gap="12px" mt="3px">
                        <Flex align="center" gap="4px">
                          <Icon as={MdCalendarToday} boxSize="10px" color="#94a3b8" />
                          <Text fontSize="11px" color="#94a3b8">{t.date}</Text>
                        </Flex>
                        <Flex align="center" gap="4px">
                          <Icon as={MdPerson} boxSize="10px" color="#94a3b8" />
                          <Text fontSize="11px" color="#94a3b8">Ghế {t.seat}</Text>
                        </Flex>
                      </Flex>
                    </Box>
                    <Text fontSize="14px" fontWeight="800" color="#0f172a" flexShrink="0">{fmt(t.amount)}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </TabPanel>

          {/* Tab 2: Point history */}
          <TabPanel p="0">
            <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" overflow="hidden"
            >
              <Flex px="20px" py="16px" borderBottom="1px solid #f8fafc" align="center" justify="space-between">
                <Text fontWeight="800" fontSize="14px" color="#0f172a">Lịch sử tích điểm</Text>
                <Box px="10px" py="4px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="12px" fontWeight="700" color="#f97316">{user.points} điểm</Text>
                </Box>
              </Flex>
              <Flex direction="column" gap="0">
                {user.pointHistory.map((p, i) => (
                  <Flex key={i} px="20px" py="14px"
                    borderBottom={i < user.pointHistory.length-1 ? "1px solid #f8fafc" : "none"}
                    align="center" justify="space-between"
                    _hover={{ bg:"#fffbf7" }} transition="all 0.15s"
                  >
                    <Box flex="1">
                      <Text fontSize="13px" fontWeight="600" color="#0f172a">{p.action}</Text>
                      <Text fontSize="11px" color="#94a3b8" mt="2px">{p.date}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="15px" fontWeight="800"
                        color={p.delta > 0 ? "#059669" : "#dc2626"}
                      >{p.delta > 0 ? "+" : ""}{p.delta} điểm</Text>
                      <Text fontSize="10px" color="#94a3b8">Số dư: {p.balance}</Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </TabPanel>

          {/* Tab 3: Favorites */}
          <TabPanel p="0">
            <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px"
            >
              <Text fontWeight="800" fontSize="14px" color="#0f172a" mb="14px">
                Phim yêu thích ({user.favorites.length})
              </Text>
              <Flex direction="column" gap="10px">
                {user.favorites.map((movie, i) => (
                  <Flex key={movie} align="center" gap="12px" p="12px 14px"
                    borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9"
                  >
                    <Box w="30px" h="30px" borderRadius="8px"
                      bg="linear-gradient(135deg,#fee2e2,#fecaca)"
                      display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                    >
                      <Icon as={FaHeart} boxSize="13px" color="#ef4444" />
                    </Box>
                    <Text fontSize="13px" fontWeight="600" color="#0f172a">{movie}</Text>
                    <Text fontSize="10px" color="#94a3b8" ml="auto">#{i+1}</Text>
                  </Flex>
                ))}
              </Flex>
              <Box mt="14px" p="12px 14px" borderRadius="10px" bg="#fffbf7" border="1px solid #fed7aa">
                <Flex align="center" gap="6px">
                  <Icon as={MdWarning} boxSize="13px" color="#f97316" />
                  <Text fontSize="11.5px" color="#92400e" fontWeight="500">
                    Dữ liệu yêu thích chỉ để tham khảo — không thể chỉnh sửa.
                  </Text>
                </Flex>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 4: Adjust points */}
          <TabPanel p="0">
            <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px"
            >
              <Text fontWeight="800" fontSize="14px" color="#0f172a" mb="6px">Điều chỉnh điểm thủ công</Text>
              <Text fontSize="12px" color="#94a3b8" mb="18px">
                Số điểm hiện tại: <strong style={{color:"#f97316"}}>{user.points} điểm</strong>
              </Text>

              <Flex direction="column" gap="14px">
                <Box>
                  <Text fontSize="10.5px" fontWeight="800" color="#64748b"
                    letterSpacing="0.9px" textTransform="uppercase" mb="7px"
                  >Số điểm điều chỉnh</Text>
                  <Input {...inputSx} type="number" placeholder="VD: 100"
                    value={pointDelta} onChange={(e) => setPointDelta(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text fontSize="10.5px" fontWeight="800" color="#64748b"
                    letterSpacing="0.9px" textTransform="uppercase" mb="7px"
                  >Lý do *</Text>
                  <Textarea
                    bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                    color="#1a202c" fontSize="13px" fontWeight="500" px="14px" py="10px"
                    _placeholder={{ color:"#b0bac8" }}
                    _focus={{ border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.10)", bg:"#fff" }}
                    _hover={{ border:"1.5px solid #f97316" }}
                    rows={3} placeholder="Nhập lý do điều chỉnh điểm..."
                    value={pointNote} onChange={(e) => setPointNote(e.target.value)}
                  />
                </Box>
                <Flex gap="10px">
                  <Button flex="1" h="42px" borderRadius="10px" fontWeight="700" fontSize="13px"
                    bg="linear-gradient(135deg,#ecfdf5,#d1fae5)" color="#059669"
                    border="1px solid #6ee7b7"
                    leftIcon={<Icon as={MdAdd} />}
                    _hover={{ opacity:0.88 }} transition="all 0.2s"
                    onClick={() => handleAdjust(+1)}
                  >Cộng điểm</Button>
                  <Button flex="1" h="42px" borderRadius="10px" fontWeight="700" fontSize="13px"
                    bg="linear-gradient(135deg,#fef2f2,#fee2e2)" color="#dc2626"
                    border="1px solid #fca5a5"
                    leftIcon={<Icon as={MdRemove} />}
                    _hover={{ opacity:0.88 }} transition="all 0.2s"
                    onClick={() => handleAdjust(-1)}
                  >Trừ điểm</Button>
                </Flex>
              </Flex>

              {/* Recent adjustments notice */}
              <Box mt="18px" p="14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="6px" mb="8px">
                  <Icon as={MdHistory} boxSize="13px" color="#f97316" />
                  <Text fontSize="11px" fontWeight="700" color="#374151" letterSpacing="0.5px" textTransform="uppercase">
                    Lưu ý
                  </Text>
                </Flex>
                <Text fontSize="12px" color="#64748b" lineHeight="1.6">
                  Mọi thay đổi điểm thủ công đều được ghi log với tên nhân viên thực hiện.
                  Chỉ điều chỉnh khi có lý do hợp lệ và được phê duyệt.
                </Text>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, index, onView, onToggleLock }) {
  return (
    <>
      {/* Mobile card */}
      <Box display={{ base:"block", md:"none" }}
        p="14px" borderRadius="14px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border:"1.5px solid #f97316", boxShadow:"0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation:`${fadeUp} 0.3s ease ${Math.min(index*0.04,0.4)}s both` }}
      >
        <Flex gap="12px" mb="12px" align="flex-start">
          <Box w="48px" h="48px" borderRadius="12px" overflow="hidden" flexShrink="0"
            border="2px solid #fed7aa"
          >
            <img src={user.avatar} alt={user.name}
              style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="700" color="#0f172a" noOfLines={1}>{user.name}</Text>
            <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{user.email}</Text>
            <Flex gap="6px" mt="6px" flexWrap="wrap">
              <RankBadge rank={user.rank} />
              <StatusDot status={user.status} />
            </Flex>
          </Box>
          <Box textAlign="right">
            <Text fontSize="13px" fontWeight="800" color="#f97316">{user.points}đ</Text>
            <Text fontSize="10px" color="#94a3b8">{user.tickets} vé</Text>
          </Box>
        </Flex>
        <Flex gap="8px">
          <Button flex="2" size="sm" h="34px" borderRadius="9px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            fontSize="12px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ opacity:0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            onClick={() => onView(user)}
          >Chi tiết</Button>
          <Button flex="1" size="sm" h="34px" borderRadius="9px"
            bg={user.status === "Hoạt động" ? "#fef2f2" : "#ecfdf5"}
            color={user.status === "Hoạt động" ? "#dc2626" : "#059669"}
            border={`1px solid ${user.status === "Hoạt động" ? "#fca5a5" : "#6ee7b7"}`}
            fontSize="12px" fontWeight="700"
            leftIcon={<Icon as={user.status === "Hoạt động" ? MdLock : MdLockOpen} boxSize="12px" />}
            _hover={{ opacity:0.88 }}
            onClick={() => onToggleLock(user.id)}
          >{user.status === "Hoạt động" ? "Khóa" : "Mở"}</Button>
        </Flex>
      </Box>

      {/* Desktop row */}
      <Box display={{ base:"none", md:"block" }}
        px="18px" py="13px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border:"1.5px solid #f97316", boxShadow:"0 2px 12px rgba(249,115,22,0.08)", bg:"#fffbf7" }}
        sx={{ animation:`${fadeUp} 0.3s ease ${Math.min(index*0.04,0.4)}s both` }}
      >
        <Flex align="center">
          {/* # */}
          <Box w="28px" flexShrink="0">
            <Text fontSize="11px" fontWeight="700" color="#cbd5e1">{String(index+1).padStart(2,"0")}</Text>
          </Box>
          {/* Avatar + name */}
          <Flex align="center" gap="10px" flex="1.8" minW="0" pr="12px">
            <Box w="38px" h="38px" borderRadius="10px" overflow="hidden" flexShrink="0"
              border="2px solid #fed7aa"
            >
              <img src={user.avatar} alt={user.name}
                style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </Box>
            <Box minW="0">
              <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{user.name}</Text>
              <Text fontSize="10.5px" color="#94a3b8" noOfLines={1}>{user.email}</Text>
            </Box>
          </Flex>
          {/* Phone */}
          <Box flex="0.9" minW="0" pr="12px">
            <Text fontSize="12px" fontWeight="600" color="#374151">{user.phone}</Text>
            <Text fontSize="10.5px" color="#94a3b8">{user.city}</Text>
          </Box>
          {/* Rank */}
          <Box flex="0.7" minW="0" pr="12px">
            <RankBadge rank={user.rank} />
          </Box>
          {/* Status */}
          <Box flex="0.8" minW="0" pr="12px">
            <StatusDot status={user.status} />
          </Box>
          {/* Tickets + points */}
          <Box flex="0.8" minW="0" pr="12px">
            <Text fontSize="13px" fontWeight="700" color="#0f172a">{user.tickets} vé</Text>
            <Text fontSize="10.5px" color="#f59e0b" fontWeight="600">{user.points} điểm</Text>
          </Box>
          {/* Join date */}
          <Box flex="0.7" minW="0" pr="12px">
            <Text fontSize="11.5px" fontWeight="600" color="#374151">{user.joinDate}</Text>
            <Text fontSize="10px" color="#94a3b8">{user.lastActive}</Text>
          </Box>
          {/* Actions */}
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="11px" borderRadius="8px"
              bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ opacity:0.88, transform:"translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onView(user)}
            >Xem</Button>
            <Button size="xs" h="30px" px="11px" borderRadius="8px"
              bg={user.status === "Hoạt động" ? "#fef2f2" : "#ecfdf5"}
              color={user.status === "Hoạt động" ? "#dc2626" : "#059669"}
              border={`1px solid ${user.status === "Hoạt động" ? "#fca5a5" : "#6ee7b7"}`}
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={user.status === "Hoạt động" ? MdLock : MdLockOpen} boxSize="12px" />}
              _hover={{ opacity:0.88 }} transition="all 0.15s"
              onClick={() => onToggleLock(user.id)}
            >{user.status === "Hoạt động" ? "Khóa" : "Mở"}</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyNguoiDung() {
  const [users, setUsers]               = useState(ALL_USERS);
  const [view, setView]                 = useState("list"); // "list" | "detail"
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch]             = useState("");
  const [filterRank, setFilterRank]     = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showFilter, setShowFilter]     = useState(false);
  const [page, setPage]                 = useState(1);

  // Filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchQ = !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchR = filterRank === "Tất cả" || u.rank === filterRank;
      const matchS = filterStatus === "Tất cả" || u.status === filterStatus;
      return matchQ && matchR && matchS;
    });
  }, [users, search, filterRank, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Stats
  const active  = users.filter((u) => u.status === "Hoạt động").length;
  const locked  = users.filter((u) => u.status === "Bị khóa").length;
  const vip     = users.filter((u) => u.rank === "Kim cương" || u.rank === "Vàng").length;
  const newThis = users.filter((u) => u.joinDate.includes("2026")).length;

  const handleToggleLock = (id) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id
        ? { ...u, status: u.status === "Hoạt động" ? "Bị khóa" : "Hoạt động" }
        : u
    ));
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => ({
        ...prev,
        status: prev.status === "Hoạt động" ? "Bị khóa" : "Hoạt động",
      }));
    }
  };

  const handleAdjustPoints = (id, delta, note) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, points: Math.max(0, u.points + delta) } : u
    ));
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => ({
        ...prev,
        points: Math.max(0, prev.points + delta),
        pointHistory: [
          { date: "24/05/2026", action: note || "Điều chỉnh thủ công", delta, balance: Math.max(0, prev.points + delta) },
          ...prev.pointHistory,
        ],
      }));
    }
  };

  const handleView = (user) => { setSelectedUser(user); setView("detail"); };

  const hasFilter = search || filterRank !== "Tất cả" || filterStatus !== "Tất cả";
  const resetFilters = () => { setSearch(""); setFilterRank("Tất cả"); setFilterStatus("Tất cả"); setPage(1); };

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedUser) {
    const liveUser = users.find((u) => u.id === selectedUser.id) || selectedUser;
    return (
      <Box pt={{ base:"100px", md:"80px" }}>
        <UserDetail
          user={{ ...liveUser, ...selectedUser, points: liveUser.points, status: liveUser.status }}
          onBack={() => { setView("list"); setSelectedUser(null); }}
          onToggleLock={handleToggleLock}
          onAdjustPoints={handleAdjustPoints}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base:"100px", md:"80px" }}>

      {/* Page header */}
      <Flex justify="space-between" align={{ base:"flex-start", md:"center" }}
        direction={{ base:"column", md:"row" }} mb="20px" gap="14px"
        sx={{ animation:`${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)"
            >
              <Icon as={FaUsers} boxSize="19px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base:"20px", md:"24px" }} fontWeight="800"
                color="#0f172a" letterSpacing="-0.5px">
                Quản lý người dùng
              </Text>
              <Text fontSize="12px" color="#94a3b8">
                Xem, tìm kiếm và quản lý tài khoản khách hàng
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex gap="10px" w={{ base:"100%", md:"auto" }}
          sx={{ animation:`${fadeIn} 0.4s ease 0.1s both` }}
        >
          {locked > 0 && (
            <Button flex={{ base:"1", md:"none" }}
              h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
              bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
              leftIcon={<Icon as={MdPersonOff} />}
              _hover={{ bg:"#fee2e2" }} transition="all 0.2s"
              onClick={() => { setFilterStatus("Bị khóa"); setPage(1); }}
            >
              {locked} bị khóa
            </Button>
          )}
          <Button flex={{ base:"1", md:"none" }}
            h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            leftIcon={<Icon as={MdNotifications} />}
            _hover={{ bg:"#ffedd5" }} transition="all 0.2s"
          >
            Gửi thông báo
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base:2, md:4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng người dùng" value={users.length}
          sub={`${newThis} mới năm nay`}
          icon={FaUsers} accent="#f97316" delay={0} />
        <StatCard label="Đang hoạt động" value={active}
          sub={`${((active/users.length)*100).toFixed(0)}% tổng số`}
          icon={FaUserCheck} accent="#10b981" delay={0.05} />
        <StatCard label="Bị khóa" value={locked}
          sub="Tài khoản vi phạm"
          icon={FaUserSlash} accent="#dc2626" delay={0.1} />
        <StatCard label="VIP (Vàng + KCương)" value={vip}
          sub={`${((vip/users.length)*100).toFixed(0)}% tổng số`}
          icon={FaCrown} accent="#f59e0b" delay={0.15} />
      </SimpleGrid>

      {/* Rank breakdown */}
      <SimpleGrid columns={{ base:2, md:4 }} spacing="10px" mb="20px">
        {Object.entries(RANK_CONFIG).map(([rank, cfg], i) => {
          const count = users.filter((u) => u.rank === rank).length;
          return (
            <Box key={rank} p="12px 14px" borderRadius="12px" bg="white"
              border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.04)"
              sx={{ animation:`${fadeUp} 0.4s ease ${0.05*i}s both` }}
              cursor="pointer" transition="all 0.2s"
              _hover={{ border:`1px solid ${cfg.border}`, boxShadow:`0 4px 14px ${cfg.border}66`, transform:"translateY(-1px)" }}
              onClick={() => { setFilterRank(rank); setPage(1); }}
            >
              <Flex align="center" gap="10px" mb="8px">
                <Box w="32px" h="32px" borderRadius="9px" bg={cfg.grad}
                  display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                >
                  <Icon as={cfg.icon} boxSize="14px" color="white" />
                </Box>
                <Text fontSize="13px" fontWeight="800" color={cfg.color}>{rank}</Text>
              </Flex>
              <Text fontSize="22px" fontWeight="900" color="#0f172a" lineHeight="1">{count}</Text>
              <Text fontSize="10.5px" color="#94a3b8" mt="2px">
                {((count/users.length)*100).toFixed(0)}% tổng số
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Table card */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation:`${fadeUp} 0.4s ease 0.12s both` }}
      >
        {/* Card header */}
        <Box p={{ base:"14px 16px", md:"18px 20px 14px" }} borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="10px">
              <Text fontWeight="800" fontSize={{ base:"14px", md:"15px" }} color="#0f172a">
                Danh sách người dùng
              </Text>
              <Box px="9px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} người</Text>
              </Box>
              {hasFilter && (
                <Button size="xs" h="24px" px="8px" borderRadius="6px"
                  bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                  fontSize="10px" fontWeight="700"
                  leftIcon={<Icon as={MdClose} boxSize="10px" />}
                  onClick={resetFilters}
                >Xóa lọc</Button>
              )}
            </Flex>
            <Button display={{ base:"flex", md:"none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              onClick={() => setShowFilter((v) => !v)}
            >Lọc</Button>
          </Flex>

          {/* Filters */}
          <Box display={{ base: showFilter ? "block" : "none", md:"block" }}>
            <Flex gap="10px" wrap="wrap" align="center">
              <Box position="relative" flex={{ base:"1 1 100%", md:"1 1 220px" }} minW="180px">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                <Input {...inputSx} pl="30px"
                  placeholder="Tên, email, SĐT, mã UID..."
                  value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </Box>
              <Select {...inputSx} w={{ base:"100%", md:"140px" }} flexShrink="0"
                value={filterRank} onChange={(e) => { setFilterRank(e.target.value); setPage(1); }}
              >
                <option value="Tất cả">Hạng thành viên</option>
                {Object.keys(RANK_CONFIG).map((r) => <option key={r}>{r}</option>)}
              </Select>
              <Select {...inputSx} w={{ base:"100%", md:"140px" }} flexShrink="0"
                value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="Tất cả">Trạng thái</option>
                <option>Hoạt động</option>
                <option>Bị khóa</option>
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base:"none", md:"flex" }} align="center"
        >
          {[
            { label:"#",                   w:"28px"  },
            { label:"Người dùng",          flex:"1.8" },
            { label:"SĐT / Thành phố",     flex:"0.9" },
            { label:"Hạng",                flex:"0.7" },
            { label:"Trạng thái",          flex:"0.8" },
            { label:"Vé / Điểm",           flex:"0.8" },
            { label:"Ngày tham gia",       flex:"0.7" },
            { label:"",                    w:"120px" },
          ].map(({ label, w, flex }) => (
            <Box key={label} w={w} flex={flex} pr={flex ? "12px" : "0"} flexShrink={w ? "0" : undefined}>
              <Text fontSize="10px" fontWeight="800" color="#94a3b8"
                letterSpacing="1px" textTransform="uppercase">
                {label}
              </Text>
            </Box>
          ))}
        </Flex>

        {/* Rows */}
        <Box p={{ base:"10px", md:"10px" }}>
          {paged.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color="#cbd5e1">
              <Icon as={FaUsers} boxSize="36px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy người dùng nào</Text>
              <Button mt="12px" size="sm" variant="ghost" color="#f97316" fontWeight="700"
                onClick={resetFilters}>Xóa bộ lọc</Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {paged.map((u, i) => (
                <UserRow key={u.id} user={u} index={(page-1)*PAGE_SIZE+i}
                  onView={handleView} onToggleLock={handleToggleLock}
                />
              ))}
            </Flex>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex p="14px 20px" borderTop="1px solid #f8fafc"
            align="center" justify="space-between" gap="12px" flexWrap="wrap"
          >
            <Text fontSize="12px" color="#94a3b8" fontWeight="500">
              Hiển thị {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} / {filtered.length} người dùng
            </Text>
            <Flex gap="6px" flexWrap="wrap">
              <Button size="xs" h="30px" px="10px" borderRadius="8px"
                isDisabled={page === 1}
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                _hover={{ bg:"#f1f5f9" }} _disabled={{ opacity:0.4 }}
                onClick={() => setPage((p) => Math.max(1, p-1))}
              >← Trước</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pg;
                if (totalPages <= 5)          pg = i + 1;
                else if (page <= 3)            pg = i + 1;
                else if (page >= totalPages-2) pg = totalPages - 4 + i;
                else                           pg = page - 2 + i;
                return (
                  <Button key={pg} size="xs" h="30px" w="30px" borderRadius="8px"
                    bg={page===pg ? "linear-gradient(135deg,#f97316,#fb923c)" : "#f8fafc"}
                    color={page===pg ? "white" : "#64748b"}
                    border={page===pg ? "none" : "1px solid #e2e8f0"}
                    fontSize="12px" fontWeight="700"
                    boxShadow={page===pg ? "0 2px 8px rgba(249,115,22,0.3)" : "none"}
                    _hover={{ opacity:0.88 }}
                    onClick={() => setPage(pg)}
                  >{pg}</Button>
                );
              })}
              <Button size="xs" h="30px" px="10px" borderRadius="8px"
                isDisabled={page === totalPages}
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                _hover={{ bg:"#f1f5f9" }} _disabled={{ opacity:0.4 }}
                onClick={() => setPage((p) => Math.min(totalPages, p+1))}
              >Sau →</Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
}