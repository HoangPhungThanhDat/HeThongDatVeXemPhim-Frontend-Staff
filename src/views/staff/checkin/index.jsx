import React, { useState, useCallback } from "react";
import {
  Box, Flex, Grid, Text, Button, Input, Badge, SimpleGrid,
  Icon, keyframes, Image, useColorModeValue, Spinner, Tooltip,
  Progress, Divider, Avatar, HStack, VStack, IconButton,
} from "@chakra-ui/react";
import {
  MdQrCodeScanner, MdCameraAlt, MdFlashOn, MdFlashOff,
  MdKeyboard, MdCheckCircle, MdCancel, MdWarning, MdError,
  MdPerson, MdMovie, MdSchedule, MdChair, MdLocationOn,
  MdAccessTime, MdHistory, MdVolumeUp, MdVolumeOff,
  MdThumbUp, MdArrowBack, MdConfirmationNumber,
  MdPrint, MdReplay, MdFilterList, MdFullscreen,
  MdSearch, MdTrendingUp, MdRefresh,
} from "react-icons/md";
import { FaQrcode } from "react-icons/fa";

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════
const fadeUp    = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn    = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn   = keyframes`from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}`;
const scanLine  = keyframes`0%{transform:translateY(0)}100%{transform:translateY(100%)}`;
const pulse     = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(1.08)}`;
const successRing = keyframes`
  0%{box-shadow:0 0 0 0 rgba(16,185,129,0.55)}
  70%{box-shadow:0 0 0 24px rgba(16,185,129,0)}
  100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}
`;
const errorShake = keyframes`
  0%,100%{transform:translateX(0)}
  20%,60%{transform:translateX(-7px)}
  40%,80%{transform:translateX(7px)}
