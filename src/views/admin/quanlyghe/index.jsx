import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Grid, SimpleGrid, Button, Select, Badge,
  Icon, Tooltip, keyframes, Divider,
} from "@chakra-ui/react";
import {
  MdChair, MdMeetingRoom, MdTheaters, MdInfo, MdRefresh,
  MdZoomIn, MdZoomOut, MdFilterList, MdCircle, MdAccessible,
  MdStar, MdLayers, MdArrowBack, MdLocationOn,
} from "react-icons/md";
import { FaCouch, FaFilm } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const pulse    = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const shimmer  = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const popIn    = keyframes`from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const CINEMAS = [
  { id: 1, name: "Gấu Phim Hà Nội – Vincom", address: "191 Bà Triệu, Hai Bà Trưng, HN" },
  { id: 2, name: "Gấu Phim TP.HCM – Landmark", address: "Tòa nhà Landmark 81, Bình Thạnh, HCM" },
  { id: 3, name: "Gấu Phim Đà Nẵng – Coop", address: "2 Hùng Vương, Hải Châu, Đà Nẵng" },
];

const ROOMS = {
  1: [
    { id: 1, name: "Phòng 1 – Standard 2D", type: "standard", rows: 8, cols: 12, status: "active",  capacity: 96 },
    { id: 2, name: "Phòng 2 – Premium 3D",  type: "premium",  rows: 7, cols: 10, status: "active",  capacity: 70 },
    { id: 3, name: "Phòng 3 – IMAX",        type: "imax",     rows: 10,cols: 14, status: "maintenance", capacity: 140 },
    { id: 4, name: "Phòng 4 – Sweetbox",    type: "sweetbox", rows: 4, cols: 8,  status: "active",  capacity: 32 },
  ],
  2: [
    { id: 5, name: "Phòng 1 – Standard 2D", type: "standard", rows: 9, cols: 12, status: "active",  capacity: 108 },
    { id: 6, name: "Phòng 2 – IMAX 3D",     type: "imax",     rows: 11,cols: 16, status: "active",  capacity: 176 },
    { id: 7, name: "Phòng 3 – VIP Lounge",  type: "vip",      rows: 5, cols: 8,  status: "active",  capacity: 40 },
  ],
  3: [
    { id: 8, name: "Phòng 1 – Standard",    type: "standard", rows: 8, cols: 10, status: "active",  capacity: 80 },
    { id: 9, name: "Phòng 2 – 4DX",         type: "4dx",      rows: 6, cols: 10, status: "maintenance", capacity: 60 },
  ],
};

// Seat types by room type
const ROOM_SEAT_CONFIG = {
  standard: { regularRatio: 0.8,  vipRatio: 0,    sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
  premium:  { regularRatio: 0.6,  vipRatio: 0.25, sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
  imax:     { regularRatio: 0.75, vipRatio: 0.15, sweetboxRatio: 0,   accessibleCount: 6, coupleRatio: 0 },
  sweetbox: { regularRatio: 0,    vipRatio: 0,    sweetboxRatio: 0.7, accessibleCount: 0, coupleRatio: 0.3 },
  vip:      { regularRatio: 0.3,  vipRatio: 0.5,  sweetboxRatio: 0,   accessibleCount: 2, coupleRatio: 0.2 },
  "4dx":    { regularRatio: 0.85, vipRatio: 0.1,  sweetboxRatio: 0,   accessibleCount: 4, coupleRatio: 0 },
};

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Deterministic seat type generator
function getSeatType(row, col, totalRows, totalCols, config) {
  const hash = (row * 31 + col * 17) % 100;
  const lastRow = row === totalRows - 1;
  const lastTwoRows = row >= totalRows - 2;

  if (lastRow && col % 3 === 0 && config.accessibleCount > 0) return "accessible";
  if (config.sweetboxRatio > 0 && lastTwoRows && col % 2 === 0) return "sweetbox";
  if (config.coupleRatio > 0 && lastTwoRows) return "couple";
  if (config.vipRatio > 0 && row >= totalRows - 3 && hash < config.vipRatio * 100) return "vip";
  return "regular";
}

// Deterministic "booked" status – simulates real data
function isBooked(row, col, roomId) {
  const seed = (row * 97 + col * 43 + roomId * 13) % 100;
  return seed < 35; // ~35% booked
}

function generateSeats(room) {
  const config = ROOM_SEAT_CONFIG[room.type] || ROOM_SEAT_CONFIG.standard;
  const grid = [];
  for (let r = 0; r < room.rows; r++) {
    const row = [];
    for (let c = 0; c < room.cols; c++) {
      const type   = getSeatType(r, c, room.rows, room.cols, config);
      const booked = room.status === "maintenance" ? false : isBooked(r, c, room.id);
      row.push({ id: `${ROW_LABELS[r]}${c + 1}`, row: r, col: c, type, booked });
    }
    grid.push(row);
  }
  return grid;
}

// ─── Seat type configs ────────────────────────────────────────────────────────
const SEAT_TYPES = {
  regular:    { label: "Thường",     color: "#f97316", bg: "#fff7ed", border: "#fb923c", bookedBg: "#dc2626", bookedColor: "#fff" },
  vip:        { label: "VIP",        color: "#7c3aed", bg: "#f5f3ff", border: "#a78bfa", bookedBg: "#5b21b6", bookedColor: "#fff" },
  sweetbox:   { label: "Sweetbox",   color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", bookedBg: "#9d174d", bookedColor: "#fff" },
  couple:     { label: "Couple",     color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", bookedBg: "#991b1b", bookedColor: "#fff" },
  accessible: { label: "Tiếp cận",   color: "#0284c7", bg: "#f0f9ff", border: "#7dd3fc", bookedBg: "#0369a1", bookedColor: "#fff" },
};

const ROOM_TYPE_BADGES = {
  standard: { label: "Standard",  bg: "#f1f5f9", color: "#475569" },
  premium:  { label: "Premium",   bg: "#f5f3ff", color: "#7c3aed" },
  imax:     { label: "IMAX",      bg: "#fff7ed", color: "#f97316" },
  sweetbox: { label: "Sweetbox",  bg: "#fdf2f8", color: "#db2777" },
  vip:      { label: "VIP",       bg: "#fffbeb", color: "#b45309" },
  "4dx":    { label: "4DX",       bg: "#f0fdf4", color: "#16a34a" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p="16px 18px" borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px"
            textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize="26px" fontWeight="900" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="40px" h="40px" borderRadius="12px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} boxSize="17px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

function RoomTypeBadge({ type }) {
  const cfg = ROOM_TYPE_BADGES[type] || ROOM_TYPE_BADGES.standard;
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{cfg.label}</Text>
    </Box>
  );
}

function StatusDot({ status }) {
  const isActive = status === "active";
  return (
    <Flex align="center" gap="5px">
      <Box w="7px" h="7px" borderRadius="full"
        bg={isActive ? "#10b981" : "#f59e0b"}
        sx={isActive ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11px" fontWeight="600" color={isActive ? "#059669" : "#b45309"}>
        {isActive ? "Hoạt động" : "Bảo trì"}
      </Text>
    </Flex>
  );
}

// Single seat component
function Seat({ seat, scale = 1 }) {
  const cfg = SEAT_TYPES[seat.type] || SEAT_TYPES.regular;
  const isCouple = seat.type === "couple";
  const isSweetbox = seat.type === "sweetbox";
  const isSpecial = isCouple || isSweetbox;

  const w = isSpecial ? `${26 * scale}px` : `${20 * scale}px`;
  const h = `${18 * scale}px`;

  return (
    <Tooltip label={`${seat.id} · ${cfg.label}${seat.booked ? " · Đã đặt" : " · Trống"}`}
      placement="top" hasArrow fontSize="11px"
    >
      <Box
        w={w} h={h} borderRadius={`${4 * scale}px`} cursor="default"
        border={`${scale}px solid`}
        borderColor={seat.booked ? (cfg.bookedBg) : cfg.border}
        bg={seat.booked ? cfg.bookedBg : cfg.bg}
        position="relative" flexShrink="0"
        transition="all 0.15s"
        _hover={{ transform: "scale(1.15)", zIndex: 10, boxShadow: `0 3px 8px ${cfg.color}55` }}
        sx={{ animation: `${popIn} 0.2s ease both` }}
      >
        {/* Headrest nub */}
        <Box
          position="absolute" top={`${-3 * scale}px`} left="50%" transform="translateX(-50%)"
          w={`${6 * scale}px`} h={`${3 * scale}px`} borderRadius={`${2 * scale}px`}
          bg={seat.booked ? cfg.bookedBg : cfg.border}
        />
        {/* Icon for special types */}
        {seat.type === "accessible" && (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Icon as={MdAccessible} boxSize={`${9 * scale}px`}
              color={seat.booked ? cfg.bookedColor : cfg.color} />
          </Flex>
        )}
        {seat.type === "vip" && !seat.booked && (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Icon as={MdStar} boxSize={`${8 * scale}px`} color={cfg.color} />
          </Flex>
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Room Card in list ────────────────────────────────────────────────────────
function RoomCard({ room, index, onView }) {
  const seats = generateSeats(room);
  const flat  = seats.flat();
  const total  = flat.length;
  const booked = flat.filter((s) => s.booked).length;
  const empty  = total - booked;
  const pct    = Math.round((booked / total) * 100);

  return (
    <Box bg="white" borderRadius="16px" border="1.5px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)"
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.07}s both` }}
      overflow="hidden"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 4px 20px rgba(249,115,22,0.12)" }}
      transition="all 0.2s"
    >
      {/* Top accent bar */}
      <Box h="3px" bg={room.status === "maintenance"
        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
        : "linear-gradient(90deg, #f97316, #fbbf24, #f97316)"}
        bgSize="200% 100%"
        sx={room.status === "active"
          ? { animation: `${shimmer} 3s linear infinite` } : {}}
      />

      <Box p="16px 18px">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb="12px">
          <Box flex="1" minW="0">
            <Flex align="center" gap="8px" mb="5px" flexWrap="wrap">
              <Text fontSize="14px" fontWeight="800" color="#0f172a" noOfLines={1}>
                {room.name}
              </Text>
              <RoomTypeBadge type={room.type} />
            </Flex>
            <StatusDot status={room.status} />
          </Box>
          <Box textAlign="right" flexShrink="0" ml="8px">
            <Text fontSize="20px" fontWeight="900" color="#0f172a">{total}</Text>
            <Text fontSize="10px" color="#94a3b8" fontWeight="600">ghế</Text>
          </Box>
        </Flex>

        {/* Mini seat preview — first 3 rows */}
        <Box bg="#fafbfc" borderRadius="10px" p="10px" mb="12px" overflow="hidden">
          <Flex direction="column" gap="4px" align="center">
            {/* Screen indicator */}
            <Box w="80%" h="4px" borderRadius="2px"
              bg="linear-gradient(90deg, transparent, #f97316, transparent)" mb="4px" />
            {seats.slice(0, 3).map((row, ri) => (
              <Flex key={ri} gap="3px" justify="center">
                {row.map((seat) => (
                  <Box key={seat.id}
                    w="9px" h="7px" borderRadius="2px"
                    bg={seat.booked
                      ? SEAT_TYPES[seat.type]?.bookedBg || "#dc2626"
                      : SEAT_TYPES[seat.type]?.border || "#fb923c"}
                  />
                ))}
              </Flex>
            ))}
            <Text fontSize="9px" color="#94a3b8" mt="2px">
              +{Math.max(0, room.rows - 3)} hàng nữa
            </Text>
          </Flex>
        </Box>

        {/* Stats */}
        <Grid templateColumns="1fr 1fr 1fr" gap="8px" mb="12px">
          {[
            { label: "Đã đặt", value: booked, color: "#dc2626" },
            { label: "Còn trống", value: empty, color: "#059669" },
            { label: "Lấp đầy", value: `${pct}%`, color: "#f97316" },
          ].map(({ label, value, color }) => (
            <Box key={label} p="8px" borderRadius="8px" bg="#f8fafc"
              border="1px solid #f1f5f9" textAlign="center"
            >
              <Text fontSize="14px" fontWeight="800" color={color}>{value}</Text>
              <Text fontSize="9px" fontWeight="700" color="#94a3b8"
                textTransform="uppercase" letterSpacing="0.5px">{label}</Text>
            </Box>
          ))}
        </Grid>

        {/* Occupancy bar */}
        <Box mb="14px">
          <Box h="5px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
            <Box h="100%" borderRadius="full" w={`${pct}%`}
              bg={pct > 80 ? "#dc2626" : pct > 50 ? "#f97316" : "#10b981"}
              transition="width 0.6s ease" />
          </Box>
        </Box>

        <Button w="100%" h="36px" borderRadius="9px" fontSize="12.5px" fontWeight="700"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 3px 10px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 5px 18px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdLayers} boxSize="13px" />}
          onClick={() => onView(room)}
        >
          Xem sơ đồ ghế
        </Button>
      </Box>
    </Box>
  );
}

