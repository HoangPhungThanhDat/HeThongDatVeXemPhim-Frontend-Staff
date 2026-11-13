import React, { useState } from "react";
import {
  Box, Flex, SimpleGrid, Text, Icon, useColorModeValue,
  Badge, HStack, VStack, Progress, keyframes, Button,
  Divider, Avatar, AvatarGroup,
} from "@chakra-ui/react";
import {
  MdAttachMoney, MdLocalActivity, MdPeople, MdEventSeat,
  MdMovie, MdStar, MdCalendarToday, MdConfirmationNumber,
  MdQrCodeScanner, MdSearch, MdShoppingCart, MdArrowForward,
  MdSchedule, MdAccessTime, MdLocationOn, MdTrendingUp,
  MdNotifications, MdCheckCircle, MdWarning, MdInfo,
  MdPointOfSale, MdReceipt,
} from "react-icons/md";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";

// ─── Keyframes ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.05); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const REVENUE_BY_HOUR = [
  { hour: "08h", revenue: 2.1, tickets: 12 },
  { hour: "09h", revenue: 4.5, tickets: 25 },
  { hour: "10h", revenue: 6.8, tickets: 38 },
  { hour: "11h", revenue: 5.2, tickets: 29 },
  { hour: "12h", revenue: 3.8, tickets: 21 },
  { hour: "13h", revenue: 7.4, tickets: 42 },
  { hour: "14h", revenue: 9.1, tickets: 51 },
  { hour: "15h", revenue: 8.6, tickets: 48 },
  { hour: "16h", revenue: 0,   tickets: 0  }, // chưa tới
];

const UPCOMING_SHOWTIMES = [
  { id: 1, time: "16:30", movie: "Avengers: Doomsday",      room: "P3", format: "IMAX", seatsLeft: 12, total: 80, minutesUntil: 15 },
  { id: 2, time: "17:00", movie: "Lật Mặt 8",               room: "P1", format: "2D",   seatsLeft: 45, total: 80, minutesUntil: 45 },
  { id: 3, time: "17:30", movie: "Doraemon 2026",           room: "P2", format: "2D",   seatsLeft: 62, total: 80, minutesUntil: 75 },
  { id: 4, time: "18:00", movie: "Ma Da",                   room: "P4", format: "2D",   seatsLeft: 8,  total: 80, minutesUntil: 105 },
  { id: 5, time: "19:00", movie: "Avengers: Doomsday",      room: "P1", format: "2D",   seatsLeft: 35, total: 80, minutesUntil: 165 },
];

const TOP_MOVIES = [
  { title: "Avengers: Doomsday", tickets: 142, revenue: 12.8, fill: 92, rating: 9.2 },
  { title: "Lật Mặt 8",          tickets: 98,  revenue: 8.8,  fill: 78, rating: 8.7 },
  { title: "Doraemon 2026",      tickets: 76,  revenue: 6.1,  fill: 65, rating: 8.9 },
  { title: "Ma Da",              tickets: 65,  revenue: 5.9,  fill: 54, rating: 7.8 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, customer: "Nguyễn Văn A", movie: "Avengers: Doomsday", seats: "F5, F6", time: "15:42", amount: 180000, status: "success", method: "cash" },
  { id: 2, customer: "Trần Thị B",   movie: "Lật Mặt 8",          seats: "C3",     time: "15:38", amount: 90000,  status: "success", method: "card" },
  { id: 3, customer: "Lê Hoàng C",   movie: "Doraemon 2026",      seats: "D7, D8, D9", time: "15:35", amount: 270000, status: "pending", method: "wallet" },
  { id: 4, customer: "Phạm Thu D",   movie: "Ma Da",              seats: "G2",     time: "15:28", amount: 90000,  status: "success", method: "cash" },
  { id: 5, customer: "Hoàng Minh E", movie: "Avengers: Doomsday", seats: "A1, A2", time: "15:15", amount: 180000, status: "refunded", method: "card" },
];

const NOTIFICATIONS = [
  { id: 1, type: "info",     message: "Suất chiếu 16:30 phòng P3 sắp hết ghế (còn 12)", time: "2 phút trước" },
  { id: 2, type: "warning",  message: "Có 3 đơn hàng online chờ xác nhận in vé",         time: "5 phút trước" },
  { id: 3, type: "success",  message: "Ca sáng đã đạt 95% chỉ tiêu doanh thu",           time: "10 phút trước" },
];

