import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Grid, SimpleGrid, Icon,
  Input, Select, Textarea, useToast, keyframes,
} from "@chakra-ui/react";
import {
  MdArrowBack, MdSearch, MdBuild, MdCheckCircle, MdMeetingRoom,
  MdChair, MdVisibility, MdEdit, MdClose, MdTheaters,
  MdAccessTime, MdWifi, MdAcUnit, MdInfo, MdStar, MdMovie,
  MdScreenShare, MdVolumeUp, MdLocalMovies, MdPlayCircle,
  MdTimer, MdWarning, MdDone, MdGridView, MdViewList,
} from "react-icons/md";
import {
  FaFilm, FaTicketAlt, FaVideo, FaChair,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn  = keyframes`from{opacity:0;transform:scale(0.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}`;
const shimmer  = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const pulse    = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.85)}`;
const slideIn  = keyframes`from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}`;

// ─── Static Data ─────────────────────────────────────────────────────────────
const CINEMAS = [
  { id: 1, name: "Gấu Phim Vincom Center",  shortName: "Vincom", address: "72 Lê Thánh Tôn, Q.1, TP.HCM" },
  { id: 2, name: "Gấu Phim Crescent Mall",  shortName: "Crescent", address: "101 Tôn Dật Tiên, Q.7, TP.HCM" },
  { id: 3, name: "Gấu Phim Aeon Mall",       shortName: "Aeon", address: "30 Bờ Bao Tân Thắng, Tân Phú" },
];

const ROOMS_DATA = {
  1: [
    { id: 101, name: "Phòng 1",  type: "IMAX",     capacity: 220, rows: 18, seatsPerRow: 14, status: "Hoạt động", tech: ["IMAX", "Dolby Atmos"], currentMovie: "Avengers: Infinity War",  nextShow: "14:30", bookedSeats: 198, screenSize: "26m × 13m" },
    { id: 102, name: "Phòng 2",  type: "4DX",      capacity: 120, rows: 12, seatsPerRow: 10, status: "Hoạt động", tech: ["4DX", "MX4D"],         currentMovie: "Spider-Man: No Way Home", nextShow: "15:00", bookedSeats: 88,  screenSize: "18m × 9m"  },
    { id: 103, name: "Phòng 3",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Thor: Love and Thunder",  nextShow: "13:45", bookedSeats: 102, screenSize: "16m × 8m"  },
    { id: 104, name: "Phòng 4",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: null,                      nextShow: "16:15", bookedSeats: 0,   screenSize: "16m × 8m"  },
    { id: 105, name: "Phòng 5",  type: "VIP",      capacity: 60,  rows: 6,  seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Atmos", "4K"],   currentMovie: "Doctor Strange 2",        nextShow: "14:00", bookedSeats: 42,  screenSize: "14m × 7m"  },
    { id: 106, name: "Phòng 6",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Bảo trì",  tech: ["Dolby Digital"],       currentMovie: null,                      nextShow: null,    bookedSeats: 0,   screenSize: "16m × 8m"  },
    { id: 107, name: "Phòng 7",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Black Panther",           nextShow: "17:00", bookedSeats: 75,  screenSize: "16m × 8m"  },
    { id: 108, name: "Phòng 8",  type: "Dolby",    capacity: 180, rows: 15, seatsPerRow: 12, status: "Hoạt động", tech: ["Dolby Cinema", "4K"],  currentMovie: "Wakanda Forever",         nextShow: "13:30", bookedSeats: 144, screenSize: "20m × 10m" },
  ],
  2: [
    { id: 201, name: "Phòng 1",  type: "4DX",      capacity: 110, rows: 11, seatsPerRow: 10, status: "Hoạt động", tech: ["4DX"],                 currentMovie: "Thor: Love and Thunder",  nextShow: "14:45", bookedSeats: 78,  screenSize: "18m × 9m"  },
    { id: 202, name: "Phòng 2",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Spider-Man",              nextShow: "15:30", bookedSeats: 110, screenSize: "16m × 8m"  },
    { id: 203, name: "Phòng 3",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: null,                      nextShow: "17:00", bookedSeats: 0,   screenSize: "16m × 8m"  },
    { id: 204, name: "Phòng 4",  type: "VIP",      capacity: 60,  rows: 6,  seatsPerRow: 10, status: "Hoạt động", tech: ["4K", "Dolby Atmos"],   currentMovie: "Doctor Strange 2",        nextShow: "14:00", bookedSeats: 55,  screenSize: "14m × 7m"  },
    { id: 205, name: "Phòng 5",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Avengers",                nextShow: "16:30", bookedSeats: 88,  screenSize: "16m × 8m"  },
    { id: 206, name: "Phòng 6",  type: "Standard", capacity: 130, rows: 13, seatsPerRow: 10, status: "Bảo trì",  tech: ["Dolby Digital"],       currentMovie: null,                      nextShow: null,    bookedSeats: 0,   screenSize: "16m × 8m"  },
  ],
  3: [
    { id: 301, name: "Phòng 1",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Spider-Man",              nextShow: "14:00", bookedSeats: 92,  screenSize: "16m × 8m"  },
    { id: 302, name: "Phòng 2",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Bảo trì",  tech: ["Dolby Digital"],       currentMovie: null,                      nextShow: null,    bookedSeats: 0,   screenSize: "16m × 8m"  },
    { id: 303, name: "Phòng 3",  type: "Kids",     capacity: 120, rows: 12, seatsPerRow: 10, status: "Bảo trì",  tech: ["2D Kids"],             currentMovie: null,                      nextShow: null,    bookedSeats: 0,   screenSize: "14m × 7m"  },
    { id: 304, name: "Phòng 4",  type: "Standard", capacity: 150, rows: 15, seatsPerRow: 10, status: "Hoạt động", tech: ["Dolby Digital"],       currentMovie: "Avengers",                nextShow: "15:30", bookedSeats: 60,  screenSize: "16m × 8m"  },
    { id: 305, name: "Phòng 5",  type: "VIP",      capacity: 50,  rows: 5,  seatsPerRow: 10, status: "Hoạt động", tech: ["4K", "Dolby Atmos"],   currentMovie: null,                      nextShow: "18:00", bookedSeats: 0,   screenSize: "14m × 7m"  },
  ],
};

// ─── Config maps ──────────────────────────────────────────────────────────────
const TYPE_CFG = {
  IMAX:     { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", grad: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
  "4DX":    { color: "#0284c7", bg: "#e0f2fe", border: "#7dd3fc", grad: "linear-gradient(135deg,#0284c7,#38bdf8)" },
  VIP:      { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", grad: "linear-gradient(135deg,#b45309,#f59e0b)" },
  Dolby:    { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", grad: "linear-gradient(135deg,#059669,#34d399)" },
  Standard: { color: "#475569", bg: "#f8fafc", border: "#e2e8f0", grad: "linear-gradient(135deg,#64748b,#94a3b8)" },
  Kids:     { color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", grad: "linear-gradient(135deg,#db2777,#f472b6)" },
};

const STATUS_CFG = {
  "Hoạt động": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", label: "Hoạt động" },
  "Bảo trì":   { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", label: "Bảo trì"   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px", h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: "#fff" },
  transition: "all 0.2s",
};

function SectionLabel({ text }) {
  return (
    <Flex align="center" gap="8px" mb="14px">
      <Box w="3px" h="15px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
      <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">{text}</Text>
    </Flex>
  );
}

function StatusPill({ status, animated = false }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Hoạt động"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={(animated && status === "Hoạt động") ? { animation: `${pulse} 2s ease infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{cfg.label}</Text>
    </Flex>
  );
}

