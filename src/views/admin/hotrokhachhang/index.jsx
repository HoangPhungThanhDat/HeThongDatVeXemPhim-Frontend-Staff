import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid,
  FormControl, Input, Select, Textarea, Icon, keyframes,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  useDisclosure, useBreakpointValue, Drawer, DrawerOverlay,
  DrawerContent, DrawerCloseButton, DrawerBody,
} from "@chakra-ui/react";
import {
  MdAdd, MdVisibility, MdEdit, MdArrowBack, MdClose, MdCheckCircle,
  MdSearch, MdHeadsetMic, MdPerson, MdEmail, MdSubject, MdMessage,
  MdFlag, MdSupportAgent, MdSend, MdDone, MdPending, MdBlock,
  MdOpenInNew, MdChat, MdOutlineMarkEmailRead, MdFilterList,
  MdInbox, MdOutbox,
} from "react-icons/md";
import {
  FaHeadset, FaTicketAlt, FaClock, FaUserCircle, FaReply,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaHourglass,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ───────────────────────────────────────────────────────────────
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
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Configs (Orange theme) ───────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Chờ phản hồi": { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", dot: "#f97316", icon: MdPending },
  "Đang xử lý":   { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", icon: MdEdit },
  "Đã hoàn thành":{ color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", icon: MdDone },
  "Đã đóng":      { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af", icon: MdBlock },
  "Chuyển Admin": { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", icon: MdOpenInNew },
};

const PRIORITY_CONFIG = {
  "Thấp":       { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "Bình thường":{ color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  "Cao":        { color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
  "Khẩn cấp":  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

const CATEGORY_CONFIG = {
  "Hỏi thông tin":     { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  "Khiếu nại":         { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  "Báo lỗi":           { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  "Yêu cầu hoàn tiền": { color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
};

const ORANGE = "#ea580c";
const ORANGE_LIGHT = "#fb923c";
const ORANGE_PALE = "#fff7ed";
const ORANGE_BORDER = "#fed7aa";
const ORANGE_SHADOW = "rgba(234,88,12,0.25)";

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
  _focus: { border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.10)`, bg: "#ffffff" },
  _hover: { border: `1.5px solid ${ORANGE}`, bg: "#ffffff" },
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

const COL = {
  idx:     "40px",
  id:      "80px",
  customer:"180px",
  subject: "1",
  priority:"90px",
  status:  "140px",
  date:    "100px",
  replies: "64px",
  actions: "140px",
};

// ─── Shared Components ────────────────────────────────────────────────────────
function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg={`linear-gradient(180deg, ${ORANGE}, ${ORANGE_LIGHT})`} />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg, #f1f5f9, transparent)" />
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Đã đóng"];
  const isActive = status === "Đang xử lý" || status === "Chờ phản hồi";
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={isActive ? { animation: `${pulse} 1.8s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Bình thường"];
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="800" color={cfg.color} whiteSpace="nowrap">{priority}</Text>
    </Box>
  );
}

function CategoryBadge({ category }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Hỏi thông tin"];
  return (
    <Box px="8px" py="3px" borderRadius="6px" bg={cfg.bg}
      border={`1px solid ${cfg.border}`} display="inline-block"
    >
      <Text fontSize="11px" fontWeight="700" color={cfg.color} whiteSpace="nowrap">{category}</Text>
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
            letterSpacing="0.8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
        </Box>
        <Box w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={icon} boxSize={{ base: "15px", md: "18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const TICKETS = [
  {
    id: "TK-001", name: "Nguyễn Văn An", email: "nguyenvanan@gmail.com",
    subject: "Không đặt được vé phim Avengers",
    message: "Tôi đã thử thanh toán nhiều lần nhưng hệ thống báo lỗi. Mã lỗi hiển thị: PAYMENT_FAILED_4023. Giao dịch vẫn bị trừ tiền nhưng vé chưa được xác nhận.",
    category: "Báo lỗi", priority: "Cao", status: "Đang xử lý",
    date: "22/05/2026", time: "14:32",
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chào anh/chị, chúng tôi đang kiểm tra lại giao dịch. Vui lòng cho biết số điện thoại đăng ký tài khoản.", time: "14:45" },
    ],
  },
  {
    id: "TK-002", name: "Trần Thị Bình", email: "tranthibinh@gmail.com",
    subject: "Yêu cầu hoàn tiền vé suất chiếu 20:00",
    message: "Tôi đã đặt vé suất 20:00 ngày 21/05 nhưng gia đình có việc đột xuất không xem được. Xin được hoàn lại tiền theo chính sách hoàn vé của rạp.",
    category: "Yêu cầu hoàn tiền", priority: "Bình thường", status: "Chờ phản hồi",
    date: "21/05/2026", time: "09:15",
    replies: [],
  },
  {
    id: "TK-003", name: "Lê Hoàng Cường", email: "lehcuong@gmail.com",
    subject: "Hỏi về chương trình ưu đãi hội viên",
    message: "Cho tôi hỏi hội viên Vàng được giảm giá bao nhiêu phần trăm khi mua vé cuối tuần?",
    category: "Hỏi thông tin", priority: "Thấp", status: "Đã hoàn thành",
    date: "20/05/2026", time: "16:50",
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Hội viên Vàng được giảm 15% vé cuối tuần và 20% vé ngày thường. Ưu đãi áp dụng tối đa 2 vé/lần đặt.", time: "17:10" },
    ],
  },
  {
    id: "TK-004", name: "Phạm Minh Đức", email: "phamminhduc@gmail.com",
    subject: "Ghế ngồi bị hỏng, ảnh hưởng trải nghiệm xem phim",
    message: "Tôi đặt ghế C5 phòng 2 tối qua. Ghế bị hỏng lò xo, không ngồi được thoải mái suốt 2 tiếng xem phim.",
    category: "Khiếu nại", priority: "Khẩn cấp", status: "Chuyển Admin",
    date: "22/05/2026", time: "22:05",
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chúng tôi thành thật xin lỗi về sự cố này. Trường hợp đã được chuyển lên cấp quản lý.", time: "22:30" },
    ],
  },
  {
    id: "TK-005", name: "Hoàng Thị Lan", email: "hoangtilan@gmail.com",
    subject: "App bị treo khi chọn ghế",
    message: "Ứng dụng điện thoại (iOS 17.4) bị treo hoàn toàn ở bước chọn ghế. Tôi đã thử xoá và cài lại nhưng vẫn gặp lỗi tương tự.",
    category: "Báo lỗi", priority: "Cao", status: "Đang xử lý",
    date: "22/05/2026", time: "11:20",
    replies: [],
  },
  {
    id: "TK-006", name: "Vũ Quốc Toản", email: "vuquoctoan@gmail.com",
    subject: "Không nhận được email xác nhận vé",
    message: "Tôi đã thanh toán thành công (đã trừ tiền) nhưng sau 30 phút vẫn không nhận được email xác nhận vé.",
    category: "Báo lỗi", priority: "Bình thường", status: "Đã đóng",
    date: "19/05/2026", time: "20:40",
    replies: [
      { from: "staff", name: "Nhân viên CSKH", content: "Chúng tôi đã gửi lại email xác nhận. Anh/chị vui lòng kiểm tra hộp thư.", time: "21:00" },
      { from: "user", name: "Vũ Quốc Toản", content: "Đã nhận được rồi ạ. Cảm ơn!", time: "21:05" },
    ],
  },
];

// ─── Add Ticket Modal (Mobile-aware) ─────────────────────────────────────────
const EMPTY_FORM = {
  name: "", email: "", subject: "", message: "",
  category: "Hỏi thông tin", priority: "Bình thường", status: "Chờ phản hồi",
};

function AddTicketModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSave = form.name && form.email && form.subject && form.message;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSave = () => {
    if (!canSave) return;
    onSave(form);
    setForm(EMPTY_FORM);
    onClose();
  };

  const FormBody = () => (
    <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
      <Box px={{ base: "18px", md: "28px" }} py={{ base: "18px", md: "24px" }}
        flex="1" overflowY="auto"
      >
        <Text fontSize={{ base: "16px", md: "18px" }} fontWeight="800" color="#0f172a"
          letterSpacing="-0.4px" mb="4px" sx={{ animation: `${fadeUp} 0.35s ease both` }}>
          Thông tin yêu cầu
        </Text>
        <Text fontSize="12px" color="#94a3b8" mb="20px"
          sx={{ animation: `${fadeUp} 0.35s ease 0.05s both` }}>
          Trường có dấu <Text as="span" color={ORANGE}>*</Text> là bắt buộc
        </Text>

        <SectionTitle label="Thông tin khách hàng" />
        <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="12px" mb="16px">
          <Box>
            <Text sx={labelStyle}>Tên khách hàng *</Text>
            <FormControl>
              <Input {...inputStyle} placeholder="Nguyễn Văn A"
                value={form.name} onChange={e => set("name", e.target.value)} />
            </FormControl>
          </Box>
          <Box>
            <Text sx={labelStyle}>Email *</Text>
            <FormControl>
              <Input {...inputStyle} type="email" placeholder="email@gmail.com"
                value={form.email} onChange={e => set("email", e.target.value)} />
            </FormControl>
          </Box>
        </Grid>

        <SectionTitle label="Nội dung yêu cầu" />
        <Box mb="12px">
          <Text sx={labelStyle}>Chủ đề *</Text>
          <FormControl>
            <Input {...inputStyle} placeholder="VD: Không đặt được vé"
              value={form.subject} onChange={e => set("subject", e.target.value)} />
          </FormControl>
        </Box>
        <Box mb="16px">
          <Text sx={labelStyle}>Mô tả chi tiết *</Text>
          <FormControl>
            <Textarea
              bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
              color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
              _placeholder={{ color: "#b0bac8" }}
              _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.10)`, bg: "#fff" }}
              _hover={{ border: `1.5px solid ${ORANGE}` }}
              transition="all 0.2s"
              rows={3} placeholder="Mô tả chi tiết vấn đề..."
              value={form.message} onChange={e => set("message", e.target.value)}
            />
          </FormControl>
        </Box>

        <SectionTitle label="Phân loại" />
        <Grid templateColumns={{ base: "1fr 1fr", sm: "1fr 1fr 1fr" }} gap="12px">
          <Box>
            <Text sx={labelStyle}>Loại yêu cầu</Text>
            <FormControl>
              <Select {...inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
                <option>Hỏi thông tin</option>
                <option>Khiếu nại</option>
                <option>Báo lỗi</option>
                <option>Yêu cầu hoàn tiền</option>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Text sx={labelStyle}>Ưu tiên</Text>
            <FormControl>
              <Select {...inputStyle} value={form.priority} onChange={e => set("priority", e.target.value)}>
                <option>Thấp</option>
                <option>Bình thường</option>
                <option>Cao</option>
                <option>Khẩn cấp</option>
              </Select>
            </FormControl>
          </Box>
          <Box gridColumn={{ base: "span 2", sm: "span 1" }}>
            <Text sx={labelStyle}>Trạng thái</Text>
            <FormControl>
              <Select {...inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Chờ phản hồi</option>
                <option>Đang xử lý</option>
                <option>Đã hoàn thành</option>
                <option>Đã đóng</option>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Box>

      <Box px={{ base: "18px", md: "28px" }} py="18px" borderTop="1px solid #f1f5f9"
        bg="linear-gradient(180deg, #fff 0%, #fafafa 100%)"
      >
        <Flex justify="flex-end" gap="10px">
          <Button h="42px" px="20px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg: "#f8fafc" }} transition="all 0.2s"
            leftIcon={<Icon as={MdClose} />} onClick={onClose}
          >Hủy bỏ</Button>
          <Button h="42px" px="24px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={canSave ? `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)` : "#e2e8f0"}
            color={canSave ? "#fff" : "#94a3b8"}
            boxShadow={canSave ? `0 4px 16px ${ORANGE_SHADOW}` : "none"}
            _hover={canSave ? { boxShadow: `0 8px 24px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" } : {}}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            isDisabled={!canSave}
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={handleSave}
          >Tạo yêu cầu</Button>
        </Flex>
      </Box>
    </Box>
  );

  // Mobile: Drawer from bottom
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
        <DrawerOverlay bg="rgba(15,23,42,0.65)" backdropFilter="blur(8px)" />
        <DrawerContent borderTopRadius="20px" overflow="hidden" maxH="95vh">
          <Box h="4px" bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT}, #fbbf24, ${ORANGE_LIGHT}, ${ORANGE})`}
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} flexShrink="0" />
          {/* Handle bar */}
          <Flex justify="center" pt="10px" pb="4px" flexShrink="0">
            <Box w="40px" h="4px" borderRadius="full" bg="#e2e8f0" />
          </Flex>
          <DrawerCloseButton color="#94a3b8" top="18px" right="16px" size="sm"
            borderRadius="10px" _hover={{ color: "#374151", bg: "#f1f5f9" }} zIndex="10" />
          <DrawerBody p="0" display="flex" flexDirection="column" overflow="hidden">
            {/* Mobile header */}
            <Flex align="center" gap="10px" px="18px" pb="14px" flexShrink="0">
              <Box w="36px" h="36px" borderRadius="10px"
                bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
                display="flex" alignItems="center" justifyContent="center"
                boxShadow={`0 4px 12px ${ORANGE_SHADOW}`}
              >
                <Icon as={FaHeadset} boxSize="16px" color="white" />
              </Box>
              <Box>
                <Text fontSize="15px" fontWeight="800" color="#0f172a">Tạo yêu cầu hỗ trợ</Text>
                <Text fontSize="11px" color="#94a3b8">Điền thông tin để gửi đến CSKH</Text>
              </Box>
            </Flex>
            <Box h="1px" bg="#f1f5f9" flexShrink="0" />
            <FormBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Modal
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered motionPreset="none">
      <ModalOverlay bg="rgba(15,23,42,0.65)" backdropFilter="blur(8px)" />
      <ModalContent borderRadius="20px" border="1px solid #e2e8f0" bg="#fff"
        boxShadow="0 40px 100px rgba(0,0,0,0.2)" overflow="hidden" maxW="700px"
        sx={{ animation: `${scaleIn} 0.28s cubic-bezier(0.22,1,0.36,1) both` }}
      >
        <Box h="4px" bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT}, #fbbf24, ${ORANGE_LIGHT}, ${ORANGE})`}
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        <Flex>
          {/* Left decorative panel */}
          <Box w="220px" minW="220px" flexShrink="0"
            bg="linear-gradient(160deg, #431407 0%, #7c2d12 50%, #431407 100%)"
            p="28px 22px" display="flex" flexDirection="column" position="relative" overflow="hidden"
          >
            <Box position="absolute" top="-30px" right="-30px" w="130px" h="130px"
              borderRadius="full" bg="rgba(234,88,12,0.15)" border="1px solid rgba(234,88,12,0.2)" />
            <Box position="absolute" bottom="-15px" left="-25px" w="100px" h="100px"
              borderRadius="full" bg="rgba(251,146,60,0.08)" border="1px solid rgba(251,146,60,0.12)" />

            <Box w="48px" h="48px" borderRadius="14px"
              bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 8px 24px rgba(234,88,12,0.45)`} mb="18px"
              sx={{ animation: `${fadeIn} 0.5s ease 0.1s both` }}
            >
              <Icon as={FaHeadset} boxSize="20px" color="white" />
            </Box>

            <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.3" mb="8px"
              sx={{ animation: `${slideIn} 0.4s ease 0.15s both` }}>
              Tạo yêu cầu hỗ trợ
            </Text>
            <Text fontSize="11.5px" color="rgba(255,255,255,0.45)" lineHeight="1.6"
              sx={{ animation: `${slideIn} 0.4s ease 0.2s both` }}>
              Điền thông tin để gửi yêu cầu đến bộ phận CSKH
            </Text>

            <Box my="20px" h="1px" bg="linear-gradient(90deg, rgba(234,88,12,0.6), transparent)" />

            <Box sx={{ animation: `${fadeIn} 0.4s ease 0.25s both` }}>
              <Text fontSize="9px" color="rgba(251,146,60,0.9)" fontWeight="800"
                letterSpacing="2px" textTransform="uppercase" mb="12px">Xem trước</Text>
              <Flex direction="column" gap="10px">
                {[
                  { label: "Khách hàng", val: form.name },
                  { label: "Chủ đề", val: form.subject },
                  { label: "Phân loại", val: form.category },
                  { label: "Ưu tiên", val: form.priority },
                ].map(({ label, val }) => (
                  <Box key={label}>
                    <Text fontSize="9px" color="rgba(255,255,255,0.3)" fontWeight="700"
                      letterSpacing="1.2px" textTransform="uppercase" mb="2px">{label}</Text>
                    <Text fontSize="12.5px" fontWeight="600"
                      color={val ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)"}>
                      {val || "—"}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>

            <Box mt="auto" pt="16px">
              <Flex align="center" gap="7px" p="9px 12px" borderRadius="9px"
                bg="rgba(234,88,12,0.12)" border="1px solid rgba(234,88,12,0.25)">
                <Box w="5px" h="5px" borderRadius="full" bg={ORANGE_LIGHT}
                  sx={{ animation: `${pulse} 2s ease infinite` }} />
                <Text fontSize="10px" color="rgba(251,146,60,0.95)" fontWeight="700">Hỗ trợ khách hàng</Text>
              </Flex>
            </Box>
          </Box>

          <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
            <ModalCloseButton color="#94a3b8" top="16px" right="16px" size="sm"
              borderRadius="10px" _hover={{ color: "#374151", bg: "#f1f5f9" }} zIndex="10" />
            <FormBody />
          </Box>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

// ─── Mobile Ticket Card ───────────────────────────────────────────────────────
function TicketCard({ ticket, index, onView, onProcess }) {
  return (
    <Box p="14px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
      transition="all 0.2s"
      _active={{ border: `1.5px solid ${ORANGE_BORDER}`, bg: "#fffaf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      onClick={() => onView(ticket)}
    >
      {/* Top row: ID + Date */}
      <Flex justify="space-between" align="center" mb="10px">
        <Box px="7px" py="3px" borderRadius="6px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`} display="inline-block">
          <Text fontSize="10.5px" fontWeight="800" color={ORANGE} letterSpacing="0.5px">{ticket.id}</Text>
        </Box>
        <Text fontSize="10.5px" color="#94a3b8" fontWeight="500">{ticket.date} • {ticket.time}</Text>
      </Flex>

      {/* Subject */}
      <Text fontSize="13.5px" fontWeight="700" color="#0f172a" noOfLines={2} mb="8px" lineHeight="1.4">
        {ticket.subject}
      </Text>

      {/* Customer */}
      <Flex align="center" gap="6px" mb="10px">
        <Box w="22px" h="22px" borderRadius="full" bg="#f1f5f9"
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={FaUserCircle} boxSize="14px" color="#64748b" />
        </Box>
        <Text fontSize="12px" color="#475569" fontWeight="500" noOfLines={1}>{ticket.name}</Text>
      </Flex>

      {/* Badges row */}
      <Flex gap="6px" flexWrap="wrap" mb="12px">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <CategoryBadge category={ticket.category} />
      </Flex>

      {/* Actions */}
      <Flex gap="8px" onClick={e => e.stopPropagation()}>
        <Button flex="1" size="sm" h="34px" borderRadius="8px"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
          _hover={{ bg: "#f1f5f9" }}
          onClick={() => onView(ticket)}
        >Xem chi tiết</Button>
        {(ticket.status === "Chờ phản hồi" || ticket.status === "Đang xử lý") && (
          <Button flex="1" size="sm" h="34px" borderRadius="8px"
            bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
            color="white" fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            _hover={{ opacity: 0.88 }}
            boxShadow={`0 2px 8px ${ORANGE_SHADOW}`}
            onClick={() => onProcess(ticket)}
          >Xử lý</Button>
        )}
      </Flex>
    </Box>
  );
}

// ─── Desktop Ticket Row ───────────────────────────────────────────────────────
function TicketRow({ ticket, index, onView, onProcess }) {
  return (
    <Flex align="center" px="16px" py="12px" borderRadius="10px" bg="white"
      border="1.5px solid #f1f5f9" transition="all 0.2s"
      _hover={{ border: `1.5px solid ${ORANGE_BORDER}`, boxShadow: `0 2px 12px rgba(234,88,12,0.08)`, bg: "#fffaf7" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
    >
      <Box w={COL.idx} flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color="#cbd5e1">
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>
      <Box w={COL.id} flexShrink="0">
        <Box px="7px" py="3px" borderRadius="6px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`} display="inline-block">
          <Text fontSize="10.5px" fontWeight="800" color={ORANGE} letterSpacing="0.5px">{ticket.id}</Text>
        </Box>
      </Box>
      <Box w={COL.customer} flexShrink="0" pr="12px">
        <Text fontSize="12.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{ticket.name}</Text>
        <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{ticket.email}</Text>
      </Box>
      <Box flex="1" minW="0" pr="12px">
        <Text fontSize="12.5px" fontWeight="600" color="#334155" noOfLines={1}>{ticket.subject}</Text>
        <Box mt="3px"><CategoryBadge category={ticket.category} /></Box>
      </Box>
      <Box w={COL.priority} flexShrink="0" pr="10px">
        <PriorityBadge priority={ticket.priority} />
      </Box>
      <Box w={COL.status} flexShrink="0" pr="10px">
        <StatusBadge status={ticket.status} />
      </Box>
      <Box w={COL.date} flexShrink="0" pr="10px">
        <Text fontSize="11.5px" fontWeight="600" color="#475569">{ticket.date}</Text>
        <Text fontSize="10px" color="#94a3b8">{ticket.time}</Text>
      </Box>
      <Box w={COL.replies} flexShrink="0" pr="10px">
        <Flex align="center" gap="4px">
          <Icon as={MdChat} boxSize="12px" color="#94a3b8" />
          <Text fontSize="12px" fontWeight="600" color="#475569">{ticket.replies.length}</Text>
        </Flex>
      </Box>
      <Box w={COL.actions} flexShrink="0">
        <Flex gap="6px" justify="flex-end">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: "#f1f5f9", color: "#0f172a" }}
            transition="all 0.15s"
            onClick={() => onView(ticket)}
          >Xem</Button>
          {(ticket.status === "Chờ phản hồi" || ticket.status === "Đang xử lý") && (
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow={`0 2px 8px ${ORANGE_SHADOW}`}
              transition="all 0.15s"
              onClick={() => onProcess(ticket)}
            >Xử lý</Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

function ColHeader({ children, w, flex, pr, textAlign }) {
  return (
    <Box w={w} flex={flex} flexShrink={w ? "0" : undefined} pr={pr || "0"} textAlign={textAlign}>
      <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
        {children}
      </Text>
    </Box>
  );
}

// ─── Detail View (Mobile-optimized) ──────────────────────────────────────────
function TicketDetail({ ticket, onBack, onProcess }) {
  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" justify="space-between" mb="16px" gap="8px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h={{ base: "36px", md: "38px" }}
          fontSize={{ base: "12px", md: "13px" }} fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          onClick={onBack}
        >Quay lại</Button>
        {(ticket.status === "Chờ phản hồi" || ticket.status === "Đang xử lý") && (
          <Button h={{ base: "36px", md: "40px" }} px={{ base: "14px", md: "20px" }}
            borderRadius="10px" fontWeight="700" fontSize={{ base: "12px", md: "13px" }}
            bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
            color="white" boxShadow={`0 4px 14px ${ORANGE_SHADOW}`}
            _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdEdit} />}
            onClick={() => onProcess(ticket)}
          >Xử lý yêu cầu</Button>
        )}
      </Flex>

      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT}, #fbbf24, ${ORANGE_LIGHT}, ${ORANGE})`}
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />

        <Box p={{ base: "16px", md: "26px" }}>
          <Flex justify="space-between" align="flex-start" mb="14px" gap="8px">
            <Box flex="1" minW="0">
              <Flex align="center" gap="8px" mb="8px" flexWrap="wrap">
                <Box px="9px" py="4px" borderRadius="7px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`} flexShrink="0">
                  <Text fontSize="11px" fontWeight="800" color={ORANGE} letterSpacing="0.5px">{ticket.id}</Text>
                </Box>
                <Text fontSize={{ base: "15px", md: "20px" }} fontWeight="800" color="#0f172a"
                  letterSpacing="-0.3px" noOfLines={2}>
                  {ticket.subject}
                </Text>
              </Flex>
              <Flex gap="6px" flexWrap="wrap">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <CategoryBadge category={ticket.category} />
              </Flex>
            </Box>
            <Text fontSize="11px" color="#94a3b8" fontWeight="600" flexShrink="0" mt="4px" display={{ base: "none", sm: "block" }}>
              {ticket.date} • {ticket.time}
            </Text>
          </Flex>

          {/* Date on mobile */}
          <Text fontSize="11px" color="#94a3b8" fontWeight="600" mb="12px" display={{ base: "block", sm: "none" }}>
            {ticket.date} • {ticket.time}
          </Text>

          <Box h="1px" bg="#f1f5f9" mb="14px" />

          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="10px" mb="14px">
            {[
              { icon: MdPerson,  label: "Khách hàng", val: ticket.name },
              { icon: MdEmail,   label: "Email",       val: ticket.email },
              { icon: MdChat,    label: "Số phản hồi", val: `${ticket.replies.length} tin nhắn` },
            ].map(({ icon: Ic, label, val }) => (
              <Box key={label} p="10px 14px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={ORANGE} />
                  <Text fontSize="9.5px" fontWeight="700" color="#94a3b8"
                    letterSpacing="0.8px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{val}</Text>
              </Box>
            ))}
          </SimpleGrid>

          <Box p={{ base: "12px 14px", md: "16px 18px" }} borderRadius="12px"
            bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}>
            <Text fontSize="10px" fontWeight="800" color={ORANGE}
              letterSpacing="1px" textTransform="uppercase" mb="8px">Nội dung yêu cầu</Text>
            <Text fontSize={{ base: "13px", md: "13.5px" }} color="#334155" lineHeight="1.75">
              {ticket.message}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Chat history */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        <Flex align="center" gap="8px" mb="14px">
          <Box w="3px" h="14px" borderRadius="full" bg={`linear-gradient(180deg, ${ORANGE}, ${ORANGE_LIGHT})`} />
          <Text fontSize="13px" fontWeight="800" color="#0f172a">Lịch sử trao đổi</Text>
          {ticket.replies.length > 0 && (
            <Box px="8px" py="2px" borderRadius="6px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}>
              <Text fontSize="11px" fontWeight="700" color={ORANGE}>{ticket.replies.length} tin nhắn</Text>
            </Box>
          )}
        </Flex>
        <Box h="1px" bg="#f1f5f9" mb="14px" />

        <Box mb="12px">
          <Flex align="center" gap="8px" mb="8px">
            <Box w="30px" h="30px" borderRadius="full" bg="#f1f5f9"
              display="flex" alignItems="center" justifyContent="center">
              <Icon as={FaUserCircle} boxSize="18px" color="#64748b" />
            </Box>
            <Box flex="1" minW="0">
              <Text fontSize="12px" fontWeight="700" color="#0f172a">{ticket.name}</Text>
              <Text fontSize="10px" color="#94a3b8">{ticket.date} • {ticket.time}</Text>
            </Box>
            <Box px="7px" py="2px" borderRadius="5px" bg="#f1f5f9">
              <Text fontSize="10px" fontWeight="700" color="#64748b">Khách hàng</Text>
            </Box>
          </Flex>
          <Box ml={{ base: "0", sm: "38px" }} p="12px 14px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9">
            <Text fontSize="13px" color="#475569" lineHeight="1.7">{ticket.message}</Text>
          </Box>
        </Box>

        {ticket.replies.map((reply, i) => {
          const isStaff = reply.from === "staff";
          return (
            <Box key={i} mb="12px" sx={{ animation: `${fadeUp} 0.3s ease ${i * 0.05}s both` }}>
              <Flex align="center" gap="8px" mb="8px">
                <Box w="30px" h="30px" borderRadius="full"
                  bg={isStaff ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : "#f1f5f9"}
                  display="flex" alignItems="center" justifyContent="center">
                  <Icon as={isStaff ? MdHeadsetMic : FaUserCircle}
                    boxSize={isStaff ? "15px" : "18px"}
                    color={isStaff ? "white" : "#64748b"} />
                </Box>
                <Box flex="1" minW="0">
                  <Text fontSize="12px" fontWeight="700" color="#0f172a">{reply.name}</Text>
                  <Text fontSize="10px" color="#94a3b8">{reply.time}</Text>
                </Box>
                <Box px="7px" py="2px" borderRadius="5px"
                  bg={isStaff ? ORANGE_PALE : "#f1f5f9"}>
                  <Text fontSize="10px" fontWeight="700" color={isStaff ? ORANGE : "#64748b"}>
                    {isStaff ? "Nhân viên" : "Khách hàng"}
                  </Text>
                </Box>
              </Flex>
              <Box ml={{ base: "0", sm: "38px" }} p="12px 14px" borderRadius="10px"
                bg={isStaff ? ORANGE_PALE : "#f8fafc"}
                border={`1px solid ${isStaff ? ORANGE_BORDER : "#f1f5f9"}`}
              >
                <Text fontSize="13px" color="#334155" lineHeight="1.7">{reply.content}</Text>
              </Box>
            </Box>
          );
        })}

        {ticket.replies.length === 0 && (
          <Flex direction="column" align="center" py="20px" color="#cbd5e1">
            <Icon as={MdChat} boxSize="22px" mb="6px" />
            <Text fontSize="12px" color="#94a3b8">Chưa có phản hồi nào</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
}

// ─── Process View (Mobile-optimized) ─────────────────────────────────────────
function TicketProcess({ ticket, onBack, onComplete, onClose: onCloseTicket, onTransferAdmin }) {
  const [reply, setReply] = useState("");

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      <Flex align="center" mb="16px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h={{ base: "36px", md: "38px" }}
          fontSize={{ base: "12px", md: "13px" }} fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
          onClick={onBack}
        >Chi tiết yêu cầu</Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }} gap="16px">
        {/* Left col */}
        <Box>
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
            sx={{ animation: `${fadeUp} 0.35s ease both` }}
          >
            <SectionTitle label="Thông tin yêu cầu" />
            <Flex gap="8px" mb="14px" flexWrap="wrap">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <CategoryBadge category={ticket.category} />
            </Flex>
            <Flex direction="column" gap="8px">
              {[
                { label: "Mã yêu cầu", val: ticket.id },
                { label: "Khách hàng", val: ticket.name },
                { label: "Email", val: ticket.email },
                { label: "Chủ đề", val: ticket.subject },
                { label: "Ngày gửi", val: `${ticket.date} • ${ticket.time}` },
              ].map(({ label, val }) => (
                <Flex key={label} justify="space-between" align="flex-start"
                  p="8px 12px" borderRadius="8px" bg="#f8fafc" gap="8px"
                >
                  <Text fontSize="11px" fontWeight="700" color="#94a3b8"
                    textTransform="uppercase" letterSpacing="0.8px" flexShrink="0">
                    {label}
                  </Text>
                  <Text fontSize="12.5px" fontWeight="600" color="#0f172a"
                    textAlign="right" noOfLines={2}>
                    {val}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.35s ease 0.05s both` }}
          >
            <SectionTitle label="Nội dung khách hàng" />
            <Box p="14px 16px" borderRadius="10px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}>
              <Text fontSize={{ base: "13px", md: "13.5px" }} color="#334155" lineHeight="1.75">
                {ticket.message}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Right col */}
        <Box>
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }} mb="14px"
            sx={{ animation: `${fadeUp} 0.35s ease 0.1s both` }}
          >
            <SectionTitle label="Phản hồi khách hàng" />
            <Text sx={labelStyle} mb="7px">Nội dung phản hồi</Text>
            <Textarea
              bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
              color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
              _placeholder={{ color: "#b0bac8" }}
              _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.10)`, bg: "#fff" }}
              _hover={{ border: `1.5px solid ${ORANGE}` }}
              transition="all 0.2s"
              rows={5} placeholder="Nhập nội dung phản hồi đến khách hàng..."
              value={reply} onChange={e => setReply(e.target.value)}
            />
            <Button w="100%" h="42px" mt="12px" borderRadius="10px" fontWeight="700" fontSize="13px"
              bg={reply ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : "#e2e8f0"}
              color={reply ? "white" : "#94a3b8"}
              boxShadow={reply ? `0 4px 14px ${ORANGE_SHADOW}` : "none"}
              _hover={reply ? { boxShadow: `0 6px 20px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" } : {}}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              isDisabled={!reply}
              leftIcon={<Icon as={MdSend} />}
            >Gửi phản hồi (Email)</Button>
          </Box>

          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.35s ease 0.15s both` }}
          >
            <SectionTitle label="Hành động" />
            <Flex direction="column" gap="10px">
              <Button h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg="linear-gradient(135deg, #059669, #10b981)"
                color="white" boxShadow="0 4px 14px rgba(5,150,105,0.3)"
                _hover={{ boxShadow: "0 6px 20px rgba(5,150,105,0.4)", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }} transition="all 0.2s"
                leftIcon={<Icon as={MdCheckCircle} />}
                onClick={onComplete}
              >✓ Đánh dấu đã hoàn thành</Button>
              <Button h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg="#fef2f2" color="#dc2626" border="1.5px solid #fca5a5"
                _hover={{ bg: "#fee2e2", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }} transition="all 0.2s"
                leftIcon={<Icon as={MdOpenInNew} />}
                onClick={onTransferAdmin}
              >Chuyển cho Admin</Button>
              <Button h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
                bg="#f9fafb" color="#6b7280" border="1.5px solid #e5e7eb"
                _hover={{ bg: "#f3f4f6", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }} transition="all 0.2s"
                leftIcon={<Icon as={MdBlock} />}
                onClick={onCloseTicket}
              >Đóng ticket</Button>
            </Flex>

            <Box mt="14px" p="12px 14px" borderRadius="10px" bg="#fffbeb" border="1px solid #fcd34d">
              <Text fontSize="10.5px" color="#92400e" fontWeight="700" letterSpacing="0.5px" mb="4px">
                ⚠ LƯU Ý
              </Text>
              <Text fontSize="11.5px" color="#78350f" lineHeight="1.6">
                Chuyển Admin sẽ gửi thông báo cho cấp quản lý. Dùng khi yêu cầu vượt thẩm quyền (hoàn tiền lớn, khiếu nại nghiêm trọng).
              </Text>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────
function FilterDrawer({ isOpen, onClose, filterStatus, setFilterStatus, filterCategory, setFilterCategory }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
      <DrawerOverlay bg="rgba(15,23,42,0.5)" backdropFilter="blur(4px)" />
      <DrawerContent borderTopRadius="20px" pb="env(safe-area-inset-bottom, 16px)">
        <Box h="4px" bg={`linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT})`} />
        <Flex justify="center" pt="10px" pb="4px">
          <Box w="40px" h="4px" borderRadius="full" bg="#e2e8f0" />
        </Flex>
        <DrawerCloseButton color="#94a3b8" top="18px" right="16px" size="sm"
          borderRadius="10px" _hover={{ color: "#374151", bg: "#f1f5f9" }} />
        <DrawerBody pt="8px" pb="24px">
          <Text fontSize="15px" fontWeight="800" color="#0f172a" mb="18px">Bộ lọc</Text>

          <Text sx={labelStyle} mb="8px">Trạng thái</Text>
          <Flex gap="8px" flexWrap="wrap" mb="18px">
            {["Tất cả", "Chờ phản hồi", "Đang xử lý", "Đã hoàn thành", "Đã đóng", "Chuyển Admin"].map(s => (
              <Button key={s} h="32px" px="12px" borderRadius="8px" fontSize="12px" fontWeight="600"
                bg={filterStatus === s ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : "#f8fafc"}
                color={filterStatus === s ? "white" : "#64748b"}
                border={filterStatus === s ? "none" : "1px solid #e2e8f0"}
                boxShadow={filterStatus === s ? `0 2px 8px ${ORANGE_SHADOW}` : "none"}
                onClick={() => setFilterStatus(s)}
              >{s}</Button>
            ))}
          </Flex>

          <Text sx={labelStyle} mb="8px">Loại yêu cầu</Text>
          <Flex gap="8px" flexWrap="wrap" mb="18px">
            {["Tất cả", "Hỏi thông tin", "Khiếu nại", "Báo lỗi", "Yêu cầu hoàn tiền"].map(c => (
              <Button key={c} h="32px" px="12px" borderRadius="8px" fontSize="12px" fontWeight="600"
                bg={filterCategory === c ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : "#f8fafc"}
                color={filterCategory === c ? "white" : "#64748b"}
                border={filterCategory === c ? "none" : "1px solid #e2e8f0"}
                boxShadow={filterCategory === c ? `0 2px 8px ${ORANGE_SHADOW}` : "none"}
                onClick={() => setFilterCategory(c)}
              >{c}</Button>
            ))}
          </Flex>

          <Button w="100%" h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`} color="white"
            boxShadow={`0 4px 14px ${ORANGE_SHADOW}`} onClick={onClose}
          >Áp dụng bộ lọc</Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Hotrokhachhang() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const [view, setView]                     = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets]               = useState(TICKETS);
  const [search, setSearch]                 = useState("");
  const [filterStatus, setFilterStatus]     = useState("Tất cả");
  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch   = t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) ||
                          t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus   = filterStatus   === "Tất cả" || t.status   === filterStatus;
    const matchCategory = filterCategory === "Tất cả" || t.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const counts = {
    total:      tickets.length,
    waiting:    tickets.filter(t => t.status === "Chờ phản hồi").length,
    processing: tickets.filter(t => t.status === "Đang xử lý").length,
    done:       tickets.filter(t => t.status === "Đã hoàn thành").length,
    urgent:     tickets.filter(t => t.priority === "Khẩn cấp" && (t.status === "Chờ phản hồi" || t.status === "Đang xử lý")).length,
  };

  const handleAdd = (form) => {
    setTickets(prev => [{
      ...form,
      id: `TK-${String(prev.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleDateString("vi-VN"),
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      replies: [],
    }, ...prev]);
  };

  const updateTicketStatus = (id, status) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTicket(prev => prev?.id === id ? { ...prev, status } : prev);
    setView("list");
  };

  const hasActiveFilters = filterStatus !== "Tất cả" || filterCategory !== "Tất cả";

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        {/* Page header */}
        <Flex justify="space-between" align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }} mb="20px" gap="12px"
        >
          <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
            <Flex align="center" gap="10px" mb="4px">
              <Box w={{ base: "34px", md: "38px" }} h={{ base: "34px", md: "38px" }} borderRadius="11px"
                bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`}
                display="flex" alignItems="center" justifyContent="center"
                boxShadow={`0 4px 12px ${ORANGE_SHADOW}`}
              >
                <Icon as={FaHeadset} boxSize={{ base: "14px", md: "16px" }} color="white" />
              </Box>
              <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
                Hỗ trợ khách hàng
              </Text>
              {counts.urgent > 0 && (
                <Box px="8px" py="3px" borderRadius="7px" bg="#fef2f2" border="1px solid #fca5a5">
                  <Text fontSize="11px" fontWeight="800" color="#dc2626">{counts.urgent} khẩn cấp</Text>
                </Box>
              )}
            </Flex>
            <Text color="#94a3b8" fontSize="12px" pl={{ base: "44px", md: "48px" }}>
              Quản lý yêu cầu, phản hồi và khiếu nại của khách hàng
            </Text>
          </Box>

          <Flex gap="8px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
            w={{ base: "100%", md: "auto" }}
          >
            {counts.waiting > 0 && (
              <Box position="relative" display={{ base: "none", md: "block" }}>
                <Button h="40px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
                  bg={ORANGE_PALE} color={ORANGE} border={`1px solid ${ORANGE_BORDER}`}
                  _hover={{ bg: "#fef3e2" }} transition="all 0.2s"
                  leftIcon={<Icon as={MdInbox} />}
                >Chờ phản hồi</Button>
                <Box position="absolute" top="-6px" right="-6px" w="18px" h="18px"
                  borderRadius="full" bg={ORANGE}
                  display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="10px" fontWeight="800" color="white">{counts.waiting}</Text>
                </Box>
              </Box>
            )}
            <Button flex={{ base: "1", md: "none" }}
              h={{ base: "40px", md: "40px" }} px="20px" borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg={`linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`} color="white"
              boxShadow={`0 4px 14px ${ORANGE_SHADOW}`}
              _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,0.4)`, transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdAdd} />}
              onClick={onOpen}
            >Tạo yêu cầu</Button>
          </Flex>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "10px", md: "14px" }} mb="18px">
          <StatCard label="Tổng yêu cầu"  value={counts.total}      icon={FaTicketAlt}  accent={ORANGE}       delay={0}    />
          <StatCard label="Chờ phản hồi"  value={counts.waiting}    icon={MdPending}    accent={ORANGE_LIGHT} delay={0.05} />
          <StatCard label="Đang xử lý"    value={counts.processing} icon={MdEdit}       accent="#f59e0b"      delay={0.1}  />
          <StatCard label="Đã hoàn thành" value={counts.done}       icon={MdDone}       accent="#10b981"      delay={0.15} />
        </SimpleGrid>

        {/* Table / Card list */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          {/* Toolbar */}
          <Box p={{ base: "14px 14px 10px", md: "18px 20px 14px" }}
            borderBottom="1px solid #f8fafc"
          >
            <Flex align="center" justify="space-between" mb="10px">
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize={{ base: "13px", md: "15px" }} color="#0f172a">
                  Danh sách yêu cầu
                </Text>
                <Box px="8px" py="2px" borderRadius="6px" bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}>
                  <Text fontSize="11px" fontWeight="700" color={ORANGE}>{filtered.length} yêu cầu</Text>
                </Box>
              </Flex>
            </Flex>

            {/* Search + filter row */}
            <Flex gap="8px" align="center">
              <Box position="relative" flex="1">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                <Input
                  pl="30px" h="36px" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên, email, mã ticket..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.08)`, bg: "#fff" }}
                  _hover={{ border: `1px solid ${ORANGE}` }}
                  transition="all 0.2s"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </Box>

              {/* Mobile: filter button */}
              <Button display={{ base: "flex", md: "none" }}
                h="36px" px="12px" borderRadius="9px"
                bg={hasActiveFilters ? ORANGE_PALE : "#f8fafc"}
                color={hasActiveFilters ? ORANGE : "#64748b"}
                border={hasActiveFilters ? `1px solid ${ORANGE_BORDER}` : "1px solid #e8edf3"}
                fontWeight="600" fontSize="12px"
                leftIcon={<Icon as={MdFilterList} boxSize="14px" />}
                onClick={onFilterOpen}
                position="relative"
              >
                Lọc
                {hasActiveFilters && (
                  <Box position="absolute" top="-4px" right="-4px" w="8px" h="8px"
                    borderRadius="full" bg={ORANGE} />
                )}
              </Button>

              {/* Desktop: inline selects */}
              <Select display={{ base: "none", md: "block" }}
                h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="160px"
                _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.08)` }}
                _hover={{ border: `1px solid ${ORANGE}` }}
                transition="all 0.2s"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Chờ phản hồi">Chờ phản hồi</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đã đóng">Đã đóng</option>
                <option value="Chuyển Admin">Chuyển Admin</option>
              </Select>
              <Select display={{ base: "none", md: "block" }}
                h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="150px"
                _focus={{ border: `1.5px solid ${ORANGE}`, boxShadow: `0 0 0 3px rgba(234,88,12,0.08)` }}
                _hover={{ border: `1px solid ${ORANGE}` }}
                transition="all 0.2s"
                value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="Tất cả">Tất cả loại</option>
                <option value="Hỏi thông tin">Hỏi thông tin</option>
                <option value="Khiếu nại">Khiếu nại</option>
                <option value="Báo lỗi">Báo lỗi</option>
                <option value="Yêu cầu hoàn tiền">Yêu cầu hoàn tiền</option>
              </Select>
            </Flex>

            {/* Active filter pills on mobile */}
            {hasActiveFilters && (
              <Flex gap="6px" mt="10px" flexWrap="wrap" display={{ base: "flex", md: "none" }}>
                {filterStatus !== "Tất cả" && (
                  <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                    bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}
                  >
                    <Text fontSize="11px" fontWeight="700" color={ORANGE}>{filterStatus}</Text>
                    <Icon as={MdClose} boxSize="11px" color={ORANGE} cursor="pointer"
                      onClick={() => setFilterStatus("Tất cả")} />
                  </Flex>
                )}
                {filterCategory !== "Tất cả" && (
                  <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                    bg={ORANGE_PALE} border={`1px solid ${ORANGE_BORDER}`}
                  >
                    <Text fontSize="11px" fontWeight="700" color={ORANGE}>{filterCategory}</Text>
                    <Icon as={MdClose} boxSize="11px" color={ORANGE} cursor="pointer"
                      onClick={() => setFilterCategory("Tất cả")} />
                  </Flex>
                )}
              </Flex>
            )}
          </Box>

          {/* Desktop: Column headers */}
          <Flex display={{ base: "none", md: "flex" }}
            align="center" px="16px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          >
            <ColHeader w={COL.idx}>#</ColHeader>
            <ColHeader w={COL.id}>Mã</ColHeader>
            <ColHeader w={COL.customer} pr="12px">Khách hàng</ColHeader>
            <ColHeader flex="1" pr="12px">Chủ đề / Phân loại</ColHeader>
            <ColHeader w={COL.priority} pr="10px">Ưu tiên</ColHeader>
            <ColHeader w={COL.status} pr="10px">Trạng thái</ColHeader>
            <ColHeader w={COL.date} pr="10px">Ngày gửi</ColHeader>
            <ColHeader w={COL.replies} pr="10px">P.Hồi</ColHeader>
            <ColHeader w={COL.actions} textAlign="right">Hành động</ColHeader>
          </Flex>

          {/* Rows (desktop) / Cards (mobile) */}
          <Box p={{ base: "10px", md: "10px" }}>
            {filtered.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="40px" color="#cbd5e1">
                <Icon as={FaHeadset} boxSize="32px" mb="8px" />
                <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy yêu cầu nào</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="6px">
                {filtered.map((t, i) =>
                  isMobile ? (
                    <TicketCard
                      key={t.id} ticket={t} index={i}
                      onView={tk => { setSelectedTicket(tk); setView("detail"); }}
                      onProcess={tk => { setSelectedTicket(tk); setView("process"); }}
                    />
                  ) : (
                    <TicketRow
                      key={t.id} ticket={t} index={i}
                      onView={tk => { setSelectedTicket(tk); setView("detail"); }}
                      onProcess={tk => { setSelectedTicket(tk); setView("process"); }}
                    />
                  )
                )}
              </Flex>
            )}
          </Box>
        </Box>

        <AddTicketModal isOpen={isOpen} onClose={onClose} onSave={handleAdd} />
        <FilterDrawer
          isOpen={isFilterOpen} onClose={onFilterClose}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        />
      </Box>
    );
  }

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedTicket) {
    const live = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <TicketDetail ticket={live} onBack={() => setView("list")}
          onProcess={tk => { setSelectedTicket(tk); setView("process"); }} />
      </Box>
    );
  }

  // ── PROCESS VIEW ──
  if (view === "process" && selectedTicket) {
    const live = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box pt={{ base: "120px", md: "80px" }}>
        <TicketProcess
          ticket={live}
          onBack={() => setView("detail")}
          onComplete={() => updateTicketStatus(live.id, "Đã hoàn thành")}
          onClose={() => updateTicketStatus(live.id, "Đã đóng")}
          onTransferAdmin={() => updateTicketStatus(live.id, "Chuyển Admin")}
        />
      </Box>
    );
  }

  return null;
}