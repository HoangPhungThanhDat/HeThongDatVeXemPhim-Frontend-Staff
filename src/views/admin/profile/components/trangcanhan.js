import React, { useState } from "react";
import {
  Box, Grid, Text, Flex, Avatar, Button, Badge, Divider,
  SimpleGrid, Icon, keyframes, Progress,
} from "@chakra-ui/react";
import {
  MdAdminPanelSettings, MdConfirmationNumber, MdMovie, MdPeople,
  MdEmail, MdPhone, MdVerified, MdTrendingUp, MdCalendarToday,
  MdStar, MdCheckCircle, MdEdit, MdAccessTime, MdEventSeat,
  MdWorkspacePremium, MdBarChart,
} from "react-icons/md";
import { FaTicketAlt, FaFire, FaShieldAlt } from "react-icons/fa";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(234,88,12,0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-4px); }
`;

// ─── Palette ─────────────────────────────────────────────────────────────────
const OR   = "#ea580c";
const ORL  = "#fb923c";
const ORXL = "#fed7aa";
const ORPL = "#fff7ed";
const ORSW = "rgba(234,88,12,0.2)";
const DARK = "#0c0f1a";
const NAVY = "#111827";

// ─── Data ─────────────────────────────────────────────────────────────────────
const tickets = [
  { movie: "Avengers: Endgame",          seat: "A5", time: "20:00 · 12/06/2026", status: "Đã thanh toán", room: "Phòng 1" },
  { movie: "Spider-Man: No Way Home",    seat: "B2", time: "18:30 · 10/06/2026", status: "Đã thanh toán", room: "Phòng 2" },
  { movie: "Doctor Strange 2",           seat: "C4", time: "21:00 · 08/06/2026", status: "Đã check-in",   room: "Phòng 3" },
  { movie: "Thor: Love and Thunder",     seat: "D1", time: "16:00 · 05/06/2026", status: "Đã thanh toán", room: "Phòng 1" },
];

const stats = [
  { label: "Vé bán hôm nay", value: "124",  icon: FaTicketAlt,         accent: OR,       trend: "+12%", bg: `linear-gradient(135deg,${OR},${ORL})` },
  { label: "Phim đang chiếu", value: "32",  icon: MdMovie,             accent: "#6366f1", trend: "+3",   bg: "linear-gradient(135deg,#6366f1,#818cf8)" },
  { label: "Người dùng",      value: "845", icon: MdPeople,            accent: "#10b981", trend: "+28",  bg: "linear-gradient(135deg,#10b981,#34d399)" },
  { label: "Suất chiếu",      value: "15",  icon: MdCalendarToday,     accent: "#f59e0b", trend: "hôm nay", bg: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
];

const skills = [
  { label: "Quản lý vé",      pct: 96 },
  { label: "Hỗ trợ khách",    pct: 88 },
  { label: "Báo cáo doanh thu", pct: 74 },
  { label: "Quản lý phim",    pct: 81 },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ item, delay }) {
  return (
    <Box p="20px" borderRadius="16px" bg="white" border="1px solid #f1f5f9"
      boxShadow="0 2px 8px rgba(0,0,0,.05)"
      sx={{ animation: `${fadeUp} .45s ease ${delay}s both` }}
      transition="all .25s"
      _hover={{ transform: "translateY(-4px)", boxShadow: `0 12px 32px ${item.accent}28` }}
      position="relative" overflow="hidden"
    >
      {/* BG orb */}
      <Box position="absolute" top="-20px" right="-20px" w="80px" h="80px"
        borderRadius="full" bg={`${item.accent}12`} />

      <Flex align="flex-start" justify="space-between" mb="14px">
        <Box w="44px" h="44px" borderRadius="13px" bg={item.bg}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 6px 16px ${item.accent}40`}>
          <Icon as={item.icon} boxSize="18px" color="white" />
        </Box>
        <Box px="8px" py="3px" borderRadius="8px"
          bg={`${item.accent}12`} border={`1px solid ${item.accent}30`}>
          <Text fontSize="10.5px" fontWeight="700" color={item.accent}>{item.trend}</Text>
        </Box>
      </Flex>
      <Text fontSize="30px" fontWeight="800" color="#0f172a" lineHeight="1" mb="4px">{item.value}</Text>
      <Text fontSize="12px" fontWeight="600" color="#94a3b8">{item.label}</Text>
    </Box>
  );
}