// ─── HOOK MÀU ──────────────────────────────────────────────────────────────
function useThemeColors() {
  return {
    pageBg:       useColorModeValue("secondaryGray.300", "navy.900"),
    cardBg:       useColorModeValue("white", "navy.800"),
    subtleBg:     useColorModeValue("secondaryGray.300", "navy.700"),
    innerCardBg:  useColorModeValue("#f8fafc", "navy.700"),
    dividerBg:    useColorModeValue("#f1f5f9", "whiteAlpha.100"),
    borderColor:  useColorModeValue("#e8edf3", "whiteAlpha.100"),
    textColor:    useColorModeValue("secondaryGray.900", "white"),
    subTextColor: useColorModeValue("#64748b", "secondaryGray.600"),
    mutedColor:   useColorModeValue("#94a3b8", "secondaryGray.600"),
    sectionColor: useColorModeValue("#374151", "white"),
    shadow:       useColorModeValue("0 1px 4px rgba(0,0,0,0.04)", "0 1px 4px rgba(0,0,0,0.4)"),
    hoverShadow:  useColorModeValue("0 10px 24px rgba(0,0,0,0.08)", "0 10px 24px rgba(0,0,0,0.5)"),
  };
}

// ─── Custom Tooltip cho chart ──────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  const bg = useColorModeValue("white", "navy.700");
  const border = useColorModeValue("#fed7aa", "rgba(249,115,22,0.4)");
  const textC = useColorModeValue("#0f172a", "white");
  const subC = useColorModeValue("#64748b", "secondaryGray.600");

  if (!active || !payload || !payload.length) return null;
  return (
    <Box bg={bg} border="1px solid" borderColor={border} borderRadius="10px" px={3} py={2}
      boxShadow="0 4px 20px rgba(249,115,22,0.15)"
    >
      <Text color={subC} fontSize="10px" mb="3px" fontWeight="700" letterSpacing="0.5px">{label}</Text>
      {payload.map((p, i) => (
        <Text key={i} color={textC} fontSize="12px" fontWeight="800">
          {p.name === "revenue" ? `${p.value} tr đ` : `${p.value} vé`}
        </Text>
      ))}
    </Box>
  );
}

// ─── SECTION TITLE ─────────────────────────────────────────────────────────
function SectionTitle({ label, icon, action }) {
  const { sectionColor } = useThemeColors();
  return (
    <Flex align="center" justify="space-between" mb="14px">
      <Flex align="center" gap="8px">
        {icon && <Icon as={icon} boxSize="14px" color="#f97316" />}
        <Text fontSize="11px" fontWeight="800" color={sectionColor} letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      {action}
    </Flex>
  );
}

// ─── QUICK ACTION BUTTON ───────────────────────────────────────────────────
function QuickAction({ icon, label, desc, accent, onClick, delay = 0 }) {
  const { cardBg, borderColor, textColor, subTextColor, shadow, hoverShadow } = useThemeColors();
  const activeBg = useColorModeValue(`${accent}10`, `${accent}18`);
  const iconBg = useColorModeValue(`${accent}15`, `${accent}20`);
  const border = useColorModeValue(borderColor, `${accent}30`);

  return (
    <Box
      cursor="pointer" bg={cardBg} borderRadius="14px"
      border="1.5px solid" borderColor={border}
      boxShadow={shadow} p={{ base: "12px", md: "14px" }}
      transition="all 0.25s"
      _hover={{ transform: "translateY(-3px)", boxShadow: hoverShadow, borderColor: accent, bg: activeBg }}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      onClick={onClick}
    >
      <Flex align="center" gap="10px">
        <Box w="40px" h="40px" borderRadius="11px" bg={iconBg}
          display="flex" alignItems="center" justifyContent="center" flexShrink="0"
        >
          <Icon as={icon} boxSize="18px" color={accent} />
        </Box>
        <Box flex="1" minW="0">
          <Text fontSize="13px" fontWeight="800" color={textColor} noOfLines={1}>{label}</Text>
          <Text fontSize="10.5px" color={subTextColor} fontWeight="600" noOfLines={1}>{desc}</Text>
        </Box>
        <Icon as={MdArrowForward} boxSize="14px" color={subTextColor} flexShrink="0" />
      </Flex>
    </Box>
  );
}

