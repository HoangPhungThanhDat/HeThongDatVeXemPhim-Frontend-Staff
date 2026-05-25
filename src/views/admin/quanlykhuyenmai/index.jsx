import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  FormControl, Input, Select, Textarea,
  Icon, useBreakpointValue, Drawer, DrawerOverlay,
  DrawerContent, DrawerCloseButton, DrawerBody,
  useDisclosure, Collapse,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack,
  MdClose, MdCheckCircle, MdSearch,
  MdVisibilityOff, MdLocalOffer, MdPercent,
  MdAttachMoney, MdCardGiftcard, MdCalendarToday,
  MdMovie, MdLocationOn, MdAccessTime,
  MdSchedule, MdBarChart, MdStar, MdFilterList,
  MdExpandMore, MdExpandLess,
} from "react-icons/md";
import { FaTicketAlt, FaStore, FaTag, FaPercent } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ──────────────────────────────────────────────────────────────
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

// ─── Configs ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Đang diễn ra": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Sắp diễn ra":  { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Đã kết thúc":  { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
  "Tạm dừng":     { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", dot: "#8b5cf6" },
};

const TYPE_CONFIG = {
  "Giảm theo %":        { color: "#0369a1", bg: "#eff6ff", border: "#93c5fd", icon: FaPercent,      label: "%" },
  "Giảm tiền cố định":  { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", icon: MdAttachMoney,  label: "₫" },
  "Mua 1 tặng 1":       { color: "#c2410c", bg: "#fff7ed", border: "#fdba74", icon: MdCardGiftcard, label: "1+1" },
};

const APPLY_FOR_OPTS = ["Tất cả phim", "Phim cụ thể", "Suất chiếu cụ thể", "Rạp cụ thể"];
const MOVIE_OPTS     = ["Avengers: Infinity War", "Spider-Man: No Way Home", "Doctor Strange 2", "Thor: Love and Thunder"];
const CINEMA_OPTS    = ["Gấu Phim CGV Hà Nội", "Gấu Phim Lotte HCM", "Gấu Phim Vincom Đà Nẵng"];
const SESSION_OPTS   = ["Suất chiếu 08:00 – 10/06", "Suất chiếu 14:00 – 10/06", "Suất chiếu 19:30 – 11/06"];

// ─── Sample data ─────────────────────────────────────────────────────────────
const INITIAL_PROMOS = [
  {
    id: 1,
    name: "Thứ 4 Vui Vẻ – Giảm 30%",
    type: "Giảm theo %",
    value: 30,
    status: "Đang diễn ra",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    applyFor: "Tất cả phim",
    applyTarget: "",
    minOrder: 100000,
    maxDiscount: 50000,
    description: "Giảm 30% giá vé vào mỗi thứ 4 hàng tuần. Áp dụng cho tất cả suất chiếu trong ngày.",
    usageCount: 1420,
    usageLimit: 0,
  },
  {
    id: 2,
    name: "Mua 1 Tặng 1 Cuối Tuần",
    type: "Mua 1 tặng 1",
    value: 0,
    status: "Đang diễn ra",
    startDate: "2026-05-10",
    endDate: "2026-06-30",
    applyFor: "Rạp cụ thể",
    applyTarget: "Gấu Phim CGV Hà Nội",
    minOrder: 0,
    maxDiscount: 0,
    description: "Mua 1 vé tặng 1 vé miễn phí vào thứ 7 và chủ nhật hàng tuần tại rạp Hà Nội.",
    usageCount: 312,
    usageLimit: 500,
  },
  {
    id: 3,
    name: "Sinh Nhật Gấu Phim – Giảm 50k",
    type: "Giảm tiền cố định",
    value: 50000,
    status: "Sắp diễn ra",
    startDate: "2026-06-15",
    endDate: "2026-06-20",
    applyFor: "Tất cả phim",
    applyTarget: "",
    minOrder: 150000,
    maxDiscount: 0,
    description: "Nhân dịp sinh nhật 5 năm Gấu Phim, giảm 50.000đ cho mỗi đơn từ 150.000đ trở lên.",
    usageCount: 0,
    usageLimit: 2000,
  },
  {
    id: 4,
    name: "Ưu đãi ra mắt Doctor Strange 2",
    type: "Giảm theo %",
    value: 20,
    status: "Đã kết thúc",
    startDate: "2026-05-06",
    endDate: "2026-05-12",
    applyFor: "Phim cụ thể",
    applyTarget: "Doctor Strange 2",
    minOrder: 0,
    maxDiscount: 40000,
    description: "Giảm 20% giá vé dành riêng cho phim Doctor Strange in the Multiverse of Madness trong tuần đầu ra mắt.",
    usageCount: 876,
    usageLimit: 1000,
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

// ─── Shared UI components ────────────────────────────────────────────────────
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

function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
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
          <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">
            {value}
          </Text>
          {sub && <Text fontSize="10.5px" color="#94a3b8" mt="3px">{sub}</Text>}
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
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Đã kết thúc"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đang diễn ra" ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="12px" fontWeight="600" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG["Giảm theo %"];
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="800" color={cfg.color}>{cfg.label}</Text>
    </Box>
  );
}

function formatValue(type, value) {
  if (type === "Giảm theo %")       return `Giảm ${value}%`;
  if (type === "Giảm tiền cố định") return `Giảm ${value.toLocaleString()}đ`;
  return "Mua 1 Tặng 1";
}

function usagePercent(used, limit) {
  if (!limit) return null;
  return Math.min(100, Math.round((used / limit) * 100));
}

// ─── Promo Card (Mobile) ─────────────────────────────────────────────────────
function PromoCard({ promo, index, onView, onEdit, onToggle }) {
  const pct = usagePercent(promo.usageCount, promo.usageLimit);
  return (
    <Box p="14px" borderRadius="14px" bg="white"
      border="1.5px solid #f1f5f9" transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      {/* Top row */}
      <Flex align="flex-start" justify="space-between" mb="10px">
        <Flex align="center" gap="10px" flex="1" minW="0">
          <Box w="38px" h="38px" borderRadius="10px" flexShrink="0"
            bg={TYPE_CONFIG[promo.type]?.bg || "#f1f5f9"}
            border={`1px solid ${TYPE_CONFIG[promo.type]?.border || "#e2e8f0"}`}
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={TYPE_CONFIG[promo.type]?.icon || FaTag} boxSize="16px"
              color={TYPE_CONFIG[promo.type]?.color || "#94a3b8"} />
          </Box>
          <Box minW="0">
            <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={2} lineHeight="1.4">
              {promo.name}
            </Text>
            <Flex gap="5px" mt="4px" align="center" flexWrap="wrap">
              <TypeBadge type={promo.type} />
              <Text fontSize="11.5px" fontWeight="700" color="#f97316">
                {formatValue(promo.type, promo.value)}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <StatusBadge status={promo.status} />
      </Flex>

      {/* Info row */}
      <Flex gap="12px" mb="10px" flexWrap="wrap">
        <Flex align="center" gap="4px">
          <Icon as={MdCalendarToday} boxSize="11px" color="#94a3b8" />
          <Text fontSize="11px" color="#64748b" fontWeight="600">
            {promo.startDate} → {promo.endDate}
          </Text>
        </Flex>
        <Flex align="center" gap="4px">
          <Icon as={MdLocalOffer} boxSize="11px" color="#94a3b8" />
          <Text fontSize="11px" color="#64748b" fontWeight="600">{promo.applyFor}</Text>
        </Flex>
      </Flex>

      {/* Usage bar */}
      <Box mb="12px">
        <Flex justify="space-between" mb="4px">
          <Text fontSize="10.5px" color="#94a3b8" fontWeight="600">Lượt sử dụng</Text>
          <Text fontSize="10.5px" fontWeight="700" color="#0f172a">
            {promo.usageCount.toLocaleString()}
            {promo.usageLimit ? ` / ${promo.usageLimit.toLocaleString()}` : " lượt"}
          </Text>
        </Flex>
        {pct !== null && (
          <Box h="4px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
            <Box h="100%" borderRadius="full" w={`${pct}%`}
              bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
              transition="width 0.3s ease"
            />
          </Box>
        )}
      </Box>

      {/* Action buttons */}
      <Flex gap="7px">
        <Button flex="1" size="sm" h="32px" borderRadius="8px"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
          _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
          onClick={() => onView(promo)}
        >Xem</Button>
        <Button flex="1" size="sm" h="32px" borderRadius="8px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdEdit} boxSize="13px" />}
          _hover={{ opacity: 0.88 }}
          boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
          onClick={() => onEdit(promo)}
        >Sửa</Button>
        <Button flex="1" size="sm" h="32px" borderRadius="8px"
          bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
          fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={promo.status === "Tạm dừng" ? MdVisibility : MdVisibilityOff} boxSize="13px" />}
          _hover={promo.status === "Tạm dừng"
            ? { bg: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }
            : { bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
          transition="all 0.15s"
          onClick={() => onToggle(promo.id)}
        >{promo.status === "Tạm dừng" ? "Bật" : "Dừng"}</Button>
      </Flex>
    </Box>
  );
}

// ─── Promo Row (Desktop) ─────────────────────────────────────────────────────
function PromoRow({ promo, index, onView, onEdit, onToggle }) {
  const pct = usagePercent(promo.usageCount, promo.usageLimit);
  return (
    <Box p="14px 18px" borderRadius="12px" bg="white"
      border="1.5px solid #f1f5f9" transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center" gap="0">
        <Box w="32px" flexShrink="0">
          <Text fontSize="12px" fontWeight="700" color="#cbd5e1">
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>
        <Box w="36px" h="36px" borderRadius="10px" flexShrink="0" mr="14px"
          bg={TYPE_CONFIG[promo.type]?.bg || "#f1f5f9"}
          border={`1px solid ${TYPE_CONFIG[promo.type]?.border || "#e2e8f0"}`}
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={TYPE_CONFIG[promo.type]?.icon || FaTag} boxSize="15px"
            color={TYPE_CONFIG[promo.type]?.color || "#94a3b8"} />
        </Box>
        <Box flex="2.2" minW="0" pr="12px">
          <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{promo.name}</Text>
          <Flex gap="6px" mt="3px" align="center">
            <TypeBadge type={promo.type} />
            <Text fontSize="11.5px" fontWeight="700" color="#f97316">{formatValue(promo.type, promo.value)}</Text>
          </Flex>
        </Box>
        <Box flex="1.2" minW="0" pr="12px">
          <Flex align="center" gap="4px" mb="2px">
            <Icon as={MdLocalOffer} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="600" color="#475569">{promo.applyFor}</Text>
          </Flex>
          {promo.applyTarget && (
            <Text fontSize="10px" color="#94a3b8" noOfLines={1}>{promo.applyTarget}</Text>
          )}
        </Box>
        <Box flex="1.4" minW="0" pr="12px">
          <Flex align="center" gap="4px" mb="2px">
            <Icon as={MdCalendarToday} boxSize="10px" color="#94a3b8" />
            <Text fontSize="11px" color="#475569" fontWeight="600">{promo.startDate}</Text>
          </Flex>
          <Text fontSize="10px" color="#94a3b8">→ {promo.endDate}</Text>
        </Box>
        <Box flex="1" minW="0" pr="12px">
          <Text fontSize="11px" fontWeight="700" color="#0f172a">
            {promo.usageCount.toLocaleString()}
            {promo.usageLimit ? ` / ${promo.usageLimit.toLocaleString()}` : " lượt"}
          </Text>
          {pct !== null && (
            <Box mt="4px" h="4px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
              <Box h="100%" borderRadius="full" w={`${pct}%`}
                bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                transition="width 0.3s ease"
              />
            </Box>
          )}
        </Box>
        <Box flex="1" minW="0" pr="12px">
          <StatusBadge status={promo.status} />
        </Box>
        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }} transition="all 0.15s"
            onClick={() => onView(promo)}
          >Xem</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
            onClick={() => onEdit(promo)}
          >Sửa</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={promo.status === "Tạm dừng" ? MdVisibility : MdVisibilityOff} boxSize="12px" />}
            _hover={promo.status === "Tạm dừng"
              ? { bg: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }
              : { bg: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
            transition="all 0.15s"
            onClick={() => onToggle(promo.id)}
          >{promo.status === "Tạm dừng" ? "Bật" : "Dừng"}</Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Filter Panel (Mobile Drawer) ────────────────────────────────────────────
function FilterDrawer({ isOpen, onClose, search, setSearch, filterStatus, setFilterStatus, filterType, setFilterType }) {
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="20px" pb="env(safe-area-inset-bottom)">
        <DrawerCloseButton top="14px" />
        <DrawerBody p="20px">
          <Text fontSize="15px" fontWeight="800" color="#0f172a" mb="18px">Bộ lọc & Tìm kiếm</Text>
          <Box mb="14px">
            <Text sx={labelStyle}>Tìm kiếm</Text>
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%"
                transform="translateY(-50%)" boxSize="15px" color="#94a3b8" zIndex="1" />
              <Input
                pl="36px" {...inputStyle}
                placeholder="Tìm tên chương trình..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
          </Box>
          <Box mb="14px">
            <Text sx={labelStyle}>Trạng thái</Text>
            <Select {...inputStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Tất cả">Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Sắp diễn ra</option>
              <option>Tạm dừng</option>
              <option>Đã kết thúc</option>
            </Select>
          </Box>
          <Box mb="20px">
            <Text sx={labelStyle}>Loại khuyến mãi</Text>
            <Select {...inputStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="Tất cả">Tất cả loại</option>
              <option>Giảm theo %</option>
              <option>Giảm tiền cố định</option>
              <option>Mua 1 tặng 1</option>
            </Select>
          </Box>
          <Button w="100%" h="44px" borderRadius="12px" fontWeight="700" fontSize="14px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            onClick={onClose}
          >Áp dụng bộ lọc</Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Promo Form ───────────────────────────────────────────────────────────────
function PromoForm({ promo, onCancel, onSave, isAdd = false }) {
  const empty = {
    name: "", type: "Giảm theo %", value: "", status: "Sắp diễn ra",
    startDate: "", endDate: "", applyFor: "Tất cả phim", applyTarget: "",
    minOrder: "", maxDiscount: "", description: "", usageLimit: "",
  };
  const [form, setForm] = useState(promo || empty);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const targetOpts =
    form.applyFor === "Phim cụ thể"      ? MOVIE_OPTS :
    form.applyFor === "Rạp cụ thể"       ? CINEMA_OPTS :
    form.applyFor === "Suất chiếu cụ thể"? SESSION_OPTS : [];

  // Preview panel (reused for both sidebar and mobile collapse)
  const PreviewPanel = () => (
    <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="18px"
    >
      <SectionTitle label="Xem trước" />
      {form.name ? (
        <Flex direction="column" gap="12px" sx={{ animation: `${fadeIn} 0.2s ease both` }}>
          <Box p="18px" borderRadius="12px"
            bg="linear-gradient(135deg, #fff7ed, #fffbeb)"
            border="1.5px solid #fed7aa" textAlign="center"
          >
            <Text fontSize="32px" fontWeight="900" color="#f97316" lineHeight="1">
              {form.type === "Giảm theo %" && form.value ? `${form.value}%` :
               form.type === "Giảm tiền cố định" && form.value ? `${Number(form.value).toLocaleString()}đ` :
               form.type === "Mua 1 tặng 1" ? "1+1" : "—"}
            </Text>
            <Text fontSize="11px" color="#b45309" fontWeight="700" mt="4px" letterSpacing="0.6px">
              {form.type === "Giảm theo %" ? "GIẢM GIÁ VÉ" :
               form.type === "Giảm tiền cố định" ? "GIẢM TRỰC TIẾP" : "MUA 1 TẶNG 1"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="10px" color="#94a3b8" fontWeight="700" letterSpacing="0.8px" textTransform="uppercase" mb="2px">Tên KM</Text>
            <Text fontSize="13px" fontWeight="700" color="#0f172a">{form.name}</Text>
          </Box>
          <Flex gap="7px" flexWrap="wrap">
            <StatusBadge status={form.status} />
            <TypeBadge type={form.type} />
          </Flex>
          {form.startDate && form.endDate && (
            <Flex align="center" gap="6px">
              <Icon as={MdCalendarToday} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#475569" fontWeight="600">
                {form.startDate} → {form.endDate}
              </Text>
            </Flex>
          )}
          {form.applyFor !== "Tất cả phim" && (
            <Flex align="center" gap="6px">
              <Icon as={MdLocalOffer} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#475569" fontWeight="600">
                {form.applyFor}{form.applyTarget ? `: ${form.applyTarget}` : ""}
              </Text>
            </Flex>
          )}
          {form.usageLimit && (
            <Flex align="center" gap="6px">
              <Icon as={MdBarChart} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#475569" fontWeight="600">
                Giới hạn {Number(form.usageLimit).toLocaleString()} lượt
              </Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex direction="column" align="center" justify="center" h="120px">
          <Icon as={FaTag} boxSize="24px" color="#e2e8f0" mb="6px" />
          <Text fontSize="12px" color="#94a3b8">Nhập tên để xem trước</Text>
        </Flex>
      )}
    </Box>
  );

  return (
    <Box sx={{ animation: `${scaleIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align="center" gap="12px" mb="20px" flexWrap={{ base: "wrap", md: "nowrap" }}>
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          flexShrink="0"
          onClick={onCancel}
        >Quay lại</Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.4px">
            {isAdd ? "Thêm khuyến mãi mới" : `Chỉnh sửa`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px" noOfLines={1}>
            {isAdd ? "Điền đầy đủ thông tin để tạo chương trình" : promo?.name}
          </Text>
        </Box>
      </Flex>

      {/* Mobile: Preview toggle */}
      {isMobile && (
        <Box mb="14px">
          <Button w="100%" h="40px" borderRadius="12px" variant="outline"
            color="#f97316" border="1.5px solid #fed7aa" bg="#fff7ed"
            fontSize="13px" fontWeight="700"
            rightIcon={<Icon as={previewOpen ? MdExpandLess : MdExpandMore} />}
            onClick={() => setPreviewOpen(v => !v)}
          >
            {previewOpen ? "Ẩn xem trước" : "Xem trước khuyến mãi"}
          </Button>
          <Collapse in={previewOpen} animateOpacity>
            <Box mt="10px"><PreviewPanel /></Box>
          </Collapse>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap="20px">
        {/* Left – form fields */}
        <Flex direction="column" gap="16px">

          {/* Thông tin cơ bản */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Box mb="14px">
              <Text sx={labelStyle}>Tên chương trình *</Text>
              <FormControl>
                <Input {...inputStyle} placeholder="VD: Thứ 4 Vui Vẻ – Giảm 30%"
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </FormControl>
            </Box>
            <Box mb="14px">
              <Text sx={labelStyle}>Mô tả chương trình</Text>
              <FormControl>
                <Textarea
                  bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                  color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                  _hover={{ border: "1.5px solid #f97316" }}
                  transition="all 0.2s" rows={3}
                  placeholder="Mô tả chi tiết điều kiện và lợi ích của chương trình..."
                  value={form.description} onChange={e => set("description", e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>

          {/* Loại khuyến mãi */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Loại khuyến mãi" />
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3,1fr)" }} gap="10px" mb="18px">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <Box key={key} p="12px 14px" borderRadius="12px" cursor="pointer"
                  bg={form.type === key ? cfg.bg : "#f8fafc"}
                  border={form.type === key ? `2px solid ${cfg.border}` : "2px solid #f1f5f9"}
                  transition="all 0.2s"
                  onClick={() => { set("type", key); set("value", ""); }}
                >
                  <Flex align="center" gap="8px">
                    <Box w="28px" h="28px" borderRadius="8px"
                      bg={form.type === key ? `${cfg.color}15` : "#e8edf3"}
                      display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                    >
                      <Icon as={cfg.icon} boxSize="13px" color={form.type === key ? cfg.color : "#94a3b8"} />
                    </Box>
                    <Text fontSize="12px" fontWeight="700"
                      color={form.type === key ? cfg.color : "#94a3b8"}>
                      {key}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Grid>

            {form.type !== "Mua 1 tặng 1" && (
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px"
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Box>
                  <Text sx={labelStyle}>
                    {form.type === "Giảm theo %" ? "Mức giảm (%) *" : "Số tiền giảm (đ) *"}
                  </Text>
                  <FormControl>
                    <Input {...inputStyle} type="number"
                      placeholder={form.type === "Giảm theo %" ? "VD: 30" : "VD: 50000"}
                      value={form.value} onChange={e => set("value", e.target.value)} />
                  </FormControl>
                </Box>
                <Box>
                  <Text sx={labelStyle}>
                    {form.type === "Giảm theo %" ? "Giảm tối đa (đ)" : "Đơn tối thiểu (đ)"}
                  </Text>
                  <FormControl>
                    <Input {...inputStyle} type="number"
                      placeholder={form.type === "Giảm theo %" ? "VD: 50000" : "VD: 100000"}
                      value={form.type === "Giảm theo %" ? form.maxDiscount : form.minOrder}
                      onChange={e => set(form.type === "Giảm theo %" ? "maxDiscount" : "minOrder", e.target.value)} />
                  </FormControl>
                </Box>
              </Grid>
            )}

            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Đơn hàng tối thiểu (đ)</Text>
                <FormControl>
                  <Input {...inputStyle} type="number" placeholder="VD: 100000 (0 = không giới hạn)"
                    value={form.minOrder} onChange={e => set("minOrder", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Giới hạn lượt dùng</Text>
                <FormControl>
                  <Input {...inputStyle} type="number" placeholder="VD: 500 (0 = không giới hạn)"
                    value={form.usageLimit} onChange={e => set("usageLimit", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
          </Box>

          {/* Thời gian hiệu lực */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thời gian hiệu lực" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Ngày bắt đầu *</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.startDate} onChange={e => set("startDate", e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <Text sx={labelStyle}>Ngày kết thúc *</Text>
                <FormControl>
                  <Input {...inputStyle} type="date"
                    value={form.endDate} onChange={e => set("endDate", e.target.value)} />
                </FormControl>
              </Box>
            </Grid>
            {form.startDate && form.endDate && (
              <Box p="10px 14px" borderRadius="9px" bg="#fff7ed" border="1px solid #fed7aa"
                sx={{ animation: `${fadeIn} 0.2s ease both` }}
              >
                <Flex align="center" gap="6px">
                  <Icon as={MdSchedule} boxSize="13px" color="#f97316" />
                  <Text fontSize="11.5px" color="#b45309" fontWeight="600">
                    Hiệu lực từ <b>{form.startDate}</b> đến <b>{form.endDate}</b>
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>

          {/* Đối tượng áp dụng */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Đối tượng áp dụng" />
            <Box mb="14px">
              <Text sx={labelStyle}>Áp dụng cho *</Text>
              <Grid templateColumns={{ base: "1fr 1fr", sm: "repeat(2,1fr)" }} gap="8px">
                {APPLY_FOR_OPTS.map(opt => (
                  <Box key={opt} p="10px 12px" borderRadius="9px" cursor="pointer"
                    bg={form.applyFor === opt ? "#fff7ed" : "#f8fafc"}
                    border={form.applyFor === opt ? "2px solid #fed7aa" : "2px solid #f1f5f9"}
                    transition="all 0.2s"
                    onClick={() => { set("applyFor", opt); set("applyTarget", ""); }}
                  >
                    <Flex align="center" gap="6px">
                      <Icon as={
                        opt === "Tất cả phim" ? MdLocalOffer :
                        opt === "Phim cụ thể" ? MdMovie :
                        opt === "Rạp cụ thể"  ? FaStore : MdAccessTime
                      } boxSize="13px"
                        color={form.applyFor === opt ? "#f97316" : "#94a3b8"} />
                      <Text fontSize="12px" fontWeight="700"
                        color={form.applyFor === opt ? "#b45309" : "#64748b"}>
                        {opt}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Box>

            {form.applyFor !== "Tất cả phim" && targetOpts.length > 0 && (
              <Box sx={{ animation: `${fadeIn} 0.2s ease both` }}>
                <Text sx={labelStyle}>Chọn {form.applyFor.replace(" cụ thể","")}</Text>
                <FormControl>
                  <Select {...inputStyle} value={form.applyTarget}
                    onChange={e => set("applyTarget", e.target.value)}
                    placeholder={`-- Chọn ${form.applyFor} --`}>
                    {targetOpts.map(o => <option key={o}>{o}</option>)}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Trạng thái */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Trạng thái" />
            <Grid templateColumns="repeat(2,1fr)" gap="8px">
              {["Đang diễn ra", "Sắp diễn ra", "Tạm dừng", "Đã kết thúc"].map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <Box key={s} p="10px 14px" borderRadius="9px" cursor="pointer"
                    bg={form.status === s ? cfg.bg : "#f8fafc"}
                    border={form.status === s ? `2px solid ${cfg.border}` : "2px solid #f1f5f9"}
                    transition="all 0.2s"
                    onClick={() => set("status", s)}
                  >
                    <Flex align="center" gap="7px">
                      <Box w="7px" h="7px" borderRadius="full" bg={cfg.dot}
                        sx={s === "Đang diễn ra" && form.status === s
                          ? { animation: `${pulse} 1.8s ease infinite` } : {}}
                      />
                      <Text fontSize="12px" fontWeight="700"
                        color={form.status === s ? cfg.color : "#94a3b8"}>
                        {s}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </Flex>

        {/* Right – preview (desktop only) */}
        {!isMobile && (
          <Flex direction="column" gap="16px">
            <PreviewPanel />
          </Flex>
        )}
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom="0" zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px"
          direction={{ base: "row", md: "row" }}
        >
          <Button flex={{ base: "1", md: "none" }} h="42px" px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >Hủy</Button>
          <Button flex={{ base: "2", md: "none" }} h="42px" px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >
            {isAdd ? "Tạo khuyến mãi" : "Lưu thay đổi"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function PromoDetail({ promo, onBack, onEdit }) {
  const pct = usagePercent(promo.usageCount, promo.usageLimit);
  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px"
          fontSize={{ base: "12px", md: "13px" }} fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          onClick={onBack}
        >
          <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>Danh sách</Box>
        </Button>
        <Button h="40px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdEdit} />}
          onClick={onEdit}
        >Chỉnh sửa</Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        {/* On mobile: stack vertically; on md+: side by side */}
        <Flex direction={{ base: "column", md: "row" }}>
          {/* Value panel */}
          <Box w={{ base: "100%", md: "200px" }} flexShrink="0"
            bg="linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)"
            borderRight={{ base: "none", md: "1px solid #fed7aa" }}
            borderBottom={{ base: "1px solid #fed7aa", md: "none" }}
            display="flex" flexDirection={{ base: "row", md: "column" }}
            alignItems="center" justifyContent="center"
            p={{ base: "18px 20px", md: "28px" }}
            gap={{ base: "14px", md: "0" }}
          >
            <Box w="48px" h="48px" borderRadius="14px"
              bg={TYPE_CONFIG[promo.type]?.bg}
              border={`1.5px solid ${TYPE_CONFIG[promo.type]?.border}`}
              display="flex" alignItems="center" justifyContent="center"
              mb={{ base: "0", md: "12px" }}
              flexShrink="0"
            >
              <Icon as={TYPE_CONFIG[promo.type]?.icon || FaTag} boxSize="20px"
                color={TYPE_CONFIG[promo.type]?.color} />
            </Box>
            <Box textAlign={{ base: "left", md: "center" }}>
              <Text fontSize={{ base: "32px", md: "40px" }} fontWeight="900" color="#f97316" lineHeight="1">
                {promo.type === "Giảm theo %" ? `${promo.value}%` :
                 promo.type === "Giảm tiền cố định" ? `${(promo.value/1000).toFixed(0)}K` :
                 "1+1"}
              </Text>
              <Text fontSize="11px" fontWeight="800" color="#b45309" mt="4px"
                letterSpacing="1px" textTransform="uppercase">
                {promo.type === "Giảm theo %" ? "Giảm giá" :
                 promo.type === "Giảm tiền cố định" ? "Giảm trực tiếp" : "Mua 1 tặng 1"}
              </Text>
            </Box>
          </Box>

          {/* Info */}
          <Box p={{ base: "16px", md: "24px" }} flex="1">
            <Flex justify="space-between" align="flex-start" mb="12px">
              <Box flex="1" minW="0" pr="8px">
                <Text fontSize={{ base: "16px", md: "20px" }} fontWeight="800" color="#0f172a"
                  letterSpacing="-0.3px" mb="8px" noOfLines={2}>
                  {promo.name}
                </Text>
                <Flex gap="8px" flexWrap="wrap">
                  <StatusBadge status={promo.status} />
                  <TypeBadge type={promo.type} />
                </Flex>
              </Box>
            </Flex>
            <Box h="1px" bg="#f1f5f9" mb="14px" />

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
              {[
                { icon: MdCalendarToday, label: "Bắt đầu",  val: promo.startDate },
                { icon: MdCalendarToday, label: "Kết thúc", val: promo.endDate },
                { icon: MdLocalOffer,    label: "Áp dụng",  val: promo.applyFor },
                { icon: MdBarChart,      label: "Đã dùng",  val: `${promo.usageCount.toLocaleString()} lượt` },
              ].map(({ icon: Ic, label, val }) => (
                <Box key={label} p="10px 12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9.5px" fontWeight="700" color="#94a3b8"
                      letterSpacing="0.8px" textTransform="uppercase">{label}</Text>
                  </Flex>
                  <Text fontSize="12px" fontWeight="700" color="#0f172a" noOfLines={1}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>

            {promo.usageLimit > 0 && (
              <Box mb="14px" p="12px 14px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex justify="space-between" mb="6px">
                  <Text fontSize="11px" fontWeight="700" color="#475569">Lượt sử dụng</Text>
                  <Text fontSize="11px" fontWeight="800" color={pct >= 90 ? "#ef4444" : "#0f172a"}>
                    {promo.usageCount.toLocaleString()} / {promo.usageLimit.toLocaleString()} ({pct}%)
                  </Text>
                </Flex>
                <Box h="6px" borderRadius="full" bg="#e2e8f0" overflow="hidden">
                  <Box h="100%" borderRadius="full" w={`${pct}%`}
                    bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                    transition="width 0.4s ease"
                  />
                </Box>
              </Box>
            )}

            {promo.description && (
              <Box p="12px 16px" borderRadius="12px" bg="#fffbf7" border="1px solid #fed7aa">
                <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px"
                  textTransform="uppercase" mb="5px">Mô tả chương trình</Text>
                <Text fontSize="13px" color="#475569" lineHeight="1.7">{promo.description}</Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Conditions */}
      <Grid templateColumns={{ base: "1fr", sm: "repeat(3,1fr)" }} gap="14px">
        {[
          {
            icon: MdLocalOffer,
            label: "Đối tượng áp dụng",
            val: promo.applyFor + (promo.applyTarget ? `: ${promo.applyTarget}` : ""),
          },
          {
            icon: MdAttachMoney,
            label: "Đơn hàng tối thiểu",
            val: promo.minOrder > 0 ? `${promo.minOrder.toLocaleString()}đ` : "Không giới hạn",
          },
          {
            icon: MdBarChart,
            label: "Giới hạn lượt dùng",
            val: promo.usageLimit > 0 ? `${promo.usageLimit.toLocaleString()} lượt` : "Không giới hạn",
          },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} bg="white" borderRadius="14px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="16px"
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
    </Box>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanLyKhuyenMai() {
  const [view, setView]               = useState("list");
  const [selected, setSelected]       = useState(null);
  const [promos, setPromos]           = useState(INITIAL_PROMOS);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterType, setFilterType]   = useState("Tất cả");

  const { isOpen: filterOpen, onOpen: openFilter, onClose: closeFilter } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const filtered = promos.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.applyTarget.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || p.status === filterStatus;
    const matchType   = filterType   === "Tất cả" || p.type   === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    total:      promos.length,
    active:     promos.filter(p => p.status === "Đang diễn ra").length,
    upcoming:   promos.filter(p => p.status === "Sắp diễn ra").length,
    ended:      promos.filter(p => p.status === "Đã kết thúc" || p.status === "Tạm dừng").length,
    totalUsage: promos.reduce((s, p) => s + p.usageCount, 0),
  };

  const handleToggle = (id) =>
    setPromos(prev => prev.map(p => p.id === id
      ? { ...p, status: p.status === "Tạm dừng" ? "Đang diễn ra" : "Tạm dừng" } : p));

  const handleSave = (form) => {
    if (view === "add") {
      setPromos(prev => [...prev, { ...form, id: Date.now(), usageCount: 0 }]);
    } else {
      setPromos(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p));
      setSelected(prev => ({ ...prev, ...form }));
    }
    setView("list");
  };

  // active filter count badge
  const activeFilters = (filterStatus !== "Tất cả" ? 1 : 0) + (filterType !== "Tất cả" ? 1 : 0);

  // ── LIST ──
  if (view === "list") return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* Header */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="22px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaTag} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
              Khuyến mãi & Sự kiện
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl={{ base: "0", md: "48px" }}>
            Quản lý chương trình giảm giá, ưu đãi và sự kiện chiếu phim
          </Text>
        </Box>
        <Button h="40px" px="20px" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
          boxShadow="0 4px 14px rgba(249,115,22,0.35)"
          _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all 0.2s"
          leftIcon={<Icon as={MdAdd} />}
          onClick={() => setView("add")}
          sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          w={{ base: "100%", md: "auto" }}
        >Tạo khuyến mãi</Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng KM"      value={counts.total}    icon={FaTag}         accent="#f97316" delay={0}    />
        <StatCard label="Đang diễn ra" value={counts.active}   icon={MdLocalOffer}  accent="#10b981" delay={0.05} />
        <StatCard label="Sắp diễn ra"  value={counts.upcoming} icon={MdSchedule}    accent="#f59e0b" delay={0.1}  />
        <StatCard label="Lượt đã dùng" value={counts.totalUsage.toLocaleString()} icon={MdBarChart} accent="#7c3aed" delay={0.15} />
      </SimpleGrid>

      {/* Table / Card list */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Toolbar */}
        <Flex align="center" justify="space-between" p="16px 16px 12px"
          borderBottom="1px solid #f8fafc" gap="10px" flexWrap="wrap"
        >
          <Flex align="center" gap="8px">
            <Text fontWeight="800" fontSize={{ base: "14px", md: "15px" }} color="#0f172a">
              Danh sách khuyến mãi
            </Text>
            <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length}</Text>
            </Box>
          </Flex>

          {/* Desktop filters inline */}
          <Flex gap="8px" align="center" display={{ base: "none", md: "flex" }} flexWrap="wrap">
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
              <Input
                pl="30px" h="34px" w="200px" fontSize="12.5px" fontWeight="500"
                placeholder="Tìm tên chương trình..."
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
            <Select h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
              bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="150px"
              _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Sắp diễn ra</option>
              <option>Tạm dừng</option>
              <option>Đã kết thúc</option>
            </Select>
            <Select h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
              bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="170px"
              _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
              transition="all 0.2s"
              value={filterType} onChange={e => setFilterType(e.target.value)}
            >
              <option value="Tất cả">Tất cả loại</option>
              <option>Giảm theo %</option>
              <option>Giảm tiền cố định</option>
              <option>Mua 1 tặng 1</option>
            </Select>
          </Flex>

          {/* Mobile: search + filter button */}
          <Flex gap="8px" display={{ base: "flex", md: "none" }} flex="1" minW="0">
            <Box position="relative" flex="1">
              <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
              <Input
                pl="30px" h="36px" fontSize="13px" fontWeight="500"
                placeholder="Tìm kiếm..."
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", bg: "#fff" }}
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </Box>
            <Button h="36px" px="12px" borderRadius="9px"
              bg={activeFilters > 0 ? "#fff7ed" : "#f8fafc"}
              border={activeFilters > 0 ? "1.5px solid #fed7aa" : "1px solid #e8edf3"}
              color={activeFilters > 0 ? "#f97316" : "#64748b"}
              fontWeight="700" fontSize="12px"
              leftIcon={<Icon as={MdFilterList} boxSize="15px" />}
              onClick={openFilter}
              position="relative" flexShrink="0"
            >
              Lọc
              {activeFilters > 0 && (
                <Box position="absolute" top="-5px" right="-5px"
                  w="16px" h="16px" borderRadius="full" bg="#f97316"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="9px" fontWeight="800" color="white">{activeFilters}</Text>
                </Box>
              )}
            </Button>
          </Flex>
        </Flex>

        {/* Desktop: column headers */}
        <Box display={{ base: "none", md: "block" }}>
          <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9" align="center">
            <Box w="32px" flexShrink="0">
              <Text fontSize="10px" fontWeight="800" color="#cbd5e1" letterSpacing="1px">#</Text>
            </Box>
            <Box w="36px" mr="14px" flexShrink="0" />
            <Box flex="2.2">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Tên KM / Loại
              </Text>
            </Box>
            <Box flex="1.2">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Áp dụng
              </Text>
            </Box>
            <Box flex="1.4">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Thời gian
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Sử dụng
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Trạng thái
              </Text>
            </Box>
            <Box w="190px" flexShrink="0" textAlign="right">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                Hành động
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box p="10px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px">
              <Icon as={FaTag} boxSize="32px" color="#e2e8f0" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy chương trình nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="6px">
              {filtered.map((p, i) =>
                isMobile ? (
                  <PromoCard
                    key={p.id} promo={p} index={i}
                    onView={pv => { setSelected(pv); setView("detail"); }}
                    onEdit={pv => { setSelected(pv); setView("edit"); }}
                    onToggle={handleToggle}
                  />
                ) : (
                  <PromoRow
                    key={p.id} promo={p} index={i}
                    onView={pv => { setSelected(pv); setView("detail"); }}
                    onEdit={pv => { setSelected(pv); setView("edit"); }}
                    onToggle={handleToggle}
                  />
                )
              )}
            </Flex>
          )}
        </Box>
      </Box>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={filterOpen} onClose={closeFilter}
        search={search} setSearch={setSearch}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterType={filterType} setFilterType={setFilterType}
      />
    </Box>
  );

  if (view === "detail" && selected) return (
    <Box pt={{ base: "120px", md: "80px" }}>
      <PromoDetail
        promo={promos.find(p => p.id === selected.id) || selected}
        onBack={() => setView("list")}
        onEdit={() => setView("edit")}
      />
    </Box>
  );

  if (view === "add") return (
    <Box pt={{ base: "120px", md: "80px" }}>
      <PromoForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
    </Box>
  );

  if (view === "edit" && selected) return (
    <Box pt={{ base: "120px", md: "80px" }}>
      <PromoForm
        promo={promos.find(p => p.id === selected.id) || selected}
        onCancel={() => setView("detail")}
        onSave={handleSave}
      />
    </Box>
  );

  return null;
}