import React, { useState } from "react";
import {
  Box, Flex, Text, Button, Grid, SimpleGrid, Icon, Badge,
  Input, Select, Textarea, useToast,
  keyframes,
} from "@chakra-ui/react";
import {
  MdLocationOn, MdPhone, MdAccessTime, MdEdit, MdVisibility,
  MdCheckCircle, MdBuild, MdArrowBack, MdSearch, MdClose,
  MdChair, MdMeetingRoom, MdTheaters, MdStar, MdLocalMovies,
  MdWifi, MdAcUnit, MdPark, MdElevator, MdDirectionsCar,
  MdFilterList, MdInfo,
} from "react-icons/md";
import { FaFilm, FaTicketAlt } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}`;
const shimmer = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const pulseDot = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}`;

// ─── Data ────────────────────────────────────────────────────────────────────
const CINEMAS = [
  {
    id: 1,
    name: "Gấu Phim Vincom Center",
    address: "72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    phone: "028 3822 6688",
    openTime: "08:00 – 23:30",
    status: "Hoạt động",
    totalRooms: 8,
    totalSeats: 1240,
    activeRooms: 7,
    rating: 4.8,
    amenities: ["wifi", "ac", "parking", "elevator"],
    description: "Rạp phim cao cấp tại trung tâm thành phố với công nghệ IMAX và Dolby Atmos.",
    todayTickets: 843,
    monthRevenue: "1.24 tỷ",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80",
  },
  {
    id: 2,
    name: "Gấu Phim Crescent Mall",
    address: "101 Tôn Dật Tiên, Phú Mỹ Hưng, Quận 7, TP.HCM",
    phone: "028 5413 9999",
    openTime: "09:00 – 23:00",
    status: "Hoạt động",
    totalRooms: 6,
    totalSeats: 890,
    activeRooms: 6,
    rating: 4.6,
    amenities: ["wifi", "ac", "parking"],
    description: "Rạp hiện đại tại khu vực Phú Mỹ Hưng với hệ thống âm thanh 4DX.",
    todayTickets: 512,
    monthRevenue: "876 triệu",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
  },
  {
    id: 3,
    name: "Gấu Phim Aeon Mall",
    address: "30 Bờ Bao Tân Thắng, Tân Phú, TP.HCM",
    phone: "028 6257 1111",
    openTime: "09:30 – 22:30",
    status: "Bảo trì",
    totalRooms: 5,
    totalSeats: 720,
    activeRooms: 3,
    rating: 4.3,
    amenities: ["wifi", "ac", "parking", "lounge"],
    description: "Rạp phim gia đình với nhiều suất chiếu phim hoạt hình và thiếu nhi.",
    todayTickets: 167,
    monthRevenue: "324 triệu",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&q=80",
  },
];