`;
const spin = keyframes`from{transform:rotate(0)}to{transform:rotate(360deg)}`;

// ═══════════════════════════════════════════════════════════════
// TOKENS — 1 nguồn sự thật duy nhất
// ═══════════════════════════════════════════════════════════════
const BRAND = {
  orange:       "#F97316",
  orangeLight:  "#FB923C",
  orangeSoft:   "rgba(249,115,22,0.10)",
  orangeBorder: "rgba(249,115,22,0.35)",
};

const STATUS = {
  valid: {
    color: "#059669", colorDark: "#34D399",
    bg: "#ECFDF5", bgDark: "rgba(16,185,129,0.12)",
    border: "#6EE7B7", borderDark: "rgba(16,185,129,0.35)",
    icon: MdCheckCircle, label: "VÉ HỢP LỆ", sub: "Có thể cho khách vào phòng",
  },
  used: {
    color: "#B45309", colorDark: "#FBBF24",
    bg: "#FFFBEB", bgDark: "rgba(245,158,11,0.12)",
    border: "#FCD34D", borderDark: "rgba(245,158,11,0.35)",
    icon: MdWarning, label: "VÉ ĐÃ SỬ DỤNG", sub: "Vé này đã check-in trước đó",
  },
  invalid: {
    color: "#DC2626", colorDark: "#F87171",
    bg: "#FEF2F2", bgDark: "rgba(220,38,38,0.12)",
    border: "#FCA5A5", borderDark: "rgba(220,38,38,0.35)",
    icon: MdCancel, label: "VÉ KHÔNG HỢP LỆ", sub: "Mã vé không tồn tại trong hệ thống",
  },
  "wrong-showtime": {
    color: "#DC2626", colorDark: "#F87171",
    bg: "#FEF2F2", bgDark: "rgba(220,38,38,0.12)",
    border: "#FCA5A5", borderDark: "rgba(220,38,38,0.35)",
    icon: MdError, label: "SAI SUẤT CHIẾU", sub: "Vé không thuộc suất chiếu hiện tại",
  },
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const RECENT_HISTORY = [
  { id: 1, time: "14:05:22", seat: "F5", movie: "Avengers",   status: "success" },
  { id: 2, time: "14:03:10", seat: "E2", movie: "Avengers",   status: "warning" },
  { id: 3, time: "14:01:45", seat: "D7", movie: "Avengers",   status: "success" },
  { id: 4, time: "13:58:30", seat: "C3", movie: "Spider-Man", status: "success" },
  { id: 5, time: "13:55:12", seat: "B9", movie: "Spider-Man", status: "error" },
  { id: 6, time: "13:52:08", seat: "A4", movie: "Spider-Man", status: "success" },
];

const MOCK_TICKET = {
  code: "TK-2026-0042",
  movie: "Avengers: Infinity War",
  poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
  showtime: "14:00", room: "P1", format: "2D",
  date: "Thứ 4, 14/10/2026",
  seats: ["F5", "F6"],
  customer: "Nguyễn Văn A", phone: "0901 *** 456",
  combo: "Combo Couple x1", total: 250000,
  bookedAt: "13:45", status: "valid",
};

// ═══════════════════════════════════════════════════════════════
// THEME HOOK
// ═══════════════════════════════════════════════════════════════
function useTheme() {
  return {
    cardBg:     useColorModeValue("white", "navy.800"),
    surfaceBg:  useColorModeValue("#F8FAFC", "navy.700"),
    surfaceBd:  useColorModeValue("#F1F5F9", "whiteAlpha.100"),
    border:     useColorModeValue("#E8EDF3", "whiteAlpha.100"),
    text:       useColorModeValue("#0F172A", "white"),
    subText:    useColorModeValue("#475569", "secondaryGray.600"),
    muted:      useColorModeValue("#94A3B8", "secondaryGray.600"),
    dim:        useColorModeValue("#CBD5E1", "whiteAlpha.400"),
    shadow:     useColorModeValue("0 1px 3px rgba(15,23,42,0.06)", "0 1px 3px rgba(0,0,0,0.4)"),
    shadowLg:   useColorModeValue("0 8px 24px rgba(15,23,42,0.08)", "0 8px 24px rgba(0,0,0,0.5)"),
  };
}

// Helper cho màu theo theme + status
const themedColor = (light, dark) => useColorModeValue(light, dark);

// ═══════════════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════════════
function SectionHeader({ title, right, accent = "orange" }) {
  const t = useTheme();
  const accentColor = accent === "orange" ? BRAND.orange : "#3B82F6";
  return (
    <Flex align="center" justify="space-between" mb="16px">
      <HStack spacing="10px">
        <Box w="3px" h="14px" borderRadius="full"
          bgGradient="linear(180deg, #F97316, #FBBF24)" />
        <Text fontSize="11px" fontWeight="800" color={t.text}
          letterSpacing="1.4px" textTransform="uppercase">
          {title}
        </Text>
      </HStack>
      {right}
    </Flex>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCANNER PANEL
// ═══════════════════════════════════════════════════════════════
function ScannerPanel({ flash, setFlash, sound, setSound, manualCode, setManualCode, onSubmit, scanning }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  const toggleBg = (active) => active
    ? themedColor("#FFF7ED", "rgba(249,115,22,0.15)")
    : themedColor("#F8FAFC", "navy.700");
  const toggleBd = (active) => active
    ? themedColor("#FED7AA", "rgba(249,115,22,0.4)")
    : themedColor("#E2E8F0", "whiteAlpha.100");

  return (
    <Box
      bg={t.cardBg} borderRadius="20px" border="1px solid" borderColor={t.border}
      boxShadow={t.shadow} p={{ base: "18px", md: "24px" }}
      sx={{ animation: `${fadeUp} 0.45s ease both` }}
    >
      <SectionHeader
        title="Quét mã QR"
        right={
          <HStack spacing="6px">
            <Tooltip label={flash ? "Tắt đèn" : "Bật đèn"} hasArrow>
              <IconButton
                size="sm" h="32px" w="32px" borderRadius="9px"
                bg={toggleBg(flash)} color={flash ? BRAND.orange : t.muted}
                border="1px solid" borderColor={toggleBd(flash)}
                _hover={{ bg: t.surfaceBg }} icon={<MdFlashOn size={15} />}
                onClick={() => setFlash(!flash)} aria-label="toggle flash"
              />
            </Tooltip>
            <Tooltip label={sound ? "Tắt âm" : "Bật âm"} hasArrow>
              <IconButton
                size="sm" h="32px" w="32px" borderRadius="9px"
                bg={toggleBg(sound)} color={sound ? BRAND.orange : t.muted}
                border="1px solid" borderColor={toggleBd(sound)}
                _hover={{ bg: t.surfaceBg }} icon={<MdVolumeUp size={15} />}
                onClick={() => setSound(!sound)} aria-label="toggle sound"
              />
            </Tooltip>
          </HStack>
        }
      />

      {/* Camera viewport */}
      <Box
        position="relative" w="100%" aspectRatio="1/1"
        maxH={{ base: "340px", md: "440px" }} mx="auto"
        borderRadius="20px" overflow="hidden"
        bg="linear-gradient(145deg, #1E293B 0%, #0F172A 100%)"
        border="2px solid" borderColor="#0F172A"
        boxShadow="inset 0 0 60px rgba(0,0,0,0.5)"
      >
        {/* Background pattern */}
        <Box position="absolute" inset="0" opacity="0.06"
          backgroundImage="radial-gradient(circle, #F97316 1px, transparent 1px)"
          backgroundSize="20px 20px" />

        {/* Center placeholder */}
        <Flex position="absolute" inset="0" align="center" justify="center" direction="column" zIndex="1">
          <Box
            w="104px" h="104px" borderRadius="full"
            bg="rgba(249,115,22,0.08)" border="2px dashed rgba(249,115,22,0.45)"
            display="flex" alignItems="center" justifyContent="center" mb="14px"
            sx={{ animation: `${pulse} 2.4s ease infinite` }}
          >
            <Icon as={MdCameraAlt} boxSize="42px" color={BRAND.orange} />
          </Box>
          <Text fontSize="13px" color="#CBD5E1" fontWeight="700" letterSpacing="0.2px">
            Đưa mã QR vào khung hình
          </Text>
          <Text fontSize="11px" color="#64748B" mt="4px" fontWeight="500">
            Camera tự động nhận diện
          </Text>
        </Flex>

        {/* Corner brackets */}
        {[
          { top: "18px", left: "18px", borderTop: `3px solid ${BRAND.orange}`, borderLeft: `3px solid ${BRAND.orange}`, borderTopLeftRadius: "14px" },
          { top: "18px", right: "18px", borderTop: `3px solid ${BRAND.orange}`, borderRight: `3px solid ${BRAND.orange}`, borderTopRightRadius: "14px" },
          { bottom: "18px", left: "18px", borderBottom: `3px solid ${BRAND.orange}`, borderLeft: `3px solid ${BRAND.orange}`, borderBottomLeftRadius: "14px" },
          { bottom: "18px", right: "18px", borderBottom: `3px solid ${BRAND.orange}`, borderRight: `3px solid ${BRAND.orange}`, borderBottomRightRadius: "14px" },
        ].map((s, i) => (
          <Box key={i} position="absolute" w="32px" h="32px" {...s} />
        ))}

        {/* Scan line */}
        {!scanning && (
          <Box
            position="absolute" left="18px" right="18px" h="2px"
            bg="linear-gradient(90deg, transparent, #F97316, transparent)"
            boxShadow="0 0 14px #F97316"
            sx={{ animation: `${scanLine} 2.4s ease-in-out infinite` }}
            zIndex="2"
          />
        )}

        {/* Scanning overlay */}
        {scanning && (
          <Flex position="absolute" inset="0" align="center" justify="center"
            bg="rgba(15,23,42,0.75)" backdropFilter="blur(4px)" zIndex="3"
            sx={{ animation: `${fadeIn} 0.2s ease` }}
          >
            <VStack spacing="12px">
              <Box sx={{ animation: `${spin} 0.9s linear infinite` }}>
                <Spinner size="lg" color={BRAND.orange} thickness="3px" />
              </Box>
              <Text fontSize="12px" color="white" fontWeight="700" letterSpacing="0.5px">
                ĐANG XÁC THỰC...
              </Text>
            </VStack>
          </Flex>
        )}
      </Box>

      {/* Manual input */}
      <Box mt="16px">
        <Flex align="center" gap="6px" mb="8px">
          <Icon as={MdKeyboard} boxSize="13px" color={t.muted} />
          <Text fontSize="10.5px" fontWeight="800" color={t.subText}
            letterSpacing="0.9px" textTransform="uppercase">
            Hoặc nhập mã thủ công
          </Text>
        </Flex>
        <Flex gap="8px">
          <Input
            h="44px" borderRadius="11px" fontSize="13px" fontWeight="600"
            placeholder="TK-2026-XXXX"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            bg={t.surfaceBg}
            border="1.5px solid" borderColor={focused ? BRAND.orange : t.border}
            color={t.text}
            _placeholder={{ color: t.muted, fontWeight: "500" }}
            _focus={{ borderColor: BRAND.orange, boxShadow: `0 0 0 3px ${BRAND.orangeSoft}` }}
            _hover={{ borderColor: focused ? BRAND.orange : t.dim }}
            transition="all 0.2s" fontFamily="mono"
          />
          <Button
            h="44px" px="20px" borderRadius="11px" fontWeight="800" fontSize="13px"
            bgGradient="linear(135deg, #F97316, #FB923C)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ opacity: 0.92, transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(249,115,22,0.45)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            leftIcon={<Icon as={MdSearch} boxSize="15px" />}
            onClick={onSubmit}
            isDisabled={!manualCode.trim()}
          >
            Kiểm tra
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// STATS PANEL
// ═══════════════════════════════════════════════════════════════
function StatsPanel({ stats }) {
  const t = useTheme();
  const total = Math.max(1, stats.success + stats.warning + stats.error);
  const percent = Math.round((stats.success / total) * 100);

  const items = [
    { label: "Hợp lệ",  value: stats.success, icon: MdCheckCircle, color: "#10B981",
      bg: themedColor("#ECFDF5", "rgba(16,185,129,0.12)"),
      bd: themedColor("#A7F3D0", "rgba(16,185,129,0.3)") },
    { label: "Đã dùng", value: stats.warning, icon: MdWarning, color: "#F59E0B",
      bg: themedColor("#FFFBEB", "rgba(245,158,11,0.12)"),
      bd: themedColor("#FDE68A", "rgba(245,158,11,0.3)") },
    { label: "Từ chối", value: stats.error, icon: MdCancel, color: "#EF4444",
      bg: themedColor("#FEF2F2", "rgba(239,68,68,0.12)"),
      bd: themedColor("#FECACA", "rgba(239,68,68,0.3)") },
    { label: "Tổng",    value: stats.total, icon: MdHistory, color: "#64748B",
      bg: themedColor("#F8FAFC", "navy.700"),
      bd: themedColor("#E2E8F0", "whiteAlpha.100") },
  ];

  return (
    <Box
      bg={t.cardBg} borderRadius="20px" border="1px solid" borderColor={t.border}
      boxShadow={t.shadow} p={{ base: "18px", md: "24px" }}
      sx={{ animation: `${fadeUp} 0.45s ease 0.08s both` }}
    >
      <SectionHeader
        title="Thống kê ca"
        right={<Badge fontSize="10px" bg={t.surfaceBg} color={t.muted}
          borderRadius="6px" px="8px" py="3px" fontWeight="700">8:00 – 16:00</Badge>}
      />

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
        {items.map((it) => (
          <Box key={it.label} p="14px 12px" borderRadius="13px"
            bg={it.bg} border="1px solid" borderColor={it.bd}
            transition="all 0.2s cubic-bezier(0.4,0,0.2,1)"
            _hover={{ transform: "translateY(-3px)", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
          >
            <HStack spacing="6px" mb="8px">
              <Icon as={it.icon} boxSize="13px" color={it.color} />
              <Text fontSize="9.5px" fontWeight="800" color={it.color}
                letterSpacing="0.7px" textTransform="uppercase">
                {it.label}
              </Text>
            </HStack>
            <Text fontSize="24px" fontWeight="900" color={t.text} lineHeight="1"
              letterSpacing="-0.5px">
              {it.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box>
        <Flex justify="space-between" align="center" mb="8px">
          <HStack spacing="6px">
            <Icon as={MdTrendingUp} boxSize="13px" color={BRAND.orange} />
            <Text fontSize="11px" fontWeight="700" color={t.subText}>
              Tiến độ check-in
            </Text>
          </HStack>
          <Text fontSize="12px" fontWeight="900" color={BRAND.orange}>
            {percent}%
          </Text>
        </Flex>
        <Progress
          value={percent} h="7px" borderRadius="full"
          bg={t.surfaceBg}
          sx={{
            "& > div": {
              background: "linear-gradient(90deg, #F97316, #FBBF24)",
              borderRadius: "full",
            },
          }}
        />
        <Text fontSize="10.5px" color={t.muted} fontWeight="600" mt="6px" textAlign="right">
          {stats.success}/{total} vé đã check-in
        </Text>
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════════════════════════════
function ResultCard({ ticket, onConfirm, onCancel, confirming }) {
  const t = useTheme();

  // Empty state
  if (!ticket) {
    return (
      <Box
        bg={t.cardBg} borderRadius="20px"
        border="1.5px dashed" borderColor={t.dim}
        p={{ base: "40px 24px", md: "56px 28px" }} textAlign="center"
        sx={{ animation: `${fadeIn} 0.5s ease both` }}
        minH="320px"
        display="flex" flexDirection="column" justifyContent="center"
      >
        <Box
          w="80px" h="80px" borderRadius="full" mx="auto" mb="18px"
          bg={t.surfaceBg} border="2px dashed" borderColor={t.dim}
          display="flex" alignItems="center" justifyContent="center"
          sx={{ animation: `${pulse} 2.8s ease infinite` }}
        >
          <Icon as={FaQrcode} boxSize="32px" color={t.muted} />
        </Box>
        <Text fontSize="15px" fontWeight="800" color={t.subText} mb="6px">
          Chưa có vé nào được quét
        </Text>
        <Text fontSize="12.5px" color={t.muted} fontWeight="500">
          Kết quả sẽ hiển thị ở đây sau khi quét mã QR
        </Text>
      </Box>
    );
  }

  const cfg = STATUS[ticket.status] || STATUS.invalid;
  const cfgColor = themedColor(cfg.color, cfg.colorDark);
  const cfgBg = themedColor(cfg.bg, cfg.bgDark);
  const cfgBd = themedColor(cfg.border, cfg.borderDark);

  const isSuccess = ticket.status === "valid";

  return (
    <Box
      bg={t.cardBg} borderRadius="20px" border="1px solid" borderColor={t.border}
      boxShadow={t.shadowLg} overflow="hidden"
      sx={{
        animation: isSuccess
          ? `${scaleIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both, ${successRing} 1s ease`
          : `${scaleIn} 0.35s ease both, ${errorShake} 0.5s ease`,
      }}
    >
      {/* Status banner */}
      <Box bg={cfgBg} borderBottom="1px solid" borderColor={cfgBd}
        p={{ base: "18px", md: "22px" }} position="relative" overflow="hidden"
      >
        <Box position="absolute" top="-30px" right="-30px" w="120px" h="120px"
          borderRadius="full" bg={`${cfgColor}12`} />
        <Box position="absolute" bottom="-40px" right="20px" w="80px" h="80px"
          borderRadius="full" bg={`${cfgColor}08`} />

        <Flex align="center" gap="14px" position="relative">
          <Box
            w="52px" h="52px" borderRadius="16px" bg={t.cardBg}
            border={`2px solid ${cfgColor}`}
            display="flex" alignItems="center" justifyContent="center" flexShrink="0"
            boxShadow={`0 6px 16px ${cfgColor}35`}
          >
            <Icon as={cfg.icon} boxSize="26px" color={cfgColor} />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize={{ base: "16px", md: "18px" }} fontWeight="900"
              color={cfgColor} letterSpacing="0.3px" lineHeight="1.2">
              {cfg.label}
            </Text>
            <Text fontSize="12px" color={cfgColor} opacity="0.88"
              fontWeight="600" mt="3px" noOfLines={1}>
              {cfg.sub}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Ticket details */}
      <Box p={{ base: "18px", md: "22px" }}>
        {/* Movie header */}
        <Flex gap="14px" mb="18px">
          <Box position="relative" flexShrink="0">
            <Image
              src={ticket.poster} alt={ticket.movie}
              w="64px" h="90px" borderRadius="11px" objectFit="cover"
              border="1px solid" borderColor={t.border}
              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            />
            <Badge position="absolute" top="-6px" right="-6px"
              bg={BRAND.orange} color="white" fontSize="9px" fontWeight="900"
              borderRadius="full" px="6px" py="2px" boxShadow="0 2px 6px rgba(0,0,0,0.2)">
              {ticket.format}
            </Badge>
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="15px" fontWeight="800" color={t.text}
              noOfLines={2} lineHeight="1.35" mb="6px">
              {ticket.movie}
            </Text>
            <HStack spacing="6px" mb="6px" flexWrap="wrap">
              <Badge fontSize="10px" fontWeight="800"
                bg={themedColor("#EFF6FF", "rgba(37,99,235,0.15)")}
                color={themedColor("#2563EB", "#93C5FD")}
                borderRadius="6px" px="7px" py="2px" fontFamily="mono">
                {ticket.code}
              </Badge>
            </HStack>
            <HStack spacing="5px">
              <Icon as={MdSchedule} boxSize="11px" color={t.muted} />
              <Text fontSize="11.5px" color={t.subText} fontWeight="600">
                {ticket.date}
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Info grid */}
        <SimpleGrid columns={{ base: 2, sm: 3 }} spacing="8px" mb="16px">
          {[
            { icon: MdSchedule,   label: "Suất",   val: ticket.showtime },
            { icon: MdLocationOn, label: "Phòng",  val: ticket.room },
            { icon: MdChair,      label: "Ghế",    val: ticket.seats.join(", ") },
            { icon: MdPerson,     label: "Khách",  val: ticket.customer },
            { icon: MdConfirmationNumber, label: "SĐT", val: ticket.phone },
            { icon: MdAccessTime, label: "Đặt lúc", val: ticket.bookedAt },
          ].map(({ icon: Ic, label, val }) => (
            <Box key={label} p="9px 11px" borderRadius="10px"
              bg={t.surfaceBg} border="1px solid" borderColor={t.surfaceBd}
            >
              <HStack spacing="5px" mb="3px">
                <Icon as={Ic} boxSize="11px" color={BRAND.orange} />
                <Text fontSize="9px" fontWeight="800" color={t.muted}
                  letterSpacing="0.6px" textTransform="uppercase">
                  {label}
                </Text>
              </HStack>
              <Text fontSize="12px" fontWeight="700" color={t.text} noOfLines={1}>
                {val}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Combo */}
        {ticket.combo && (
          <Flex align="center" justify="space-between" p="11px 13px" mb="16px"
            bg={themedColor("#FFFBF7", "rgba(249,115,22,0.08)")}
            border="1px solid" borderColor={themedColor("#FED7AA", "rgba(249,115,22,0.25)")}
            borderRadius="11px"
          >
            <HStack spacing="9px">
              <Text fontSize="20px" lineHeight="1">🍿</Text>
              <Box>
                <Text fontSize="9.5px" fontWeight="800"
                  color={themedColor("#9A3412", "#FDBA74")}
                  letterSpacing="0.6px" textTransform="uppercase" mb="2px">
                  Combo kèm theo
                </Text>
                <Text fontSize="12.5px" fontWeight="700" color={t.text}>
                  {ticket.combo}
                </Text>
              </Box>
            </HStack>
            <Text fontSize="13px" fontWeight="900"
              color={themedColor("#EA580C", "#FB923C")}>
              {ticket.total.toLocaleString("vi-VN")}đ
            </Text>
          </Flex>
        )}

        {/* Divider */}
        <Divider borderColor={t.border} mb="16px" />

        {/* Actions */}
        {isSuccess ? (
          <Flex gap="10px">
            <Button
              flex="2" h="50px" borderRadius="13px" fontWeight="900" fontSize="13.5px"
              letterSpacing="0.4px"
              bgGradient="linear(135deg, #10B981, #059669)" color="white"
              boxShadow="0 5px 18px rgba(16,185,129,0.35)"
              _hover={{ boxShadow: "0 7px 24px rgba(16,185,129,0.48)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              leftIcon={confirming
                ? <Spinner size="xs" />
                : <Icon as={MdThumbUp} boxSize="16px" />}
              onClick={onConfirm} isDisabled={confirming}
            >
              {confirming ? "ĐANG XỬ LÝ..." : "XÁC NHẬN CHO VÀO"}
            </Button>
            <Button
              flex="1" h="50px" borderRadius="13px" fontWeight="700" fontSize="13px"
              bg="transparent" color={t.subText}
              border="1.5px solid" borderColor={t.border}
              _hover={{ bg: themedColor("#FEF2F2", "rgba(220,38,38,0.15)"), color: "#DC2626", borderColor: "#FCA5A5" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdCancel} boxSize="15px" />}
              onClick={onCancel} isDisabled={confirming}
            >
              Hủy
            </Button>
          </Flex>
        ) : (
          <Flex gap="8px">
            <Button flex="1" h="46px" borderRadius="12px" fontWeight="700" fontSize="12.5px"
              bg="transparent" color={t.subText} border="1.5px solid" borderColor={t.border}
              _hover={{ bg: t.surfaceBg }}
              leftIcon={<Icon as={MdArrowBack} boxSize="15px" />}
              onClick={onCancel}>
              Quay lại
            </Button>
            <Button flex="1" h="46px" borderRadius="12px" fontWeight="700" fontSize="12.5px"
              bg="transparent" color={t.subText} border="1.5px solid" borderColor={t.border}
              _hover={{ bg: t.surfaceBg }}
              leftIcon={<Icon as={MdPrint} boxSize="15px" />}>
              In lại
            </Button>
            {ticket.status !== "invalid" && (
              <Button flex="1" h="46px" borderRadius="12px" fontWeight="800" fontSize="12.5px"
                bgGradient="linear(135deg, #F97316, #FB923C)" color="white"
                boxShadow="0 4px 12px rgba(249,115,22,0.3)"
                _hover={{ opacity: 0.92, transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                leftIcon={<Icon as={MdReplay} boxSize="15px" />}>
                Xử lý
              </Button>
            )}
          </Flex>
        )}
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// HISTORY PANEL
// ═══════════════════════════════════════════════════════════════
function HistoryPanel({ history }) {
  const t = useTheme();

  const statusStyle = {
    success: { color: "#059669", icon: MdCheckCircle,
      bg: themedColor("#ECFDF5", "rgba(16,185,129,0.15)") },
    warning: { color: "#B45309", icon: MdWarning,
      bg: themedColor("#FFFBEB", "rgba(245,158,11,0.15)") },
    error:   { color: "#DC2626", icon: MdCancel,
      bg: themedColor("#FEF2F2", "rgba(220,38,38,0.15)") },
  };

  return (
    <Box
      bg={t.cardBg} borderRadius="20px" border="1px solid" borderColor={t.border}
      boxShadow={t.shadow} p={{ base: "18px", md: "22px" }}
      sx={{ animation: `${fadeUp} 0.45s ease 0.15s both` }}
    >
      <SectionHeader
        title="Lịch sử gần đây"
        right={
          <Button size="xs" h="28px" px="10px" borderRadius="8px"
            bg="transparent" color={t.subText}
            border="1px solid" borderColor={t.border}
            fontSize="11px" fontWeight="700"
            _hover={{ bg: t.surfaceBg }}
            leftIcon={<Icon as={MdFilterList} boxSize="11px" />}>
            Lọc
          </Button>
        }
      />

      <VStack spacing="7px" align="stretch" maxH="400px" overflowY="auto" pr="4px"
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: t.dim, borderRadius: "4px" },
        }}
      >
        {history.map((h) => {
          const s = statusStyle[h.status];
          return (
            <Flex key={h.id} align="center" gap="11px" p="10px 12px"
              borderRadius="11px"
              bg={t.surfaceBg} border="1px solid" borderColor={t.surfaceBd}
              transition="all 0.18s"
              _hover={{ bg: themedColor("#F1F5F9", "whiteAlpha.100"), transform: "translateX(3px)" }}
              cursor="pointer"
            >
              <Box w="34px" h="34px" borderRadius="10px" bg={s.bg}
                display="flex" alignItems="center" justifyContent="center" flexShrink="0">
                <Icon as={s.icon} boxSize="16px" color={s.color} />
              </Box>
              <Box flex="1" minW="0">
                <Flex align="center" gap="6px" mb="2px">
                  <Text fontSize="12.5px" fontWeight="800" color={t.text}>
                    Ghế {h.seat}
                  </Text>
                  <Box w="3px" h="3px" borderRadius="full" bg={t.dim} />
                  <Text fontSize="11px" color={t.muted} fontWeight="600" noOfLines={1}>
                    {h.movie}
                  </Text>
                </Flex>
                <HStack spacing="4px">
                  <Icon as={MdAccessTime} boxSize="10px" color={t.muted} />
                  <Text fontSize="10.5px" color={t.muted} fontWeight="600">
                    {h.time}
                  </Text>
                </HStack>
              </Box>
              <Icon as={s.icon} boxSize="14px" color={s.color} flexShrink="0" />
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEMO TRIGGER — gọn gàng, đặt trong header
// ═══════════════════════════════════════════════════════════════
function DemoTrigger({ onPick }) {
  const t = useTheme();
  return (
    <HStack spacing="6px">
      <Text fontSize="10px" fontWeight="800" color={t.muted}
        letterSpacing="0.8px" textTransform="uppercase">
        Demo:
      </Text>
      {[
        { label: "✓ Hợp lệ", status: "valid", color: "#059669", bg: "#ECFDF5", bd: "#6EE7B7" },
        { label: "⚠ Đã dùng", status: "used", color: "#B45309", bg: "#FFFBEB", bd: "#FCD34D" },
        { label: "✗ Không HL", status: "invalid", color: "#DC2626", bg: "#FEF2F2", bd: "#FCA5A5" },
      ].map((d) => (
        <Button key={d.status} size="xs" h="26px" px="9px" borderRadius="7px"
          bg={themedColor(d.bg, "navy.700")} color={themedColor(d.color, d.color)}
          border="1px solid" borderColor={themedColor(d.bd, "whiteAlpha.200")}
          fontSize="10.5px" fontWeight="800"
          _hover={{ opacity: 0.85, transform: "translateY(-1px)" }}
          transition="all 0.15s"
          onClick={() => onPick(d.status)}>
          {d.label}
        </Button>
      ))}
    </HStack>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function Checkin() {
  const t = useTheme();
  const [ticket, setTicket] = useState(null);
  const [flash, setFlash] = useState(false);
  const [sound, setSound] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [history, setHistory] = useState(RECENT_HISTORY);
  const [stats, setStats] = useState({ success: 45, warning: 3, error: 1, total: 49 });
  const [scanning, setScanning] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleScan = useCallback((code) => {
    if (!code?.trim()) return;
    setScanning(true);
    // Mock: giả lập camera đang xác thực
    setTimeout(() => {
      setTicket({ ...MOCK_TICKET, code: code.trim() });
      setScanning(false);
    }, 900);
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirming(true);
    setTimeout(() => {
      setHistory((prev) => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString("vi-VN"),
        seat: ticket.seats[0],
        movie: ticket.movie.split(":")[0],
        status: "success",
      }, ...prev.slice(0, 7)]);
      setStats((s) => ({ ...s, success: s.success + 1, total: s.total + 1 }));
      setTicket(null);
      setManualCode("");
      setConfirming(false);
    }, 800);
  }, [ticket]);

  const handleCancel = useCallback(() => {
    setTicket(null);
    setManualCode("");
  }, []);

  const demoPick = (status) => {
    setScanning(true);
    setTimeout(() => {
      setTicket({ ...MOCK_TICKET, status });
      setScanning(false);
    }, 700);
  };

  return (
    <Box pt={{ base: "100px", md: "80px" }} pb="40px">
      {/* Header */}
      <Flex
        justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="14px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <HStack spacing="12px" mb="6px">
            <Box
              w="42px" h="42px" borderRadius="13px"
              bgGradient="linear(135deg, #F97316, #FB923C)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.4)"
            >
              <Icon as={MdQrCodeScanner} boxSize="20px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900"
                color={t.text} letterSpacing="-0.5px" lineHeight="1.1">
                Soát vé
              </Text>
              <Text fontSize="11.5px" color={t.muted} fontWeight="600" mt="2px">
                Quét mã QR để xác thực vé và cho khách vào phòng chiếu
              </Text>
            </Box>
          </HStack>
        </Box>

        <HStack spacing="10px" flexWrap="wrap">
          <Flex align="center" gap="7px" px="13px" py="8px" borderRadius="11px"
            bg={themedColor("#ECFDF5", "rgba(16,185,129,0.15)")}
            border="1px solid" borderColor={themedColor("#6EE7B7", "rgba(16,185,129,0.3)")}
          >
            <Box w="7px" h="7px" borderRadius="full" bg="#10B981"
              sx={{ animation: `${pulse} 1.8s ease infinite` }} />
            <Text fontSize="11.5px" fontWeight="800"
              color={themedColor("#059669", "#34D399")}>
              Đang hoạt động
            </Text>
          </Flex>
          <Flex align="center" gap="8px" px="10px" py="6px" borderRadius="11px"
            bg={t.cardBg} border="1px solid" borderColor={t.border}
            boxShadow={t.shadow}
          >
            <Avatar size="xs" name="Nguyễn Văn A" bg={BRAND.orange} color="white"
              fontSize="10px" fontWeight="800" />
            <Box>
              <Text fontSize="11.5px" fontWeight="800" color={t.text} lineHeight="1.1">
                Nguyễn Văn A
              </Text>
              <Text fontSize="9.5px" fontWeight="600" color={t.muted} lineHeight="1.1">
                Nhân viên soát vé
              </Text>
            </Box>
          </Flex>
        </HStack>
      </Flex>

      {/* Demo trigger */}
      <Box mb="16px" sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}>
        <DemoTrigger onPick={demoPick} />
      </Box>

      {/* Main grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 440px" }} gap="18px">
        <Flex direction="column" gap="18px">
          <ScannerPanel
            flash={flash} setFlash={setFlash}
            sound={sound} setSound={setSound}
            manualCode={manualCode} setManualCode={setManualCode}
            onSubmit={() => handleScan(manualCode)}
            scanning={scanning}
          />
          <StatsPanel stats={stats} />
        </Flex>

        <Flex direction="column" gap="18px">
          <ResultCard
            ticket={ticket}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirming={confirming}
          />
          <HistoryPanel history={history} />
        </Flex>
      </Grid>
    </Box>
  );
}