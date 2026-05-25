import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, Badge, SimpleGrid, Divider,
  FormControl, FormLabel, Input, Select, Textarea,
  useColorModeValue, Icon, keyframes,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack, MdMovie,
  MdAccessTime, MdCalendarToday, MdStar, MdClose, MdCheckCircle,
  MdLocalMovies, MdPerson, MdPublic, MdCategory, MdSearch,
  MdFilterList, MdPlayCircle, MdTimer, MdDone, MdThumbUp,
  MdPending, MdBlock, MdVisibilityOff, MdImageSearch,
} from "react-icons/md";
import { FaFilm, FaTicketAlt, FaClock, FaVideo, FaUsers } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Status configs ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Đang chiếu": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", icon: MdPlayCircle },
  "Sắp chiếu":  { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", icon: MdTimer },
  "Ngừng chiếu":{ color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af", icon: MdDone },
};

const AGE_CONFIG = {
  "P":   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "K":   { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  "T13": { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  "T16": { color: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
  "T18": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Ngừng chiếu"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đang chiếu" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="12px" fontWeight="600" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function AgeBadge({ age }) {
  const cfg = AGE_CONFIG[age] || AGE_CONFIG["P"];
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="800" color={cfg.color}>{age}</Text>
    </Box>
  );
}

// ─── Shared input style ─────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa",
  border: "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: { base: "48px", md: "44px" }, // taller on mobile for touch
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#ffffff" },
  _hover: { border: "1.5px solid #f97316", bg: "#ffffff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg, #f1f5f9, transparent)" />
    </Box>
  );
}

function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <Box p={{ base: "14px 16px", md: "18px 20px" }} borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">
            {label}
          </Text>
          <Text fontSize={{ base: "24px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
        </Box>
        <Box w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }} borderRadius="12px"
          bg={`${accent}15`} display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "15px", md: "18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Static movie data ───────────────────────────────────────────────────────
const MOVIES = [
  {
    id: 1,
    title: "Avengers: Infinity War",
    genre: "Hành động",
    genres: ["Hành động", "Khoa học viễn tưởng"],
    duration: 149,
    releaseDate: "20/04/2018",
    status: "Đang chiếu",
    ageRating: "T13",
    format: "2D / IMAX",
    director: "Anthony & Joe Russo",
    cast: "Robert Downey Jr, Chris Evans, Scarlett Johansson, Josh Brolin",
    country: "Mỹ",
    distributor: "Marvel Studios",
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
    trailer: "https://youtu.be/QwievZ1Tx-8",
    description: "Khi Thanos thu thập đủ 6 viên đá vô cực với ý định xóa sổ một nửa sinh vật trong vũ trụ, những anh hùng của Trái Đất phải đoàn kết lại để ngăn chặn hắn trong cuộc chiến sinh tử.",
    ticketsSold: 1240,
    rating: 4.8,
    reviewCount: 342,
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    genre: "Hành động",
    genres: ["Hành động", "Phiêu lưu"],
    duration: 148,
    releaseDate: "17/12/2021",
    status: "Đang chiếu",
    ageRating: "T13",
    format: "2D / 3D",
    director: "Jon Watts",
    cast: "Tom Holland, Zendaya, Benedict Cumberbatch, Willem Dafoe",
    country: "Mỹ",
    distributor: "Sony Pictures",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg",
    trailer: "https://youtu.be/rt-2cxAiPJk",
    description: "Peter Parker yêu cầu Doctor Strange xóa bỏ ký ức của mọi người về danh tính Spider-Man, dẫn đến hậu quả thảm khốc khi các phản diện từ đa vũ trụ tràn vào thế giới của anh.",
    ticketsSold: 2180,
    rating: 4.9,
    reviewCount: 589,
  },
  {
    id: 3,
    title: "Doctor Strange in the Multiverse of Madness",
    genre: "Khoa học viễn tưởng",
    genres: ["Khoa học viễn tưởng", "Kinh dị"],
    duration: 126,
    releaseDate: "06/05/2022",
    status: "Sắp chiếu",
    ageRating: "T16",
    format: "3D / IMAX",
    director: "Sam Raimi",
    cast: "Benedict Cumberbatch, Elizabeth Olsen, Rachel McAdams",
    country: "Mỹ",
    distributor: "Marvel Studios",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg",
    trailer: "https://youtu.be/aWzlQ2N6qqg",
    description: "Doctor Strange và America Chavez hành trình xuyên đa vũ trụ để tìm kiếm giải pháp, nhưng một mối đe dọa bí ẩn đang săn đuổi họ qua từng chiều không gian.",
    ticketsSold: 0,
    rating: 4.2,
    reviewCount: 0,
  },
  {
    id: 4,
    title: "Thor: Love and Thunder",
    genre: "Hành động",
    genres: ["Hành động", "Hài hước"],
    duration: 119,
    releaseDate: "08/07/2022",
    status: "Ngừng chiếu",
    ageRating: "T13",
    format: "2D",
    director: "Taika Waititi",
    cast: "Chris Hemsworth, Natalie Portman, Tessa Thompson, Christian Bale",
    country: "Mỹ",
    distributor: "Marvel Studios",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg",
    trailer: "https://youtu.be/tgB1wUcmbbw",
    description: "Thor lên đường tìm kiếm sự bình yên nội tâm, nhưng hành trình của anh bị gián đoạn bởi Gorr the God Butcher – kẻ đặt mục tiêu xóa sổ toàn bộ các vị thần.",
    ticketsSold: 876,
    rating: 3.9,
    reviewCount: 201,
  },
];

// ─── Pending reviews data ────────────────────────────────────────────────────
const PENDING_REVIEWS = [
  { id: 1, movieId: 1, user: "Nguyễn Văn A", rating: 5, comment: "Phim rất hay, mình rất thích cảnh chiến đấu cuối phim!", date: "2026-05-20", status: "Chờ duyệt" },
  { id: 2, movieId: 2, user: "Trần Thị B", rating: 4, comment: "Nội dung cuốn hút, diễn xuất tốt. Xứng đáng xem rạp.", date: "2026-05-21", status: "Chờ duyệt" },
  { id: 3, movieId: 1, user: "Lê Văn C", rating: 3, comment: "Phim tạm ổn nhưng hơi dài.", date: "2026-05-22", status: "Chờ duyệt" },
];

// ─── Movie Row Card — Desktop table row / Mobile card ───────────────────────
function MovieRow({ movie, index, onView, onEdit, onHide }) {
  return (
    <>
      {/* ── MOBILE CARD (hidden on md+) ── */}
      <Box
        display={{ base: "block", md: "none" }}
        p="14px"
        borderRadius="14px"
        bg="white"
        border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        {/* Top row: poster + info */}
        <Flex gap="12px" mb="12px">
          {/* Poster */}
          <Box w="64px" h="88px" borderRadius="10px" overflow="hidden" flexShrink="0">
            <img src={movie.poster} alt={movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>

          {/* Info */}
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="700" color="#0f172a" noOfLines={2} mb="6px" lineHeight="1.35">
              {movie.title}
            </Text>
            <Flex gap="6px" flexWrap="wrap" mb="6px">
              <StatusBadge status={movie.status} />
              <AgeBadge age={movie.ageRating} />
            </Flex>
            <Flex gap="10px" flexWrap="wrap">
              <Flex align="center" gap="4px">
                <Icon as={MdAccessTime} boxSize="11px" color="#94a3b8" />
                <Text fontSize="11.5px" fontWeight="600" color="#475569">{movie.duration} phút</Text>
              </Flex>
              <Flex align="center" gap="4px">
                <Icon as={MdStar} boxSize="12px" color="#f59e0b" />
                <Text fontSize="11.5px" fontWeight="700" color="#0f172a">{movie.rating}</Text>
                <Text fontSize="10px" color="#94a3b8">({movie.reviewCount})</Text>
              </Flex>
            </Flex>
            <Flex gap="5px" mt="5px" flexWrap="wrap">
              {movie.genres.map((g) => (
                <Box key={g} px="6px" py="2px" borderRadius="5px" bg="#f1f5f9">
                  <Text fontSize="10px" fontWeight="600" color="#64748b">{g}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* Action buttons — full width on mobile */}
        <Flex gap="8px">
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: "#f1f5f9" }} transition="all 0.15s"
            onClick={() => onView(movie)}
          >Xem</Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s"
            onClick={() => onEdit(movie)}
          >Sửa</Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibilityOff} boxSize="13px" />}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            transition="all 0.15s"
            onClick={() => onHide(movie)}
          >Ẩn</Button>
        </Flex>
      </Box>

      {/* ── DESKTOP TABLE ROW (hidden on base, shown md+) ── */}
      <Box
        display={{ base: "none", md: "block" }}
        p="14px 18px"
        borderRadius="12px"
        bg="white"
        border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center" gap="0">
          <Box w="32px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color="#cbd5e1">
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
          <Box w="44px" h="60px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px">
            <img src={movie.poster} alt={movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box flex="2.2" minW="0" pr="12px">
            <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{movie.title}</Text>
            <Flex gap="6px" mt="4px" flexWrap="wrap">
              {movie.genres.map((g) => (
                <Box key={g} px="7px" py="2px" borderRadius="5px" bg="#f1f5f9">
                  <Text fontSize="10px" fontWeight="600" color="#64748b">{g}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
          <Box flex="0.8" minW="0" pr="12px">
            <Flex align="center" gap="5px">
              <Icon as={MdAccessTime} boxSize="11px" color="#94a3b8" />
              <Text fontSize="12px" fontWeight="600" color="#475569">{movie.duration} phút</Text>
            </Flex>
            <Flex align="center" gap="5px" mt="3px">
              <Icon as={MdCalendarToday} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#94a3b8">{movie.releaseDate}</Text>
            </Flex>
          </Box>
          <Box flex="0.5" minW="0" pr="12px">
            <AgeBadge age={movie.ageRating} />
          </Box>
          <Box flex="1" minW="0" pr="12px">
            <StatusBadge status={movie.status} />
          </Box>
          <Box flex="0.7" minW="0" pr="12px">
            <Flex align="center" gap="4px">
              <Icon as={MdStar} boxSize="13px" color="#f59e0b" />
              <Text fontSize="12.5px" fontWeight="700" color="#0f172a">{movie.rating}</Text>
            </Flex>
            <Text fontSize="10px" color="#94a3b8">{movie.reviewCount} đánh giá</Text>
          </Box>
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
              onClick={() => onView(movie)}
            >Xem</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(movie)}
            >Sửa</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibilityOff} boxSize="12px" />}
              _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
              transition="all 0.15s"
              onClick={() => onHide(movie)}
            >Ẩn</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

// ─── Add/Edit Form ───────────────────────────────────────────────────────────
function MovieForm({ movie, onCancel, onSave, isAdd = false }) {
  const [form, setForm] = useState(movie || {
    title: "", genre: "Hành động", genres: [], duration: "", releaseDate: "",
    status: "Sắp chiếu", ageRating: "P", format: "2D", director: "",
    cast: "", country: "", distributor: "", poster: "", trailer: "", description: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} gap="12px" mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} flexShrink="0"
          onClick={onCancel}
        >
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.4px">
            {isAdd ? "Thêm phim mới" : `Chỉnh sửa: ${movie?.title}`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">
            {isAdd ? "Điền đầy đủ thông tin để thêm phim vào hệ thống" : "Cập nhật thông tin phim"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gap="16px">
        {/* Left — form fields */}
        <Flex direction="column" gap="0">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Tên phim *</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Avengers: Endgame"
                    value={form.title} onChange={(e) => set("title", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            {/* Responsive 2-col on sm+, 1-col on mobile */}
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Thể loại chính *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.genre}
                    onChange={(e) => set("genre", e.target.value)}>
                    <option>Hành động</option>
                    <option>Kinh dị</option>
                    <option>Tình cảm</option>
                    <option>Hoạt hình</option>
                    <option>Khoa học viễn tưởng</option>
                    <option>Phiêu lưu</option>
                    <option>Hài hước</option>
                    <option>Tâm lý</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Phân loại tuổi *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.ageRating}
                    onChange={(e) => set("ageRating", e.target.value)}>
                    <option value="P">P – Mọi lứa tuổi</option>
                    <option value="K">K – Dưới 13 tuổi (có phụ huynh)</option>
                    <option value="T13">T13 – Từ 13 tuổi trở lên</option>
                    <option value="T16">T16 – Từ 16 tuổi trở lên</option>
                    <option value="T18">T18 – Từ 18 tuổi trở lên</option>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            {/* 3-col on md+, 1-col on mobile */}
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Thời lượng (phút) *</Text>
                <FormControl>
                  <Input {...inputStyle} type="number" placeholder="VD: 120"
                    value={form.duration} onChange={(e) => set("duration", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày khởi chiếu *</Text>
                <FormControl>
                  <Input {...inputStyle} type="date" value={form.releaseDate}
                    onChange={(e) => set("releaseDate", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Định dạng</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.format}
                    onChange={(e) => set("format", e.target.value)}>
                    <option>2D</option>
                    <option>3D</option>
                    <option>2D / 3D</option>
                    <option>IMAX</option>
                    <option>2D / IMAX</option>
                    <option>3D / IMAX</option>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Box>

          {/* Cast & crew */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
          >
            <SectionTitle label="Đội ngũ & Sản xuất" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Đạo diễn</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Christopher Nolan"
                    value={form.director} onChange={(e) => set("director", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Quốc gia sản xuất</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Mỹ"
                    value={form.country} onChange={(e) => set("country", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Diễn viên chính</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Tom Hanks, Cate Blanchett (phân cách bằng dấu phẩy)"
                  value={form.cast} onChange={(e) => set("cast", e.target.value)} />
              </FormControl>
            </Box>
            <Box>
              <Text sx={labelStyle}>Nhà phát hành</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Marvel Studios"
                  value={form.distributor} onChange={(e) => set("distributor", e.target.value)} />
              </FormControl>
            </Box>
          </Box>

          {/* Status & description */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Trạng thái & Nội dung" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Trạng thái *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.status}
                    onChange={(e) => set("status", e.target.value)}>
                    <option>Đang chiếu</option>
                    <option>Sắp chiếu</option>
                    <option>Ngừng chiếu</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Link trailer (YouTube)</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="https://youtu.be/..."
                    value={form.trailer} onChange={(e) => set("trailer", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box>
              <Text sx={labelStyle}>Mô tả / Nội dung phim</Text>
              <FormControl>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s"
                  rows={4} placeholder="Nhập mô tả nội dung phim..."
                  value={form.description} onChange={(e) => set("description", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* Right — poster + quick info */}
        <Flex direction="column" gap="14px">
          {/* Poster */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Poster phim" />
            <Box>
              <Text sx={labelStyle} mb="7px">URL poster (dọc)</Text>
              <FormControl mb="12px">
                <Input {...inputStyle} placeholder="https://..."
                  value={form.poster} onChange={(e) => set("poster", e.target.value)} />
              </FormControl>
              {form.poster ? (
                <Box borderRadius="10px" overflow="hidden" border="1px solid #f1f5f9">
                  <img src={form.poster} alt="poster preview"
                    style={{ width: "100%", display: "block", maxHeight: "300px", objectFit: "cover" }} />
                </Box>
              ) : (
                <Flex direction="column" align="center" justify="center"
                  h="160px" borderRadius="10px" bg="#f8fafc" border="2px dashed #e2e8f0"
                >
                  <Icon as={MdImageSearch} boxSize="28px" color="#cbd5e1" mb="6px" />
                  <Text fontSize="12px" color="#94a3b8">Nhập URL để xem trước poster</Text>
                </Flex>
              )}
              <Button w="100%" h="38px" mt="12px" borderRadius="9px"
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                _hover={{ bg: "#f1f5f9" }} transition="all 0.2s"
                leftIcon={<Icon as={MdImageSearch} boxSize="13px" />}
              >
                Tải lên từ máy tính
              </Button>
            </Box>
          </Box>

          {/* Quick preview */}
          {(form.title || form.status) && (
            <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" />
              <Flex direction="column" gap="10px">
                {form.title && (
                  <Box>
                    <Text fontSize="10px" color="#94a3b8" fontWeight="700" letterSpacing="0.8px" textTransform="uppercase" mb="3px">Tên phim</Text>
                    <Text fontSize="14px" fontWeight="700" color="#0f172a">{form.title}</Text>
                  </Box>
                )}
                <Flex gap="8px" flexWrap="wrap">
                  {form.status && <StatusBadge status={form.status} />}
                  {form.ageRating && <AgeBadge age={form.ageRating} />}
                </Flex>
                {form.duration && (
                  <Flex align="center" gap="6px">
                    <Icon as={MdAccessTime} boxSize="12px" color="#94a3b8" />
                    <Text fontSize="12px" color="#475569" fontWeight="600">{form.duration} phút</Text>
                  </Flex>
                )}
                {form.genre && (
                  <Flex align="center" gap="6px">
                    <Icon as={MdCategory} boxSize="12px" color="#94a3b8" />
                    <Text fontSize="12px" color="#475569" fontWeight="600">{form.genre}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Save bar — sticky on mobile */}
      <Box
        bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }}
        bottom={{ base: "0", md: "auto" }}
        zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px"
          direction={{ base: "row", md: "row" }}
        >
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Thêm phim" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────
function MovieDetail({ movie, onBack, onEdit, pendingReviews, onApproveReview, onRejectReview }) {
  const movieReviews = pendingReviews.filter((r) => r.movieId === movie.id);

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Back + actions */}
      <Flex align="center" justify="space-between" mb="16px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          onClick={onBack}
        >
          <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
        </Button>
        <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdEdit} />}
          onClick={onEdit}
        >
          Chỉnh sửa
        </Button>
      </Flex>

      {/* Hero card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        {/* Poster + Info — column on mobile, row on md+ */}
        <Flex direction={{ base: "column", md: "row" }}>
          {/* Poster */}
          <Box
            w={{ base: "100%", md: "220px" }}
            h={{ base: "220px", md: "auto" }}
            flexShrink="0"
            bg="#0f172a"
            overflow="hidden"
          >
            <img src={movie.poster} alt={movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </Box>

          {/* Info */}
          <Box p={{ base: "18px", md: "26px" }} flex="1">
            <Flex justify="space-between" align="flex-start" mb="12px" gap="8px">
              <Box flex="1" minW="0">
                <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800" color="#0f172a"
                  letterSpacing="-0.4px" mb="8px" lineHeight="1.2">
                  {movie.title}
                </Text>
                <Flex gap="8px" flexWrap="wrap">
                  <StatusBadge status={movie.status} />
                  <AgeBadge age={movie.ageRating} />
                  {movie.genres.map((g) => (
                    <Box key={g} px="8px" py="4px" borderRadius="6px" bg="#f1f5f9">
                      <Text fontSize="11px" fontWeight="600" color="#64748b">{g}</Text>
                    </Box>
                  ))}
                </Flex>
              </Box>
              {/* Rating — shown inline on mobile */}
              <Box textAlign="right" flexShrink="0">
                <Flex align="center" gap="4px" justify="flex-end">
                  <Icon as={MdStar} boxSize={{ base: "16px", md: "18px" }} color="#f59e0b" />
                  <Text fontSize={{ base: "20px", md: "22px" }} fontWeight="800" color="#0f172a">{movie.rating}</Text>
                </Flex>
                <Text fontSize="10px" color="#94a3b8">{movie.reviewCount} đánh giá</Text>
              </Box>
            </Flex>

            <Box h="1px" bg="#f1f5f9" mb="14px" />

            {/* Quick stats — 2×2 grid on mobile, 4-col on md */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
              {[
                { icon: MdAccessTime,    label: "Thời lượng",  val: `${movie.duration} phút` },
                { icon: MdCalendarToday, label: "Khởi chiếu",  val: movie.releaseDate },
                { icon: FaVideo,         label: "Định dạng",    val: movie.format },
                { icon: FaTicketAlt,     label: "Vé đã bán",    val: movie.ticketsSold.toLocaleString() },
              ].map(({ icon: Ic, label, val }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9px" fontWeight="700" color="#94a3b8"
                      letterSpacing="0.7px" textTransform="uppercase" noOfLines={1}>
                      {label}
                    </Text>
                  </Flex>
                  <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color="#0f172a">{val}</Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* Description */}
            <Box p="12px 14px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
              <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px"
                textTransform="uppercase" mb="6px">
                Nội dung phim
              </Text>
              <Text fontSize={{ base: "12.5px", md: "13px" }} color="#475569" lineHeight="1.7">
                {movie.description}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Crew info — 1-col on mobile, 3-col on md */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="12px" mb="16px">
        {[
          { icon: MdPerson, label: "Đạo diễn",       val: movie.director },
          { icon: FaUsers,  label: "Diễn viên chính", val: movie.cast },
          { icon: MdPublic, label: "Quốc gia / NXB",  val: `${movie.country} • ${movie.distributor}` },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} bg="white" borderRadius="14px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="14px"
            sx={{ animation: `${fadeUp} 0.4s ease both` }}
          >
            <Flex align="center" gap="8px" mb="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg="#fff7ed"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={Ic} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px" textTransform="uppercase">
                {label}
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="600" color="#0f172a" lineHeight="1.5">{val}</Text>
          </Box>
        ))}
      </Grid>

      {/* Pending reviews */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Flex align="center" justify="space-between" mb="14px">
          <Flex align="center" gap="8px">
            <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
            <Text fontSize="13px" fontWeight="800" color="#0f172a">Đánh giá chờ duyệt</Text>
          </Flex>
          {movieReviews.length > 0 && (
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="11px" fontWeight="700" color="#f97316">{movieReviews.length} chờ duyệt</Text>
            </Box>
          )}
        </Flex>
        <Box h="1px" bg="#f1f5f9" mb="14px" />

        {movieReviews.length === 0 ? (
          <Flex direction="column" align="center" py="24px" color="#cbd5e1">
            <Icon as={MdThumbUp} boxSize="24px" mb="6px" />
            <Text fontSize="12px" color="#94a3b8">Không có đánh giá nào chờ duyệt</Text>
          </Flex>
        ) : (
          <Flex direction="column" gap="10px">
            {movieReviews.map((review) => (
              <Box key={review.id} p="12px 14px" borderRadius="10px"
                bg="#f8fafc" border="1px solid #f1f5f9"
              >
                {/* On mobile: stack vertically */}
                <Flex direction={{ base: "column", sm: "row" }}
                  justify="space-between" align={{ base: "flex-start", sm: "flex-start" }} gap="10px"
                >
                  <Box flex="1">
                    <Flex align="center" gap="8px" mb="4px" flexWrap="wrap">
                      <Text fontSize="13px" fontWeight="700" color="#0f172a">{review.user}</Text>
                      <Flex align="center" gap="2px">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} as={MdStar} boxSize="11px"
                            color={i < review.rating ? "#f59e0b" : "#e2e8f0"} />
                        ))}
                      </Flex>
                      <Text fontSize="10px" color="#94a3b8">{review.date}</Text>
                    </Flex>
                    <Text fontSize="12.5px" color="#475569">{review.comment}</Text>
                  </Box>
                  {/* Action buttons */}
                  <Flex gap="7px" flexShrink="0" w={{ base: "100%", sm: "auto" }}>
                    <Button flex={{ base: "1", sm: "none" }}
                      size="xs" h={{ base: "34px", sm: "28px" }} px="10px" borderRadius="7px"
                      bg="#ecfdf5" color="#059669" border="1px solid #6ee7b7"
                      fontSize="11px" fontWeight="700"
                      leftIcon={<Icon as={MdCheckCircle} boxSize="11px" />}
                      _hover={{ bg: "#d1fae5" }} transition="all 0.15s"
                      onClick={() => onApproveReview(review.id)}
                    >Duyệt</Button>
                    <Button flex={{ base: "1", sm: "none" }}
                      size="xs" h={{ base: "34px", sm: "28px" }} px="10px" borderRadius="7px"
                      bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                      fontSize="11px" fontWeight="700"
                      leftIcon={<Icon as={MdBlock} boxSize="11px" />}
                      _hover={{ bg: "#fee2e2" }} transition="all 0.15s"
                      onClick={() => onRejectReview(review.id)}
                    >Từ chối</Button>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Quanlyphim() {
  const [view, setView] = useState("list");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState(MOVIES);
  const [reviews, setReviews] = useState(PENDING_REVIEWS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                        m.genre.toLowerCase().includes(search.toLowerCase()) ||
                        m.director.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: movies.length,
    playing:  movies.filter((m) => m.status === "Đang chiếu").length,
    upcoming: movies.filter((m) => m.status === "Sắp chiếu").length,
    ended:    movies.filter((m) => m.status === "Ngừng chiếu").length,
  };

  const pendingReviewCount = reviews.length;

  const handleHide = (movie) => {
    setMovies((prev) => prev.map((m) =>
      m.id === movie.id ? { ...m, status: "Ngừng chiếu" } : m
    ));
  };
  const handleSave = (form) => {
    if (view === "add") {
      setMovies((prev) => [...prev, { ...form, id: Date.now(), ticketsSold: 0, rating: 0, reviewCount: 0, genres: [form.genre] }]);
    } else {
      setMovies((prev) => prev.map((m) => m.id === selectedMovie.id ? { ...m, ...form } : m));
      setSelectedMovie((prev) => ({ ...prev, ...form }));
    }
    setView("list");
  };
  const handleApproveReview = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));
  const handleRejectReview  = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }} px={{ base: "0", md: "0" }}>
        {/* Page header */}
        <Flex justify="space-between" align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
        >
          <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="10px" mb="4px">
              <Box w="38px" h="38px" borderRadius="11px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 4px 12px rgba(249,115,22,0.35)"
              >
                <Icon as={FaFilm} boxSize="16px" color="white" />
              </Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
                Quản lý phim
              </Text>
            </Flex>
            <Text color="#94a3b8" fontSize="13px" pl="48px">
              Quản lý danh sách phim và trạng thái chiếu
            </Text>
          </Box>
          <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
            w={{ base: "100%", md: "auto" }}
          >
            {pendingReviewCount > 0 && (
              <Box position="relative" flex={{ base: "1", md: "none" }}>
                <Button w={{ base: "100%", md: "auto" }}
                  h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
                  bg="#fffbeb" color="#b45309" border="1px solid #fcd34d"
                  _hover={{ bg: "#fef3c7" }} transition="all 0.2s"
                  leftIcon={<Icon as={MdThumbUp} />}
                >
                  Chờ duyệt
                </Button>
                <Box position="absolute" top="-6px" right="-6px" w="18px" h="18px"
                  borderRadius="full" bg="#ef4444"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="10px" fontWeight="800" color="white">{pendingReviewCount}</Text>
                </Box>
              </Box>
            )}
            <Button flex={{ base: "2", md: "none" }}
              h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdAdd} />}
              onClick={() => setView("add")}
            >
              Thêm phim
            </Button>
          </Flex>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
          <StatCard label="Tổng phim"    value={counts.total}    icon={FaFilm}       accent="#f97316" delay={0}    />
          <StatCard label="Đang chiếu"   value={counts.playing}  icon={MdPlayCircle} accent="#10b981" delay={0.05} />
          <StatCard label="Sắp chiếu"    value={counts.upcoming} icon={MdTimer}      accent="#f59e0b" delay={0.1}  />
          <StatCard label="Ngừng chiếu"  value={counts.ended}    icon={MdDone}       accent="#94a3b8" delay={0.15} />
        </SimpleGrid>

        {/* Table card */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          {/* Card Header */}
          <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom="1px solid #f8fafc">
            {/* Title row */}
            <Flex align="center" justify="space-between" mb="12px">
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                  Danh sách phim
                </Text>
                <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} phim</Text>
                </Box>
              </Flex>
              {/* Mobile: filter toggle button */}
              <Button
                display={{ base: "flex", md: "none" }}
                size="sm" h="34px" px="12px" borderRadius="9px"
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
                _hover={{ bg: "#f1f5f9" }}
                onClick={() => setShowFilter((v) => !v)}
              >
                Lọc
              </Button>
            </Flex>

            {/* Search + filter — always visible on md, toggle on mobile */}
            <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
              <Flex gap="10px" align="center"
                direction={{ base: "column", sm: "row" }}
              >
                <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                  <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                    transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1"
                  />
                  <Input
                    pl="30px" h={{ base: "40px", md: "34px" }} w="100%" fontSize="12.5px" fontWeight="500"
                    placeholder="Tìm tên phim, đạo diễn..."
                    bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                    _placeholder={{ color: "#b0bac8" }}
                    _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                    _hover={{ border: "1px solid #f97316" }}
                    transition="all 0.2s"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Select
                  h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "160px", md: "140px" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang chiếu">Đang chiếu</option>
                  <option value="Sắp chiếu">Sắp chiếu</option>
                  <option value="Ngừng chiếu">Ngừng chiếu</option>
                </Select>
              </Flex>
            </Box>
          </Box>

          {/* Desktop column headers — hidden on mobile */}
          <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
            display={{ base: "none", md: "flex" }}
          >
            <Box w="32px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color="#cbd5e1" letterSpacing="1px">#</Text>
            </Box>
            <Box w="44px" mr="14px" flexShrink="0" />
            <Box flex="2.2">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Tên phim / Thể loại
              </Text>
            </Box>
            <Box flex="0.8">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Thời lượng
              </Text>
            </Box>
            <Box flex="0.5">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Tuổi
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Trạng thái
              </Text>
            </Box>
            <Box flex="0.7">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Đánh giá
              </Text>
            </Box>
            <Box w="180px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>

          {/* Rows */}
          <Box p={{ base: "10px", md: "10px" }}>
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="40px" color="#cbd5e1">
                <Icon as={MdMovie} boxSize="32px" mb="8px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy phim nào</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="8px">
                {filtered.map((m, i) => (
                  <MovieRow
                    key={m.id} movie={m} index={i}
                    onView={(mv) => { setSelectedMovie(mv); setView("detail"); }}
                    onEdit={(mv) => { setSelectedMovie(mv); setView("edit"); }}
                    onHide={handleHide}
                  />
                ))}
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  if (view === "detail" && selectedMovie) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <MovieDetail
          movie={movies.find((m) => m.id === selectedMovie.id) || selectedMovie}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          pendingReviews={reviews}
          onApproveReview={handleApproveReview}
          onRejectReview={handleRejectReview}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <MovieForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  if (view === "edit" && selectedMovie) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <MovieForm
          movie={movies.find((m) => m.id === selectedMovie.id) || selectedMovie}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}