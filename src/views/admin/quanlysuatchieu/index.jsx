import React, { useState, useCallback } from "react";
import {
  Box, Grid, Text, Button, Flex, Icon, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalBody,
  FormControl, FormLabel, Input, Select, useDisclosure,
  keyframes, Tag, Divider, Badge, Tooltip,
} from "@chakra-ui/react";
import {
  MdAccessTime, MdAdd, MdEdit, MdVisibility, MdMeetingRoom,
  MdCalendarToday, MdSchedule, MdMovie, MdCheckCircle, MdClose,
  MdLocalMovies, MdStar, MdSearch, MdPlayCircle, MdTimer, MdDone,
  MdFilterList, MdExpandMore, MdChevronRight, MdEventSeat,
  MdMoreVert, MdRefresh, MdKeyboardArrowLeft,
} from "react-icons/md";
import { FaFilm, FaTicketAlt, FaClock, FaFireAlt, FaRegCalendarAlt } from "react-icons/fa";
import { BsCameraReelsFill, BsGridFill, BsListUl } from "react-icons/bs";
import { HiOutlineTicket } from "react-icons/hi";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.94) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}`;
const slideLeft = keyframes`from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const shimmer = keyframes`0%{background-position:-400% 0}100%{background-position:400% 0}`;
const glow = keyframes`0%,100%{box-shadow:0 0 12px rgba(249,115,22,0.4)}50%{box-shadow:0 0 24px rgba(249,115,22,0.7)}`;

// ─── Status ───────────────────────────────────────────────────────────────────
const STATUS = {
  "Đang chiếu":  { color:"#059669", bg:"#ecfdf5", border:"#a7f3d0", dot:"#10b981", icon: MdPlayCircle, tag:"🟢" },
  "Sắp chiếu":   { color:"#d97706", bg:"#fffbeb", border:"#fde68a", dot:"#f59e0b", icon: MdTimer,       tag:"🟡" },
  "Đã kết thúc": { color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb", dot:"#9ca3af", icon: MdDone,        tag:"⚫" },
};

function StatusPill({ status, size = "md" }) {
  const cfg = STATUS[status] || STATUS["Đã kết thúc"];
  const isLive = status === "Đang chiếu";
  const sm = size === "sm";
  return (
    <Flex align="center" gap={sm?"4px":"6px"} px={sm?"8px":"11px"} py={sm?"3px":"5px"}
      borderRadius="999px" bg={cfg.bg} border={`1.5px solid ${cfg.border}`} display="inline-flex"
    >
      <Box w={sm?"5px":"7px"} h={sm?"5px":"7px"} borderRadius="full" bg={cfg.dot}
        sx={isLive?{animation:`${pulse} 1.6s ease infinite`}:{}}
      />
      <Text fontSize={sm?"11px":"12px"} fontWeight="700" color={cfg.color} letterSpacing="0.2px">
        {status}
      </Text>
    </Flex>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  bg:"#fafafa", border:"1.5px solid #e8edf3", borderRadius:"10px",
  color:"#1a202c", fontSize:"14px", fontWeight:"500", px:"14px", h:"44px",
  _placeholder:{color:"#b0bac8",fontWeight:"400"},
  _focus:{border:"1.5px solid #f97316",boxShadow:"0 0 0 3px rgba(249,115,22,0.10)",bg:"#ffffff"},
  _hover:{border:"1.5px solid #f97316",bg:"#ffffff"},
  transition:"all 0.2s ease",
};

const labelStyle = {
  fontSize:"10.5px", fontWeight:"800", letterSpacing:"0.9px",
  textTransform:"uppercase", color:"#64748b", mb:"7px",
  display:"flex", alignItems:"center", gap:"6px",
};

function FormField({ icon, label, children, delay = 0 }) {
  return (
    <Box sx={{ animation:`${fadeUp} 0.4s ease ${delay}s both` }}>
      <FormLabel sx={labelStyle}>
        {icon && <Icon as={icon} boxSize="10px" color="#f97316" />}
        {label}
      </FormLabel>
      <FormControl>{children}</FormControl>
    </Box>
  );
}

function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg,#f1f5f9,transparent)" />
    </Box>
  );
}

// ─── Left panel (dark sidebar in modal) ──────────────────────────────────────
const slideRight = keyframes`from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}`;