// ─── KPI CARD ──────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, growth, accent, delay = 0 }) {
  const { cardBg, borderColor, textColor, subTextColor, mutedColor, shadow, hoverShadow } = useThemeColors();
  const iconBg = useColorModeValue(`${accent}15`, `${accent}20`);
  const isPositive = growth >= 0;
  const growthColor = isPositive ? "#10b981" : "#dc2626";
  const growthBg = useColorModeValue(
    isPositive ? "#ecfdf5" : "#fef2f2",
    isPositive ? "rgba(16,185,129,0.15)" : "rgba(220,38,38,0.15)"
  );

  return (
    <Box
      position="relative" overflow="hidden" bg={cardBg}
      borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "14px", md: "18px" }}
      transition="all 0.25s"
      _hover={{ transform: "translateY(-3px)", boxShadow: hoverShadow }}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
    >
      {/* Accent glow */}
      <Box position="absolute" top="-30px" right="-30px" w="90px" h="90px"
        borderRadius="full" bg={`${accent}18`} filter="blur(24px)" pointerEvents="none"
      />

      <Flex justify="space-between" align="flex-start" mb="12px">
        <Box w="42px" h="42px" borderRadius="12px" bg={iconBg}
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
        <Flex align="center" gap="3px" px="8px" py="3px" borderRadius="7px" bg={growthBg}>
          <Icon as={MdTrendingUp} boxSize="11px" color={growthColor}
            style={{ transform: isPositive ? "none" : "scaleY(-1)" }}
          />
          <Text fontSize="10.5px" fontWeight="800" color={growthColor}>
            {Math.abs(growth)}%
          </Text>
        </Flex>
      </Flex>

      <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color={textColor} lineHeight="1" letterSpacing="-0.5px" mb="4px">
        {value}
      </Text>
      <Text fontSize="12px" fontWeight="700" color={subTextColor} mb="2px">{label}</Text>
      <Text fontSize="10.5px" color={mutedColor} fontWeight="500">{sub}</Text>
    </Box>
  );
}

// ─── UPCOMING SHOWTIME ROW ─────────────────────────────────────────────────
function ShowtimeRow({ st }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, dividerBg } = useThemeColors();
  const isUrgent = st.minutesUntil <= 30;
  const isLow = st.seatsLeft < 15;

  return (
    <Flex align="center" gap="12px" p="10px 12px" borderRadius="10px"
      bg={innerCardBg} border="1px solid" borderColor={dividerBg}
      transition="all 0.2s"
      _hover={{ borderColor: "#fed7aa", transform: "translateX(2px)" }}
    >
      {/* Time */}
      <Box minW={{ base: "60px", md: "70px" }} textAlign="center" flexShrink="0">
        <Text fontSize="16px" fontWeight="900" color="#f97316" lineHeight="1">{st.time}</Text>
        <Text fontSize="9px" color={isUrgent ? "#dc2626" : mutedColor} fontWeight="800" mt="2px" letterSpacing="0.3px">
          {isUrgent ? `⚠ ${st.minutesUntil}p` : `${st.minutesUntil}p nữa`}
        </Text>
      </Box>

      {/* Divider */}
      <Box w="1px" h="36px" bg={dividerBg} flexShrink="0" />

      {/* Info */}
      <Box flex="1" minW="0">
        <Text fontSize="12.5px" fontWeight="800" color={textColor} noOfLines={1} mb="3px">
          {st.movie}
        </Text>
        <Flex gap="8px" flexWrap="wrap">
          <Flex align="center" gap="3px">
            <Icon as={MdLocationOn} boxSize="10px" color={mutedColor} />
            <Text fontSize="10.5px" color={subTextColor} fontWeight="600">Phòng {st.room}</Text>
          </Flex>
          <Badge fontSize="9px"
            bg={st.format === "IMAX" ? useColorModeValue("#eff6ff", "rgba(37,99,235,0.15)") : useColorModeValue("#f1f5f9", "whiteAlpha.100")}
            color={st.format === "IMAX" ? useColorModeValue("#2563eb", "#93c5fd") : subTextColor}
            borderRadius="4px" px="6px"
          >
            {st.format}
          </Badge>
        </Flex>
      </Box>

      {/* Seats */}
      <Box textAlign="right" flexShrink="0" minW="70px">
        <Text fontSize="12px" fontWeight="800" color={isLow ? "#dc2626" : textColor}>
          {st.seatsLeft}/{st.total}
        </Text>
        <Text fontSize="9.5px" color={mutedColor} fontWeight="700">ghế trống</Text>
      </Box>
    </Flex>
  );
}

