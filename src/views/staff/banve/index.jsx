import React, { useState } from "react";
import {
  Box, Flex, Grid, Text, Button, Input, Badge, SimpleGrid,
  Icon, keyframes, Image, useColorModeValue,
} from "@chakra-ui/react";
import {
  MdSearch, MdArrowBack, MdArrowForward, MdMovie,
  MdCheckCircle, MdChair, MdFastfood, MdPayment, MdPrint,
  MdAttachMoney, MdCreditCard, MdAccountBalanceWallet,
  MdAdd, MdRemove, MdClose, MdConfirmationNumber,
  MdLocationOn, MdSchedule, MdReceipt, MdRefresh, MdPerson,
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

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Chọn phim",  icon: MdMovie },
  { id: 2, label: "Suất chiếu", icon: MdSchedule },
  { id: 3, label: "Chọn ghế",   icon: MdChair },
  { id: 4, label: "Combo",      icon: MdFastfood },
  { id: 5, label: "Thanh toán", icon: MdPayment },
];

const MOVIES = [
  { id: 1, title: "Avengers: Infinity War", duration: 149, age: "T13", genre: "Hành động",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg" },
  { id: 2, title: "Spider-Man: No Way Home", duration: 148, age: "T13", genre: "Hành động",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg" },
  { id: 3, title: "Doctor Strange 2", duration: 126, age: "T16", genre: "Viễn tưởng",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg" },
  { id: 4, title: "Thor: Love and Thunder", duration: 119, age: "T13", genre: "Hành động",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg" },
];

const SHOWTIMES = [
  { id: 1, time: "09:30", room: "P1", format: "2D",  price: 75000,  seatsLeft: 42, total: 80 },
  { id: 2, time: "11:45", room: "P2", format: "3D",  price: 95000,  seatsLeft: 28, total: 80 },
  { id: 3, time: "14:00", room: "P1", format: "2D",  price: 75000,  seatsLeft: 65, total: 80 },
  { id: 4, time: "16:30", room: "P3", format: "IMAX",price: 120000, seatsLeft: 12, total: 80 },
  { id: 5, time: "19:00", room: "P1", format: "2D",  price: 85000,  seatsLeft: 5,  total: 80 },
  { id: 6, time: "21:30", room: "P2", format: "3D",  price: 95000,  seatsLeft: 38, total: 80 },
];

const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEAT_COLS = 10;

const COMBOS = [
  { id: 1, name: "Combo Solo",   desc: "1 bắp lớn + 1 nước lớn", price: 65000,  img: "🍿" },
  { id: 2, name: "Combo Couple", desc: "1 bắp lớn + 2 nước lớn", price: 95000,  img: "🥤" },
  { id: 3, name: "Combo Family", desc: "2 bắp lớn + 4 nước lớn", price: 165000, img: "🍱" },
  { id: 4, name: "Bắp rang",     desc: "1 bắp lớn",              price: 45000,  img: "🍿" },
  { id: 5, name: "Nước ngọt",    desc: "1 nước lớn",             price: 30000,  img: "🥤" },
];

// ─── HOOK MÀU DÙNG CHUNG ───────────────────────────────────────────────────
// Gom tất cả màu sắc vào 1 hook để dễ bảo trì
function useThemeColors() {
  return {
    // Nền
    cardBg:        useColorModeValue("white", "navy.800"),
    subtleBg:      useColorModeValue("secondaryGray.300", "navy.700"),
    inputBg:       useColorModeValue("#f8fafc", "navy.700"),
    hoverBg:       useColorModeValue("#f1f5f9", "whiteAlpha.100"),
    highlightBg:   useColorModeValue("#fffbf7", "rgba(249,115,22,0.10)"),
    dividerBg:     useColorModeValue("#f1f5f9", "whiteAlpha.100"),

    // Chữ
    textColor:     useColorModeValue("secondaryGray.900", "white"),
    subTextColor:  useColorModeValue("#64748b", "secondaryGray.600"),
    mutedColor:    useColorModeValue("#94a3b8", "secondaryGray.600"),
    dimColor:      useColorModeValue("#cbd5e1", "whiteAlpha.400"),

    // Viền
    borderColor:   useColorModeValue("#e8edf3", "whiteAlpha.100"),
    subtleBorder:  useColorModeValue("#f1f5f9", "whiteAlpha.50"),

    // Khác
    shadow:        useColorModeValue(
      "0 1px 4px rgba(0,0,0,0.04)",
      "0 1px 4px rgba(0,0,0,0.4)"
    ),
    hoverShadow:   useColorModeValue(
      "0 6px 20px rgba(0,0,0,0.08)",
      "0 6px 20px rgba(0,0,0,0.5)"
    ),
  };
}

// ─── Style dùng chung ──────────────────────────────────────────────────────
function useInputStyle() {
  const { inputBg, borderColor, textColor, mutedColor } = useThemeColors();
  return {
    bg: inputBg,
    border: "1.5px solid",
    borderColor: borderColor,
    borderRadius: "10px",
    color: textColor,
    fontSize: "13px",
    fontWeight: "500",
    h: "42px",
    _placeholder: { color: mutedColor, fontWeight: "400" },
    _focus: {
      borderColor: "#f97316",
      boxShadow: "0 0 0 3px rgba(249,115,22,0.10)",
      bg: inputBg,
    },
    _hover: { borderColor: "#f97316" },
    transition: "all 0.2s",
  };
}

// ─── Section Title ─────────────────────────────────────────────────────────
function SectionTitle({ label, icon }) {
  const { textColor, dividerBg } = useThemeColors();
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        {icon && <Icon as={icon} boxSize="14px" color="#f97316" />}
        <Text fontSize="11px" fontWeight="800" color={textColor} letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg={`linear-gradient(90deg, #fed7aa, transparent)`} />
    </Box>
  );
}

// ─── STEPPER ───────────────────────────────────────────────────────────────
function Stepper({ currentStep }) {
  const { cardBg, borderColor, shadow, textColor, mutedColor, subtleBg, dividerBg } = useThemeColors();
  return (
    <Flex
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow}
      p={{ base: "12px", md: "16px 20px" }} mb="16px"
      align="center" gap="4px" overflowX="auto"
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      {STEPS.map((step, i) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <React.Fragment key={step.id}>
            <Flex align="center" gap="8px" flexShrink="0" px={{ base: "4px", md: "6px" }}>
              <Flex
                w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }}
                borderRadius="full" align="center" justify="center"
                bg={isDone ? "#10b981" : isActive ? "linear-gradient(135deg, #f97316, #fb923c)" : subtleBg}
                color={isDone || isActive ? "white" : mutedColor}
                boxShadow={isActive ? "0 4px 12px rgba(249,115,22,0.35)" : "none"}
                transition="all 0.3s"
              >
                <Icon as={isDone ? MdCheckCircle : step.icon} boxSize={{ base: "13px", md: "15px" }} />
              </Flex>
              <Text
                fontSize={{ base: "11px", md: "12.5px" }} fontWeight="700"
                color={isActive ? "#f97316" : isDone ? "#10b981" : mutedColor}
                display={{ base: "none", sm: "block" }} whiteSpace="nowrap"
              >
                {step.label}
              </Text>
            </Flex>
            {i < STEPS.length - 1 && (
              <Box
                flex="1" minW={{ base: "12px", md: "24px" }} h="2px"
                bg={isDone ? "#10b981" : dividerBg} borderRadius="full"
                transition="all 0.3s"
              />
            )}
          </React.Fragment>
        );
      })}
    </Flex>
  );
}

