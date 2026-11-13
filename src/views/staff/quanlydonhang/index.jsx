import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Flex, Text, Badge, Button, Input, InputGroup, InputLeftElement,
  Select, useColorModeValue, useDisclosure, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Divider, SimpleGrid, HStack, VStack, Tabs, TabList, Tab,
  useToast, Avatar, Skeleton, Icon, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  MdSearch, MdRefresh, MdReceipt, MdAttachMoney, MdCheckCircle,
  MdUndo, MdVisibility, MdPerson, MdMovie, MdEventSeat, MdAccessTime,
  MdLocationOn, MdLocalActivity, MdFileDownload, MdOutlineChair,
} from "react-icons/md";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const ORDERS_RAW = [
  { id: "GPF-2026001", customer: "Nguyễn Văn An", phone: "0901234567", email: "an.nguyen@email.com", movie: "Avengers: Infinity War", cinema: "Gấu Phim Hà Nội", room: "IMAX 1", showtime: "2026-05-24 19:00", seats: ["F7","F8","F9"], combo: "Combo Đôi", total: 487000, payMethod: "Ví MoMo", status: "Đã thanh toán", createdAt: "2026-05-24 14:22", isNew: true },
  { id: "GPF-2026002", customer: "Trần Thị Bích", phone: "0912345678", email: "bich.tran@email.com", movie: "Spider-Man: No Way Home", cinema: "Gấu Phim TP.HCM", room: "3D Hall B", showtime: "2026-05-24 20:30", seats: ["A3","A4"], combo: "Không có", total: 190000, payMethod: "ZaloPay", status: "Chờ thanh toán", createdAt: "2026-05-24 15:05", isNew: true },
  { id: "GPF-2026003", customer: "Lê Hồng Minh", phone: "0923456789", email: "minh.le@email.com", movie: "Black Panther: Wakanda", cinema: "Gấu Phim Hà Nội", room: "IMAX 2", showtime: "2026-05-23 14:30", seats: ["D12","D13","D14","D15"], combo: "Combo Gia Đình", total: 980000, payMethod: "Thẻ ngân hàng", status: "Đã check-in", createdAt: "2026-05-23 10:15", isNew: false },
  { id: "GPF-2026004", customer: "Phạm Quốc Hùng", phone: "0934567890", email: "hung.pham@email.com", movie: "Doctor Strange: Multiverse", cinema: "Gấu Phim Đà Nẵng", room: "3D Hall 01", showtime: "2026-05-22 16:00", seats: ["B5"], combo: "Bắp cỡ lớn", total: 175000, payMethod: "Tiền mặt", status: "Đã hủy", createdAt: "2026-05-22 09:30", isNew: false },
  { id: "GPF-2026005", customer: "Ngô Thị Thu", phone: "0945678901", email: "thu.ngo@email.com", movie: "Thor: Love and Thunder", cinema: "Gấu Phim TP.HCM", room: "2D Phòng C", showtime: "2026-05-21 10:00", seats: ["G1","G2"], combo: "Pepsi x2", total: 250000, payMethod: "VNPay", status: "Hoàn tiền", createdAt: "2026-05-21 08:00", isNew: false, refundReason: "Khách bị ốm không đi được" },
  { id: "GPF-2026006", customer: "Vũ Đình Long", phone: "0956789012", email: "long.vu@email.com", movie: "Avengers: Infinity War", cinema: "Gấu Phim Hà Nội", room: "IMAX 1", showtime: "2026-05-24 22:00", seats: ["H10","H11","H12"], combo: "Combo Nhóm", total: 1250000, payMethod: "Ví MoMo", status: "Đã thanh toán", createdAt: "2026-05-24 16:40", isNew: true },
];

