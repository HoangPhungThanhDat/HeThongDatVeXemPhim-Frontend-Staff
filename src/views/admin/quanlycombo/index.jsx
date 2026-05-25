import React, { useState } from "react";
import {
  Box, Flex, Text, Button, SimpleGrid, Grid, Icon,
  Input, Select, Textarea, Switch, keyframes,
} from "@chakra-ui/react";
import {
  MdAdd, MdEdit, MdArrowBack, MdClose, MdCheckCircle,
  MdSearch, MdFilterList, MdVisibilityOff, MdVisibility,
  MdImageSearch, MdStar, MdTrendingUp, MdInventory2,
  MdToggleOn, MdToggleOff, MdLocalOffer, MdBarChart,
  MdShoppingCart, MdEmojiEvents, MdOutbox,
} from "react-icons/md";
import { FaBoxOpen, FaPercent, FaFire, FaCoffee } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const shimmer = keyframes`
  0%{background-position:-200% center}100%{background-position:200% center}
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;
const float = keyframes`
  0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
`;

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
  _focus: { border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#ffffff" },
  _hover: { border: "1.5px solid #f97316", bg: "#ffffff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px", display: "block",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INIT_COMBOS = [
  {
    id: 1,
    name: "Combo Đôi Lãng Mạn",
    description: "2 Bắp Lớn + 2 Pepsi 500ml – Dành cho các cặp đôi yêu điện ảnh",
    price: 120000,
    originalPrice: 150000,
    image: "https://cdn.shopify.com/s/files/1/0070/7032/files/popcorn-combo.jpg",
    items: ["2 Bắp Lớn", "2 Pepsi 500ml"],
    category: "Combo Đôi",
    maxPerOrder: 3,
    isActive: true,
    isSeasonal: false,
    soldCount: 2840,
    tag: "Bán chạy",
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Combo Gia Đình Vui",
    description: "4 Bắp Nhỏ + 4 Sprite 330ml + 1 Hotdog – Trọn vẹn niềm vui",
    price: 220000,
    originalPrice: 280000,
    image: "",
    items: ["4 Bắp Nhỏ", "4 Sprite 330ml", "1 Hotdog"],
    category: "Combo Gia Đình",
    maxPerOrder: 2,
    isActive: true,
    isSeasonal: false,
    soldCount: 1560,
    tag: "Mới",
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Combo Solo Tiết Kiệm",
    description: "1 Bắp Vừa + 1 Nước Suối – Nhẹ nhàng, tiết kiệm cho 1 người",
    price: 55000,
    originalPrice: 70000,
    image: "",
    items: ["1 Bắp Vừa", "1 Nước Suối 500ml"],
    category: "Combo Solo",
    maxPerOrder: 5,
    isActive: true,
    isSeasonal: false,
    soldCount: 3990,
    tag: "Phổ biến",
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Combo Mùa Hè Trái Cây",
    description: "2 Bắp Nhỏ + 2 Nước Ép Cam Tươi – Mát lạnh ngày hè",
    price: 105000,
    originalPrice: 130000,
    image: "",
    items: ["2 Bắp Nhỏ", "2 Nước Ép Cam 350ml"],
    category: "Combo Đôi",
    maxPerOrder: 3,
    isActive: false,
    isSeasonal: true,
    soldCount: 430,
    tag: "Theo mùa",
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Combo VIP Premium",
    description: "1 Bắp Jumbo Bơ Mặn + 1 Nước Ngọt Lớn + 1 Kẹo Gummy – Đẳng cấp thượng lưu",
    price: 145000,
    originalPrice: 180000,
    image: "",
    items: ["1 Bắp Jumbo Bơ Mặn", "1 Coca-Cola Lớn 600ml", "1 Kẹo Gummy"],
    category: "Combo VIP",
    maxPerOrder: 2,
    isActive: true,
    isSeasonal: false,
    soldCount: 870,
    tag: "VIP",
    sortOrder: 5,
  },
];

const CATEGORIES = ["Tất cả", "Combo Solo", "Combo Đôi", "Combo Gia Đình", "Combo VIP"];

// ─── Tag Badge ────────────────────────────────────────────────────────────────
const TAG_CONFIG = {
  "Bán chạy": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: FaFire },
  "Mới":      { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: MdLocalOffer },
  "Phổ biến": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", icon: MdTrendingUp },
  "Theo mùa": { color: "#0284c7", bg: "#f0f9ff", border: "#7dd3fc", icon: MdStar },
  "VIP":      { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: MdEmojiEvents },
};

function TagBadge({ tag }) {
  const cfg = TAG_CONFIG[tag] || TAG_CONFIG["Mới"];
  const IconComp = cfg.icon;
  return (
    <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex"
    >
      <Icon as={IconComp} boxSize="10px" color={cfg.color} />
      <Text fontSize="10.5px" fontWeight="800" color={cfg.color}>{tag}</Text>
    </Flex>
  );
}

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
    <Box p={{ base: "14px 16px", md: "16px 20px" }} borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.22s"
      _hover={{ boxShadow: "0 4px 18px rgba(0,0,0,0.09)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="10.5px" fontWeight="800" color="#94a3b8"
            letterSpacing="0.9px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="10.5px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="40px" h="40px" borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize="18px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Combo Card (Grid View) ───────────────────────────────────────────────────
function ComboCard({ combo, index, onEdit, onToggle }) {
  const discount = Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100);

  return (
    <Box
      borderRadius="16px" bg="white"
      border={combo.isActive ? "1.5px solid #f1f5f9" : "1.5px solid #f1f5f9"}
      boxShadow="0 1px 6px rgba(0,0,0,0.05)"
      overflow="hidden"
      transition="all 0.22s"
      opacity={combo.isActive ? 1 : 0.65}
      _hover={{ boxShadow: "0 6px 24px rgba(249,115,22,0.12)", transform: "translateY(-3px)", border: "1.5px solid #fed7aa" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
    >
      {/* Image / Placeholder */}
      <Box position="relative" h="130px" bg="linear-gradient(135deg, #fff7ed, #ffedd5)" overflow="hidden">
        {combo.image ? (
          <img src={combo.image} alt={combo.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <Flex align="center" justify="center" h="100%">
            <Box sx={{ animation: `${float} 3s ease-in-out infinite` }}>
              <Icon as={FaBoxOpen} boxSize="44px" color="#fed7aa" />
            </Box>
          </Flex>
        )}
        {/* Discount badge */}
        {discount > 0 && (
          <Box position="absolute" top="10px" left="10px"
            px="8px" py="4px" borderRadius="7px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            boxShadow="0 2px 8px rgba(249,115,22,0.4)"
          >
            <Text fontSize="10.5px" fontWeight="800" color="white">-{discount}%</Text>
          </Box>
        )}
        {/* Seasonal tag */}
        {combo.isSeasonal && (
          <Box position="absolute" top="10px" right="10px"
            px="7px" py="3px" borderRadius="6px" bg="rgba(255,255,255,0.92)"
            border="1px solid #7dd3fc"
          >
            <Text fontSize="10px" fontWeight="800" color="#0284c7">Theo mùa</Text>
          </Box>
        )}
        {/* Active toggle overlay */}
        {!combo.isActive && (
          <Box position="absolute" inset="0" bg="rgba(255,255,255,0.55)"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Box px="12px" py="5px" borderRadius="8px" bg="rgba(100,116,139,0.9)">
              <Text fontSize="11px" fontWeight="800" color="white">Đã tắt</Text>
            </Box>
          </Box>
        )}
      </Box>

      <Box p="14px">
        {/* Name + tag */}
        <Flex align="flex-start" justify="space-between" gap="8px" mb="6px">
          <Text fontSize="13.5px" fontWeight="800" color="#0f172a" lineHeight="1.3" flex="1">
            {combo.name}
          </Text>
          <TagBadge tag={combo.tag} />
        </Flex>

        {/* Category */}
        <Box px="7px" py="2px" borderRadius="5px" bg="#f1f5f9" display="inline-block" mb="8px">
          <Text fontSize="10px" fontWeight="600" color="#64748b">{combo.category}</Text>
        </Box>

        {/* Description */}
        <Text fontSize="11.5px" color="#64748b" lineHeight="1.6" mb="10px" noOfLines={2}>
          {combo.description}
        </Text>

        {/* Items chips */}
        <Flex gap="5px" flexWrap="wrap" mb="12px">
          {combo.items.map((item) => (
            <Box key={item} px="7px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
              <Text fontSize="10.5px" fontWeight="600" color="#c2410c">{item}</Text>
            </Box>
          ))}
        </Flex>

        <Box h="1px" bg="#f8fafc" mb="12px" />

        {/* Price + sold */}
        <Flex align="center" justify="space-between" mb="12px">
          <Box>
            <Text fontSize="17px" fontWeight="800" color="#f97316" lineHeight="1">
              {combo.price.toLocaleString("vi-VN")}đ
            </Text>
            <Text fontSize="10.5px" color="#94a3b8" mt="2px"
              textDecoration="line-through">
              {combo.originalPrice.toLocaleString("vi-VN")}đ
            </Text>
          </Box>
          <Flex align="center" gap="5px">
            <Icon as={MdShoppingCart} boxSize="11px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="700" color="#475569">
              {combo.soldCount.toLocaleString()} đã bán
            </Text>
          </Flex>
        </Flex>

        {/* Actions */}
        <Flex gap="8px">
          <Button flex="1" h="34px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)" transition="all 0.15s"
            onClick={() => onEdit(combo)}
          >Sửa</Button>
          <Button h="34px" px="12px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg={combo.isActive ? "#fef2f2" : "#f0fdf4"}
            color={combo.isActive ? "#dc2626" : "#16a34a"}
            border={combo.isActive ? "1px solid #fca5a5" : "1px solid #86efac"}
            leftIcon={<Icon as={combo.isActive ? MdVisibilityOff : MdVisibility} boxSize="12px" />}
            _hover={{ opacity: 0.88 }} transition="all 0.15s"
            onClick={() => onToggle(combo.id)}
          >{combo.isActive ? "Tắt" : "Bật"}</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Combo Row (Table View) ───────────────────────────────────────────────────
function ComboRow({ combo, index, onEdit, onToggle }) {
  const discount = Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100);
  return (
    <Box p="12px 18px" borderRadius="12px" bg="white"
      border="1.5px solid #f1f5f9" transition="all 0.18s"
      opacity={combo.isActive ? 1 : 0.65}
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center">
        <Box w="28px" flexShrink="0">
          <Text fontSize="11px" fontWeight="700" color="#cbd5e1">{String(index + 1).padStart(2, "0")}</Text>
        </Box>
        {/* Image thumbnail */}
        <Box w="44px" h="44px" borderRadius="9px" overflow="hidden" flexShrink="0" mr="14px"
          bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
          display="flex" alignItems="center" justifyContent="center"
        >
          {combo.image
            ? <img src={combo.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Icon as={FaBoxOpen} boxSize="18px" color="#fed7aa" />
          }
        </Box>
        {/* Name + items */}
        <Box flex="2" minW="0" pr="12px">
          <Flex align="center" gap="7px" mb="3px">
            <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{combo.name}</Text>
            <TagBadge tag={combo.tag} />
          </Flex>
          <Flex gap="4px" flexWrap="nowrap" overflow="hidden">
            {combo.items.slice(0, 3).map((item) => (
              <Box key={item} px="6px" py="1px" borderRadius="4px" bg="#fff7ed" border="1px solid #fcd34d" flexShrink="0">
                <Text fontSize="9.5px" fontWeight="600" color="#c2410c" whiteSpace="nowrap">{item}</Text>
              </Box>
            ))}
            {combo.items.length > 3 && (
              <Box px="6px" py="1px" borderRadius="4px" bg="#f1f5f9" flexShrink="0">
                <Text fontSize="9.5px" fontWeight="600" color="#64748b">+{combo.items.length - 3}</Text>
              </Box>
            )}
          </Flex>
        </Box>
        {/* Category */}
        <Box flex="0.8" minW="0" pr="12px">
          <Box px="7px" py="3px" borderRadius="5px" bg="#f1f5f9" display="inline-block">
            <Text fontSize="10.5px" fontWeight="600" color="#64748b" noOfLines={1}>{combo.category}</Text>
          </Box>
        </Box>
        {/* Price */}
        <Box flex="0.8" minW="0" pr="12px">
          <Text fontSize="13px" fontWeight="800" color="#f97316">
            {combo.price.toLocaleString("vi-VN")}đ
          </Text>
          {discount > 0 && (
            <Flex align="center" gap="4px">
              <Text fontSize="10px" color="#94a3b8" textDecoration="line-through">
                {combo.originalPrice.toLocaleString("vi-VN")}đ
              </Text>
              <Box px="4px" borderRadius="4px" bg="#fff7ed">
                <Text fontSize="9.5px" fontWeight="800" color="#f97316">-{discount}%</Text>
              </Box>
            </Flex>
          )}
        </Box>
        {/* Sold */}
        <Box flex="0.6" minW="0" pr="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdShoppingCart} boxSize="11px" color="#94a3b8" />
            <Text fontSize="12px" fontWeight="700" color="#475569">{combo.soldCount.toLocaleString()}</Text>
          </Flex>
        </Box>
        {/* Status */}
        <Box flex="0.5" minW="0" pr="12px">
          <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px"
            bg={combo.isActive ? "#ecfdf5" : "#f9fafb"}
            border={combo.isActive ? "1px solid #6ee7b7" : "1px solid #e5e7eb"}
            display="inline-flex"
          >
            <Box w="6px" h="6px" borderRadius="full"
              bg={combo.isActive ? "#10b981" : "#9ca3af"}
              sx={combo.isActive ? { animation: `${pulse} 2s ease infinite` } : {}}
            />
            <Text fontSize="11px" fontWeight="700" color={combo.isActive ? "#059669" : "#6b7280"}>
              {combo.isActive ? "Đang bán" : "Đã tắt"}
            </Text>
          </Flex>
        </Box>
        {/* Actions */}
        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)" transition="all 0.15s"
            onClick={() => onEdit(combo)}
          >Sửa</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={combo.isActive ? "#fef2f2" : "#f0fdf4"}
            color={combo.isActive ? "#dc2626" : "#16a34a"}
            border={combo.isActive ? "1px solid #fca5a5" : "1px solid #86efac"}
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={combo.isActive ? MdVisibilityOff : MdVisibility} boxSize="11px" />}
            _hover={{ opacity: 0.88 }} transition="all 0.15s"
            onClick={() => onToggle(combo.id)}
          >{combo.isActive ? "Tắt" : "Bật"}</Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── Form (Add / Edit) ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", description: "", price: "", originalPrice: "",
  image: "", items: [""], category: "Combo Đôi",
  maxPerOrder: 3, isActive: true, isSeasonal: false, tag: "Mới",
};

function ComboForm({ combo, onCancel, onSave, isAdd = false }) {
  const [form, setForm] = useState(
    combo ? { ...combo, items: [...combo.items] } : { ...EMPTY_FORM }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setItem = (i, val) => {
    const arr = [...form.items];
    arr[i] = val;
    set("items", arr);
  };
  const addItem    = () => set("items", [...form.items, ""]);
  const removeItem = (i) => set("items", form.items.filter((_, idx) => idx !== i));

  const discount = form.originalPrice && form.price
    ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
    : 0;

  return (
    <Box sx={{ animation: `${scaleIn} 0.28s ease both` }}>
      {/* Header */}
      <Flex align={{ base: "flex-start", sm: "center" }} gap="12px" mb="20px"
        direction={{ base: "column", sm: "row" }}
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} flexShrink="0"
          onClick={onCancel}
        >Quay lại</Button>
        <Box>
          <Text fontSize={{ base: "17px", md: "20px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.4px">
            {isAdd ? "Thêm Combo mới" : `Chỉnh sửa: ${combo?.name}`}
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="2px">
            {isAdd ? "Tạo gói combo mới cho hệ thống đặt vé" : "Cập nhật thông tin gói combo"}
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap="16px">
        {/* Left */}
        <Flex direction="column" gap="14px">
          {/* Basic info */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Thông tin cơ bản" />
            <Grid templateColumns="1fr" gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Tên combo *</Text>
                <Input {...inputStyle} placeholder="VD: Combo Đôi Lãng Mạn"
                  value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Box>
            </Grid>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Danh mục *</Text>
                <Select {...inputStyle} value={form.category}
                  onChange={(e) => set("category", e.target.value)}>
                  <option>Combo Solo</option>
                  <option>Combo Đôi</option>
                  <option>Combo Gia Đình</option>
                  <option>Combo VIP</option>
                </Select>
              </Box>
              <Box>
                <Text sx={labelStyle}>Nhãn hiển thị</Text>
                <Select {...inputStyle} value={form.tag}
                  onChange={(e) => set("tag", e.target.value)}>
                  <option>Bán chạy</option>
                  <option>Mới</option>
                  <option>Phổ biến</option>
                  <option>Theo mùa</option>
                  <option>VIP</option>
                </Select>
              </Box>
            </Grid>
            <Box>
              <Text sx={labelStyle}>Mô tả combo</Text>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                color="#1a202c" fontSize="13.5px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color: "#b0bac8" }}
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }}
                transition="all 0.2s" rows={3}
                placeholder="Mô tả ngắn gọn, hấp dẫn về combo..."
                value={form.description} onChange={(e) => set("description", e.target.value)}
              />
            </Box>
          </Box>

          {/* Items */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <Flex align="center" justify="space-between" mb="14px">
              <SectionTitle label="Thành phần combo" />
              <Button size="xs" h="28px" px="10px" borderRadius="7px"
                bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
                fontSize="11px" fontWeight="700"
                leftIcon={<Icon as={MdAdd} boxSize="11px" />}
                _hover={{ opacity: 0.88 }}
                onClick={addItem}
                mt="-14px"
              >Thêm mục</Button>
            </Flex>
            <Flex direction="column" gap="8px">
              {form.items.map((item, i) => (
                <Flex key={i} gap="8px" align="center">
                  <Box
                    w="24px" h="24px" borderRadius="7px" flexShrink="0"
                    bg="linear-gradient(135deg, #f97316, #fb923c)"
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Text fontSize="10px" fontWeight="800" color="white">{i + 1}</Text>
                  </Box>
                  <Input flex="1" {...inputStyle} h="38px"
                    placeholder={`VD: 1 Bắp Lớn Bơ Mặn`}
                    value={item} onChange={(e) => setItem(i, e.target.value)}
                  />
                  {form.items.length > 1 && (
                    <Button h="38px" w="38px" p="0" borderRadius="9px"
                      bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                      _hover={{ bg: "#fee2e2" }} flexShrink="0"
                      onClick={() => removeItem(i)}
                    >
                      <Icon as={MdClose} boxSize="13px" />
                    </Button>
                  )}
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* Pricing */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <SectionTitle label="Giá & Số lượng" />
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap="14px">
              <Box>
                <Text sx={labelStyle}>Giá bán (đ) *</Text>
                <Input {...inputStyle} type="number" placeholder="VD: 120000"
                  value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Giá gốc (đ)</Text>
                <Input {...inputStyle} type="number" placeholder="VD: 150000"
                  value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
              </Box>
              <Box>
                <Text sx={labelStyle}>Tối đa / đơn hàng</Text>
                <Select {...inputStyle} value={form.maxPerOrder}
                  onChange={(e) => set("maxPerOrder", Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              </Box>
            </Grid>
            {/* Discount preview */}
            {discount > 0 && (
              <Flex align="center" gap="8px" mt="12px" p="10px 14px" borderRadius="10px"
                bg="#fff7ed" border="1px solid #fed7aa"
                sx={{ animation: `${fadeIn} 0.3s ease both` }}
              >
                <Icon as={FaPercent} boxSize="12px" color="#f97316" />
                <Text fontSize="12px" fontWeight="700" color="#c2410c">
                  Khách hàng tiết kiệm {discount}% –&nbsp;
                  {(Number(form.originalPrice) - Number(form.price)).toLocaleString("vi-VN")}đ
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* Right */}
        <Flex direction="column" gap="14px">
          {/* Image */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Hình ảnh combo" />
            <Text sx={labelStyle} mb="7px">URL ảnh</Text>
            <Input {...inputStyle} placeholder="https://..."
              value={form.image} onChange={(e) => set("image", e.target.value)} mb="12px" />
            {form.image ? (
              <Box borderRadius="12px" overflow="hidden" border="1px solid #f1f5f9">
                <img src={form.image} alt="preview"
                  style={{ width: "100%", maxHeight: "180px", objectFit: "cover", display: "block" }} />
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center"
                h="120px" borderRadius="12px" bg="#fff7ed" border="2px dashed #fed7aa"
              >
                <Icon as={MdImageSearch} boxSize="26px" color="#fcd34d" mb="5px" />
                <Text fontSize="11.5px" color="#94a3b8">Nhập URL để xem trước</Text>
              </Flex>
            )}
            <Button w="100%" h="36px" mt="10px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdImageSearch} boxSize="12px" />}
              _hover={{ bg: "#f1f5f9" }}
            >Tải ảnh lên</Button>
          </Box>

          {/* Settings */}
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
          >
            <SectionTitle label="Cài đặt hiển thị" />
            <Flex direction="column" gap="14px">
              {[
                {
                  key: "isActive", label: "Đang bán",
                  sub: "Combo hiển thị và có thể chọn trên trang đặt vé",
                  onColor: "#f97316",
                },
                {
                  key: "isSeasonal", label: "Combo theo mùa",
                  sub: "Gắn nhãn theo mùa / sự kiện đặc biệt",
                  onColor: "#0284c7",
                },
              ].map(({ key, label, sub }) => (
                <Flex key={key} align="center" justify="space-between">
                  <Box>
                    <Text fontSize="13px" fontWeight="700" color="#0f172a">{label}</Text>
                    <Text fontSize="11px" color="#94a3b8" mt="1px">{sub}</Text>
                  </Box>
                  <Switch
                    isChecked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    colorScheme="orange"
                    size="md"
                  />
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* Preview card */}
          {form.name && (
            <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "18px" }}
              sx={{ animation: `${fadeIn} 0.3s ease both` }}
            >
              <SectionTitle label="Xem trước" />
              <Box borderRadius="12px" border="1px solid #f1f5f9" overflow="hidden">
                <Box h="70px" bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={FaBoxOpen} boxSize="28px" color="#fed7aa" />
                </Box>
                <Box p="12px">
                  <Flex align="flex-start" justify="space-between" gap="6px" mb="5px">
                    <Text fontSize="12.5px" fontWeight="800" color="#0f172a" flex="1">{form.name}</Text>
                    <TagBadge tag={form.tag} />
                  </Flex>
                  {form.price && (
                    <Flex align="center" gap="6px">
                      <Text fontSize="14px" fontWeight="800" color="#f97316">
                        {Number(form.price).toLocaleString("vi-VN")}đ
                      </Text>
                      {discount > 0 && (
                        <Box px="5px" borderRadius="4px" bg="#fff7ed">
                          <Text fontSize="9.5px" fontWeight="800" color="#f97316">-{discount}%</Text>
                        </Box>
                      )}
                    </Flex>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Flex>
      </Grid>

      {/* Save bar */}
      <Box bg="white" borderRadius="14px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        p={{ base: "14px 16px", md: "16px 20px" }} mt="16px"
        position={{ base: "sticky", md: "static" }} bottom={{ base: "0", md: "auto" }} zIndex="10"
      >
        <Flex justify={{ base: "stretch", md: "flex-end" }} gap="10px">
          <Button flex={{ base: "1", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="22px" variant="ghost"
            color="#64748b" borderRadius="10px" fontWeight="600" fontSize="13px"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
            leftIcon={<Icon as={MdClose} />}
            onClick={onCancel}
          >Hủy bỏ</Button>
          <Button flex={{ base: "2", md: "none" }}
            h={{ base: "46px", md: "42px" }} px="28px" borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)"
            color="white" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave(form)}
          >{isAdd ? "Thêm combo" : "Lưu thay đổi"}</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyCombo() {
  const [view, setView]           = useState("list");
  const [selected, setSelected]   = useState(null);
  const [combos, setCombos]       = useState(INIT_COMBOS);
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [displayMode, setDisplayMode]   = useState("grid"); // "grid" | "table"
  const [showFilter, setShowFilter]     = useState(false);

  const filtered = combos.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q)
      || c.description.toLowerCase().includes(q)
      || c.items.some((i) => i.toLowerCase().includes(q));
    const matchCat    = filterCat === "Tất cả" || c.category === filterCat;
    const matchStatus = filterStatus === "Tất cả"
      || (filterStatus === "Đang bán" && c.isActive)
      || (filterStatus === "Đã tắt" && !c.isActive);
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total:   combos.length,
    active:  combos.filter((c) => c.isActive).length,
    hidden:  combos.filter((c) => !c.isActive).length,
    totalSold: combos.reduce((s, c) => s + c.soldCount, 0),
    seasonal: combos.filter((c) => c.isSeasonal).length,
  };

  const handleToggle = (id) => {
    setCombos((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleSave = (form) => {
    const items = form.items.filter((i) => i.trim() !== "");
    if (view === "add") {
      setCombos((prev) => [
        ...prev,
        { ...form, id: Date.now(), items, soldCount: 0, sortOrder: prev.length + 1 },
      ]);
    } else {
      setCombos((prev) => prev.map((c) =>
        c.id === selected.id ? { ...c, ...form, items } : c
      ));
    }
    setView("list");
    setSelected(null);
  };

  // ── FORM VIEW ──
  if (view === "add" || view === "edit") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <ComboForm
          combo={view === "edit" ? combos.find((c) => c.id === selected?.id) : null}
          isAdd={view === "add"}
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="38px" h="38px" borderRadius="11px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 12px rgba(249,115,22,0.35)"
            >
              <Icon as={FaCoffee} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
              Combo Bắp Nước
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl="48px">
            Tạo và quản lý các gói combo bắp nước cho hệ thống đặt vé
          </Text>
        </Box>

        <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          w={{ base: "100%", md: "auto" }}
        >
          {/* View toggle */}
          <Flex borderRadius="10px" border="1px solid #e2e8f0" overflow="hidden" flexShrink="0">
            {["grid", "table"].map((mode) => (
              <Button key={mode} h="40px" px="14px" borderRadius="0"
                bg={displayMode === mode ? "linear-gradient(135deg,#f97316,#fb923c)" : "#f8fafc"}
                color={displayMode === mode ? "white" : "#64748b"}
                fontSize="12px" fontWeight="700"
                _hover={{ opacity: 0.9 }} transition="all 0.15s"
                onClick={() => setDisplayMode(mode)}
              >
                {mode === "grid" ? "Lưới" : "Bảng"}
              </Button>
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
          >Thêm Combo</Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing="12px" mb="18px">
        <StatCard label="Tổng combo"     value={stats.total}    icon={FaBoxOpen}   accent="#f97316" delay={0}    />
        <StatCard label="Đang bán"       value={stats.active}   icon={MdToggleOn}  accent="#10b981" delay={0.04} />
        <StatCard label="Đã tắt"         value={stats.hidden}   icon={MdToggleOff} accent="#6b7280" delay={0.08} />
        <StatCard label="Theo mùa"       value={stats.seasonal} icon={MdStar}      accent="#0284c7" delay={0.12} />
        <StatCard
          label="Tổng lượt bán"
          value={stats.totalSold.toLocaleString()}
          icon={MdBarChart} accent="#f97316" delay={0.16}
        />
      </SimpleGrid>

      {/* Table / Grid card */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Card header */}
        <Box p={{ base: "14px 16px", md: "16px 20px 14px" }} borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "13px", md: "14.5px" }} color="#0f172a">
                Danh sách combo
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} combo</Text>
              </Box>
            </Flex>
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: "#f1f5f9" }}
              onClick={() => setShowFilter((v) => !v)}
            >Lọc</Button>
          </Flex>

          {/* Filters */}
          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr" }} gap="8px">
              <Box position="relative">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="13px" color="#94a3b8" zIndex="1" />
                <Input pl="30px" h={{ base: "40px", md: "34px" }} w="100%"
                  fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên combo, mô tả, thành phần..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
              <Select h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                transition="all 0.2s"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Đang bán</option>
                <option>Đã tắt</option>
              </Select>
            </Grid>
          </Box>
        </Box>

        {/* Content */}
        <Box p="14px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="52px" color="#cbd5e1">
              <Icon as={FaBoxOpen} boxSize="32px" mb="10px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy combo nào</Text>
              <Text fontSize="11.5px" color="#cbd5e1" mt="4px">Thử thay đổi bộ lọc hoặc thêm combo mới</Text>
            </Flex>
          ) : displayMode === "grid" ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="14px">
              {filtered.map((c, i) => (
                <ComboCard key={c.id} combo={c} index={i}
                  onEdit={(cb) => { setSelected(cb); setView("edit"); }}
                  onToggle={handleToggle}
                />
              ))}
            </SimpleGrid>
          ) : (
            <>
              {/* Table headers */}
              <Flex px="16px" py="9px" bg="#fafbfc" borderRadius="10px" mb="8px"
                display={{ base: "none", md: "flex" }}
              >
                <Box w="28px" flexShrink="0" />
                <Box w="44px" mr="14px" flexShrink="0" />
                {[
                  { label: "Tên combo / Thành phần", flex: "2" },
                  { label: "Danh mục", flex: "0.8" },
                  { label: "Giá bán", flex: "0.8" },
                  { label: "Đã bán", flex: "0.6" },
                  { label: "Trạng thái", flex: "0.5" },
                ].map(({ label, flex }) => (
                  <Box key={label} flex={flex} minW="0" pr="12px">
                    <Text fontSize="10px" fontWeight="800" color="#94a3b8"
                      letterSpacing="1px" textTransform="uppercase">{label}</Text>
                  </Box>
                ))}
                <Box w="130px" flexShrink="0" textAlign="right">
                  <Text fontSize="10px" fontWeight="800" color="#94a3b8"
                    letterSpacing="1px" textTransform="uppercase">Thao tác</Text>
                </Box>
              </Flex>
              <Flex direction="column" gap="8px">
                {filtered.map((c, i) => (
                  <ComboRow key={c.id} combo={c} index={i}
                    onEdit={(cb) => { setSelected(cb); setView("edit"); }}
                    onToggle={handleToggle}
                  />
                ))}
              </Flex>
            </>
          )}
        </Box>

        {/* Footer */}
        {filtered.length > 0 && (
          <Box px={{ base: "14px", md: "20px" }} py="12px" borderTop="1px solid #f8fafc">
            <Text fontSize="12px" color="#94a3b8">
              Hiển thị <strong>{filtered.length}</strong> / {combos.length} combo ·{" "}
              <Text as="span" color="#10b981" fontWeight="700">{stats.active} đang bán</Text>,{" "}
              <Text as="span" color="#6b7280" fontWeight="700">{stats.hidden} đã tắt</Text>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}