function ModalLeftPanel({ title, subtitle, previewData }) {
  return (
    <Box
      w="220px" minW="220px"
      bg="linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)"
      p="28px 20px" display={{ base:"none", md:"flex" }} flexDirection="column"
      position="relative" overflow="hidden"
    >
      <Box position="absolute" top="-40px" right="-40px" w="150px" h="150px"
        borderRadius="full" bg="rgba(249,115,22,0.07)" border="1px solid rgba(249,115,22,0.1)" />
      <Box position="absolute" bottom="-20px" left="-30px" w="110px" h="110px"
        borderRadius="full" bg="rgba(99,102,241,0.07)" border="1px solid rgba(99,102,241,0.08)" />
      <Flex direction="column" gap="5px" position="absolute" left="10px" top="0" bottom="0"
        justify="center" opacity={0.12}
      >
        {[...Array(12)].map((_,i) => <Box key={i} w="4px" h="4px" borderRadius="1px" bg="#f97316" />)}
      </Flex>

      <Box w="50px" h="50px" borderRadius="14px"
        bg="linear-gradient(135deg,#f97316,#fb923c)"
        display="flex" alignItems="center" justifyContent="center"
        boxShadow="0 6px 20px rgba(249,115,22,0.4)" mb="18px"
        sx={{ animation:`${fadeIn} 0.5s ease 0.1s both` }}
      >
        <Icon as={FaFilm} boxSize="20px" color="white" />
      </Box>

      <Box sx={{ animation:`${slideRight} 0.4s ease 0.15s both` }}>
        <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.3" mb="6px">{title}</Text>
        <Text fontSize="11px" color="rgba(255,255,255,0.45)" lineHeight="1.6">{subtitle}</Text>
      </Box>

      <Box my="20px" h="1px" bg="linear-gradient(90deg,rgba(249,115,22,0.5),transparent)" />

      {previewData && (
        <Box sx={{ animation:`${fadeIn} 0.4s ease 0.2s both` }}>
          <Text fontSize="9px" color="rgba(249,115,22,0.8)" fontWeight="800" letterSpacing="2px"
            textTransform="uppercase" mb="12px">Xem trước</Text>
          <Flex direction="column" gap="10px">
            {previewData.map(({ icon: Ic, label, val }) => (
              <Box key={label}>
                <Flex align="center" gap="5px" mb="2px">
                  <Icon as={Ic} boxSize="9px" color="rgba(249,115,22,0.6)" />
                  <Text fontSize="8.5px" color="rgba(255,255,255,0.3)" fontWeight="700"
                    letterSpacing="1px" textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize="12px" fontWeight="600"
                  color={val?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.18)"}>{val||"—"}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      <Box mt="auto" pt="18px">
        <Flex align="center" gap="6px" p="9px 12px" borderRadius="9px"
          bg="rgba(249,115,22,0.1)" border="1px solid rgba(249,115,22,0.18)"
        >
          <Box w="5px" h="5px" borderRadius="full" bg="#f97316"
            sx={{ animation:`${pulse} 2s ease infinite` }} />
          <Text fontSize="10px" color="rgba(249,115,22,0.9)" fontWeight="700">Rạp chiếu phim</Text>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function ModalShell({ isOpen, onClose, leftPanel, children, footer }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered motionPreset="none">
      <ModalOverlay bg="rgba(15,23,42,0.6)" backdropFilter="blur(10px)" />
      <ModalContent
        borderRadius="20px" border="1px solid #e2e8f0" bg="#ffffff"
        boxShadow="0 32px 80px rgba(0,0,0,0.2)" overflow="hidden"
        sx={{ animation:`${scaleIn} 0.3s cubic-bezier(0.22,1,0.36,1) both` }}
        maxW="760px" mx={{ base:"16px", md:"auto" }}
      >
        <Box h="3px" bg="linear-gradient(90deg,#f97316,#fbbf24,#f97316)"
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }} />
        <Flex>
          {leftPanel}
          <Box flex="1" display="flex" flexDirection="column" minW="0">
            <Box
              position="absolute" top="14px" right="14px" zIndex="10"
              w="28px" h="28px" borderRadius="9px" cursor="pointer"
              display="flex" alignItems="center" justifyContent="center"
              color="#94a3b8" transition="all 0.2s"
              _hover={{ color:"#374151", bg:"#f1f5f9" }}
              onClick={onClose}
            >
              <Icon as={MdClose} boxSize="15px" />
            </Box>
            <ModalBody px={{ base:"20px", md:"32px" }} py="26px" flex="1" overflowY="auto">
              {children}
            </ModalBody>
            {footer && (
              <Box px={{ base:"20px", md:"32px" }} py="18px"
                borderTop="1px solid #f1f5f9"
                bg="linear-gradient(180deg,#fff 0%,#fafafa 100%)"
              >
                {footer}
              </Box>
            )}
          </Box>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({ isOpen, onClose, value, onChange, onAdd }) {
  const canAdd = value.movie && value.room && value.date && value.time;
  const preview = [
    { icon: MdMovie,         label:"Tên phim", val: value.movie },
    { icon: MdMeetingRoom,   label:"Phòng",    val: value.room  },
    { icon: MdCalendarToday, label:"Ngày",     val: value.date  },
    { icon: FaClock,         label:"Giờ",      val: value.time  },
  ];
  return (
    <ModalShell
      isOpen={isOpen} onClose={onClose}
      leftPanel={
        <ModalLeftPanel
          title="Thêm suất chiếu mới"
          subtitle="Điền đầy đủ thông tin để tạo lịch chiếu phim mới"
          previewData={preview}
        />
      }
      footer={
        <Flex gap="10px">
          <Button h="44px" px="22px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg:"#f8fafc", borderColor:"#cbd5e1" }}
            transition="all 0.2s" onClick={onClose}
            leftIcon={<Icon as={MdClose} />}
          >Hủy bỏ</Button>
          <Button flex="1" h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={canAdd?"linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)":"#e2e8f0"}
            color={canAdd?"#ffffff":"#94a3b8"}
            boxShadow={canAdd?"0 4px 16px rgba(249,115,22,0.35)":"none"}
            _hover={canAdd?{boxShadow:"0 8px 24px rgba(249,115,22,0.45)",transform:"translateY(-1px)"}:{}}
            _active={{ transform:"translateY(0)" }}
            transition="all 0.2s" isDisabled={!canAdd}
            leftIcon={<Icon as={FaTicketAlt} />} onClick={onAdd}
          >Xác nhận thêm suất chiếu</Button>
        </Flex>
      }
    >
      <Box mb="22px" sx={{ animation:`${fadeUp} 0.35s ease both` }}>
        <Text fontSize="18px" fontWeight="800" color="#0f172a" letterSpacing="-0.3px">
          Thông tin suất chiếu
        </Text>
        <Text fontSize="12px" color="#94a3b8" mt="3px">
          Các trường có dấu <Text as="span" color="#f97316">*</Text> là bắt buộc
        </Text>
      </Box>
      <SectionTitle label="Thông tin phim" />
      <Box mb="18px" sx={{ animation:`${fadeUp} 0.4s ease 0.06s both` }}>
        <FormField icon={MdLocalMovies} label="Tên phim *">
          <Input {...inputStyle} placeholder="VD: Avengers: Endgame"
            value={value.movie} onChange={e=>onChange({...value,movie:e.target.value})} />
        </FormField>
      </Box>
      <SectionTitle label="Phòng & Trạng thái" />
      <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px" mb="18px">
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.1s both` }}>
          <FormField icon={MdMeetingRoom} label="Phòng chiếu *">
            <Input {...inputStyle} placeholder="VD: Phòng A1"
              value={value.room} onChange={e=>onChange({...value,room:e.target.value})} />
          </FormField>
        </Box>
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.12s both` }}>
          <FormField icon={MdStar} label="Trạng thái">
            <Select {...inputStyle} value={value.status}
              onChange={e=>onChange({...value,status:e.target.value})}>
              <option value="Đang chiếu">Đang chiếu</option>
              <option value="Sắp chiếu">Sắp chiếu</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </Select>
          </FormField>
        </Box>
      </Grid>
      <SectionTitle label="Lịch chiếu" />
      <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px">
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.16s both` }}>
          <FormField icon={MdCalendarToday} label="Ngày chiếu *">
            <Input {...inputStyle} type="date"
              value={value.date} onChange={e=>onChange({...value,date:e.target.value})} />
          </FormField>
        </Box>
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.18s both` }}>
          <FormField icon={MdSchedule} label="Giờ chiếu *">
            <Input {...inputStyle} type="time"
              value={value.time} onChange={e=>onChange({...value,time:e.target.value})} />
          </FormField>
        </Box>
      </Grid>
      {value.status && (
        <Box mt="16px" p="12px 16px" borderRadius="10px"
          bg="linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)"
          border="1.5px solid #fed7aa"
          sx={{ animation:`${fadeIn} 0.3s ease both` }}
        >
          <Flex align="center" justify="space-between">
            <Text fontSize="10.5px" color="#92400e" fontWeight="700" letterSpacing="0.5px">TRẠNG THÁI</Text>
            <StatusPill status={value.status} size="sm" />
          </Flex>
        </Box>
      )}
    </ModalShell>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ isOpen, onClose, value, onChange, onSave }) {
  if (!value) return null;
  const preview = [
    { icon: MdMovie,         label:"Tên phim", val: value.movie },
    { icon: MdMeetingRoom,   label:"Phòng",    val: value.room  },
    { icon: MdCalendarToday, label:"Ngày",     val: value.date  },
    { icon: FaClock,         label:"Giờ",      val: value.time  },
  ];
  return (
    <ModalShell
      isOpen={isOpen} onClose={onClose}
      leftPanel={
        <ModalLeftPanel
          title="Chỉnh sửa suất chiếu"
          subtitle="Cập nhật thông tin lịch chiếu phim đang tồn tại"
          previewData={preview}
        />
      }
      footer={
        <Flex gap="10px">
          <Button h="44px" px="22px" variant="ghost" color="#64748b" borderRadius="10px"
            fontWeight="600" fontSize="13px" border="1.5px solid #e2e8f0"
            _hover={{ bg:"#f8fafc", borderColor:"#cbd5e1" }}
            transition="all 0.2s" onClick={onClose}
            leftIcon={<Icon as={MdClose} />}
          >Hủy</Button>
          <Button flex="1" h="44px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fbbf24 100%)"
            color="#ffffff" boxShadow="0 4px 16px rgba(249,115,22,0.35)"
            _hover={{ boxShadow:"0 8px 24px rgba(249,115,22,0.45)", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdCheckCircle} />} onClick={onSave}
          >Lưu thay đổi</Button>
        </Flex>
      }
    >
      <Box mb="22px" sx={{ animation:`${fadeUp} 0.35s ease both` }}>
        <Text fontSize="18px" fontWeight="800" color="#0f172a" letterSpacing="-0.3px">Chỉnh sửa thông tin</Text>
        <Text fontSize="12px" color="#94a3b8" mt="3px">Cập nhật các trường thông tin bên dưới</Text>
      </Box>
      <SectionTitle label="Thông tin phim" />
      <Box mb="18px" sx={{ animation:`${fadeUp} 0.4s ease 0.06s both` }}>
        <FormField icon={MdLocalMovies} label="Tên phim *">
          <Input {...inputStyle} value={value.movie}
            onChange={e=>onChange({...value,movie:e.target.value})} />
        </FormField>
      </Box>
      <SectionTitle label="Phòng & Trạng thái" />
      <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px" mb="18px">
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.1s both` }}>
          <FormField icon={MdMeetingRoom} label="Phòng chiếu">
            <Input {...inputStyle} value={value.room}
              onChange={e=>onChange({...value,room:e.target.value})} />
          </FormField>
        </Box>
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.12s both` }}>
          <FormField icon={MdStar} label="Trạng thái">
            <Select {...inputStyle} value={value.status}
              onChange={e=>onChange({...value,status:e.target.value})}>
              <option value="Đang chiếu">Đang chiếu</option>
              <option value="Sắp chiếu">Sắp chiếu</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </Select>
          </FormField>
        </Box>
      </Grid>
      <SectionTitle label="Lịch chiếu" />
      <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap="14px">
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.16s both` }}>
          <FormField icon={MdCalendarToday} label="Ngày chiếu">
            <Input {...inputStyle} type="date"
              value={value.date} onChange={e=>onChange({...value,date:e.target.value})} />
          </FormField>
        </Box>
        <Box sx={{ animation:`${fadeUp} 0.4s ease 0.18s both` }}>
          <FormField icon={MdSchedule} label="Giờ chiếu">
            <Input {...inputStyle} type="time"
              value={value.time} onChange={e=>onChange({...value,time:e.target.value})} />
          </FormField>
        </Box>
      </Grid>
      <Box mt="16px" p="12px 16px" borderRadius="10px"
        bg="linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)"
        border="1.5px solid #fed7aa"
        sx={{ animation:`${fadeIn} 0.3s ease 0.2s both` }}
      >
        <Flex align="center" justify="space-between">
          <Text fontSize="10.5px" color="#92400e" fontWeight="700" letterSpacing="0.5px">TRẠNG THÁI HIỆN TẠI</Text>
          <StatusPill status={value.status} size="sm" />
        </Flex>
      </Box>
    </ModalShell>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, delay=0 }) {
  return (
    <Box
      p={{ base:"16px", md:"18px 20px" }} borderRadius="16px"
      bg="white" border="1px solid #f1f5f9"
      boxShadow="0 1px 6px rgba(0,0,0,0.04)"
      sx={{ animation:`${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.2s"
      _hover={{ boxShadow:"0 6px 20px rgba(0,0,0,0.08)", transform:"translateY(-2px)" }}
      position="relative" overflow="hidden"
    >
      {/* bg decoration */}
      <Box position="absolute" right="-14px" bottom="-14px" w="70px" h="70px"
        borderRadius="full" bg={`${accent}0d`} />

      <Flex align="flex-start" justify="space-between">
        <Box>
          <Text fontSize="10.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase" mb="6px">
            {label}
          </Text>
          <Text fontSize={{ base:"26px", md:"30px" }} fontWeight="900" color="#111827" lineHeight="1" mb="4px">
            {value}
          </Text>
          {sub && <Text fontSize="11px" color="#9ca3af" fontWeight="500">{sub}</Text>}
        </Box>
        <Box w={{ base:"36px", md:"42px" }} h={{ base:"36px", md:"42px" }} borderRadius="12px"
          bg={`${accent}18`} display="flex" alignItems="center" justifyContent="center"
          flexShrink="0"
        >
          <Icon as={icon} boxSize={{ base:"15px", md:"18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Grid Card view ───────────────────────────────────────────────────────────
function ShowtimeCard({ s, index, isSelected, onView, onEdit }) {
  const cfg = STATUS[s.status] || STATUS["Đã kết thúc"];
  return (
    <Box
      borderRadius="14px" overflow="hidden"
      bg={isSelected?"#fff7ed":"white"}
      border={isSelected?"2px solid #f97316":"1.5px solid #f1f5f9"}
      boxShadow={isSelected?"0 4px 20px rgba(249,115,22,0.15)":"0 1px 4px rgba(0,0,0,0.04)"}
      transition="all 0.2s"
      _hover={{ border:"1.5px solid #fdba74", boxShadow:"0 6px 22px rgba(249,115,22,0.12)", transform:"translateY(-2px)" }}
      sx={{ animation:`${fadeUp} 0.35s ease ${index*0.06}s both` }}
      cursor="pointer"
      onClick={() => onView(s)}
    >
      {/* Color bar */}
      <Box h="3px" bg={`linear-gradient(90deg, ${cfg.dot}, ${cfg.border})`} />

      <Box p="14px 16px">
        <Flex justify="space-between" align="flex-start" mb="10px">
          <StatusPill status={s.status} size="sm" />
          <Box
            w="28px" h="28px" borderRadius="8px"
            bg="linear-gradient(135deg,#fff7ed,#ffe4c8)"
            border="1px solid #fed7aa"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={BsCameraReelsFill} boxSize="11px" color="#f97316" />
          </Box>
        </Flex>

        <Text fontSize="13.5px" fontWeight="800" color="#111827" noOfLines={2} lineHeight="1.4" mb="8px">
          {s.movie}
        </Text>

        <Flex gap="6px" mb="12px" wrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdMeetingRoom} boxSize="10px" color="#f97316" />
            <Text fontSize="11px" fontWeight="600" color="#6b7280">{s.room}</Text>
          </Flex>
          <Box w="1px" h="13px" bg="#e5e7eb" mt="1px" />
          <Flex align="center" gap="4px">
            <Icon as={MdCalendarToday} boxSize="10px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="600" color="#6b7280">{s.date}</Text>
          </Flex>
          <Flex align="center" gap="4px">
            <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
            <Text fontSize="11px" fontWeight="600" color="#6b7280">{s.time}</Text>
          </Flex>
        </Flex>

        <Flex gap="7px" onClick={e=>e.stopPropagation()}>
          <Button flex="1" size="xs" h="30px" borderRadius="8px"
            bg="#f8fafc" color="#374151" border="1px solid #e5e7eb"
            fontSize="11px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
            _hover={{ bg:"#f1f5f9" }} transition="all 0.15s"
            onClick={() => onView(s)}
          >Xem</Button>
          <Button flex="1" size="xs" h="30px" borderRadius="8px"
            bg="linear-gradient(135deg,#f97316,#fb923c)"
            color="white" fontSize="11px" fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity:0.88, transform:"translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s"
            onClick={() => onEdit(s)}
          >Sửa</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ShowtimeRow({ s, index, isSelected, onView, onEdit }) {
  return (
    <Flex
      align="center" p="13px 16px" borderRadius="12px"
      bg={isSelected?"#fff7ed":"white"}
      border={isSelected?"1.5px solid #f97316":"1.5px solid #f1f5f9"}
      transition="all 0.18s"
      _hover={{ border:"1.5px solid #fdba74", boxShadow:"0 3px 14px rgba(249,115,22,0.1)", bg:"#fffbf7" }}
      sx={{ animation:`${fadeUp} 0.35s ease ${index*0.045}s both` }}
      cursor="pointer" onClick={() => onView(s)}
      gap="0"
    >
      {/* num */}
      <Box w="36px" flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color="#d1d5db">
          {String(index+1).padStart(2,"0")}
        </Text>
      </Box>

      {/* icon */}
      <Box w="36px" h="36px" borderRadius="10px"
        bg="linear-gradient(135deg,#fff7ed,#ffe4c8)"
        border="1px solid #fed7aa"
        display="flex" alignItems="center" justifyContent="center"
        flexShrink="0" mr="12px"
      >
        <Icon as={BsCameraReelsFill} boxSize="13px" color="#f97316" />
      </Box>

      {/* movie + room */}
      <Box flex="2.5" minW="0" pr="12px">
        <Text fontSize="13.5px" fontWeight="700" color="#111827" noOfLines={1}>{s.movie}</Text>
        <Flex align="center" gap="4px" mt="1px">
          <Icon as={MdMeetingRoom} boxSize="10px" color="#f97316" />
          <Text fontSize="11px" color="#9ca3af" fontWeight="500">{s.room}</Text>
        </Flex>
      </Box>

      {/* date + time – hidden on small */}
      <Box flex="1" minW="0" pr="12px" display={{ base:"none", md:"block" }}>
        <Flex align="center" gap="5px" mb="2px">
          <Icon as={MdCalendarToday} boxSize="10px" color="#f97316" />
          <Text fontSize="12px" fontWeight="600" color="#4b5563">{s.date}</Text>
        </Flex>
        <Flex align="center" gap="5px">
          <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
          <Text fontSize="12px" fontWeight="600" color="#4b5563">{s.time}</Text>
        </Flex>
      </Box>

      {/* status */}
      <Box flex="1" minW="0" pr="12px" display={{ base:"none", sm:"block" }}>
        <StatusPill status={s.status} size="sm" />
      </Box>

      {/* actions */}
      <Flex gap="6px" flexShrink="0" onClick={e=>e.stopPropagation()}>
        <Button size="xs" h="30px" px="9px" borderRadius="8px"
          bg="#f8fafc" color="#374151" border="1px solid #e5e7eb"
          fontSize="11px" fontWeight="600"
          leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
          _hover={{ bg:"#f1f5f9" }} transition="all 0.15s"
          onClick={() => onView(s)}
          display={{ base:"none", md:"flex" }}
        >Xem</Button>
        <Button size="xs" h="30px" px="9px" borderRadius="8px"
          bg="linear-gradient(135deg,#f97316,#fb923c)"
          color="white" fontSize="11px" fontWeight="700"
          leftIcon={<Icon as={MdEdit} boxSize="11px" />}
          _hover={{ opacity:0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.28)"
          transition="all 0.15s"
          onClick={() => onEdit(s)}
        >Sửa</Button>
      </Flex>
    </Flex>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ selected, onEdit, onClose }) {
  if (!selected) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" py="60px" px="24px">
        <Box w="72px" h="72px" borderRadius="20px"
          bg="linear-gradient(135deg,#fff7ed,#ffe4c8)"
          border="2px dashed #fdba74"
          display="flex" alignItems="center" justifyContent="center" mb="16px"
        >
          <Icon as={MdEventSeat} boxSize="28px" color="#fdba74" />
        </Box>
        <Text fontSize="14px" fontWeight="700" color="#9ca3af" textAlign="center">
          Chọn suất chiếu
        </Text>
        <Text fontSize="12px" color="#d1d5db" textAlign="center" mt="4px">
          để xem thông tin chi tiết
        </Text>
      </Flex>
    );
  }

  return (
    <Box p="20px" sx={{ animation:`${fadeIn} 0.22s ease both` }}>
      {/* close btn mobile */}
      <Flex justify="flex-end" mb="12px" display={{ base:"flex", xl:"none" }}>
        <Box w="28px" h="28px" borderRadius="8px" cursor="pointer"
          bg="#f3f4f6" display="flex" alignItems="center" justifyContent="center"
          _hover={{ bg:"#e5e7eb" }} onClick={onClose}
        >
          <Icon as={MdClose} boxSize="14px" color="#6b7280" />
        </Box>
      </Flex>

      {/* Poster-style movie banner */}
      <Box borderRadius="14px" overflow="hidden" mb="16px"
        bg="linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)"
        p="20px 18px" position="relative"
      >
        {/* decoration */}
        <Box position="absolute" top="-20px" right="-20px" w="100px" h="100px"
          borderRadius="full" bg="rgba(249,115,22,0.08)" />
        <Box position="absolute" bottom="-30px" left="-20px" w="80px" h="80px"
          borderRadius="full" bg="rgba(99,102,241,0.07)" />

        <Flex align="center" gap="8px" mb="12px">
          <Box w="30px" h="30px" borderRadius="9px"
            bg="linear-gradient(135deg,#f97316,#fb923c)"
            display="flex" alignItems="center" justifyContent="center"
            boxShadow="0 4px 12px rgba(249,115,22,0.4)"
          >
            <Icon as={BsCameraReelsFill} boxSize="13px" color="white" />
          </Box>
          <Text fontSize="9.5px" fontWeight="800" color="rgba(249,115,22,0.9)" letterSpacing="2px" textTransform="uppercase">
            Suất chiếu
          </Text>
        </Flex>
        <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.4" noOfLines={3}>
          {selected.movie}
        </Text>
        <Box mt="12px">
          <StatusPill status={selected.status} size="sm" />
        </Box>
      </Box>

      {/* Info list */}
      {[
        { icon: MdMeetingRoom,    label: "Phòng chiếu", val: selected.room },
        { icon: MdCalendarToday,  label: "Ngày chiếu",  val: selected.date },
        { icon: MdAccessTime,     label: "Giờ bắt đầu", val: selected.time },
      ].map(({ icon: Ic, label, val }) => (
        <Flex key={label} align="center" gap="12px" p="10px 12px" mb="6px"
          borderRadius="10px" bg="#f9fafb" border="1px solid #f1f5f9"
          transition="all 0.15s" _hover={{ bg:"#fff7ed", borderColor:"#fed7aa" }}
        >
          <Box w="32px" h="32px" borderRadius="9px" bg="white"
            border="1px solid #e5e7eb" display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={Ic} boxSize="13px" color="#f97316" />
          </Box>
          <Box>
            <Text fontSize="9.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase">
              {label}
            </Text>
            <Text fontSize="13px" fontWeight="700" color="#111827">{val}</Text>
          </Box>
        </Flex>
      ))}

      {/* Notes/permission area from spec */}
      <Box mt="14px" p="12px 14px" borderRadius="11px"
        bg="linear-gradient(135deg,#fffbeb,#fff7ed)"
        border="1.5px solid #fed7aa"
      >
        <Text fontSize="9.5px" fontWeight="800" color="#92400e" letterSpacing="1px" textTransform="uppercase" mb="6px">
          Thông tin thêm
        </Text>
        <Flex gap="8px" wrap="wrap">
          <Tag size="sm" bg="#fed7aa" color="#92400e" fontWeight="700" borderRadius="6px">
            <Icon as={MdEventSeat} mr="4px" boxSize="10px" /> Xem sơ đồ ghế
          </Tag>
          <Tag size="sm" bg="#d1fae5" color="#065f46" fontWeight="700" borderRadius="6px">
            <Icon as={HiOutlineTicket} mr="4px" boxSize="10px" /> Kiểm tra vé
          </Tag>
        </Flex>
      </Box>

      <Button
        w="100%" h="40px" mt="14px" borderRadius="11px" fontSize="13px" fontWeight="700"
        bg="linear-gradient(135deg,#f97316,#fb923c)"
        color="white" boxShadow="0 4px 16px rgba(249,115,22,0.32)"
        _hover={{ boxShadow:"0 6px 22px rgba(249,115,22,0.42)", transform:"translateY(-1px)" }}
        _active={{ transform:"translateY(0)" }} transition="all 0.2s"
        leftIcon={<Icon as={MdEdit} />}
        onClick={() => onEdit(selected)}
      >Chỉnh sửa suất chiếu</Button>
    </Box>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Flex direction="column" align="center" justify="center" py="60px" color="#d1d5db">
      <Box w="64px" h="64px" borderRadius="18px" bg="#f9fafb"
        border="2px dashed #e5e7eb"
        display="flex" alignItems="center" justifyContent="center" mb="14px"
      >
        <Icon as={MdMovie} boxSize="28px" />
      </Box>
      <Text fontSize="14px" fontWeight="700" color="#9ca3af">Không tìm thấy suất chiếu</Text>
      <Text fontSize="12px" mt="4px" color="#d1d5db">Thử thay đổi bộ lọc hoặc thêm mới</Text>
    </Flex>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const DEFAULT_SHOWTIMES = [
  { id:1, movie:"Avengers: Infinity War",                      room:"Phòng 1", date:"2026-05-24", time:"18:00", status:"Đang chiếu" },
  { id:2, movie:"Spider-Man: No Way Home",                     room:"Phòng 2", date:"2026-05-24", time:"20:30", status:"Sắp chiếu"  },
  { id:3, movie:"Doctor Strange in the Multiverse of Madness", room:"Phòng 3", date:"2026-05-25", time:"14:00", status:"Sắp chiếu"  },
  { id:4, movie:"Thor: Love and Thunder",                      room:"Phòng 1", date:"2026-05-22", time:"16:00", status:"Đã kết thúc"},
  { id:5, movie:"Black Panther: Wakanda Forever",              room:"Phòng 2", date:"2026-05-23", time:"19:00", status:"Đang chiếu" },
  { id:6, movie:"Ant-Man and the Wasp: Quantumania",          room:"Phòng 4", date:"2026-05-21", time:"15:30", status:"Đã kết thúc"},
];

export default function Quanlysuatchieu() {
  const addDisclosure  = useDisclosure();
  const editDisclosure = useDisclosure();

  const [selected,    setSelected]  = useState(null);
  const [editing,     setEditing]   = useState(null);
  const [search,      setSearch]    = useState("");
  const [filterStatus, setFilter]   = useState("Tất cả");
  const [viewMode,    setViewMode]  = useState("list");
  const [showtimes,   setShowtimes] = useState(DEFAULT_SHOWTIMES);
  const [showDetail,  setShowDetail]= useState(false);

  const [newShowtime, setNewShowtime] = useState({ movie:"", room:"", date:"", time:"", status:"Sắp chiếu" });

  const filtered = showtimes.filter(s => {
    const q = search.toLowerCase();
    const matchQ = s.movie.toLowerCase().includes(q) || s.room.toLowerCase().includes(q);
    const matchF = filterStatus === "Tất cả" || s.status === filterStatus;
    return matchQ && matchF;
  });

  const openAdd = () => {
    setNewShowtime({ movie:"", room:"", date:"", time:"", status:"Sắp chiếu" });
    addDisclosure.onOpen();
  };

  const openEdit = useCallback((s) => {
    setEditing({ ...s });
    editDisclosure.onOpen();
  }, [editDisclosure]);

  const handleAdd = useCallback(() => {
    setShowtimes(prev => [{ id: Date.now(), ...newShowtime }, ...prev]);
    setNewShowtime({ movie:"", room:"", date:"", time:"", status:"Sắp chiếu" });
    addDisclosure.onClose();
  }, [newShowtime, addDisclosure]);

  const handleUpdate = useCallback(() => {
    setShowtimes(prev => prev.map(s => s.id === editing.id ? editing : s));
    if (selected?.id === editing.id) setSelected(editing);
    editDisclosure.onClose();
  }, [editing, selected, editDisclosure]);

  const handleView = (s) => {
    setSelected(s);
    setShowDetail(true);
  };

  const counts = {
    total:    showtimes.length,
    playing:  showtimes.filter(s=>s.status==="Đang chiếu").length,
    upcoming: showtimes.filter(s=>s.status==="Sắp chiếu").length,
    ended:    showtimes.filter(s=>s.status==="Đã kết thúc").length,
  };

  return (
    <Box pt={{ base:"100px", md:"80px" }} pb="40px" px={{ base:"12px", md:"0" }}>

      {/* ─── Page header ──────────────────────────────────── */}
      <Flex justify="space-between" align={{ base:"start", sm:"center" }}
        direction={{ base:"column", sm:"row" }} mb="24px" gap="14px"
      >
        <Box sx={{ animation:`${fadeUp} 0.38s ease both` }}>
          <Flex align="center" gap="12px" mb="3px">
            <Box w="40px" h="40px" borderRadius="13px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.38)"
              sx={{ animation:`${glow} 3s ease infinite` }}
            >
              <Icon as={BsCameraReelsFill} boxSize="17px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base:"20px", md:"24px" }} fontWeight="900" color="#111827" letterSpacing="-0.5px">
                Quản lý suất chiếu
              </Text>
              <Text fontSize="12px" color="#9ca3af" fontWeight="500">
                Hệ thống Gấu Phim — Back-office Staff
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap="10px" sx={{ animation:`${fadeIn} 0.4s ease 0.1s both` }}>
          {/* View toggle */}
          <Flex borderRadius="10px" border="1.5px solid #e5e7eb" overflow="hidden" bg="#f9fafb">
            {[
              { v:"list", ic: BsListUl },
              { v:"grid", ic: BsGridFill },
            ].map(({ v, ic }) => (
              <Box key={v} w="36px" h="36px" display="flex" alignItems="center" justifyContent="center"
                cursor="pointer"
                bg={viewMode===v?"linear-gradient(135deg,#f97316,#fb923c)":"transparent"}
                transition="all 0.15s"
                onClick={() => setViewMode(v)}
              >
                <Icon as={ic} boxSize="14px" color={viewMode===v?"white":"#9ca3af"} />
              </Box>
            ))}
          </Flex>

          <Button
            leftIcon={<Icon as={MdAdd} />}
            h="38px" px="18px"
            bg="linear-gradient(135deg,#f97316,#fb923c)"
            color="white" borderRadius="10px" fontWeight="700" fontSize="13px"
            boxShadow="0 4px 14px rgba(249,115,22,0.35)"
            _hover={{ boxShadow:"0 6px 22px rgba(249,115,22,0.45)", transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.18s"
            onClick={openAdd}
          >
            <Box display={{ base:"none", sm:"block" }}>Thêm suất chiếu</Box>
            <Box display={{ base:"block", sm:"none" }}>Thêm</Box>
          </Button>
        </Flex>
      </Flex>

      {/* ─── Stats row ────────────────────────────────────── */}
      <SimpleGrid columns={{ base:2, md:4 }} spacing={{ base:"10px", md:"14px" }} mb="22px">
        <StatCard label="Tổng suất"    value={counts.total}    icon={FaTicketAlt}  accent="#f97316" sub="tất cả lịch"    delay={0}    />
        <StatCard label="Đang chiếu"   value={counts.playing}  icon={MdPlayCircle} accent="#10b981" sub="live ngay"      delay={0.05} />
        <StatCard label="Sắp chiếu"    value={counts.upcoming} icon={MdTimer}      accent="#f59e0b" sub="sắp bắt đầu"   delay={0.10} />
        <StatCard label="Đã kết thúc"  value={counts.ended}    icon={MdDone}       accent="#6b7280" sub="đã hoàn thành" delay={0.15} />
      </SimpleGrid>

      {/* ─── Main layout ─────────────────────────────────── */}
      <Grid
        templateColumns={{ base:"1fr", xl: showDetail ? "1fr 300px" : "1fr" }}
        gap={{ base:"16px", xl:"20px" }}
      >

        {/* ── Left: list / grid ── */}
        <Box>
          <Box bg="white" borderRadius="18px" border="1px solid #f1f5f9"
            boxShadow="0 1px 6px rgba(0,0,0,0.04)"
            sx={{ animation:`${fadeUp} 0.4s ease 0.12s both` }}
            overflow="hidden"
          >
            {/* toolbar */}
            <Flex align="center" justify="space-between" px={{ base:"14px", md:"20px" }}
              py="14px" borderBottom="1px solid #f9fafb"
              bg="linear-gradient(180deg,#fffbf7 0%,#fff 100%)"
              wrap="wrap" gap="10px"
            >
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize="14px" color="#111827">Danh sách</Text>
                <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                  <Text fontSize="11px" fontWeight="800" color="#f97316">{filtered.length} suất</Text>
                </Box>
              </Flex>

              <Flex gap="8px" align="center" flex={{ base:"1 0 100%", sm:"0 0 auto" }}>
                {/* search */}
                <Box position="relative" flex={{ base:"1", sm:"0 0 auto" }}>
                  <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                    transform="translateY(-50%)" boxSize="13px" color="#9ca3af" zIndex="1"
                  />
                  <Input
                    pl="30px" h="34px" w={{ base:"100%", sm:"190px" }}
                    fontSize="12.5px" placeholder="Tìm phim, phòng..."
                    bg="#f9fafb" border="1px solid #e5e7eb" borderRadius="9px"
                    color="#374151"
                    _placeholder={{ color:"#b0bac8" }}
                    _focus={{ border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.08)", bg:"#fff" }}
                    _hover={{ border:"1px solid #fdba74" }}
                    transition="all 0.18s"
                    value={search} onChange={e=>setSearch(e.target.value)}
                  />
                </Box>

                {/* filter */}
                <Select
                  h="34px" fontSize="12px" fontWeight="600" color="#374151"
                  bg="#f9fafb" border="1px solid #e5e7eb" borderRadius="9px"
                  w={{ base:"130px", sm:"140px" }}
                  _focus={{ border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.08)" }}
                  _hover={{ border:"1px solid #fdba74" }}
                  transition="all 0.18s"
                  value={filterStatus} onChange={e=>setFilter(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang chiếu">Đang chiếu</option>
                  <option value="Sắp chiếu">Sắp chiếu</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                </Select>
              </Flex>
            </Flex>

            {/* column headers (list only, desktop) */}
            {viewMode === "list" && (
              <Flex px="16px" py="9px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
                display={{ base:"none", md:"flex" }}
              >
                <Box w="36px" flexShrink="0"><Text fontSize="9.5px" fontWeight="800" color="#d1d5db" letterSpacing="1px">#</Text></Box>
                <Box w="48px" flexShrink="0" mr="12px" />
                <Box flex="2.5"><Text fontSize="9.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase">Phim / Phòng</Text></Box>
                <Box flex="1"><Text fontSize="9.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase">Lịch chiếu</Text></Box>
                <Box flex="1"><Text fontSize="9.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase">Trạng thái</Text></Box>
                <Box w="120px" flexShrink="0" textAlign="right"><Text fontSize="9.5px" fontWeight="800" color="#9ca3af" letterSpacing="1px" textTransform="uppercase">Hành động</Text></Box>
              </Flex>
            )}

            {/* content */}
            <Box p={{ base:"10px", md:"12px" }}>
              {filtered.length === 0 ? (
                <EmptyState />
              ) : viewMode === "list" ? (
                <Flex direction="column" gap="6px">
                  {filtered.map((s,i) => (
                    <ShowtimeRow key={s.id} s={s} index={i}
                      isSelected={selected?.id===s.id}
                      onView={handleView} onEdit={openEdit}
                    />
                  ))}
                </Flex>
              ) : (
                <SimpleGrid columns={{ base:1, sm:2, lg:3 }} spacing="10px">
                  {filtered.map((s,i) => (
                    <ShowtimeCard key={s.id} s={s} index={i}
                      isSelected={selected?.id===s.id}
                      onView={handleView} onEdit={openEdit}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Box>

            {/* footer */}
            <Flex align="center" justify="space-between" px={{ base:"14px", md:"20px" }}
              py="12px" borderTop="1px solid #f9fafb" bg="#fafbfc"
            >
              <Text fontSize="11.5px" color="#9ca3af" fontWeight="500">
                Hiển thị <Text as="span" fontWeight="700" color="#374151">{filtered.length}</Text> / {showtimes.length} suất chiếu
              </Text>
              <Flex gap="6px" align="center">
                <Text fontSize="11px" color="#d1d5db">Trang 1 / 1</Text>
                <Flex>
                  {[MdKeyboardArrowLeft, MdChevronRight].map((Ic, i) => (
                    <Box key={i} w="26px" h="26px" borderRadius="7px" display="flex"
                      alignItems="center" justifyContent="center" cursor="pointer"
                      color="#9ca3af" border="1px solid #e5e7eb" bg="#f9fafb"
                      _hover={{ bg:"#f1f5f9" }} mx="2px"
                    >
                      <Icon as={Ic} boxSize="14px" />
                    </Box>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* ── Right: detail panel ── */}
        {showDetail && (
          <Box
            bg="white" borderRadius="18px" border="1px solid #f1f5f9"
            boxShadow="0 1px 6px rgba(0,0,0,0.04)"
            overflow="hidden"
            sx={{ animation:`${slideLeft} 0.3s ease both` }}
            h="fit-content"
          >
            <Flex align="center" justify="space-between" px="18px" py="14px"
              borderBottom="1px solid #f9fafb"
              bg="linear-gradient(135deg,#fff7ed 0%,#fff 60%)"
            >
              <Flex align="center" gap="8px">
                <Text fontWeight="800" fontSize="13.5px" color="#111827">Chi tiết</Text>
                {selected && (
                  <Box px="7px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                    <Text fontSize="10px" fontWeight="800" color="#f97316">Showtime</Text>
                  </Box>
                )}
              </Flex>
              <Box
                w="26px" h="26px" borderRadius="7px" cursor="pointer"
                bg="#f3f4f6" display="flex" alignItems="center" justifyContent="center"
                _hover={{ bg:"#fee2e2", color:"#ef4444" }} transition="all 0.15s"
                onClick={() => { setShowDetail(false); setSelected(null); }}
              >
                <Icon as={MdClose} boxSize="13px" color="#6b7280" />
              </Box>
            </Flex>
            <DetailPanel selected={selected} onEdit={openEdit}
              onClose={() => { setShowDetail(false); setSelected(null); }}
            />
          </Box>
        )}
      </Grid>

      {/* ─── Quyền hạn note (từ spec) ───────────────────── */}
      <Box mt="20px" p="14px 18px" borderRadius="13px"
        bg="linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)"
        border="1.5px solid #fed7aa"
        sx={{ animation:`${fadeUp} 0.4s ease 0.3s both` }}
      >
        <Flex align="flex-start" gap="10px" wrap={{ base:"wrap", md:"nowrap" }}>
          <Box w="28px" h="28px" borderRadius="8px" bg="linear-gradient(135deg,#f97316,#fb923c)"
            display="flex" alignItems="center" justifyContent="center" flexShrink="0"
            boxShadow="0 3px 8px rgba(249,115,22,0.3)"
          >
            <Icon as={MdStar} boxSize="13px" color="white" />
          </Box>
          <Box>
            <Text fontSize="11px" fontWeight="800" color="#92400e" letterSpacing="0.5px" mb="5px">
              PHÂN QUYỀN — BACK-OFFICE STAFF
            </Text>
            <Flex gap="8px" wrap="wrap">
              {[
                { l:"✅ Tạo suất chiếu", c:"#d1fae5", t:"#065f46" },
                { l:"✅ Sửa suất chiếu", c:"#d1fae5", t:"#065f46" },
                { l:"✅ Hủy suất chưa có vé", c:"#d1fae5", t:"#065f46" },
                { l:"❌ Xóa suất đã có vé", c:"#fee2e2", t:"#991b1b" },
                { l:"✅ Nhân bản lịch tuần", c:"#d1fae5", t:"#065f46" },
                { l:"❌ Check-in vé", c:"#fee2e2", t:"#991b1b" },
              ].map(({ l, c, t }) => (
                <Tag key={l} size="sm" bg={c} color={t} fontWeight="700" borderRadius="6px" fontSize="11px">
                  {l}
                </Tag>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>

      <AddModal
        isOpen={addDisclosure.isOpen} onClose={addDisclosure.onClose}
        value={newShowtime} onChange={setNewShowtime} onAdd={handleAdd}
      />
      <EditModal
        isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose}
        value={editing} onChange={setEditing} onSave={handleUpdate}
      />
    </Box>
  );
}