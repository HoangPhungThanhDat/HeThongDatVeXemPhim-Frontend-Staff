import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  FormControl, Input, Select, Textarea, Icon, keyframes,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack, MdSearch,
  MdFilterList, MdClose, MdCheckCircle, MdPerson,
  MdPublic, MdStar, MdImageSearch, MdMovie, MdTheaters,
  MdCameraRoll, MdDirections,
} from "react-icons/md";
import {
  FaFilm, FaUsers, FaVideo, FaUserTie, FaMask,
  FaGlobe, FaTheaterMasks,
} from "react-icons/fa";

// ─── Keyframes ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.04); opacity: 0.85; }
`;

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  "Diễn viên": {
    color: "#c2410c", bg: "#fff7ed", border: "#fdba74",
    dot: "#f97316", icon: FaMask,
  },
  "Đạo diễn": {
    color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd",
    dot: "#3b82f6", icon: FaVideo,
  },
  "Diễn viên / Đạo diễn": {
    color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd",
    dot: "#8b5cf6", icon: FaTheaterMasks,
  },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOVIES_LIST = [
  "Avengers: Infinity War",
  "Spider-Man: No Way Home",
  "Doctor Strange in the Multiverse of Madness",
  "Thor: Love and Thunder",
  "Black Panther",
  "Iron Man 3",
  "Captain America: Civil War",
];

const ARTISTS = [
  {
    id: 1,
    name: "Robert Downey Jr.",
    role: "Diễn viên",
    nationality: "Mỹ",
    birthDate: "04/04/1965",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",
    bio: "Robert John Downey Jr. là diễn viên và nhà sản xuất phim người Mỹ. Ông được biết đến nhiều nhất với vai diễn Tony Stark / Iron Man trong Vũ trụ Điện ảnh Marvel (MCU), một vai diễn đã đưa ông trở thành một trong những ngôi sao điện ảnh được trả thù lao cao nhất thế giới.",
    movies: ["Avengers: Infinity War", "Iron Man 3", "Captain America: Civil War"],
    awards: "Quả cầu vàng, SAG Award",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Scarlett Johansson",
    role: "Diễn viên",
    nationality: "Mỹ",
    birthDate: "22/11/1984",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scarlett_Johansson_2010.jpg/440px-Scarlett_Johansson_2010.jpg",
    bio: "Scarlett Ingrid Johansson là diễn viên và ca sĩ người Mỹ. Cô được biết đến nhiều nhất qua vai Black Widow trong loạt phim Marvel. Johansson là một trong những diễn viên điện ảnh được trả thù lao cao nhất thế giới, với doanh thu phòng vé toàn cầu vượt 14,3 tỷ USD.",
    movies: ["Avengers: Infinity War", "Black Panther"],
    awards: "BAFTA, Tony Award",
    status: "Đang hoạt động",
  },
  {
    id: 3,
    name: "Anthony & Joe Russo",
    role: "Đạo diễn",
    nationality: "Mỹ",
    birthDate: "03/02/1970",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Russo_Brothers_at_the_2019_San_Diego_Comic-Con_%28cropped%29.jpg/440px-Russo_Brothers_at_the_2019_San_Diego_Comic-Con_%28cropped%29.jpg",
    bio: "Anthony và Joe Russo là cặp anh em đạo diễn người Mỹ nổi tiếng với loạt phim Marvel. Họ đã đạo diễn các bộ phim bom tấn như Captain America: The Winter Soldier, Captain America: Civil War, Avengers: Infinity War và Avengers: Endgame.",
    movies: ["Avengers: Infinity War", "Captain America: Civil War"],
    awards: "Critics' Choice Award",
    status: "Đang hoạt động",
  },
  {
    id: 4,
    name: "Tom Holland",
    role: "Diễn viên",
    nationality: "Anh",
    birthDate: "01/06/1996",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/440px-Tom_Holland_by_Gage_Skidmore.jpg",
    bio: "Thomas Stanley Holland là diễn viên người Anh, được biết đến nhiều nhất qua vai Peter Parker / Spider-Man trong Vũ trụ Điện ảnh Marvel. Anh bắt đầu sự nghiệp diễn xuất từ năm 9 tuổi trên sân khấu West End London.",
    movies: ["Spider-Man: No Way Home", "Avengers: Infinity War"],
    awards: "BAFTA Rising Star",
    status: "Đang hoạt động",
  },
  {
    id: 5,
    name: "Sam Raimi",
    role: "Đạo diễn",
    nationality: "Mỹ",
    birthDate: "23/10/1959",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sam_Raimi_%28Berlin_Film_Festival_2009%29.jpg/440px-Sam_Raimi_%28Berlin_Film_Festival_2009%29.jpg",
    bio: "Samuel Marshall Raimi là đạo diễn, nhà sản xuất và biên kịch người Mỹ. Ông nổi tiếng với loạt phim Spider-Man (2002-2007) và gần đây là Doctor Strange in the Multiverse of Madness (2022).",
    movies: ["Doctor Strange in the Multiverse of Madness"],
    awards: "Saturn Award",
    status: "Đang hoạt động",
  },
  {
    id: 6,
    name: "Zendaya",
    role: "Diễn viên",
    nationality: "Mỹ",
    birthDate: "01/09/1996",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Zendaya_2019_by_Glenn_Francis.jpg/440px-Zendaya_2019_by_Glenn_Francis.jpg",
    bio: "Zendaya Maree Stoermer Coleman là diễn viên và ca sĩ người Mỹ. Cô được biết đến qua nhiều vai diễn trong các bộ phim và chương trình truyền hình, đặc biệt là vai MJ trong Spider-Man và Rue Bennett trong Euphoria.",
    movies: ["Spider-Man: No Way Home"],
    awards: "Emmy Award (2022)",
    status: "Đang hoạt động",
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa",
  border: "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: { base: "48px", md: "44px" },
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" },
  _hover: { border: "1.5px solid #f97316", bg: "#fff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG["Diễn viên"];
  const Ic = cfg.icon;
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Icon as={Ic} boxSize="10px" color={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{role}</Text>
    </Flex>
  );
}

function StatusDot({ status }) {
  const active = status === "Đang hoạt động";
  return (
    <Flex align="center" gap="5px">
      <Box w="6px" h="6px" borderRadius="full"
        bg={active ? "#10b981" : "#94a3b8"}
        sx={active ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11px" fontWeight="600" color={active ? "#059669" : "#6b7280"}>{status}</Text>
    </Flex>
  );
}

function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full"
          bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151"
          letterSpacing="1.2px" textTransform="uppercase">{label}</Text>
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
      _hover={{ boxShadow: "0 6px 18px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base: "24px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
        </Box>
        <Box w={{ base: "38px", md: "44px" }} h={{ base: "38px", md: "44px" }} borderRadius="13px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "19px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Artist Card (Grid view) ──────────────────────────────────────────────────
function ArtistCard({ artist, index, onView, onEdit }) {
  return (
    <Box
      borderRadius="16px" bg="white" overflow="hidden"
      border="1.5px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)"
      transition="all 0.25s"
      _hover={{
        border: "1.5px solid #f97316",
        boxShadow: "0 8px 28px rgba(249,115,22,0.13)",
        transform: "translateY(-3px)",
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
    >
      {/* Top accent bar */}
      <Box h="3px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
        bgSize="200% 100%" sx={{ animation: `${shimmer} 4s linear infinite` }} />

      {/* Photo */}
      <Box position="relative" h="180px" bg="#f8fafc" overflow="hidden">
        {artist.photo ? (
          <img src={artist.photo} alt={artist.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        ) : (
          <Flex align="center" justify="center" h="100%" direction="column" gap="8px">
            <Box w="56px" h="56px" borderRadius="full" bg="#f1f5f9"
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={MdPerson} boxSize="28px" color="#cbd5e1" />
            </Box>
            <Text fontSize="11px" color="#cbd5e1">Chưa có ảnh</Text>
          </Flex>
        )}
        {/* Gradient overlay */}
        <Box position="absolute" bottom="0" left="0" right="0" h="60px"
          bg="linear-gradient(to top, rgba(255,255,255,0.95), transparent)" />
      </Box>

      {/* Info */}
      <Box p="14px 16px 16px">
        <Text fontSize="14.5px" fontWeight="800" color="#0f172a" noOfLines={1} mb="6px">
          {artist.name}
        </Text>
        <Flex gap="6px" flexWrap="wrap" mb="10px">
          <RoleBadge role={artist.role} />
          <Flex align="center" gap="4px" px="8px" py="4px" borderRadius="7px"
            bg="#f8fafc" border="1px solid #f1f5f9"
          >
            <Icon as={FaGlobe} boxSize="9px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="600" color="#64748b">{artist.nationality}</Text>
          </Flex>
        </Flex>

        {/* Movie count */}
        <Flex align="center" gap="6px" mb="10px">
          <Icon as={FaFilm} boxSize="11px" color="#f97316" />
          <Text fontSize="12px" fontWeight="600" color="#475569">
            {artist.movies.length} phim tham gia
          </Text>
        </Flex>

        <StatusDot status={artist.status} />

        {/* Divider */}
        <Box h="1px" bg="#f1f5f9" my="12px" />

        {/* Actions */}
        <Flex gap="8px">
          <Button flex="1" h="34px" borderRadius="9px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={() => onView(artist)}
          >Xem</Button>
          <Button flex="1" h="34px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
            onClick={() => onEdit(artist)}
          >Sửa</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Artist Row (Table/List view) ─────────────────────────────────────────────
function ArtistRow({ artist, index, onView, onEdit }) {
  return (
    <Box
      p={{ base: "14px", md: "12px 18px" }}
      borderRadius="12px" bg="white"
      border="1.5px solid #f1f5f9"
      transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
    >
      <Flex align="center" gap="0">
        {/* Index */}
        <Box w="32px" flexShrink="0" display={{ base: "none", md: "block" }}>
          <Text fontSize="12px" fontWeight="700" color="#cbd5e1">
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>

        {/* Avatar */}
        <Box w={{ base: "48px", md: "52px" }} h={{ base: "48px", md: "52px" }}
          borderRadius="12px" overflow="hidden" flexShrink="0" mr="14px"
          bg="#f1f5f9"
        >
          {artist.photo ? (
            <img src={artist.photo} alt={artist.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          ) : (
            <Flex align="center" justify="center" h="100%">
              <Icon as={MdPerson} boxSize="22px" color="#cbd5e1" />
            </Flex>
          )}
        </Box>

        {/* Name + roles */}
        <Box flex="2" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{artist.name}</Text>
          <Flex gap="6px" mt="4px" flexWrap="wrap">
            <RoleBadge role={artist.role} />
          </Flex>
        </Box>

        {/* Nationality — hidden on mobile */}
        <Box flex="0.8" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
          <Flex align="center" gap="5px">
            <Icon as={FaGlobe} boxSize="11px" color="#94a3b8" />
            <Text fontSize="12px" fontWeight="600" color="#475569">{artist.nationality}</Text>
          </Flex>
        </Box>

        {/* Movies */}
        <Box flex="1" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
          <Flex align="center" gap="4px">
            <Icon as={FaFilm} boxSize="11px" color="#f97316" />
            <Text fontSize="12px" fontWeight="600" color="#475569">{artist.movies.length} phim</Text>
          </Flex>
          <Text fontSize="10.5px" color="#94a3b8" noOfLines={1} mt="2px">
            {artist.movies.slice(0, 2).join(", ")}{artist.movies.length > 2 ? "..." : ""}
          </Text>
        </Box>

        {/* Status */}
        <Box flex="0.7" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
          <StatusDot status={artist.status} />
        </Box>

        {/* Actions */}
        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={() => onView(artist)}
          >Xem</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
            onClick={() => onEdit(artist)}
          >Sửa</Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Form (Add / Edit) ────────────────────────────────────────────────────────
function ArtistForm({ artist, onCancel, onSave, isAdd = false }) {
  const [form, setForm] = useState(artist || {
    name: "", role: "Diễn viên", nationality: "", birthDate: "",
    photo: "", bio: "", awards: "", movies: [], status: "Đang hoạt động",
  });
  const [movieInput, setMovieInput] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addMovie = (m) => {
    if (m && !form.movies.includes(m)) set("movies", [...form.movies, m]);
    setMovieInput("");
  };
  const removeMovie = (m) => set("movies", form.movies.filter(x => x !== m));

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
        >Quay lại</Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color="#0f172a"
            letterSpacing="-0.4px">
            {isAdd ? "Thêm nghệ sĩ mới" : `Chỉnh sửa: ${artist?.name}`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">
            {isAdd ? "Điền đầy đủ hồ sơ nghệ sĩ vào hệ thống" : "Cập nhật thông tin hồ sơ nghệ sĩ"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        {/* ── Left ── */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Họ tên nghệ sĩ *</Text>
                <Input {...inputStyle} placeholder="VD: Tom Hanks"
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Vai trò *</Text>
                <Select {...inputStyle} value={form.role} onChange={e => set("role", e.target.value)}>
                  <option>Diễn viên</option>
                  <option>Đạo diễn</option>
                  <option>Diễn viên / Đạo diễn</option>
                </Select>
              </Box>
              <Box>
                <Text sx={labelStyle}>Quốc tịch</Text>
                <Input {...inputStyle} placeholder="VD: Mỹ, Anh, Hàn Quốc..."
                  value={form.nationality} onChange={e => set("nationality", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Ngày sinh</Text>
                <Input {...inputStyle} type="date" value={form.birthDate}
                  onChange={e => set("birthDate", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Trạng thái</Text>
                <Select {...inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                  <option>Đang hoạt động</option>
                  <option>Không còn hoạt động</option>
                </Select>
              </Box>
            </Grid>
          </Box>

          {/* Bio & Awards */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Tiểu sử & Giải thưởng" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tiểu sử</Text>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={4}
                placeholder="Nhập tiểu sử, sự nghiệp, thông tin nổi bật..."
                value={form.bio} onChange={e => set("bio", e.target.value)}
              />
            </Box>
            <Box>
              <Text sx={labelStyle}>Giải thưởng nổi bật</Text>
              <Input {...inputStyle} placeholder="VD: Oscar, Golden Globe, BAFTA..."
                value={form.awards} onChange={e => set("awards", e.target.value)} />
            </Box>
          </Box>

          {/* Linked movies */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Phim tham gia" />
            {/* Add movie */}
            <Flex gap="8px" mb="12px">
              <Select {...inputStyle} flex="1" h="40px"
                value={movieInput} onChange={e => setMovieInput(e.target.value)}
                placeholder="-- Chọn phim --"
              >
                {MOVIES_LIST.filter(m => !form.movies.includes(m)).map(m => (
                  <option key={m}>{m}</option>
                ))}
              </Select>
              <Button h="40px" px="16px" borderRadius="10px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                color="white" fontSize="12px" fontWeight="700"
                _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
                leftIcon={<Icon as={MdAdd} boxSize="13px" />}
                onClick={() => addMovie(movieInput)} flexShrink="0"
              >Thêm</Button>
            </Flex>

            {form.movies.length === 0 ? (
              <Flex align="center" justify="center" h="60px" borderRadius="10px"
                bg="#f8fafc" border="2px dashed #e2e8f0"
              >
                <Text fontSize="12px" color="#94a3b8">Chưa có phim nào được liên kết</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="7px">
                {form.movies.map((m, i) => (
                  <Flex key={i} align="center" justify="space-between"
                    p="9px 12px" borderRadius="9px" bg="#fff7ed" border="1px solid #fed7aa"
                    sx={{ animation: `${fadeIn} 0.2s ease both` }}
                  >
                    <Flex align="center" gap="8px">
                      <Box w="6px" h="6px" borderRadius="full" bg="#f97316" />
                      <Text fontSize="12.5px" fontWeight="600" color="#0f172a">{m}</Text>
                    </Flex>
                    <Button size="xs" h="22px" w="22px" p="0" minW="0" borderRadius="6px"
                      bg="transparent" color="#94a3b8" _hover={{ bg: "#fef2f2", color: "#dc2626" }}
                      onClick={() => removeMovie(m)}
                    >
                      <Icon as={MdClose} boxSize="11px" />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            )}
          </Box>
        </Flex>

        {/* ── Right ── */}
        <Flex direction="column" gap="14px">
          {/* Photo */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Ảnh đại diện" />
            <Box mb="12px">
              <Text sx={labelStyle}>URL ảnh</Text>
              <Input {...inputStyle} placeholder="https://..."
                value={form.photo} onChange={e => set("photo", e.target.value)} />
            </Box>
            {form.photo ? (
              <Box borderRadius="12px" overflow="hidden" border="1px solid #f1f5f9"
                h="220px" bg="#f8fafc"
              >
                <img src={form.photo} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="160px" borderRadius="12px" bg="#f8fafc" border="2px dashed #e2e8f0"
              >
                <Icon as={MdImageSearch} boxSize="28px" color="#cbd5e1" mb="6px" />
                <Text fontSize="11.5px" color="#94a3b8">Nhập URL để xem trước ảnh</Text>
              </Flex>
            )}
            <Button w="100%" h="38px" mt="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              _hover={{ bg: "#f1f5f9" }} transition="all 0.2s"
              leftIcon={<Icon as={MdImageSearch} boxSize="13px" />}
            >Tải lên từ máy tính</Button>
          </Box>

          {/* Preview */}
          {form.name && (
            <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" />
              <Flex direction="column" gap="10px">
                {form.name && (
                  <Box>
                    <Text fontSize="9.5px" color="#94a3b8" fontWeight="700"
                      letterSpacing="0.8px" textTransform="uppercase" mb="3px">Tên nghệ sĩ</Text>
                    <Text fontSize="15px" fontWeight="800" color="#0f172a">{form.name}</Text>
                  </Box>
                )}
                <Flex gap="7px" flexWrap="wrap">
                  {form.role && <RoleBadge role={form.role} />}
                  {form.status && <StatusDot status={form.status} />}
                </Flex>
                {form.nationality && (
                  <Flex align="center" gap="6px">
                    <Icon as={FaGlobe} boxSize="11px" color="#94a3b8" />
                    <Text fontSize="12px" color="#475569" fontWeight="600">{form.nationality}</Text>
                  </Flex>
                )}
                {form.movies.length > 0 && (
                  <Flex align="center" gap="6px">
                    <Icon as={FaFilm} boxSize="11px" color="#f97316" />
                    <Text fontSize="12px" color="#475569" fontWeight="600">
                      {form.movies.length} phim tham gia
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }}
        bottom={{ base: "0" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >Hủy bỏ</Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#fff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Thêm nghệ sĩ" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function ArtistDetail({ artist, onBack, onEdit }) {
  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header nav */}
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
        >Chỉnh sửa</Button>
      </Flex>

      {/* Hero card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 14px rgba(0,0,0,0.07)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Flex direction={{ base: "column", md: "row" }}>
          {/* Photo */}
          <Box
            w={{ base: "100%", md: "200px" }}
            h={{ base: "240px", md: "auto" }}
            minH={{ md: "260px" }}
            flexShrink="0" bg="#f8fafc" overflow="hidden"
          >
            {artist.photo ? (
              <img src={artist.photo} alt={artist.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
            ) : (
              <Flex align="center" justify="center" h="100%">
                <Icon as={MdPerson} boxSize="52px" color="#cbd5e1" />
              </Flex>
            )}
          </Box>

          {/* Info */}
          <Box p={{ base: "18px", md: "26px" }} flex="1">
            <Flex justify="space-between" align="flex-start" mb="10px" gap="8px">
              <Box flex="1" minW="0">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800" color="#0f172a"
                  letterSpacing="-0.5px" mb="8px" lineHeight="1.2">{artist.name}</Text>
                <Flex gap="8px" flexWrap="wrap" mb="6px">
                  <RoleBadge role={artist.role} />
                  <StatusDot status={artist.status} />
                </Flex>
              </Box>
            </Flex>

            <Box h="1px" bg="#f1f5f9" mb="14px" />

            {/* Stats grid */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing="10px" mb="14px">
              {[
                { icon: FaGlobe,     label: "Quốc tịch", val: artist.nationality || "—" },
                { icon: MdStar,      label: "Sinh ngày",  val: artist.birthDate || "—" },
                { icon: FaFilm,      label: "Số phim",    val: `${artist.movies.length} phim` },
              ].map(({ icon: Ic, label, val }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="10px" color="#f97316" />
                    <Text fontSize="9px" fontWeight="700" color="#94a3b8"
                      letterSpacing="0.7px" textTransform="uppercase" noOfLines={1}>{label}</Text>
                  </Flex>
                  <Text fontSize="13px" fontWeight="700" color="#0f172a">{val}</Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* Bio */}
            {artist.bio && (
              <Box p="12px 14px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
                <Text fontSize="9.5px" fontWeight="800" color="#92400e" letterSpacing="1px"
                  textTransform="uppercase" mb="6px">Tiểu sử</Text>
                <Text fontSize={{ base: "12.5px", md: "13px" }} color="#475569" lineHeight="1.75">
                  {artist.bio}
                </Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Awards + Movies row */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1.6fr" }} gap="12px" mb="16px">
        {/* Awards */}
        <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
          sx={{ animation: `${fadeUp} 0.4s ease both` }}
        >
          <Flex align="center" gap="8px" mb="12px">
            <Box w="30px" h="30px" borderRadius="9px" bg="#fff7ed"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdStar} boxSize="14px" color="#f97316" />
            </Box>
            <Text fontSize="12px" fontWeight="800" color="#0f172a" letterSpacing="0.3px">
              Giải thưởng nổi bật
            </Text>
          </Flex>
          <Box h="1px" bg="#f1f5f9" mb="12px" />
          {artist.awards ? (
            <Text fontSize="13px" fontWeight="600" color="#0f172a" lineHeight="1.6">
              {artist.awards}
            </Text>
          ) : (
            <Text fontSize="12px" color="#94a3b8">Chưa có thông tin</Text>
          )}
        </Box>

        {/* Linked films */}
        <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
          sx={{ animation: `${fadeUp} 0.4s ease 0.06s both` }}
        >
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Box w="30px" h="30px" borderRadius="9px" bg="#fff7ed"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FaFilm} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="12px" fontWeight="800" color="#0f172a">Phim tham gia</Text>
            </Flex>
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="11px" fontWeight="700" color="#f97316">{artist.movies.length} phim</Text>
            </Box>
          </Flex>
          <Box h="1px" bg="#f1f5f9" mb="12px" />
          {artist.movies.length === 0 ? (
            <Text fontSize="12px" color="#94a3b8">Chưa liên kết phim nào</Text>
          ) : (
            <Flex direction="column" gap="7px">
              {artist.movies.map((m, i) => (
                <Flex key={i} align="center" gap="10px" p="8px 12px"
                  borderRadius="9px" bg="#f8fafc" border="1px solid #f1f5f9"
                  sx={{ animation: `${fadeUp} 0.3s ease ${i * 0.05}s both` }}
                >
                  <Box w="6px" h="6px" borderRadius="full" bg="#f97316" flexShrink="0" />
                  <Text fontSize="12.5px" fontWeight="600" color="#0f172a">{m}</Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      </Grid>
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyNgheNhan() {
  const [view, setView] = useState("list");           // list | grid | detail | add | edit
  const [displayMode, setDisplayMode] = useState("grid"); // grid | list
  const [selected, setSelected] = useState(null);
  const [artists, setArtists] = useState(ARTISTS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = artists.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) ||
      a.nationality.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q);
    const matchRole = filterRole === "Tất cả" || a.role === filterRole;
    return matchSearch && matchRole;
  });

  const counts = {
    total:    artists.length,
    actors:   artists.filter(a => a.role === "Diễn viên").length,
    directors:artists.filter(a => a.role === "Đạo diễn").length,
    both:     artists.filter(a => a.role === "Diễn viên / Đạo diễn").length,
  };

  const handleSave = (form) => {
    if (view === "add") {
      setArtists(prev => [...prev, { ...form, id: Date.now() }]);
    } else {
      setArtists(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a));
      setSelected(prev => ({ ...prev, ...form }));
    }
    setView("list");
  };

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }} px={{ base: "0", md: "0" }}>

        {/* Page Header */}
        <Flex justify="space-between" align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
        >
          <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="10px" mb="4px">
              <Box w="40px" h="40px" borderRadius="12px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              >
                <Icon as={FaUsers} boxSize="17px" color="white" />
              </Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a"
                letterSpacing="-0.5px">
                Diễn viên &amp; Đạo diễn
              </Text>
            </Flex>
            <Text color="#94a3b8" fontSize="13px" pl="50px">
              Quản lý hồ sơ nghệ sĩ và liên kết với phim
            </Text>
          </Box>

          <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
            w={{ base: "100%", md: "auto" }}
          >
            {/* View toggle */}
            <Flex gap="2px" p="3px" borderRadius="10px" bg="#f1f5f9"
              display={{ base: "none", md: "flex" }} flexShrink="0"
            >
              {[
                { mode: "grid", label: "Grid" },
                { mode: "list", label: "List" },
              ].map(({ mode, label }) => (
                <Button key={mode} h="32px" px="14px" borderRadius="8px" fontSize="12px" fontWeight="600"
                  bg={displayMode === mode ? "white" : "transparent"}
                  color={displayMode === mode ? "#0f172a" : "#94a3b8"}
                  boxShadow={displayMode === mode ? "0 1px 4px rgba(0,0,0,0.08)" : "none"}
                  _hover={{ color: "#0f172a" }} transition="all 0.15s"
                  onClick={() => setDisplayMode(mode)}
                >{label}</Button>
              ))}
            </Flex>

            <Button flex={{ base: "1", md: "none" }}
              h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdAdd} />}
              onClick={() => setView("add")}
            >Thêm nghệ sĩ</Button>
          </Flex>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
          <StatCard label="Tổng nghệ sĩ"   value={counts.total}     icon={FaUsers}         accent="#f97316" delay={0}    />
          <StatCard label="Diễn viên"       value={counts.actors}    icon={FaMask}          accent="#c2410c" delay={0.05} />
          <StatCard label="Đạo diễn"        value={counts.directors} icon={FaVideo}         accent="#1d4ed8" delay={0.1}  />
          <StatCard label="Đa năng"         value={counts.both}      icon={FaTheaterMasks}  accent="#7c3aed" delay={0.15} />
        </SimpleGrid>

        {/* Table card */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          {/* Card header */}
          <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom="1px solid #f8fafc">
            <Flex align="center" justify="space-between" mb="12px">
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                  Danh sách nghệ sĩ
                </Text>
                <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} người</Text>
                </Box>
              </Flex>
              <Button
                display={{ base: "flex", md: "none" }}
                size="sm" h="34px" px="12px" borderRadius="9px"
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
                _hover={{ bg: "#f1f5f9" }}
                onClick={() => setShowFilter(v => !v)}
              >Lọc</Button>
            </Flex>

            <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
              <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
                <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                  <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                    transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1"
                  />
                  <Input
                    pl="30px" h={{ base: "40px", md: "34px" }} w="100%"
                    fontSize="12.5px" fontWeight="500"
                    placeholder="Tìm tên, quốc tịch, vai trò..."
                    bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                    _placeholder={{ color: "#b0bac8" }}
                    _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                    _hover={{ border: "1px solid #f97316" }}
                    transition="all 0.2s"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </Box>
                <Select
                  h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "160px", md: "160px" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterRole} onChange={e => setFilterRole(e.target.value)}
                >
                  <option value="Tất cả">Tất cả vai trò</option>
                  <option value="Diễn viên">Diễn viên</option>
                  <option value="Đạo diễn">Đạo diễn</option>
                  <option value="Diễn viên / Đạo diễn">Diễn viên / Đạo diễn</option>
                </Select>
              </Flex>
            </Box>
          </Box>

          {/* Desktop table headers (list mode) */}
          {displayMode === "list" && (
            <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
              display={{ base: "none", md: "flex" }}
            >
              <Box w="32px" flexShrink="0">
                <Text fontSize="10px" fontWeight="800" color="#cbd5e1" letterSpacing="1px">#</Text>
              </Box>
              <Box w="52px" mr="14px" flexShrink="0" />
              <Box flex="2">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Tên / Vai trò
                </Text>
              </Box>
              <Box flex="0.8">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Quốc tịch
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Phim tham gia
                </Text>
              </Box>
              <Box flex="0.7">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Trạng thái
                </Text>
              </Box>
              <Box w="160px" flexShrink="0" textAlign="right">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Hành động
                </Text>
              </Box>
            </Flex>
          )}

          {/* Content */}
          <Box p={{ base: "10px", md: "12px" }}>
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="48px" color="#cbd5e1">
                <Icon as={FaUsers} boxSize="32px" mb="10px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy nghệ sĩ nào</Text>
              </Flex>
            ) : displayMode === "grid" ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="12px">
                {filtered.map((a, i) => (
                  <ArtistCard key={a.id} artist={a} index={i}
                    onView={av => { setSelected(av); setView("detail"); }}
                    onEdit={av => { setSelected(av); setView("edit"); }}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Flex direction="column" gap="8px">
                {filtered.map((a, i) => (
                  <ArtistRow key={a.id} artist={a} index={i}
                    onView={av => { setSelected(av); setView("detail"); }}
                    onEdit={av => { setSelected(av); setView("edit"); }}
                  />
                ))}
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  if (view === "detail" && selected) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ArtistDetail
          artist={artists.find(a => a.id === selected.id) || selected}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ArtistForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ArtistForm
          artist={artists.find(a => a.id === selected.id) || selected}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}