// ─── MOVIE PICKER ──────────────────────────────────────────────────────────
function MoviePicker({ selected, onSelect }) {
  const [search, setSearch] = useState("");
  const filtered = MOVIES.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
  const { cardBg, borderColor, shadow, textColor, subtleBg, hoverShadow, highlightBg } = useThemeColors();
  const inputStyle = useInputStyle();

  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <SectionTitle label="Chọn phim" icon={MdMovie} />

      <Flex
        align="center" gap="8px" mb="14px"
        bg={subtleBg} border="1.5px solid" borderColor={borderColor}
        borderRadius="10px" px="12px" h="42px"
        _focusWithin={{ borderColor: "#f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)" }}
        transition="all 0.2s"
      >
        <Icon as={MdSearch} boxSize="16px" color="#94a3b8" />
        <Input
          border="none" bg="transparent" fontSize="13px" fontWeight="500" h="100%"
          placeholder="Tìm phim theo tên..." _placeholder={{ color: "#b0bac8" }}
          _focus={{ boxShadow: "none" }} p="0"
          value={search} onChange={(e) => setSearch(e.target.value)}
          color={textColor}
        />
      </Flex>

      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap="10px">
        {filtered.map((movie) => {
          const isActive = selected?.id === movie.id;
          return (
            <Box
              key={movie.id} cursor="pointer" borderRadius="12px" overflow="hidden"
              border="2px solid" borderColor={isActive ? "#f97316" : borderColor}
              bg={isActive ? highlightBg : cardBg}
              boxShadow={isActive ? "0 4px 16px rgba(249,115,22,0.2)" : shadow}
              transition="all 0.2s"
              _hover={{ transform: "translateY(-2px)", boxShadow: hoverShadow }}
              onClick={() => onSelect(movie)}
            >
              <Box position="relative" h={{ base: "140px", md: "160px" }} bg={subtleBg}>
                <Image src={movie.poster} alt={movie.title} w="100%" h="100%" objectFit="cover" />
                {isActive && (
                  <Box position="absolute" top="8px" right="8px" bg="#10b981" borderRadius="full" p="3px">
                    <Icon as={MdCheckCircle} boxSize="14px" color="white" />
                  </Box>
                )}
              </Box>
              <Box p="10px">
                <Text fontSize="12.5px" fontWeight="700" color={textColor} noOfLines={2} lineHeight="1.3" mb="6px">
                  {movie.title}
                </Text>
                <Flex gap="5px" flexWrap="wrap">
                  <Badge fontSize="9px" bg="#fff7ed" color="#c2410c" borderRadius="5px" px="6px">{movie.age}</Badge>
                  <Badge fontSize="9px" bg={subtleBg} color={textColor} borderRadius="5px" px="6px">{movie.duration}p</Badge>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}

// ─── SHOWTIME PICKER ───────────────────────────────────────────────────────
function ShowtimePicker({ movie, selected, onSelect }) {
  const { cardBg, borderColor, shadow, textColor, subtleBg, mutedColor, highlightBg } = useThemeColors();

  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <SectionTitle label="Chọn suất chiếu" icon={MdSchedule} />

      {!movie ? (
        <Flex direction="column" align="center" py="32px" color={mutedColor}>
          <Icon as={MdMovie} boxSize="28px" mb="8px" />
          <Text fontSize="12.5px">Vui lòng chọn phim trước</Text>
        </Flex>
      ) : (
        <>
          <Flex align="center" gap="10px" p="10px 12px" mb="14px"
            bg={highlightBg} border="1px solid #fed7aa" borderRadius="10px"
          >
            <Image src={movie.poster} alt={movie.title} w="36px" h="48px" borderRadius="6px" objectFit="cover" />
            <Box flex="1" minW="0">
              <Text fontSize="13px" fontWeight="700" color={textColor} noOfLines={1}>{movie.title}</Text>
              <Text fontSize="11px" color={mutedColor}>{movie.genre} • {movie.duration} phút</Text>
            </Box>
          </Flex>

          <Flex gap="6px" mb="14px" overflowX="auto" pb="4px">
            {["Hôm nay", "Mai", "Thứ 4", "Thứ 5", "Thứ 6"].map((day, i) => (
              <Button
                key={day} size="sm" flexShrink="0" h="34px" px="14px" borderRadius="8px"
                bg={i === 0 ? "linear-gradient(135deg, #f97316, #fb923c)" : subtleBg}
                color={i === 0 ? "white" : textColor}
                border="1px solid" borderColor={i === 0 ? "transparent" : borderColor}
                fontSize="12px" fontWeight="700" _hover={{ opacity: 0.9 }}
              >
                {day}
              </Button>
            ))}
          </Flex>

          <SimpleGrid columns={{ base: 2, md: 3 }} spacing="10px">
            {SHOWTIMES.map((s) => {
              const isActive = selected?.id === s.id;
              const isLow = s.seatsLeft < 15;
              return (
                <Box
                  key={s.id} cursor="pointer" p="12px" borderRadius="10px"
                  border="2px solid" borderColor={isActive ? "#f97316" : borderColor}
                  bg={isActive ? highlightBg : cardBg}
                  transition="all 0.2s"
                  _hover={{ borderColor: "#fed7aa" }}
                  onClick={() => onSelect(s)}
                >
                  <Flex justify="space-between" align="flex-start" mb="6px">
                    <Text fontSize="16px" fontWeight="800" color={isActive ? "#f97316" : textColor}>{s.time}</Text>
                    <Badge fontSize="9px"
                      bg={s.format === "IMAX" ? "#eff6ff" : subtleBg}
                      color={s.format === "IMAX" ? "#2563eb" : textColor}
                      borderRadius="4px"
                    >{s.format}</Badge>
                  </Flex>
                  <Flex align="center" gap="4px" mb="4px">
                    <Icon as={MdLocationOn} boxSize="10px" color={mutedColor} />
                    <Text fontSize="10.5px" color={mutedColor} fontWeight="600">Phòng {s.room}</Text>
                  </Flex>
                  <Text fontSize="11px" fontWeight="700" color={textColor} mb="4px">{s.price.toLocaleString("vi-VN")}đ</Text>
                  <Text fontSize="10px" color={isLow ? "#dc2626" : mutedColor} fontWeight={isLow ? "700" : "500"}>
                    {isLow ? `⚠ Chỉ còn ${s.seatsLeft} ghế` : `Còn ${s.seatsLeft}/${s.total} ghế`}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}

// ─── SEAT MAP ──────────────────────────────────────────────────────────────
function SeatMap({ selectedSeats, onToggleSeat }) {
  const { cardBg, borderColor, shadow, textColor, mutedColor, subtleBg, highlightBg, dividerBg } = useThemeColors();
  const emptySeatBg = useColorModeValue("white", "navy.700");
  const emptySeatBorder = useColorModeValue("#cbd5e1", "whiteAlpha.300");

  const getSeatState = (row, col) => {
    const id = `${row}${col}`;
    const booked = ["A3", "A4", "A5", "B7", "B8", "C2", "D9", "E5", "E6", "F1", "G10"];
    const holding = ["C5", "C6", "D4"];
    if (booked.includes(id)) return "booked";
    if (holding.includes(id)) return "holding";
    if (selectedSeats.includes(id)) return "selected";
    return "available";
  };

  const getSeatStyle = (state) => {
    switch (state) {
      case "booked":
        return {
          bg: useColorModeValue("#fee2e2", "rgba(220,38,38,0.15)"),
          color: "#dc2626",
          border: "#fca5a5",
          cursor: "not-allowed",
        };
      case "holding":
        return {
          bg: useColorModeValue("#fef3c7", "rgba(245,158,11,0.15)"),
          color: "#b45309",
          border: "#fcd34d",
          cursor: "not-allowed",
        };
      case "selected":
        return {
          bg: "linear-gradient(135deg, #f97316, #fb923c)",
          color: "white",
          border: "transparent",
          cursor: "pointer",
        };
      default:
        return {
          bg: emptySeatBg,
          color: textColor,
          border: emptySeatBorder,
          cursor: "pointer",
        };
    }
  };

  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <SectionTitle label="Chọn ghế" icon={MdChair} />

      <Box mb="20px">
        <Box
          h="6px" maxW="420px" mx="auto" borderRadius="full"
          bg="linear-gradient(90deg, transparent, #f97316, transparent)"
          boxShadow="0 4px 20px rgba(249,115,22,0.4)"
        />
        <Text textAlign="center" fontSize="10px" fontWeight="800" color={mutedColor} letterSpacing="2px" mt="8px">
          MÀN HÌNH
        </Text>
      </Box>

      <Box overflowX="auto" pb="10px">
        <Box minW="fit-content" mx="auto">
          {SEAT_ROWS.map((row) => (
            <Flex key={row} align="center" gap="6px" mb="6px" justify="center">
              <Text w="20px" fontSize="10px" fontWeight="800" color={mutedColor} textAlign="center">{row}</Text>
              {Array.from({ length: SEAT_COLS }).map((_, i) => {
                const col = i + 1;
                const state = getSeatState(row, col);
                const s = getSeatStyle(state);
                return (
                  <Box
                    key={col} w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }}
                    borderRadius="6px" display="flex" align="center" justify="center"
                    fontSize="9px" fontWeight="700"
                    bg={s.bg} color={s.color} border="1.5px solid" borderColor={s.border}
                    cursor={s.cursor}
                    transition="all 0.15s"
                    _hover={(state === "available" || state === "selected") ? { transform: "scale(1.1)" } : {}}
                    onClick={() => (state === "available" || state === "selected") && onToggleSeat(`${row}${col}`)}
                  >
                    {col}
                  </Box>
                );
              })}
              <Text w="20px" fontSize="10px" fontWeight="800" color={mutedColor} textAlign="center">{row}</Text>
            </Flex>
          ))}
        </Box>
      </Box>

      <Flex justify="center" gap={{ base: "10px", md: "20px" }} flexWrap="wrap" pt="14px" mt="6px"
        borderTop="1px solid" borderColor={dividerBg}
      >
        {[
          { label: "Trống",     bg: emptySeatBg, border: emptySeatBorder },
          { label: "Đang chọn", bg: "linear-gradient(135deg, #f97316, #fb923c)", border: "transparent" },
          { label: "Đang giữ",  bg: "#fef3c7",  border: "#fcd34d" },
          { label: "Đã bán",    bg: "#fee2e2",  border: "#fca5a5" },
        ].map((l) => (
          <Flex key={l.label} align="center" gap="6px">
            <Box w="14px" h="14px" borderRadius="4px" bg={l.bg} border="1.5px solid" borderColor={l.border} />
            <Text fontSize="11px" fontWeight="600" color={mutedColor}>{l.label}</Text>
          </Flex>
        ))}
      </Flex>

      {selectedSeats.length > 0 && (
        <Flex align="center" gap="8px" mt="14px" p="10px 12px"
          bg={highlightBg} border="1px solid #fed7aa" borderRadius="10px" flexWrap="wrap"
        >
          <Icon as={MdChair} boxSize="14px" color="#f97316" />
          <Text fontSize="11px" fontWeight="700" color={mutedColor}>Ghế đã chọn:</Text>
          {selectedSeats.map((s) => (
            <Badge key={s} bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              borderRadius="6px" px="8px" py="3px" fontSize="11px" fontWeight="700"
            >
              {s}
            </Badge>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// ─── COMBO PICKER ──────────────────────────────────────────────────────────
function ComboPicker({ combos, onChange }) {
  const { cardBg, borderColor, shadow, textColor, mutedColor, subtleBg, highlightBg } = useThemeColors();

  const update = (id, delta) => {
    const existing = combos.find((c) => c.id === id);
    if (existing) {
      const newQty = Math.max(0, existing.qty + delta);
      if (newQty === 0) onChange(combos.filter((c) => c.id !== id));
      else onChange(combos.map((c) => (c.id === id ? { ...c, qty: newQty } : c)));
    } else if (delta > 0) {
      const item = COMBOS.find((c) => c.id === id);
      onChange([...combos, { ...item, qty: 1 }]);
    }
  };
  const getQty = (id) => combos.find((c) => c.id === id)?.qty || 0;

  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <SectionTitle label="Combo bắp nước (tùy chọn)" icon={MdFastfood} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10px">
        {COMBOS.map((c) => {
          const qty = getQty(c.id);
          const isActive = qty > 0;
          return (
            <Flex
              key={c.id} align="center" gap="12px" p="12px" borderRadius="12px"
              border="2px solid" borderColor={isActive ? "#f97316" : borderColor}
              bg={isActive ? highlightBg : cardBg}
              transition="all 0.2s" _hover={{ borderColor: "#fed7aa" }}
            >
              <Box w="44px" h="44px" borderRadius="10px" bg={subtleBg}
                display="flex" alignItems="center" justifyContent="center" fontSize="22px" flexShrink="0"
              >
                {c.img}
              </Box>
              <Box flex="1" minW="0">
                <Text fontSize="13px" fontWeight="700" color={textColor} noOfLines={1}>{c.name}</Text>
                <Text fontSize="11px" color={mutedColor} noOfLines={1}>{c.desc}</Text>
                <Text fontSize="12.5px" fontWeight="800" color="#f97316" mt="2px">{c.price.toLocaleString("vi-VN")}đ</Text>
              </Box>
              {qty === 0 ? (
                <Button
                  size="sm" h="32px" px="12px" borderRadius="8px"
                  bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
                  fontSize="12px" fontWeight="700" leftIcon={<Icon as={MdAdd} boxSize="12px" />}
                  _hover={{ opacity: 0.9 }} flexShrink="0" onClick={() => update(c.id, 1)}
                >
                  Thêm
                </Button>
              ) : (
                <Flex align="center" gap="4px" flexShrink="0">
                  <Button size="xs" h="28px" w="28px" minW="28px" p="0" borderRadius="8px"
                    bg={cardBg} border="1.5px solid" borderColor={borderColor} color={textColor}
                    _hover={{ bg: "#fef2f2", color: "#dc2626", borderColor: "#fca5a5" }}
                    onClick={() => update(c.id, -1)}
                  >
                    <Icon as={MdRemove} boxSize="12px" />
                  </Button>
                  <Text w="24px" textAlign="center" fontSize="13px" fontWeight="800" color={textColor}>{qty}</Text>
                  <Button size="xs" h="28px" w="28px" minW="28px" p="0" borderRadius="8px"
                    bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
                    _hover={{ opacity: 0.9 }} onClick={() => update(c.id, 1)}
                  >
                    <Icon as={MdAdd} boxSize="12px" />
                  </Button>
                </Flex>
              )}
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

// ─── PAYMENT PANEL ─────────────────────────────────────────────────────────
function PaymentPanel({ method, setMethod }) {
  const { cardBg, borderColor, shadow, textColor, subtleBg } = useThemeColors();
  const methods = [
    { id: "cash",   label: "Tiền mặt",      icon: MdAttachMoney,          accent: "#10b981" },
    { id: "card",   label: "Thẻ ngân hàng", icon: MdCreditCard,           accent: "#2563eb" },
    { id: "wallet", label: "Ví điện tử",    icon: MdAccountBalanceWallet, accent: "#f97316" },
  ];
  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      sx={{ animation: `${fadeUp} 0.4s ease both` }}
    >
      <SectionTitle label="Phương thức thanh toán" icon={MdPayment} />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="10px">
        {methods.map((m) => {
          const isActive = method === m.id;
          const activeBg = useColorModeValue(`${m.accent}10`, `${m.accent}18`);
          return (
            <Flex
              key={m.id} align="center" gap="10px" p="12px" borderRadius="12px" cursor="pointer"
              border="2px solid" borderColor={isActive ? m.accent : borderColor}
              bg={isActive ? activeBg : cardBg}
              transition="all 0.2s"
              onClick={() => setMethod(m.id)}
            >
              <Box w="36px" h="36px" borderRadius="10px" bg={`${m.accent}15`}
                display="flex" alignItems="center" justifyContent="center" flexShrink="0"
              >
                <Icon as={m.icon} boxSize="18px" color={m.accent} />
              </Box>
              <Text fontSize="13px" fontWeight="700" color={textColor}>{m.label}</Text>
              {isActive && <Icon as={MdCheckCircle} boxSize="16px" color={m.accent} ml="auto" />}
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

// ─── ORDER SUMMARY ─────────────────────────────────────────────────────────
function OrderSummary({ movie, showtime, seats, combos, ticketPrice }) {
  const { cardBg, borderColor, shadow, textColor, mutedColor, subTextColor, subtleBg, dividerBg } = useThemeColors();

  const seatCount = seats.length;
  const seatTotal = seatCount * (ticketPrice || 0);
  const comboTotal = combos.reduce((sum, c) => sum + c.price * c.qty, 0);
  const subTotal = seatTotal + comboTotal;
  const vat = Math.round(subTotal * 0.08);
  const total = subTotal + vat;
  const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

  return (
    <Box
      bg={cardBg} borderRadius="16px" border="1px solid" borderColor={borderColor}
      boxShadow={shadow} p={{ base: "16px", md: "20px" }}
      position="sticky" top="100px"
      sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
    >
      <Flex align="center" gap="8px" mb="14px">
        <Box w="32px" h="32px" borderRadius="9px" bg="linear-gradient(135deg, #f97316, #fb923c)"
          display="flex" alignItems="center" justifyContent="center"
          boxShadow="0 4px 12px rgba(249,115,22,0.3)"
        >
          <Icon as={MdReceipt} boxSize="15px" color="white" />
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight="800" color={textColor}>Thông tin đơn</Text>
          <Text fontSize="10.5px" color={mutedColor} fontWeight="600">Kiểm tra trước khi thanh toán</Text>
        </Box>
      </Flex>

      <Box h="1px" bg={dividerBg} mb="14px" />

      {movie ? (
        <Flex gap="10px" mb="14px">
          <Image src={movie.poster} alt={movie.title} w="44px" h="60px" borderRadius="8px" objectFit="cover" flexShrink="0" />
          <Box flex="1" minW="0">
            <Text fontSize="13px" fontWeight="700" color={textColor} noOfLines={2} lineHeight="1.3">{movie.title}</Text>
            <Flex align="center" gap="4px" mt="4px">
              <Badge fontSize="9.5px" bg="#fff7ed" color="#c2410c" borderRadius="5px" px="6px">{movie.age}</Badge>
              <Text fontSize="10.5px" color={mutedColor}>{movie.duration} phút</Text>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Text fontSize="12px" color={mutedColor} fontStyle="italic" mb="14px">Chưa chọn phim</Text>
      )}

      <Box mb="14px">
        {[
          { icon: MdSchedule,   label: "Suất chiếu", val: showtime ? `${showtime.time} • ${showtime.format}` : "—" },
          { icon: MdLocationOn, label: "Phòng",      val: showtime ? `Phòng ${showtime.room}` : "—" },
          { icon: MdChair,      label: "Ghế",        val: seats.length ? seats.join(", ") : "—" },
        ].map(({ icon: Ic, label, val }) => (
          <Flex key={label} justify="space-between" align="flex-start" gap="10px" py="6px">
            <Flex align="center" gap="6px" flexShrink="0">
              <Icon as={Ic} boxSize="12px" color={mutedColor} />
              <Text fontSize="11.5px" color={subTextColor} fontWeight="600">{label}</Text>
            </Flex>
            <Text fontSize="11.5px" color={textColor} fontWeight="700" textAlign="right" noOfLines={2}>{val}</Text>
          </Flex>
        ))}
      </Box>

      <Box h="1px" bg={dividerBg} mb="14px" />

      {combos.length > 0 && (
        <>
          <Text fontSize="10.5px" fontWeight="800" color={subTextColor} letterSpacing="0.9px" textTransform="uppercase" mb="8px">
            Combo
          </Text>
          <Flex direction="column" gap="6px" mb="14px">
            {combos.map((c) => (
              <Flex key={c.id} justify="space-between" align="center">
                <Text fontSize="11.5px" color={subTextColor}>{c.name} <Text as="span" color={mutedColor}>×{c.qty}</Text></Text>
                <Text fontSize="11.5px" fontWeight="700" color={textColor}>{fmt(c.price * c.qty)}</Text>
              </Flex>
            ))}
          </Flex>
          <Box h="1px" bg={dividerBg} mb="14px" />
        </>
      )}

      <Flex direction="column" gap="6px" mb="14px">
        <Flex justify="space-between">
          <Text fontSize="12px" color={subTextColor}>Tiền vé ({seatCount} ghế)</Text>
          <Text fontSize="12px" fontWeight="600" color={textColor}>{fmt(seatTotal)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="12px" color={subTextColor}>Combo</Text>
          <Text fontSize="12px" fontWeight="600" color={textColor}>{fmt(comboTotal)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="12px" color={subTextColor}>VAT (8%)</Text>
          <Text fontSize="12px" fontWeight="600" color={textColor}>{fmt(vat)}</Text>
        </Flex>
      </Flex>

      <Box p="12px 14px" borderRadius="12px" bg="linear-gradient(135deg, #fff7ed, #ffedd5)" border="1.5px solid #fed7aa" mb="16px">
        <Flex justify="space-between" align="center">
          <Text fontSize="12px" fontWeight="800" color="#9a3412" letterSpacing="0.5px">TỔNG CỘNG</Text>
          <Text fontSize="20px" fontWeight="900" color="#ea580c" letterSpacing="-0.5px">{fmt(total)}</Text>
        </Flex>
      </Box>

      <Flex direction="column" gap="8px">
        <Button
          h="46px" borderRadius="12px" fontWeight="800" fontSize="14px"
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
          color="white" boxShadow="0 6px 20px rgba(249,115,22,0.4)"
          _hover={{ boxShadow: "0 8px 26px rgba(249,115,22,0.5)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdPayment} boxSize="16px" />}
          isDisabled={!movie || !showtime || seats.length === 0}
        >
          Thanh toán
        </Button>
        <Flex gap="8px">
          <Button flex="1" h="40px" borderRadius="10px" fontWeight="700" fontSize="12.5px"
            bg="transparent" color={subTextColor} border="1.5px solid" borderColor={borderColor}
            _hover={{ bg: subtleBg }}
            leftIcon={<Icon as={MdPrint} boxSize="14px" />}
          >
            In vé
          </Button>
          <Button flex="1" h="40px" borderRadius="10px" fontWeight="700" fontSize="12.5px"
            bg="transparent" color={subTextColor} border="1.5px solid" borderColor={borderColor}
            _hover={{ bg: subtleBg }}
            leftIcon={<Icon as={MdRefresh} boxSize="14px" />}
          >
            Làm mới
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function BanVe() {
  const [step, setStep] = useState(1);
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [combos, setCombos] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const { textColor, subTextColor, mutedColor, cardBg, borderColor, shadow, subtleBg, dividerBg } = useThemeColors();

  const toggleSeat = (seatId) => {
    setSeats((prev) => prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]);
  };

  const canNext = (s) => {
    if (s === 1) return !!movie;
    if (s === 2) return !!showtime;
    if (s === 3) return seats.length > 0;
    if (s === 4) return true;
    return false;
  };

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
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={MdConfirmationNumber} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color={textColor} letterSpacing="-0.5px">
              Bán vé tại quầy
            </Text>
          </Flex>
          <Text color={mutedColor} fontSize="13px" pl="48px">
            Tạo đơn hàng và in vé trực tiếp cho khách
          </Text>
        </Box>
        <Flex gap="8px" align="center" flexWrap="wrap">
          <Flex align="center" gap="6px" px="12px" py="7px" borderRadius="10px"
            bg="#ecfdf5" border="1px solid #6ee7b7"
          >
            <Box w="6px" h="6px" borderRadius="full" bg="#10b981"
              sx={{ animation: `${pulse} 1.8s ease infinite` }}
            />
            <Text fontSize="11.5px" fontWeight="700" color="#059669">Ca sáng 8:00 – 16:00</Text>
          </Flex>
          <Flex align="center" gap="6px" px="12px" py="7px" borderRadius="10px"
            bg={subtleBg} border="1px solid" borderColor={borderColor}
          >
            <Icon as={MdPerson} boxSize="13px" color={subTextColor} />
            <Text fontSize="11.5px" fontWeight="700" color={subTextColor}>NV: Nguyễn Văn A</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Stepper */}
      <Stepper currentStep={step} />

      {/* Main grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 380px" }} gap="16px">
        <Flex direction="column" gap="16px">
          {step === 1 && <MoviePicker selected={movie} onSelect={(m) => { setMovie(m); setShowtime(null); setSeats([]); }} />}
          {step === 2 && <ShowtimePicker movie={movie} selected={showtime} onSelect={setShowtime} />}
          {step === 3 && <SeatMap selectedSeats={seats} onToggleSeat={toggleSeat} />}
          {step === 4 && <ComboPicker combos={combos} onChange={setCombos} />}
          {step === 5 && <PaymentPanel method={paymentMethod} setMethod={setPaymentMethod} />}

          {/* Nav buttons */}
          <Flex justify="space-between" gap="10px"
            bg={cardBg} borderRadius="14px" border="1px solid" borderColor={borderColor}
            boxShadow={shadow} p="14px 16px"
          >
            <Button
              h="42px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg="transparent" color={subTextColor} border="1.5px solid" borderColor={borderColor}
              _hover={{ bg: subtleBg }}
              leftIcon={<Icon as={MdArrowBack} boxSize="14px" />}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              isDisabled={step === 1}
            >
              Quay lại
            </Button>
            <Flex gap="8px">
              <Button
                h="42px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg="transparent" color={mutedColor} border="1.5px solid" borderColor={borderColor}
                _hover={{ bg: subtleBg }}
                leftIcon={<Icon as={MdClose} boxSize="14px" />}
              >
                Hủy
              </Button>
              <Button
                h="42px" px="24px" borderRadius="10px" fontWeight="800" fontSize="13px"
                bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
                boxShadow="0 4px 14px rgba(249,115,22,0.35)"
                _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }} transition="all 0.2s"
                rightIcon={<Icon as={MdArrowForward} boxSize="14px" />}
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                isDisabled={step === 5 || !canNext(step)}
              >
                {step === 5 ? "Hoàn tất" : "Tiếp theo"}
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Box>
          <OrderSummary
            movie={movie}
            showtime={showtime}
            seats={seats}
            combos={combos}
            ticketPrice={showtime?.price}
          />
        </Box>
      </Grid>
    </Box>
  );
}