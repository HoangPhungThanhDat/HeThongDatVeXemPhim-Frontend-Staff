import React, { useState, useRef } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  FormControl, Input, Select, Textarea,
  Icon, Switch,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack,
  MdClose, MdCheckCircle, MdSearch,
  MdImageSearch, MdDragIndicator, MdLink,
  MdSchedule, MdToggleOn, MdToggleOff,
  MdImage, MdOpenInNew, MdArrowUpward, MdArrowDownward,
  MdDeleteForever, MdVisibilityOff, MdLayers,
  MdCalendarToday, MdLocalOffer,
} from "react-icons/md";
import { FaImage, FaRegClock } from "react-icons/fa";
import Card from "components/card/Card";

import { keyframes } from "@chakra-ui/react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
`;

const STATUS_CONFIG = {
  "Đang hiện": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã ẩn":     { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  "Hẹn giờ":   { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
};

const LINK_TYPE_CONFIG = {
  "Phim":      { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: MdLocalOffer },
  "Khuyến mãi":{ color: "#0369a1", bg: "#eff6ff", border: "#93c5fd", icon: MdLocalOffer },
  "Không có":  { color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: MdLink },
};

const INITIAL_BANNERS = [
  {
    id: 1,
    title: "Banner Avengers – Mùa hè 2026",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
    status: "Đang hiện",
    order: 1,
    linkType: "Phim",
    linkTarget: "Avengers: Infinity War",
    scheduleStart: "2026-05-01T08:00",
    scheduleEnd: "2026-06-30T23:59",
    scheduledOn: false,
    note: "Banner chính trang chủ mùa hè",
  },
  {
    id: 2,
    title: "Khuyến mãi thứ 4 hàng tuần",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
    status: "Đang hiện",
    order: 2,
    linkType: "Khuyến mãi",
    linkTarget: "Thứ 4 vui vẻ – Giảm 30%",
    scheduleStart: "2026-05-01T00:00",
    scheduleEnd: "2026-12-31T23:59",
    scheduledOn: false,
    note: "Chạy quanh năm, kiểm tra lại cuối năm",
  },
  {
    id: 3,
    title: "Spider-Man Sắp Chiếu",
    image: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg",
    status: "Hẹn giờ",
    order: 3,
    linkType: "Phim",
    linkTarget: "Spider-Man: No Way Home",
    scheduleStart: "2026-06-01T08:00",
    scheduleEnd: "2026-07-31T23:59",
    scheduledOn: true,
    note: "Bật tự động vào 1/6",
  },
  {
    id: 4,
    title: "Banner Tết cũ – Lưu trữ",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80",
    status: "Đã ẩn",
    order: 4,
    linkType: "Không có",
    linkTarget: "",
    scheduleStart: "",
    scheduleEnd: "",
    scheduledOn: false,
    note: "Đã kết thúc chiến dịch Tết 2026",
  },
];

const MOVIE_OPTIONS = [
  "Avengers: Infinity War",
  "Spider-Man: No Way Home",
  "Doctor Strange in the Multiverse of Madness",
  "Thor: Love and Thunder",
];
const PROMO_OPTIONS = [
  "Thứ 4 vui vẻ – Giảm 30%",
  "Mua 1 tặng 1 cuối tuần",
  "Sinh nhật Gấu Phim – Giảm 50%",
];

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
    <Box p="14px 16px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "9.5px", md: "11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing="0.8px" textTransform="uppercase" mb="4px"
          >
            {label}
          </Text>
          <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">
            {value}
          </Text>
        </Box>
        <Box w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }}
          borderRadius="12px" bg={`${accent}15`}
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "15px", md: "18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Đã ẩn"];
  return (
    <Flex align="center" gap="5px" px="8px" py="4px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đang hiện" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="600" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function LinkBadge({ type }) {
  const cfg = LINK_TYPE_CONFIG[type] || LINK_TYPE_CONFIG["Không có"];
  return (
    <Box px="7px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="700" color={cfg.color}>{type}</Text>
    </Box>
  );
}

// ─── Banner Row – Desktop ────────────────────────────────────────────────────
function BannerRowDesktop({ banner, index, onView, onEdit, onHide, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <Box p="12px 16px" borderRadius="12px" bg="white"
      border="1.5px solid #f1f5f9" transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center" gap="0">
        <Box w="24px" flexShrink="0" cursor="grab" color="#cbd5e1"
          _hover={{ color: "#f97316" }} transition="color 0.15s"
        >
          <Icon as={MdDragIndicator} boxSize="16px" />
        </Box>

        <Box w="32px" flexShrink="0" mr="4px">
          <Box w="22px" h="22px" borderRadius="6px" bg="#fff7ed"
            border="1px solid #fed7aa"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Text fontSize="11px" fontWeight="800" color="#f97316">{banner.order}</Text>
          </Box>
        </Box>

        <Box w="80px" h="46px" borderRadius="8px" overflow="hidden" flexShrink="0" mr="14px"
          border="1px solid #f1f5f9"
        >
          <img src={banner.image} alt={banner.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        <Box flex="2.5" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{banner.title}</Text>
          <Flex align="center" gap="6px" mt="3px">
            <LinkBadge type={banner.linkType} />
            {banner.linkTarget && (
              <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{banner.linkTarget}</Text>
            )}
          </Flex>
        </Box>

        <Box flex="1.5" minW="0" pr="12px">
          {banner.scheduleStart ? (
            <>
              <Flex align="center" gap="4px" mb="2px">
                <Icon as={FaRegClock} boxSize="10px" color="#f97316" />
                <Text fontSize="11px" fontWeight="600" color="#475569">
                  {banner.scheduleStart.replace("T", " ").slice(0, 16)}
                </Text>
              </Flex>
              <Text fontSize="10px" color="#94a3b8">
                → {banner.scheduleEnd.replace("T", " ").slice(0, 16)}
              </Text>
            </>
          ) : (
            <Text fontSize="11px" color="#cbd5e1">Không hẹn giờ</Text>
          )}
        </Box>

        <Box flex="0.7" minW="0" pr="12px">
          <Flex align="center" gap="5px">
            <Switch isChecked={banner.scheduledOn} size="sm" colorScheme="orange" isReadOnly />
            <Text fontSize="11px" color={banner.scheduledOn ? "#f97316" : "#94a3b8"} fontWeight="600">
              {banner.scheduledOn ? "Bật" : "Tắt"}
            </Text>
          </Flex>
        </Box>

        <Box flex="0.9" minW="0" pr="12px">
          <StatusBadge status={banner.status} />
        </Box>

        <Flex gap="3px" mr="8px" flexShrink="0">
          <Button size="xs" h="26px" w="26px" p="0" borderRadius="6px"
            bg="#f8fafc" border="1px solid #e2e8f0" color="#94a3b8"
            _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
            isDisabled={isFirst} transition="all 0.15s"
            onClick={() => onMoveUp(banner.id)}
          >
            <Icon as={MdArrowUpward} boxSize="12px" />
          </Button>
          <Button size="xs" h="26px" w="26px" p="0" borderRadius="6px"
            bg="#f8fafc" border="1px solid #e2e8f0" color="#94a3b8"
            _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
            isDisabled={isLast} transition="all 0.15s"
            onClick={() => onMoveDown(banner.id)}
          >
            <Icon as={MdArrowDownward} boxSize="12px" />
          </Button>
        </Flex>

        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={() => onView(banner)}
          >Xem</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
            onClick={() => onEdit(banner)}
          >Sửa</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibilityOff} boxSize="12px" />}
            _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            transition="all 0.15s"
            onClick={() => onHide(banner.id)}
          >Ẩn</Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Banner Card – Mobile ────────────────────────────────────────────────────
function BannerCardMobile({ banner, index, onView, onEdit, onHide, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <Box borderRadius="14px" bg="white" border="1.5px solid #f1f5f9"
      overflow="hidden" transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      {/* Thumbnail strip */}
      <Box position="relative" h="130px" overflow="hidden">
        <img src={banner.image} alt={banner.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Box position="absolute" inset="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)"
        />
        {/* Order badge top-left */}
        <Box position="absolute" top="8px" left="10px"
          w="24px" h="24px" borderRadius="7px" bg="rgba(249,115,22,0.9)"
          display="flex" alignItems="center" justifyContent="center"
          boxShadow="0 2px 6px rgba(0,0,0,0.25)"
        >
          <Text fontSize="11px" fontWeight="800" color="white">{banner.order}</Text>
        </Box>
        {/* Status top-right */}
        <Box position="absolute" top="8px" right="10px">
          <StatusBadge status={banner.status} />
        </Box>
        {/* Title bottom */}
        <Box position="absolute" bottom="0" left="0" right="0" px="12px" pb="10px">
          <Text fontSize="13.5px" fontWeight="700" color="white" noOfLines={1}>{banner.title}</Text>
        </Box>
      </Box>

      {/* Info row */}
      <Box px="12px" pt="10px" pb="4px">
        <Flex align="center" gap="6px" flexWrap="wrap">
          <LinkBadge type={banner.linkType} />
          {banner.linkTarget && (
            <Text fontSize="11px" color="#64748b" fontWeight="500" noOfLines={1} flex="1" minW="0">
              {banner.linkTarget}
            </Text>
          )}
        </Flex>

        {banner.scheduleStart && (
          <Flex align="center" gap="5px" mt="7px">
            <Icon as={FaRegClock} boxSize="10px" color="#f97316" />
            <Text fontSize="10.5px" color="#64748b" fontWeight="500">
              {banner.scheduleStart.replace("T", " ").slice(0, 16)}
              <Text as="span" color="#94a3b8"> → </Text>
              {banner.scheduleEnd.replace("T", " ").slice(0, 16)}
            </Text>
          </Flex>
        )}

        <Flex align="center" gap="6px" mt="7px">
          <Text fontSize="10.5px" color="#94a3b8" fontWeight="500">Hẹn giờ:</Text>
          <Switch isChecked={banner.scheduledOn} size="sm" colorScheme="orange" isReadOnly />
          <Text fontSize="10.5px" color={banner.scheduledOn ? "#f97316" : "#94a3b8"} fontWeight="600">
            {banner.scheduledOn ? "Bật" : "Tắt"}
          </Text>
        </Flex>
      </Box>

      {/* Action bar */}
      <Flex px="10px" py="10px" gap="6px" borderTop="1px solid #f8fafc" mt="6px">
        {/* Sort arrows */}
        <Button size="xs" h="32px" w="32px" p="0" borderRadius="8px"
          bg="#f8fafc" border="1px solid #e2e8f0" color="#94a3b8"
          _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
          isDisabled={isFirst} transition="all 0.15s"
          onClick={() => onMoveUp(banner.id)}
        >
          <Icon as={MdArrowUpward} boxSize="13px" />
        </Button>
        <Button size="xs" h="32px" w="32px" p="0" borderRadius="8px"
          bg="#f8fafc" border="1px solid #e2e8f0" color="#94a3b8"
          _hover={{ bg: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}
          isDisabled={isLast} transition="all 0.15s"
          onClick={() => onMoveDown(banner.id)}
        >
          <Icon as={MdArrowDownward} boxSize="13px" />
        </Button>

        <Box flex="1" />

        <Button size="xs" h="32px" px="10px" borderRadius="8px"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
          onClick={() => onView(banner)}
        >Xem</Button>
        <Button size="xs" h="32px" px="10px" borderRadius="8px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdEdit} boxSize="12px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
          onClick={() => onEdit(banner)}
        >Sửa</Button>
        <Button size="xs" h="32px" px="10px" borderRadius="8px"
          bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
          fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdVisibilityOff} boxSize="12px" />}
          _hover={{ bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
          transition="all 0.15s"
          onClick={() => onHide(banner.id)}
        >Ẩn</Button>
      </Flex>
    </Box>
  );
}

// ─── Banner Row – switcher ───────────────────────────────────────────────────
function BannerRow(props) {
  return (
    <>
      <Box display={{ base: "none", lg: "block" }}>
        <BannerRowDesktop {...props} />
      </Box>
      <Box display={{ base: "block", lg: "none" }}>
        <BannerCardMobile {...props} />
      </Box>
    </>
  );
}

// ─── Banner Form ─────────────────────────────────────────────────────────────
function BannerForm({ banner, onCancel, onSave, isAdd = false }) {
  const emptyForm = {
    title: "", image: "", status: "Đang hiện",
    linkType: "Không có", linkTarget: "",
    scheduleStart: "", scheduleEnd: "",
    scheduledOn: false, note: "",
  };
  const [form, setForm] = useState(banner || emptyForm);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const linkOptions = form.linkType === "Phim" ? MOVIE_OPTIONS
    : form.linkType === "Khuyến mãi" ? PROMO_OPTIONS : [];

  // Shared preview block used in both mobile (inline) and desktop (sidebar)
  const PreviewBlock = ({ maxH = "180px" }) => (
    <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px", md: "18px" }}
    >
      <SectionTitle label="Xem trước banner" />
      {form.image ? (
        <Box borderRadius="10px" overflow="hidden" border="1px solid #f1f5f9">
          <img src={form.image} alt="preview"
            style={{ width: "100%", display: "block", maxHeight: maxH, objectFit: "cover" }} />
        </Box>
      ) : (
        <Flex direction="column" align="center" justify="center"
          h={{ base: "100px", md: "130px" }} borderRadius="10px"
          bg="#f8fafc" border="2px dashed #e2e8f0"
        >
          <Icon as={MdImageSearch} boxSize="26px" color="#cbd5e1" mb="6px" />
          <Text fontSize="12px" color="#94a3b8">Nhập URL để xem trước</Text>
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
  );

  // Summary block (desktop sidebar only)
  const SummaryBlock = () => form.title ? (
    <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
      sx={{ animation: `${fadeIn} 0.3s ease both` }}
    >
      <SectionTitle label="Tóm tắt" />
      <Flex direction="column" gap="10px">
        <Box>
          <Text fontSize="10px" color="#94a3b8" fontWeight="700" letterSpacing="0.8px"
            textTransform="uppercase" mb="3px">Tiêu đề</Text>
          <Text fontSize="13px" fontWeight="700" color="#0f172a">{form.title}</Text>
        </Box>
        <Flex gap="8px" flexWrap="wrap">
          <StatusBadge status={form.status} />
          <LinkBadge type={form.linkType} />
        </Flex>
        {form.linkTarget && (
          <Flex align="center" gap="6px">
            <Icon as={MdLink} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11.5px" color="#475569" fontWeight="600">{form.linkTarget}</Text>
          </Flex>
        )}
        {form.scheduledOn && form.scheduleStart && (
          <Flex align="center" gap="6px">
            <Icon as={MdSchedule} boxSize="11px" color="#f97316" />
            <Text fontSize="11px" color="#f97316" fontWeight="600">Hẹn giờ đang bật</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  ) : null;

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>

      {/* ── Header ── */}
      <Flex align="center" gap="10px" mb="18px" wrap="nowrap">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} flexShrink="0"
          px={{ base: "10px", md: "16px" }}
          onClick={onCancel}
        >
          <Box display={{ base: "none", sm: "block" }}>Quay lại</Box>
        </Button>
        <Box minW="0">
          <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="800" color="#0f172a"
            letterSpacing="-0.4px" noOfLines={1}
          >
            {isAdd ? "Thêm banner mới" : "Chỉnh sửa banner"}
          </Text>
          <Text fontSize="11.5px" color="#94a3b8" mt="1px" noOfLines={1}>
            {isAdd ? "Điền thông tin để thêm banner vào trang chủ" : banner?.title}
          </Text>
        </Box>
      </Flex>

      {/* ── Desktop 2-col / Mobile 1-col layout ── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="14px">

        {/* ════ LEFT COLUMN (all breakpoints) ════ */}
        <Flex direction="column" gap="12px">

          {/* 1. Thông tin cơ bản */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Flex direction="column" gap="12px">
              <Box>
                <Text sx={labelStyle}>Tiêu đề banner *</Text>
                <Input {...inputStyle} placeholder="VD: Banner Mùa Hè 2026"
                  value={form.title} onChange={(e) => set("title", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>URL ảnh banner *</Text>
                <Input {...inputStyle}
                  placeholder="https://... (tỉ lệ 16:5 khuyến nghị)"
                  value={form.image} onChange={(e) => set("image", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Ghi chú nội bộ</Text>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={2}
                  placeholder="Ghi chú cho nhóm nội dung..."
                  value={form.note} onChange={(e) => set("note", e.target.value)}
                />
              </Box>
            </Flex>
          </Box>

          {/* 2. Preview – mobile only (sau khi nhập URL) */}
          <Box display={{ base: "block", lg: "none" }}>
            <PreviewBlock maxH="160px" />
          </Box>

          {/* 3. Trạng thái hiển thị */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px", md: "20px" }}
          >
            <SectionTitle label="Trạng thái hiển thị" />
            <SimpleGrid columns={2} spacing="10px">
              {["Đang hiện", "Đã ẩn"].map((s) => (
                <Box key={s} p={{ base: "10px", md: "12px 14px" }} borderRadius="10px"
                  cursor="pointer"
                  bg={form.status === s ? (s === "Đang hiện" ? "#ecfdf5" : "#f9fafb") : "#f8fafc"}
                  border={form.status === s
                    ? `2px solid ${s === "Đang hiện" ? "#6ee7b7" : "#e5e7eb"}`
                    : "2px solid #f1f5f9"}
                  transition="all 0.2s"
                  onClick={() => set("status", s)}
                >
                  <Flex align="center" gap="8px">
                    <Box w="8px" h="8px" borderRadius="full" flexShrink="0"
                      bg={s === "Đang hiện" ? "#10b981" : "#9ca3af"}
                      sx={s === "Đang hiện" && form.status === s ? { animation: `${pulse} 1.8s ease infinite` } : {}}
                    />
                    <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700"
                      color={form.status === s ? (s === "Đang hiện" ? "#059669" : "#374151") : "#94a3b8"}
                    >{s}</Text>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* 4. Liên kết */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px", md: "20px" }}
          >
            <SectionTitle label="Liên kết banner" />
            <Flex direction="column" gap="12px">
              <Box>
                <Text sx={labelStyle}>Liên kết đến *</Text>
                <Select {...inputStyle} value={form.linkType}
                  onChange={(e) => { set("linkType", e.target.value); set("linkTarget", ""); }}
                >
                  <option>Không có</option>
                  <option>Phim</option>
                  <option>Khuyến mãi</option>
                </Select>
              </Box>
              <Box opacity={form.linkType === "Không có" ? 0.45 : 1}
                pointerEvents={form.linkType === "Không có" ? "none" : "auto"}
                transition="opacity 0.2s"
              >
                <Text sx={labelStyle}>
                  {form.linkType === "Không có" ? "Chọn đối tượng —" : `Chọn ${form.linkType} *`}
                </Text>
                {form.linkType === "Không có" ? (
                  <Input {...inputStyle} isDisabled placeholder="Không áp dụng" />
                ) : (
                  <Select {...inputStyle} value={form.linkTarget}
                    onChange={(e) => set("linkTarget", e.target.value)}
                    placeholder={`Chọn ${form.linkType}...`}
                  >
                    {linkOptions.map((o) => <option key={o}>{o}</option>)}
                  </Select>
                )}
              </Box>
            </Flex>
          </Box>

          {/* 5. Hẹn giờ */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px", md: "20px" }}
          >
            {/* Title row + toggle */}
            <Flex align="center" justify="space-between" mb="14px">
              <Flex align="center" gap="8px">
                <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
                <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
                  Hẹn giờ bật/tắt
                </Text>
              </Flex>
              <Flex align="center" gap="8px">
                <Text fontSize="12px" fontWeight="600"
                  color={form.scheduledOn ? "#f97316" : "#94a3b8"}
                >
                  {form.scheduledOn ? "Đã bật" : "Tắt"}
                </Text>
                <Switch isChecked={form.scheduledOn} colorScheme="orange" size="md"
                  onChange={(e) => set("scheduledOn", e.target.checked)} />
              </Flex>
            </Flex>
            <Box h="1px" bg="linear-gradient(90deg, #f1f5f9, transparent)" mb="14px" />

            {/* Date inputs – always 1 col on mobile, 2 col on sm+ */}
            <Box
              opacity={form.scheduledOn ? 1 : 0.4}
              pointerEvents={form.scheduledOn ? "auto" : "none"}
              transition="opacity 0.2s"
            >
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px">
                <Box>
                  <Text sx={labelStyle}>Thời gian bật</Text>
                  <Input
                    {...inputStyle}
                    type="datetime-local"
                    fontSize={{ base: "13px", md: "14px" }}
                    px={{ base: "10px", md: "14px" }}
                    value={form.scheduleStart}
                    onChange={(e) => set("scheduleStart", e.target.value)}
                  />
                </Box>
                <Box>
                  <Text sx={labelStyle}>Thời gian tắt</Text>
                  <Input
                    {...inputStyle}
                    type="datetime-local"
                    fontSize={{ base: "13px", md: "14px" }}
                    px={{ base: "10px", md: "14px" }}
                    value={form.scheduleEnd}
                    onChange={(e) => set("scheduleEnd", e.target.value)}
                  />
                </Box>
              </SimpleGrid>

              {form.scheduledOn && (
                <Box mt="10px" p="10px 13px" borderRadius="9px" bg="#fff7ed"
                  border="1px solid #fed7aa"
                  sx={{ animation: `${fadeIn} 0.2s ease both` }}
                >
                  <Text fontSize={{ base: "11px", md: "11.5px" }} color="#b45309" fontWeight="600">
                    ⏱ Bật lúc <b>{form.scheduleStart || "?"}</b>
                    {" – "}
                    Tắt lúc <b>{form.scheduleEnd || "?"}</b>
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

        </Flex>
        {/* ════ END LEFT ════ */}

        {/* ════ RIGHT COLUMN – desktop sidebar ════ */}
        <Flex direction="column" gap="14px" display={{ base: "none", lg: "flex" }}>
          <PreviewBlock maxH="200px" />
          <SummaryBlock />
        </Flex>

      </Grid>

      {/* ── Save bar ── */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "12px 14px", md: "16px 20px" }} mt="14px"
      >
        <Flex gap="10px" direction={{ base: "column-reverse", sm: "row" }}
          justify={{ base: "stretch", sm: "flex-end" }}
        >
          <Button
            h={{ base: "44px", md: "42px" }}
            px="22px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            w={{ base: "100%", sm: "auto" }}
            onClick={onCancel}
          >Hủy bỏ</Button>
          <Button
            h={{ base: "44px", md: "42px" }}
            px="28px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            w={{ base: "100%", sm: "auto" }}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Thêm banner" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>

    </Box>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function BannerDetail({ banner, onBack, onEdit }) {
  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px"
        direction={{ base: "column", sm: "row" }} gap="10px"
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          w={{ base: "100%", sm: "auto" }}
          onClick={onBack}
        >Quay lại danh sách</Button>
        <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdEdit} />}
          w={{ base: "100%", sm: "auto" }}
          onClick={onEdit}
        >Chỉnh sửa banner</Button>
      </Flex>

      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Box position="relative" maxH={{ base: "200px", md: "300px" }} overflow="hidden">
          <img src={banner.image} alt={banner.title}
            style={{ width: "100%", objectFit: "cover", display: "block", maxHeight: "300px" }} />
          <Box position="absolute" bottom="0" left="0" right="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
            p={{ base: "14px 16px 12px", md: "20px 24px 16px" }}
          >
            <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="800" color="white"
              letterSpacing="-0.3px" mb="8px"
            >
              {banner.title}
            </Text>
            <Flex gap="8px" flexWrap="wrap">
              <StatusBadge status={banner.status} />
              <LinkBadge type={banner.linkType} />
            </Flex>
          </Box>
        </Box>

        <Box p={{ base: "16px", md: "20px 24px" }}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px">
            {[
              { icon: MdLayers, label: "Thứ tự", val: `#${banner.order}` },
              { icon: MdLink, label: "Liên kết tới", val: banner.linkTarget || "Không có" },
              { icon: MdSchedule, label: "Hẹn giờ", val: banner.scheduledOn ? "Đang bật" : "Tắt" },
              { icon: MdCalendarToday, label: "Bắt đầu", val: banner.scheduleStart ? banner.scheduleStart.replace("T", " ").slice(0, 16) : "—" },
            ].map(({ icon: Ic, label, val }) => (
              <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="6px" mb="3px">
                  <Icon as={Ic} boxSize="11px" color="#f97316" />
                  <Text fontSize="9.5px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize={{ base: "12px", md: "13px" }} fontWeight="700" color="#0f172a" noOfLines={2}>{val}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {banner.scheduleStart && (
            <Box mt="14px" p="12px 16px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
              <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px" textTransform="uppercase" mb="6px">
                Khung thời gian hiển thị
              </Text>
              <Flex align="center" gap="8px" flexWrap="wrap">
                <Box px="10px" py="4px" borderRadius="7px" bg="#fff7ed" border="1px solid #fcd34d">
                  <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="700" color="#b45309">
                    Bắt đầu: {banner.scheduleStart.replace("T", " ").slice(0, 16)}
                  </Text>
                </Box>
                <Text color="#94a3b8" fontWeight="700">→</Text>
                <Box px="10px" py="4px" borderRadius="7px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="700" color="#dc2626">
                    Kết thúc: {banner.scheduleEnd.replace("T", " ").slice(0, 16)}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {banner.note && (
            <Box mt="14px" p="12px 16px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Text fontSize="10px" fontWeight="800" color="#64748b" letterSpacing="1px" textTransform="uppercase" mb="4px">Ghi chú nội bộ</Text>
              <Text fontSize="13px" color="#475569" lineHeight="1.6">{banner.note}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function QuanLyBanner() {
  const [view, setView] = useState("list");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const filtered = banners
    .filter((b) => {
      const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.linkTarget.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "Tất cả" || b.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => a.order - b.order);

  const counts = {
    total:     banners.length,
    showing:   banners.filter((b) => b.status === "Đang hiện").length,
    hidden:    banners.filter((b) => b.status === "Đã ẩn").length,
    scheduled: banners.filter((b) => b.scheduledOn).length,
  };

  const handleHide = (id) => setBanners((prev) =>
    prev.map((b) => b.id === id ? { ...b, status: "Đã ẩn" } : b)
  );

  const handleMoveUp = (id) => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      const newBanners = [...sorted];
      [newBanners[idx - 1].order, newBanners[idx].order] =
        [newBanners[idx].order, newBanners[idx - 1].order];
      return newBanners;
    });
  };

  const handleMoveDown = (id) => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((b) => b.id === id);
      if (idx >= sorted.length - 1) return prev;
      const newBanners = [...sorted];
      [newBanners[idx + 1].order, newBanners[idx].order] =
        [newBanners[idx].order, newBanners[idx + 1].order];
      return newBanners;
    });
  };

  const handleSave = (form) => {
    if (view === "add") {
      const newOrder = Math.max(...banners.map((b) => b.order), 0) + 1;
      setBanners((prev) => [...prev, { ...form, id: Date.now(), order: newOrder }]);
    } else {
      setBanners((prev) => prev.map((b) => b.id === selectedBanner.id ? { ...b, ...form } : b));
      setSelectedBanner((prev) => ({ ...prev, ...form }));
    }
    setView("list");
  };

  // ── LIST ──
  if (view === "list") {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        {/* Header */}
        <Flex justify="space-between" align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
        >
          <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="10px" mb="4px">
              <Box w={{ base: "34px", md: "38px" }} h={{ base: "34px", md: "38px" }} borderRadius="11px"
                bg="linear-gradient(135deg, #f97316, #fb923c)"
                display="flex" alignItems="center" justifyContent="center"
                boxShadow="0 4px 12px rgba(249,115,22,0.35)"
              >
                <Icon as={FaImage} boxSize={{ base: "14px", md: "16px" }} color="white" />
              </Box>
              <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
                Quản lý Banner
              </Text>
            </Flex>
            <Text color="#94a3b8" fontSize="13px" pl="44px">
              Quản lý banner trang chủ – thứ tự, hẹn giờ, liên kết
            </Text>
          </Box>
          <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdAdd} />}
            onClick={() => setView("add")}
            w={{ base: "100%", md: "auto" }}
            sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          >
            Thêm banner
          </Button>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "10px", md: "14px" }} mb="18px">
          <StatCard label="Tổng banner"  value={counts.total}     icon={FaImage}         accent="#f97316" delay={0} />
          <StatCard label="Đang hiện"    value={counts.showing}   icon={MdToggleOn}      accent="#10b981" delay={0.05} />
          <StatCard label="Đã ẩn"        value={counts.hidden}    icon={MdVisibilityOff} accent="#94a3b8" delay={0.1} />
          <StatCard label="Có hẹn giờ"   value={counts.scheduled} icon={MdSchedule}      accent="#f59e0b" delay={0.15} />
        </SimpleGrid>

        {/* Table card */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          {/* Toolbar */}
          <Box p={{ base: "14px 14px 12px", md: "18px 20px 14px" }}
            borderBottom="1px solid #f8fafc"
          >
            {/* Top row: title + count */}
            <Flex align="center" gap="8px" mb={{ base: "10px", md: "0" }}
              justify="space-between"
            >
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
                  Danh sách banner
                </Text>
                <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length}</Text>
                </Box>
              </Flex>
              {/* Filter – visible on md+ inline, hidden on mobile (moved below) */}
              <Box display={{ base: "none", md: "block" }}>
                <Select h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="150px"
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đang hiện">Đang hiện</option>
                  <option value="Đã ẩn">Đã ẩn</option>
                  <option value="Hẹn giờ">Hẹn giờ</option>
                </Select>
              </Box>
            </Flex>

            {/* Search + filter row */}
            <Flex gap="8px" direction={{ base: "column", sm: "row" }}
              display={{ base: "flex", md: "flex" }}
              mt={{ base: "0", md: "10px" }}
            >
              <Box position="relative" flex="1">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1"
                />
                <Input
                  pl="30px" h="36px" w="100%" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tiêu đề, liên kết..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              {/* Filter on mobile */}
              <Box display={{ base: "block", md: "none" }}>
                <Select h="36px" fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="100%"
                  _focus={{ border: "1.5px solid #f97316" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đang hiện">Đang hiện</option>
                  <option value="Đã ẩn">Đã ẩn</option>
                  <option value="Hẹn giờ">Hẹn giờ</option>
                </Select>
              </Box>
            </Flex>
          </Box>

          {/* Column headers – desktop only */}
          <Box display={{ base: "none", lg: "block" }}>
            <Flex px="16px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9" align="center">
              <Box w="24px" flexShrink="0" />
              <Box w="36px" flexShrink="0" mr="4px">
                <Text fontSize="10px" fontWeight="800" color="#cbd5e1" letterSpacing="1px">STT</Text>
              </Box>
              <Box w="80px" mr="14px" flexShrink="0" />
              <Box flex="2.5">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Tiêu đề / Liên kết
                </Text>
              </Box>
              <Box flex="1.5">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Hẹn giờ
                </Text>
              </Box>
              <Box flex="0.7">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Lịch
                </Text>
              </Box>
              <Box flex="0.9">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Trạng thái
                </Text>
              </Box>
              <Box w="58px" mr="8px" flexShrink="0">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Thứ tự</Text>
              </Box>
              <Box w="180px" flexShrink="0" textAlign="right">
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hành động</Text>
              </Box>
            </Flex>
          </Box>

          {/* Rows */}
          <Box p={{ base: "10px", md: "10px" }}>
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="40px" color="#cbd5e1">
                <Icon as={FaImage} boxSize="32px" mb="8px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy banner nào</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap={{ base: "10px", md: "6px" }}>
                {filtered.map((b, i) => (
                  <BannerRow
                    key={b.id} banner={b} index={i}
                    isFirst={i === 0} isLast={i === filtered.length - 1}
                    onView={(bv) => { setSelectedBanner(bv); setView("detail"); }}
                    onEdit={(bv) => { setSelectedBanner(bv); setView("edit"); }}
                    onHide={handleHide}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </Flex>
            )}
          </Box>

          {/* Hint */}
          <Box px="16px" py="12px" borderTop="1px solid #f8fafc">
            <Flex align="center" gap="6px">
              <Icon as={MdDragIndicator} boxSize="13px" color="#cbd5e1" />
              <Text fontSize="11px" color="#cbd5e1" fontWeight="500">
                Dùng nút ▲ ▼ để thay đổi thứ tự hiển thị banner trên trang chủ
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── DETAIL ──
  if (view === "detail" && selectedBanner) {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <BannerDetail
          banner={banners.find((b) => b.id === selectedBanner.id) || selectedBanner}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      </Box>
    );
  }

  // ── ADD ──
  if (view === "add") {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <BannerForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  // ── EDIT ──
  if (view === "edit" && selectedBanner) {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <BannerForm
          banner={banners.find((b) => b.id === selectedBanner.id) || selectedBanner}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}