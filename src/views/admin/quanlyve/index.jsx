import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon, keyframes,
  Input, Select, Textarea, FormControl, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, useBreakpointValue,
} from "@chakra-ui/react";
import {
  MdConfirmationNumber, MdEdit, MdArrowBack, MdVisibility,
  MdEventSeat, MdSearch, MdFilterList, MdQrCode, MdCheckCircle,
  MdCancel, MdAccessTime, MdPerson, MdEmail, MdMovie, MdLocalActivity,
  MdAttachMoney, MdNote, MdFlag, MdClose, MdDone, MdMoreVert,
  MdPhone, MdFilterAlt,
} from "react-icons/md";
import {
  FaTicketAlt, FaQrcode, FaUserCircle, FaRegCheckCircle,
  FaTimesCircle, FaHourglass,
} from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn  = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

// ─── Orange palette ───────────────────────────────────────────────────────────
const OR   = "#ea580c";
const ORL  = "#fb923c";
const ORPL = "#fff7ed";
const ORBD = "#fed7aa";
const ORSW = "rgba(234,88,12,0.25)";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Đã thanh toán": { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã check-in":   { color: OR,        bg: ORPL,     border: ORBD,       dot: ORL      },
  "Đã hủy":        { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444" },
  "Hết hạn":       { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

// ─── Shared style helpers ─────────────────────────────────────────────────────
const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};
const inputStyle = {
  bg: "#fafafa", border: "1.5px solid #e8edf3", borderRadius: "10px",
  color: "#1a202c", fontSize: "14px", fontWeight: "500", px: "14px", h: "44px",
  _placeholder: { color: "#b0bac8", fontWeight: "400" },
  _focus: { border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)`, bg: "#fff" },
  _hover: { border: `1.5px solid ${OR}`, bg: "#fff" },
  transition: "all .2s",
};

// ─── Column widths (desktop only) ─────────────────────────────────────────────
const COL = {
  idx:      "36px",
  code:     "76px",
  customer: "150px",
  movie:    "1",
  seat:     "56px",
  price:    "90px",
  status:   "138px",
  actions:  "158px",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const INIT_TICKETS = [
  {
    id: 1, code: "VE001",
    customer: "Nguyễn Văn An", email: "nguyenvanan@gmail.com", phone: "0912 345 678",
    movie: "Avengers: Endgame", showtime: "18:00 - Phòng 1 - 22/05/2026",
    seat: "A5", price: "85.000đ", status: "Đã thanh toán",
    note: "", combo: "Combo 1 (1 nước + 1 bắp)", qr: "QR-VE001-2026",
  },
  {
    id: 2, code: "VE002",
    customer: "Trần Thị Bình", email: "tranthibinh@gmail.com", phone: "0987 654 321",
    movie: "Spider-Man: No Way Home", showtime: "20:30 - Phòng 2 - 22/05/2026",
    seat: "B3", price: "90.000đ", status: "Đã check-in",
    note: "Khách VIP", combo: "Không có", qr: "QR-VE002-2026",
  },
  {
    id: 3, code: "VE003",
    customer: "Lê Hoàng Cường", email: "lehcuong@gmail.com", phone: "0908 111 222",
    movie: "Doctor Strange 2", showtime: "15:00 - Phòng 3 - 21/05/2026",
    seat: "C2", price: "75.000đ", status: "Đã hủy",
    note: "Khách yêu cầu hoàn tiền", combo: "Không có", qr: "QR-VE003-2026",
  },
  {
    id: 4, code: "VE004",
    customer: "Phạm Minh Đức", email: "phamminhduc@gmail.com", phone: "0933 999 888",
    movie: "Thor: Love and Thunder", showtime: "21:00 - Phòng 1 - 20/05/2026",
    seat: "D4", price: "95.000đ", status: "Hết hạn",
    note: "", combo: "Combo 2 (2 nước + 2 bắp)", qr: "QR-VE004-2026",
  },
  {
    id: 5, code: "VE005",
    customer: "Hoàng Thị Lan", email: "hoangtilan@gmail.com", phone: "0977 333 444",
    movie: "Black Panther: Wakanda Forever", showtime: "17:30 - Phòng 2 - 22/05/2026",
    seat: "B1", price: "85.000đ", status: "Đã thanh toán",
    note: "", combo: "Không có", qr: "QR-VE005-2026",
  },
];

// ─── Seat map ─────────────────────────────────────────────────────────────────
const SEAT_MAP = [
  { id:"A1",booked:false },{ id:"A2",booked:true  },{ id:"A3",booked:false },
  { id:"A4",booked:false },{ id:"A5",booked:true  },
  { id:"B1",booked:false },{ id:"B2",booked:false },{ id:"B3",booked:true  },
  { id:"B4",booked:false },{ id:"B5",booked:false },
  { id:"C1",booked:false },{ id:"C2",booked:true  },{ id:"C3",booked:false },
  { id:"C4",booked:false },{ id:"C5",booked:false },
  { id:"D1",booked:false },{ id:"D2",booked:false },{ id:"D3",booked:false },
  { id:"D4",booked:true  },{ id:"D5",booked:false },
];

// ─── Shared small components ──────────────────────────────────────────────────
function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg={`linear-gradient(180deg,${OR},${ORL})`} />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg,#f1f5f9,transparent)" />
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Hết hạn"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot} />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}

function StatCard({ label, value, icon, accent, sub, delay=0 }) {
  return (
    <Box p={{ base:"14px 16px", md:"18px 20px" }} borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,.05)"
      sx={{ animation: `${fadeUp} .4s ease ${delay}s both` }}
      transition="all .2s"
      _hover={{ boxShadow:"0 4px 16px rgba(0,0,0,.08)", transform:"translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base:"9px", md:"11px" }} fontWeight="700" color="#94a3b8"
            letterSpacing=".8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base:"22px", md:"28px" }} fontWeight="800" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w={{ base:"36px", md:"42px" }} h={{ base:"36px", md:"42px" }}
          borderRadius="12px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} boxSize={{ base:"15px", md:"18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Column header helper ─────────────────────────────────────────────────────
function CH({ children, w, flex, pr, textAlign }) {
  return (
    <Box w={w} flex={flex} flexShrink={w?"0":undefined} pr={pr||"0"} textAlign={textAlign}>
      <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
        {children}
      </Text>
    </Box>
  );
}

// ─── QR Modal ────────────────────────────────────────────────────────────────
function QRModal({ ticket, onClose }) {
  return (
    <Box position="fixed" inset="0" zIndex="999" display="flex" alignItems="center" justifyContent="center"
      px={{ base:"16px", md:"0" }}
      sx={{ animation: `${fadeIn} .2s ease both` }}>
      <Box position="absolute" inset="0" bg="rgba(15,23,42,.65)" backdropFilter="blur(8px)"
        onClick={onClose} />
      <Box position="relative" bg="white" borderRadius="20px" p={{ base:"24px", md:"32px" }}
        w={{ base:"100%", md:"320px" }} maxW="360px" textAlign="center"
        boxShadow="0 40px 100px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .25s cubic-bezier(.22,1,.36,1) both` }}>
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }}
          position="absolute" top="0" left="0" right="0" borderRadius="20px 20px 0 0" />
        <Button position="absolute" top="12px" right="12px" size="xs" variant="ghost"
          borderRadius="8px" color="#94a3b8" _hover={{ bg:"#f1f5f9" }} onClick={onClose}>
          <Icon as={MdClose} boxSize="16px" />
        </Button>
        <Box w="80px" h="80px" borderRadius="16px"
          bg={`linear-gradient(135deg,${OR},${ORL})`}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 8px 24px ${ORSW}`} mx="auto" mb="16px">
          <Icon as={FaQrcode} boxSize="36px" color="white" />
        </Box>
        <Text fontSize="16px" fontWeight="800" color="#0f172a" mb="4px">QR Code vé</Text>
        <Text fontSize="12px" color="#94a3b8" mb="20px">{ticket.code} — {ticket.customer}</Text>
        <Box p="20px" borderRadius="12px" bg={ORPL} border={`2px dashed ${ORBD}`} mb="16px">
          <Text fontSize="13px" fontWeight="800" color={OR} letterSpacing="2px">{ticket.qr}</Text>
          <Text fontSize="11px" color="#94a3b8" mt="4px">{ticket.movie}</Text>
          <Text fontSize="11px" color="#94a3b8">{ticket.showtime}</Text>
          <Text fontSize="13px" fontWeight="700" color="#0f172a" mt="8px">Ghế: {ticket.seat}</Text>
        </Box>
        <StatusBadge status={ticket.status} />
      </Box>
    </Box>
  );
}

// ─── Mobile Ticket Card ───────────────────────────────────────────────────────
function MobileTicketCard({ ticket, index, onView, onEdit, onQR }) {
  return (
    <Box p="14px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
      transition="all .2s"
      _active={{ bg:"#fffaf7", border:`1.5px solid ${ORBD}` }}
      boxShadow="0 1px 4px rgba(0,0,0,.04)"
      sx={{ animation:`${fadeUp} .35s ease ${index*.04}s both` }}
    >
      {/* Top row */}
      <Flex justify="space-between" align="flex-start" mb="10px">
        <Flex align="center" gap="8px">
          <Box px="7px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
            <Text fontSize="10.5px" fontWeight="800" color={OR}>{ticket.code}</Text>
          </Box>
          <Box px="8px" py="3px" borderRadius="6px" bg="#f1f5f9" border="1px solid #e2e8f0">
            <Text fontSize="11.5px" fontWeight="800" color="#475569">Ghế {ticket.seat}</Text>
          </Box>
        </Flex>
        <StatusBadge status={ticket.status} />
      </Flex>

      {/* Movie */}
      <Text fontSize="14px" fontWeight="700" color="#0f172a" mb="2px" noOfLines={1}>{ticket.movie}</Text>
      <Text fontSize="11.5px" color="#94a3b8" mb="10px" noOfLines={1}>{ticket.showtime}</Text>

      {/* Customer info */}
      <Flex align="center" justify="space-between" mb="12px">
        <Box>
          <Text fontSize="12.5px" fontWeight="600" color="#334155">{ticket.customer}</Text>
          <Text fontSize="11px" color="#94a3b8">{ticket.email}</Text>
        </Box>
        <Text fontSize="14px" fontWeight="800" color={OR}>{ticket.price}</Text>
      </Flex>

      {/* Actions */}
      <Flex gap="8px">
        <Button flex="1" h="36px" borderRadius="8px" fontSize="12px" fontWeight="600"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          leftIcon={<Icon as={FaQrcode} boxSize="12px" />}
          _hover={{ bg:"#f1f5f9" }} _active={{ transform:"scale(.97)" }}
          transition="all .15s" onClick={() => onQR(ticket)}>
          QR
        </Button>
        <Button flex="1" h="36px" borderRadius="8px" fontSize="12px" fontWeight="600"
          bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ bg:"#f1f5f9" }} _active={{ transform:"scale(.97)" }}
          transition="all .15s" onClick={() => onView(ticket)}>
          Xem
        </Button>
        <Button flex="1" h="36px" borderRadius="8px" fontSize="12px" fontWeight="700"
          bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
          leftIcon={<Icon as={MdEdit} boxSize="12px" />}
          _hover={{ opacity:.9 }} _active={{ transform:"scale(.97)" }}
          boxShadow={`0 2px 8px ${ORSW}`} transition="all .15s"
          onClick={() => onEdit(ticket)}>
          Sửa
        </Button>
      </Flex>
    </Box>
  );
}

// ─── Desktop Ticket Row ───────────────────────────────────────────────────────
function TicketRow({ ticket, index, onView, onEdit, onQR }) {
  return (
    <Flex align="center" px="16px" py="12px" borderRadius="10px" bg="white"
      border="1.5px solid #f1f5f9" transition="all .2s"
      _hover={{ border:`1.5px solid ${ORBD}`, boxShadow:`0 2px 12px rgba(234,88,12,.08)`, bg:"#fffaf7" }}
      sx={{ animation:`${fadeUp} .35s ease ${index*.04}s both` }}
    >
      <Box w={COL.idx} flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color="#cbd5e1">{String(index+1).padStart(2,"0")}</Text>
      </Box>
      <Box w={COL.code} flexShrink="0">
        <Box px="7px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`} display="inline-block">
          <Text fontSize="10.5px" fontWeight="800" color={OR} letterSpacing=".5px">{ticket.code}</Text>
        </Box>
      </Box>
      <Box w={COL.customer} flexShrink="0" pr="12px">
        <Text fontSize="12.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{ticket.customer}</Text>
        <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{ticket.email}</Text>
      </Box>
      <Box flex="1" minW="0" pr="12px">
        <Text fontSize="12.5px" fontWeight="600" color="#334155" noOfLines={1}>{ticket.movie}</Text>
        <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{ticket.showtime}</Text>
      </Box>
      <Box w={COL.seat} flexShrink="0" pr="10px">
        <Box px="8px" py="3px" borderRadius="6px" bg="#f1f5f9" border="1px solid #e2e8f0" display="inline-block">
          <Text fontSize="11.5px" fontWeight="800" color="#475569">{ticket.seat}</Text>
        </Box>
      </Box>
      <Box w={COL.price} flexShrink="0" pr="10px">
        <Text fontSize="12.5px" fontWeight="700" color="#0f172a">{ticket.price}</Text>
      </Box>
      <Box w={COL.status} flexShrink="0" pr="10px">
        <StatusBadge status={ticket.status} />
      </Box>
      <Box w={COL.actions} flexShrink="0">
        <Flex gap="5px" align="center">
          <Button size="xs" h="28px" w="28px" minW="28px" px="0" borderRadius="7px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            _hover={{ bg:"#f1f5f9" }} transition="all .15s"
            onClick={() => onQR(ticket)}>
            <Icon as={FaQrcode} boxSize="12px" />
          </Button>
          <Button size="xs" h="28px" px="10px" borderRadius="7px"
            bg="#f8fafc" color="#475569" border="1px solid #e2e8f0"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg:"#f1f5f9", color:"#0f172a" }} transition="all .15s"
            onClick={() => onView(ticket)}>Xem</Button>
          <Button size="xs" h="28px" px="10px" borderRadius="7px"
            bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity:.88, transform:"translateY(-1px)" }}
            boxShadow={`0 2px 8px ${ORSW}`} transition="all .15s"
            onClick={() => onEdit(ticket)}>Sửa</Button>
        </Flex>
      </Box>
    </Flex>
  );
}