// ─── TOP MOVIE ROW ─────────────────────────────────────────────────────────
function TopMovieRow({ movie, index }) {
  const { textColor, subTextColor, mutedColor, dividerBg } = useThemeColors();
  const isFirst = index === 0;

  return (
    <Box pb="10px" mb="10px" borderBottom="1px solid" borderColor={dividerBg}
      _last={{ pb: 0, mb: 0, borderBottom: "none" }}
    >
      <Flex justify="space-between" align="center" mb="8px">
        <Flex align="center" gap="8px" minW="0" flex="1">
          <Text fontSize="11px" fontWeight="900" color={isFirst ? "#f97316" : mutedColor} flexShrink="0">
            #{String(index + 1).padStart(2, "0")}
          </Text>
          <Text fontSize="12.5px" fontWeight="700" color={textColor} noOfLines={1}>
            {movie.title}
          </Text>
        </Flex>
        <Flex align="center" gap="3px" flexShrink="0">
          <Icon as={MdStar} boxSize="11px" color="#fbbf24" />
          <Text fontSize="11px" fontWeight="800" color={textColor}>{movie.rating}</Text>
        </Flex>
      </Flex>
      <Flex align="center" gap="10px">
        <Box flex="1" h="6px" borderRadius="full" bg={dividerBg} overflow="hidden">
          <Box h="100%" borderRadius="full"
            bg={isFirst ? "linear-gradient(90deg, #f97316, #fbbf24)" : "linear-gradient(90deg, #fb923c, #fed7aa)"}
            w={`${movie.fill}%`} transition="width 0.6s ease"
          />
        </Box>
        <Text fontSize="10.5px" fontWeight="700" color={subTextColor} flexShrink="0" minW="60px" textAlign="right">
          {movie.tickets} vé
        </Text>
        <Text fontSize="10.5px" fontWeight="800" color="#f97316" flexShrink="0" minW="50px" textAlign="right">
          {movie.revenue}tr
        </Text>
      </Flex>
    </Box>
  );
}