function TypeBadge({ type }) {
  const cfg = TYPE_CFG[type] || TYPE_CFG.Standard;
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{type}</Text>
    </Box>
  );
}

function OccupancyBar({ booked, total }) {
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const barColor = pct >= 85 ? "#ef4444" : pct >= 60 ? "#f97316" : "#10b981";
  return (
    <Box>
      <Flex justify="space-between" mb="4px">
        <Text fontSize="10px" fontWeight="700" color="#94a3b8" textTransform="uppercase" letterSpacing="0.6px">Lấp đầy</Text>
        <Text fontSize="10.5px" fontWeight="800" color={barColor}>{pct}%</Text>
      </Flex>
      <Box h="5px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
        <Box h="100%" borderRadius="full" bg={barColor} w={`${pct}%`} transition="width 0.6s ease" />
      </Box>
      <Text fontSize="10px" color="#94a3b8" mt="3px">{booked}/{total} ghế</Text>
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, delay = 0 }) {
  return (
    <Box p="18px 20px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: "0 6px 24px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}>
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="11px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="5px">{label}</Text>
          <Text fontSize="28px" fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="44px" h="44px" borderRadius="13px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center" flexShrink="0">
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Seat Map Preview ─────────────────────────────────────────────────────────
function SeatMapPreview({ room }) {
  // Simple visual-only seat grid (not interactive per spec — readonly)
  const rows = Math.min(room.rows, 10);
  const cols = Math.min(room.seatsPerRow, 14);
  const occupancyPct = room.capacity > 0 ? room.bookedSeats / room.capacity : 0;

  return (
    <Box>
      {/* Screen */}
      <Box mb="14px" textAlign="center">
        <Box h="6px" borderRadius="3px 3px 8px 8px"
          bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 4s linear infinite` }}
          mx="auto" maxW="80%" mb="6px" />
        <Text fontSize="9px" fontWeight="700" color="#94a3b8" letterSpacing="1.2px" textTransform="uppercase">
          Màn hình — {room.screenSize}
        </Text>
      </Box>
      {/* Grid */}
      <Flex direction="column" gap="3px" align="center" mb="10px">
        {Array.from({ length: rows }).map((_, r) => (
          <Flex key={r} gap="3px">
            {Array.from({ length: cols }).map((_, c) => {
              const seatIdx = r * cols + c;
              const totalSeats = rows * cols;
              const bookedCount = Math.round(totalSeats * occupancyPct);
              const isBooked = seatIdx < bookedCount;
              return (
                <Box key={c} w="9px" h="7px" borderRadius="2px 2px 0 0"
                  bg={isBooked ? "#f97316" : "#e2e8f0"}
                  transition="background 0.2s"
                />
              );
            })}
          </Flex>
        ))}
      </Flex>
      {/* Legend */}
      <Flex justify="center" gap="16px">
        {[
          { color: "#f97316", label: "Đã đặt" },
          { color: "#e2e8f0", label: "Còn trống" },
        ].map(({ color, label }) => (
          <Flex key={label} align="center" gap="5px">
            <Box w="10px" h="8px" borderRadius="2px" bg={color} />
            <Text fontSize="10px" fontWeight="600" color="#64748b">{label}</Text>
          </Flex>
        ))}
      </Flex>
      <Box mt="8px" p="6px 10px" borderRadius="8px" bg="#fef3c7" border="1px solid #fde68a" textAlign="center">
        <Text fontSize="10px" fontWeight="600" color="#92400e">
          Sơ đồ chi tiết chỉ Admin có thể chỉnh sửa
        </Text>
      </Box>
    </Box>
  );
}

// ─── Room Card (Grid view) ────────────────────────────────────────────────────
function RoomCard({ room, index, onView, onToggle }) {
  const typeCfg = TYPE_CFG[room.type] || TYPE_CFG.Standard;
  const isMaintenance = room.status === "Bảo trì";
  const pct = room.capacity > 0 ? Math.round((room.bookedSeats / room.capacity) * 100) : 0;

  return (
    <Box borderRadius="18px" bg="white" border="1.5px solid #f1f5f9" overflow="hidden"
      transition="all 0.22s" cursor="pointer"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 8px 32px rgba(249,115,22,0.12)", transform: "translateY(-3px)" }}
      sx={{ animation: `${fadeUp} 0.38s ease ${index * 0.06}s both` }}
      onClick={() => onView(room)}
    >
      {/* Top accent bar with type gradient */}
      <Box h="4px" bg={typeCfg.grad} />

      {/* Header area */}
      <Box p="16px 18px 12px">
        <Flex align="flex-start" justify="space-between" mb="10px">
          <Box>
            <Text fontSize="17px" fontWeight="800" color="#0f172a" letterSpacing="-0.3px">{room.name}</Text>
            <Flex gap="6px" mt="5px" flexWrap="wrap">
              <TypeBadge type={room.type} />
              <StatusPill status={room.status} animated />
            </Flex>
          </Box>
          <Box textAlign="right" flexShrink="0">
            <Text fontSize="24px" fontWeight="900" color="#0f172a" lineHeight="1">{room.capacity}</Text>
            <Text fontSize="10px" color="#94a3b8" fontWeight="700" textTransform="uppercase" letterSpacing="0.6px">ghế</Text>
          </Box>
        </Flex>

        {/* Current movie */}
        {room.currentMovie ? (
          <Flex align="center" gap="7px" p="8px 10px" borderRadius="10px"
            bg="#fff7ed" border="1px solid #fed7aa" mb="10px">
            <Box w="6px" h="6px" borderRadius="full" bg="#f97316"
              sx={{ animation: `${pulse} 1.8s ease infinite` }} />
            <Box minW="0">
              <Text fontSize="11px" color="#92400e" fontWeight="700" noOfLines={1}>{room.currentMovie}</Text>
              <Text fontSize="10px" color="#b45309">Suất tiếp: {room.nextShow}</Text>
            </Box>
          </Flex>
        ) : room.nextShow ? (
          <Flex align="center" gap="7px" p="8px 10px" borderRadius="10px"
            bg="#f8fafc" border="1px solid #f1f5f9" mb="10px">
            <Icon as={MdTimer} boxSize="13px" color="#94a3b8" />
            <Text fontSize="11px" color="#64748b" fontWeight="600">Suất tiếp theo: <strong>{room.nextShow}</strong></Text>
          </Flex>
        ) : (
          <Flex align="center" gap="7px" p="8px 10px" borderRadius="10px"
            bg={isMaintenance ? "#fffbeb" : "#f8fafc"}
            border={`1px solid ${isMaintenance ? "#fcd34d" : "#f1f5f9"}`} mb="10px">
            <Icon as={isMaintenance ? MdBuild : MdDone} boxSize="13px"
              color={isMaintenance ? "#f59e0b" : "#94a3b8"} />
            <Text fontSize="11px" color={isMaintenance ? "#b45309" : "#94a3b8"} fontWeight="600">
              {isMaintenance ? "Đang bảo trì" : "Không có suất chiếu"}
            </Text>
          </Flex>
        )}

        {/* Occupancy */}
        <OccupancyBar booked={room.bookedSeats} total={room.capacity} />
      </Box>

      <Box h="1px" bg="#f8fafc" />

      {/* Tech tags + actions */}
      <Box p="12px 18px 14px">
        <Flex gap="5px" flexWrap="wrap" mb="12px">
          {room.tech.map((t) => (
            <Box key={t} px="7px" py="3px" borderRadius="5px" bg="#f1f5f9">
              <Text fontSize="10px" fontWeight="700" color="#64748b">{t}</Text>
            </Box>
          ))}
        </Flex>
        <Flex gap="8px">
          <Button flex="1" h="34px" borderRadius="9px" fontSize="11.5px" fontWeight="700"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onView(room); }}>
            Chi tiết
          </Button>
          <Button flex="1" h="34px" borderRadius="9px" fontSize="11.5px" fontWeight="700"
            bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
            color={isMaintenance ? "#059669" : "#d97706"}
            border={`1px solid ${isMaintenance ? "#6ee7b7" : "#fcd34d"}`}
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="12px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onToggle(room.id); }}>
            {isMaintenance ? "Kích hoạt" : "Bảo trì"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Room List Row (Table view) ───────────────────────────────────────────────
function RoomListRow({ room, index, onView, onToggle }) {
  const isMaintenance = room.status === "Bảo trì";
  const pct = room.capacity > 0 ? Math.round((room.bookedSeats / room.capacity) * 100) : 0;
  const barColor = pct >= 85 ? "#ef4444" : pct >= 60 ? "#f97316" : "#10b981";

  return (
    <Box p="14px 18px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
      transition="all 0.2s" cursor="pointer"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 14px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
      sx={{ animation: `${fadeUp} 0.32s ease ${index * 0.04}s both` }}
      onClick={() => onView(room)}
    >
      {/* Mobile layout */}
      <Box display={{ base: "block", md: "none" }}>
        <Flex justify="space-between" align="flex-start" mb="10px">
          <Box>
            <Text fontSize="15px" fontWeight="800" color="#0f172a" mb="5px">{room.name}</Text>
            <Flex gap="6px" flexWrap="wrap">
              <TypeBadge type={room.type} />
              <StatusPill status={room.status} animated />
            </Flex>
          </Box>
          <Box textAlign="right">
            <Text fontSize="18px" fontWeight="800" color="#0f172a">{room.capacity}</Text>
            <Text fontSize="10px" color="#94a3b8">ghế</Text>
          </Box>
        </Flex>
        {room.currentMovie && (
          <Text fontSize="11.5px" color="#f97316" fontWeight="600" mb="8px" noOfLines={1}>
            ▶ {room.currentMovie} · {room.nextShow}
          </Text>
        )}
        <Box mb="10px">
          <Flex justify="space-between" mb="3px">
            <Text fontSize="10px" color="#94a3b8" fontWeight="600">Lấp đầy</Text>
            <Text fontSize="10px" fontWeight="800" color={barColor}>{pct}%</Text>
          </Flex>
          <Box h="4px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
            <Box h="100%" borderRadius="full" bg={barColor} w={`${pct}%`} />
          </Box>
        </Box>
        <Flex gap="8px" onClick={(e) => e.stopPropagation()}>
          <Button flex="1" size="xs" h="32px" borderRadius="8px" fontSize="11.5px" fontWeight="700"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg: "#f1f5f9" }} transition="all 0.15s"
            onClick={() => onView(room)}>Chi tiết</Button>
          <Button flex="1" size="xs" h="32px" borderRadius="8px" fontSize="11.5px" fontWeight="700"
            bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
            color={isMaintenance ? "#059669" : "#d97706"}
            border={`1px solid ${isMaintenance ? "#6ee7b7" : "#fcd34d"}`}
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="11px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggle(room.id)}>
            {isMaintenance ? "Kích hoạt" : "Bảo trì"}
          </Button>
        </Flex>
      </Box>

      {/* Desktop layout */}
      <Flex align="center" gap="0" display={{ base: "none", md: "flex" }}>
        {/* Index */}
        <Box w="28px" flexShrink="0">
          <Text fontSize="12px" fontWeight="700" color="#cbd5e1">{String(index + 1).padStart(2, "0")}</Text>
        </Box>
        {/* Name + Type */}
        <Box flex="1.8" minW="0" pr="14px">
          <Text fontSize="14px" fontWeight="800" color="#0f172a" noOfLines={1}>{room.name}</Text>
          <Flex gap="6px" mt="4px">
            <TypeBadge type={room.type} />
          </Flex>
        </Box>
        {/* Status */}
        <Box flex="0.8" minW="0" pr="14px">
          <StatusPill status={room.status} animated />
        </Box>
        {/* Capacity */}
        <Box flex="0.7" minW="0" pr="14px">
          <Flex align="center" gap="4px">
            <Icon as={FaChair} boxSize="11px" color="#94a3b8" />
            <Text fontSize="13px" fontWeight="700" color="#0f172a">{room.capacity}</Text>
          </Flex>
          <Text fontSize="10px" color="#94a3b8">{room.rows} hàng × {room.seatsPerRow} ghế</Text>
        </Box>
        {/* Current */}
        <Box flex="1.8" minW="0" pr="14px">
          {room.currentMovie ? (
            <Flex align="center" gap="6px">
              <Box w="6px" h="6px" borderRadius="full" bg="#f97316" flexShrink="0"
                sx={{ animation: `${pulse} 1.8s ease infinite` }} />
              <Box minW="0">
                <Text fontSize="12px" fontWeight="700" color="#0f172a" noOfLines={1}>{room.currentMovie}</Text>
                <Text fontSize="10px" color="#94a3b8">Suất tiếp: {room.nextShow}</Text>
              </Box>
            </Flex>
          ) : room.nextShow ? (
            <Text fontSize="12px" color="#64748b" fontWeight="600">Suất tiếp: {room.nextShow}</Text>
          ) : (
            <Text fontSize="12px" color="#cbd5e1" fontStyle="italic">—</Text>
          )}
        </Box>
        {/* Occupancy */}
        <Box flex="1.2" minW="0" pr="14px">
          <Flex justify="space-between" mb="4px">
            <Text fontSize="10px" color="#94a3b8" fontWeight="600">{room.bookedSeats}/{room.capacity}</Text>
            <Text fontSize="10px" fontWeight="800" color={barColor}>{pct}%</Text>
          </Flex>
          <Box h="5px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
            <Box h="100%" borderRadius="full" bg={barColor} w={`${pct}%`} />
          </Box>
        </Box>
        {/* Actions */}
        <Flex gap="6px" flexShrink="0" onClick={(e) => e.stopPropagation()}>
          <Button size="xs" h="30px" px="10px" borderRadius="8px" fontSize="11.5px" fontWeight="700"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={() => onView(room)}>Xem</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px" fontSize="11.5px" fontWeight="700"
            bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
            color={isMaintenance ? "#059669" : "#d97706"}
            border={`1px solid ${isMaintenance ? "#6ee7b7" : "#fcd34d"}`}
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="11px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggle(room.id)}>
            {isMaintenance ? "Kích hoạt" : "Bảo trì"}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Room Detail View ─────────────────────────────────────────────────────────
function RoomDetail({ room, cinemaName, onBack, onToggle }) {
  const typeCfg = TYPE_CFG[room.type] || TYPE_CFG.Standard;
  const isMaintenance = room.status === "Bảo trì";
  const pct = room.capacity > 0 ? Math.round((room.bookedSeats / room.capacity) * 100) : 0;

  return (
    <Box sx={{ animation: `${slideIn} 0.3s ease both` }}>
      {/* Back + action */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}>
          Quay lại
        </Button>
        <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg={isMaintenance ? "linear-gradient(135deg,#059669,#34d399)" : "linear-gradient(135deg,#f59e0b,#fbbf24)"}
          color="white"
          boxShadow={isMaintenance ? "0 4px 14px rgba(5,150,105,0.3)" : "0 4px 14px rgba(245,158,11,0.3)"}
          _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.2s"
          leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} />}
          onClick={() => onToggle(room.id)}>
          {isMaintenance ? "Kích hoạt phòng" : "Đánh dấu bảo trì"}
        </Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="20px" border="1px solid #f1f5f9"
        boxShadow="0 2px 16px rgba(0,0,0,0.06)" overflow="hidden" mb="16px">
        <Box h="5px" bg={typeCfg.grad} />
        <Box p={{ base: "20px", md: "28px" }}>
          <Flex direction={{ base: "column", md: "row" }} gap="24px">
            <Box flex="1">
              <Flex align="flex-start" justify="space-between" mb="14px" gap="10px">
                <Box>
                  <Text fontSize="11px" fontWeight="700" color="#94a3b8" letterSpacing="1px"
                    textTransform="uppercase" mb="4px">{cinemaName}</Text>
                  <Text fontSize={{ base: "24px", md: "30px" }} fontWeight="900" color="#0f172a"
                    letterSpacing="-0.6px" lineHeight="1">{room.name}</Text>
                  <Flex gap="8px" mt="10px" flexWrap="wrap">
                    <TypeBadge type={room.type} />
                    <StatusPill status={room.status} animated />
                  </Flex>
                </Box>
              </Flex>

              <Box h="1px" bg="#f1f5f9" mb="16px" />

              {/* Quick stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
                {[
                  { icon: FaChair,        label: "Tổng ghế",    val: room.capacity },
                  { icon: MdGridView,     label: "Cấu hình",    val: `${room.rows}×${room.seatsPerRow}` },
                  { icon: MdScreenShare,  label: "Màn hình",    val: room.screenSize },
                  { icon: FaTicketAlt,    label: "Đã đặt",      val: room.bookedSeats },
                ].map(({ icon: Ic, label, val }) => (
                  <Box key={label} p="10px 12px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
                    <Flex align="center" gap="5px" mb="4px">
                      <Icon as={Ic} boxSize="11px" color="#f97316" />
                      <Text fontSize="9px" fontWeight="700" color="#94a3b8"
                        textTransform="uppercase" letterSpacing="0.7px">{label}</Text>
                    </Flex>
                    <Text fontSize="14px" fontWeight="800" color="#0f172a">{val}</Text>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Occupancy */}
              <Box p="14px 16px" borderRadius="14px" bg="#f8fafc" border="1px solid #f1f5f9" mb="14px">
                <Flex justify="space-between" align="center" mb="8px">
                  <Text fontSize="11px" fontWeight="800" color="#374151"
                    textTransform="uppercase" letterSpacing="0.8px">Tỉ lệ lấp đầy suất hiện tại</Text>
                  <Text fontSize="20px" fontWeight="900"
                    color={pct >= 85 ? "#ef4444" : pct >= 60 ? "#f97316" : "#10b981"}>{pct}%</Text>
                </Flex>
                <Box h="8px" borderRadius="full" bg="#e2e8f0" overflow="hidden">
                  <Box h="100%" borderRadius="full"
                    bg={pct >= 85 ? "linear-gradient(90deg,#f97316,#ef4444)" : pct >= 60 ? "linear-gradient(90deg,#fbbf24,#f97316)" : "linear-gradient(90deg,#34d399,#10b981)"}
                    w={`${pct}%`} transition="width 0.8s ease" />
                </Box>
                <Flex justify="space-between" mt="5px">
                  <Text fontSize="10.5px" color="#94a3b8">{room.bookedSeats} ghế đã đặt</Text>
                  <Text fontSize="10.5px" color="#94a3b8">{room.capacity - room.bookedSeats} ghế còn trống</Text>
                </Flex>
              </Box>

              {/* Current showing */}
              {room.currentMovie && (
                <Box p="12px 14px" borderRadius="12px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Flex align="center" gap="8px" mb="4px">
                    <Box w="7px" h="7px" borderRadius="full" bg="#f97316"
                      sx={{ animation: `${pulse} 1.8s ease infinite` }} />
                    <Text fontSize="10px" fontWeight="800" color="#92400e"
                      textTransform="uppercase" letterSpacing="0.8px">Đang chiếu</Text>
                  </Flex>
                  <Text fontSize="14px" fontWeight="800" color="#0f172a">{room.currentMovie}</Text>
                  <Text fontSize="11.5px" color="#b45309" mt="3px">Suất tiếp theo: <strong>{room.nextShow}</strong></Text>
                </Box>
              )}
            </Box>

            {/* Seat map */}
            <Box w={{ base: "100%", md: "280px" }} flexShrink="0"
              bg="#f8fafc" borderRadius="16px" border="1px solid #f1f5f9" p="18px">
              <SectionLabel text="Sơ đồ ghế (xem)" />
              <SeatMapPreview room={room} />
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Tech + specs */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mb="16px">
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px 20px"
          sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <SectionLabel text="Công nghệ & Thiết bị" />
          <Flex gap="8px" flexWrap="wrap">
            {room.tech.map((t) => (
              <Flex key={t} align="center" gap="6px" px="12px" py="7px"
                borderRadius="9px" bg="#fff7ed" border="1px solid #fed7aa">
                <Icon as={MdVolumeUp} boxSize="12px" color="#f97316" />
                <Text fontSize="12px" fontWeight="700" color="#b45309">{t}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px 20px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}>
          <SectionLabel text="Thông tin phân quyền" />
          <Flex direction="column" gap="8px">
            {[
              { ok: true,  txt: "Xem danh sách và chi tiết phòng chiếu" },
              { ok: true,  txt: "Đánh dấu phòng đang bảo trì / hoạt động" },
              { ok: false, txt: "Chỉnh sửa layout, sơ đồ ghế (Admin)" },
              { ok: false, txt: "Thêm hoặc xóa phòng chiếu (Admin)" },
            ].map(({ ok, txt }) => (
              <Flex key={txt} align="flex-start" gap="8px">
                <Box w="17px" h="17px" borderRadius="full" flexShrink="0" mt="1px"
                  bg={ok ? "#ecfdf5" : "#fef2f2"} border={`1px solid ${ok ? "#6ee7b7" : "#fca5a5"}`}
                  display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="9px" fontWeight="900" color={ok ? "#059669" : "#dc2626"}>{ok ? "✓" : "✕"}</Text>
                </Box>
                <Text fontSize="12px" color={ok ? "#374151" : "#94a3b8"} fontWeight={ok ? "600" : "500"}>{txt}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Grid>

      {/* Maintenance warning */}
      {isMaintenance && (
        <Box p="16px 18px" borderRadius="14px" bg="#fffbeb" border="1.5px solid #fcd34d"
          sx={{ animation: `${fadeIn} 0.3s ease both` }}>
          <Flex align="center" gap="10px">
            <Box w="36px" h="36px" borderRadius="10px" bg="#fef3c7"
              display="flex" alignItems="center" justifyContent="center" flexShrink="0">
              <Icon as={MdWarning} boxSize="18px" color="#f59e0b" />
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="800" color="#92400e" mb="2px">Phòng đang bảo trì</Text>
              <Text fontSize="12px" color="#b45309">
                Phòng này không nhận suất chiếu mới. Nhấn "Kích hoạt phòng" để đưa vào hoạt động trở lại.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyPhongChieu() {
  const toast = useToast();
  const [view, setView] = useState("list");            // list | detail
  const [selectedCinemaId, setSelectedCinemaId] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomsData, setRoomsData] = useState(ROOMS_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType] = useState("Tất cả");
  const [displayMode, setDisplayMode] = useState("grid"); // grid | list

  const currentCinema = CINEMAS.find((c) => c.id === selectedCinemaId);
  const allRooms = roomsData[selectedCinemaId] || [];

  const filtered = allRooms.filter((r) => {
    const matchS = r.name.toLowerCase().includes(search.toLowerCase()) ||
                   r.type.toLowerCase().includes(search.toLowerCase());
    const matchSt = filterStatus === "Tất cả" || r.status === filterStatus;
    const matchT  = filterType  === "Tất cả" || r.type === filterType;
    return matchS && matchSt && matchT;
  });

  const stats = {
    total:       allRooms.length,
    active:      allRooms.filter((r) => r.status === "Hoạt động").length,
    maintenance: allRooms.filter((r) => r.status === "Bảo trì").length,
    totalSeats:  allRooms.reduce((s, r) => s + r.capacity, 0),
    totalBooked: allRooms.reduce((s, r) => s + r.bookedSeats, 0),
  };

  const handleToggle = (roomId) => {
    setRoomsData((prev) => {
      const updated = (prev[selectedCinemaId] || []).map((r) =>
        r.id === roomId
          ? { ...r, status: r.status === "Bảo trì" ? "Hoạt động" : "Bảo trì", bookedSeats: r.status === "Bảo trì" ? r.bookedSeats : 0 }
          : r
      );
      return { ...prev, [selectedCinemaId]: updated };
    });
    const room = allRooms.find((r) => r.id === roomId);
    const toActive = room?.status === "Bảo trì";
    toast({
      title: toActive ? `${room?.name} đã kích hoạt` : `${room?.name} đang bảo trì`,
      description: toActive ? "Phòng sẵn sàng nhận suất chiếu mới." : "Phòng tạm ngưng nhận suất chiếu.",
      status: toActive ? "success" : "warning",
      duration: 3000, isClosable: true, position: "top-right",
    });
    // Update selectedRoom if viewing detail
    if (selectedRoom?.id === roomId) {
      setSelectedRoom((prev) => prev ? { ...prev, status: toActive ? "Hoạt động" : "Bảo trì" } : null);
    }
  };

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedRoom) {
    const liveRoom = allRooms.find((r) => r.id === selectedRoom.id) || selectedRoom;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <RoomDetail
          room={liveRoom}
          cinemaName={currentCinema?.name || ""}
          onBack={() => setView("list")}
          onToggle={handleToggle}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Page header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)">
              <Icon as={MdMeetingRoom} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="900" color="#0f172a"
                letterSpacing="-0.5px" lineHeight="1">Quản lý phòng chiếu</Text>
              <Text color="#94a3b8" fontSize="12.5px" mt="2px">
                Xem và cập nhật trạng thái phòng chiếu các rạp
              </Text>
            </Box>
          </Flex>
        </Box>
        {/* Admin note */}
        <Flex align="center" gap="7px" px="14px" py="8px" borderRadius="10px"
          bg="#fff7ed" border="1px solid #fed7aa" flexShrink="0"
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}>
          <Icon as={MdInfo} boxSize="14px" color="#f97316" />
          <Text fontSize="12px" fontWeight="600" color="#b45309">
            Thêm/xóa phòng · sửa layout thuộc quyền Admin
          </Text>
        </Flex>
      </Flex>

      {/* Cinema selector tabs */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="12px 14px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}>
        <Text fontSize="10px" fontWeight="800" color="#94a3b8"
          textTransform="uppercase" letterSpacing="1px" mb="10px">Chọn rạp chiếu</Text>
        <Flex gap="8px" flexWrap="wrap">
          {CINEMAS.map((c) => {
            const isActive = c.id === selectedCinemaId;
            const rooms = roomsData[c.id] || [];
            const maintenanceCount = rooms.filter((r) => r.status === "Bảo trì").length;
            return (
              <Button key={c.id}
                h="auto" py="8px" px="14px" borderRadius="10px"
                bg={isActive ? "linear-gradient(135deg,#f97316,#fb923c)" : "#f8fafc"}
                color={isActive ? "white" : "#475569"}
                border={isActive ? "none" : "1px solid #e2e8f0"}
                boxShadow={isActive ? "0 3px 12px rgba(249,115,22,0.35)" : "none"}
                fontWeight="700" fontSize="13px"
                _hover={isActive ? {} : { bg: "#f1f5f9", color: "#0f172a" }}
                transition="all 0.2s"
                onClick={() => { setSelectedCinemaId(c.id); setSearch(""); setFilterStatus("Tất cả"); setFilterType("Tất cả"); }}>
                <Flex direction="column" align="flex-start" gap="1px">
                  <Text fontSize="13px" fontWeight="700">{c.shortName}</Text>
                  <Flex align="center" gap="6px">
                    <Text fontSize="10px" fontWeight="600" opacity={isActive ? 0.85 : 0.65}>
                      {rooms.length} phòng
                    </Text>
                    {maintenanceCount > 0 && (
                      <Box px="5px" py="1px" borderRadius="4px"
                        bg={isActive ? "rgba(255,255,255,0.25)" : "#fef3c7"}
                        border={isActive ? "none" : "1px solid #fde68a"}>
                        <Text fontSize="9px" fontWeight="800"
                          color={isActive ? "white" : "#d97706"}>{maintenanceCount} bảo trì</Text>
                      </Box>
                    )}
                  </Flex>
                </Flex>
              </Button>
            );
          })}
        </Flex>
        <Text fontSize="11px" color="#94a3b8" mt="10px" pl="2px">{currentCinema?.address}</Text>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing="10px" mb="16px">
        <StatCard label="Tổng phòng"     value={stats.total}       icon={MdMeetingRoom} accent="#f97316" delay={0}    />
        <StatCard label="Hoạt động"      value={stats.active}      icon={MdCheckCircle} accent="#059669" delay={0.05} />
        <StatCard label="Bảo trì"        value={stats.maintenance} icon={MdBuild}       accent="#f59e0b" delay={0.1}  />
        <StatCard label="Tổng ghế"       value={stats.totalSeats.toLocaleString()} icon={FaChair} accent="#0284c7" delay={0.15} />
        <StatCard label="Ghế đang đặt"
          value={stats.totalBooked.toLocaleString()}
          sub={`${stats.totalSeats > 0 ? Math.round((stats.totalBooked / stats.totalSeats) * 100) : 0}% lấp đầy`}
          icon={FaTicketAlt} accent="#7c3aed" delay={0.2} />
      </SimpleGrid>

      {/* Filter bar + view toggle */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px 18px" mb="14px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}>
        <Flex gap="10px" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
          {/* Search */}
          <Box position="relative" flex="1">
            <Icon as={MdSearch} position="absolute" left="10px" top="50%"
              transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
            <Input pl="30px" h="38px" fontSize="12.5px" fontWeight="500"
              placeholder="Tìm phòng chiếu, loại phòng..."
              bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
              _placeholder={{ color: "#b0bac8" }}
              _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
              _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>
          {/* Status filter */}
          <Select h="38px" fontSize="12.5px" fontWeight="600" color="#374151"
            bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
            w={{ base: "100%", sm: "150px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bảo trì">Đang bảo trì</option>
          </Select>
          {/* Type filter */}
          <Select h="38px" fontSize="12.5px" fontWeight="600" color="#374151"
            bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
            w={{ base: "100%", sm: "140px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="Tất cả">Tất cả loại</option>
            {["IMAX", "4DX", "VIP", "Dolby", "Standard", "Kids"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          {/* View mode toggle */}
          <Flex gap="4px" bg="#f8fafc" borderRadius="9px" border="1px solid #e2e8f0" p="3px" flexShrink="0">
            {[
              { mode: "grid", icon: MdGridView },
              { mode: "list", icon: MdViewList },
            ].map(({ mode, icon: Ic }) => (
              <Button key={mode} size="xs" w="32px" h="32px" p="0" borderRadius="7px"
                bg={displayMode === mode ? "white" : "transparent"}
                color={displayMode === mode ? "#f97316" : "#94a3b8"}
                boxShadow={displayMode === mode ? "0 1px 4px rgba(0,0,0,0.1)" : "none"}
                _hover={{ bg: displayMode === mode ? "white" : "#f1f5f9" }}
                transition="all 0.15s"
                onClick={() => setDisplayMode(mode)}>
                <Icon as={Ic} boxSize="14px" />
              </Button>
            ))}
          </Flex>
          {/* Count badge */}
          <Flex align="center" gap="6px" px="12px" py="6px" borderRadius="8px"
            bg="#f8fafc" border="1px solid #f1f5f9" flexShrink="0">
            <Icon as={MdMeetingRoom} boxSize="12px" color="#94a3b8" />
            <Text fontSize="12px" fontWeight="700" color="#64748b">{filtered.length} phòng</Text>
          </Flex>
        </Flex>
      </Box>

      {/* Rooms */}
      {filtered.length === 0 ? (
        <Flex direction="column" align="center" justify="center" py="60px" color="#cbd5e1">
          <Icon as={MdMeetingRoom} boxSize="36px" mb="10px" />
          <Text fontSize="14px" fontWeight="600" color="#94a3b8">Không tìm thấy phòng chiếu nào</Text>
        </Flex>
      ) : displayMode === "grid" ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap="14px">
          {filtered.map((r, i) => (
            <RoomCard key={r.id} room={r} index={i}
              onView={(rm) => { setSelectedRoom(rm); setView("detail"); }}
              onToggle={handleToggle} />
          ))}
        </Grid>
      ) : (
        <>
          {/* List header */}
          <Flex px="18px" py="10px" bg="white" borderRadius="12px"
            border="1px solid #f1f5f9" mb="8px" display={{ base: "none", md: "flex" }}>
            <Box w="28px" flexShrink="0" />
            <Box flex="1.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Phòng / Loại</Text>
            </Box>
            <Box flex="0.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Trạng thái</Text>
            </Box>
            <Box flex="0.7" pr="14px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Ghế</Text>
            </Box>
            <Box flex="1.8" pr="14px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Đang chiếu</Text>
            </Box>
            <Box flex="1.2" pr="14px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Lấp đầy</Text>
            </Box>
            <Box w="140px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" textTransform="uppercase" letterSpacing="1px">Hành động</Text>
            </Box>
          </Flex>
          <Flex direction="column" gap="8px">
            {filtered.map((r, i) => (
              <RoomListRow key={r.id} room={r} index={i}
                onView={(rm) => { setSelectedRoom(rm); setView("detail"); }}
                onToggle={handleToggle} />
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
}