// ─── Full Seat Map View ────────────────────────────────────────────────────────
function SeatMapView({ room, cinemaName, onBack }) {
  const [scale, setScale] = useState(1);
  const [filter, setFilter] = useState("all"); // all | booked | empty
  const seats = generateSeats(room);
  const flat  = seats.flat();
  const stats = {
    total:   flat.length,
    booked:  flat.filter((s) => s.booked).length,
    empty:   flat.filter((s) => !s.booked).length,
    regular: flat.filter((s) => s.type === "regular").length,
    vip:     flat.filter((s) => s.type === "vip").length,
    sweet:   flat.filter((s) => s.type === "sweetbox" || s.type === "couple").length,
    access:  flat.filter((s) => s.type === "accessible").length,
  };

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "start", md: "center" }} justify="space-between"
        direction={{ base: "column", md: "row" }} gap="12px" mb="20px"
      >
        <Flex align="center" gap="12px">
          <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
            color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Box>
            <Flex align="center" gap="8px" mb="2px">
              <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="900" color="#0f172a" letterSpacing="-0.4px">
                {room.name}
              </Text>
              <RoomTypeBadge type={room.type} />
            </Flex>
            <Flex align="center" gap="5px">
              <Icon as={MdLocationOn} boxSize="11px" color="#94a3b8" />
              <Text fontSize="12px" color="#94a3b8">{cinemaName}</Text>
            </Flex>
          </Box>
        </Flex>
        {/* Zoom controls */}
        <Flex gap="8px" align="center">
          <StatusDot status={room.status} />
          <Box w="1px" h="24px" bg="#e2e8f0" />
          <Flex bg="#f8fafc" border="1px solid #e2e8f0" borderRadius="10px" overflow="hidden">
            {[
              { icon: MdZoomOut, action: () => setScale((s) => Math.max(0.6, s - 0.1)) },
              { icon: MdZoomIn,  action: () => setScale((s) => Math.min(1.5, s + 0.1)) },
            ].map(({ icon: Ic, action }, i) => (
              <Button key={i} variant="ghost" h="34px" w="34px" p="0" borderRadius="0"
                _hover={{ bg: "#f1f5f9", color: "#f97316" }} onClick={action}
              >
                <Icon as={Ic} boxSize="14px" />
              </Button>
            ))}
          </Flex>
          <Box px="10px" py="4px" borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="11px" fontWeight="700" color="#f97316">
              {Math.round(scale * 100)}%
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Stats row */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
        {[
          { label: "Tổng ghế",   value: stats.total,   accent: "#f97316", icon: MdChair    },
          { label: "Đã đặt",     value: stats.booked,  accent: "#dc2626", icon: FaCouch    },
          { label: "Còn trống",  value: stats.empty,   accent: "#059669", icon: MdMeetingRoom },
          { label: "Tỉ lệ đặt",  value: `${Math.round((stats.booked/stats.total)*100)}%`,
            accent: "#7c3aed", icon: MdLayers, sub: `${stats.total} ghế tổng cộng` },
        ].map((p, i) => (
          <StatCard key={p.label} {...p} delay={i * 0.04} />
        ))}
      </SimpleGrid>

      {/* Seat map card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="14px"
      >
        <Box h="3px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        {/* Toolbar */}
        <Flex align="center" justify="space-between" px="18px" py="14px"
          borderBottom="1px solid #f8fafc" flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px">
            <Icon as={MdLayers} boxSize="14px" color="#f97316" />
            <Text fontSize="13px" fontWeight="800" color="#0f172a">Sơ đồ ghế ngồi</Text>
            <Box px="8px" py="2px" borderRadius="5px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="10.5px" fontWeight="700" color="#f97316">
                {room.rows} hàng × {room.cols} cột
              </Text>
            </Box>
          </Flex>
          <Select h="32px" fontSize="12px" fontWeight="600" color="#374151"
            bg="#f8fafc" border="1px solid #e8edf3" borderRadius="8px" w="140px"
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            value={filter} onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả ghế</option>
            <option value="booked">Đã đặt</option>
            <option value="empty">Còn trống</option>
          </Select>
        </Flex>

        {room.status === "maintenance" ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Box w="56px" h="56px" borderRadius="16px" bg="#fffbeb" border="2px solid #fcd34d"
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdMeetingRoom} boxSize="24px" color="#f59e0b" />
            </Box>
            <Text fontSize="16px" fontWeight="800" color="#0f172a">Phòng đang bảo trì</Text>
            <Text fontSize="13px" color="#94a3b8" textAlign="center" maxW="320px">
              Phòng chiếu này hiện không hoạt động. Vui lòng kiểm tra lại sau khi hoàn tất bảo trì.
            </Text>
          </Flex>
        ) : (
          <Box p="20px" overflowX="auto">
            {/* Screen */}
            <Flex direction="column" align="center" mb="24px">
              <Box
                w={{ base: "70%", md: "55%" }} h="8px" borderRadius="4px"
                bg="linear-gradient(90deg, transparent 5%, #f97316 30%, #fbbf24 50%, #f97316 70%, transparent 95%)"
                mb="6px" opacity="0.9"
              />
              <Box
                w={{ base: "80%", md: "65%" }} h="3px" borderRadius="full"
                bg="linear-gradient(90deg, transparent, rgba(249,115,22,0.25), transparent)"
                mb="4px"
              />
              <Text fontSize="10px" fontWeight="700" color="#94a3b8"
                letterSpacing="3px" textTransform="uppercase">
                Màn hình chiếu
              </Text>
            </Flex>

            {/* Seat grid */}
            <Flex direction="column" align="center" gap={`${6 * scale}px`}>
              {seats.map((row, ri) => {
                const filtered = row.map((s) => ({
                  ...s,
                  hidden: filter === "booked" ? !s.booked : filter === "empty" ? s.booked : false,
                }));
                return (
                  <Flex key={ri} align="center" gap={`${6 * scale}px`}>
                    {/* Row label */}
                    <Box w={`${22 * scale}px`} textAlign="center" flexShrink="0">
                      <Text fontSize={`${11 * scale}px`} fontWeight="800" color="#cbd5e1">
                        {ROW_LABELS[ri]}
                      </Text>
                    </Box>
                    {/* Seats */}
                    {filtered.map((seat) => (
                      <Box key={seat.id} opacity={seat.hidden ? 0.15 : 1} transition="opacity 0.2s">
                        <Seat seat={seat} scale={scale} />
                      </Box>
                    ))}
                    {/* Col number (last) */}
                    <Box w={`${22 * scale}px`} textAlign="center" flexShrink="0">
                      <Text fontSize={`${11 * scale}px`} fontWeight="800" color="#cbd5e1">
                        {ROW_LABELS[ri]}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
              {/* Column numbers */}
              <Flex gap={`${6 * scale}px`} mt="4px">
                <Box w={`${22 * scale}px`} />
                {Array.from({ length: room.cols }, (_, i) => (
                  <Box key={i} w={`${20 * scale}px`} textAlign="center">
                    <Text fontSize={`${9 * scale}px`} color="#e2e8f0" fontWeight="600">{i + 1}</Text>
                  </Box>
                ))}
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px 18px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Text fontSize="10.5px" fontWeight="800" color="#64748b" letterSpacing="1px"
          textTransform="uppercase" mb="10px">Chú thích</Text>
        <Flex flexWrap="wrap" gap="10px 18px">
          {/* Status */}
          {[
            { bg: "#fff7ed", border: "#fb923c", label: "Ghế trống" },
            { bg: "#dc2626", border: "#dc2626", label: "Đã đặt",   textColor: "white" },
          ].map(({ bg, border, label, textColor }) => (
            <Flex key={label} align="center" gap="7px">
              <Box w="18px" h="14px" borderRadius="3px" bg={bg}
                border={`1.5px solid ${border}`} position="relative">
                <Box position="absolute" top="-3px" left="50%" transform="translateX(-50%)"
                  w="6px" h="3px" borderRadius="2px" bg={border} />
              </Box>
              <Text fontSize="11.5px" fontWeight="600" color="#475569">{label}</Text>
            </Flex>
          ))}
          <Box w="1px" h="20px" bg="#e2e8f0" alignSelf="center" />
          {/* Types */}
          {Object.entries(SEAT_TYPES).map(([key, cfg]) => (
            <Flex key={key} align="center" gap="7px">
              <Box w="18px" h="14px" borderRadius="3px" bg={cfg.bg}
                border={`1.5px solid ${cfg.border}`} />
              <Text fontSize="11.5px" fontWeight="600" color="#475569">{cfg.label}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Seat type breakdown */}
      {stats.vip + stats.sweet + stats.access > 0 && (
        <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px 18px" mt="12px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
        >
          <Text fontSize="10.5px" fontWeight="800" color="#64748b" letterSpacing="1px"
            textTransform="uppercase" mb="10px">Phân loại ghế</Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="8px">
            {[
              { label: "Ghế thường",    value: stats.regular, cfg: SEAT_TYPES.regular },
              { label: "Ghế VIP",       value: stats.vip,     cfg: SEAT_TYPES.vip },
              { label: "Sweetbox/Đôi",  value: stats.sweet,   cfg: SEAT_TYPES.sweetbox },
              { label: "Tiếp cận",      value: stats.access,  cfg: SEAT_TYPES.accessible },
            ].map(({ label, value, cfg }) => value > 0 && (
              <Flex key={label} align="center" gap="10px" p="10px" borderRadius="10px"
                bg={cfg.bg} border={`1px solid ${cfg.border}`}
              >
                <Box w="10px" h="10px" borderRadius="3px" bg={cfg.border} flexShrink="0" />
                <Box>
                  <Text fontSize="15px" fontWeight="800" color={cfg.color}>{value}</Text>
                  <Text fontSize="10px" color="#94a3b8" fontWeight="600">{label}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyGhe() {
  const [selectedCinema, setSelectedCinema] = useState(1);
  const [selectedRoom, setSelectedRoom]     = useState(null);
  const [filterType, setFilterType]         = useState("all");

  const cinema  = CINEMAS.find((c) => c.id === selectedCinema);
  const rooms   = ROOMS[selectedCinema] || [];
  const filtered = filterType === "all" ? rooms : rooms.filter((r) =>
    filterType === "maintenance" ? r.status === "maintenance" : r.type === filterType
  );

  // Aggregate stats across all rooms of selected cinema
  const allSeats = rooms.flatMap((r) => generateSeats(r).flat());
  const totalSeats  = allSeats.length;
  const bookedSeats = allSeats.filter((s) => s.booked).length;

  if (selectedRoom) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <SeatMapView
          room={selectedRoom}
          cinemaName={cinema?.name || ""}
          onBack={() => setSelectedRoom(null)}
        />
      </Box>
    );
  }

  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Page header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)"
            >
              <Icon as={MdChair} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color="#0f172a"
                letterSpacing="-0.5px">
                Ghế ngồi
              </Text>
              <Text fontSize="12px" color="#94a3b8">
                Xem sơ đồ ghế các phòng chiếu
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Readonly badge */}
        <Box px="12px" py="6px" borderRadius="10px"
          bg="#f0f9ff" border="1px solid #7dd3fc"
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          <Flex align="center" gap="6px">
            <Icon as={MdInfo} boxSize="13px" color="#0284c7" />
            <Text fontSize="11.5px" fontWeight="700" color="#0284c7">
              Chế độ xem — Chỉ đọc
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Cinema selector */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px 18px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Text fontSize="10.5px" fontWeight="800" color="#64748b" letterSpacing="1px"
          textTransform="uppercase" mb="10px">Chọn rạp chiếu</Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="10px">
          {CINEMAS.map((c) => (
            <Box key={c.id}
              p="12px 14px" borderRadius="12px" cursor="pointer"
              border={selectedCinema === c.id ? "2px solid #f97316" : "1.5px solid #e2e8f0"}
              bg={selectedCinema === c.id ? "#fff7ed" : "#fafbfc"}
              boxShadow={selectedCinema === c.id ? "0 2px 12px rgba(249,115,22,0.18)" : "none"}
              _hover={{ border: "1.5px solid #f97316", bg: "#fff7ed" }}
              transition="all 0.2s"
              onClick={() => { setSelectedCinema(c.id); setSelectedRoom(null); }}
            >
              <Flex align="center" gap="10px">
                <Box w="32px" h="32px" borderRadius="9px" flexShrink="0"
                  bg={selectedCinema === c.id ? "linear-gradient(135deg, #f97316, #fb923c)" : "#f1f5f9"}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={MdTheaters} boxSize="14px"
                    color={selectedCinema === c.id ? "white" : "#94a3b8"} />
                </Box>
                <Box flex="1" minW="0">
                  <Text fontSize="12.5px" fontWeight="800" color="#0f172a" noOfLines={1}>
                    {c.name}
                  </Text>
                  <Text fontSize="10.5px" color="#94a3b8" noOfLines={1}>{c.address}</Text>
                </Box>
                {selectedCinema === c.id && (
                  <Box w="8px" h="8px" borderRadius="full" bg="#f97316" flexShrink="0"
                    sx={{ animation: `${pulse} 1.8s ease infinite` }} />
                )}
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
        <StatCard label="Tổng phòng"   value={rooms.length}
          icon={MdMeetingRoom} accent="#f97316" delay={0} />
        <StatCard label="Hoạt động"    value={rooms.filter((r) => r.status === "active").length}
          icon={FaFilm} accent="#10b981" delay={0.05} />
        <StatCard label="Tổng ghế"     value={totalSeats}
          icon={MdChair} accent="#7c3aed" delay={0.1} />
        <StatCard label="Đang đặt"     value={bookedSeats}
          icon={FaCouch} accent="#dc2626" delay={0.15}
          sub={`${Math.round((bookedSeats/totalSeats)*100)}% lấp đầy`} />
      </SimpleGrid>

      {/* Rooms grid */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Header */}
        <Flex align="center" justify="space-between" p="16px 18px 12px"
          borderBottom="1px solid #f8fafc" flexWrap="wrap" gap="10px"
        >
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full"
              bg="linear-gradient(180deg, #f97316, #fbbf24)" />
            <Text fontWeight="800" fontSize="14px" color="#0f172a">Danh sách phòng chiếu</Text>
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="10.5px" fontWeight="700" color="#f97316">
                {filtered.length} phòng
              </Text>
            </Box>
          </Flex>
          <Select h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
            bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="150px"
            _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
            _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="imax">IMAX</option>
            <option value="sweetbox">Sweetbox</option>
            <option value="vip">VIP</option>
            <option value="4dx">4DX</option>
            <option value="maintenance">Bảo trì</option>
          </Select>
        </Flex>

        <Box p="14px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" py="48px" color="#cbd5e1">
              <Icon as={MdMeetingRoom} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không có phòng nào</Text>
            </Flex>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap="12px">
              {filtered.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i}
                  onView={(r) => setSelectedRoom(r)} />
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}