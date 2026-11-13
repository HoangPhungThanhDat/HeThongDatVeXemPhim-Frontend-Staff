import React, { useState, useMemo } from "react";
import {
  Box, Flex, Grid, Text, Button, Input, Badge, SimpleGrid,
  Icon, Image, Tabs, TabList, Tab, TabPanels, TabPanel,
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader,
  DrawerBody, DrawerCloseButton, keyframes, Select,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdSearch, MdMovie, MdSchedule, MdTheaters, MdFastfood,
  MdCardGiftcard, MdStar, MdAccessTime, MdLocationOn,
  MdCalendarToday, MdClose, MdInfo, MdCheckCircle,
  MdPlayCircle, MdTimer, MdDone, MdPerson, MdChair,
  MdLocalOffer, MdStore, MdMeetingRoom, MdRefresh,
} from "react-icons/md";

// ─── Keyframes ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const pulse = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Configs ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Đang chiếu":   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", icon: MdPlayCircle },
  "Sắp chiếu":    { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", icon: MdTimer },
  "Ngừng chiếu":  { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af", icon: MdDone },
  "Còn hiệu lực": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", icon: MdCheckCircle },
  "Hết hạn":      { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", icon: MdClose },
  "Đang hoạt động":{ color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", icon: MdCheckCircle },
  "Đang bảo trì": { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", icon: MdTimer },
};

const AGE_CONFIG = {
  "P":   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "K":   { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  "T13": { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  "T16": { color: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
  "T18": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOVIES = [
  { id: 1, title: "Avengers: Infinity War", genre: "Hành động", duration: 149, age: "T13", status: "Đang chiếu", rating: 4.8, reviews: 342, format: "2D / IMAX", director: "Anthony & Joe Russo", cast: "Robert Downey Jr, Chris Evans, Scarlett Johansson", country: "Mỹ", distributor: "Marvel Studios", releaseDate: "20/04/2018", poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg", description: "Khi Thanos thu thập đủ 6 viên đá vô cực..." },
  { id: 2, title: "Spider-Man: No Way Home", genre: "Hành động", duration: 148, age: "T13", status: "Đang chiếu", rating: 4.9, reviews: 589, format: "2D / 3D", director: "Jon Watts", cast: "Tom Holland, Zendaya, Benedict Cumberbatch", country: "Mỹ", distributor: "Sony Pictures", releaseDate: "17/12/2021", poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg", description: "Peter Parker yêu cầu Doctor Strange xóa bỏ ký ức..." },
  { id: 3, title: "Doctor Strange 2", genre: "Viễn tưởng", duration: 126, age: "T16", status: "Sắp chiếu", rating: 4.2, reviews: 0, format: "3D / IMAX", director: "Sam Raimi", cast: "Benedict Cumberbatch, Elizabeth Olsen", country: "Mỹ", distributor: "Marvel Studios", releaseDate: "06/05/2022", poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg", description: "Doctor Strange và America Chavez hành trình xuyên đa vũ trụ..." },
  { id: 4, title: "Thor: Love and Thunder", genre: "Hành động", duration: 119, age: "T13", status: "Ngừng chiếu", rating: 3.9, reviews: 201, format: "2D", director: "Taika Waititi", cast: "Chris Hemsworth, Natalie Portman", country: "Mỹ", distributor: "Marvel Studios", releaseDate: "08/07/2022", poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg", description: "Thor lên đường tìm kiếm sự bình yên nội tâm..." },
];

const SHOWTIMES = [
  { id: 1, movie: "Avengers: Infinity War", movieId: 1, date: "14/10/2026", time: "09:30", room: "P1", cinema: "Gấu Phim Q1", format: "2D",  price: 75000,  seatsLeft: 42, total: 80 },
  { id: 2, movie: "Avengers: Infinity War", movieId: 1, date: "14/10/2026", time: "11:45", room: "P2", cinema: "Gấu Phim Q1", format: "3D",  price: 95000,  seatsLeft: 28, total: 80 },
  { id: 3, movie: "Avengers: Infinity War", movieId: 1, date: "14/10/2026", time: "14:00", room: "P1", cinema: "Gấu Phim Q1", format: "2D",  price: 75000,  seatsLeft: 65, total: 80 },
  { id: 4, movie: "Avengers: Infinity War", movieId: 1, date: "14/10/2026", time: "16:30", room: "P3", cinema: "Gấu Phim Q1", format: "IMAX", price: 120000, seatsLeft: 12, total: 80 },
  { id: 5, movie: "Spider-Man: No Way Home", movieId: 2, date: "14/10/2026", time: "10:00", room: "P2", cinema: "Gấu Phim Q1", format: "3D", price: 95000,  seatsLeft: 55, total: 80 },
  { id: 6, movie: "Spider-Man: No Way Home", movieId: 2, date: "14/10/2026", time: "15:30", room: "P1", cinema: "Gấu Phim Q1", format: "2D", price: 75000,  seatsLeft: 8,  total: 80 },
  { id: 7, movie: "Doctor Strange 2",       movieId: 3, date: "15/10/2026", time: "13:00", room: "P1", cinema: "Gấu Phim Q3", format: "IMAX", price: 120000, seatsLeft: 72, total: 80 },
  { id: 8, movie: "Doctor Strange 2",       movieId: 3, date: "15/10/2026", time: "18:00", room: "P2", cinema: "Gấu Phim Q3", format: "3D", price: 95000,  seatsLeft: 40, total: 80 },
];

const CINEMAS = [
  { id: 1, name: "Gấu Phim Quận 1", address: "123 Nguyễn Huệ, Q.1, TP.HCM", phone: "028 1234 5678", rooms: 5, totalSeats: 400, status: "Đang hoạt động" },
  { id: 2, name: "Gấu Phim Quận 3", address: "456 Võ Văn Tần, Q.3, TP.HCM", phone: "028 8765 4321", rooms: 4, totalSeats: 320, status: "Đang hoạt động" },
  { id: 3, name: "Gấu Phim Quận 7", address: "789 Nguyễn Văn Linh, Q.7, TP.HCM", phone: "028 2468 1357", rooms: 6, totalSeats: 480, status: "Đang hoạt động" },
];

const ROOMS = [
  { id: 1, name: "P1", cinema: "Gấu Phim Quận 1", type: "2D", seats: 80, rows: 8, cols: 10, status: "Đang hoạt động" },
  { id: 2, name: "P2", cinema: "Gấu Phim Quận 1", type: "3D", seats: 80, rows: 8, cols: 10, status: "Đang hoạt động" },
  { id: 3, name: "P3", cinema: "Gấu Phim Quận 1", type: "IMAX", seats: 80, rows: 8, cols: 10, status: "Đang hoạt động" },
  { id: 4, name: "P1", cinema: "Gấu Phim Quận 3", type: "2D", seats: 80, rows: 8, cols: 10, status: "Đang bảo trì" },
];

const COMBOS = [
  { id: 1, name: "Combo Solo",   desc: "1 bắp lớn + 1 nước lớn", price: 65000,  emoji: "🍿", status: "Còn hiệu lực" },
  { id: 2, name: "Combo Couple", desc: "1 bắp lớn + 2 nước lớn", price: 95000,  emoji: "🥤", status: "Còn hiệu lực" },
  { id: 3, name: "Combo Family", desc: "2 bắp lớn + 4 nước lớn", price: 165000, emoji: "🍱", status: "Còn hiệu lực" },
  { id: 4, name: "Bắp rang",     desc: "1 bắp lớn",              price: 45000,  emoji: "🍿", status: "Còn hiệu lực" },
  { id: 5, name: "Nước ngọt",    desc: "1 nước lớn",             price: 30000,  emoji: "🥤", status: "Còn hiệu lực" },
];

const VOUCHERS = [
  { id: 1, code: "SUMMER20",  name: "Giảm 20% mùa hè",     discount: "20%",     minOrder: 100000, maxDiscount: 50000, expiry: "30/12/2026", status: "Còn hiệu lực", usage: 45,  limit: 100 },
  { id: 2, code: "NEWBIE30",  name: "Khách mới giảm 30k",  discount: "30.000đ", minOrder: 150000, maxDiscount: 30000, expiry: "31/12/2026", status: "Còn hiệu lực", usage: 120, limit: 500 },
  { id: 3, code: "WEEKEND15", name: "Cuối tuần giảm 15%",  discount: "15%",     minOrder: 200000, maxDiscount: 40000, expiry: "31/12/2026", status: "Còn hiệu lực", usage: 78,  limit: 200 },
  { id: 4, code: "TET2025",   name: "Ưu đãi Tết 2025",     discount: "50.000đ", minOrder: 250000, maxDiscount: 50000, expiry: "15/02/2025", status: "Hết hạn",     usage: 500, limit: 500 },
];

// ─── HOOK MÀU DÙNG CHUNG ───────────────────────────────────────────────────
function useThemeColors() {
  return {
    // Nền
    cardBg:      useColorModeValue("white", "navy.800"),
    subtleBg:    useColorModeValue("secondaryGray.300", "navy.700"),
    inputBg:     useColorModeValue("#f8fafc", "navy.700"),
    hoverBg:     useColorModeValue("#f1f5f9", "whiteAlpha.100"),
    highlightBg: useColorModeValue("#fffbf7", "rgba(249,115,22,0.10)"),
    dividerBg:   useColorModeValue("#f1f5f9", "whiteAlpha.100"),
    innerCardBg: useColorModeValue("#f8fafc", "navy.700"),

    // Chữ
    textColor:    useColorModeValue("secondaryGray.900", "white"),
    subTextColor: useColorModeValue("#64748b", "secondaryGray.600"),
    mutedColor:   useColorModeValue("#94a3b8", "secondaryGray.600"),
    dimColor:     useColorModeValue("#cbd5e1", "whiteAlpha.400"),
    sectionColor: useColorModeValue("#374151", "white"),

    // Viền
    borderColor:  useColorModeValue("#e8edf3", "whiteAlpha.100"),
    subtleBorder: useColorModeValue("#f1f5f9", "whiteAlpha.50"),

    // Shadow
    shadow:       useColorModeValue("0 1px 4px rgba(0,0,0,0.04)", "0 1px 4px rgba(0,0,0,0.4)"),
    hoverShadow:  useColorModeValue("0 10px 24px rgba(0,0,0,0.08)", "0 10px 24px rgba(0,0,0,0.5)"),
  };
}

function useInputStyle() {
  const { inputBg, borderColor, textColor, mutedColor } = useThemeColors();
  return {
    bg: inputBg,
    border: "1.5px solid",
    borderColor,
    borderRadius: "10px",
    color: textColor,
    fontSize: "13px",
    fontWeight: "600",
    h: "40px",
    _placeholder: { color: mutedColor, fontWeight: "500" },
    _focus: { borderColor: "#f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: inputBg },
    _hover: { borderColor: "#f97316" },
    transition: "all 0.2s",
  };
}

const labelStyleBase = {
  fontSize: "10px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", mb: "6px",
};

// ─── BADGE HELPERS ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Ngừng chiếu"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đang chiếu" || status === "Còn hiệu lực" || status === "Đang hoạt động"
          ? { animation: `${pulse} 1.8s ease infinite` } : {}} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function AgeBadge({ age }) {
  const cfg = AGE_CONFIG[age] || AGE_CONFIG["P"];
  return (
    <Box px="7px" py="3px" borderRadius="6px" bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-block">
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{age}</Text>
    </Box>
  );
}

// ─── FILTER BAR ────────────────────────────────────────────────────────────
function FilterBar({ search, setSearch, filters, setFilters, onRefresh }) {
  const { cardBg, borderColor, shadow, textColor, subTextColor, subtleBg } = useThemeColors();
  const inputStyle = useInputStyle();

  return (
    <Box
      bg={cardBg} borderRadius="14px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "12px", md: "14px 16px" }}
      mb="16px" sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <Flex gap="10px" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }} flexWrap="wrap">
        <Box position="relative" flex={{ base: "1", md: "2" }} minW={{ md: "240px" }}>
          <Icon as={MdSearch} position="absolute" left="12px" top="50%" transform="translateY(-50%)"
            boxSize="16px" color="#94a3b8" zIndex="1" />
          <Input
            {...inputStyle} pl="36px" w="100%"
            placeholder="Tìm theo tên phim, mã voucher, rạp..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {filters.showDate && (
          <Input {...inputStyle} type="date" w={{ base: "100%", md: "160px" }}
            value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        )}

        {filters.showCinema && (
          <Select {...inputStyle} w={{ base: "100%", md: "180px" }}
            value={filters.cinema} onChange={(e) => setFilters({ ...filters, cinema: e.target.value })}>
            <option value="">Tất cả rạp</option>
            {CINEMAS.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </Select>
        )}

        {filters.showStatus && filters.statusOptions && (
          <Select {...inputStyle} w={{ base: "100%", md: "160px" }}
            value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Tất cả trạng thái</option>
            {filters.statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        )}

        <Button
          h="40px" px="14px" borderRadius="10px" flexShrink="0"
          bg="transparent" color={subTextColor}
          border="1px solid" borderColor={borderColor}
          fontSize="12.5px" fontWeight="700"
          leftIcon={<Icon as={MdRefresh} boxSize="14px" />}
          _hover={{ bg: subtleBg }} transition="all 0.2s"
          onClick={onRefresh}
        >
          Làm mới
        </Button>
      </Flex>
    </Box>
  );
}

// ─── MOVIE CARD ────────────────────────────────────────────────────────────
function MovieCard({ movie, onClick, index }) {
  const { cardBg, borderColor, shadow, hoverShadow, textColor, subTextColor, subtleBg } = useThemeColors();
  const formatBadgeBg = useColorModeValue("#f1f5f9", "whiteAlpha.100");

  return (
    <Box
      cursor="pointer" borderRadius="14px" overflow="hidden" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      boxShadow={shadow}
      transition="all 0.25s"
      _hover={{ transform: "translateY(-4px)", boxShadow: hoverShadow, borderColor: "#fed7aa" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      onClick={onClick}
    >
      <Box position="relative" h="240px" bg={subtleBg}>
        <Image src={movie.poster} alt={movie.title} w="100%" h="100%" objectFit="cover" />
        <Box position="absolute" top="10px" left="10px">
          <StatusBadge status={movie.status} />
        </Box>
        <Box position="absolute" top="10px" right="10px">
          <AgeBadge age={movie.age} />
        </Box>
        <Box
          position="absolute" bottom="10px" right="10px"
          bg="rgba(15,23,42,0.85)" backdropFilter="blur(6px)"
          borderRadius="8px" px="8px" py="4px" display="flex" alignItems="center" gap="4px"
        >
          <Icon as={MdStar} boxSize="13px" color="#fbbf24" />
          <Text fontSize="11.5px" fontWeight="800" color="white">{movie.rating}</Text>
        </Box>
      </Box>
      <Box p="14px">
        <Text fontSize="13.5px" fontWeight="800" color={textColor} noOfLines={2} lineHeight="1.35" mb="8px" minH="38px">
          {movie.title}
        </Text>
        <Flex gap="10px" mb="10px" flexWrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="11px" color={subTextColor} />
            <Text fontSize="11px" fontWeight="600" color={subTextColor}>{movie.duration} phút</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdMovie} boxSize="11px" color={subTextColor} />
            <Text fontSize="11px" fontWeight="600" color={subTextColor}>{movie.genre}</Text>
          </Flex>
        </Flex>
        <Flex gap="5px" flexWrap="wrap">
          <Badge fontSize="9.5px" bg={formatBadgeBg} color={subTextColor} borderRadius="5px" px="7px" py="2px" fontWeight="700">
            {movie.format}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── SHOWTIME ROW ──────────────────────────────────────────────────────────
function ShowtimeRow({ st, index, onClick }) {
  const { cardBg, borderColor, shadow, textColor, subTextColor, mutedColor, highlightBg, subtleBg, dividerBg } = useThemeColors();
  const imaxBg = useColorModeValue("#eff6ff", "rgba(37,99,235,0.15)");
  const imaxColor = useColorModeValue("#2563eb", "#93c5fd");

  const isLow = st.seatsLeft < 15;

  return (
    <Box
      p={{ base: "12px", md: "14px 18px" }} borderRadius="12px" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      transition="all 0.2s" cursor="pointer"
      _hover={{ borderColor: "#fed7aa", boxShadow: "0 4px 14px rgba(249,115,22,0.08)", bg: highlightBg }}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.03}s both` }}
      onClick={onClick}
    >
      {/* ĐÃ FIX: bỏ align="center", chỉ giữ 1 prop align responsive */}
      <Flex
        gap={{ base: "10px", md: "16px" }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
      >
        {/* Time */}
        <Box minW={{ md: "80px" }} textAlign={{ base: "left", md: "center" }}>
          <Text fontSize="20px" fontWeight="900" color="#f97316" lineHeight="1">{st.time}</Text>
          <Text fontSize="10.5px" color={mutedColor} fontWeight="700" mt="2px">{st.date}</Text>
        </Box>

        {/* Divider */}
        <Box display={{ base: "none", md: "block" }} w="1px" h="40px" bg={dividerBg} />

        {/* Movie + room */}
        <Box flex="1" minW="0">
          <Text fontSize="13.5px" fontWeight="800" color={textColor} noOfLines={1} mb="6px">{st.movie}</Text>
          <Flex gap="10px" flexWrap="wrap">
            <Flex align="center" gap="4px">
              <Icon as={MdLocationOn} boxSize="11px" color={mutedColor} />
              <Text fontSize="11.5px" color={subTextColor} fontWeight="600">{st.cinema}</Text>
            </Flex>
            <Flex align="center" gap="4px">
              <Icon as={MdMeetingRoom} boxSize="11px" color={mutedColor} />
              <Text fontSize="11.5px" color={subTextColor} fontWeight="600">Phòng {st.room}</Text>
            </Flex>
          </Flex>
        </Box>

        {/* Format + seats */}
        <Flex gap="10px" align="center" flexShrink="0"
          justify={{ base: "space-between", md: "flex-end" }}
          w={{ base: "100%", md: "auto" }}
        >
          <Badge fontSize="10px"
            bg={st.format === "IMAX" ? imaxBg : subtleBg}
            color={st.format === "IMAX" ? imaxColor : subTextColor}
            borderRadius="6px" px="8px" py="3px" fontWeight="800"
          >
            {st.format}
          </Badge>
          <Box textAlign="right">
            <Text fontSize="13px" fontWeight="800" color={textColor}>{st.price.toLocaleString("vi-VN")}đ</Text>
            <Text fontSize="10.5px" color={isLow ? "#dc2626" : mutedColor} fontWeight={isLow ? "700" : "600"}>
              {isLow ? `⚠ Còn ${st.seatsLeft}` : `${st.seatsLeft}/${st.total} ghế`}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── CINEMA CARD ───────────────────────────────────────────────────────────
function CinemaCard({ cinema, onClick, index }) {
  const { cardBg, borderColor, shadow, hoverShadow, textColor, subTextColor, mutedColor, innerCardBg } = useThemeColors();
  const iconBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");

  return (
    <Box
      cursor="pointer" borderRadius="14px" overflow="hidden" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      boxShadow={shadow}
      transition="all 0.25s"
      _hover={{ transform: "translateY(-3px)", boxShadow: hoverShadow, borderColor: "#fed7aa" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
      onClick={onClick}
    >
      <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)" bgSize="200% 100%"
        sx={{ animation: `${shimmer} 3s linear infinite` }} />
      <Box p={{ base: "14px", md: "18px" }}>
        <Flex align="flex-start" gap="12px" mb="12px">
          <Box w="44px" h="44px" borderRadius="12px" bg={iconBg}
            display="flex" alignItems="center" justifyContent="center" flexShrink="0"
          >
            <Icon as={MdStore} boxSize="20px" color="#f97316" />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="800" color={textColor} noOfLines={1} mb="4px">{cinema.name}</Text>
            <Flex align="center" gap="4px">
              <Icon as={MdLocationOn} boxSize="11px" color={mutedColor} flexShrink="0" />
              <Text fontSize="11px" color={subTextColor} noOfLines={1}>{cinema.address}</Text>
            </Flex>
          </Box>
          <StatusBadge status={cinema.status} />
        </Flex>

        <SimpleGrid columns={2} spacing="8px">
          <Box p="8px 10px" borderRadius="8px" bg={innerCardBg}>
            <Text fontSize="9.5px" fontWeight="800" color={mutedColor} letterSpacing="0.6px" textTransform="uppercase" mb="2px">Phòng chiếu</Text>
            <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.rooms}</Text>
          </Box>
          <Box p="8px 10px" borderRadius="8px" bg={innerCardBg}>
            <Text fontSize="9.5px" fontWeight="800" color={mutedColor} letterSpacing="0.6px" textTransform="uppercase" mb="2px">Tổng ghế</Text>
            <Text fontSize="14px" fontWeight="800" color={textColor}>{cinema.totalSeats}</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}

// ─── ROOM ROW ──────────────────────────────────────────────────────────────
function RoomRow({ room, index, onClick }) {
  const { cardBg, borderColor, textColor, subTextColor, mutedColor, highlightBg, subtleBg } = useThemeColors();
  const iconBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");

  return (
    <Box
      p={{ base: "12px", md: "14px 18px" }} borderRadius="12px" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      transition="all 0.2s" cursor="pointer"
      _hover={{ borderColor: "#fed7aa", boxShadow: "0 4px 14px rgba(249,115,22,0.08)", bg: highlightBg }}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.04}s both` }}
      onClick={onClick}
    >
      <Flex align="center" gap="12px">
        <Box w="40px" h="40px" borderRadius="10px" bg={iconBg}
          display="flex" alignItems="center" justifyContent="center" flexShrink="0"
        >
          <Icon as={MdMeetingRoom} boxSize="18px" color="#f97316" />
        </Box>
        <Box flex="1" minW="0">
          <Flex align="center" gap="8px" mb="4px" flexWrap="wrap">
            <Text fontSize="14px" fontWeight="800" color={textColor}>Phòng {room.name}</Text>
            <Badge fontSize="10px" bg={subtleBg} color={subTextColor} borderRadius="5px" px="7px" py="2px" fontWeight="800">
              {room.type}
            </Badge>
          </Flex>
          <Text fontSize="11.5px" color={subTextColor} fontWeight="600">{room.cinema}</Text>
        </Box>
        <Box textAlign="right" flexShrink="0">
          <Text fontSize="11px" color={mutedColor} fontWeight="700" textTransform="uppercase" letterSpacing="0.5px">Sức chứa</Text>
          <Text fontSize="15px" fontWeight="900" color={textColor}>{room.seats} ghế</Text>
          <Text fontSize="10.5px" color={mutedColor} fontWeight="600">{room.rows} hàng × {room.cols} cột</Text>
        </Box>
        <Box flexShrink="0" display={{ base: "none", md: "block" }}>
          <StatusBadge status={room.status} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── COMBO CARD ────────────────────────────────────────────────────────────
function ComboCard({ combo, index, onClick }) {
  const { cardBg, borderColor, shadow, hoverShadow, textColor, subTextColor, mutedColor, dividerBg } = useThemeColors();
  const emojiBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );
  const emojiBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");

  return (
    <Box
      cursor="pointer" borderRadius="14px" overflow="hidden" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      boxShadow={shadow}
      transition="all 0.25s"
      _hover={{ transform: "translateY(-3px)", boxShadow: hoverShadow, borderColor: "#fed7aa" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      onClick={onClick}
    >
      <Box p={{ base: "14px", md: "18px" }}>
        <Flex align="center" gap="12px" mb="12px">
          <Box w="56px" h="56px" borderRadius="14px" bg={emojiBg}
            border="1px solid" borderColor={emojiBorder}
            display="flex" alignItems="center" justifyContent="center" fontSize="28px" flexShrink="0"
          >
            {combo.emoji}
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="14.5px" fontWeight="800" color={textColor} noOfLines={1} mb="3px">{combo.name}</Text>
            <Text fontSize="11.5px" color={mutedColor} noOfLines={1}>{combo.desc}</Text>
          </Box>
        </Flex>
        <Flex align="center" justify="space-between" pt="12px"
          borderTop="1px dashed" borderColor={dividerBg}
        >
          <Box>
            <Text fontSize="10px" fontWeight="800" color={mutedColor} letterSpacing="0.6px" textTransform="uppercase" mb="2px">Giá bán</Text>
            <Text fontSize="18px" fontWeight="900" color="#f97316">{combo.price.toLocaleString("vi-VN")}đ</Text>
          </Box>
          <StatusBadge status={combo.status} />
        </Flex>
      </Box>
    </Box>
  );
}

// ─── VOUCHER ROW ───────────────────────────────────────────────────────────
function VoucherRow({ voucher, index, onClick }) {
  const { cardBg, borderColor, textColor, subTextColor, mutedColor, highlightBg, subtleBg, dividerBg } = useThemeColors();
  const discountBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );
  const codeBg = useColorModeValue("#f1f5f9", "whiteAlpha.100");
  const progressBg = useColorModeValue("#f1f5f9", "whiteAlpha.100");

  const isExpired = voucher.status === "Hết hạn";
  const usagePct = (voucher.usage / voucher.limit) * 100;

  return (
    <Box
      p={{ base: "12px", md: "16px 18px" }} borderRadius="12px" bg={cardBg}
      border="1.5px solid" borderColor={borderColor}
      transition="all 0.2s" cursor="pointer" opacity={isExpired ? 0.65 : 1}
      _hover={!isExpired ? { borderColor: "#fed7aa", boxShadow: "0 4px 14px rgba(249,115,22,0.08)", bg: highlightBg } : {}}
      sx={{ animation: `${fadeUp} 0.3s ease ${index * 0.04}s both` }}
      onClick={onClick}
    >
      {/* ĐÃ FIX: bỏ align="center" dư thừa */}
      <Flex
        gap={{ base: "10px", md: "16px" }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
      >
        {/* Discount badge */}
        <Box
          minW={{ md: "100px" }} textAlign="center" p="10px"
          bg={discountBg}
          border="1.5px dashed" borderColor="#fb923c"
          borderRadius="10px" flexShrink="0"
        >
          <Text fontSize="20px" fontWeight="900" color="#ea580c" lineHeight="1">{voucher.discount}</Text>
          <Text fontSize="10px" color="#9a3412" fontWeight="700" mt="2px" letterSpacing="0.5px">GIẢM</Text>
        </Box>

        {/* Info */}
        <Box flex="1" minW="0">
          <Flex align="center" gap="8px" mb="4px" flexWrap="wrap">
            <Badge fontSize="11px" bg={codeBg} color={textColor} borderRadius="6px" px="8px" py="3px" fontWeight="800" letterSpacing="0.5px">
              {voucher.code}
            </Badge>
            <StatusBadge status={voucher.status} />
          </Flex>
          <Text fontSize="13.5px" fontWeight="800" color={textColor} noOfLines={1} mb="6px">{voucher.name}</Text>
          <Flex gap="14px" flexWrap="wrap">
            <Flex align="center" gap="4px">
              <Icon as={MdLocalOffer} boxSize="11px" color={mutedColor} />
              <Text fontSize="11.5px" color={subTextColor} fontWeight="600">Đơn tối thiểu {voucher.minOrder.toLocaleString("vi-VN")}đ</Text>
            </Flex>
            <Flex align="center" gap="4px">
              <Icon as={MdCalendarToday} boxSize="11px" color={mutedColor} />
              <Text fontSize="11.5px" color={subTextColor} fontWeight="600">HSD: {voucher.expiry}</Text>
            </Flex>
          </Flex>
        </Box>

        {/* Usage */}
        <Box minW={{ md: "140px" }} w={{ base: "100%", md: "auto" }} flexShrink="0">
          <Flex justify="space-between" mb="6px">
            <Text fontSize="10.5px" color={mutedColor} fontWeight="700" letterSpacing="0.5px">ĐÃ DÙNG</Text>
            <Text fontSize="11px" color={textColor} fontWeight="800">{voucher.usage}/{voucher.limit}</Text>
          </Flex>
          <Box h="6px" borderRadius="full" bg={progressBg} overflow="hidden">
            <Box
              h="100%" borderRadius="full"
              bg={usagePct >= 90 ? "linear-gradient(90deg, #dc2626, #ef4444)" : "linear-gradient(90deg, #f97316, #fbbf24)"}
              w={`${usagePct}%`} transition="width 0.6s ease"
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

// ─── DETAIL DRAWER ─────────────────────────────────────────────────────────
function DetailDrawer({ isOpen, onClose, item, type }) {
  const { cardBg, borderColor, textColor, dividerBg } = useThemeColors();
  if (!item) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent bg={cardBg}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor={dividerBg}>
          <Text fontSize="14px" fontWeight="800" color={textColor}>Chi tiết</Text>
        </DrawerHeader>
        <DrawerBody p="20px">
          {type === "movie" && <MovieDetailContent movie={item} />}
          {type === "showtime" && <ShowtimeDetailContent st={item} />}
          {type === "cinema" && <CinemaDetailContent cinema={item} />}
          {type === "room" && <RoomDetailContent room={item} />}
          {type === "combo" && <ComboDetailContent combo={item} />}
          {type === "voucher" && <VoucherDetailContent voucher={item} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ─── DETAIL CONTENTS ──────────────────────────────────────────────────────
function MovieDetailContent({ movie }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder, highlightBg } = useThemeColors();
  const badgeBg = useColorModeValue("#f1f5f9", "whiteAlpha.100");

  return (
    <Flex direction="column" gap="16px">
      <Image src={movie.poster} alt={movie.title} w="100%" maxH="360px" objectFit="cover" borderRadius="14px" />
      <Box>
        <Text fontSize="18px" fontWeight="900" color={textColor} mb="8px">{movie.title}</Text>
        <Flex gap="8px" flexWrap="wrap" mb="12px">
          <StatusBadge status={movie.status} />
          <AgeBadge age={movie.age} />
          <Badge fontSize="10px" bg={badgeBg} color={subTextColor} borderRadius="5px" px="7px" py="3px" fontWeight="700">{movie.format}</Badge>
        </Flex>
      </Box>
      <SimpleGrid columns={2} spacing="10px">
        {[
          { icon: MdAccessTime, label: "Thời lượng", val: `${movie.duration} phút` },
          { icon: MdStar, label: "Đánh giá", val: `${movie.rating} (${movie.reviews})` },
          { icon: MdCalendarToday, label: "Khởi chiếu", val: movie.releaseDate },
          { icon: MdMovie, label: "Thể loại", val: movie.genre },
          { icon: MdPerson, label: "Đạo diễn", val: movie.director },
          { icon: MdStore, label: "Nhà phát hành", val: movie.distributor },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} p="10px 12px" borderRadius="10px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder}>
            <Flex align="center" gap="5px" mb="4px">
              <Icon as={Ic} boxSize="11px" color="#f97316" />
              <Text {...labelStyleBase} color={subTextColor} mb="0">{label}</Text>
            </Flex>
            <Text fontSize="12.5px" fontWeight="700" color={textColor}>{val}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <Box p="12px 14px" borderRadius="12px" bg={highlightBg} border="1px solid" borderColor="rgba(249,115,22,0.3)">
        <Text {...labelStyleBase} color={subTextColor}>Diễn viên chính</Text>
        <Text fontSize="12.5px" color={subTextColor} lineHeight="1.6">{movie.cast}</Text>
      </Box>
      <Box p="12px 14px" borderRadius="12px" bg={highlightBg} border="1px solid" borderColor="rgba(249,115,22,0.3)">
        <Text {...labelStyleBase} color={subTextColor}>Nội dung</Text>
        <Text fontSize="12.5px" color={subTextColor} lineHeight="1.7">{movie.description}</Text>
      </Box>
    </Flex>
  );
}

function ShowtimeDetailContent({ st }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder } = useThemeColors();
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );

  return (
    <Flex direction="column" gap="14px">
      <Box p="16px" borderRadius="12px" bg={heroBg} border="1.5px solid" borderColor="rgba(249,115,22,0.3)">
        <Text fontSize="10.5px" fontWeight="800" color={useColorModeValue("#9a3412", "#fdba74")} letterSpacing="1px" textTransform="uppercase" mb="4px">Suất chiếu</Text>
        <Text fontSize="28px" fontWeight="900" color={useColorModeValue("#ea580c", "#fb923c")} lineHeight="1">{st.time}</Text>
        <Text fontSize="12.5px" color={useColorModeValue("#9a3412", "#fdba74")} fontWeight="700" mt="4px">{st.date}</Text>
      </Box>
      <SimpleGrid columns={2} spacing="10px">
        {[
          { icon: MdMovie, label: "Phim", val: st.movie },
          { icon: MdStore, label: "Rạp", val: st.cinema },
          { icon: MdMeetingRoom, label: "Phòng", val: st.room },
          { icon: MdInfo, label: "Định dạng", val: st.format },
          { icon: MdChair, label: "Ghế trống", val: `${st.seatsLeft}/${st.total}` },
          { icon: MdLocalOffer, label: "Giá vé", val: `${st.price.toLocaleString("vi-VN")}đ` },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} p="10px 12px" borderRadius="10px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder}>
            <Flex align="center" gap="5px" mb="4px">
              <Icon as={Ic} boxSize="11px" color="#f97316" />
              <Text {...labelStyleBase} color={subTextColor} mb="0">{label}</Text>
            </Flex>
            <Text fontSize="12.5px" fontWeight="700" color={textColor} noOfLines={2}>{val}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Flex>
  );
}

function CinemaDetailContent({ cinema }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder, cardBg } = useThemeColors();
  const heroBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
  const iconBgInner = useColorModeValue("white", "navy.700");

  return (
    <Flex direction="column" gap="14px">
      <Flex align="center" gap="12px" p="16px" borderRadius="12px" bg={heroBg} border="1.5px solid" borderColor="rgba(249,115,22,0.3)">
        <Box w="52px" h="52px" borderRadius="14px" bg={iconBgInner}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow="0 2px 8px rgba(249,115,22,0.2)"
        >
          <Icon as={MdStore} boxSize="24px" color="#f97316" />
        </Box>
        <Box flex="1">
          <Text fontSize="16px" fontWeight="900" color={textColor} mb="4px">{cinema.name}</Text>
          <StatusBadge status={cinema.status} />
        </Box>
      </Flex>
      {[
        { icon: MdLocationOn, label: "Địa chỉ", val: cinema.address },
        { icon: MdPerson, label: "Số điện thoại", val: cinema.phone },
        { icon: MdMeetingRoom, label: "Số phòng chiếu", val: `${cinema.rooms} phòng` },
        { icon: MdChair, label: "Tổng số ghế", val: `${cinema.totalSeats} ghế` },
      ].map(({ icon: Ic, label, val }) => (
        <Flex key={label} align="center" gap="12px" p="12px 14px" borderRadius="10px"
          bg={innerCardBg} border="1px solid" borderColor={subtleBorder}
        >
          <Box w="34px" h="34px" borderRadius="9px" bg={iconBgInner}
            display="flex" alignItems="center" justifyContent="center" flexShrink="0"
          >
            <Icon as={Ic} boxSize="15px" color="#f97316" />
          </Box>
          <Box>
            <Text {...labelStyleBase} color={mutedColor} mb="2px">{label}</Text>
            <Text fontSize="13px" fontWeight="700" color={textColor}>{val}</Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}

function RoomDetailContent({ room }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder } = useThemeColors();
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );

  return (
    <Flex direction="column" gap="14px">
      <Box p="16px" borderRadius="12px" bg={heroBg} border="1.5px solid" borderColor="rgba(249,115,22,0.3)" textAlign="center">
        <Icon as={MdMeetingRoom} boxSize="32px" color="#f97316" mb="6px" />
        <Text fontSize="22px" fontWeight="900" color={useColorModeValue("#ea580c", "#fb923c")} lineHeight="1">Phòng {room.name}</Text>
        <Text fontSize="12px" color={useColorModeValue("#9a3412", "#fdba74")} fontWeight="700" mt="4px">{room.cinema}</Text>
      </Box>
      <SimpleGrid columns={2} spacing="10px">
        {[
          { icon: MdInfo, label: "Loại phòng", val: room.type },
          { icon: MdChair, label: "Sức chứa", val: `${room.seats} ghế` },
          { icon: MdMovie, label: "Số hàng", val: `${room.rows} hàng` },
          { icon: MdMovie, label: "Số cột", val: `${room.cols} cột` },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} p="10px 12px" borderRadius="10px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder}>
            <Flex align="center" gap="5px" mb="4px">
              <Icon as={Ic} boxSize="11px" color="#f97316" />
              <Text {...labelStyleBase} color={subTextColor} mb="0">{label}</Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={textColor}>{val}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <StatusBadge status={room.status} />
    </Flex>
  );
}

function ComboDetailContent({ combo }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder } = useThemeColors();
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );

  return (
    <Flex direction="column" gap="14px">
      <Box p="20px" borderRadius="14px" bg={heroBg} border="1.5px solid" borderColor="rgba(249,115,22,0.3)" textAlign="center">
        <Text fontSize="48px" mb="8px">{combo.emoji}</Text>
        <Text fontSize="18px" fontWeight="900" color={textColor} mb="4px">{combo.name}</Text>
        <Text fontSize="12.5px" color={mutedColor} fontWeight="600">{combo.desc}</Text>
      </Box>
      <Box p="16px" borderRadius="12px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder} textAlign="center">
        <Text {...labelStyleBase} color={mutedColor}>Giá bán</Text>
        <Text fontSize="28px" fontWeight="900" color="#f97316">{combo.price.toLocaleString("vi-VN")}đ</Text>
      </Box>
      <StatusBadge status={combo.status} />
    </Flex>
  );
}

function VoucherDetailContent({ voucher }) {
  const { textColor, subTextColor, mutedColor, innerCardBg, subtleBorder } = useThemeColors();
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #fff7ed, #ffedd5)",
    "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,146,60,0.10))"
  );
  const progressBg = useColorModeValue("#e2e8f0", "whiteAlpha.100");

  return (
    <Flex direction="column" gap="14px">
      <Box p="20px" borderRadius="14px" bg={heroBg} border="1.5px dashed" borderColor="#fb923c" textAlign="center">
        <Text {...labelStyleBase} color={mutedColor}>Mã voucher</Text>
        <Text fontSize="22px" fontWeight="900" color={useColorModeValue("#ea580c", "#fb923c")} letterSpacing="2px" mb="8px">{voucher.code}</Text>
        <Text fontSize="13px" color={useColorModeValue("#9a3412", "#fdba74")} fontWeight="700">{voucher.name}</Text>
      </Box>
      <SimpleGrid columns={2} spacing="10px">
        {[
          { icon: MdLocalOffer, label: "Giảm giá", val: voucher.discount },
          { icon: MdInfo, label: "Đơn tối thiểu", val: `${voucher.minOrder.toLocaleString("vi-VN")}đ` },
          { icon: MdInfo, label: "Giảm tối đa", val: `${voucher.maxDiscount.toLocaleString("vi-VN")}đ` },
          { icon: MdCalendarToday, label: "Hết hạn", val: voucher.expiry },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} p="10px 12px" borderRadius="10px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder}>
            <Flex align="center" gap="5px" mb="4px">
              <Icon as={Ic} boxSize="11px" color="#f97316" />
              <Text {...labelStyleBase} color={subTextColor} mb="0">{label}</Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={textColor}>{val}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <Box p="12px 14px" borderRadius="10px" bg={innerCardBg} border="1px solid" borderColor={subtleBorder}>
        <Flex justify="space-between" mb="6px">
          <Text {...labelStyleBase} color={mutedColor} mb="0">Đã sử dụng</Text>
          <Text fontSize="12.5px" fontWeight="800" color={textColor}>{voucher.usage}/{voucher.limit}</Text>
        </Flex>
        <Box h="8px" borderRadius="full" bg={progressBg} overflow="hidden">
          <Box h="100%" borderRadius="full" bg="linear-gradient(90deg, #f97316, #fbbf24)"
            w={`${(voucher.usage / voucher.limit) * 100}%`} transition="width 0.6s ease" />
        </Box>
      </Box>
      <StatusBadge status={voucher.status} />
    </Flex>
  );
}

// ─── EMPTY STATE ───────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }) {
  const { mutedColor, dimColor, subtleBg, borderColor } = useThemeColors();

  return (
    <Flex direction="column" align="center" justify="center" py="48px"
      sx={{ animation: `${fadeIn} 0.4s ease both` }}
    >
      <Box w="72px" h="72px" borderRadius="full" bg={subtleBg}
        border="2px dashed" borderColor={borderColor}
        display="flex" alignItems="center" justifyContent="center" mb="14px"
      >
        <Icon as={icon} boxSize="28px" color={dimColor} />
      </Box>
      <Text fontSize="14px" fontWeight="700" color={mutedColor} mb="4px">{title}</Text>
      <Text fontSize="12px" color={dimColor}>{subtitle}</Text>
    </Flex>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Tracuu() {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  const [movieStatus, setMovieStatus] = useState("");
  const [showtimeDate, setShowtimeDate] = useState("");
  const [showtimeCinema, setShowtimeCinema] = useState("");
  const [voucherStatus, setVoucherStatus] = useState("");

  const { cardBg, borderColor, shadow, textColor, subTextColor, mutedColor, dividerBg, sectionColor } = useThemeColors();
  const tabInactiveColor = useColorModeValue("#94a3b8", "secondaryGray.600");
  const tabHoverColor = useColorModeValue("#475569", "white");
  const infoBadgeBg = useColorModeValue("#fff7ed", "rgba(249,115,22,0.15)");
  const infoBadgeBorder = useColorModeValue("#fed7aa", "rgba(249,115,22,0.3)");
  const infoBadgeText = useColorModeValue("#c2410c", "#fdba74");

  const openDetail = (item, type) => {
    setSelected(item);
    setSelectedType(type);
    setDrawerOpen(true);
  };

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((m) => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                          m.genre.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !movieStatus || m.status === movieStatus;
      return matchSearch && matchStatus;
    });
  }, [search, movieStatus]);

  const filteredShowtimes = useMemo(() => {
    return SHOWTIMES.filter((s) => {
      const matchSearch = s.movie.toLowerCase().includes(search.toLowerCase());
      const matchCinema = !showtimeCinema || s.cinema === showtimeCinema;
      return matchSearch && matchCinema;
    });
  }, [search, showtimeCinema]);

  const filteredCombos = useMemo(() => {
    return COMBOS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const filteredVouchers = useMemo(() => {
    return VOUCHERS.filter((v) => {
      const matchSearch = v.code.toLowerCase().includes(search.toLowerCase()) ||
                          v.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !voucherStatus || v.status === voucherStatus;
      return matchSearch && matchStatus;
    });
  }, [search, voucherStatus]);

  return (
    <Box pt={{ base: "100px", md: "80px" }} pb="40px">
      {/* Page header */}
      <Flex
        justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="16px" gap="12px"
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Box>
          <Flex align="center" gap="10px" mb="4px">
            <Box
              w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={MdSearch} boxSize="18px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">
              Tra cứu
            </Text>
          </Flex>
          <Text color={mutedColor} fontSize="13px" pl="48px">
            Tra cứu nhanh phim, suất chiếu, rạp, combo và voucher
          </Text>
        </Box>
        <Flex gap="8px" align="center" flexWrap="wrap">
          <Flex align="center" gap="6px" px="12px" py="7px" borderRadius="10px"
            bg={infoBadgeBg} border="1px solid" borderColor={infoBadgeBorder}
          >
            <Icon as={MdInfo} boxSize="13px" color="#f97316" />
            <Text fontSize="11.5px" fontWeight="700" color={infoBadgeText}>Chỉ xem — không sửa</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Box
        bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
        boxShadow={shadow} overflow="hidden"
        sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
      >
        <Tabs variant="unstyled" index={tabIndex} onChange={(i) => { setTabIndex(i); setSearch(""); }}>
          <Box borderBottom="1px solid" borderColor={dividerBg} px={{ base: "8px", md: "16px" }} overflowX="auto">
            <TabList gap={{ base: "4px", md: "8px" }}>
              {[
                { icon: MdMovie,        label: "Phim" },
                { icon: MdSchedule,     label: "Suất chiếu" },
                { icon: MdTheaters,     label: "Rạp / Phòng" },
                { icon: MdFastfood,     label: "Combo" },
                { icon: MdCardGiftcard, label: "Voucher" },
              ].map((t, i) => {
                const isActive = tabIndex === i;
                return (
                  <Tab
                    key={t.label} flexShrink="0" h="56px" px={{ base: "12px", md: "18px" }}
                    fontSize="13px" fontWeight="800"
                    color={isActive ? "#f97316" : tabInactiveColor}
                    position="relative"
                    transition="all 0.2s"
                    _hover={{ color: isActive ? "#f97316" : tabHoverColor }}
                  >
                    <Flex align="center" gap="7px">
                      <Icon as={t.icon} boxSize="16px" />
                      <Text display={{ base: "none", sm: "block" }}>{t.label}</Text>
                    </Flex>
                    {isActive && (
                      <Box position="absolute" bottom="0" left="12px" right="12px" h="3px"
                        bg="linear-gradient(90deg, #f97316, #fbbf24)" borderRadius="full" />
                    )}
                  </Tab>
                );
              })}
            </TabList>
          </Box>

          <TabPanels>
            {/* TAB 1: PHIM */}
            <TabPanel p={{ base: "14px", md: "20px" }}>
              <FilterBar
                search={search} setSearch={setSearch}
                filters={{ showStatus: true, status: movieStatus, statusOptions: ["Đang chiếu", "Sắp chiếu", "Ngừng chiếu"] }}
                setFilters={(f) => setMovieStatus(f.status || "")}
                onRefresh={() => { setSearch(""); setMovieStatus(""); }}
              />
              {filteredMovies.length === 0 ? (
                <EmptyState icon={MdMovie} title="Không tìm thấy phim nào" subtitle="Thử tìm với từ khóa khác" />
              ) : (
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: "10px", md: "14px" }}>
                  {filteredMovies.map((m, i) => (
                    <MovieCard key={m.id} movie={m} index={i} onClick={() => openDetail(m, "movie")} />
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* TAB 2: SUẤT CHIẾU */}
            <TabPanel p={{ base: "14px", md: "20px" }}>
              <FilterBar
                search={search} setSearch={setSearch}
                filters={{ showCinema: true, cinema: showtimeCinema }}
                setFilters={(f) => setShowtimeCinema(f.cinema || "")}
                onRefresh={() => { setSearch(""); setShowtimeCinema(""); }}
              />
              {filteredShowtimes.length === 0 ? (
                <EmptyState icon={MdSchedule} title="Không có suất chiếu nào" subtitle="Thử chọn rạp hoặc ngày khác" />
              ) : (
                <Flex direction="column" gap="10px">
                  {filteredShowtimes.map((s, i) => (
                    <ShowtimeRow key={s.id} st={s} index={i} onClick={() => openDetail(s, "showtime")} />
                  ))}
                </Flex>
              )}
            </TabPanel>

            {/* TAB 3: RẠP / PHÒNG */}
            <TabPanel p={{ base: "14px", md: "20px" }}>
              <FilterBar
                search={search} setSearch={setSearch}
                filters={{}}
                setFilters={() => {}}
                onRefresh={() => setSearch("")}
              />

              <Box mb="24px">
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
                  <Text fontSize="12px" fontWeight="800" color={sectionColor} letterSpacing="1.2px" textTransform="uppercase">
                    Rạp chiếu
                  </Text>
                  <Badge fontSize="10px" bg={infoBadgeBg} color={infoBadgeText} borderRadius="6px" px="7px" py="2px" fontWeight="700">
                    {CINEMAS.length}
                  </Badge>
                </Flex>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap="12px">
                  {CINEMAS.map((c, i) => (
                    <CinemaCard key={c.id} cinema={c} index={i} onClick={() => openDetail(c, "cinema")} />
                  ))}
                </Grid>
              </Box>

              <Box>
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
                  <Text fontSize="12px" fontWeight="800" color={sectionColor} letterSpacing="1.2px" textTransform="uppercase">
                    Phòng chiếu
                  </Text>
                  <Badge fontSize="10px" bg={infoBadgeBg} color={infoBadgeText} borderRadius="6px" px="7px" py="2px" fontWeight="700">
                    {ROOMS.length}
                  </Badge>
                </Flex>
                <Flex direction="column" gap="10px">
                  {ROOMS.map((r, i) => (
                    <RoomRow key={r.id} room={r} index={i} onClick={() => openDetail(r, "room")} />
                  ))}
                </Flex>
              </Box>
            </TabPanel>

            {/* TAB 4: COMBO */}
            <TabPanel p={{ base: "14px", md: "20px" }}>
              <FilterBar
                search={search} setSearch={setSearch}
                filters={{}}
                setFilters={() => {}}
                onRefresh={() => setSearch("")}
              />
              {filteredCombos.length === 0 ? (
                <EmptyState icon={MdFastfood} title="Không có combo nào" subtitle="Thử tìm với từ khóa khác" />
              ) : (
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: "10px", md: "14px" }}>
                  {filteredCombos.map((c, i) => (
                    <ComboCard key={c.id} combo={c} index={i} onClick={() => openDetail(c, "combo")} />
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* TAB 5: VOUCHER */}
            <TabPanel p={{ base: "14px", md: "20px" }}>
              <FilterBar
                search={search} setSearch={setSearch}
                filters={{ showStatus: true, status: voucherStatus, statusOptions: ["Còn hiệu lực", "Hết hạn"] }}
                setFilters={(f) => setVoucherStatus(f.status || "")}
                onRefresh={() => { setSearch(""); setVoucherStatus(""); }}
              />
              {filteredVouchers.length === 0 ? (
                <EmptyState icon={MdCardGiftcard} title="Không có voucher nào" subtitle="Thử tìm với từ khóa khác" />
              ) : (
                <Flex direction="column" gap="10px">
                  {filteredVouchers.map((v, i) => (
                    <VoucherRow key={v.id} voucher={v} index={i} onClick={() => openDetail(v, "voucher")} />
                  ))}
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
        item={selected} type={selectedType}
      />
    </Box>
  );
}