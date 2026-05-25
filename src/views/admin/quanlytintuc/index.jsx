import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  FormControl, Input, Select, Textarea, Switch,
  Icon, keyframes,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack,
  MdCalendarToday, MdClose, MdCheckCircle,
  MdPerson, MdSearch, MdFilterList, MdImageSearch,
  MdVisibilityOff, MdArticle, MdSchedule, MdLabel,
  MdPublish, MdDrafts, MdPause, MdTrendingUp,
  MdRemoveRedEye, MdThumbUp, MdComment, MdLink,
  MdLocalOffer, MdAccessTime, MdNotes, MdNewspaper,
} from "react-icons/md";
import { FaNewspaper, FaRegClock, FaPenAlt, FaRegEye } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.45; }`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Status config ──────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Đã đăng":   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Bản nháp":  { color: "#64748b", bg: "#f8fafc", border: "#cbd5e1", dot: "#94a3b8" },
  "Hẹn giờ":   { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", dot: "#8b5cf6" },
  "Tạm ẩn":    { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
};

const CATEGORY_CFG = {
  "Tin tức":     { color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
  "Review phim": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  "Sự kiện":     { color: "#be185d", bg: "#fdf2f8", border: "#f9a8d4" },
  "Hậu trường":  { color: "#065f46", bg: "#ecfdf5", border: "#6ee7b7" },
  "Khuyến mãi":  { color: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
};

// ─── Sample data ─────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    title: "Avengers: Endgame – Bom tấn thiên niên kỷ chính thức phá kỷ lục phòng vé toàn cầu",
    slug: "avengers-endgame-pha-ky-luc-phong-ve",
    category: "Tin tức",
    tags: ["Marvel", "Avengers", "Phòng vé"],
    status: "Đã đăng",
    author: "Nguyễn Văn Minh",
    publishDate: "2026-05-18",
    scheduledDate: "",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
    excerpt: "Sau khi chính thức ra mắt toàn cầu, Avengers: Endgame đã thiết lập kỷ lục doanh thu mới trong lịch sử điện ảnh thế giới với hơn 2.79 tỷ đô la...",
    content: "",
    linkedMovie: "Avengers: Endgame",
    views: 12840,
    likes: 342,
    comments: 87,
    featured: true,
  },
  {
    id: 2,
    title: "Review Spider-Man: No Way Home – Đỉnh cao của vũ trụ điện ảnh Marvel",
    slug: "review-spider-man-no-way-home",
    category: "Review phim",
    tags: ["Spider-Man", "Marvel", "Review"],
    status: "Đã đăng",
    author: "Trần Thị Lan",
    publishDate: "2026-05-15",
    scheduledDate: "",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg",
    excerpt: "Spider-Man: No Way Home không chỉ là một bộ phim siêu anh hùng – đây là một bức thư tình gửi tới toàn bộ thế hệ fan đã gắn bó với nhân vật...",
    content: "",
    linkedMovie: "Spider-Man: No Way Home",
    views: 9200,
    likes: 589,
    comments: 134,
    featured: true,
  },
  {
    id: 3,
    title: "Hậu trường Doctor Strange – Những cảnh quay không tưởng",
    slug: "hau-truong-doctor-strange-multiverse",
    category: "Hậu trường",
    tags: ["Doctor Strange", "Hậu trường", "VFX"],
    status: "Bản nháp",
    author: "Lê Quốc Hùng",
    publishDate: "",
    scheduledDate: "",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg",
    excerpt: "Những tiết lộ thú vị từ đội ngũ kỹ xảo VFX đứng sau những cảnh quay đa vũ trụ đầy ấn tượng trong Doctor Strange in the Multiverse of Madness.",
    content: "",
    linkedMovie: "Doctor Strange in the Multiverse of Madness",
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
  },
  {
    id: 4,
    title: "Ưu đãi đặc biệt tháng 6 – Mua vé Thor: Love and Thunder giảm 30%",
    slug: "uu-dai-thang-6-thor-love-thunder",
    category: "Khuyến mãi",
    tags: ["Thor", "Khuyến mãi", "Giảm giá"],
    status: "Hẹn giờ",
    author: "Phạm Thu Hà",
    publishDate: "",
    scheduledDate: "2026-06-01T08:00",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg",
    excerpt: "Nhân dịp ra mắt Thor: Love and Thunder, Gấu Phim triển khai chương trình khuyến mãi đặc biệt – giảm 30% tất cả các suất chiếu trong tuần đầu tiên.",
    content: "",
    linkedMovie: "Thor: Love and Thunder",
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
  },
  {
    id: 5,
    title: "Sự kiện ra mắt phim Marvels tại rạp Gấu Phim CGV – Gặp gỡ diễn viên",
    slug: "su-kien-ra-mat-the-marvels",
    category: "Sự kiện",
    tags: ["Sự kiện", "Marvels", "Ra mắt phim"],
    status: "Tạm ẩn",
    author: "Nguyễn Văn Minh",
    publishDate: "2026-05-10",
    scheduledDate: "",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/3/32/The_Marvels_poster.jpg",
    excerpt: "Buổi ra mắt phim The Marvels tại hệ thống rạp Gấu Phim thu hút hàng trăm khán giả. Đây là một trong những sự kiện điện ảnh đáng nhớ nhất năm.",
    content: "",
    linkedMovie: "",
    views: 3410,
    likes: 98,
    comments: 22,
    featured: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function SectionTitle({ label, icon: IcProp }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #f97316)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg, #e2e8f0, transparent)" />
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Bản nháp"];
  const animated = status === "Đã đăng";
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={animated ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function CategoryBadge({ category }) {
  const cfg = CATEGORY_CFG[category] || { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="700" color={cfg.color}>{category}</Text>
    </Box>
  );
}

function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p={{ base: "14px 16px", md: "18px 20px" }} borderRadius="16px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 6px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.45s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "10px", md: "11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base: "24px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w={{ base: "38px", md: "44px" }} h={{ base: "38px", md: "44px" }} borderRadius="14px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "16px", md: "20px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Article Row ─────────────────────────────────────────────────────────────
function ArticleRow({ article, index, onView, onEdit, onToggleStatus }) {
  const isPublished = article.status === "Đã đăng";

  return (
    <>
      {/* MOBILE */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg="white"
        border="1.5px solid #f1f5f9" transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 14px rgba(249,115,22,0.10)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" mb="12px">
          <Box w="72px" h="52px" borderRadius="10px" overflow="hidden" flexShrink="0">
            <img src={article.thumbnail} alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }} />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={2} mb="6px" lineHeight="1.4">
              {article.title}
            </Text>
            <Flex gap="6px" flexWrap="wrap">
              <StatusBadge status={article.status} />
              <CategoryBadge category={article.category} />
            </Flex>
          </Box>
        </Flex>
        <Flex gap="12px" mb="10px" flexWrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdPerson} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11px" color="#64748b" fontWeight="600">{article.author}</Text>
          </Flex>
          {article.publishDate && (
            <Flex align="center" gap="4px">
              <Icon as={MdCalendarToday} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#94a3b8">{article.publishDate}</Text>
            </Flex>
          )}
          <Flex align="center" gap="4px">
            <Icon as={MdRemoveRedEye} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11px" color="#64748b">{article.views.toLocaleString()}</Text>
          </Flex>
        </Flex>
        <Flex gap="8px">
          <Button flex="1" size="sm" h="36px" borderRadius="9px" bg="#f8fafc"
            color="#475569" border="1px solid #e2e8f0" fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: "#f1f5f9" }} transition="all 0.15s" onClick={() => onView(article)}>
            Xem
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s" onClick={() => onEdit(article)}>
            Sửa
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px" bg="#f8fafc"
            color={isPublished ? "#b45309" : "#059669"}
            border={isPublished ? "1px solid #fcd34d" : "1px solid #6ee7b7"}
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={isPublished ? MdVisibilityOff : MdPublish} boxSize="13px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggleStatus(article)}>
            {isPublished ? "Ẩn" : "Đăng"}
          </Button>
        </Flex>
      </Box>

      {/* DESKTOP */}
      <Box display={{ base: "none", md: "block" }}
        p="13px 18px" borderRadius="12px" bg="white"
        border="1.5px solid #f1f5f9" transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 14px rgba(249,115,22,0.08)", bg: "#f8fbff" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center">
          {/* Index */}
          <Box w="30px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color="#cbd5e1">
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
          {/* Thumbnail */}
          <Box w="80px" h="52px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px">
            <img src={article.thumbnail} alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.background = "#f1f5f9"; e.target.style.display = "none"; }} />
          </Box>
          {/* Title + excerpt */}
          <Box flex="2.5" minW="0" pr="16px">
            <Flex align="center" gap="6px" mb="3px">
              {article.featured && (
                <Box px="5px" py="1px" borderRadius="4px" bg="#fef3c7" border="1px solid #fcd34d">
                  <Text fontSize="9px" fontWeight="800" color="#b45309" letterSpacing="0.5px">NỔI BẬT</Text>
                </Box>
              )}
              <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{article.title}</Text>
            </Flex>
            <Text fontSize="11.5px" color="#94a3b8" noOfLines={1}>{article.excerpt}</Text>
          </Box>
          {/* Category */}
          <Box flex="0.9" minW="0" pr="12px">
            <CategoryBadge category={article.category} />
          </Box>
          {/* Status */}
          <Box flex="0.9" minW="0" pr="12px">
            <StatusBadge status={article.status} />
          </Box>
          {/* Author + date */}
          <Box flex="1" minW="0" pr="12px">
            <Flex align="center" gap="4px" mb="2px">
              <Icon as={MdPerson} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11.5px" fontWeight="600" color="#475569" noOfLines={1}>{article.author}</Text>
            </Flex>
            <Text fontSize="10.5px" color="#94a3b8">
              {article.publishDate || (article.scheduledDate ? `⏰ ${article.scheduledDate.slice(0, 10)}` : "—")}
            </Text>
          </Box>
          {/* Stats */}
          <Box flex="0.7" minW="0" pr="12px">
            <Flex align="center" gap="5px" mb="2px">
              <Icon as={MdRemoveRedEye} boxSize="11px" color="#94a3b8" />
              <Text fontSize="12px" fontWeight="700" color="#0f172a">{article.views.toLocaleString()}</Text>
            </Flex>
            <Flex align="center" gap="5px">
              <Icon as={MdThumbUp} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#94a3b8">{article.likes}</Text>
            </Flex>
          </Box>
          {/* Actions */}
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: "#f1f5f9" }} transition="all 0.15s"
              onClick={() => onView(article)}>Xem</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(article)}>Sửa</Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={isPublished ? "#fffbeb" : "#ecfdf5"}
              color={isPublished ? "#b45309" : "#059669"}
              border={isPublished ? "1px solid #fcd34d" : "1px solid #6ee7b7"}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={isPublished ? MdVisibilityOff : MdPublish} boxSize="12px" />}
              _hover={{ opacity: 0.85 }} transition="all 0.15s"
              onClick={() => onToggleStatus(article)}>
              {isPublished ? "Ẩn" : "Đăng"}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

// ─── Article Form ─────────────────────────────────────────────────────────────
function ArticleForm({ article, onCancel, onSave, isAdd = false }) {
  const empty = {
    title: "", slug: "", category: "Tin tức", tags: "",
    status: "Bản nháp", author: "", publishDate: "", scheduledDate: "",
    thumbnail: "", excerpt: "", content: "", linkedMovie: "", featured: false,
  };
  const [form, setForm] = useState(article
    ? { ...article, tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags }
    : empty
  );
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autoSlug = (title) => title.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} flexShrink="0"
          onClick={onCancel}>
          Quay lại
        </Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.4px">
            {isAdd ? "✍️ Viết bài mới" : `Chỉnh sửa: ${article?.title}`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">
            {isAdd ? "Soạn và đăng bài tin tức, review phim, sự kiện" : "Cập nhật nội dung bài viết"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 320px" }} gap="16px">
        {/* ── LEFT ── */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin bài viết" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tiêu đề *</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="Nhập tiêu đề bài viết..."
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (isAdd) set("slug", autoSlug(e.target.value));
                  }} />
              </FormControl>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Slug (URL)</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="ten-bai-viet-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)} />
              </FormControl>
            </Box>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Danh mục *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.category}
                    onChange={(e) => set("category", e.target.value)}>
                    <option>Tin tức</option>
                    <option>Review phim</option>
                    <option>Sự kiện</option>
                    <option>Hậu trường</option>
                    <option>Khuyến mãi</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Trạng thái *</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.status}
                    onChange={(e) => set("status", e.target.value)}>
                    <option>Bản nháp</option>
                    <option>Đã đăng</option>
                    <option>Hẹn giờ</option>
                    <option>Tạm ẩn</option>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Tác giả</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="Tên tác giả"
                    value={form.author} onChange={(e) => set("author", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Phim liên quan</Text>
                <FormControl>
                  <Input {...inputStyle} placeholder="Tên phim (nếu có)"
                    value={form.linkedMovie} onChange={(e) => set("linkedMovie", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            <Box mb="14px">
              <Text sx={labelStyle}>Tags (phân cách bằng dấu phẩy)</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Marvel, Avengers, Phòng vé"
                  value={form.tags} onChange={(e) => set("tags", e.target.value)} />
              </FormControl>
            </Box>
            {form.status === "Hẹn giờ" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Thời gian đăng bài *</Text>
                <FormControl>
                  <Input {...inputStyle} type="datetime-local"
                    value={form.scheduledDate} onChange={(e) => set("scheduledDate", e.target.value)} />
                </FormControl>
              </Box>
            )}
            {form.status === "Đã đăng" && (
              <Box mb="14px" sx={{ animation: `${fadeIn} 0.25s ease both` }}>
                <Text sx={labelStyle}>Ngày đăng</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} />
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Excerpt */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Mô tả ngắn & Nội dung" />
            <Box mb="14px">
              <Text sx={labelStyle}>Mô tả ngắn (excerpt)</Text>
              <FormControl>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={3}
                  placeholder="Viết mô tả ngắn hiển thị trên trang danh sách..."
                  value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
                />
              </FormControl>
            </Box>
            <Box>
              <Text sx={labelStyle}>Nội dung bài viết</Text>
              <FormControl>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.1)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={10}
                  placeholder="Nhập nội dung đầy đủ của bài viết (hỗ trợ HTML/Markdown)..."
                  value={form.content} onChange={(e) => set("content", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </Flex>

        {/* ── RIGHT ── */}
        <Flex direction="column" gap="14px">
          {/* Thumbnail */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Ảnh đại diện" />
            <Text sx={labelStyle} mb="7px">URL ảnh thumbnail</Text>
            <FormControl mb="12px">
              <Input {...inputStyle} placeholder="https://..."
                value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} />
            </FormControl>
            {form.thumbnail ? (
              <Box borderRadius="10px" overflow="hidden" border="1px solid #f1f5f9">
                <img src={form.thumbnail} alt="thumbnail"
                  style={{ width: "100%", display: "block", maxHeight: "180px", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }} />
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="130px" borderRadius="10px" bg="#f8fafc" border="2px dashed #e2e8f0"
              >
                <Icon as={MdImageSearch} boxSize="26px" color="#cbd5e1" mb="6px" />
                <Text fontSize="11.5px" color="#94a3b8">Nhập URL để xem trước ảnh</Text>
              </Flex>
            )}
            <Button w="100%" h="36px" mt="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              _hover={{ bg: "#f1f5f9" }} transition="all 0.2s"
              leftIcon={<Icon as={MdImageSearch} boxSize="13px" />}
            >
              Tải lên từ máy tính
            </Button>
          </Box>

          {/* Settings */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Cài đặt bài viết" />
            <Flex align="center" justify="space-between" mb="16px">
              <Box>
                <Text fontSize="13px" fontWeight="700" color="#0f172a">Bài viết nổi bật</Text>
                <Text fontSize="11px" color="#94a3b8" mt="2px">Hiển thị trên banner trang chủ</Text>
              </Box>
              <Switch colorScheme="orange" size="md"
                isChecked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
            </Flex>
            <Box h="1px" bg="#f1f5f9" mb="14px" />
            {/* Preview mini */}
            {form.title && (
              <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
                <Text fontSize="10px" color="#94a3b8" fontWeight="700" letterSpacing="0.8px"
                  textTransform="uppercase" mb="8px">Xem trước</Text>
                <Flex direction="column" gap="8px">
                  <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={2}>{form.title}</Text>
                  <Flex gap="6px" flexWrap="wrap">
                    {form.status && <StatusBadge status={form.status} />}
                    {form.category && <CategoryBadge category={form.category} />}
                  </Flex>
                  {form.author && (
                    <Flex align="center" gap="5px">
                      <Icon as={MdPerson} boxSize="11px" color="#94a3b8" />
                      <Text fontSize="11.5px" color="#64748b" fontWeight="600">{form.author}</Text>
                    </Flex>
                  )}
                  {form.tags && (
                    <Flex gap="5px" flexWrap="wrap">
                      {form.tags.split(",").filter(t => t.trim()).slice(0, 3).map(t => (
                        <Box key={t} px="6px" py="2px" borderRadius="5px" bg="#fff7ed" border="1px solid #fed7aa">
                          <Text fontSize="10px" fontWeight="600" color="#c2410c"># {t.trim()}</Text>
                        </Box>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom={{ base: "0" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f97316 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) })}>
            {isAdd ? "Đăng bài" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────
function ArticleDetail({ article, onBack, onEdit }) {
  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="16px" gap="10px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}>
          <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
        </Button>
        <Button h="38px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdEdit} />} onClick={onEdit}>
          Chỉnh sửa
        </Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 14px rgba(0,0,0,0.06)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #f97316, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        {/* Thumbnail full width on mobile */}
        {article.thumbnail && (
          <Box w="100%" h={{ base: "200px", md: "280px" }} overflow="hidden">
            <img src={article.thumbnail} alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        )}
        <Box p={{ base: "18px", md: "28px" }}>
          <Flex gap="8px" mb="12px" flexWrap="wrap" align="center">
            <StatusBadge status={article.status} />
            <CategoryBadge category={article.category} />
            {article.featured && (
              <Box px="7px" py="3px" borderRadius="6px" bg="#fef3c7" border="1px solid #fcd34d">
                <Text fontSize="10px" fontWeight="800" color="#b45309">✦ NỔI BẬT</Text>
              </Box>
            )}
          </Flex>
          <Text fontSize={{ base: "18px", md: "24px" }} fontWeight="800" color="#0f172a"
            letterSpacing="-0.4px" lineHeight="1.3" mb="12px">
            {article.title}
          </Text>

          {/* Meta row */}
          <Flex gap="16px" flexWrap="wrap" mb="16px">
            <Flex align="center" gap="5px">
              <Icon as={MdPerson} boxSize="13px" color="#94a3b8" />
              <Text fontSize="12px" fontWeight="600" color="#475569">{article.author}</Text>
            </Flex>
            {article.publishDate && (
              <Flex align="center" gap="5px">
                <Icon as={MdCalendarToday} boxSize="13px" color="#94a3b8" />
                <Text fontSize="12px" color="#94a3b8">{article.publishDate}</Text>
              </Flex>
            )}
            {article.linkedMovie && (
              <Flex align="center" gap="5px">
                <Icon as={MdLink} boxSize="13px" color="#f97316" />
                <Text fontSize="12px" fontWeight="600" color="#f97316">{article.linkedMovie}</Text>
              </Flex>
            )}
          </Flex>

          <Box h="1px" bg="#f1f5f9" mb="16px" />

          {/* Stats */}
          <SimpleGrid columns={{ base: 3, md: 3 }} spacing="10px" mb="16px">
            {[
              { icon: MdRemoveRedEye, label: "Lượt xem", val: article.views.toLocaleString() },
              { icon: MdThumbUp,      label: "Thích",     val: article.likes },
              { icon: MdComment,      label: "Bình luận", val: article.comments },
            ].map(({ icon: Ic, label, val }) => (
              <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="5px" mb="3px">
                  <Icon as={Ic} boxSize="11px" color="#f97316" />
                  <Text fontSize="9px" fontWeight="700" color="#94a3b8" letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize={{ base: "14px", md: "15px" }} fontWeight="800" color="#0f172a">{val}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Excerpt */}
          <Box p="14px 16px" borderRadius="12px" bg="#fff7ed" border="1px solid #fed7aa">
            <Text fontSize="10px" fontWeight="800" color="#c2410c" letterSpacing="1px"
              textTransform="uppercase" mb="6px">Mô tả ngắn</Text>
            <Text fontSize={{ base: "12.5px", md: "13.5px" }} color="#334155" lineHeight="1.75">
              {article.excerpt}
            </Text>
          </Box>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <Flex gap="7px" mt="14px" flexWrap="wrap" align="center">
              <Icon as={MdLocalOffer} boxSize="12px" color="#94a3b8" />
              {article.tags.map(tag => (
                <Box key={tag} px="8px" py="3px" borderRadius="6px"
                  bg="#fff7ed" border="1px solid #fed7aa"
                >
                  <Text fontSize="11px" fontWeight="600" color="#c2410c"># {tag}</Text>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* Slug + URL info */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
        sx={{ animation: `${fadeUp} 0.4s ease both` }}
      >
        <Flex align="center" gap="8px" mb="8px">
          <Box w="28px" h="28px" borderRadius="8px" bg="#fff7ed"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={MdLink} boxSize="13px" color="#f97316" />
          </Box>
          <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px" textTransform="uppercase">
            Đường dẫn bài viết
          </Text>
        </Flex>
        <Box px="12px" py="8px" borderRadius="8px" bg="#f8fafc" border="1px solid #e2e8f0">
          <Text fontSize="12.5px" fontWeight="600" color="#f97316">
            /tin-tuc/{article.slug}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanLyTinTuc() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [articles, setArticles] = useState(ARTICLES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      (a.linkedMovie || "").toLowerCase().includes(q);
    const matchStatus   = filterStatus   === "Tất cả" || a.status   === filterStatus;
    const matchCategory = filterCategory === "Tất cả" || a.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const counts = {
    total:     articles.length,
    published: articles.filter(a => a.status === "Đã đăng").length,
    draft:     articles.filter(a => a.status === "Bản nháp").length,
    scheduled: articles.filter(a => a.status === "Hẹn giờ").length,
  };

  const totalViews = articles.reduce((s, a) => s + a.views, 0);

  const handleToggleStatus = (art) => {
    setArticles(prev => prev.map(a =>
      a.id === art.id
        ? { ...a, status: a.status === "Đã đăng" ? "Tạm ẩn" : "Đã đăng",
            publishDate: a.status !== "Đã đăng" ? new Date().toISOString().slice(0, 10) : a.publishDate }
        : a
    ));
  };

  const handleSave = (form) => {
    if (view === "add") {
      setArticles(prev => [...prev, {
        ...form, id: Date.now(), views: 0, likes: 0, comments: 0,
      }]);
    } else {
      setArticles(prev => prev.map(a => a.id === selected.id ? { ...a, ...form } : a));
      setSelected(prev => ({ ...prev, ...form }));
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
            <Flex align="center" gap="12px" mb="5px">
              <Box w="42px" h="42px" borderRadius="13px"
                bg="linear-gradient(135deg, #f97316, #f97316)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              >
                <Icon as={FaNewspaper} boxSize="17px" color="white" />
              </Box>
              <Box>
                <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800"
                  color="#0f172a" letterSpacing="-0.5px" lineHeight="1">
                  Tin tức điện ảnh
                </Text>
                <Text color="#94a3b8" fontSize="13px" mt="2px">
                  Quản lý bài viết, review phim & sự kiện
                </Text>
              </Box>
            </Flex>
          </Box>
          <Button
            sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
            h="42px" px="22px" borderRadius="11px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 22px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} boxSize="16px" />}
            onClick={() => setView("add")}
          >
            Viết bài mới
          </Button>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
          <StatCard label="Tổng bài viết" value={counts.total}     icon={MdArticle}     accent="#f97316" delay={0}    />
          <StatCard label="Đã đăng"        value={counts.published} icon={MdPublish}      accent="#10b981" delay={0.05} sub={`${totalViews.toLocaleString()} lượt xem`} />
          <StatCard label="Bản nháp"       value={counts.draft}     icon={MdDrafts}       accent="#64748b" delay={0.1}  />
          <StatCard label="Hẹn giờ đăng"   value={counts.scheduled} icon={MdSchedule}     accent="#8b5cf6" delay={0.15} />
        </SimpleGrid>

        {/* Table card */}
        <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
          boxShadow="0 1px 6px rgba(0,0,0,0.04)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.12s both` }}
        >
          {/* Card header */}
          <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom="1px solid #f8fafc">
            <Flex align="center" justify="space-between" mb="12px">
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                  Danh sách bài viết
                </Text>
                <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} bài</Text>
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
              >
                Lọc
              </Button>
            </Flex>

            {/* Filters */}
            <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
              <Flex gap="10px" align="center" direction={{ base: "column", sm: "row" }}>
                <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                  <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                    transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                  <Input
                    pl="30px" h={{ base: "40px", md: "36px" }} w="100%" fontSize="12.5px" fontWeight="500"
                    placeholder="Tìm tiêu đề, tác giả, phim liên quan..."
                    bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                    _placeholder={{ color: "#b0bac8" }}
                    _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                    _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "160px", md: "150px" }}
                  _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option>Đã đăng</option>
                  <option>Bản nháp</option>
                  <option>Hẹn giờ</option>
                  <option>Tạm ẩn</option>
                </Select>
                <Select h={{ base: "40px", md: "36px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  w={{ base: "100%", sm: "160px", md: "150px" }}
                  _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="Tất cả">Tất cả danh mục</option>
                  <option>Tin tức</option>
                  <option>Review phim</option>
                  <option>Sự kiện</option>
                  <option>Hậu trường</option>
                  <option>Khuyến mãi</option>
                </Select>
              </Flex>
            </Box>
          </Box>

          {/* Desktop column headers */}
          <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
            display={{ base: "none", md: "flex" }} align="center"
          >
            <Box w="30px" flexShrink="0" />
            <Box w="80px" mr="14px" flexShrink="0" />
            <Box flex="2.5">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Tiêu đề / Mô tả
              </Text>
            </Box>
            <Box flex="0.9">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Danh mục</Text>
            </Box>
            <Box flex="0.9">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Trạng thái</Text>
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Tác giả / Ngày</Text>
            </Box>
            <Box flex="0.7">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Thống kê</Text>
            </Box>
            <Box w="200px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hành động</Text>
            </Box>
          </Flex>

          {/* Rows */}
          <Box p="10px">
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="48px" color="#cbd5e1">
                <Icon as={MdNewspaper} boxSize="36px" mb="10px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy bài viết nào</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="8px">
                {filtered.map((a, i) => (
                  <ArticleRow key={a.id} article={a} index={i}
                    onView={(art) => { setSelected(art); setView("detail"); }}
                    onEdit={(art) => { setSelected(art); setView("edit"); }}
                    onToggleStatus={handleToggleStatus}
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
        <ArticleDetail
          article={articles.find(a => a.id === selected.id) || selected}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ArticleForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ArticleForm
          article={articles.find(a => a.id === selected.id) || selected}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}