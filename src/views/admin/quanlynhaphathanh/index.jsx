import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Divider,
  FormControl, Input, Select, Textarea,
  Icon, keyframes, Badge, Avatar,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack,
  MdClose, MdCheckCircle, MdSearch, MdFilterList,
  MdBusiness, MdPublic, MdPhone, MdEmail, MdLink,
  MdPerson, MdMovie, MdVisibilityOff, MdFlag,
  MdLocationOn, MdInfo, MdStar, MdTrendingUp,
  MdCalendarToday, MdVerified, MdWarning,
} from "react-icons/md";
import { FaFilm, FaBuilding, FaGlobe, FaTicketAlt } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ─────────────────────────────────────────────────────────────
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
const slideRight = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

// ─── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Đang hoạt động": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Tạm dừng":       { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Ngừng hợp tác":  { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

const REGION_CONFIG = {
  "Quốc tế": { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  "Trong nước": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
};

// ─── Country flag emoji helper ───────────────────────────────────────────────
const FLAG_MAP = {
  "Mỹ": "🇺🇸", "Anh": "🇬🇧", "Hàn Quốc": "🇰🇷", "Nhật Bản": "🇯🇵",
  "Pháp": "🇫🇷", "Trung Quốc": "🇨🇳", "Việt Nam": "🇻🇳", "Đức": "🇩🇪",
  "Ý": "🇮🇹", "Ấn Độ": "🇮🇳", "Australia": "🇦🇺", "Canada": "🇨🇦",
};

// ─── Static data ─────────────────────────────────────────────────────────────
const DISTRIBUTORS = [
  {
    id: 1,
    name: "Marvel Studios",
    shortName: "Marvel",
    type: "Quốc tế",
    country: "Mỹ",
    status: "Đang hoạt động",
    contactPerson: "Kevin Feige",
    email: "licensing@marvel.com",
    phone: "+1 (310) 896-1234",
    website: "https://marvel.com",
    address: "500 S Buena Vista St, Burbank, CA 91521, USA",
    description: "Nhà sản xuất và phát hành phim siêu anh hùng hàng đầu thế giới, thuộc sở hữu của The Walt Disney Company.",
    moviesCount: 28,
    totalRevenue: "45.2 tỷ",
    foundedYear: "1939",
    logoColor: "#e23636",
    contractStart: "2018-01-01",
    contractEnd: "2027-12-31",
    notes: "Đối tác chiến lược ưu tiên. Hợp đồng dài hạn đến 2027.",
  },
  {
    id: 2,
    name: "Sony Pictures",
    shortName: "Sony",
    type: "Quốc tế",
    country: "Mỹ",
    status: "Đang hoạt động",
    contactPerson: "Tom Rothman",
    email: "distribution@sonypictures.com",
    phone: "+1 (310) 244-4000",
    website: "https://sonypictures.com",
    address: "10202 W. Washington Blvd, Culver City, CA 90232, USA",
    description: "Một trong những studio điện ảnh lớn nhất thế giới, sở hữu thương hiệu Spider-Man và nhiều franchise đình đám.",
    moviesCount: 15,
    totalRevenue: "28.7 tỷ",
    foundedYear: "1987",
    logoColor: "#0f172a",
    contractStart: "2020-06-01",
    contractEnd: "2025-05-31",
    notes: "Hợp đồng sắp hết hạn, cần gia hạn trước tháng 3/2025.",
  },
  {
    id: 3,
    name: "CJ ENM",
    shortName: "CJ ENM",
    type: "Quốc tế",
    country: "Hàn Quốc",
    status: "Đang hoạt động",
    contactPerson: "강호성",
    email: "global@cjenm.com",
    phone: "+82 2-371-9000",
    website: "https://cjenm.com",
    address: "66 Sangamsan-ro, Mapo-gu, Seoul, South Korea",
    description: "Tập đoàn giải trí hàng đầu Hàn Quốc, phát hành nhiều bộ phim đoạt giải Oscar và các phim K-drama nổi tiếng.",
    moviesCount: 11,
    totalRevenue: "18.4 tỷ",
    foundedYear: "1994",
    logoColor: "#2563eb",
    contractStart: "2021-03-01",
    contractEnd: "2026-02-28",
    notes: "Độc quyền phân phối phim Hàn tại Việt Nam.",
  },
  {
    id: 4,
    name: "Galaxy Studio",
    shortName: "Galaxy",
    type: "Trong nước",
    country: "Việt Nam",
    status: "Đang hoạt động",
    contactPerson: "Nguyễn Hoàng Hải",
    email: "contact@galaxystudio.vn",
    phone: "+84 28 3822 9999",
    website: "https://galaxystudio.vn",
    address: "116 Nguyễn Du, Phường Bến Nghé, Quận 1, TP.HCM",
    description: "Đơn vị sản xuất và phát hành phim Việt Nam uy tín, có nhiều phim đạt doanh thu kỷ lục nội địa.",
    moviesCount: 9,
    totalRevenue: "6.8 tỷ",
    foundedYear: "2011",
    logoColor: "#f97316",
    contractStart: "2019-01-01",
    contractEnd: "2024-12-31",
    notes: "Đối tác nội địa chiến lược.",
  },
  {
    id: 5,
    name: "Toho Animation",
    shortName: "Toho",
    type: "Quốc tế",
    country: "Nhật Bản",
    status: "Tạm dừng",
    contactPerson: "Minami Ichikawa",
    email: "intl@toho.co.jp",
    phone: "+81 3-3213-8905",
    website: "https://toho.co.jp",
    address: "1-2-2 Yurakucho, Chiyoda-ku, Tokyo 100-8415, Japan",
    description: "Hãng phim lớn nhất Nhật Bản, phát hành anime và phim chiếu rạp nổi tiếng như Godzilla, các phim Ghibli.",
    moviesCount: 6,
    totalRevenue: "9.1 tỷ",
    foundedYear: "1932",
    logoColor: "#dc2626",
    contractStart: "2022-01-01",
    contractEnd: "2023-12-31",
    notes: "Hợp đồng đã hết hạn, đang đàm phán gia hạn.",
  },
  {
    id: 6,
    name: "BHD Star Cineplex",
    shortName: "BHD",
    type: "Trong nước",
    country: "Việt Nam",
    status: "Ngừng hợp tác",
    contactPerson: "Nguyễn Thanh Tú",
    email: "partner@bhdstar.vn",
    phone: "+84 28 6288 6282",
    website: "https://bhdstar.vn",
    address: "258 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
    description: "Chuỗi rạp và đơn vị phát hành phim Việt Nam.",
    moviesCount: 3,
    totalRevenue: "2.1 tỷ",
    foundedYear: "2009",
    logoColor: "#9333ea",
    contractStart: "2017-01-01",
    contractEnd: "2022-06-30",
    notes: "Ngừng hợp tác do thay đổi chiến lược kinh doanh.",
  },
];

// ─── Shared styles ───────────────────────────────────────────────────────────
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
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#ffffff" },
  _hover: { border: "1.5px solid #f97316", bg: "#ffffff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function SectionTitle({ label, icon: IconComp }) {
  return (
    <Box mb="16px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="16px" borderRadius="full"
          bg="linear-gradient(180deg, #f97316, #fbbf24)"
          sx={{ animation: `${slideRight} 0.3s ease both`, transformOrigin: "left" }}
        />
        {IconComp && (
          <Box w="24px" h="24px" borderRadius="7px" bg="#fff7ed"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={IconComp} boxSize="12px" color="#f97316" />
          </Box>
        )}
        <Text fontSize="11px" fontWeight="800" color="#374151"
          letterSpacing="1.1px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="10px" h="1px"
        bg="linear-gradient(90deg, #fed7aa 0%, #f1f5f9 60%, transparent 100%)" />
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Ngừng hợp tác"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function RegionBadge({ type }) {
  const cfg = REGION_CONFIG[type] || REGION_CONFIG["Trong nước"];
  return (
    <Box px="8px" py="3px" borderRadius="6px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>
        {type === "Quốc tế" ? "🌐" : "🇻🇳"} {type}
      </Text>
    </Box>
  );
}

function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p={{ base: "14px 16px", md: "18px 20px" }} borderRadius="16px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 6px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.12)", transform: "translateY(-2px)", border: "1px solid #fed7aa" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="5px">{label}</Text>
          <Text fontSize={{ base: "26px", md: "30px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="4px" fontWeight="600">{sub}</Text>}
        </Box>
        <Box w={{ base: "38px", md: "46px" }} h={{ base: "38px", md: "46px" }} borderRadius="14px"
          bg={`${accent}15`} display="flex" alignItems="center" justifyContent="center"
          border={`1px solid ${accent}25`}
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Logo Avatar ─────────────────────────────────────────────────────────────
function DistributorLogo({ name, shortName, color, size = "40px" }) {
  const initials = shortName
    ? shortName.substring(0, 2).toUpperCase()
    : name.substring(0, 2).toUpperCase();
  return (
    <Box w={size} h={size} borderRadius="10px"
      bg={`${color}15`} border={`1.5px solid ${color}30`}
      display="flex" alignItems="center" justifyContent="center" flexShrink="0"
    >
      <Text fontSize={parseInt(size) <= 40 ? "12px" : "16px"} fontWeight="800" color={color}>{initials}</Text>
    </Box>
  );
}

// ─── Distributor Row ─────────────────────────────────────────────────────────
function DistributorRow({ dist, index, onView, onEdit, onHide }) {
  const isInactive = dist.status === "Ngừng hợp tác";

  return (
    <>
      {/* MOBILE */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg="white"
        border="1.5px solid #f1f5f9" transition="all 0.2s"
        opacity={isInactive ? 0.65 : 1}
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 3px 16px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" mb="12px" align="flex-start">
          <DistributorLogo name={dist.name} shortName={dist.shortName} color={dist.logoColor} size="48px" />
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="700" color="#0f172a" noOfLines={1} mb="5px">{dist.name}</Text>
            <Flex gap="6px" flexWrap="wrap" mb="5px">
              <StatusBadge status={dist.status} />
              <RegionBadge type={dist.type} />
            </Flex>
            <Flex gap="14px" flexWrap="wrap">
              <Flex align="center" gap="4px">
                <Text fontSize="12px">{FLAG_MAP[dist.country] || "🌍"}</Text>
                <Text fontSize="11.5px" color="#64748b" fontWeight="600">{dist.country}</Text>
              </Flex>
              <Flex align="center" gap="4px">
                <Icon as={MdMovie} boxSize="11px" color="#f97316" />
                <Text fontSize="11.5px" color="#64748b" fontWeight="600">{dist.moviesCount} phim</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <Flex gap="8px">
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9" }} onClick={() => onView(dist)}>Xem</Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            onClick={() => onEdit(dist)}>Sửa</Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibilityOff} boxSize="12px" />}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            onClick={() => onHide(dist)}>Ẩn</Button>
        </Flex>
      </Box>

      {/* DESKTOP */}
      <Box display={{ base: "none", md: "block" }}
        p="13px 18px" borderRadius="12px" bg="white"
        border="1.5px solid #f1f5f9" transition="all 0.2s"
        opacity={isInactive ? 0.6 : 1}
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 3px 16px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center" gap="0">
          {/* Index */}
          <Box w="28px" flexShrink="0">
            <Text fontSize="11.5px" fontWeight="700" color="#cbd5e1">
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>

          {/* Logo + Name */}
          <Flex align="center" gap="12px" flex="2.5" minW="0" pr="12px">
            <DistributorLogo name={dist.name} shortName={dist.shortName} color={dist.logoColor} size="40px" />
            <Box minW="0">
              <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{dist.name}</Text>
              <Flex align="center" gap="5px" mt="3px">
                <Text fontSize="12px">{FLAG_MAP[dist.country] || "🌍"}</Text>
                <Text fontSize="11px" color="#94a3b8" fontWeight="600">{dist.country}</Text>
              </Flex>
            </Box>
          </Flex>

          {/* Type */}
          <Box flex="0.9" minW="0" pr="12px">
            <RegionBadge type={dist.type} />
          </Box>

          {/* Status */}
          <Box flex="1.1" minW="0" pr="12px">
            <StatusBadge status={dist.status} />
          </Box>

          {/* Contact */}
          <Box flex="1.2" minW="0" pr="12px">
            <Text fontSize="12px" fontWeight="600" color="#374151" noOfLines={1}>{dist.contactPerson}</Text>
            <Text fontSize="10.5px" color="#94a3b8" noOfLines={1} mt="2px">{dist.email}</Text>
          </Box>

          {/* Movies + Revenue */}
          <Box flex="0.8" minW="0" pr="12px">
            <Flex align="center" gap="5px">
              <Icon as={MdMovie} boxSize="11px" color="#f97316" />
              <Text fontSize="12px" fontWeight="700" color="#0f172a">{dist.moviesCount} phim</Text>
            </Flex>
            <Text fontSize="10.5px" color="#94a3b8" mt="2px">{dist.totalRevenue}</Text>
          </Box>

          {/* Actions */}
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
              _hover={{ bg: "#f1f5f9" }} transition="all 0.15s"
              onClick={() => onView(dist)}>Xem</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="11px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(dist)}>Sửa</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibilityOff} boxSize="11px" />}
              _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
              transition="all 0.15s"
              onClick={() => onHide(dist)}>Ẩn</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

// ─── Add / Edit Form ─────────────────────────────────────────────────────────
function DistributorForm({ dist, onCancel, onSave, isAdd = false }) {
  const [form, setForm] = useState(dist || {
    name: "", shortName: "", type: "Quốc tế", country: "Mỹ", status: "Đang hoạt động",
    contactPerson: "", email: "", phone: "", website: "", address: "",
    description: "", foundedYear: "", contractStart: "", contractEnd: "", notes: "",
    logoColor: "#f97316",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} gap="12px" mb="22px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="40px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} flexShrink="0"
          onClick={onCancel}>Quay lại</Button>
        <Box>
          <Flex align="center" gap="10px">
            <Box w="34px" h="34px" borderRadius="10px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaBuilding} boxSize="14px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800"
                color="#0f172a" letterSpacing="-0.4px">
                {isAdd ? "Thêm nhà phát hành mới" : `Chỉnh sửa: ${dist?.name}`}
              </Text>
              <Text fontSize="12px" color="#94a3b8" mt="1px">
                {isAdd ? "Điền thông tin để thêm nhà phát hành vào hệ thống" : "Cập nhật thông tin nhà phát hành"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="16px">
        {/* LEFT */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" icon={MdBusiness} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Tên nhà phát hành *</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Marvel Studios"
                    value={form.name} onChange={(e) => set("name", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Tên viết tắt</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="VD: Marvel"
                    value={form.shortName} onChange={(e) => set("shortName", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Loại *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.type} onChange={(e) => set("type", e.target.value)}>
                    <option>Quốc tế</option>
                    <option>Trong nước</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Quốc gia *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.country} onChange={(e) => set("country", e.target.value)}>
                    <option>Mỹ</option>
                    <option>Anh</option>
                    <option>Hàn Quốc</option>
                    <option>Nhật Bản</option>
                    <option>Pháp</option>
                    <option>Trung Quốc</option>
                    <option>Việt Nam</option>
                    <option>Đức</option>
                    <option>Ý</option>
                    <option>Ấn Độ</option>
                    <option>Australia</option>
                    <option>Canada</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Năm thành lập</Text>
                <FormControl>
                  <Input {...inputStyle} type="number" placeholder="VD: 1994"
                    value={form.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box>
              <Text sx={labelStyle}>Trụ sở / Địa chỉ</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="Địa chỉ đầy đủ..."
                  value={form.address} onChange={(e) => set("address", e.target.value)} />
              </FormControl>
            </Box>
          </Box>

          {/* Contact */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin liên hệ" icon={MdPerson} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Người đại diện</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="Họ và tên"
                    value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Email liên hệ</Text>
                <FormControl>
                  <Input {...inputStyle} type="email" placeholder="email@example.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Số điện thoại</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="+84 xxx xxx xxx"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Website</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="https://..."
                    value={form.website} onChange={(e) => set("website", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
          </Box>

          {/* Contract & Status */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Hợp đồng & Trạng thái" icon={MdCalendarToday} />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Trạng thái *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.status} onChange={(e) => set("status", e.target.value)}>
                    <option>Đang hoạt động</option>
                    <option>Tạm dừng</option>
                    <option>Ngừng hợp tác</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày bắt đầu HĐ</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.contractStart} onChange={(e) => set("contractStart", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày kết thúc HĐ</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.contractEnd} onChange={(e) => set("contractEnd", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box>
              <Text sx={labelStyle}>Ghi chú nội bộ</Text>
              <FormControl>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={2}
                  placeholder="Ghi chú nội bộ về hợp đồng, điều kiện đặc biệt..."
                  value={form.notes} onChange={(e) => set("notes", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>

          {/* Description */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Giới thiệu" icon={MdInfo} />
            <FormControl>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={3}
                placeholder="Mô tả ngắn về nhà phát hành..."
                value={form.description} onChange={(e) => set("description", e.target.value)}
              />
            </FormControl>
          </Box>
        </Flex>

        {/* RIGHT — preview */}
        <Flex direction="column" gap="14px">
          {/* Color picker */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Logo & Màu nhận diện" />
            <Text sx={labelStyle} mb="8px">Màu thương hiệu</Text>
            <Flex gap="8px" flexWrap="wrap" mb="14px">
              {["#f97316","#2563eb","#dc2626","#059669","#7c3aed","#0f172a","#9333ea","#0891b2"].map((c) => (
                <Box key={c} w="28px" h="28px" borderRadius="7px" bg={c} cursor="pointer"
                  border={form.logoColor === c ? "2.5px solid #f97316" : "2px solid transparent"}
                  boxShadow={form.logoColor === c ? "0 0 0 3px rgba(249,115,22,0.3)" : "none"}
                  transition="all 0.15s" _hover={{ transform: "scale(1.15)" }}
                  onClick={() => set("logoColor", c)}
                />
              ))}
            </Flex>
            {/* Preview card */}
            {form.name && (
              <Box p="16px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9"
                sx={{ animation: `${fadeIn} 0.3s ease both` }}
              >
                <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
                  textTransform="uppercase" mb="10px">Xem trước</Text>
                <Flex align="center" gap="12px">
                  <DistributorLogo
                    name={form.name} shortName={form.shortName}
                    color={form.logoColor} size="48px"
                  />
                  <Box>
                    <Text fontSize="14px" fontWeight="700" color="#0f172a">{form.name}</Text>
                    <Flex gap="6px" mt="5px" flexWrap="wrap">
                      {form.status && <StatusBadge status={form.status} />}
                      {form.type && <RegionBadge type={form.type} />}
                    </Flex>
                  </Box>
                </Flex>
                {form.country && (
                  <Flex align="center" gap="6px" mt="10px">
                    <Text fontSize="13px">{FLAG_MAP[form.country] || "🌍"}</Text>
                    <Text fontSize="12px" color="#475569" fontWeight="600">{form.country}</Text>
                  </Flex>
                )}
              </Box>
            )}
          </Box>

          {/* Quick info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Thông tin nhanh" />
            <Flex direction="column" gap="10px">
              {form.contactPerson && (
                <Flex align="center" gap="8px">
                  <Icon as={MdPerson} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color="#475569" fontWeight="600">{form.contactPerson}</Text>
                </Flex>
              )}
              {form.email && (
                <Flex align="center" gap="8px">
                  <Icon as={MdEmail} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color="#475569" fontWeight="600" noOfLines={1}>{form.email}</Text>
                </Flex>
              )}
              {form.phone && (
                <Flex align="center" gap="8px">
                  <Icon as={MdPhone} boxSize="13px" color="#f97316" />
                  <Text fontSize="12px" color="#475569" fontWeight="600">{form.phone}</Text>
                </Flex>
              )}
              {form.contractEnd && (
                <Box p="10px 12px" borderRadius="8px" bg="#fffbeb" border="1px solid #fed7aa">
                  <Text fontSize="10px" fontWeight="700" color="#92400e"
                    letterSpacing="0.8px" textTransform="uppercase" mb="3px">Hết hạn hợp đồng</Text>
                  <Text fontSize="12px" fontWeight="700" color="#b45309">
                    {new Date(form.contractEnd).toLocaleDateString("vi-VN")}
                  </Text>
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}>Hủy bỏ</Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}>
            {isAdd ? "Thêm nhà phát hành" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────
function DistributorDetail({ dist, onBack, onEdit }) {
  const contractExpiring = dist.contractEnd && (() => {
    const end = new Date(dist.contractEnd);
    const now = new Date();
    const diff = (end - now) / (1000 * 60 * 60 * 24);
    return diff < 90 && diff > 0;
  })();

  const contractExpired = dist.contractEnd && new Date(dist.contractEnd) < new Date();

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="40px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}>
          <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
        </Button>
        <Button h="40px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          leftIcon={<Icon as={MdEdit} />} onClick={onEdit}>Chỉnh sửa</Button>
      </Flex>

      {/* Hero card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 16px rgba(0,0,0,0.07)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        <Box p={{ base: "18px", md: "28px" }}>
          <Flex direction={{ base: "column", sm: "row" }} gap="20px" align="flex-start">
            {/* Logo big */}
            <Box w={{ base: "64px", md: "80px" }} h={{ base: "64px", md: "80px" }} borderRadius="18px"
              bg={`${dist.logoColor}15`} border={`2.5px solid ${dist.logoColor}30`}
              display="flex" alignItems="center" justifyContent="center" flexShrink="0"
            >
              <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={dist.logoColor}>
                {(dist.shortName || dist.name).substring(0, 2).toUpperCase()}
              </Text>
            </Box>

            <Box flex="1">
              <Flex justify="space-between" align="flex-start" gap="8px">
                <Box>
                  <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800"
                    color="#0f172a" letterSpacing="-0.5px" mb="8px">{dist.name}</Text>
                  <Flex gap="8px" flexWrap="wrap">
                    <StatusBadge status={dist.status} />
                    <RegionBadge type={dist.type} />
                    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
                      bg="#f8fafc" border="1px solid #f1f5f9"
                    >
                      <Text fontSize="13px">{FLAG_MAP[dist.country] || "🌍"}</Text>
                      <Text fontSize="12px" fontWeight="600" color="#475569">{dist.country}</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Flex>

          {/* Stats row */}
          <Box h="1px" bg="#f1f5f9" my="18px" />
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
            {[
              { icon: MdMovie, label: "Phim đang phát", val: `${dist.moviesCount} phim`, color: "#f97316" },
              { icon: MdTrendingUp, label: "Tổng doanh thu", val: dist.totalRevenue, color: "#059669" },
              { icon: MdCalendarToday, label: "Năm thành lập", val: dist.foundedYear || "—", color: "#2563eb" },
              { icon: FaTicketAlt, label: "Hợp đồng đến", val: dist.contractEnd ? new Date(dist.contractEnd).toLocaleDateString("vi-VN") : "—", color: "#7c3aed" },
            ].map(({ icon: Ic, label, val, color }) => (
              <Box key={label} p="12px 14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="6px" mb="5px">
                  <Icon as={Ic} boxSize="11px" color={color} />
                  <Text fontSize="9.5px" fontWeight="700" color="#94a3b8"
                    letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize="13px" fontWeight="800" color="#0f172a">{val}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Contract warning */}
          {(contractExpiring || contractExpired) && (
            <Box p="12px 14px" borderRadius="10px"
              bg={contractExpired ? "#fef2f2" : "#fffbeb"}
              border={`1px solid ${contractExpired ? "#fca5a5" : "#fcd34d"}`}
              mb="14px"
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <Flex align="center" gap="8px">
                <Icon as={MdWarning} boxSize="16px" color={contractExpired ? "#dc2626" : "#f59e0b"} />
                <Text fontSize="12.5px" fontWeight="700"
                  color={contractExpired ? "#dc2626" : "#b45309"}>
                  {contractExpired
                    ? "⚠️ Hợp đồng đã hết hạn — Cần gia hạn ngay!"
                    : "🔔 Hợp đồng sắp hết hạn trong vòng 90 ngày"}
                </Text>
              </Flex>
            </Box>
          )}

          {/* Description */}
          <Box p="14px 16px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
            <Text fontSize="10px" fontWeight="800" color="#92400e"
              letterSpacing="1px" textTransform="uppercase" mb="7px">Giới thiệu</Text>
            <Text fontSize={{ base: "12.5px", md: "13px" }} color="#475569" lineHeight="1.75">
              {dist.description}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Contact + Contract cards */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px" mb="16px">
        {/* Contact */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
        >
          <SectionTitle label="Thông tin liên hệ" icon={MdPerson} />
          <Flex direction="column" gap="12px">
            {[
              { icon: MdPerson, label: "Người đại diện", val: dist.contactPerson },
              { icon: MdEmail, label: "Email", val: dist.email },
              { icon: MdPhone, label: "Điện thoại", val: dist.phone },
              { icon: MdLink, label: "Website", val: dist.website, isLink: true },
              { icon: MdLocationOn, label: "Địa chỉ", val: dist.address },
            ].map(({ icon: Ic, label, val, isLink }) => (
              <Flex key={label} align="flex-start" gap="10px">
                <Box w="28px" h="28px" borderRadius="8px" bg="#fff7ed"
                  display="flex" alignItems="center" justifyContent="center" flexShrink="0" mt="1px"
                >
                  <Icon as={Ic} boxSize="12px" color="#f97316" />
                </Box>
                <Box>
                  <Text fontSize="10px" fontWeight="700" color="#94a3b8"
                    letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                  {isLink ? (
                    <Text as="a" href={val} target="_blank"
                      fontSize="12.5px" fontWeight="600" color="#2563eb"
                      textDecoration="underline" display="block" noOfLines={1}>{val}</Text>
                  ) : (
                    <Text fontSize="12.5px" fontWeight="600" color="#0f172a" mt="1px">{val || "—"}</Text>
                  )}
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Contract & Notes */}
        <Flex direction="column" gap="14px">
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
          >
            <SectionTitle label="Hợp đồng" icon={MdCalendarToday} />
            <Grid templateColumns="1fr 1fr" gap="10px">
              <Box p="12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Text fontSize="9.5px" fontWeight="700" color="#94a3b8"
                  letterSpacing="0.7px" textTransform="uppercase" mb="4px">Bắt đầu</Text>
                <Text fontSize="13px" fontWeight="700" color="#0f172a">
                  {dist.contractStart ? new Date(dist.contractStart).toLocaleDateString("vi-VN") : "—"}
                </Text>
              </Box>
              <Box p="12px" borderRadius="10px"
                bg={contractExpired ? "#fef2f2" : contractExpiring ? "#fffbeb" : "#f8fafc"}
                border={`1px solid ${contractExpired ? "#fca5a5" : contractExpiring ? "#fcd34d" : "#f1f5f9"}`}
              >
                <Text fontSize="9.5px" fontWeight="700"
                  color={contractExpired ? "#dc2626" : contractExpiring ? "#b45309" : "#94a3b8"}
                  letterSpacing="0.7px" textTransform="uppercase" mb="4px">Kết thúc</Text>
                <Text fontSize="13px" fontWeight="700"
                  color={contractExpired ? "#dc2626" : contractExpiring ? "#b45309" : "#0f172a"}>
                  {dist.contractEnd ? new Date(dist.contractEnd).toLocaleDateString("vi-VN") : "—"}
                </Text>
              </Box>
            </Grid>
          </Box>

          {dist.notes && (
            <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
              sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
            >
              <SectionTitle label="Ghi chú nội bộ" icon={MdInfo} />
              <Box p="12px 14px" borderRadius="10px" bg="#fafafa" border="1px solid #f1f5f9">
                <Text fontSize="12.5px" color="#475569" lineHeight="1.7">{dist.notes}</Text>
              </Box>
            </Box>
          )}
        </Flex>
      </Grid>
    </Box>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function QuanLyNhaPhatHanh() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [distributors, setDistributors] = useState(DISTRIBUTORS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = distributors.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.contactPerson.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tất cả" || d.status === filterStatus;
    const matchType = filterType === "Tất cả" || d.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    total:    distributors.length,
    active:   distributors.filter((d) => d.status === "Đang hoạt động").length,
    intl:     distributors.filter((d) => d.type === "Quốc tế").length,
    domestic: distributors.filter((d) => d.type === "Trong nước").length,
  };

  const totalMovies = distributors.reduce((s, d) => s + d.moviesCount, 0);

  const handleHide = (d) =>
    setDistributors((prev) => prev.map((x) =>
      x.id === d.id ? { ...x, status: "Ngừng hợp tác" } : x
    ));

  const handleSave = (form) => {
    if (view === "add") {
      setDistributors((prev) => [...prev, { ...form, id: Date.now(), moviesCount: 0, totalRevenue: "0" }]);
    } else {
      setDistributors((prev) => prev.map((x) => x.id === selected.id ? { ...x, ...form } : x));
      setSelected((prev) => ({ ...prev, ...form }));
    }
    setView("list");
  };

  // ── LIST ──
  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        {/* Page header */}
        <Flex justify="space-between" align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
        >
          <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="12px" mb="4px">
              <Box w="42px" h="42px" borderRadius="13px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 4px 14px rgba(249,115,22,0.4)"
              >
                <Icon as={FaBuilding} boxSize="17px" color="white" />
              </Box>
              <Text fontSize={{ base: "22px", md: "27px" }} fontWeight="800"
                color="#0f172a" letterSpacing="-0.6px">
                Nhà phát hành
              </Text>
            </Flex>
            <Text color="#94a3b8" fontSize="13px" pl="54px">
              Quản lý danh sách nhà phát hành phim trong nước &amp; quốc tế
            </Text>
          </Box>
          <Button sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
            w={{ base: "100%", md: "auto" }}
            h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 22px rgba(249,115,22,0.48)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            leftIcon={<Icon as={MdAdd} />}
            onClick={() => setView("add")}
          >
            Thêm nhà phát hành
          </Button>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
          <StatCard label="Tổng đối tác"   value={counts.total}    icon={FaBuilding}   accent="#f97316" sub={`${totalMovies} phim`} delay={0} />
          <StatCard label="Đang hoạt động" value={counts.active}   icon={MdVerified}   accent="#059669" sub="Hợp tác tốt"           delay={0.05} />
          <StatCard label="Quốc tế"        value={counts.intl}     icon={FaGlobe}      accent="#2563eb" sub="Nhà phát hành ngoại"   delay={0.1} />
          <StatCard label="Trong nước"     value={counts.domestic} icon={MdFlag}       accent="#7c3aed" sub="Đối tác nội địa"       delay={0.15} />
        </SimpleGrid>

        {/* Table card */}
        <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
          boxShadow="0 1px 6px rgba(0,0,0,0.05)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          {/* Card header */}
          <Box p={{ base: "14px 16px", md: "18px 22px 14px" }} borderBottom="1px solid #f8fafc">
            <Flex align="center" justify="space-between" mb="12px">
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                  Danh sách nhà phát hành
                </Text>
                <Box px="9px" py="3px" borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} đối tác</Text>
                </Box>
              </Flex>
              <Button display={{ base: "flex", md: "none" }}
                size="sm" h="34px" px="12px" borderRadius="9px"
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="12px" fontWeight="600"
                leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
                _hover={{ bg: "#f1f5f9" }}
                onClick={() => setShowFilter((v) => !v)}>Lọc</Button>
            </Flex>

            <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
              <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
                <Box position="relative" flex="1">
                  <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                    transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                  <Input
                    pl="30px" h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="500"
                    placeholder="Tìm tên, quốc gia, liên hệ..."
                    bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                    _placeholder={{ color: "#b0bac8" }}
                    _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                    _hover={{ border: "1px solid #f97316" }}
                    transition="all 0.2s"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "150px" }}
                  _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Tạm dừng</option>
                  <option>Ngừng hợp tác</option>
                </Select>
                <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "140px" }}
                  _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterType} onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="Tất cả">Tất cả loại</option>
                  <option>Quốc tế</option>
                  <option>Trong nước</option>
                </Select>
              </Flex>
            </Box>
          </Box>

          {/* Desktop column headers */}
          <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
            display={{ base: "none", md: "flex" }}
          >
            <Box w="28px" flexShrink="0" />
            <Box flex="2.5">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Nhà phát hành
              </Text>
            </Box>
            <Box flex="0.9">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Loại
              </Text>
            </Box>
            <Box flex="1.1">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Trạng thái
              </Text>
            </Box>
            <Box flex="1.2">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Liên hệ
              </Text>
            </Box>
            <Box flex="0.8">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Phim / DT
              </Text>
            </Box>
            <Box w="168px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>

          {/* Rows */}
          <Box p="10px">
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="48px" color="#cbd5e1">
                <Icon as={FaBuilding} boxSize="30px" mb="10px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy nhà phát hành nào</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="8px">
                {filtered.map((d, i) => (
                  <DistributorRow
                    key={d.id} dist={d} index={i}
                    onView={(x) => { setSelected(x); setView("detail"); }}
                    onEdit={(x) => { setSelected(x); setView("edit"); }}
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

  if (view === "detail" && selected) {
    const current = distributors.find((d) => d.id === selected.id) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DistributorDetail
          dist={current}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DistributorForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const current = distributors.find((d) => d.id === selected.id) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DistributorForm
          dist={current}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}