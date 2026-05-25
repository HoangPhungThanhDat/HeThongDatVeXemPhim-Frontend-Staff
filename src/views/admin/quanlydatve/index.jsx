import React, { useState, useEffect, useRef } from "react";
import {
  Box, Flex, Text, Button, Badge, Input, Select, Textarea,
  SimpleGrid, Grid, Icon, Divider, useColorModeValue, keyframes,
} from "@chakra-ui/react";
import {
  MdSearch, MdFilterList, MdVisibility, MdArrowBack, MdClose,
  MdCheckCircle, MdBlock, MdEdit, MdStickyNote2, MdLocalActivity,
  MdPerson, MdEmail, MdPhone, MdEventSeat, MdMovie, MdQrCode2,
  MdNotifications, MdRefresh, MdDownload, MdCircle, MdOutbox,
  MdAccessTime, MdCalendarToday, MdAttachMoney, MdConfirmationNumber,
  MdLocationOn, MdLabel, MdHistory, MdNewReleases, MdWarning,
} from "react-icons/md";
import {
  FaTicketAlt, FaClock, FaUsers, FaBoxOpen, FaReceipt,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;
const shimmer = keyframes`
  0%{background-position:-200% center}100%{background-position:200% center}
`;
const slideIn = keyframes`
  from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}
`;
const ping = keyframes`
  75%,100%{transform:scale(1.8);opacity:0}
`;

// ─── Config ──────────────────────────────────────────────────────────────────
const STATUS_ORDER = {
  "Đã đặt":      { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", dot: "#3b82f6" },
  "Đã check-in": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã hủy":      { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hoàn tiền":   { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b" },
  "Hết hạn":     { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

const STATUS_PAY = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "Chờ thanh toán":{ color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  "Đã hoàn":       { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  "Thất bại":      { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

const STATUS_REFUND = {
  "Chờ xử lý": { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  "Đã duyệt":  { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  "Từ chối":   { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CINEMAS = ["Tất cả", "CGV Vincom", "CGV Aeon Mall", "Lotte Cinema", "Galaxy Cinema"];
const MOVIES_LIST = [
  "Tất cả", "Avengers: Infinity War", "Spider-Man: No Way Home",
  "Doctor Strange 2", "Thor: Love and Thunder",
];

const genOrders = () => [
  {
    id: "GF-20260001", customerId: "U001",
    customer: "Nguyễn Văn An", email: "an.nv@gmail.com", phone: "0901234567",
    movie: "Avengers: Infinity War", cinema: "CGV Vincom",
    room: "Phòng 3 – IMAX", showtime: "2026-05-24 19:30",
    seats: ["C5", "C6"], format: "IMAX",
    combo: "Combo 2 Bắp Lớn + 2 Pepsi",
    total: 380000, payMethod: "Ví MoMo",
    status: "Đã đặt", payStatus: "Đã thanh toán",
    refundStatus: null, refundNote: "",
    note: "", createdAt: "2026-05-24 14:22", isNew: true,
    history: [
      { time: "2026-05-24 14:22", action: "Đặt vé thành công", by: "Khách hàng" },
    ],
  },
  {
    id: "GF-20260002", customerId: "U002",
    customer: "Trần Thị Bích", email: "bich.tt@gmail.com", phone: "0912345678",
    movie: "Spider-Man: No Way Home", cinema: "CGV Aeon Mall",
    room: "Phòng 1 – 3D", showtime: "2026-05-24 15:00",
    seats: ["E8", "E9", "E10"], format: "3D",
    combo: "",
    total: 270000, payMethod: "Thẻ VISA",
    status: "Đã check-in", payStatus: "Đã thanh toán",
    refundStatus: null, refundNote: "",
    note: "Khách đến sớm 10 phút.", createdAt: "2026-05-23 20:10", isNew: false,
    history: [
      { time: "2026-05-23 20:10", action: "Đặt vé thành công", by: "Khách hàng" },
      { time: "2026-05-24 14:55", action: "Check-in vé thành công", by: "Staff rạp" },
    ],
  },
  {
    id: "GF-20260003", customerId: "U003",
    customer: "Lê Minh Khoa", email: "khoa.lm@gmail.com", phone: "0934567890",
    movie: "Thor: Love and Thunder", cinema: "Lotte Cinema",
    room: "Phòng 2 – 2D", showtime: "2026-05-22 20:00",
    seats: ["A1"], format: "2D",
    combo: "Combo 1 Bắp + 1 Nước",
    total: 115000, payMethod: "Chuyển khoản",
    status: "Đã hủy", payStatus: "Đã hoàn",
    refundStatus: "Đã duyệt", refundNote: "Khách bận đột xuất.",
    note: "Xử lý hoàn tiền 24h.", createdAt: "2026-05-21 09:05", isNew: false,
    history: [
      { time: "2026-05-21 09:05", action: "Đặt vé thành công", by: "Khách hàng" },
      { time: "2026-05-22 07:00", action: "Yêu cầu hủy vé & hoàn tiền", by: "Khách hàng" },
      { time: "2026-05-22 08:30", action: "Duyệt hoàn tiền", by: "Back-office" },
    ],
  },
  {
    id: "GF-20260004", customerId: "U004",
    customer: "Phạm Thị Thu Hà", email: "ha.ptt@gmail.com", phone: "0945678901",
    movie: "Doctor Strange 2", cinema: "Galaxy Cinema",
    room: "Phòng 4 – 3D", showtime: "2026-05-25 21:00",
    seats: ["G3", "G4"], format: "3D",
    combo: "Combo 2 Bắp Nhỏ + 2 Sprite",
    total: 290000, payMethod: "Ví ZaloPay",
    status: "Đã đặt", payStatus: "Đã thanh toán",
    refundStatus: null, refundNote: "",
    note: "", createdAt: "2026-05-24 16:45", isNew: true,
    history: [
      { time: "2026-05-24 16:45", action: "Đặt vé thành công", by: "Khách hàng" },
    ],
  },
  {
    id: "GF-20260005", customerId: "U005",
    customer: "Hoàng Đức Tài", email: "tai.hd@gmail.com", phone: "0956789012",
    movie: "Avengers: Infinity War", cinema: "CGV Vincom",
    room: "Phòng 3 – IMAX", showtime: "2026-05-24 19:30",
    seats: ["D1", "D2", "D3", "D4"], format: "IMAX",
    combo: "Combo 2 Bắp Lớn + 2 Pepsi, Thêm 1 Hotdog",
    total: 720000, payMethod: "Tiền mặt",
    status: "Hoàn tiền", payStatus: "Chờ thanh toán",
    refundStatus: "Chờ xử lý", refundNote: "Suất chiếu bị lỗi hệ thống.",
    note: "Cần xác nhận với kỹ thuật.", createdAt: "2026-05-24 11:30", isNew: true,
    history: [
      { time: "2026-05-24 11:30", action: "Đặt vé thành công", by: "Khách hàng" },
      { time: "2026-05-24 13:00", action: "Yêu cầu hoàn tiền", by: "Khách hàng" },
    ],
  },
  {
    id: "GF-20260006", customerId: "U006",
    customer: "Nguyễn Thanh Tâm", email: "tam.nt@gmail.com", phone: "0967890123",
    movie: "Spider-Man: No Way Home", cinema: "Lotte Cinema",
    room: "Phòng 5 – 2D", showtime: "2026-05-23 17:30",
    seats: ["B6"], format: "2D",
    combo: "",
    total: 90000, payMethod: "Ví MoMo",
    status: "Hết hạn", payStatus: "Đã thanh toán",
    refundStatus: null, refundNote: "",
    note: "", createdAt: "2026-05-20 22:10", isNew: false,
    history: [
      { time: "2026-05-20 22:10", action: "Đặt vé thành công", by: "Khách hàng" },
      { time: "2026-05-23 17:31", action: "Vé hết hạn (không check-in)", by: "Hệ thống" },
    ],
  },
];

// ─── Small shared components ──────────────────────────────────────────────────
function StatusBadge({ status, map }) {
  const cfg = map[status] || Object.values(map)[0];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content"
    >
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot || cfg.color}
        sx={status === "Đã đặt" || status === "Hoàn tiền" || status === "Chờ xử lý"
          ? { animation: `${pulse} 2s ease infinite` } : {}}
      />
      <Text fontSize="11.5px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
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
            letterSpacing="0.9px" textTransform="uppercase" mb="4px">
            {label}
          </Text>
          <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="800" color="#0f172a" lineHeight="1">
            {value}
          </Text>
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

// ─── QR Modal ────────────────────────────────────────────────────────────────
function QRModal({ ticketId, onClose }) {
  return (
    <Box position="fixed" inset="0" zIndex="200" display="flex" alignItems="center" justifyContent="center"
      bg="rgba(15,23,42,0.55)" backdropFilter="blur(4px)"
      sx={{ animation: `${fadeIn} 0.2s ease both` }}
      onClick={onClose}
    >
      <Box bg="white" borderRadius="20px" p="28px" maxW="280px" w="100%"
        boxShadow="0 20px 60px rgba(0,0,0,0.25)"
        sx={{ animation: `${scaleIn} 0.25s ease both` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Text fontWeight="800" fontSize="15px" color="#0f172a" mb="6px" textAlign="center">
          Mã QR Vé
        </Text>
        <Text fontSize="12px" color="#94a3b8" textAlign="center" mb="16px">{ticketId}</Text>
        {/* QR placeholder */}
        <Box w="180px" h="180px" mx="auto" mb="16px" borderRadius="12px"
          border="2px solid #f1f5f9" overflow="hidden"
          display="flex" alignItems="center" justifyContent="center"
          bg="#f8fafc"
        >
          <Icon as={MdQrCode2} boxSize="120px" color="#cbd5e1" />
        </Box>
        <Button w="100%" h="40px" borderRadius="10px" fontSize="13px" fontWeight="700"
          bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
          _hover={{ bg: "#f1f5f9" }} onClick={onClose}
        >
          Đóng
        </Button>
      </Box>
    </Box>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────
function OrderDetail({ order, onBack, onUpdateNote, onApproveRefund, onRejectRefund }) {
  const [note, setNote] = useState(order.note || "");
  const [editNote, setEditNote] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundReject, setShowRefundReject] = useState(false);

  const payLabel = STATUS_PAY[order.payStatus] || STATUS_PAY["Chờ thanh toán"];
  const orderLabel = STATUS_ORDER[order.status] || STATUS_ORDER["Đã đặt"];

  return (
    <Box sx={{ animation: `${fadeIn} 0.28s ease both` }}>
      {showQR && <QRModal ticketId={order.id} onClose={() => setShowQR(false)} />}

      {/* Top bar */}
      <Flex align={{ base: "flex-start", md: "center" }} justify="space-between"
        direction={{ base: "column", sm: "row" }} mb="18px" gap="10px"
      >
        <Flex align="center" gap="10px">
          <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
            color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
            border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }}
            onClick={onBack}
          >
            <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
            <Box as="span" display={{ base: "inline", sm: "none" }}>Quay lại</Box>
          </Button>
          <Box>
            <Text fontSize={{ base: "16px", md: "19px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.3px">
              Chi tiết đơn hàng
            </Text>
            <Text fontSize="12px" color="#94a3b8">{order.id}</Text>
          </Box>
        </Flex>
        <Button h="38px" px="16px" borderRadius="10px" fontSize="12.5px" fontWeight="700"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          leftIcon={<Icon as={MdQrCode2} />}
          _hover={{ bg: "#f1f5f9" }} onClick={() => setShowQR(true)}
        >
          Xem QR vé
        </Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)" mb="14px" overflow="hidden"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }} />
        <Box p={{ base: "18px", md: "24px" }}>
          {/* Statuses */}
          <Flex gap="8px" mb="16px" flexWrap="wrap">
            <StatusBadge status={order.status} map={STATUS_ORDER} />
            <StatusBadge status={order.payStatus} map={STATUS_PAY} />
            {order.refundStatus && <StatusBadge status={order.refundStatus} map={STATUS_REFUND} />}
            {order.isNew && (
              <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="7px"
                bg="#fff7ed" border="1px solid #fed7aa"
              >
                <Icon as={MdNewReleases} boxSize="11px" color="#f97316" />
                <Text fontSize="11.5px" fontWeight="700" color="#f97316">Mới</Text>
              </Flex>
            )}
          </Flex>

          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap="12px">
            {/* Customer */}
            <Box p="14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdPerson} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Khách hàng
                </Text>
              </Flex>
              <Text fontSize="14px" fontWeight="700" color="#0f172a" mb="4px">{order.customer}</Text>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdEmail} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11.5px" color="#475569">{order.email}</Text>
              </Flex>
              <Flex align="center" gap="5px">
                <Icon as={MdPhone} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11.5px" color="#475569">{order.phone}</Text>
              </Flex>
            </Box>

            {/* Movie & Showtime */}
            <Box p="14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdMovie} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Phim & Suất chiếu
                </Text>
              </Flex>
              <Text fontSize="13.5px" fontWeight="700" color="#0f172a" mb="4px" noOfLines={1}>{order.movie}</Text>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdLocationOn} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11.5px" color="#475569">{order.cinema}</Text>
              </Flex>
              <Flex align="center" gap="5px" mb="3px">
                <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11.5px" color="#475569">{order.showtime}</Text>
              </Flex>
              <Flex align="center" gap="5px">
                <Icon as={MdEventSeat} boxSize="10px" color="#94a3b8" />
                <Text fontSize="11.5px" color="#475569">{order.room}</Text>
              </Flex>
            </Box>

            {/* Payment */}
            <Box p="14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Flex align="center" gap="7px" mb="10px">
                <Box w="26px" h="26px" borderRadius="7px" bg="#fff7ed" display="flex" alignItems="center" justifyContent="center">
                  <Icon as={MdAttachMoney} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Thanh toán
                </Text>
              </Flex>
              <Text fontSize="18px" fontWeight="800" color="#f97316" mb="4px">
                {order.total.toLocaleString("vi-VN")}đ
              </Text>
              <Text fontSize="11.5px" color="#475569" mb="3px">{order.payMethod}</Text>
              <Text fontSize="11px" color="#94a3b8">Đặt lúc {order.createdAt}</Text>
            </Box>
          </Grid>

          {/* Seats & Combo */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="12px" mt="12px">
            <Box p="14px" borderRadius="12px" bg="#fff7ed" border="1px solid #fed7aa">
              <Flex align="center" gap="7px" mb="10px">
                <Icon as={MdEventSeat} boxSize="13px" color="#f97316" />
                <Text fontSize="10px" fontWeight="800" color="#92400e" letterSpacing="1px" textTransform="uppercase">
                  Ghế đã đặt
                </Text>
              </Flex>
              <Flex gap="6px" flexWrap="wrap">
                {order.seats.map((s) => (
                  <Box key={s} px="10px" py="5px" borderRadius="7px" bg="white"
                    border="1px solid #fed7aa"
                  >
                    <Text fontSize="12px" fontWeight="800" color="#f97316">{s}</Text>
                  </Box>
                ))}
                <Box px="10px" py="5px" borderRadius="7px" bg="white" border="1px solid #fed7aa">
                  <Text fontSize="12px" fontWeight="600" color="#92400e">{order.format}</Text>
                </Box>
              </Flex>
            </Box>
            <Box p="14px" borderRadius="12px" bg="#f8fafc" border="1px solid #f1f5f9">
              <Flex align="center" gap="7px" mb="10px">
                <Icon as={FaBoxOpen} boxSize="12px" color="#94a3b8" />
                <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                  Combo bắp nước
                </Text>
              </Flex>
              <Text fontSize="12.5px" color={order.combo ? "#0f172a" : "#cbd5e1"} fontWeight={order.combo ? "600" : "400"}>
                {order.combo || "Không có combo"}
              </Text>
            </Box>
          </Grid>
        </Box>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="14px" mb="14px">
        {/* Internal note */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
        >
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
              <Text fontSize="13px" fontWeight="800" color="#0f172a">Ghi chú nội bộ</Text>
            </Flex>
            {!editNote && (
              <Button size="xs" h="28px" px="10px" borderRadius="7px"
                bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
                fontSize="11px" fontWeight="600"
                leftIcon={<Icon as={MdEdit} boxSize="11px" />}
                _hover={{ bg: "#f1f5f9" }} onClick={() => setEditNote(true)}
              >Sửa</Button>
            )}
          </Flex>
          {editNote ? (
            <>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                fontSize="13px" color="#1a202c" px="12px" py="10px"
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", bg: "#fff" }}
                _hover={{ border: "1.5px solid #f97316" }}
                rows={4} placeholder="Nhập ghi chú nội bộ..."
                value={note} onChange={(e) => setNote(e.target.value)}
              />
              <Flex gap="8px" mt="10px">
                <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="700"
                  bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
                  boxShadow="0 2px 8px rgba(249,115,22,0.3)"
                  _hover={{ opacity: 0.88 }} onClick={() => { onUpdateNote(order.id, note); setEditNote(false); }}
                >Lưu ghi chú</Button>
                <Button flex="1" h="36px" borderRadius="9px" fontSize="12px" fontWeight="600"
                  variant="ghost" color="#64748b" border="1px solid #e2e8f0"
                  _hover={{ bg: "#f8fafc" }} onClick={() => { setNote(order.note); setEditNote(false); }}
                >Hủy</Button>
              </Flex>
            </>
          ) : (
            <Box p="12px 14px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9"
              minH="70px"
            >
              <Text fontSize="12.5px" color={note ? "#475569" : "#cbd5e1"} lineHeight="1.7">
                {note || "Chưa có ghi chú."}
              </Text>
            </Box>
          )}
        </Box>

        {/* Refund */}
        {(order.status === "Hoàn tiền" || order.status === "Đã hủy") && (
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
          >
            <Flex align="center" gap="8px" mb="12px">
              <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
              <Text fontSize="13px" fontWeight="800" color="#0f172a">Xử lý hoàn tiền</Text>
            </Flex>
            {order.refundStatus === "Chờ xử lý" && (
              <Box p="12px 14px" borderRadius="10px" bg="#fffbeb" border="1px solid #fcd34d" mb="12px">
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={MdWarning} boxSize="12px" color="#d97706" />
                  <Text fontSize="11px" fontWeight="800" color="#92400e" textTransform="uppercase" letterSpacing="0.8px">
                    Lý do yêu cầu
                  </Text>
                </Flex>
                <Text fontSize="12.5px" color="#475569">{order.refundNote || "Không có lý do."}</Text>
              </Box>
            )}
            {order.refundStatus === "Chờ xử lý" && (
              <>
                {showRefundReject && (
                  <Box mb="10px">
                    <Text fontSize="10.5px" fontWeight="700" color="#64748b" textTransform="uppercase" letterSpacing="0.7px" mb="6px">
                      Lý do từ chối *
                    </Text>
                    <Textarea
                      bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                      fontSize="13px" px="12px" py="8px"
                      _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.10)" }}
                      rows={3} placeholder="Nhập lý do từ chối..."
                      value={refundReason} onChange={(e) => setRefundReason(e.target.value)}
                    />
                  </Box>
                )}
                <Flex gap="8px">
                  <Button flex="1" h="38px" borderRadius="10px" fontSize="12px" fontWeight="700"
                    bg="#ecfdf5" color="#059669" border="1px solid #6ee7b7"
                    leftIcon={<Icon as={MdCheckCircle} boxSize="12px" />}
                    _hover={{ bg: "#d1fae5" }}
                    onClick={() => onApproveRefund(order.id)}
                  >Duyệt hoàn tiền</Button>
                  {!showRefundReject ? (
                    <Button flex="1" h="38px" borderRadius="10px" fontSize="12px" fontWeight="700"
                      bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                      leftIcon={<Icon as={MdBlock} boxSize="12px" />}
                      _hover={{ bg: "#fee2e2" }}
                      onClick={() => setShowRefundReject(true)}
                    >Từ chối</Button>
                  ) : (
                    <Button flex="1" h="38px" borderRadius="10px" fontSize="12px" fontWeight="700"
                      bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
                      _hover={{ bg: "#fee2e2" }}
                      onClick={() => { onRejectRefund(order.id, refundReason); setShowRefundReject(false); }}
                    >Xác nhận từ chối</Button>
                  )}
                </Flex>
              </>
            )}
            {(order.refundStatus === "Đã duyệt" || order.refundStatus === "Từ chối") && (
              <StatusBadge status={order.refundStatus} map={STATUS_REFUND} />
            )}
            {!order.refundStatus && (
              <Text fontSize="12.5px" color="#94a3b8">Không có yêu cầu hoàn tiền.</Text>
            )}
          </Box>
        )}
      </Grid>

      {/* History */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
      >
        <Flex align="center" gap="8px" mb="14px">
          <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
          <Text fontSize="13px" fontWeight="800" color="#0f172a">Lịch sử đơn hàng</Text>
        </Flex>
        <Box h="1px" bg="#f1f5f9" mb="14px" />
        <Flex direction="column" gap="0">
          {order.history.map((h, i) => (
            <Flex key={i} gap="12px" align="flex-start">
              <Flex direction="column" align="center" flexShrink="0">
                <Box w="10px" h="10px" borderRadius="full"
                  bg={i === 0 ? "#f97316" : "#e2e8f0"} border="2px solid white"
                  boxShadow={i === 0 ? "0 0 0 2px #f97316" : "0 0 0 2px #e2e8f0"}
                  mt="3px"
                />
                {i < order.history.length - 1 && (
                  <Box w="1.5px" flex="1" minH="24px" bg="#f1f5f9" mt="2px" mb="2px" />
                )}
              </Flex>
              <Box pb={i < order.history.length - 1 ? "10px" : "0"}>
                <Text fontSize="12.5px" fontWeight="600" color="#0f172a">{h.action}</Text>
                <Flex gap="10px" mt="2px">
                  <Text fontSize="10.5px" color="#94a3b8">{h.time}</Text>
                  <Text fontSize="10.5px" color="#f97316" fontWeight="600">— {h.by}</Text>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order, index, onView }) {
  return (
    <>
      {/* Mobile card */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg="white"
        border={order.isNew ? "1.5px solid #fed7aa" : "1.5px solid #f1f5f9"}
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
        onClick={() => onView(order)} cursor="pointer"
      >
        <Flex justify="space-between" mb="8px" align="flex-start">
          <Box flex="1" pr="8px">
            <Flex align="center" gap="6px" mb="4px">
              <Text fontSize="12px" fontWeight="800" color="#f97316">{order.id}</Text>
              {order.isNew && (
                <Box px="5px" py="2px" borderRadius="4px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="9.5px" fontWeight="800" color="#f97316">MỚI</Text>
                </Box>
              )}
            </Flex>
            <Text fontSize="13px" fontWeight="700" color="#0f172a" noOfLines={1}>{order.customer}</Text>
            <Text fontSize="11px" color="#94a3b8" mt="2px" noOfLines={1}>{order.movie}</Text>
          </Box>
          <Text fontSize="14px" fontWeight="800" color="#0f172a">
            {order.total.toLocaleString("vi-VN")}đ
          </Text>
        </Flex>
        <Flex gap="6px" flexWrap="wrap" mb="10px">
          <StatusBadge status={order.status} map={STATUS_ORDER} />
          <StatusBadge status={order.payStatus} map={STATUS_PAY} />
        </Flex>
        <Flex align="center" justify="space-between">
          <Text fontSize="10.5px" color="#94a3b8">{order.createdAt}</Text>
          <Button size="xs" h="28px" px="10px" borderRadius="7px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="11px" fontWeight="700"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 6px rgba(249,115,22,0.3)"
            onClick={(e) => { e.stopPropagation(); onView(order); }}
          >Xem</Button>
        </Flex>
      </Box>

      {/* Desktop row */}
      <Box display={{ base: "none", md: "block" }}
        p="12px 18px" borderRadius="12px" bg="white"
        border={order.isNew ? "1.5px solid #fed7aa" : "1.5px solid #f1f5f9"}
        transition="all 0.18s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.1)", bg: "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
        cursor="pointer" onClick={() => onView(order)}
      >
        <Flex align="center" gap="0">
          <Box w="30px" flexShrink="0">
            <Text fontSize="11px" fontWeight="700" color="#cbd5e1">{String(index + 1).padStart(2, "0")}</Text>
          </Box>
          <Box flex="1.2" minW="0" pr="10px">
            <Flex align="center" gap="6px">
              <Text fontSize="12.5px" fontWeight="800" color="#f97316">{order.id}</Text>
              {order.isNew && (
                <Box px="5px" py="1px" borderRadius="4px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="9px" fontWeight="800" color="#f97316">MỚI</Text>
                </Box>
              )}
            </Flex>
            <Text fontSize="10.5px" color="#94a3b8" mt="1px">{order.createdAt}</Text>
          </Box>
          <Box flex="1.2" minW="0" pr="10px">
            <Text fontSize="12.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{order.customer}</Text>
            <Text fontSize="10.5px" color="#94a3b8" mt="1px" noOfLines={1}>{order.phone}</Text>
          </Box>
          <Box flex="1.4" minW="0" pr="10px">
            <Text fontSize="12px" fontWeight="600" color="#0f172a" noOfLines={1}>{order.movie}</Text>
            <Text fontSize="10.5px" color="#94a3b8" mt="1px" noOfLines={1}>{order.cinema}</Text>
          </Box>
          <Box flex="0.6" minW="0" pr="10px">
            <Flex gap="4px" flexWrap="wrap">
              {order.seats.map((s) => (
                <Box key={s} px="5px" py="2px" borderRadius="4px" bg="#fff7ed" border="1px solid #fcd34d">
                  <Text fontSize="10.5px" fontWeight="800" color="#f97316">{s}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
          <Box flex="0.9" minW="0" pr="10px">
            <Text fontSize="13px" fontWeight="800" color="#0f172a">
              {order.total.toLocaleString("vi-VN")}đ
            </Text>
            <Text fontSize="10px" color="#94a3b8" mt="1px">{order.payMethod}</Text>
          </Box>
          <Box flex="0.85" minW="0" pr="8px">
            <StatusBadge status={order.status} map={STATUS_ORDER} />
          </Box>
          <Box flex="0.9" minW="0" pr="8px">
            <StatusBadge status={order.payStatus} map={STATUS_PAY} />
          </Box>
          <Box flexShrink="0" onClick={(e) => e.stopPropagation()}>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              fontSize="11.5px" fontWeight="700"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.28)" transition="all 0.15s"
              onClick={() => onView(order)}
            >Chi tiết</Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyDatVe() {
  const [view, setView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(genOrders());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCinema, setFilterCinema] = useState("Tất cả");
  const [filterMovie, setFilterMovie] = useState("Tất cả");
  const [filterDate, setFilterDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  // Simulate new order notification every 20s
  useEffect(() => {
    const t = setInterval(() => {
      const fakeNew = {
        id: `GF-${Date.now()}`, customerId: "U099",
        customer: "Khách hàng mới", email: "new@gmail.com", phone: "0999999999",
        movie: "Avengers: Infinity War", cinema: "CGV Aeon Mall",
        room: "Phòng 2 – 3D", showtime: "2026-05-25 20:00",
        seats: ["H7"], format: "3D", combo: "",
        total: 120000, payMethod: "Ví MoMo",
        status: "Đã đặt", payStatus: "Đã thanh toán",
        refundStatus: null, refundNote: "", note: "",
        createdAt: new Date().toLocaleString("vi-VN"), isNew: true,
        history: [{ time: new Date().toLocaleString("vi-VN"), action: "Đặt vé thành công", by: "Khách hàng" }],
      };
      setOrders((prev) => [fakeNew, ...prev]);
      setNewOrderCount((c) => c + 1);
      showToast("🎟 Có đơn hàng mới: " + fakeNew.id);
    }, 20000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 4000);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q)
      || o.customer.toLowerCase().includes(q)
      || o.email.toLowerCase().includes(q)
      || o.phone.includes(q)
      || o.movie.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tất cả" || o.status === filterStatus;
    const matchCinema = filterCinema === "Tất cả" || o.cinema === filterCinema;
    const matchMovie  = filterMovie === "Tất cả"  || o.movie === filterMovie;
    const matchDate   = !filterDate || o.showtime.startsWith(filterDate) || o.createdAt.startsWith(filterDate.slice(0, 7));
    return matchSearch && matchStatus && matchCinema && matchMovie && matchDate;
  });

  const stats = {
    total:    orders.length,
    booked:   orders.filter((o) => o.status === "Đã đặt").length,
    checkin:  orders.filter((o) => o.status === "Đã check-in").length,
    refund:   orders.filter((o) => o.refundStatus === "Chờ xử lý").length,
    revenue:  orders.filter((o) => o.payStatus === "Đã thanh toán").reduce((s, o) => s + o.total, 0),
  };

  const handleUpdateNote = (id, note) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, note } : o));
    if (selectedOrder?.id === id) setSelectedOrder((p) => ({ ...p, note }));
    showToast("✅ Đã lưu ghi chú nội bộ");
  };

  const handleApproveRefund = (id) => {
    setOrders((prev) => prev.map((o) =>
      o.id === id ? { ...o, refundStatus: "Đã duyệt", status: "Đã hủy", payStatus: "Đã hoàn",
        history: [...o.history, { time: new Date().toLocaleString("vi-VN"), action: "Duyệt hoàn tiền (chuyển Admin xử lý)", by: "Back-office" }]
      } : o
    ));
    if (selectedOrder?.id === id) setSelectedOrder((p) => ({ ...p, refundStatus: "Đã duyệt", status: "Đã hủy", payStatus: "Đã hoàn" }));
    showToast("✅ Đã đề xuất duyệt hoàn tiền — Admin sẽ xử lý cuối");
  };

  const handleRejectRefund = (id, reason) => {
    setOrders((prev) => prev.map((o) =>
      o.id === id ? { ...o, refundStatus: "Từ chối",
        history: [...o.history, { time: new Date().toLocaleString("vi-VN"), action: `Từ chối hoàn tiền: ${reason || "Không có lý do"}`, by: "Back-office" }]
      } : o
    ));
    if (selectedOrder?.id === id) setSelectedOrder((p) => ({ ...p, refundStatus: "Từ chối" }));
    showToast("❌ Đã từ chối yêu cầu hoàn tiền");
  };

  const handleView = (order) => {
    // Mark as not new
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, isNew: false } : o));
    setNewOrderCount((c) => Math.max(0, c - (order.isNew ? 1 : 0)));
    setSelectedOrder({ ...order, isNew: false });
    setView("detail");
  };

  // ── DETAIL VIEW ──
  if (view === "detail" && selectedOrder) {
    const live = orders.find((o) => o.id === selectedOrder.id) || selectedOrder;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <OrderDetail
          order={live}
          onBack={() => setView("list")}
          onUpdateNote={handleUpdateNote}
          onApproveRefund={handleApproveRefund}
          onRejectRefund={handleRejectRefund}
        />
      </Box>
    );
  }

  // ── LIST VIEW ──
  return (
    <Box pt={{ base: "100px", md: "80px" }} position="relative">
      {/* Toast */}
      {toastMsg && (
        <Box position="fixed" bottom="24px" right="24px" zIndex="300"
          bg="white" borderRadius="12px" border="1px solid #f1f5f9"
          boxShadow="0 8px 32px rgba(0,0,0,0.14)"
          px="16px" py="12px" maxW="320px"
          sx={{ animation: `${slideIn} 0.3s ease both` }}
        >
          <Text fontSize="13px" fontWeight="600" color="#0f172a">{toastMsg}</Text>
        </Box>
      )}

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
              <Icon as={FaTicketAlt} boxSize="16px" color="white" />
            </Box>
            <Text fontSize={{ base: "21px", md: "26px" }} fontWeight="800" color="#0f172a" letterSpacing="-0.5px">
              Quản lý Đặt Vé
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl="48px">
            Tra cứu, lọc và xử lý toàn bộ đơn đặt vé · Realtime
          </Text>
        </Box>
        <Flex gap="10px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}
          w={{ base: "100%", md: "auto" }} align="center"
        >
          {/* New orders badge */}
          {newOrderCount > 0 && (
            <Box position="relative" flexShrink="0">
              <Button h="40px" px="14px" borderRadius="10px" fontSize="13px" fontWeight="600"
                bg="#fff7ed" color="#c2410c" border="1px solid #fed7aa"
                leftIcon={<Icon as={MdNotifications} />}
                _hover={{ bg: "#fef3c7" }}
              >
                {newOrderCount} đơn mới
              </Button>
              <Box position="absolute" top="-5px" right="-5px" w="16px" h="16px"
                borderRadius="full" bg="#ef4444"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Box position="absolute" w="16px" h="16px" borderRadius="full" bg="#ef4444"
                  sx={{ animation: `${ping} 1.2s cubic-bezier(0,0,.2,1) infinite` }} opacity="0.75"
                />
                <Text fontSize="9px" fontWeight="800" color="white" position="relative">{newOrderCount}</Text>
              </Box>
            </Box>
          )}
          <Button h="40px" px="16px" borderRadius="10px" fontSize="13px" fontWeight="700"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            leftIcon={<Icon as={MdDownload} />}
            _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.45)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all 0.2s"
            flex={{ base: "1", md: "none" }}
          >
            Export Excel
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} spacing="12px" mb="18px">
        <StatCard label="Tổng đơn"        value={stats.total}   icon={FaReceipt}     accent="#f97316" delay={0}    />
        <StatCard label="Đang chờ"        value={stats.booked}  icon={FaClock}       accent="#3b82f6" delay={0.04} />
        <StatCard label="Đã check-in"     value={stats.checkin} icon={MdCheckCircle} accent="#10b981" delay={0.08} />
        <StatCard label="Chờ hoàn tiền"   value={stats.refund}  icon={MdOutbox}      accent="#d97706" delay={0.12} />
        <StatCard
          label="Doanh thu hôm nay"
          value={`${(stats.revenue / 1000000).toFixed(1)}M`}
          icon={MdAttachMoney} accent="#f97316" delay={0.16}
          sub="đã thanh toán"
        />
      </SimpleGrid>

      {/* Table card */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
      >
        {/* Card Header */}
        <Box p={{ base: "14px 16px", md: "16px 20px 14px" }} borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize={{ base: "13px", md: "14.5px" }} color="#0f172a">
                Danh sách đặt vé
              </Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} đơn</Text>
              </Box>
              {/* Realtime dot */}
              <Flex align="center" gap="5px" px="8px" py="3px" borderRadius="6px"
                bg="#ecfdf5" border="1px solid #6ee7b7"
              >
                <Box w="6px" h="6px" borderRadius="full" bg="#10b981"
                  sx={{ animation: `${pulse} 2s ease infinite` }} />
                <Text fontSize="10px" fontWeight="700" color="#059669">Realtime</Text>
              </Flex>
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
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr 1fr" }} gap="8px">
              <Box position="relative">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="13px" color="#94a3b8" zIndex="1" />
                <Input pl="30px" h={{ base: "40px", md: "34px" }} w="100%"
                  fontSize="12.5px" fontWeight="500"
                  placeholder="Mã đơn, tên, SĐT, email, phim..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              {[
                { val: filterStatus, set: setFilterStatus, opts: ["Tất cả", "Đã đặt", "Đã check-in", "Đã hủy", "Hoàn tiền", "Hết hạn"], placeholder: "Trạng thái" },
                { val: filterCinema, set: setFilterCinema, opts: CINEMAS, placeholder: "Rạp chiếu" },
                { val: filterMovie,  set: setFilterMovie,  opts: MOVIES_LIST, placeholder: "Phim" },
              ].map(({ val, set, opts, placeholder }) => (
                <Select key={placeholder}
                  h={{ base: "40px", md: "34px" }} fontSize="12.5px" fontWeight="600" color="#374151"
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                  _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                  value={val} onChange={(e) => set(e.target.value)}
                >
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </Select>
              ))}
              <Input type="date" h={{ base: "40px", md: "34px" }}
                fontSize="12px" fontWeight="500" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)" }}
                _hover={{ border: "1px solid #f97316" }} transition="all 0.2s"
                value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
              />
            </Grid>
          </Box>
        </Box>

        {/* Desktop column headers */}
        <Flex px="18px" py="9px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base: "none", md: "flex" }}
        >
          <Box w="30px" flexShrink="0" />
          {[
            { label: "Mã đơn / Giờ đặt", flex: "1.2" },
            { label: "Khách hàng", flex: "1.2" },
            { label: "Phim / Rạp", flex: "1.4" },
            { label: "Ghế", flex: "0.6" },
            { label: "Tổng tiền", flex: "0.9" },
            { label: "Trạng thái", flex: "0.85" },
            { label: "Thanh toán", flex: "0.9" },
          ].map(({ label, flex }) => (
            <Box key={label} flex={flex} minW="0" pr="8px">
              <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
                {label}
              </Text>
            </Box>
          ))}
          <Box w="80px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
              Thao tác
            </Text>
          </Box>
        </Flex>

        {/* Rows */}
        <Box p={{ base: "10px", md: "10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px" color="#cbd5e1">
              <Icon as={FaTicketAlt} boxSize="30px" mb="10px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy đơn nào</Text>
              <Text fontSize="12px" color="#cbd5e1" mt="4px">Thử thay đổi bộ lọc</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((o, i) => (
                <OrderRow key={o.id} order={o} index={i} onView={handleView} />
              ))}
            </Flex>
          )}
        </Box>

        {/* Footer */}
        {filtered.length > 0 && (
          <Box px={{ base: "14px", md: "20px" }} py="12px"
            borderTop="1px solid #f8fafc"
            display="flex" alignItems="center" justifyContent="space-between"
          >
            <Text fontSize="12px" color="#94a3b8">
              Hiển thị <strong>{filtered.length}</strong> / {orders.length} đơn hàng
            </Text>
            <Flex gap="6px" align="center">
              <Icon as={MdRefresh} boxSize="12px" color="#94a3b8" />
              <Text fontSize="11px" color="#94a3b8">Tự động cập nhật realtime</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}