// ─── Filter Drawer (Mobile) ───────────────────────────────────────────────────
function FilterDrawer({ isOpen, onClose, filterStatus, setFilterStatus }) {
  const statuses = ["Tất cả", "Đã thanh toán", "Đã check-in", "Đã hủy", "Hết hạn"];
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent borderRadius="20px 20px 0 0" pb="env(safe-area-inset-bottom, 16px)">
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL})`} borderRadius="20px 20px 0 0" />
        <DrawerHeader pt="16px" pb="8px">
          <Flex align="center" justify="space-between">
            <Text fontSize="15px" fontWeight="800" color="#0f172a">Lọc trạng thái</Text>
            <Button size="sm" variant="ghost" borderRadius="8px" color="#94a3b8"
              onClick={onClose}><Icon as={MdClose} boxSize="18px" /></Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody pb="20px">
          <Flex direction="column" gap="8px">
            {statuses.map(s => {
              const cfg = STATUS_CFG[s];
              const isActive = filterStatus === s;
              return (
                <Button key={s} h="48px" borderRadius="12px" justifyContent="flex-start"
                  px="16px" fontSize="13.5px" fontWeight="600"
                  bg={isActive ? (cfg ? cfg.bg : ORPL) : "#f8fafc"}
                  color={isActive ? (cfg ? cfg.color : OR) : "#374151"}
                  border={`1.5px solid ${isActive ? (cfg ? cfg.border : ORBD) : "#e8edf3"}`}
                  _hover={{ bg: cfg ? cfg.bg : ORPL }}
                  onClick={() => { setFilterStatus(s); onClose(); }}
                >
                  {cfg && <Box w="8px" h="8px" borderRadius="full" bg={cfg.dot} mr="10px" />}
                  {s}
                  {isActive && <Icon as={MdCheckCircle} boxSize="16px" color={cfg ? cfg.color : OR} ml="auto" />}
                </Button>
              );
            })}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function TicketDetail({ ticket, onBack, onEdit }) {
  return (
    <Box sx={{ animation:`${fadeIn} .3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h={{ base:"40px", md:"38px" }}
          fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg:"#f8fafc" }} onClick={onBack}>
          Quay lại
        </Button>
        <Button h={{ base:"40px", md:"40px" }} px="20px" borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
          boxShadow={`0 4px 14px ${ORSW}`}
          _hover={{ boxShadow:`0 6px 20px rgba(234,88,12,.4)`, transform:"translateY(-1px)" }}
          _active={{ transform:"translateY(0)" }} transition="all .2s"
          leftIcon={<Icon as={MdEdit} />} onClick={() => onEdit(ticket)}>
          Chỉnh sửa
        </Button>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
        boxShadow="0 2px 12px rgba(0,0,0,.06)" overflow="hidden" mb="18px">
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }} />
        <Box p={{ base:"18px", md:"26px" }}>
          <Flex justify="space-between" align="flex-start" mb="16px"
            direction={{ base:"column", md:"row" }} gap={{ base:"10px", md:"0" }}>
            <Box>
              <Flex align="center" gap="10px" mb="8px" flexWrap="wrap">
                <Box px="9px" py="4px" borderRadius="7px" bg={ORPL} border={`1px solid ${ORBD}`}>
                  <Text fontSize="11px" fontWeight="800" color={OR} letterSpacing=".5px">{ticket.code}</Text>
                </Box>
                <Text fontSize={{ base:"16px", md:"20px" }} fontWeight="800" color="#0f172a" letterSpacing="-.3px">
                  {ticket.movie}
                </Text>
              </Flex>
              <StatusBadge status={ticket.status} />
            </Box>
            <Box textAlign={{ base:"left", md:"right" }} mt={{ base:"0", md:"0" }}>
              <Text fontSize="12px" color="#94a3b8" fontWeight="600">Giá vé</Text>
              <Text fontSize={{ base:"20px", md:"22px" }} fontWeight="800" color={OR}>{ticket.price}</Text>
            </Box>
          </Flex>

          <Box h="1px" bg="#f1f5f9" mb="16px" />

          <SimpleGrid columns={{ base:2, md:4 }} spacing={{ base:"10px", md:"14px" }} mb="16px">
            {[
              { icon:MdPerson,       label:"Khách hàng", val:ticket.customer },
              { icon:MdEmail,        label:"Email",       val:ticket.email    },
              { icon:MdLocalActivity,label:"Suất chiếu",  val:ticket.showtime },
              { icon:MdEventSeat,    label:"Ghế",         val:ticket.seat     },
            ].map(({ icon:Ic, label, val }) => (
              <Box key={label} p={{ base:"10px 12px", md:"10px 14px" }} borderRadius="10px"
                bg="#f8fafc" border="1px solid #f1f5f9">
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={OR} />
                  <Text fontSize="9.5px" fontWeight="700" color="#94a3b8" letterSpacing=".8px"
                    textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize={{ base:"12px", md:"13px" }} fontWeight="700" color="#0f172a"
                  noOfLines={2}>{val}</Text>
              </Box>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base:1, md:3 }} spacing={{ base:"10px", md:"14px" }}>
            {[
              { label:"Số điện thoại", val:ticket.phone   },
              { label:"Combo",         val:ticket.combo   },
              { label:"Ghi chú",       val:ticket.note || "Không có" },
            ].map(({ label, val }) => (
              <Box key={label} p={{ base:"10px 12px", md:"10px 14px" }} borderRadius="10px"
                bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="9.5px" fontWeight="700" color={OR} letterSpacing=".8px"
                  textTransform="uppercase" mb="4px">{label}</Text>
                <Text fontSize={{ base:"12px", md:"13px" }} fontWeight="600" color="#334155">{val}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* QR preview */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,.04)" p={{ base:"16px", md:"20px" }}
        sx={{ animation:`${fadeUp} .4s ease .1s both` }}>
        <SectionTitle label="Mã QR vé" />
        <Flex align="center" gap="16px">
          <Box w={{ base:"56px", md:"64px" }} h={{ base:"56px", md:"64px" }}
            borderRadius="12px" bg={`linear-gradient(135deg,${OR},${ORL})`}
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={`0 4px 14px ${ORSW}`}>
            <Icon as={FaQrcode} boxSize={{ base:"24px", md:"28px" }} color="white" />
          </Box>
          <Box>
            <Text fontSize={{ base:"14px", md:"16px" }} fontWeight="800" color="#0f172a"
              letterSpacing="2px">{ticket.qr}</Text>
            <Text fontSize="12px" color="#94a3b8" mt="2px">Quét mã QR để check-in tại rạp</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────
function TicketEdit({ ticket, onBack, onSave }) {
  const [selectedSeat, setSelectedSeat] = useState(ticket.seat);
  const [status, setStatus]             = useState(ticket.status);
  const [note, setNote]                 = useState(ticket.note);

  return (
    <Box sx={{ animation:`${fadeIn} .3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="40px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg:"#f8fafc" }} onClick={onBack}>
          Chi tiết vé
        </Button>
      </Flex>

      <Grid templateColumns={{ base:"1fr", lg:"1.4fr 1fr" }} gap="18px">
        {/* Left: form */}
        <Box>
          <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
            boxShadow="0 1px 4px rgba(0,0,0,.04)" p={{ base:"16px", md:"22px" }} mb="16px"
            sx={{ animation:`${fadeUp} .35s ease both` }}>
            <SectionTitle label="Thông tin vé" />

            <SimpleGrid columns={{ base:1, sm:2 }} gap="12px" mb="14px">
              {[
                { label:"Mã vé",       val:ticket.code,     ro:true  },
                { label:"Khách hàng",  val:ticket.customer, ro:true  },
                { label:"Email",       val:ticket.email,    ro:true  },
                { label:"Số điện thoại", val:ticket.phone,  ro:true  },
                { label:"Phim",        val:ticket.movie,    ro:true  },
                { label:"Suất chiếu",  val:ticket.showtime, ro:true  },
              ].map(({ label, val, ro }) => (
                <Box key={label}>
                  <Text sx={labelStyle}>{label}</Text>
                  <Input {...inputStyle} defaultValue={val} readOnly={ro}
                    opacity={ro ? .7 : 1} cursor={ro ? "not-allowed" : "text"} />
                </Box>
              ))}
            </SimpleGrid>

            <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="12px" mb="14px">
              <Box>
                <Text sx={labelStyle}>Ghế đã chọn</Text>
                <Input {...inputStyle} value={selectedSeat} readOnly />
              </Box>
              <Box>
                <Text sx={labelStyle}>Trạng thái</Text>
                <Select {...inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Đã check-in">Đã check-in</option>
                  <option value="Đã hủy">Đã hủy</option>
                  <option value="Hết hạn">Hết hạn</option>
                </Select>
              </Box>
            </Grid>

            <Box mb="16px">
              <Text sx={labelStyle}>Ghi chú nội bộ</Text>
              <Textarea
                bg="#fafafa" border="1.5px solid #e8edf3" borderRadius="10px"
                color="#1a202c" fontSize="14px" fontWeight="500" px="14px" py="10px"
                _placeholder={{ color:"#b0bac8" }}
                _focus={{ border:`1.5px solid ${OR}`, boxShadow:`0 0 0 3px rgba(234,88,12,.1)`, bg:"#fff" }}
                _hover={{ border:`1.5px solid ${OR}` }}
                transition="all .2s" rows={3}
                placeholder="Nhập ghi chú nội bộ cho vé này..."
                value={note} onChange={e => setNote(e.target.value)}
              />
            </Box>

            {/* Mobile: sticky save bar */}
            <Box display={{ base:"none", md:"block" }}>
              <Flex justify="flex-end" gap="10px">
                <Button h="42px" px="20px" variant="ghost" color="#64748b" borderRadius="10px"
                  fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
                  _hover={{ bg:"#f8fafc" }} transition="all .2s"
                  leftIcon={<Icon as={MdClose} />} onClick={onBack}>Hủy bỏ</Button>
                <Button h="42px" px="24px" borderRadius="10px" fontWeight="700" fontSize="13px"
                  bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
                  boxShadow={`0 4px 16px ${ORSW}`}
                  _hover={{ boxShadow:`0 8px 24px rgba(234,88,12,.4)`, transform:"translateY(-1px)" }}
                  _active={{ transform:"translateY(0)" }} transition="all .2s"
                  leftIcon={<Icon as={MdCheckCircle} />}
                  onClick={() => onSave({ ...ticket, seat:selectedSeat, status, note })}>
                  Lưu thay đổi
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* Right: seat map */}
        <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,.04)" p={{ base:"16px", md:"22px" }}
          sx={{ animation:`${fadeUp} .35s ease .08s both` }}>
          <SectionTitle label="Sơ đồ ghế" />

          {/* Screen */}
          <Box bg={`linear-gradient(135deg,${OR},${ORL})`} color="white" textAlign="center"
            py="8px" borderRadius="10px" mb="18px" fontSize="11px" fontWeight="800"
            letterSpacing="2px" boxShadow={`0 4px 14px ${ORSW}`}>
            ▬▬▬ MÀN HÌNH ▬▬▬
          </Box>

          <SimpleGrid columns={5} spacing={{ base:"6px", md:"8px" }} mb="18px">
            {SEAT_MAP.map(seat => {
              const isCurrent  = seat.id === selectedSeat;
              const isBooked   = seat.booked && seat.id !== ticket.seat;
              const isOriginal = seat.id === ticket.seat;
              return (
                <Button key={seat.id} h={{ base:"38px", md:"40px" }} borderRadius="9px"
                  fontSize={{ base:"10px", md:"11px" }} fontWeight="700"
                  bg={
                    isCurrent  ? `linear-gradient(135deg,${OR},${ORL})` :
                    isBooked   ? "#e5e7eb" :
                    isOriginal ? ORPL      : "#f8fafc"
                  }
                  color={
                    isCurrent  ? "white"   :
                    isBooked   ? "#9ca3af" :
                    isOriginal ? OR        : "#475569"
                  }
                  border={`1.5px solid ${
                    isCurrent  ? OR     :
                    isBooked   ? "#e5e7eb" :
                    isOriginal ? ORBD   : "#e2e8f0"
                  }`}
                  boxShadow={isCurrent ? `0 3px 10px ${ORSW}` : "none"}
                  cursor={isBooked ? "not-allowed" : "pointer"}
                  opacity={isBooked ? .6 : 1}
                  _hover={!isBooked ? { transform:"scale(1.06)", boxShadow:`0 3px 10px ${ORSW}` } : {}}
                  _active={{ transform:"scale(.95)" }}
                  transition="all .18s"
                  onClick={() => { if (!isBooked) setSelectedSeat(seat.id); }}
                >
                  {seat.id}
                </Button>
              );
            })}
          </SimpleGrid>

          {/* Legend */}
          <Box p="12px 14px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9" mb="12px">
            <SimpleGrid columns={2} spacing="6px">
              {[
                { bg:"#f8fafc",                       border:"#e2e8f0", label:"Ghế trống"  },
                { bg:`linear-gradient(135deg,${OR},${ORL})`, border:OR, label:"Đang chọn", textColor:"white" },
                { bg:ORPL,                            border:ORBD,      label:"Ghế gốc"   },
                { bg:"#e5e7eb",                       border:"#e5e7eb", label:"Đã đặt"    },
              ].map(({ bg, border, label }) => (
                <Flex key={label} align="center" gap="5px">
                  <Box w="14px" h="14px" borderRadius="4px" bg={bg} border={`1.5px solid ${border}`} flexShrink="0" />
                  <Text fontSize="10.5px" fontWeight="600" color="#64748b">{label}</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>

          {selectedSeat && (
            <Box p="12px 14px" borderRadius="10px" bg={ORPL} border={`1px solid ${ORBD}`}>
              <Text fontSize="11px" fontWeight="700" color={OR}>Ghế đang chọn:</Text>
              <Text fontSize="18px" fontWeight="800" color="#0f172a">{selectedSeat}</Text>
            </Box>
          )}
        </Box>
      </Grid>

      {/* Mobile sticky save bar */}
      <Box display={{ base:"block", md:"none" }}
        position="sticky" bottom="0" left="0" right="0"
        bg="white" borderTop="1px solid #f1f5f9"
        p="12px 16px" mt="16px"
        pb="calc(12px + env(safe-area-inset-bottom, 0px))"
        boxShadow="0 -4px 20px rgba(0,0,0,.08)"
      >
        <Flex gap="10px">
          <Button flex="1" h="46px" variant="ghost" color="#64748b" borderRadius="12px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg:"#f8fafc" }} transition="all .2s"
            leftIcon={<Icon as={MdClose} />} onClick={onBack}>Hủy bỏ</Button>
          <Button flex="2" h="46px" borderRadius="12px" fontWeight="700" fontSize="14px"
            bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
            boxShadow={`0 4px 16px ${ORSW}`}
            _hover={{ opacity:.9 }} _active={{ transform:"scale(.98)" }} transition="all .2s"
            leftIcon={<Icon as={MdCheckCircle} />}
            onClick={() => onSave({ ...ticket, seat:selectedSeat, status, note })}>
            Lưu thay đổi
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Quanlyve() {
  const [tickets, setTickets]           = useState(INIT_TICKETS);
  const [view, setView]                 = useState("list");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [qrTicket, setQrTicket]         = useState(null);
  const [showSearch, setShowSearch]     = useState(false);
  const { isOpen: isFilterOpen, onOpen: openFilter, onClose: closeFilter } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.code.toLowerCase().includes(q) ||
                        t.customer.toLowerCase().includes(q) ||
                        t.email.toLowerCase().includes(q) ||
                        t.movie.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tất cả" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total:   tickets.length,
    paid:    tickets.filter(t => t.status === "Đã thanh toán").length,
    checkin: tickets.filter(t => t.status === "Đã check-in").length,
    cancel:  tickets.filter(t => t.status === "Đã hủy").length,
    expired: tickets.filter(t => t.status === "Hết hạn").length,
  };

  const handleSave = (updated) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTicket(updated);
    setView("detail");
  };

  if (view === "detail" && selectedTicket) {
    const live = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box pt={{ base:"80px", md:"80px" }} px={{ base:"12px", md:"0" }}>
        <TicketDetail
          ticket={live}
          onBack={() => setView("list")}
          onEdit={tk => { setSelectedTicket(tk); setView("edit"); }}
        />
      </Box>
    );
  }

  if (view === "edit" && selectedTicket) {
    const live = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box pt={{ base:"80px", md:"80px" }} px={{ base:"12px", md:"0" }}>
        <TicketEdit
          ticket={live}
          onBack={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return (
    <Box pt={{ base:"80px", md:"80px" }} px={{ base:"0", md:"0" }}>
      {/* QR Modal */}
      {qrTicket && <QRModal ticket={qrTicket} onClose={() => setQrTicket(null)} />}

      {/* Filter Drawer (Mobile) */}
      <FilterDrawer
        isOpen={isFilterOpen} onClose={closeFilter}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      {/* Page header */}
      <Box px={{ base:"16px", md:"0" }}>
        <Flex justify="space-between" align="center" mb="16px"
          sx={{ animation:`${fadeUp} .4s ease both` }}>
          <Flex align="center" gap="10px">
            <Box w={{ base:"36px", md:"38px" }} h={{ base:"36px", md:"38px" }} borderRadius="11px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${ORSW}`}>
              <Icon as={FaTicketAlt} boxSize={{ base:"14px", md:"16px" }} color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base:"20px", md:"26px" }} fontWeight="800" color="#0f172a" letterSpacing="-.5px">
                Quản lý vé
              </Text>
              <Text color="#94a3b8" fontSize={{ base:"11px", md:"13px" }} display={{ base:"none", md:"block" }}>
                Tra cứu và quản lý vé đã bán theo suất chiếu và khách hàng
              </Text>
            </Box>
          </Flex>

          {/* Mobile action buttons */}
          <Flex gap="8px" display={{ base:"flex", md:"none" }}>
            <Button h="36px" w="36px" minW="36px" p="0" borderRadius="10px"
              bg={showSearch ? ORPL : "#f8fafc"} color={showSearch ? OR : "#475569"}
              border={`1.5px solid ${showSearch ? ORBD : "#e2e8f0"}`}
              onClick={() => setShowSearch(v => !v)}>
              <Icon as={MdSearch} boxSize="16px" />
            </Button>
            <Button h="36px" w="36px" minW="36px" p="0" borderRadius="10px"
              bg={filterStatus !== "Tất cả" ? ORPL : "#f8fafc"}
              color={filterStatus !== "Tất cả" ? OR : "#475569"}
              border={`1.5px solid ${filterStatus !== "Tất cả" ? ORBD : "#e2e8f0"}`}
              onClick={openFilter}>
              <Icon as={MdFilterAlt} boxSize="16px" />
            </Button>
          </Flex>
        </Flex>

        {/* Mobile search bar (expandable) */}
        {showSearch && (
          <Box mb="12px" display={{ base:"block", md:"none" }}
            sx={{ animation:`${fadeUp} .2s ease both` }}>
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%"
                transform="translateY(-50%)" boxSize="16px" color="#94a3b8" zIndex="1" />
              <Input
                pl="36px" h="42px" fontSize="13px" fontWeight="500"
                placeholder="Tìm mã vé, khách hàng, phim..."
                bg="white" border="1.5px solid #e8edf3" borderRadius="12px" color="#374151"
                _placeholder={{ color:"#b0bac8" }}
                _focus={{ border:`1.5px solid ${OR}`, boxShadow:`0 0 0 3px rgba(234,88,12,.08)`, bg:"#fff" }}
                transition="all .2s"
                value={search} onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </Box>
            {/* Active filter chip */}
            {filterStatus !== "Tất cả" && (
              <Flex mt="8px" gap="6px">
                <Box px="10px" py="4px" borderRadius="8px" bg={ORPL} border={`1px solid ${ORBD}`}
                  display="inline-flex" alignItems="center" gap="6px">
                  <Text fontSize="11.5px" fontWeight="600" color={OR}>{filterStatus}</Text>
                  <Box as="button" onClick={() => setFilterStatus("Tất cả")} color={OR}>
                    <Icon as={MdClose} boxSize="12px" />
                  </Box>
                </Box>
              </Flex>
            )}
          </Box>
        )}
      </Box>

      {/* Stats */}
      <Box px={{ base:"16px", md:"0" }} mb="16px">
        <SimpleGrid columns={{ base:3, sm:5, md:5 }} spacing={{ base:"8px", md:"14px" }}>
          <StatCard label="Tổng vé"    value={counts.total}   icon={FaTicketAlt}     accent={OR}       delay={0}    />
          <StatCard label="Thanh toán" value={counts.paid}    icon={FaRegCheckCircle} accent="#10b981" delay={0.04} />
          <StatCard label="Check-in"   value={counts.checkin} icon={MdCheckCircle}   accent={OR}       delay={0.08} />
          <StatCard label="Đã hủy"     value={counts.cancel}  icon={FaTimesCircle}   accent="#ef4444"  delay={0.12} />
          <StatCard label="Hết hạn"    value={counts.expired} icon={FaHourglass}     accent="#9ca3af"  delay={0.16} />
        </SimpleGrid>
      </Box>

      {/* Table card */}
      <Box bg="white" borderRadius={{ base:"16px 16px 0 0", md:"16px" }}
        border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,.04)"
        mx={{ base:"0", md:"0" }}
        sx={{ animation:`${fadeUp} .4s ease .1s both` }}>

        {/* Desktop toolbar */}
        <Box display={{ base:"none", md:"block" }}>
          <Flex align="center" justify="space-between" p="18px 20px 14px"
            borderBottom="1px solid #f8fafc" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color="#0f172a">Danh sách vé</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length} vé</Text>
              </Box>
            </Flex>
            <Flex gap="8px" align="center">
              <Box position="relative">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                <Input
                  pl="30px" h="34px" w="230px" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm mã vé, khách hàng, phim..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color:"#b0bac8" }}
                  _focus={{ border:`1.5px solid ${OR}`, boxShadow:`0 0 0 3px rgba(234,88,12,.08)`, bg:"#fff" }}
                  _hover={{ border:`1px solid ${OR}` }}
                  transition="all .2s"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </Box>
              <Select h="34px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" w="165px"
                _focus={{ border:`1.5px solid ${OR}`, boxShadow:`0 0 0 3px rgba(234,88,12,.08)` }}
                _hover={{ border:`1px solid ${OR}` }} transition="all .2s"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Đã check-in">Đã check-in</option>
                <option value="Đã hủy">Đã hủy</option>
                <option value="Hết hạn">Hết hạn</option>
              </Select>
            </Flex>
          </Flex>
        </Box>

        {/* Mobile toolbar */}
        <Box display={{ base:"block", md:"none" }}>
          <Flex align="center" justify="space-between" px="16px" py="12px"
            borderBottom="1px solid #f8fafc">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="14px" color="#0f172a">Danh sách vé</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length} vé</Text>
              </Box>
            </Flex>
            {filterStatus !== "Tất cả" && (
              <Box px="8px" py="3px" borderRadius="7px" bg={ORPL} border={`1px solid ${ORBD}`}
                display="inline-flex" alignItems="center" gap="4px" cursor="pointer"
                onClick={() => setFilterStatus("Tất cả")}>
                <Text fontSize="10.5px" fontWeight="700" color={OR}>{filterStatus}</Text>
                <Icon as={MdClose} boxSize="10px" color={OR} />
              </Box>
            )}
          </Flex>
        </Box>

        {/* Desktop column headers */}
        <Box display={{ base:"none", md:"block" }}>
          <Flex align="center" px="16px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9">
            <CH w={COL.idx}>#</CH>
            <CH w={COL.code}>Mã vé</CH>
            <CH w={COL.customer} pr="12px">Khách hàng</CH>
            <CH flex="1" pr="12px">Phim / Suất chiếu</CH>
            <CH w={COL.seat} pr="10px">Ghế</CH>
            <CH w={COL.price} pr="10px">Giá vé</CH>
            <CH w={COL.status} pr="10px">Trạng thái</CH>
            <CH w={COL.actions}>Hành động</CH>
          </Flex>
        </Box>

        {/* Rows */}
        <Box p={{ base:"12px", md:"10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color="#cbd5e1">
              <Icon as={FaTicketAlt} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color="#94a3b8">Không tìm thấy vé nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap={{ base:"8px", md:"6px" }}>
              {filtered.map((t, i) =>
                isMobile ? (
                  <MobileTicketCard
                    key={t.id} ticket={t} index={i}
                    onView={tk => { setSelectedTicket(tk); setView("detail"); }}
                    onEdit={tk => { setSelectedTicket(tk); setView("edit"); }}
                    onQR={tk => setQrTicket(tk)}
                  />
                ) : (
                  <TicketRow
                    key={t.id} ticket={t} index={i}
                    onView={tk => { setSelectedTicket(tk); setView("detail"); }}
                    onEdit={tk => { setSelectedTicket(tk); setView("edit"); }}
                    onQR={tk => setQrTicket(tk)}
                  />
                )
              )}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}