const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "đ");
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function QuanLyDonHangNhanVien() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [orders, setOrders] = useState(ORDERS_RAW);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [tabIndex, setTabIndex] = useState(0);

  // ─── COLORS (Lấy chuẩn từ ảnh Admin) ───
  const brandOrange = useColorModeValue("orange.500", "orange.400");
  const bgCard = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "secondaryGray.400");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  
  // Màu cho Table Row giống Admin (Nền tối hơn bgCard, viền sáng nhẹ)
  const rowBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const rowBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.1)");
  const inputBg = useColorModeValue("gray.50", "navy.700");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.movie.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filterStatus === "Tất cả" || o.status === filterStatus;

      let matchTab = true;
      if (tabIndex === 1) matchTab = o.isNew;
      else if (tabIndex === 2) matchTab = o.status === "Chờ thanh toán";
      else if (tabIndex === 3) matchTab = o.status === "Hoàn tiền";

      return matchSearch && matchStatus && matchTab;
    });
  }, [orders, searchTerm, filterStatus, tabIndex]);

  const totalRevenue = orders.reduce((sum, o) => (o.status === "Đã thanh toán" || o.status === "Đã check-in" ? sum + o.total : sum), 0);
  const paidCount = orders.filter((o) => o.status === "Đã thanh toán" || o.status === "Đã check-in").length;
  const refundCount = orders.filter((o) => o.status === "Hoàn tiền").length;

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const renderStatusBadge = (status) => {
    let config = { bg: "gray.100", color: "gray.600", text: status, dot: "gray.400" };
    if (status === "Đã thanh toán" || status === "Success") config = { bg: "green.50", color: "green.600", text: "Đã thanh toán", dot: "green.500" };
    else if (status === "Chờ thanh toán") config = { bg: "orange.50", color: "orange.600", text: "Chờ thanh toán", dot: "orange.500" };
    else if (status === "Đã hủy") config = { bg: "red.50", color: "red.600", text: "Đã hủy", dot: "red.500" };
    else if (status === "Hoàn tiền") config = { bg: "purple.50", color: "purple.600", text: "Hoàn tiền", dot: "purple.500" };
    else if (status === "Đã check-in") config = { bg: "teal.50", color: "teal.600", text: "Đã check-in", dot: "teal.500" };

    return (
      <Badge bg={config.bg} color={config.color} px="10px" py="4px" borderRadius="6px" fontSize="xs" fontWeight="700" textTransform="none">
        <Flex align="center" gap={1.5}>
          <Box w="6px" h="6px" borderRadius="full" bg={config.dot} />
          {config.text}
        </Flex>
      </Badge>
    );
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: 4, md: 8 }} pb="20" overflowX="hidden" w="100%" bg={useColorModeValue("gray.50", "navy.900")} minH="100vh">
      
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb="24px" flexWrap="wrap" gap={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color={textColor} display="flex" alignItems="center" gap={2}>
            <Icon as={MdReceipt} color={brandOrange} boxSize={6} /> Quản lý Đơn hàng
          </Text>
          <Text fontSize="sm" color={textColorSecondary} mt="1">Theo dõi, tra cứu & xử lý đơn đặt vé</Text>
        </Box>
        <HStack spacing={3}>
          <Button leftIcon={<MdRefresh />} variant="outline" colorScheme="orange" size="md" borderRadius="10px" onClick={() => toast({ title: "Đã làm mới", status: "info" })}>Làm mới</Button>
          <Button leftIcon={<MdFileDownload />} colorScheme="orange" size="md" borderRadius="10px" onClick={() => toast({ title: "Đang xuất...", status: "success" })}>Xuất Excel</Button>
        </HStack>
      </Flex>

      {/* STATS CARDS */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="24px">
        <StatCard label="Tổng đơn hàng" value={orders.length} icon={MdReceipt} color="orange" isLoading={isLoading} subText={`${orders.filter((o) => o.isNew).length} đơn mới`} />
        <StatCard label="Tổng doanh thu" value={formatCurrency(totalRevenue)} icon={MdAttachMoney} color="green" isLoading={isLoading} />
        <StatCard label="Chờ hoàn tiền" value={refundCount} icon={MdUndo} color="purple" isLoading={isLoading} />
        <StatCard label="Đã thanh toán" value={paidCount} icon={MdCheckCircle} color="orange" isLoading={isLoading} />
      </SimpleGrid>

      {/* MAIN CONTENT */}
      <Box bg={bgCard} borderRadius="16px" boxShadow="sm" border="1px solid" borderColor={borderColor} overflow="hidden">
        
        {/* Toolbar */}
        <Box px="24px" pt="24px" pb="16px">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={3}>
              <Text fontSize="lg" fontWeight="800" color={textColor}>Danh sách đơn hàng</Text>
              <Badge bg="orange.50" color="orange.600" borderRadius="6px" px="8px" py="2px" fontSize="xs" fontWeight="600">{filteredOrders.length} đơn</Badge>
              <Badge bg="green.50" color="green.600" borderRadius="6px" px="8px" py="2px" fontSize="xs" fontWeight="600">
                <Flex align="center" gap={1.5}><Box w="6px" h="6px" borderRadius="full" bg="green.500" />Realtime</Flex>
              </Badge>
            </HStack>

            <HStack spacing={3}>
              <InputGroup maxW={{ base: "100%", md: "240px" }} size="sm">
                <InputLeftElement pointerEvents="none"><Icon as={MdSearch} color="gray.400" /></InputLeftElement>
                <Input placeholder="Tìm mã đơn, khách, SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} borderRadius="8px" bg={inputBg} border="1px solid transparent" _focus={{ borderColor: "orange.500", boxShadow: "none", bg: "white" }} />
              </InputGroup>
              <Select maxW={{ base: "100%", md: "160px" }} size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} borderRadius="8px" bg={inputBg} border="1px solid transparent" color={textColorSecondary} fontWeight="600" _focus={{ borderColor: "orange.500", boxShadow: "none", bg: "white" }}>
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Chờ thanh toán">Chờ thanh toán</option>
                <option value="Đã hủy">Đã hủy</option>
                <option value="Hoàn tiền">Hoàn tiền</option>
                <option value="Đã check-in">Đã check-in</option>
              </Select>
            </HStack>
          </Flex>
        </Box>

        {/* Tabs */}
        <Box px="24px" borderBottom="1px solid" borderColor={borderColor}>
          <Tabs variant="unstyled" index={tabIndex} onChange={setTabIndex}>
            <TabList gap={6}>
              <Tab px="0" py="12px" fontWeight="700" fontSize="sm" color={textColorSecondary} _selected={{ color: "orange.500", borderBottom: "2px solid", borderColor: "orange.500" }}>Tất cả</Tab>
              <Tab px="0" py="12px" fontWeight="700" fontSize="sm" color={textColorSecondary} _selected={{ color: "orange.500", borderBottom: "2px solid", borderColor: "orange.500" }}>Mới <Badge ml="2" bg="orange.50" color="orange.600" borderRadius="full" fontSize="2xs" px="6px">{orders.filter((o) => o.isNew).length}</Badge></Tab>
              <Tab px="0" py="12px" fontWeight="700" fontSize="sm" color={textColorSecondary} _selected={{ color: "orange.500", borderBottom: "2px solid", borderColor: "orange.500" }}>Chờ thanh toán</Tab>
              <Tab px="0" py="12px" fontWeight="700" fontSize="sm" color={textColorSecondary} _selected={{ color: "orange.500", borderBottom: "2px solid", borderColor: "orange.500" }}>Hoàn tiền</Tab>
            </TabList>
          </Tabs>
        </Box>

        {/* BẢNG DỮ LIỆU (DẠNG CARD TÁCH RỜI) */}
        <TableContainer p="12px 24px 24px 24px">
          <Table variant="unstyled" size="md" borderCollapse="separate" borderSpacing="0 8px">
            <Thead>
              <Tr>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4" pl="16px">#</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Khách hàng / Phim</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Rạp / Phòng</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Suất chiếu</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Tổng tiền</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Thanh toán</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4">Trạng thái</Th>
                <Th color="gray.400" fontSize="xs" textTransform="uppercase" letterSpacing="wider" py="4" textAlign="center" pr="16px">Hành động</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Tr key={i} bg={rowBg} borderRadius="12px" border="1px solid" borderColor={rowBorder}>
                    <Td borderLeftRadius="12px" border="none" pl="16px"><Skeleton height="20px" w="20px" /></Td>
                    <Td border="none"><VStack align="start" spacing={2}><Skeleton height="16px" w="120px" /><Skeleton height="12px" w="80px" /></VStack></Td>
                    <Td border="none"><Skeleton height="20px" w="100px" /></Td>
                    <Td border="none"><Skeleton height="20px" w="80px" /></Td>
                    <Td border="none"><Skeleton height="20px" w="60px" /></Td>
                    <Td border="none"><Skeleton height="24px" w="80px" borderRadius="md" /></Td>
                    <Td border="none"><Skeleton height="24px" w="100px" borderRadius="md" /></Td>
                    <Td borderRightRadius="12px" border="none" textAlign="center" pr="16px"><Skeleton height="24px" w="60px" borderRadius="md" mx="auto" /></Td>
                  </Tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={8} textAlign="center" py="10">
                    <Icon as={MdSearch} fontSize="40px" color="gray.300" mx="auto" mb="2" />
                    <Text fontWeight="600" color={textColorSecondary}>Không tìm thấy đơn hàng nào</Text>
                  </Td>
                </Tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <Tr key={order.id} bg={rowBg} borderRadius="12px" border="1px solid" borderColor={rowBorder} _hover={{ bg: useColorModeValue("gray.50", "rgba(255,255,255,0.06)"), transform: "translateY(-1px)", boxShadow: "sm" }} transition="all 0.2s" cursor="pointer" onClick={() => handleViewDetail(order)}>
                    
                    <Td borderLeftRadius="12px" border="none" color="gray.400" fontSize="sm" fontWeight="600" pl="16px">{String(index + 1).padStart(2, "0")}</Td>
                    
                    <Td border="none" py="16px">
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          {order.isNew && <Badge colorScheme="orange" borderRadius="4px" px="6px" py="1px" fontSize="2xs" fontWeight="800">MỚI</Badge>}
                          <Text fontWeight="700" fontSize="sm" color={textColor}>{order.customer}</Text>
                        </HStack>
                        <Text fontSize="xs" color={textColorSecondary} fontWeight="600">{order.movie}</Text>
                      </VStack>
                    </Td>
                    
                    <Td border="none">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="600" color={textColor} noOfLines={1}>{order.cinema}</Text>
                        <Text fontSize="xs" color={textColorSecondary}>Phòng {order.room}</Text>
                        <HStack spacing={1} fontSize="xs" color="orange.500" fontWeight="600"><Icon as={MdOutlineChair} /> {order.seats.join(", ")}</HStack>
                      </VStack>
                    </Td>
                    
                    <Td border="none">
                      <Text fontSize="sm" fontWeight="600" color={textColor}>{formatDate(order.showtime).split(" ")[1]}</Text>
                      <Text fontSize="xs" color={textColorSecondary}>{formatDate(order.showtime).split(" ")[0]}</Text>
                    </Td>
                    
                    <Td border="none"><Text fontSize="sm" fontWeight="800" color={textColor}>{formatCurrency(order.total)}</Text></Td>
                    
                    <Td border="none">
                      <Badge bg="green.50" color="green.600" borderRadius="6px" px="8px" py="2px" fontSize="xs" fontWeight="600">
                        <Flex align="center" gap={1}><Icon as={MdCheckCircle} fontSize="12px" /> Success</Flex>
                      </Badge>
                    </Td>
                    
                    <Td border="none">{renderStatusBadge(order.status)}</Td>
                    
                    <Td borderRightRadius="12px" border="none" textAlign="center" pr="16px">
                      <Button size="sm" variant="outline" leftIcon={<MdVisibility />} borderRadius="8px" borderColor={rowBorder} color={textColorSecondary} fontWeight="600" bg="transparent" _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.200") }} onClick={(e) => { e.stopPropagation(); handleViewDetail(order); }}>
                        Xem
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Flex justify="space-between" align="center" px="24px" py="20px" borderTop="1px solid" borderColor={borderColor} flexWrap="wrap" gap={2}>
          <Text fontSize="sm" color={textColorSecondary}>Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng</Text>
          <HStack>
            <Button size="sm" variant="outline" colorScheme="orange" isDisabled>Trước</Button>
            <Button size="sm" variant="solid" colorScheme="orange">1</Button>
            <Button size="sm" variant="outline" colorScheme="orange">Sau</Button>
          </HStack>
        </Flex>
      </Box>

      {/* DRAWER CHI TIẾT */}
      <Drawer isOpen={isOpen} onClose={onClose} size="md" placement="right">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={bgCard}>
          <DrawerCloseButton mt="8px" />
          {selectedOrder && (
            <>
              <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pt="24px" pb="16px">
                <Flex align="center" gap={3}>
                  <Box p="10px" bg="orange.50" borderRadius="12px" color="orange.500"><Icon as={MdReceipt} fontSize="24px" /></Box>
                  <Box>
                    <Text fontSize="lg" fontWeight="800" color={textColor}>Chi tiết đơn hàng</Text>
                    <Text fontSize="sm" color="orange.500" fontWeight="700">{selectedOrder.id}</Text>
                  </Box>
                </Flex>
              </DrawerHeader>
              <DrawerBody py="24px">
                <VStack spacing={6} align="stretch">
                  <Flex justify="space-between" align="center" p="16px" bg="orange.50" borderRadius="16px">
                    <Box>
                      <Text fontSize="xs" color={textColorSecondary} fontWeight="700" textTransform="uppercase" mb="1">Trạng thái</Text>
                      {renderStatusBadge(selectedOrder.status)}
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="xs" color={textColorSecondary} fontWeight="700" textTransform="uppercase" mb="1">Ngày đặt</Text>
                      <Text fontSize="sm" fontWeight="700" color={textColor}>{formatDate(selectedOrder.createdAt)}</Text>
                    </Box>
                  </Flex>
                  <Box>
                    <Text fontSize="sm" fontWeight="800" color={textColor} mb="3" display="flex" alignItems="center" gap={2}><Icon as={MdMovie} color="orange.500" /> Thông tin phim</Text>
                    <Box p="16px" border="1px solid" borderColor={borderColor} borderRadius="16px">
                      <Text fontSize="md" fontWeight="800" color={textColor} mb="4">{selectedOrder.movie}</Text>
                      <SimpleGrid columns={2} gap={4}>
                        <InfoRow icon={MdLocationOn} label="Rạp" value={selectedOrder.cinema} />
                        <InfoRow icon={MdLocalActivity} label="Phòng" value={selectedOrder.room} />
                        <InfoRow icon={MdAccessTime} label="Suất chiếu" value={formatDate(selectedOrder.showtime)} />
                        <InfoRow icon={MdEventSeat} label="Ghế ngồi" value={selectedOrder.seats.join(", ")} />
                      </SimpleGrid>
                    </Box>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="800" color={textColor} mb="3" display="flex" alignItems="center" gap={2}><Icon as={MdPerson} color="orange.500" /> Thông tin khách hàng</Text>
                    <Box p="16px" border="1px solid" borderColor={borderColor} borderRadius="16px">
                      <Flex align="center" gap={4} mb="4">
                        <Avatar size="md" name={selectedOrder.customer} bg="orange.100" color="orange.600" />
                        <Box>
                          <Text fontSize="md" fontWeight="700" color={textColor}>{selectedOrder.customer}</Text>
                          <Text fontSize="sm" color={textColorSecondary}>{selectedOrder.phone}</Text>
                        </Box>
                      </Flex>
                      <Text fontSize="sm" color={textColorSecondary}>{selectedOrder.email}</Text>
                    </Box>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="800" color={textColor} mb="3" display="flex" alignItems="center" gap={2}><Icon as={MdAttachMoney} color="orange.500" /> Thanh toán</Text>
                    <Box p="16px" border="1px solid" borderColor={borderColor} borderRadius="16px">
                      <Flex justify="space-between" mb="3"><Text fontSize="sm" color={textColorSecondary}>Phương thức</Text><Text fontSize="sm" fontWeight="600" color={textColor}>{selectedOrder.payMethod}</Text></Flex>
                      <Flex justify="space-between" mb="3"><Text fontSize="sm" color={textColorSecondary}>Combo</Text><Text fontSize="sm" fontWeight="600" color={textColor}>{selectedOrder.combo}</Text></Flex>
                      <Divider my="3" borderColor={borderColor} />
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="800" color={textColor}>Tổng cộng</Text>
                        <Text fontSize="xl" fontWeight="900" color="orange.500">{formatCurrency(selectedOrder.total)}</Text>
                      </Flex>
                    </Box>
                  </Box>
                  <HStack spacing={3} pt="4">
                    <Button flex="1" colorScheme="orange" size="lg" borderRadius="12px">In vé</Button>
                  </HStack>
                </VStack>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

// ─── SUB COMPONENTS ────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, isLoading, subText }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "secondaryGray.400");
  const bgCard = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  
  const colorMap = { 
    orange: { bg: useColorModeValue("orange.50", "rgba(249,115,22,0.2)"), text: "orange.500" }, 
    green: { bg: useColorModeValue("green.50", "rgba(16,185,129,0.2)"), text: "green.500" }, 
    purple: { bg: useColorModeValue("purple.50", "rgba(168,85,247,0.2)"), text: "purple.500" }, 
    blue: { bg: useColorModeValue("blue.50", "rgba(59,130,246,0.2)"), text: "blue.500" } 
  };
  const themeColor = colorMap[color] || colorMap.orange;

  return (
    <Box bg={bgCard} p="20px" borderRadius="16px" boxShadow="sm" border="1px solid" borderColor={borderColor}>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="xs" fontWeight="700" color={textColorSecondary} textTransform="uppercase" letterSpacing="wide">{label}</Text>
          {isLoading ? <Skeleton height="36px" w="80px" mt="2" /> : <Text fontSize="3xl" fontWeight="900" color={textColor} mt="1">{value}</Text>}
          {subText && <Text fontSize="xs" fontWeight="600" color={textColorSecondary} mt="1">{subText}</Text>}
        </Box>
        <Box p="12px" borderRadius="12px" bg={themeColor.bg} color={themeColor.text}>
          <Icon as={icon} fontSize="24px" />
        </Box>
      </Flex>
    </Box>
  );
}

function InfoRow({ icon, label, value }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "secondaryGray.400");
  return (
    <Box>
      <Text fontSize="xs" color={textColorSecondary} fontWeight="600" mb="1" display="flex" alignItems="center" gap={1}>
        <Icon as={icon} /> {label}
      </Text>
      <Text fontSize="sm" fontWeight="700" color={textColor}>{value}</Text>
    </Box>
  );
}