// ─── Ticket Card ─────────────────────────────────────────────────────────────
function TicketCard({ ticket, index }) {
  const isPaid    = ticket.status === "Đã thanh toán";
  const isCheckin = ticket.status === "Đã check-in";
  const statusColor  = isPaid ? "#10b981" : isCheckin ? OR : "#94a3b8";
  const statusBg     = isPaid ? "#ecfdf5" : isCheckin ? ORPL : "#f9fafb";
  const statusBorder = isPaid ? "#6ee7b7" : isCheckin ? ORXL : "#e5e7eb";

  return (
    <Box p="18px" borderRadius="14px" bg="white" border="1.5px solid #f1f5f9"
      sx={{ animation: `${fadeUp} .4s ease ${index * .07 + .3}s both` }}
      transition="all .25s" position="relative" overflow="hidden"
      _hover={{ border: `1.5px solid ${ORXL}`, boxShadow: `0 8px 24px ${ORSW}`, transform: "translateY(-3px)" }}
    >
      {/* Left accent bar */}
      <Box position="absolute" left="0" top="0" bottom="0" w="3px"
        bg={`linear-gradient(180deg,${OR},${ORL})`} borderRadius="14px 0 0 14px" />

      <Flex justify="space-between" align="flex-start" mb="12px" pl="8px">
        <Box flex="1" pr="10px">
          <Text fontSize="13.5px" fontWeight="800" color="#0f172a" noOfLines={1} mb="3px">
            {ticket.movie}
          </Text>
          <Text fontSize="11px" color="#94a3b8" fontWeight="500">{ticket.room}</Text>
        </Box>
        <Flex align="center" gap="4px" px="9px" py="4px" borderRadius="8px"
          bg={statusBg} border={`1px solid ${statusBorder}`}>
          <Box w="5px" h="5px" borderRadius="full" bg={statusColor} />
          <Text fontSize="10.5px" fontWeight="700" color={statusColor} whiteSpace="nowrap">
            {ticket.status}
          </Text>
        </Flex>
      </Flex>

      <Flex gap="14px" pl="8px">
        <Flex align="center" gap="5px">
          <Box w="24px" h="24px" borderRadius="7px" bg={ORPL} display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdEventSeat} boxSize="12px" color={OR} />
          </Box>
          <Text fontSize="12px" fontWeight="700" color="#475569">Ghế {ticket.seat}</Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Box w="24px" h="24px" borderRadius="7px" bg="#f1f5f9" display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdAccessTime} boxSize="12px" color="#64748b" />
          </Box>
          <Text fontSize="12px" fontWeight="500" color="#64748b">{ticket.time}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TrangCaNhan() {
  return (
    <Box pt={{ base: "120px", md: "80px" }} px={{ base: "14px", md: "20px" }}
      pb="40px" bg="#f8fafc" minH="100vh">

      {/* ── HERO BANNER ── */}
      <Box mb="24px" borderRadius="22px" overflow="hidden" position="relative"
        sx={{ animation: `${fadeIn} .5s ease both` }}
        boxShadow={`0 16px 48px ${ORSW}`}>
        {/* Dark gradient bg */}
        <Box h={{ base:"160px", md:"190px" }}
          bg={`linear-gradient(135deg, ${DARK} 0%, #1e293b 50%, #0c1a2e 100%)`}
          position="relative">

          {/* Decorative film strip dots */}
          <Flex position="absolute" top="14px" left="20px" gap="6px" opacity=".25">
            {[...Array(6)].map((_,i) => (
              <Box key={i} w="8px" h="8px" borderRadius="2px" bg="white" />
            ))}
          </Flex>
          <Flex position="absolute" bottom="14px" right="20px" gap="6px" opacity=".15">
            {[...Array(8)].map((_,i) => (
              <Box key={i} w="8px" h="8px" borderRadius="2px" bg="white" />
            ))}
          </Flex>

          {/* Shimmer line */}
          <Box position="absolute" bottom="0" left="0" right="0" h="2px"
            bg={`linear-gradient(90deg, transparent, ${OR}, ${ORL}, #fbbf24, ${ORL}, ${OR}, transparent)`}
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

          {/* Glowing orb */}
          <Box position="absolute" top="-40px" right={{ base:"-40px", md:"60px" }}
            w="220px" h="220px" borderRadius="full"
            bg={`radial-gradient(circle, ${ORSW} 0%, transparent 70%)`} />

          {/* Role badge top-right */}
          <Flex position="absolute" top="16px" right="20px" align="center" gap="6px"
            px="12px" py="6px" borderRadius="10px"
            bg="rgba(255,255,255,.08)" border="1px solid rgba(255,255,255,.15)"
            backdropFilter="blur(8px)">
            <Icon as={FaShieldAlt} boxSize="12px" color={ORL} />
            <Text fontSize="11px" fontWeight="800" color="white" letterSpacing="1.5px">Staff</Text>
          </Flex>
        </Box>

        {/* Profile info overlapping banner */}
        <Box bg="white" px={{ base:"20px", md:"32px" }} pt="0" pb="22px">
          <Flex align="flex-end" gap={{ base:"14px", md:"20px" }} mt="-44px" mb="16px"
            direction={{ base:"column", sm:"row" }} alignItems={{ base:"center", sm:"flex-end" }}>
            {/* Avatar with pulse ring */}
            <Box position="relative" flexShrink="0">
              <Avatar size={{ base:"xl", md:"2xl" }}
                src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-ngau-2.jpg"
                border={`4px solid white`}
                boxShadow={`0 0 0 3px ${OR}, 0 8px 24px rgba(0,0,0,.2)`}
                sx={{ animation: `${pulse} 3s ease infinite` }}
              />
              {/* Online dot */}
              <Box position="absolute" bottom="6px" right="6px" w="14px" h="14px"
                borderRadius="full" bg="#10b981" border="2.5px solid white" />
            </Box>

            <Flex flex="1" justify="space-between" align="flex-end" w="100%"
              direction={{ base:"column", sm:"row" }} gap="10px">
              <Box textAlign={{ base:"center", sm:"left" }}>
                <Flex align="center" gap="8px" mb="3px" justify={{ base:"center", sm:"flex-start" }}>
                  <Text fontSize={{ base:"20px", md:"24px" }} fontWeight="800" color="#0f172a">
                    Lý Tiểu Long
                  </Text>
                  <Icon as={MdVerified} boxSize="20px" color={OR} />
                </Flex>
                <Flex align="center" gap="6px" justify={{ base:"center", sm:"flex-start" }}>
                  <Icon as={MdAdminPanelSettings} boxSize="14px" color="#94a3b8" />
                  <Text fontSize="13px" color="#64748b" fontWeight="500">Quản trị viên hệ thống · CineStar</Text>
                </Flex>
              </Box>

              <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
                leftIcon={<Icon as={MdEdit} boxSize="14px" />}
                boxShadow={`0 4px 14px ${ORSW}`}
                _hover={{ transform:"translateY(-2px)", boxShadow:`0 8px 24px ${ORSW}` }}
                _active={{ transform:"translateY(0)" }} transition="all .2s">
                Chỉnh sửa hồ sơ
              </Button>
            </Flex>
          </Flex>

          {/* Quick info chips */}
          <Flex gap="10px" flexWrap="wrap" justify={{ base:"center", sm:"flex-start" }}>
            {[
              { icon: MdEmail,    label: "admin@cinema.com" },
              { icon: MdPhone,    label: "0900 000 000"     },
              { icon: MdWorkspacePremium, label: "Quản lý rạp phim" },
            ].map(({ icon: Ic, label }) => (
              <Flex key={label} align="center" gap="6px" px="12px" py="7px"
                borderRadius="10px" bg="#f8fafc" border="1px solid #e8edf3">
                <Icon as={Ic} boxSize="13px" color={OR} />
                <Text fontSize="12px" fontWeight="600" color="#374151">{label}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ── STATS GRID ── */}
      <SimpleGrid columns={{ base:2, md:4 }} spacing={{ base:"10px", md:"16px" }} mb="22px">
        {stats.map((s, i) => <StatCard key={s.label} item={s} delay={i * .06} />)}
      </SimpleGrid>

      {/* ── BOTTOM GRID ── */}
      <Grid templateColumns={{ base:"1fr", lg:"1fr 1.6fr" }} gap="18px">

        {/* LEFT: Admin info + skills */}
        <Flex direction="column" gap="18px">

          {/* Info card */}
          <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,.04)" overflow="hidden"
            sx={{ animation: `${fadeUp} .45s ease .2s both` }}>
            <Box h="3px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24)`} />
            <Box p="22px">
              <Flex align="center" gap="8px" mb="18px">
                <Box w="3px" h="16px" borderRadius="full" bg={`linear-gradient(180deg,${OR},${ORL})`} />
                <Text fontSize="13px" fontWeight="800" color="#0f172a" letterSpacing=".5px"
                  textTransform="uppercase">Thông tin tài khoản</Text>
              </Flex>

              {[
                { label:"Mã nhân viên", value:"NV-2024-001",     dot: true  },
                { label:"Phòng ban",    value:"Vận hành rạp",    dot: false },
                { label:"Ngày vào làm", value:"01/01/2024",      dot: false },
                { label:"Cấp độ",       value:"Admin · Cấp 1",   dot: true  },
                { label:"Trạng thái",   value:"Đang hoạt động",  dot: true, active: true },
              ].map(({ label, value, active }) => (
                <Flex key={label} justify="space-between" align="center"
                  py="11px" borderBottom="1px solid #f8fafc" _last={{ borderBottom:"none" }}>
                  <Text fontSize="12px" fontWeight="600" color="#94a3b8">{label}</Text>
                  <Flex align="center" gap="6px">
                    {active && <Box w="6px" h="6px" borderRadius="full" bg="#10b981" />}
                    <Text fontSize="12.5px" fontWeight="700" color={active ? "#10b981" : "#0f172a"}>{value}</Text>
                  </Flex>
                </Flex>
              ))}
            </Box>
          </Box>

          {/* Skills card */}
          <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,.04)" overflow="hidden"
            sx={{ animation: `${fadeUp} .45s ease .28s both` }}>
            <Box h="3px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24)`} />
            <Box p="22px">
              <Flex align="center" gap="8px" mb="18px">
                <Box w="3px" h="16px" borderRadius="full" bg={`linear-gradient(180deg,${OR},${ORL})`} />
                <Text fontSize="13px" fontWeight="800" color="#0f172a" letterSpacing=".5px"
                  textTransform="uppercase">Hiệu suất công việc</Text>
              </Flex>

              <Flex direction="column" gap="14px">
                {skills.map(({ label, pct }, i) => (
                  <Box key={label}
                    sx={{ animation: `${fadeUp} .4s ease ${i*.08 + .35}s both` }}>
                    <Flex justify="space-between" mb="6px">
                      <Text fontSize="12px" fontWeight="600" color="#374151">{label}</Text>
                      <Text fontSize="12px" fontWeight="800" color={OR}>{pct}%</Text>
                    </Flex>
                    <Box h="6px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
                      <Box h="100%" w={`${pct}%`} borderRadius="full"
                        bg={`linear-gradient(90deg,${OR},${ORL})`}
                        boxShadow={`0 0 8px ${ORSW}`}
                        transition="width 1s ease"
                      />
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Flex>

        {/* RIGHT: Recent tickets */}
        <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,.04)" overflow="hidden"
          sx={{ animation: `${fadeUp} .45s ease .24s both` }}>
          <Box h="3px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
            bgSize="200% 100%" sx={{ animation:`${shimmer} 4s linear infinite` }} />
          <Box p="22px">
            <Flex align="center" justify="space-between" mb="18px">
              <Flex align="center" gap="8px">
                <Box w="3px" h="16px" borderRadius="full" bg={`linear-gradient(180deg,${OR},${ORL})`} />
                <Text fontSize="13px" fontWeight="800" color="#0f172a" letterSpacing=".5px"
                  textTransform="uppercase">Vé đặt gần đây</Text>
              </Flex>
              <Flex align="center" gap="6px" px="10px" py="4px" borderRadius="8px"
                bg={ORPL} border={`1px solid ${ORXL}`}>
                <Icon as={FaFire} boxSize="11px" color={OR} />
                <Text fontSize="11px" fontWeight="700" color={OR}>{tickets.length} vé</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap="10px">
              {tickets.map((t, i) => <TicketCard key={i} ticket={t} index={i} />)}
            </Flex>

            {/* Footer */}
            <Box mt="16px" p="14px" borderRadius="12px"
              bg={`linear-gradient(135deg,${ORPL},#fff)`} border={`1px solid ${ORXL}`}>
              <Flex align="center" justify="space-between">
                <Flex align="center" gap="8px">
                  <Box w="32px" h="32px" borderRadius="9px"
                    bg={`linear-gradient(135deg,${OR},${ORL})`}
                    display="flex" alignItems="center" justifyContent="center"
                    boxShadow={`0 3px 10px ${ORSW}`}>
                    <Icon as={MdBarChart} boxSize="15px" color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="12px" fontWeight="800" color="#0f172a">Tổng doanh thu hôm nay</Text>
                    <Text fontSize="11px" color="#94a3b8">Từ {tickets.length * 31} vé đã xử lý</Text>
                  </Box>
                </Flex>
                <Text fontSize="18px" fontWeight="800" color={OR}>10.540.000đ</Text>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}