// ─── TRANSACTION ROW ───────────────────────────────────────────────────────
function TransactionRow({ tx, index }) {
  const { textColor, subTextColor, mutedColor, dividerBg } = useThemeColors();

  const statusCfg = {
    success:  { label: "Thành công", color: "#059669", bg: useColorModeValue("#ecfdf5", "rgba(16,185,129,0.15)") },
    pending:  { label: "Chờ xử lý",  color: "#b45309", bg: useColorModeValue("#fffbeb", "rgba(245,158,11,0.15)") },
    refunded: { label: "Hoàn tiền",  color: "#dc2626", bg: useColorModeValue("#fef2f2", "rgba(220,38,38,0.15)") },
  };
  const methodCfg = {
    cash:   { label: "Tiền mặt",      icon: "💵" },
    card:   { label: "Thẻ",           icon: "💳" },
    wallet: { label: "Ví điện tử",    icon: "📱" },
  };
  const s = statusCfg[tx.status] || statusCfg.success;
  const m = methodCfg[tx.method] || methodCfg.cash;

  return (
    <Box p="10px 12px" borderRadius="10px"
      transition="all 0.15s"
      _hover={{ bg: useColorModeValue("#fffbf7", "rgba(249,115,22,0.08)") }}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.04}s both` }}
    >
      <Flex align="center" gap="12px">
        {/* Avatar */}
        <Avatar size="sm" name={tx.customer} bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          w="34px" h="34px" fontSize="12px" fontWeight="800" flexShrink="0"
        />

        {/* Info */}
        <Box flex="1" minW="0">
          <Flex align="center" gap="8px" mb="2px" flexWrap="wrap">
            <Text fontSize="12.5px" fontWeight="800" color={textColor} noOfLines={1}>{tx.customer}</Text>
            <Badge fontSize="9px" bg={s.bg} color={s.color} borderRadius="5px" px="6px" py="1px" fontWeight="800">
              {s.label}
            </Badge>
          </Flex>
          <Flex gap="8px" flexWrap="wrap">
            <Text fontSize="10.5px" color={subTextColor} fontWeight="600" noOfLines={1}>
              {tx.movie}
            </Text>
            <Text fontSize="10.5px" color={mutedColor} fontWeight="600">
              • Ghế {tx.seats}
            </Text>
          </Flex>
        </Box>

        {/* Method */}
        <Flex align="center" gap="4px" flexShrink="0" display={{ base: "none", md: "flex" }}>
          <Text fontSize="13px">{m.icon}</Text>
          <Text fontSize="10.5px" color={subTextColor} fontWeight="600">{m.label}</Text>
        </Flex>

        {/* Time */}
        <Text fontSize="10.5px" color={mutedColor} fontWeight="700" flexShrink="0" display={{ base: "none", sm: "block" }}>
          {tx.time}
        </Text>

        {/* Amount */}
        <Text fontSize="12.5px" fontWeight="800" color={textColor} flexShrink="0" minW="70px" textAlign="right">
          {tx.amount.toLocaleString("vi-VN")}đ
        </Text>
      </Flex>
    </Box>
  );
}

// ─── NOTIFICATION ITEM ─────────────────────────────────────────────────────
function NotificationItem({ notif }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, dividerBg } = useThemeColors();

  const typeCfg = {
    info:    { color: "#2563eb", bg: useColorModeValue("#eff6ff", "rgba(37,99,235,0.15)"), icon: MdInfo },
    warning: { color: "#b45309", bg: useColorModeValue("#fffbeb", "rgba(245,158,11,0.15)"), icon: MdWarning },
    success: { color: "#059669", bg: useColorModeValue("#ecfdf5", "rgba(16,185,129,0.15)"), icon: MdCheckCircle },
  };
  const cfg = typeCfg[notif.type] || typeCfg.info;

  return (
    <Flex align="flex-start" gap="10px" p="10px 12px" borderRadius="10px"
      bg={innerCardBg} border="1px solid" borderColor={dividerBg}
    >
      <Box w="28px" h="28px" borderRadius="8px" bg={cfg.bg}
        display="flex" alignItems="center" justifyContent="center" flexShrink="0"
      >
        <Icon as={cfg.icon} boxSize="14px" color={cfg.color} />
      </Box>
      <Box flex="1" minW="0">
        <Text fontSize="12px" color={textColor} fontWeight="600" lineHeight="1.4" mb="3px">
          {notif.message}
        </Text>
        <Text fontSize="10px" color={mutedColor} fontWeight="600">{notif.time}</Text>
      </Box>
    </Flex>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function DashboardCa() {
  const navigate = useNavigate();
  const {
    pageBg, cardBg, borderColor, textColor, subTextColor, mutedColor,
    sectionColor, dividerBg, shadow, hoverShadow,
  } = useThemeColors();

  const greetingBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.08))"
  );
  const greetingBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");
  const liveBg = useColorModeValue("#ecfdf5", "rgba(16,185,129,0.15)");
  const liveBorder = useColorModeValue("#6ee7b7", "rgba(16,185,129,0.3)");
  const liveText = useColorModeValue("#059669", "#34d399");
  const chartGridStroke = useColorModeValue("rgba(0,0,0,0.04)", "rgba(255,255,255,0.06)");
  const axisTickFill = useColorModeValue("#94a3b8", "#718096");

  return (
    <Box pt={{ base: "100px", md: "80px" }} pb="40px">
      {/* Page Header */}
      <Flex
        justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="16px" gap="12px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={MdPointOfSale} boxSize="18px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">
              Tổng quan ca
            </Text>
          </Flex>
          <Flex align="center" gap="6px" pl="48px">
            <Icon as={MdCalendarToday} boxSize="11px" color={mutedColor} />
            <Text color={mutedColor} fontSize="12.5px" fontWeight="600">
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </Flex>
        </Box>
        <Flex gap="8px" align="center" flexWrap="wrap">
          <Flex align="center" gap="6px" px="12px" py="7px" borderRadius="10px"
            bg={liveBg} border="1px solid" borderColor={liveBorder}
          >
            <Box w="6px" h="6px" borderRadius="full" bg="#10b981"
              sx={{ animation: `${pulse} 1.8s ease infinite` }}
            />
            <Text fontSize="11.5px" fontWeight="700" color={liveText}>Ca sáng 8:00 – 16:00</Text>
          </Flex>
          <Flex align="center" gap="6px" px="12px" py="7px" borderRadius="10px"
            bg={cardBg} border="1px solid" borderColor={borderColor}
          >
            <Avatar size="xs" name="Nguyễn Văn A" bg="linear-gradient(135deg, #f97316, #fb923c)" color="white" />
            <Text fontSize="11.5px" fontWeight="700" color={subTextColor}>NV: Nguyễn Văn A</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Greeting Banner */}
      <Box
        p={{ base: "16px", md: "20px" }} mb="16px" borderRadius="16px"
        bg={greetingBg} border="1px solid" borderColor={greetingBorder}
        position="relative" overflow="hidden"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Box position="absolute" top="-30px" right="-30px" w="120px" h="120px" borderRadius="full"
          bg="rgba(249,115,22,0.08)" pointerEvents="none"
        />
        <Flex align="center" gap="12px" position="relative">
          <Text fontSize={{ base: "28px", md: "36px" }}>👋</Text>
          <Box flex="1" minW="0">
            <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="800" color={useColorModeValue("#9a3412", "#fdba74")} mb="3px">
              Xin chào, Nguyễn Văn A!
            </Text>
            <Text fontSize={{ base: "12px", md: "13px" }} color={useColorModeValue("#7c2d12", "#fed7aa")} fontWeight="600">
              Bạn đã bán <Text as="span" fontWeight="900">{381} vé</Text> và thu về <Text as="span" fontWeight="900">{47.5}tr đ</Text> trong ca hôm nay. Cố lên! 🎬
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Quick Actions */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "10px", md: "12px" }} mb="16px">
        <QuickAction
          icon={MdConfirmationNumber} label="Bán vé tại quầy" desc="Tạo đơn mới cho khách"
          accent="#f97316" delay={0}
          onClick={() => navigate("/admin/ban-ve")}
        />
        <QuickAction
          icon={MdQrCodeScanner} label="Soát vé (Check-in)" desc="Quét mã QR vào phòng"
          accent="#10b981" delay={0.05}
          onClick={() => navigate("/admin/check-in")}
        />
        <QuickAction
          icon={MdReceipt} label="Đơn hàng" desc="Tra cứu đơn online"
          accent="#2563eb" delay={0.1}
          onClick={() => navigate("/admin/don-hang")}
        />
        <QuickAction
          icon={MdSearch} label="Tra cứu" desc="Phim, suất chiếu, combo"
          accent="#8b5cf6" delay={0.15}
          onClick={() => navigate("/admin/tra-cuu")}
        />
      </SimpleGrid>

      {/* KPI Row */}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: "10px", md: "12px" }} mb="16px">
        <KpiCard
          icon={MdAttachMoney} label="Doanh thu ca" value="47.5tr đ"
          sub="So với ca hôm qua" growth={12.4} accent="#f97316" delay={0.1}
        />
        <KpiCard
          icon={MdLocalActivity} label="Vé đã bán" value="381"
          sub="Trong ca hôm nay" growth={8.1} accent="#10b981" delay={0.15}
        />
        <KpiCard
          icon={MdPeople} label="Khách hàng" value="157"
          sub="Lượt khách phục vụ" growth={-3.2} accent="#8b5cf6" delay={0.2}
        />
        <KpiCard
          icon={MdEventSeat} label="Tỷ lệ lấp đầy" value="76%"
          sub="Trung bình các suất" growth={5.6} accent="#06b6d4" delay={0.25}
        />
      </SimpleGrid>

      {/* Charts Row 1 */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "12px", md: "16px" }} mb="16px">
        {/* Revenue by hour */}
        <Box
          gridColumn={{ lg: "span 2" }} bg={cardBg} borderRadius="16px"
          border="1px solid" borderColor={borderColor} boxShadow={shadow}
          p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          <SectionTitle
            label="Doanh thu ca theo giờ" icon={MdTrendingUp}
            action={
              <HStack spacing={3} fontSize="10.5px" color={subTextColor}>
                <HStack spacing="4px">
                  <Box w="8px" h="8px" borderRadius="full" bg="#f97316" />
                  <Text fontWeight="600">Doanh thu (tr đ)</Text>
                </HStack>
                <HStack spacing="4px">
                  <Box w="8px" h="8px" borderRadius="full" bg="#fb923c" />
                  <Text fontWeight="600">Vé bán</Text>
                </HStack>
              </HStack>
            }
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_BY_HOUR} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: axisTickFill }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: axisTickFill }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#f97316", strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#f97316" strokeWidth={2.5}
                fill="url(#gradRev)" dot={false} activeDot={{ r: 5, fill: "#f97316", stroke: "white", strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="tickets" name="tickets" stroke="#fb923c" strokeWidth={2}
                fill="url(#gradTix)" dot={false} activeDot={{ r: 4, fill: "#fb923c" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Upcoming showtimes */}
        <Box
          bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
          boxShadow={shadow} p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
        >
          <SectionTitle
            label="Suất chiếu sắp tới" icon={MdSchedule}
            action={
              <Badge fontSize="10px" bg={useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)")}
                color={useColorModeValue("#c2410c", "#fdba74")} borderRadius="6px" px="7px" py="2px" fontWeight="700"
              >
                {UPCOMING_SHOWTIMES.length}
              </Badge>
            }
          />
          <Flex direction="column" gap="8px" maxH="280px" overflowY="auto" pr="2px">
            {UPCOMING_SHOWTIMES.map((st) => <ShowtimeRow key={st.id} st={st} />)}
          </Flex>
        </Box>
      </SimpleGrid>

      {/* Charts Row 2 */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "12px", md: "16px" }} mb="16px">
        {/* Top movies */}
        <Box
          bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
          boxShadow={shadow} p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeUp} 0.4s ease 0.2s both` }}
        >
          <SectionTitle label="Top phim trong ca" icon={MdMovie} />
          {TOP_MOVIES.map((m, i) => <TopMovieRow key={i} movie={m} index={i} />)}
        </Box>

        {/* Recent transactions */}
        <Box
          gridColumn={{ lg: "span 2" }} bg={cardBg} borderRadius="16px"
          border="1px solid" borderColor={borderColor} boxShadow={shadow}
          p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeUp} 0.4s ease 0.25s both` }}
        >
          <SectionTitle
            label="Giao dịch gần đây" icon={MdReceipt}
            action={
              <Button
                size="xs" h="26px" px="10px" borderRadius="7px"
                bg="transparent" color="#f97316" fontWeight="700" fontSize="11px"
                _hover={{ bg: useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)") }}
                rightIcon={<Icon as={MdArrowForward} boxSize="11px" />}
                onClick={() => navigate("/admin/don-hang")}
              >
                Xem tất cả
              </Button>
            }
          />
          <VStack spacing="2px" align="stretch" maxH="320px" overflowY="auto">
            {RECENT_TRANSACTIONS.map((tx, i) => <TransactionRow key={tx.id} tx={tx} index={i} />)}
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Notifications */}
      <Box
        bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
        boxShadow={shadow} p={{ base: "16px", md: "20px" }}
        sx={{ animation: `${fadeUp} 0.4s ease 0.3s both` }}
      >
        <SectionTitle
          label="Thông báo từ hệ thống" icon={MdNotifications}
          action={
            <Badge fontSize="10px" bg={useColorModeValue("#fef2f2", "rgba(220,38,38,0.15)")}
              color="#dc2626" borderRadius="6px" px="7px" py="2px" fontWeight="700"
            >
              3 mới
            </Badge>
          }
        />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="10px">
          {NOTIFICATIONS.map((n) => <NotificationItem key={n.id} notif={n} />)}
        </SimpleGrid>
      </Box>
    </Box>
  );
}