const ROOMS_DATA = {
  1: [
    { id: 1, name: "Phòng 1 – IMAX", type: "IMAX", seats: 220, status: "Hoạt động", currentMovie: "Avengers: Endgame", nextShow: "14:30" },
    { id: 2, name: "Phòng 2 – 4DX", type: "4DX", seats: 120, status: "Hoạt động", currentMovie: "Spider-Man: NWH", nextShow: "15:00" },
    { id: 3, name: "Phòng 3 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Thor: L&T", nextShow: "13:45" },
    { id: 4, name: "Phòng 4 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: null, nextShow: "16:15" },
    { id: 5, name: "Phòng 5 – VIP", type: "VIP", seats: 60, status: "Hoạt động", currentMovie: "Doctor Strange", nextShow: "14:00" },
    { id: 6, name: "Phòng 6 – Thường", type: "Standard", seats: 150, status: "Bảo trì", currentMovie: null, nextShow: null },
    { id: 7, name: "Phòng 7 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Black Panther", nextShow: "17:00" },
    { id: 8, name: "Phòng 8 – Dolby", type: "Dolby", seats: 180, status: "Hoạt động", currentMovie: "Wakanda Forever", nextShow: "13:30" },
  ],
  2: [
    { id: 1, name: "Phòng 1 – 4DX", type: "4DX", seats: 110, status: "Hoạt động", currentMovie: "Thor: L&T", nextShow: "14:45" },
    { id: 2, name: "Phòng 2 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Spider-Man", nextShow: "15:30" },
    { id: 3, name: "Phòng 3 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: null, nextShow: "17:00" },
    { id: 4, name: "Phòng 4 – VIP", type: "VIP", seats: 60, status: "Hoạt động", currentMovie: "Doctor Strange", nextShow: "14:00" },
    { id: 5, name: "Phòng 5 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Avengers", nextShow: "16:30" },
    { id: 6, name: "Phòng 6 – Thường", type: "Standard", seats: 130, status: "Hoạt động", currentMovie: "Black Panther", nextShow: "15:00" },
  ],
  3: [
    { id: 1, name: "Phòng 1 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Spider-Man", nextShow: "14:00" },
    { id: 2, name: "Phòng 2 – Thường", type: "Standard", seats: 150, status: "Bảo trì", currentMovie: null, nextShow: null },
    { id: 3, name: "Phòng 3 – Hoạt hình", type: "Kids", seats: 120, status: "Bảo trì", currentMovie: null, nextShow: null },
    { id: 4, name: "Phòng 4 – Thường", type: "Standard", seats: 150, status: "Hoạt động", currentMovie: "Avengers", nextShow: "15:30" },
    { id: 5, name: "Phòng 5 – VIP", type: "VIP", seats: 50, status: "Hoạt động", currentMovie: null, nextShow: "18:00" },
  ],
};

// ─── Style helpers ────────────────────────────────────────────────────────────
const STATUS_CINEMA = {
  "Hoạt động": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Bảo trì":   { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Tạm đóng":  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
};

const ROOM_TYPE_CFG = {
  IMAX:     { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  "4DX":    { color: "#0284c7", bg: "#e0f2fe", border: "#7dd3fc" },
  VIP:      { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  Dolby:    { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  Standard: { color: "#475569", bg: "#f8fafc", border: "#e2e8f0" },
  Kids:     { color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4" },
};

const AMENITY_ICONS = { wifi: MdWifi, ac: MdAcUnit, parking: MdDirectionsCar, elevator: MdElevator, lounge: MdPark };
const AMENITY_LABELS = { wifi: "Wi-Fi", ac: "Điều hoà", parking: "Bãi xe", elevator: "Thang máy", lounge: "Phòng chờ" };

const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px", h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: "#fff" },
  transition: "all 0.2s",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusDot({ status }) {
  const cfg = STATUS_CINEMA[status] || STATUS_CINEMA["Hoạt động"];
  return (
    <Flex align="center" gap="6px" px="10px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Hoạt động" ? { animation: `${pulseDot} 2s ease infinite` } : {}} />
      <Text fontSize="12px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function RoomTypeBadge({ type }) {
  const cfg = ROOM_TYPE_CFG[type] || ROOM_TYPE_CFG.Standard;
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{type}</Text>
    </Box>
  );
}

function StatCard({ label, value, sub, icon, accent, delay = 0 }) {
  return (
    <Box p="18px 20px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}>
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="11px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize="28px" fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="44px" h="44px" borderRadius="13px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

function SectionTitle({ label }) {
  return (
    <Flex align="center" gap="8px" mb="14px">
      <Box w="3px" h="16px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
      <Text fontSize="11px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">{label}</Text>
    </Flex>
  );
}

// ─── Cinema Card (list) ───────────────────────────────────────────────────────
function CinemaCard({ cinema, index, onView, onEdit }) {
  return (
    <Box
      borderRadius="18px" bg="white" border="1.5px solid #f1f5f9" overflow="hidden"
      transition="all 0.22s" cursor="pointer"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 8px 32px rgba(249,115,22,0.12)", transform: "translateY(-3px)" }}
      sx={{ animation: `${fadeUp} 0.38s ease ${index * 0.08}s both` }}
      onClick={() => onView(cinema)}
    >
      {/* Image */}
      <Box h="140px" overflow="hidden" position="relative">
        <img src={cinema.image} alt={cinema.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Box position="absolute" inset="0"
          bg="linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.75))" />
        <Box position="absolute" bottom="10px" left="14px" right="14px">
          <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.25" noOfLines={1}>
            {cinema.name}
          </Text>
        </Box>
        <Box position="absolute" top="10px" right="10px">
          <StatusDot status={cinema.status} />
        </Box>
      </Box>

      {/* Body */}
      <Box p="16px">
        <Flex align="flex-start" gap="5px" mb="8px">
          <Icon as={MdLocationOn} boxSize="13px" color="#f97316" mt="2px" flexShrink="0" />
          <Text fontSize="12px" color="#64748b" lineHeight="1.5" noOfLines={2}>{cinema.address}</Text>
        </Flex>
        <Flex gap="14px" mb="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdPhone} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11.5px" color="#475569" fontWeight="600">{cinema.phone}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11.5px" color="#475569" fontWeight="600">{cinema.openTime}</Text>
          </Flex>
        </Flex>

        {/* Stats row */}
        <Grid templateColumns="repeat(3, 1fr)" gap="8px" mb="12px">
          {[
            { label: "Phòng chiếu", val: `${cinema.activeRooms}/${cinema.totalRooms}` },
            { label: "Tổng ghế", val: cinema.totalSeats.toLocaleString() },
            { label: "Vé hôm nay", val: cinema.todayTickets.toLocaleString() },
          ].map(({ label, val }) => (
            <Box key={label} p="8px 10px" borderRadius="10px" bg="#fafbfc" border="1px solid #f1f5f9" textAlign="center">
              <Text fontSize="14px" fontWeight="800" color="#0f172a">{val}</Text>
              <Text fontSize="9.5px" fontWeight="700" color="#94a3b8" textTransform="uppercase" letterSpacing="0.5px">{label}</Text>
            </Box>
          ))}
        </Grid>

        {/* Amenities */}
        <Flex gap="6px" flexWrap="wrap" mb="14px">
          {cinema.amenities.map((a) => (
            <Flex key={a} align="center" gap="4px" px="8px" py="4px"
              borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa">
              <Icon as={AMENITY_ICONS[a]} boxSize="11px" color="#f97316" />
              <Text fontSize="10px" fontWeight="700" color="#b45309">{AMENITY_LABELS[a]}</Text>
            </Flex>
          ))}
        </Flex>

        {/* Actions */}
        <Flex gap="8px">
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onView(cinema); }}>
            Chi tiết
          </Button>
          <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            boxShadow="0 2px 10px rgba(249,115,22,0.3)"
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }} transition="all 0.15s"
            onClick={(e) => { e.stopPropagation(); onEdit(cinema); }}>
            Chỉnh sửa
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Room Row ─────────────────────────────────────────────────────────────────
function RoomRow({ room, index, onToggleMaintenance }) {
  const isMaintenance = room.status === "Bảo trì";
  return (
    <Box p="14px 16px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
      transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.09)" }}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.04}s both` }}>
      <Flex align="center" gap="0">
        {/* Room name + type */}
        <Box flex="2.5" minW="0" pr="12px">
          <Flex align="center" gap="8px" mb="4px">
            <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{room.name}</Text>
            <RoomTypeBadge type={room.type} />
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdChair} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11.5px" color="#64748b" fontWeight="600">{room.seats} ghế</Text>
          </Flex>
        </Box>

        {/* Status */}
        <Box flex="1" minW="0" pr="12px">
          <StatusDot status={room.status} />
        </Box>

        {/* Current screening */}
        <Box flex="2" minW="0" pr="12px">
          {room.currentMovie ? (
            <Flex align="center" gap="6px">
              <Box w="6px" h="6px" borderRadius="full" bg="#f97316"
                sx={{ animation: `${pulseDot} 1.8s ease infinite` }} />
              <Box>
                <Text fontSize="12px" fontWeight="700" color="#0f172a" noOfLines={1}>{room.currentMovie}</Text>
                <Text fontSize="10.5px" color="#94a3b8">Suất tiếp: {room.nextShow}</Text>
              </Box>
            </Flex>
          ) : room.nextShow ? (
            <Box>
              <Text fontSize="11px" color="#94a3b8">Suất tiếp theo</Text>
              <Text fontSize="12.5px" fontWeight="700" color="#475569">{room.nextShow}</Text>
            </Box>
          ) : (
            <Text fontSize="12px" color="#cbd5e1" fontStyle="italic">Không có suất chiếu</Text>
          )}
        </Box>

        {/* Toggle button */}
        <Box flexShrink="0">
          <Button size="xs" h="30px" px="12px" borderRadius="8px"
            fontSize="11px" fontWeight="700"
            bg={isMaintenance ? "#ecfdf5" : "#fffbeb"}
            color={isMaintenance ? "#059669" : "#d97706"}
            border={isMaintenance ? "1px solid #6ee7b7" : "1px solid #fcd34d"}
            leftIcon={<Icon as={isMaintenance ? MdCheckCircle : MdBuild} boxSize="11px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggleMaintenance(room.id)}>
            {isMaintenance ? "Kích hoạt" : "Bảo trì"}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Cinema Detail ────────────────────────────────────────────────────────────
function CinemaDetail({ cinema, onBack, onEdit, rooms, onToggleMaintenance }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const filtered = rooms.filter((r) => {
    const matchS = r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === "Tất cả" || r.status === filter;
    return matchS && matchF;
  });

  const activeCount = rooms.filter((r) => r.status === "Hoạt động").length;
  const maintenanceCount = rooms.filter((r) => r.status === "Bảo trì").length;
  const totalSeats = rooms.reduce((s, r) => s + r.seats, 0);

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Back + Edit */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}>
          Quay lại
        </Button>
        <Button h="38px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          transition="all 0.2s" leftIcon={<Icon as={MdEdit} />} onClick={onEdit}>
          Cập nhật thông tin
        </Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="20px" border="1px solid #f1f5f9"
        boxShadow="0 2px 16px rgba(0,0,0,0.06)" overflow="hidden" mb="16px">
        <Box h="3px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />
        <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }}>
          <Box h={{ base: "180px", md: "auto" }} overflow="hidden" bg="#0f172a">
            <img src={cinema.image} alt={cinema.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9 }} />
          </Box>
          <Box p={{ base: "18px", md: "28px" }}>
            <Flex align="flex-start" justify="space-between" mb="12px" gap="10px">
              <Box flex="1">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color="#0f172a"
                  letterSpacing="-0.5px" mb="6px">{cinema.name}</Text>
                <StatusDot status={cinema.status} />
              </Box>
              <Flex align="center" gap="4px" flexShrink="0">
                <Icon as={MdStar} boxSize="16px" color="#f59e0b" />
                <Text fontSize="18px" fontWeight="800" color="#0f172a">{cinema.rating}</Text>
              </Flex>
            </Flex>

            <Box h="1px" bg="#f1f5f9" mb="14px" />

            <Flex direction="column" gap="8px" mb="16px">
              {[
                { icon: MdLocationOn, val: cinema.address },
                { icon: MdPhone, val: cinema.phone },
                { icon: MdAccessTime, val: `Giờ mở cửa: ${cinema.openTime}` },
              ].map(({ icon: Ic, val }) => (
                <Flex key={val} align="flex-start" gap="8px">
                  <Icon as={Ic} boxSize="14px" color="#f97316" mt="2px" flexShrink="0" />
                  <Text fontSize="13px" color="#475569" fontWeight="500">{val}</Text>
                </Flex>
              ))}
            </Flex>

            <Flex gap="6px" flexWrap="wrap" mb="16px">
              {cinema.amenities.map((a) => (
                <Flex key={a} align="center" gap="5px" px="10px" py="5px"
                  borderRadius="8px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Icon as={AMENITY_ICONS[a]} boxSize="12px" color="#f97316" />
                  <Text fontSize="11px" fontWeight="700" color="#b45309">{AMENITY_LABELS[a]}</Text>
                </Flex>
              ))}
            </Flex>

            <Box p="12px 14px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
              <Text fontSize="12.5px" color="#78350f" lineHeight="1.65">{cinema.description}</Text>
            </Box>
          </Box>
        </Grid>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="16px">
        <StatCard label="Phòng hoạt động" value={activeCount} sub={`/ ${rooms.length} phòng`} icon={MdMeetingRoom} accent="#f97316" delay={0} />
        <StatCard label="Phòng bảo trì"   value={maintenanceCount} icon={MdBuild}  accent="#f59e0b" delay={0.05} />
        <StatCard label="Tổng ghế"        value={totalSeats.toLocaleString()} icon={MdChair} accent="#0284c7" delay={0.1} />
        <StatCard label="Doanh thu tháng" value={cinema.monthRevenue} icon={FaTicketAlt} accent="#059669" delay={0.15} />
      </SimpleGrid>

      {/* Rooms section */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}>
        <Box p="18px 20px 14px" borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color="#0f172a">Danh sách phòng chiếu</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} phòng</Text>
              </Box>
            </Flex>
          </Flex>
          <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
            <Box position="relative" flex="1">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
              <Input pl="30px" h="36px" fontSize="12.5px" fontWeight="500"
                placeholder="Tìm phòng chiếu, loại phòng..."
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
            <Select h="36px" fontSize="12.5px" fontWeight="600" color="#374151"
              bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
              w={{ base: "100%", sm: "150px" }}
              _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bảo trì">Bảo trì</option>
            </Select>
          </Flex>
        </Box>

        {/* Column headers */}
        <Flex px="16px" py="9px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base: "none", md: "flex" }}>
          {["Phòng chiếu / Loại", "Trạng thái", "Đang chiếu / Suất tiếp", "Thao tác"].map((h, i) => (
            <Box key={h}
              flex={i === 0 ? "2.5" : i === 1 ? "1" : i === 2 ? "2" : "0 0 auto"}
              pr={i < 3 ? "12px" : "0"}>
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">{h}</Text>
            </Box>
          ))}
        </Flex>

        <Box p="10px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" py="32px" color="#cbd5e1">
              <Icon as={MdMeetingRoom} boxSize="28px" mb="6px" />
              <Text fontSize="13px" color="#94a3b8">Không tìm thấy phòng chiếu</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((r, i) => (
                <RoomRow key={r.id} room={r} index={i} onToggleMaintenance={onToggleMaintenance} />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────
function CinemaEditForm({ cinema, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: cinema.name,
    address: cinema.address,
    phone: cinema.phone,
    openTime: cinema.openTime,
    status: cinema.status,
    description: cinema.description,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      <Flex align="center" gap="12px" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onCancel}>
          Quay lại
        </Button>
        <Box>
          <Text fontSize="20px" fontWeight="800" color="#0f172a" letterSpacing="-0.3px">
            Cập nhật thông tin rạp
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">{cinema.name}</Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px">
            <SectionTitle label="Thông tin cơ bản" />
            <Flex direction="column" gap="14px">
              <Box>
                <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                  textTransform="uppercase" color="#64748b" mb="7px">Tên rạp *</Text>
                <Input {...inputStyle} placeholder="Tên rạp chiếu phim"
                  value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Box>
              <Box>
                <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                  textTransform="uppercase" color="#64748b" mb="7px">Địa chỉ *</Text>
                <Input {...inputStyle} placeholder="Địa chỉ đầy đủ"
                  value={form.address} onChange={(e) => set("address", e.target.value)} />
              </Box>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Box>
                  <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                    textTransform="uppercase" color="#64748b" mb="7px">Hotline</Text>
                  <Input {...inputStyle} placeholder="028 xxxx xxxx"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Box>
                <Box>
                  <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                    textTransform="uppercase" color="#64748b" mb="7px">Giờ mở cửa</Text>
                  <Input {...inputStyle} placeholder="08:00 – 23:30"
                    value={form.openTime} onChange={(e) => set("openTime", e.target.value)} />
                </Box>
              </Grid>
            </Flex>
          </Box>

          {/* Status + description */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px">
            <SectionTitle label="Trạng thái & Mô tả" />
            <Box mb="14px">
              <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                textTransform="uppercase" color="#64748b" mb="7px">Trạng thái hoạt động</Text>
              <Select {...inputStyle} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Tạm đóng">Tạm đóng</option>
              </Select>
            </Box>
            <Box>
              <Text fontSize="10.5px" fontWeight="800" letterSpacing="0.9px"
                textTransform="uppercase" color="#64748b" mb="7px">Mô tả rạp</Text>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }} transition="all 0.2s"
                rows={4} placeholder="Mô tả về rạp chiếu..."
                value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Box>
          </Box>
        </Flex>

        {/* Right: permissions note */}
        <Flex direction="column" gap="14px">
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px">
            <SectionTitle label="Ảnh rạp" />
            <Box h="160px" borderRadius="12px" overflow="hidden" mb="10px">
              <img src={cinema.image} alt={cinema.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
            <Box p="10px 12px" borderRadius="10px" bg="#fef2f2" border="1px solid #fca5a5">
              <Text fontSize="11px" fontWeight="600" color="#dc2626" lineHeight="1.5">
                Thay đổi ảnh rạp thuộc quyền Admin. Vui lòng liên hệ Admin để cập nhật.
              </Text>
            </Box>
          </Box>

          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px">
            <SectionTitle label="Lưu ý phân quyền" />
            <Flex direction="column" gap="8px">
              {[
                { ok: true,  txt: "Cập nhật địa chỉ, SĐT, giờ mở cửa" },
                { ok: true,  txt: "Đánh dấu trạng thái phòng bảo trì" },
                { ok: false, txt: "Thêm hoặc xóa rạp (chỉ Admin)" },
                { ok: false, txt: "Chỉnh sửa layout phòng chiếu" },
                { ok: false, txt: "Quản lý nhân viên rạp" },
              ].map(({ ok, txt }) => (
                <Flex key={txt} align="flex-start" gap="7px">
                  <Box w="16px" h="16px" borderRadius="full"
                    bg={ok ? "#ecfdf5" : "#fef2f2"} border={ok ? "1px solid #6ee7b7" : "1px solid #fca5a5"}
                    display="flex" alignItems="center" justifyContent="center" flexShrink="0" mt="1px">
                    <Text fontSize="8px" fontWeight="900" color={ok ? "#059669" : "#dc2626"}>{ok ? "✓" : "✕"}</Text>
                  </Box>
                  <Text fontSize="11.5px" color={ok ? "#374151" : "#94a3b8"} fontWeight={ok ? "600" : "500"}>{txt}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px 20px" mt="16px">
        <Flex justify="flex-end" gap="10px">
          <Button h="42px" px="22px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button h="42px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />} onClick={() => onSave(form)}>
            Lưu thay đổi
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanLyRap() {
  const toast = useToast();
  const [view, setView] = useState("list"); // list | detail | edit
  const [selected, setSelected] = useState(null);
  const [cinemas, setCinemas] = useState(CINEMAS);
  const [rooms, setRooms] = useState(ROOMS_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const filtered = cinemas.filter((c) => {
    const matchS = c.name.toLowerCase().includes(search.toLowerCase()) ||
                   c.address.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === "Tất cả" || c.status === filterStatus;
    return matchS && matchF;
  });

  const counts = {
    total:       cinemas.length,
    active:      cinemas.filter((c) => c.status === "Hoạt động").length,
    maintenance: cinemas.filter((c) => c.status === "Bảo trì").length,
    totalRooms:  cinemas.reduce((s, c) => s + c.totalRooms, 0),
  };

  const handleToggleMaintenance = (roomId) => {
    if (!selected) return;
    setRooms((prev) => {
      const updated = (prev[selected.id] || []).map((r) =>
        r.id === roomId ? { ...r, status: r.status === "Bảo trì" ? "Hoạt động" : "Bảo trì" } : r
      );
      return { ...prev, [selected.id]: updated };
    });
    const room = (rooms[selected.id] || []).find((r) => r.id === roomId);
    toast({
      title: room?.status === "Bảo trì" ? "Phòng đã kích hoạt" : "Phòng đã chuyển bảo trì",
      status: room?.status === "Bảo trì" ? "success" : "warning",
      duration: 2500, isClosable: true, position: "top-right",
    });
  };

  const handleSave = (form) => {
    setCinemas((prev) => prev.map((c) => c.id === selected.id ? { ...c, ...form } : c));
    setSelected((prev) => ({ ...prev, ...form }));
    setView("detail");
    toast({ title: "Đã cập nhật thông tin rạp", status: "success", duration: 2500, isClosable: true, position: "top-right" });
  };

  // ── LIST ──
  if (view === "list") return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="12px">
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.38)">
              <Icon as={MdTheaters} boxSize="18px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color="#0f172a" letterSpacing="-0.5px">
              Quản lý rạp chiếu
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl="50px">
            Xem và cập nhật thông tin các rạp chiếu phim
          </Text>
        </Box>
        {/* Info note — no add/delete for back-office */}
        <Flex align="center" gap="7px" px="14px" py="8px" borderRadius="10px"
          bg="#fff7ed" border="1px solid #fed7aa"
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}>
          <Icon as={MdInfo} boxSize="14px" color="#f97316" />
          <Text fontSize="12px" fontWeight="600" color="#b45309">
            Thêm/xóa rạp thuộc quyền Admin
          </Text>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng rạp"      value={counts.total}       icon={MdTheaters}   accent="#f97316" delay={0}    />
        <StatCard label="Đang hoạt động" value={counts.active}      icon={MdCheckCircle} accent="#059669" delay={0.05} />
        <StatCard label="Đang bảo trì"   value={counts.maintenance} icon={MdBuild}       accent="#f59e0b" delay={0.1}  />
        <StatCard label="Tổng phòng"     value={counts.totalRooms}  icon={MdMeetingRoom} accent="#0284c7" delay={0.15} />
      </SimpleGrid>

      {/* Filter bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px 18px" mb="16px"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}>
        <Flex gap="10px" direction={{ base: "column", sm: "row" }} align="center">
          <Box position="relative" flex="1">
            <Icon as={MdSearch} position="absolute" left="10px" top="50%"
              transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
            <Input pl="30px" h="38px" fontSize="12.5px" fontWeight="500"
              placeholder="Tìm theo tên rạp, địa chỉ..."
              bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
              _placeholder={{ color: "#b0bac8" }}
              _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
              _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>
          <Select h="38px" fontSize="12.5px" fontWeight="600" color="#374151"
            bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
            w={{ base: "100%", sm: "160px" }}
            _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
            transition="all 0.2s" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bảo trì">Đang bảo trì</option>
            <option value="Tạm đóng">Tạm đóng</option>
          </Select>
          <Flex align="center" gap="6px" px="12px" py="6px" borderRadius="8px"
            bg="#f8fafc" border="1px solid #f1f5f9" flexShrink="0">
            <Icon as={MdLocalMovies} boxSize="12px" color="#94a3b8" />
            <Text fontSize="12px" fontWeight="700" color="#64748b">{filtered.length} rạp</Text>
          </Flex>
        </Flex>
      </Box>

      {/* Cinema cards grid */}
      {filtered.length === 0 ? (
        <Flex direction="column" align="center" py="60px" color="#cbd5e1">
          <Icon as={MdTheaters} boxSize="36px" mb="10px" />
          <Text fontSize="14px" fontWeight="600" color="#94a3b8">Không tìm thấy rạp nào</Text>
        </Flex>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap="16px">
          {filtered.map((c, i) => (
            <CinemaCard key={c.id} cinema={c} index={i}
              onView={(cv) => { setSelected(cv); setView("detail"); }}
              onEdit={(cv) => { setSelected(cv); setView("edit"); }} />
          ))}
        </Grid>
      )}
    </Box>
  );

  if (view === "detail" && selected) return (
    <Box pt={{ base: "100px", md: "80px" }}>
      <CinemaDetail
        cinema={cinemas.find((c) => c.id === selected.id) || selected}
        onBack={() => setView("list")}
        onEdit={() => setView("edit")}
        rooms={rooms[selected.id] || []}
        onToggleMaintenance={handleToggleMaintenance}
      />
    </Box>
  );

  if (view === "edit" && selected) return (
    <Box pt={{ base: "100px", md: "80px" }}>
      <CinemaEditForm
        cinema={cinemas.find((c) => c.id === selected.id) || selected}
        onCancel={() => setView("detail")}
        onSave={handleSave}
      />
    </Box>
  );

  return null;
}