import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon,
  Input, Textarea, keyframes,
} from "@chakra-ui/react";
import {
  MdAdd, MdEdit, MdArrowBack, MdClose, MdCheckCircle,
  MdSearch, MdDelete, MdCategory, MdMovie, MdStar,
  MdPlayCircle, MdTimer, MdDone, MdFilterList, MdLabel,
  MdVisibility, MdTrendingUp, MdLocalMovies, MdColorLens,
} from "react-icons/md";
import { FaFilm, FaTag, FaLayerGroup } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.92); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const slideDown = keyframes`
  from { opacity: 0; max-height: 0; transform: translateY(-8px); }
  to   { opacity: 1; max-height: 600px; transform: translateY(0); }
`;

// ─── Genre color palette ─────────────────────────────────────────────────────
const GENRE_PALETTES = [
  { label: "Cam", value: "#f97316", bg: "#fff7ed", border: "#fed7aa", light: "#ffedd5" },
  { label: "Đỏ", value: "#ef4444", bg: "#fef2f2", border: "#fca5a5", light: "#fee2e2" },
  { label: "Tím", value: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd", light: "#ede9fe" },
  { label: "Xanh lá", value: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", light: "#d1fae5" },
  { label: "Xanh dương", value: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", light: "#dbeafe" },
  { label: "Hồng", value: "#ec4899", bg: "#fdf2f8", border: "#f9a8d4", light: "#fce7f3" },
  { label: "Vàng", value: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", light: "#fef3c7" },
  { label: "Xanh ngọc", value: "#06b6d4", bg: "#ecfeff", border: "#67e8f9", light: "#cffafe" },
];

// ─── Static genre data ────────────────────────────────────────────────────────
const INITIAL_GENRES = [
  {
    id: 1,
    name: "Hành động",
    slug: "hanh-dong",
    color: "#f97316",
    description: "Phim có nhiều cảnh chiến đấu, rượt đuổi và các pha hành động mãn nhãn.",
    movieCount: 24,
    status: "active",
    featured: true,
    createdAt: "01/01/2024",
  },
  {
    id: 2,
    name: "Kinh dị",
    slug: "kinh-di",
    color: "#ef4444",
    description: "Phim mang đến cảm giác sợ hãi, hồi hộp thông qua các yếu tố siêu nhiên hoặc tâm lý.",
    movieCount: 18,
    status: "active",
    featured: false,
    createdAt: "01/01/2024",
  },
  {
    id: 3,
    name: "Tình cảm",
    slug: "tinh-cam",
    color: "#ec4899",
    description: "Phim xoay quanh các mối quan hệ tình yêu, hôn nhân và gia đình.",
    movieCount: 31,
    status: "active",
    featured: true,
    createdAt: "02/01/2024",
  },
  {
    id: 4,
    name: "Hoạt hình",
    slug: "hoat-hinh",
    color: "#f59e0b",
    description: "Phim hoạt hình cho mọi lứa tuổi, từ thiếu nhi đến người lớn.",
    movieCount: 12,
    status: "active",
    featured: false,
    createdAt: "02/01/2024",
  },
  {
    id: 5,
    name: "Khoa học viễn tưởng",
    slug: "khoa-hoc-vien-tuong",
    color: "#3b82f6",
    description: "Phim về công nghệ tương lai, không gian vũ trụ và các thế giới tưởng tượng.",
    movieCount: 15,
    status: "active",
    featured: true,
    createdAt: "03/01/2024",
  },
  {
    id: 6,
    name: "Phiêu lưu",
    slug: "phieu-luu",
    color: "#10b981",
    description: "Phim khám phá những vùng đất mới, hành trình vượt qua thử thách.",
    movieCount: 20,
    status: "active",
    featured: false,
    createdAt: "03/01/2024",
  },
  {
    id: 7,
    name: "Hài hước",
    slug: "hai-huoc",
    color: "#8b5cf6",
    description: "Phim mang đến tiếng cười và những tình huống hài hước.",
    movieCount: 27,
    status: "active",
    featured: false,
    createdAt: "04/01/2024",
  },
  {
    id: 8,
    name: "Tâm lý",
    slug: "tam-ly",
    color: "#06b6d4",
    description: "Phim đề cao chiều sâu nội tâm, khám phá trạng thái tâm lý phức tạp.",
    movieCount: 9,
    status: "inactive",
    featured: false,
    createdAt: "05/01/2024",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

function getPalette(color) {
  return GENRE_PALETTES.find((p) => p.value === color) || GENRE_PALETTES[0];
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  bg: "#fafafa",
  border: "1.5px solid #e8edf3",
  borderRadius: "10px",
  color: "#1a202c",
  fontSize: "14px",
  fontWeight: "500",
  px: "14px",
  h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.12)", bg: "#ffffff" },
  _hover: { border: "1.5px solid #f97316", bg: "#ffffff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

function SectionTitle({ label, icon }) {
  return (
    <Box mb="16px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="8px" h="1px" bg="linear-gradient(90deg, #fed7aa 0%, transparent 100%)" />
    </Box>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p={{ base: "14px 16px", md: "20px" }} borderRadius="16px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 2px 8px rgba(0,0,0,0.04)"
      sx={{ animation: `${fadeUp} 0.45s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.12)", transform: "translateY(-3px)", border: "1px solid #fed7aa" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="10.5px" fontWeight="800" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="6px">
            {label}
          </Text>
          <Text fontSize={{ base: "26px", md: "32px" }} fontWeight="900" color="#0f172a" lineHeight="1" mb="2px">
            {value}
          </Text>
          {sub && <Text fontSize="10px" color="#94a3b8" mt="2px">{sub}</Text>}
        </Box>
        <Box w={{ base: "40px", md: "48px" }} h={{ base: "40px", md: "48px" }} borderRadius="14px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 4px 14px ${accent}25`}
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Genre Card ───────────────────────────────────────────────────────────────
function GenreCard({ genre, index, onEdit, onDelete, onToggle }) {
  const palette = getPalette(genre.color);

  return (
    <Box
      borderRadius="18px" bg="white" border={`1.5px solid ${genre.status === "active" ? palette.border : "#e5e7eb"}`}
      boxShadow={genre.status === "active" ? `0 2px 12px ${genre.color}18` : "0 1px 4px rgba(0,0,0,0.04)"}
      overflow="hidden"
      sx={{ animation: `${fadeUp} 0.4s ease ${index * 0.06}s both` }}
      transition="all 0.25s"
      _hover={genre.status === "active"
        ? { boxShadow: `0 8px 28px ${genre.color}28`, transform: "translateY(-4px)", border: `1.5px solid ${genre.color}` }
        : { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }
      }
      opacity={genre.status === "active" ? 1 : 0.7}
    >
      {/* Color accent bar */}
      <Box h="4px" bg={genre.status === "active"
        ? `linear-gradient(90deg, ${genre.color}, ${genre.color}88)`
        : "#e5e7eb"}
      />

      <Box p={{ base: "16px", md: "18px" }}>
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb="12px">
          <Flex align="center" gap="10px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg={genre.status === "active" ? palette.bg : "#f9fafb"}
              border={`1.5px solid ${genre.status === "active" ? palette.border : "#e5e7eb"}`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={genre.status === "active" ? `0 2px 8px ${genre.color}22` : "none"}
            >
              <Icon as={FaTag} boxSize="14px" color={genre.status === "active" ? genre.color : "#9ca3af"} />
            </Box>
            <Box>
              <Flex align="center" gap="6px">
                <Text fontSize="15px" fontWeight="800" color={genre.status === "active" ? "#0f172a" : "#9ca3af"}>
                  {genre.name}
                </Text>
                {genre.featured && genre.status === "active" && (
                  <Box px="5px" py="1px" borderRadius="4px"
                    bg="linear-gradient(135deg, #f97316, #fbbf24)"
                    sx={{ animation: `${pulse} 2.5s ease infinite` }}
                  >
                    <Text fontSize="8px" fontWeight="800" color="white" letterSpacing="0.5px">HOT</Text>
                  </Box>
                )}
              </Flex>
              <Text fontSize="10px" color="#94a3b8" fontWeight="500">/{genre.slug}</Text>
            </Box>
          </Flex>

          {/* Status toggle pill */}
          <Box
            px="9px" py="4px" borderRadius="8px" cursor="pointer"
            bg={genre.status === "active" ? "#ecfdf5" : "#f9fafb"}
            border={`1px solid ${genre.status === "active" ? "#6ee7b7" : "#e5e7eb"}`}
            onClick={() => onToggle(genre.id)}
            transition="all 0.2s"
            _hover={{ opacity: 0.8 }}
          >
            <Flex align="center" gap="4px">
              <Box w="5px" h="5px" borderRadius="full"
                bg={genre.status === "active" ? "#10b981" : "#9ca3af"}
                sx={genre.status === "active" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
              />
              <Text fontSize="10px" fontWeight="700"
                color={genre.status === "active" ? "#059669" : "#6b7280"}>
                {genre.status === "active" ? "Hiện" : "Ẩn"}
              </Text>
            </Flex>
          </Box>
        </Flex>

        {/* Description */}
        <Text fontSize="12.5px" color="#64748b" lineHeight="1.65" mb="14px" noOfLines={2}>
          {genre.description}
        </Text>

        {/* Stats row */}
        <Flex gap="8px" mb="14px">
          <Box flex="1" p="8px 10px" borderRadius="9px"
            bg={genre.status === "active" ? palette.light : "#f9fafb"}
            border={`1px solid ${genre.status === "active" ? palette.border : "#f1f5f9"}`}
          >
            <Flex align="center" gap="5px" mb="2px">
              <Icon as={MdLocalMovies} boxSize="10px" color={genre.status === "active" ? genre.color : "#9ca3af"} />
              <Text fontSize="9px" fontWeight="700" color={genre.status === "active" ? genre.color : "#9ca3af"}
                textTransform="uppercase" letterSpacing="0.5px">
                Phim
              </Text>
            </Flex>
            <Text fontSize="16px" fontWeight="800" color={genre.status === "active" ? "#0f172a" : "#9ca3af"}>
              {genre.movieCount}
            </Text>
          </Box>
          <Box flex="1" p="8px 10px" borderRadius="9px" bg="#f8fafc" border="1px solid #f1f5f9">
            <Flex align="center" gap="5px" mb="2px">
              <Icon as={MdColorLens} boxSize="10px" color="#94a3b8" />
              <Text fontSize="9px" fontWeight="700" color="#94a3b8"
                textTransform="uppercase" letterSpacing="0.5px">
                Màu sắc
              </Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Box w="14px" h="14px" borderRadius="4px" bg={genre.color} />
              <Text fontSize="11px" fontWeight="700" color="#475569">{genre.color}</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Created date */}
        <Text fontSize="10px" color="#c0c8d4" mb="12px">Tạo ngày: {genre.createdAt}</Text>

        {/* Action buttons */}
        <Flex gap="7px">
          <Button flex="1" h="34px" borderRadius="9px"
            bg={genre.status === "active" ? palette.bg : "#f9fafb"}
            color={genre.status === "active" ? genre.color : "#6b7280"}
            border={`1px solid ${genre.status === "active" ? palette.border : "#e5e7eb"}`}
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.8, transform: "translateY(-1px)" }}
            transition="all 0.15s"
            onClick={() => onEdit(genre)}
          >
            Chỉnh sửa
          </Button>
          <Button h="34px" px="12px" borderRadius="9px"
            bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdDelete} boxSize="12px" />}
            _hover={{ bg: "#fee2e2", transform: "translateY(-1px)" }}
            transition="all 0.15s"
            onClick={() => onDelete(genre.id)}
          >
            Xóa
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <Box>
      <Text sx={labelStyle}>Màu thể loại *</Text>
      <Flex gap="8px" flexWrap="wrap">
        {GENRE_PALETTES.map((p) => (
          <Box
            key={p.value}
            w="32px" h="32px" borderRadius="8px"
            bg={p.value}
            cursor="pointer"
            border={value === p.value ? "3px solid #0f172a" : "3px solid transparent"}
            boxShadow={value === p.value ? `0 0 0 2px white, 0 0 0 4px ${p.value}` : "0 2px 6px rgba(0,0,0,0.15)"}
            transition="all 0.15s"
            _hover={{ transform: "scale(1.15)" }}
            onClick={() => onChange(p.value)}
            title={p.label}
          />
        ))}
      </Flex>
      {/* Preview */}
      {value && (
        <Flex align="center" gap="8px" mt="10px" p="8px 12px" borderRadius="8px"
          bg={getPalette(value).bg} border={`1px solid ${getPalette(value).border}`}
          sx={{ animation: `${fadeIn} 0.2s ease both` }}
        >
          <Box w="10px" h="10px" borderRadius="3px" bg={value} />
          <Text fontSize="11px" fontWeight="600" color={value}>
            Xem trước: {getPalette(value).label}
          </Text>
        </Flex>
      )}
    </Box>
  );
}

// ─── Genre Form ───────────────────────────────────────────────────────────────
function GenreForm({ genre, onCancel, onSave, isAdd = false }) {
  const [form, setForm] = useState(genre || {
    name: "", slug: "", color: "#f97316", description: "", status: "active", featured: false,
  });

  const set = (key, val) => {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "name") next.slug = toSlug(val);
      return next;
    });
  };

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="22px"
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
          <Flex align="center" gap="8px">
            <Box w="30px" h="30px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={isAdd ? MdAdd : MdEdit} boxSize="14px" color="white" />
            </Box>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800" color="#0f172a">
              {isAdd ? "Thêm thể loại mới" : `Chỉnh sửa: ${genre?.name}`}
            </Text>
          </Flex>
          <Text fontSize="12px" color="#94a3b8" mt="2px" pl="38px">
            {isAdd ? "Tạo thể loại phim mới cho hệ thống" : "Cập nhật thông tin thể loại"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        {/* Left */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 6px rgba(0,0,0,0.04)" p={{ base: "16px", md: "22px" }}
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Flex direction="column" gap="14px">
              <Box>
                <Text sx={labelStyle}>Tên thể loại *</Text>
                <Input {...inputStyle} placeholder="VD: Hành động, Kinh dị..."
                  value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Slug (URL)</Text>
                <Input {...inputStyle} placeholder="tu-dong-tao"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  bg={form.slug ? "#f0fdf4" : "#fafafa"}
                />
                {form.slug && (
                  <Text fontSize="10px" color="#10b981" mt="4px" fontWeight="600">
                    ✓ URL: /the-loai/{form.slug}
                  </Text>
                )}
              </Box>
              <Box>
                <Text sx={labelStyle}>Mô tả thể loại</Text>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s"
                  rows={3} placeholder="Mô tả ngắn về thể loại phim này..."
                  value={form.description} onChange={(e) => set("description", e.target.value)}
                />
              </Box>
            </Flex>
          </Box>

          {/* Color & settings */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 6px rgba(0,0,0,0.04)" p={{ base: "16px", md: "22px" }}
          >
            <SectionTitle label="Màu sắc & Cài đặt" />
            <Flex direction="column" gap="16px">
              <ColorPicker value={form.color} onChange={(c) => set("color", c)} />

              <Box>
                <Text sx={labelStyle}>Trạng thái hiển thị</Text>
                <Flex gap="10px">
                  {["active", "inactive"].map((s) => (
                    <Box
                      key={s}
                      flex="1" p="10px 14px" borderRadius="10px" cursor="pointer"
                      bg={form.status === s ? (s === "active" ? "#ecfdf5" : "#f9fafb") : "#f8fafc"}
                      border={form.status === s
                        ? (s === "active" ? "2px solid #6ee7b7" : "2px solid #e5e7eb")
                        : "2px solid transparent"}
                      onClick={() => set("status", s)}
                      transition="all 0.15s"
                    >
                      <Flex align="center" gap="6px">
                        <Box w="6px" h="6px" borderRadius="full"
                          bg={s === "active" ? "#10b981" : "#9ca3af"} />
                        <Text fontSize="12px" fontWeight="700"
                          color={form.status === s ? (s === "active" ? "#059669" : "#6b7280") : "#94a3b8"}>
                          {s === "active" ? "Hiển thị" : "Ẩn"}
                        </Text>
                      </Flex>
                      <Text fontSize="10px" color="#94a3b8" mt="2px">
                        {s === "active" ? "Hiện trên trang chủ" : "Không hiển thị"}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Box>

              {/* Featured toggle */}
              <Box p="12px 14px" borderRadius="10px"
                bg={form.featured ? "#fff7ed" : "#f8fafc"}
                border={`1.5px solid ${form.featured ? "#fed7aa" : "#e5e7eb"}`}
                cursor="pointer"
                onClick={() => set("featured", !form.featured)}
                transition="all 0.2s"
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <Flex align="center" gap="6px" mb="2px">
                      <Icon as={MdStar} boxSize="14px" color={form.featured ? "#f59e0b" : "#94a3b8"} />
                      <Text fontSize="13px" fontWeight="700"
                        color={form.featured ? "#b45309" : "#374151"}>
                        Thể loại nổi bật
                      </Text>
                    </Flex>
                    <Text fontSize="11px" color="#94a3b8">Hiển thị badge HOT trên thẻ thể loại</Text>
                  </Box>
                  {/* Toggle switch */}
                  <Box w="38px" h="22px" borderRadius="full" transition="all 0.2s"
                    bg={form.featured ? "linear-gradient(135deg, #f97316, #fbbf24)" : "#e2e8f0"}
                    position="relative"
                    boxShadow={form.featured ? "0 2px 8px rgba(249,115,22,0.4)" : "none"}
                  >
                    <Box
                      w="18px" h="18px" borderRadius="full" bg="white"
                      position="absolute" top="2px"
                      left={form.featured ? "18px" : "2px"}
                      transition="all 0.2s"
                      boxShadow="0 1px 4px rgba(0,0,0,0.15)"
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Right — preview */}
        <Box>
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 6px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
            position={{ base: "static", lg: "sticky" }} top="90px"
          >
            <SectionTitle label="Xem trước" />
            {form.name ? (
              <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
                <Text fontSize="10px" color="#94a3b8" fontWeight="700" letterSpacing="0.8px"
                  textTransform="uppercase" mb="12px">
                  Thẻ thể loại
                </Text>
                {/* Preview card */}
                <Box borderRadius="14px" border={`1.5px solid ${getPalette(form.color).border}`}
                  overflow="hidden"
                  boxShadow={`0 4px 16px ${form.color}20`}
                >
                  <Box h="3px" bg={`linear-gradient(90deg, ${form.color}, ${form.color}88)`} />
                  <Box p="14px">
                    <Flex align="center" gap="8px" mb="8px">
                      <Box w="32px" h="32px" borderRadius="9px"
                        bg={getPalette(form.color).bg}
                        border={`1.5px solid ${getPalette(form.color).border}`}
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        <Icon as={FaTag} boxSize="12px" color={form.color} />
                      </Box>
                      <Box>
                        <Flex align="center" gap="5px">
                          <Text fontSize="14px" fontWeight="800" color="#0f172a">{form.name}</Text>
                          {form.featured && (
                            <Box px="4px" py="1px" borderRadius="4px"
                              bg="linear-gradient(135deg, #f97316, #fbbf24)">
                              <Text fontSize="7px" fontWeight="800" color="white">HOT</Text>
                            </Box>
                          )}
                        </Flex>
                        {form.slug && <Text fontSize="10px" color="#94a3b8">/{form.slug}</Text>}
                      </Box>
                    </Flex>
                    {form.description && (
                      <Text fontSize="11.5px" color="#64748b" lineHeight="1.6" noOfLines={2}>
                        {form.description}
                      </Text>
                    )}
                    <Flex mt="10px" align="center" gap="6px">
                      <Box w="6px" h="6px" borderRadius="full"
                        bg={form.status === "active" ? "#10b981" : "#9ca3af"} />
                      <Text fontSize="10px" fontWeight="600"
                        color={form.status === "active" ? "#059669" : "#6b7280"}>
                        {form.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
                      </Text>
                    </Flex>
                  </Box>
                </Box>

                {/* Color swatch */}
                <Box mt="14px" p="10px 12px" borderRadius="9px" bg={getPalette(form.color).bg}
                  border={`1px solid ${getPalette(form.color).border}`}
                >
                  <Text fontSize="9px" fontWeight="700" color="#94a3b8" textTransform="uppercase"
                    letterSpacing="0.7px" mb="6px">
                    Bảng màu
                  </Text>
                  <Flex gap="6px">
                    {[form.color, getPalette(form.color).bg, getPalette(form.color).border, getPalette(form.color).light].map((c, i) => (
                      <Box key={i} flex="1" h="24px" borderRadius="5px" bg={c}
                        border="1px solid rgba(0,0,0,0.08)" />
                    ))}
                  </Flex>
                </Box>
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center" h="160px" color="#cbd5e1">
                <Icon as={MdCategory} boxSize="28px" mb="6px" />
                <Text fontSize="12px" color="#94a3b8">Nhập tên thể loại để xem trước</Text>
              </Flex>
            )}
          </Box>
        </Box>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 22px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h="44px" px="22px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h="44px" px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 18px rgba(249,115,22,0.38)"
            _hover={{ boxShadow: "0 8px 28px rgba(249,115,22,0.48)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Thêm thể loại" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteConfirm({ genre, onConfirm, onCancel }) {
  return (
    <Box
      position="fixed" inset="0" bg="rgba(15,23,42,0.45)" backdropFilter="blur(4px)"
      zIndex="9999" display="flex" alignItems="center" justifyContent="center"
      p="16px"
      sx={{ animation: `${fadeIn} 0.2s ease both` }}
      onClick={onCancel}
    >
      <Box
        bg="white" borderRadius="20px" p="28px" maxW="400px" w="100%"
        boxShadow="0 20px 60px rgba(0,0,0,0.2)"
        sx={{ animation: `${scaleIn} 0.25s ease both` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex direction="column" align="center" textAlign="center">
          <Box w="56px" h="56px" borderRadius="full" bg="#fef2f2" border="2px solid #fca5a5"
            display="flex" alignItems="center" justifyContent="center" mb="16px"
          >
            <Icon as={MdDelete} boxSize="24px" color="#ef4444" />
          </Box>
          <Text fontSize="18px" fontWeight="800" color="#0f172a" mb="8px">Xóa thể loại</Text>
          <Text fontSize="13px" color="#64748b" lineHeight="1.6" mb="20px">
            Bạn có chắc muốn xóa thể loại <strong style={{ color: "#0f172a" }}>"{genre?.name}"</strong>?
            Hành động này không thể hoàn tác.
          </Text>
          <Flex gap="10px" w="100%">
            <Button flex="1" h="42px" borderRadius="10px" variant="ghost"
              color="#64748b" border="1.5px solid #e2e8f0"
              _hover={{ bg: "#f8fafc" }} fontWeight="600"
              onClick={onCancel}
            >
              Hủy bỏ
            </Button>
            <Button flex="1" h="42px" borderRadius="10px"
              bg="linear-gradient(135deg, #ef4444, #f87171)"
              color="white" fontWeight="700"
              boxShadow="0 4px 14px rgba(239,68,68,0.35)"
              _hover={{ boxShadow: "0 6px 20px rgba(239,68,68,0.45)", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              onClick={onConfirm}
            >
              Xóa ngay
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanLyTheLoai() {
  const [view, setView] = useState("list");          // list | add | edit
  const [selected, setSelected] = useState(null);
  const [genres, setGenres] = useState(INITIAL_GENRES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = genres.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch = g.name.toLowerCase().includes(q) || g.slug.includes(q) || g.description.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total:    genres.length,
    active:   genres.filter((g) => g.status === "active").length,
    featured: genres.filter((g) => g.featured && g.status === "active").length,
    movies:   genres.reduce((s, g) => s + g.movieCount, 0),
  };

  const handleSave = (form) => {
    if (view === "add") {
      setGenres((prev) => [
        ...prev,
        { ...form, id: Date.now(), movieCount: 0, createdAt: new Date().toLocaleDateString("vi-VN") },
      ]);
    } else {
      setGenres((prev) => prev.map((g) => g.id === selected.id ? { ...g, ...form } : g));
    }
    setView("list");
    setSelected(null);
  };

  const handleToggle = (id) => {
    setGenres((prev) => prev.map((g) =>
      g.id === id ? { ...g, status: g.status === "active" ? "inactive" : "active" } : g
    ));
  };

  const handleDelete = (id) => {
    setGenres((prev) => prev.filter((g) => g.id !== id));
    setDeleteTarget(null);
  };

  // ── FORM VIEW ──
  if (view === "add" || view === "edit") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <GenreForm
          isAdd={view === "add"}
          genre={view === "edit" ? genres.find((g) => g.id === selected?.id) : null}
          onCancel={() => { setView("list"); setSelected(null); }}
          onSave={handleSave}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Delete confirm overlay */}
      {deleteTarget && (
        <DeleteConfirm
          genre={genres.find((g) => g.id === deleteTarget)}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Page header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="20px" gap="14px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="12px" mb="5px">
            <Box w="42px" h="42px" borderRadius="13px"
              bg="linear-gradient(135deg, #f97316, #fbbf24)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.4)"
            >
              <Icon as={FaLayerGroup} boxSize="17px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base: "22px", md: "27px" }} fontWeight="900" color="#0f172a" letterSpacing="-0.6px">
                Quản lý thể loại
              </Text>
              <Text color="#94a3b8" fontSize="12.5px">
                Phân loại và tổ chức danh mục phim trong hệ thống
              </Text>
            </Box>
          </Flex>
        </Box>

        <Button
          h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
          color="white" boxShadow="0 4px 16px rgba(249,115,22,0.38)"
          _hover={{ boxShadow: "0 8px 26px rgba(249,115,22,0.48)", transform: "translateY(-2px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} boxSize="16px" />}
          onClick={() => setView("add")}
          w={{ base: "100%", md: "auto" }}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
        >
          Thêm thể loại
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="22px">
        <StatCard label="Tổng thể loại" value={counts.total}    icon={FaLayerGroup} accent="#f97316" delay={0}    sub="thể loại phim" />
        <StatCard label="Đang hiện"     value={counts.active}   icon={MdPlayCircle} accent="#10b981" delay={0.06} sub="đang hoạt động" />
        <StatCard label="Nổi bật"       value={counts.featured} icon={MdStar}       accent="#f59e0b" delay={0.12} sub="có badge HOT" />
        <StatCard label="Tổng số phim"  value={counts.movies}   icon={MdLocalMovies} accent="#8b5cf6" delay={0.18} sub="phim đã phân loại" />
      </SimpleGrid>

      {/* Main table/grid card */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
      >
        {/* Accent top bar */}
        <Box h="3px" borderTopRadius="18px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 4s linear infinite` }}
        />

        {/* Card header */}
        <Box p={{ base: "14px 16px 12px", md: "20px 22px 14px" }}
          borderBottom="1px solid #f8fafc"
        >
          <Flex align="center" justify="space-between" mb="14px">
            <Flex align="center" gap="10px">
              <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                Danh sách thể loại
              </Text>
              <Box px="8px" py="2px" borderRadius="7px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="800" color="#f97316">{filtered.length} thể loại</Text>
              </Box>
            </Flex>

            {/* Mobile filter toggle */}
            <Button
              display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: "#f1f5f9" }}
              onClick={() => setShowFilter((v) => !v)}
            >
              Lọc {showFilter ? "▲" : "▼"}
            </Button>
          </Flex>

          {/* Search + filter */}
          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}
            sx={showFilter ? { animation: `${slideDown} 0.25s ease both` } : {}}
          >
            <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1">
                <Icon as={MdSearch} position="absolute" left="11px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1"
                />
                <Input
                  pl="32px" h={{ base: "42px", md: "36px" }} fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên thể loại, slug, mô tả..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              {/* Status filter pills */}
              <Flex gap="6px" flexShrink="0" flexWrap="wrap">
                {[
                  { key: "all",      label: "Tất cả",    color: "#f97316" },
                  { key: "active",   label: "Đang hiện", color: "#10b981" },
                  { key: "inactive", label: "Đang ẩn",   color: "#94a3b8" },
                ].map(({ key, label, color }) => (
                  <Button key={key}
                    h={{ base: "42px", md: "36px" }} px="14px" borderRadius="9px"
                    fontSize="12px" fontWeight="700"
                    bg={filterStatus === key ? `${color}18` : "#f8fafc"}
                    color={filterStatus === key ? color : "#64748b"}
                    border={filterStatus === key ? `1.5px solid ${color}55` : "1px solid #e8edf3"}
                    _hover={{ bg: `${color}15`, color }}
                    transition="all 0.15s"
                    onClick={() => setFilterStatus(key)}
                  >
                    {label}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Grid */}
        <Box p={{ base: "12px", md: "16px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="52px">
              <Box w="60px" h="60px" borderRadius="18px" bg="#fff7ed" border="1px solid #fed7aa"
                display="flex" alignItems="center" justifyContent="center" mb="12px"
              >
                <Icon as={MdCategory} boxSize="26px" color="#f97316" />
              </Box>
              <Text fontSize="14px" fontWeight="700" color="#94a3b8">Không tìm thấy thể loại nào</Text>
              <Text fontSize="12px" color="#c0c8d4" mt="4px">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="12px">
              {filtered.map((genre, i) => (
                <GenreCard
                  key={genre.id} genre={genre} index={i}
                  onEdit={(g) => { setSelected(g); setView("edit"); }}
                  onDelete={(id) => setDeleteTarget(id)}
                  onToggle={handleToggle}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <Box px={{ base: "16px", md: "22px" }} py="14px"
            borderTop="1px solid #f8fafc"
          >
            <Flex align="center" justify="space-between" flexWrap="wrap" gap="8px">
              <Text fontSize="11.5px" color="#94a3b8" fontWeight="500">
                Hiển thị <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> / {genres.length} thể loại
              </Text>
              <Flex gap="12px">
                <Flex align="center" gap="5px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#10b981" />
                  <Text fontSize="10.5px" color="#64748b" fontWeight="600">{counts.active} hiện</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Box w="6px" h="6px" borderRadius="full" bg="#9ca3af" />
                  <Text fontSize="10.5px" color="#64748b" fontWeight="600">{genres.length - counts.active} ẩn</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Icon as={MdStar} boxSize="10px" color="#f59e0b" />
                  <Text fontSize="10.5px" color="#64748b" fontWeight="600">{counts.featured} nổi bật</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}